import { Result, ok, err } from "@/Result";
import { ShortenedUrl, UrlRepository } from "./UrlRepository";
import { toError } from "@/error";

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
      return err(toError(error));
    }
  };

  findById = async (
    id: number
  ): Promise<Result<ShortenedUrl | null, Error>> => {
    try {
      return ok(this.store[id] ?? null);
    } catch (error) {
      return err(toError(error));
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
      return err(toError(error));
    }
  };
}
