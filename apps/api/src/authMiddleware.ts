import { NextFunction, Request, Response } from "express";
import { AuthService } from "./auth/service/AuthService";

export class AuthMiddleware {
  constructor(private authService: AuthService) {}

  async authenticate(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.cookies[process.env.JWT_TOKEN_NAME || ""];

      if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const result = await this.authService.parseAuthToken(token);
      if (result.kind === "error") {
        if (result.error.tag === "ExpiredToken") {
          return res.status(401).json({ error: "Token Expired" });
        }
        return res.status(401).json({ error: "Token Invalid" });
      } else {
        next(result.value);
      }
    } catch (error) {
      next(error);
    }
  }
}
