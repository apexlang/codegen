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
  BaseVisitor,
  Context,
  Kind,
} from "https://deno.land/x/apex_core@v0.1.0/model/mod.ts";
import { defValue, expandType } from "./helpers.ts";
import { formatComment, snakeCase } from "../utils/mod.ts";

export class ClassVisitor extends BaseVisitor {
  visitTypeBefore(context: Context): void {
    super.triggerTypeBefore(context);
    const t = context.type!;
    this.write(`@deserialize
@serialize
@dataclass\n`);
    this.write(formatComment("# ", t.description));
    this.write(`class `);
    if (t.name.endsWith("Args")) {
      this.write(`_`);
    }
    this.write(`${t.name}:\n`);
  }

  visitTypeField(context: Context): void {
    const field = context.field!;
    this.write(formatComment("\t# ", field.description));
    let defaultSuffix = "";
    let defaultValue = defValue(field);
    switch (field.type.kind) {
      case Kind.List:
        defaultSuffix = "_factory";
        defaultValue = "list";
        break;
      case Kind.Map:
        defaultSuffix = "_factory";
        defaultValue = "dict";
        break;
    }
    this.write(
      `\t${snakeCase(field.name)}: ${
        expandType(
          field.type!,
          true,
        )
      } = field(default${defaultSuffix}=${defaultValue}, metadata={'serde_rename': '${field.name}'})\n`,
    );
    super.triggerTypeField(context);
  }

  visitTypeAfter(_context: Context): void {
    this.write(`\n\n`);
  }
}
