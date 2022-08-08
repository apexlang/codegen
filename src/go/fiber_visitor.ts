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
  AnyType,
  BaseVisitor,
  Context,
  Kind,
  Type,
} from "@apexlang/core/model";
import { capitalize, convertOperationToType, isService } from "../utils";
import { getMethods, getPath, hasBody } from "../rest";
import { StructVisitor } from "./struct_visitor";
import { expandType, fieldName, methodName } from "./helpers";

export class FiberVisitor extends BaseVisitor {
  visitNamespaceBefore(context: Context): void {
    const packageName = context.config.package || "module";
    this.write(`// Code generated by @apexlang/codegen. DO NOT EDIT.

package ${packageName}

import (
  "github.com/gofiber/fiber/v2"

  "github.com/apexlang/api-go/transport/tfiber"
  "github.com/apexlang/api-go/transport/httpresponse"
)

const _ = httpresponse.Package
\n\n`);
    super.triggerNamespaceBefore(context);
  }

  visitRoleBefore(context: Context): void {
    if (!isService(context)) {
      return;
    }

    const { role } = context;
    const visitor = new FiberServiceVisitor(this.writer);
    role.accept(context, visitor);
  }
}

class FiberServiceVisitor extends BaseVisitor {
  visitRoleBefore(context: Context): void {
    const { role } = context;
    this.write(`func ${role.name}Fiber(service ${role.name}) tfiber.RegisterFn {
    return func(router fiber.Router) {\n`);
  }

  visitOperation(context: Context): void {
    const { operation } = context;
    const path = getPath(context);
    if (path == "") {
      return;
    }
    const fiberPath = path.replace(/\{([a-zA-Z][a-zA-Z0-9]*)\}/g, ":$1");
    const methods = getMethods(operation).map((m) =>
      capitalize(m.toLowerCase())
    );

    methods.forEach((method) => {
      let paramType: AnyType | undefined;
      this.write(
        `router.${method}("${fiberPath}", func(c *fiber.Ctx) error {
          resp := httpresponse.New()
			    ctx := httpresponse.NewContext(c.Context(), resp)\n`
      );
      if (operation.isUnary()) {
        // TODO: check type
        paramType = operation.parameters[0].type;
      } else if (operation.parameters.length > 0) {
        const argsType = convertOperationToType(
          context.getType.bind(context),
          operation
        );
        paramType = argsType;
        const structVisitor = new StructVisitor(this.writer);
        argsType.accept(context.clone({ type: argsType }), structVisitor);
      }

      const operMethod = methodName(operation, operation.name);

      if (paramType) {
        // TODO
        this.write(`var args ${expandType(paramType)}\n`);
        if (hasBody(method)) {
          this.write(`if err := c.BodyParser(&args); err != nil {
            return err
          }\n`);
        }

        switch (paramType.kind) {
          case Kind.Type:
            const t = paramType as Type;
            t.fields.forEach((f) => {
              if (path.indexOf(`{${f.name}}`) != -1) {
                // Set path argument
                this.write(
                  `args.${fieldName(f, f.name)} = c.Params("${f.name}")\n`
                );
              } else if (f.annotation("query") != undefined) {
                this.write(
                  `args.${fieldName(f, f.name)} = c.Query("${f.name}")\n`
                );
              }
            });

            break;
        }

        if (operation.type.kind != Kind.Void) {
          this.write(`result, `);
        }
        if (operation.isUnary()) {
          const share =
            [Kind.Primitive, Kind.Enum].indexOf(paramType.kind) == -1
              ? "&"
              : "";
          this.write(`err := service.${operMethod}(ctx, ${share}args)\n`);
        } else {
          const args = (paramType as Type).fields
            .map((f) => ", args." + fieldName(f, f.name))
            .join("");
          this.write(`err := service.${operMethod}(ctx${args})\n`);
        }
      } else {
        this.write(`err := service.${operMethod}(ctx)\n`);
      }

      if (operation.type.kind != Kind.Void) {
        this.write(`return tfiber.Response(c, resp, result, err)\n`);
      } else {
        this.write(`return err\n`);
      }
      this.write(`})\n`);
    });
  }

  visitRoleAfter(context: Context): void {
    this.write(`  }
}\n`);
  }
}
