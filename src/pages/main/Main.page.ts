import { Locator, Page, expect } from "@playwright/test";
import { HeaderPage } from "./Header.page";
import { ProductCard } from "./components/ProductCard.page";

export class MainPage extends HeaderPage {
  readonly noteFilters: Locator;
  readonly discountFilterCheckBox: Locator;

  constructor(page: Page) {
    super(page);
    this.noteFilters = page.locator("//div[contains(@class, 'note-filters')]");
    this.discountFilterCheckBox = page.locator("#gridCheck");
  }

  async waitForPageToBeVisible() {
    await super.waitForElementBeVisible(this.noteFilters);
  }

  // TODO: add url verification

  async findProduct(
    hasDiscount: boolean,
    countToBy: number = 1
  ): Promise<ProductCard> {
    const lastPage = await this.page
      .locator("ul.pagination > li:last-child > .page-link")
      .getAttribute("data-page-number");
    const pagesCount = parseInt(lastPage!);

    let productCard;
    // const elementCount = await this.page.$$eval(
    //   ".note-item.card",
    //   (elements) => elements.length
    // );
    // expect(elementCount).toBeGreaterThan(1);

    let activePageNum = 1;
    while (activePageNum <= pagesCount) {
      let elementLocator = this.page.locator(
        `.note-item.card${hasDiscount ? ".hasDiscount" : ":not(.hasDiscount)"}`
      );
      elementLocator = await this.addCountFilter(elementLocator, countToBy);
      const elements = await elementLocator.all();

      if (elements.length > 0) {
        const randomElement = this.getRandomProduct(elements);
        const productId = await randomElement.getAttribute("data-product");
        productCard = new ProductCard(this.page, productId!);
        break;
      }

      activePageNum++;
      await this.switchActivePage(activePageNum);
    }

    if (!productCard) {
      throw new Error(
        `${
          hasDiscount ? "Non " : ""
        }Discount products with count >= ${countToBy} were not found`
      );
    }

    return productCard;
  }

  async switchActivePage(pageNumber: number) {
    this.page.locator(`.page-link[data-page-number="${pageNumber}`);
  }

  async addCountFilter(element: Locator, expectedCount: number) {
    if (expectedCount > 1) {
      const countNumbers = await this.getProductsCount(expectedCount);
      const regex = new RegExp(`^(${countNumbers.join("|")})$`);
      return element.filter({
        has: this.page.locator(".product_count", { hasText: regex }),
      });
    }
    return element;
  }

  private getRandomProduct(elements: Locator[]) {
    const randomIndex = Math.floor(Math.random() * elements.length);
    return elements[randomIndex];
  }

  async getProductsCount(expectedCount: number) {
    const spans = await this.page.$$eval(
      "span.product_count",
      (spans, expectedCount) => {
        spans = spans.filter(
          (el) => el.textContent && parseInt(el.textContent) >= expectedCount
        );
        return spans.map((el) => el.textContent);
      },
      expectedCount
    );
    return spans;
  }
}
