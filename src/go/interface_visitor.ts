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

import { Context } from "../../deps/@apexlang/core/model/mod.ts";
import { expandType, mapParam, methodName, returnPointer } from "./helpers.ts";
import { translateAlias } from "./alias_visitor.ts";
import { formatComment, isVoid, noCode } from "../utils/mod.ts";
import { getImporter, GoVisitor } from "./go_visitor.ts";
import { IMPORTS } from "./constant.ts";

export class InterfaceVisitor extends GoVisitor {
  public override visitInterfaceBefore(context: Context): void {
    const { interface: iface } = context;
    this.write(formatComment("// ", iface.description));
    this.write(`type ${iface.name} interface {\n`);
  }

  public override visitFunction(context: Context): void {
    const { operation } = context;
    if (noCode(operation)) {
      return;
    }

    const $ = getImporter(context, IMPORTS);
    this.write(formatComment("// ", operation.description));
    this.write(
      `type ${
        methodName(operation, operation.name)
      }Fn func(ctx ${$.context}.Context`,
    );
    operation.parameters.forEach((p) =>
      this.visitParam(context.clone({ parameter: p }))
    );
    this.write(`)`);
    this.visitOperationReturn(context);
    this.write(`\n\n`);
  }

  public override visitOperation(context: Context): void {
    const { operation } = context;
    if (noCode(operation)) {
      return;
    }

    const $ = getImporter(context, IMPORTS);
    this.write(formatComment("// ", operation.description));
    this.write(
      `${methodName(operation, operation.name)}(ctx ${$.context}.Context`,
    );
    operation.parameters.forEach((p) =>
      this.visitParam(context.clone({ parameter: p }))
    );
    this.write(`)`);
    this.visitOperationReturn(context);
    this.write(`\n`);
  }

  visitParam(context: Context): void {
    const { parameter } = context;
    const translate = translateAlias(context);
    this.write(`, ${mapParam(context, parameter, undefined, translate)}`);
  }

  visitOperationReturn(context: Context): void {
    const { operation } = context;
    const translate = translateAlias(context);
    if (!isVoid(operation.type)) {
      this.write(
        ` (${returnPointer(operation.type)}${
          expandType(
            operation.type,
            undefined,
            true,
            translate,
          )
        }, error)`,
      );
    } else {
      this.write(` error`);
    }
  }

  public override visitInterfaceAfter(_context: Context): void {
    this.write(`}\n\n`);
  }
}
