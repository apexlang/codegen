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

import { Named } from "https://deno.land/x/apex_core@v0.1.0/ast/mod.ts";
import {
  AnyType,
  BaseVisitor,
  Context,
  Kind,
  List,
  Map,
  Optional,
  Primitive,
  PrimitiveName,
  Type,
  Writer,
} from "https://deno.land/x/apex_core@v0.1.0/model/mod.ts";
import {
  ArraySchemaObject,
  ReferenceObject,
  SchemaObject,
} from "https://deno.land/x/openapi@0.1.0/mod.ts";
import { convertArrayToObject } from "../utils/mod.ts";

interface Definitions {
  $defs?: DefinitionMap;
}

interface ReferenceType {
  $ref?: string;
}

interface DefinitionMap {
  [path: string]: SchemaObject | DefinitionMap;
}

interface PatternProperties {
  patternProperties?: {
    [propertyPattern: string]: SchemaObject | ReferenceObject;
  };
}

// Augmented JsonSchema type with parts not included in the library we have available.
type JsonSchemaRoot =
  & SchemaObject
  & ReferenceType
  & PatternProperties
  & Definitions;
type JsonSchemaDef = SchemaObject & ReferenceType & PatternProperties;
type Mutable<T> = { -readonly [P in keyof T]: T[P] };

export class JsonSchemaVisitor extends BaseVisitor {
  protected path = "";
  protected method = "";
  protected schema: Mutable<JsonSchemaRoot> = {};

  constructor(writer: Writer) {
    super(writer);
  }

  visitNamespace(context: Context): void {
    context.config;
    this.schema.title = context.namespace.name;
  }

  visitNamespaceAfter(_context: Context): void {
    this.write(JSON.stringify(this.schema.valueOf(), null, 2));
  }

  visitType(context: Context): void {
    const visitor = new TypeVisitor(this.writer);
    context.type.accept(context, visitor);

    if (!this.schema.$defs) {
      this.schema.$defs = {};
    }
    this.schema.$defs[context.type?.name!] = visitor.def;
  }

  visitEnum(context: Context): void {
    const visitor = new EnumVisitor(this.writer);
    context.enum.accept(context, visitor);
    if (!this.schema.$defs) {
      this.schema.$defs = {};
    }
    this.schema.$defs[context.enum?.name!] = visitor.def;
  }

  visitUnion(context: Context): void {
    const visitor = new UnionVisitor(this.writer);
    context.union.accept(context, visitor);
    if (!this.schema.$defs) {
      this.schema.$defs = {};
    }
    this.schema.$defs[context.union?.name!] = visitor.def;
  }

  visitAlias(context: Context): void {
    const visitor = new AliasVisitor(this.writer);
    context.alias.accept(context, visitor);
    if (!this.schema.$defs) {
      this.schema.$defs = {};
    }
    this.schema.$defs[context.alias.name] = visitor.def;
  }
}

class TypeVisitor extends BaseVisitor {
  def: SchemaObject = { properties: {}, required: [] };

  constructor(writer: Writer) {
    super(writer);
  }

  visitTypeField(context: Context): void {
    const def: Mutable<SchemaObject | ReferenceObject> = {};
    if (context.field.description) {
      def.description = context.field.description;
    }
    const [_def, isRequired] = decorateType(def, context.field.type);
    if (isRequired) {
      this.def.required!.push(context.field.name!);
    }

    this.def.properties![context.field.name] = def;
  }
}

class EnumVisitor extends BaseVisitor {
  def: SchemaObject = { enum: [] };

  constructor(writer: Writer) {
    super(writer);
  }

  visitEnum(context: Context): void {
    const schema: SchemaObject = {
      description: context.enum.description,
      type: JsonSchemaType.String,
      enum: context.enum.values.map((ev) => ev.display || ev.name),
    };
    this.def = schema;
  }
}

class UnionVisitor extends BaseVisitor {
  def: SchemaObject = { properties: {} };

  constructor(writer: Writer) {
    super(writer);
  }

