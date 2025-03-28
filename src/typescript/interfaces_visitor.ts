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

import { BaseVisitor, Context } from "../../deps/@apexlang/core/model/mod.ts";
import { ClassVisitor } from "./class_visitor.ts";
import { EnumVisitor } from "./enum_visitor.ts";
import { InterfaceVisitor } from "./interface_visitor.ts";
import { AliasVisitor } from "./alias_visitor.ts";
import { ImportsVisitor } from "./imports_visitor.ts";

export class InterfacesVisitor extends BaseVisitor {
  public override visitNamespaceBefore(context: Context): void {
    const e = new ImportsVisitor(this.writer);
    context.namespace.accept(context, e);
    this.write(`\n`);
  }

  public override visitInterfaceBefore(context: Context): void {
    const iface = new InterfaceVisitor(this.writer);
    context.interface.accept(context, iface);
  }

  public override visitAlias(context: Context): void {
    const e = new AliasVisitor(this.writer);
    context.alias!.accept(context, e);
  }

  public override visitEnum(context: Context): void {
    const e = new EnumVisitor(this.writer);
    context.enum!.accept(context, e);
  }

  public override visitType(context: Context): void {
    const clazz = new ClassVisitor(this.writer);
    context.type!.accept(context, clazz);
  }
}
