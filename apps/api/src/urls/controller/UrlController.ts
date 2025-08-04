import { Request, Response, Router } from "express";
import { ZodError } from "zod";

import { BaseController } from "@/BaseController";
import { shortUrlSchema, urlSchema } from "@/urls/Url";
import { UrlService } from "@/urls/service/UrlService";

export class UrlController extends BaseController {
  constructor(private urlService: UrlService) {
    super();
  }

  public shorten = async (req: Request, res: Response) => {
    try {
      const body = urlSchema.parse(req.body);

      const { url } = body;

      const shortUrl = await this.urlService.shorten(url);

      return res.json({ shortUrl: shortUrl.hash });
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

  public expand = async (req: Request, res: Response) => {
    try {
      const params = shortUrlSchema.parse(req.params);

      const { shortUrl } = params;

      const response = await this.urlService.expand(shortUrl);

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

  getRouter(): Router {
    const router = Router();

    router.post("/shorten", this.shorten);
    router.get("/:shortUrl", this.expand);

    return router;
  }
}
