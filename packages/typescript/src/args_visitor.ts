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

import { BaseVisitor, Context } from "@apexlang/core/model";
import { convertOperationToType, noCode } from "@apexlang/utils";
import { ClassVisitor } from "./class_visitor.js";

export class ArgsVisitor extends BaseVisitor {
  visitOperation(context: Context): void {
    const { interface: iface, operation } = context;
    if (noCode(operation)) {
      return;
    }
    if (operation.parameters.length == 0 || operation.isUnary()) {
      return;
    }
    const argObject = convertOperationToType(
      context.getType.bind(context),
      iface,
      operation
    );
    const args = new ClassVisitor(this.writer);
    argObject.accept(context.clone({ type: argObject }), args);
    super.triggerOperation(context);
  }
}
