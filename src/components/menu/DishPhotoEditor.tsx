"use client";
import Image from "next/image";
import { useState } from "react";
import { mediaTypes, mediaType } from "@/lib/media";
import { uploadMedia } from "@/lib/upload-media";
type Photo = { url: string; alt: string };
export function DishPhotoEditor({
  photo,
  name,
  onChange,
  onBusy,
}: {
  photo?: Photo | null;
  name: string;
  onChange: (photo: Photo | null) => void;
  onBusy: (busy: boolean) => void;
}) {
  const [uploading, setUploading] = useState(false),
    [progress, setProgress] = useState(""),
    [error, setError] = useState("");
  return (
    <fieldset className="dish-photo-editor">
      <legend>
        Dish photo <span>Optional</span>
      </legend>
      <p>
        Add a photo when you have one. Dishes without photos keep their clean
        text layout. Use a clear, centred shot of the actual dish.
      </p>
      {photo && (
        <div className="dish-photo-preview">
          <Image
            unoptimized
            src={photo.url}
            alt={photo.alt}
            width={140}
            height={140}
          />
          <div>
            <label>
              Photo description
              <input
                required
                maxLength={200}
                value={photo.alt}
                disabled={uploading}
                onChange={(e) => onChange({ ...photo, alt: e.target.value })}
              />
            </label>
            <button
              type="button"
              disabled={uploading}
              onClick={() => onChange(null)}
            >
              Remove photo
            </button>
          </div>
        </div>
      )}
      <label className="dish-photo-upload">
        {photo ? "Replace photo" : "Add photo"}
        <input
          type="file"
          disabled={uploading}
          accept={Object.entries(mediaTypes)
            .filter(([, mime]) => mime.startsWith("image/"))
            .map(([ext]) => "." + ext)
            .join(",")}
          onChange={async (e) => {
            const file = e.target.files?.[0];
            e.target.value = "";
            if (!file) return;
            setError("");
            if (!mediaType(file.name)?.startsWith("image/")) {
              setError("Please choose a photo rather than a video.");
              return;
            }
            setUploading(true);
            onBusy(true);
            try {
              const result = await uploadMedia(file, setProgress);
              onChange({ url: result.url, alt: name.trim() || "Dish photo" });
            } catch (err) {
              setError(
                err instanceof Error
                  ? err.message
                  : "We could not upload your photo. Please try again.",
              );
            } finally {
              setUploading(false);
              onBusy(false);
            }
          }}
        />
      </label>
      <small>
        Up to 25 MB. Includes JPG, PNG, WebP, HEIC and HEIF. The photo goes on
        the menu when you publish your changes.
      </small>
      {uploading && <p role="status">{progress}</p>}
      {error && (
        <p role="alert" className="photo-error">
          {error}
        </p>
      )}
    </fieldset>
  );
}
