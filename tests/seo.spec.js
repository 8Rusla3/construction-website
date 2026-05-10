const { test, expect } = require("@playwright/test");

test.describe("SEO and site verification assets", () => {
  test("Google verification file exists", async ({ request }) => {
    const response = await request.get("/google305e519690b439be.html");
    await expect(response).toBeOK();
    const text = await response.text();
    await expect(text).toContain("google-site-verification");
  });

  test("robots.txt is present and references sitemap", async ({ request }) => {
    const response = await request.get("/robots.txt");
    await expect(response).toBeOK();
    const body = await response.text();
    await expect(body).toContain(
      "Sitemap: https://centaurusgroup.ca/sitemap.xml",
    );
  });
});
