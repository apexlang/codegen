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
  Context,
  AnyType,
  Optional,
  Named,
  Map,
  List,
  Parameter,
  Kind,
  Alias,
  Primitive,
  PrimitiveName,
  Enum,
} from "@apexlang/core/model";
import {
  expandType,
  fieldName,
  Import,
  returnShare,
  translateAlias,
  translations,
} from "../go/index.js";
import {
  castFuncs,
  castNillableFuncs,
  decodeFuncs,
  decodeNillableFuncs,
  encodeFuncs,
  encodeNillableFuncs,
} from "./msgpack_constants.js";

/**
 * Creates string that is an msgpack read code block
 * @param variable variable that is being read
 * @param t the type node to write
 * @param prevOptional if type is being expanded and the parent type is optional
 * @param isReference if the type that is being expanded has a `@ref` annotation
 */
export function read(
  context: Context,
  typeInstRef: boolean,
  variable: string,
  errorHandling: boolean,
  defaultVal: string,
  t: AnyType,
  prevOptional: boolean
): string {
  const tr = translateAlias(context);
  const returnPrefix = defaultVal == "" ? "" : `${defaultVal}, `;
  let prefix = "return ";
  if (variable != "") {
    if (
      variable == "item" ||
      variable == "key" ||
      variable == "value" ||
      variable == "ret" ||
      variable == "request"
    ) {
      if (errorHandling) {
        prefix = variable + ", err := ";
      } else {
        prefix = variable + " := ";
      }
    } else {
      if (t.kind == Kind.Type && !prevOptional) {
        let type = t as Named;
        if (errorHandling) {
          prefix = "err = ";
        }
        return `${prefix}${variable}.Decode(decoder)\n`;
      }
      if (errorHandling) {
        prefix = variable + ", err = ";
      } else {
        prefix = variable + " = ";
      }
    }
  }
  switch (t.kind) {
    case Kind.Alias:
      const aliases =
        (context.config.aliases as { [key: string]: Import }) || {};
      const a = t as Alias;
      const prim = a.type as Primitive;
      const imp = aliases[a.name];
      if (imp && imp.parse) {
        if (prevOptional) {
          const decoder = decodeNillableFuncs.get(prim.name)!;
          return `${prefix}convert.NillableParse(${imp.parse})(decoder.${decoder}())\n`;
        } else {
          const decoder = decodeFuncs.get(prim.name)!;
          return `${prefix}convert.Parse(${imp.parse})(decoder.${decoder}())\n`;
        }
      }
      if (prevOptional) {
        const caster = castNillableFuncs.get(prim.name)!;
        const decoder = decodeNillableFuncs.get(prim.name)!;
        return `${prefix}${caster}[${a.name}](decoder.${decoder}())\n`;
      } else {
        const caster = castFuncs.get(prim.name)!;
        const decoder = decodeFuncs.get(prim.name)!;
        return `${prefix}${caster}[${a.name}](decoder.${decoder}())\n`;
      }
    case Kind.Union:
    case Kind.Type:
    case Kind.Primitive: {
      if (t.kind == Kind.Primitive) {
        const prim = t as Primitive;
        if (prim.name == PrimitiveName.DateTime) {
          if (prevOptional) {
            return `${prefix}convert.StringToTimePtr(decoder.ReadNillableString())\n`;
          }
          return `${prefix}convert.StringToTime(decoder.ReadString())\n`;
        }
      }
      let namedNode = t as Named;
      const amp = typeInstRef ? "&" : "";
      let decodeFn = `msgpack.Decode[${namedNode.name}](${amp}decoder)`;
      if (prevOptional) {
        decodeFn = `msgpack.DecodeNillable[${namedNode.name}](decoder)`;
      }
      if (prevOptional && decodeNillableFuncs.has(namedNode.name)) {
        decodeFn = `decoder.${decodeNillableFuncs.get(namedNode.name)}()`;
      } else if (decodeFuncs.has(namedNode.name)) {
        decodeFn = `decoder.${decodeFuncs.get(namedNode.name)}()`;
      }
      return `${prefix}${decodeFn}\n`;
    }
    case Kind.Enum: {
      let e = t as Enum;
      let decodeFn = `convert.Numeric[${e.name}](decoder.ReadInt32())`;
      if (prevOptional) {
        decodeFn = `convert.NillableNumeric[${e.name}](decoder.ReadNillableInt32())`;
      }
      return `${prefix}${decodeFn}\n`;
    }
    case Kind.Map:
      let mapCode = `mapSize, err := decoder.ReadMapSize()
      if err != nil {
        return ${returnPrefix}err
      }\n`;
      if (variable == "ret") {
        mapCode += "ret :=";
      } else {
        mapCode += `${variable} = `;
      }
      mapCode += `make(map[${expandType(
        (t as Map).keyType,
        undefined,
        true,
        tr
      )}]${expandType((t as Map).valueType, undefined, true, tr)}, mapSize)\n`;
      mapCode += `for mapSize > 0 {
        mapSize--\n`;
      mapCode += read(
        context,
        typeInstRef,
        "key",
        true,
        defaultVal,
        (t as Map).keyType,
        false
      );
      if (!mapCode.endsWith(`\n`)) {
        mapCode += `\n`;
      }
      mapCode += `if err != nil {
          return ${returnPrefix}err
        }\n`;
      mapCode += read(
        context,
        typeInstRef,
        "value",
        true,
        defaultVal,
        (t as Map).valueType,
        false
      );
      if (!mapCode.endsWith(`\n`)) {
        mapCode += `\n`;
      }
      mapCode += `if err != nil {
          return ${returnPrefix}err
        }\n`;
      mapCode += `${variable}[key] = value
      }\n`;
      return mapCode;
    case Kind.List:
      let listCode = `listSize, err := decoder.ReadArraySize()
      if err != nil {
        return ${returnPrefix}err
      }\n`;
      if (variable == "ret") {
        listCode += "ret :=";
      } else {
        listCode += `${variable} = `;
      }
      listCode += `make([]${expandType(
        (t as List).type,
        undefined,
        true,
        tr
      )}, 0, listSize)\n`;
      listCode += `for listSize > 0 {
        listSize--
        var nonNilItem ${
          (t as List).type.kind == Kind.Optional ? "*" : ""
        }${expandType((t as List).type, undefined, false, tr)}\n`;
      listCode += read(
        context,
        typeInstRef,
        "nonNilItem",
        true,
        defaultVal,
        (t as List).type,
        false
      );
      if (!listCode.endsWith(`\n`)) {
        listCode += `\n`;
      }
      listCode += `if err != nil {
          return ${returnPrefix}err
        }\n`;
      listCode += `${variable} = append(${variable}, nonNilItem)
      }\n`;
      return listCode;
    case Kind.Optional:
      const optNode = t as Optional;
      optNode.type;
      switch (optNode.type.kind) {
        case Kind.List:
        case Kind.Map:
          return read(
            context,
            typeInstRef,
            variable,
            false,
            defaultVal,
            optNode.type,
            true
          );
      }
      let optCode = "";
      // optCode += "isNil, err := decoder.IsNextNil()\n";
      // optCode += "if err == nil {\n";
      // optCode += "if isNil {\n";
      // optCode += prefix.replace(", err", "") + "nil;\n";
      // optCode += "} else {\n";
      // optCode += `var nonNil ${expandType(optNode.type, "", false, tr)}\n`;
      optCode += read(
        context,
        typeInstRef,
        variable,
        true,
        defaultVal,
        optNode.type,
        true
      );
      // optCode += "}\n";
      // optCode += "}\n";
      return optCode;
    default:
      return "unknown\n";
  }
}

