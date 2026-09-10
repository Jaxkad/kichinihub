import { test } from "node:test";
import assert from "node:assert/strict";
import { eventSchema, upcomingEvents, eventTime } from "../src/lib/events.ts";
const event = {
  id: "cbf62546-a677-43b9-8d64-f9cc84b631bc",
  title: "An evening at the Hub",
  description: "Event details",
  venue: "Khichini Hub",
  startsAt: "2027-01-01T16:00:00.000Z",
  endsAt: "2027-01-01T20:00:00.000Z",
  status: "published",
  revision: 0,
};
test("valid event accepted; empty and reversed dates rejected", () => {
  assert.equal(eventSchema.safeParse(event).success, true);
  assert.equal(
    eventSchema.safeParse({ ...event, startsAt: "" }).success,
    false,
  );
  assert.equal(
    eventSchema.safeParse({ ...event, endsAt: event.startsAt }).success,
    false,
  );
});
test("drafts and ended events are excluded and upcoming events sorted", () => {
  const later = {
    ...event,
    id: "later",
    startsAt: "2027-01-02T16:00:00.000Z",
    endsAt: "2027-01-02T20:00:00.000Z",
  };
  assert.deepEqual(
    upcomingEvents(
      [later, { ...event, status: "draft" }, event],
      new Date("2027-01-01T00:00:00Z"),
    ).map((e) => e.id),
    [event.id, "later"],
  );
  assert.equal(upcomingEvents([event], new Date(event.endsAt)).length, 0);
});
test("event times use Malawi time regardless of viewer timezone", () =>
  assert.equal(eventTime(event.startsAt), "18:00"));
