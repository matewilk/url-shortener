import { Result, ok, err } from "@/prelude/Result";
import { ShortenedUrl, UrlRepository } from "./UrlRepository";

export class InMemoryUrlRepository implements UrlRepository {
  private store: Record<number, ShortenedUrl> = {};

  create = async (draft: ShortenedUrl.Draft): Promise<ShortenedUrl> => {
    try {
      const record = {
        ...draft,
        createdAt: new Date(),
      };

      if (this.store[record.id]) {
        throw new Error("Record already exists");
      }

      this.store[record.id] = record;

      return record;
    } catch (error) {
      throw error;
    }
  };

  findById = async (
    id: number
  ): Promise<Result<ShortenedUrl, ShortenedUrl.NotFound>> => {
    try {
      const result = this.store[id];

      if (!result) return err(new ShortenedUrl.NotFound());

      return ok(result);
    } catch (error) {
      throw error;
    }
  };

  listByUserId = async (userId: number): Promise<Array<ShortenedUrl>> => {
    try {
      const results = Object.values(this.store).filter(
        (url) => url.userId === userId
      );

      return results;
    } catch (error) {
      throw error;
    }
  };

  getNextId = async (): Promise<number> => {
    try {
      const nextId = Object.keys(this.store).length + 1;

      if (isNaN(nextId)) {
        throw new Error("Failed to generate next ID");
      }

      return Object.keys(this.store).length + 1;
    } catch (error) {
      throw error;
    }
  };
}
