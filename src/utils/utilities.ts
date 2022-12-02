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
  Context,
  Kind,
  List,
  Map,
  Optional,
  Type,
  Annotated,
  Alias,
  Enum,
  Annotation,
  TypeResolver,
  Operation,
  Stream,
  Union,
  Primitive,
  Named,
  Interface,
  Void,
} from "../../../apex-js/src/model/index.ts";
import {
  FieldDefinition,
  Name,
  Named as ASTNamed,
  TypeDefinition,
  Optional as OptionalAST,
  Type as ASTType,
  ListType,
  MapType,
  Stream as StreamType,
  StringValue,
} from "../../../apex-js/src/ast/index.ts";

export function isOneOfType(context: Context, types: string[]): boolean {
  if (context.interface) {
    const iface = context.interface;
    let found = false;
    for (let i = 0; i < types.length; i++) {
      if (iface.annotation(types[i]) != undefined) {
        found = true;
        break;
      }
    }
    if (!found) {
      return false;
    }
    return (
      iface.operations.find((o) => {
        return o.annotation("nocode") == undefined;
      }) != undefined
    );
  }
  return false;
}

export function isHandler(context: Context): boolean {
  return isService(context) || isEvents(context);
}

export function isService(context: Context): boolean {
  if (context.interface) {
    const { interface: iface } = context;
    if (iface.annotation("service") == undefined) {
      return false;
    }
    return (
      iface.operations.find((o) => {
        return o.annotation("nocode") == undefined;
      }) != undefined
    );
  }
  if (context.operation) {
    return context.operation.annotation("nocode") != undefined;
  }
  return false;
}

export function hasServiceCode(context: Context): boolean {
  for (let name in context.namespace.interfaces) {
    const role = context.namespace.interfaces[name];
    if (role.annotation("service") == undefined) {
      continue;
    }
    if (
      role.operations.find((o) => {
        return o.annotation("nocode") == undefined;
      }) != undefined
    ) {
      return true;
    }
  }
  return false;
}

export function hasMethods(iface: Interface): boolean {
  if (
    iface.operations.find((o) => {
      return o.annotation("nocode") == undefined;
    }) != undefined
  ) {
    return true;
  }
  return false;
}

export function hasCode(context: Context): boolean {
  if (context.interface) {
    const { interface: iface } = context;
    if (
      iface.annotation("service") == undefined &&
      iface.annotation("provider") == undefined &&
      iface.annotation("dependency") == undefined
    ) {
      return false;
    }
    return (
      iface.operations.find((o) => {
        return o.annotation("nocode") == undefined;
      }) != undefined
    );
  }
  return false;
}

export function isEvents(context: Context): boolean {
  if (context.interface) {
    const { interface: iface } = context;
    if (iface.annotation("events") == undefined) {
      return false;
    }
    return (
      iface.operations.find((o) => {
        return o.annotation("nocode") == undefined;
      }) != undefined
    );
  }
  return false;
}

export function isProvider(context: Context): boolean {
  const { interface: iface, operation } = context;
  if (iface) {
    if (
      iface.annotation("provider") == undefined &&
      iface.annotation("dependency") == undefined &&
      iface.annotation("activities") == undefined
    ) {
      return false;
    }
    return (
      iface.operations.find((o) => {
        return o.annotation("nocode") == undefined;
      }) != undefined
    );
  }
  if (operation && operation.annotation("provider")) {
    return true;
  }
  return false;
}

export function noCode(annotated: Annotated): boolean {
  if (annotated) {
    return annotated.annotation("nocode") != undefined;
  }
  return false;
}

/**
 * Determines if a node is a void node
 * @param t Node that is a Type node
 */
export function isVoid(t: AnyType): boolean {
  return t.kind === Kind.Void;
}

export function isNamed(t: AnyType): t is NamedType {
  switch (t.kind) {
    case Kind.Alias:
    case Kind.Enum:
    case Kind.Type:
    case Kind.Union:
      return true;
  }
  return false;
}

/**
 * Determines if Type Node is a Named node and if its type is not one of the base translation types.
 * @param t Node that is a Type node
 */
