import { BrowserContext } from "@playwright/test";
import { BasketApiClient } from "./BasketApiClient";
import { Product, ProductsApiClient } from "./ProductsApiClient";
import { TokenHelper } from "./TokenHelper";
import { getRandomElement } from "../../helpers/ArrayHelper";

export class ApiActions {
  readonly basketApiClient: BasketApiClient;
  readonly productsApiClient: ProductsApiClient;

  constructor(browserContext: BrowserContext, tokenHelper: TokenHelper) {
    this.basketApiClient = new BasketApiClient(browserContext, tokenHelper);
    this.productsApiClient = new ProductsApiClient(browserContext, tokenHelper);
  }

  async addRandomProductToBasket(
    hasDiscount: boolean,
    basketCount: number
  ): Promise<Product> {
    const products = (await this.productsApiClient.getProducts(hasDiscount))
      .products;
    const product = getRandomElement(products);
    await this.basketApiClient.addItemToBasket(product.id, basketCount);
    return product;
  }
}
