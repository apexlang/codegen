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
} from "@apexlang/core/model";
import {
  snakeCase,
  pascalCase,
  formatComment,
  isVoid,
  convertOperationToType,
  ExposedTypesVisitor,
  isPrimitive,
} from "../utils";

interface FieldNumDirective {
  value: number;
}

function shouldIncludeHandler(context: Context): boolean {
  const role = context.role;
  return role?.annotation("service") != undefined;
}

export class GRPCVisitor extends BaseVisitor {
  private requestTypes = new Array<Type>();
  private exposedTypes = new Set<string>();

  visitNamespaceBefore(context: Context) {
    const ns = context.namespace;
    const visitor = new ExposedTypesVisitor(this.writer);
    ns.accept(context, visitor);
    this.exposedTypes = visitor.found;
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

  visitRoleBefore(context: Context): void {
    if (!shouldIncludeHandler(context)) {
      return;
    }
    const { role } = context;
    this.write(formatComment("// ", role.description));
    this.write(`service ${role.name} {\n`);
  }

  visitRoleAfter(context: Context): void {
    if (!shouldIncludeHandler(context)) {
      return;
    }
    this.write(`}\n\n`);
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
      this.write(`${typeSignature(operation.parameters[0].type)}`);
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
    if (isVoid(operation.type)) {
      this.write(`google.protobuf.Empty`);
    } else if (isPrimitive(operation.type)) {
      const p = operation.type as Primitive;
      switch (p.name) {
        case PrimitiveName.String:
          this.write(`google.protobuf.StringValue`);
          break;
        // TODO
      }
    } else {
      this.write(`${typeSignature(operation.type)}`);
    }
    this.write(`) {};\n`);
  }

  visitOperationAfter(context: Context): void {
    if (!shouldIncludeHandler(context)) {
      return;
    }
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

  visitEnumBefore(context: Context): void {
    const e = context.enum;
    if (!this.exposedTypes.has(e.name)) {
      return;
    }
    this.write(formatComment("// ", e.description));
    this.write(`enum ${pascalCase(e.name)} {\n`);
  }

  visitEnumValue(context: Context): void {
    const e = context.enum;
    if (!this.exposedTypes.has(e.name)) {
      return;
    }
    const ev = context.enumValue;
    this.write(formatComment("  // ", ev.description));
    this.write(`  ${snakeCase(ev.name).toUpperCase()} = ${ev.index};\n`);
  }

  visitEnumAfter(context: Context): void {
    const e = context.enum;
    if (!this.exposedTypes.has(e.name)) {
      return;
    }
    this.write(`}\n\n`);
  }

  visitUnion(context: Context): void {
    const u = context.union;
    if (!this.exposedTypes.has(u.name)) {
      return;
    }
    this.write(formatComment("// ", u.description));
    this.write(`message ${pascalCase(u.name)} {\n`);
    this.write(`  oneof oneof {\n`);
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
  ["raw", "google.protobuf.Any"],
]);

function typeSignature(type: AnyType): string {
  switch (type.kind) {
    case Kind.Primitive:
      const p = type as Primitive;
      return scalarTypeMap.get(p.name) || p.name;
    case Kind.Type:
    case Kind.Enum:
    case Kind.Union:
    case Kind.Alias:
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
          // TODO: Any, Raw
          //case PrimitiveName.Any:
          //  break;
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
