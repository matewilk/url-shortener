import { ShortenedUrl, UrlRepository, Result } from "./UrlRepository";

export class InMemoryUrlRepository implements UrlRepository {
  private store: Record<number, ShortenedUrl> = {};

  create = (
    draft: ShortenedUrl.Draft
  ): Promise<Result<ShortenedUrl, Error>> => {
    try {
      const record = {
        ...draft,
        createdAt: new Date(),
      };

      if (this.store[record.id]) {
        return Promise.reject({
          kind: "error",
          error: new Error("Record already exists"),
        });
      }

      this.store[record.id] = record;

      return Promise.resolve({ kind: "success", value: record });
    } catch (error) {
      return Promise.reject({ kind: "error", error });
    }
  };

  findById = (id: number): Promise<Result<ShortenedUrl | null, Error>> => {
    try {
      return Promise.resolve({
        kind: "success",
        value: this.store[id] ?? null,
      });
    } catch (error) {
      return Promise.reject({ kind: "error", error });
    }
  };

  getNextId = (): Promise<Result<number, Error>> => {
    try {
      const nextId = Object.keys(this.store).length + 1;

      if (isNaN(nextId)) {
        return Promise.reject({
          kind: "error",
          error: new Error("Failed to generate next ID"),
        });
      }

      return Promise.resolve({
        kind: "success",
        value: Object.keys(this.store).length + 1,
      });
    } catch (error) {
      return Promise.reject({ kind: "error", error });
    }
  };
}
