import { isRecursiveType } from "../../src/utils/utilities";
import { getTypes, parse } from "../parse";

describe("types", () => {
  test("should identify recursive types", () => {
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
    expect(isRecursiveType(parent)).toBeTruthy();
  });
  test("should not identify non-recursive types", () => {
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
    expect(isRecursiveType(parent)).toBeFalsy();
  });
});
