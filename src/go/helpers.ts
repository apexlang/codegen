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
  AnyType,
  Optional,
  Kind,
  Context,
  Primitive,
  Alias,
  Field,
  List,
  Map,
  Valued,
  Operation,
  Parameter,
  Annotated,
  Named,
  PrimitiveName,
  Interface,
  Stream,
} from "https://raw.githubusercontent.com/apexlang/apex-js/deno-wip/src/model/mod.ts";
import { capitalize, renamed } from "../utils/mod.ts";
import { Import } from "./alias_visitor.ts";
import { translations } from "./constant.ts";

/**
 * Takes an array of ValuedDefintions and returns a string based on supplied params.
 * @param sep seperator between name and type
 * @param delimiter string that each ValuedDefintion is joined on
 * @returns string of format <name> <sep> <type><delimiter>...
 */
export function mapVals(
  vd: Valued[],
  sep: string,
  delimiter: string,
  translate?: (named: string) => string | undefined
): string {
  return vd
    .map(
      (vd) =>
        `${vd.name}${sep} ${expandType(vd.type, undefined, true, translate)}`
    )
    .join(delimiter);
}

/**
 * Return default value for a Field. Default value of objects are instantiated.
 * @param fieldDef Field Node to get default value of
 */
export function defValue(fieldDef: Field): string {
  const name = fieldDef.name;
  const type = fieldDef.type;
  if (fieldDef.default) {
    let returnVal = fieldDef.default.getValue();
    if (fieldDef.type.kind == Kind.Primitive) {
      returnVal =
        (fieldDef.type as Primitive).name == PrimitiveName.String
          ? strQuote(returnVal)
          : returnVal;
    }
    return returnVal;
  }

  switch (type.kind) {
    case Kind.Optional:
      return "nil";
    case Kind.List:
    case Kind.Map:
      return `new ${expandType(type, undefined, false)}()`;
    case Kind.Primitive:
    case Kind.Alias:
    case Kind.Enum:
    case Kind.Type:
    case Kind.Union:
      switch ((type as Named).name) {
        case "ID":
        case "string":
          return '""';
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
          return "[]byte{}";
        default:
          return `${capitalize((type as Named).name)}()`; // reference to something else
      }
  }
  return `???${expandType(type, undefined, false)}???`;
}

export function returnPointer(type: AnyType): string {
  if (type.kind === Kind.Alias) {
    type = (type as Alias).type;
  }
  if (type.kind === Kind.Type) {
    return "*";
  }
  return "";
}

export function returnShare(type: AnyType): string {
  if (type.kind === Kind.Alias) {
    type = (type as Alias).type;
  }
  if (type.kind === Kind.Type) {
    return "&";
  }
  // if (type.kind === Kind.Optional) {
  //   return returnShare(context, (type as Optional).type);
  // }
  return "";
}

export function defaultValueForType(
  context: Context,
  type: AnyType,
  packageName?: string
): string {
  switch (type.kind) {
    case Kind.Optional:
      return "nil";
    case Kind.List:
    case Kind.Map:
      return type.kind;
    case Kind.Enum:
      return (type as Named).name + "(0)";
    case Kind.Alias:
      const aliases =
        (context.config.aliases as { [key: string]: Import }) || {};
      const a = type as Alias;
      const imp = aliases[a.name];
      if (imp) {
        return imp.type + "{}";
      }
    case Kind.Primitive:
    case Kind.Type:
    case Kind.Union:
      const name = (type as Named).name;
      switch (name) {
        case "ID":
        case "string":
          return '""';
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
          return "[]byte{}";
        default:
          const namedType = context.namespace.allTypes[name];
          if (namedType && namedType.kind === Kind.Alias) {
            const otherType = (namedType as Alias).type;
            return defaultValueForType(context, otherType, packageName);
          }
          const prefix =
            packageName != undefined && packageName != ""
              ? packageName + "."
              : "";
          return `${prefix}${capitalize(name)}{}`; // reference to something else
      }
  }
  return "???";
}

/**
 * returns string in quotes
 * @param s string to have quotes
 */
export const strQuote = (s: string) => {
  return `\"${s}\"`;
};

var expandStreamPattern = `{{type}}`;
export function setExpandStreamPattern(pattern: string) {
  expandStreamPattern = pattern;
}

/**
 * returns string of the expanded type of a node
 * @param type the type node that is being expanded
 * @param useOptional if the type that is being expanded is optional
 * @param isReference if the type that is being expanded has a `@ref` annotation
 */
