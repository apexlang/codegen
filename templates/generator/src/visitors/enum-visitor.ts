import { Context, Enum } from "../../deps/@apexlang/core/model/mod.ts";
import { convertDescription } from "../utils/conversions.ts";

import { SourceGenerator } from "./base.ts";

/**
 * Apex enums come from syntax like this:
 *
 * ```apexlang
 * enum TrafficLight {
 *  red = 0 as "Red"
 *  yellow = 2 as "Yellow"
 *  green = 3 as "Green"
 * }
 * ```
 *
 * View a sample model here:
 * https://apexlang.github.io/ast-viewer/#CmVudW0gVHJhZmZpY0xpZ2h0IHsKCXJlZCA9IDAgYXMgIlJlZCIKICAgIHllbGxvdyA9IDIgYXMgIlllbGxvdyIKICAgIGdyZWVuID0gMyBhcyAiR3JlZW4iCn0K
 */
export class EnumVisitor extends SourceGenerator<Enum> {
  constructor(context: Context) {
    super(context.enum, context);
  }

  override buffer(): string {
    // The name of the Enum from the Apex schema.
    const _name = this.node.name;

    // Get the buffered output. Your visitor operations write
    // to this buffer when they call `.write()`.
    const _innerSource = this.writer.string();

    // A comment generated from the description.
    const _comment = convertDescription(this.node.description);

    // Combine the above to create and return new output here.
    return ``;
  }

  override visitEnumValue(context: Context): void {
    const { enumValue } = context;

    // The name of the EnumValue variant.
    const _name = enumValue.name;

    // The display value for the Enum (if defined).
    const _display = enumValue.display;

    // The index of the Enum (if defined).
    const _index = enumValue.index;

    // A comment generated from the description.
    const _comment = convertDescription(this.node.description);

    // Append to the buffer in `this.writer`. Get the buffer's
    // state by calling `this.writer.string()`.
    this.write(``);
  }
}
