import { test, describe, expect, vi } from "vitest";
import { Request, Response } from "express";

import { UrlController } from "../../../src/urls/controller/UrlController";

const mockedUrlService = {
  shorten: vi.fn(),
  expand: vi.fn(),
  findAll: vi.fn(),
};

const routes = new UrlController(mockedUrlService, {});

describe("expand Url Route", () => {
  test("returns the original URL for a valid short URL", async () => {
    mockedUrlService.expand.mockResolvedValue({
      kind: "success",
      value: "https://example.com/original-url",
    });

    const req: Partial<Request> = {
      params: { shortUrl: "shortUrl" },
    };
    const res: Partial<Response> = { json: vi.fn() };

    await routes.expand(req as Request, res as Response);

    expect(res.json).toHaveBeenCalledWith({
      url: "https://example.com/original-url",
    });
  });

  test("returns 400 on invalid short URL", async () => {
    const req: Partial<Request> = { params: { shortUrl: "" } };
    const res: Partial<Response> = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await routes.expand(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: "Invalid input parameters",
      })
    );
  });
});
