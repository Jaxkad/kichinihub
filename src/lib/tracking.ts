"use client";
type Metric = { kind: string; id: string; label: string };
let queue: Metric[] = [];
let sent = new Set<string>();
let timer: ReturnType<typeof setTimeout> | undefined;
export function trackingAllowed() {
  try {
    return (
      localStorage.getItem("kh-analytics") === "yes" &&
      navigator.doNotTrack !== "1"
    );
  } catch {
    return false;
  }
}
export function track(kind: string, id: string, label: string, once = false) {
  if (!trackingAllowed()) return;
  const key = kind + ":" + id;
  if (once && sent.has(key)) return;
  sent.add(key);
  queue.push({ kind, id, label: label.slice(0, 120) });
  if (!timer) timer = setTimeout(flush, 1500);
}
export function resetTracking() {
  queue = [];
  sent = new Set();
  if (timer) clearTimeout(timer);
  timer = undefined;
}
export function flush() {
  if (timer) clearTimeout(timer);
  timer = undefined;
  if (!trackingAllowed()) {
    queue = [];
    return;
  }
  const events = queue.splice(0, 30);
  if (events.length)
    void fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ events }),
      keepalive: true,
    }).catch(() => {});
  if (queue.length) timer = setTimeout(flush, 1500);
}
