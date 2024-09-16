export interface DbServiceType {
  create: (url: string) => Promise<string>;
  get: (hash: string) => Promise<string>;
}

export const dbService: DbServiceType = {
  create: async (url: string) => url,
  get: async (hash: string) => hash,
};
