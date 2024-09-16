import { test, describe, expect } from "vitest";

import { dbService } from "./Db";

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
