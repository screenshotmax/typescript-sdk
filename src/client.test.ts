import axios from "axios";
import { type Mock, beforeEach, describe, expect, it, vi } from "vitest";
import { APIClient } from "./client";

vi.mock("axios");

describe("APIClient", () => {
  let client: APIClient;

  beforeEach(() => {
    vi.clearAllMocks();
    client = new APIClient("test-access-key", "test-secret-key");
  });

  it("should throw error if keys are missing", () => {
    expect(() => new APIClient("", "")).toThrowError(
      "Access and secret keys must both be provided and non-empty.",
    );
  });

  it("should perform a signed GET request", async () => {
    (axios.get as unknown as Mock).mockResolvedValue({ data: "get-data" });
    const data = await client.get("/test", { q: "query" }, true);

    expect(axios.get).toHaveBeenCalled();
    expect(data).toBe("get-data");
  });

  it("should perform an unsigned GET request", async () => {
    (axios.get as unknown as Mock).mockResolvedValue({ data: "unsigned-data" });
    const data = await client.get("/test", { q: "query" }, false);

    expect(axios.get).toHaveBeenCalled();
    expect(data).toBe("unsigned-data");
  });

  it("should perform a POST request", async () => {
    (axios.post as unknown as Mock).mockResolvedValue({ data: "post-data" });
    const data = await client.post("/test", { body: "content" });

    expect(axios.post).toHaveBeenCalled();
    expect(data).toBe("post-data");
  });

  it("should perform a DELETE request", async () => {
    (axios.delete as unknown as Mock).mockResolvedValue({
      data: "delete-data",
    });
    const data = await client.delete("/test");

    expect(axios.delete).toHaveBeenCalled();
    expect(data).toBe("delete-data");
  });

  it("should perform a PATCH request", async () => {
    (axios.patch as unknown as Mock).mockResolvedValue({ data: "patch-data" });
    const data = await client.patch("/test", { update: "info" });

    expect(axios.patch).toHaveBeenCalled();
    expect(data).toBe("patch-data");
  });
});
