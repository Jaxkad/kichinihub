import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import manifest from "../src/lib/workspace-manifest.ts";

test("installed workspace starts at login and excludes public menu URLs", () => {
  const app = manifest();
  assert.equal(app.start_url, "/admin");
  assert.equal(app.id, "/admin");
  assert.equal(app.scope, "/admin");
  assert.equal(app.display, "standalone");
  for (const path of ["/", "/menu/starters", "/api/admin/menu"]) assert.equal(path.startsWith(app.scope), false);
  assert.ok(app.icons.some(icon => icon.sizes === "192x192"));
  assert.ok(app.icons.some(icon => icon.sizes === "512x512" && icon.purpose === "maskable"));
});
function worker(fetcher) {
  const listeners = {};
  vm.runInNewContext(readFileSync(new URL("../public/admin/sw.js", import.meta.url), "utf8"), {
    self: { location: { origin: "https://example.com" }, addEventListener: (name, fn) => { listeners[name] = fn; } },
    fetch: fetcher, URL, Response,
  });
  return listeners.fetch;
}
test("worker does not intercept public menus, APIs, resources, or writes", () => {
  const handle = worker(() => { throw new Error("Must not fetch"); });
  for (const [path, method, mode] of [
    ["/", "GET", "navigate"], ["/menu/starters", "GET", "navigate"],
    ["/api/admin/menu", "POST", "cors"], ["/admin", "POST", "navigate"],
    ["/admin/icons/icon-192.png", "GET", "no-cors"], ["/administrator", "GET", "navigate"],
  ]) {
    handle({ request: { url: "https://example.com" + path, method, mode }, respondWith: () => assert.fail("Must not intercept") });
  }
});
test("workspace navigation uses the network and returns a safe offline page on failure", async () => {
  for (const online of [true, false]) {
    let response;
    const handle = worker(async () => {
      if (!online) throw new Error("offline");
      return new Response("login", {status:200});
    });
    handle({ request: { url: "https://example.com/admin", method: "GET", mode: "navigate" }, respondWith: p => { response = p; } });
    const result = await response;
    assert.equal(result.status, online ? 200 : 503);
    if (!online) {
      assert.equal(result.headers.get("cache-control"), "no-store");
      assert.match(await result.text(), /You’re offline/);
    } else assert.equal(await result.text(), "login");
  }
});
