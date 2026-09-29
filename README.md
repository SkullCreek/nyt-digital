# NYT Studios Digital

The digital products store of NYT Studios.
Live at `https://digital.nyt-studios.com`.
The sister site (the AI ad agency) is `https://www.nyt-studios.com`.

> Status: planned.
> The build follows [PLAN.md](PLAN.md).
> Commands and files below describe the finished project.

## What it does

Shows our digital products and sends buyers to Whop to pay.
Whop handles checkout, file delivery, receipts and refunds.
This site handles the pitch, tracking, email capture and search visibility.

## Stack

- Next.js 16 (App Router), TypeScript, statically generated.
- Hosted on Vercel (Pro plan, because this is a commercial site).
- Checkout: Whop.
- Tracking: Vercel Web Analytics, Meta Pixel, Whop Pixel.
- Email list: Brevo.
- Spam protection: Cloudflare Turnstile.

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Then open `http://localhost:3000`.

## Environment variables

Set these in Vercel under Project Settings, Environment Variables.
Never commit `.env.local`.

| Name | Public? | What it is |
|------|---------|------------|
| `NEXT_PUBLIC_SITE_URL` | Yes | `https://digital.nyt-studios.com` |
| `NEXT_PUBLIC_META_PIXEL_ID` | Yes | Meta Pixel ID |
| `NEXT_PUBLIC_WHOP_ACCOUNT_ID` | Yes | Whop business ID (`biz_...`) for the Whop Pixel |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Yes | Turnstile site key |
| `TURNSTILE_SECRET_KEY` | No | Turnstile secret, server only |
| `BREVO_API_KEY` | No | Brevo API key, server only |
| `BREVO_LIST_ID` | No | Brevo list for the free-prompts signup |
| `WHOP_WEBHOOK_SECRET` | No | Only if the webhook fallback is enabled |
| `META_CAPI_TOKEN` | No | Only if the webhook fallback is enabled |

Only `NEXT_PUBLIC_*` values ever reach the browser.

## Add or edit a product

All product data lives in `lib/products.ts`.
To add a product, add one object with its name, slug, price, Whop URL, images, alt text and FAQ.
The home page, product page, sitemap and structured data update automatically.

## Scripts

| Command | What it does |
|---------|--------------|
| `npm run dev` | Local dev server |
| `npm run build` | Production build |
| `npm run test:e2e` | Playwright end-to-end tests |
| `npm run test:a11y` | Accessibility checks (axe) |
| `npm run lighthouse` | Performance budget check |
| `npm run links` | Broken link check |

## Deploy

1. Push to the GitHub repo connected to Vercel.
2. Every push to `main` deploys to production; every other branch gets a preview URL.
3. Domains in Vercel: `digital.nyt-studios.com` is primary; `www.digital.nyt-studios.com` redirects to it.

## Before running Meta ads

1. Verify `nyt-studios.com` in Meta Business Manager.
2. Connect Meta in the Whop dashboard so Purchases reach Meta.
3. Make one real test purchase through an ad-style URL with UTMs.
4. Confirm `ViewContent`, `InitiateCheckout` and `Purchase` appear in Meta Events Manager.

## Files

- `app/` - pages, metadata, sitemap, robots, 404.
- `app/api/subscribe/route.ts` - email signup (server only).
- `components/` - UI pieces, consent banner, pixels.
- `lib/products.ts` - product catalog.
- `lib/site.ts` - contact details, social links, legal entity.
- `public/` - compressed images, video, favicon.
- `tests/` - Playwright tests.

## Contact

`info@nyt-studios.com` · WhatsApp +91 9008474779 · Instagram [@nyt.studios](https://www.instagram.com/nyt.studios/)
