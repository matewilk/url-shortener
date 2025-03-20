import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";

import { Result, ok, err } from "@/Result";
import { AuthService, Token, Auth } from "./AuthService";

export class JwtAuthService implements AuthService {
  async hashPassword(
    password: string
  ): Promise<Result<string, Auth.ErrorHashingPassword>> {
    try {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      return ok(hashedPassword);
    } catch (error) {
      return err(new Auth.ErrorHashingPassword());
    }
  }

  async verifyPassword(
    password: string,
    dbPassword: string
  ): Promise<Result<boolean, Error>> {
    try {
      const match = await bcrypt.compare(password, dbPassword);

      return ok(match);
    } catch (error) {
      return err(new Error("Error verifying password"));
    }
  }

  async generateAuthToken(
    payload: Token.Payload,
    expiresIn?: string
  ): Promise<Result<{ token: string }, Token.ErrorCreating>> {
    try {
      const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
        expiresIn: expiresIn ?? "1h",
      });

      return ok({ token });
    } catch (error) {
      return err(new Token.ErrorCreating());
    }
  }

  async validateAuthToken(
    token: string
  ): Promise<Result<JwtPayload | string, Error>> {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

      return ok(decoded);
    } catch (error) {
      return err(error as Error);
    }
  }

  // TODO: granural access control
  // NOT used at the moment
  async authorise(
    token: string,
    payload: Token.Payload
  ): Promise<Result<boolean, Error>> {
    const response = await this.validateAuthToken(token);

    if (response.kind === "error") {
      return err(response.error);
    }

    // TODO: ??
    if (
      typeof response.value === "object" &&
      "name" in response.value &&
      response.value.name === payload.name
    ) {
      return ok(true);
    }

    return ok(false);
  }
}
