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
} from "@apexlang/core/model";
import { pascalCase } from "../../utils";

export function convertType(typ: AnyType, config: ObjectMap): string {
  switch (typ.kind) {
    case Kind.List: {
      return `List<${convertType((typ as List).type, config)}>`;
    }
    case Kind.Map: {
      return `Map<${convertType((typ as Map).keyType, config)}, ${pascalCase(
        convertType((typ as Map).valueType, config)
      )}>`;
    }
    case Kind.Optional: {
      return `${convertType((typ as Optional).type, config)}`;
    }
    case Kind.Void: {
      return "void";
    }
    case Kind.Type:
    case Kind.Union:
    case Kind.Enum:
      const namedValue = (typ as Named).name;
      return pascalCase(namedValue);
    case Kind.Alias:
      return (typ as Named).name.toUpperCase();
    case Kind.Primitive: {
      return `${convertPrimitive(typ as Primitive, config)}`;
    }
    default: {
      return `${typ.kind}`;
      // throw new Error(`Unhandled type conversion for type: ${typ.kind}`);
    }
  }
}

function convertPrimitive(typ: Primitive, config: ObjectMap): string {
  switch (typ.name) {
    case PrimitiveName.Bool:
      return "bool";
    case PrimitiveName.Bytes:
      return "byte";
    case PrimitiveName.DateTime:
      return "LocalTime";
    case PrimitiveName.F32:
      return "float";
    case PrimitiveName.F64:
      return "double";
    case PrimitiveName.U64:
      return "String";
    case PrimitiveName.U32:
      return "long";
    case PrimitiveName.U16:
      return "int";
    case PrimitiveName.U8:
      return "int";
    case PrimitiveName.I64:
      return "long";
    case PrimitiveName.I32:
      return "int";
    case PrimitiveName.I16:
      return "short";
    case PrimitiveName.I8:
      return "byte";
    case PrimitiveName.String:
      return "String";
    case PrimitiveName.Any:
      return "Object";
    default:
      return `${typ.name}`;
    // throw new Error(
    //     `Unhandled primitive type conversion for type: ${typ.name}`
    // );
  }
}
