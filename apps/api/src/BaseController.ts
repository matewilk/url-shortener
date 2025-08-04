import { Request, Response, NextFunction, RequestHandler } from "express";

export abstract class BaseController {
  protected asyncHandler(
    route: (req: Request, res: Response, next: NextFunction) => Promise<any>
  ) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        await route(req, res, next);
      } catch (error) {
        next(error);
      }
    };
  }
}
