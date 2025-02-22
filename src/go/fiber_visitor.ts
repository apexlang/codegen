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

import {
  AnyType,
  Context,
  Kind,
  Type,
} from "../../deps/@apexlang/core/model/mod.ts";
import {
  capitalize,
  convertOperationToType,
  isKinds,
  isObject,
  isService,
  unwrapKinds,
} from "../utils/mod.ts";
import { getMethods, getPath, hasBody } from "../rest/mod.ts";
import { StructVisitor } from "./struct_visitor.ts";
import { expandType, fieldName, methodName } from "./helpers.ts";
import { translateAlias } from "./alias_visitor.ts";
import { getImporter, GoVisitor } from "./go_visitor.ts";
import { IMPORTS } from "./constant.ts";

export class FiberVisitor extends GoVisitor {
  public override visitInterfaceBefore(context: Context): void {
    if (!isService(context)) {
      return;
    }

    const { interface: iface } = context;
    const visitor = new FiberServiceVisitor(this.writer);
    iface.accept(context, visitor);
  }
}

class FiberServiceVisitor extends GoVisitor {
  public override visitInterfaceBefore(context: Context): void {
    const { interface: iface } = context;
    const $ = getImporter(context, IMPORTS);
    this
      .write(
        `func ${iface.name}Fiber(service ${iface.name}) ${$.tfiber}.RegisterFn {
    return func(router ${$.fiber}.Router) {\n`,
      );
  }

  public override visitOperation(context: Context): void {
    const { interface: iface, operation } = context;
    const $ = getImporter(context, IMPORTS);
    const path = getPath(context);
    if (path == "") {
      return;
    }
    const fiberPath = path.replace(/\{([a-zA-Z][a-zA-Z0-9]*)\}/g, ":$1");
    const methods = getMethods(operation).map((m) =>
      capitalize(m.toLowerCase())
    );
    const translate = translateAlias(context);

    methods.forEach((method) => {
      let paramType: AnyType | undefined;
      this.write(
        `router.${method}("${fiberPath}", func(c *fiber.Ctx) error {
          resp := ${$.httpresponse}.New()
			    ctx := ${$.httpresponse}.NewContext(c.Context(), resp)\n`,
      );
      if (operation.isUnary()) {
        // TODO: check type
        paramType = operation.parameters[0].type;
      } else if (operation.parameters.length > 0) {
        const argsType = convertOperationToType(
          context.getType.bind(context),
          iface,
          operation,
        );
        paramType = argsType;
        const structVisitor = new StructVisitor(this.writer);
        argsType.accept(context.clone({ type: argsType }), structVisitor);
      }

      const operMethod = methodName(operation, operation.name);

      if (paramType) {
        // TODO
        this.write(
          `var args ${expandType(paramType, undefined, false, translate)}\n`,
        );
        if (hasBody(method)) {
          this.write(`if err := c.BodyParser(&args); err != nil {
            return err
          }\n`);
        }

        switch (paramType.kind) {
          case Kind.Type: {
            const t = paramType as Type;
            t.fields.forEach((f) => {
              if (path.indexOf(`{${f.name}}`) != -1) {
                // Set path argument
                this.write(
                  `args.${fieldName(f, f.name)} = c.Params("${f.name}")\n`,
                );
              } else if (f.annotation("query") != undefined) {
                this.write(
                  `args.${fieldName(f, f.name)} = c.Query("${f.name}")\n`,
                );
              }
            });

            break;
          }
        }

        if (operation.type.kind != Kind.Void) {
          this.write(`result, `);
        }
        if (operation.isUnary()) {
          const pt = unwrapKinds(paramType, Kind.Alias);
          const share = isKinds(pt, Kind.Primitive, Kind.Enum) ? "" : "&";
          this.write(`err := service.${operMethod}(ctx, ${share}args)\n`);
        } else {
          const args = (paramType as Type).fields
            .map(
              (f) =>
                `, ${isObject(f.type, false) ? "&" : ""}args.${
                  fieldName(
                    f,
                    f.name,
                  )
                }`,
            )
            .join("");
          this.write(`err := service.${operMethod}(ctx${args})\n`);
        }
      } else {
        this.write(`err := service.${operMethod}(ctx)\n`);
      }

      if (operation.type.kind != Kind.Void) {
        this.write(`return ${$.tfiber}.Response(c, resp, result, err)\n`);
      } else {
        this.write(`return err\n`);
      }
      this.write(`})\n`);
    });
  }

  public override visitInterfaceAfter(_context: Context): void {
    this.write(`  }
}\n`);
  }
}
