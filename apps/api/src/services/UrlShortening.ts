import { DbServiceType } from "./Db";

export interface UrlShorteningServiceType {
  shorten: (url: string) => Promise<string>;
  expand: (hash: string) => Promise<string>;
}

class UrlShorteningService<DbService extends DbServiceType>
  implements UrlShorteningServiceType
{
  constructor(private dbSerivce: DbService) {}

  async shorten(url: string): Promise<string> {
    return await this.dbSerivce.create(url);
  }

  async expand(hash: string): Promise<string> {
    return await this.dbSerivce.get(hash);
  }
}

export default UrlShorteningService;
