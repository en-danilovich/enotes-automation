import { test as setup } from "@playwright/test";
import { LoginPage } from "../src/pages/auth/Login.page";
import { chromium } from "@playwright/test";
import { MainPage } from "../src/pages/main/Main.page";

const authFile = "storageStates/auth/testUser.json";

setup("setup", async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const loginPage = new LoginPage(page);
  await loginPage.navigate();
  await loginPage.login(process.env.USER_NAME!, process.env.USER_PASSWORD!);

  const mainPage = new MainPage(page);
  await mainPage.waitForPageToBeVisible();

  await page.context().storageState({ path: authFile });

  page.close();
});
