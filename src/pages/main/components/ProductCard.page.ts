import { Locator, Page } from "@playwright/test";

export interface ProductModel {
  id: number;
  type: string;
  name: string;
  price: number;
  discountPrice: number;
  count: number;
}

export interface BasketProductModel extends ProductModel {
  basketCount: number;
}

export class ProductCard {
  readonly page: Page;
  readonly productId: number;
  readonly productLocator: Locator;
  readonly productType: Locator;
  readonly productName: Locator;
  readonly productPrice: Locator;
  readonly countInput: Locator;
  readonly productCount: Locator;
  readonly buyButton: Locator;

  constructor(page: Page, productId: string) {
    this.page = page;
    this.productId = parseInt(productId);
    this.productLocator = this.page.locator(
      `.note-item.card[data-product="${productId}"]`
    );
    this.productType = this.productLocator.locator(".product_type");
    this.productName = this.productLocator.locator(".product_name");
    this.productPrice = this.productLocator.locator(".product_price");
    this.countInput = this.productLocator.locator(
      "[name='product-enter-count']"
    );
    this.productCount = this.productLocator.locator(".product_count");
    this.buyButton = this.productLocator.locator(".actionBuyProduct");
  }

  async buyProduct() {
    await this.buyButton.click();
  }

  async convertToModel(countToBuy: number = 1): Promise<BasketProductModel> {
    const productType = await this.productType.textContent();
    const productName = await this.productName.textContent();
    const productPrice = await this.productPrice.textContent();
    const productCount = await this.productCount.textContent();

    const [discountPrice, regularPrice] = this.parsePrice(productPrice!);

    return {
      id: this.productId,
      type: productType!,
      name: productName!,
      price: regularPrice,
      discountPrice: discountPrice,
      count: parseInt(productCount!),
      basketCount: countToBuy,
    };
  }

  private parsePrice(priceString: string): number[] {
    const priceRegex = /(\d+)\sр/g;
    const prices = [];

    let match;
    while ((match = priceRegex.exec(priceString)) !== null) {
      prices.push(parseInt(match[1], 10));
    }

    if (prices.length === 1) {
      prices.unshift(0);
    }

    return prices;
  }
}
