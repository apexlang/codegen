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

import { BaseVisitor, type Context, type Writer } from "@apexlang/core/model";
import { expandType, mapArg, mapArgs } from "./helpers.ts";
import { camelCase, formatComment } from "../utils/mod.ts";

export class InterfaceVisitor extends BaseVisitor {
  private stateful: boolean;

  constructor(writer: Writer, stateful: boolean = false) {
    super(writer);
    this.stateful = stateful;
  }

  public override visitInterfaceBefore(context: Context): void {
    super.triggerInterfaceBefore(context);
    const { interface: iface } = context;
    this.write(formatComment("// ", iface.description));
    this.write(`export interface ${iface.name} {
      \n`);
  }

  public override visitOperation(context: Context): void {
    const operation = context.operation!;
    let opVal = "";
    this.write(formatComment("  // ", operation.description));
    opVal += `${camelCase(operation.name)}(`;
    if (operation.isUnary()) {
      opVal += mapArg(operation.unaryOp());
    } else {
      opVal += mapArgs(operation.parameters);
    }
    opVal += `): ${expandType(operation.type, true)}\n`;
    this.write(opVal);
    super.triggerOperation(context);
  }

  public override visitInterfaceAfter(context: Context): void {
    this.write(`}\n\n`);
    super.triggerInterfaceAfter(context);
  }
}
