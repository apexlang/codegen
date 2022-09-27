import {BaseVisitor, Context} from "@apexlang/core/model";
import {formatComment, pascalCase} from "../utils";
import {expandType} from "./helpers";
import {translations} from "./constant";

export class InterfaceVisitor extends BaseVisitor {
  visitInterfaceBefore(context: Context) {
    this.write(formatComment("/// ", context.interface.description));
    this.write(`class ${pascalCase(context.interface.name)}\n{\n`);
    super.visitInterfaceBefore(context);
  }

  visitInterface(context: Context) {
    if (context.interface.annotation("service")) {
      this.write(`\t void Setup(Microsoft.AspNetCore.Builder.WebApplication app) {\n`);
      context.interface.operations.forEach((method) => {
        method.parameters.forEach((param) => {
          const parameter = JSON.parse(JSON.stringify(param));
          const type = translations.get(parameter.type.name) || parameter.type.name;
          if ((method.annotation("GET"))) {
            this.write(`\t\t app.MapGet("/${method.name}", (${type} ${param.name}) => this.${pascalCase(method.name)}(${param.name}));\n`);
          } else if (method.annotation("POST")) {
            this.write(`\t\t app.MapPost("/${method.name}", (${type} ${param.name}) => this.${pascalCase(method.name)}(${param.name}));\n`);
          } else if (method.annotation("PUT")) {
            this.write(`\t\t app.MapPut("/${method.name}", (${type} ${param.name}) => this.${pascalCase(method.name)}(${param.name}));\n`);
          } else if (method.annotation("DELETE")) {
            this.write(`\t\t app.MapDelete("/${method.name}", (${type} ${param.name}) => this.${pascalCase(method.name)}(${param.name}));\n`);
          }
        })
      })
      this.write(`\t}\n\n`);
    }

    const operations = context.interface.operations;
    for (let i = 0; i < operations.length; ++i) {
      const operation = operations[i];
      const type = expandType(operation.type);

      this.write(formatComment("  /// ", operation.description));
      this.write(`  public ${type} ${pascalCase(operation.name)}(`);

      const parameters = operation.parameters;
      for (let j = 0; j < parameters.length; ++j) {
        const parameter = parameters[j];

        this.write(`${expandType(parameter.type)} ${parameter.name}`);
        if (j < (parameters.length - 1)) this.write(`, `);
      }
      this.write(`)\n  {\n`);
      this.write(`  }\n`);
    }
    super.visitInterface(context);
  }

  visitInterfaceAfter(context: Context) {
    this.write("}\n");
    super.visitInterfaceAfter(context);
  }
}