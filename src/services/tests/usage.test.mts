import {type Mock, beforeEach, describe, expect, it, vi} from "vitest";
import type {APIClient} from "../../client.mjs";
import {UsageService} from "../usage.mjs";

describe("UsageService", () => {
  let client: APIClient;
  let service: UsageService;

  beforeEach(() => {
    client = {
      get: vi.fn(),
      post: vi.fn(),
    } as unknown as APIClient;
    service = new UsageService(client);
  });

  it("should call client.get with correct parameters", async () => {
    (client.get as unknown as Mock).mockResolvedValue({data: "get result"});

    const result = await service.get();

    expect(client.get).toHaveBeenCalledWith(service.path);
    expect(result).toBe("get result");
  });
});