export function isObject(t: AnyType, recurseOption: boolean = true): boolean {
  while (t.kind == Kind.Alias || t.kind == Kind.Optional) {
    if (t.kind == Kind.Optional) {
      if (recurseOption) {
        t = (t as Optional).type;
      } else {
        break;
      }
    } else if (t.kind == Kind.Alias) {
      t = (t as Alias).type;
    }
  }
  switch (t.kind) {
    case Kind.Type:
    case Kind.Union:
      return true;
  }
  return false;
}

export function isPrimitive(t: AnyType): t is Primitive {
  return t.kind === Kind.Primitive;
}

export function visitNamed(t: AnyType, callback: (name: string) => void): void {
  if (!t) {
    return;
  }

  switch (t.kind) {
    case Kind.Type:
      const named = t as Type;
      callback(named.name);
      break;
    case Kind.Optional:
      visitNamed((t as Optional).type, callback);
      break;
    case Kind.List:
      visitNamed((t as List).type, callback);
      break;
    case Kind.Map:
      const m = t as Map;
      visitNamed(m.keyType, callback);
      visitNamed(m.valueType, callback);
      break;
  }
}

export const primitives = new Set([
  "bool",
  "i8",
  "i16",
  "i32",
  "i64",
  "u8",
  "u16",
  "u32",
  "u64",
  "f32",
  "f64",
  "string",
]);

export function formatComment(
  prefix: string,
  text: string | undefined,
  wrapLength: number = 80
): string {
  if (text == undefined) {
    return "";
  }
  let textValue = "";
  if (!text || typeof text === "string") {
    textValue = text;
  }

  // Replace single newline characters with space so that the logic below
  // handles line wrapping. Multiple newlines are preserved. It was simpler
  // to do this than regex.
  for (i = 1; i < textValue.length - 1; i++) {
    if (
      textValue[i] == "\n" &&
      textValue[i - 1] != "\n" &&
      textValue[i + 1] != "\n"
    ) {
      textValue = textValue.substring(0, i) + " " + textValue.substring(i + 1);
    }
  }

  let comment = "";
  let line = "";
  let word = "";
  for (var i = 0; i < textValue.length; i++) {
    let c = textValue[i];
    if (c == " " || c == "\n") {
      if (line.length + word.length > wrapLength) {
        if (comment.length > 0) {
          comment += "\n";
        }
        comment += prefix + line.trim();
        line = word.trim();
        word = " ";
      } else if (c == "\n") {
        line += word;
        if (comment.length > 0) {
          comment += "\n";
        }
        comment += prefix + line.trim();
        line = "";
        word = "";
      } else {
        line += word;
        word = c;
      }
    } else {
      word += c;
    }
  }
  if (line.length + word.length > wrapLength) {
    if (comment.length > 0) {
      comment += "\n";
    }
    comment += prefix + line.trim();
    line = word.trim();
  } else {
    line += word;
  }
  if (line.length > 0) {
    if (comment.length > 0) {
      comment += "\n";
    }
    comment += prefix + line.trim();
  }
  if (comment.length > 0) {
    comment += "\n";
  }
  return comment;
}

// The following functions are from
// https://github.com/blakeembrey/change-case
// Pasted here to avoid an NPM dependency for the CLI.

export function camelCaseTransform(input: string, index: number) {
  if (index === 0) return input.toLowerCase();
  return pascalCaseTransform(input, index);
}

export function camelCaseTransformMerge(input: string, index: number) {
  if (index === 0) return input.toLowerCase();
  return pascalCaseTransformMerge(input);
}

export function camelCase(input: string, options: Options = {}) {
  return pascalCase(input, {
    transform: camelCaseTransform,
    ...options,
  });
}

export function pascalCaseTransform(input: string, index: number) {
  const firstChar = input.charAt(0);
  const lowerChars = input.substr(1).toLowerCase();
  if (index > 0 && firstChar >= "0" && firstChar <= "9") {
    return `_${firstChar}${lowerChars}`;
  }
  return `${firstChar.toUpperCase()}${lowerChars}`;
}

export function pascalCaseTransformMerge(input: string) {
  return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
}

export function pascalCase(input: string, options: Options = {}) {
  return noCase(input, {
    delimiter: "",
    transform: pascalCaseTransform,
    ...options,
  });
}

export function snakeCase(input: string, options: Options = {}) {
  return dotCase(input, {
    delimiter: "_",
    ...options,
  });
}

