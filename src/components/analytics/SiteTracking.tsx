"use client";
import { useEffect, useSyncExternalStore } from "react";
import { track, flush, trackingAllowed, resetTracking } from "@/lib/tracking";
function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("kh-consent", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("kh-consent", callback);
  };
}
function readChoice() {
  try {
    return localStorage.getItem("kh-analytics");
  } catch {
    return "no";
  }
}
export function SiteTracking() {
  const choice = useSyncExternalStore(subscribe, readChoice, () => "pending");
  const setChoice = (value: string | null) => {
    try {
      if (value === null) localStorage.removeItem("kh-analytics");
      else localStorage.setItem("kh-analytics", value);
    } catch {}
    window.dispatchEvent(new Event("kh-consent"));
  };
  useEffect(() => {
    if (choice !== "yes" || !trackingAllowed()) return;
    track("page_view", "home", "Public menu", true);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            track(
              el.dataset.metric!,
              el.dataset.metricId!,
              el.dataset.metricLabel!,
              true,
            );
          }
      },
      { threshold: 0, rootMargin: "-20% 0px -20% 0px" },
    );
    const watch = () =>
      document
        .querySelectorAll<HTMLElement>("[data-metric]")
        .forEach((el) => observer.observe(el));
    watch();
    const mutation = new MutationObserver(watch);
    mutation.observe(document.querySelector("main")!, {
      childList: true,
      subtree: true,
    });
    const click = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest<HTMLElement>("[data-track]");
      if (el)
        track(
          el.dataset.track!,
          el.dataset.trackId || "unknown",
          el.dataset.trackLabel || el.textContent || "",
        );
    };
    const hide = () => {
      if (document.visibilityState === "hidden") flush();
    };
    document.addEventListener("click", click);
    document.addEventListener("visibilitychange", hide);
    window.addEventListener("pagehide", flush);
    return () => {
      observer.disconnect();
      mutation.disconnect();
      document.removeEventListener("click", click);
      document.removeEventListener("visibilitychange", hide);
      window.removeEventListener("pagehide", flush);
      flush();
    };
  }, [choice]);
  const choose = (value: string) => {
    try {
      localStorage.setItem("kh-analytics", value);
    } catch {}
    if (value === "no") resetTracking();
    setChoice(value);
  };
  return (
    <div className="kh-privacy">
      {choice === null ? (
        <div
          className="kh-consent"
          role="region"
          aria-label="Analytics preference"
        >
          <div>
            <b>Help us make the Hub better.</b>
            <p>
              Allow anonymous page views and clicks to help us understand
              popular dishes and events? We don’t record names, contact details,
              or search text.
            </p>
          </div>
          <button onClick={() => choose("no")}>No thanks</button>
          <button onClick={() => choose("yes")}>Allow analytics</button>
        </div>
      ) : (
        <button className="kh-privacy-link" onClick={() => setChoice(null)}>
          Analytics preferences
        </button>
      )}
    </div>
  );
}
