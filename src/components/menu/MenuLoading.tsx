import { MenuHeader } from "./MenuHeader";
import { MenuLink } from "./MenuLink";
import "@/app/menu.css";

export function MenuLoading({ detail = false }: { detail?: boolean }) {
  return (
    <div className="kh-menu">
      <MenuHeader detail={detail} />
      <main className="kh-menu-section kh-menu-skeleton" aria-busy="true" aria-label="Menu">
        <p className="sr-only" role="status">Loading the menu…</p>
        {detail ? <>
          <div className="kh-category-intro">
            <MenuLink className="kh-menu-back" href="/#menu">← All menus</MenuLink>
            <div className="kh-menu-placeholder" aria-hidden="true" />
          </div>
          <div className="kh-loading-toolbar kh-skeleton-surface" aria-hidden="true" />
          <div aria-hidden="true">
            {[0, 1, 2, 3].map((index) => <div className="kh-loading-dish" key={index}>
              <div className="kh-loading-line kh-skeleton-surface" />
              <div className="kh-loading-line kh-loading-description kh-skeleton-surface" />
            </div>)}
          </div>
        </> : <div className="kh-category-grid" aria-hidden="true">
          {Array.from({ length: 12 }, (_, index) => <div className="kh-menu-placeholder" key={index} />)}
        </div>}
      </main>
    </div>
  );
}
