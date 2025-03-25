import { Prisma } from "@prisma/client";

// TODO: move and use logger
interface Logger {
  log: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
}

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
