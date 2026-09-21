"use client";
import { useTransition } from "react";
import "@/app/menu.css";

export function MenuLoadError({ retry }: { retry: () => void }) {
  const [pending, startTransition] = useTransition();
  return (
    <main className="kh-menu kh-menu-loading">
      <h1>We couldn’t load the menu</h1>
      <p>Please check your connection and try again.</p>
      <button className="kh-button" disabled={pending} onClick={() => startTransition(retry)}>
        {pending ? "Trying again…" : "Try again"}
      </button>
    </main>
  );
}
