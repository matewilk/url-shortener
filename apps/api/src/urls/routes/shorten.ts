import { Request, Response } from "express";
import { z } from "zod";

import { UrlServiceType } from "../service/UrlService";
import { ErrorHandler } from "../../error";
import { Route } from "@/Routes";

type ShortenUrlRouteServices = {
  urlService: UrlServiceType;
  errorHandler: ErrorHandler;
};

const urlSchema = z.object({
  url: z.string().url(),
});

export const shorten: Route<ShortenUrlRouteServices> = async (
  req,
  res,
  { urlService, errorHandler }
): Promise<Response> => {
  try {
    const body = urlSchema.parse(req.body);

    const { url } = body;

    const result = await urlService.shorten(url);

    if (result instanceof Error) {
      return errorHandler.handleError(result, res);
    }

    return res.json({ shortUrl: result });
  } catch (error) {
    return errorHandler.handleError(error as Error, res);
  }
};
