// deno-lint-ignore-file no-explicit-any
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
  Context,
  Enum,
  Field,
  Kind,
  List,
  Map,
  Named,
  Optional,
  Primitive,
  PrimitiveName,
  Type,
  Union,
} from "../deps/core/model.ts";
import {
  capitalize,
  convertOperationToType,
  isNamed,
  isObject,
  isService,
  isVoid,
  operationArgsType,
  pascalCase,
  unwrapKinds,
} from "../utils/mod.ts";
import { IMPORTS } from "./constant.ts";
import { getImporter, getImports, GoVisitor, ImportNames, Imports } from "./go_visitor.ts";
import { expandType, fieldName, methodName, returnShare } from "./helpers.ts";
import { StructVisitor } from "./struct_visitor.ts";

export type NamedType = Alias | Type | Union | Enum;

export class GRPCVisitor extends GoVisitor {
  private input: { [name: string]: NamedType } = {};
  private output: { [name: string]: NamedType } = {};

  visitInterfaceBefore(context: Context): void {
    if (!isService(context)) {
      return;
    }

    const imports = getImports(context);
    const $ = getImporter(context, IMPORTS);
    const module = context.config.module;
    const protoPackage = context.config.protoPackage || module + "/proto";
    imports.firstparty(protoPackage, "pb");

    const { interface: iface } = context;
    this.write(`func ${iface.name}GRPC(s ${iface.name}) ${$.tgrpc}.RegisterFn {
  return func(server ${$.grpc}.ServiceRegistrar) {
    pb.Register${iface.name}Server(server, New${iface.name}GRPCWrapper(s))
  }
}

type ${iface.name}GRPCWrapper struct {
  pb.Unimplemented${iface.name}Server
  service ${iface.name}
}

func New${iface.name}GRPCWrapper(service ${iface.name}) *${iface.name}GRPCWrapper {
  return &${iface.name}GRPCWrapper{
    service: service,
  }
}\n\n`);
  }

  visitParameter(context: Context): void {
    if (!isService(context)) {
      return;
    }
    const { parameter } = context;
    this.checkType(context, parameter.type, this.input);
  }

