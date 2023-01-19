import {
  Context,
  Interface,
} from "https://deno.land/x/apex_core@v0.1.2/model/mod.ts";
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

  buffer(): string {
    // The name of the Interface from the Apex schema.
    const name = this.node.name;

    // Get the buffered output. Your visitor operations write
    // to this buffer when they call `.write()`.
    const innerSource = this.writer.string();

    // A comment generated from the description.
    const comment = convertDescription(this.node.description);

    // Combine the above to create and return new output here.
    return ``;
  }

  visitOperation(context: Context): void {
    const { operation } = context;

    // Generate new output from `convertOperation()` below.
    const converted = convertOperation(operation, false, this.config);

    // Append to the buffer in `this.writer`. Get the buffer's
    // state by calling `this.writer.string()`.
    this.write(``);
  }
}
