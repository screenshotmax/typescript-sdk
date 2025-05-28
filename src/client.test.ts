import axios from "axios";
import {createHmac} from "node:crypto";
import {type Mock, beforeEach, describe, expect, it, vi} from "vitest";
import {APIClient} from "./client";

vi.mock("axios");

describe("APIClient", () => {
  let client: APIClient;
  const accessKey = "test-access-key";
  const secretKey = "test-secret-key";

  beforeEach(() => {
    vi.clearAllMocks();
    client = new APIClient(accessKey, secretKey);
  });

  describe("generateUrl", () => {
    it("should generates a URL with only the access_key if no params are provided", () => {
      const result = client.generateUrl("/v1/test");

      expect(result).toBe("https://api.screenshotmax.com/v1/test?access_key=test-access-key");
    });

    it("should generates a URL with access_key and simple params", () => {
      const result = client.generateUrl("/v1/test", {
        format: "pdf",
        url: "https://example.com"
      });

      expect(result).toMatch(/^https:\/\/api\.screenshotmax\.com\/v1\/test\?/);
      expect(result).toContain("access_key=test-access-key");
      expect(result).toContain("format=pdf");
      expect(result).toContain("url=https%3A%2F%2Fexample.com");
    });

    it("should ignores undefined values in params", () => {
      const result = client.generateUrl("/v1/test", {
        format: undefined,
        url: "https://example.com"
      });

      expect(result).toContain("url=https%3A%2F%2Fexample.com");
      expect(result).not.toContain("format=");
    });

    it("should coerces numbers and booleans to strings", () => {
      const result = client.generateUrl("/v1/test", {
        delay: 2,
        full_page: true
      });

      expect(result).toContain("delay=2");
      expect(result).toContain("full_page=true");
    });

    it("should encodes special characters properly", () => {
      const result = client.generateUrl("/v1/test", {
        query: "a&b=c"
      });

      expect(result).toContain("query=a%26b%3Dc");
    });

    it("should throw error if keys are missing", () => {
      expect(() => new APIClient("", "")).toThrowError(
        "Access and secret keys must both be provided and non-empty.",
      );
    });
  });

  describe("generateSignedUrl", () => {
    it("should include access_key and a valid HMAC-SHA256 signature", () => {
      const params = {
        url: "https://example.com",
        format: "pdf",
      };

      const query = new URLSearchParams({
        ...params,
        access_key: accessKey,
      }).toString();

      const expectedSignature = createHmac("sha256", secretKey)
        .update(query)
        .digest("hex");

      const result = client.generateSignedUrl("/v1/pdf", params);

      expect(result).toContain("/v1/pdf?");
      expect(result).toContain(`access_key=${accessKey}`);
      expect(result).toContain(`signature=${expectedSignature}`);
    });

    it("should skip undefined values in params and still sign correctly", () => {
      const params = {
        url: "https://example.com",
        format: undefined,
      };

      const query = new URLSearchParams({
        url: "https://example.com",
        access_key: accessKey,
      }).toString();

      const expectedSignature = createHmac("sha256", secretKey)
        .update(query)
        .digest("hex");

      const result = client.generateSignedUrl("/v1/pdf", params);

      expect(result).toContain(`url=https%3A%2F%2Fexample.com`);
      expect(result).not.toContain("format=");
      expect(result).toContain(`signature=${expectedSignature}`);
    });

    it("should work with empty params", () => {
      const query = new URLSearchParams({
        access_key: accessKey,
      }).toString();

      const expectedSignature = createHmac("sha256", secretKey)
        .update(query)
        .digest("hex");

      const result = client.generateSignedUrl("/v1/pdf");

      expect(result).toBe(`https://api.screenshotmax.com/v1/pdf?access_key=${accessKey}&signature=${expectedSignature}`);
    });
  });

  describe("HTTP methods", () => {
    it("should perform a signed GET request", async () => {
      (axios.get as unknown as Mock).mockResolvedValue({data: "get-data", headers: {"key": "value"}});
      const data = await client.get("/test", {q: "query"}, true);

      expect(axios.get).toHaveBeenCalled();
      expect(data).toEqual({data: "get-data", headers: {"key": "value"}});
    });

    it("should perform an unsigned GET request", async () => {
      (axios.get as unknown as Mock).mockResolvedValue({data: "unsigned-data", headers: {"key": "value"}});
      const data = await client.get("/test", {q: "query"}, false);

      expect(axios.get).toHaveBeenCalled();
      expect(data).toEqual({data: "unsigned-data", headers: {"key": "value"}});
    });

    it("should perform a POST request", async () => {
      (axios.post as unknown as Mock).mockResolvedValue({data: "post-data", headers: {"key": "value"}});
      const data = await client.post("/test", {body: "content"});

      expect(axios.post).toHaveBeenCalled();
      expect(data).toEqual({data: "post-data", headers: {"key": "value"}});
    });

    it("should perform a DELETE request", async () => {
      (axios.delete as unknown as Mock).mockResolvedValue({data: "delete-data"});
      const data = await client.delete("/test");

      expect(axios.delete).toHaveBeenCalled();
      expect(data).toBe("delete-data");
    });

    it("should perform a PATCH request", async () => {
      (axios.patch as unknown as Mock).mockResolvedValue({data: "patch-data"});
      const data = await client.patch("/test", {update: "info"});

      expect(axios.patch).toHaveBeenCalled();
      expect(data).toBe("patch-data");
    });
  });
});
