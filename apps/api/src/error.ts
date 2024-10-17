import { Response } from "express";
import { ZodError } from "zod";

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
