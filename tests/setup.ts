import { test as setup, expect } from "@playwright/test";
import { LoginPage } from "../src/pages/auth/Login.page";

const authFile = "storageStates/auth/testUser.json";

import { chromium } from "@playwright/test";

setup("setup", async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto("https://enotes.pointschool.ru/login");

  const loginPage = new LoginPage(page);
  await loginPage.login("test", "test");

  // Wait until the page receives the cookies.
  //
  // Sometimes login flow sets cookies in the process of several redirects.
  // Wait for the final URL to ensure that the cookies are actually set.
  await page.waitForURL("https://enotes.pointschool.ru");
  await expect(page.locator("#dropdownUser")).toBeVisible();

  await page.context().storageState({ path: authFile });

  page.close();
});
