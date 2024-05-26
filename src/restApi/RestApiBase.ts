import {
  APIRequestContext,
  APIResponse,
  BrowserContext,
} from "@playwright/test";

export class RestApiBase {
  readonly request: APIRequestContext;

  constructor(browserContext: BrowserContext) {
    this.request = browserContext.request;
  }

  protected async parseResponseInfo(response: APIResponse): Promise<string> {
    const callerName = new Error().stack?.split("at ")[2].split(" ")[0];
    return `[${callerName}] => ${response.status()} - ${response.statusText()}: ${response.url()}\n${await response.text()}`;
  }

  protected async validateResponse(response: APIResponse) {
    if (!response.ok()) {
      throw Error(await this.parseResponseInfo(response));
    }
  }
}
