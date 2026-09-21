import { z } from "zod";
import { menuSchema } from "./admin-schema.ts";

export const PUBLISHED_MENU_TAG = "published-menu";
export const PUBLISHED_MENU_REVALIDATE = 300;
export const publishedMenuSchema = menuSchema.and(z.object({
  revision: z.number().int().nonnegative().default(0),
}));
export type PublishedMenu = z.infer<typeof publishedMenuSchema>;

// Decode only the Firestore REST value types used by our menu. The shared
// schema then validates content and strips unrelated document fields.
function decodeValue(value: unknown): unknown {
  if (!value || typeof value !== "object") throw new Error("Invalid menu value");
  const v = value as Record<string, unknown>;
  if ("nullValue" in v) return null;
  if ("stringValue" in v) return v.stringValue;
  if ("booleanValue" in v) return v.booleanValue;
  if ("integerValue" in v) return Number(v.integerValue);
  if ("doubleValue" in v) return v.doubleValue;
  if ("arrayValue" in v) {
    const array = v.arrayValue as { values?: unknown[] };
    return (array.values ?? []).map(decodeValue);
  }
  if ("mapValue" in v) {
    const map = v.mapValue as { fields?: Record<string, unknown> };
    return Object.fromEntries(Object.entries(map.fields ?? {}).map(([key, val]) => [key, decodeValue(val)]));
  }
  throw new Error("Unsupported menu value");
}

export function parsePublishedMenuDocument(document: unknown): PublishedMenu {
  const { fields } = z.object({ fields: z.record(z.string(), z.unknown()) }).parse(document);
  // Ignore metadata, which may contain Firestore-specific types.
  const data = Object.fromEntries(
    ["sections", "social", "typography", "revision"]
      .filter((key) => key in fields)
      .map((key) => [key, decodeValue(fields[key])]),
  );
  return publishedMenuSchema.parse(data);
}
