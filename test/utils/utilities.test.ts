import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { isRecursiveType } from "../../src/utils/utilities.ts";
import { getTypes, parse } from "../parse.ts";
export * from "https://deno.land/std@0.167.0/testing/asserts.ts";

Deno.test("should not identify recursive types", () => {
  const apex = `
  namespace "test"

  type Parent {
    base: Child
  }

  type Child {
    parent: Parent
  }
  `;
  const model = parse(apex);
  const [parent, child] = getTypes(model, ["Parent"]);
  assert(isRecursiveType(parent));
});

Deno.test("should not identify non-recursive types", () => {
  const apex = `
  namespace "test"

  type Parent {
    base: Child
  }

  type Child {
    other: string
  }
  `;
  const model = parse(apex);
  const [parent, child] = getTypes(model, ["Parent"]);
  assert(!isRecursiveType(parent));
});
