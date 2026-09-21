import Image from "next/image";
import { MenuLink as Link } from "./MenuLink";
import { ArrowUpRight, Phone } from "lucide-react";

export function MenuHeader({ detail = false, phone }: { detail?: boolean; phone?: string }) {
  return (
    <div className={!detail ? "kh-header-image" : undefined}>
      <header className={`kh-header${!detail ? " kh-header-overlay" : ""}`}>
        {detail && <Link href="/" aria-label="Khichini Hub home">
          <Image
            src="/Khichinihublogo.png"
            width={1280}
            height={1280}
            className="kh-logo"
            alt="Khichini Hub"
            preload
            sizes="100px"
          />
        </Link>}
        <nav aria-label="Main navigation">
          <Link href="/#menu">The menu</Link>
          <Link href="/#events">Events</Link>
          <Link href={detail ? "/#plan-something-special" : "#plan-something-special"}>Plan something special here</Link>
        </nav>
        {phone ? (
        <a
          className="kh-reserve"
          href={`tel:${phone.replace(/[^0-9+]/g, "").slice(0, 20)}`}
        >
          <Phone size={14} />
          <span>Call us</span>
          <ArrowUpRight size={16} />
        </a>
        ) : <span className="kh-reserve-placeholder" aria-hidden="true" />}
      </header>
        {!detail && <Image
          src="/header.jpg"
          alt="Khichini Hub"
          width={1343}
          height={544}
          className="kh-menu-banner"
          sizes="100vw"
          preload
        />}
      </div>
  );
}
