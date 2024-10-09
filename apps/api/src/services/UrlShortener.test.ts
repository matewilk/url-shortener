import { test, describe, expect, beforeAll } from "vitest";

import UrlShorteningService from "./UrlShortener";

import { InMemoryDb } from "./Db";
import { Hash, Base62 } from "./Hash";

describe("UrlShorteningService", () => {
  let db: InMemoryDb;
  let hash: Hash;
  beforeAll(() => {
    hash = new Base62();
    db = new InMemoryDb(["url"]);
  });
  test("shorten", async () => {
    const service = new UrlShorteningService(db, hash);
    const result = await service.shorten("https://example.com");
    console.log(result);
    expect(result).toBe("shortened");
  });

  test("expand", async () => {
    const service = new UrlShorteningService(db, hash);
    const result = await service.expand("hash");
    expect(result).toBe("expanded");
  });
});
