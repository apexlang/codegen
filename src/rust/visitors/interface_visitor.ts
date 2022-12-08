// deno-lint-ignore-file no-explicit-any
import {
  Context,
  Interface,
  ObjectMap,
  Operation,
} from "https://deno.land/x/apex_core@v0.1.0/model/mod.ts";
import {
  customAttributes,
  rustDoc,
  rustify,
  rustifyCaps,
  trimLines,
  visibility,
} from "../utils/mod.ts";

import { apexToRustType } from "../utils/types.ts";
import { SourceGenerator } from "./base.ts";

export class InterfaceVisitor extends SourceGenerator<Interface> {
  config: ObjectMap<any>;
  visibility: visibility;

  constructor(iface: Interface, context: Context) {
    super(iface, context);
    this.config = context.config;
    this.visibility = visibility(this.root.name, this.config);
  }

  getSource(): string {
    const prefix = trimLines([
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
  _vis: visibility,
  config: ObjectMap<any>,
): string {
  const typeString = apexToRustType(op.type, config);
  const args = op.parameters
    .map((arg) => {
      return `${rustify(arg.name)}: ${apexToRustType(arg.type, config)}`;
    })
    .join(",");

  return `${trimLines([rustDoc(op.description)])}
    fn ${rustify(op.name)}(${args}) -> ${typeString};
    `;
}
