import { test } from "../../../src/fixtures/testFixture";
import { Page } from "@playwright/test";
import { TokenHelper } from "../../../src/restApi/enotes/TokenHelper";
import { Steps } from "../../../src/steps/Steps";
import { ModelMapper } from "../../../src/automapper/ModelMapper";
import { ApiActions } from "../../../src/restApi/enotes/ApiActions";
import {
  groupProducts,
  getProductsCount,
} from "../../../src/helpers/ProductsHelper";

let page: Page;
let steps: Steps;
let modelMapper: ModelMapper;
let apiActions: ApiActions;

test.beforeAll(async ({ enotesContext }) => {
  page = await enotesContext.newPage();
  const tokenHelper = new TokenHelper(page);
  apiActions = new ApiActions(enotesContext, tokenHelper);
  modelMapper = new ModelMapper();
  steps = new Steps(page);
});

test.beforeEach(async () => {
  await page.goto("./");
  await apiActions.clearBasket();
  await page.reload({ waitUntil: "domcontentloaded" });
  await steps.mainSteps.waitForMainPageToBeLoaded();
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

  test("Open basket with 9 different items", async () => {
    // precondition
    const countToAdd = 1;
    const apiProduct = await apiActions.addRandomProductToBasket(
      true,
      countToAdd
    );
    await page.reload();
    const uiProduct = modelMapper.map(apiProduct);
    uiProduct.basketCount = countToAdd;

    // steps
    const productsToBuy = 8;
    let products = await steps.mainSteps.buyDifferentProducts(productsToBuy);
    products = groupProducts([...products, uiProduct]);
    const productsCount = getProductsCount(products);
    await steps.mainSteps.verifyBasketProductsCount(productsCount);

    await steps.mainSteps.openBasketPopup();
    await steps.mainSteps.verifyBasketProducts(products);

    await steps.mainSteps.clickGoToBasket();
    await steps.basketSteps.verifyBasketPageVisible();
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
