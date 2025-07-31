import { client } from "@shortify/api-client/client";
import { Capabilities } from "./Capabilities";
import { getUserData } from "./users/actions/getUserData";
import { logoutUserAction } from "./users/actions/logoutUserAction";

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
    const apiClient = client(
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
    );
    const capabilities = {
      apiClient,
      getUserData: getUserData(apiClient),
      logoutUser: logoutUserAction,
    };

    return layout({ children, capabilities });
  };
};
