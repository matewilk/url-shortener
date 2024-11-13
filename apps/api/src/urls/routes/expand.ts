import { Request, Response } from "express";
import { z } from "zod";

import { paths } from "@shortify/api-client/schema";
import { UrlServiceType } from "../service/UrlService";
import { ErrorHandler } from "../../error";
import { Route } from "@/Routes";

type ExpandUrlRouteServices = {
  urlService: UrlServiceType;
  errorHandler: ErrorHandler;
};

type ShortUrl = paths["/{shortUrl}"]["get"]["parameters"]["path"];

const shortUrlSchema = z.object({
  shortUrl: z.string().min(1),
});

export const expand: Route<ExpandUrlRouteServices> = async (
  req: Request,
  res: Response,
  { urlService, errorHandler }
): Promise<Response> => {
  try {
    const params = shortUrlSchema.parse(req.params);

    const { shortUrl }: ShortUrl = params;

    const response = await urlService.expand(shortUrl);

    if (response instanceof Error) {
      return errorHandler.handleError(response, res);
    }

    return res.json({ url: response });
  } catch (error) {
    return errorHandler.handleError(error as Error, res);
  }
};
