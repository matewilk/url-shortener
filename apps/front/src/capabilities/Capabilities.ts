import { Users } from "./users/Users";
import { Urls } from "./urls/Urls";

export interface Capabilities {
  users: Users;
  urls: Urls;
}
