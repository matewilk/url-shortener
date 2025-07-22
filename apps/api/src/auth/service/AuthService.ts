import ms from "ms";
import { Result, taggedError } from "@/prelude/Result";

export interface AuthService {
  hashPassword: (password: string) => Promise<string>;
  verifyPassword: (
    password: string,
    dbPassword: string
  ) => Promise<Result<boolean, Auth.InvalidPassword>>;
  generateAuthToken: (
    payload: Token.Payload,
    expiresIn?: ms.StringValue | number
  ) => Promise<Token.Draft>;
  parseAuthToken: (
    token: string
    // TODO: ok to use Record<string, unknown> here instead of JwtPayload?
  ) => Promise<Result<Record<string, unknown>, Token.Invalid | Token.Expired>>;
  authorise: (
    token: string,
    payload: Token.Payload
  ) => Promise<Result<boolean, Error>>;
}

export namespace Auth {
  export class InvalidPassword extends taggedError("InvalidPassord") {}
}

export namespace Token {
  // TODO: this doesn't feel right to be here - too specific for a common module
  export type Payload = {
    id: number;
  };
  // TODO: what about simply token: string for e.g. validateAuthToken?
  export type Draft = { token: string };
  export class ErrorCreating extends taggedError("ErrorCreatingToken") {}
  export class Invalid extends taggedError("InvalidToken") {}
  export class Expired extends taggedError("ExpiredToken") {}
}
