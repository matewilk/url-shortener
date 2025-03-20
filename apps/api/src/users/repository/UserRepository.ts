import { Result } from "@/Result";

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

export type User = {
  id: number;
  name: string;
  email: string;
  password: string;
};

export namespace User {
  export type Draft = Omit<User, "id">;
  export type Patch = Partial<Draft>;
  export type Return = Omit<User, "password">; // | "email"
  export class NotFound extends Error {
    tag: "UserNotFound" = "UserNotFound";
  }
  export class AlreadyExist extends Error {
    tag: "UserAlreadyExist" = "UserAlreadyExist";
  }
  export type UpdateError = NotFound | AlreadyExist;
}
