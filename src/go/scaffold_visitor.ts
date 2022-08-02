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

import { Context, BaseVisitor } from "@apexlang/core/model";
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
import { translateAlias } from "./alias_visitor";

export class ScaffoldVisitor extends BaseVisitor {
  visitNamespaceBefore(context: Context): void {
    const packageName = context.config.package || "myapp";
    super.visitNamespaceBefore(context);

    this.write(`package ${packageName}

    import (\n`);
    if (hasServiceCode(context)) {
      this.write(`\t"context"\n\n`);
    }
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
    const roleNames = (context.config.names as string[]) || [];
    const roleTypes = (context.config.types as string[]) || [];
    const { role } = context;
    if (
      !isOneOfType(context, roleTypes) &&
      roleNames.indexOf(role.name) == -1
    ) {
      return;
    }

    const { operation } = context;
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
    this.write(`${mapParams(context, operation.parameters, undefined)})`);
    if (!isVoid(operation.type)) {
      this.write(
        ` (${returnPointer(context, operation.type)}${expandType(
          operation.type,
          undefined,
          true,
          translateAlias(context)
        )}, error)`
      );
    } else {
      this.write(` error`);
    }
    this.write(` {\n`);
    if (!isVoid(operation.type)) {
      const dv = defaultValueForType(context, operation.type, undefined);
      this.write(`  return ${returnShare(context, operation.type)}${dv}, nil`);
    } else {
      this.write(`  return nil`);
    }
    this.write(` // TODO: Provide implementation.\n`);
    this.write(`}\n`);
  }
}
