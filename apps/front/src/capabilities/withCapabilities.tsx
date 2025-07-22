import { Capabilities } from "./Capabilities";

import { getUserData } from "./users/actions/getUserData";
import { logoutUserAction } from "./users/actions/logoutUserAction";

import { client } from "@shortify/api-client/client";
const apiClient = client("http://localhost:3001");

type SearchParams = { [key: string]: string | string[] | undefined };

interface NextRequest<Params> {
  params: Promise<Params>;
  searchParams: Promise<SearchParams>;
  capabilities: Capabilities;
}

export const withCapabilities =
  <Params extends Record<string, string>>(
    handler: (req: NextRequest<Params>) => Promise<JSX.Element>
  ) =>
  async ({
    params,
    searchParams,
  }: {
    params: Promise<Params>;
    searchParams: Promise<SearchParams>;
  }) => {
    const capabilities = {
      apiClient,
      getUserData: getUserData(apiClient),
      logoutUser: logoutUserAction,
    };

    const req = {
      params,
      searchParams,
      capabilities,
    };

    return handler(req);
  };
