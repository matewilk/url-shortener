import { describe, it, expect, vi } from "vitest";
import fc from "fast-check";
import { withAuthorisation, withServices, Route } from "../src/Routes";
import { UserService } from "../src/users/service/UserService";
import { Request, Response, NextFunction } from "express";

const makeRes = () => {
  const res: Partial<Response> = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  };
  return res as Response;
};

export namespace RoutesSpec {
  export const runWithServices = (
    withServicesFactory: (
      route: Route<any>,
      services: Record<string, unknown>
    ) => ReturnType<typeof withServices>
  ) => {
    describe("withServices", () => {
      it("calls route with req, res and services", async () => {
        const makeReq = () => ({} as Request);
        const req = makeReq();
        const res = makeRes();
        const next = vi.fn() as NextFunction;
        const services = { myService: 123 };
        const route = vi.fn().mockResolvedValue(res);

        const withServices = withServicesFactory(route, services);
        await withServices(req, res, next);

        expect(route).toHaveBeenCalledWith(req, res, services);
        expect(next).not.toHaveBeenCalled();
      });

      it("calls next on error", async () => {
        const makeReq = () => ({} as Request);
        const req = makeReq();
        const res = makeRes();
        const next = vi.fn() as NextFunction;
        const services = { myService: 123 };
        const error = new Error("Test error");
        const route = vi.fn().mockRejectedValue(error);

        const withServices = withServicesFactory(route, services);
        await withServices(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
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
      const makeReq = (id?: string | number) => {
        return { params: id ? { id: String(id) } : {} } as unknown as Request;
      };

      const dummyRoute: Route<any> = vi.fn(async (req, res) => {
        (res as any).called = true;
        return res;
      });

      const userServiceMock = (userResult: any) => {
        return {
          findById: vi.fn().mockResolvedValue(userResult),
        } as unknown as UserService;
      };

      it("allows admin", async () => {
        await fc.assert(
          fc.asyncProperty(fc.integer(), async (userId) => {
            const user = { payload: { id: userId } };
            const userService = userServiceMock({
              kind: "success",
              value: { name: "Admin" },
            });
            const req = makeReq(userId);
            const res = makeRes();
            const services = { user, userService };
            const wrapped = withAuthorisationFactory(dummyRoute, userService);
            await wrapped(req, res, services);
            expect((res as any).called).toBe(true);
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
              const req = makeReq(userId);
              const res = makeRes();
              const services = { user, userService };
              const wrapped = withAuthorisationFactory(dummyRoute, userService);
              await wrapped(req, res, services);
              expect((res as any).called).toBe(true);
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
              const req = makeReq(otherId);
              const res = makeRes();
              const services = { user, userService };
              const wrapped = withAuthorisationFactory(dummyRoute, userService);
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
