import express, { Request, Response, NextFunction } from "express";

import { Capabilities } from "@/Capabilities";
import { AuthMiddleware } from "@/auth/middleware/AuthMiddleware";
import { UserController } from "@/users/controller/UserController";
import { UrlController } from "@/urls/controller/UrlController";

export const server = async (capabilities: Capabilities) => {
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
  const urlController = new UrlController(
    capabilities.urlService,
    authMiddleware
  );

  // TODO: you can add error handling middleware here
  app.use(userController.getRouter());
  app.use(urlController.getRouter());

  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    res.status(500).json({ error: err.message || "Internal server error" });
  });

  return app;
};
