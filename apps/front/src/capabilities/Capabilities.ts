import { Client } from "@shortify/api-client/client";
import { GetUserDataAction } from "./users/actions/getUserData";
import { LogoutUserAction } from "./users/actions/logoutUser";

export interface Capabilities {
  apiClient: Client;
  user: {
    getUser: GetUserDataAction;
    logout: LogoutUserAction;
    token?: string;
  };
}
