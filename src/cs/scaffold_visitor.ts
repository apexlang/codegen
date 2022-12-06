import { formatComment, isOneOfType, pascalCase } from "../utils/index.ts";
import {
  BaseVisitor,
  Context,
} from "https://raw.githubusercontent.com/apexlang/apex-js/deno-wip/src/model/index.ts";
import { expandType, parseNamespaceName } from "./helpers.ts";

export class ScaffoldVisitor extends BaseVisitor {
  // visitNamespaceBefore(context: Context) {
  //   this.write(`// Code generated by @apexlang/codegen. DO NOT EDIT.\n\n`);
  //   this.write(`using System;\n\n`);
  //   super.visitNamespaceBefore(context);
  // }

  visitNamespace(context: Context) {
    this.write(`namespace ${parseNamespaceName(context.namespace.name)} {\n`);

    const service = new ServiceVisitor(this.writer);
    context.namespace.accept(context, service);

    super.visitNamespace(context);
  }

  visitNamespaceAfter(context: Context) {
    this.write(`}\n`);
    super.visitNamespaceAfter(context);
  }
}

export class ServiceVisitor extends BaseVisitor {
  visitInterfaceBefore(context: Context) {
    if (!isValid(context)) {
      return;
    }

    const { interface: iface } = context;
    let dependencies: string[] = [];
    iface.annotation("uses", (a) => {
      if (a.arguments.length > 0) {
        dependencies = a.arguments[0].value.getValue() as string[];
      }
    });
    this.write(`  public class ${iface.name}Impl : ${iface.name} {\n`);

    dependencies.map((value, index) => {
      this.write(`    private ${value} ${value.toLowerCase()};\n`);
      if (index == dependencies.length - 1) this.write(`\n`);
    });

    dependencies.map((value, index) => {
      this.write(
        `    public ${iface.name}Impl (${value}Impl ${value.toLowerCase()}) {\n`
      );
      this.write(
        `      this.${value.toLowerCase()} = ${value.toLowerCase()};\n`
      );
      this.write(`\t }\n`);
      if (index == dependencies.length - 1) this.write(`\n`);
    });

    super.visitInterfaceBefore(context);
  }

  visitInterface(context: Context) {
    if (!isValid(context)) {
      return;
    }

    const operations = context.interface.operations;
    for (let i = 0; i < operations.length; ++i) {
      if (i > 0) {
        this.write(`\n`);
      }
      const operation = operations[i];
      const type = expandType(operation.type);

      this.write(formatComment("    // ", operation.description));
      this.write(`    public ${type} ${pascalCase(operation.name)}(`);

      const parameters = operation.parameters;
      for (let j = 0; j < parameters.length; ++j) {
        const parameter = parameters[j];

        this.write(`${expandType(parameter.type)} ${parameter.name}`);
        if (j < parameters.length - 1) this.write(`, `);
      }
      this.write(`)\n    {\n`);

      if (type == "void") {
        this.write(`      return; // TODO: Provide implementation.\n`);
      } else {
        this.write(
          `      return new ${type}(); // TODO: Provide implementation.\n`
        );
      }

      this.write(`    }\n`);
    }
    this.write(`  }\n\n`);
    super.visitInterface(context);
  }
}

function isValid(context: Context): boolean {
  const roleNames = (context.config.names as string[]) || [];
  const roleTypes = (context.config.types as string[]) || [];
  const { interface: iface } = context;
  return isOneOfType(context, roleTypes) || roleNames.indexOf(iface.name) != -1;
}
