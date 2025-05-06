import type {APIClient} from "../client";

export class DeviceService {
  public path = "/v1/devices" as const;

  constructor(private client: APIClient) { }

  get(): Promise<string> {
    return this.client.get<string>(this.path);
  }
}
