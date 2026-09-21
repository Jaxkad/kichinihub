"use client";
import Image from "next/image";
import { useState } from "react";
import { mediaTypes, mediaType } from "@/lib/media";
import { uploadMedia } from "@/lib/upload-media";
type Photo = { url: string; alt: string };
export function DishPhotoEditor({
  photo,
  categoryCard = false,
  name,
  onChange,
  onBusy,
}: {
  photo?: Photo | null;
  categoryCard?: boolean;
  name: string;
  onChange: (photo: Photo | null) => void;
  onBusy: (busy: boolean) => void;
}) {
  const [uploading, setUploading] = useState(false),
    [progress, setProgress] = useState(""),
    [error, setError] = useState("");
  return (
    <fieldset className={`dish-photo-editor${categoryCard ? " category-image-editor" : ""}`} aria-busy={uploading}>
      <legend>
        {categoryCard ? "Menu card image" : "Dish photo"} <span>Optional</span>
      </legend>
      <p>
        {categoryCard
          ? "This image fills the whole card on the main menu, replacing its title and text. Include the category name in your artwork. Clicking anywhere on the card opens this category. The same image also fills the header on the category page."
          : "Add a photo when you have one. Dishes without photos keep their clean text layout. Use a clear, centred shot of the actual dish."}
      </p>
      {categoryCard && <p><strong>Recommended: 1200 × 600 pixels (2:1).</strong> Cards resize to fit the screen. Other shapes are cropped at the centre; keep words away from the edges.</p>}
      {photo && (
        <div className="dish-photo-preview">
          <Image
            unoptimized
            src={photo.url}
            alt={photo.alt}
            width={categoryCard ? 1200 : 140}
            height={categoryCard ? 600 : 140}
          />
          <div>
            <label>
              {categoryCard ? "Image description (for people using screen readers)" : "Photo description"}
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
              onClick={() => { onChange(null); setError(""); setProgress(categoryCard ? "Image removed. The original text card will return when you publish." : "Photo removed from your draft."); }}
            >
              {categoryCard ? "Remove image · use text card" : "Remove photo"}
            </button>
          </div>
        </div>
      )}
      <label className="dish-photo-upload">
        {categoryCard ? (photo ? "Change card image" : "Upload card image") : (photo ? "Replace photo" : "Add photo")}
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
            setProgress("");
            if (!mediaType(file.name)?.startsWith("image/")) {
              setError("Please choose a photo rather than a video.");
              return;
            }
            setUploading(true);
            onBusy(true);
            try {
              const result = await uploadMedia(file, setProgress);
              onChange({ url: result.url, alt: name.trim() || (categoryCard ? "Menu category" : "Dish photo") });
              setProgress("Upload complete. Check the preview, then save to draft and publish your changes.");
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
      <div role="status" aria-live="polite">
        {uploading && <progress aria-label="Image upload" max={100} value={progress.match(/(\d+)%/) ? Number(progress.match(/(\d+)%/)![1]) : undefined} />}
        {progress && !error && <p>{progress}</p>}
      </div>
      {error && (
        <p role="alert" className="photo-error">
          {error}
        </p>
      )}
    </fieldset>
  );
}
