/*
Copyright 2025 The Apex Authors.

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
  Kind,
  List,
  Map,
  Named,
  Optional,
} from "../../deps/@apexlang/core/model/mod.ts";
import { pascalCase } from "../utils/mod.ts";
import { translations } from "./constant.ts";

export interface Import {
  type: string;
  import?: string;
  parse?: string;
  format?: string;
}

export const expandType = (type: AnyType): string => {
  switch (type.kind) {
    case Kind.Primitive:
    case Kind.Alias:
    case Kind.Enum:
    case Kind.Type:
    case Kind.Union: {
      const namedValue = (type as Named).name;
      return translations.get(namedValue) ?? pascalCase(namedValue);
    }
    case Kind.Map:
      return `Dictionary<${expandType((type as Map).keyType)}, ${
        expandType(
          (type as Map).valueType,
        )
      }>`;
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
