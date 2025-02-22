import type { Context, Union } from "@apexlang/core/model";
import { convertDescription } from "../utils/conversions.ts";
import { convertType } from "../utils/types.ts";

import { SourceGenerator } from "./base.ts";

/**
 * Apex type definitions come from syntax like this:
 *
 * ```apexlang
 * union Animal = Dog | Cat
 * ```
 *
 * View a sample model here:
 * https://apexlang.github.io/ast-viewer/#dW5pb24gQW5pbWFsID0gRG9nIHwgQ2F0
 */
export class UnionVisitor extends SourceGenerator<Union> {
  constructor(context: Context) {
    super(context.union, context);
  }

  override buffer(): string {
    // Iterate over each type in the Union and convert it
    // with `convertType()`
    const _types = this.node.members.map((t) => {
      return convertType(t, this.config);
    });

    // A comment generated from the description.
    const _comment = convertDescription(this.node.description);

    // The name of the Union as defined in the Apex schema.
    const _name = this.node.name;

    // Combine the above to create and return new output.
    return ``;
  }
}
