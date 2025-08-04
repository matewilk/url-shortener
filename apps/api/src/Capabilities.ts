import { AuthService } from "@/auth/service/AuthService";
import { UserService } from "@/users/service/UserService";
import { UrlService } from "@/urls/service/UrlService";

export interface Capabilities {
  userService: UserService;
  authService: AuthService;
  urlService: UrlService;
}
