import { Locator, Page, expect } from "@playwright/test";

export type BasketItemModel = {
  id: number;
  productType: string;
  productName: string;
  price: number;
  count: number;
};

export class BasketItem {
  readonly page: Page;
  readonly basketProductLocator: Locator;
  readonly itemTitle: Locator;
  readonly itemPrice: Locator;
  readonly itemCount: Locator;

  constructor(page: Page, productId: string) {
    this.page = page;
    this.basketProductLocator = this.page.locator(
      `.basket-item[data-product="${productId}"]`
    );
    this.itemTitle = this.basketProductLocator.locator(".basket-item-title");
    this.itemPrice = this.basketProductLocator.locator(".basket-item-price");
    this.itemCount = this.basketProductLocator.locator(".basket-item-count");
  }

  async getItemPrice(): Promise<number> {
    const priceString = await this.itemPrice.textContent();
    expect(priceString).not.toBeNull();
    // Regex pattern to match the price value
    const regexPattern = /\d+/;

    // Extract the price using the regex pattern
    const match = priceString?.match(regexPattern);

    // Get the price value from the match
    const price = match ? parseInt(match[0]) : NaN;
    return price;
  }
}
