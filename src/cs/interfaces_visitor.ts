import { BaseVisitor, Context, Visitor, Writer } from "@apexlang/core/model";
import { TypeVisitor } from "./types_visitor";
import { InterfaceVisitor } from "./interface_visitor";
import { parseNamespaceName } from "./helpers";
import { EnumVisitor } from "./enum_visitor";
import { UnionVisitor } from "./union_visitor";
import { AliasVisitor } from "./alias_visitor";

export class InterfacesVisitor extends BaseVisitor {
  typeVisitor = (writer: Writer): Visitor => new TypeVisitor(writer);
  interfaceVisitor = (writer: Writer): Visitor => new InterfaceVisitor(writer);
  enumVisitor = (writer: Writer): Visitor => new EnumVisitor(writer);
  unionVisitor = (writer: Writer): Visitor => new UnionVisitor(writer);
  aliasVisitor = (writer: Writer): Visitor => new AliasVisitor(writer);

  visitNamespaceBefore(context: Context) {
    this.write(`// Code generated by @apexlang/codegen. DO NOT EDIT.\n\n`);
    super.visitNamespaceBefore(context);
  }

  visitNamespace(context: Context) {
    this.write(`namespace ${parseNamespaceName(context.namespace.name)} {\n`);
    super.visitNamespace(context);
  }

  visitNamespaceAfter(context: Context) {
    this.write(`}\n`);
    super.visitNamespaceAfter(context);
  }

  visitInterface(context: Context) {
    const visitor = this.interfaceVisitor(this.writer);
    context.interface.accept(context, visitor);
  }

  visitUnion(context: Context) {
    const visitor = this.unionVisitor(this.writer);
    context.union.accept(context, visitor);
  }

  visitAlias(context: Context) {
    const visitor = this.aliasVisitor(this.writer);
    context.alias.accept(context, visitor);
  }

  visitEnum(context: Context): void {
    const visitor = this.enumVisitor(this.writer);
    context.enum.accept(context, visitor);
  }

  visitType(context: Context) {
    const visitor = this.typeVisitor(this.writer);
    context.type.accept(context, visitor);
  }
}
