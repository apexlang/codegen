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

import { Context } from "../deps/core/model.ts";
import {
  defaultValueForType,
  expandType,
  mapParams,
  methodName,
  receiver,
  returnPointer,
  returnShare,
} from "./helpers.ts";
import { camelCase, isOneOfType, isVoid, noCode } from "../utils/mod.ts";
import { translateAlias } from "./alias_visitor.ts";
import { getImports, GoVisitor } from "./go_visitor.ts";

interface Logger {
  import: string;
  interface: string;
}

function getLogger(context: Context): Logger | undefined {
  return context.config.logger as Logger;
}

export class ScaffoldVisitor extends GoVisitor {
  writeHead(context: Context): void {
    context.config.doNotEdit = false;
    super.writeHead(context);
  }

  visitNamespaceBefore(context: Context): void {
    super.visitNamespaceBefore(context);
    const logger = getLogger(context);

    const roleNames = (context.config.names as string[]) || [];
    const roleTypes = (context.config.types as string[]) || [];

    const hasInterfaces =
      Object.values(context.namespace.interfaces).find((iface) => {
        const c = context.clone({ interface: iface });
        return isOneOfType(c, roleTypes) || roleNames.indexOf(iface.name) != -1;
      }) != undefined;

    // Only emit import section if there are interfaces to generate.
    if (hasInterfaces && logger) {
      getImports(context).thirdparty(logger.import);
    }

    const service = new ServiceVisitor(this.writer);
    context.namespace.accept(context, service);
  }
}

class ServiceVisitor extends GoVisitor {
  visitInterfaceBefore(context: Context): void {
    const roleNames = (context.config.names as string[]) || [];
    const roleTypes = (context.config.types as string[]) || [];
    const { interface: iface } = context;
    const logger = getLogger(context);
    if (
      !isOneOfType(context, roleTypes) &&
      roleNames.indexOf(iface.name) == -1
    ) {
      return;
    }
    let dependencies: string[] = [];
    iface.annotation("uses", (a) => {
      if (a.arguments.length > 0) {
        dependencies = a.arguments[0].value.getValue() as string[];
      }
    });
    this.write(`
    type ${iface.name}Impl struct {\n`);
    if (logger) {
      this.write(`log ${logger.interface}\n`);
    }
    this.write(`${
      dependencies
        .map((e) => camelCase(e) + " " + e)
        .join("\n\t\t")
    }
    }

    func New${iface.name}(`);
    if (logger) {
      this.write(`log ${logger.interface}`);
      if (dependencies.length > 0) {
        this.write(`, `);
      }
    }
    this.write(`${
      dependencies
        .map((e) => camelCase(e) + " " + e)
        .join(", ")
    }) *${iface.name}Impl {
      return &${iface.name}Impl{\n`);
    if (logger) {
      this.write("log: log,\n");
    }
    this.write(`${
      dependencies
        .map((e) => camelCase(e) + ": " + camelCase(e) + ",")
        .join(",\n\t\t")
    }
      }
    }\n\n`);
  }

  visitOperation(context: Context): void {
    if (!isValid(context)) {
      return;
    }

    const { operation, interface: iface } = context;
    if (noCode(operation)) {
      return;
    }
    this.write(`\n`);
    this.write(
      `func (${receiver(iface)} *${iface.name}Impl) ${
        methodName(
          operation,
          operation.name,
        )
      }(`,
    );
    const translate = translateAlias(context);
    this.write(
      `${mapParams(context, operation.parameters, undefined, translate)})`,
    );
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

function isValid(context: Context): boolean {
  const roleNames = (context.config.names as string[]) || [];
  const roleTypes = (context.config.types as string[]) || [];
  const { interface: iface } = context;
  return isOneOfType(context, roleTypes) || roleNames.indexOf(iface.name) != -1;
}
