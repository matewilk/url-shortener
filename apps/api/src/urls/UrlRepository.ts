export interface UrlRepository {
  // TODO: Think about unhappy paths
  create: (url: ShortenedUrl.Draft) => Promise<ShortenedUrl>;

  findById: (id: number) => Promise<ShortenedUrl | undefined>;

  getNextId: () => Promise<number>;
}

export type ShortenedUrl = {
  id: number;
  longUrl: string;
  hash: string;
  createdAt: Date;
};

export namespace ShortenedUrl {
  export type Draft = Omit<ShortenedUrl, "createdAt">;
}
