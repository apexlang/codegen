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
  AnyType,
  Kind,
  List,
  Map,
  Optional,
  Primitive,
  Alias,
  PrimitiveName,
  Type,
} from "@apexlang/core/model";
import {
  defaultValueForType,
  expandType,
  mapParams,
  methodName,
  returnPointer,
  returnShare,
} from "./helpers";
import {
  camelCase,
  hasServiceCode,
  isOneOfType,
  isVoid,
  noCode,
} from "../utils";
import { Import, translateAlias } from "./alias_visitor";

export class ScaffoldVisitor extends BaseVisitor {
  visitNamespaceBefore(context: Context): void {
    const packageName = context.config.package || "myapp";
    super.visitNamespaceBefore(context);

    this.write(`package ${packageName}

    import (\n`);
    if (hasServiceCode(context)) {
      this.write(`\t"context"\n\n`);
    }
    const importsVisitor = new ImportsVisitor(this.writer);
    context.namespace.accept(context, importsVisitor);
    this.write(`\t"github.com/go-logr/logr"\n`);
    this.write(`)\n\n`);

    const service = new ServiceVisitor(this.writer);
    context.namespace.accept(context, service);
  }
}

class ServiceVisitor extends BaseVisitor {
  visitRoleBefore(context: Context): void {
    const roleNames = (context.config.names as string[]) || [];
    const roleTypes = (context.config.types as string[]) || [];
    const { role } = context;
    if (
      !isOneOfType(context, roleTypes) &&
      roleNames.indexOf(role.name) == -1
    ) {
      return;
    }
    let dependencies: string[] = [];
    role.annotation("uses", (a) => {
      if (a.arguments.length > 0) {
        dependencies = a.arguments[0].value.getValue() as string[];
      }
    });
    this.write(`
    type ${role.name}Impl struct {
      log logr.Logger
      ${dependencies.map((e) => camelCase(e) + " " + e).join("\n\t\t")}
    }
    
    func New${role.name}Impl(log logr.Logger${
      dependencies.length > 0 ? ", " : ""
    }${dependencies.map((e) => camelCase(e) + " " + e).join(", ")}) *${
      role.name
    }Impl {
      return &${role.name}Impl{
        log: log,
        ${dependencies
          .map((e) => camelCase(e) + ": " + camelCase(e) + ",")
          .join(",\n\t\t")}
      }
    }\n\n`);
  }

  visitOperation(context: Context): void {
    if (!isValid(context)) {
      return;
    }

    const { operation, role } = context;
    if (noCode(operation)) {
      return;
    }
    this.write(`\n`);
    this.write(
      `func (s *${role.name}Impl) ${methodName(
        operation,
        operation.name
      )}(ctx context.Context`
    );
    if (operation.parameters.length > 0) {
      this.write(`, `);
    }
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
    this.write(` {\n`);
    if (!isVoid(operation.type)) {
      const dv = defaultValueForType(context, operation.type, undefined);
      this.write(`  return ${returnShare(operation.type)}${dv}, nil`);
    } else {
      this.write(`  return nil`);
    }
    this.write(` // TODO: Provide implementation.\n`);
    this.write(`}\n`);
  }
}

class ImportsVisitor extends BaseVisitor {
  private imports: { [key: string]: Import } = {};
  private externalImports: { [key: string]: Import } = {};

  visitNamespaceAfter(context: Context): void {
    const stdLib = [];
    for (const key in this.imports) {
      const i = this.imports[key];
      if (i.import) {
        stdLib.push(i.import);
      }
    }
    stdLib.sort();
    for (const lib of stdLib) {
      this.write(`\t"${lib}"\n`);
    }

    const thirdPartyLib = [];
    for (const key in this.externalImports) {
      const i = this.externalImports[key];
      if (i.import) {
        thirdPartyLib.push(i.import);
      }
    }
    thirdPartyLib.sort();
    if (thirdPartyLib.length > 0) {
      this.write(`\n`);
    }
    for (const lib of thirdPartyLib) {
      this.write(`\t"${lib}"\n`);
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
      case Kind.Alias: {
        const a = type as Alias;
        const i = aliases[a.name];
        this.addType(a.name, i);
        break;
      }

      case Kind.Primitive:
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
      case Kind.Type:
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
      case Kind.Enum:
        break;
    }
  }

  visitParameter(context: Context): void {
    if (!isValid(context)) {
      return;
    }
    this.checkType(context, context.parameter.type);
  }

  visitOperation(context: Context): void {
    if (!isValid(context)) {
      return;
    }
    this.checkType(context, context.operation.type);
  }
}

function isValid(context: Context): boolean {
  const roleNames = (context.config.names as string[]) || [];
  const roleTypes = (context.config.types as string[]) || [];
  const { role } = context;
  return isOneOfType(context, roleTypes) || roleNames.indexOf(role.name) != -1;
}
