import { describe, test, expect, beforeAll } from "vitest";
import fc from "fast-check";

import { Hash, Base62 } from "./Hash";

describe("Base62", () => {
  let hash: Hash;

  beforeAll(() => {
    hash = new Base62();
  });

  test("should endoce and decode to the same positive number", () => {
    fc.assert(
      fc.property(fc.integer({ min: 0 }), (num) => {
        const encoded = hash.encode(num);
        const decoded = hash.decode(encoded);

        expect(decoded).toBe(num);
      })
    );
  });
});
