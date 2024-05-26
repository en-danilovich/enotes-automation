import { BrowserContext } from "@playwright/test";
import { EnotesRestApiBase } from "./EnotesRestApiBase";
import { TokenHelper } from "./TokenHelper";

export type ClearResponseModel = {
  response: boolean;
};

export class BasketApiClient extends EnotesRestApiBase {
  readonly baseURL: string;

  constructor(browserContext: BrowserContext, tokenHelper: TokenHelper) {
    super(browserContext, tokenHelper);
    this.baseURL = "https://enotes.pointschool.ru/basket/";
  }

  async clearBasket(): Promise<ClearResponseModel> {
    const headers = this.getHeaders(await this.tokenHelper.getToken());
    const resp = await this.request.get(`${this.baseURL}clear`, {
      headers: headers,
    });
    this.validateResponse(resp);

    return resp.json();
  }
}
