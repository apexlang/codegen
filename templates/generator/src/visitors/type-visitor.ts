import { Context, Type } from "../../deps/@apexlang/core/model/mod.ts";
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

  override buffer(): string {
    // This is the Type name from the input Apex schema.
    const _name = this.node.name;

    // This is a comment generated from the description in Apex.
    const _comment = convertDescription(this.node.description);

    // Get the buffered output. Your visitor operations write
    // to this buffer when they call `.write()`.
    const _innerSource = this.writer.string();

    // Combine the above to create and return new source.
    return ``;
  }

  override visitTypeField(context: Context): void {
    const { field } = context;

    // The name of the TypeField from the Apex schema.
    const _name = field.name;

    // The type of the field, converted from Apex type with `convertType()`.
    const _convertedType = convertType(field.type, context.config);

    // A comment generated from the description.
    const _comment = convertDescription(field.description);

    // Append to the buffer in `this.writer`. Get the buffer's
    // state by calling `this.writer.string()`.
    this.write(``);
  }
}
