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
import { expandType } from "./helpers.ts";
import { camelCase, capitalize, isVoid, noCode } from "../utils/mod.ts";

export class WrapperVisitor extends BaseVisitor {
  public override visitInterfaceBefore(context: Context): void {
    super.triggerInterfaceBefore(context);
    const { interface: iface } = context;
    this.write(
      `export function register${iface.name}(h: ${iface.name}): void {\n`,
    );
  }

  public override visitOperation(context: Context): void {
    const { interface: iface, operation } = context;
    if (noCode(operation)) {
      return;
    }
    const path = "/" + context.namespace.name + "." + iface.name + "/" +
      operation.name;
    this.write(`  if (h.${camelCase(operation.name)}) {
      adapter.registerRequestResponseHandler("${path}",
            (_: Metadata, input: any): Promise<any> => {\n`);
    if (operation.parameters.length == 0) {
      this.write(`return h.${camelCase(operation.name)}()\n`);
    } else if (operation.isUnary()) {
      this.write(
        `const payload = plainToClass(${
          expandType(
            operation.unaryOp().type,
            true,
          )
        }, input);\n`,
      );
      this.write(`return h.${camelCase(operation.name)}(payload);\n`);
    } else {
      this.write(
        `const inputArgs = plainToClass(${capitalize(iface.name)}${
          capitalize(
            operation.name,
          )
        }Args, input);\n`,
      );
      this.write(`return h.${camelCase(operation.name)}(`);
      operation.parameters.map((param, i) => {
        const paramName = param.name;
        if (i > 0) {
          this.write(`, `);
        }
        this.write(`inputArgs.${paramName}`);
      });
      this.write(`);\n`);
    }
    this.write(`  }\n`);
    this.write(`  );\n`);
    this.write(`  }\n`);
    super.triggerOperation(context);
  }

  public override visitInterfaceAfter(context: Context): void {
    this.write(`}\n\n`);
    super.triggerInterfaceAfter(context);
  }
}

export class WrapperStatefulVisitor extends BaseVisitor {
  public override visitInterfaceBefore(context: Context): void {
    super.triggerInterfaceBefore(context);
    const { namespace, interface: iface } = context;
    const ns = namespace.name + "." + iface.name;
    this.write(
      `export function register${iface.name}(h: ${iface.name}): void {
        handlers.registerStatefulHandler(
          "${ns}",
          "deactivate",
          stateManager.deactivateHandler("${ns}", h)
        );\n`,
    );
  }

  public override visitOperation(context: Context): void {
    const { interface: iface, operation } = context;
    if (noCode(operation)) {
      return;
    }
    const namespace = context.namespace;
    const ns = namespace.name + "." + iface.name;
    this.write(`handlers.registerStatefulHandler(
            "${ns}",
            "${operation.name}",
            (id: string, input: ArrayBuffer): Promise<ArrayBuffer> => {\n`);
    if (operation.parameters.length == 0) {
      this.write(`const sctx = stateManager.toContext("${ns}", id, h);\n`);
      this.write(`return h.${camelCase(operation.name)}(sctx)\n`);
    } else if (operation.isUnary()) {
      this.write(
        `const decoded = handlers.codec.decoder(input);
        const payload = plainToClass(${
          expandType(
            operation.unaryOp().type,
            true,
          )
        }, decoded);\n`,
      );
      this.write(`const sctx = stateManager.toContext("${ns}", id, h);\n`);
      this.write(`return h.${camelCase(operation.name)}(sctx, payload)\n`);
    } else {
      this.write(
        `const inputArgs = handlers.codec.decoder(input) as ${
          capitalize(
            iface.name,
          )
        }${capitalize(operation.name)}Args;\n`,
      );
      this.write(`const sctx = stateManager.toContext("${ns}", id, h);\n`);
      this.write(`return h.${camelCase(operation.name)}(sctx`);
      operation.parameters.map((param) => {
        const paramName = param.name;
        this.write(`, inputArgs.${paramName}`);
      });
      this.write(`)\n`);
    }
    if (!isVoid(operation.type)) {
      this.write(`.then((result) => sctx.response(result))\n`);
      this.write(`.then((result) => handlers.codec.encoder(result));\n`);
    } else {
      this.write(`.then(() => new ArrayBuffer(0));\n`);
    }
    this.write(`  }\n`);
    this.write(`  );\n`);
    super.triggerOperation(context);
  }

  public override visitInterfaceAfter(context: Context): void {
    this.write(`}\n\n`);
    super.triggerInterfaceAfter(context);
  }
}
