import { describe, test, expect } from "vitest";
import fc from "fast-check";
import { Request, Response } from "express";

import { UserRoutes } from "../../src/users/routes";
import { UserService } from "../../src/users/service/UserService";
import { ErrorHandler } from "../../src/error";

export namespace UserRoutesSpec {
  export const run = (
    routes: UserRoutes,
    service: UserService,
    errorHandler: ErrorHandler
  ) => {
    // TODO: Does this test make sense?
    describe("UserRoutes", () => {
      test.skip("users can be created, found and deleted", async () => {
        await fc.assert(
          fc.asyncProperty(
            fc.uniqueArray(
              fc.record({
                email: fc.emailAddress(),
                password: fc
                  .string({ minLength: 8 })
                  .filter((s) => !s.includes(" ")),
              }),
              { selector: (user) => user.email }
            ),
            async (drafts) => {
              for (const draft of drafts) {
                console.log(draft);
                const createUserRoute = routes.createUser(
                  service,
                  errorHandler
                );
                const user = await createUserRoute(
                  { body: draft } as Request,
                  { json: () => {} } as Response
                );

                const findUserByIdRoute = routes.findUserById(
                  service,
                  errorHandler
                );

                // this doesn't return anyting!
                // well now it does
                const foundUser = await findUserByIdRoute(
                  {
                    body: {},
                    // @ts-ignore
                    params: { id: user.id },
                  } as Partial<Request> as Request,
                  { json: () => {} } as Response
                );

                expect(foundUser).toEqual(user);
              }
            }
          )
        );
      });
    });
  };
}
