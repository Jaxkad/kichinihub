"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import {
  CalendarDays,
  MapPin,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { HubEvent, eventDate, eventTime } from "@/lib/events";
import { track } from "@/lib/tracking";
type PublicEvent = Pick<
  HubEvent,
  "id" | "title" | "description" | "venue" | "startsAt" | "endsAt" | "images"
>;
function EventVideo({ url, title }: { url: string; title: string }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className="kh-event-video">
      {failed ? (
        <p>
          This video cannot play in this browser.{" "}
          <a href={url} target="_blank" rel="noreferrer">
            Open the original video
          </a>
        </p>
      ) : (
        <video
          src={url}
          controls
          playsInline
          preload="metadata"
          aria-label={title}
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
function EventCard({ event, phone }: { event: PublicEvent; phone: string }) {
  const [photo, setPhoto] = useState(0),
    [open, setOpen] = useState(false);
  const images = event.images || [];
  const current = images[Math.min(photo, images.length - 1)];
  const select = (index: number) => {
    setPhoto(index);
    track("gallery_view", event.id, event.title);
  };
  return (
    <article
      className="kh-event kh-event-feature"
      data-metric="event_view"
      data-metric-id={event.id}
      data-metric-label={event.title}
    >
      <div className="kh-event-media">
        {current ? (
          current.kind === "video" ? (
            <EventVideo
              key={current.url}
              url={current.url}
              title={current.alt}
            />
          ) : (
            <Image
              unoptimized
              src={current.url}
              alt={current.alt}
              fill
              sizes="(max-width:700px) 100vw, 600px"
            />
          )
        ) : (
          <div className="kh-event-placeholder">
            <CalendarDays size={40} />
            <span>AT THE HUB</span>
          </div>
        )}
        <span className="kh-event-badge">WHAT’S ON</span>
        {images.length > 1 && (
          <div className="kh-gallery-controls">
            <button
              aria-label={`Previous media for ${event.title}`}
              onClick={() =>
                select((photo - 1 + images.length) % images.length)
              }
            >
              <ChevronLeft size={18} />
            </button>
            <span>
              {photo + 1} / {images.length}
            </span>
            <button
              aria-label={`Next media for ${event.title}`}
              onClick={() => select((photo + 1) % images.length)}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
      <div className="kh-event-body">
        <div className="kh-event-date">
          <CalendarDays size={16} />
          {eventDate(event.startsAt)}
        </div>
        <h3>{event.title}</h3>
        <span className="kh-event-time">
          {eventTime(event.startsAt)} –{" "}
          {eventDate(event.endsAt) !== eventDate(event.startsAt)
            ? `${eventDate(event.endsAt)}, `
            : ""}
          {eventTime(event.endsAt)} CAT
        </span>
        <div className="kh-event-venue">
          <MapPin size={15} />
          {event.venue}
        </div>
        <p className="kh-event-summary">
          {event.description.slice(0, 150)}
          {event.description.length > 150 ? "…" : ""}
        </p>
        <button
          className="kh-event-details"
          aria-expanded={open}
          aria-controls={`details-${event.id}`}
          onClick={() => {
            setOpen(!open);
            if (!open) track("event_open", event.id, event.title);
          }}
        >
          {open ? "Hide details" : "Explore this event"}
          <ArrowUpRight size={16} />
        </button>
        {open && (
          <div id={`details-${event.id}`} className="kh-event-expanded">
            <p className="kh-event-description">{event.description}</p>
            {images.length > 1 && (
              <div className="kh-event-thumbnails">
                {images.map((img, index) => (
                  <button
                    aria-label={`View media ${index + 1}: ${img.alt}`}
                    aria-pressed={photo === index}
                    key={img.url}
                    onClick={() => select(index)}
                  >
                    {img.kind === "video" ? (
                      <span className="kh-video-thumb">
                        ▶ Video {index + 1}
                      </span>
                    ) : (
                      <Image
                        unoptimized
                        src={img.url}
                        alt={img.alt}
                        width={100}
                        height={65}
                      />
                    )}
                  </button>
                ))}
              </div>
            )}
            <a
              href={`tel:${phone}`}
              data-track="contact_click"
              data-track-id={event.id}
              data-track-label={event.title}
            >
              Ask the team about this event <ArrowUpRight size={16} />
            </a>
          </div>
        )}
      </div>
    </article>
  );
}
export function PublicEvents({ phone }: { phone: string }) {
  const [events, setEvents] = useState<PublicEvent[]>([]),
    [state, setState] = useState("loading");
  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    const load = async () => {
      try {
        const res = await fetch("/api/events", {
          signal: controller.signal,
          cache: "no-store",
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        if (active) {
          setEvents(data);
          setState("ready");
        }
      } catch {
        if (active) setState("error");
      }
    };
    void load();
    const timer = setInterval(load, 60000);
    return () => {
      active = false;
      controller.abort();
      clearInterval(timer);
    };
  }, []);
  return (
    <section
      className="kh-events"
      id="events"
      data-metric="section_view"
      data-metric-id="events"
      data-metric-label="Events"
    >
      <div className="kh-menu-heading">
        <div>
          <span className="kh-kicker">MORE THAN A GREAT MEAL</span>
          <h2>Meet you at the Hub.</h2>
        </div>
        <p>
          Your next good memory starts here.
          <br />
          Explore upcoming events and gatherings.
        </p>
      </div>
      {state === "loading" ? (
        <p role="status">Finding the latest happenings…</p>
      ) : state === "error" ? (
        <div className="kh-events-empty">
          <CalendarDays />
          <div>
            <h3>Let’s find out what’s on.</h3>
            <p>
              We couldn’t load the event calendar. Give the team a call for the
              latest details.
            </p>
          </div>
          <a href={`tel:${phone}`}>
            Contact the Hub <ArrowUpRight size={16} />
          </a>
        </div>
      ) : !events.length ? (
        <div className="kh-events-empty">
          <CalendarDays />
          <div>
            <h3>More good times to come.</h3>
            <p>
              Our next events will appear here once announced. Check back soon,
              or get in touch with the team.
            </p>
          </div>
          <a href={`tel:${phone}`}>
            Get in touch <ArrowUpRight size={16} />
          </a>
        </div>
      ) : (
        <div className="kh-events-grid">
          {events.map((event) => (
            <EventCard key={event.id} event={event} phone={phone} />
          ))}
        </div>
      )}
    </section>
  );
}
