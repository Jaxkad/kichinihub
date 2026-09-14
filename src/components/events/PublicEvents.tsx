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
  };
  return (
    <article
      className="kh-event kh-event-feature"
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
          }}
        >
          {open ? "Hide details" : "View event details"}
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
    >
      <div className="kh-menu-heading">
        <div>
          <h2>Upcoming events</h2>
        </div>
        <p>
          See what’s on at Khichini Hub.
        </p>
      </div>
      {state === "loading" ? (
        <p role="status">Loading events…</p>
      ) : state === "error" ? (
        <div className="kh-events-empty">
          <CalendarDays />
          <div>
            <h3>Couldn’t load events.</h3>
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
            <h3>No upcoming events yet.</h3>
            <p>
              New events will be posted here. Check back soon.
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
