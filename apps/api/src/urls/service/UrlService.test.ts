import { test, describe, expect, beforeAll } from "vitest";
import fc from "fast-check";

import { DefaultUrlService, UrlService } from "./UrlService";

import { InMemoryUrlRepository } from "../repository/InMemoryUrlRepository";
import { Hash, Base62 } from "./Hash";
import { UrlRepository } from "../repository/UrlRepository";

describe("Url Service", () => {
  let reopository: UrlRepository;
  let hash: Hash;
  let urlService: UrlService;
  beforeAll(() => {
    hash = new Base62();
    reopository = new InMemoryUrlRepository();
    urlService = new DefaultUrlService(reopository, hash);
  });
  test("shorten and expand url", async () => {
    await fc.assert(
      fc.asyncProperty(fc.webUrl(), async (url) => {
        const shortUrl = await urlService.shorten(url);

        const expandedUrl = await urlService.expand(shortUrl.hash);

        if (expandedUrl.kind === "error") {
          throw expandedUrl.error;
        }

        expect(expandedUrl.value).toBe(url);
      })
    );
  });
});
