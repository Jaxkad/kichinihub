"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
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
            Something went wrong.
          </h1>
          <p style={{ color: "#746458", fontSize: 15, lineHeight: 1.6 }}>
            An unexpected error occurred. Try refreshing the page, or use the
            button below to retry.
          </p>
          <button
            onClick={retry}
            style={{
              marginTop: 24,
              padding: "12px 24px",
              border: "0",
              borderRadius: 4,
              background: "#672c28",
              color: "#fff8e9",
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
