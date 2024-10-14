import { describe, test, expect } from "vitest";
import fc from "fast-check";

import { UrlRepository } from "../../src/urls/UrlRepository";

export namespace UrlRepositorySpec {
  export const run = (repo: UrlRepository) => {
    describe("UrlRepository", () => {
      test("urls can be persisted and found", async () => {
        let idCounter = 1;

        await fc.assert(
          fc.asyncProperty(
            fc.record({
              url: fc.webUrl(),
              hash: fc.string({ minLength: 1 }),
            }),
            async (draft) => {
              const draftWithId = { ...draft, id: idCounter++ };
              const created = await repo.create(draftWithId);

              const found = await repo.findById(created.id);
              expect(found).toEqual(created);
            }
          )
        );
      });
    });
  };
}
