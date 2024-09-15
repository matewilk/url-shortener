import { Request, Response, Router } from "express";
import { z } from "zod";

import { components, paths } from "@shortify/api-client/schema";
import UrlShorteningService from "../services/UrlShortening";
import { dbService, DbServiceType } from "../services/Db";

const router = Router();

type ShortenPostRequest =
  paths["/shorten"]["post"]["requestBody"]["content"]["application/json"];
type Url = components["schemas"]["Url"];
type ShortUrl = components["schemas"]["ShortUrl"];

const urlSchema = z.object({
  url: z.string().url(),
});

interface ShortenUrlRoute<UrlService> {
  (urlService: UrlService): (req: Request, res: Response) => void;
}

const shortenUrlRoute: ShortenUrlRoute<UrlShorteningService<DbServiceType>> = (
  urlService
) => {
  // cover 2 cases
  // 1. invalid url - zod covers that - 400
  // 2. invalid post body - for example attribute url is called shortUrl - 400

  // how do I extend Response<ShortUrl> ?
  return async (req: Request<{}, {}, ShortenPostRequest>, res: Response) => {
    try {
      const body = urlSchema.parse(req.body);

      const { url }: { url: Url } = body;

      const shortUrl = await urlService.shorten(url);

      const resp: ShortUrl = {
        shortUrl,
      };

      res.json(resp);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json(JSON.parse(error.message));
      }

      res.status(500).json({ error: "Internal server error" });
    }
  };
};

router.post("/", shortenUrlRoute(new UrlShorteningService(dbService)));

export default router;
