import { Context, Writer } from "@apexlang/core/model";
import { NamespaceWriter } from "./visitors/base";
import { StructVisitor } from "./visitors/struct_visitor";
import { InterfaceVisitor } from "./visitors/interface_visitor";
import { EnumVisitor } from "./visitors/enum_visitor";
import { UnionVisitor } from "./visitors/union_visitor";
import { rustifyCaps } from "./utils";
import { apexToRustType } from "./utils/types";

export class RustBasic extends NamespaceWriter {
  constructor(writer: Writer) {
    super(writer);
  }

  visitType(context: Context): void {
    this.append(new StructVisitor(context).toString());
  }

  visitRole(context: Context): void {
    this.append(new InterfaceVisitor(context).toString());
  }

  visitEnum(context: Context): void {
    this.append(new EnumVisitor(context).toString());
  }

  visitUnion(context: Context): void {
    this.append(new UnionVisitor(context).toString());
  }

  visitAlias(context: Context): void {
    const { alias } = context;
    this.append(
      `pub type ${rustifyCaps(alias.name)} = ${rustifyCaps(
        apexToRustType(alias.type)
      )}`
    );
  }
}
