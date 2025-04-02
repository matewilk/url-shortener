import { Capabilities } from "./Capabilities";

import { client } from "@shortify/api-client/client";
const apiClient = client("http://localhost:3001");

type SearchParams = { [key: string]: string | string[] | undefined };

interface NextRequest<Params> {
  params: Params;
  searchParams: SearchParams;
  capabilities: Capabilities;
}

export const withCapabilities =
  <Params extends object>(
    handler: (req: NextRequest<Params>) => Promise<JSX.Element>
  ) =>
  async ({
    params,
    searchParams,
  }: {
    params: Params;
    searchParams: SearchParams;
  }) => {
    const capabilities = {
      apiClient: apiClient,
    };

    const req = {
      params,
      searchParams,
      capabilities,
    };

    return handler(req);
  };
