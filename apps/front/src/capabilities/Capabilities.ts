import { Client } from "@shortify/api-client/client";
import { GetUserDataAction } from "./users/actions/getUserData";

export interface Capabilities {
  apiClient: Client;
  getUserData: GetUserDataAction;
}
