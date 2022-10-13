import {BaseVisitor, Context, Visitor, Writer} from "@apexlang/core/model";
import {TypeVisitor} from "./visitors/type-visitor";
import {EnumVisitor} from "./visitors";

export class DefaultVisitor extends BaseVisitor {
    typeVisitor = (writer: Writer): Visitor => new TypeVisitor(writer);
    enumVisitor = (writer: Writer): Visitor => new EnumVisitor(writer);

    visitType(context: Context) {
        const visitor = this.typeVisitor(this.writer);
        context.type.accept(context, visitor);
    }

    visitEnum(context: Context) {
        const visitor = this.enumVisitor(this.writer);
        context.enum.accept(context, visitor);
    }
}