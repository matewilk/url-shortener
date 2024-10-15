import { PrismaClient } from "@prisma/client";
import { ShortenedUrl, UrlRepository, Result } from "./UrlRepository";

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

      return Promise.resolve({ kind: "success", value: record });
    } catch (error) {
      return Promise.reject({ kind: "error", error });
    }
  };

  findById = async (
    id: number
  ): Promise<Result<ShortenedUrl | undefined, Error>> => {
    try {
      const record = await this.db.url.findUnique({
        where: {
          id,
        },
      });

      return Promise.resolve({ kind: "success", value: record || undefined });
    } catch (error) {
      return Promise.reject({ kind: "error", error });
    }
  };

  getNextId = async (): Promise<Result<number, Error>> => {
    try {
      const [{ nextval: nextId } = { nextval: undefined }] = await this.db
        .$queryRaw<
        { nextval: bigint }[]
      >`SELECT nextval(pg_get_serial_sequence('"Url"', 'id'))`;

      return Promise.resolve({ kind: "success", value: Number(nextId) });
    } catch (error) {
      return Promise.reject({ kind: "error", error });
    }
  };
}
