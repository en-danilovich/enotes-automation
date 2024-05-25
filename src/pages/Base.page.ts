import { Locator, Page } from "@playwright/test";

// TODO: fix code style + file naming convention
// TODO: probably change to base element or something but not page
export abstract class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigateTo(url: string) {
    await this.page.goto(url);
  }

  async waitForElementBeVisible(locator: Locator) {
    await locator.waitFor({ state: "visible" });
  }
}
