import { Capabilities } from "@/capabilities/Capabilities";
import { RemoteResult } from "@/prelude/RemoteResult";

import { userSchema } from "../User";

interface RegisterUserAction {
  (prevState: unknown, formData: FormData, capabilities: Capabilities): Promise<
    RemoteResult<{ message: string }, { message: string }>
  >;
}

export const registerUser: RegisterUserAction = async (
  prevState: unknown,
  formData: FormData,
  capabilities: Capabilities
) => {
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

    const { data, error } = await capabilities.apiClient.POST("/users", {
      body: {
        name,
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

    return {
      kind: "success",
      value: { message: `${data?.message}` },
    };
  } catch (error) {
    return {
      kind: "error",
      error: { message: "Internal server error." },
    };
  }
};
