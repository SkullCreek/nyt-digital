import { defineConfig, devices } from "@playwright/test";

const PORT = 3200;

// Production build with Cloudflare's official always-pass Turnstile test keys and a fake
// Brevo key, so no real email is ever sent. A dummy pixel ID lets us test consent gating;
// the real Meta script is blocked in the tests.
const env = {
  NEXT_DIST_DIR: ".next-e2e",
  NEXT_PUBLIC_SITE_URL: "https://digital.nyt-studios.com",
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: "1x00000000000000000000AA",
  TURNSTILE_SECRET_KEY: "1x0000000000000000000000000000000AA",
  NEXT_PUBLIC_META_PIXEL_ID: "1234567890",
  NEXT_PUBLIC_WHOP_ACCOUNT_ID: "",
  BREVO_API_KEY: "e2e-disabled",
  BREVO_LIST_ID: "1",
};

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  retries: 0,
  reporter: [["list"]],
  use: { baseURL: `http://localhost:${PORT}`, trace: "retain-on-failure" },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  webServer: {
    command: `npx next build && npx next start -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    timeout: 240_000,
    reuseExistingServer: false,
    env,
  },
});
