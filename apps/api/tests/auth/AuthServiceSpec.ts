import { describe, test, expect } from "vitest";
import fc from "fast-check";

import { AuthService } from "../../src/auth/service/AuthService";

export namespace AuthServiceSpec {
  export const run = (auth: AuthService) => {
    describe("AuthService", () => {
      test("token can be generated and verified", async () => {
        await fc.assert(
          fc.asyncProperty(
            fc.record({
              name: fc
                .string({ minLength: 1, maxLength: 25 })
                .filter((s) => !s.includes(" ")),
            }),
            async (payload) => {
              const tokenResponse = await auth.generateAuthToken(payload);

              const validateResponse = await auth.parseAuthToken(
                tokenResponse.token
              );

              if (validateResponse.kind === "error") {
                throw validateResponse.error;
              }

              // TODO: ther must be a better way
              if (
                typeof validateResponse.value === "object" &&
                "username" in validateResponse.value
              ) {
                const authorised = await auth.authorise(
                  tokenResponse.token,
                  payload
                );
                expect(authorised).toEqual(true);
              }
            }
          )
        );
      });

      test("password can be hashed and verified", async () => {
        await fc.assert(
          fc.asyncProperty(
            fc.string({ minLength: 8, maxLength: 256 }),
            async (password) => {
              const hashedPassword = await auth.hashPassword(password);

              const verified = await auth.verifyPassword(
                password,
                hashedPassword
              );

              expect(verified).toEqual({ kind: "success", value: true });
            }
          ),
          { interruptAfterTimeLimit: 1500 }
        );
      });
    });
  };
}
