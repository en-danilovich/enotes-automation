import { Page } from "@playwright/test";
import { BasketPage } from "../pages/main/Basket.page";

export class BasketSteps {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async verifyBasketPageVisible() {
    const basketPage = new BasketPage(this.page);
    await basketPage.verifyPageVisible();
  }
}
