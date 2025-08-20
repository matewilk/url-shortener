import { decode, JwtPayload } from "jsonwebtoken";

import { Client } from "@shortify/api-client/client";

export interface Users {
  token: string | undefined;
  login: (email: string, password: string) => Promise<string>;
  getUser: () => Promise<{ name: string; email: string } | null>;
}

export class ApiUsers implements Users {
  constructor(private apiClient: Client, public token: string | undefined) {}

  async login(email: string, password: string): Promise<string> {
    const { data, error } = await this.apiClient.POST("/login", {
      body: { email, password },
    });

    if (error || !data?.token) {
      throw new Error("Login failed, please try again.");
    }

    return data.token;
  }

  async getUser(): Promise<{ name: string; email: string } | null> {
    if (!this.token) {
      return null;
    }

    const { id } = decode(this.token) as JwtPayload;

    const { data, error } = await this.apiClient.GET(`/users/id/{id}`, {
      params: { path: { id } },
      headers: { Authorization: `Bearer ${this.token}` },
    });

    if (error || !data?.user) {
      return null;
    }

    return { name: data.user.name, email: data.user.email };
  }
}
