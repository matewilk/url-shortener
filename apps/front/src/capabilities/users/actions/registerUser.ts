"use server";
import { userSchema } from "../User";

import { client } from "@shortify/api-client/client";
const apiClient = client("http://localhost:3001");

interface OK<V> {
  kind: "success";
  value: V;
}

interface Err<E> {
  kind: "error";
  error: E;
}

export interface Init {
  kind: "init";
}

// TODO: Result type again
type Result<T, E> = Init | OK<T> | Err<E>;

interface RegisterUserAction {
  (prevState: unknown, formData: FormData): Promise<
    Result<{ message: string }, { message: string }>
  >;
}

export const registerUser: RegisterUserAction = async (
  prevState: unknown,
  formData: FormData
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

    const { data, error } = await apiClient.POST("/users", {
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
