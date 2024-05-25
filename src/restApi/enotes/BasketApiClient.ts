import { BrowserContext } from "@playwright/test";
import { EnotesRestApiBase } from "./enotesRestApiBase";

export type ClearResponseModel = {
  response: boolean;
};

export class BasketApiClient extends EnotesRestApiBase {
  readonly baseURL: string;

  constructor(browserContext: BrowserContext, token: string) {
    super(browserContext, token);
    this.baseURL = "https://enotes.pointschool.ru/basket/";
  }

  async clearBasket(): Promise<ClearResponseModel> {
    const resp = await this.request.get(`${this.baseURL}clear`, {
      headers: this.header,
    });
    this.validateResponse(resp);

    return resp.json();
  }
}
