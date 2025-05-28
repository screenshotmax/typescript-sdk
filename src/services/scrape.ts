import {AxiosRequestConfig} from "axios";
import type {APIClient} from "../client";
import type {paths} from "../types";

type ScrapeOptionsType = Omit<
  NonNullable<paths["/v1/scrape"]["get"]["parameters"]["query"]>,
  "access_key"
>;

export class ScrapeService {
  public path = "/v1/scrape" as const;
  private config: AxiosRequestConfig = {
    responseType: "text",
    responseEncoding: "binary" as unknown as BufferEncoding,
  };
  private options: ScrapeOptionsType | null = null;

  constructor(private client: APIClient) { }

  setOptions(
    options: ScrapeOptionsType,
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
    data: string;
    headers: Record<string, unknown>;
  }> {
    if (!this.options) throw new Error("Options not set.");

    return this.client.get<string>(
      this.path,
      this.options,
      signed,
      this.config,
    );
  }
}
