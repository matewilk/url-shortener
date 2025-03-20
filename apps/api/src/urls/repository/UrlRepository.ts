import { Result } from "@/Result";

export interface UrlRepository {
  create: (url: ShortenedUrl.Draft) => Promise<Result<ShortenedUrl, Error>>;

  findById: (
    id: number
  ) => Promise<Result<ShortenedUrl, ShortenedUrl.NotFound>>;

  getNextId: () => Promise<Result<number, Error>>;
}

export type ShortenedUrl = {
  id: number;
  url: string;
  hash: string;
  createdAt: Date;
};

export namespace ShortenedUrl {
  export type Draft = Omit<ShortenedUrl, "createdAt">;
  export class NotFound {
    tag: "UrlNotFound" = "UrlNotFound";
  }
}
