# NYT Studios Digital - Build Plan

Status: draft for approval (2026-09-29).
Site: `https://digital.nyt-studios.com`
Owner: NYT Studios (`info@nyt-studios.com`)

## 1. Goal

Sell digital products for creatives, starting with one: the interior design AI video prompt kit ($9, sold on Whop).
The site's job is to turn Meta ad traffic and search traffic into Whop checkouts, and to prove which ad made the sale.
Success = a visitor from a Meta ad can go from ad to paid order in under 60 seconds, and that order shows up in Meta Ads Manager as a Purchase.

## 2. Scope

In scope for v1:

- Home page (brand + product, built to grow into a catalog later).
- Product page for the interior design kit (the Meta ad landing page).
- Privacy Policy, Terms & Conditions, Refund Policy.
- Custom 404.
- Cookie consent, analytics, Meta Pixel and Whop Pixel.
- Email capture form ("try a prompt free", one prompt) with validation and spam protection, if decision D2 is yes.
- SEO, GEO (AI search engines) and AEO (answer engines) foundations.

Out of scope for v1:

- On-site checkout or payments (Whop handles checkout, delivery, receipts, refunds).
- User accounts, cart, CMS, blog engine.
- The NYT Studios agency redesign (separate plan, after this ships).

## 3. Risks and decisions taken

