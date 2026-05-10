const { test, expect } = require("@playwright/test");

const pages = [
  { path: "/", title: /Centaurus Construction Group/ },
  { path: "/construction.html", title: /Construction/ },
  {
    path: "/tree-services.html",
    title: /Tree Cutting & Removal|Tree Services/,
  },
  { path: "/gallery.html", title: /Gallery/ },
  { path: "/contact.html", title: /Free Estimate|Contact/ },
  { path: "/success.html", title: /Message Received|Success|Thank you/ },
];

test.describe("Page load and SEO checks", () => {
  for (const pageInfo of pages) {
    test(`loads ${pageInfo.path}`, async ({ page }) => {
      await page.goto(pageInfo.path);
      await expect(page).toHaveTitle(pageInfo.title);
      await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
      await expect(page.locator('meta[name="description"]')).toHaveCount(1);
    });
  }
});
