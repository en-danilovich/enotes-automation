import { defineConfig, devices } from "@playwright/test";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
require("dotenv").config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./tests",
  /* Maximum time one test can run for. */
  timeout: 60 * 1000,
  expect: {
    timeout: 5000,
  },
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  // reporter: [["html", { open: "never" }], ["allure-playwright"]],
  reporter: [
    ["html", { open: "never" }],
    ["allure-playwright", { environmentInfo: { url: process.env.BASE_URL } }],
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.BASE_URL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    navigationTimeout: 2000,
    launchOptions: {
      args: ["--start-fullscreen"],
    },
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "setup",
      testMatch: /setup\.ts/,
    },
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        launchOptions: {
          args: ["--start-fullscreen"],
        },
      },
      dependencies: ["setup"],
    },
  ],

  /* Folder for test artifacts such as screenshots, videos, traces, etc. */
  outputDir: "test-results/",
});
