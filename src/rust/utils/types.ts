import {
  Kind,
  Named,
  AnyType,
  Map,
  PrimitiveName,
  List,
  Optional,
  Union,
  Type,
  Primitive,
  ObjectMap,
  Enum,
  Alias,
} from "@apexlang/core/model";
import { rustifyCaps } from "./index.js";

export function apexToRustType(typ: AnyType, config: ObjectMap<any>): string {
  switch (typ.kind) {
    case Kind.List: {
      const t = typ as List;
      const itemType = apexToRustType(t.type, config);
      return `Vec<${itemType}>`;
    }
    case Kind.Map: {
      const t = typ as Map;

      const keyType = apexToRustType(t.keyType, config);
      const valueType = apexToRustType(t.valueType, config);

      return `std::collections::HashMap<${keyType},${valueType}>`;
    }
    case Kind.Optional: {
      const t = typ as Optional;
      const innerType = apexToRustType(t.type, config);
      return `Option<${innerType}>`;
    }
    case Kind.Union:
    case Kind.Enum:
    case Kind.Alias:
    case Kind.Type: {
      return rustifyCaps((typ as Named).name);
    }
    case Kind.Void: {
      return "()";
    }
    case Kind.Primitive: {
      const t = typ as Primitive;
      return primitiveToRust(t, config);
    }
    default: {
      throw new Error(`Unhandled type conversion for type: ${typ.kind}`);
    }
  }
}

function primitiveToRust(t: Primitive, config: ObjectMap<any>): string {
  switch (t.name) {
    case PrimitiveName.Bool:
      return "bool";
    case PrimitiveName.Bytes:
      return config.bytes ? config.bytes : "Vec<u8>";
    case PrimitiveName.DateTime:
      return "time::OffsetDateTime";
    case PrimitiveName.F32:
      return "f32";
    case PrimitiveName.F64:
      return "f64";
    case PrimitiveName.U64:
      return "u64";
    case PrimitiveName.U32:
      return "u32";
    case PrimitiveName.U16:
      return "u16";
    case PrimitiveName.U8:
      return "u8";
    case PrimitiveName.I64:
      return "i64";
    case PrimitiveName.I32:
      return "i32";
    case PrimitiveName.I16:
      return "i16";
    case PrimitiveName.I8:
      return "i8";
    case PrimitiveName.String:
      return "String";
    case PrimitiveName.Any:
      return config.anyType ? config.anyType.toString() : "serde_value::Value";
    default:
      throw new Error(
        `Unhandled primitive type conversion for type: ${t.name}`
      );
  }
}

export function defaultValue(type: AnyType, config: ObjectMap<any>): string {
  switch (type.kind) {
    case Kind.Optional:
      return "None";
    case Kind.List:
      return "Vec::new()";
    case Kind.Map:
      return "std::collections::HashMap::new()";
    case Kind.Primitive:
      return defaultValueForPrimitive(type, config);
    case Kind.Union:
    case Kind.Enum:
    case Kind.Alias:
    case Kind.Type:
      return `${rustifyCaps((type as Named).name)}::default()`;
  }
  throw new Error(`Can not generate default value code for type ${type.kind}`);
}

export function defaultValueForPrimitive(
  type: AnyType,
  config: ObjectMap<any>
): string {
  if (type.kind !== Kind.Primitive)
    throw new Error(`Can not expand non-primitive type ${type.kind}`);
  const t = type as Primitive;
  switch (t.name) {
    case PrimitiveName.Any:
      return config.anyType
        ? `${config.anyType.toString()}::default()`
        : "serde_value::Value::Null";
    case PrimitiveName.F32:
    case PrimitiveName.F64:
    case PrimitiveName.U64:
    case PrimitiveName.U32:
    case PrimitiveName.U16:
    case PrimitiveName.U8:
    case PrimitiveName.I64:
    case PrimitiveName.I32:
    case PrimitiveName.I16:
    case PrimitiveName.I8:
      return "0";
    case PrimitiveName.String:
      return "String::new()";
    case PrimitiveName.Bool:
      return "false";
    case PrimitiveName.Bytes:
      return "Vec::new()";
    case PrimitiveName.DateTime:
      return "time::OffsetDateTime::default()";
    case PrimitiveName.Value:
      config.anyType
        ? `${config.anyType.toString()}::default()`
        : "serde_value::Value::Null";
    default:
      throw new Error(`Unhandled primitive type ${t.name}`);
  }
}
