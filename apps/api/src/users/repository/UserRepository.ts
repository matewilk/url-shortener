import { Result } from "@/prelude/Result";
import type { User } from "@/users/User";

export interface UserRepository {
  create: (user: User.Draft) => Promise<Result<User.Return, User.AlreadyExist>>;

  findById: (id: number) => Promise<Result<User, User.NotFound>>;

  findByEmail: (email: string) => Promise<Result<User, User.NotFound>>;

  update: (
    id: number,
    patch: User.Patch
  ) => Promise<Result<User, User.UpdateError>>;

  delete: (id: number) => Promise<void>;
}
