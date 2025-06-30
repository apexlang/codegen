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
  Alias,
  AnyType,
  BaseVisitor,
  Context,
  Enum,
  Kind,
  List as ListType,
  Map as MapType,
  Named,
  Optional,
  Primitive,
  PrimitiveName,
  Stream,
  Type,
  Writer,
} from "../../deps/@apexlang/core/model/mod.ts";
import {
  convertOperationToType,
  ExposedTypesVisitor,
  formatComment,
  isService,
  pascalCase,
  snakeCase,
  unwrapKinds,
} from "../utils/mod.ts";

interface FieldNumDirective {
  value: number;
}

function shouldIncludeHandler(context: Context): boolean {
  const { interface: iface } = context;
  return iface.annotation("service") != undefined;
}

export class ProtoVisitor extends BaseVisitor {
  private requestTypes = new Array<Type>();
  private exposedTypes = new Set<string>();
  private valueTypes = new Set<string>();

  public override visitNamespaceBefore(context: Context) {
    const ns = context.namespace;
    const exposedTypes = new ExposedTypesVisitor(this.writer);
    ns.accept(context, exposedTypes);
    this.exposedTypes = exposedTypes.found;
    const wrapperTypes = new WrapperTypesVisitor(this.writer);
    ns.accept(context, wrapperTypes);
    this.valueTypes = wrapperTypes.found;
  }

  public override visitNamespaceAfter(context: Context): void {
    for (const request of this.requestTypes) {
      request.accept(context.clone({ type: request }), this);
    }
  }

  public override visitNamespace(context: Context): void {
    const ns = context.namespace;
    this.write(`syntax = "proto3";

package ${ns.name};\n\n`);
    const options = context.config.options as { [name: string]: string };
    if (options && Object.keys(options).length > 0) {
      Object.keys(options).forEach((name) => {
        this.write(`option ${name} = "${options[name]}";\n`);
      });
      this.write(`\n`);
    }
    const visitor = new ImportVisitor(this.writer);
    ns.accept(context, visitor);
  }

  public override visitInterface(context: Context) {
    if (!shouldIncludeHandler(context)) {
      return;
    }
    const visitor = new RoleVisitor(
      this.writer,
      this.requestTypes,
      this.exposedTypes,
    );
    context.interface.accept(context, visitor);
  }

  public override visitTypeBefore(context: Context): void {
    const { type } = context;
    if (!this.exposedTypes.has(type.name)) {
      return;
    }
    this.write(formatComment("// ", type.description));
    this.write(`message ${type.name} {\n`);
  }

  public override visitTypeField(context: Context): void {
    const { type, field } = context;
    if (!this.exposedTypes.has(type.name)) {
      return;
    }
    const fieldnumAnnotation = field.annotation("n");
    if (!fieldnumAnnotation) {
      throw new Error(`${type.name}.${field.name} requires a @n`);
    }
    const fieldnum = fieldnumAnnotation.convert<FieldNumDirective>();
    this.write(formatComment("  // ", field.description));
    this.write(
      `  ${typeSignature(field.type)} ${
        snakeCase(field.name)
      } = ${fieldnum.value} [json_name="${field.name}"];\n`,
    );
  }

  public override visitTypeAfter(context: Context): void {
    const { type } = context;
    if (!this.exposedTypes.has(type.name)) {
      return;
    }
    this.write(`}\n\n`);
  }

  public override visitEnum(context: Context): void {
    const e = context.enum;
    if (!this.exposedTypes.has(e.name)) {
      return;
    }
    this.write(formatComment("// ", e.description));
    this.write(`enum ${pascalCase(e.name)} {\n`);
    e.values.forEach((ev) => {
      this.write(formatComment("  // ", ev.description));
      this.write(
        `  ${snakeCase(e.name).toUpperCase()}_${
          snakeCase(ev.name).toUpperCase()
        } = ${ev.index};\n`,
      );
    });
    this.write(`}\n\n`);
    if (!this.valueTypes.has(e.name)) {
      return;
    }
    this.write(`message ${pascalCase(e.name)}Value {\n`);
    this.write(`  ${pascalCase(e.name)} value = 1;\n`);
    this.write(`}\n\n`);
  }

