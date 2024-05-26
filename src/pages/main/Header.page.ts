import { Locator, Page } from "@playwright/test";
import { BasePage } from "../Base.page";
import { BasketPopup } from "./components/BasketPopup.page";

export abstract class HeaderPage extends BasePage {
  readonly basketLink: Locator;
  readonly basketItemsCount: Locator;

  constructor(page: Page) {
    super(page);
    this.basketLink = page.locator("#dropdownBasket");
    this.basketItemsCount = page.locator(".basket-count-items");
  }

  async openBasketPopup(): Promise<BasketPopup> {
    await this.basketLink.click();
    return new BasketPopup(this.page);
  }
}