  visitOperation(context: Context): void {
    if (!isService(context)) {
      return;
    }

    const $ = getImporter(context, IMPORTS);
    const { interface: iface, operation } = context;
    const returnType = operation.type;
    const operName = capitalize(operation.name);
    this.write(
      `func (s *${iface.name}GRPCWrapper) ${operName}(ctx ${$.context}.Context, `,
    );
    this.checkType(context, operation.type, this.output);
    if (operation.isUnary()) {
      const param = operation.parameters[0];
      const pt = unwrapKinds(param.type, Kind.Alias, Kind.Optional);
      switch (pt.kind) {
        case Kind.Void: {
          this.write(`*${$.emptypb}.Empty`);
          break;
        }
        case Kind.Primitive: {
          const p = pt as Primitive;
          this.write(`${param.name} ${primitiveWrapperType($, p.name)}`);
          break;
        }
        case Kind.Enum: {
          const e = pt as Enum;
          this.write(`${param.name} *pb.${e.name}Value`);
          break;
        }
        case Kind.Type: {
          this.write(`request *pb.${(pt as Named).name}`);
          break;
        }
        default: {
          throw new Error(`unhandled type ${pt.kind}`);
        }
      }
    } else if (operation.parameters.length > 0) {
      this.write(`args *pb.${operationArgsType(iface, operation)}`);
    } else {
      this.write(`_ *${$.emptypb}.Empty`);
    }
    this.write(`) (`);
    const rt = unwrapKinds(returnType, Kind.Alias, Kind.Optional);
    switch (rt.kind) {
      case Kind.Void: {
        this.write(`*${$.emptypb}.Empty`);
        break;
      }
      case Kind.Primitive: {
        const p = rt as Primitive;
        this.write(primitiveWrapperType($, p.name));
        break;
      }
      case Kind.Enum: {
        this.write(`*pb.${(rt as Enum).name}Value`);
        break;
      }
      case Kind.Union:
      case Kind.Type: {
        this.write(`*pb.${(rt as Named).name}`);
        break;
      }
      default: {
        throw new Error(`unhandled type ${rt.kind}`);
      }
    }
    this.write(`, error) {\n`);

    if (operation.isUnary()) {
      const param = operation.parameters[0];
      let pt = param.type;
      switch (pt.kind) {
        case Kind.Alias: {
          const a = pt as Alias;
          const imp = this.aliases[a.name];
          if (imp && imp.parse) {
            this.write(`input, err := ${imp.parse}(${param.name}.Value)
            if err != nil {
              return nil, ${$.tgrpc}.Error(${$.errorz}.Newf(${$.errorz}.InvalidArgument, "Invalid argument for ${param.name}"))
            }\n`);
            break;
          }
          pt = a.type;
        }
        /* falls through */
        case Kind.Primitive: {
          const p = pt as Primitive;

          if (p.name == PrimitiveName.DateTime) {
            $.timestamppb // Cause import
          }

          switch (p.name) {
            case PrimitiveName.I8:
              this.write(`input := int8(${param.name}.Value)\n`);
              break;
            case PrimitiveName.I16:
              this.write(`input := int16(${param.name}.Value)\n`);
              break;
            case PrimitiveName.U8:
              this.write(`input := uint8(${param.name}.Value)\n`);
              break;
            case PrimitiveName.U16:
              this.write(`input := uint16(${param.name}.Value)\n`);
              break;
            default:
              this.write(`input := ${param.name}.Value\n`);
              break;
          }
          break;
        }
        case Kind.Enum: {
          const e = pt as Enum;
          this.write(`input := ${e.name}(${param.name}.Value)\n`);
          break;
        }
        default:
          this.write(
            `input, err := convertInput${(param.type as Named).name}(request)
            if err != nil {
              return nil, ${$.tgrpc}.Error(err)
            }\n`,
          );
          break;
      }
      if (!isVoid(operation.type)) {
        this.write(`result, `);
      }
      this.write(`err := s.service.${
        methodName(
          operation,
          operation.name,
        )
      }(ctx, ${isObject(pt) ? "" : ""}input)
      if err != nil {
      	return nil, ${$.tgrpc}.Error(err)
      }\n`);
    } else {
      let params = "";
      if (operation.parameters.length > 0) {
        const argsType = convertOperationToType(
          context.getType.bind(context),
          iface,
          operation,
        );
        const structVisitor = new StructVisitor(this.writer);
        argsType.accept(context.clone({ type: argsType }), structVisitor);
        this.write(`var et ${$.errorz}.Tracker
      input := ${argsType.name}{\n`);
        argsType.fields.forEach((f) => {
          this.write(
            `${fieldName(f, f.name)}: ${
              this.writeInput($, f, "args", false)
            },\n`,
          );
        });
        this.write(`}
      if errz := et.Errors(); errz != nil {
        return nil, ${$.tgrpc}.Error(errz)
      }\n`);
        params = argsType.fields
          .map((f) => `, ${returnShare(f.type)}input.${fieldName(f, f.name)}`)
          .join("");
      }
      if (!isVoid(operation.type)) {
        this.write(`result, `);
      }
      this.write(`err := s.service.${
        methodName(
          operation,
          operation.name,
        )
      }(ctx${params})
      if err != nil {
      	return nil, ${$.tgrpc}.Error(err)
      }\n`);
    }

    let rt2 = operation.type;
    let format = "";
    switch (rt2.kind) {
      case Kind.Void:
        this.write(`return &${$.emptypb}.Empty{}, nil\n`);
        break;
      case Kind.Union:
      case Kind.Type:
        this.write(`return convertOutput${(rt2 as Named).name}(result), nil\n`);
        break;
      case Kind.Enum: {
        const e = rt2 as Enum;
        this.write(
          `return &pb.${e.name}Value{Value: pb.${e.name}(result)}, nil\n`,
        );
        break;
      }
      case Kind.Alias: {
        const a = rt2 as Alias;
        const imp = this.aliases[a.name];
        if (imp) {
          format = "." + (imp.format || `${pascalCase(expandType(a.type))}`) +
            `()`;
        }
        rt2 = a.type;
      }
      /* falls through */
      case Kind.Primitive: {
        const p = rt2 as Primitive;
        switch (p.name) {
          case PrimitiveName.String:
            this.write(
              `return &${$.wrapperspb}.StringValue{Value: result${format}}, nil\n`,
            );
            break;
          case PrimitiveName.I64:
            this.write(
              `return &${$.wrapperspb}.Int64Value{Value: result${format}}, nil\n`,
            );
            break;
          case PrimitiveName.I32:
            this.write(
              `return &${$.wrapperspb}.Int32Value{Value: result${format}}, nil\n`,
            );
            break;
          case PrimitiveName.I16:
          case PrimitiveName.I8:
            this.write(
              `return &${$.wrapperspb}.Int32Value{Value: int32(result${format})}, nil\n`,
            );
            break;
          case PrimitiveName.U64:
            this.write(
              `return &${$.wrapperspb}.UInt64Value{Value: result${format}}, nil\n`,
            );
            break;
          case PrimitiveName.U32:
            this.write(
              `return &${$.wrapperspb}.UInt32Value{Value: result${format}}, nil\n`,
            );
            break;
          case PrimitiveName.U16:
          case PrimitiveName.U8:
            this.write(
              `return &${$.wrapperspb}.UInt32Value{Value: uint32(result${format})}, nil\n`,
            );
            break;
          case PrimitiveName.F64:
            this.write(
              `return &${$.wrapperspb}.DoubleValue{Value: result${format}}, nil\n`,
            );
            break;
          case PrimitiveName.F32:
            this.write(
              `return &${$.wrapperspb}.FloatValue{Value: result${format}}, nil\n`,
            );
            break;
          case PrimitiveName.Bool:
            this.write(
              `return &${$.wrapperspb}.BoolValue{Value: result${format}}, nil\n`,
            );
            break;
          case PrimitiveName.Bytes:
            this.write(
              `return &${$.wrapperspb}.BytesValue{Value: result${format}}, nil\n`,
            );
            break;
        }
      }
    }
    this.write(`}\n\n`);
  }

