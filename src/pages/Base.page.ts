import { Locator, Page } from "@playwright/test";

export abstract class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigateTo(url: string) {
    await this.page.goto(url);
  }

  async waitForElementBeVisible(locator: Locator) {
    await locator.waitFor({ state: "visible", timeout: 3000 });
  }
}
