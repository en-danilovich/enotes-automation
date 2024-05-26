import { test } from "../../../src/fixtures/testFixture";
import { BasketApiClient } from "../../../src/restApi/enotes/BasketApiClient";
import { Page } from "@playwright/test";
import { TokenHelper } from "../../../src/restApi/enotes/TokenHelper";
import { Steps } from "../../../src/steps/Steps";

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
    const productWithoutDiscount =
      await steps.mainSteps.findProductWithoutDiscount();
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
    const productWithoutDiscount =
      await steps.mainSteps.findProductWithoutDiscount();
    const cardProductModel = await steps.mainSteps.buyProduct(
      productWithoutDiscount
    );
    await steps.mainSteps.verifyBasketProductsCount(1);

    await steps.mainSteps.openBasketPopup();
    await steps.mainSteps.verifyBasketProducts([cardProductModel]);

    await steps.mainSteps.clickGoToBasket();
    await steps.basketSteps.verifyBasketPageVisible();
  });
});
