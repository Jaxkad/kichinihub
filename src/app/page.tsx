"use client";
import { useEffect, useRef, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { menuData } from "@/data/menuData";
import { menuSchema } from "@/lib/admin-schema";
import Image from "next/image";
import {
  ArrowUpRight,
  Search,
  X,
  Leaf,
  Flame,
  Phone,
  SlidersHorizontal,
} from "lucide-react";
import { FaInstagram, FaFacebook, FaTiktok } from "react-icons/fa";
import "./menu.css";
import { DishPhoto } from "@/components/menu/DishPhoto";
import { SiteTracking } from "@/components/analytics/SiteTracking";
import { track } from "@/lib/tracking";
import { PublicEvents } from "@/components/events/PublicEvents";

const sanitizePhone = (value: string) =>
  value.replace(/[^0-9+]/g, "").slice(0, 20);
const socialHandle = (value: string) =>
  encodeURIComponent(value.replace(/^@/, "").trim());
/*
 * Per-section theme colors — ported from the original MenuSection component.
 * Each section's `theme` field maps to a rich background colour for the header
 * bar, a readable text colour on that background, and a very faded version of
 * the header colour used as the section body background.
 */
const themeColors: Record<string, { bg: string; onBg: string; surface: string }> = {
  red: { bg: "#6D1600", onBg: "#FFFFFF", surface: "rgba(109, 22, 0, 0.08)" },
  light: { bg: "#F5F5F5", onBg: "#000000", surface: "rgba(245, 245, 245, 0.5)" },
  burgundy: { bg: "#722F37", onBg: "#FFFFFF", surface: "rgba(114, 47, 55, 0.08)" },
  terracotta: { bg: "#CB4B16", onBg: "#FFFFFF", surface: "rgba(203, 75, 22, 0.08)" },
  brown: { bg: "#6D1600", onBg: "#FFFFFF", surface: "rgba(109, 22, 0, 0.08)" },
  green: { bg: "#2E7D32", onBg: "#FFFFFF", surface: "rgba(46, 125, 50, 0.08)" },
  cream: { bg: "#D2B48C", onBg: "#2C1810", surface: "rgba(210, 180, 140, 0.15)" },
  teal: { bg: "#006064", onBg: "#FFFFFF", surface: "rgba(0, 96, 100, 0.08)" },
  slate: { bg: "#37474F", onBg: "#FFFFFF", surface: "rgba(55, 71, 79, 0.08)" },
  forest: { bg: "#1B5E20", onBg: "#FFFFFF", surface: "rgba(27, 94, 32, 0.08)" },
  pink: { bg: "#AD1457", onBg: "#FFFFFF", surface: "rgba(173, 20, 87, 0.08)" },
  golden: { bg: "#FF8F00", onBg: "#FFFFFF", surface: "rgba(255, 143, 0, 0.08)" },
  burnt: { bg: "#BF360C", onBg: "#FFFFFF", surface: "rgba(191, 54, 12, 0.08)" },
  sage: { bg: "#689F38", onBg: "#FFFFFF", surface: "rgba(104, 159, 56, 0.08)" },
  earth: { bg: "#5D4037", onBg: "#FFFFFF", surface: "rgba(93, 64, 55, 0.08)" },
  leaf: { bg: "#33691E", onBg: "#FFFFFF", surface: "rgba(51, 105, 30, 0.08)" },
  olive: { bg: "#558B2F", onBg: "#FFFFFF", surface: "rgba(85, 139, 47, 0.08)" },
};
const themeFor = (theme: string) =>
  themeColors[theme] || { bg: "#6D1600", onBg: "#FFFFFF", surface: "rgba(109, 22, 0, 0.08)" };
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
    [connection, setConnection] = useState("loading"),
    [activeSection, setActiveSection] = useState<string>("");
  const categoryNavRef = useRef<HTMLElement>(null);
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
            (diet === "vegan"
              ? i.dietary?.vegan
              : diet === "hot"
                ? i.dietary?.hot
                : diet === "pork"
                  ? i.dietary?.pork
                  : false)) &&
          `${i.name} ${i.description} ${s.title}`
            .toLowerCase()
            .includes(query.toLowerCase()),
      ),
    }))
    .filter((s) => s.items.length);
  const total = sections.reduce((n, s) => n + s.items.length, 0);
  const sectionIds = sections.map((s) => s.id).join(",");
  /*
   * Scroll-spy: highlights the category in the side nav that the user is
   * currently scrolling through.
   *
   * Implementation follows MDN Intersection Observer API guidance and
   * established scroll-spy best practices (Bootstrap PR #42557,
   * Flavio Copes, Maxime Heckel):
   *
   * - rootMargin shrinks the viewport to a narrow "activation band" in the
   *   upper portion of the screen so only one section is active at a time.
   * - threshold: 0 fires as soon as any part of the section enters the band
   *   (threshold: 1 breaks on sections taller than the viewport).
   * - A Map tracks which sections are currently intersecting. The active
   *   section is the deepest (last in document order) intersecting one —
   *   IO delivers entries in no guaranteed order, so this is more
   *   deterministic than sorting by intersectionRatio.
   * - When nothing intersects (content gaps), the last active section stays.
   * - A passive scroll listener handles the bottom-of-page edge case where
   *   a short last section never reaches the activation band.
   *
   * Only runs in "Whole menu" mode so single-category views don't fight
   * the click-selected highlight.
   */
  useEffect(() => {
    if (category !== "all") return;
    const sectionEls = Array.from(
      document.querySelectorAll<HTMLElement>("[data-section-id]"),
    );
    if (!sectionEls.length) return;
    const intersecting = new Map<string, boolean>();
    let rafId = 0;
    let pendingActive: string | null = null;
    const updateActive = (id: string) => {
      if (id === pendingActive) return;
      pendingActive = id;
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => setActiveSection(id));
    };
    const pickActive = () => {
      const activeId = sectionEls
        .map((el) => el.getAttribute("data-section-id"))
        .filter((id) => id && intersecting.get(id))
        .pop();
      if (activeId) updateActive(activeId);
    };
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.getAttribute("data-section-id");
          if (id) intersecting.set(id, entry.isIntersecting);
        });
        pickActive();
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 },
    );
    sectionEls.forEach((el) => observer.observe(el));
    let scrollRaf = 0;
    let scrollPending = false;
    const handleScroll = () => {
      if (scrollPending) return;
      scrollPending = true;
      cancelAnimationFrame(scrollRaf);
      scrollRaf = requestAnimationFrame(() => {
        scrollPending = false;
        const atBottom =
          window.scrollY + window.innerHeight >=
          document.documentElement.scrollHeight - 10;
        if (atBottom) {
          const lastId = sectionEls[sectionEls.length - 1].getAttribute(
            "data-section-id",
          );
          if (lastId) updateActive(lastId);
        }
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafId);
      cancelAnimationFrame(scrollRaf);
    };
  }, [category, sectionIds]);
  /*
   * Auto-scroll the horizontal category nav (mobile) so the active
   * category tab is brought into view when the scroll-spy updates.
   * Uses scrollLeft on the nav container directly (not scrollIntoView,
   * which would also scroll the page vertically).
   */
  useEffect(() => {
    if (!activeSection || !categoryNavRef.current) return;
    const nav = categoryNavRef.current;
    const activeBtn = nav.querySelector<HTMLButtonElement>(
      `button[data-cat="${activeSection}"]`,
    );
    if (!activeBtn) return;
    const navRect = nav.getBoundingClientRect();
    const btnRect = activeBtn.getBoundingClientRect();
    const target =
      nav.scrollLeft + (btnRect.left - navRect.left) - nav.clientWidth / 2 + btnRect.width / 2;
    nav.scrollTo({ left: Math.max(0, target), behavior: "smooth" });
  }, [activeSection]);
  const reset = () => {
    setQuery("");
    setCategory("all");
    setDiet("all");
    setActiveSection("");
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
          <a href="#events">Events</a>
          <a href="#visit">Plan something special here</a>
        </nav>
        <a
          className="kh-reserve"
          data-track="contact_click"
          data-track-id="phone"
          data-track-label="Call the Hub"
          href={`tel:${sanitizePhone(menu.social.rsvp)}`}
        >
          <Phone size={14} />
          <span>Call us</span>
          <ArrowUpRight size={16} />
        </a>
      </header>
      <main>
        <Image
          src="/header.jpg"
          alt="Khichini Hub"
          width={1343}
          height={544}
          className="kh-menu-banner"
          priority
        />
        <section
          className="kh-menu-section"
          id="menu"
          data-metric="section_view"
          data-metric-id="menu"
          data-metric-label="Menu"
        >
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
              <SlidersHorizontal size={12} />
              {[
                ["all", "Everything", "all"],
                ["vegan", "Vegan", "vegan"],
                ["hot", "Spicy", "hot"],
                ["pork", "Pork", "pork"],
              ].map(([value, label, cls]) => (
                <button
                  key={value}
                  aria-pressed={diet === value}
                  className={`kh-diet-chip ${diet === value ? "active" : ""} kh-diet-${cls}`}
                  onClick={() => {
                    setDiet(value);
                    track("filter_select", value, label);
                  }}
                >
                  {value === "vegan" && <Leaf size={10} />}
                  {value === "hot" && <Flame size={10} />}
                  {value === "pork" && <span className="kh-diet-dot" />}
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="kh-menu-layout">
            <aside className="kh-categories">
              <span className="kh-kicker">ON THE MENU</span>
              <nav aria-label="Menu categories" ref={categoryNavRef}>
                <button
                  data-cat="all"
                  className={category === "all" ? "active" : ""}
                  aria-pressed={category === "all"}
                  onClick={() => {
                    setCategory("all");
                    setActiveSection("");
                    document
                      .getElementById("menu")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  The whole menu{" "}
                  <span>
                    {available.reduce((n, s) => n + s.items.length, 0)}
                  </span>
                </button>
                {available.map((s) => {
                  const colors = themeFor(s.theme);
                  const isActive = category === s.id || (category === "all" && activeSection === s.id);
                  return (
                    <button
                      key={s.id}
                      data-cat={s.id}
                      aria-pressed={isActive}
                      className={isActive ? "active" : ""}
                      style={
                        isActive
                          ? {
                              backgroundColor: colors.bg,
                              color: colors.onBg,
                              borderColor: colors.bg,
                            }
                          : {
                              borderColor: colors.bg,
                            }
                      }
                      onClick={() => {
                        setCategory("all");
                        setActiveSection(s.id);
                        document
                          .getElementById(`section-${s.id}`)
                          ?.scrollIntoView({ behavior: "smooth" });
                        track(
                          "category_select",
                          s.id,
                          s.title,
                        );
                      }}
                    >
                      {s.title}
                      <span>{s.items.length}</span>
                    </button>
                  );
                })}
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
              {sections.map((s) => {
                const colors = themeFor(s.theme);
                return (
                  <section
                    key={s.id}
                    id={`section-${s.id}`}
                    className="kh-old-section"
                    data-section-id={s.id}
                    data-metric="category_view"
                    data-metric-id={s.id}
                    data-metric-label={s.title}
                  >
                    <div
                      className="kh-old-section-header"
                      style={{ backgroundColor: colors.bg }}
                    >
                      <h3 style={{ color: colors.onBg }}>
                        {s.title}
                      </h3>
                      {s.subtitle && (
                        <p style={{ color: colors.onBg }}>{s.subtitle}</p>
                      )}
                    </div>
                    <div className="kh-old-section-divider" />
                    <div
                      className="kh-old-section-body"
                      style={{ backgroundColor: colors.surface }}
                    >
                      {s.items.map((i) => (
                        <article
                          className="kh-old-item"
                          key={i.id}
                          data-metric="dish_view"
                          data-metric-id={i.id}
                          data-metric-label={i.name}
                        >
                          <div className="kh-old-item-main">
                            <div className="kh-old-item-top">
                              <div className="kh-old-item-name">
                                <h4>{i.name}</h4>
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
                                    {i.dietary?.pork && (
                                      <span>Contains pork</span>
                                    )}
                                  </div>
                                )}
                              </div>
                              <span className="kh-old-price">
                                <span className="kh-old-price-k">K</span>
                                {i.price.toLocaleString("en-MW")}
                              </span>
                            </div>
                            <p>{i.description}</p>
                          </div>
                          {i.photo && (
                            <DishPhoto key={i.photo.url} photo={i.photo} />
                          )}
                        </article>
                      ))}
                    </div>
                  </section>
                );
              })}
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
      <Image
        src="/socials.jpg"
        alt="Follow Khichini Hub on social media"
        width={1200}
        height={400}
        className="kh-socials-banner"
      />
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
