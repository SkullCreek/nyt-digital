import type { Metadata, Viewport } from "next";
import type React from "react";
import localFont from "next/font/local";
import { SITE } from "@/lib/site";

// Same type family as the NYT Studios agency site (twin-sister brand).
const syne = localFont({
  src: [
    { path: "./fonts/syne-latin-600-normal.woff2", weight: "600" },
    { path: "./fonts/syne-latin-700-normal.woff2", weight: "700" },
    { path: "./fonts/syne-latin-800-normal.woff2", weight: "800" },
  ],
  variable: "--font-syne",
  display: "swap",
});
const grotesk = localFont({
  src: [
    { path: "./fonts/space-grotesk-latin-400-normal.woff2", weight: "400" },
    { path: "./fonts/space-grotesk-latin-500-normal.woff2", weight: "500" },
  ],
  variable: "--font-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: SITE.name, template: `%s | ${SITE.name}` },
  description: SITE.tagline,
};

export const viewport: Viewport = { width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${syne.variable} ${grotesk.variable}`}>
      <body>{children}</body>
    </html>
  );
}
