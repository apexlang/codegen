/*
Copyright 2022 The Apex Authors.

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

import {
  BaseVisitor,
  Context,
} from "https://raw.githubusercontent.com/apexlang/apex-js/deno-wip/src/model/mod.ts";
import { expandType } from "./helpers.ts";
import {
  camelCase,
  capitalize,
  formatComment,
  isProvider,
  isVoid,
  snakeCase,
} from "../utils/mod.ts";

export class ProviderVisitor extends BaseVisitor {
  visitInterfaceBefore(context: Context): void {
    const { interface: iface } = context;
    this.write(`class ${iface.name}Impl(${iface.name}):
\tdef __init__(self, invoker: Invoker):
\t\tself.invoker = invoker\n\n`);
  }

  visitOperation(context: Context): void {
    const { interface: iface } = context;
    this.write(`\n`);
    const operation = context.operation!;
    this.write(formatComment("\t# ", operation.description));
    this.write(`\tasync def ${snakeCase(operation.name)}(self`);
    operation.parameters.map((param, index) => {
      this.write(`, ${snakeCase(param.name)}: ${expandType(param.type, true)}`);
    });
    this.write(`)`);
    const retVoid = isVoid(operation.type);
    if (!retVoid) {
      this.write(` -> ${expandType(operation.type, true)}`);
    }
    this.write(`:\n`);
    const retStr = retVoid ? "" : "return ";
    const withRet = retVoid ? "" : "_with_return";
    const nsop = `'${
      context.namespace.name + "." + iface.name
    }', '${operation.name}'`;
    if (operation.parameters.length == 0) {
      this.write(
        `\t\t${retStr}await self.invoker.invoke${withRet}('${
          context.namespace.name + "." + iface.name
        }', '${operation.name}', None`,
      );
    } else if (operation.isUnary()) {
      this.write(
        `\t\t${retStr}await self.invoker.invoke${withRet}(${nsop}, ${operation.unaryOp().name}`,
      );
    } else {
      this.write(
        `\t\tinput_args = _${capitalize(iface.name)}${
          capitalize(
            operation.name,
          )
        }Args(`,
      );
      operation.parameters.map((param, i) => {
        if (i > 0) {
          this.write(`, `);
        }
        const paramName = param.name;
        this.write(`\t\t\t${snakeCase(paramName)}`);
      });
      this.write(`\t\t)\n`);
      this.write(
        `\t\t${retStr}await self.invoker.invoke${withRet}(${nsop}, input_args`,
      );
    }
    if (!retVoid) {
      this.write(`, ${expandType(operation.type, true)}`);
    }
    this.write(`)\n`);
    super.triggerOperation(context);
  }

  visitInterfaceAfter(context: Context): void {
    if (!isProvider(context)) {
      super.triggerInterfaceAfter(context);
      return;
    }
    const { interface: iface } = context;
    this.write(`\n\n`);
    this.write(`${camelCase(iface.name)} = ${iface.name}Impl(invoker)\n\n`);
    super.triggerInterfaceAfter(context);
  }
}
