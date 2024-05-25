import { Page } from "@playwright/test";
import { HeaderPage } from "./Header.page";

export class BasketPage extends HeaderPage {
  constructor(page: Page) {
    super(page);
  }

  async verifyPageVisible() {
    throw new Error("Not Implemented");
  }
}
