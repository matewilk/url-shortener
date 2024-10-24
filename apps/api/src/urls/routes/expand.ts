import { Request, Response } from "express";
import { z } from "zod";

import { paths } from "@shortify/api-client/schema";
import { UrlServiceType } from "../service/UrlService";
import { ErrorHandler } from "../../error";

type ShortUrl = paths["/{shortUrl}"]["get"]["parameters"]["path"];

const shortUrlSchema = z.object({
  shortUrl: z.string().min(1),
});

// TODO: should services be injected into the routes or other way around?
interface ExpandUrl {
  (urlService: UrlServiceType, errorHandler: ErrorHandler): (
    req: Request,
    res: Response
  ) => void;
}

export const expand: ExpandUrl = (urlService, errorHandler) => {
  return async (req: Request, res: Response) => {
    try {
      const params = shortUrlSchema.parse(req.params);

      const { shortUrl }: ShortUrl = params;

      const response = await urlService.expand(shortUrl);

      if (response instanceof Error) {
        errorHandler.handleError(response, res);
      }

      res.json({ url: response });
    } catch (error) {
      errorHandler.handleError(error as Error, res);
    }
  };
};
