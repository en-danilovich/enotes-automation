import { Page } from "@playwright/test";
import { MainSteps } from "./MainSteps";
import { BasketSteps } from "./BasketSteps";

export class Steps {
  readonly page: Page;
  readonly mainSteps: MainSteps;
  readonly basketSteps: BasketSteps;

  constructor(page: Page) {
    this.page = page;
    this.mainSteps = new MainSteps(page);
    this.basketSteps = new BasketSteps(page);
  }
}
