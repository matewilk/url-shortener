import { test, describe, expect, beforeAll } from "vitest";
import fc from "fast-check";

import { UrlService } from "./UrlService";

import { InMemoryUrlRepository } from "../urls/InMemoryUrlRepository";
import { Hash, Base62 } from "./Hash";

describe("UrlShorteningService", () => {
  let reopository: InMemoryUrlRepository;
  let hash: Hash;
  let urlService: UrlService;
  beforeAll(() => {
    hash = new Base62();
    reopository = new InMemoryUrlRepository();
    urlService = new UrlService(reopository, hash);
  });
  test("shorten and expand", async () => {
    await fc.assert(
      fc.asyncProperty(fc.webUrl(), async (url) => {
        const hash = await urlService.shorten(url);
        const expandedUrl = await urlService.expand(hash);

        expect(expandedUrl).toBe(url);
      })
    );
  });
});
