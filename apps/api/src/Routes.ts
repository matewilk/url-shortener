import { Request, Response } from "express";

import { AuthService } from "./auth/service/AuthService";

export interface Route<Services extends Record<string, unknown>> {
  (req: Request, res: Response, services: Services): Promise<Response>;
}

export const withServices =
  <Services extends Record<string, unknown>>(
    route: Route<Services>,
    services: Services
  ) =>
  (req: Request, res: Response) =>
    route(req, res, services);

export const withAuth =
  <Services extends Record<string, unknown>>(
    route: Route<Services>,
    authService: AuthService,
    services: Services
  ) =>
  async (req: Request, res: Response) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const result = await authService.validateAuthToken(token);
    if (result.kind === "error") {
      return res.status(401).json({ error: result.error.message });
    }
    return route(req, res, { ...services, user: result.value });
  };
