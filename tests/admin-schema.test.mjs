import { test } from "node:test";
import assert from "node:assert/strict";
import { menuSchema, userSchema } from "../src/lib/admin-schema.ts";
import { menuData } from "../src/data/menuData.ts";

test("existing menu passes publication validation", () =>
  assert.equal(menuSchema.safeParse(menuData).success, true));
test("negative and non-finite prices cannot be published", () => {
  for (const price of [-1, Infinity, NaN]) {
    const menu = structuredClone(menuData);
    menu.sections[0].items[0].price = price;
    assert.equal(menuSchema.safeParse(menu).success, false);
  }
});
test("duplicate IDs cannot corrupt item editing", () => {
  const menu = structuredClone(menuData);
  menu.sections[1].items[0].id = menu.sections[0].items[0].id;
  assert.equal(menuSchema.safeParse(menu).success, false);
});
test("only defined roles are accepted", () =>
  assert.equal(
    userSchema.safeParse({
      displayName: "Test",
      email: "test@example.com",
      role: "owner",
    }).success,
    false,
  ));
test("weak temporary passwords are rejected", () =>
  assert.equal(
    userSchema.safeParse({
      displayName: "Test",
      email: "test@example.com",
      role: "editor",
      password: "short",
    }).success,
    false,
  ));