export function dotCase(input: string, options: Options = {}) {
  return noCase(input, {
    delimiter: ".",
    ...options,
  });
}

// Support camel case ("camelCase" -> "camel Case" and "CAMELCase" -> "CAMEL Case").
const DEFAULT_SPLIT_REGEXP = [/([a-z0-9])([A-Z])/g, /([A-Z])([A-Z][a-z])/g];

// Remove all non-word characters.
const DEFAULT_STRIP_REGEXP = /[^A-Z0-9]+/gi;

export interface Options {
  splitRegexp?: RegExp | RegExp[];
  stripRegexp?: RegExp | RegExp[];
  delimiter?: string;
  transform?: (part: string, index: number, parts: string[]) => string;
}

export function noCase(input: string, options: Options = {}) {
  const {
    splitRegexp = DEFAULT_SPLIT_REGEXP,
    stripRegexp = DEFAULT_STRIP_REGEXP,
    transform = lowerCase,
    delimiter = " ",
  } = options;

  let result = replace(
    replace(input, splitRegexp, "$1\0$2"),
    stripRegexp,
    "\0"
  );
  let start = 0;
  let end = result.length;

  // Trim the delimiter from around the output string.
  while (result.charAt(start) === "\0") start++;
  while (result.charAt(end - 1) === "\0") end--;

  // Transform each token independently.
  return result.slice(start, end).split("\0").map(transform).join(delimiter);
}

/**
 * Replace `re` in the input string with the replacement value.
 */
function replace(input: string, re: RegExp | RegExp[], value: string) {
  if (re instanceof RegExp) return input.replace(re, value);
  return re.reduce((input, re) => input.replace(re, value), input);
}

/**
 * Locale character mapping rules.
 */
interface Locale {
  regexp: RegExp;
  map: Record<string, string>;
}

/**
 * Source: ftp://ftp.unicode.org/Public/UCD/latest/ucd/SpecialCasing.txt
 */
const SUPPORTED_LOCALE: Record<string, Locale> = {
  tr: {
    regexp: /\u0130|\u0049|\u0049\u0307/g,
    map: {
      İ: "\u0069",
      I: "\u0131",
      İ: "\u0069",
    },
  },
  az: {
    regexp: /\u0130/g,
    map: {
      İ: "\u0069",
      I: "\u0131",
      İ: "\u0069",
    },
  },
  lt: {
    regexp: /\u0049|\u004A|\u012E|\u00CC|\u00CD|\u0128/g,
    map: {
      I: "\u0069\u0307",
      J: "\u006A\u0307",
      Į: "\u012F\u0307",
      Ì: "\u0069\u0307\u0300",
      Í: "\u0069\u0307\u0301",
      Ĩ: "\u0069\u0307\u0303",
    },
  },
};

/**
 * Localized lower case.
 */
export function localeLowerCase(str: string, locale: string) {
  const lang = SUPPORTED_LOCALE[locale.toLowerCase()];
  if (lang) return lowerCase(str.replace(lang.regexp, (m) => lang.map[m]));
  return lowerCase(str);
}

/**
 * Lower case as a function.
 */
export function lowerCase(str: string) {
  return str.toLowerCase();
}

/**
 * Capitlizes a given string
 * @param str string to be capitlized
 * @returns string with first character capitalized. If empty string returns empty string.
 */
export function capitalize(str: string): string {
  if (str.length == 0) return str;
  if (str.length == 1) return str[0].toUpperCase();
  return str[0].toUpperCase() + str.slice(1);
}

export function uncapitalize(str: string): string {
  if (str.length == 0) return str;
  if (str.length == 1) return str[0].toLowerCase();
  return str[0].toLowerCase() + str.slice(1);
}

export function capitalizeRename(annotated: Annotated, str: string): string {
  const rename = renamed(annotated);
  if (rename != undefined) {
    return rename;
  }
  return capitalize(str);
}

interface RenameDirective {
  value: { [key: string]: string };
}

export function renamed(
  annotated: Annotated,
  defaultVal?: string
): string | undefined {
  let ret: string | undefined = defaultVal;
  annotated.annotation("rename", (a: Annotation) => {
    const rename = a.convert<RenameDirective>();
    ret = rename.value.go;
  });
  return ret;
}

