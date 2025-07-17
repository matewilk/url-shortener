import { client } from "@shortify/api-client/client";
import { Capabilities } from "./Capabilities";
import { getUserData } from "./users/actions/getUserData";

interface WithCapabilitiesLayout {
  (props: {
    children: React.ReactNode;
    capabilities: Capabilities;
  }): React.ReactNode;
}

export const withCapabilitiesLayout = (
  layout: WithCapabilitiesLayout
): ((props: { children: React.ReactNode }) => React.ReactNode) => {
  return ({ children }) => {
    const capabilities = {
      apiClient: client("http://localhost:3001"),
      getUserData: getUserData,
    };

    return layout({ children, capabilities });
  };
};
