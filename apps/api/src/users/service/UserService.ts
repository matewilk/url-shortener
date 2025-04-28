import { Result } from "@/prelude/Result";

import { User } from "@/users/User";
import { Token } from "../../auth/service/AuthService";

export interface UserService {
  register: (user: User.Draft) => Promise<Result<User.Return, Error>>;

  login: (
    email: string,
    password: string
  ) => Promise<Result<Token.Draft, Error>>;

  findById: (id: number) => Promise<Result<User, Error>>;

  findByEmail: (email: string) => Promise<Result<User, Error>>;

  update: (id: number, user: User.Patch) => Promise<Result<User, Error>>;

  delete: (id: number) => Promise<void>;
}
