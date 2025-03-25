import { Response } from "express";
import { z, ZodError } from "zod";

import { UrlServiceType } from "../service/UrlService";
import { Route } from "@/Routes";

type ShortenUrlRouteServices = {
  urlService: UrlServiceType;
};

const urlSchema = z.object({
  url: z.string().url(),
});

export const shorten: Route<ShortenUrlRouteServices> = async (
  req,
  res,
  { urlService }
): Promise<Response> => {
  try {
    const body = urlSchema.parse(req.body);

    const { url } = body;

    const result = await urlService.shorten(url);

    return res.json({ shortUrl: result });
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
