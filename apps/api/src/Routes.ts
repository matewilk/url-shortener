import { NextFunction, Request, Response } from "express";

import { AuthService } from "./auth/service/AuthService";

export interface Route<Services extends Record<string, unknown>> {
  (req: Request, res: Response, services: Services): Promise<Response>;
}

export const withServices =
  <Services extends Record<string, unknown>>(
    route: Route<Services>,
    services: Services
  ) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await route(req, res, services);
    } catch (error) {
      next(error);
    }
  };

export const withAuth =
  <Services extends Record<string, unknown>>(
    route: Route<Services>,
    authService: AuthService,
    services: Services
  ) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];

      if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const result = await authService.parseAuthToken(token);
      if (result.kind === "error") {
        if (result.error.tag === "ExpiredToken") {
          return res.status(401).json({ error: "Token Expired" });
        }
        return res.status(401).json({ error: "Token Invalid" });
      } else {
        await route(req, res, { ...services, user: result.value });
      }
    } catch (error) {
      next(error);
    }
  };
