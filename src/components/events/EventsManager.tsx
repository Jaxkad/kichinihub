"use client";
import { uploadMedia } from "@/lib/upload-media";
import { MEDIA_ACCEPT } from "@/lib/media";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { CalendarDays, Plus, RefreshCw } from "lucide-react";
import { HubEvent, eventDate, eventTime } from "@/lib/events";
type Props = {
  api: (path: string, method?: string, body?: unknown) => Promise<unknown>;
  canEdit: boolean;
};
const localTime = (date: string) =>
  date
    ? new Date(new Date(date).getTime() + 7200000).toISOString().slice(0, 16)
    : "";
export function EventsManager({ api, canEdit }: Props) {
  const [events, setEvents] = useState<HubEvent[]>([]),
    [editing, setEditing] = useState<HubEvent | null>(null),
    [busy, setBusy] = useState(false),
    [loading, setLoading] = useState(true),
    [error, setError] = useState(""),
    [message, setMessage] = useState(""),
    [uploadProgress, setUploadProgress] = useState("");
  const reload = useCallback(async () => {
    setEvents((await api("events")) as HubEvent[]);
  }, [api]);
  useEffect(() => {
    let active = true;
    api("events")
      .then((d) => {
        if (active) setEvents(d as HubEvent[]);
      })
      .catch((e) => {
        if (active) setError(e.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [api]);
  const run = async (fn: () => Promise<void>) => {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      await fn();
    } catch (e) {
      setError(e instanceof Error ? e.message : "We could not save your event. Please try again.");
    } finally {
      setBusy(false);
    }
  };
  useEffect(() => {
    const protect = (e: BeforeUnloadEvent) => {
      if (editing) e.preventDefault();
    };
    window.addEventListener("beforeunload", protect);
    return () => window.removeEventListener("beforeunload", protect);
  }, [editing]);
  return (
    <section className="events-manager">
      <div className="library-actions">
        <p>
          Share what’s happening at the Hub. Published events appear on the
          website until they end. All times are Malawi time (CAT).
        </p>
        <div>
          <button disabled={busy} onClick={() => void run(reload)}>
            <RefreshCw size={15} />
            Refresh
          </button>
          {canEdit && (
            <button
              className="primary"
              disabled={!!editing}
              onClick={() =>
                setEditing({
                  id: crypto.randomUUID(),
                  title: "",
                  description: "",
                  venue: "Khichini Hub",
                  startsAt: "",
                  endsAt: "",
                  status: "draft",
                  revision: 0,
                  images: [],
                })
              }
            >
              <Plus size={16} />
              Add event
            </button>
          )}
        </div>
      </div>
      {error && (
        <div role="alert" className="alert error">
          {error}
        </div>
      )}
      {message && (
        <div role="status" className="alert">
          {message}
        </div>
      )}
      {editing && (
        <form
          className="panel settings-panel event-editor"
          onSubmit={(e) => {
            e.preventDefault();
            void run(async () => {
              await api("events", "PUT", editing);
              setMessage(
                editing.status === "published"
                  ? "Event published."
                  : "Draft saved. Only your team can see it.",
              );
              setEditing(null);
              await reload();
            });
          }}
        >
          <h2>{editing.revision ? "Edit event" : "Create an event"}</h2>
          <label>
            Event title
            <input
              required
              maxLength={120}
              value={editing.title}
              onChange={(e) =>
                setEditing({ ...editing, title: e.target.value })
              }
            />
          </label>
          <label>
            What’s happening?
            <textarea
              required
              maxLength={3000}
              value={editing.description}
              onChange={(e) =>
                setEditing({ ...editing, description: e.target.value })
              }
            />
          </label>
          <label>
            Venue / location
            <input
              required
              maxLength={200}
              value={editing.venue}
              onChange={(e) =>
                setEditing({ ...editing, venue: e.target.value })
              }
            />
          </label>
          <div className="form-grid">
            {(["startsAt", "endsAt"] as const).map((key) => (
              <label key={key}>
                {key === "startsAt" ? "Starts" : "Ends"} (CAT)
                <input
                  type="datetime-local"
                  required
                  value={localTime(editing[key])}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      [key]: e.target.value
                        ? new Date(e.target.value + ":00+02:00").toISOString()
                        : "",
                    })
                  }
                />
              </label>
            ))}
          </div>
          <fieldset className="event-images-editor">
            <legend>Event media · up to 6</legend>
            <p className="muted">
              The first file is your cover. Images: JPG, PNG, WebP, GIF, AVIF,
              HEIC/HEIF, TIFF, BMP and SVG (25 MB max). Videos: MOV, MP4, M4V
              and WebM (250 MB max). Apple photos are converted for web display;
              some video codecs need H.264 MP4 for universal playback. Uploaded
              media is public by link, including drafts.
            </p>
            <label>
              Add photos or videos
              <input
                type="file"
                accept={MEDIA_ACCEPT}
                multiple
                disabled={busy || (editing.images || []).length >= 6}
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  e.target.value = "";
                  void run(async () => {
                    if (files.length + (editing.images || []).length > 6)
                      throw new Error("You can add up to 6 photos or videos for each event.");
                    for (const file of files) {
                      const result = await uploadMedia(file, setUploadProgress);
                      setEditing((current) =>
                        current
                          ? {
                              ...current,
                              images: [
                                ...(current.images || []),
                                {
                                  url: result.url,
                                  kind: result.kind,
                                  mimeType: result.mimeType,
                                  alt: current.title || "Event media",
                                },
                              ],
                            }
                          : null,
                      );
                    }
                  });
                }}
              />
            </label>
            {busy && uploadProgress && <p role="status">{uploadProgress}</p>}
            {(editing.images || []).map((image, index) => (
              <div className="event-image-edit" key={image.url}>
                {image.kind === "video" ? (
                  <video
                    src={image.url}
                    controls
                    preload="metadata"
                    style={{ width: 160, height: 100 }}
                  />
                ) : (
                  <Image
                    unoptimized
                    src={image.url}
                    alt={image.alt}
                    width={160}
                    height={100}
                  />
                )}
                <label>
                  {index === 0
                    ? "Cover image description"
                    : "Image description"}
                  <input
                    required
                    maxLength={200}
                    value={image.alt}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        images: editing.images.map((img, i) =>
                          i === index ? { ...img, alt: e.target.value } : img,
                        ),
                      })
                    }
                  />
                </label>
                <button
                  type="button"
                  disabled={busy || index === 0}
                  onClick={() => {
                    const images = [...editing.images];
                    images.splice(index, 1);
                    images.unshift(image);
                    setEditing({ ...editing, images });
                  }}
                >
                  Make cover
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() =>
                    setEditing({
                      ...editing,
                      images: editing.images.filter((_, i) => i !== index),
                    })
                  }
                >
                  Remove
                </button>
              </div>
            ))}
          </fieldset>
          <label>
            Visibility
            <select
              value={editing.status}
              onChange={(e) =>
                setEditing({
                  ...editing,
                  status: e.target.value as HubEvent["status"],
                })
              }
            >
              <option value="draft">Draft — team only</option>
              <option value="published">Published — visible to everyone</option>
            </select>
          </label>
          <div className="modal-actions">
            <button
              type="button"
              disabled={busy}
              onClick={() => {
                if (window.confirm("Discard changes to this event?"))
                  setEditing(null);
              }}
            >
              Cancel
            </button>
            <button className="primary" disabled={busy}>
              {busy
                ? "Saving…"
                : editing.status === "published"
                  ? "Save & publish event"
                  : "Save draft"}
            </button>
          </div>
        </form>
      )}
      <div className="panel">
        {loading ? (
          <p>Loading events…</p>
        ) : !events.length ? (
          <div className="empty">
            <CalendarDays size={30} />
            <h2>Your next gathering starts here.</h2>
            <p>
              Add your first event, then publish it when the details are ready.
            </p>
          </div>
        ) : (
          events
            .sort((a, b) => b.startsAt.localeCompare(a.startsAt))
            .map((event) => (
              <article className="category-manage" key={event.id}>
                <div>
                  <b>{event.title}</b>
                  <small>
                    {eventDate(event.startsAt)} · {eventTime(event.startsAt)}{" "}
                    CAT · {event.venue}
                  </small>
                  <span
                    className={`pill ${event.status === "draft" ? "off" : ""}`}
                  >
                    {event.status === "draft"
                      ? "Draft"
                      : new Date(event.endsAt) <= new Date()
                        ? "Ended"
                        : "Published"}
                  </span>
                </div>
                {canEdit && (
                  <div>
                    <button
                      disabled={busy || !!editing}
                      onClick={() =>
                        setEditing({ ...event, images: event.images || [] })
                      }
                    >
                      Edit
                    </button>
                    <button
                      className="danger"
                      disabled={busy || !!editing}
                      onClick={() => {
                        if (
                          window.confirm(`Permanently delete “${event.title}”?`)
                        )
                          void run(async () => {
                            await api("events", "DELETE", {
                              id: event.id,
                              revision: event.revision,
                            });
                            await reload();
                            setMessage("Event deleted.");
                          });
                      }}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </article>
            ))
        )}
      </div>
    </section>
  );
}
