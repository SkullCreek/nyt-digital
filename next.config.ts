import type { NextConfig } from "next";

const securityHeaders = [
  // Force HTTPS for two years, including subdomains (checklist item 4).
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
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
