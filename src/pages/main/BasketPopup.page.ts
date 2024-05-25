import { Locator, Page, expect } from "@playwright/test";
// import { BasketPage } from "./Basket.page";

export class BasketPopup {
  readonly page: Page;
  readonly basketPopup: Locator;
  readonly openBasketButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.basketPopup = this.page.locator(
      "//li[@id='basketContainer']//div[contains(@class,'dropdown-menu')]"
    );
    this.openBasketButton = this.page.locator("//a[href='/basket']:visible");
  }

  // TODO user different extends class not Page
  // async waitForPopupToBeVisible() {
  //   await super.waitForElementBeVisible(this.basketPopup);
  // }

  async verifyBasketVisible() {
    await expect(this.basketPopup).toBeVisible();
  }

  async openBasket() {
    await this.openBasketButton.click();
    // return new BasketPage(this.page);
  }
}
