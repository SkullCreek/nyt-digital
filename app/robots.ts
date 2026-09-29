import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

// Open to all crawlers, including AI search (GPTBot, OAI-SearchBot, PerplexityBot, ClaudeBot, Google-Extended):
// being quoted by answer engines is part of the plan (GEO/AEO).
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/"] }],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
