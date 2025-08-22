"use server";
import { redirect } from "next/navigation";

import { Capabilities } from "@/capabilities/Capabilities";
import { userSchema } from "@/capabilities/users/User";
import { withCapabilitiesAction } from "@/capabilities/withCapabilitiesAction";
import { RemoteResult } from "@/prelude/RemoteResult";

export const registerUserAction = withCapabilitiesAction(
  async (
    prevState: unknown,
    formData: FormData,
    capabilities: Capabilities
  ): Promise<RemoteResult<void, { message: string }>> => {
    try {
      userSchema.refine(
        (values) => {
          return values.password === values.confirmPassword;
        },
        {
          message: "passwords don't match",
        }
      );

      const { name, email, password } = userSchema.parse({
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
        confirmPassword: formData.get("confirmPassword"),
      });

      await capabilities.users.register(name, email, password);

      redirect("/login");
    } catch (error) {
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
