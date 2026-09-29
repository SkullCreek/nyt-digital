import { expect, test, type Page } from "@playwright/test";

const PRODUCT = "/products/ai-video-prompts-interior-design-reels";

// Never load the real Meta script in tests; the inline stub is enough to observe events.
async function blockThirdParties(page: Page) {
  await page.route("https://connect.facebook.net/**", (r) => r.fulfill({ contentType: "text/javascript", body: "" }));
  await page.route("https://t.whop.tw/**", (r) => r.fulfill({ contentType: "text/javascript", body: "" }));
}

const fbqEvents = (page: Page) =>
  page.evaluate(() => (window.fbq ? ((window.fbq as unknown as { queue: unknown[][] }).queue ?? []).map((a) => String(a[1])) : null));

test.beforeEach(async ({ page }) => {
  await blockThirdParties(page);
});

test("home and product page render the key content", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Make the AI ads yourself.");
  await page.goto(PRODUCT);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("100 AI Video Prompts for Interior Design Reels");
  await expect(page.locator("#hero-buy")).toContainText("$9");
});

test("buy button carries ad tracking params to Whop checkout", async ({ page }) => {
  await page.route("https://whop.com/**", (r) => r.fulfill({ contentType: "text/html", body: "<title>whop</title>" }));
  await page.goto(`${PRODUCT}?utm_source=facebook&utm_campaign=launch&fbclid=abc123&other=ignored`);
  await page.getByRole("button", { name: "Reject" }).click();
  await page.locator("#hero-buy").click();
  await page.waitForURL(/whop\.com/);
  const url = new URL(page.url());
  expect(url.pathname).toBe("/nyt-studios/ai-video-prompts-for-interior-design-reels/");
  expect(url.searchParams.get("utm_source")).toBe("facebook");
  expect(url.searchParams.get("utm_campaign")).toBe("launch");
  expect(url.searchParams.get("fbclid")).toBe("abc123");
  expect(url.searchParams.has("other")).toBe(false);
});

test.describe("cookie consent", () => {
  test("strict region: nothing loads until Accept, then events flow", async ({ page }) => {
    await page.goto(PRODUCT); // no geo cookie = treated as strict
    const banner = page.getByRole("dialog", { name: "Cookies" });
    await expect(banner.getByRole("button", { name: "Reject" })).toBeVisible();
    await expect(banner.getByRole("button", { name: "Accept" })).toBeVisible();
    expect(await fbqEvents(page)).toBeNull();

    await banner.getByRole("button", { name: "Accept" }).click();
    await expect.poll(() => fbqEvents(page)).toEqual(expect.arrayContaining(["PageView", "ViewContent"]));
    await expect(banner).toBeHidden();
  });

  test("strict region: Reject keeps pixels off, even after reload", async ({ page }) => {
    await page.goto(PRODUCT);
    await page.getByRole("button", { name: "Reject" }).click();
    await page.reload();
    await expect(page.getByRole("dialog", { name: "Cookies" })).toBeHidden();
    await page.waitForTimeout(500);
    expect(await fbqEvents(page)).toBeNull();
  });

  test("notice region (India): measurement on by default, opt-out works", async ({ page, context }) => {
    await context.addCookies([{ name: "nyt-geo", value: "IN", url: "http://localhost:3200" }]);
    await page.goto(PRODUCT);
    const banner = page.getByRole("dialog", { name: "Cookies" });
    await expect(banner.getByRole("button", { name: "OK" })).toBeVisible();
    await expect(banner.getByRole("button", { name: "Reject" })).toHaveCount(0);
    await expect.poll(() => fbqEvents(page)).toContain("PageView");

    // Opt out through Settings.
    await banner.getByRole("button", { name: "Settings" }).click();
    await banner.getByRole("switch").uncheck({ force: true });
    await banner.getByRole("button", { name: "Save choice" }).click();
    await page.waitForLoadState("load"); // revoking reloads the page
    await page.waitForTimeout(500);
    expect(await fbqEvents(page)).toBeNull();
  });

  test("footer Cookie settings reopens the choice", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Reject" }).click();
    await page.getByRole("button", { name: "Cookie settings" }).click();
    await expect(page.getByRole("dialog", { name: "Cookies" }).getByRole("switch")).not.toBeChecked();
  });
});

test.describe("free prompt form", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PRODUCT);
    await page.getByRole("button", { name: "Reject" }).click();
  });

  const form = (page: Page) => page.locator("#free form");

  test("rejects an invalid email without calling the server", async ({ page }) => {
    let called = false;
    await page.route("**/api/subscribe", (r) => ((called = true), r.fulfill({ status: 200, json: { ok: true } })));
    await form(page).getByRole("textbox", { name: "Email address" }).fill("ana@");
    await form(page).getByRole("button", { name: "Send me the prompt" }).click();
    await expect(form(page).getByRole("alert")).toHaveText(/full email address/);
    expect(called).toBe(false);
  });

  test("success: sends email, source and a Turnstile token, then confirms", async ({ page }) => {
    let body: Record<string, string> = {};
    await page.route("**/api/subscribe", async (r) => {
      body = r.request().postDataJSON();
      await r.fulfill({ status: 200, json: { ok: true } });
    });
    await form(page).getByRole("textbox", { name: "Email address" }).fill("ana@studio.com");
    await form(page).getByRole("button", { name: "Send me the prompt" }).click();
    await expect(form(page).getByRole("status")).toHaveText(/Check your inbox and spam folder/);
    expect(body.email).toBe("ana@studio.com");
    expect(body.source).toBe("ai-video-prompts-interior-design-reels");
    expect(body.company).toBe("");
    expect(body.token.length).toBeGreaterThan(0);
  });

  for (const [status, text] of [
    [429, /Too many tries/],
    [502, /email service didn't respond/],
    [403, /confirm you're a person/],
  ] as const) {
    test(`shows a clear message on ${status}`, async ({ page }) => {
      await page.route("**/api/subscribe", (r) => r.fulfill({ status, json: { ok: false } }));
      await form(page).getByRole("textbox", { name: "Email address" }).fill("ana@studio.com");
      await form(page).getByRole("button", { name: "Send me the prompt" }).click();
      await expect(form(page).getByRole("alert")).toHaveText(text);
    });
  }
});

test("unknown pages return a real 404 with a way back", async ({ page }) => {
  const res = await page.goto("/this-does-not-exist");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("This page isn't in the shot.");
  await expect(page.getByRole("main").getByRole("link", { name: "100 AI Video Prompts for Interior Design Reels" })).toBeVisible();
});

test("legal pages load and link to each other", async ({ page }) => {
  for (const [path, h1] of [["/privacy", "Privacy Policy"], ["/terms", "Terms & Conditions"], ["/refunds", "Refund Policy"]]) {
    await page.goto(path);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(h1);
    await expect(page.getByText("KAVITA GLOBAL INDUSTRIAL SOLUTION").first()).toBeVisible();
  }
});

test("hero video is pausable and has a poster", async ({ page }) => {
  await page.goto(PRODUCT);
  const video = page.locator(".finder video");
  await expect(video).toHaveAttribute("poster", "/images/ugc-ad-poster.webp");
  const toggle = page.locator(".finder").getByRole("button", { name: /Pause video|Play video/ });
  await expect(toggle).toBeVisible();
  if ((await toggle.getAttribute("aria-label")) === "Pause video") {
    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-label", "Play video");
  }
});
