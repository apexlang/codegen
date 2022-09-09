import { Context, Interface, ObjectMap, Operation } from "@apexlang/core/model";
import { rustDoc, rustify, rustifyCaps, trimLines } from "../utils";
import { visibility } from "../utils/config";
import { apexToRustType } from "../utils/types";
import { SourceGenerator } from "./base";

export class InterfaceVisitor extends SourceGenerator<Interface> {
  config: ObjectMap<any>;
  visibility: visibility;

  constructor(context: Context) {
    super(context.interface, context);
    this.config = context.config;
    this.visibility = visibility(this.root.name, this.config);
  }

  getSource(): string {
    return `${trimLines([rustDoc(this.root.description)])}
    ${this.visibility} trait ${rustifyCaps(this.root.name)} {${this.source}}\n`;
  }

  visitOperation(context: Context): void {
    this.append(genOperation(context.operation, this.visibility));
  }
}

export function genOperation(op: Operation, vis: visibility): string {
  const typeString = apexToRustType(op.type);
  let args = op.parameters
    .map((arg) => {
      return `${rustify(arg.name)}: ${apexToRustType(arg.type)}`;
    })
    .join(",");

  return `${trimLines([rustDoc(op.description)])}
    fn ${rustify(op.name)}(${args}) -> ${typeString};
    `;
}
