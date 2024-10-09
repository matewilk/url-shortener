import { PrismaClient } from "@prisma/client";
import { ShortenedUrl, UrlRepository } from "./UrlRepository";

export class RdbmsUrlRepository implements UrlRepository {
  constructor(private readonly db: PrismaClient) {}

  create = (draft: ShortenedUrl.Draft): Promise<ShortenedUrl> => {
    throw new Error("not implemented");
  };

  findById = (id: number): Promise<ShortenedUrl | undefined> => {
    throw new Error("not implemented");
  };

  getNextId = (): Promise<number> => {
    throw new Error("not implemented");
  };
}
