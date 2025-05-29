import {beforeEach, describe, expect, it, vi} from "vitest";
import type {APIClient} from "../../client.mjs";
import {ScreencastService} from "../screencast.mjs";

const sampleOptions = {
  url: "https://example.com",
};

describe("ScreencastService", () => {
  let client: APIClient;
  let service: ScreencastService;

  beforeEach(() => {
    vi.clearAllMocks();
    client = {
      generateUrl: vi.fn(),
      generateSignedUrl: vi.fn(),
      get: vi.fn(),
    } as unknown as APIClient;
    service = new ScreencastService(client);
  });

  it("should set options", () => {
    const result = service.setOptions(sampleOptions as any);
    expect(result).toBe(service); // chaining
  });

  it("should throw if getUrl is called before setOptions", () => {
    expect(() => service.getUrl()).toThrow("Options not set.");
  });

  it("should return unsigned URL from getUrl()", () => {
    vi.mocked(client.generateUrl).mockReturnValue("http://unsigned.url");

    service.setOptions(sampleOptions as any);
    const url = service.getUrl(false);

    expect(client.generateUrl).toHaveBeenCalledWith("/v1/screencast", sampleOptions);
    expect(url).toBe("http://unsigned.url");
  });

  it("should return signed URL from getUrl()", () => {
    vi.mocked(client.generateSignedUrl).mockReturnValue("http://signed.url");

    service.setOptions(sampleOptions as any);
    const url = service.getUrl(true);

    expect(client.generateSignedUrl).toHaveBeenCalledWith("/v1/screencast", sampleOptions);
    expect(url).toBe("http://signed.url");
  });

  it("should throw if fetch is called before setOptions", async () => {
    expect(() => service.fetch()).toThrow("Options not set.");
  });

  it("should call client.get in fetch() with signed = true", async () => {
    const mockResponse = {
      data: Buffer.from("MP4 content"),
      headers: {"content-type": "video/mp4"},
    };

    vi.mocked(client.get).mockResolvedValue(mockResponse);

    service.setOptions(sampleOptions as any);
    const result = await service.fetch(true);

    expect(client.get).toHaveBeenCalledWith(
      "/v1/screencast",
      sampleOptions,
      true,
      expect.objectContaining({
        responseType: "text",
        responseEncoding: "binary",
      })
    );
    expect(result).toEqual(mockResponse);
  });
});
