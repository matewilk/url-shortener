import { describe, test, expect } from "vitest";
import fc from "fast-check";

import { UserRepository } from "../../src/users/repository/UserRepository";

export namespace UserRepositorySpec {
  export const run = (repo: UserRepository) => {
    describe("UserRepository", () => {
      test("users can be created, found and deleted", async () => {
        let idCounter = 1;

        await fc.assert(
          fc.asyncProperty(
            // TODO: this test passes even though fc generates same email
            // probably because the user is deleted before the next one is created
            fc.record({
              name: fc.string(),
              email: fc.emailAddress(),
              password: fc.string({ minLength: 8 }),
            }),
            async (draft) => {
              const draftWithId = { ...draft, id: idCounter++ };
              const created = await repo.create(draftWithId);

              if (created.kind === "error") {
                throw created.error;
              }

              const found = await repo.findById(created.value.id);
              expect(found).toEqual(created);

              const foundByEmail = await repo.findByEmail(created.value.email);
              expect(foundByEmail).toEqual(created);

              const deleted = await repo.delete(created.value.id);
              expect(deleted).toEqual(created);
            }
          )
        );
      });
    });
  };
}
