import { Result, ok, err } from "@/Result";
import { toError } from "@/error";

import { AuthService, Token } from "../../auth/service/AuthService";
import { User, UserRepository } from "../repository/UserRepository";

export interface UserServiceType {
  register: (user: User.Draft) => Promise<Result<User.Return, Error>>;

  login: (
    email: string,
    password: string
  ) => Promise<Result<Token.Draft, Error>>;

  findById: (id: number) => Promise<Result<User | null, Error>>;

  findByEmail: (email: string) => Promise<Result<User | null, Error>>;

  update: (id: number, user: User.Patch) => Promise<Result<User, Error>>;

  delete: (id: number) => Promise<void>;
}

export class UserService implements UserServiceType {
  constructor(private repo: UserRepository, public auth: AuthService) {}

  async register({
    name,
    email,
    password,
  }: User.Draft): Promise<Result<User.Return, Error>> {
    const hashedPassword = await this.auth.hashPassword(password);

    const response = await this.repo.create({
      name,
      email,
      password: hashedPassword,
    });

    return response.kind === "success"
      ? ok(response.value)
      : err(response.error);
  }

  async login(
    email: string,
    password: string
  ): Promise<Result<Token.Draft, Error>> {
    const user = await this.repo.findByEmail(email);

    if (user.kind === "error") {
      return err(user.error);
    }

    const passwordMatch = await this.auth.verifyPassword(
      password,
      user.value.password
    );

    if (passwordMatch) {
      return err(new Error("Invalid password"));
    }

    const { name } = user.value;
    const tokenResponse = await this.auth.generateAuthToken({ name });

    if (tokenResponse.kind === "error") {
      return err(tokenResponse.error);
    }

    return ok(tokenResponse.value);
  }

  async findById(id: number): Promise<Result<User | null, Error>> {
    try {
      const response = await this.repo.findById(id);

      return response.kind === "success"
        ? ok(response.value)
        : err(response.error);
    } catch (error) {
      return err(toError(error));
    }
  }

  async findByEmail(email: string): Promise<Result<User | null, Error>> {
    try {
      const response = await this.repo.findByEmail(email);

      return response.kind === "success"
        ? ok(response.value)
        : err(response.error);
    } catch (error) {
      return err(toError(error));
    }
  }

  async update(
    id: number,
    { name, email, password }: User.Patch
  ): Promise<Result<User, Error>> {
    const response = await this.repo.update(id, { name, email, password });

    return response.kind === "success"
      ? ok(response.value)
      : err(response.error);
  }

  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}
