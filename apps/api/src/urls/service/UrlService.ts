import { Result, ok, err } from "@/prelude/Result";
import { Hash } from "./Hash";
import { ShortenedUrl, UrlRepository } from "../repository/UrlRepository";

export interface UrlService {
  shorten: (url: string) => Promise<ShortenedUrl>;
  expand: (hash: string) => Promise<Result<string, Error>>;
}

export class DefaultUrlService implements UrlService {
  constructor(private repo: UrlRepository, private hash: Hash) {}

  async shorten(url: string): Promise<ShortenedUrl> {
    const nextId = await this.repo.getNextId();

    const id = Number(nextId);
    const hash = this.hash.encode(id);

    const shortenedUrl = await this.repo.create({
      id,
      url,
      hash,
    });

    return shortenedUrl;
  }

  async expand(hash: string): Promise<Result<string, Error>> {
    const id = this.hash.decode(hash);
    const response = await this.repo.findById(id);

    return response.kind === "success"
      ? ok(response.value?.url || "")
      : err(response.error);
  }
}
