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
  BaseVisitor,
  Kind,
  Named,
  Type,
  AnyType,
  Union,
  Alias,
} from "@apexlang/core/model";
import { isNamed, isService } from "./utilities";

export class ExposedTypesVisitor extends BaseVisitor {
  found: Set<string> = new Set<string>();

  private add(name: string): void {
    if (!this.found.has(name)) {
      this.found.add(name);
    }
  }

  private checkType(any: AnyType) {
    if (isNamed(any)) {
      const n = any as Named;
      this.add(n.name);
    }

    switch (any.kind) {
      case Kind.Type:
        const t = any as Type;
        t.fields.forEach((field) => this.checkType(field.type));
        break;
      case Kind.Union:
        const u = any as Union;
        u.types.forEach((t) => this.checkType(t));
        break;
      case Kind.Alias:
        const a = any as Alias;
        this.checkType(a.type);
        break;
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
