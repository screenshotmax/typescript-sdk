import type {APIClient} from "../client";

export class UsageService {
  public path = "/v1/usage" as const;

  constructor(private client: APIClient) { }

  async get(): Promise<string> {
    return (await this.client.get<string>(this.path)).data;
  }
}
