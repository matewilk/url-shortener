import { Result } from "@/prelude/Result";

export interface UrlRepository {
  create: (url: ShortenedUrl.Draft) => Promise<ShortenedUrl>;

  findById: (
    id: number
  ) => Promise<Result<ShortenedUrl, ShortenedUrl.NotFound>>;

  getNextId: () => Promise<number>;
}

export type ShortenedUrl = {
  id: number;
  url: string;
  hash: string;
  createdAt: Date;
};

export namespace ShortenedUrl {
  export type Draft = Omit<ShortenedUrl, "createdAt">;
  export class NotFound extends Error {
    tag: "UrlNotFound" = "UrlNotFound";
  }
}
