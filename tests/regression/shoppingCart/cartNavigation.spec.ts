import { test } from '@playwright/test';

import { LoginPage } from '../../../src/pages/auth/LoginPage';

test.describe('Shopping cart', () => {
  test('User should be able to login successfully', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigateTo('https://example.com/login');
    await loginPage.login('testuser', 'testpassword');
    await loginPage.verifyLoginSuccess();
  });
});
