const { test, expect } = require("@playwright/test");

test.describe("Contact form and Netlify integration", () => {
  test("contact form exists and is Netlify-ready", async ({ page }) => {
    await page.goto("/contact.html");

    const form = page.locator('form[name="estimate"]');
    await expect(form).toHaveCount(1);
    await expect(form).toHaveAttribute("data-netlify", "true");
    await expect(form).toHaveAttribute("data-netlify-honeypot", "bot-field");

    const requiredFields = [
      'input[name="name"]',
      'input[name="phone"]',
      'input[name="email"]',
      'select[name="serviceType"]',
      'textarea[name="message"]',
    ];

    for (const field of requiredFields) {
      await expect(form.locator(field)).toHaveCount(1);
      await expect(form.locator(field)).toHaveAttribute("required", "");
    }
  });
});
