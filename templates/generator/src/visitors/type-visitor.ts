import {
  Context,
  Type,
} from "https://deno.land/x/apex_core@v0.1.5/model/mod.ts";
import { convertDescription } from "../utils/conversions.ts";
import { convertType } from "../utils/types.ts";
import { SourceGenerator } from "./base.ts";

/**
 * Apex type definitions come from syntax like this:
 *
 * ```apexlang
 * type Person {
 *   name: string
 *   age: u8
 * }
 * ```
 *
 * View a sample model here:
 * https://apexlang.github.io/ast-viewer/#dHlwZSBQZXJzb24gewogIG5hbWU6IHN0cmluZwogIGFnZTogdTgKfQ==
 */
export class TypeVisitor extends SourceGenerator<Type> {
  constructor(context: Context) {
    super(context.type, context);
  }

  buffer(): string {
    // This is the Type name from the input Apex schema.
    const name = this.node.name;

    // This is a comment generated from the description in Apex.
    const comment = convertDescription(this.node.description);

    // Get the buffered output. Your visitor operations write
    // to this buffer when they call `.write()`.
    const innerSource = this.writer.string();

    // Combine the above to create and return new source.
    return ``;
  }

  visitTypeField(context: Context): void {
    const { field } = context;

    // The name of the TypeField from the Apex schema.
    const name = field.name;

    // The type of the field, converted from Apex type with `convertType()`.
    const convertedType = convertType(field.type, context.config);

    // A comment generated from the description.
    const comment = convertDescription(field.description);

    // Append to the buffer in `this.writer`. Get the buffer's
    // state by calling `this.writer.string()`.
    this.write(``);
  }
}
