import {
  BaseVisitor,
  Context,
  Visitor,
  Writer,
} from "@apexlang/core/model";
import {TypeVisitor} from "./types_visitor";
import {InterfaceVisitor} from "./interface_visitor";
import {pascalCase} from "../utils";

export class InterfacesVisitor extends BaseVisitor {
  typeVisitor = (writer: Writer): Visitor => new TypeVisitor(writer);
  interfaceVisitor = (writer: Writer): Visitor => new InterfaceVisitor(writer);

  visitNamespaceBefore(context: Context) {
    this.write(`using System;`);
    this.write(`\n\n`);
    super.visitNamespaceBefore(context);
  }

  visitNamespace(context: Context) {
    this.write(`namespace ${(pascalCase(context.namespace.name))} {\n`);
    this.write(`\n`);
    super.visitNamespace(context);
  }

  visitNamespaceAfter(context: Context) {
    this.write(`}\n`);
    super.visitNamespaceAfter(context);
  }

  visitInterface(context: Context) {
    const visitor = this.interfaceVisitor(this.writer);
    context.interface.accept(context,visitor)
  }

  visitType(context: Context) {
    const visitor = this.typeVisitor(this.writer);
    context.type.accept(context, visitor);
  }
}
