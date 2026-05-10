// @ts-check
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "tests",
  timeout: 30000,
  fullyParallel: true,
  webServer: {
    command: "npx http-server -p 3000 -c-1",
    url: "http://127.0.0.1:3000/",
    reuseExistingServer: !process.env.CI,
    timeout: 60000,
  },
  retries: process.env.CI ? 1 : 0,
  use: {
    baseURL: "http://127.0.0.1:3000",
    headless: true,
    actionTimeout: 10000,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
    {
      name: "Pixel 5",
      use: { ...devices["Pixel 5"] },
    },
    {
      name: "iPhone 14",
      use: { ...devices["iPhone 14"] },
    },
    {
      name: "iPhone 15",
      use: { ...devices["iPhone 15"] },
    },
    {
      name: "iPhone 15 Pro",
      use: { ...devices["iPhone 15 Pro"] },
    },
  ],
  reporter: [
    ["list"],
    ["html", { outputFolder: "test-results", open: "never" }],
  ],
});
