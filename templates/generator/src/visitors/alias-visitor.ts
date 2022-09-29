import { Alias, Context, ObjectMap } from "@apexlang/core/model";
import { expandType } from "../utils/types.js";

import { SourceGenerator } from "./base.js";

export class AliasVisitor extends SourceGenerator<Alias> {
  config: ObjectMap;

  constructor(u: Alias, context: Context) {
    super(u, context);
    this.config = context.config;
  }

  getSource(): string {
    const alias = this.root;
    const config = this.context.config;

    return `

        alias ${alias.name} = ${expandType(alias.type, config)}\n`;
  }
}
