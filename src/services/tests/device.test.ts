import { type Mock, beforeEach, describe, expect, it, vi } from "vitest";
import type { APIClient } from "../../client";
import { DeviceService } from "../device";

describe("DeviceService", () => {
  let client: APIClient;
  let service: DeviceService;

  beforeEach(() => {
    client = {
      get: vi.fn(),
      post: vi.fn(),
    } as unknown as APIClient;
    service = new DeviceService(client);
  });

  it("should call client.get with correct parameters", async () => {
    (client.get as unknown as Mock).mockResolvedValue("get result");

    const result = await service.get();

    expect(client.get).toHaveBeenCalledWith(service.path);
    expect(result).toBe("get result");
  });
});
