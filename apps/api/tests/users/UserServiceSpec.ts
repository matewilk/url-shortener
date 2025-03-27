import { describe, test, expect } from "vitest";
import fc from "fast-check";

import { UserService } from "../../src/users/service/UserService";

export namespace UserServiceSpec {
  export const run = (userService: UserService) => {
    describe("UserService", () => {
      // TODO: this clashes with UserRepository test, skipping for now
      test.skip("users can be created, logged in, found, updated and deleted", async () => {
        await fc.assert(
          fc.asyncProperty(
            fc.uniqueArray(
              fc
                .record({
                  email: fc.emailAddress(),
                })
                .chain((email) => {
                  return fc.record({
                    name: fc
                      .string({ minLength: 3, maxLength: 25 })
                      .filter((s) => !s.includes(" ")),
                    email: fc.constantFrom(email.email),
                    password: fc
                      .string({ minLength: 8, maxLength: 256 })
                      .filter((s) => !s.includes(" ")),
                  });
                }),
              { selector: (user) => user.email }
            ),
            async (newUsers) => {
              for (const newUser of newUsers) {
                const created = await userService.register(newUser);

                if (created instanceof Error) {
                  throw created;
                }

                const loginResponse = await userService.login(
                  newUser.email,
                  newUser.password
                );
                // TODO: makes sense to decode the token and check the payload?
                expect(loginResponse).not.toBeInstanceOf(Error);

                const found = await userService.findById(created.id);
                expect(found).toEqual(created);

                const updated = await userService.update(created.id, {
                  name: "updated name",
                });

                if (updated instanceof Error) {
                  throw updated;
                }

                const foundUpdated = await userService.findById(created.id);
                expect(foundUpdated).toEqual(updated);

                const deleted = await userService.delete(created.id);
                expect(deleted).toEqual(updated);
                // if you can't find the user, it's deleted, easy
              }
            }
          ),
          // TODO: is there a better way to limit test iterations number?
          { interruptAfterTimeLimit: 1500 }
        );
      });
    });
  };
}