  visitNamespaceAfter(context: Context): void {
    const $ = getImporter(context, IMPORTS);
    for (const name of Object.keys(this.input)) {
      const named = this.input[name];
      switch (named.kind) {
        case Kind.Type: {
          const t = named as Type;
          this.writeInputType($, t);
          break;
        }
        case Kind.Union: {
          const u = named as Union;
          this.writeInputUnion($, u);
          break;
        }
      }
    }

    for (const name of Object.keys(this.output)) {
      const named = this.output[name];
      switch (named.kind) {
        case Kind.Type: {
          const t = named as Type;
          this.writeOutputType($, t);
          break;
        }
        case Kind.Union: {
          const u = named as Union;
          this.writeOutputUnion(u);
          break;
        }
      }
    }
  }

  writeOutputType($: ImportNames<any>, t: Type) {
    this.write(`func convertOutput${t.name}(from *${t.name}) *pb.${t.name} {
      if from == nil {
        return nil
      }
      return &pb.${t.name}{\n`);
    t.fields.forEach((f) => {
      let ft = f.type;
      switch (ft.kind) {
        case Kind.Optional: {
          const optType = (ft as Optional).type;
          switch (optType.kind) {
            case Kind.Primitive: {
              const prim = optType as Primitive;
              let wrapperStart = "";
              let wrapperEnd = "";
              switch (prim.name) {
                case PrimitiveName.I16:
                  wrapperStart = `${$.tgrpc}.ConvertOutputI16Ptr(`;
                  wrapperEnd = ")";
                  break;
                case PrimitiveName.I8:
                  wrapperStart = `${$.tgrpc}.ConvertOutputI8Ptr(`;
                  wrapperEnd = ")";
                  break;
                case PrimitiveName.U16:
                  wrapperStart = `${$.tgrpc}.ConvertOutputU16Ptr(`;
                  wrapperEnd = ")";
                  break;
                case PrimitiveName.U8:
                  wrapperStart = `${$.tgrpc}.ConvertOutputU8Ptr(`;
                  wrapperEnd = ")";
                  break;
                case PrimitiveName.DateTime:
                  wrapperStart = `${$.tgrpc}.ConvertOutputTimestamp(`;
                  wrapperEnd = `)`;
                  break;
              }
              this.write(
                `${capitalize(f.name)}: ${wrapperStart}from.${
                  fieldName(
                    f,
                    f.name,
                  )
                }${wrapperEnd},\n`,
              );
              break;
            }
            case Kind.Alias: {
              const a = optType as Alias;
              const imp = this.aliases[a.name];
              if (imp) {
                this.write(`${
                  capitalize(
                    f.name,
                  )
                }: ${$.convert}.Nillable(from.${
                  fieldName(f, f.name)
                }, func(value ${imp.type}) ${expandType(a.type)} {
                  return value.${imp.format || "String"}()
                }),\n`);
              }

              break;
            }
            case Kind.Enum: {
              const e = optType as Enum;
              this.write(
                `${capitalize(f.name)}: (*pb.${e.name})(from.${
                  fieldName(
                    f,
                    f.name,
                  )
                }),\n`,
              );
              break;
            }
            case Kind.Union:
            case Kind.Type: {
              const ft = optType as Named;
              this.write(
                `${capitalize(f.name)}: convertOutput${ft.name}(from.${
                  fieldName(f, f.name)
                }),\n`,
              );
              break;
            }
          }
          break;
        }
        case Kind.Alias: {
          const a = ft as Alias;
          const imp = this.aliases[a.name];
          if (imp) {
            this.write(
              `${capitalize(f.name)}: from.${capitalize(f.name)}.${
                imp.format || "String"
              }(),\n`,
            );
            break;
          }
          ft = a.type;
        }
        /* falls through */
        case Kind.Primitive: {
          const prim = ft as Primitive;
          let wrapperStart = "";
          let wrapperEnd = "";
          switch (prim.name) {
            case PrimitiveName.I16:
            case PrimitiveName.I8:
              wrapperStart = `int32(`;
              wrapperEnd = ")";
              break;
            case PrimitiveName.U16:
            case PrimitiveName.U8:
              wrapperStart = `uint32(`;
              wrapperEnd = ")";
              break;
            case PrimitiveName.DateTime:
              wrapperStart = `timestamppb.New(`;
              wrapperEnd = `)`;
              break;
          }
          this.write(
            `${capitalize(f.name)}: ${wrapperStart}from.${
              fieldName(
                f,
                f.name,
              )
            }${wrapperEnd},\n`,
          );
          break;
        }
        case Kind.Enum: {
          const e = ft as Enum;
          this.write(
            `${capitalize(f.name)}: pb.${e.name}(from.${
              fieldName(
                f,
                f.name,
              )
            }),\n`,
          );
          break;
        }
        case Kind.Union:
        case Kind.Type: {
          const named = ft as Named;
          const ref = named.name == t.name ? "" : "&";
          this.write(
            `${capitalize(f.name)}: convertOutput${named.name}(${ref}from.${
              fieldName(f, f.name)
            }),\n`,
          );
          break;
        }
        case Kind.Map: {
          const m = ft as Map;
          if (isObject(m.valueType)) {
            const n = (
              m.valueType.kind == Kind.Optional
                ? (m.valueType as Optional).type
                : m.valueType
            ) as Named;
            const ptr = m.valueType.kind == Kind.Optional ? "" : "Ptr";
            this.write(
              `${capitalize(f.name)}: ${$.convert}.Map${ptr}(from.${
                fieldName(
                  f,
                  f.name,
                )
              }, convertOutput${n.name}),\n`,
            );
          } else {
            this.write(
              `${capitalize(f.name)}: from.${fieldName(f, f.name)},\n`,
            );
          }
          break;
        }
        case Kind.List: {
          const l = ft as List;
          if (isObject(l.type)) {
            const n = unwrapKinds(l.type, Kind.Optional) as Named;
            const ptr = l.type.kind == Kind.Optional ? "" : "Ptr";
            this.write(
              `${capitalize(f.name)}: ${$.convert}.Slice${ptr}(from.${
                fieldName(
                  f,
                  f.name,
                )
              }, convertOutput${n.name}),\n`,
            );
          } else {
            this.write(
              `${capitalize(f.name)}: from.${fieldName(f, f.name)},\n`,
            );
          }
          break;
        }
      }
    });
    this.write(`\t}
  }\n\n`);
  }

