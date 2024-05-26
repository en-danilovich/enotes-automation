import {
  APIRequestContext,
  BrowserContext,
  test as base,
  expect,
} from "@playwright/test";

export const test = base.extend<{}, { enotesContext: BrowserContext }>({
  enotesContext: [
    async ({ browser }, use) => {
      const context = await browser.newContext({
        storageState: `storageStates/auth/testUser.json`,
      });
      await use(context);
      await context.close();
    },
    { scope: "worker" },
  ],

  // page: async ({ enotesContext }, use) => {
  //   const page = await enotesContext.newPage();
  //   await page.goto("/");

  //   const mainPage = new MainPage(page);
  //   await mainPage.waitForPageToBeVisible();

  //   await use(page);

  //   page.close();
  // },

  // apiToken: async ({ page }, use) => {
  //   const metaToken = page.locator('meta[name="csrf-token"]');
  //   await expect(metaToken).toHaveAttribute("content");
  //   const token = await metaToken.getAttribute("content");
  //   await expect(token).not.toBeNull();
  //   await use(token!);
  // },
});
