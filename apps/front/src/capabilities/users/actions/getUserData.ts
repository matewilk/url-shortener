import { cookies } from "next/headers";
import { decode, JwtPayload } from "jsonwebtoken";

import { Client } from "@shortify/api-client/client";
import { RemoteResult, ok } from "@/prelude/RemoteResult";

export interface GetUserDataAction {
  (): Promise<
    RemoteResult<{ user: { email: string; name: string } }, { message: string }>
  >;
}

export const getUserData =
  (apiClient: Client): GetUserDataAction =>
  async () => {
    try {
      const cookieStore = await cookies();
      const token = cookieStore.get(process.env.JWT_TOKEN_NAME || "")?.value;

      if (!token) {
        return {
          kind: "error",
          error: { message: "No token found." },
        };
      }

      const { id } = decode(token) as JwtPayload;

      const { data, error } = await apiClient.GET("/users/id/{id}", {
        params: { path: { id } },
        // TODO: decide whether to use Bearer or Cookie
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (error) {
        return {
          kind: "error",
          error: { message: "Internal server error." },
        };
      }

      const {
        user: { email, name },
      } = data;

      return ok({ user: { email, name } });
    } catch (error) {
      return {
        kind: "error",
        error: { message: "Internal server error." },
      };
    }
  };
