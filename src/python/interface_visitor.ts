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
  Writer,
} from "https://raw.githubusercontent.com/apexlang/apex-js/deno-wip/src/model/mod.ts";
import { expandType, mapArg, mapArgs } from "./helpers.ts";
import { formatComment, isVoid, noCode, snakeCase } from "../utils/mod.ts";

export class InterfaceVisitor extends BaseVisitor {
  visitInterfaceBefore(context: Context): void {
    super.triggerInterfaceBefore(context);
    const { interface: iface } = context;
    this.write(formatComment("# ", iface.description));
    this.write(`class ${iface.name}:\n`);
  }

  visitOperation(context: Context): void {
    const operation = context.operation;
    if (noCode(operation)) {
      return;
    }
    let opVal = "";
    this.write(formatComment("\t# ", operation.description));
    opVal += `\tasync def ${snakeCase(operation.name)}(self`;
    if (operation.parameters.length > 0) {
      opVal += `, `;
      if (operation.isUnary()) {
        opVal += mapArg(operation.unaryOp());
      } else {
        opVal += mapArgs(operation.parameters);
      }
    }
    opVal += `)`;
    if (!isVoid(operation.type)) {
      opVal += ` -> ${expandType(operation.type, true)}`;
    }
    opVal += `:
\t\tpass\n\n`;
    this.write(opVal);
    super.triggerOperation(context);
  }

  visitInterfaceAfter(context: Context): void {
    this.write(`\n\n`);
  }
}
