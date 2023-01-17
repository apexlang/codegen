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

import { BaseVisitor, Context } from "../deps/core/model.ts";
import { formatComment, pascalCase } from "../utils/mod.ts";

export class EnumVisitor extends BaseVisitor {
  visitEnumBefore(context: Context): void {
    super.triggerEnumsBefore(context);
    this.write(formatComment("// ", context.enum.description));
    this.write(`export enum ${context.enum.name} {\n`);
  }

  visitEnumValue(context: Context): void {
    const { enumValue } = context;
    this.write(formatComment("// ", enumValue.description));
    this.write(
      `\t${pascalCase(enumValue.name)} = ${enumValue.index},\n`,
    );
    super.triggerTypeField(context);
  }

  visitEnumAfter(context: Context): void {
    this.write(`}\n\n`);
    super.triggerEnumsAfter(context);
  }
}
