"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { MenuData } from "@/data/menuData";
import { publishedMenuSchema, type PublishedMenu } from "@/lib/published-menu-data";
import { menuTypographyStyle } from "@/lib/menu-typography";
import Image from "next/image";
import Link from "next/link";
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
import "@/app/menu.css";
import "@/app/menu-typography.css";
import { CategoryCard, CategoryHeader } from "@/components/menu/CategoryCard";
import { DishPhoto } from "@/components/menu/DishPhoto";
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
const cardTextColor = (background: string) => {
  const channels = background.slice(1).match(/.{2}/g)!.map((hex) => {
    const value = parseInt(hex, 16) / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  const luminance = channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
  return luminance > 0.179 ? "#000000" : "#FFFFFF";
};
const socialLinks: {
  key: keyof MenuData["social"];
  url: (handle: string) => string;
  Icon: typeof FaInstagram;
  label: string;
  socialId: string;
}[] = [
  {
    key: "instagram",
    url: (h) => `https://instagram.com/${h}`,
    Icon: FaInstagram,
    label: "Instagram",
    socialId: "instagram",
  },
  {
    key: "facebook",
    url: (h) => `https://facebook.com/${h}`,
    Icon: FaFacebook,
    label: "Facebook",
    socialId: "facebook",
  },
  {
    key: "tiktok",
    url: (h) => `https://tiktok.com/@${h}`,
    Icon: FaTiktok,
    label: "TikTok",
    socialId: "tiktok",
  },
  {
    key: "twitter",
    url: (h) => `https://x.com/${h}`,
    Icon: FaInstagram,
    label: "X / Twitter",
    socialId: "x",
  },
];
export default function MenuExperience({ categoryId, initialMenu }: { categoryId?: string; initialMenu: PublishedMenu }) {
  const [menu, setMenu] = useState(initialMenu),
    [query, setQuery] = useState(""),
    [diet, setDiet] = useState("all"),
    [connection, setConnection] = useState("live");
  const category = categoryId;
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchToolbarRef = useRef<HTMLDivElement>(null);
  const [editingSearch, setEditingSearch] = useState(false);
  const searching = Boolean(query.trim()) || editingSearch;

  // Account for the actual toolbar height, including wrapped filters and zoom.
  useEffect(() => {
    if (!searching || !searchToolbarRef.current) return;
    const toolbar = searchToolbarRef.current;
    const root = document.documentElement;
    const previous = root.style.scrollPaddingTop;
    const update = () => {
      root.style.scrollPaddingTop = `${toolbar.getBoundingClientRect().height + 12}px`;
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(toolbar);
    return () => {
      observer.disconnect();
      root.style.scrollPaddingTop = previous;
    };
  }, [searching]);
  useEffect(
    () =>
      onSnapshot(
        doc(db, "menu/current"),
        (snapshot) => {
          if (snapshot.exists()) {
            const parsed = publishedMenuSchema.safeParse(snapshot.data());
            if (parsed.success) {
              // A browser cache snapshot must never roll back the server-rendered menu.
              setMenu((current) => parsed.data.revision > current.revision ? parsed.data : current);
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
  const available = menu.sections
    .map((s) => ({ ...s, items: s.items.filter((i) => i.available !== false) }))
    .filter((s) => s.items.length);
  const sections = available
    .filter((s) => s.id === category)
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
  const selectedCategory = menu.sections.find((s) => s.id === categoryId);
  const categoryColors = themeFor(selectedCategory?.theme || "red");
  const reset = () => {
    setEditingSearch(false);
    setQuery("");
    setDiet("all");
  };
  /*
   * Search commit (Enter / keyboard Search): dismiss the virtual keyboard so
   * results are visible. HTML implicit form submission + input.blur() is the
   * web equivalent of Apple's searchBarSearchButtonClicked / resignFirstResponder.
   * Live filtering still updates as the user types.
   */
  const commitSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const field = e.currentTarget.elements.namedItem("q");
    if (field instanceof HTMLElement) field.blur();
  };
  return (
    <div className="kh-menu" id="top" style={menuTypographyStyle(menu.typography)}>
      <a className="kh-skip" href="#menu">
        Skip to menu
      </a>
      <div className={!categoryId ? "kh-header-image" : undefined}>
      <header className={`kh-header${!categoryId ? " kh-header-overlay" : ""}`}>
        {categoryId && <Link href="/" aria-label="Khichini Hub home">
          <Image
            src="/Khichinihublogo.png"
            width={1280}
            height={1280}
            className="kh-logo"
            alt="Khichini Hub"
            priority
            sizes="100px"
          />
        </Link>}
        <nav aria-label="Main navigation">
          <Link href="/#menu">The menu</Link>
          <Link href="/#events">Events</Link>
          <Link href={categoryId ? "/#plan-something-special" : "#plan-something-special"}>Plan something special here</Link>
        </nav>
        <a
          className="kh-reserve"



          href={`tel:${sanitizePhone(menu.social.rsvp)}`}
        >
          <Phone size={14} />
          <span>Call us</span>
          <ArrowUpRight size={16} />
        </a>
      </header>
        {!categoryId && <Image
          src="/header.jpg"
          alt="Khichini Hub"
          width={1343}
          height={544}
          className="kh-menu-banner"
          priority
        />}
      </div>
      <main>
        <section
          className={`kh-menu-section${searching ? " kh-searching" : ""}`}
          id="menu"
        >
          {!categoryId ? (
            <>
              <div className="kh-category-grid">
                {available.map((section) => (
                  <CategoryCard section={section} key={section.id}
                    style={{
                      backgroundColor: themeFor(section.theme).bg,
                      color: cardTextColor(themeFor(section.theme).bg),
                    }}>
                    <h2>{section.title}</h2>
                    {section.subtitle && <p>{section.subtitle}</p>}
                    <span>View menu <ArrowUpRight size={18} /></span>
                  </CategoryCard>
                ))}
              </div>
              {!available.length && <p>Our menus are being updated. Please check back soon.</p>}
            </>
          ) : (
            <>
              <div className="kh-category-intro">
                <Link className="kh-menu-back" href="/#menu">← All menus</Link>
                <CategoryHeader section={selectedCategory} style={{ backgroundColor: categoryColors.bg, color: cardTextColor(categoryColors.bg) }}>
                  <h1>{selectedCategory?.title || (connection === "loading" ? "Loading menu…" : "Menu unavailable")}</h1>
                  {selectedCategory?.subtitle && <p>{selectedCategory.subtitle}</p>}
                </CategoryHeader>
              </div>
          <div className="kh-toolbar" ref={searchToolbarRef}>
            <form className="kh-search" role="search" onSubmit={commitSearch}
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget)) setEditingSearch(false);
              }}
            >
              <Search size={19} />
              <input
                type="search"
                ref={searchInputRef}
                name="q"
                placeholder="Search this menu"
                aria-label="Search dishes"
                enterKeyHint="search"
                inputMode="search"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="none"
                spellCheck={false}
                value={query}
                onFocus={() => {
                  if (query.trim()) setEditingSearch(true);
                }}
                onChange={(e) => {
                  setQuery(e.target.value);
                  if (e.target.value.trim()) setEditingSearch(true);
                }}
              />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingSearch(true);
                    setQuery("");
                    searchInputRef.current?.focus();
                  }}
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </form>
            {diet !== "all" && (
              <span className="kh-search-scope">
                Filter: {diet === "hot" ? "Spicy" : diet === "vegan" ? "Vegan" : "Pork"}
              </span>
            )}
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
          <div className="kh-category-content">
            <div className="kh-dishes">
              <div className={query || diet !== "all" ? "kh-results" : "sr-only"} role="status">
                <span>{total} {total === 1 ? "dish" : "dishes"}</span>
                {(query || diet !== "all") && (
                  <button onClick={reset}>
                    Clear filters <X size={13} />
                  </button>
                )}
              </div>
              {connection === "fallback" && (
                <p className="kh-connection">
                  Showing the last loaded menu. Please confirm current prices and
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
                  >
                    <div
                      className="kh-old-section-body"
                      style={{ borderTop: `3px solid ${colors.bg}` }}
                    >
                      {s.items.map((i) => (
                        <article
                          className="kh-old-item"
                          key={i.id}
                        >
                          <div className="kh-old-item-main">
                            <div className="kh-old-item-top">
                              <div className="kh-old-item-name">
                                <h2>{i.name}</h2>
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
                              <span className="kh-old-price" style={{ color: cardTextColor(colors.bg) === "#FFFFFF" ? colors.bg : `color-mix(in srgb, ${colors.bg}, black 65%)` }}>
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
                  <h2>No dishes found.</h2>
                  <p>Try a different search or choose another menu.</p>
                  {(query || diet !== "all") && <button className="kh-button" onClick={reset}>
                    Clear filters <X size={16} />
                  </button>}
                  <Link className="kh-menu-back" href="/#menu">Explore all menus →</Link>
                </div>
              )}
            </div>
          </div>
            </>
          )}
        </section>
        {!categoryId && <PublicEvents phone={menu.social.rsvp} />}
      </main>
      {!categoryId && <Image
        id="plan-something-special"
        src="/socials.jpg"
        alt="Follow Khichini Hub on social media"
        width={1200}
        height={400}
        className="kh-socials-banner"
      />}
      <footer className="kh-footer">
        {!categoryId && <>
        <div>
          <Image
            src="/Khichinihublogo.png"
            alt="Khichini Hub"
            width={1280}
            height={1280}
            sizes="90px"
          />
        </div>
        <div className="kh-socials">
          {socialLinks.map(({ key, url, Icon, label, socialId }) => {
            const handle = socialHandle(menu.social[key]);
            if (!handle) return null;
            return (
              <a
                key={key}



                aria-label={label}
                target="_blank"
                rel="noreferrer"
                href={url(handle)}
              >
                {socialId === "x" ? "𝕏" : <Icon />}
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
        </>}
        <a href="#top">Back to top ↑</a>
      </footer>
    </div>
  );
}
