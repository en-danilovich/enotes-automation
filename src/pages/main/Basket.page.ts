import { Locator, Page, expect } from "@playwright/test";
import { HeaderPage } from "./Header.page";

export class BasketPage extends HeaderPage {
  readonly pageUrl: string = `${[process.env.BASE_URL]}basket`;
  readonly uniquesBasketPageLocator: Locator;

  constructor(page: Page) {
    super(page);
    // TODO: change locator once page is available/implemented
    this.uniquesBasketPageLocator = this.page.locator("#uniqueBasketLocator");
  }

  async verifyPageVisible() {
    await expect(this.page, "Verify basket page url").toHaveURL(this.pageUrl);
    await this.waitForElementBeVisible(this.uniquesBasketPageLocator);
  }
}
