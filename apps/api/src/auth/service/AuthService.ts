import { Result } from "@/Result";

export interface AuthService {
  hashPassword: (
    password: string
  ) => Promise<Result<string, Auth.ErrorHashingPassword>>;
  verifyPassword: (
    password: string,
    dbPassword: string
  ) => Promise<Result<boolean, Error>>;
  generateAuthToken: (
    payload: Token.Payload,
    expiresIn?: string
  ) => Promise<Result<Token.Draft, Token.ErrorCreating>>;
  validateAuthToken: (
    token: string
    // TODO: ok to use Record<string, unknown> here?
  ) => Promise<Result<Record<string, unknown> | string, Error>>;
  authorise: (
    token: string,
    payload: Token.Payload
  ) => Promise<Result<boolean, Error>>;
}

export namespace Auth {
  export class ErrorHashingPassword extends Error {
    tag: "ErrorHashingPassword" = "ErrorHashingPassword";
  }
  export class ErrorVerifyingPassword extends Error {
    tag: "ErrorVerifyingPassword" = "ErrorVerifyingPassword";
  }
}

export namespace Token {
  // TODO: this doesn't feel right to be here - too specific for a common module
  export type Payload = {
    name: string;
  };
  // TODO: what about simply token: string for e.g. validateAuthToken?
  export type Draft = { token: string };
  export class ErrorCreating extends Error {
    tag: "ErrorCreating" = "ErrorCreating";
  }
}
