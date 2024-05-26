import { Locator, Page, expect } from "@playwright/test";
import { HeaderPage } from "./Header.page";
import { ProductCard } from "./components/ProductCard.page";

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

  async findNonDiscountProduct(): Promise<ProductCard> {
    const lastPage = await this.page
      .locator("ul.pagination > li:last-child > .page-link")
      .getAttribute("data-page-number");
    const pagesCount = parseInt(lastPage!);

    let productCard;
    const elementCount = await this.page.$$eval(
      ".note-item.card",
      (elements) => elements.length
    );
    expect(elementCount).toBeGreaterThan(1);

    let activePageNum = 1;
    while (activePageNum <= pagesCount) {
      const noDiscountElements = await this.page
        .locator(".note-item.card:not(.hasDiscount)")
        .all();
      if (noDiscountElements.length > 0) {
        const randomIndex = Math.floor(
          Math.random() * noDiscountElements.length
        );
        const randomElement = noDiscountElements[randomIndex];
        const productId = await randomElement.getAttribute("data-product");
        productCard = new ProductCard(this.page, productId!);
      }
      activePageNum++;
      await this.switchActivePage(activePageNum);
    }

    if (!productCard) {
      throw new Error("Non discount products were not found");
    }
    return productCard;
  }

  async switchActivePage(pageNumber: number) {
    this.page.locator(`.page-link[data-page-number="${pageNumber}`);
  }
}
