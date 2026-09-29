// 180x180 home-screen icon, same mark as app/icon.svg.
import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#FFFFFF" }}>
        <svg width="120" height="120" viewBox="-100 -100 200 200">
          <path d="M0 -70 C0 -22 17 0 58 0 C17 0 0 22 0 70 C0 22 -17 0 -58 0 C-17 0 0 -22 0 -70Z" fill="#2346D0" />
          <path d="M52 -64 C52 -55 55 -51 62 -51 C55 -51 52 -47 52 -38 C52 -47 49 -51 42 -51 C49 -51 52 -55 52 -64Z" fill="#B08A3E" />
        </svg>
      </div>
    ),
    size,
  );
}
