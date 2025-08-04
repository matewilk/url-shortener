import { AuthService } from "@/auth/service/AuthService";
import { UserService } from "@/users/service/UserService";

export interface Capabilities {
  userService: UserService;
  authService: AuthService;
}
