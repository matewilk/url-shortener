import { test, describe, expect, beforeAll } from "vitest";
import fc from "fast-check";

import { InMemoryDb, Db } from "./Db";

describe("InMemoryDb", () => {
  let db: Db;
  beforeAll(() => {
    db = new InMemoryDb(["url"]);
  });

  test("creates and finds records", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          url: fc.webUrl(),
        }),
        async (data) => {
          const created = await db.url.create(data);
          const found = await db.url.findUnique({ id: created.id });

          expect(created).toStrictEqual(found);
        }
      )
    );
  });

  test("manually creates and finds a record with minimal data", async () => {
    const record = { url: "http://a.aa" };
    const created = await db.url.create(record);
    const found = await db.url.findUnique({ id: created.id });

    expect(created).toStrictEqual(found);
  });
});
