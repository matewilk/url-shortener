import { client } from "@shortify/api-client/client";
import { Capabilities } from "./Capabilities";

interface WithCapabilitiesAction<State, Payload> {
  (state: Awaited<State>, payload: Payload, capabilities: Capabilities):
    | State
    | Promise<State>;
}

export const withCapabilitiesAction = <State, Payload>(
  action: WithCapabilitiesAction<State, Payload>
) => {
  return async (state: Awaited<State>, payload: Payload) => {
    const capabilities = {
      apiClient: client("http://localhost:3001"),
    };

    return action(state, payload, capabilities);
  };
};
