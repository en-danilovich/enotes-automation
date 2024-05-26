import { Locator, Page } from "@playwright/test";

export type ProductCardModel = {
  id: number;
  productType: string | null;
  productName: string | null;
  price: number;
  count: number;
};

export class ProductCard {
  readonly page: Page;
  readonly productId: number;
  readonly productLocator: Locator;
  readonly productType: Locator;
  readonly productName: Locator;
  readonly productPrice: Locator;
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
    this.buyButton = this.productLocator.locator(".actionBuyProduct");
  }

  async buyProduct() {
    await this.buyButton.click();
  }

  async convertToModel(): Promise<ProductCardModel> {
    const productType = await this.productType.textContent();
    const productName = await this.productName.textContent();
    const productPrice = await this.productPrice.textContent();

    const productModel: ProductCardModel = {
      id: this.productId,
      productType: productType,
      productName: productName,
      price: parseInt(productPrice!),
      count: 1,
    };
    return productModel;
  }
}
