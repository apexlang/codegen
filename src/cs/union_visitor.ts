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

import { BaseVisitor, Context } from "../../deps/@apexlang/core/model/mod.ts";
import { formatComment, pascalCase } from "../utils/mod.ts";
import { expandType } from "./helpers.ts";

export class UnionVisitor extends BaseVisitor {
  public override visitUnion(context: Context): void {
    const { union } = context;
    this.write(`  ${formatComment("// ", union.description)}`);
    this.write(`public record ${union.name} {\n`);
    union.members.forEach((member) => {
      const typeName = expandType(member.type);
      this.write(`    public ${pascalCase(typeName)} ${typeName};`);
      this.triggerCallbacks(context, "UnionStructTags");
      this.write(`\n`);
    });
    this.write(`  }\n\n`);
  }
}
