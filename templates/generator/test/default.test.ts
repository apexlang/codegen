import { parse } from "./parse.ts";
import { DefaultVisitor } from "../src/default-visitor.ts";
import { Writer } from "../deps/@apexlang/core/model/mod.ts";
import { assert } from "../deps/@std/assert/mod.ts";

Deno.test("should generate apex from apex", () => {
  // Define test apex we can parse.
  const apex = `
    namespace "test"

    interface TestInterface {
      op1(arg1: string, arg2: bool): CustomType
    }

    type CustomType {
      date: datetime
    }

    type OtherType {
      message: string
    }
    `;

  // Parse apex above and generate a Context.
  const context = parse(apex);

  // Instantiate DefaultVisitor with a new Writer (string buffer).
  const visitor = new DefaultVisitor(new Writer());

  // Pass our visitor to the context.
  context.accept(context, visitor);

  // Retrieve our generated source.
  const generated = visitor.writer.string();

  // Assert that our generated output equals what we expect.
  assert(generated === `something!`);
});
