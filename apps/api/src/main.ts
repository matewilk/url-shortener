import express, { Request, Response, NextFunction } from "express";
import { UserController } from "@/users/controllers/UserController";
import { Capabilities } from "./Capabilities";
import { AuthMiddleware } from "./auth/middleware/AuthMiddleware";

export const main = async (capabilities: Capabilities) => {
  const app = express();
  app.use(express.json());

  const authMiddleware = new AuthMiddleware(
    capabilities.authService,
    capabilities.userService
  );
  const userController = new UserController(
    capabilities.userService,
    authMiddleware
  );

  app.use(userController.getRouter());

  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    res.status(500).json({ error: err.message || "Internal server error" });
  });

  return app;
};
