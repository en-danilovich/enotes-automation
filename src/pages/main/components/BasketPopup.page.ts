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

  // TODO user different extends class not Page
  // async waitForPopupToBeVisible() {
  //   await super.waitForElementBeVisible(this.basketPopup);
  // }

  async focus() {
    await this.basketPopup.focus();
  }

  async verifyBasketVisible() {
    await expect(this.basketPopup).toBeVisible();
  }

  async openBasket() {
    await this.openBasketButton.click();
    // return new BasketPage(this.page);
  }
}
