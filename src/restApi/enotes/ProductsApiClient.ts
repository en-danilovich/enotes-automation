import { BrowserContext } from "@playwright/test";
import { EnotesRestApiBase } from "./EnotesRestApiBase";
import { TokenHelper } from "./TokenHelper";

export type Product = {
  id: number;
  name: string;
  type: string;
  price: number;
  discount: number;
  count: number;
  poster: string;
};

export type GetProductsResponse = {
  response: boolean;
  error: string;
  products: Product[];
};

export class ProductsApiClient extends EnotesRestApiBase {
  readonly baseURL: string;

  constructor(browserContext: BrowserContext, tokenHelper: TokenHelper) {
    super(browserContext, tokenHelper);
    this.baseURL = "https://enotes.pointschool.ru/product/";
  }

  async getProducts(
    hasDiscount: boolean = false
  ): Promise<GetProductsResponse> {
    const headers = this.getHeaders(await this.tokenHelper.getToken());
    const resp = await this.request.post(`${this.baseURL}get`, {
      headers: headers,
      form: { filters: `is-discount=${hasDiscount ? "on" : ""}` },
    });
    this.validateResponse(resp);

    return resp.json();
  }
}
