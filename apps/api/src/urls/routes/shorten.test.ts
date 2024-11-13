import { test, describe, beforeAll, expect, vi } from "vitest";
import { Request, Response } from "express";

import { shorten } from "./shorten";
import { ErrorHandler } from "../../error";

const mockedUrlShorteningService = {
  shorten: vi.fn(),
  expand: async () => ({ kind: "success" as const, value: "_" }),
};

const mockedLogger = {
  error: vi.fn(),
  log: vi.fn(),
  info: vi.fn(),
};

describe("shortenUrlRoute", () => {
  let errorHandler: ErrorHandler;
  beforeAll(() => {
    errorHandler = new ErrorHandler(mockedLogger);
  });

  test("returns a shortened url", async () => {
    mockedUrlShorteningService.shorten.mockResolvedValue("shortUrl");
    const req: Partial<Request> = {
      body: { url: "https://example.com" },
    };
    const res: Partial<Response> = { json: vi.fn() };

    await shorten(req as Request, res as Response, {
      urlService: mockedUrlShorteningService,
      errorHandler,
    });

    expect(res.json).toHaveBeenCalledWith({ shortUrl: "shortUrl" });
  });

  test("returns 400 on invalid url", async () => {
    const req: Partial<Request> = { body: { url: "invalid" } };
    const res: Partial<Response> = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await shorten(req as Request, res as Response, {
      urlService: mockedUrlShorteningService,
      errorHandler,
    });

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Invalid input parameters",
    });
  });

  test("returns 400 on invalid post body", async () => {
    const req: Partial<Request> = { body: { shortUrl: "https://example.com" } };
    const res: Partial<Response> = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await shorten(req as Request, res as Response, {
      urlService: mockedUrlShorteningService,
      errorHandler,
    });

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Invalid input parameters",
    });
  });
});
