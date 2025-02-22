/*
Copyright 2025 The Apex Authors.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

// This Visitor generates the Main method, which is the entry point for C# code.

import { BaseVisitor, Context } from "../../deps/@apexlang/core/model/mod.ts";
import { parseNamespaceName } from "./helpers.ts";

export class MainVisitor extends BaseVisitor {
  public override visitNamespaceBefore(context: Context) {
    this.write(`namespace ${parseNamespaceName(context.namespace.name)} {\n`);
    super.visitNamespace(context);
  }

  public override visitNamespace(context: Context) {
    this.write(`public class MainClass {\n`);
    this.write(`\t public static void Main(String[] args) {\n`);
    super.visitNamespace(context);
  }

  public override visitInterface(context: Context) {
    const { interface: iface } = context;
    if (iface.annotation("service")) {
      if (iface.annotation("uses")) {
        iface.annotation("uses", (a) => {
          this.write(
            `\t\t ${iface.name}Impl ${iface.name.toString().toLowerCase()} = new ${iface.name}Impl(new ${
              a.arguments[0].value.getValue()
            }Impl());\n`,
          );
        });
      }
    }
    super.visitInterface(context);
  }

  public override visitNamespaceAfter(context: Context) {
    this.write(`\t\t }\n`);
    this.write(`\t}\n`);
    this.write(`}\n`);
    super.visitNamespaceAfter(context);
  }
}
