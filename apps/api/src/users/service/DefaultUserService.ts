import { Result, ok, err, match, matchErrorTag } from "@/prelude/Result";

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
  }: User.Draft): Promise<Result<User.Return, Error>> {
    const hashedPassword = await this.auth.hashPassword(password);

    const response = await this.repo.create({
      name,
      email,
      password: hashedPassword,
    });

    return match(response, {
      onOk: (value) => ok(value),
      onErr: (error) =>
        matchErrorTag(error, {
          UserAlreadyExists: (error) => error.tag,
        }),
    });
  }

  async login(
    email: string,
    password: string
  ): Promise<Result<Token.Draft, User.NotFound | Auth.InvalidPassword>> {
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
    const token = await this.auth.generateAuthToken({ name });

    return ok(token);
  }

  async findById(id: number): Promise<Result<User, Error>> {
    try {
      const response = await this.repo.findById(id);

      return match(response, {
        onOk: (value) => ok(value),
        onErr: (error) =>
          matchErrorTag(error, {
            NotFound: (error) => error.tag,
          }),
      });
    } catch (error) {
      throw error;
    }
  }

  async findByEmail(email: string): Promise<Result<User, Error>> {
    try {
      const response = await this.repo.findByEmail(email);

      return match(response, {
        onOk: (value) => ok(value),
        onErr: (error) =>
          matchErrorTag(error, {
            NotFound: (error) => error.tag,
          }),
      });
    } catch (error) {
      throw error;
    }
  }

  async update(
    id: number,
    { name, email, password }: User.Patch
  ): Promise<Result<User, Error>> {
    const response = await this.repo.update(id, { name, email, password });

    return match(response, {
      onOk: (value) => ok(value),
      onErr: (error) => err(error),
    });
  }

  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}
