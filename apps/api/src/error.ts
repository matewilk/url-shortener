import { Response } from "express";
import { ZodError } from "zod";

interface Logger {
  log: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
}

export class ErrorHandler {
  constructor(private logger: Logger = console) {}

  public handleError(error: Error, res: Response) {
    this.logger.error(error.message);
    if (error instanceof ZodError) {
      return res.status(400).json({ error: "Invalid input parameters" });
    } else {
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}
