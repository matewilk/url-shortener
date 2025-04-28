import bcrypt from "bcrypt";
import jwt, {
  JwtPayload,
  JsonWebTokenError,
  TokenExpiredError,
} from "jsonwebtoken";

import { Result, ok, err } from "@/prelude/Result";
import { AuthService, Token, Auth } from "./AuthService";

export class JwtAuthService implements AuthService {
  async hashPassword(password: string): Promise<string> {
    try {
      const saltRounds = 10;
      return await bcrypt.hash(password, saltRounds);
    } catch (error) {
      throw error;
    }
  }

  async verifyPassword(
    password: string,
    dbPassword: string
  ): Promise<Result<boolean, Auth.InvalidPassword>> {
    try {
      const isValid = await bcrypt.compare(password, dbPassword);

      if (!isValid) return err(new Auth.InvalidPassword());

      return ok(isValid);
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

  async parseAuthToken(
    token: string
  ): Promise<Result<JwtPayload, Token.Invalid | Token.Expired>> {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string, {
        complete: true,
      });

      return ok(decoded);
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        return err(new Token.Expired());
      } else if (error instanceof JsonWebTokenError) {
        return err(new Token.Invalid());
      } else {
        throw err(error);
      }
    }
  }

  // TODO: granural access control
  // NOT used at the moment
  async authorise(
    token: string,
    payload: Token.Payload
  ): Promise<Result<boolean, Error>> {
    const response = await this.parseAuthToken(token);

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
