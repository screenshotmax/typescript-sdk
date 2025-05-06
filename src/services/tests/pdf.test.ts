import { type Mock, beforeEach, describe, expect, it, vi } from "vitest";
import type { APIClient } from "../../client";
import { PDFService } from "../pdf";

describe("PDFService", () => {
  let client: APIClient;
  let service: PDFService;

  beforeEach(() => {
    client = {
      get: vi.fn(),
      post: vi.fn(),
    } as unknown as APIClient;
    service = new PDFService(client);
  });

  it("should call client.get with correct parameters", async () => {
    const query = { url: "https://example.com" };
    (client.get as unknown as Mock).mockResolvedValue(new Buffer(8));

    const result = await service.get(query, true);

    expect(client.get).toHaveBeenCalledWith(service.path, query, true);
    expect(result).toBeInstanceOf(Buffer);
  });

  it("should call client.post with correct parameters", async () => {
    const body = { url: "https://example.com" };
    (client.post as unknown as Mock).mockResolvedValue(new Buffer(8));

    const result = await service.post(body);

    expect(client.post).toHaveBeenCalledWith(service.path, body);
    expect(result).toBeInstanceOf(Buffer);
  });
});
