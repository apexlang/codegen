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

import { BaseVisitor, type Context } from "@apexlang/core/model";
import { expandType } from "./helpers.ts";
import { capitalize, isVoid, noCode, snakeCase } from "../utils/mod.ts";

export class WrapperVisitor extends BaseVisitor {
  public override visitInterfaceBefore(context: Context): void {
    super.triggerInterfaceBefore(context);
    const { interface: iface } = context;
    this.write(`def register_${snakeCase(iface.name)}(h: ${iface.name}):\n`);
  }

  public override visitOperation(context: Context): void {
    const { interface: iface } = context;
    const operation = context.operation!;
    if (noCode(operation)) {
      return;
    }
    this.write(`\tif not h.${snakeCase(operation.name)} is None:\n`);
    this.write(`\t\tasync def handler(input: bytes) -> bytes:\n`);
    const resultStr = isVoid(operation.type) ? "" : "result = ";
    if (operation.parameters.length == 0) {
      this.write(`\t\t\t${resultStr}await h.${snakeCase(operation.name)}()\n`);
    } else if (operation.isUnary()) {
      const unaryType = expandType(operation.unaryOp().type, true);
      this.write(
        `\t\t\tpayload: ${unaryType} = handlers.codec.decode(input, ${unaryType})\n`,
      );
      this.write(
        `\t\t\t${resultStr}await h.${snakeCase(operation.name)}(payload)\n`,
      );
    } else {
      const argsClass = `_${capitalize(iface.name)}${
        capitalize(
          operation.name,
        )
      }Args`;
      this.write(
        `\t\t\tinput_args: ${argsClass} = handlers.codec.decode(input, ${argsClass})\n`,
      );
      this.write(`\t\t\t${resultStr}await h.${snakeCase(operation.name)}(`);
      operation.parameters.map((param, i) => {
        const paramName = snakeCase(param.name);
        if (i > 0) {
          this.write(`, `);
        }
        this.write(`input_args.${paramName}`);
      });
      this.write(`)\n`);
    }
    if (!isVoid(operation.type)) {
      this.write(`\t\t\treturn handlers.codec.encode(result)\n`);
    } else {
      this.write(`\t\t\treturn bytes(0)\n`);
    }
    this.write(
      `\t\thandlers.register_handler('${context.namespace.name}.${iface.name}', '${operation.name}', handler)\n\n`,
    );
    super.triggerOperation(context);
  }

  public override visitInterfaceAfter(context: Context): void {
    this.write(`\n\n`);
    super.triggerInterfaceAfter(context);
  }
}

export class WrapperStatefulVisitor extends BaseVisitor {
  public override visitInterfaceBefore(context: Context): void {
    super.triggerInterfaceBefore(context);
    const { namespace: ns, interface: iface } = context;
    const fullns = ns.name + "." + iface.name;
    this.write(
      `def register_${snakeCase(iface.name)}(h: ${iface.name}):
\thandlers.register_stateful_handler(
\t\t'${fullns}', 'deactivate',
\t\tstate_manager.deactivate_handler('${fullns}', h))\n\n`,
    );
  }

  public override visitOperation(context: Context): void {
    const { namespace: ns, interface: iface } = context;
    const fullns = ns.name + "." + iface.name;
    const operation = context.operation!;
    if (noCode(operation)) {
      return;
    }
    this.write(`\tif not h.${snakeCase(operation.name)} is None:\n`);
    this.write(`\t\tasync def handler(id: str, input: bytes) -> bytes:\n`);
    this.write(
      `\t\t\tsctx = await state_manager.to_context("${fullns}", id, h)\n`,
    );
    const resultStr = isVoid(operation.type) ? "" : "result = ";
    if (operation.parameters.length == 0) {
      this.write(
        `\t\t\t${resultStr}await h.${snakeCase(operation.name)}(sctx)\n`,
      );
    } else if (operation.isUnary()) {
      const unaryType = expandType(operation.unaryOp().type, true);
      this.write(
        `\t\t\tpayload: ${unaryType} = handlers.codec.decode(input, ${unaryType})\n`,
      );
      this.write(
        `\t\t\t${resultStr}await h.${
          snakeCase(
            operation.name,
          )
        }(sctx, payload)\n`,
      );
    } else {
      const argsClass = `_${capitalize(iface.name)}${
        capitalize(
          operation.name,
        )
      }Args`;
      this.write(
        `\t\t\tinput_args: ${argsClass} = handlers.codec.decode(input, ${argsClass})\n`,
      );
      this.write(`\t\t\t${resultStr}await h.${snakeCase(operation.name)}(sctx`);
      operation.parameters.map((param) => {
        const paramName = snakeCase(param.name);
        this.write(`, `);
        this.write(`input_args.${paramName}`);
      });
      this.write(`)\n`);
    }
    if (!isVoid(operation.type)) {
      this.write(`\t\t\tresponse = sctx.response(result)\n`);
      this.write(`\t\t\treturn handlers.codec.encode(response)\n`);
    } else {
      this.write(`\t\t\tresponse = sctx.response(None)\n`);
      this.write(`\t\t\treturn handlers.codec.encode(response)\n`);
    }
    this.write(
      `\t\thandlers.register_stateful_handler('${context.namespace.name}.${iface.name}', '${operation.name}', handler)\n\n`,
    );
    super.triggerOperation(context);
  }

  public override visitInterfaceAfter(context: Context): void {
    this.write(`\n\n`);
    super.triggerInterfaceAfter(context);
  }
}
