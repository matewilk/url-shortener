type RecordVals = string | number | boolean;

type BaseRecord = { id: number };

export type DbRecord = BaseRecord & Record<string, RecordVals>;

interface Operations<T extends BaseRecord> {
  create: (data: Omit<T, "id">) => Promise<T>;
  findUnique: (data: Pick<T, "id">) => Promise<T | undefined>;
}

export interface Db {
  [entity: string]: Operations<DbRecord>;
}

interface Store<T extends BaseRecord> {
  [id: number]: T;
}

class Repository<T extends BaseRecord> implements Operations<T> {
  private store: Store<T> = {};
  private nextId = 1;

  async create(data: Omit<T, "id">): Promise<T> {
    const record = { ...data, id: this.nextId++ } as T;
    this.store[record.id] = record;

    return record;
  }

  async findUnique(data: Pick<T, "id">): Promise<T | undefined> {
    return this.store[data.id];
  }
}

export class InMemoryDb implements Db {
  [entity: string]: Operations<DbRecord>;

  constructor(entities: string[]) {
    entities.forEach((entity) => {
      this[entity] = new Repository<DbRecord>();
    });
  }
}
