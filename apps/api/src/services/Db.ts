export interface DbServiceType {
  create: (url: string) => Promise<string>;
  get: (hash: string) => Promise<string>;
}

export const dbService: DbServiceType = {
  create: async (url: string) => url,
  get: async (hash: string) => hash,
};

// ------ InMemoryDb Base64 -------
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

// ------ Base62 -------
import { Base62, Hash } from "./Hash";

interface DbRecord {
  id: number;
  hash: string; // this could be union of base62map string (as const)
  url: string;
}

export class InMemoryBase62Db implements DbServiceType {
  private base62: Hash;
  store: Record<number, DbRecord> = {};

  constructor(base62: Hash = new Base62()) {
    this.base62 = base62;
  }

  create = async (url: string) => {
    const id = Object.keys(this.store).length;
    const hash = this.base62.encode(id);

    this.store[id] = { id, hash, url };

    return hash;
  };

  get = async (hash: string) => {
    const id = this.base62.decode(hash);
    return this.store[id]?.url || "";
  };
}
