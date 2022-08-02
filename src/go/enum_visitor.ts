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

import { Context, BaseVisitor } from "@apexlang/core/model";
import { formatComment, pascalCase } from "../utils";

export class EnumVisitor extends BaseVisitor {
  visitEnumBefore(context: Context): void {
    super.triggerEnumsBefore(context);
    this.write(formatComment("// ", context.enum.description));
    this.write(`type ${context.enum.name} int

    const (\n`);
  }

  visitEnumValue(context: Context): void {
    const { enumValue } = context;
    this.write(formatComment("// ", enumValue.description));
    this.write(
      `\t${context.enum.name}${pascalCase(enumValue.name)} ${
        context.enum.name
      } = ${enumValue.index}\n`
    );
    super.triggerTypeField(context);
  }

  visitEnumAfter(context: Context): void {
    this.write(`)\n\n`);
    super.triggerEnumsAfter(context);
  }
}

export class EnumVisitorToString extends BaseVisitor {
  visitEnumBefore(context: Context): void {
    super.triggerEnumsBefore(context);
    this.write(formatComment("// ", context.enum.description));
    this.write(`func (e ${context.enum.name}) String() string {
      switch e {\n`);
  }

  visitEnumValue(context: Context): void {
    const { enumValue } = context;
    const display = enumValue.display ? enumValue.display : enumValue.name;
    this.write(`    case ${context.enum.name}${pascalCase(enumValue.name)}:
       return "${display}"\n`);
    super.triggerTypeField(context);
  }

  visitEnumAfter(context: Context): void {
    this.write(`    }\n\n`);
    this.write(`    return "unknown"\n`);
    this.write(`}\n\n`);
    super.triggerEnumsAfter(context);
  }
}
