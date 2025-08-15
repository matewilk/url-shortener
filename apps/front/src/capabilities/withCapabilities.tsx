import { cookies } from "next/headers";
import { Capabilities } from "./Capabilities";

import { getUserData } from "./users/actions/getUserData";
import { logoutUserAction } from "./users/actions/logoutUserAction";

import { client } from "@shortify/api-client/client";
const apiClient = client(
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
);

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
    const cookieStore = await cookies();
    const token = cookieStore.get(process.env.JWT_TOKEN_NAME || "")?.value;

    const capabilities = {
      apiClient,
      user: {
        getUser: getUserData(apiClient, token),
        logout: logoutUserAction,
        token,
      },
    };

    const req = {
      params,
      searchParams,
      capabilities,
    };

    return handler(req);
  };
