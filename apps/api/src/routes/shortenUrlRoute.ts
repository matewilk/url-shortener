import { Request, Response } from "express";
import { z } from "zod";

import { components } from "@shortify/api-client/schema";
import { UrlShorteningServiceType } from "../services/UrlShortener";
import { ErrorHandler } from "../error";

type ShortUrl = components["schemas"]["ShortUrl"];

const urlSchema = z.object({
  url: z.string().url(),
});

interface ShortenUrlRoute<UrlService> {
  (urlService: UrlService, errorHandler: ErrorHandler): (
    req: Request,
    res: Response
  ) => void;
}

export const shortenUrlRoute: ShortenUrlRoute<UrlShorteningServiceType> = (
  urlService,
  errorHandler
) => {
  return async (req: Request, res: Response) => {
    try {
      const body = urlSchema.parse(req.body);

      const { url } = body;

      const shortUrl = await urlService.shorten(url);

      const resp: ShortUrl = {
        shortUrl,
      };

      res.json(resp);
    } catch (error) {
      errorHandler.handleError(error as Error, res);
    }
  };
};
