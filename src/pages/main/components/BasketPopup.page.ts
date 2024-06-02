import { Locator, Page, expect } from "@playwright/test";

export class BasketPopup {
  readonly page: Page;
  readonly basketPopup: Locator;
  readonly basketPrice: Locator;
  readonly openBasketButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.basketPopup = this.page.locator("#basketContainer > .dropdown-menu");
    this.basketPrice = this.basketPopup.locator(".basket_price");
    this.openBasketButton = this.basketPopup.getByRole("button", {
      name: "Перейти в корзину",
    });
  }

  async focus() {
    await this.basketPopup.focus();
  }

  async verifyBasketVisible() {
    await expect(this.basketPopup, "Basket popup is visible").toBeVisible();
  }

  async openBasket() {
    await this.openBasketButton.click();
  }

  async getBasketItemsCount() {
    return await this.basketPopup.locator("li.basket-item").count();
  }
}
