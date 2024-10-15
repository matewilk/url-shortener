export interface UrlRepository {
  // TODO: Think about unhappy paths
  create: (url: ShortenedUrl.Draft) => Promise<Result<ShortenedUrl, Error>>;

  findById: (id: number) => Promise<Result<ShortenedUrl | undefined, Error>>;

  getNextId: () => Promise<Result<number, Error>>;
}

export type Result<T, E> = Ok<T> | Err<E>;

export type Ok<T> = {
  kind: "success";
  value: T;
};

export type Err<E> = {
  kind: "error";
  error: E;
};

export type ShortenedUrl = {
  id: number;
  url: string;
  hash: string;
  createdAt: Date;
};

export namespace ShortenedUrl {
  export type Draft = Omit<ShortenedUrl, "createdAt">;
}
