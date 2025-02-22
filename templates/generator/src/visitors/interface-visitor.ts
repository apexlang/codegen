import { Context, Interface } from "../../deps/@apexlang/core/model/mod.ts";
import { convertDescription, convertOperation } from "../utils/conversions.ts";

import { SourceGenerator } from "./base.ts";

/**
 * Apex interfaces come from syntax like this:
 *
 * ```apexlang
 * interface RetailStore {
 *   order(item:u32): u32
 * }
 * ```
 *
 * View a sample model here:
 * https://apexlang.github.io/ast-viewer/#aW50ZXJmYWNlIFJldGFpbFN0b3JlIHsKICBvcmRlcihpdGVtOnUzMik6IHUzMgp9Cgo=
 */
export class InterfaceVisitor extends SourceGenerator<Interface> {
  constructor(context: Context) {
    super(context.interface, context);
  }

  override buffer(): string {
    // The name of the Interface from the Apex schema.
    const _name = this.node.name;

    // Get the buffered output. Your visitor operations write
    // to this buffer when they call `.write()`.
    const _innerSource = this.writer.string();

    // A comment generated from the description.
    const _comment = convertDescription(this.node.description);

    // Combine the above to create and return new output here.
    return ``;
  }

  override visitOperation(context: Context): void {
    const { operation } = context;

    // Generate new output from `convertOperation()` below.
    const _converted = convertOperation(operation, false, this.config);

    // Append to the buffer in `this.writer`. Get the buffer's
    // state by calling `this.writer.string()`.
    this.write(``);
  }
}
