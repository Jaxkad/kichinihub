"use client";
import { useEffect, useState } from "react";
type Row = {
  kind: string;
  id: string;
  label: string;
  count: number;
  day: string;
};
export function Insights({ api }: { api: (path: string) => Promise<unknown> }) {
  const [now] = useState(() => Date.now());
  const [days, setDays] = useState("7"),
    [rows, setRows] = useState<Row[]>([]),
    [loading, setLoading] = useState(true),
    [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    api(`insights?days=${days}`)
      .then((d) => {
        if (active) setRows(d as Row[]);
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
  }, [api, days]);
  const sum = (kind: string) =>
    rows.filter((r) => r.kind === kind).reduce((n, r) => n + r.count, 0);
  const ranking = (kind: string) => {
    const map = new Map<string, { label: string; count: number }>();
    rows
      .filter((r) => r.kind === kind)
      .forEach((r) =>
        map.set(r.id, {
          label: r.label,
          count: (map.get(r.id)?.count || 0) + r.count,
        }),
      );
    return [...map.values()].sort((a, b) => b.count - a.count).slice(0, 10);
  };
  return (
    <div>
      <div className="library-actions">
        <p>See what catches attention and what people choose to explore.</p>
        <select
          aria-label="Reporting period"
          style={{ width: 180 }}
          value={days}
          onChange={(e) => {
            setDays(e.target.value);
            setLoading(true);
            setError("");
          }}
        >
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
        </select>
      </div>
      <div className="insight">
        <p>
          Counts include consenting visitors only, starting after deployment.
          Views are impressions, not unique people or sales. Local previews are
          excluded. A view means that element entered the middle of the screen;
          clicks measure deliberate actions. Browser reporting can miss visits
          or include automated traffic.
        </p>
      </div>
      {error ? (
        <div className="alert error">{error}</div>
      ) : loading ? (
        <p className="panel">Loading insights…</p>
      ) : (
        <>
          <div className="metric-grid" style={{ marginTop: 24 }}>
            {[
              ["Page views", "page_view"],
              ["Category selections", "category_select"],
              ["Event details opened", "event_open"],
              ["Contact clicks", "contact_click"],
            ].map(([label, kind]) => (
              <div className="metric" key={kind}>
                <span>{label}</span>
                <strong>{sum(kind).toLocaleString()}</strong>
              </div>
            ))}
          </div>
          {!rows.length && (
            <div className="panel">
              <h2>Your audience story starts here.</h2>
              <p>
                No tracked activity in this period. Reports fill as visitors
                allow analytics and browse the deployed site.
              </p>
            </div>
          )}
          <div className="overview-grid">
            {[
              ["Popular categories — selections", "category_select"],
              ["Category impressions", "category_view"],
              ["Dishes noticed — impressions", "dish_view"],
              ["Events explored — detail opens", "event_open"],
              ["Areas seen", "section_view"],
              ["Event impressions", "event_view"],
              ["Gallery engagement", "gallery_view"],
              ["Dietary filter selections", "filter_select"],
              ["Contact actions", "contact_click"],
              ["Social visits", "social_click"],
              ["Menu searches", "search"],
            ].map(([title, kind]) => (
              <section className="panel" key={kind}>
                <h2>{title}</h2>
                {ranking(kind).length ? (
                  ranking(kind).map((r, i) => (
                    <div className="category-manage" key={i}>
                      <span>{r.label}</span>
                      <b>{r.count}</b>
                    </div>
                  ))
                ) : (
                  <p className="muted">No activity yet.</p>
                )}
              </section>
            ))}
          </div>
          <section className="panel">
            <h2>Page views by day</h2>
            {Array.from({ length: Number(days) }, (_, i) => {
              const day = new Intl.DateTimeFormat("en-CA", {
                timeZone: "Africa/Blantyre",
              }).format(new Date(now - (Number(days) - 1 - i) * 86400000));
              const count = rows
                .filter((r) => r.kind === "page_view" && r.day === day)
                .reduce((n, r) => n + r.count, 0);
              return (
                <div className="category-manage" key={day}>
                  <span>{day}</span>
                  <b>{count}</b>
                </div>
              );
            })}
          </section>
        </>
      )}
    </div>
  );
}
