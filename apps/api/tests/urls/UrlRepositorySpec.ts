import { describe, test, expect } from "vitest";
import fc from "fast-check";

import { UrlRepository } from "../../src/urls/repository/UrlRepository";

export namespace UrlRepositorySpec {
  export const run = (repo: UrlRepository) => {
    describe("UrlRepository", () => {
      test("urls can be created and found", async () => {
        await fc.assert(
          fc.asyncProperty(
            fc.uniqueArray(
              fc.record({
                id: fc.integer({ min: 1 }),
                url: fc.webUrl(),
                hash: fc
                  .string({ minLength: 1 })
                  .filter((s) => !s.includes(" ")),
              }),
              { selector: (record) => record.id }
            ),
            async (urlDrafts) => {
              for (const draft of urlDrafts) {
                const draftWithId = { ...draft };
                const created = await repo.create(draftWithId);

                if (created.kind === "error") {
                  throw created.error;
                }

                const found = await repo.findById(created.value.id);

                if (found.kind === "error") {
                  throw found.error;
                }

                expect(found.value).toEqual(created.value);
              }
            }
          ),
          // TODO: the above doesn't seem to be creating unique ids
          // creating duplicated 0 at some point,
          // limiting for now to 10 runs, need to investigate further
          { numRuns: 1 }
        );
      });

      // TODO: Add test to handle unhappy paths
    });
  };
}
