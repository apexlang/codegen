import {
  Annotation,
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
import { getMethods, getPath, hasBody, ScopesDirective } from "../rest/mod.ts";
import { StructVisitor } from "./struct_visitor.ts";
import { expandType, fieldName, methodName, strQuote } from "./helpers.ts";
import { translateAlias } from "./alias_visitor.ts";
import { getImporter, GoVisitor } from "./go_visitor.ts";
import { IMPORTS } from "./constant.ts";

export class ServeMuxVisitor extends GoVisitor {
  public override visitInterfaceBefore(context: Context): void {
    if (!isService(context)) {
      return;
    }

    const { interface: iface } = context;
    const visitor = new ServeMuxServiceVisitor(this.writer);
    iface.accept(context, visitor);
  }
}

class ServeMuxServiceVisitor extends GoVisitor {
  public override visitInterfaceBefore(context: Context): void {
    const { interface: iface } = context;
    const $ = getImporter(context, IMPORTS);
    this
      .write(
        `func ${iface.name}ServeMux(service ${iface.name}) func(*${$.http}.ServeMux) {
    return func(mux *${$.http}.ServeMux) {\n`,
      );
  }

  public override visitOperation(context: Context): void {
    const { interface: iface, operation } = context;
    const $ = getImporter(context, IMPORTS);
    const path = getPath(context);
    if (path == "") {
      return;
    }
    const methods = getMethods(operation).map((m) =>
      capitalize(m.toLowerCase())
    );
    const translate = translateAlias(context);

    let scopes: string[] = [];
    iface.annotation("scopes", (a) => {
      scopes = getScopes(a);
    });
    // Operation scopes override interface scopes
    operation.annotation("scopes", (a) => {
      scopes = getScopes(a);
    });

    methods.forEach((method) => {
      let paramType: AnyType | undefined;
      this.write(
        `mux.HandleFunc("${method.toUpperCase()} ${path}", func(w ${$.http}.ResponseWriter, r *${$.http}.Request) {\n`,
      );

      if (scopes.length > 0) {
        this.write(
          `if err := ${$.authorization}.CheckScopes(r.Context(), ${
            scopes.map((v) => strQuote(v)).join(", ")
          }); err != nil {
  ${$.thttp}.Error(w, nil, err, ${$.errorz}.PermissionDenied)
  return
}\n`,
        );
      }

      this.write(`resp := ${$.httpresponse}.New()
			    ctx := ${$.httpresponse}.NewContext(r.Context(), resp)\n`);
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
          this.write(
            `if err := ${$.json}.NewDecoder(r.Body).Decode(&args); err != nil {
            ${$.thttp}.Error(w, resp, err, ${$.errorz}.Internal)
				    return
          }\n`,
          );
        }

        switch (paramType.kind) {
          case Kind.Type: {
            let foundQuery = false;
            const t = paramType as Type;
            t.fields.forEach((f) => {
              if (path.indexOf(`{${f.name}}`) != -1) {
                // Set path argument
                this.write(
                  `args.${fieldName(f, f.name)} = r.PathValue("${f.name}")\n`,
                );
              } else if (f.annotation("query") != undefined) {
                if (!foundQuery) {
                  this.write(`query := r.URL.Query()\n`);
                  foundQuery = true;
                }
                this.write(
                  `args.${fieldName(f, f.name)} = query.Get("${f.name}")\n`,
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
        this.write(`${$.thttp}.Response(w, resp, result, err)\n`);
      } else {
        this.write(`${$.thttp}.NoContent(w, resp, err)\n`);
      }
      this.write(`})\n`);
    });
  }

  public override visitInterfaceAfter(_context: Context): void {
    this.write(`  }
}\n`);
  }
}

function getScopes(a: Annotation): string[] {
  let scopes = a.convert<ScopesDirective>().value;
  // Convert single value to array
  if (typeof scopes === "string") {
    scopes = [scopes as string];
  }
  return scopes || [];
}
