import type {APIClient} from "../client";
import type {paths} from "../types";

export class PDFService {
  public path = "/v1/pdf" as const;

  constructor(private client: APIClient) { }

  get(
    query: Omit<
      NonNullable<paths[this["path"]]["get"]["parameters"]["query"]>,
      "access_key"
    >,
    isSigned = false,
  ): Promise<Buffer | string> {
    return this.client.get<Buffer | string>(this.path, query, isSigned);
  }

  post(
    options: Omit<
      NonNullable<
        paths[this["path"]]["post"]["requestBody"]
      >["content"]["application/json"],
      "access_key"
    >,
  ): Promise<Buffer | string> {
    return this.client.post<Buffer | string>(this.path, options);
  }
}
