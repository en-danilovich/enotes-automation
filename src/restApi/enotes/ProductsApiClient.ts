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
  readonly productsApiUrl: string;

  constructor(browserContext: BrowserContext, tokenHelper: TokenHelper) {
    super(browserContext, tokenHelper);
    this.productsApiUrl = this.baseURL + "product/";
  }

  async getProducts(
    hasDiscount: boolean = false
  ): Promise<GetProductsResponse> {
    const headers = this.getHeaders(await this.tokenHelper.getToken());
    const resp = await this.request.post(`${this.productsApiUrl}get`, {
      headers: headers,
      form: { filters: `is-discount=${hasDiscount ? "on" : ""}` },
    });
    this.validateResponse(resp);

    return resp.json();
  }
}
