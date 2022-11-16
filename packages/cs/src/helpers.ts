import {
  AnyType,
  Kind,
  List,
  Map,
  Named,
  Optional,
} from "@apexlang/core/model";
import { pascalCase } from "@apexlang/utils";
import { translations } from "./constant";

export const expandType = (type: AnyType): string => {
  switch (type.kind) {
    case Kind.Primitive:
    case Kind.Alias:
    case Kind.Enum:
    case Kind.Type:
    case Kind.Union:
      const namedValue = (type as Named).name;
      return translations.get(namedValue) ?? pascalCase(namedValue);
    case Kind.Map:
      return `Dictionary<${expandType((type as Map).keyType)}, ${expandType(
        (type as Map).valueType
      )}>`;
    case Kind.List:
      return `List<${expandType((type as List).type)}>`;
    case Kind.Void:
      return `void`;
    case Kind.Optional:
      return `${expandType((type as Optional).type)}?`;
    default:
      return "object";
  }
};

export const parseNamespaceName = (name: string): string => {
  return name
    .split(".")
    .map((n) => pascalCase(n))
    .join(".");
};
