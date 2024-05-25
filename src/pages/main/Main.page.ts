import { Locator, Page } from "@playwright/test";
import { HeaderPage } from "./Header.page";

export class MainPage extends HeaderPage {
  readonly noteFilters: Locator;

  constructor(page: Page) {
    super(page);
    this.noteFilters = page.locator("//div[contains(@class, 'note-filters')]");
  }

  async waitForPageToBeVisible() {
    await super.waitForElementBeVisible(this.noteFilters);
  }

  // TODO: add url verification
}
