import { Context, ObjectMap, Type } from "@apexlang/core/model";
import { generateComment } from "../utils/index.js";
import { expandType } from "../utils/types.js";

import { SourceGenerator } from "./base.js";

export class TypeVisitor extends SourceGenerator<Type> {
  config: ObjectMap;

  constructor(type: Type, context: Context) {
    super(type, context);
    this.config = context.config;
  }

  getSource(): string {
    return `
    ${generateComment(this.root.description)}
    type ${this.root.name}{
      ${this.source}
    }`;
  }

  visitTypeField(context: Context): void {
    const { field } = context;
    const typeString = expandType(field.type, context.config);

    this.append(
      `${generateComment(field.description)}
      ${field.name}: ${typeString}\n
      `
    );
  }
}
