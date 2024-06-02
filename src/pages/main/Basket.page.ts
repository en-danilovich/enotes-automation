import { Page, expect } from "@playwright/test";
import { HeaderPage } from "./Header.page";

export class BasketPage extends HeaderPage {
  readonly pageUrl: string = `${[process.env.BASE_URL]}basket`;
  constructor(page: Page) {
    super(page);
  }

  async verifyPageVisible() {
    await expect(this.page, "verify basket page url").toHaveURL(this.pageUrl);
    throw new Error("Not Implemented");
  }
}
