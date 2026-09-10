import { NextResponse } from "next/server";
import { adminServices } from "@/lib/firebase-admin";
import { eventSchema, upcomingEvents } from "@/lib/events";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET() {
  try {
    const result = await adminServices()
      .db.collection("events")
      .where("status", "==", "published")
      .get();
    const events = result.docs.flatMap((doc) => {
      const parsed = eventSchema.safeParse(doc.data());
      return parsed.success ? [parsed.data] : [];
    });
    return NextResponse.json(
      upcomingEvents(events).map(
        ({ id, title, description, venue, startsAt, endsAt, images }) => ({
          id,
          title,
          description,
          venue,
          startsAt,
          endsAt,
          images,
        }),
      ),
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json(
      { error: "Events are temporarily unavailable." },
      { status: 503 },
    );
  }
}
