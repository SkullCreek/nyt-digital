import type { MetadataRoute } from "next";
import { PRODUCTS, productPath } from "@/lib/products";
import { SITE } from "@/lib/site";

// Bump when page content changes meaningfully; search engines use it to prioritise recrawls.
const UPDATED = new Date("2026-09-29");

export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => `${SITE.url}${path}`;
  return [
    { url: url("/"), lastModified: UPDATED, changeFrequency: "weekly", priority: 1 },
    ...PRODUCTS.map((p) => ({
      url: url(productPath(p)),
      lastModified: UPDATED,
      changeFrequency: "weekly" as const,
      priority: 0.9,
      images: [url(p.cover.src), ...p.ads.map((a) => url(a.img.src))],
      ...(p.video ? { videos: [{ title: p.name, thumbnail_loc: url(p.video.poster), description: p.video.caption, content_loc: url(p.video.src) }] } : {}),
    })),
    { url: url("/privacy"), lastModified: UPDATED, changeFrequency: "yearly", priority: 0.2 },
    { url: url("/terms"), lastModified: UPDATED, changeFrequency: "yearly", priority: 0.2 },
    { url: url("/refunds"), lastModified: UPDATED, changeFrequency: "yearly", priority: 0.2 },
  ];
}
