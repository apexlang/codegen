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

import { Context, BaseVisitor, Writer } from "@apexlang/core/model";
import { camelCase, isService, RoleUsesVisitor, UsesVisitor } from "../utils";

export class WapcMainVisitor extends BaseVisitor {
  // Overridable visitor implementations
  usesVisitor = (writer: Writer): UsesVisitor => new RoleUsesVisitor(writer);
  uses: UsesVisitor | undefined = undefined;

  visitNamespaceBefore(context: Context): void {
    const importPath =
      context.config.import || "github.com/myorg/mymodule/pkg/module";
    super.visitNamespaceBefore(context);

    this.uses = this.usesVisitor(this.writer);
    context.namespace.accept(context, this.uses);

    this.write(`package main

    import (
      "${importPath}"
    )\n\n`);
  }

  visitAllOperationsBefore(context: Context): void {
    this.write(`\n`);

    this.write(`func main() {\n`);
    const packageName = context.config["package"] || "module";
    this.write(`// Create providers\n`);
    this.uses!.dependencies.forEach((dependency) => {
      this.write(
        `${camelCase(
          dependency
        )}Provider := ${packageName}.New${dependency}()\n`
      );
    });

    this.write(`\n\n// Create services\n`);
    this.uses!.services.forEach((dependencies, service) => {
      const deps = dependencies
        .map((d) => camelCase(d) + "Provider")
        .join(", ");
      this.write(
        `${camelCase(
          service
        )}Service := ${packageName}.New${service}(${deps})\n`
      );
    });

    this.write(`\n\n// Register services\n`);
    const registration = new HandlerRegistrationVisitor(this.writer);
    context.namespace.accept(context, registration);
    this.write(`}\n`);
  }
}

class HandlerRegistrationVisitor extends BaseVisitor {
  visitRole(context: Context): void {
    if (!isService(context)) {
      return;
    }
    const packageName = context.config["package"] || "module";
    const { role } = context;

    this.write(
      `\t\t${packageName}.Register${role.name}(${camelCase(
        role.name
      )}Service)\n`
    );
  }
}
