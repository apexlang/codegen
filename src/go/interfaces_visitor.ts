// deno-lint-ignore-file
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
  Context,
  Visitor,
  Writer,
} from "../../deps/@apexlang/core/model/mod.ts";
import { EnumVisitor } from "./enum_visitor.ts";
import { DefaultsVisitor, StructVisitor } from "./struct_visitor.ts";
import { AliasVisitor } from "./alias_visitor.ts";
import { isHandler, isProvider } from "../utils/mod.ts";
import { UnionVisitor } from "./union_visitor.ts";
import { InterfaceVisitor } from "./interface_visitor.ts";
import { GoVisitor } from "./go_visitor.ts";

export class InterfacesVisitor extends GoVisitor {
  writeTypeInfo = false;

  // Overridable visitor implementations
  serviceVisitor = (writer: Writer): Visitor => new InterfaceVisitor(writer);
  dependencyVisitor = (writer: Writer): Visitor => new InterfaceVisitor(writer);
  structVisitor = (writer: Writer): Visitor =>
    new StructVisitor(writer, this.writeTypeInfo);
  defaultsVisitor = (writer: Writer): Visitor => new DefaultsVisitor(writer);
  enumVisitor = (writer: Writer): Visitor =>
    new EnumVisitor(writer, this.writeTypeInfo);
  unionVisitor = (writer: Writer): Visitor =>
    new UnionVisitor(writer, this.writeTypeInfo);
  aliasVisitor = (writer: Writer): Visitor => new AliasVisitor(writer);

  public override visitFunctionBefore(context: Context): void {
    const { operation } = context;
    const visitor = this.serviceVisitor(this.writer);
    operation.accept(context, visitor);
  }

  public override visitInterfaceBefore(context: Context): void {
    const { interface: iface } = context;
    if (isProvider(context)) {
      const visitor = this.dependencyVisitor(this.writer);
      iface.accept(context, visitor);
    } else if (isHandler(context)) {
      const visitor = this.serviceVisitor(this.writer);
      iface.accept(context, visitor);
    }
  }

  public override visitAlias(context: Context): void {
    const visitor = this.aliasVisitor(this.writer);
    context.alias.accept(context, visitor);
  }

  public override visitEnum(context: Context): void {
    const visitor = this.enumVisitor(this.writer);
    context.enum.accept(context, visitor);
  }

  public override visitUnion(context: Context): void {
    const visitor = this.unionVisitor(this.writer);
    context.union.accept(context, visitor);
  }

  public override visitType(context: Context): void {
    const sVisitor = this.structVisitor(this.writer);
    context.type.accept(context, sVisitor);
    const dVisitor = this.defaultsVisitor(this.writer);
    context.type.accept(context, dVisitor);
  }
}
