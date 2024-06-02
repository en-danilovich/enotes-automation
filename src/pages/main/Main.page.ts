import { Locator, Page, expect } from "@playwright/test";
import { HeaderPage } from "./Header.page";
import { ProductCard } from "./components/ProductCard.page";
import { getRandomElement } from "../../helpers/ArrayHelper";

export class MainPage extends HeaderPage {
  readonly pageUrl: string = process.env.BASE_URL!;
  readonly noteFilters: Locator;
  readonly discountFilterCheckBox: Locator;

  constructor(page: Page) {
    super(page);
    this.noteFilters = page.locator("//div[contains(@class, 'note-filters')]");
    this.discountFilterCheckBox = page.locator("#gridCheck");
  }

  async waitForPageToBeVisible() {
    await expect(this.page).toHaveURL(this.pageUrl);
    await super.waitForElementBeVisible(this.noteFilters);
  }

  async findProduct(
    hasDiscount: boolean,
    countToBy: number = 1
  ): Promise<ProductCard> {
    const pagesCount = await this.getPagesCount();
    let productCard;

    let activePageNum = 1;
    while (activePageNum <= pagesCount) {
      let elementLocator = this.page.locator(
        `.note-item.card${hasDiscount ? ".hasDiscount" : ":not(.hasDiscount)"}`
      );
      elementLocator = await this.addCountFilter(elementLocator, countToBy);
      const elements = await elementLocator.all();

      if (elements.length > 0) {
        const randomElement = getRandomElement(elements);
        const productId = await randomElement.getAttribute("data-product");
        productCard = new ProductCard(this.page, productId!);
        break;
      }

      activePageNum++;
      if (activePageNum != pagesCount) {
        await this.switchActivePage(activePageNum);
      }
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
    await this.page
      .locator(`.page-link[data-page-number='${pageNumber}']`)
      .click();
  }

  async getPagesCount() {
    const lastPage = await this.page
      .locator("ul.pagination > li:last-child > .page-link")
      .getAttribute("data-page-number");
    return parseInt(lastPage!);
  }

  private async addCountFilter(element: Locator, expectedCount: number) {
    if (expectedCount > 1) {
      const countNumbers = await this.getProductsCount(expectedCount);
      const regex = new RegExp(`^(${countNumbers.join("|")})$`);
      return element.filter({
        has: this.page.locator(".product_count", { hasText: regex }),
      });
    }
    return element;
  }

  private async getProductsCount(expectedCount: number) {
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
