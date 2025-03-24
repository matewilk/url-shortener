import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";

import { Result, ok, err } from "@/Result";
import { AuthService, Token } from "./AuthService";

export class JwtAuthService implements AuthService {
  async hashPassword(password: string): Promise<string> {
    try {
      const saltRounds = 10;
      return await bcrypt.hash(password, saltRounds);
    } catch (error) {
      throw error;
    }
  }

  async verifyPassword(password: string, dbPassword: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, dbPassword);
    } catch (error) {
      throw error;
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

  async validateAuthToken(token: string): Promise<Result<JwtPayload, Error>> {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string, {
        complete: true,
      });

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
