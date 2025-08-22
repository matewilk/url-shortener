import { cookies } from "next/headers";
import { client } from "@shortify/api-client/client";

import { Capabilities } from "./Capabilities";
import { ApiUsers } from "./users/Users";
import { ApiUrls } from "./urls/Urls";

interface WithCapabilitiesLayout {
  (props: {
    children: React.ReactNode;
    capabilities: Capabilities;
  }): React.ReactNode;
}

export const withCapabilitiesLayout = (
  layout: WithCapabilitiesLayout
): ((props: { children: React.ReactNode }) => Promise<React.ReactNode>) => {
  return async ({ children }) => {
    const apiClient = client(
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
    );

    const cookieStore = await cookies();
    const token = cookieStore.get(process.env.JWT_TOKEN_NAME || "")?.value;

    const capabilities = {
      users: new ApiUsers(apiClient, token),
      urls: new ApiUrls(apiClient, token),
    };

    return layout({ children, capabilities });
  };
};
