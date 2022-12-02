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

import { Context, BaseVisitor } from "https://raw.githubusercontent.com/apexlang/apex-js/deno-wip/src/model";
import { expandType, strQuote } from "./helpers.ts";
import {
  capitalize,
  camelCase,
  formatComment,
  isProvider,
  isVoid,
} from "../utils/index.ts";

export class ProviderVisitor extends BaseVisitor {
  visitInterfaceBefore(context: Context): void {
    const { interface: iface } = context;
    this.write(`export class ${iface.name}Impl implements ${iface.name} {
    private adapter: IAdapter;

    constructor(adapter: IAdapter) {
        this.adapter = adapter;
    }\n\n`);
  }

  visitOperation(context: Context): void {
    const { interface: iface } = context;
    this.write(`\n`);
    const operation = context.operation!;
    this.write(formatComment("  // ", operation.description));
    this.write(`  async ${camelCase(operation.name)}(`);
    operation.parameters.map((param, index) => {
      if (index > 0) {
        this.write(`, `);
      }
      this.write(`${param.name}: ${expandType(param.type, true)}`);
    });
    var expandedType = expandType(operation.type, true);
    this.write(`): Promise<${expandedType}> {\n`);

    this.write(`  `);
    const retVoid = isVoid(operation.type);
    if (retVoid) {
      expandedType = "undefined";
    }

    const path =
      "/" + context.namespace.name + "." + iface.name + "/" + operation.name;

    if (operation.parameters.length == 0) {
      this.write(
        `return this.adapter.requestResponse(${expandedType}, ${strQuote(
          path
        )})\n`
      );
    } else if (operation.isUnary()) {
      this.write(
        `return this.adapter.requestResponse(${expandedType}, ${strQuote(
          path
        )}, ${operation.unaryOp().name})\n`
      );
    } else {
      this.write(
        `const inputArgs: ${capitalize(iface.name)}${capitalize(
          operation.name
        )}Args = {\n`
      );
      operation.parameters.map((param) => {
        const paramName = param.name;
        this.write(`  ${paramName},\n`);
      });
      this.write(`}\n`);
      this.write(`return this.adapter.requestResponse(${expandedType},
      ${strQuote(path)},
      inputArgs
    )`);
    }
    if (isVoid(operation.type)) {
      this.write(`.then()\n`);
    }
    this.write(`;\n`);
    this.write(`  }\n`);
    super.triggerOperation(context);
  }

  visitInterfaceAfter(context: Context): void {
    if (!isProvider(context)) {
      super.triggerInterfaceAfter(context);
      return;
    }
    const { interface: iface } = context;
    this.write(`}\n\n`);
    this.write(
      `export var ${camelCase(iface.name)} = new ${
        iface.name
      }Impl(adapter);\n\n`
    );
    super.triggerInterfaceAfter(context);
  }
}
