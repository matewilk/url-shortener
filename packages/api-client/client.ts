import createClient, { Client as OpenApiClient } from "openapi-fetch";
import type { paths } from "./api";

export type Client = OpenApiClient<paths>;

export const client = (url: string) => {
  return createClient<paths>({ baseUrl: url });
};
