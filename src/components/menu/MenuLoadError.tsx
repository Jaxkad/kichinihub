"use client";
import { useTransition } from "react";
import { RefreshCw } from "lucide-react";
import { MenuHeader } from "./MenuHeader";
import { MenuLink } from "./MenuLink";
import "@/app/menu.css";

export function MenuLoadError({ retry }: { retry: () => void }) {
  const [pending, startTransition] = useTransition();
  return (
    <div className="kh-menu">
      <MenuHeader detail />
      <main className="kh-menu-error" aria-busy={pending}>
        <span className="kh-error-icon" aria-hidden="true"><RefreshCw size={28} /></span>
        <h1>Let’s try that again</h1>
        <p>The menu couldn’t load just now. Check your connection, then try again.</p>
        <button className="kh-button" disabled={pending} onClick={() => startTransition(retry)}>
          {pending ? "Trying again…" : "Try again"}
        </button>
        <MenuLink className="kh-menu-back" href="/#menu">← Back to all menus</MenuLink>
        <span className="sr-only" role="status">{pending ? "Loading the menu again…" : ""}</span>
      </main>
    </div>
  );
}
