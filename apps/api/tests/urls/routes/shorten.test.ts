import { test, describe, expect, vi } from "vitest";
import { Request, Response } from "express";

import { UrlController } from "../../../src/urls/controller/UrlController";

const mockedUrlService = {
  shorten: vi.fn(),
  expand: async () => ({ kind: "success" as const, value: "_" }),
};
const routes = new UrlController(mockedUrlService);

describe("shorten Url Route", () => {
  test("returns a shortened url", async () => {
    mockedUrlService.shorten.mockResolvedValue({
      hash: "shortUrl",
    });
    const req: Partial<Request> = {
      body: { url: "https://example.com" },
    };
    const res: Partial<Response> = { json: vi.fn() };

    await routes.shorten(req as Request, res as Response);

    expect(res.json).toHaveBeenCalledWith({ shortUrl: "shortUrl" });
  });

  test("returns 400 on invalid url", async () => {
    const req: Partial<Request> = { body: { url: "invalid" } };
    const res: Partial<Response> = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await routes.shorten(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: "Invalid input parameters",
      })
    );
  });

  test("returns 400 on invalid post body", async () => {
    const req: Partial<Request> = { body: { shortUrl: "https://example.com" } };
    const res: Partial<Response> = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await routes.shorten(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: "Invalid input parameters",
      })
    );
  });
});
