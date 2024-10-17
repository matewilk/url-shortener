import { Request, Response } from "express";
import { z } from "zod";

import { UrlServiceType } from "../service/UrlService";
import { ErrorHandler } from "../../error";

const urlSchema = z.object({
  url: z.string().url(),
});

interface ShortenUrl {
  (urlService: UrlServiceType, errorHandler: ErrorHandler): (
    req: Request,
    res: Response
  ) => void;
}

export const shorten: ShortenUrl = (urlService, errorHandler) => {
  return async (req: Request, res: Response) => {
    try {
      const body = urlSchema.parse(req.body);

      const { url } = body;

      const result = await urlService.shorten(url);

      if (result instanceof Error) {
        errorHandler.handleError(result, res);
      }

      res.json({ shortUrl: result });
    } catch (error) {
      errorHandler.handleError(error as Error, res);
    }
  };
};
