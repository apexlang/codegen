import { Named } from "@apexlang/core/dist/ast";
import {
  BaseVisitor,
  Context,
  Type,
  Writer,
  Kind,
  AnyType,
  Primitive,
  PrimitiveName,
  List,
  Map,
  Optional,
} from "@apexlang/core/model";
import { SchemaObject, ReferenceObject } from "openapi3-ts";
import { convertArrayToObject } from "../utils/index.js";

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
type JsonSchemaRoot = SchemaObject &
  ReferenceType &
  PatternProperties &
  Definitions;
type JsonSchemaDef = SchemaObject & ReferenceType & PatternProperties;

export class JsonSchemaVisitor extends BaseVisitor {
  protected path: string = "";
  protected method: string = "";
  protected schema: JsonSchemaRoot = {
    $schema: "https://json-schema.org/draft/2020-12/schema",
  };

  constructor(writer: Writer) {
    super(writer);
  }

  visitNamespace(context: Context): void {
    context.config;
    this.schema.title = context.namespace.name;
  }

  visitNamespaceAfter(context: Context): void {
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
    const def: SchemaObject | ReferenceObject = {};
    if (context.field.description) {
      def.description = context.field.description;
    }
    let [_def, isRequired] = decorateType(def, context.field.type);
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
    let arr: SchemaObject[] = [];
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
      }
    );

    const unionObject: SchemaObject | ReferenceObject = {
      oneOf: arr,
    };

    const schema: SchemaObject = {
      description: union.description,
      type: JsonSchemaType.Object,
      properties: unionObject,
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
      name: context.alias.name,
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
  def: JsonSchemaDef,
  typ: AnyType
): [SchemaObject, boolean] {
  let required = true;
  switch (typ.kind) {
    case Kind.List: {
      const t = typ as List;
      def.type = JsonSchemaType.Array;
      const [listType, _isRequired] = decorateType({}, t.type);
      def.items = listType;
      break;
    }
    case Kind.Map: {
      const t = typ as Map;
      def.type = JsonSchemaType.Object;
      if (!isApexStringType(t.keyType))
        throw new Error(
          "Can not represent maps with non-string key types in JSON Schema"
        );
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
            `Unhandled primitive type conversion for type: ${t.name}`
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
