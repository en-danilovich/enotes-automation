import { Page } from "@playwright/test";
import { BasketPage } from "../pages/main/Basket.page";
import { allure } from "allure-playwright";

export class BasketSteps {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async verifyBasketPageVisible() {
    await allure.step("Verify basket page visible", async () => {
      const basketPage = new BasketPage(this.page);
      await basketPage.verifyPageVisible();
    });
  }
}
