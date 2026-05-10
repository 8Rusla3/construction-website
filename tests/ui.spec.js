const { test, expect } = require("@playwright/test");

test.describe("UI / UX interactions", () => {
  test("mobile menu opens and closes on small screen", async ({ page }) => {
    await page.goto("/");
    await page.setViewportSize({ width: 375, height: 812 });

    const hamburger = page.locator(".hamburger");
    await expect(hamburger).toHaveCount(1);
    await hamburger.click();
    await expect(hamburger).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator(".nav-links.visible")).toHaveCount(1);

    await page.keyboard.press("Escape");
    await expect(hamburger).toHaveAttribute("aria-expanded", "false");
  });

  test("current page nav item is marked as active", async ({ page }) => {
    await page.goto("/contact.html");
    const activeLinks = await page
      .locator('.nav-links a[aria-current="page"]')
      .count();
    await expect(activeLinks).toBeGreaterThan(0);
  });
});
