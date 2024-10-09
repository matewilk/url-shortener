import { PrismaClient } from "@prisma/client";
import { Hash } from "./Hash";

export interface UrlShorteningServiceType {
  shorten: (url: string) => Promise<string>;
  expand: (hash: string) => Promise<string>;
}

class UrlShorteningService implements UrlShorteningServiceType {
  constructor(private db: PrismaClient, private hash: Hash) {}

  async shorten(url: string): Promise<string> {
    const [{ nextval: nextId } = { nextval: undefined }] = await this.db
      .$queryRaw<
      { nextval: bigint }[]
    >`SELECT nextval(pg_get_serial_sequence('"Url"', 'id'))`;

    if (!nextId) {
      throw new Error();
    }

    const id = Number(nextId);
    const hash = this.hash.encode(id);

    const urlRecord = await this.db.url.create({
      data: {
        id,
        url,
        hash,
      },
    });

    return urlRecord.hash;
  }

  async expand(hash: string): Promise<string> {
    const id = this.hash.decode(hash);
    const urlRecord = await this.db.url.findUnique({
      where: {
        id,
      },
    });

    return urlRecord?.url || "";
  }
}

export default UrlShorteningService;
