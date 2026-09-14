import type { Metadata, Viewport } from "next";
import { WorkspaceAppProvider } from "@/components/workspace/WorkspaceApp";
import "./workspace-app.css";

export const metadata: Metadata = {
  title: "Khichini Hub Workspace",
  description: "Sign in to manage the Khichini Hub menu and events.",
  manifest: "/admin/manifest.webmanifest",
  appleWebApp: { capable: true, title: "Khichini Staff", statusBarStyle: "default" },
  icons: { apple: "/admin/icons/apple-touch-icon.png" },
  robots: { index: false, follow: false },
};
export const viewport: Viewport = { themeColor: "#fbf7ee" };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <WorkspaceAppProvider>{children}</WorkspaceAppProvider>;
}
