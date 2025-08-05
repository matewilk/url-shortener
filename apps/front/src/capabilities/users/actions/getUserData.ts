import { decode, JwtPayload } from "jsonwebtoken";

import { Client } from "@shortify/api-client/client";
import { User } from "../User";

export interface GetUserDataAction {
  (): Promise<User>;
}

export const getUserData =
  (apiClient: Client, token?: string): GetUserDataAction =>
  async () => {
    try {
      if (!token) {
        return {
          kind: "guest",
        };
      }

      const { id } = decode(token) as JwtPayload;

      const { data, error } = await apiClient.GET("/users/id/{id}", {
        params: { path: { id } },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (error) {
        return {
          kind: "guest",
        };
      }

      const {
        user: { email, name },
      } = data;

      return { email, name, kind: "known" };
    } catch (error) {
      return {
        kind: "guest",
      };
    }
  };
