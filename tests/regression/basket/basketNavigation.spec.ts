import { test } from "../../../src/fixtures/testFixture";
import { BasketApiClient } from "../../../src/restApi/enotes/BasketApiClient";
import { Page } from "@playwright/test";
import { TokenHelper } from "../../../src/restApi/enotes/TokenHelper";
import { Steps } from "../../../src/steps/Steps";
import { MainPage } from "../../../src/pages/main/Main.page";

let page: Page;
let basketApiClient: BasketApiClient;
let steps: Steps;

test.beforeAll(async ({ enotesContext }) => {
  page = await enotesContext.newPage();
  basketApiClient = new BasketApiClient(enotesContext, new TokenHelper(page));
  steps = new Steps(page);
});

test.beforeEach(async () => {
  await page.goto("./");
  await basketApiClient.clearBasket();
  await page.reload({ waitUntil: "domcontentloaded" });
  // TODO wait until get basket response
  await page.waitForSelector(".basket-count-items", {
    state: "visible",
    timeout: 5000,
  });
});

test.describe("Basket navigation", () => {
  test("Open empty basket", async () => {
    await steps.mainSteps.openBasketPopup();
    await steps.mainSteps.verifyBasketPopupVisible();

    await steps.mainSteps.clickGoToBasket();
    await steps.basketSteps.verifyBasketPageVisible();
  });

  test("Open basket with 1 non discount item", async () => {
    const productWithoutDiscount = await steps.mainSteps.findProduct(false);
    const cardProductModel = await steps.mainSteps.buyProduct(
      productWithoutDiscount
    );
    await steps.mainSteps.verifyBasketProductsCount(1);

    await steps.mainSteps.openBasketPopup();
    await steps.mainSteps.verifyBasketProducts([cardProductModel]);

    await steps.mainSteps.clickGoToBasket();
    await steps.basketSteps.verifyBasketPageVisible();
  });

  test("Open basket with 1 discount item", async () => {
    await steps.mainSteps.setDiscountFilter(true);
    const discountProduct = await steps.mainSteps.findProduct(true);
    const cardProductModel = await steps.mainSteps.buyProduct(discountProduct);
    await steps.mainSteps.verifyBasketProductsCount(1);

    await steps.mainSteps.openBasketPopup();
    await steps.mainSteps.verifyBasketProducts([cardProductModel]);

    await steps.mainSteps.clickGoToBasket();
    await steps.basketSteps.verifyBasketPageVisible();
  });

  test("Open basket with 9 promotional items of the same name", async () => {
    const mainPage = new MainPage(page);
  });

  test("Open basket with 9 discount items of the same name", async () => {
    await steps.mainSteps.setDiscountFilter(true);
    const countToBuy = 9;
    const discountProduct = await steps.mainSteps.findProduct(true, countToBuy);
    const cardProductModel = await steps.mainSteps.buyProduct(
      discountProduct,
      countToBuy
    );
    await steps.mainSteps.verifyBasketProductsCount(countToBuy);

    await steps.mainSteps.openBasketPopup();
    await steps.mainSteps.verifyBasketProducts([cardProductModel]);

    await steps.mainSteps.clickGoToBasket();
    await steps.basketSteps.verifyBasketPageVisible();
  });
});
