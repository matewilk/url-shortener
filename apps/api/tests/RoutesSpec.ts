import { describe, it, expect, vi } from "vitest";
import fc from "fast-check";
import { Request, Response, NextFunction } from "express";
import { JwtPayload } from "jsonwebtoken";

import {
  withAuthorisation,
  withServices,
  Route,
  withAuth,
} from "../src/Routes";
import { UserService } from "../src/users/service/UserService";
import { AuthService } from "../src/auth/service/AuthService";

const makeReq = (
  request: Partial<Request & Record<string, any>> = {}
): Request => request as Request;

const makeRes = () => {
  const res: Partial<Response> = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  };
  return res as Response;
};

const route = (res: Response) => vi.fn().mockResolvedValue(res);
const routeError = (error: Error) => vi.fn().mockRejectedValue(error);
const next = () => vi.fn() as NextFunction;
const userServiceMock = (userResult: any) =>
  ({
    findById: vi.fn().mockResolvedValue(userResult),
  } as unknown as UserService);
const authServiceMock = (result: any) =>
  ({
    parseAuthToken: vi.fn().mockResolvedValue(result),
  } as unknown as AuthService);
const defaultServices = { myService: 123 };
const error = new Error("Test error");

export namespace RoutesSpec {
  export const runWithServices = (
    withServicesFactory: (
      route: Route<any>,
      services: Record<string, unknown>
    ) => ReturnType<typeof withServices>
  ) => {
    describe("withServices", () => {
      it("calls route with req, res and services", async () => {
        const req = makeReq();
        const res = makeRes();
        const nextMock = next();
        const routeMock = route(res);

        const withServices = withServicesFactory(routeMock, defaultServices);
        await withServices(req, res, nextMock);

        expect(routeMock).toHaveBeenCalledWith(req, res, defaultServices);
        expect(nextMock).not.toHaveBeenCalled();
      });

      it("calls next on error", async () => {
        const req = makeReq();
        const res = makeRes();
        const nextMock = next();
        const routeMock = routeError(error);

        const withServices = withServicesFactory(routeMock, defaultServices);
        await withServices(req, res, nextMock);

        expect(nextMock).toHaveBeenCalledWith(error);
      });
    });
  };

  export const runWithAuth = (
    withAuthFactory: (
      route: Route<any & { user: JwtPayload }>,
      authService: AuthService,
      services: Record<string, unknown>
    ) => ReturnType<typeof withAuth>
  ) => {
    describe("withAuth", () => {
      it("calls route with user", async () => {
        const user = { id: "user-id" };
        const req = makeReq({
          user,
          cookies: {
            [`${process.env.JWT_TOKEN_NAME}`]: "dummy-token",
          },
        });
        const res = makeRes();
        const services = {};
        const routeMock = route(res);
        const nextMock = next();

        const wrapped = withAuthFactory(
          routeMock,
          authServiceMock({ value: user }),
          services
        );
        await wrapped(req, res, nextMock);
        expect(routeMock).toHaveBeenCalledWith(req, res, { ...services, user });
        expect(nextMock).not.toHaveBeenCalled();
      });

      it("returns 401 if no token", async () => {
        const req = makeReq({
          cookies: {},
        });
        req.headers = { authorization: undefined };
        const res = makeRes();
        const services = {};
        const routeMock = route(res);
        const nextMock = next();

        const wrapped = withAuthFactory(
          routeMock,
          authServiceMock({ value: {} }),
          services
        );
        await wrapped(req, res, nextMock);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: "Unauthorized" });
        expect(nextMock).not.toHaveBeenCalled();
      });
    });
  };

  export const runWithAuthorisation = (
    withAuthorisationFactory: (
      route: Route<any>,
      userService: UserService
    ) => ReturnType<typeof withAuthorisation>
  ) => {
    describe("withAuthorisation", () => {
      it("allows admin", async () => {
        await fc.assert(
          fc.asyncProperty(fc.integer(), async (userId) => {
            const user = { payload: { id: userId } };
            const userService = userServiceMock({
              kind: "success",
              value: { name: "Admin" },
            });
            const services = { user, userService };

            const req = makeReq({ params: { id: userId.toString() } });
            const res = makeRes();
            const routeMock = route(res);

            const wrapped = withAuthorisationFactory(routeMock, userService);
            await wrapped(req, res, services);
            expect(routeMock).toHaveBeenCalledWith(req, res, services);
          })
        );
      });

      it("allows self", async () => {
        await fc.assert(
          fc.asyncProperty(
            fc.integer().filter((id) => id !== 0),
            async (userId) => {
              const user = { payload: { id: userId } };
              const userService = userServiceMock({
                kind: "success",
                value: { name: "NotAdmin" },
              });
              const services = { user, userService };

              const req = makeReq({ params: { id: userId.toString() } });
              const res = makeRes();
              const routeMock = route(res);

              const wrapped = withAuthorisationFactory(routeMock, userService);
              await wrapped(req, res, services);
              expect(routeMock).toHaveBeenCalledWith(req, res, services);
            }
          )
        );
      });

      it("forbids others", async () => {
        await fc.assert(
          fc.asyncProperty(
            fc.integer(),
            fc.integer().filter((id) => id !== 0),
            async (userId, diffId) => {
              const otherId = userId + diffId;
              if (userId === otherId) return;
              const user = { payload: { id: userId } };
              const userService = userServiceMock({
                kind: "success",
                value: { name: "NotAdmin" },
              });
              const services = { user, userService };

              const req = makeReq({
                params: { id: otherId.toString() },
              });
              const res = makeRes();
              const routeMock = route(res);

              const wrapped = withAuthorisationFactory(routeMock, userService);
              await wrapped(req, res, services);

              expect(res.status).toHaveBeenCalledWith(403);
              expect(res.json).toHaveBeenCalledWith({ error: "Forbidden" });
            }
          )
        );
      });
    });
  };
}
