"use client";
import Link from "next/link";
import { DishPhotoEditor } from "@/components/menu/DishPhotoEditor";
import { Insights } from "@/components/analytics/Insights";
import { EventsManager } from "@/components/events/EventsManager";
import { CalendarDays } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  User,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { MenuData, MenuItem, MenuSection } from "@/data/menuData";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpRight,
  BarChart3,
  BookOpen,
  Check,
  ChevronRight,
  Download,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  Mail,
  MessageCircle,
  Phone,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import "./admin.css";

type Menu = MenuData & { revision: number; updatedAt?: string };
type Member = {
  uid?: string;
  displayName: string;
  email: string;
  role: string;
  disabled: boolean;
  password?: string;
  lastSignIn?: string;
};
type Activity = { id: string; action: string; actor: string; at: string };
const money = (n: number) => `K ${Math.round(n).toLocaleString("en-MW")}`;
const tabs = [
  ["Overview", LayoutDashboard],
  ["Menu library", BookOpen],
  ["Team & access", Users],
  ["Settings", Settings],
  ["Events", CalendarDays],
  ["Audience insights", BarChart3],
  ["Help", LifeBuoy],
] as const;
export default function Admin() {
  const [user, setUser] = useState<User | null>(null),
    [ready, setReady] = useState(false),
    [role, setRole] = useState(""),
    [tab, setTab] = useState("Overview");
  const [menu, setMenu] = useState<Menu | null>(null),
    [dirty, setDirty] = useState(false),
    [busy, setBusy] = useState(false),
    [notice, setNotice] = useState(""),
    [error, setError] = useState("");
  const [members, setMembers] = useState<Member[]>([]),
    [pageToken, setPageToken] = useState<string | undefined>(),
    [activity, setActivity] = useState<Activity[]>([]);
  const [query, setQuery] = useState(""),
    [category, setCategory] = useState("all"),
    [filter, setFilter] = useState("all");
  const [item, setItem] = useState<(MenuItem & { sectionId: string }) | null>(
      null,
    ),
    [section, setSection] = useState<MenuSection | null>(null),
    [member, setMember] = useState<Member | null>(null);
  const modalOpen = !!(item || section || member);
  useEffect(() => {
    if (!modalOpen) return;
    const previous = document.activeElement as HTMLElement | null;
    const dialog = document.querySelector<HTMLElement>('[role="dialog"]');
    const focusable = () =>
      Array.from(
        dialog?.querySelectorAll<HTMLElement>(
          "button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])",
        ) || [],
      );
    focusable()[0]?.focus();
    const trap = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const nodes = focusable();
      const first = nodes[0],
        last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", trap);
    return () => {
      document.removeEventListener("keydown", trap);
      previous?.focus();
    };
  }, [modalOpen]);
  const [email, setEmail] = useState(""),
    [password, setPassword] = useState("");
  useEffect(
    () =>
      onAuthStateChanged(auth, async (u) => {
        setUser(u);
        setMenu(null);
        setRole("");
        setDirty(false);
        setMembers([]);
        setActivity([]);
        try {
          if (u)
            setRole(String((await u.getIdTokenResult(true)).claims.role || ""));
        } catch {
          setError("Could not verify your access. Please sign in again.");
        } finally {
          setReady(true);
        }
      }),
    [],
  );
  const api = useCallback(
    async (path: string, method = "GET", body?: unknown) => {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch(`/api/admin/${path}`, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        ...(body ? { body: JSON.stringify(body) } : {}),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed.");
      return data;
    },
    [],
  );
  const run = async (fn: () => Promise<void>) => {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await fn();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };
  useEffect(() => {
    if (!user || !role) return;
    let active = true;
    Promise.all([api("menu"), api("activity")])
      .then(([m, a]) => {
        if (active) {
          setMenu(m);
          setActivity(a);
        }
      })
      .catch((e) => {
        if (active) setError(e.message);
      });
    return () => {
      active = false;
    };
  }, [user, role, api]);
  useEffect(() => {
    if (tab !== "Team & access" || role !== "admin") return;
    let active = true;
    api("users")
      .then((d) => {
        if (active) {
          setMembers(d.users);
          setPageToken(d.pageToken);
        }
      })
      .catch((e) => {
        if (active) setError(e.message);
      });
    return () => {
      active = false;
    };
  }, [tab, role, api]);
  useEffect(() => {
    const prevent = (e: BeforeUnloadEvent) => {
      if (dirty) e.preventDefault();
    };
    window.addEventListener("beforeunload", prevent);
    return () => window.removeEventListener("beforeunload", prevent);
  }, [dirty]);
  const edit = (next: Menu) => {
    setMenu(next);
    setDirty(true);
    setNotice("");
  };
  const publish = () =>
    run(async () => {
      if (!menu) return;
      const result = await api("menu", "PUT", menu);
      setMenu({
        ...menu,
        revision: result.revision,
        updatedAt: new Date().toISOString(),
      });
      setDirty(false);
      setNotice("Your menu is published. Customers can see the changes now.");
      try {
        setActivity(await api("activity"));
      } catch {
        /* Publishing succeeded even if activity cannot refresh. */
      }
    });
  const canEdit = role === "admin" || role === "editor";
  const all =
    menu?.sections.flatMap((s) =>
      s.items.map((i) => ({ ...i, sectionId: s.id, sectionTitle: s.title })),
    ) || [];
  const available = all.filter((i) => i.available !== false).length;
  const rows = all.filter(
    (i) =>
      (category === "all" || i.sectionId === category) &&
      (filter === "all" ||
        (filter === "available"
          ? i.available !== false
          : i.available === false)) &&
      `${i.name} ${i.description}`.toLowerCase().includes(query.toLowerCase()),
  );
  const logout = () => {
    if (!dirty || window.confirm("Discard unpublished changes and sign out?"))
      void run(async () => {
        await signOut(auth);
      });
  };
  const download = () => {
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(menu, null, 2)], { type: "application/json" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "khichini-menu.json";
    a.click();
    URL.revokeObjectURL(url);
  };
  if (!ready)
    return (
      <div className="admin login">
        <p>Opening your workspace…</p>
      </div>
    );
  if (!user)
    return (
      <div className="admin login">
        <div className="login-story">
          <Link href="/" className="brand">
            <Image
              className="brand-logo"
              src="/Khichinihublogo.png"
              alt="Khichini Hub"
              width={1280}
              height={1280}
              sizes="(max-width: 850px) 120px, 150px"
              priority
            />
          </Link>
          <div>
            <span className="eyebrow">YOUR BUSINESS, AT A GLANCE</span>
            <h1>
              Good food.
              <br />
              Great management.
            </h1>
            <p>A little less admin. A lot more room for what you love.</p>
          </div>
          <small>KHICHINI HUB · BUSINESS WORKSPACE</small>
        </div>
        <div className="login-side">
          <form
            className="login-form"
            onSubmit={(e) => {
              e.preventDefault();
              void run(async () => {
                await signInWithEmailAndPassword(auth, email, password);
              });
            }}
          >
            <ShieldCheck size={30} />
            <h2>Welcome back.</h2>
            <p>Sign in to manage your menu and your team.</p>
            <label>
              Email address
              <input
                type="email"
                required
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <label>
              Password
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            {error && (
              <div className="alert error" role="alert">
                {error}
              </div>
            )}
            {notice && (
              <div className="alert" role="status">
                {notice}
              </div>
            )}
            <button className="primary" disabled={busy}>
              {busy ? "Signing in…" : "Sign in"} <ChevronRight size={17} />
            </button>
            <button
              type="button"
              className="text-button"
              disabled={busy}
              onClick={() =>
                void run(async () => {
                  if (!email)
                    throw new Error("Enter your email address first.");
                  await sendPasswordResetEmail(auth, email);
                  setNotice(
                    "If this account exists, a password reset email will arrive shortly.",
                  );
                })
              }
            >
              Forgot password?
            </button>
            <Link href="/">Back to the public menu ↗</Link>
          </form>
        </div>
      </div>
    );
  return (
    <div className="admin workspace">
      <aside className="sidebar">
        <a href="/admin" className="brand">
          <Image
            className="brand-logo"
            src="/Khichinihublogo.png"
            alt="Khichini Hub"
            width={1280}
            height={1280}
            sizes="(max-width: 850px) 120px, 150px"
            priority
          />
        </a>
        <div className="workspace-label">BUSINESS WORKSPACE</div>
        <nav>
          {tabs
            .filter(([name]) => name !== "Team & access" || role === "admin")
            .map(([name, Icon]) => (
              <button
                key={name}
                className={tab === name ? "selected" : ""}
                onClick={() => setTab(name)}
              >
                <Icon size={19} />
                {name}
              </button>
            ))}
        </nav>
        <div className="sidebar-bottom">
          <a href="/" target="_blank" rel="noreferrer">
            <ArrowUpRight size={18} />
            View public menu
          </a>
          <div className="profile">
            <span>{(user.email || "K")[0].toUpperCase()}</span>
            <div>
              <b>{user.displayName || "Your account"}</b>
              <small>{role || "Access pending"}</small>
            </div>
            <button aria-label="Sign out" onClick={logout}>
              <LogOut size={17} />
            </button>
          </div>
        </div>
      </aside>
      <div className="workspace-main">
        <header className="topbar">
          <span>
            Khichini Hub <span className="crumb">/ {tab}</span>
          </span>
          <span className="status">
            <i />
            {dirty ? "Unpublished changes" : "Business workspace"}
          </span>
        </header>
        <main className="admin-main">
          <div className="page-heading">
            <div>
              <div className="eyebrow">LET’S MAKE IT A GOOD DAY</div>
              <h1>{tab === "Overview" ? "Your business. In focus." : tab}</h1>
              <p>
                {tab === "Overview"
                  ? "Everything you need to keep the kitchen moving."
                  : tab === "Menu library"
                    ? "Make your next great menu. One detail at a time."
                    : tab === "Events"
                      ? "Bring people together. Share what’s happening at the Hub."
                      : tab === "Team & access"
                        ? "The right people. The right permissions."
                        : tab === "Help"
                          ? "Something not working? We're here to help."
                          : "Keep your customer-facing details up to date."}
              </p>
            </div>
            {canEdit &&
              menu &&
              tab !== "Events" &&
              tab !== "Audience insights" &&
              tab !== "Help" && (
                <button
                  className="primary"
                  disabled={busy || (!dirty && menu.revision > 0)}
                  onClick={publish}
                >
                  <Check size={17} />
                  {busy
                    ? "Saving…"
                    : menu.revision === 0
                      ? "Publish initial menu"
                      : dirty
                        ? "Publish changes"
                        : "All changes published"}
                </button>
              )}
          </div>
          {error && (
            <div className="alert error" role="alert">
              {error}
              <button onClick={() => setError("")} aria-label="Dismiss error">
                <X size={17} />
              </button>
            </div>
          )}
          {notice && (
            <div className="alert" role="status">
              {notice}
            </div>
          )}
          {!role ? (
            <section className="panel">
              <ShieldCheck />
              <h2>Access needs to be granted</h2>
              <p>
                Ask your administrator to assign your account a workspace role,
                then sign out and sign in again.
              </p>
            </section>
          ) : !menu ? (
            <section className="panel">
              <h2>
                {error ? "Workspace unavailable" : "Loading your workspace…"}
              </h2>
              <p>
                {error
                  ? "Check your server connection and Firebase setup."
                  : "Getting your latest menu and activity."}
              </p>
              <button
                onClick={() =>
                  void run(async () => {
                    setMenu(await api("menu"));
                    setActivity(await api("activity"));
                  })
                }
              >
                Retry connection
              </button>
            </section>
          ) : (
            <>
              {tab === "Overview" && (
                <>
                  <section className="welcome-banner">
                    <div>
                      <span className="eyebrow">A FRESH LOOK AT YOUR MENU</span>
                      <h2>
                        Small updates.
                        <br />A better guest experience.
                      </h2>
                      <p>
                        Keep your prices current and your favourites ready to
                        order.
                      </p>
                      <button onClick={() => setTab("Menu library")}>
                        Manage your menu <ArrowUpRight size={18} />
                      </button>
                    </div>
                    <div className="plate-art" aria-hidden="true">
                      <div className="plate">
                        <span>
                          made
                          <br />
                          <em>with care.</em>
                        </span>
                      </div>
                      <span className="art-caption">THE KHICHINI WAY</span>
                    </div>
                  </section>
                  <div className="section-heading">
                    <h2>Menu at a glance</h2>
                    <span>
                      {dirty ? "Includes unpublished edits" : "Current menu"} ·
                      MWK
                    </span>
                  </div>
                  <div className="metric-grid">
                    {[
                      ["Menu items", all.length, "Across your whole menu"],
                      ["Available now", available, "Visible to your customers"],
                      [
                        "Unavailable",
                        all.length - available,
                        "Hidden from the public menu",
                      ],
                      [
                        "Average price",
                        money(
                          all.length
                            ? all.reduce((a, i) => a + i.price, 0) / all.length
                            : 0,
                        ),
                        "Across all menu items",
                      ],
                    ].map(([label, value, hint]) => (
                      <article className="metric" key={label}>
                        <span>{label}</span>
                        <strong>{value}</strong>
                        <small>{hint}</small>
                      </article>
                    ))}
                  </div>
                  <div className="overview-grid">
                    <section className="panel">
                      <div className="section-heading">
                        <h2>Category breakdown</h2>
                        <BookOpen size={19} />
                      </div>
                      <p className="muted">How your menu comes together</p>
                      <div className="category-bars">
                        {menu.sections.map((s) => (
                          <div className="category-bar" key={s.id}>
                            <div>
                              <span>{s.title}</span>
                              <b>{s.items.length}</b>
                            </div>
                            <div className="bar-track">
                              <i
                                style={{
                                  width: `${(s.items.length / Math.max(1, ...menu.sections.map((c) => c.items.length))) * 100}%`,
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                    <div>
                      <section className="panel next-steps">
                        <span className="eyebrow">A LITTLE HOUSEKEEPING</span>
                        <h2>Ready for service?</h2>
                        <button
                          onClick={() => {
                            setFilter("hidden");
                            setTab("Menu library");
                          }}
                        >
                          <span>
                            <b>Review unavailable items</b>
                            <small>
                              {all.length - available} items to check
                            </small>
                          </span>
                          <ChevronRight size={20} />
                        </button>
                        <button onClick={() => setTab("Settings")}>
                          <span>
                            <b>Check your contact details</b>
                            <small>Help guests find and reach you</small>
                          </span>
                          <ChevronRight size={20} />
                        </button>
                        <div className="insight">
                          <BarChart3 size={22} />
                          <p>
                            <b>What to measure next</b>
                            <br />
                            Daily sales, order count, and average order value
                            are useful next steps once an ordering or payment
                            system is connected.
                          </p>
                        </div>
                      </section>
                      <section className="panel activity">
                        <h2>Recent publishing activity</h2>
                        {activity.length ? (
                          activity.slice(0, 5).map((a) => (
                            <div className="activity-row" key={a.id}>
                              <span className="activity-dot" />
                              <div>
                                <b>{a.action}</b>
                                <small>
                                  {a.actor} ·{" "}
                                  {new Date(a.at).toLocaleDateString()}
                                </small>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="muted">
                            Your first menu publication will appear here.
                          </p>
                        )}
                      </section>
                    </div>
                  </div>
                </>
              )}
              {tab === "Menu library" && (
                <>
                  <div className="library-actions">
                    <div className="tab-label">
                      All items <span>{all.length}</span>
                    </div>
                    <div>
                      <button onClick={download}>
                        <Download size={16} />
                        Export menu
                      </button>
                      {canEdit && (
                        <>
                          <button
                            onClick={() =>
                              setSection({
                                id: crypto.randomUUID(),
                                title: "",
                                subtitle: "",
                                theme: "cream",
                                items: [],
                              })
                            }
                          >
                            <Plus size={17} />
                            Category
                          </button>
                          <button
                            className="primary"
                            disabled={!menu.sections.length}
                            onClick={() =>
                              setItem({
                                id: crypto.randomUUID(),
                                name: "",
                                description: "",
                                price: 0,
                                available: true,
                                sectionId: menu.sections[0].id,
                              })
                            }
                          >
                            <Plus size={17} />
                            Add item
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  <section className="panel library-panel">
                    <div className="filters">
                      <label className="search">
                        <Search size={18} />
                        <input
                          aria-label="Search menu"
                          placeholder="Search items…"
                          value={query}
                          onChange={(e) => setQuery(e.target.value)}
                        />
                      </label>
                      <select
                        aria-label="Filter category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                      >
                        <option value="all">All categories</option>
                        {menu.sections.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.title}
                          </option>
                        ))}
                      </select>
                      <select
                        aria-label="Filter availability"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                      >
                        <option value="all">All statuses</option>
                        <option value="available">Available</option>
                        <option value="hidden">Unavailable</option>
                      </select>
                    </div>
                    <div className="table-scroll">
                      <table>
                        <thead>
                          <tr>
                            <th>Item</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Availability</th>
                            <th>
                              <span className="sr-only">Actions</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {rows.map((i) => (
                            <tr key={i.id}>
                              <td data-label="Item">
                                <div className="item-cell">
                                  {i.photo ? (
                                    <Image
                                      unoptimized
                                      src={i.photo.url}
                                      alt={i.photo.alt}
                                      width={40}
                                      height={40}
                                      style={{
                                        objectFit: "cover",
                                        borderRadius: 7,
                                        width: 40,
                                        height: 40,
                                      }}
                                    />
                                  ) : (
                                    <span className="item-monogram">
                                      {i.name.slice(0, 1)}
                                    </span>
                                  )}
                                  <div>
                                    <b>{i.name}</b>
                                    <small>
                                      {[
                                        i.dietary?.vegan && "Vegan",
                                        i.dietary?.hot && "Hot",
                                        i.dietary?.pork && "Pork",
                                      ]
                                        .filter(Boolean)
                                        .join(" · ") || i.description}
                                    </small>
                                  </div>
                                </div>
                              </td>
                              <td data-label="Category">{i.sectionTitle}</td>
                              <td data-label="Price" className="price">
                                {money(i.price)}
                              </td>
                              <td data-label="Availability">
                                <button
                                  disabled={!canEdit}
                                  className={`pill ${i.available === false ? "off" : ""}`}
                                  onClick={() =>
                                    edit({
                                      ...menu,
                                      sections: menu.sections.map((s) => ({
                                        ...s,
                                        items: s.items.map((x) =>
                                          x.id === i.id
                                            ? {
                                                ...x,
                                                available:
                                                  i.available === false,
                                              }
                                            : x,
                                        ),
                                      })),
                                    })
                                  }
                                >
                                  <i />
                                  {i.available === false
                                    ? "Unavailable"
                                    : "Available"}
                                </button>
                              </td>
                              <td data-label="Actions">
                                {canEdit && (
                                  <button
                                    className="text-button"
                                    onClick={() => setItem(i)}
                                  >
                                    Edit
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {!rows.length && (
                        <div className="empty">
                          No items match your filters.
                        </div>
                      )}
                    </div>
                    <div className="table-footer">
                      {rows.length} items · Prices in Malawian kwacha (MWK)
                    </div>
                  </section>
                  <section className="panel">
                    <div className="section-heading">
                      <h2>Organise your categories</h2>
                      <span>{menu.sections.length} categories</span>
                    </div>
                    {menu.sections.map((s, index) => (
                      <div className="category-manage" key={s.id}>
                        <div>
                          <b>{s.title}</b>
                          <small>
                            {s.items.length} items · {s.theme} theme
                          </small>
                        </div>
                        {canEdit && (
                          <div>
                            <button
                              aria-label={`Move ${s.title} up`}
                              disabled={index === 0}
                              onClick={() => {
                                const sections = [...menu.sections];
                                [sections[index - 1], sections[index]] = [
                                  sections[index],
                                  sections[index - 1],
                                ];
                                edit({ ...menu, sections });
                              }}
                            >
                              <ArrowUp size={16} />
                            </button>
                            <button
                              aria-label={`Move ${s.title} down`}
                              disabled={index === menu.sections.length - 1}
                              onClick={() => {
                                const sections = [...menu.sections];
                                [sections[index + 1], sections[index]] = [
                                  sections[index],
                                  sections[index + 1],
                                ];
                                edit({ ...menu, sections });
                              }}
                            >
                              <ArrowDown size={16} />
                            </button>
                            <button onClick={() => setSection(s)}>Edit</button>
                          </div>
                        )}
                      </div>
                    ))}
                  </section>
                </>
              )}
              {tab === "Team & access" && role === "admin" && (
                <>
                  <div className="library-actions">
                    <p>
                      Administrators manage everything. Editors manage menus.
                      Viewers can only read.
                    </p>
                    <button
                      className="primary"
                      onClick={() =>
                        setMember({
                          displayName: "",
                          email: "",
                          role: "editor",
                          disabled: false,
                          password: "",
                        })
                      }
                    >
                      <Plus size={17} />
                      Add user
                    </button>
                  </div>
                  <section className="panel table-scroll">
                    <table>
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Role</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {members.map((m) => (
                          <tr key={m.uid}>
                            <td>
                              <b>{m.displayName || "Unnamed user"}</b>
                            </td>
                            <td>{m.email}</td>
                            <td>{m.role}</td>
                            <td>
                              <span
                                className={`pill ${m.disabled ? "off" : ""}`}
                              >
                                {m.disabled ? "Disabled" : "Active"}
                              </span>
                            </td>
                            <td>
                              <button onClick={() => setMember(m)}>
                                Manage
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {!members.length && (
                      <p className="empty">No users loaded.</p>
                    )}
                    {pageToken && (
                      <button
                        disabled={busy}
                        onClick={() =>
                          void run(async () => {
                            const d = await api(
                              `users?pageToken=${encodeURIComponent(pageToken)}`,
                            );
                            setMembers([...members, ...d.users]);
                            setPageToken(d.pageToken);
                          })
                        }
                      >
                        Load more users
                      </button>
                    )}
                  </section>
                </>
              )}
              {tab === "Audience insights" && <Insights api={api} />}
              {tab === "Events" && (
                <EventsManager api={api} canEdit={canEdit} />
              )}
              {tab === "Settings" && (
                <section className="panel settings-panel">
                  <h2>Contact & social profiles</h2>
                  <p className="muted">
                    Enter social usernames (not full URLs). These details appear
                    on your public menu. Save with “Publish changes”.
                  </p>
                  {Object.entries(menu.social).map(([key, value]) => (
                    <label key={key}>
                      {key === "rsvp"
                        ? "Reservation phone number"
                        : key === "twitter"
                          ? "X / Twitter"
                          : key.charAt(0).toUpperCase() + key.slice(1)}
                      <input
                        disabled={!canEdit}
                        value={value}
                        onChange={(e) =>
                          edit({
                            ...menu,
                            social: { ...menu.social, [key]: e.target.value },
                          })
                        }
                      />
                    </label>
                  ))}
                  <div className="insight">
                    <ShieldCheck size={24} />
                    <p>
                      Access is checked securely for every change. Only
                      administrators can add, disable, or delete accounts.
                    </p>
                  </div>
                </section>
              )}
              {tab === "Help" && (
                <section className="panel help-panel">
                  <h2>Need a hand?</h2>
                  <p className="muted">
                    If something isn&apos;t working the way it should, reach out
                    to Jackson and he&apos;ll get you sorted.
                  </p>
                  <div className="help-contact">
                    <div className="help-avatar">JK</div>
                    <div className="help-person">
                      <b>Jackson Kadyampakeni</b>
                      <small>Your support contact person from 25 Points</small>
                    </div>
                  </div>
                  <div className="help-actions">
                    <a
                      className="help-card help-whatsapp"
                      href="https://wa.me/265993202282"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <MessageCircle size={22} />
                      <div>
                        <b>Chat on WhatsApp</b>
                        <small>+265 993 202 282</small>
                      </div>
                      <ArrowUpRight size={18} />
                    </a>
                    <a
                      className="help-card help-call"
                      href="tel:+265993202282"
                    >
                      <Phone size={22} />
                      <div>
                        <b>Call directly</b>
                        <small>+265 993 202 282</small>
                      </div>
                      <ArrowUpRight size={18} />
                    </a>
                    <a
                      className="help-card help-email"
                      href="mailto:jakkadya@outlook.com"
                    >
                      <Mail size={22} />
                      <div>
                        <b>Send an email</b>
                        <small>jakkadya@outlook.com</small>
                      </div>
                      <ArrowUpRight size={18} />
                    </a>
                  </div>
                  <div className="insight">
                    <LifeBuoy size={24} />
                    <p>
                      <b>Before you reach out</b>
                      <br />
                      Try signing out and back in, or refreshing the page.
                      Most hiccups resolve themselves with a clean session.
                    </p>
                  </div>
                </section>
              )}
            </>
          )}
          <footer className="admin-footer">
            KHICHINI HUB <span>A little more time for the good stuff.</span>
          </footer>
        </main>
      </div>
      {item && menu && (
        <div className="modal-backdrop">
          <form
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="item-title"
            onSubmit={(e) => {
              e.preventDefault();
              if (busy) return;
              const { sectionId, ...data } = item;
              edit({
                ...menu,
                sections: menu.sections.map((s) => ({
                  ...s,
                  items:
                    s.id === sectionId
                      ? s.items.some((i) => i.id === data.id)
                        ? s.items.map((i) => (i.id === data.id ? data : i))
                        : [...s.items, data]
                      : s.items.filter((i) => i.id !== data.id),
                })),
              });
              setItem(null);
            }}
          >
            <div className="section-heading">
              <h2 id="item-title">Menu item</h2>
              <button
                type="button"
                disabled={busy}
                aria-label="Close item editor"
                onClick={() => setItem(null)}
              >
                <X />
              </button>
            </div>
            <label>
              Item name
              <input
                autoFocus
                required
                maxLength={160}
                value={item.name}
                onChange={(e) => setItem({ ...item, name: e.target.value })}
              />
            </label>
            <label>
              Description
              <textarea
                maxLength={1000}
                value={item.description}
                onChange={(e) =>
                  setItem({ ...item, description: e.target.value })
                }
              />
            </label>
            <div className="form-grid">
              <label>
                Price (MWK)
                <input
                  type="number"
                  min="0"
                  max="100000000"
                  step="0.01"
                  required
                  value={item.price}
                  onChange={(e) =>
                    setItem({ ...item, price: Number(e.target.value) })
                  }
                />
              </label>
              <label>
                Category
                <select
                  value={item.sectionId}
                  onChange={(e) =>
                    setItem({ ...item, sectionId: e.target.value })
                  }
                >
                  {menu.sections.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <DishPhotoEditor
              photo={item.photo}
              name={item.name}
              onBusy={setBusy}
              onChange={(photo) =>
                setItem((current) => (current ? { ...current, photo } : null))
              }
            />
            <div className="checks">
              {(["vegan", "hot", "pork"] as const).map((key) => (
                <label key={key}>
                  <input
                    type="checkbox"
                    checked={!!item.dietary?.[key]}
                    onChange={(e) =>
                      setItem({
                        ...item,
                        dietary: { ...item.dietary, [key]: e.target.checked },
                      })
                    }
                  />
                  {key}
                </label>
              ))}
              <label>
                <input
                  type="checkbox"
                  checked={item.available !== false}
                  onChange={(e) =>
                    setItem({ ...item, available: e.target.checked })
                  }
                />
                Available
              </label>
            </div>
            <div className="modal-actions">
              <button
                type="button"
                className="danger"
                disabled={busy}
                onClick={() => {
                  if (window.confirm(`Delete “${item.name}” from the menu?`)) {
                    edit({
                      ...menu,
                      sections: menu.sections.map((s) => ({
                        ...s,
                        items: s.items.filter((i) => i.id !== item.id),
                      })),
                    });
                    setItem(null);
                  }
                }}
              >
                Delete item
              </button>
              <button className="primary" disabled={busy}>
                {busy ? "Uploading photo…" : "Save to draft"}
              </button>
            </div>
          </form>
        </div>
      )}
      {section && menu && (
        <div className="modal-backdrop">
          <form
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="category-title"
            onSubmit={(e) => {
              e.preventDefault();
              edit({
                ...menu,
                sections: menu.sections.some((s) => s.id === section.id)
                  ? menu.sections.map((s) =>
                      s.id === section.id ? section : s,
                    )
                  : [...menu.sections, section],
              });
              setSection(null);
            }}
          >
            <div className="section-heading">
              <h2 id="category-title">Category</h2>
              <button
                type="button"
                aria-label="Close category editor"
                onClick={() => setSection(null)}
              >
                <X />
              </button>
            </div>
            <label>
              Title
              <input
                autoFocus
                required
                value={section.title}
                maxLength={160}
                onChange={(e) =>
                  setSection({ ...section, title: e.target.value })
                }
              />
            </label>
            <label>
              Subtitle
              <textarea
                value={section.subtitle || ""}
                maxLength={1000}
                onChange={(e) =>
                  setSection({ ...section, subtitle: e.target.value })
                }
              />
            </label>
            <label>
              Colour theme
              <select
                value={section.theme}
                onChange={(e) =>
                  setSection({
                    ...section,
                    theme: e.target.value as MenuSection["theme"],
                  })
                }
              >
                {[
                  "red",
                  "light",
                  "brown",
                  "green",
                  "cream",
                  "burgundy",
                  "terracotta",
                  "teal",
                  "slate",
                  "forest",
                ].map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </label>
            <div className="modal-actions">
              <button
                className="danger"
                type="button"
                onClick={() => {
                  if (
                    window.confirm(
                      `Delete this category and all ${section.items.length} items?`,
                    )
                  ) {
                    edit({
                      ...menu,
                      sections: menu.sections.filter(
                        (s) => s.id !== section.id,
                      ),
                    });
                    setSection(null);
                  }
                }}
              >
                Delete category
              </button>
              <button className="primary" disabled={busy}>
                {busy ? "Uploading photo…" : "Save to draft"}
              </button>
            </div>
          </form>
        </div>
      )}
      {member && (
        <div className="modal-backdrop">
          <form
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="member-title"
            onSubmit={(e) => {
              e.preventDefault();
              void run(async () => {
                await api("users", member.uid ? "PUT" : "POST", member);
                const d = await api("users");
                setMembers(d.users);
                setPageToken(d.pageToken);
                setMember(null);
                setNotice("User account saved.");
              });
            }}
          >
            <div className="section-heading">
              <h2 id="member-title">
                {member.uid ? "Manage user" : "Add user"}
              </h2>
              <button
                disabled={busy}
                type="button"
                aria-label="Close user editor"
                onClick={() => setMember(null)}
              >
                <X />
              </button>
            </div>
            {error && (
              <div role="alert" className="alert error">
                {error}
              </div>
            )}
            <label>
              Full name
              <input
                autoFocus
                required
                maxLength={100}
                value={member.displayName}
                onChange={(e) =>
                  setMember({ ...member, displayName: e.target.value })
                }
              />
            </label>
            <label>
              Email
              <input
                type="email"
                required
                value={member.email}
                onChange={(e) =>
                  setMember({ ...member, email: e.target.value })
                }
              />
            </label>
            {!member.uid && (
              <label>
                Temporary password (12+ characters)
                <input
                  type="password"
                  required
                  minLength={12}
                  maxLength={128}
                  autoComplete="new-password"
                  value={member.password}
                  onChange={(e) =>
                    setMember({ ...member, password: e.target.value })
                  }
                />
              </label>
            )}
            <label>
              Access role
              <select
                disabled={member.uid === user.uid}
                value={member.role}
                onChange={(e) => setMember({ ...member, role: e.target.value })}
              >
                <option value="admin">Administrator — full access</option>
                <option value="editor">Editor — manage the menu</option>
                <option value="viewer">Viewer — read only</option>
              </select>
            </label>
            <label className="check">
              <input
                type="checkbox"
                disabled={member.uid === user.uid}
                checked={member.disabled}
                onChange={(e) =>
                  setMember({ ...member, disabled: e.target.checked })
                }
              />
              Disable this account
            </label>
            <div className="modal-actions">
              {member.uid && (
                <button
                  type="button"
                  className="danger"
                  disabled={busy || member.uid === user.uid}
                  onClick={() => {
                    if (
                      window.confirm(
                        `Permanently delete ${member.email}? They will lose access immediately.`,
                      )
                    )
                      void run(async () => {
                        await api("users", "DELETE", { uid: member.uid });
                        setMembers(members.filter((m) => m.uid !== member.uid));
                        setMember(null);
                        setNotice("User deleted.");
                      });
                  }}
                >
                  Delete user
                </button>
              )}
              <button className="primary" disabled={busy}>
                {busy ? "Saving…" : "Save user"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
