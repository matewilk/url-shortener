import { Result, ok, err } from "@/prelude/Result";

import { AuthService, Token } from "../../auth/service/AuthService";
import { UserRepository } from "../repository/UserRepository";
import { User } from "@/users/User";
import { UserService } from "./UserService";

export class DefaultUserService implements UserService {
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

    const isPasswordValid = await this.auth.verifyPassword(
      password,
      user.value.password
    );

    if (isPasswordValid.kind === "error") {
      return err(isPasswordValid.error);
    }

    const { name } = user.value;
    const tokenResponse = await this.auth.generateAuthToken({ name });

    if (tokenResponse.kind === "error") {
      return err(tokenResponse.error);
    }

    return ok(tokenResponse.value);
  }

  async findById(id: number): Promise<Result<User, Error>> {
    try {
      const response = await this.repo.findById(id);

      return response.kind === "success"
        ? ok(response.value)
        : err(response.error);
    } catch (error) {
      throw error;
    }
  }

  async findByEmail(email: string): Promise<Result<User, Error>> {
    try {
      const response = await this.repo.findByEmail(email);

      return response.kind === "success"
        ? ok(response.value)
        : err(response.error);
    } catch (error) {
      throw error;
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
