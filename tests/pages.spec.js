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
  { path: "/drain-repair-east-york.html", title: /Drain Repair/ },
  {
    path: "/basement-waterproofing-gta.html",
    title: /Basement Waterproofing/,
  },
  {
    path: "/camera-inspection-gta.html",
    title: /Sewer Camera Inspection/,
  },
  { path: "/sewer-line-repair-gta.html", title: /Sewer Line Repair/ },
  { path: "/service-areas.html", title: /Service Areas/ },
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
