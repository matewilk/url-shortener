import { describe, test, expect } from "vitest";
import { UrlRepository, ShortenedUrl } from "../../src/urls/UrlRepository";

export namespace UrlRepositorySpec {
  export const run = (repo: UrlRepository) => {
    describe("UrlRepository", () => {
      // TODO: Use fast-check
      test("urls can be persisted and found", async () => {
        const draft: ShortenedUrl.Draft = {
          hash: "123",
          longUrl: "www.google.com",
          id: 1,
        };

        const created = await repo.create(draft);

        const found = await repo.findById(created.id);

        expect(found).toEqual(created);
      });
    });
  };
}
