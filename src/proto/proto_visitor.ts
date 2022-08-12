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
  Kind,
  Named,
  Optional,
  Type,
  List as ListType,
  Map as MapType,
  AnyType,
  Primitive,
  PrimitiveName,
  Stream,
  Writer,
  Enum,
  Alias,
} from "@apexlang/core/model";
import {
  snakeCase,
  pascalCase,
  formatComment,
  convertOperationToType,
  ExposedTypesVisitor,
  isService,
  unwrapKinds,
} from "../utils";

interface FieldNumDirective {
  value: number;
}

function shouldIncludeHandler(context: Context): boolean {
  const role = context.role;
  return role?.annotation("service") != undefined;
}

export class ProtoVisitor extends BaseVisitor {
  private requestTypes = new Array<Type>();
  private exposedTypes = new Set<string>();
  private valueTypes = new Set<string>();

  visitNamespaceBefore(context: Context) {
    const ns = context.namespace;
    const exposedTypes = new ExposedTypesVisitor(this.writer);
    ns.accept(context, exposedTypes);
    this.exposedTypes = exposedTypes.found;
    const wrapperTypes = new WrapperTypesVisitor(this.writer);
    ns.accept(context, wrapperTypes);
    this.valueTypes = wrapperTypes.found;
  }

  visitNamespaceAfter(context: Context): void {
    for (let request of this.requestTypes) {
      request.accept(context.clone({ type: request }), this);
    }
  }

  visitNamespace(context: Context): void {
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

  visitRole(context: Context) {
    if (!shouldIncludeHandler(context)) {
      return;
    }
    const visitor = new RoleVisitor(
      this.writer,
      this.requestTypes,
      this.exposedTypes
    );
    context.role.accept(context, visitor);
  }

  visitTypeBefore(context: Context): void {
    const { type } = context;
    if (!this.exposedTypes.has(type.name)) {
      return;
    }
    this.write(formatComment("// ", type.description));
    this.write(`message ${type.name} {\n`);
  }

  visitTypeField(context: Context): void {
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
      `  ${typeSignature(field.type)} ${snakeCase(field.name)} = ${
        fieldnum.value
      };\n`
    );
  }

  visitTypeAfter(context: Context): void {
    const { type } = context;
    if (!this.exposedTypes.has(type.name)) {
      return;
    }
    this.write(`}\n\n`);
  }

  visitEnum(context: Context): void {
    const e = context.enum;
    if (!this.exposedTypes.has(e.name)) {
      return;
    }
    this.write(formatComment("// ", e.description));
    this.write(`enum ${pascalCase(e.name)} {\n`);
    e.values.forEach((ev) => {
      this.write(formatComment("  // ", ev.description));
      this.write(`  ${snakeCase(ev.name).toUpperCase()} = ${ev.index};\n`);
    });
    this.write(`}\n\n`);
    if (!this.valueTypes.has(e.name)) {
      return;
    }
    this.write(`message ${pascalCase(e.name)}Value {\n`);
    this.write(`  ${pascalCase(e.name)} value = 1;\n`);
    this.write(`}\n\n`);
  }

