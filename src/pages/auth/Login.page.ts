import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "../Base.page";
import { allure } from "allure-playwright";

export class LoginPage extends BasePage {
  readonly pageUrl: string = `${process.env.BASE_URL}login`;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.locator("#loginform-username");
    this.passwordInput = page.locator("#loginform-password");
    this.loginButton = page.getByRole("button", { name: "Вход" });
  }

  async navigate() {
    await this.page.goto(this.pageUrl);
  }

  async waitForPageToBeVisible() {
    await expect(this.page).toHaveURL(this.pageUrl);
    await super.waitForElementBeVisible(this.loginButton);
  }

  async login(username: string, password: string) {
    await allure.step("Login with username and password", async () => {
      await this.usernameInput.fill(username);
      await this.passwordInput.pressSequentially(password);
      await this.loginButton.click();
    });
  }
}
