import { test, describe, beforeAll, expect, vi } from "vitest";

import { shorten } from "./shorten";
import { ErrorHandler } from "../../error";

const mockUrlShorteningService = {
  shorten: vi.fn(),
  expand: async () => ({ kind: "success" as const, value: "_" }),
};

const mockLogger = {
  error: vi.fn(),
  log: vi.fn(),
  info: vi.fn(),
};

describe("shortenUrlRoute", () => {
  let postRoute: any;
  beforeAll(() => {
    const errorHandler = new ErrorHandler(mockLogger);
    postRoute = shorten(mockUrlShorteningService, errorHandler);
  });

  test("returns a shortened url", async () => {
    mockUrlShorteningService.shorten.mockResolvedValue("shortUrl");
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
