import { Request, Response, Router } from "express";
import { z } from "zod";

import { paths } from "@shortify/api-client/schema";

const router = Router({ mergeParams: true });

type ShortUrl = paths["/{shortUrl}"]["get"]["parameters"]["path"];
type ShortUrlGetRequest = paths["/{shortUrl}"]["get"]["parameters"];

const shortUrlSchema = z.object({
  shortUrl: z.string().min(3),
});

// why this doesn't return ts error ShortUrlGetRequest ?
router.get("", (req: Request<ShortUrlGetRequest>, res: Response) => {
  try {
    const params = shortUrlSchema.parse(req.params);

    const shortUrl: ShortUrl = params;

    res.json(shortUrl);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json(JSON.parse(error.message));
    }

    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
