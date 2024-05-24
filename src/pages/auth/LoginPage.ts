import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from '../BasePage';
import { allureStep } from '../../utils/logger';

export class LoginPage extends BasePage {
  readonly usernameInput: Locator;

  readonly passwordInput: Locator;

  readonly loginButton: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('#login');
  }

  async login(username: string, password: string) {
    await allureStep('Enter username', async () => {
      await this.usernameInput.fill(username);
    });
    await allureStep('Enter password', async () => {
      await this.passwordInput.fill(password);
    });
    await allureStep('Click login button', async () => {
      await this.loginButton.click();
    });
  }

  async verifyLoginSuccess() {
    await allureStep('Verify login success', async () => {
      await expect(this.page).toHaveURL('/dashboard');
    });
  }
}
