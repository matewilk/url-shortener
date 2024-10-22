import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";

export interface AuthService {
  hashPassword: (password: string) => Promise<Result<string, Error>>;
  verifyPassword: (
    password: string,
    dbPassword: string
  ) => Promise<Result<boolean, Error>>;
  generateAuthToken: (
    payload: Token.Payload,
    expiresIn?: string
  ) => Promise<Result<Token.Draft, Error>>;
  validateAuthToken: (
    token: string
    // TODO: ok to use Record<string, unknown> here?
  ) => Promise<Result<Record<string, unknown> | string, Error>>;
  authorise: (
    token: string,
    payload: Token.Payload
  ) => Promise<Result<boolean, Error>>;
}

// TODO: move somweher common?
type Result<T, E> = Ok<T> | Err<E>;

type Ok<T> = {
  kind: "success";
  value: T;
};

type Err<E> = {
  kind: "error";
  error: E;
};

export namespace Token {
  // TODO: this doesn't feel right to be here - too specific for a common module
  export type Payload = {
    name: string;
  };
  // TODO: what about simply token: string for e.g. validateAuthToken?
  export type Draft = { token: string };
}

export class JwtAuthService implements AuthService {
  async hashPassword(password: string): Promise<Result<string, Error>> {
    try {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      return { kind: "success", value: hashedPassword };
    } catch (error) {
      return { kind: "error", error: new Error("Error hashing password") };
    }
  }

  async verifyPassword(
    password: string,
    dbPassword: string
  ): Promise<Result<boolean, Error>> {
    try {
      const match = await bcrypt.compare(password, dbPassword);
      return { kind: "success", value: match };
    } catch (error) {
      return { kind: "error", error: new Error("Error verifying password") };
    }
  }

  async generateAuthToken(
    payload: Token.Payload,
    expiresIn?: string
  ): Promise<Result<{ token: string }, Error>> {
    try {
      const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
        expiresIn: expiresIn ?? "1h",
      });

      return { kind: "success", value: { token } };
    } catch (error) {
      return { kind: "error", error: new Error("Error creating token") };
    }
  }

  async validateAuthToken(
    token: string
  ): Promise<Result<JwtPayload | string, Error>> {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
      return { kind: "success", value: decoded };
    } catch (error) {
      return { kind: "error", error: new Error("Invalid token") };
    }
  }

  async authorise(
    token: string,
    payload: Token.Payload
  ): Promise<Result<boolean, Error>> {
    const response = await this.validateAuthToken(token);

    if (response.kind === "error") {
      return response;
    }

    // TODO: ??
    if (
      typeof response.value === "object" &&
      "name" in response.value &&
      response.value.name === payload.name
    ) {
      return { kind: "success", value: true };
    }

    return { kind: "success", value: false };
  }
}
