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

import { BaseVisitor, Context } from "@apexlang/core/model";
import { expandType, mapParams, methodName, returnPointer } from "./helpers.js";
import { translateAlias } from "./alias_visitor.js";
import { formatComment, isVoid, noCode } from "../utils/index.js";

export class InterfaceVisitor extends BaseVisitor {
  visitInterfaceBefore(context: Context): void {
    const { interface: iface } = context;
    this.write(formatComment("// ", iface.description));
    this.write(`type ${iface.name} interface {\n`);
  }

  visitOperation(context: Context): void {
    const { operation } = context;
    if (noCode(operation)) {
      return;
    }
    this.write(formatComment("// ", operation.description));
    this.write(`${methodName(operation, operation.name)}(`);
    const translate = translateAlias(context);
    this.write(
      `${mapParams(context, operation.parameters, undefined, translate)})`
    );
    if (!isVoid(operation.type)) {
      this.write(
        ` (${returnPointer(operation.type)}${expandType(
          operation.type,
          undefined,
          true,
          translate
        )}, error)`
      );
    } else {
      this.write(` error`);
    }
    this.write(`\n`);
  }

  visitInterfaceAfter(context: Context): void {
    this.write(`}\n\n`);
  }
}
