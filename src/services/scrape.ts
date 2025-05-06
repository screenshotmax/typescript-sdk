import type {APIClient} from "../client";
import type {paths} from "../types";

export class ScrapeService {
  public path = "/v1/scrape" as const;

  constructor(private client: APIClient) { }

  get(
    query: Omit<
      NonNullable<paths[this["path"]]["get"]["parameters"]["query"]>,
      "access_key"
    >,
    isSigned = false,
  ): Promise<string> {
    return this.client.get<string>(this.path, query, isSigned);
  }

  post(
    options: Omit<
      NonNullable<
        paths[this["path"]]["post"]["requestBody"]
      >["content"]["application/json"],
      "access_key"
    >,
  ): Promise<string> {
    return this.client.post<string>(this.path, options);
  }
}
