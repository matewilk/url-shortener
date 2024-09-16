import { Request, Response, Router } from "express";
import { z } from "zod";

import { paths } from "@shortify/api-client/schema";
import UrlShorteningService from "../services/UrlShortening";
import { dbService, DbServiceType } from "../services/Db";

const router = Router({ mergeParams: true });

type ShortUrl = paths["/{shortUrl}"]["get"]["parameters"]["path"];
type ShortUrlGetRequest = paths["/{shortUrl}"]["get"]["parameters"];

const shortUrlSchema = z.object({
  shortUrl: z.string().min(3),
});

interface RedirectToUrlRoute<UrlService> {
  (urlService: UrlService): (req: Request, res: Response) => void;
}

const redirectToUrlRoute: RedirectToUrlRoute<
  UrlShorteningService<DbServiceType>
> = (urlService) => {
  // why this doesn't return ts error ShortUrlGetRequest ?
  return async (req: Request<{}, {}, ShortUrlGetRequest>, res: Response) => {
    try {
      const params = shortUrlSchema.parse(req.params);

      const { shortUrl }: ShortUrl = params;

      const url = await urlService.expand(shortUrl);

      res.json({ url });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json(JSON.parse(error.message));
      }

      res.status(500).json({ error: "Internal server error" });
    }
  };
};

router.get("", redirectToUrlRoute(new UrlShorteningService(dbService)));

export default router;
