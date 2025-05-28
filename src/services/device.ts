import type {APIClient} from "../client";

export class DeviceService {
  public path = "/v1/devices" as const;

  constructor(private client: APIClient) { }

  async get(): Promise<string> {
    return (await this.client.get<string>(this.path)).data;
  }
}
