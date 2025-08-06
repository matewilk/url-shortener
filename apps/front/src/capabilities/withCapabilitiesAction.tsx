import { cookies } from "next/headers";

import { client } from "@shortify/api-client/client";
import { Capabilities } from "./Capabilities";
import { logoutUserAction } from "./users/actions/logoutUserAction";
import { getUserData } from "./users/actions/getUserData";

interface WithCapabilitiesAction<State, Payload> {
  (state: Awaited<State>, payload: Payload, capabilities: Capabilities):
    | State
    | Promise<State>;
}

export const withCapabilitiesAction = <State, Payload>(
  action: WithCapabilitiesAction<State, Payload>
) => {
  return async (state: Awaited<State>, payload: Payload) => {
    const apiClient = client(
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
    );

    const cookieStore = await cookies();
    const token = cookieStore.get(process.env.JWT_TOKEN_NAME || "")?.value;

    const capabilities = {
      apiClient,
      user: {
        getUser: getUserData(apiClient, token),
        logout: logoutUserAction,
        token,
      },
      getUserData: getUserData(apiClient, token),
      logoutUser: logoutUserAction,
    };

    return action(state, payload, capabilities);
  };
};
