import bcrypt from "bcrypt";
import jwt, {
  JwtPayload,
  JsonWebTokenError,
  TokenExpiredError,
} from "jsonwebtoken";
import type ms from "ms";

import { Result, ok, err } from "@/prelude/Result";
import { AuthService, Token, Auth } from "./AuthService";

export class JwtAuthService implements AuthService {
  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

  async verifyPassword(
    password: string,
    dbPassword: string
  ): Promise<Result<boolean, Auth.InvalidPassword>> {
    const isValid = await bcrypt.compare(password, dbPassword);

    if (!isValid) return err(new Auth.InvalidPassword());

    return ok(isValid);
  }

  async generateAuthToken(
    payload: Token.Payload,
    expiresIn?: ms.StringValue | number
  ): Promise<{ token: string }> {
    try {
      const secret = process.env.JWT_SECRET;
      if (!secret) throw new Token.ErrorCreating();

      const options: jwt.SignOptions = {
        expiresIn: expiresIn ?? "1h",
      };

      const token = jwt.sign(payload, secret, options);

      return { token };
    } catch (error) {
      throw new Token.ErrorCreating();
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
      response.value.id === payload.id
    ) {
      return ok(true);
    }

    return ok(false);
  }
}
