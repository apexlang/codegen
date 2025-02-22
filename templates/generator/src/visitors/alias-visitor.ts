import { Alias, Context } from "../../deps/@apexlang/core/model/mod.ts";
import { convertDescription } from "../utils/conversions.ts";
import { convertType } from "../utils/types.ts";

import { SourceGenerator } from "./base.ts";

/**
 * Apex aliases come from syntax like this:
 *
 * ```apexlang
 *
 * alias MyType = string
 *
 * ```
 *
 * View the model here: https://apexlang.github.io/ast-viewer/#CmFsaWFzIE15VHlwZSA9IHN0cmluZwo=
 */
export class AliasVisitor extends SourceGenerator<Alias> {
  constructor(context: Context) {
    super(context.alias, context);
  }

  override buffer(): string {
    // The name of the Alias from the Apex schema.
    const _name = this.node.name;

    // A comment generated from the description.
    const _comment = convertDescription(this.node.description);

    const _type = convertType(this.node.type, this.context.config);

    // Combine the above to create and return new output here.
    return ``;
  }
}
