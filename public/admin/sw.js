/* Workspace only, network only: never cache authenticated pages, API responses,
   credentials, or edits. Public-menu requests are left to the browser. */
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin ||
      !(url.pathname === "/admin" || url.pathname.startsWith("/admin/")) ||
      event.request.method !== "GET" || event.request.mode !== "navigate") return;
  event.respondWith(fetch(event.request).catch(() => new Response(
    '<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Workspace offline</title><body style="margin:0;background:#fbf7ee;color:#292724;font:18px/1.6 system-ui"><main style="max-width:420px;margin:15vh auto;padding:24px"><h1>You’re offline</h1><p>Connect to the internet to open your workspace and manage the menu.</p><a href="/admin" style="color:#672c28">Try again</a></main></body></html>',
    { status: 503, headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } }
  )));
});
