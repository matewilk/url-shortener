import { ShortenedUrl, UrlRepository } from "./UrlRepository";

export class InMemoryUrlRepository implements UrlRepository {
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
