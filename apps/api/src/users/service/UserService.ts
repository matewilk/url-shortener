import { Result, ok, err } from "@/Result";
import { toError } from "@/error";

import { AuthService, Token } from "../../auth/service/AuthService";
import { User, UserRepositopr } from "../repository/UserRepository";

export interface UserServiceType {
  register: (user: User.Draft) => Promise<Result<User.Return, Error>>;

  login: (
    email: string,
    password: string
  ) => Promise<Result<Token.Draft, Error>>;

  findById: (id: number) => Promise<Result<User | null, Error>>;

  findByEmail: (email: string) => Promise<Result<User | null, Error>>;

  update: (user: User.Update) => Promise<Result<User, Error>>;

  delete: (id: number) => Promise<Result<User, Error>>;
}

export class UserService implements UserServiceType {
  constructor(private repo: UserRepositopr, public auth: AuthService) {}

  async register({
    name,
    email,
    password,
  }: User.Draft): Promise<Result<User.Return, Error>> {
    const userExists = await this.repo.findByEmail(email);

    // TODO: user repo interface does not clearly define the return type
    if (userExists.kind === "success" && userExists.value !== null) {
      return err(new Error("User already exists"));
    }

    const hashResponse = await this.auth.hashPassword(password);
    if (hashResponse.kind === "error") {
      return err(hashResponse.error);
    }

    const response = await this.repo.create({
      name,
      email,
      password: hashResponse.value,
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

    if (user.value === null) {
      return err(new Error("User not found"));
    }

    const verifyResponse = await this.auth.verifyPassword(
      password,
      user.value.password
    );

    if (verifyResponse.kind === "error") {
      return err(verifyResponse.error);
    }

    if (!verifyResponse.value) {
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

  // TODO: this should return a Result<User | null, Error> ?
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

  async update({
    id,
    name,
    email,
    password,
  }: User.Update): Promise<Result<User, Error>> {
    const response = await this.repo.update({ id, name, email, password });

    return response.kind === "success"
      ? ok(response.value)
      : err(response.error);
  }

  async delete(id: number): Promise<Result<User, Error>> {
    const response = await this.repo.delete(id);

    return response.kind === "success"
      ? ok(response.value)
      : err(response.error);
  }
}
