import { BaseVisitor, Context } from "@apexlang/core/model";
export declare class DefaultVisitor extends BaseVisitor {
    visitContextBefore(context: Context): void;
    visitContextAfter(context: Context): void;
    visitNamespace(context: Context): void;
    visitType(context: Context): void;
    visitInterface(context: Context): void;
    visitEnum(context: Context): void;
    visitUnion(context: Context): void;
    visitFunction(context: Context): void;
    visitAlias(context: Context): void;
}
//# sourceMappingURL=default-visitor.d.ts.map