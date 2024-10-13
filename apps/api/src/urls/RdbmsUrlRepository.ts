import { PrismaClient } from "@prisma/client";
import { ShortenedUrl, UrlRepository } from "./UrlRepository";

export class RdbmsUrlRepository implements UrlRepository {
  constructor(private readonly db: PrismaClient) {}

  create = async (draft: ShortenedUrl.Draft): Promise<ShortenedUrl> => {
    const record = this.db.url.create({
      data: {
        createdAt: new Date(),
        ...draft,
      },
    });

    return record;
  };

  findById = async (id: number): Promise<ShortenedUrl | undefined> => {
    return (
      (await this.db.url.findUnique({
        where: {
          id,
        },
      })) || undefined
    );
  };

  getNextId = async (): Promise<number> => {
    const [{ nextval: nextId } = { nextval: undefined }] = await this.db
      .$queryRaw<
      { nextval: bigint }[]
    >`SELECT nextval(pg_get_serial_sequence('"Url"', 'id'))`;

    return Number(nextId);
  };
}
