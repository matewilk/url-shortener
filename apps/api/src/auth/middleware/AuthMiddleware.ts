import { Request, Response, NextFunction } from "express";

// Extend Express Request type inline
declare module "express-serve-static-core" {
  interface Request {
    user?: { id: number };
  }
}

import { AuthService } from "@/auth/service/AuthService";
import { UserService } from "@/users/service/UserService";

export class AuthMiddleware {
  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  // user arrow functions to keep `this` context
  authenticate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];

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
        req.user = result.value;
        next();
      }
    } catch (error) {
      next(error);
    }
  };

  authorise = async (req: Request, res: Response, next: NextFunction) => {
    const { user } = req;

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userResult = await this.userService.findById(user.id);
    const isAdmin =
      userResult.kind === "success" && userResult.value.name === "Admin";

    const isSelf = req.params.id && user.id === parseInt(req.params.id, 10);

    if (!isAdmin && !isSelf) {
      return res.status(403).json({ error: "Forbidden" });
    }

    next();
  };
}