  writeOutputUnion(union: Union) {
    this
      .write(
        `func convertOutput${union.name}(from *${union.name}) *pb.${union.name} {
      if from == nil {
        return nil
      }
      switch {\n`,
      );
    union.types.forEach((ut) => {
      this.write(`case from.${pascalCase(expandType(ut))} != nil:
            return &pb.${union.name}{\n`);
      switch (ut.kind) {
        case Kind.Union:
        case Kind.Type: {
          const t = ut as Named;
          this.write(`Value: &pb.${union.name}_${t.name}Value{\n`);
          this.write(
            `${t.name}Value: convertOutput${t.name}(from.${t.name}),\n`,
          );
          this.write(`},\n`);
          break;
        }
        case Kind.Enum: {
          const e = ut as Enum;
          this.write(`Value: &pb.${union.name}_${e.name}Value{\n`);
          this.write(`${e.name}Value: pb.${e.name}(*from.${e.name}),\n`);
          this.write(`},\n`);
          break;
        }
        case Kind.Primitive: {
          const p = ut as Primitive;
          this.write(`Value: &pb.${union.name}_${pascalCase(p.name)}Value{\n`);
          this.write(
            `${pascalCase(p.name)}Value: *from.${pascalCase(p.name)},\n`,
          );
          this.write(`},\n`);
          break;
        }
      }
      this.write(`}\n`);
    });
    this.write(`}
    return nil
    }\n\n`);
  }