export const expandType = (
  type: AnyType,
  packageName?: string | undefined,
  useOptional: boolean = false,
  translate?: (named: string) => string | undefined
): string => {
  let translation: string | undefined = undefined;
  if (type.kind == Kind.Primitive) {
    const p = type as Primitive;
    if (p.name == PrimitiveName.Any) {
      return "interface{}";
    }
  }
  switch (type.kind) {
    case Kind.Primitive:
    case Kind.Alias:
    case Kind.Enum:
    case Kind.Type:
    case Kind.Union:
      var namedValue = (type as Named).name;
      if (translate != undefined) {
        namedValue = translate(namedValue) || namedValue;
      }
      translation = translations.get(namedValue);
      if (translation != undefined) {
        return translation!;
      }
      if (
        type.kind == Kind.Type &&
        packageName != undefined &&
        packageName != ""
      ) {
        return packageName + "." + namedValue;
      }
      return namedValue;
    case Kind.Map:
      return `map[${expandType(
        (type as Map).keyType,
        packageName,
        true,
        translate
      )}]${expandType((type as Map).valueType, packageName, true, translate)}`;
    case Kind.List:
      return `[]${expandType(
        (type as List).type,
        packageName,
        true,
        translate
      )}`;
    case Kind.Optional:
      const nestedType = (type as Optional).type;
      if (nestedType.kind == Kind.Primitive) {
        const p = nestedType as Primitive;
        if (p.name == PrimitiveName.Any) {
          return "interface{}";
        }
      }
      let expanded = expandType(nestedType, packageName, true, translate);
      if (
        useOptional &&
        !(
          nestedType.kind === Kind.Map ||
          nestedType.kind === Kind.List ||
          expanded == "[]byte"
        )
      ) {
        if (expanded.startsWith("*")) {
          expanded = expanded.substring(1);
        }
        return `*${expanded}`;
      }
      return expanded;
    case Kind.Stream:
      const s = type as Stream;
      return expandStreamPattern.replace(
        "{{type}}",
        expandType(s.type, packageName, true, translate)
      );
    default:
      return "unknown";
  }
};

export function fieldName(annotated: Annotated, name: string): string {
  const rename = annotated ? renamed(annotated) : undefined;
  if (rename != undefined) {
    return rename;
  }
  let str = capitalize(name);
  if (str.endsWith("Id")) {
    str = str.substring(0, str.length - 2) + "ID";
  } else if (str.endsWith("Url")) {
    str = str.substring(0, str.length - 3) + "URL";
  } else if (str.endsWith("Uri")) {
    str = str.substring(0, str.length - 3) + "URI";
  }
  return str;
}

export function methodName(annotated: Annotated, name: string): string {
  return fieldName(annotated, name);
}

export function parameterName(annotated: Annotated, name: string): string {
  const rename = renamed(annotated);
  if (rename != undefined) {
    return rename;
  }
  let str = name;
  if (str.endsWith("Id")) {
    str = str.substring(0, str.length - 2) + "ID";
  } else if (str.endsWith("Url")) {
    str = str.substring(0, str.length - 3) + "URL";
  } else if (str.endsWith("Uri")) {
    str = str.substring(0, str.length - 3) + "URI";
  }
  return str;
}

/**
 * Given an array of OperationDefintion returns them as functions with their arguments
 * @param ops
 */
export function opsAsFns(context: Context, ops: Operation[]): string {
  return ops
    .map((op) => {
      return `func ${op.name}(${mapParams(
        context,
        op.parameters
      )}) ${expandType(op.type, undefined, true)} {\n}`;
    })
    .join("\n");
}

/**
 * returns string of args mapped to their type
 * @param args InputValueDefintion array which is an array of the arguments
 */
export function mapParams(
  context: Context,
  args: Parameter[],
  packageName?: string,
  translate?: (named: string) => string | undefined
): string {
  return (
    `ctx context.Context` +
    (args.length > 0 ? ", " : "") +
    args
      .map((arg) => {
        return mapParam(context, arg, packageName, translate);
      })
      .join(", ")
  );
}

export function mapParam(
  context: Context,
  arg: Parameter,
  packageName?: string,
  translate?: (named: string) => string | undefined
): string {
  return `${parameterName(arg, arg.name)} ${returnPointer(
    arg.type
  )}${expandType(arg.type, packageName, true, translate)}`;
}

export function varAccessArg(
  context: Context,
  variable: string,
  args: Parameter[]
): string {
  return args
    .map((arg) => {
      return `${returnShare(arg.type)}${variable}.${fieldName(arg, arg.name)}`;
    })
    .join(", ");
}

export function receiver(iface: Interface): string {
  return iface.name[0].toLowerCase();
}
