import { createHmac } from "node:crypto";
import axios from "axios";

export class APIClient {
  private readonly baseUrl = "https://api.screenshotmax.com";

  constructor(
    private accessKey: string,
    private secretKey: string,
  ) {
    if (!accessKey || !secretKey) {
      throw new Error(
        "Access and secret keys must both be provided and non-empty.",
      );
    }
  }

  /**
   * Signs a request using HMAC SHA256.
   * @param str The string to sign.
   * @returns The signed string.
   */
  private signRequest(str: string): string {
    return createHmac("sha256", this.secretKey).update(str).digest("hex");
  }
  /**
   * Converts an object to a query string.
   * @param obj The object to convert.
   * @returns The query string.
   */
  private computeQuery(obj: Record<string, unknown>): string {
    return new URLSearchParams(
      Object.fromEntries(
        Object.entries(obj)
          .filter(([_, v]) => v !== undefined)
          .map(([k, v]) => [k, String(v)]),
      ),
    ).toString();
  }

  async get<T>(
    path: string,
    options: Record<string, unknown> = {},
    isSigned = false,
  ): Promise<T> {
    const query = this.computeQuery(options);
    const signature = isSigned ? this.signRequest(query) : "";

    let url = `${this.baseUrl}${path}`;
    url += query ? `?${query}` : "";
    url += isSigned ? `&signature=${signature}` : "";

    const response = await axios.get(url, {
      headers: {
        "X-Access-Key": this.accessKey,
      },
    });

    return response.data;
  }

  async post<T>(
    path: string,
    options: Record<string, unknown> = {},
  ): Promise<T> {
    const url = `${this.baseUrl}${path}`;

    const response = await axios.post(url, {
      headers: {
        "X-Access-Key": this.accessKey,
        "Content-Type": "application/json",
      },
      data: options,
    });

    return response.data;
  }

  async delete<T>(path: string): Promise<T> {
    const url = `${this.baseUrl}${path}`;

    const response = await axios.delete(url, {
      headers: {
        "X-Access-Key": this.accessKey,
      },
    });

    return response.data;
  }

  async patch<T>(
    path: string,
    options: Record<string, unknown> = {},
  ): Promise<T> {
    const url = `${this.baseUrl}${path}`;

    const response = await axios.patch(url, {
      headers: {
        "X-Access-Key": this.accessKey,
        "Content-Type": "application/json",
      },
      data: options,
    });

    return response.data;
  }
}
