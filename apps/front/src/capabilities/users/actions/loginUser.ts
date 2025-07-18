import { cookies } from "next/headers";

import { Capabilities } from "@/capabilities/Capabilities";
import { RemoteResult } from "@/prelude/RemoteResult";

import { userSchema } from "../User";

interface LoginUserAction {
  (prevState: unknown, formData: FormData, capabilities: Capabilities): Promise<
    RemoteResult<{ message: string }, { message: string }>
  >;
}

export const loginUser: LoginUserAction = async (
  prevState: unknown,
  formData: FormData,
  capabilities: Capabilities
) => {
  try {
    const { email, password } = userSchema
      .pick({ email: true, password: true })
      .parse({
        email: formData.get("email"),
        password: formData.get("password"),
      });

    const { data, error } = await capabilities.apiClient.POST("/login", {
      body: {
        email,
        password,
      },
    });

    if (error) {
      return {
        kind: "error",
        error: { message: "Internal server error." },
      };
    }

    const cookieStore = await cookies();

    if (process.env.JWT_TOKEN_NAME && data?.token) {
      cookieStore.set({
        secure: process.env.NODE_ENV === "production",
        name: process.env.JWT_TOKEN_NAME,
        value: data.token,
        httpOnly: true,
        sameSite: "lax",
        path: "/",
      });
    }

    return {
      kind: "success",
      value: { message: `${data.kind}` },
    };
  } catch (error) {
    return {
      kind: "error",
      error: { message: "Internal server error." },
    };
  }
};