  writeInputType($: ImportNames<any>, t: Type) {
    this
      .write(
        `func convertInput${t.name}(from *pb.${t.name}) (*${t.name}, error) {
      if from == nil {
        return nil, nil
      }
      var et ${$.errorz}.Tracker

      result := ${t.name}{\n`,
      );
    t.fields.forEach((f) => `${this.writeInputField($, f)}`);
    this.write(`\t}
    if errz := et.Errors(); errz != nil {
      return nil, errz
    }

    return &result, nil
  }\n\n`);
  }

  writeInput(
    $: ImportNames<any>,
    f: Field,
    from: string,
    allowPtr: boolean,
  ): string {
    let t = f.type;
    switch (t.kind) {
      case Kind.Optional: {
        let optType = unwrapKinds(t, Kind.Optional);
        switch (optType.kind) {
          case Kind.Alias: {
            const a = optType as Alias;
            const imp = this.aliases[a.name];
            if (imp) {
              return `${$.convert}.NillableEt(&et, ${from}.${capitalize(f.name)}, ${
                imp.parse || "Parse"
              })`;
            }
            optType = a.type;
          }
          /* falls through */
          case Kind.Primitive: {
            const prim = optType as Primitive;
            let wrapperStart = "";
            let wrapperEnd = "";
            switch (prim.name) {
              case PrimitiveName.I16:
                wrapperStart = `${$.tgrpc}.ConvertInputI16Ptr(`;
                wrapperEnd = ")";
                break;
              case PrimitiveName.I8:
                wrapperStart = `${$.tgrpc}.ConvertInputI8Ptr(`;
                wrapperEnd = ")";
                break;
              case PrimitiveName.U16:
                wrapperStart = `${$.tgrpc}.ConvertInputU16Ptr(`;
                wrapperEnd = ")";
                break;
              case PrimitiveName.U8:
                wrapperStart = `${$.tgrpc}.ConvertInputU8Ptr(`;
                wrapperEnd = ")";
                break;
              case PrimitiveName.DateTime:
                wrapperStart = `${$.tgrpc}.ConvertInputTimestamp(`;
                wrapperEnd = `)`;
                break;
            }
            return `${wrapperStart}${from}.${capitalize(f.name)}${wrapperEnd}`;
          }
          case Kind.Enum: {
            const e = optType as Enum;
            return `(*${e.name})(${from}.${capitalize(f.name)})`;
          }
          case Kind.Union:
          case Kind.Type: {
            const ft = optType as Named;
            return `${$.errorz}.Track(&et, convertInput${ft.name}, ${from}.${
              capitalize(f.name)
            })`;
          }
        }
        throw new Error(`unhandled type ${optType.kind} inside optional`);
      }
      case Kind.Alias: {
        const a = t as Alias;
        const imp = this.aliases[a.name];
        if (imp) {
          return `${$.errorz}.Track(&et, ${imp.parse || "Parse"}, ${from}.${
            capitalize(f.name)
          })`;
        }
        t = a.type;
      }
      /* falls through */
      case Kind.Primitive: {
        const prim = t as Primitive;
        let wrapperStart = "";
        let wrapperEnd = "";
        switch (prim.name) {
          case PrimitiveName.I16:
            wrapperStart = `int16(`;
            wrapperEnd = ")";
            break;

          case PrimitiveName.I8:
            wrapperStart = `int8(`;
            wrapperEnd = ")";
            break;

          case PrimitiveName.U16:
            wrapperStart = `uint16(`;
            wrapperEnd = ")";
            break;

          case PrimitiveName.U8:
            wrapperStart = `uint8(`;
            wrapperEnd = ")";
            break;

          case PrimitiveName.DateTime:
            wrapperEnd = `.AsTime()`;
            break;
        }
        return `${wrapperStart}${from}.${capitalize(f.name)}${wrapperEnd}`;
      }
      case Kind.Enum: {
        const e = t as Enum;
        return `${e.name}(${from}.${fieldName(f, f.name)})`;
      }
      case Kind.Union:
      case Kind.Type: {
        const ft = t as Named;
        const ptr = allowPtr ? "" : "*";
        return `${ptr}${$.errorz}.Track(&et, convertInput${ft.name}, ${from}.${
          fieldName(f, f.name)
        })`;
      }
      case Kind.Map: {
        const m = t as Map;
        if (isObject(m.valueType)) {
          const n = m.valueType as Named;
          return `${$.convert}.MapRefEt(&et, ${from}.${
            capitalize(
              f.name,
            )
          }, convertInput${n.name})`;
        } else {
          return `${from}.${capitalize(f.name)}`;
        }
      }
      case Kind.List: {
        const l = t as List;
        if (isObject(l.type)) {
          const n = l.type as Named;
          return `${$.convert}.SliceRefEt(&et, ${from}.${
            capitalize(
              f.name,
            )
          }, convertInput${n.name})`;
        } else {
          return `${from}.${capitalize(f.name)}`;
        }
      }
    }

    throw new Error(`unhandled type ${f.type.kind}`);
  }

