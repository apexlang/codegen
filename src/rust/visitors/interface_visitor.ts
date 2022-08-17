import { Context, ObjectMap, Role } from "@apexlang/core/model";
import { rustDoc, rustify, rustifyCaps, trimLines } from "../utils";
import { apexToRustType } from "../utils/types";
import { SourceGenerator } from "./base";

export class InterfaceVisitor extends SourceGenerator<Role> {
  config: ObjectMap<any>;

  constructor(context: Context) {
    super(context.role, context);
    this.config = context.config;
  }

  getSource(): string {
    return `${trimLines([rustDoc(this.root.description)])}
    pub trait ${rustifyCaps(this.root.name)} {${this.source}}\n`;
  }

  visitOperation(context: Context): void {
    const { operation } = context;
    const typeString = apexToRustType(operation.type);
    let args = operation.parameters
      .map((arg) => {
        return `${rustify(arg.name)}: ${apexToRustType(arg.type)}`;
      })
      .join(",");

    this.append(
      `${trimLines([rustDoc(operation.description)])}
      fn ${rustify(operation.name)}(${args}) -> ${typeString};
      `
    );
  }
}
