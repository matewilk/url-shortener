"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";

import { Capabilities } from "@/capabilities/Capabilities";
import { userSchema } from "../User";
import { withCapabilitiesAction } from "@/capabilities/withCapabilitiesAction";
import { RemoteResult } from "@/prelude/RemoteResult";

export const loginUserAction = withCapabilitiesAction(
  async (
    prevState: unknown,
    formData: FormData,
    capabilities: Capabilities
  ): Promise<RemoteResult<void, { message: string }> | void> => {
    try {
      const { email, password } = userSchema
        .pick({ email: true, password: true })
        .parse({
          email: formData.get("email"),
          password: formData.get("password"),
        });

      const token = await capabilities.users.login(email, password);

      const cookieStore = await cookies();

      if (process.env.JWT_TOKEN_NAME && token) {
        cookieStore.set({
          secure: process.env.NODE_ENV === "production",
          name: process.env.JWT_TOKEN_NAME,
          value: token,
          httpOnly: true,
          sameSite: "lax",
          path: "/",
        });
      }

      redirect("/profile");
    } catch (error: unknown) {
      // TODO: Deal with it more gracefully
      if (error instanceof Error && error.message === "NEXT_REDIRECT") {
        throw error;
      }

      return {
        kind: "error",
        error: {
          message:
            error instanceof Error ? error.message : "Internal server error.",
        },
      };
    }
  }
);
