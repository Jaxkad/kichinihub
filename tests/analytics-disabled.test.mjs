import { test } from "node:test";
import assert from "node:assert/strict";
import { POST } from "../src/app/api/track/route.ts";

test("legacy analytics submissions are discarded without reading their payload", async () => {
  const request = { get body() { throw new Error("Analytics payload must not be read"); } };
  const response = await POST(request);
  assert.equal(response.status, 204);
  assert.equal(await response.text(), "");
});
