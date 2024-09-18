import { test, describe, beforeAll, expect, vi } from "vitest";

import { shortenUrlRoute } from "./shortenUrlRoute";
import { ErrorHandler } from "../error";

const mockUrlShorteningService = {
  shorten: vi.fn(),
  expand: async () => "_",
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
    postRoute = shortenUrlRoute(mockUrlShorteningService, errorHandler);
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
