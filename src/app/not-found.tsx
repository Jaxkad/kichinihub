import Link from "next/link";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        fontFamily: "system-ui, Arial, sans-serif",
        background: "#fbf7ee",
        color: "#332820",
        padding: "24px",
      }}
    >
      <div style={{ maxWidth: 420, textAlign: "center" }}>
        <h1
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "clamp(32px, 8vw, 48px)",
            color: "#672c28",
            margin: "0 0 16px",
          }}
        >
          Page not found.
        </h1>
        <p style={{ color: "#746458", fontSize: 15, lineHeight: 1.6 }}>
          {"The page you're looking for doesn't exist or has moved."}
        </p>
        <Link
          href="/"
          style={{
            display: "inline-block",
            marginTop: 24,
            padding: "12px 24px",
            borderRadius: 4,
            background: "#672c28",
            color: "#fff8e9",
            fontSize: 14,
            textDecoration: "none",
          }}
        >
          Back to the menu
        </Link>
      </div>
    </div>
  );
}
