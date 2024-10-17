import { Hash } from "./Hash";
import { UrlRepository } from "../repository/UrlRepository";

export interface UrlServiceType {
  shorten: (url: string) => Promise<string | Error>;
  expand: (hash: string) => Promise<string | Error>;
}

export class UrlService implements UrlServiceType {
  constructor(private repo: UrlRepository, private hash: Hash) {}

  async shorten(url: string): Promise<string | Error> {
    const nextIdResponse = await this.repo.getNextId();

    if (nextIdResponse.kind === "error") {
      return nextIdResponse.error;
    }

    const id = Number(nextIdResponse.value);
    const hash = this.hash.encode(id);

    const response = await this.repo.create({
      id,
      url,
      hash,
    });

    return response.kind === "success" ? hash : response.error;
  }

  async expand(hash: string): Promise<string | Error> {
    const id = this.hash.decode(hash);
    const response = await this.repo.findById(id);

    return response.kind === "success"
      ? response.value?.url || ""
      : response.error;
  }
}
