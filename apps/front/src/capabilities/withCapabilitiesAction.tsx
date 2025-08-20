import { cookies } from "next/headers";

import { client } from "@shortify/api-client/client";
import { Capabilities } from "./Capabilities";
import { ApiUsers } from "./users/Users";
import { ApiUrls } from "./urls/Urls";

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
      users: new ApiUsers(apiClient, token),
      urls: new ApiUrls(apiClient, token),
    };

    return action(state, payload, capabilities);
  };
};
