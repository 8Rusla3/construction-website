const { test, expect } = require("@playwright/test");

const routes = [
  "/",
  "/construction.html",
  "/tree-services.html",
  "/gallery.html",
  "/contact.html",
  "/success.html",
];

test.describe("No runtime console errors", () => {
  for (const path of routes) {
    test(`clean console on ${path}`, async ({ page }) => {
      const jsErrors = [];
      page.on("pageerror", (err) => jsErrors.push(err.message));

      const consoleFailures = [];
      page.on("console", (msg) => {
        const t = msg.type();
        if (t === "error") consoleFailures.push(msg.text());
      });

      await page.goto(path);
      await page.waitForLoadState("load");

      expect(jsErrors, `pageerror on ${path}: ${jsErrors.join("; ")}`).toEqual(
        [],
      );
      expect(
        consoleFailures,
        `console.error on ${path}: ${consoleFailures.join("; ")}`,
      ).toEqual([]);
    });
  }
});