  public override visitUnion(context: Context): void {
    const u = context.union;
    if (!this.exposedTypes.has(u.name)) {
      return;
    }
    this.write(formatComment("// ", u.description));
    this.write(`message ${pascalCase(u.name)} {\n`);
    this.write(`  oneof value {\n`);

    for (const member of u.members) {
      const n = member.type as Named;

      const fieldnumAnnotation = member.annotation("n");
      if (!fieldnumAnnotation) {
        throw new Error(`${u.name}.${n.name} requires a @n`);
      }
      const fieldnum = fieldnumAnnotation.convert<FieldNumDirective>();

      this.write(
        `    ${typeSignature(member.type)} ${
          snakeCase(n.name)
        }_value = ${fieldnum.value};\n`,
      );
    }
    this.write(`  }\n`);
    this.write(`}\n\n`);
  }
}

class RoleVisitor extends BaseVisitor {
  private requestTypes = new Array<Type>();
  private exposedTypes = new Set<string>();

  constructor(
    writer: Writer,
    requestTypes: Array<Type>,
    exposedTypes: Set<string>,
  ) {
    super(writer);
    this.requestTypes = requestTypes;
    this.exposedTypes = exposedTypes;
  }

  public override visitInterfaceBefore(context: Context): void {
    if (!shouldIncludeHandler(context)) {
      return;
    }
    const { interface: iface } = context;
    this.write(formatComment("// ", iface.description));
    this.write(`service ${iface.name} {\n`);
  }

  public override visitOperationBefore(context: Context): void {
    if (!shouldIncludeHandler(context)) {
      return;
    }
    const { interface: iface, operation } = context;
    this.write(formatComment("  // ", operation.description));
    this.write(`  rpc ${pascalCase(operation.name)}(`);
    if (operation.parameters.length == 0) {
      this.write(`google.protobuf.Empty`);
    } else if (operation.unary) {
      const param = operation.parameters[0];
      const pt = unwrapKinds(param.type, Kind.Alias);
      switch (pt.kind) {
        case Kind.Primitive: {
          const p = pt as Primitive;
          this.write(primitiveMessageType(p.name));
          break;
        }
        case Kind.Enum: {
          const e = pt as Enum;
          this.write(`${e.name}Value`);
          break;
        }
        default: {
          this.write(`${typeSignature(pt)}`);
          break;
        }
      }
    } else {
      const argsType = convertOperationToType(
        context.getType.bind(context),
        iface,
        operation,
      );
      this.requestTypes.push(argsType);
      this.exposedTypes.add(argsType.name);
      this.write(`${argsType.name}`);
    }
    this.write(`) returns (`);
    const ot = unwrapKinds(operation.type, Kind.Alias);
    switch (ot.kind) {
      case Kind.Void:
        this.write(`google.protobuf.Empty`);
        break;
      case Kind.Primitive: {
        const p = ot as Primitive;
        this.write(primitiveMessageType(p.name));
        break;
      }
      case Kind.Enum: {
        const e = ot as Enum;
        this.write(`${e.name}Value`);
        break;
      }
      default: {
        this.write(`${typeSignature(ot)}`);
        break;
      }
    }
    this.write(`) {};\n`);
  }

  public override visitOperationAfter(context: Context): void {
    if (!shouldIncludeHandler(context)) {
      return;
    }
  }

  public override visitInterfaceAfter(context: Context): void {
    if (!shouldIncludeHandler(context)) {
      return;
    }
    this.write(`}\n\n`);
  }
}

const scalarTypeMap = new Map<string, string>([
  ["i8", "int32"],
  ["i16", "int32"],
  ["i32", "int32"],
  ["i64", "int64"],
  ["u8", "uint32"],
  ["u16", "uint32"],
  ["u32", "uint32"],
  ["u64", "uint64"],
  ["f32", "float"],
  ["f64", "double"],
  ["string", "string"],
  ["bytes", "bytes"],
  ["boolean", "bool"],
  ["date", "google.protobuf.Timestamp"],
  ["datetime", "google.protobuf.Timestamp"],
  ["any", "google.protobuf.Value"],
  ["value", "google.protobuf.Value"],
]);

