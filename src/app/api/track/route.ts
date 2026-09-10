import { NextRequest, NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { adminServices } from "@/lib/firebase-admin";
import { trackingSchema, metricDay } from "@/lib/metrics";
import { FieldValue } from "firebase-admin/firestore";
export const runtime = "nodejs";
export async function POST(req: NextRequest) {
  if (req.headers.get("origin") !== req.nextUrl.origin)
    return new NextResponse(null, { status: 403 });
  if (process.env.NODE_ENV !== "production")
    return new NextResponse(null, { status: 204 });
  if (Number(req.headers.get("content-length") || 0) > 16000)
    return new NextResponse(null, { status: 413 });
  try {
    const text = await req.text();
    if (text.length > 16000) return new NextResponse(null, { status: 413 });
    const { events } = trackingSchema.parse(JSON.parse(text));
    const { db } = adminServices();
    const day = metricDay();
    // Limit writes per day. Counts are browser-reported estimates, not verified people.
    const quota = db.doc(`analyticsQuota/${day}`);
    await db.runTransaction(async (tx) => {
      const count = await tx.get(quota);
      if ((count.data()?.count || 0) >= 20000) throw new Error("quota");
      tx.set(
        quota,
        { count: FieldValue.increment(events.length) },
        { merge: true },
      );
      for (const event of events) {
        const key = createHash("sha256")
          .update(event.kind + ":" + event.id)
          .digest("hex")
          .slice(0, 32);
        tx.set(
          db.doc(`analytics/${day}/metrics/${key}`),
          { ...event, day, count: FieldValue.increment(1) },
          { merge: true },
        );
      }
    });
    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json(
      { error: "Unable to record metrics." },
      { status: 400 },
    );
  }
}
