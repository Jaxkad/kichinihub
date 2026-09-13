"use client";
import { auth } from "@/lib/firebase";
import { IMAGE_LIMIT, VIDEO_LIMIT, mediaType } from "@/lib/media";
async function normalize(
  file: File,
): Promise<{ blob: Blob; type: string; kind: "image" | "video" }> {
  let type = mediaType(file.name);
  if (!type)
    throw new Error(
      "This file type is not supported. Please choose a photo or video in a common format like JPG, PNG, or MP4.",
    );
  const kind = type.startsWith("video/") ? "video" : "image";
  if (file.size > (kind === "video" ? VIDEO_LIMIT : IMAGE_LIMIT))
    throw new Error(
      kind === "video"
        ? "This video is too large. Please choose a video under 250 MB."
        : "This photo is too large. Please choose a photo under 25 MB.",
    );
  if (kind === "video") return { blob: file, type, kind };
  let blob: Blob = file;
  if (["image/heic", "image/heif"].includes(type)) {
    const { heicTo } = await import("heic-to");
    blob = await heicTo({ blob: file, type: "image/jpeg", quality: 0.9 });
    type = "image/jpeg";
  }
  if (type === "image/tiff") {
    const UTIF = await import("utif");
    const bytes = await file.arrayBuffer();
    const frames = UTIF.decode(bytes);
    if (!frames[0]) throw new Error("We could not read this TIFF file. Please try a different photo.");
    const frame = frames[0];
    const tags = frame as unknown as { t256?: number[]; t257?: number[] };
    const width = tags.t256?.[0],
      height = tags.t257?.[0];
    if (!width || !height || width * height > 40000000)
      throw new Error("This TIFF photo is too large. Please use a photo under 40 megapixels.");
    UTIF.decodeImage(bytes, frame);
    const canvas = document.createElement("canvas");
    canvas.width = frame.width;
    canvas.height = frame.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("We could not convert this photo. Please try a different format.");
    const data = ctx.createImageData(frame.width, frame.height);
    data.data.set(UTIF.toRGBA8(frame));
    ctx.putImageData(data, 0, 0);
    blob = await new Promise<Blob>((resolve, reject) =>
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error("We could not convert this TIFF photo. Please try a different format."))),
        "image/png",
      ),
    );
    type = "image/png";
  }
  // Preserve animated GIFs. Other photos are resized and rasterized for web display.
  if (type === "image/gif") return { blob, type, kind };
  const url = URL.createObjectURL(blob);
  try {
    const image = new window.Image();
    image.src = url;
    await image.decode();
    if (image.naturalWidth * image.naturalHeight > 40000000)
      throw new Error("This photo is too large. Please use a photo under 40 megapixels.");
    const ratio = Math.min(
      1,
      2400 / Math.max(image.naturalWidth, image.naturalHeight),
    );
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(image.naturalWidth * ratio));
    canvas.height = Math.max(1, Math.round(image.naturalHeight * ratio));
    canvas
      .getContext("2d")!
      .drawImage(image, 0, 0, canvas.width, canvas.height);
    blob = await new Promise<Blob>((resolve, reject) =>
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error("We could not convert this photo. Please try a different format."))),
        "image/webp",
        0.9,
      ),
    );
    return { blob, type: blob.type, kind };
  } finally {
    URL.revokeObjectURL(url);
  }
}
export async function uploadMedia(
  file: File,
  progress: (value: string) => void,
) {
  progress(`Preparing ${file.name}…`);
  const { blob, type, kind } = await normalize(file);
  const request = async (body: unknown) => {
    const r = await fetch("/api/admin/upload", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + (await auth.currentUser?.getIdToken()),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const d = await r.json();
    if (!r.ok) throw new Error(d.error);
    return d;
  };
  const session = await request({ action: "start", type, size: blob.size });
  // Upload in resumable 8 MiB chunks. A failed transfer probes Storage for its last committed byte.
  let offset = 0,
    retries = 0;
  while (offset < blob.size) {
    const end = Math.min(offset + 8 * 1024 * 1024, blob.size);
    try {
      const r = await fetch(session.uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": type,
          "Content-Range": `bytes ${offset}-${end - 1}/${blob.size}`,
        },
        body: blob.slice(offset, end),
      });
      if (r.status !== 308 && !r.ok)
        throw new Error("The upload could not be completed. Please try again.");
      offset = end;
      retries = 0;
      progress(
        `Uploading ${file.name}: ${Math.round((offset / blob.size) * 100)}%`,
      );
    } catch {
      if (++retries > 3)
        throw new Error("The upload was interrupted. Please check your internet and try again.");
      await new Promise((r) => setTimeout(r, 1000 * retries));
      const state = await fetch(session.uploadUrl, {
        method: "PUT",
        headers: { "Content-Range": `bytes */${blob.size}` },
      });
      if (state.ok) {
        offset = blob.size;
        break;
      }
      if (state.status !== 308)
        throw new Error("Your upload session has expired. Please try uploading again.");
      const last = state.headers.get("Range")?.match(/bytes=0-(\d+)/)?.[1];
      offset = last ? Number(last) + 1 : 0;
    }
  }
  progress(`Finishing ${file.name}…`);
  const result = await request({ action: "finish", id: session.id });
  return { url: result.url, kind, mimeType: type };
}
