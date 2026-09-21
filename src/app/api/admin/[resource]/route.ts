import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { PUBLISHED_MENU_TAG } from "@/lib/published-menu-data";
import { adminServices } from "@/lib/firebase-admin";
import { menuSchema, userSchema } from "@/lib/admin-schema";
import { menuData } from "@/data/menuData";
import { z } from "zod";
import { validationFeedback } from "@/lib/feedback";
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
    if (!["menu", "users", "activity", "events"].includes(resource))
      throw new ApiError(404, "Page not found.");
    const token = req.headers.get("authorization")?.match(/^Bearer (.+)$/)?.[1];
    if (!token) throw new ApiError(401, "Please sign in to continue.");
    const { auth, db } = adminServices();
    let uid: string;
    try {
      uid = (await auth.verifyIdToken(token, true)).uid;
    } catch {
      throw new ApiError(401, "Please sign in again to continue.");
    }
    const actor = await auth.getUser(uid);
    const role = actor.customClaims?.role;
    if (actor.disabled || !["admin", "editor", "viewer"].includes(role))
      throw new ApiError(
        403,
        "You need administrator permission to access this area.",
      );
    if (resource === "users" && role !== "admin")
      throw new ApiError(403, "Only administrators can manage team members.");
    if (req.method !== "GET" && role === "viewer")
      throw new ApiError(403, "Your account can only view information, not make changes.");
    const ref = db.doc("menu/current");
    if (req.method === "GET") {
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
            "This event was updated by someone else. Please refresh and try again.",
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
            "The menu was updated by someone else. Please refresh and try again.",
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
      // Expire only after the transaction succeeds. Route Handlers cannot use
      // updateTag; expire: 0 prevents serving old prices on the next request.
      revalidateTag(PUBLISHED_MENU_TAG, { expire: 0 });
      revalidatePath("/");
      revalidatePath("/menu/[category]", "page");
      return NextResponse.json({ revision: revision + 1 });
    }
    if (resource === "users") {
      if (req.method === "DELETE") {
        const target = z.string().min(1).parse(body.uid);
        if (target === uid)
          throw new ApiError(400, "You cannot remove your own account.");
        await auth.deleteUser(target);
        return NextResponse.json({ ok: true });
      }
      if (req.method === "POST" || req.method === "PUT") {
        const data = userSchema.parse(body);
        if (data.uid === uid && (data.disabled || data.role !== "admin"))
          throw new ApiError(
            400,
            "You cannot change your own administrator permissions.",
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
              "Please create a password with at least 12 characters.",
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
          if (!data.uid) throw new ApiError(400, "Please select a team member to update.");
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
    throw new ApiError(405, "That action isn’t available here. Please refresh the page and try again.");
  } catch (error) {
    if (error instanceof ApiError)
      return NextResponse.json(
        { error: error.message },
        { status: error.status },
      );
    if (error instanceof z.ZodError)
      return NextResponse.json(
        { error: validationFeedback(error.issues) },
        { status: 400 },
      );
    const code = (error as { code?: string }).code;
    // Translate Firebase error codes to human-friendly messages
    const firebaseErrorMessages: Record<string, string> = {
      'auth/email-already-exists': 'This email address is already in use by another team member.',
      'auth/invalid-email': 'Please enter a valid email address.',
      'auth/weak-password': 'Password is too weak. Please use a stronger password with at least 12 characters.',
      'auth/invalid-credential': 'Invalid email or password.',
      'auth/user-not-found': 'We could not find an account with that email address.',
      'auth/wrong-password': 'Incorrect password.',
      'auth/user-disabled': 'This account has been disabled.',
      'auth/too-many-requests': 'Too many attempts. Please try again later.',
      'auth/network-request-failed': 'Network error. Please check your internet connection.',
      'auth/operation-not-allowed': 'This operation is not allowed.',
      'auth/email-already-in-use': 'This email is already in use.',
    };
    if (code && firebaseErrorMessages[code])
      return NextResponse.json(
        { error: firebaseErrorMessages[code] },
        { status: 400 },
      );
    console.error(
      "Admin request failed:",
      code || (error instanceof Error ? error.name : "Unknown"),
    );
    return NextResponse.json(
      {
        error:
          "We could not complete your request. Please try again or contact support if the problem continues.",
      },
      { status: 503 },
    );
  }
}
export { handle as GET, handle as POST, handle as PUT, handle as DELETE };
