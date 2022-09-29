import { Context, ObjectMap, Union } from "@apexlang/core/model";
import { generateComment } from "../utils/index.js";
import { expandType } from "../utils/types.js";

import { SourceGenerator } from "./base.js";

export class UnionVisitor extends SourceGenerator<Union> {
  config: ObjectMap;

  constructor(u: Union, context: Context) {
    super(u, context);
    this.config = context.config;
  }

  getSource(): string {
    const variants = this.root.types.map((t) => {
      return expandType(t, this.config);
    });

    return `
    ${generateComment(this.root.description)}
    union ${this.root.name} = ${variants.join("|")}
    `;
  }
}
