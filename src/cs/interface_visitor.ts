import { BaseVisitor, Context } from "https://raw.githubusercontent.com/apexlang/apex-js/deno-wip/src/model";
import { formatComment, pascalCase } from "../utils";
import { expandType } from "./helpers";

export class InterfaceVisitor extends BaseVisitor {
  visitInterfaceBefore(context: Context) {
    this.write(formatComment("  // ", context.interface.description));
    this.write(
      `  public interface ${pascalCase(context.interface.name)}\n  {\n`
    );
    super.visitInterfaceBefore(context);
  }

  visitInterface(context: Context) {
    const operations = context.interface.operations;
    for (let i = 0; i < operations.length; ++i) {
      const operation = operations[i];
      const type = expandType(operation.type);
      if (i > 0) {
        this.write(`\n`);
      }
      this.write(formatComment("    // ", operation.description));
      this.write(`    public ${type} ${pascalCase(operation.name)}(`);

      const parameters = operation.parameters;
      for (let j = 0; j < parameters.length; ++j) {
        const parameter = parameters[j];

        this.write(`${expandType(parameter.type)} ${parameter.name}`);
        if (j < parameters.length - 1) this.write(`, `);
      }
      this.write(`);\n`);
    }
    super.visitInterface(context);
  }

  visitInterfaceAfter(context: Context) {
    this.write("  }\n\n");
    super.visitInterfaceAfter(context);
  }
}
