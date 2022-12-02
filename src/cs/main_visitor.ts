// This Visitor generates the Main method, which is the entry point for C# code.

import { BaseVisitor } from "https://raw.githubusercontent.com/apexlang/apex-js/deno-wip/src/model";
import { Context } from "https://raw.githubusercontent.com/apexlang/apex-js/deno-wip/src/dist/model";
import { parseNamespaceName } from "./helpers";

export class MainVisitor extends BaseVisitor {
  visitNamespaceBefore(context: Context) {
    this.write(`namespace ${parseNamespaceName(context.namespace.name)} {\n`);
    super.visitNamespace(context);
  }

  visitNamespace(context: Context) {
    this.write(`public class MainClass {\n`);
    this.write(`\t public static void Main(String[] args) {\n`);
    super.visitNamespace(context);
  }

  visitInterface(context: Context) {
    const { interface: iface } = context;
    if (iface.annotation("service")) {
      if (iface.annotation("uses")) {
        iface.annotation("uses", (a) => {
          this.write(
            `\t\t ${iface.name}Impl ${iface.name
              .toString()
              .toLowerCase()} = new ${
              iface.name
            }Impl(new ${a.arguments[0].value.getValue()}Impl());\n`
          );
        });
      }
    }
    super.visitInterface(context);
  }

  visitNamespaceAfter(context: Context) {
    this.write(`\t\t }\n`);
    this.write(`\t}\n`);
    this.write(`}\n`);
    super.visitNamespaceAfter(context);
  }
}
