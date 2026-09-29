// Broken link check (checklist item 16). Crawls every internal page from the home page,
// then checks every internal and external link and asset it found.
// Usage: node scripts/check-links.mjs [baseUrl] [siteUrl]
//   baseUrl  where to crawl (default http://localhost:3100)
//   siteUrl  the site's public address (NEXT_PUBLIC_SITE_URL); absolute links to it, such as
//            canonical URLs, are checked against baseUrl so this works before launch.

const base = new URL(process.argv[2] ?? "http://localhost:3100");
const site = process.argv[3] ? new URL(process.argv[3]) : null;
const seen = new Set();
const queue = ["/", "/this-page-should-404"];
const targets = new Map(); // url -> first page that linked it
const ATTR = /(?:href|src|poster)="([^"#]+)/g;

while (queue.length) {
  const path = queue.shift();
  if (seen.has(path)) continue;
  seen.add(path);
  const res = await fetch(new URL(path, base));
  if (!(res.headers.get("content-type") ?? "").includes("text/html")) continue;
  const html = await res.text();
  for (const [, raw] of html.matchAll(ATTR)) {
    if (raw.startsWith("mailto:") || raw.startsWith("data:") || raw.startsWith("/_next/")) continue;
    let url = new URL(raw.replaceAll("&amp;", "&"), base);
    if (site && url.origin === site.origin) url = new URL(url.pathname + url.search, base);
    if (!targets.has(url.href)) targets.set(url.href, path);
    if (url.origin === base.origin && !url.pathname.match(/\.[a-z0-9]+$/) && !url.pathname.startsWith("/api/")) queue.push(url.pathname);
  }
}

const results = await Promise.all(
  [...targets].map(async ([url, from]) => {
    try {
      const res = await fetch(url, { redirect: "follow", headers: { "user-agent": "Mozilla/5.0 (link check)" }, signal: AbortSignal.timeout(15000) });
      return { url, from, status: res.status };
    } catch (e) {
      return { url, from, status: `error: ${e.cause?.code ?? e.message}` };
    }
  }),
);

// Social sites often block bots with 429/403 even when the link is fine: warn, don't fail.
const soft = (r) => /instagram\.com|wa\.me|whatsapp\.com/.test(r.url) && [403, 429].includes(r.status);
const bad = results.filter((r) => !(typeof r.status === "number" && r.status < 400) && !soft(r));
const warn = results.filter(soft);

console.log(`Crawled ${seen.size} pages, checked ${results.length} links.`);
for (const r of warn) console.log(`WARN ${r.status} ${r.url} (bot-blocked, check by hand)`);
for (const r of bad) console.log(`FAIL ${r.status} ${r.url} (linked from ${r.from})`);
process.exit(bad.length ? 1 : 0);
