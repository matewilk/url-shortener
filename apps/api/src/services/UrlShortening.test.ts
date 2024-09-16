import { test, describe, expect } from "vitest";

import UrlShorteningService from "./UrlShortening";

const fakeDbService = {
  create: async () => "shortened",
  get: async () => "expanded",
};

describe("UrlShorteningService", () => {
  test("shorten", async () => {
    const service = new UrlShorteningService(fakeDbService);
    const result = await service.shorten("https://example.com");
    expect(result).toBe("shortened");
  });

  test("expand", async () => {
    const service = new UrlShorteningService(fakeDbService);
    const result = await service.expand("hash");
    expect(result).toBe("expanded");
  });
});
