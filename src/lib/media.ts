export const IMAGE_LIMIT = 25 * 1024 * 1024;
export const VIDEO_LIMIT = 250 * 1024 * 1024;
export const mediaTypes: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  avif: "image/avif",
  heic: "image/heic",
  heif: "image/heif",
  tif: "image/tiff",
  tiff: "image/tiff",
  bmp: "image/bmp",
  svg: "image/svg+xml",
  mp4: "video/mp4",
  m4v: "video/x-m4v",
  mov: "video/quicktime",
  webm: "video/webm",
};
export const MEDIA_ACCEPT = Object.keys(mediaTypes)
  .map((ext) => "." + ext)
  .join(",");
export function mediaType(name: string) {
  return mediaTypes[name.split(".").pop()?.toLowerCase() || ""];
}
export const uploadTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
  "video/mp4",
  "video/x-m4v",
  "video/quicktime",
  "video/webm",
];