  visitUnion(context: Context): void {
    const { union } = context;
    const arr: SchemaObject[] = [];
    convertArrayToObject(
      union.types,
      (t: AnyType) => {
        switch (t.kind) {
          case Kind.Union:
          case Kind.Type:
          case Kind.Enum:
            return (t as unknown as Named).name.value;
          case Kind.Primitive:
            return (t as Primitive).name;
        }
        return "unknown";
      },
      (t: AnyType) => {
        const [def] = decorateType({}, t);
        arr.push(def);
      },
    );

    const schema: SchemaObject = {
      description: union.description,
      type: JsonSchemaType.Object,
      oneOf: arr,
    };
    this.def = schema;
  }
}

class AliasVisitor extends BaseVisitor {
  def: SchemaObject = {};

  constructor(writer: Writer) {
    super(writer);
  }

  visitAlias(context: Context): void {
    const schema: SchemaObject = {
      description: context.alias.description,
    };

    decorateType(schema, context.alias.type);

    this.def = schema;
  }
}

enum JsonSchemaType {
  Integer = "integer",
  Number = "number",
  String = "string",
  Boolean = "boolean",
  Object = "object",
  Null = "null",
  Array = "array",
}

enum JsonSchemaTypeFormat {
  Int32 = "int32",
  Int64 = "int64",
  Float = "float",
  Double = "double",
  Byte = "byte",
  Binary = "binary",
  Date = "date",
  DateTime = "date-time",
  Password = "password",
}

function decorateType(
  def: Mutable<JsonSchemaDef>,
  typ: AnyType,
): [SchemaObject, boolean] {
  let required = true;
  switch (typ.kind) {
    case Kind.List: {
      const t = typ as List;
      def = def as Mutable<ArraySchemaObject>;
      def.type = JsonSchemaType.Array;
      const [listType, _isRequired] = decorateType({}, t.type);
      def.items = listType;
      break;
    }
    case Kind.Map: {
      const t = typ as Map;
      def.type = JsonSchemaType.Object;
      if (!isApexStringType(t.keyType)) {
        throw new Error(
          "Can not represent maps with non-string key types in JSON Schema",
        );
      }
      const [valueType, _isRequired] = decorateType({}, t.valueType);
      def.patternProperties = { ".*": valueType };
      break;
    }
    case Kind.Optional: {
      const t = typ as Optional;
      required = false;
      decorateType(def, t.type);
      break;
    }
    case Kind.Alias:
    case Kind.Enum:
    case Kind.Type:
    case Kind.Union: {
      const t = typ as Type;
      def.$ref = `#/$defs/${t.name}`;
      break;
    }
    case Kind.Primitive: {
      const t = typ as Primitive;
      switch (t.name) {
        case PrimitiveName.Bool:
          def.type = JsonSchemaType.Boolean;
          break;
        case PrimitiveName.Bytes:
          def.type = JsonSchemaType.Array;
          def = def as Mutable<ArraySchemaObject>;
          def.items = { type: "number" };
          break;
        case PrimitiveName.DateTime:
          def.type = JsonSchemaType.String;
          def.format = JsonSchemaTypeFormat.DateTime;
          break;
        case PrimitiveName.F32:
        case PrimitiveName.F64:
          def.type = JsonSchemaType.Number;
          break;
        case PrimitiveName.I8:
        case PrimitiveName.I16:
        case PrimitiveName.I32:
        case PrimitiveName.I64:
        case PrimitiveName.U8:
        case PrimitiveName.U16:
        case PrimitiveName.U32:
        case PrimitiveName.U64:
          def.type = JsonSchemaType.Integer;
          break;
        case PrimitiveName.String:
          def.type = JsonSchemaType.String;
          break;
        default:
          throw new Error(
            `Unhandled primitive type conversion for type: ${t.name}`,
          );
      }
      break;
    }
    default: {
      throw new Error(`Unhandled type conversion for type: ${typ.kind}`);
    }
  }
  return [def, required];
}

function isApexStringType(typ: AnyType): boolean {
  if (typ.kind === Kind.Primitive) {
    const t = typ as Primitive;
    return t.name == PrimitiveName.String;
  }
  return false;
}
