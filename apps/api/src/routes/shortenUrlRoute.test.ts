import { test, describe, beforeAll, expect, vi } from "vitest";

import { shortenUrlRoute } from "./shortenUrlRoute";

const fakeUrlShorteningService = {
  shorten: vi.fn(),
  expand: async () => "_",
};

describe("shortenUrlRoute", () => {
  let postRoute: any;
  beforeAll(() => {
    postRoute = shortenUrlRoute(fakeUrlShorteningService);
  });

  test("returns a shortened url", async () => {
    fakeUrlShorteningService.shorten.mockResolvedValue("shortUrl");
    const req = { body: { url: "https://example.com" } };
    const res = { json: vi.fn() };

    await postRoute(req, res);

    expect(res.json).toHaveBeenCalledWith({ shortUrl: "shortUrl" });
  });

  test("returns 400 on invalid url", async () => {
    const req = { body: { url: "invalid" } };
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };

    await postRoute(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Invalid input parameters",
    });
  });

  test("returns 400 on invalid post body", async () => {
    const req = { body: { shortUrl: "https://example.com" } };
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };

    await postRoute(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Invalid input parameters",
    });
  });
});
