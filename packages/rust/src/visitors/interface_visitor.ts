import { Context, Interface, ObjectMap, Operation } from "@apexlang/core/model";
import {
  customAttributes,
  rustDoc,
  rustify,
  rustifyCaps,
  trimLines,
  visibility,
} from "../utils/index.js";

import { apexToRustType } from "../utils/types.js";
import { SourceGenerator } from "./base.js";

export class InterfaceVisitor extends SourceGenerator<Interface> {
  config: ObjectMap<any>;
  visibility: visibility;

  constructor(iface: Interface, context: Context) {
    super(iface, context);
    this.config = context.config;
    this.visibility = visibility(this.root.name, this.config);
  }

  getSource(): string {
    let prefix = trimLines([
      rustDoc(this.root.description),
      customAttributes(this.root.name, this.config),
    ]);

    return `${prefix}
    ${this.visibility} trait ${rustifyCaps(this.root.name)} {${this.source}}\n`;
  }

  visitOperation(context: Context): void {
    this.append(genOperation(context.operation, this.visibility, this.config));
  }
}

export function genOperation(
  op: Operation,
  vis: visibility,
  config: ObjectMap<any>
): string {
  const typeString = apexToRustType(op.type, config);
  let args = op.parameters
    .map((arg) => {
      return `${rustify(arg.name)}: ${apexToRustType(arg.type, config)}`;
    })
    .join(",");

  return `${trimLines([rustDoc(op.description)])}
    fn ${rustify(op.name)}(${args}) -> ${typeString};
    `;
}
