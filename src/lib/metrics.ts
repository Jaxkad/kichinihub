import { z } from "zod";
export const metricSchema = z.object({
  kind: z.enum([
    "page_view",
    "section_view",
    "category_view",
    "category_select",
    "dish_view",
    "event_view",
    "event_open",
    "gallery_view",
    "contact_click",
    "social_click",
    "filter_select",
    "search",
  ]),
  id: z
    .string()
    .min(1)
    .max(128)
    .regex(/^[\w-]+$/),
  label: z.string().trim().max(120),
});
export const trackingSchema = z.object({
  events: z.array(metricSchema).min(1).max(30),
});
export type Metric = z.infer<typeof metricSchema>;
export function metricDay(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Blantyre",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}
