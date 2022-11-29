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

import { Context, BaseVisitor, Annotated } from "@apexlang/core/model";
import { formatComment, pascalCase, typeName } from "@apexlang/utils";
import { expandType, fieldName } from "./helpers.js";

export class UnionVisitor extends BaseVisitor {
  visitUnion(context: Context): void {
    const tick = "`";
    const { union } = context;
    this.write(formatComment("// ", union.description));
    this.write(`type ${union.name} struct {\n`);
    union.types.forEach((t) => {
      const tname = typeName(t);
      const expandedName = expandType(t);
      this.write(
        `${fieldName(
          undefined as unknown as Annotated,
          tname
        )} *${expandedName} ${tick}json:"${tname},omitempty" yaml:"${tname},omitempty" msgpack:"${tname},omitempty`
      );
      this.triggerCallbacks(context, "UnionStructTags");
      this.write(`"${tick}\n`);
    });
    this.write(`}\n\n`);
  }
}