import { cookies } from "next/headers";
import { decode, JwtPayload } from "jsonwebtoken";

import { Client } from "@shortify/api-client/client";
import { User } from "../User";

export interface GetUserDataAction {
  (): Promise<User>;
}

export const getUserData =
  (apiClient: Client): GetUserDataAction =>
  async () => {
    try {
      const cookieStore = await cookies();
      const token = cookieStore.get(process.env.JWT_TOKEN_NAME || "")?.value;

      if (!token) {
        return {
          kind: "guest",
        };
      }

      const { id } = decode(token) as JwtPayload;

      const { data, error } = await apiClient.GET("/users/id/{id}", {
        params: { path: { id } },
        headers: {
          Cookie: `${process.env.JWT_TOKEN_NAME}=${token}`,
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
