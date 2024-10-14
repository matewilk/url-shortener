import { test, describe, expect, beforeAll } from "vitest";

import UrlService from "./UrlService";

import { InMemoryUrlRepository } from "../urls/InMemoryUrlRepository";
import { Hash, Base62 } from "./Hash";

describe("UrlShorteningService", () => {
  let reopository: InMemoryUrlRepository;
  let hash: Hash;
  beforeAll(() => {
    hash = new Base62();
    reopository = new InMemoryUrlRepository();
  });
  test("shorten", async () => {
    const service = new UrlService(reopository, hash);
    const result = await service.shorten("https://example.com");
    expect(result).toBe("1");
  });

  test("expand", async () => {
    const service = new UrlService(reopository, hash);
    const result = await service.expand("1");
    expect(result).toBe("https://example.com");
  });
});
