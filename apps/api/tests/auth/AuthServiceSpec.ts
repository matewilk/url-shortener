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
              username: fc
                .string({ minLength: 1, maxLength: 25 })
                .filter((s) => !s.includes(" ")),
            }),
            async (payload) => {
              const tokenResponse = await auth.generateAuthToken(payload);

              if (tokenResponse.kind === "error") {
                throw tokenResponse.error;
              }

              const validateResponse = await auth.validateAuthToken(
                tokenResponse.value
              );

              if (validateResponse.kind === "error") {
                throw validateResponse.error;
              }

              // TODO: ther must be a better way
              if (
                typeof validateResponse.value === "object" &&
                "username" in validateResponse.value
              ) {
                const { username } = validateResponse.value;
                expect({ username }).toEqual(payload);
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
              const hashResponse = await auth.hashPassword(password);

              if (hashResponse.kind === "error") {
                throw hashResponse.error;
              }

              const verifyResponse = await auth.verifyPassword(
                password,
                hashResponse.value
              );

              expect(
                verifyResponse.kind === "success" && verifyResponse.value
              ).toEqual(true);
            }
          ),
          { interruptAfterTimeLimit: 1500 }
        );
      });
    });
  };
}
