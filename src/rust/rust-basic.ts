import { Context, Writer } from "@apexlang/core/model";
import { ContextWriter } from "./visitors/base.js";
import { StructVisitor } from "./visitors/struct_visitor.js";
import {
  genOperation,
  InterfaceVisitor,
} from "./visitors/interface_visitor.js";
import { EnumVisitor } from "./visitors/enum_visitor.js";
import { UnionVisitor } from "./visitors/union_visitor.js";
import { rustifyCaps, types } from "./utils/index.js";
import { visibility } from "./utils/index.js";

export class RustBasic extends ContextWriter {
  constructor(writer: Writer) {
    super(writer);
  }

  visitType(context: Context): void {
    this.append(new StructVisitor(context.type, context).toString());
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
    const vis = visibility(context.operation.name, context.config);
    this.append(genOperation(context.operation, vis, context.config));
  }

  visitAlias(context: Context): void {
    const { alias } = context;
    this.append(
      `pub type ${rustifyCaps(alias.name)} = ${rustifyCaps(
        types.apexToRustType(alias.type, context.config)
      )};\n`
    );
  }
}
