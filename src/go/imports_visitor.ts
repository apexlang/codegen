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
  Alias,
  AnyType,
  BaseVisitor,
  Context,
  Kind,
  List,
  Map,
  Optional,
  Primitive,
  PrimitiveName,
  Stream,
  Type,
} from "../deps/core/model.ts";
import { Import } from "./alias_visitor.ts";

export class ImportsVisitor extends BaseVisitor {
  private imports: { [key: string]: Import } = {};
  private externalImports: { [key: string]: Import } = {};

  visitNamespaceAfter(_context: Context): void {
    const stdLib = [];
    for (const key in this.imports) {
      const i = this.imports[key];
      if (i.import) {
        stdLib.push(i.import);
      }
    }
    stdLib.sort();

    const thirdPartyLib = [];
    for (const key in this.externalImports) {
      const i = this.externalImports[key];
      if (i.import) {
        thirdPartyLib.push(i.import);
      }
    }
    thirdPartyLib.sort();

    if (stdLib.length > 0 || thirdPartyLib.length > 0) {
      this.write(`import (\n`);
      for (const lib of stdLib) {
        this.write(`\t"${lib}"\n`);
      }
      if (thirdPartyLib.length > 0) {
        this.write(`\n`);
      }
      for (const lib of thirdPartyLib) {
        this.write(`\t"${lib}"\n`);
      }
      this.write(`)\n`);
    }
  }

  addType(name: string, i: Import) {
    if (i == undefined || i.import == undefined) {
      return;
    }
    if (i.import.indexOf(".") != -1) {
      if (this.externalImports[name] === undefined) {
        this.externalImports[name] = i;
      }
    } else {
      if (this.imports[name] === undefined) {
        this.imports[name] = i;
      }
    }
  }

  checkType(context: Context, type: AnyType): void {
    const aliases = (context.config.aliases as { [key: string]: Import }) || {};

    switch (type.kind) {
      case Kind.Stream: {
        const s = type as Stream;
        this.checkType(context, s.type);
        break;
      }
      case Kind.Alias: {
        const a = type as Alias;
        const i = aliases[a.name];
        this.addType(a.name, i);
        break;
      }
      case Kind.Primitive: {
        const prim = type as Primitive;
        switch (prim.name) {
          case PrimitiveName.DateTime:
            this.addType("Time", {
              type: "time.Time",
              import: "time",
            });
            break;
        }
        break;
      }
      case Kind.Type: {
        const named = type as Type;
        const i = aliases[named.name];
        if (named.name === "datetime" && i == undefined) {
          this.addType("Time", {
            type: "time.Time",
            import: "time",
          });
          return;
        }
        this.addType(named.name, i);
        break;
      }
      case Kind.List: {
        const list = type as List;
        this.checkType(context, list.type);
        break;
      }
      case Kind.Map: {
        const map = type as Map;
        this.checkType(context, map.keyType);
        this.checkType(context, map.valueType);
        break;
      }
      case Kind.Optional: {
        const optional = type as Optional;
        this.checkType(context, optional.type);
        break;
      }
      case Kind.Enum: {
        const jsonSupport = context.config.noEnumJSON
          ? !context.config.noEnumJSON
          : true;
        if (jsonSupport) {
          this.addType("JSON", {
            type: "JSON",
            import: "encoding/json",
          });
          this.addType("FMT", {
            type: "FMT",
            import: "fmt",
          });
        }
        break;
      }
    }
  }

  visitParameter(context: Context): void {
    this.checkType(context, context.parameter.type);
  }

  visitFunction(context: Context): void {
    this.addType("context", {
      type: "context.Context",
      import: "context",
    });
    this.checkType(context, context.operation.type);
  }

  visitOperation(context: Context): void {
    this.addType("context", {
      type: "context.Context",
      import: "context",
    });
    this.checkType(context, context.operation.type);
  }

  visitTypeField(context: Context): void {
    this.checkType(context, context.field.type);
  }
}
