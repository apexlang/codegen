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
  Context,
  BaseVisitor,
  Kind,
  Type,
  Optional,
  List,
  Map,
  Writer,
  AnyType,
} from "@apexlang/core/model";
import {
  camelCase,
  isHandler,
  isProvider,
  isVoid,
  pascalCase,
  noCode,
} from "../utils";
import { defaultValueForType, expandType, mapArg, mapArgs } from "./helpers";

export class ScaffoldVisitor extends BaseVisitor {
  visitNamespaceBefore(context: Context): void {
    const adapter = new AdapterTypesVisitor(this.writer);
    context.namespace.accept(context, adapter);
    const types = new TypesVisitor(this.writer);
    context.namespace.accept(context, types);
    this.write(`\n`);
  }

  visitInterfaceBefore(context: Context): void {
    if (isHandler(context)) {
      const impl = new ImplVisitor(this.writer);
      context.interface.accept(context, impl);
    }
  }

  visitNamespaceAfter(context: Context): void {
    this.write(`\nstart();\n`);
  }
}

class ImplVisitor extends BaseVisitor {
  private stateful: boolean;

  constructor(writer: Writer, stateful: boolean = false) {
    super(writer);
    this.stateful = stateful;
  }

  visitInterfaceBefore(context: Context): void {
    super.triggerInterfaceBefore(context);
    const { interface: iface } = context;
    this.write(`class ${iface.name}Impl {`);
  }

  visitOperation(context: Context): void {
    const { operation } = context;
    if (noCode(operation)) {
      return;
    }
    this.write(`\n`);
    let opVal = "";
    opVal += `async ${camelCase(operation.name)}(`;
    if (this.stateful) {
      opVal += `ctx: Context`;
      if (operation.parameters.length > 0) {
        opVal += `, `;
      }
    }
    if (operation.isUnary()) {
      opVal += mapArg(operation.unaryOp());
    } else {
      opVal += mapArgs(operation.parameters);
    }
    opVal += `): Promise<${expandType(operation.type, true)}> {\n`;
    this.write(opVal);
    if (!isVoid(operation.type)) {
      const dv = defaultValueForType(operation.type);
      this.write(`  return ${dv};`);
    } else {
      this.write(`  return;\n`);
    }
    this.write(`}\n`);
    super.triggerOperation(context);
  }

  visitInterfaceAfter(context: Context): void {
    this.write(`}\n\n`);
    const name = context.interface.name;
    this.write(`register${pascalCase(name)}(new ${name}Impl());\n\n`);
    super.triggerInterfaceAfter(context);
  }
}

class AdapterTypesVisitor extends BaseVisitor {
  visitNamespaceBefore(content: Context): void {
    this.write(`import { start`);
  }
  visitInterface(context: Context): void {
    const { interface: iface } = context;
    if (isHandler(context)) {
      this.write(`, register${pascalCase(iface.name)}`);
    }
    if (isProvider(context)) {
      this.write(`, ${camelCase(iface.name)}`);
    }
  }
  visitNamespaceAfter(content: Context): void {
    this.write(` } from "./adapter";\n`);
  }
}

class TypesVisitor extends BaseVisitor {
  hasObjects: boolean = false;
  found: Set<string> = new Set<string>();

  private addImport(name: string): void {
    if (!this.found.has(name)) {
      this.found.add(name);
      if (!this.hasObjects) {
        this.write(`import { `);
        this.hasObjects = true;
      } else {
        this.write(`, `);
      }
      this.write(name);
    }
  }

  addType(t: AnyType): void {
    switch (t.kind) {
      case Kind.Type:
        const v = t as Type;
        this.addImport(v.name);
        break;
      case Kind.Optional:
        const o = t as Optional;
        this.addType(o.type);
        break;
      case Kind.List:
        const l = t as List;
        this.addType(l.type);
        break;
      case Kind.Map:
        const m = t as Map;
        this.addType(m.keyType);
        this.addType(m.valueType);
    }
  }

  visitOperation(context: Context): void {
    const operation = context.operation!;
    this.addType(operation.type);
  }

  visitParameter(context: Context): void {
    const parameter = context.parameter!;
    this.addType(parameter.type);
  }

  visitNamespaceBefore(context: Context): void {}

  visitNamespaceAfter(context: Context): void {
    if (this.hasObjects) {
      this.write(` } from "./interfaces";\n\n`);
    }
  }
}
