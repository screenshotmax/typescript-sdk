import type {APIClient} from "../client";

export class UsageService {
  public path = "/v1/usage" as const;

  constructor(private client: APIClient) { }

  get(): Promise<string> {
    return this.client.get<string>(this.path);
  }
}
