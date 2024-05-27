import { Page, expect } from "@playwright/test";
import { BasketPopup } from "../pages/main/components/BasketPopup.page";
import { MainPage } from "../pages/main/Main.page";
import {
  ProductCard,
  ProductCardModel,
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
  ): Promise<ProductCardModel> {
    await product.buyButton.focus();
    await product.countInput.fill(countToBy.toString());
    await product.buyButton.click();
    const model = await product.convertToModel(countToBy);
    return model;
  }

  async verifyBasketProductsCount(expectedProductsCount: number) {
    const mainPage = new MainPage(this.page);
    await expect(mainPage.basketItemsCount).toHaveText(
      expectedProductsCount.toString()
    );
  }

  async verifyBasketProducts(expectedProducts: ProductCardModel[]) {
    const basketPopup = new BasketPopup(this.page);
    await basketPopup.verifyBasketVisible();
    // TODO verify common product count equals to expected
    expectedProducts.forEach(
      async (el) => await this.verifyProductInBasket(el)
    );
    await this.verifyCommonBasketPrice(basketPopup, expectedProducts);
  }

  async verifyProductInBasket(expectedProduct: ProductCardModel) {
    const basketItem = new BasketItem(this.page, expectedProduct.id.toString());
    await expect(basketItem.itemTitle).toHaveText(expectedProduct.productName!);
    expect(await basketItem.getItemPrice()).toBe(expectedProduct.price);
    await expect(basketItem.itemCount).toHaveText(
      expectedProduct.count.toString()
    );
  }

  async setDiscountFilter(checked: boolean) {
    const mainPage = new MainPage(this.page);
    await mainPage.discountFilterCheckBox.setChecked(checked);
  }

  private async verifyCommonBasketPrice(
    basketPopup: BasketPopup,
    expectedProducts: ProductCardModel[]
  ) {
    const commonPrice = expectedProducts.reduce(
      (acc, product) => (acc += product.price * product.count),
      0
    );
    await expect(basketPopup.basketPrice).toHaveText(commonPrice.toString());
  }
}
