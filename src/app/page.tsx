"use client";
import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { menuData } from "@/data/menuData";
import { menuSchema } from "@/lib/admin-schema";
import Image from "next/image";
import {
  ArrowDown,
  ArrowUpRight,
  Search,
  X,
  Leaf,
  Flame,
  Phone,
  Utensils,
  SlidersHorizontal,
} from "lucide-react";
import { FaInstagram, FaFacebook, FaTiktok } from "react-icons/fa";
import "./menu.css";
import { DishPhoto } from "@/components/menu/DishPhoto";
import { SiteTracking } from "@/components/analytics/SiteTracking";
import { track } from "@/lib/tracking";
import { PublicEvents } from "@/components/events/PublicEvents";

const categoryNames: Record<string, string> = {
  starters: "Khala favourites",
  soups: "Soups",
  breakfast: "Breakfast",
  salads: "Salads",
  "finger-foods": "Finger foods",
  mains: "Mains",
  sandwiches: "Sandwiches",
  wraps: "Wraps",
  starches: "Sides",
};
const sanitizePhone = (value: string) =>
  value.replace(/[^0-9+]/g, "").slice(0, 20);
const socialHandle = (value: string) =>
  encodeURIComponent(value.replace(/^@/, "").trim());
const socialLinks: {
  key: keyof typeof menuData.social;
  url: (handle: string) => string;
  Icon: typeof FaInstagram;
  label: string;
  trackId: string;
}[] = [
  {
    key: "instagram",
    url: (h) => `https://instagram.com/${h}`,
    Icon: FaInstagram,
    label: "Instagram",
    trackId: "instagram",
  },
  {
    key: "facebook",
    url: (h) => `https://facebook.com/${h}`,
    Icon: FaFacebook,
    label: "Facebook",
    trackId: "facebook",
  },
  {
    key: "tiktok",
    url: (h) => `https://tiktok.com/@${h}`,
    Icon: FaTiktok,
    label: "TikTok",
    trackId: "tiktok",
  },
  {
    key: "twitter",
    url: (h) => `https://x.com/${h}`,
    Icon: FaInstagram,
    label: "X / Twitter",
    trackId: "x",
  },
];
export default function Home() {
  const [menu, setMenu] = useState(menuData),
    [query, setQuery] = useState(""),
    [category, setCategory] = useState("all"),
    [diet, setDiet] = useState("all"),
    [connection, setConnection] = useState("loading");
  useEffect(
    () =>
      onSnapshot(
        doc(db, "menu/current"),
        (snapshot) => {
          if (snapshot.exists()) {
            const parsed = menuSchema.safeParse(snapshot.data());
            if (parsed.success) {
              setMenu(parsed.data as typeof menuData);
              setConnection("live");
            } else {
              setConnection("fallback");
            }
          } else setConnection("fallback");
        },
        () => setConnection("fallback"),
      ),
    [],
  );
  useEffect(() => {
    if (!query.trim()) return;
    const timer = setTimeout(
      () => track("search", "menu-search", "Menu searches"),
      900,
    );
    return () => clearTimeout(timer);
  }, [query]);
  const available = menu.sections
    .map((s) => ({ ...s, items: s.items.filter((i) => i.available !== false) }))
    .filter((s) => s.items.length);
  const sections = available
    .filter((s) => category === "all" || s.id === category)
    .map((s) => ({
      ...s,
      items: s.items.filter(
        (i) =>
          (diet === "all" ||
            (diet === "vegan" ? i.dietary?.vegan : i.dietary?.hot)) &&
          `${i.name} ${i.description} ${s.title}`
            .toLowerCase()
            .includes(query.toLowerCase()),
      ),
    }))
    .filter((s) => s.items.length);
  const total = sections.reduce((n, s) => n + s.items.length, 0);
  const reset = () => {
    setQuery("");
    setCategory("all");
    setDiet("all");
  };
  return (
    <div className="kh-menu" id="top">
      <a className="kh-skip" href="#menu">
        Skip to menu
      </a>
      <header className="kh-header">
        <a href="#top" aria-label="Khichini Hub home">
          <Image
            src="/Khichinihublogo.png"
            width={1280}
            height={1280}
            className="kh-logo"
            alt="Khichini Hub"
            priority
            sizes="100px"
          />
        </a>
        <nav aria-label="Main navigation">
          <a href="#menu">The menu</a>
          <a href="#events">What’s on</a>
          <a href="#visit">Find your people</a>
        </nav>
        <a
          className="kh-reserve"
          data-track="contact_click"
          data-track-id="phone"
          data-track-label="Call the Hub"
          href={`tel:${sanitizePhone(menu.social.rsvp)}`}
        >
          <Phone size={14} />
          <span>Let’s make a plan</span>
          <ArrowUpRight size={16} />
        </a>
      </header>
      <main>
        <section
          className="kh-hero"
          data-metric="section_view"
          data-metric-id="hero"
          data-metric-label="Welcome"
        >
          <div className="kh-hero-copy">
            <div className="kh-kicker">
              <span />
              GOOD FOOD. BETTER COMPANY.
            </div>
            <h1>
              Come hungry.
              <br />
              Leave <em>happy.</em>
            </h1>
            <p>
              Big flavours. Familiar favourites. A little something for everyone
              at the table. Welcome to Khichini Hub.
            </p>
            <a href="#menu" className="kh-button">
              Find your next favourite <ArrowDown size={17} />
            </a>
            <div className="kh-hero-note">
              <span>Made for sharing.</span>
              <span>Or keeping all to yourself.</span>
            </div>
          </div>
          <div className="kh-hero-art">
            <span className="kh-art-label">
              A LITTLE SAUCY.
              <br />A LOT TO LOVE.
            </span>
            <div className="kh-plate">
              <Image
                src="/bowl.PNG"
                alt="A bowl of glazed bites garnished with sesame and herbs"
                fill
                priority
                sizes="(max-width: 700px) 85vw, 470px"
              />
            </div>
            <span className="kh-stamp">
              GOOD MOOD
              <br />
              <b>food.</b>
              <span>THE KHICHINI WAY</span>
            </span>
            <svg
              className="kh-scribble"
              viewBox="0 0 130 70"
              aria-hidden="true"
            >
              <path d="M6 9c37 8 44 43 102 36m-21-20 27 19-21 20" />
            </svg>
          </div>
        </section>
        <div className="kh-ribbon" aria-hidden="true">
          <span>A SEAT AT THE TABLE</span>
          <b>✳</b>
          <span>A LITTLE SPICE</span>
          <b>✳</b>
          <span>A LOT OF SOUL</span>
          <b>✳</b>
          <span>ALWAYS KHICHINI</span>
          <b>✳</b>
        </div>
        <section
          className="kh-menu-section"
          id="menu"
          data-metric="section_view"
          data-metric-id="menu"
          data-metric-label="Menu"
        >
          <div className="kh-menu-heading">
            <div>
              <span className="kh-kicker">FIND WHAT YOU’RE CRAVING</span>
              <h2>The good stuff.</h2>
            </div>
            <p>
              From the first bite to the last.
              <br />
              All prices in Malawian kwacha (MWK).
            </p>
          </div>
          <div className="kh-toolbar">
            <label className="kh-search">
              <Search size={19} />
              <input
                type="search"
                placeholder="What are you in the mood for?"
                aria-label="Search dishes"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              {query && (
                <button onClick={() => setQuery("")} aria-label="Clear search">
                  <X size={16} />
                </button>
              )}
            </label>
            <div className="kh-diet" aria-label="Dietary filters">
              <SlidersHorizontal size={17} />
              {[
                ["all", "Everything"],
                ["vegan", "Vegan"],
                ["hot", "Spicy"],
              ].map(([value, label]) => (
                <button
                  key={value}
                  aria-pressed={diet === value}
                  className={diet === value ? "active" : ""}
                  onClick={() => {
                    setDiet(value);
                    track("filter_select", value, label);
                  }}
                >
                  {value === "vegan" && <Leaf size={14} />}{" "}
                  {value === "hot" && <Flame size={14} />} {label}
                </button>
              ))}
            </div>
          </div>
          <div className="kh-menu-layout">
            <aside className="kh-categories">
              <span className="kh-kicker">ON THE MENU</span>
              <nav aria-label="Menu categories">
                <button
                  className={category === "all" ? "active" : ""}
                  aria-pressed={category === "all"}
                  onClick={() => setCategory("all")}
                >
                  The whole menu{" "}
                  <span>
                    {available.reduce((n, s) => n + s.items.length, 0)}
                  </span>
                </button>
                {available.map((s) => (
                  <button
                    key={s.id}
                    aria-pressed={category === s.id}
                    className={category === s.id ? "active" : ""}
                    onClick={() => {
                      setCategory(s.id);
                      track(
                        "category_select",
                        s.id,
                        categoryNames[s.id] || s.title,
                      );
                    }}
                  >
                    {categoryNames[s.id] || s.title}
                    <span>{s.items.length}</span>
                  </button>
                ))}
              </nav>
              <div className="kh-diet-key">
                <span>
                  <Leaf size={14} /> Vegan
                </span>
                <span>
                  <Flame size={14} /> Spicy
                </span>
                <p>
                  Allergies or dietary needs?
                  <br />
                  Please speak to our team.
                </p>
              </div>
            </aside>
            <div className="kh-dishes">
              <div className="kh-results" role="status">
                <span>{total} dishes to discover</span>
                {(query || diet !== "all" || category !== "all") && (
                  <button onClick={reset}>
                    Clear filters <X size={13} />
                  </button>
                )}
              </div>
              {connection === "fallback" && (
                <p className="kh-connection">
                  Showing our saved menu. Please confirm current prices and
                  availability with the team.
                </p>
              )}
              {sections.map((s, index) => (
                <section
                  key={s.id}
                  className="kh-category-section"
                  data-metric="category_view"
                  data-metric-id={s.id}
                  data-metric-label={categoryNames[s.id] || s.title}
                >
                  <div className="kh-category-title">
                    <span className="kh-section-number">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3>{categoryNames[s.id] || s.title}</h3>
                      <p>{s.subtitle || "Something delicious starts here."}</p>
                    </div>
                    <Utensils size={21} />
                  </div>
                  <div className="kh-item-grid">
                    {s.items.map((i) => (
                      <article
                        className="kh-dish"
                        key={i.id}
                        data-metric="dish_view"
                        data-metric-id={i.id}
                        data-metric-label={i.name}
                      >
                        {i.photo && (
                          <DishPhoto key={i.photo.url} photo={i.photo} />
                        )}
                        <div className="kh-dish-top">
                          <h4>{i.name}</h4>
                          <span className="kh-price">
                            <small>K</small>
                            {i.price.toLocaleString("en-MW")}
                          </span>
                        </div>
                        <p>{i.description}</p>
                        {(i.dietary?.vegan ||
                          i.dietary?.hot ||
                          i.dietary?.pork) && (
                          <div className="kh-tags">
                            {i.dietary?.vegan && (
                              <span className="vegan">
                                <Leaf size={12} />
                                Vegan
                              </span>
                            )}
                            {i.dietary?.hot && (
                              <span>
                                <Flame size={12} />
                                Spicy
                              </span>
                            )}
                            {i.dietary?.pork && <span>Contains pork</span>}
                          </div>
                        )}
                      </article>
                    ))}
                  </div>
                </section>
              ))}
              {!sections.length && (
                <div className="kh-empty">
                  <Search size={30} />
                  <h3>No bites found.</h3>
                  <p>Try a different search or explore the whole menu.</p>
                  <button className="kh-button" onClick={reset}>
                    Show the whole menu <ArrowUpRight size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
        <PublicEvents phone={menu.social.rsvp} />
        <section
          className="kh-visit"
          id="visit"
          data-metric="section_view"
          data-metric-id="visit"
          data-metric-label="Contact & visits"
        >
          <div>
            <span className="kh-kicker">THERE’S ROOM FOR YOU HERE</span>
            <h2>
              Good company.
              <br />
              <em>Great memories.</em>
            </h2>
            <p>
              Bring your people. Find your favourites.
              <br />
              Get in touch to plan your next visit.
            </p>
            <a
              data-track="contact_click"
              data-track-id="phone"
              data-track-label="Call the Hub"
              href={`tel:${sanitizePhone(menu.social.rsvp)}`}
              className="kh-button"
            >
              <Phone size={16} />
              {menu.social.rsvp}
              <ArrowUpRight size={17} />
            </a>
          </div>
          <div className="kh-visit-mark" aria-hidden="true">
            <span>the</span>
            <strong>
              happy
              <br />
              place.
            </strong>
            <span>KHICHINI HUB</span>
          </div>
        </section>
      </main>
      <SiteTracking />
      <footer className="kh-footer">
        <div>
          <Image
            src="/Khichinihublogo.png"
            alt="Khichini Hub"
            width={1280}
            height={1280}
            sizes="90px"
          />
          <span>Flavour brings us together.</span>
        </div>
        <div className="kh-socials">
          {socialLinks.map(({ key, url, Icon, label, trackId }) => {
            const handle = socialHandle(menu.social[key]);
            if (!handle) return null;
            return (
              <a
                key={key}
                data-track="social_click"
                data-track-id={trackId}
                data-track-label={label}
                aria-label={label}
                target="_blank"
                rel="noreferrer"
                href={url(handle)}
              >
                {trackId === "x" ? "𝕏" : <Icon />}
              </a>
            );
          })}
        </div>
        <div className="kh-footer-credit" suppressHydrationWarning>
          <small>© {new Date().getFullYear()} Khichini Hub</small>
          <small>Website developed and managed by{" "}
            <a href="https://25points.us/" target="_blank" rel="noopener noreferrer">25Points</a>
          </small>
        </div>
        <a href="#top">Back to top ↑</a>
      </footer>
    </div>
  );
}