function typeSignature(type: AnyType): string {
  switch (type.kind) {
    case Kind.Primitive: {
      const p = type as Primitive;
      return scalarTypeMap.get(p.name) || p.name;
    }
    case Kind.Alias: {
      const a = type as Alias;
      return typeSignature(a.type);
    }
    case Kind.Type:
    case Kind.Enum:
    case Kind.Union: {
      const named = type as Named;
      return named.name;
    }
    case Kind.List: {
      return `repeated ${typeSignature((type as ListType).type)}`;
    }
    case Kind.Map: {
      const map = type as MapType;
      // TODO: Map keys cannot be float/double, bytes or message types
      // TODO: Map values cannot be repeated
      return `map<${typeSignature(map.keyType)}, ${
        typeSignature(
          map.valueType,
        )
      }>`;
    }
    case Kind.Optional: {
      return `optional ${typeSignature((type as Optional).type)}`;
    }
    case Kind.Stream: {
      return `stream ${typeSignature((type as Stream).type)}`;
    }
    default:
      throw new Error("unexpected kind: " + type.kind);
  }
}

class ImportVisitor extends BaseVisitor {
  hasObjects = false;
  found: Set<string> = new Set<string>();

  private addImport(name: string): void {
    if (!this.found.has(name)) {
      this.found.add(name);
      this.write(`import "${name}";\n`);
    }
  }

  private checkType(t: AnyType) {
    switch (t.kind) {
      case Kind.Void:
        this.addImport("google/protobuf/empty.proto");
        break;
      case Kind.Primitive: {
        const p = t as Primitive;
        switch (p.name) {
          case PrimitiveName.DateTime:
            this.addImport("google/protobuf/timestamp.proto");
            break;
          case PrimitiveName.Any:
          case PrimitiveName.Value:
            this.addImport("google/protobuf/struct.proto");
            break;
        }
        break;
      }
    }
  }

  private checkSingleType(t: AnyType) {
    switch (t.kind) {
      case Kind.Primitive: {
        const p = t as Primitive;
        switch (p.name) {
          case PrimitiveName.String:
            this.addImport("google/protobuf/wrappers.proto");
            break;
        }
        break;
      }
    }
  }

  public override visitOperation(context: Context): void {
    if (!shouldIncludeHandler(context)) {
      return;
    }
    const { operation } = context;
    if (operation.isUnary()) {
      this.checkSingleType(operation.parameters[0]);
    }
    this.checkType(operation.type);
    this.checkSingleType(operation.type);
  }

  public override visitParameter(context: Context): void {
    if (!shouldIncludeHandler(context)) {
      return;
    }
    const { parameter } = context;
    this.checkType(parameter.type);
  }

  public override visitType(context: Context): void {
    const { type } = context;
    this.checkType(type);
  }

  public override visitTypeField(context: Context): void {
    const { field } = context;
    this.checkType(field.type);
  }

  public override visitNamespaceAfter(_context: Context): void {
    if (this.found.size > 0) {
      this.write(`\n`);
    }
  }
}

function primitiveMessageType(name: PrimitiveName): string {
  switch (name) {
    case PrimitiveName.String:
      return `google.protobuf.StringValue`;
    case PrimitiveName.I64:
      return `google.protobuf.Int64Value`;
    case PrimitiveName.I32:
    case PrimitiveName.I16:
    case PrimitiveName.I8:
      return `google.protobuf.Int32Value`;
    case PrimitiveName.U64:
      return `google.protobuf.UInt64Value`;
    case PrimitiveName.U32:
    case PrimitiveName.U16:
    case PrimitiveName.U8:
      return `google.protobuf.UInt32Value`;
    case PrimitiveName.F64:
      return `google.protobuf.DoubleValue`;
    case PrimitiveName.F32:
      return `google.protobuf.FloatValue`;
    case PrimitiveName.Bool:
      return `google.protobuf.BoolValue`;
    case PrimitiveName.Bytes:
      return `google.protobuf.BytesValue`;
    case PrimitiveName.Any:
    case PrimitiveName.Value:
      return `google.protobuf.Value`;
  }

  return "unknown";
}

export class WrapperTypesVisitor extends BaseVisitor {
  found: Set<string> = new Set<string>();

  public override visitOperation(context: Context): void {
    if (!isService(context)) {
      return;
    }
    const { operation } = context;
    if (operation.unary) {
      const p = operation.parameters[0];
      if (p.type.kind == Kind.Enum) {
        this.found.add((p.type as Named).name);
      }
    }
    if (operation.type.kind == Kind.Enum) {
      this.found.add((operation.type as Named).name);
    }
  }
}

// Backward compatability
export class GRPCVisitor extends ProtoVisitor {}
