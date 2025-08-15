import { Result, taggedError } from "@/prelude/Result";

export interface UrlRepository {
  create: (url: ShortenedUrl.Draft) => Promise<ShortenedUrl>;

  findById: (
    id: number
  ) => Promise<Result<ShortenedUrl, ShortenedUrl.NotFound>>;

  listByUserId: (userId: number) => Promise<Array<ShortenedUrl>>;

  getNextId: () => Promise<number>;
}

export type ShortenedUrl = {
  id: number;
  url: string;
  hash: string;
  createdAt: Date;
  userId?: number;
};

export namespace ShortenedUrl {
  export type Draft = Omit<ShortenedUrl, "createdAt">;
  export class NotFound extends taggedError("NotFound") {}
}
