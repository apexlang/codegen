import { Context, Enum, ObjectMap } from "@apexlang/core/model";
import { generateComment } from "../utils/index.js";

import { SourceGenerator } from "./base.js";

export class EnumVisitor extends SourceGenerator<Enum> {
  hasDisplayValues = false;
  hasIndices = false;
  config: ObjectMap;

  constructor(e: Enum, context: Context) {
    super(e, context);
    this.config = context.config;
  }

  getSource(): string {
    return `
    ${generateComment(this.root.description)}
    enum ${this.root.name}{
      ${this.source}
    }
    `;
  }

  visitEnumValue(context: Context): void {
    const { enumValue } = context;
    const display =
      enumValue.display === undefined ? "" : ` as ${enumValue.display}`;
    const index = enumValue.index === undefined ? "" : ` = ${enumValue.index}`;

    this.append(
      `
      ${generateComment(enumValue.description)}
      ${enumValue.name} ${index} ${display}`.trim()
    );
  }
}
