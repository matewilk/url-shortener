import { describe, it, expect, vi } from "vitest";
import fc from "fast-check";
import { withAuthorisation, Route } from "../src/Routes";
import { UserService } from "../src/users/service/UserService";
import { Request, Response } from "express";

describe("withAuthorisation", () => {
  const makeRes = () => {
    const res: Partial<Response> = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };
    return res as Response;
  };

  const makeReq = (id?: string | number) => {
    return { params: id ? { id: String(id) } : {} } as unknown as Request;
  };

  const userServiceMock = (userResult: any) => {
    return {
      findById: vi.fn().mockResolvedValue(userResult),
    } as unknown as UserService;
  };

  const dummyRoute: Route<any> = vi.fn(async (req, res) => {
    (res as any).called = true;
    return res;
  });

  it("allows admin", async () => {
    await fc.assert(
      fc.asyncProperty(fc.integer(), fc.string(), async (userId, errorMsg) => {
        const user = { payload: { id: userId } };
        const userService = userServiceMock({
          kind: "success",
          value: { name: "Admin" },
        });
        const req = makeReq(userId);
        const res = makeRes();
        const services = { user, userService };
        const wrapped = withAuthorisation(dummyRoute);
        await wrapped(req, res, services);
        expect((res as any).called).toBe(true);
      })
    );
  });

  it("allows self", async () => {
    await fc.assert(
      fc.asyncProperty(fc.integer(), async (userId) => {
        const user = { payload: { id: userId } };
        const userService = userServiceMock({
          kind: "success",
          value: { name: "NotAdmin" },
        });
        const req = makeReq(userId);
        const res = makeRes();
        const services = { user, userService };
        const wrapped = withAuthorisation(dummyRoute);
        await wrapped(req, res, services);
        expect((res as any).called).toBe(true);
      })
    );
  });

  it("forbids others", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer(),
        fc.integer().filter((id) => id !== 0),
        async (userId, diffId) => {
          // Ensure userId != userId + diffId
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
          const wrapped = withAuthorisation(dummyRoute);
          await wrapped(req, res, services);
          expect(res.status).toHaveBeenCalledWith(403);
          expect(res.json).toHaveBeenCalledWith({ error: "Forbidden" });
        }
      )
    );
  });
});
