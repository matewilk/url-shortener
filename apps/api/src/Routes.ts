import { Request, Response } from "express";

import { JwtAuthService } from "./auth/service/JwtAuthService";

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

// TODO: should auth service be injected into the component?
export const withAuth =
  <Services extends Record<string, unknown>>(
    route: Route<Services>,
    services: Services
  ) =>
  (req: Request, res: Response) => {
    const authService = new JwtAuthService();
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = authService.validateAuthToken(token);
    if (user instanceof Error) {
      return res.status(401).json({ error: user.message });
    }
    return route(req, res, { ...services, user });
  };
