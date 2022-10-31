import { BaseVisitor, Context } from "@apexlang/core/model";
import { convertType } from "../utils/types";
import { camelCase } from "../../../utils";

export class UnionVisitor extends BaseVisitor {
  visitUnionsBefore(context: Context) {
    super.visitUnionsBefore(context);
  }

  visitUnion(context: Context) {
    const union = context.union;
    this.write(`public static class ${union.name} {\n`);
    this.write(`\n`);
    union.types.forEach((type) => {
      this.write(
        `\t public static ${convertType(type, context.config)} ${camelCase(
          convertType(type, context.config)
        )};\n`
      );
    });
    this.write(`\n`);
    this.write(`}\n`);
    this.write(`\n`);
    super.visitUnion(context);
  }

  visitUnionsAfter(context: Context) {
    super.visitUnionsAfter(context);
  }
}
