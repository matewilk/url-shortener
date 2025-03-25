import { Result, ok, err } from "@/Result";
import { Hash } from "./Hash";
import { UrlRepository } from "../repository/UrlRepository";

export interface UrlServiceType {
  shorten: (url: string) => Promise<Result<string, Error>>;
  expand: (hash: string) => Promise<Result<string, Error>>;
}

export class UrlService implements UrlServiceType {
  constructor(private repo: UrlRepository, private hash: Hash) {}

  async shorten(url: string): Promise<Result<string, Error>> {
    const nextIdResponse = await this.repo.getNextId();

    //TODO: not necessarily pass on error?
    if (nextIdResponse.kind === "error") {
      throw nextIdResponse.error;
    }

    const id = Number(nextIdResponse.value);
    const hash = this.hash.encode(id);

    const response = await this.repo.create({
      id,
      url,
      hash,
    });

    // TODO: same here, pass on error?
    return response.kind === "success" ? ok(hash) : err(response.error);
  }

  async expand(hash: string): Promise<Result<string, Error>> {
    const id = this.hash.decode(hash);
    const response = await this.repo.findById(id);

    return response.kind === "success"
      ? ok(response.value?.url || "")
      : err(response.error);
  }
}
