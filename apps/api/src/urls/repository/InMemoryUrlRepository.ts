import { Result, ok, err } from "@/Result";
import { ShortenedUrl, UrlRepository } from "./UrlRepository";

export class InMemoryUrlRepository implements UrlRepository {
  private store: Record<number, ShortenedUrl> = {};

  create = async (
    draft: ShortenedUrl.Draft
  ): Promise<Result<ShortenedUrl, Error>> => {
    try {
      const record = {
        ...draft,
        createdAt: new Date(),
      };

      if (this.store[record.id]) {
        return err(new Error("Record already exists"));
      }

      this.store[record.id] = record;

      return ok(record);
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

  getNextId = async (): Promise<Result<number, Error>> => {
    try {
      const nextId = Object.keys(this.store).length + 1;

      if (isNaN(nextId)) {
        return err(new Error("Failed to generate next ID"));
      }

      return ok(Object.keys(this.store).length + 1);
    } catch (error) {
      throw error;
    }
  };
}
