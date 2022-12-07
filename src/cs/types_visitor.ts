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
  Argument,
  BaseVisitor,
  Context,
} from "https://raw.githubusercontent.com/apexlang/apex-js/deno-wip/src/model/mod.ts";
import { camelCase, formatComment, pascalCase } from "../utils/mod.ts";
import { expandType } from "./helpers.ts";

export class TypeVisitor extends BaseVisitor {
  visitTypeBefore(context: Context): void {
    const { type } = context;

    this.write(formatComment("  // ", type.description));
    this.write(`  public record ${pascalCase(type.name)}\n  {\n`);

    super.visitTypesBefore(context);
  }

  visitTypeField(context: Context) {
    if (context.fieldIndex > 0) {
      this.write(`\n`);
    }
    const { field } = context;
    const type = expandType(field.type);

    const range = field.annotation("range");
    const email = field.annotation("email");
    const notEmpty = field.annotation("notEmpty");

    if (range || email || notEmpty) {
      const name = camelCase(field.name);
      let propName = pascalCase(field.name);

      this.write(`    private ${type} ${name};`);

      this.write(formatComment("    // ", field.description));
      this.write(`\t ${type} ${propName}\n`);
      this.write("    {\n");
      this.write(`      get { return this.${name}; }\n`);
      this.write("      set {\n\n");

      if (email && type === "string") {
        this.write(
          '        if (!System.Text.RegularExpressions.Regex.IsMatch(value, @"^([\\w-\\.]+)@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.)|(([\\w-]+\\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\\]?)$")) {\n'
        );
        this.write(
          `          throw new ArgumentException("value must be an email address", "${propName}");\n`
        );
        this.write("        }\n");
      }

      if (range && type === "string") {
        const { min, max } = getRangeArguments(range.arguments);

        this.write("        if (");
        if (min) {
          this.write(`value.Length < ${min}`);
        }

        if (min && max) {
          this.write(" || ");
        }

        if (max) {
          this.write(`value.Length > ${max}`);
        }
        this.write("  ) {\n");
        this.write(
          `          throw new ArgumentException("value must be in range", "${propName}");\n`
        );
        this.write("        }\n");
      }

      this.write(`        this.${name} = value;\n`);
      this.write("      }\n");
      this.write("    }\n");
    } else {
      this.write(formatComment("    // ", field.description));
      this.write(`\t public ${type} ${pascalCase(field.name)}`);
      this.write("   { get; set; }\n");
    }
  }

  visitTypeAfter(context: Context) {
    this.write("  }\n\n");

    super.visitTypeAfter(context);
  }
}

function getRangeArguments(args: Argument[]): { min: any; max: any } {
  let obj = { min: undefined, max: undefined };
  for (const arg of args) {
    // @ts-ignore
    obj[arg.name] = arg.value.getValue();
  }

  return obj;
}
