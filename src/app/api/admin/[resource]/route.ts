import { NextRequest, NextResponse } from "next/server";
import { adminServices } from "@/lib/firebase-admin";
import { menuSchema, userSchema } from "@/lib/admin-schema";
import { menuData } from "@/data/menuData";
import { z } from "zod";
import { eventSchema } from "@/lib/events";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}
async function handle(
  req: NextRequest,
  context: { params: Promise<{ resource: string }> },
) {
  try {
    const { resource } = await context.params;
    if (!["menu", "users", "activity", "events", "insights"].includes(resource))
      throw new ApiError(404, "Not found.");
    const token = req.headers.get("authorization")?.match(/^Bearer (.+)$/)?.[1];
    if (!token) throw new ApiError(401, "Please sign in.");
    const { auth, db } = adminServices();
    let uid: string;
    try {
      uid = (await auth.verifyIdToken(token, true)).uid;
    } catch {
      throw new ApiError(401, "Your session expired. Sign in again.");
    }
    const actor = await auth.getUser(uid);
    const role = actor.customClaims?.role;
    if (actor.disabled || !["admin", "editor", "viewer"].includes(role))
      throw new ApiError(
        403,
        "An administrator must grant you console access.",
      );
    if (resource === "users" && role !== "admin")
      throw new ApiError(403, "Only administrators can manage users.");
    if (req.method !== "GET" && role === "viewer")
      throw new ApiError(403, "Your account has read-only access.");
    const ref = db.doc("menu/current");
    if (req.method === "GET") {
      if (resource === "insights") {
        const days = Math.min(
          30,
          Math.max(1, Number(req.nextUrl.searchParams.get("days")) || 7),
        );
        const results = await Promise.all(
          Array.from({ length: days }, (_, i) => {
            const d = new Date(Date.now() - i * 86400000);
            const day = new Intl.DateTimeFormat("en-CA", {
              timeZone: "Africa/Blantyre",
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            }).format(d);
            return db.collection(`analytics/${day}/metrics`).get();
          }),
        );
        return NextResponse.json(
          results.flatMap((r) => r.docs.map((d) => d.data())),
        );
      }
      if (resource === "events") {
        const events = await db.collection("events").get();
        return NextResponse.json(events.docs.map((d) => d.data()));
      }
      if (resource === "menu") {
        const snapshot = await ref.get();
        return NextResponse.json(
          snapshot.exists ? snapshot.data() : { ...menuData, revision: 0 },
        );
      }
      if (resource === "activity") {
        const result = await db
          .collection("activity")
          .orderBy("at", "desc")
          .limit(30)
          .get();
        return NextResponse.json(
          result.docs.map((d) => ({ id: d.id, ...d.data() })),
        );
      }
      const result = await auth.listUsers(
        100,
        req.nextUrl.searchParams.get("pageToken") || undefined,
      );
      return NextResponse.json({
        users: result.users.map((u) => ({
          uid: u.uid,
          email: u.email || "",
          displayName: u.displayName || "",
          disabled: u.disabled,
          role: u.customClaims?.role || "viewer",
          createdAt: u.metadata.creationTime,
          lastSignIn: u.metadata.lastSignInTime,
        })),
        pageToken: result.pageToken,
      });
    }
    const body = await req.json();
    if (resource === "events" && ["PUT", "DELETE"].includes(req.method)) {
      const data =
        req.method === "PUT"
          ? eventSchema.parse(body)
          : z
              .object({
                id: z.string().uuid(),
                revision: z.number().int().nonnegative(),
              })
              .parse(body);
      const eventRef = db.collection("events").doc(data.id);
      await db.runTransaction(async (tx) => {
        const previous = await tx.get(eventRef);
        if ((previous.data()?.revision || 0) !== data.revision)
          throw new ApiError(
            409,
            "This event changed in another session. Reload events before saving.",
          );
        if (req.method === "DELETE") tx.delete(eventRef);
        else tx.set(eventRef, { ...data, revision: data.revision + 1 });
        tx.set(db.collection("activity").doc(), {
          action:
            req.method === "DELETE"
              ? "Deleted an event"
              : "status" in data && data.status === "published"
                ? "Published an event"
                : "Saved an event draft",
          actor: actor.email || uid,
          at: new Date().toISOString(),
        });
      });
      return NextResponse.json({ ok: true });
    }
    if (resource === "menu" && req.method === "PUT") {
      const menu = menuSchema.parse(body);
      const revision = z.number().int().nonnegative().parse(body.revision);
      await db.runTransaction(async (tx) => {
        const previous = await tx.get(ref);
        if ((previous.data()?.revision || 0) !== revision)
          throw new ApiError(
            409,
            "The menu changed in another session. Reload before saving.",
          );
        tx.set(ref, {
          ...menu,
          revision: revision + 1,
          updatedAt: new Date().toISOString(),
        });
        tx.set(db.collection("activity").doc(), {
          action: "Published menu updates",
          actor: actor.email || uid,
          at: new Date().toISOString(),
        });
      });
      return NextResponse.json({ revision: revision + 1 });
    }
    if (resource === "users") {
      if (req.method === "DELETE") {
        const target = z.string().min(1).parse(body.uid);
        if (target === uid)
          throw new ApiError(400, "You cannot delete your own account.");
        await auth.deleteUser(target);
        return NextResponse.json({ ok: true });
      }
      if (req.method === "POST" || req.method === "PUT") {
        const data = userSchema.parse(body);
        if (data.uid === uid && (data.disabled || data.role !== "admin"))
          throw new ApiError(
            400,
            "You cannot remove your own administrator access.",
          );
        const updates = {
          email: data.email,
          displayName: data.displayName,
          disabled: data.disabled,
        };
        if (req.method === "POST") {
          if (!data.password)
            throw new ApiError(
              400,
              "A temporary password of at least 12 characters is required.",
            );
          const created = await auth.createUser({
            ...updates,
            password: data.password,
          });
          try {
            await auth.setCustomUserClaims(created.uid, { role: data.role });
          } catch (error) {
            await auth.deleteUser(created.uid);
            throw error;
          }
        } else {
          if (!data.uid) throw new ApiError(400, "Select a user.");
          const existing = await auth.getUser(data.uid);
          await auth.updateUser(data.uid, updates);
          await auth.setCustomUserClaims(data.uid, {
            ...existing.customClaims,
            role: data.role,
          });
          await auth.revokeRefreshTokens(data.uid);
        }
        return NextResponse.json({ ok: true });
      }
    }
    throw new ApiError(405, "Method not allowed.");
  } catch (error) {
    if (error instanceof ApiError)
      return NextResponse.json(
        { error: error.message },
        { status: error.status },
      );
    if (error instanceof z.ZodError)
      return NextResponse.json(
        { error: error.issues.map((i) => i.message).join(" ") },
        { status: 400 },
      );
    const code = (error as { code?: string }).code;
    if (code === "auth/email-already-exists")
      return NextResponse.json(
        { error: "This email already has an account." },
        { status: 409 },
      );
    console.error(
      "Admin request failed:",
      code || (error instanceof Error ? error.name : "Unknown"),
    );
    return NextResponse.json(
      {
        error:
          "The request could not be completed. Check the server’s Firebase credentials and permissions, then try again.",
      },
      { status: 503 },
    );
  }
}
export { handle as GET, handle as POST, handle as PUT, handle as DELETE };
