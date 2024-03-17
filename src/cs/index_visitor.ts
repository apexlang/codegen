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

// This Visitor generates how final output should look like by combining all the visitors together

import {
  BaseVisitor,
  type Context,
  type Visitor,
  type Writer,
} from "@apexlang/core/model";
import { InterfacesVisitor } from "./interfaces_visitor.ts";
import { MinimalAPIVisitor } from "./api_visitor.ts";
import { ScaffoldVisitor } from "./scaffold_visitor.ts";
import { MainVisitor } from "./main_visitor.ts";
import { TypeVisitor } from "./types_visitor.ts";

export class IndexVisitor extends BaseVisitor {
  apiVisitor = (writer: Writer): Visitor => new MinimalAPIVisitor(writer);
  scaffoldVisitor = (writer: Writer): Visitor => new ScaffoldVisitor(writer);
  interfacesVisitor = (writer: Writer): Visitor =>
    new InterfacesVisitor(writer);
  main_visitor = (writer: Writer): Visitor => new MainVisitor(writer);
  typeVisitor = (writer: Writer): Visitor => new TypeVisitor(writer);

  public override visitNamespaceBefore(context: Context) {
    const visitor = this.apiVisitor(this.writer);
    context.namespace.accept(context, visitor);
    this.write(`\n`);
    super.visitNamespaceBefore(context);
  }

  public override visitNamespace(context: Context) {
    const visitor = this.scaffoldVisitor(this.writer);
    context.namespace.accept(context, visitor);
    this.write(`\n`);
    super.visitNamespace(context);
  }

  public override visitInterface(context: Context) {
    const visitor = this.interfacesVisitor(this.writer);
    context.interface.accept(context, visitor);
    this.write(`\n`);
    super.visitInterface(context);
  }

  public override visitNamespaceAfter(context: Context) {
    const visitor = this.main_visitor(this.writer);
    context.namespace.accept(context, visitor);
    this.write(`\n`);
    super.visitNamespaceBefore(context);
  }

  public override visitType(context: Context) {
    const visitor = this.typeVisitor(this.writer);
    context.type.accept(context, visitor);
    super.visitType(context);
  }
}
