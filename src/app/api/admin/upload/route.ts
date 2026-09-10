import { NextRequest, NextResponse } from "next/server";
import { adminServices } from "@/lib/firebase-admin";
import { getStorage } from "firebase-admin/storage";
import { getApp } from "firebase-admin/app";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { IMAGE_LIMIT, VIDEO_LIMIT, uploadTypes } from "@/lib/media";
export const runtime = "nodejs";
export async function POST(req: NextRequest) {
  try {
    const { auth, db } = adminServices();
    let uid: string;
    try {
      uid = (
        await auth.verifyIdToken(
          req.headers.get("authorization")?.replace(/^Bearer /, "") || "",
          true,
        )
      ).uid;
    } catch {
      return NextResponse.json({ error: "Please sign in." }, { status: 401 });
    }
    const user = await auth.getUser(uid);
    if (user.disabled || !["admin", "editor"].includes(user.customClaims?.role))
      return NextResponse.json(
        { error: "Only administrators and editors can upload media." },
        { status: 403 },
      );
    const body = await req.json();
    const bucket = getStorage().bucket("kitchini-cf37a.firebasestorage.app");
    if (body.action === "start") {
      const data = z
        .object({
          type: z.string().refine((t) => uploadTypes.includes(t)),
          size: z.number().int().positive(),
        })
        .parse(body);
      if (
        data.size > (data.type.startsWith("video/") ? VIDEO_LIMIT : IMAGE_LIMIT)
      )
        return NextResponse.json(
          { error: "Media exceeds the upload size limit." },
          { status: 413 },
        );
      const day = new Date().toISOString().slice(0, 10);
      await db.runTransaction(async (tx) => {
        const ref = db.doc(`uploadQuota/${uid}_${day}`);
        const doc = await tx.get(ref);
        const count = doc.data()?.count || 0;
        if (count >= 100) throw new Error("Daily upload limit reached.");
        tx.set(ref, { count: count + 1 });
      });
      const id = randomUUID();
      const ext: Record<string, string> = {
        "image/jpeg": "jpg",
        "image/png": "png",
        "image/webp": "webp",
        "image/gif": "gif",
        "image/avif": "avif",
        "video/mp4": "mp4",
        "video/x-m4v": "m4v",
        "video/quicktime": "mov",
        "video/webm": "webm",
      };
      const path = `event-media/${id}.${ext[data.type]}`;
      const origin = req.headers.get("origin");
      const allowed = [
        "http://localhost:3000",
        "https://kichinihub-sage.vercel.app",
        "https://kichinihub-jacksonk-25pointscoms-projects.vercel.app",
      ];
      if (!origin || !allowed.includes(origin))
        return NextResponse.json(
          { error: "This site is not authorized to upload." },
          { status: 403 },
        );
      const access = await getApp().options.credential?.getAccessToken();
      if (!access?.access_token)
        throw new Error("Server credentials are not configured for uploads.");
      const initiated = await fetch(
        `https://storage.googleapis.com/upload/storage/v1/b/${bucket.name}/o?uploadType=resumable&name=${encodeURIComponent(path)}`,
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + access.access_token,
            "Content-Type": "application/json",
            "X-Upload-Content-Type": data.type,
            "X-Upload-Content-Length": String(data.size),
            Origin: origin,
          },
          body: JSON.stringify({
            contentType: data.type,
            cacheControl: "public,max-age=31536000,immutable",
          }),
        },
      );
      const uploadUrl = initiated.headers.get("location");
      if (!initiated.ok || !uploadUrl)
        throw new Error("Unable to initiate upload.");
      await db
        .doc(`mediaUploads/${id}`)
        .set({
          uid,
          path,
          type: data.type,
          size: data.size,
          createdAt: Date.now(),
        });
      return NextResponse.json({ id, uploadUrl });
    }
    if (body.action === "finish") {
      const id = z.string().uuid().parse(body.id);
      const ref = db.doc(`mediaUploads/${id}`);
      const doc = await ref.get();
      const data = doc.data();
      if (!data || data.uid !== uid || Date.now() - data.createdAt > 86400000)
        return NextResponse.json(
          { error: "Upload session expired." },
          { status: 400 },
        );
      const file = bucket.file(data.path);
      const [meta] = await file.getMetadata();
      if (Number(meta.size) !== data.size || meta.contentType !== data.type) {
        await file.delete();
        await ref.delete();
        return NextResponse.json(
          { error: "Upload did not match the approved file." },
          { status: 400 },
        );
      }
      const token = String(
        meta.metadata?.firebaseStorageDownloadTokens || randomUUID(),
      );
      await file.setMetadata({
        metadata: { firebaseStorageDownloadTokens: token },
      });
      await ref.delete();
      return NextResponse.json({
        url: `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(data.path)}?alt=media&token=${token}`,
      });
    }
    return NextResponse.json(
      { error: "Invalid upload action." },
      { status: 400 },
    );
  } catch (e) {
    return NextResponse.json(
      {
        error:
          e instanceof z.ZodError
            ? "Unsupported media or invalid upload request."
            : "Upload could not be completed. Check your connection and Storage configuration.",
      },
      { status: 400 },
    );
  }
}
