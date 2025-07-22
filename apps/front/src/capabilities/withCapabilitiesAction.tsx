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
    const apiClient = client("http://localhost:3001");
    const capabilities = {
      apiClient,
      getUserData: getUserData(apiClient),
      logoutUser: logoutUserAction,
    };

    return action(state, payload, capabilities);
  };
};
