import { assert, assertEquals } from "../../deps/@std/assert/mod.ts";
import {
  importModule,
  importPlugin,
  isRecursiveType,
} from "../../src/utils/utilities.ts";
import { getTypes, parse } from "../parse.ts";

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
  const [parent, _child] = getTypes(model, ["Parent"]);
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
  const [parent, _child] = getTypes(model, ["Parent"]);
  assert(!isRecursiveType(parent));
});

Deno.test("should import codegen modules", () => {
  assertEquals(
    importModule(
      "file:///Users/test/src/@apexlang/codegen/src/go/mod.ts",
      "typescript",
    ),
    "file:///Users/test/src/@apexlang/codegen/src/typescript/mod.ts",
  );
  assertEquals(
    importModule(
      "file:///Users/test/src/@apexlang/codegen/templates/go/mod.ts",
      "typescript",
    ),
    "file:///Users/test/src/@apexlang/codegen/src/typescript/mod.ts",
  );
  ////
  assertEquals(
    importModule(
      "https://github.com/raw/@apexlang/codegen/src/go/mod.ts",
      "typescript",
    ),
    "https://github.com/raw/@apexlang/codegen/src/typescript/mod.ts",
  );
  assertEquals(
    importModule(
      "https://github.com/raw/@apexlang/codegen/templates/go/mod.ts",
      "typescript",
    ),
    "https://github.com/raw/@apexlang/codegen/src/typescript/mod.ts",
  );
  ////
  assertEquals(
    importModule(
      "https://jsr.io/@apexlang/codegen/0.1.2/go/mod.ts",
      "typescript",
    ),
    "jsr:@apexlang/codegen@0.1.2/typescript",
  );
  assertEquals(
    importModule(
      "https://jsr.io/@apexlang/codegen/0.1.2/templates/go/mod.ts",
      "typescript",
    ),
    "jsr:@apexlang/codegen@0.1.2/typescript",
  );
});

Deno.test("should import plugins", () => {
  assertEquals(
    importPlugin(
      "file:///Users/test/src/@apexlang/codegen/src/go/mod.ts",
      "typescript",
    ),
    "file:///Users/test/src/@apexlang/codegen/src/typescript/plugin.ts",
  );
  assertEquals(
    importPlugin(
      "file:///Users/test/src/@apexlang/codegen/templates/go/mod.ts",
      "typescript",
    ),
    "file:///Users/test/src/@apexlang/codegen/src/typescript/plugin.ts",
  );
  ////
  assertEquals(
    importPlugin(
      "https://github.com/raw/@apexlang/codegen/src/go/mod.ts",
      "typescript",
    ),
    "https://github.com/raw/@apexlang/codegen/src/typescript/plugin.ts",
  );
  assertEquals(
    importPlugin(
      "https://github.com/raw/@apexlang/codegen/templates/go/mod.ts",
      "typescript",
    ),
    "https://github.com/raw/@apexlang/codegen/src/typescript/plugin.ts",
  );
  ////
  assertEquals(
    importPlugin(
      "https://jsr.io/@apexlang/codegen/0.1.2/go/mod.ts",
      "typescript",
    ),
    "jsr:@apexlang/codegen@0.1.2/plugins/typescript",
  );
  assertEquals(
    importPlugin(
      "https://jsr.io/@apexlang/codegen/0.1.2/templates/go/mod.ts",
      "typescript",
    ),
    "jsr:@apexlang/codegen@0.1.2/plugins/typescript",
  );
});