  visitUnion(context: Context): void {
    const u = context.union;
    if (!this.exposedTypes.has(u.name)) {
      return;
    }
    this.write(formatComment("// ", u.description));
    this.write(`message ${pascalCase(u.name)} {\n`);
    this.write(`  oneof value {\n`);
    let i = 0;
    for (let t of u.types) {
      const n = t as Named;
      i++;
      this.write(
        `    ${typeSignature(t)} ${snakeCase(n.name)}_value = ${i};\n`
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
    exposedTypes: Set<string>
  ) {
    super(writer);
    this.requestTypes = requestTypes;
    this.exposedTypes = exposedTypes;
  }
  visitRoleBefore(context: Context): void {
    if (!shouldIncludeHandler(context)) {
      return;
    }
    const { role } = context;
    this.write(formatComment("// ", role.description));
    this.write(`service ${role.name} {\n`);
  }

  visitOperationBefore(context: Context): void {
    if (!shouldIncludeHandler(context)) {
      return;
    }
    const { operation } = context;
    this.write(formatComment("  // ", operation.description));
    this.write(`  rpc ${pascalCase(operation.name)}(`);
    if (operation.parameters.length == 0) {
      this.write(`google.protobuf.Empty`);
    } else if (operation.unary) {
      const param = operation.parameters[0];
      const pt = unwrapKinds(param.type, Kind.Alias);
      switch (pt.kind) {
        case Kind.Primitive:
          const p = pt as Primitive;
          this.write(primitiveMessageType(p.name));
          break;
        case Kind.Enum:
          const e = pt as Enum;
          this.write(`${e.name}Value`);
          break;
        default:
          this.write(`${typeSignature(pt)}`);
          break;
      }
    } else {
      const argsType = convertOperationToType(
        context.getType.bind(context),
        operation
      );
      this.requestTypes.push(argsType);
      this.exposedTypes.add(argsType.name);
      this.write(`${pascalCase(operation.name)}Args`);
    }
    this.write(`) returns (`);
    const ot = unwrapKinds(operation.type, Kind.Alias);
    switch (ot.kind) {
      case Kind.Void:
        this.write(`google.protobuf.Empty`);
        break;
      case Kind.Primitive:
        const p = ot as Primitive;
        this.write(primitiveMessageType(p.name));
        break;
      case Kind.Enum:
        const e = ot as Enum;
        this.write(`${e.name}Value`);
        break;
      default:
        this.write(`${typeSignature(ot)}`);
        break;
    }
    this.write(`) {};\n`);
  }

  visitOperationAfter(context: Context): void {
    if (!shouldIncludeHandler(context)) {
      return;
    }
  }

  visitRoleAfter(context: Context): void {
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
  ["any", "google.protobuf.Any"],
  ["value", "google.protobuf.Any"],
]);

function typeSignature(type: AnyType): string {
  switch (type.kind) {
    case Kind.Primitive:
      const p = type as Primitive;
      return scalarTypeMap.get(p.name) || p.name;

    case Kind.Alias:
      const a = type as Alias;
      return typeSignature(a.type);

    case Kind.Type:
    case Kind.Enum:
    case Kind.Union:
      const named = type as Named;
      return named.name;

    case Kind.List:
      return `repeated ${typeSignature((type as ListType).type)}`;

    case Kind.Map:
      const map = type as MapType;
      // TODO: Map keys cannot be float/double, bytes or message types
      // TODO: Map values cannot be repeated
      return `map<${typeSignature(map.keyType)}, ${typeSignature(
        map.valueType
      )}>`;

    case Kind.Optional:
      return `optional ${typeSignature((type as Optional).type)}`;

    case Kind.Stream:
      return `stream ${typeSignature((type as Stream).type)}`;

    default:
      throw new Error("unexpected kind: " + type.kind);
  }
}

class ImportVisitor extends BaseVisitor {
  hasObjects: boolean = false;
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
      case Kind.Primitive:
        const p = t as Primitive;
        switch (p.name) {
          case PrimitiveName.DateTime:
            this.addImport("google/protobuf/timestamp.proto");
            break;
          case PrimitiveName.Any:
            this.addImport("google/protobuf/any.proto");
            break;
        }
        break;
    }
  }

  private checkSingleType(t: AnyType) {
    switch (t.kind) {
      case Kind.Primitive:
        const p = t as Primitive;
        switch (p.name) {
          case PrimitiveName.String:
            this.addImport("google/protobuf/wrappers.proto");
            break;
        }
        break;
    }
  }

  visitOperation(context: Context): void {
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

  visitParameter(context: Context): void {
    if (!shouldIncludeHandler(context)) {
      return;
    }
    const { parameter } = context;
    this.checkType(parameter.type);
  }

  visitType(context: Context): void {
    const { type } = context;
    this.checkType(type);
  }

  visitTypeField(context: Context): void {
    const { field } = context;
    this.checkType(field.type);
  }

  visitNamespaceAfter(context: Context): void {
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
      return `google.protobuf.Any`;
  }

  return "unknown";
}

export class WrapperTypesVisitor extends BaseVisitor {
  found: Set<string> = new Set<string>();

  visitOperation(context: Context): void {
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
