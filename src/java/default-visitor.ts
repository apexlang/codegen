import { BaseVisitor, Context, Visitor, Writer } from "@apexlang/core/model";
import {
  AliasVisitor,
  EnumVisitor,
  ImportVisitor,
  InterfaceVisitor,
  TypeVisitor,
  UnionVisitor,
} from "./visitors";

export class DefaultVisitor extends BaseVisitor {
  importVisitor = (writer: Writer): Visitor => new ImportVisitor(writer);
  typeVisitor = (writer: Writer): Visitor => new TypeVisitor(writer);
  interfaceVisitor = (writer: Writer): Visitor => new InterfaceVisitor(writer);
  enumVisitor = (writer: Writer): Visitor => new EnumVisitor(writer);
  aliasVisitor = (writer: Writer): Visitor => new AliasVisitor(writer);
  unionVisitor = (writer: Writer): Visitor => new UnionVisitor(writer);

  visitNamespace(context: Context) {
    const visitor = this.importVisitor(this.writer);
    context.namespace.accept(context, visitor);
  }

  visitType(context: Context) {
    const visitor = this.typeVisitor(this.writer);
    context.type.accept(context, visitor);
  }

  visitInterface(context: Context) {
    const visitor = this.interfaceVisitor(this.writer);
    context.interface.accept(context, visitor);
  }

  visitEnum(context: Context) {
    const visitor = this.enumVisitor(this.writer);
    context.enum.accept(context, visitor);
  }

  visitAlias(context: Context) {
    const visitor = this.aliasVisitor(this.writer);
    context.alias.accept(context, visitor);
  }

  visitUnion(context: Context) {
    const visitor = this.unionVisitor(this.writer);
    context.union.accept(context, visitor);
  }

  visitNamespaceAfter(context: Context) {
    this.write(`\n`);
    this.write(`\n`);
    this.write(`public static void main(String[] args) {`);
    this.write(`\n`);
    this.write(`\t System.out.println("Welcome to JAVA. Happy Coding :)");`);
    this.write(`\n`);
    this.write(`\t }`);
    this.write(`\n`);
    this.write(`}`);
    super.visitNamespaceAfter(context);
  }
}
