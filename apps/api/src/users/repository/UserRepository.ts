import { Result } from "@/Result";

export interface UserRepository {
  create: (user: User.Draft) => Promise<Result<User.Return, Error>>;

  findById: (id: number) => Promise<Result<User | null, Error>>;

  findByEmail: (email: string) => Promise<Result<User | null, Error>>;

  update: (user: User.Update) => Promise<Result<User, Error>>;

  delete: (id: number) => Promise<Result<User, Error>>;
}

export type User = {
  id: number;
  name: string;
  email: string;
  password: string;
};

export namespace User {
  export type Draft = Omit<User, "id">;
  export type Update = { id: number } & Partial<Draft>;
  export type Return = Omit<User, "password">; // | "email"
}
