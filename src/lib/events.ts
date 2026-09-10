import { z } from "zod";
export const eventSchema = z
  .object({
    id: z.string().uuid(),
    title: z.string().trim().min(1).max(120),
    description: z.string().trim().min(1).max(3000),
    venue: z.string().trim().min(1).max(200),
    startsAt: z.iso.datetime(),
    endsAt: z.iso.datetime(),
    status: z.enum(["draft", "published"]),
    images: z
      .array(
        z.object({
          url: z.url().refine((value) => {
            try {
              const url = new URL(value);
              return (
                url.protocol === "https:" &&
                url.hostname === "firebasestorage.googleapis.com" &&
                ["event-images", "event-media"].some((folder) =>
                  url.pathname.startsWith(
                    `/v0/b/kitchini-cf37a.firebasestorage.app/o/${folder}%2F`,
                  ),
                )
              );
            } catch {
              return false;
            }
          }, "Use an image uploaded through the event editor."),
          kind: z.enum(["image", "video"]).default("image"),
          mimeType: z.string().max(80).optional(),
          alt: z.string().trim().min(1).max(200),
        }),
      )
      .max(6)
      .default([]),
    revision: z.number().int().nonnegative(),
  })
  .refine((e) => new Date(e.endsAt) > new Date(e.startsAt), {
    message: "The event must end after it starts.",
    path: ["endsAt"],
  });
export type HubEvent = z.infer<typeof eventSchema>;
export function upcomingEvents(events: HubEvent[], now = new Date()) {
  return events
    .filter((e) => e.status === "published" && new Date(e.endsAt) > now)
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt));
}
export function eventDate(value: string) {
  return new Date(value).toLocaleDateString("en-GB", {
    timeZone: "Africa/Blantyre",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
export function eventTime(value: string) {
  return new Date(value).toLocaleTimeString("en-GB", {
    timeZone: "Africa/Blantyre",
    hour: "2-digit",
    minute: "2-digit",
  });
}
