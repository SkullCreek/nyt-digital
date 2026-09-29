import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const PAGES = ["/", "/products/ai-video-prompts-interior-design-reels", "/privacy", "/terms", "/refunds", "/this-does-not-exist"];

for (const path of PAGES) {
  test(`no serious accessibility issues on ${path}`, async ({ page }) => {
    await page.route("https://connect.facebook.net/**", (r) => r.fulfill({ contentType: "text/javascript", body: "" }));
    await page.goto(path);
    // Checked with the cookie banner open, since that's what first-time visitors see.
    await expect(page.getByRole("dialog", { name: "Cookies" })).toBeVisible();
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .exclude(".ts") // Cloudflare's widget iframe is not ours to fix
      .analyze();
    const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    const report = serious.map((v) => `${v.id} (${v.impact}): ${v.help}\n  ${v.nodes.map((n) => n.target.join(" ")).slice(0, 5).join("\n  ")}`).join("\n");
    expect(serious, report).toEqual([]);
  });
}
