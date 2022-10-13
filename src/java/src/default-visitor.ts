import {BaseVisitor, Context, Visitor, Writer} from "@apexlang/core/model";
import {TypeVisitor} from "./visitors/type-visitor";

export class DefaultVisitor extends BaseVisitor {
  typeVisitor = (writer: Writer): Visitor => new TypeVisitor(writer);

  visitType(context: Context) {
    const visitor = this.typeVisitor(this.writer);
    context.type.accept(context, visitor);
  }
}