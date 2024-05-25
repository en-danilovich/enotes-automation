import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "../Base.page";
import { allureStep } from "../../utils/logger";

export class LoginPage extends BasePage {
  readonly usernameInput: Locator;

  readonly passwordInput: Locator;

  readonly loginButton: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.locator("#loginform-username");
    this.passwordInput = page.locator("#loginform-password");
    // TODO modify locator
    this.loginButton = page.getByRole("button", { name: "Вход" });
  }

  async waitForPageToBeVisible() {
    await super.waitForElementBeVisible(this.loginButton);
  }

  async login(username: string, password: string) {
    await allureStep("Enter username", async () => {
      await this.usernameInput.fill(username);
    });
    await allureStep("Enter password", async () => {
      await this.passwordInput.pressSequentially(password);
    });
    await allureStep("Click login button", async () => {
      await this.loginButton.click();
    });
  }

  async verifyLoginSuccess() {
    await allureStep("Verify login success", async () => {
      await expect(this.page).toHaveURL("/dashboard");
    });
  }
}
