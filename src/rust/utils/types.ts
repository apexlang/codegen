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
} from "@apexlang/core/model";
import { rustifyCaps } from "./index.js";

export function isRecursiveType(typ: AnyType, match: AnyType = typ): boolean {
  switch (typ.kind) {
    case Kind.List: {
      const t = typ as List;
      return isRecursiveType(t.type, match);
    }
    case Kind.Map: {
      const t = typ as Map;
      return (
        isRecursiveType(t.keyType, match) || isRecursiveType(t.valueType, match)
      );
    }
    case Kind.Optional: {
      const t = typ as Optional;
      return isRecursiveType(t.type, match);
    }
    case Kind.Union: {
      const t = typ as Union;
      return t.types.map((t) => isRecursiveType(t, match)).includes(true);
    }

    case Kind.Type: {
      const t = typ as Type;
      return t.name === (match as Named).name;
    }
    case Kind.Enum:
    case Kind.Primitive:
    case Kind.Alias:
    case Kind.Void: {
      return false;
    }
    default: {
      console.log(JSON.stringify(typ));
      throw new Error(`Unhandled type: ${typ.kind}`);
    }
  }
}

export function apexToRustType(typ: AnyType): string {
  switch (typ.kind) {
    case Kind.List: {
      const t = typ as List;
      const itemType = apexToRustType(t.type);
      return `Vec<${itemType}>`;
    }
    case Kind.Map: {
      const t = typ as Map;

      const keyType = apexToRustType(t.keyType);
      const valueType = apexToRustType(t.valueType);

      return `std::collections::HashMap<${keyType},${valueType}>`;
    }
    case Kind.Optional: {
      const t = typ as Optional;
      const innerType = apexToRustType(t.type);
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
      return primitiveToRust(t);
    }
    default: {
      console.log(JSON.stringify(typ));
      throw new Error(`Unhandled type conversion for type: ${typ.kind}`);
    }
  }
}

function primitiveToRust(t: Primitive): string {
  switch (t.name) {
    case PrimitiveName.Bool:
      return "boolean";
    case PrimitiveName.Bytes:
      return "Vec<u8>";
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
    default:
      throw new Error(
        `Unhandled primitive type conversion for type: ${t.name}`
      );
  }
}
