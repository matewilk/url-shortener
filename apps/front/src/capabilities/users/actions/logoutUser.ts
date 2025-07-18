"use server";

import { RemoteResult } from "@/prelude/RemoteResult";
import { cookies } from "next/headers";

export interface LogoutUserAction {
  (): Promise<RemoteResult<{ success: boolean }, { message: string }>>;
}

export const logoutUser: LogoutUserAction = async () => {
  try {
    const cookieStore = await cookies();

    if (process.env.JWT_TOKEN_NAME) {
      cookieStore.set({
        secure: process.env.NODE_ENV === "production",
        name: process.env.JWT_TOKEN_NAME,
        value: "",
        httpOnly: true,
        sameSite: "lax",
        maxAge: -1,
      });
    }
    return {
      kind: "success",
      value: { success: true },
    };
  } catch (error) {
    return {
      kind: "error",
      error: { message: "Failed to log out" },
    };
  }
};
