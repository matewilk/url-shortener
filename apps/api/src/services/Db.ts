export interface DbServiceType {
  create: (url: string) => Promise<string>;
  get: (hash: string) => Promise<string>;
}

export const dbService: DbServiceType = {
  create: async (url: string) => url,
  get: async (hash: string) => hash,
};

export class InMemoryDb implements DbServiceType {
  store: Record<string, string> = {};

  hash = (url: string) => Buffer.from(url).toString("base64");

  create = async (url: string) => {
    const hash = this.hash(url);
    this.store[hash] = url;
    return hash;
  };

  get = async (hash: string) => {
    return this.store[hash] || "";
  };
}
