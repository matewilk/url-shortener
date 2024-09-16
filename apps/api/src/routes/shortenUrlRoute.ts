import { Request, Response, Router } from "express";
import { z } from "zod";

import { components, paths } from "@shortify/api-client/schema";
import UrlShorteningService, {
  UrlShorteningServiceType,
} from "../services/UrlShortening";
import { dbService } from "../services/Db";

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

export const shortenUrlRoute: ShortenUrlRoute<UrlShorteningServiceType> = (
  urlService
) => {
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
        return res.status(400).json({ error: "Invalid URL" });
      }

      res.status(500).json({ error: "Internal server error" });
    }
  };
};

router.post("/", shortenUrlRoute(new UrlShorteningService(dbService)));

export default router;
