import { APIResponse, BrowserContext } from "@playwright/test";
import { RestAPiBase } from "../RestApiBase";

export class EnotesRestApiBase extends RestAPiBase {
  readonly header: {
    accept: string;
    "X-Csrf-Token": string;
    "X-Requested-With": string;
  };

  constructor(browserContext: BrowserContext, token: string) {
    super(browserContext);
    this.header = {
      accept: "application/json, text/javascript, */*; q=0.01",
      "X-Csrf-Token": token,
      "X-Requested-With": "XMLHttpRequest",
    };
  }

  async validateResponse(resp: APIResponse) {
    if (!resp.ok()) {
      throw Error(await this.parseResponseInfo(resp));
    }
  }
}
