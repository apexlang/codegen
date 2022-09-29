import { Context, Writer } from "@apexlang/core/model";
import { ContextWriter } from "./visitors/base.js";
import { TypeVisitor } from "./visitors/type-visitor.js";
import {
  genOperation,
  InterfaceVisitor,
} from "./visitors/interface-visitor.js";
import { EnumVisitor } from "./visitors/enum-visitor.js";
import { UnionVisitor } from "./visitors/union-visitor.js";
import { AliasVisitor } from "./visitors/alias-visitor.js";

export class DefaultVisitor extends ContextWriter {
  constructor(writer: Writer) {
    super(writer);
  }

  visitContextBefore(context: Context): void {
    // Add a generated header to your source by uncommenting the following line:
    // this.append(
    //   utils.generatedHeader(
    //     context.config.generatedHeader || [
    //       "THIS FILE IS GENERATED, DO NOT EDIT",
    //       "",
    //       `See https://apexlang.io for more information`,
    //     ]
    //   )
    // );

    // This checks if there is a "header" option in the configuration
    // and adds it to the generated source. Useful for license or contact
    // information.
    if (context.config.header) {
      if (Array.isArray(context.config.header)) {
        this.append(context.config.header.join("\n"));
      } else {
        this.append(context.config.header);
      }
    }
  }

  visitNamespace(context: Context): void {
    const namespace = context.namespace;
    this.append(`namespace "${namespace.name}"`);
  }

  visitType(context: Context): void {
    this.append(new TypeVisitor(context.type, context).toString());
  }

  visitInterface(context: Context): void {
    this.append(new InterfaceVisitor(context.interface, context).toString());
  }

  visitEnum(context: Context): void {
    this.append(new EnumVisitor(context.enum, context).toString());
  }

  visitUnion(context: Context): void {
    this.append(new UnionVisitor(context.union, context).toString());
  }

  visitFunction(context: Context): void {
    this.append(genOperation(context.operation, true, context.config));
  }

  visitAlias(context: Context): void {
    this.append(new AliasVisitor(context.alias, context).toString());
  }
}