export function interfaceTypeName(iface: Interface): string {
  return capitalize(renamed(iface, iface.name)!);
}

export function operationTypeName(operation: Operation): string {
  return capitalize(renamed(operation, operation.name)!);
}

export function operationArgsType(
  iface: Interface | undefined,
  operation: Operation,
  prefix?: string
): string {
  return (
    (prefix || "") +
    (iface ? interfaceTypeName(iface) : "") +
    operationTypeName(operation) +
    "Args"
  );
}

export function convertOperationToType(
  tr: TypeResolver,
  iface: Interface | undefined,
  operation: Operation,
  prefix?: string
): Type {
  const parameters = operation.parameters.filter(
    (p) => p.type.kind != Kind.Stream
  );
  var fields = parameters.map((param) => {
    return new FieldDefinition(
      param.node.loc,
      param.node.name,
      param.node.description,
      param.node.type,
      param.node.default,
      param.node.annotations
    );
  });
  return new Type(
    tr,
    new TypeDefinition(
      operation.node.loc,
      new Name(
        operation.node.name.loc,
        operationArgsType(iface, operation, prefix)
      ),
      undefined,
      [],
      operation.node.annotations,
      fields
    )
  );
}

export function convertUnionToType(tr: TypeResolver, union: Union): Type {
  var fields = union.types.map((param) => {
    const n = typeName(param);
    const t = modelToAST(param);
    return new FieldDefinition(
      undefined,
      new Name(undefined, n),
      undefined,
      new OptionalAST(undefined, t),
      undefined,
      []
    );
  });
  return new Type(
    tr,
    new TypeDefinition(
      union.node.loc,
      new Name(union.node.name.loc, union.name),
      union.description != undefined
        ? new StringValue(undefined, union.description)
        : undefined,
      [],
      union.node.annotations,
      fields
    )
  );
}

export function modelToAST(t: AnyType): ASTType {
  switch (t.kind) {
    case Kind.Primitive: {
      const p = t as Primitive;
      return new ASTNamed(undefined, new Name(undefined, p.name));
    }
    case Kind.Alias:
    case Kind.Enum:
    case Kind.Type:
    case Kind.Union: {
      const a = t as unknown as Named;
      return new ASTNamed(undefined, new Name(undefined, a.name));
    }
    case Kind.Stream: {
      const o = t as Optional;
      return new StreamType(undefined, modelToAST(o.type));
    }
    case Kind.Optional: {
      const o = t as Optional;
      return new OptionalAST(undefined, modelToAST(o.type));
    }
    case Kind.List: {
      const l = t as List;
      return new ListType(undefined, modelToAST(l.type));
    }
    case Kind.Map: {
      const l = t as Map;
      return new MapType(
        undefined,
        modelToAST(l.keyType),
        modelToAST(l.keyType)
      );
    }
  }
  return new ASTNamed(undefined, new Name(undefined, "????"));
}

export function typeName(t: AnyType): string {
  switch (t.kind) {
    case Kind.Primitive: {
      const p = t as Primitive;
      return p.name;
    }
    case Kind.Alias:
    case Kind.Enum:
    case Kind.Type:
    case Kind.Union: {
      const a = t as unknown as Named;
      return a.name;
    }
    case Kind.Stream: {
      const s = t as Stream;
      return "stream{" + modelToAST(s.type) + "}";
    }
    case Kind.Optional: {
      const o = t as Optional;
      return "optional{" + modelToAST(o.type) + "}";
    }
    case Kind.List: {
      const l = t as List;
      return "list{" + modelToAST(l.type) + "}";
    }
    case Kind.Map: {
      const l = t as Map;
      return "map{" + modelToAST(l.keyType) + "," + modelToAST(l.keyType) + "}";
    }
  }
  return "????";
}

export function convertArrayToObject<T, D>(
  array: T[],
  keyFunc: (value: T) => string,
  convert: (value: T) => D = (value: T) => value as unknown as D
): { [key: string]: D } {
  const obj: { [key: string]: D } = {};
  array.forEach((value) => {
    const keyVal = keyFunc(value);
    obj[keyVal] = convert(value);
  });
  return obj;
}

