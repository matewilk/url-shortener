import { Request, Response } from "express";
import { z, ZodError } from "zod";

import { paths } from "@shortify/api-client/schema";
import { UrlServiceType } from "../service/UrlService";
import { Route } from "@/Routes";

type ExpandUrlRouteServices = {
  urlService: UrlServiceType;
};

type ShortUrl = paths["/{shortUrl}"]["get"]["parameters"]["path"];

const shortUrlSchema = z.object({
  shortUrl: z.string().min(1),
});

export const expand: Route<ExpandUrlRouteServices> = async (
  req: Request,
  res: Response,
  { urlService }
): Promise<Response> => {
  try {
    const params = shortUrlSchema.parse(req.params);

    const { shortUrl }: ShortUrl = params;

    const response = await urlService.expand(shortUrl);

    if (response.kind === "error") {
      throw response.error;
    }

    return res.json({ url: response.value });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        error: "Invalid input parameters",
        details: error.flatten(),
      });
    }
    throw error;
  }
};
