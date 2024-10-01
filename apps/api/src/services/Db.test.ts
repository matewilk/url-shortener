import { test, describe, expect, beforeAll, vi } from "vitest";

import { dbService, InMemoryDb, InMemoryBase62Db } from "./Db";

describe("DbService", () => {
  test("create", async () => {
    const result = await dbService.create("url");
    expect(result).toBe("url");
  });

  test("get", async () => {
    const result = await dbService.get("hash");
    expect(result).toBe("hash");
  });
});

describe("InMemoryDb", () => {
  let db: InMemoryDb;
  beforeAll(() => {
    db = new InMemoryDb();
  });

  test("create", async () => {
    const result = await db.create("Hello World");
    expect(result).toBe("SGVsbG8gV29ybGQ=");
  });

  test("get", async () => {
    const result = await db.get("SGVsbG8gV29ybGQ=");
    expect(result).toBe("Hello World");
  });
});

import { Hash } from "./hash";

const base62Mock: Hash = {
  encode: vi.fn().mockReturnValue("hash"),
  decode: vi.fn().mockReturnValue(0),
};

describe("InMemoryBase62Db", () => {
  let db: InMemoryBase62Db;
  beforeAll(() => {
    db = new InMemoryBase62Db(base62Mock);
  });

  test("create", async () => {
    const result = await db.create("http://example.com");
    expect(result).toBe("hash");
  });

  test("get", async () => {
    const result = await db.get("hash");
    expect(result).toBe("http://example.com");
  });
});
