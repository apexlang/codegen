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
  type Alias,
  type AnyType,
  BaseVisitor,
  type Context,
  Kind,
  type List,
  type Map,
  type Optional,
  type Type,
  type Writer,
} from "@apexlang/core/model";
import { defaultValueForType, expandType, mapArg, mapArgs } from "./helpers.ts";
import {
  isHandler,
  isProvider,
  isVoid,
  noCode,
  snakeCase,
} from "../utils/mod.ts";

export class ScaffoldVisitor extends BaseVisitor {
  public override visitNamespaceBefore(context: Context): void {
    this.write(`#!/usr/bin/env python3\n`);
    const adapter = new AdapterTypesVisitor(this.writer);
    context.namespace.accept(context, adapter);
    const types = new TypesVisitor(this.writer);
    context.namespace.accept(context, types);
    this.write(`\n`);
  }

  public override visitNamespaceAfter(context: Context): void {
    const main = new MainVisitor(this.writer);
    context.namespace.accept(context, main);

    this.write(`\n\nif __name__ == "__main__":
\tmain()
\n`);
  }

  public override visitInterfaceBefore(context: Context): void {
    if (!isHandler(context)) {
      return;
    }
    const impl = new ImplVisitor(this.writer);
    context.interface.accept(context, impl);
  }
}

class MainVisitor extends BaseVisitor {
  public override visitNamespaceBefore(_context: Context): void {
    this.write(`def main():\n`);
  }

  public override visitInterfaceBefore(context: Context): void {
    if (!isHandler(context)) {
      return;
    }
    super.triggerInterfaceBefore(context);
    const name = context.interface.name;
    this.write(`\tregister_${snakeCase(name)}(${name}Impl())\n`);
  }

  public override visitNamespaceAfter(_context: Context): void {
    this.write(`\n\tstart()\n`);
  }
}

class ImplVisitor extends BaseVisitor {
  private stateful: boolean;

  constructor(writer: Writer, stateful: boolean = false) {
    super(writer);
    this.stateful = stateful;
  }

  public override visitInterfaceBefore(context: Context): void {
    if (!isHandler(context)) {
      return;
    }
    super.triggerInterfaceBefore(context);
    const name = context.interface.name;
    this.write(`class ${name}Impl(${name}):\n`);
  }

  public override visitOperation(context: Context): void {
    this.write(`\n`);
    const { operation } = context;
    if (noCode(operation)) {
      return;
    }
    let opVal = "";
    opVal += `\tasync def ${snakeCase(operation.name)}(self`;
    if (this.stateful) {
      opVal += ", ctx: Context";
    }
    if (operation.parameters.length > 0) {
      opVal += ", ";
    }
    if (operation.isUnary()) {
      opVal += mapArg(operation.unaryOp());
    } else {
      opVal += mapArgs(operation.parameters);
    }
    opVal += `)`;
    if (!isVoid(operation.type)) {
      opVal += ` -> ${expandType(operation.type, true)}`;
    }
    opVal += `:\n`;
    this.write(opVal);
    if (!isVoid(operation.type)) {
      const dv = defaultValueForType(operation.type);
      this.write(`\t\treturn ${dv};`);
    } else {
      this.write(`\t\treturn\n`);
    }
    this.write(`\n`);
    super.triggerOperation(context);
  }

  public override visitInterfaceAfter(_context: Context): void {
    this.write(`\n\n`);
  }
}

class AdapterTypesVisitor extends BaseVisitor {
  public override visitNamespaceBefore(_content: Context): void {
    this.write(`from adapter import start`);
  }

  public override visitInterface(context: Context): void {
    const { interface: iface } = context;
    if (isHandler(context)) {
      this.write(`, register_${snakeCase(iface.name)}`);
    }
    if (isProvider(context)) {
      this.write(`, ${snakeCase(iface.name)}`);
    }
  }

  public override visitNamespaceAfter(_content: Context): void {
    this.write(`\n`);
  }
}

class TypesVisitor extends BaseVisitor {
  hasObjects = false;
  found: Set<string> = new Set<string>();

  public override visitNamespaceBefore(_context: Context): void {}

  private addImport(name: string): void {
    if (!this.found.has(name)) {
      this.found.add(name);
      if (!this.hasObjects) {
        this.write(`from interfaces import `);
        this.hasObjects = true;
      } else {
        this.write(`, `);
      }
      this.write(name);
    }
  }

  addType(t: AnyType): void {
    if (t.kind == Kind.Alias) {
      t = (t as Alias).type;
    }
    switch (t.kind) {
      case Kind.Type: {
        const v = t as Type;
        this.addImport(v.name);
        break;
      }
      case Kind.Optional: {
        const o = t as Optional;
        this.addType(o.type);
        break;
      }
      case Kind.List: {
        const l = t as List;
        this.addType(l.type);
        break;
      }
      case Kind.Map: {
        const m = t as Map;
        this.addType(m.keyType);
        this.addType(m.valueType);
      }
    }
  }

  public override visitInterface(context: Context): void {
    const { interface: iface } = context;
    if (isHandler(context)) {
      this.addImport(iface.name);
    }
  }

  public override visitOperation(context: Context): void {
    const operation = context.operation!;
    this.addType(operation.type);
  }

  public override visitParameter(context: Context): void {
    const parameter = context.parameter!;
    this.addType(parameter.type);
  }

  public override visitNamespaceAfter(_context: Context): void {
    if (this.hasObjects) {
      this.write(`\n\n`);
    }
  }
}
