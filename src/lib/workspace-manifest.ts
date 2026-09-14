import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/admin",
    name: "Khichini Hub Workspace",
    short_name: "Khichini Staff",
    description: "Staff workspace for managing the Khichini Hub menu and events.",
    start_url: "/admin",
    scope: "/admin",
    display: "standalone",
    background_color: "#fbf7ee",
    theme_color: "#fbf7ee",
    lang: "en",
    icons: [
      { src: "/admin/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/admin/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/admin/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