export function unwrapKinds(t: AnyType, ...kinds: Kind[]): AnyType {
  while (true) {
    if (isKinds(t, ...kinds)) {
      switch (t.kind) {
        case Kind.Alias:
          t = (t as Alias).type;
          break;
        case Kind.Optional:
          t = (t as Optional).type;
          break;
        case Kind.List:
          t = (t as List).type;
          break;
        case Kind.Map:
          t = (t as Map).valueType;
          break;
        case Kind.Stream:
          t = (t as Stream).type;
          break;
        default:
          return t;
      }
    } else {
      return t;
    }
  }
}

export function isKinds(t: AnyType, ...kinds: Kind[]): boolean {
  return kinds.indexOf(t.kind) != -1;
}

export function codegenType(t: AnyType): string {
  switch (t.kind) {
    case Kind.Alias:
    case Kind.Enum:
    case Kind.Union:
    case Kind.Type:
      return (t as Named).name;
    case Kind.Primitive:
      return (t as Primitive).name;
    case Kind.Map:
      const m = t as Map;
      return `{${codegenType(m.keyType)}: ${codegenType(m.valueType)}}`;
    case Kind.List:
      const l = t as List;
      return `[${codegenType(l.type)}]`;
    case Kind.Optional:
      return `${codegenType((t as Optional).type)}?`;
    default:
      throw new Error(`Can not codegen type ${t.kind}`);
  }
}

const defaultNineBox: NineBox = [
  ["/**", "*", "**"],
  [" * ", " ", " *"],
  [" **", "*", "*/"],
];

type NineBox = [NineBoxRow, NineBoxRow, NineBoxRow];
type NineBoxRow = [string, string, string];

function fillToLengthWith(base: string, len: number, filler: string): string {
  const left = len - base.length;
  const numFill = Math.ceil(left / filler.length);
  return base + filler.repeat(numFill);
}
function nineBoxRow(
  rowDef: NineBoxRow,
  content: string,
  rowLength: number
): string {
  return `${rowDef[0]}${fillToLengthWith(
    content,
    rowLength - rowDef[0].length - rowDef[2].length,
    rowDef[1]
  )}${rowDef[2]}`;
}

export function generatedHeader(
  lines: string[],
  nineBox = defaultNineBox
): string {
  const maxLength =
    lines.reduce((acc, next) => (next.length > acc ? next.length : acc), 0) +
    nineBox[1][0].length +
    nineBox[1][2].length;
  const newLines = [];

  newLines.push(nineBoxRow(nineBox[0], nineBox[0][1], maxLength));
  for (let i = 0; i < lines.length; i++) {
    newLines.push(nineBoxRow(nineBox[1], lines[i], maxLength));
  }
  newLines.push(nineBoxRow(nineBox[2], nineBox[2][1], maxLength));

  return newLines.join("\n");
}

const OMIT_KEYS = ["node", "source"];

export function inspect(o: any, omit = OMIT_KEYS) {
  console.log(
    JSON.stringify(o, (k, v) => (OMIT_KEYS.indexOf(k) === -1 ? v : undefined))
  );
}

type NamedType = Enum | Type | Union | Alias;

export function isRecursiveType(typ: AnyType, seen: NamedType[] = []): boolean {
  if (isNamed(typ)) {
    if (seen.find((t) => t.name == typ.name)) return true;
    seen.push(typ);
  }
  switch (typ.kind) {
    case Kind.List: {
      const t = typ as List;
      return isRecursiveType(t.type, seen);
    }
    case Kind.Map: {
      const t = typ as Map;
      return (
        isRecursiveType(t.keyType, seen) || isRecursiveType(t.valueType, seen)
      );
    }
    case Kind.Optional: {
      const t = typ as Optional;
      return isRecursiveType(t.type, seen);
    }
    case Kind.Union: {
      const t = typ as Union;

      return t.types.filter((t) => isRecursiveType(t, seen)).length > 0;
    }

    case Kind.Type: {
      const t = typ as Type;
      return t.fields.filter((v) => isRecursiveType(v.type, seen)).length > 0;
    }
    case Kind.Enum:
    case Kind.Primitive:
    case Kind.Alias:
    case Kind.Void: {
      return false;
    }
    default: {
      throw new Error(`Unhandled type: ${typ.kind}`);
    }
  }
}
