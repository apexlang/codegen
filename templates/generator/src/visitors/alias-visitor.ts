import {
  Alias,
  Context,
} from "https://deno.land/x/apex_core@v0.1.5/model/mod.ts";
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

  buffer(): string {
    // The name of the Alias from the Apex schema.
    const name = this.node.name;

    // A comment generated from the description.
    const comment = convertDescription(this.node.description);

    const type = convertType(this.node.type, this.context.config);

    // Combine the above to create and return new output here.
    return ``;
  }
}
