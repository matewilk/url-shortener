import { ShortenedUrl, UrlRepository } from "./UrlRepository";

export class InMemoryUrlRepository implements UrlRepository {
  private store: Record<number, ShortenedUrl> = {};

  create = (draft: ShortenedUrl.Draft): Promise<ShortenedUrl> => {
    const record = {
      ...draft,
      createdAt: new Date(),
    };

    this.store[record.id] = record;

    return Promise.resolve(record);
  };

  findById = (id: number): Promise<ShortenedUrl | undefined> => {
    return Promise.resolve(this.store[id]);
  };

  getNextId = (): Promise<number> => {
    return Promise.resolve(Object.keys(this.store).length + 1);
  };
}
