// deno-lint-ignore-file
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

import { Context, Visitor, Writer } from "../deps/core/model.ts";
import { EnumVisitor } from "./enum_visitor.ts";
import { StructVisitor } from "./struct_visitor.ts";
import { AliasVisitor } from "./alias_visitor.ts";
import { isHandler, isProvider } from "../utils/mod.ts";
import { UnionVisitor } from "./union_visitor.ts";
import { InterfaceVisitor } from "./interface_visitor.ts";
import { GoVisitor } from "./go_visitor.ts";

export class InterfacesVisitor extends GoVisitor {
  writeTypeInfo = true;

  // Overridable visitor implementations
  serviceVisitor = (writer: Writer): Visitor => new InterfaceVisitor(writer);
  dependencyVisitor = (writer: Writer): Visitor => new InterfaceVisitor(writer);
  structVisitor = (writer: Writer): Visitor =>
    new StructVisitor(writer, this.writeTypeInfo);
  enumVisitor = (writer: Writer): Visitor =>
    new EnumVisitor(writer, this.writeTypeInfo);
  unionVisitor = (writer: Writer): Visitor => new UnionVisitor(writer);
  aliasVisitor = (writer: Writer): Visitor => new AliasVisitor(writer);

  visitNamespaceBefore(context: Context): void {
    const { namespace: ns } = context;
    this.writeTypeInfo = context.config.writeTypeInfo as boolean;
    if (this.writeTypeInfo == undefined) {
      this.writeTypeInfo = true;
    }

    if (this.writeTypeInfo) {
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
    }
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
