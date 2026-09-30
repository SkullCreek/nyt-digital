import type { NextConfig } from "next";

const securityHeaders = [
  // Force HTTPS for two years, including subdomains (checklist item 4).
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

// A missing key doesn't break the build, it silently breaks a feature (for example the
// free-prompt form answers "couldn't confirm you're a person"). Say so loudly in the build log.
if (process.env.VERCEL_ENV === "production") {
  const required = ["NEXT_PUBLIC_TURNSTILE_SITE_KEY", "TURNSTILE_SECRET_KEY", "BREVO_API_KEY", "BREVO_LIST_ID"];
  const missing = required.filter((k) => !process.env[k]);
  if (missing.length) console.warn(`
⚠ Missing environment variables in Vercel: ${missing.join(", ")}. The free-prompt signup will not work until they are set and the site is redeployed.
`);
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // E2E tests build into their own folder so they never clobber a running dev/preview build.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  poweredByHeader: false,
  images: { formats: ["image/avif", "image/webp"] },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async redirects() {
    // One canonical host: www.digital.* -> digital.*
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.digital.nyt-studios.com" }],
        destination: "https://digital.nyt-studios.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
