import { expect, test } from "@playwright/test";

const PRODUCT = "/products/ai-video-prompts-interior-design-reels";
const PAGES = ["/", PRODUCT, "/privacy", "/terms", "/refunds"];

test.describe("layout", () => {
  for (const path of PAGES) {
    test(`no sideways scrolling on ${path}`, async ({ page }) => {
      await page.goto(path);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }

  test("mobile buy bar appears after the hero button scrolls away", async ({ page, isMobile }) => {
    test.skip(!isMobile, "mobile only");
    await page.goto(PRODUCT);
    await page.getByRole("button", { name: "Reject" }).click();
    const bar = page.locator(".stickybuy");
    await expect(bar).toHaveAttribute("data-show", "false");
    await page.locator("#inside").scrollIntoViewIfNeeded();
    await expect(bar).toHaveAttribute("data-show", "true");
    await expect(bar.getByRole("link", { name: /Get it \$9/ })).toBeVisible();
  });
});

test.describe("search", () => {
  test("product page has one h1, canonical, social tags and valid structured data", async ({ page }) => {
    await page.goto(PRODUCT);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `https://digital.nyt-studios.com${PRODUCT}`);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /opengraph-image/);
    const title = await page.title();
    expect(title.length).toBeLessThanOrEqual(60);
    const desc = await page.locator('meta[name="description"]').getAttribute("content");
    expect(desc!.length).toBeLessThanOrEqual(155);

    const graphs = await page.locator('script[type="application/ld+json"]').allTextContents();
    const types = graphs.flatMap((g) => JSON.parse(g)["@graph"]);
    const product = types.find((t: { "@type": string }) => t["@type"] === "Product");
    expect(product.offers.price).toBe("9.00");
    expect(product.offers.priceCurrency).toBe("USD");
    expect(types.map((t: { "@type": string }) => t["@type"])).toEqual(expect.arrayContaining(["VideoObject", "FAQPage", "BreadcrumbList"]));
  });

  test("every image has alt text", async ({ page }) => {
    for (const path of ["/", PRODUCT]) {
      await page.goto(path);
      const missing = await page.locator("img:not([alt])").count();
      expect(missing, `images without alt on ${path}`).toBe(0);
    }
  });

  test("sitemap, robots, llms.txt and social cards are served", async ({ request }) => {
    const sitemap = await (await request.get("/sitemap.xml")).text();
    expect(sitemap).toContain(`https://digital.nyt-studios.com${PRODUCT}`);
    expect(await (await request.get("/robots.txt")).text()).toContain("Sitemap: https://digital.nyt-studios.com/sitemap.xml");
    expect(await (await request.get("/llms.txt")).text()).toContain("Price: $9 (USD)");
    for (const path of ["/opengraph-image", `${PRODUCT}/opengraph-image`]) {
      const res = await request.get(path);
      expect(res.status()).toBe(200);
      expect(res.headers()["content-type"]).toBe("image/png");
    }
  });

  test("security headers are set", async ({ request }) => {
    const h = (await request.get("/")).headers();
    expect(h["strict-transport-security"]).toContain("max-age=63072000");
    expect(h["x-content-type-options"]).toBe("nosniff");
    expect(h["x-frame-options"]).toBe("DENY");
    expect(h["x-powered-by"]).toBeUndefined();
  });
});

// The real endpoint, with Cloudflare's always-pass test keys and a fake Brevo key.
test.describe("subscribe API", () => {
  const post = (request: import("@playwright/test").APIRequestContext, ip: string, data: unknown) =>
    request.post("/api/subscribe", { data, headers: { "x-real-ip": ip } });

  test("rejects bad input with 400", async ({ request }, info) => {
    const ip = `10.1.${info.workerIndex}.1`;
    expect((await post(request, ip, { email: "ana@", source: "home" })).status()).toBe(400);
    expect((await post(request, ip, { email: "ana@studio.com", source: "../etc" })).status()).toBe(400);
  });

  test("honeypot looks successful but does nothing", async ({ request }, info) => {
    const res = await post(request, `10.2.${info.workerIndex}.1`, { email: "bot@spam.com", source: "home", company: "Bots Inc" });
    expect(res.status()).toBe(200);
  });

  test("missing human check is rejected with 403", async ({ request }, info) => {
    const res = await post(request, `10.3.${info.workerIndex}.1`, { email: "ana@studio.com", source: "home", token: "" });
    expect(res.status()).toBe(403);
  });

  test("email service failure returns 502, not a crash", async ({ request }, info) => {
    const res = await post(request, `10.4.${info.workerIndex}.1`, { email: "ana@studio.com", source: "home", token: "XXXX.DUMMY.TOKEN.XXXX" });
    expect(res.status()).toBe(502);
    expect(await res.json()).toEqual({ ok: false, reason: "upstream" });
  });

  test("rate limit kicks in after 5 attempts", async ({ request }, info) => {
    const ip = `10.5.${info.workerIndex}.${info.project.name.length}`;
    const codes = [];
    for (let i = 0; i < 6; i++) codes.push((await post(request, ip, { email: "x@", source: "home" })).status());
    expect(codes.slice(0, 5)).toEqual([400, 400, 400, 400, 400]);
    expect(codes[5]).toBe(429);
  });
});
