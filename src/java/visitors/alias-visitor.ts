import { BaseVisitor, Context } from "@apexlang/core/model";

export class AliasVisitor extends BaseVisitor {
  visitAliasBefore(context: Context) {
    super.visitAliasBefore(context);
  }

  visitAlias(context: Context) {
    // const alias = context.alias.name;
    // this.write(`class ${pascalCase(alias)} {} \n\n`);
    super.visitAlias(context);
  }

  visitAliasAfter(context: Context) {
    super.visitAliasAfter(context);
  }
}
