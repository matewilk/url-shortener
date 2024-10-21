export interface UserRepositopr {
  create: (user: User.Draft) => Promise<Result<User, Error>>;

  findById: (id: number) => Promise<Result<User | null, Error>>;

  findByEmail: (email: string) => Promise<Result<User | null, Error>>;

  update: (user: User.Update) => Promise<Result<User, Error>>;

  delete: (id: number) => Promise<Result<User, Error>>;
}

export type Result<T, E> = Ok<T> | Err<E>;

export type Ok<T> = {
  kind: "success";
  value: T;
};

export type Err<E> = {
  kind: "error";
  error: E;
};

export type User = {
  id: number;
  name: string;
  email: string;
  password: string;
};

export namespace User {
  export type Draft = Omit<User, "id">;
  export type Update = { id: number } & Partial<Draft>;
}
