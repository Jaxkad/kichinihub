import { z } from "zod";
import { menuFontIds, textRoles } from "./menu-typography.ts";
const font = z.enum(menuFontIds);
export const menuTypographySchema = z.object({
  categoryTitle: font.default("georgia"),
  categorySubtitle: font.default("geist"),
  itemName: font.default("geist"),
  itemDescription: font.default("geist"),
  sizes: z.partialRecord(z.enum(textRoles), z.enum(["small", "standard", "large"])).optional(),
  weights: z.partialRecord(z.enum(textRoles), z.enum(["regular", "medium", "bold"])).optional(),
  spacing: z.enum(["compact", "comfortable", "spacious"]).optional(),
  headerAlign: z.enum(["left", "center"]).optional(),
});
const id = z
  .string()
  .min(1)
  .max(128)
  .regex(/^[a-zA-Z0-9_-]+$/);
export const menuSchema = z
  .object({
    typography: menuTypographySchema.optional(),
    sections: z
      .array(
        z.object({
          id,
          title: z.string().trim().min(1).max(160),
          subtitle: z.string().max(1000).optional(),
          theme: z.enum([
            "red",
            "light",
            "brown",
            "green",
            "cream",
            "burgundy",
            "terracotta",
            "teal",
            "slate",
            "forest",
          ]),
          items: z
            .array(
              z.object({
                id,
                name: z.string().trim().min(1).max(160),
                description: z.string().max(1000),
                price: z.number().finite().min(0).max(100000000),
                available: z.boolean().optional(),
                photo: z
                  .object({
                    url: z.url().refine((value) => {
                      try {
                        const url = new URL(value);
                        return (
                          url.protocol === "https:" &&
                          url.hostname === "firebasestorage.googleapis.com" &&
                          /^\/v0\/b\/kitchini-cf37a\.firebasestorage\.app\/o\/(event-media|event-images)%2F[^/]+\.(webp|jpg|jpeg|png|gif|avif)$/.test(
                            url.pathname,
                          )
                        );
                      } catch {
                        return false;
                      }
                    }, "Use a photo uploaded through the menu editor."),
                    alt: z.string().trim().min(1).max(200),
                  })
                  .nullable()
                  .optional(),
                dietary: z
                  .object({
                    pork: z.boolean().optional(),
                    vegan: z.boolean().optional(),
                    hot: z.boolean().optional(),
                  })
                  .optional(),
              }),
            )
            .max(300),
        }),
      )
      .max(50),
    social: z.object({
      instagram: z.string().max(300),
      facebook: z.string().max(300),
      twitter: z.string().max(300),
      tiktok: z.string().max(300),
      rsvp: z.string().max(100),
    }),
  })
  .superRefine((menu, ctx) => {
    const ids = menu.sections.map((s) => s.id);
    const items = menu.sections.flatMap((s) => s.items.map((i) => i.id));
    if (
      new Set(ids).size !== ids.length ||
      new Set(items).size !== items.length
    )
      ctx.addIssue({
        code: "custom",
        message: "Category and item IDs must be unique.",
      });
  });
export const userSchema = z.object({
  uid: z.string().min(1).max(128).optional(),
  displayName: z.string().trim().min(1).max(100),
  email: z.email(),
  role: z.enum(["admin", "editor", "viewer"]),
  disabled: z.boolean().default(false),
  password: z.string().min(12).max(128).optional(),
});
