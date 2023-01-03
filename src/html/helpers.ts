import {
  AnyType,
  Optional,
  Kind,
  List,
  Map,
  Named,
} from "@apexlang/core/model";

export const expandType = (type: AnyType): string => {
  switch (type.kind) {
    case Kind.Primitive:
      return (type as Named).name;
    case Kind.Alias:
    case Kind.Enum:
    case Kind.Type:
    case Kind.Union:
      return `${(type as Named).name}`;
    case Kind.Map:
      const keyType = expandType((type as Map).keyType);
      const valueType = expandType((type as Map).valueType);
      return `{${keyType}: ${valueType}}`;
    case Kind.List:
      const typ = expandType((type as List).type);
      return `${typ}[]`;
    case Kind.Optional:
      const nestedType = (type as Optional).type;
      return expandType(nestedType);
    case Kind.Void:
      return "void";
    default:
      throw new Error(`Could not expand type ${type.kind}`);
  }
};
