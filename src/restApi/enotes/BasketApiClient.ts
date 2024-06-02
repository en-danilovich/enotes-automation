import { BrowserContext } from "@playwright/test";
import { EnotesRestApiBase } from "./EnotesRestApiBase";
import { TokenHelper } from "./TokenHelper";

export type ClearBasketResponseModel = {
  response: boolean;
};

export class BasketApiClient extends EnotesRestApiBase {
  readonly basketApiUrl: string;

  constructor(browserContext: BrowserContext, tokenHelper: TokenHelper) {
    super(browserContext, tokenHelper);
    this.basketApiUrl = this.baseURL + "basket/";
  }

  async clearBasket(): Promise<ClearBasketResponseModel> {
    const headers = this.getHeaders(await this.tokenHelper.getToken());
    const resp = await this.request.post(`${this.basketApiUrl}clear`, {
      headers: headers,
    });
    this.validateResponse(resp);

    return resp.json();
  }

  async addItemToBasket(
    productId: number,
    count: number
  ): Promise<ClearBasketResponseModel> {
    const headers = this.getHeaders(await this.tokenHelper.getToken());
    const resp = await this.request.post(`${this.basketApiUrl}create`, {
      headers: headers,
      data: `product=${productId}&count=${count}`,
    });
    this.validateResponse(resp);

    return resp.json();
  }
}
