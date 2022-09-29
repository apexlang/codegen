import { parse } from "./parse.js";
import { DefaultVisitor } from "../src/default-visitor.js";
import { Writer } from "@apexlang/core/model";

describe("default visitor", () => {
  test("should generate apex from apex", () => {
    // Define some test apex to parse.
    const apex = `
    namespace "test"

    interface TestInterface {
      op1(arg1: string, arg2: bool): CustomType
    }

    type CustomType {
      date: datetime
    }
    `;

    // Parse apex above and generate a Context.
    const context = parse(apex);

    // Instantiate DefaultVisitor with a new Writer (string buffer).
    const visitor = new DefaultVisitor(new Writer());

    // Pass our visitor to the context.
    context.accept(context, visitor);

    // Retrieve our generated source.
    const source = visitor.writer.string();

    // Parse our newly generated apex
    const newContext = parse(source);

    // This section converts the context JSON to skip comparing the source locations
    // which may be understandably different in our generated soure.
    const skipLocations = (k: string, v: any) => (k === "loc" ? undefined : v);
    const expected = JSON.stringify(context, skipLocations);
    const actual = JSON.stringify(newContext, skipLocations);

    // Assert that the actual JSON is equal to the expected JSON.
    expect(actual).toEqual(expected);
  });
});
