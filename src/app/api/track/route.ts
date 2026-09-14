// Analytics is disabled. Keep a no-op endpoint for previously loaded clients:
// discard their events without reading the payload or accessing the database.
export const runtime = "nodejs";
export function POST() {
  return new Response(null, { status: 204 });
}
