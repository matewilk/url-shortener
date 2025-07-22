import {
  Result,
  ok,
  err,
  match,
  matchErrorTag,
  flatMapAsyncW,
} from "@/prelude/Result";

import { Auth, AuthService, Token } from "../../auth/service/AuthService";
import { UserRepository } from "../repository/UserRepository";
import { User } from "@/users/User";
import { UserService } from "./UserService";

export class DefaultUserService implements UserService {
  constructor(private repo: UserRepository, public auth: AuthService) {}

  async register({
    name,
    email,
    password,
  }: User.Draft): Promise<Result<User.Return, User.AlreadyExists>> {
    const hashedPassword = await this.auth.hashPassword(password);

    return await this.repo.create({
      name,
      email,
      password: hashedPassword,
    });
  }

  async login(
    email: string,
    password: string
  ): Promise<Result<Token.Draft, User.NotFound | Auth.InvalidPassword>> {
    const userResult = await this.repo.findByEmail(email);

    return flatMapAsyncW(userResult, async (user) => {
      const passwordResult = await this.auth.verifyPassword(
        password,
        user.password
      );
      return flatMapAsyncW(passwordResult, async () => {
        const token = await this.auth.generateAuthToken({ id: user.id });
        return ok(token);
      });
    });
  }

  async findById(id: number): Promise<Result<User, User.NotFound>> {
    return await this.repo.findById(id);
  }

  async findByEmail(email: string): Promise<Result<User, User.NotFound>> {
    return await this.repo.findByEmail(email);
  }

  async update(
    id: number,
    { name, email, password }: User.Patch
  ): Promise<Result<User, User.UpdateError>> {
    return await this.repo.update(id, { name, email, password });
  }

  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}
