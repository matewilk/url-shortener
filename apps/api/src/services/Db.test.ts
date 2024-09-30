import { test, describe, expect, beforeAll } from "vitest";

import { dbService, InMemoryDb } from "./Db";

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
