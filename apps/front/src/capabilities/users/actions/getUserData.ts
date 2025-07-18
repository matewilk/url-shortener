import { cookies } from "next/headers";
import { decode, JwtPayload } from "jsonwebtoken";

import { Capabilities } from "@/capabilities/Capabilities";
import { flatMap, RemoteResult, ok } from "@/prelude/RemoteResult";

export interface GetUserDataAction {
  (prevState: unknown, capabilities: Capabilities): Promise<
    RemoteResult<{ user: { email: string; name: string } }, { message: string }>
  >;
}

export const getUserData: GetUserDataAction = async (
  prevState: unknown,
  capabilities: Capabilities
) => {
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

    const { data, error } = await capabilities.apiClient.GET("/users/id/{id}", {
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

    return flatMap(data.user, (user) =>
      ok({ user: { email: user.email, name: user.name } })
    );
  } catch (error) {
    return {
      kind: "error",
      error: { message: "Internal server error." },
    };
  }
};
