import { test } from "../../../src/fixtures/testFixture";
import { BasketApiClient } from "../../../src/restApi/enotes/BasketApiClient";
import { ProductsApiClient } from "../../../src/restApi/enotes/ProductsApiClient";
import { Page } from "@playwright/test";
import { TokenHelper } from "../../../src/restApi/enotes/TokenHelper";
import { Steps } from "../../../src/steps/Steps";
import { getRandomElement } from "../../../src//helpers/ArrayHelper";
import { ModelMapper } from "../../../src/automapper/ModelMapper";
import { BasketProduct } from "../../../src/pages/main/components/ProductCard.page";

let page: Page;
let basketApiClient: BasketApiClient;
let productsApiClient: ProductsApiClient;
let steps: Steps;
let modelMapper: ModelMapper;

test.beforeAll(async ({ enotesContext }) => {
  page = await enotesContext.newPage();
  const tokenHelper = new TokenHelper(page);
  basketApiClient = new BasketApiClient(enotesContext, tokenHelper);
  productsApiClient = new ProductsApiClient(enotesContext, tokenHelper);
  steps = new Steps(page);
  modelMapper = new ModelMapper();
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

  test("Open basket with 9 different items", async () => {
    const discountProducts = (await productsApiClient.getProducts(true))
      .products;
    const product = getRandomElement(discountProducts);
    const res = modelMapper.map(product);
    res.basketCount = 1;
    await basketApiClient.addItemToBasket(product.id, res.basketCount);
    await page.reload();

    const productsToBuy = 8;
    let products = await steps.mainSteps.buyDifferentProducts(productsToBuy);
    products = groupProductsAndCount([...products, res]);
    let productsCount = products.reduce(
      (acc, item) => (acc += item.basketCount),
      0
    );
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

function groupProductsAndCount(products: BasketProduct[]): BasketProduct[] {
  const groupedProducts: Map<number, BasketProduct> = new Map();

  // Iterate through the products
  for (const product of products) {
    // If the product ID is already in the map, increment its count
    if (groupedProducts.has(product.id)) {
      const existingProduct = groupedProducts.get(product.id)!;
      existingProduct.basketCount++;
    } else {
      // Otherwise, add the product to the map with count 1
      const newProduct: BasketProduct = { ...product, basketCount: 1 };
      groupedProducts.set(product.id, newProduct);
    }
  }

  // Convert the map values to an array
  const result: BasketProduct[] = Array.from(groupedProducts.values());
  return result;
}