  writeInputField($: ImportNames<any>, f: Field) {
    this.write(
      `${fieldName(f, f.name)}: ${
        this.writeInput($, f, "from", false)
      },\n`,
    );
  }

  writeInputUnion($: ImportNames<any>, union: Union) {
    this
      .write(
        `func convertInput${union.name}(from *pb.${union.name}) (*${union.name}, error) {
      if from == nil {
        return nil, nil
      }
      switch v := from.Value.(type) {\n`,
      );
    union.types.forEach((ut) => {
      if (ut.kind == Kind.Type) {
        const t = ut as Named;
        this.write(`case *pb.${union.name}_${pascalCase(expandType(ut))}Value:
          v${t.name}Value, err := convertInput${t.name}(v.${t.name}Value)
          return &${union.name}{
            ${t.name}: v${t.name}Value,
          }, err\n`);
      } else {
        this.write(`case *pb.${union.name}_${pascalCase(expandType(ut))}Value:
          return &${union.name}{\n`);
        switch (ut.kind) {
          case Kind.Union: {
            const t = ut as Named;
            this.write(`${t.name}: convertInput${t.name}(v.${t.name}Value),\n`);
            break;
          }
          case Kind.Enum: {
            const e = ut as Enum;
            this.write(
              `${e.name}: ${$.convert}.Ptr(${e.name}(v.${e.name}Value)),\n`,
            );
            break;
          }
          case Kind.Primitive: {
            const p = ut as Primitive;
            this.write(
              `${pascalCase(p.name)}: &v.${pascalCase(p.name)}Value,\n`,
            );
            break;
          }
        }
        this.write(`}, nil\n`);
      }
    });
    this.write(`\t}
    return nil, nil
  }\n\n`);
  }

