import { BaseVisitor, Context } from "@apexlang/core/model";
import { Visitor, Writer } from "@apexlang/core/dist/model";
import { InterfacesVisitor } from "./interfaces_visitor";
import { MinimalAPIVisitor } from "./api_visitor";
import { ScaffoldVisitor } from "./scaffold_visitor";
import { Main_visitor } from "./main_visitor";
import { TypeVisitor } from "./types_visitor";

export class index_visitor extends BaseVisitor {
  apiVisitor = (writer: Writer): Visitor => new MinimalAPIVisitor(writer);
  scaffoldVisitor = (writer: Writer): Visitor => new ScaffoldVisitor(writer);
  interfacesVisitor = (writer: Writer): Visitor =>
    new InterfacesVisitor(writer);
  main_visitor = (writer: Writer): Visitor => new Main_visitor(writer);
  typeVisitor = (writer: Writer): Visitor => new TypeVisitor(writer);

  visitNamespaceBefore(context: Context) {
    const visitor = this.apiVisitor(this.writer);
    context.namespace.accept(context, visitor);
    this.write(`\n`);
    super.visitNamespaceBefore(context);
  }

  visitNamespace(context: Context) {
    const visitor = this.scaffoldVisitor(this.writer);
    context.namespace.accept(context, visitor);
    this.write(`\n`);
    super.visitNamespace(context);
  }

  visitInterface(context: Context) {
    const visitor = this.interfacesVisitor(this.writer);
    context.interface.accept(context, visitor);
    this.write(`\n`);
    super.visitInterface(context);
  }

  visitNamespaceAfter(context: Context) {
    const visitor = this.main_visitor(this.writer);
    context.namespace.accept(context, visitor);
    this.write(`\n`);
    super.visitNamespaceBefore(context);
  }

  visitType(context: Context) {
    const visitor = this.typeVisitor(this.writer);
    context.type.accept(context, visitor);
    super.visitType(context);
  }
}
