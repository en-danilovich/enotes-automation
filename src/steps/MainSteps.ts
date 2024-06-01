import { Page, expect } from "@playwright/test";
import { BasketPopup } from "../pages/main/components/BasketPopup.page";
import { MainPage } from "../pages/main/Main.page";
import {
  BasketProduct,
  ProductCard,
  Product,
} from "../pages/main/components/ProductCard.page";
import { BasketItem } from "../pages/main/components/BasketItem.page";

export class MainSteps {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async openBasketPopup(): Promise<BasketPopup> {
    const mainPage = new MainPage(this.page);
    await mainPage.basketLink.focus();
    await mainPage.basketLink.click();
    return new BasketPopup(this.page);
  }

  async verifyBasketPopupVisible() {
    const basketPopup = new BasketPopup(this.page);
    await basketPopup.verifyBasketVisible();
  }

  async clickGoToBasket() {
    const basketPopup = new BasketPopup(this.page);
    // TODO add wait for visible probably
    await basketPopup.openBasket();
  }

  async findProduct(
    hasDiscount: boolean,
    countToBy: number = 1
  ): Promise<ProductCard> {
    const mainPage = new MainPage(this.page);
    const product = await mainPage.findProduct(hasDiscount, countToBy);
    return product;
  }

  async buyProduct(
    product: ProductCard,
    countToBy: number = 1
  ): Promise<BasketProduct> {
    await product.countInput.waitFor();
    await product.countInput.focus();
    await product.countInput.click();
    await product.countInput.fill(countToBy.toString());
    await product.buyButton.click();
    const model = await product.convertToModel(countToBy);
    return model;
  }

  async buyDifferentProducts(productsCount: number): Promise<BasketProduct[]> {
    let resultProducts: BasketProduct[] = [];
    const mainPage = new MainPage(this.page);
    const pagesCount = await mainPage.getPagesCount();

    let activePageNum = 1;
    pagesLoop: while (activePageNum <= pagesCount) {
      let productCards = this.page.locator(".note-list > div");
      const count = await productCards.count();

      for (let i = 0; i < count; i++) {
        const element = productCards.nth(i);
        const productId = await element
          .locator(".note-item.card")
          .getAttribute("data-product");
        let productCard = new ProductCard(this.page, productId!);
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

  async verifyBasketProductsCount(expectedProductsCount: number) {
    const mainPage = new MainPage(this.page);
    await expect(mainPage.basketItemsCount).toHaveText(
      expectedProductsCount.toString()
    );
  }

  async verifyBasketProducts(expectedProducts: BasketProduct[]) {
    const basketPopup = new BasketPopup(this.page);
    await basketPopup.verifyBasketVisible();
    // TODO verify common product count equals to expected
    expectedProducts.forEach(
      async (el) => await this.verifyProductInBasket(el)
    );
    await this.verifyCommonBasketPrice(basketPopup, expectedProducts);
  }

  async verifyProductInBasket(expectedProduct: BasketProduct) {
    const basketItem = new BasketItem(this.page, expectedProduct.id.toString());
    await expect(basketItem.itemTitle).toHaveText(expectedProduct.name!);
    expect(await basketItem.getItemPrice()).toBe(
      expectedProduct.discountPrice || expectedProduct.price
    );
    await expect(basketItem.itemCount).toHaveText(
      expectedProduct.basketCount.toString()
    );
  }

  async setDiscountFilter(checked: boolean) {
    const mainPage = new MainPage(this.page);
    await mainPage.discountFilterCheckBox.setChecked(checked);
  }

  private async verifyCommonBasketPrice(
    basketPopup: BasketPopup,
    expectedProducts: BasketProduct[]
  ) {
    const commonPrice = expectedProducts.reduce(
      (acc, product) =>
        (acc += (product.discountPrice || product.price) * product.basketCount),
      0
    );
    await expect(basketPopup.basketPrice).toHaveText(commonPrice.toString());
  }
}
