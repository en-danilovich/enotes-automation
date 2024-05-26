import { Page, expect } from "@playwright/test";

export class TokenHelper {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async getToken(): Promise<string> {
    const metaToken = this.page.locator('meta[name="csrf-token"]');
    await expect(metaToken).toHaveAttribute("content");
    const token = await metaToken.getAttribute("content");
    await expect(token).not.toBeNull();
    return token!;
  }
}
