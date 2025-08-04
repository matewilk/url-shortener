import express from "express";

import { Capabilities } from "./Capabilities";
import { UserController } from "./usersController";
import { AuthMiddleware } from "./authMiddleware";

export const server = async (capabilities: Capabilities) => {
  const app = express();

  const authMiddleware = new AuthMiddleware(capabilities.authService);

  const usersController = new UserController(
    capabilities.userService,
    authMiddleware
  );

  app.use(usersController.getRouter());

  return app;
};