  checkType(
    context: Context,
    a: AnyType,
    m: { [name: string]: AnyType },
    types: Set<string> = new Set(),
  ) {
    const importer = getImports(context);
    // Prevent stack overflow
    if (isNamed(a)) {
      const n = a as Named;
      if (types.has(n.name)) {
        return;
      }
      types.add(n.name);
    }

    switch (a.kind) {
      case Kind.Primitive: {
        const p = a as Primitive;
        if (p.name == PrimitiveName.DateTime) {
          importer.thirdparty(
            "google.golang.org/protobuf/types/known/timestamppb",
          );
        }
        break;
      }
      case Kind.Type: {
        const t = a as Type;
        m[t.name] = t;
        t.fields.forEach((f) => this.checkType(context, f.type, m, types));
        break;
      }
      case Kind.Union: {
        const u = a as Union;
        m[u.name] = u;
        u.types.forEach((t) => this.checkType(context, t, m, types));
        break;
      }
      case Kind.Alias: {
        const al = a as Alias;
        const imp = this.aliases[al.name];
        if (imp) {
          importer.add(imp);
        }
        m[al.name] = al;
        this.checkType(context, al.type, m, types);
        break;
      }
      case Kind.Map: {
        const ma = a as Map;
        this.checkType(context, ma.keyType, m, types);
        this.checkType(context, ma.valueType, m, types);
        break;
      }
      case Kind.List: {
        const l = a as List;
        this.checkType(context, l.type, m, types);
        break;
      }
      case Kind.Optional: {
        const o = a as Optional;
        this.checkType(context, o.type, m, types);
        break;
      }
    }
  }
}

function primitiveWrapperType($: ImportNames<any>, name: PrimitiveName): string {
  switch (name) {
    case PrimitiveName.String:
      return `*${$.wrapperspb}.StringValue`;
    case PrimitiveName.I64:
      return `*${$.wrapperspb}.Int64Value`;
    case PrimitiveName.I32:
    case PrimitiveName.I16:
    case PrimitiveName.I8:
      return `*${$.wrapperspb}.Int32Value`;
    case PrimitiveName.U64:
      return `*${$.wrapperspb}.UInt64Value`;
    case PrimitiveName.U32:
    case PrimitiveName.U16:
    case PrimitiveName.U8:
      return `*${$.wrapperspb}.UInt32Value`;
    case PrimitiveName.F64:
      return `*${$.wrapperspb}.DoubleValue`;
    case PrimitiveName.F32:
      return `*${$.wrapperspb}.FloatValue`;
    case PrimitiveName.Bool:
      return `*${$.wrapperspb}.BoolValue`;
    case PrimitiveName.Bytes:
      return `*${$.wrapperspb}.BytesValue`;
  }

  return "unknown";
}
