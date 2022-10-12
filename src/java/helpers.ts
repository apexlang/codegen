import {
  AnyType,
  Kind,
  List,
  Map,
  Named, Optional,
} from "@apexlang/core/model";
import {pascalCase} from "../utils";
import {translations} from "./constant";

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
      return `Map<${expandType((type as Map).keyType)}, ${expandType(
        (type as Map).valueType
      )}>`;
    case Kind.List:
      return `List<${expandType((type as List).type)}>`;
    case Kind.Void:
      return `void`;
    // Java doesn't support optional parameters
    case Kind.Optional:
      return `${expandType((type as Optional).type)}`;
    default:
      return "Object";
  }
};

export const convertSignedToUnsigned = (type: string, value: any) => {
  switch (type) {
    case "byte":
      return `value & 0xff`;
    case "long":
      return `Long.toUnsignedString(${value})`;
    case "int":
      return `${value} & 0x00000000ffffffffL`;
    case "short":
      return `${value} & 0xffff`;
    default:
      return `${value}`;
  }
}