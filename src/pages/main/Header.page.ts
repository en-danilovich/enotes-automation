import { Locator, Page } from "@playwright/test";
import { BasePage } from "../Base.page";
import { BasketPopup } from "./BasketPopup.page";

export abstract class HeaderPage extends BasePage {
  readonly basketLink: Locator;

  constructor(page: Page) {
    super(page);
    this.basketLink = page.locator("#dropdownBasket");
  }

  async openBasketPopup(): Promise<BasketPopup> {
    await this.basketLink.click();
    return new BasketPopup(this.page);
  }
}
