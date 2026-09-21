import "@/app/menu.css";

export function MenuLoading({ detail = false }: { detail?: boolean }) {
  return (
    <main className="kh-menu kh-menu-loading" aria-busy="true" aria-label="Menu">
      <p role="status">Loading the menu…</p>
      <div className={detail ? "kh-loading-detail" : "kh-category-grid"} aria-hidden="true">
        {Array.from({ length: detail ? 1 : 6 }, (_, index) => <div className="kh-menu-placeholder" key={index} />)}
      </div>
    </main>
  );
}
