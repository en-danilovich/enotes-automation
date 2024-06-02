import { BrowserContext } from "@playwright/test";
import { BasketApiClient } from "./BasketApiClient";
import { Product, ProductsApiClient } from "./ProductsApiClient";
import { TokenHelper } from "./TokenHelper";
import { getRandomElement } from "../../helpers/ArrayHelper";
import { allure } from "allure-playwright";

export class ApiActions {
  readonly basketApiClient: BasketApiClient;
  readonly productsApiClient: ProductsApiClient;

  constructor(browserContext: BrowserContext, tokenHelper: TokenHelper) {
    this.basketApiClient = new BasketApiClient(browserContext, tokenHelper);
    this.productsApiClient = new ProductsApiClient(browserContext, tokenHelper);
  }

  async clearBasket() {
    await allure.step(
      "Clear basket",
      async () => await this.basketApiClient.clearBasket()
    );
  }

  async addRandomProductToBasket(
    hasDiscount: boolean,
    basketCount: number
  ): Promise<Product> {
    return await allure.step<Product>("Add product via API", async () => {
      let response = await this.productsApiClient.getProducts(hasDiscount);
      const pagesCount = response.pages;

      let product: Product | undefined;
      for (let currentPage = 1; currentPage <= pagesCount; currentPage++) {
        const products = response.products.filter(
          (product) => product.count >= basketCount
        );

        if (products.length > 0) {
          product = getRandomElement(products);
          break;
        }

        if (currentPage === pagesCount) {
          break;
        }

        response = await this.productsApiClient.getProducts(
          hasDiscount,
          ++currentPage
        );
      }

      if (!product) {
        throw new Error(`There are no products with count >= ${basketCount}`);
      }
      await this.basketApiClient.addItemToBasket(product.id, basketCount);
      return product;
    });
  }
}
