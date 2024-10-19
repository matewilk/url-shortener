import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";

export interface AuthServiceType {
  hashPassword: (password: string) => Promise<Result<string, Error>>;
  generateAuthToken: (
    username: string,
    password: string,
    dbPassword: string,
    expiresIn?: string
  ) => Promise<Result<string, Error>>;
  validateAuthToken: (
    token: string
  ) => Promise<Result<JwtPayload | string, Error>>;
}

type Result<T, E> = Ok<T> | Err<E>;

type Ok<T> = {
  kind: "success";
  value: T;
};

type Err<E> = {
  kind: "error";
  error: E;
};

export class AuthService implements AuthServiceType {
  async hashPassword(password: string): Promise<Result<string, Error>> {
    try {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      return { kind: "success", value: hashedPassword };
    } catch (error) {
      return { kind: "error", error: new Error("Error hashing password") };
    }
  }

  async generateAuthToken(
    username: string,
    password: string,
    dbPassword: string,
    expiresIn?: string
  ): Promise<Result<string, Error>> {
    try {
      const match = await bcrypt.compare(password, dbPassword);
      if (!match) {
        return { kind: "error", error: new Error("Invalid password") };
      }

      const token = jwt.sign({ username }, process.env.JWT_SECRET as string, {
        expiresIn: expiresIn ?? "1h",
      });

      return { kind: "success", value: token };
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
}
