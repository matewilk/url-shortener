import { Request, Response, Router } from "express";
import { ZodError } from "zod";

import { BaseController } from "@/BaseController";
import { shortUrlSchema, urlSchema } from "@/urls/Url";
import { UrlService } from "@/urls/service/UrlService";
import { match, matchErrorTag } from "@/prelude/Result";
import { AuthMiddleware } from "@/auth/middleware/AuthMiddleware";

export class UrlController extends BaseController {
  constructor(
    private urlService: UrlService,
    private authMiddleware: AuthMiddleware
  ) {
    super();
  }

  public shorten = async (req: Request, res: Response) => {
    try {
      const body = urlSchema.parse(req.body);

      const { url } = body;

      const shortUrl = await this.urlService.shorten(url, req.user?.id);

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

      return match(response, {
        onOk: (url) => res.json({ url }),
        onErr: (error) =>
          matchErrorTag(error, {
            NotFound: (error) =>
              res.status(404).json({ error: "Url not found" }),
          }),
      });
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

  public getAll = async (req: Request, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const urls = await this.urlService.listUrls(userId);

    return res.json({ urls });
  };

  getRouter(): Router {
    const router = Router();

    router.post(
      "/urls/shorten",
      this.authMiddleware.maybeAuthenticate,
      this.shorten
    );
    router.get("/urls/:shortUrl", this.expand);
    router.get(
      "/urls",
      this.authMiddleware.authenticate,
      this.authMiddleware.authorise,
      this.getAll
    );

    return router;
  }
}
