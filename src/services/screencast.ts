import {AxiosRequestConfig} from "axios";
import type {APIClient} from "../client";
import type {paths} from "../types";

type ScreencastOptionsType = Omit<
  NonNullable<paths["/v1/screencast"]["get"]["parameters"]["query"]>,
  "access_key"
>;

export class ScreencastService {
  public path = "/v1/screencast" as const;
  private config: AxiosRequestConfig = {
    responseType: "text",
    responseEncoding: "binary" as unknown as BufferEncoding,
  };
  private options: ScreencastOptionsType | null = null;

  constructor(private client: APIClient) { }

  setOptions(
    options: ScreencastOptionsType,
  ): this {
    this.options = options;
    return this;
  }

  getUrl(signed = true): string {
    if (!this.options) throw new Error("Options not set.");

    return signed
      ? this.client.generateSignedUrl(this.path, this.options)
      : this.client.generateUrl(this.path, this.options);
  }

  fetch(signed = true): Promise<{
    data: Buffer | string;
    headers: Record<string, unknown>;
  }> {
    if (!this.options) throw new Error("Options not set.");

    return this.client.get<Buffer | string>(
      this.path,
      this.options,
      signed,
      this.config,
    );
  }
}
