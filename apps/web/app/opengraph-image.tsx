import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "#fbf7ec",
          color: "#1b2c21",
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: 6, textTransform: "uppercase" }}>Robinhood Chain</div>
        <div style={{ fontSize: 86, marginTop: 16, fontWeight: 600 }}>QUIVER</div>
        <div style={{ fontSize: 32, marginTop: 24, color: "#3a5f45" }}>Your token. Your site. No cut on trades.</div>
      </div>
    ),
    size,
  );
}
