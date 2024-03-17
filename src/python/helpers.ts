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

import {
  Alias,
  AnyType,
  Field,
  Kind,
  List,
  Map,
  Named,
  Operation,
  Optional,
  Parameter,
  Primitive,
  PrimitiveName,
  Type,
  Valued,
} from "@apexlang/core/model";
import { capitalize, snakeCase } from "../utils/mod.ts";

/**
 * Takes an array of ValuedDefintions and returns a string based on supplied params.
 * @param sep seperator between name and type
 * @param joinOn string that each ValuedDefintion is joined on
 * @returns string of format <name> <sep> <type><joinOn>...
 */
export function mapVals(vd: Valued[], sep: string, joinOn: string): string {
  return vd
    .map((vd) => `${vd.name}${sep} ${expandType(vd.type, true)};`)
    .join(joinOn);
}

/**
 * Return default value for a FieldDefinition. Default value of objects are instantiated.
 * @param fieldDef FieldDefinition Node to get default value of
 */
export function defValue(fieldDef: Field): string {
  const type = fieldDef.type;
  if (fieldDef.default) {
    let returnVal = fieldDef.default.getValue();
    if (fieldDef.type.kind == Kind.Primitive) {
      returnVal = (fieldDef.type as Primitive).name == PrimitiveName.String
        ? strQuote(returnVal)
        : returnVal;
    }
    return returnVal;
  }

  switch (type.kind) {
    case Kind.Optional:
      return "None";
    case Kind.List:
      return "[]";
    case Kind.Map:
      return "{}";
    //return `${expandType(type, false, isReference(fieldDef.annotations))}()`;
    case Kind.Primitive:
    case Kind.Alias:
    case Kind.Enum:
    case Kind.Type:
    case Kind.Union:
      switch ((type as Named).name) {
        case "ID":
        case "string":
          return `''`;
        case "bool":
          return "false";
        case "i8":
        case "u8":
        case "i16":
        case "u16":
        case "i32":
        case "u32":
        case "i64":
        case "u64":
          return "int(0)";
        case "f32":
        case "f64":
          return "float(0)";
        case "bytes":
          return "bytes(0)";
        default:
          return `${capitalize((type as Named).name)}()`; // reference to something else
      }
  }
  return `???${expandType(type, false)}???`;
}

export function defaultValueForType(type: AnyType): string {
  if (type.kind == Kind.Alias) {
    type = (type as Alias).type;
  }
  switch (type.kind) {
    case Kind.Optional:
      return "null";
    case Kind.List:
      return "new List()";
    case Kind.Map:
      return `new Map()`;
    case Kind.Primitive:
    case Kind.Alias:
    case Kind.Enum:
    case Kind.Type:
    case Kind.Union: {
      const name = (type as Named).name;
      switch (name) {
        case "ID":
        case "string":
          return `''`;
        case "bool":
          return "false";
        case "i8":
        case "u8":
        case "i16":
        case "u16":
        case "i32":
        case "u32":
        case "i64":
        case "u64":
        case "f32":
        case "f64":
          return "0";
        case "bytes":
          return "new ArrayBuffer(0)";
        default:
          return `new ${capitalize(name)}()`; // reference to something else
      }
    }
  }
  return "???";
}

/**
 * returns string in quotes
 * @param s string to have quotes
 */
export function strQuote(s: string): string {
  return `'${s}'`;
}

/**
 * returns string of the expanded type of a node
 * @param type the type node that is being expanded
 * @param useOptional if the type that is being expanded is optional
 * @param isReference if the type that is being expanded has a `@ref` annotation
 */
export const expandType = (type: AnyType, useOptional: boolean): string => {
  switch (type.kind) {
    case Kind.Primitive:
    case Kind.Alias:
    case Kind.Enum:
    case Kind.Type:
    case Kind.Union: {
      const namedValue = (type as Named).name;
      return namedValue;
    }
    case Kind.Map:
      return `dict[${expandType((type as Map).keyType, true)},${
        expandType(
          (type as Map).valueType,
          true,
        )
      }]`;
    case Kind.List:
      return `list[${expandType((type as List).type, true)}]`;
    case Kind.Optional: {
      const expanded = expandType((type as Optional).type, true);
      if (useOptional) {
        return `Optional[${expanded}]`;
      }
      return expanded;
    }
    default:
      return "unknown";
  }
};

/**
 * Given an array of Operation returns them as functions with their arguments
 * @param ops
 */
export function opsAsFns(ops: Operation[]): string {
  return ops
    .map((op) => {
      return `function ${op.name}(${mapArgs(op.parameters)}): ${
        expandType(
          op.type,
          true,
        )
      } {\n}`;
    })
    .join("\n");
}

/**
 * returns string of args mapped to their type
 * @param args Parameter array which is an array of the arguments
 */
export function mapArgs(params: Parameter[]): string {
  return params
    .map((param) => {
      return mapArg(param);
    })
    .join(", ");
}

export function mapArg(param: Parameter): string {
  return `${snakeCase(param.name)}: ${expandType(param.type, true)}`;
}

/**
 * returns if a Apex type is a node
 * @param o Type which correlates to a Apex Type
 */
export function isNode(o: Type): boolean {
  for (const field of o.fields) {
    if (field.name.toLowerCase() == "id") {
      return true;
    }
  }
  return false;
}

export function varAccessArg(variable: string, params: Parameter[]): string {
  return params
    .map((param) => {
      return `${variable}.${param.name}`;
    })
    .join(", ");
}
