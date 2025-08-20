import { Client } from "@shortify/api-client/client";

import { Url } from "./Url";

export interface Urls {
  urls: () => Promise<Url[]>;
  get: (shortUrl: string) => Promise<string | null>;
  shorten: (url: string) => Promise<string>;
}

export class ApiUrls implements Urls {
  constructor(private apiClient: Client, private token?: string) {}

  async urls(): Promise<Url[]> {
    if (!this.token) {
      return [];
    }

    const { data, error } = await this.apiClient.GET("/urls", {
      headers: { Authorization: `Bearer ${this.token}` },
    });

    if (error || !data?.urls) {
      throw new Error("Failed to fetch URLs");
    }

    return data.urls;
  }

  async get(shortUrl: string): Promise<string | null> {
    const { data, error } = await this.apiClient.GET(`/urls/{shortUrl}`, {
      params: { path: { shortUrl } },
      headers: this.token
        ? { Authorization: `Bearer ${this.token}` }
        : undefined,
    });

    if (error || !data?.url) {
      return null;
    }

    return data.url;
  }

  async shorten(url: string): Promise<string> {
    const { data, error } = await this.apiClient.POST("/urls/shorten", {
      body: { url },
      headers: this.token
        ? { Authorization: `Bearer ${this.token}` }
        : undefined,
    });

    if (error || !data?.shortUrl) {
      throw new Error("Failed to shorten URL");
    }

    return data.shortUrl;
  }
}
