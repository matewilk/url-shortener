import { describe, test, expect } from "vitest";
import fc from "fast-check";

import { UserServiceType } from "../../src/users/service/UserService";

export namespace UserServiceSpec {
  export const run = (userService: UserServiceType) => {
    describe("UserService", () => {
      test("users can be created, found, updated and deleted", async () => {
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
                const created = await userService.registerUser(newUser);

                if (created instanceof Error) {
                  throw created;
                }

                const found = await userService.findUserById(created.id);
                expect(found).toEqual(created);

                const updated = await userService.updateUser({
                  id: created.id,
                  name: "updated name",
                });

                if (updated instanceof Error) {
                  throw updated;
                }

                const foundUpdated = await userService.findUserById(created.id);
                expect(foundUpdated).toEqual(updated);

                const deleted = await userService.deleteUser(created.id);
                expect(deleted).toEqual(updated);
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
