import { NextFunction, Request, Response } from "express";

import { AuthService } from "./auth/service/AuthService";
import { JwtPayload } from "jsonwebtoken";

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
    route: Route<Services & { user: JwtPayload }>,
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

export const withAuthorisation =
  <Services extends Record<string, unknown>>(
    route: Route<Services>
  ): Route<Services & { user: JwtPayload }> =>
  async (
    req: Request,
    res: Response,
    services: Services & { user: JwtPayload }
  ) => {
    const { user } = services;

    if (req.params.id && user.payload.id !== parseInt(req.params.id, 10)) {
      return res.status(403).json({ error: "Forbidden" });
    }

    return await route(req, res, services);
  };
