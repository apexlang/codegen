// deno-lint-ignore-file no-explicit-any
import {
  AnyType,
  Kind,
  List,
  Map,
  Named,
  ObjectMap,
  Optional,
  Primitive,
  PrimitiveName,
  Stream,
} from "../../../deps/@apexlang/core/model/mod.ts";
import { rustifyCaps } from "./mod.ts";

export function apexToRustType(
  typ: AnyType,
  config: ObjectMap<any>,
  asRef = false,
  lifetime = "",
): string {
  const ref = asRef ? `&${lifetime} ` : "";
  switch (typ.kind) {
    case Kind.List: {
      const t = typ as List;
      const itemType = apexToRustType(t.type, config);
      return asRef ? `${ref}[${itemType}]` : `Vec<${itemType}>`;
    }
    case Kind.Map: {
      const t = typ as Map;

      const keyType = apexToRustType(t.keyType, config);
      const valueType = apexToRustType(t.valueType, config);

      return `${ref}std::collections::HashMap<${keyType},${valueType}>`;
    }
    case Kind.Optional: {
      const t = typ as Optional;
      const innerType = apexToRustType(t.type, config);
      return `${ref}Option<${innerType}>`;
    }
    case Kind.Stream: {
      const t = typ as Stream;
      const outputType = apexToRustType(t.type, config);
      return asRef
        ? `${ref}dyn Stream<Item=${outputType}>`
        : `Box<dyn Stream<Item=${outputType}>>`;
    }
    case Kind.Union:
    case Kind.Enum:
    case Kind.Alias:
    case Kind.Type: {
      return `${ref}${rustifyCaps((typ as Named).name)}`;
    }
    case Kind.Void: {
      return "()";
    }
    case Kind.Primitive: {
      const t = typ as Primitive;
      return primitiveToRust(t, config, asRef, lifetime);
    }
    default: {
      throw new Error(`Unhandled type conversion for type: ${typ.kind}`);
    }
  }
}

function primitiveToRust(
  t: Primitive,
  config: ObjectMap<any>,
  asRef = false,
  lifetime = "",
): string {
  const ref = asRef ? `&${lifetime} ` : "";
  switch (t.name) {
    case PrimitiveName.Bool:
      return `${ref}bool`;
    case PrimitiveName.Bytes: {
      const typ = config.bytes ? config.bytes : "Vec<u8>";
      return `${ref}${typ}`;
    }
    case PrimitiveName.DateTime: {
      const typ = config.datetime ? config.datetime : "time::OffsetDateTime";
      return `${ref}${typ}`;
    }
    case PrimitiveName.F32:
      return `${ref}f32`;
    case PrimitiveName.F64:
      return `${ref}f64`;
    case PrimitiveName.U64:
      return `${ref}u64`;
    case PrimitiveName.U32:
      return `${ref}u32`;
    case PrimitiveName.U16:
      return `${ref}u16`;
    case PrimitiveName.U8:
      return `${ref}u8`;
    case PrimitiveName.I64:
      return `${ref}i64`;
    case PrimitiveName.I32:
      return `${ref}i32`;
    case PrimitiveName.I16:
      return `${ref}i16`;
    case PrimitiveName.I8:
      return `${ref}i8`;
    case PrimitiveName.String:
      return asRef ? `${ref}str` : "String";
    case PrimitiveName.Any: {
      const typ = config.anyType
        ? config.anyType.toString()
        : "serde_value::Value";
      return `${ref}${typ}`;
    }
    default:
      throw new Error(
        `Unhandled primitive type conversion for type: ${t.name}`,
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
  config: ObjectMap<any>,
): string {
  if (type.kind !== Kind.Primitive) {
    throw new Error(`Can not expand non-primitive type ${type.kind}`);
  }
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
      return config.anyType
        ? `${config.anyType.toString()}::default()`
        : "serde_value::Value::Null";
    default:
      throw new Error(`Unhandled primitive type ${t.name}`);
  }
}
