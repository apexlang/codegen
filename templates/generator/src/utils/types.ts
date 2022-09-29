import {
  Kind,
  Named,
  AnyType,
  Map,
  PrimitiveName,
  List,
  Optional,
  Primitive,
  ObjectMap,
} from "@apexlang/core/model";

export function expandType(typ: AnyType, config: ObjectMap): string {
  switch (typ.kind) {
    case Kind.List: {
      const t = typ as List;
      const itemType = expandType(t.type, config);
      return `[${itemType}]`;
    }
    case Kind.Map: {
      const t = typ as Map;

      const keyType = expandType(t.keyType, config);
      const valueType = expandType(t.valueType, config);

      return `{${keyType} : ${valueType} }`;
    }
    case Kind.Optional: {
      const t = typ as Optional;
      const innerType = expandType(t.type, config);
      return `${innerType}?`;
    }
    case Kind.Union:
    case Kind.Enum:
    case Kind.Alias:
    case Kind.Type: {
      return (typ as Named).name;
    }
    case Kind.Void: {
      return "void";
    }
    case Kind.Primitive: {
      const t = typ as Primitive;
      return expandPrimitive(t, config);
    }
    default: {
      throw new Error(`Unhandled type conversion for type: ${typ.kind}`);
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function expandPrimitive(t: Primitive, config: ObjectMap): string {
  switch (t.name) {
    case PrimitiveName.Bool:
      return "bool";
    case PrimitiveName.Bytes:
      return "bytes";
    case PrimitiveName.DateTime:
      return "datetime";
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
      return "string";
    case PrimitiveName.Any:
      return "any";
    default:
      throw new Error(
        `Unhandled primitive type conversion for type: ${t.name}`
      );
  }
}
