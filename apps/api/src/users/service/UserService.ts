import { Result } from "@/prelude/Result";

import { User } from "@/users/User";
import { Auth, Token } from "../../auth/service/AuthService";

export interface UserService {
  register: (
    user: User.Draft
  ) => Promise<Result<User.Return, User.AlreadyExists>>;

  login: (
    email: string,
    password: string
  ) => Promise<Result<Token.Draft, User.NotFound | Auth.InvalidPassword>>;

  findById: (id: number) => Promise<Result<User, User.NotFound>>;

  findByEmail: (email: string) => Promise<Result<User, User.NotFound>>;

  update: (
    id: number,
    user: User.Patch
  ) => Promise<Result<User, User.UpdateError>>;

  delete: (id: number) => Promise<void>;
}
