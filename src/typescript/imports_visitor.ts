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
  Type,
  Kind,
  List,
  Map,
  Optional,
  AnyType,
} from "@apexlang/core/model";
import { Import } from "./alias_visitor";

export class ImportsVisitor extends BaseVisitor {
  private imports: { [key: string]: Import } = {};

  visitNamespaceAfter(context: Context): void {
    const modules: { [module: string]: string[] } = {};
    for (const key in this.imports) {
      const i = this.imports[key];
      if (i.from && i.import) {
        var imports: string[] = modules[i.from];
        if (!imports) {
          imports = [];
          modules[i.from] = imports;
        }
        imports.push(i.import);
      }
    }

    for (const module in modules) {
      const imports = modules[module];
      imports.sort();
      this.write(`import { ${imports.join(", ")} } from "${module}";\n`);
    }
  }

  addType(name: string, i: Import) {
    if (i == undefined || i.import == undefined) {
      return;
    }
    if (this.imports[name] === undefined) {
      this.imports[name] = i;
    }
  }

  checkType(context: Context, type: AnyType): void {
    const aliases = (context.config.aliases as { [key: string]: Import }) || {};

    switch (type.kind) {
      case Kind.Type:
        const named = type as Type;
        const i = aliases[named.name];
        this.addType(named.name, i);
        break;
      case Kind.List:
        const list = type as List;
        this.checkType(context, list.type);
        break;
      case Kind.Map:
        const map = type as Map;
        this.checkType(context, map.keyType);
        this.checkType(context, map.valueType);
        break;
      case Kind.Optional:
        const optional = type as Optional;
        this.checkType(context, optional.type);
        break;
    }
  }

  visitParameter(context: Context): void {
    this.checkType(context, context.parameter!.type);
  }

  visitOperation(context: Context): void {
    this.checkType(context, context.operation!.type);
  }

  visitTypeField(context: Context): void {
    this.checkType(context, context.field!.type);
  }
}
