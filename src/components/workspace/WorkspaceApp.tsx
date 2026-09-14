"use client";

import { createContext, useContext, useEffect, useState, useSyncExternalStore } from "react";
import { Download, Share2 } from "lucide-react";

interface InstallEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}
const InstallContext = createContext<{ event: InstallEvent | null; clear: () => void }>({ event: null, clear: () => {} });

export function WorkspaceAppProvider({ children }: { children: React.ReactNode }) {
  const [event, setEvent] = useState<InstallEvent | null>(null);
  useEffect(() => {
    const capture = (e: Event) => { e.preventDefault(); setEvent(e as InstallEvent); };
    const installed = () => setEvent(null);
    window.addEventListener("beforeinstallprompt", capture);
    window.addEventListener("appinstalled", installed);
    if ("serviceWorker" in navigator && window.isSecureContext) {
      navigator.serviceWorker.register("/admin/sw.js", { scope: "/admin", updateViaCache: "none" }).catch(() => {
        // Installation can still work without a worker; browser instructions remain available.
      });
    }
    return () => {
      window.removeEventListener("beforeinstallprompt", capture);
      window.removeEventListener("appinstalled", installed);
    };
  }, []);
  return <InstallContext.Provider value={{ event, clear: () => setEvent(null) }}>{children}</InstallContext.Provider>;
}
function subscribe(callback: () => void) {
  const query = window.matchMedia("(display-mode: standalone)");
  query.addEventListener("change", callback);
  window.addEventListener("appinstalled", callback);
  return () => { query.removeEventListener("change", callback); window.removeEventListener("appinstalled", callback); };
}
function deviceSnapshot() {
  if (window.matchMedia("(display-mode: standalone)").matches || (navigator as Navigator & { standalone?: boolean }).standalone) return "installed";
  return /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1) ? "ios" : "browser";
}

export function WorkspaceApp() {
  const { event, clear } = useContext(InstallContext);
  const device = useSyncExternalStore(subscribe, deviceSnapshot, () => "pending");
  const [help, setHelp] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [link, setLink] = useState("");
  const [installed, setInstalled] = useState(false);
  useEffect(() => {
    const done = () => setInstalled(true);
    window.addEventListener("appinstalled", done);
    return () => window.removeEventListener("appinstalled", done);
  }, []);
  async function install() {
    if (!event) { setHelp(!help); return; }
    setBusy(true);
    try {
      await event.prompt();
      const choice = await event.userChoice;
      if (choice.outcome === "accepted") { setInstalled(true); setMessage("Workspace installation accepted."); }
      else setMessage("Installation cancelled. You can add it later from your browser menu.");
    } catch {
      setHelp(true);
      setMessage("Use your browser menu to add the workspace.");
    } finally { clear(); setBusy(false); }
  }
  async function share() {
    const url = new URL("/admin", window.location.origin).href;
    setMessage("");
    if (navigator.share) {
      try { await navigator.share({ title: "Khichini Hub Workspace", text: "Open this link to sign in and add the workspace to your home screen.", url }); return; }
      catch (error) { if (error instanceof Error && error.name === "AbortError") return; }
    }
    try { await navigator.clipboard.writeText(url); setMessage("Workspace link copied. Share it with your team."); }
    catch { setLink(url); setMessage("Copy this link to share with your team."); }
  }
  const showInstall = device !== "pending" && device !== "installed" && !installed;
  return (
    <section className="workspace-app" aria-label="Workspace app">
      <h2>Keep the workspace handy</h2>
      <p>Add it to your home screen for quick access. Staff sign-in is still required.</p>
      <div className="workspace-app-actions">
        {showInstall && <button type="button" disabled={busy} onClick={() => void install()} aria-expanded={!event ? help : undefined} aria-controls={!event ? "workspace-install-help" : undefined}>
          <Download size={16} />{event ? "Install workspace" : "Add to home screen"}
        </button>}
        <button type="button" onClick={() => void share()}><Share2 size={16} />Share workspace link</button>
      </div>
      {showInstall && help && <div id="workspace-install-help" className="workspace-install-help">
        {device === "ios" ? <p>Open this page in Safari. Tap Share, then “Add to Home Screen”. If shown, turn on “Open as Web App”, then tap Add.</p> : <p>Open this page in Chrome or Edge. In the browser menu, choose “Install app” or “Add to Home screen”. If you opened the link inside a messaging app, open it in your browser first.</p>}
        <small>An internet connection is needed to manage the workspace.</small>
      </div>}
      <p role="status" className="workspace-app-status">{message}</p>
      {link && <label>Workspace link<input readOnly value={link} onFocus={(e) => e.currentTarget.select()} /></label>}
    </section>
  );
}
