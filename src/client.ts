import {createHmac} from "node:crypto";
import axios, {AxiosRequestConfig, AxiosResponse} from "axios";

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

  generateUrl(path: string, params: Record<string, unknown> = {}): string {
    const query = this.computeQuery({
      ...params,
      access_key: this.accessKey,
    });

    return `${this.baseUrl}${path}?${query}`;
  }

  generateSignedUrl(path: string, params: Record<string, unknown> = {}): string {
    const query = this.computeQuery({
      ...params,
      access_key: this.accessKey,
    });
    const signature = this.signRequest(query);

    return `${this.baseUrl}${path}?${query}&signature=${signature}`;
  }

  async get<T>(
    path: string,
    options: Record<string, unknown> = {},
    isSigned = false,
    config: AxiosRequestConfig = {}
  ): Promise<{data: T, headers: Record<string, unknown>}> {
    const url = isSigned
      ? this.generateSignedUrl(path, options)
      : this.generateUrl(path, options);

    const response: AxiosResponse<T> = await axios.get(url, {
      ...config,
    });

    return {
      data: response.data,
      headers: response.headers as Record<string, unknown>,
    };
  }

  async post<T>(
    path: string,
    options: Record<string, unknown> = {},
    config: AxiosRequestConfig = {}
  ): Promise<{data: T; headers: Record<string, unknown>}> {
    const url = `${this.baseUrl}${path}`;

    const response: AxiosResponse<T> = await axios.post(url, options, {
      ...config,
      headers: {
        "X-Access-Key": this.accessKey,
        "Content-Type": "application/json",
        ...(config.headers || {}),
      },
    });

    return {
      data: response.data,
      headers: response.headers as Record<string, unknown>,
    };
  }

  async delete<T>(
    path: string,
    config: AxiosRequestConfig = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${path}`;

    const response: AxiosResponse<T> = await axios.delete(url, {
      ...config,
      headers: {
        "X-Access-Key": this.accessKey,
        ...(config.headers || {}),
      },
    });

    return response.data;
  }

  async patch<T>(
    path: string,
    options: Record<string, unknown> = {},
    config: AxiosRequestConfig = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${path}`;

    const response: AxiosResponse<T> = await axios.patch(url, options, {
      ...config,
      headers: {
        "X-Access-Key": this.accessKey,
        "Content-Type": "application/json",
        ...(config.headers || {}),
      },
    });

    return response.data;
  }
}
