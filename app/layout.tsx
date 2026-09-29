import type { Metadata, Viewport } from "next";
import type React from "react";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import { OG_DEFAULTS, SITE } from "@/lib/site";
import ConsentBanner from "@/components/ConsentBanner";
import Tracking from "@/components/Tracking";
import "./globals.css";

// Same type family as the NYT Studios agency site (twin-sister brand).
const syne = localFont({
  src: [
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

// Prompt text only.
const mono = localFont({
  src: [{ path: "./fonts/space-mono-latin-400-normal.woff2", weight: "400" }],
  variable: "--font-mono",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: "NYT Studios Digital: AI video prompt kits", template: "%s | NYT Digital" },
  description: "AI video prompt kits from NYT Studios, an AI ad studio. Start with 100 prompts that turn interior design photos into video ads that book clients.",
  applicationName: SITE.name,
  openGraph: OG_DEFAULTS,
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#EEF0F3", colorScheme: "light" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${syne.variable} ${grotesk.variable} ${mono.variable}`}>
      <body>
        <a className="skip" href="#main">Skip to content</a>
        {children}
        <ConsentBanner />
        <Tracking />
        {/* Cookieless, so it runs without consent. Its script only exists on Vercel deployments. */}
        {process.env.VERCEL ? <Analytics /> : null}
      </body>
    </html>
  );
}
