import { BrowserContext, test as base } from "@playwright/test";

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
});
