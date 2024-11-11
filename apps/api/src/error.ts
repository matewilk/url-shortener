import { Response } from "express";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";

interface Logger {
  log: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
}

export class DbError extends Error {
  constructor(message: string, public statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
  }
}

export class ErrorHandler {
  constructor(private logger: Logger = console) {}

  public handleError(error: Error, res: Response) {
    this.logger.error(error.message);
    if (error instanceof ZodError) {
      return res.status(400).json({ error: "Invalid input parameters" });
    }

    if (error instanceof DbError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    return res.status(500).json({ error: "Internal server error" });
  }
}

export const toError = (error: unknown): Error => {
  if (error instanceof Error) {
    return error;
  }

  return new Error(`An unexpected error occurred ${JSON.stringify(error)}`);
};

export namespace PrismaError {
  export type RequestError = Prisma.PrismaClientKnownRequestError;

  const codes = {
    uniqueConstraint: "P2002",
    foreignKeyContraint: "P2003",
    recordNotFound: "P2025",
  } as const;

  export const isForeignKeyConstraintError = (error: RequestError): boolean =>
    error.code === codes.foreignKeyContraint;

  export const isUniqueConstraintError = (error: RequestError): boolean =>
    error.code === codes.uniqueConstraint;

  export const isRecordNotFoundError = (error: RequestError): boolean =>
    error.code === codes.recordNotFound;
}
