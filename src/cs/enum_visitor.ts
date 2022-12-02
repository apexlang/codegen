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

import { BaseVisitor, Context } from "https://raw.githubusercontent.com/apexlang/apex-js/deno-wip/src/model";
import { formatComment, pascalCase } from "../utils";

export class EnumVisitor extends BaseVisitor {
  visitEnumBefore(context: Context) {
    this.write(formatComment("  // ", context.enum.description));
    this.write(`  public enum ${pascalCase(context.enum.name)}\n  {\n`);
    super.visitEnumBefore(context);
  }

  visitEnumAfter(context: Context) {
    this.write("  }\n");

    this.write(`
  public static class Extensions
  {
    public static int Value(this ${context.enum.name} enumValue)
    {
      //Do something here
      return (int)enumValue;
    }
  }\n`);
    super.visitEnumAfter(context);
  }

  visitEnum(context: Context) {
    const values = context.enum.values;
    for (let i = 0; i < values.length; ++i) {
      this.write(`    ${pascalCase(values[i].name)}`);
      if (i != values.length - 1) {
        this.write(`,`);
      }
      this.write(`\n`);
    }
    super.visitEnum(context);
  }
}
