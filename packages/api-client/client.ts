import createClient from "openapi-fetch";
import type { paths } from "./api";

export const client = (url: string) => {
  return createClient<paths>({ baseUrl: url });
};