/**
 * Creates string that is an msgpack write code block
 * @param typeInst name of variable which object that is writting is assigning to
 * @param typeClass class that is being written
 * @param typeMeth method that is being called
 * @param variable variable that is being written
 * @param t the type node to write
 * @param prevOptional if type is being expanded and the parent type is optional
 * @param isReference if the type that is being expanded has a `@ref` annotation
 */
export function write(
  context: Context,
  typeInst: string,
  typeInstRef: boolean,
  typeClass: string,
  typeMeth: string,
  variable: string,
  t: AnyType,
  prevOptional: boolean
): string {
  let code = "";
  switch (t.kind) {
    case Kind.Alias:
      const aliases =
        (context.config.aliases as { [key: string]: Import }) || {};
      const a = t as Alias;
      const imp = aliases[a.name];
      const p = a.type as Primitive;
      if (imp && imp.format) {
        return `${typeInst}.${encodeFuncs.get(p.name)}(${variable}.${
          imp.format
        }())\n`;
      }
      const castType = translations.get(p.name);
      if (prevOptional && encodeNillableFuncs.has(p.name)) {
        return `${typeInst}.${encodeNillableFuncs.get(
          p.name
        )}((*${castType})(${variable}))\n`;
      }
      if (encodeFuncs.has(p.name)) {
        return `${typeInst}.${encodeFuncs.get(
          p.name
        )}(${castType}(${variable}))\n`;
      }
      return "???\n";
    case Kind.Union:
    case Kind.Type:
    case Kind.Primitive:
      if (t.kind == Kind.Primitive) {
        const prim = t as Primitive;
        if (prim.name == PrimitiveName.DateTime) {
          if (prevOptional) {
            return `${typeInst}.WriteNillableString(convert.TimeToStringPtr(${variable}))\n`;
          }
          return `${typeInst}.WriteString(convert.TimeToString(${variable}))\n`;
        }
      }
      const namedNode = t as Named;
      if (prevOptional && encodeNillableFuncs.has(namedNode.name)) {
        return `${typeInst}.${encodeNillableFuncs.get(
          namedNode.name
        )}(${variable})\n`;
      }
      if (encodeFuncs.has(namedNode.name)) {
        return `${typeInst}.${encodeFuncs.get(namedNode.name)}(${variable})\n`;
      }
      const amp = typeInstRef ? "&" : "";
      return `${variable}.${typeMeth}(${amp}${typeInst})\n`;
    case Kind.Enum:
      const e = t as Enum;
      if (!prevOptional) {
        return `${typeInst}.WriteInt32(int32(${variable}))\n`;
      }
      return `${typeInst}.WriteNillableInt32((*int32)(${variable}))\n`;
    case Kind.Map:
      const mappedNode = t as Map;
      code +=
        typeInst +
        `.WriteMapSize(uint32(len(${variable})))
      if ${variable} != nil { // TinyGo bug: ranging over nil maps panics.
      for k, v := range ${variable} {
        ${write(
          context,
          typeInst,
          typeInstRef,
          typeClass,
          typeMeth,
          "k",
          mappedNode.keyType,
          false
        )}${write(
          context,
          typeInst,
          typeInstRef,
          typeClass,
          typeMeth,
          "v",
          mappedNode.valueType,
          false
        )}}
      }\n`;
      return code;
    case Kind.List:
      const listNode = t as List;
      code +=
        typeInst +
        `.WriteArraySize(uint32(len(${variable})))
      for _, v := range ${variable} {
        ${write(
          context,
          typeInst,
          typeInstRef,
          typeClass,
          typeMeth,
          "v",
          listNode.type,
          false
        )}}\n`;
      return code;
    case Kind.Optional:
      const optionalNode = t as Optional;
      switch (optionalNode.type.kind) {
        case Kind.Alias:
          const a = optionalNode.type as Alias;
          const aliases =
            (context.config.aliases as { [key: string]: Import }) || {};
          const imp = aliases[a.name];
          if (imp && imp.format) {
            break;
          }
        case Kind.List:
        case Kind.Map:
        case Kind.Enum:
        case Kind.Type:
        case Kind.Primitive:
          return write(
            context,
            typeInst,
            typeInstRef,
            typeClass,
            typeMeth,
            variable,
            optionalNode.type,
            true
          );
      }
      code += "if " + variable + " == nil {\n";
      code += typeInst + ".WriteNil()\n";
      code += "} else {\n";
      let vprefix = returnDeref(context, optionalNode.type);
      code += write(
        context,
        typeInst,
        typeInstRef,
        typeClass,
        typeMeth,
        vprefix + variable,
        optionalNode.type,
        true
      );
      code += "}\n";
      return code;
    default:
      return "unknown\n";
  }
}

