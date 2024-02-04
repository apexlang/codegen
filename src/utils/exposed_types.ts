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
  BaseVisitor,
  Context,
  Kind,
  List,
  Map,
  Named,
  Optional,
  Type,
  Union,
} from "../deps/core/model.ts";
import { isNamed, isService } from "./utilities.ts";

export class ExposedTypesVisitor extends BaseVisitor {
  found: Set<string> = new Set<string>();

  private checkType(any: AnyType) {
    if (isNamed(any)) {
      const n = any as Named;
      if (!this.found.has(n.name)) {
        this.found.add(n.name);
      } else {
        return; // Prevent stack overflow
      }
    }

    switch (any.kind) {
      case Kind.Optional: {
        const o = any as Optional;
        this.checkType(o.type);
        break;
      }
      case Kind.Type: {
        const t = any as Type;
        t.fields.forEach((field) => this.checkType(field.type));
        break;
      }
      case Kind.Union: {
        const u = any as Union;
        u.members.forEach((member) => this.checkType(member.type));
        break;
      }
      case Kind.Alias: {
        const a = any as Alias;
        this.checkType(a.type);
        break;
      }
      case Kind.Map: {
        const m = any as Map;
        this.checkType(m.keyType);
        this.checkType(m.valueType);
        break;
      }
      case Kind.List: {
        const l = any as List;
        this.checkType(l.type);
        break;
      }
    }
  }

  visitOperation(context: Context): void {
    if (!isService(context)) {
      return;
    }
    const { operation } = context;
    this.checkType(operation.type);
  }

  visitParameter(context: Context): void {
    if (!isService(context)) {
      return;
    }
    const { parameter } = context;
    this.checkType(parameter.type);
  }
}
