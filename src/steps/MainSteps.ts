import { Page, expect } from "@playwright/test";
import { BasketPopup } from "../pages/main/components/BasketPopup.page";
import { MainPage } from "../pages/main/Main.page";
import {
  BasketProductModel,
  ProductCard,
} from "../pages/main/components/ProductCard.page";
import { BasketItem } from "../pages/main/components/BasketItem.page";
import { allure } from "allure-playwright";

export class MainSteps {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async waitForMainPageToBeLoaded() {
    const mainPage = new MainPage(this.page);
    await mainPage.basketItemsCount.waitFor({
      state: "visible",
      timeout: 5000,
    });
  }

  async openBasketPopup() {
    await allure.step("Open basket popup", async () => {
      const mainPage = new MainPage(this.page);
      await mainPage.basketLink.focus();
      await mainPage.basketLink.click();
    });
  }

  async verifyBasketPopupVisible() {
    await allure.step("Verify basket popup is visible", async () => {
      const basketPopup = new BasketPopup(this.page);
      await basketPopup.verifyBasketVisible();
    });
  }

  async clickGoToBasket() {
    await allure.step("Click go to basket button", async () => {
      const basketPopup = new BasketPopup(this.page);

      await Promise.all([
        this.page.waitForResponse(
          (response) =>
            response.url() === `${process.env.API_URL}basket` &&
            response.status() == 200
        ),
        basketPopup.openBasket(),
      ]);
    });
  }

  async findProduct(
    hasDiscount: boolean,
    countToBy: number = 1
  ): Promise<ProductCard> {
    const product = await allure.step<ProductCard>(
      `Find product: hasDiscount=${hasDiscount} countToBy=${countToBy}`,
      async () => {
        const mainPage = new MainPage(this.page);
        return await mainPage.findProduct(hasDiscount, countToBy);
      }
    );
    return product;
  }

  async buyProduct(
    product: ProductCard,
    countToBy: number = 1
  ): Promise<BasketProductModel> {
    return await allure.step<BasketProductModel>(
      `Buy product: productId=${product.productId}, countToBuy=${countToBy}`,
      async () => {
        await product.countInput.waitFor();
        await product.countInput.focus();
        await product.countInput.click();
        await product.countInput.fill(countToBy.toString());
        await product.buyButton.click();
        return await product.convertToModel(countToBy);
      }
    );
  }

  async buyDifferentProducts(
    productsCount: number
  ): Promise<BasketProductModel[]> {
    return await allure.step<BasketProductModel[]>(
      `Buy ${productsCount} different products`,
      async () => {
        let resultProducts: BasketProductModel[] = [];
        const mainPage = new MainPage(this.page);
        const pagesCount = await mainPage.getPagesCount();

        let activePageNum = 1;
        pagesLoop: while (activePageNum <= pagesCount) {
          let productCards = this.page.locator(".note-list > div");
          const productCountOnPage = await productCards.count();

          for (
            let productIndex = 0;
            productIndex < productCountOnPage;
            productIndex++
          ) {
            const productId = await productCards
              .nth(productIndex)
              .locator(".note-item.card")
              .getAttribute("data-product");
            const productCard = new ProductCard(this.page, productId!);
            await productCard.buyProduct();
            const productModel = await productCard.convertToModel();
            const actualProductsCount = resultProducts.push(productModel);
            if (actualProductsCount === productsCount) {
              break pagesLoop;
            }
          }

          if (activePageNum === pagesCount) {
            throw new Error(
              `Not enough products. Only ${resultProducts.length} products were found. Expected: ${productsCount}`
            );
          }
          activePageNum++;
          await mainPage.switchActivePage(activePageNum);
        }

        return resultProducts;
      }
    );
  }

  async verifyBasketProductsCount(expectedProductsCount: number) {
    await allure.step("Verify basket products count", async () => {
      const mainPage = new MainPage(this.page);
      await expect(
        mainPage.basketItemsCount,
        `Verify Basket products count equals to ${expectedProductsCount}`
      ).toHaveText(expectedProductsCount.toString());
    });
  }

  async verifyBasketProducts(expectedProducts: BasketProductModel[]) {
    await allure.step("Verify basket products count", async () => {
      const basketPopup = new BasketPopup(this.page);
      await basketPopup.verifyBasketVisible();
      expectedProducts.forEach(
        async (el) => await this.verifyProductInBasket(el)
      );
      expect
        .soft(
          await basketPopup.getBasketItemsCount(),
          "Verify basket items count"
        )
        .toEqual(expectedProducts.length);
      await this.verifyGeneralBasketPrice(basketPopup, expectedProducts);
    });
  }

  async verifyProductInBasket(expectedProduct: BasketProductModel) {
    await allure.step(
      `Verify product in basket: productId=${expectedProduct.id}`,
      async () => {
        const basketItem = new BasketItem(
          this.page,
          expectedProduct.id.toString()
        );
        await expect
          .soft(basketItem.itemTitle, "Verify product name")
          .toHaveText(expectedProduct.name!);
        expect
          .soft(await basketItem.getItemPrice(), "Verify product price")
          .toBe(
            (expectedProduct.discountPrice || expectedProduct.price) *
              expectedProduct.basketCount
          );
        await expect
          .soft(basketItem.itemCount, "Verify items count")
          .toHaveText(expectedProduct.basketCount.toString());
      }
    );
  }

  async setDiscountFilter(checked: boolean) {
    await allure.step(`Set discount filter: checked=${checked}`, async () => {
      const mainPage = new MainPage(this.page);
      await mainPage.discountFilterCheckBox.setChecked(checked);
    });
  }

  private async verifyGeneralBasketPrice(
    basketPopup: BasketPopup,
    expectedProducts: BasketProductModel[]
  ) {
    await allure.step(`Verify general basket price`, async () => {
      const commonPrice = expectedProducts.reduce(
        (acc, product) =>
          (acc +=
            (product.discountPrice || product.price) * product.basketCount),
        0
      );
      await expect(
        basketPopup.basketPrice,
        "Verify general basket price"
      ).toHaveText(commonPrice.toString());
    });
  }
}
