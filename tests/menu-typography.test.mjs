import { test } from "node:test";
import assert from "node:assert/strict";
import { menuSchema } from "../src/lib/admin-schema.ts";
import { menuData } from "../src/data/menuData.ts";
import { defaultMenuTypography, menuFontIds, menuTypographyStyle } from "../src/lib/menu-typography.ts";

test("legacy menus retain original typography without a migration", () => {
  const parsed = menuSchema.parse(menuData);
  assert.equal(parsed.typography, undefined);
  assert.deepEqual(menuTypographyStyle(parsed.typography), menuTypographyStyle(defaultMenuTypography));
});
test("all ten fonts survive menu validation and serialization for each role", () => {
  assert.equal(menuFontIds.length, 10);
  for (const font of menuFontIds) {
    const typography = Object.fromEntries(Object.keys(defaultMenuTypography).map(role => [role, font]));
    const saved = JSON.parse(JSON.stringify(menuSchema.parse({ ...menuData, typography })));
    assert.deepEqual(saved.typography, typography);
    assert.equal(menuTypographyStyle(saved.typography)["--menu-itemName"], menuTypographyStyle(typography)["--menu-itemName"]);
  }
});
test("partial settings receive defaults and arbitrary CSS is rejected", () => {
  assert.deepEqual(menuSchema.parse({ ...menuData, typography: { categoryTitle: "barlow" } }).typography, { ...defaultMenuTypography, categoryTitle: "barlow" });
  for (const invalid of ["unknown-font", "url(https://example.com)", null, 42]) {
    assert.equal(menuSchema.safeParse({ ...menuData, typography: { itemName: invalid } }).success, false);
  }
});

test("appearance choices survive publishing without losing font choices", () => {
  const typography = { ...defaultMenuTypography, sizes: { categoryTitle: "large", price: "small" }, weights: { price: "regular" }, spacing: "spacious", headerAlign: "center" };
  const saved = menuSchema.parse(JSON.parse(JSON.stringify({ ...menuData, typography }))).typography;
  assert.deepEqual(saved, typography);
  const css = menuTypographyStyle(saved);
  assert.equal(css["--menu-price-size"], "1rem");
  assert.equal(css["--menu-price-weight"], 400);
  assert.equal(css["--menu-row-space"], "28px");
  assert.equal(css["--menu-header-align"], "center");
  assert.equal(css["--menu-itemName-weight"], 600);
});
test("invalid appearance settings cannot be published", () => {
  for (const change of [{ sizes: { price: "99px" } }, { weights: { itemName: 900 } }, { sizes: { unknown: "small" } }, { spacing: "negative" }, { headerAlign: "right" }]) {
    assert.equal(menuSchema.safeParse({ ...menuData, typography: { ...defaultMenuTypography, ...change } }).success, false);
  }
});
test("reset removes custom layout and text styling while restoring original fonts", () => {
  const custom = menuTypographyStyle({ ...defaultMenuTypography, spacing: "compact", headerAlign: "center", weights: { price: "regular" } });
  const reset = menuTypographyStyle(defaultMenuTypography);
  assert.notEqual(custom["--menu-row-space"], reset["--menu-row-space"]);
  assert.equal(reset["--menu-header-align"], "left");
  assert.equal(reset["--menu-price-weight"], 700);
});
