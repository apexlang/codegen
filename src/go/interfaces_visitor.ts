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

import { BaseVisitor, Context, Visitor, Writer } from "@apexlang/core/model";
import { EnumVisitor } from "./enum_visitor.js";
import { StructVisitor } from "./struct_visitor.js";
import { ImportsVisitor } from "./imports_visitor.js";
import { AliasVisitor } from "./alias_visitor.js";
import {
  isHandler,
  isProvider,
} from "../utils/index.js";
import { UnionVisitor } from "./union_visitor.js";
import { InterfaceVisitor } from "./interface_visitor.js";

export class InterfacesVisitor extends BaseVisitor {
  // Overridable visitor implementations
  importsVisitor = (writer: Writer): Visitor => new ImportsVisitor(writer);
  serviceVisitor = (writer: Writer): Visitor => new InterfaceVisitor(writer);
  dependencyVisitor = (writer: Writer): Visitor => new InterfaceVisitor(writer);
  structVisitor = (writer: Writer): Visitor => new StructVisitor(writer, true);
  enumVisitor = (writer: Writer): Visitor => new EnumVisitor(writer);
  unionVisitor = (writer: Writer): Visitor => new UnionVisitor(writer);
  aliasVisitor = (writer: Writer): Visitor => new AliasVisitor(writer);

  visitNamespaceBefore(context: Context): void {
    const packageName = context.config.package || "module";
    this.write(`// Code generated by @apexlang/codegen. DO NOT EDIT.

    package ${packageName}
\n`);
    const visitor = this.importsVisitor(this.writer);
    const ns = context.namespace;
    ns.accept(context, visitor);
    this.write(`\n\n
      type ns struct{}

      func (n *ns) Namespace() string {
        return "${ns.name}"
      }\n\n`);

    ns.annotation("version", (a) => {
      this.write(`func (n *ns) Version() string {
          return "${a.arguments[0].value.getValue()}"
        }\n\n`);
    });
    super.triggerNamespaceBefore(context);
  }

  visitFunctionBefore(context: Context): void {
    const { operation } = context;
    const visitor = this.serviceVisitor(this.writer);
    operation.accept(context, visitor);
  }

  visitInterfaceBefore(context: Context): void {
    const { interface: iface } = context;
    if (isProvider(context)) {
      const visitor = this.dependencyVisitor(this.writer);
      iface.accept(context, visitor);
    } else if (isHandler(context)) {
      const visitor = this.serviceVisitor(this.writer);
      iface.accept(context, visitor);
    }
  }

  visitAlias(context: Context): void {
    const visitor = this.aliasVisitor(this.writer);
    context.alias.accept(context, visitor);
  }

  visitEnum(context: Context): void {
    const visitor = this.enumVisitor(this.writer);
    context.enum.accept(context, visitor);
  }

  visitUnion(context: Context): void {
    const visitor = this.unionVisitor(this.writer);
    context.union.accept(context, visitor);
  }

  visitType(context: Context): void {
    const visitor = this.structVisitor(this.writer);
    context.type.accept(context, visitor);
  }
}
