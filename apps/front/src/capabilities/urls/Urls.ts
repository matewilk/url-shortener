import { Client } from "@shortify/api-client/client";

import { Url } from "./Url";

export interface Urls {
  urls: () => Promise<Url[]>;
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
}