| # | Risk | Status |
|---|------|--------|
| R1 | Meta can't see the sale, because purchases happen on whop.com | Parked until the site is live. Plan: Whop Pixel + Meta connection in Whop; fallback is a Whop `payment.succeeded` webhook to Meta's Conversions API, deduplicated by payment ID ([Whop Pixel](https://docs.whop.com/developer/ads/pixel), [webhook](https://docs.whop.com/api-reference/payments/payment-succeeded)) |
| R2 | Vercel Hobby plan is non-commercial only | Accepted for now. Move to Pro before real ad spend |
| R3 | Product had three names | Fixed. Main name everywhere: "100 AI Video Prompts for Interior Design Reels". "Scroll-Stopping Rooms" and "Rooms in Motion" are kept as subheadings and alternate names for search |
| R4 | Whop listing over-promises | Fix: I draft a new Whop description from the real kit contents; you paste it into Whop |
| R5 | "$15 → $9" strike price | Kept by your decision. Note: Meta can reject ads that show it, so ad creatives should show only "$9" |
| R6 | PDFs link to `nyt-studios.vercel.app` | Nothing sold yet, so update the PDFs before launch to link to `nyt-studios.com` and `digital.nyt-studios.com` |
| R7 | Two hostnames | `digital.nyt-studios.com` is canonical; `www.digital` redirects with a 308 |
| R8 | No reviews yet | Reviews section appears only once real reviews exist |
| R9 | Support load | FAQ answers the top questions; reply template on `info@` |
| R10 | Tax | Check with your accountant before volume grows |

## 4. Decisions

| # | Decision | Answer |
|---|----------|--------|
| D1 | Product name | "100 AI Video Prompts for Interior Design Reels" (H1, title tag, schema). Subheads: "Scroll-Stopping Rooms", "Rooms in Motion" |
| D2 | Email capture form | Yes: "try a prompt free" form (one prompt), Brevo list, Cloudflare Turnstile |
| D3 | Legal entity | KAVITA GLOBAL INDUSTRIAL SOLUTION, Flat No: A-1103, Param Skywalk, Chala, Vapi - 396191, Gujarat, India. Grievance contact: `info@nyt-studios.com` |
| D4 | Refund policy | No refunds on digital downloads, because results depend on third-party AI models. Only exceptions: file never delivered, or file corrupt and we can't replace it. Must match the Whop setting. Shown in plain words next to the Buy button, on `/refunds` and in `/terms`, so no buyer can say they weren't told |
| D5 | UGC ad video | Received: `UGC ad_digital_product_1.mp4` (4.2 MB) |
| D6 | Strike price | Keep |
| D7 | Design reference | uiverse.io for components and micro-interactions (MIT licensed, so we can adapt them) |

## Build skills

- Anthropic `frontend-design`: visual concept, typography, palette, layout.
- Vercel agent skills (`web-design-guidelines`, `vercel-react-best-practices`, `vercel-composition-patterns`): Next.js quality, performance, accessibility.
- `impeccable`: critique, audit and visual iteration of the finished UI.

## 5. Design direction

"Twin sister" rule: the two sites share a brand system (DNA) but look different (a different mood).

Shared with NYT Studios:

- The four-point spark mark and "NYT" wordmark (becomes "NYT / DIGITAL").
- Fonts: Syne (headlines) and Space Grotesk (text), already self-hosted in the agency repo.
- Button shapes, spacing scale, footer structure, and cross-links between the two sites.

Different, so it reads as a shop:

- Light, paper-like base instead of the dark galaxy.
- Product-first layout: product image, price and Buy button above the fold.
- One accent colour taken from the product (the kit's cobalt), used only for buy actions.
- No WebGL: product pages must be fast on 4G phones.

The design is locked with a visual preview before any page is built.

## 6. Architecture

- **Framework:** Next.js 16 (App Router), TypeScript, statically generated, same as the agency site.
- **Hosting:** Vercel Pro, project root `nyt-digital/`.
- **Content:** `lib/products.ts` holds every product (name, slug, price, Whop URL, images, FAQ).
  Adding product 2 = adding one object, and the home grid, product page, sitemap and structured data update themselves.
- **Checkout:** every Buy button links to the product's Whop URL, with the visitor's `utm_*` and `fbclid` appended so Whop can attribute the sale.
- **Server code (only if D2 = yes):** one route handler, `POST /api/subscribe`.
  It checks spam protection, validates the email, and adds the contact to Brevo.
  All keys live in Vercel environment variables and are never sent to the browser.
- **Webhook (fallback only, see risk 1):** `POST /api/whop-webhook`, which verifies the signature, deduplicates by payment ID, and sends one Purchase to Meta's Conversions API.

Pages:

| Route | Purpose |
|-------|---------|
| `/` | Brand intro, featured product, "more coming soon" grid |
| `/products/ai-video-prompts-interior-design-reels` | Full sales page and Meta ad landing page |
| `/privacy` | Privacy Policy |
| `/terms` | Terms & Conditions |
| `/refunds` | Refund Policy |
| `/404` | Custom not-found page with a link back to the product |
| `/sitemap.xml`, `/robots.txt`, `/llms.txt` | Generated at build |

## 7. Your 20-point checklist, mapped

| # | Item | How it's done |
|---|------|---------------|
| 1 | Privacy policy | `/privacy`: lists Vercel, Whop, Meta, Brevo, analytics; covers GDPR and India's DPDP Act |
| 2 | Terms & conditions | `/terms`: licence (personal/commercial use of prompts, no resale), AI tool disclaimer, governing law |
| 3 | Secrets off the frontend | Keys only in Vercel env vars, used only in server routes; only `NEXT_PUBLIC_*` IDs (pixel IDs) reach the browser; a build check fails if a secret name is imported client-side |
| 4 | Force HTTPS | Vercel redirects HTTP to HTTPS by default; add an HSTS header in `next.config.ts` |
| 5 | Cookie consent | Opt-in banner for EU/UK/Switzerland visitors (by Vercel's country header); notice-and-opt-out elsewhere; Meta Pixel loads only after consent where required |
| 6 | Meta titles + descriptions | Per-page `metadata` in Next.js; unique title under 60 chars, description under 155 |
| 7 | Social preview image | 1200x630 OG image per page, generated at build with `next/og` |
| 8 | Favicon | SVG spark icon plus a 180px Apple touch icon and web manifest |
| 9 | Sitemap + robots.txt | `app/sitemap.ts` and `app/robots.ts`, built from `lib/products.ts` |
| 10 | Alt text | Every `<Image>` requires `alt` (TypeScript-enforced wrapper); decorative images use `alt=""` |
| 11 | Compress images | The 11 base64 JPEGs in `index_1.html` get extracted to files and served as AVIF/WebP by `next/image`; the video is compressed to under 4 MB with a poster frame |
| 12 | Page load speed | Budget: LCP under 2.0s on mobile 4G, CLS under 0.1, first-load JS under 100 KB; Lighthouse CI fails the build if missed |
| 13 | Colour contrast | All text at WCAG AA (4.5:1) minimum, checked by axe in tests |
| 14 | Mobile friendly | Designed at 375px first; sticky "Get the prompts - $9" bar on mobile |
| 15 | Custom 404 | `app/not-found.tsx` |
| 16 | Broken links | Link checker in CI, covering internal links, Whop URLs and the Instagram link |
| 17 | Form validation | Server-side validation (Zod) plus browser validation; clear inline errors |
| 18 | Spam protection | Cloudflare Turnstile (free, no puzzles for real users), a honeypot field, and rate limiting per IP |
| 19 | Analytics | Vercel Web Analytics (no cookies, no consent needed), Meta Pixel, Whop Pixel, Google Search Console, Bing Webmaster Tools |
| 20 | One clear CTA | Every page has one action: "Get the prompts - $9"; the email form is secondary and sits lower on the page |

## 8. SEO, GEO and AEO

SEO (Google):

- Structured data (JSON-LD): `Organization`, `Product` with `Offer` (price, currency, availability, return policy), `FAQPage`, `BreadcrumbList`.
  This makes the product eligible for Google's product snippets with price.
- One canonical URL per page, clean slugs, internal links from home to product.
- Submit the sitemap in Google Search Console.

GEO (ChatGPT, Perplexity, Gemini, Copilot):

- `/llms.txt` summarising who we are, what we sell, and the price.
- Bing Webmaster Tools + IndexNow, because ChatGPT and Copilot search draw on Bing's index.
- Plain facts written as plain sentences (price, what's included, which AI tools it works with), since AI engines quote clear statements.
- Consistent name and details across the site, Whop, Instagram and the agency site (why D1 matters).

AEO (featured answers, "People also ask", voice):

- An FAQ written as real questions buyers type, each answered in the first sentence.
- Later: short guide pages targeting questions like "how to make an AI video of a room without changing it" that link to the product.

## 9. Selling more (conversion)

- UGC ad video near the top of the product page, muted autoplay with captions.
- Real sample prompt with a Copy button (already in the current sales page, and it's convincing).
- Price in the button text, so there's no surprise at checkout.
- Meta Pixel events: `PageView`, `ViewContent` (product page), `InitiateCheckout` (Buy click), `Lead` (email form); `Purchase` comes from Whop.
- Before running ads: verify the domain in Meta Business Manager and confirm a test Purchase arrives.
- Email list: the free prompt leads to a short email sequence that ends with the kit offer.
- After the first real reviews: add a reviews section and use the best ones in ads.

## 10. Testing

- End-to-end (Playwright), on mobile and desktop viewports:
  - Happy path: land from an ad URL with UTMs, click Buy, and the Whop URL carries the UTMs.
  - Consent: from an EU country the Meta Pixel doesn't load until Accept; after Decline it never loads.
  - Form: valid email succeeds; invalid email shows an error; honeypot or failed Turnstile is rejected; the same email twice doesn't create a duplicate.
  - Failure: Brevo down returns a friendly error and the request can be retried.
  - Unknown URL shows the custom 404.
- Webhook (if built): valid signature is accepted; bad signature is rejected; the same payment sent twice fires one Purchase.
- Accessibility: axe on every page, with zero serious issues.
- Performance: Lighthouse CI against the budget in item 12.
- Links: the link checker passes.

## 11. Build phases

Each phase ends with something you can look at.

0. **Setup.** Decisions D1 to D7, `git init`, Vercel Pro project, `digital.nyt-studios.com` DNS, Whop Pixel + Meta connection.
1. **Design.** Brand tokens and a preview of the home and product pages; you approve before build.
2. **Pages.** Home and product page, with the images extracted and compressed and the video added.
3. **Trust + tracking.** Legal pages, 404, consent banner, analytics, pixels, UTM passthrough.
4. **Email capture** (if D2 = yes). Form, validation, Turnstile, Brevo.
5. **Search.** Metadata, OG images, favicon, sitemap, robots, llms.txt, structured data.
6. **QA.** All tests in section 10, a real-phone check, and one real test purchase end to end.
7. **Launch.** Search Console, Bing, Meta domain verification, then the first ad.

## 12. After launch

- Fix the PDF links and product name in the next kit version (risks 3 and 6).
- NYT Studios agency redesign: new direction, real work (Pramukh Vedanta, carpet), `info@nyt-studios.com`, WhatsApp `+91 9008474779`, Instagram `@nyt.studios`, and a link to Digital.
