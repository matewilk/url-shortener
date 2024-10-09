import { PrismaClient } from "@prisma/client";
import { Hash } from "./Hash";
import { UrlRepository } from "../urls/UrlRepository";

export interface UrlShorteningServiceType {
  shorten: (url: string) => Promise<string>;
  expand: (hash: string) => Promise<string>;
}

class UrlShorteningService implements UrlShorteningServiceType {
  constructor(private repo: UrlRepository, private hash: Hash) {}

  async shorten(url: string): Promise<string> {
    const nextId = await this.repo.getNextId();

    if (!nextId) {
      throw new Error();
    }

    const id = Number(nextId);
    const hash = this.hash.encode(id);

    const urlRecord = await this.repo.create({
      id,
      longUrl: url,
      hash,
    });

    return urlRecord.hash;
  }

  async expand(hash: string): Promise<string> {
    const id = this.hash.decode(hash);
    const urlRecord = await this.repo.findById(id);

    return urlRecord?.longUrl || "";
  }
}

export default UrlShorteningService;
