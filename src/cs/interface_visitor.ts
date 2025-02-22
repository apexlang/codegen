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

import { BaseVisitor, Context } from "../../deps/@apexlang/core/model/mod.ts";
import { formatComment, pascalCase } from "../utils/mod.ts";
import { expandType } from "./helpers.ts";

export class InterfaceVisitor extends BaseVisitor {
  public override visitInterfaceBefore(context: Context) {
    this.write(formatComment("  // ", context.interface.description));
    this.write(
      `  public interface ${pascalCase(context.interface.name)}\n  {\n`,
    );
    super.visitInterfaceBefore(context);
  }

  public override visitInterface(context: Context) {
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

  public override visitInterfaceAfter(context: Context) {
    this.write("  }\n\n");
    super.visitInterfaceAfter(context);
  }
}