function returnDeref(context: Context, type: AnyType): string {
  if (type.kind === Kind.Alias) {
    const a = type as Alias;
    const aliases = (context.config.aliases as { [key: string]: Import }) || {};
    const imp = aliases[a.name];
    if (imp && imp.format) {
      return "";
    }
    type = a.type;
  }
  if (type.kind === Kind.Primitive) {
    const p = type as Primitive;
    if (p.name != PrimitiveName.Bytes) {
      return "*";
    }
  }
  return "";
}

/**
 * Creates string that is an msgpack size code block
 * @param variable variable that is being size
 * @param t the type node to encode
 * @param isReference if the type that is being expanded has a `@ref` annotation
 */
export function size(
  context: Context,
  typeInstRef: boolean,
  variable: string,
  t: AnyType
): string {
  return write(
    context,
    "sizer",
    typeInstRef,
    "Writer",
    "Encode",
    variable,
    t,
    false
  );
}

/**
 * Creates string that is an msgpack encode code block
 * @param variable variable that is being encode
 * @param t the type node to encode
 * @param isReference if the type that is being expanded has a `@ref` annotation
 */
export function encode(
  context: Context,
  typeInstRef: boolean,
  variable: string,
  t: AnyType
): string {
  return write(
    context,
    "encoder",
    typeInstRef,
    "Writer",
    "Encode",
    variable,
    t,
    false
  );
}

export function varAccessParam(variable: string, args: Parameter[]): string {
  return (
    `ctx` +
    (args.length > 0 ? ", " : "") +
    args
      .map((arg) => {
        return `${returnShare(arg.type)}${variable}.${fieldName(
          arg,
          arg.name
        )}`;
      })
      .join(", ")
  );
}
