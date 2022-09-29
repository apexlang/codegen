import { Context, Interface, ObjectMap, Operation } from "@apexlang/core/model";
import { generateComment } from "../utils/index.js";

import { expandType } from "../utils/types.js";
import { SourceGenerator } from "./base.js";

export class InterfaceVisitor extends SourceGenerator<Interface> {
  config: ObjectMap;

  constructor(iface: Interface, context: Context) {
    super(iface, context);
    this.config = context.config;
  }

  getSource(): string {
    return `
    ${generateComment(this.root.description)}
    interface ${this.root.name} {${this.source}}\n`;
  }

  visitOperation(context: Context): void {
    this.append(genOperation(context.operation, false, this.config));
  }
}

export function genOperation(
  op: Operation,
  global: boolean,
  config: ObjectMap
): string {
  const typeString = expandType(op.type, config);
  const args = op.parameters
    .map((arg) => {
      return `${arg.name}: ${expandType(arg.type, config)}`;
    })
    .join(",");

  // If this is a root-level operation, prefix it with 'func'
  const prefix = global ? "func" : "";

  return `
    ${generateComment(op.description)}
    ${prefix} ${op.name}(${args}): ${typeString}
    `;
}
