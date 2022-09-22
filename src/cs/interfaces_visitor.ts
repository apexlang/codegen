import {
  BaseVisitor,
  Context,
  Visitor,
  Writer,
} from "@apexlang/core/dist/model";
import { TypeVisitor } from "./types_visitor";
import { getMethods, getPath } from "../rest";
import { pascalCase } from "../utils";

export class InterfacesVisitor extends BaseVisitor {
  typeVisitor = (writer: Writer): Visitor => new TypeVisitor(writer);

  visitInterfacesBefore(context: Context) {
    this.write(
      "void Setup(Microsoft.AspNetCore.Builder.WebApplication app) {\n"
    );
    super.visitInterfacesBefore(context);
  }

  visitInterfaceBefore(context: Context) {
    this.write(`  // ${context.interface.name}\n`);
    this.write("  {\n");
    super.visitInterfaceBefore(context);
  }

  visitInterfaceAfter(context: Context) {
    this.write("  }\n");
    super.visitInterfaceAfter(context);
  }

  visitInterfacesAfter(context: Context) {
    this.write("}\n");
    super.visitInterfacesBefore(context);
  }

  visitOperation(context: Context) {
    const { operation } = context;

    const path = getPath(context);
    const methods = getMethods(operation);

    for (const method of methods) {
      this.write(`    app.Map${pascalCase(method)}("${path}", () => {});\n`);
    }

    super.visitInterface(context);
  }

  visitInterface(context: Context) {
    super.visitInterface(context);
  }

  visitType(context: Context): void {
    const visitor = this.typeVisitor(this.writer);
    context.type.accept(context, visitor);
  }
}
