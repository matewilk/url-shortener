import { PrismaClient } from "@prisma/client";

import { Result, ok, err } from "@/Result";
import { ShortenedUrl, UrlRepository } from "./UrlRepository";

export class RdbmsUrlRepository implements UrlRepository {
  constructor(private readonly db: PrismaClient) {}

  create = async (
    draft: ShortenedUrl.Draft
  ): Promise<Result<ShortenedUrl, Error>> => {
    try {
      const record = await this.db.url.create({
        data: {
          createdAt: new Date(),
          ...draft,
        },
      });

      return ok(record);
    } catch (error) {
      throw error;
    }
  };

  findById = async (
    id: number
  ): Promise<Result<ShortenedUrl, ShortenedUrl.NotFound>> => {
    try {
      const record = await this.db.url.findUnique({
        where: {
          id,
        },
      });

      if (!record) return err(new ShortenedUrl.NotFound());

      return ok(record);
    } catch (error) {
      throw error;
    }
  };

  getNextId = async (): Promise<Result<number, Error>> => {
    try {
      const [{ nextval: nextId } = { nextval: undefined }] = await this.db
        .$queryRaw<
        { nextval: bigint }[]
      >`SELECT nextval(pg_get_serial_sequence('"Url"', 'id'))`;

      return ok(Number(nextId));
    } catch (error) {
      throw error;
    }
  };
}
