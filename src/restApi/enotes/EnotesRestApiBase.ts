import { APIResponse, BrowserContext } from "@playwright/test";
import { RestApiBase } from "../RestApiBase";
import { TokenHelper } from "./TokenHelper";

export class EnotesRestApiBase extends RestApiBase {
  protected header: {
    accept: string;
    "X-Requested-With": string;
  };

  readonly tokenHelper: TokenHelper;

  constructor(browserContext: BrowserContext, tokenHelper: TokenHelper) {
    super(browserContext);
    this.tokenHelper = tokenHelper;
    this.header = {
      accept: "application/json, text/javascript, */*; q=0.01",
      "X-Requested-With": "XMLHttpRequest",
    };
  }

  getHeaders(token: string) {
    return { ...this.header, "X-Csrf-Token": token };
  }

  async validateResponse(resp: APIResponse) {
    if (!resp.ok()) {
      throw Error(await this.parseResponseInfo(resp));
    }
  }
}