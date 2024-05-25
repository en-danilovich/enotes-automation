import { test } from "../../../src/fixtures/testFixture";
import { BasketApiClient } from "../../../src/restApi/enotes/BasketApiClient";
import { MainPage } from "../../../src/pages/main/Main.page";
import { expect } from "@playwright/test";
import { BasketPage } from "../../../src/pages/main/Basket.page";

// let basketApiClient;
// let page;

test.beforeEach(async ({ enotesContext, apiToken }) => {
  let basketApiClient = new BasketApiClient(enotesContext, apiToken);
  await basketApiClient.clearBasket();
});

test.describe("Basket navigation", () => {
  test("Open empty basket", async ({ page }) => {
    const mainPage = new MainPage(page);

    const basketPopup = await mainPage.openBasketPopup();
    await basketPopup.verifyBasketVisible();

    await basketPopup.openBasket();
    const basketPage = new BasketPage(page);
    basketPage.verifyPageVisible();
  });

  // TODO change test name
  test("Open basket with 1 non discount item", async ({ page }) => {
    // 1. Добавить в корзину один товар без скидки	Рядом с корзиной отображается цифра 1
    // 2. Нажать на иконку корзины	Открывается окно корзины, в котором указана цена, наименование товара, общая сумма
    // 3. В окне корзины нажать кнопку перейти в корзину	Переход на страницу корзины
    await page.waitForLoadState();
  });
});
