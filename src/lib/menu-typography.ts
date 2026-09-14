import type { CSSProperties } from "react";

export const menuFontIds = ["georgia", "geist", "barlow", "oswald", "roboto-slab", "nunito-sans", "work-sans", "dm-sans", "bitter", "archivo"] as const;
export type MenuFontId = (typeof menuFontIds)[number];
export const menuFonts: { id: MenuFontId; label: string; family: string; note: string }[] = [
  { id: "georgia", label: "Georgia", family: "Georgia, serif", note: "Original category headings" },
  { id: "geist", label: "Geist", family: "var(--font-geist-sans), Arial, sans-serif", note: "Original supporting text" },
  { id: "barlow", label: "Barlow", family: "var(--font-barlow), Arial, sans-serif", note: "Relaxed and sturdy" },
  { id: "oswald", label: "Oswald", family: "var(--font-oswald), Arial, sans-serif", note: "Bold, compact headings" },
  { id: "roboto-slab", label: "Roboto Slab", family: "var(--font-roboto-slab), Georgia, serif", note: "Rustic, hearty character" },
  { id: "nunito-sans", label: "Nunito Sans", family: "var(--font-nunito-sans), Arial, sans-serif", note: "Friendly and rounded" },
  { id: "work-sans", label: "Work Sans", family: "var(--font-work-sans), Arial, sans-serif", note: "Clear everyday reading" },
  { id: "dm-sans", label: "DM Sans", family: "var(--font-dm-sans), Arial, sans-serif", note: "Clean and welcoming" },
  { id: "bitter", label: "Bitter", family: "var(--font-bitter), Georgia, serif", note: "Warm, robust serif" },
  { id: "archivo", label: "Archivo", family: "var(--font-archivo), Arial, sans-serif", note: "Strong and practical" },
];
export const textRoles = ["categoryTitle", "categorySubtitle", "itemName", "itemDescription", "price"] as const;
export type TextRole = (typeof textRoles)[number];
export type TextSize = "small" | "standard" | "large";
export type TextWeight = "regular" | "medium" | "bold";
export type MenuTypography = {
  categoryTitle: MenuFontId;
  categorySubtitle: MenuFontId;
  itemName: MenuFontId;
  itemDescription: MenuFontId;
  sizes?: Partial<Record<TextRole, TextSize>>;
  weights?: Partial<Record<TextRole, TextWeight>>;
  spacing?: "compact" | "comfortable" | "spacious";
  headerAlign?: "left" | "center";
};
export const defaultMenuTypography: MenuTypography = {
  categoryTitle: "georgia",
  categorySubtitle: "geist",
  itemName: "geist",
  itemDescription: "geist",
};

export const defaultTextWeights: Record<TextRole, TextWeight> = {
  categoryTitle: "bold", categorySubtitle: "regular", itemName: "medium",
  itemDescription: "regular", price: "bold",
};
const sizeValues: Record<TextRole, Record<TextSize, string>> = {
  categoryTitle: { small: "clamp(1.375rem, 1.125rem + var(--menu-fluid, 1vw), 1.5rem)", standard: "clamp(1.5rem, 1.25rem + var(--menu-fluid, 1vw), 1.75rem)", large: "clamp(1.75rem, 1.5rem + var(--menu-fluid, 1vw), 2.25rem)" },
  categorySubtitle: { small: "0.8125rem", standard: "0.875rem", large: "1rem" },
  itemName: { small: "0.875rem", standard: "1rem", large: "1.125rem" },
  itemDescription: { small: "0.8125rem", standard: "0.875rem", large: "1rem" },
  price: { small: "1rem", standard: "1.125rem", large: "1.375rem" },
};
export function menuTypographyStyle(value?: Partial<MenuTypography>): CSSProperties {
  const settings = { ...defaultMenuTypography, ...value };
  const result: Record<string, string | number> = {};
  for (const role of ["categoryTitle", "categorySubtitle", "itemName", "itemDescription"] as const) {
    result[`--menu-${role}`] = (menuFonts.find((font) => font.id === settings[role]) || menuFonts.find((font) => font.id === defaultMenuTypography[role]))!.family;
  }
  for (const role of textRoles) {
    result[`--menu-${role}-size`] = sizeValues[role][settings.sizes?.[role] || "standard"];
    result[`--menu-${role}-weight`] = { regular: 400, medium: 600, bold: 700 }[settings.weights?.[role] || defaultTextWeights[role]];
  }
  result["--menu-row-space"] = { compact: "12px", comfortable: "18px", spacious: "28px" }[settings.spacing || "comfortable"];
  result["--menu-header-align"] = settings.headerAlign || "left";
  return result as CSSProperties;
}
