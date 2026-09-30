// IndexNow: tells Bing (and Yandex, Naver, Seznam) which pages changed so they recrawl now
// instead of waiting. Run after a production deploy that changes content.
// Usage: node scripts/indexnow.mjs [siteUrl] [--dry-run]
//   siteUrl    the live site (default https://digital.nyt-studios.com)
//   --dry-run  print what would be sent, send nothing
// The key is the name of the 32-character .txt file in public/ (it is public by design:
// search engines fetch it from the site to confirm we own the domain).

import { readdirSync } from "node:fs";

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const site = new URL(args.find((a) => !a.startsWith("--")) ?? "https://digital.nyt-studios.com");

const keyFile = readdirSync(new URL("../public/", import.meta.url)).find((f) => /^[a-f0-9]{32}\.txt$/.test(f));
if (!keyFile) fail("No IndexNow key file (32 hex characters + .txt) found in public/.");
const key = keyFile.replace(".txt", "");
const keyLocation = new URL(`/${keyFile}`, site).href;

// The key must already be live, or the submission is rejected with 403.
const live = await fetch(keyLocation, { signal: AbortSignal.timeout(15000) });
if (!live.ok || (await live.text()).trim() !== key) fail(`Key file is not live at ${keyLocation} (status ${live.status}). Deploy first.`);

const sitemap = await fetch(new URL("/sitemap.xml", site), { signal: AbortSignal.timeout(15000) });
if (!sitemap.ok) fail(`Could not read the sitemap (status ${sitemap.status}).`);
// Page addresses only: image and video entries use <image:loc> and <video:content_loc>.
const urlList = [...(await sitemap.text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, loc]) => loc.replaceAll("&amp;", "&"));
if (!urlList.length) fail("The sitemap has no pages.");

console.log(`${dryRun ? "Would submit" : "Submitting"} ${urlList.length} pages:`);
for (const u of urlList) console.log(`  ${u}`);
if (dryRun) process.exit(0);

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "content-type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: site.host, key, keyLocation, urlList }),
  signal: AbortSignal.timeout(15000),
});
// 200 = accepted, 202 = accepted, key check still pending. Anything else is a rejection.
if (res.status !== 200 && res.status !== 202) fail(`IndexNow rejected the submission: ${res.status} ${await res.text()}`);
console.log(`Accepted (${res.status}). Check Bing Webmaster Tools > IndexNow in a few minutes.`);

function fail(message) {
  console.error(message);
  process.exit(1);
}
