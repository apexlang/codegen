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

import { Annotated, Context } from "../../deps/@apexlang/core/model/mod.ts";
import { formatComment, typeName } from "../utils/mod.ts";
import { getImports, GoVisitor } from "./go_visitor.ts";
import { expandType, fieldName } from "./helpers.ts";

interface UnionKey {
  value: string;
}

export class UnionVisitor extends GoVisitor {
  public override visitUnion(context: Context): void {
    const tick = "`";
    const { union } = context;
    const imports = getImports(context);
    this.write(formatComment("// ", union.description));
    this.write(`type ${union.name} struct {\n`);
    union.members.forEach((member) => {
      let tname = typeName(member.type);
      member.annotation("unionKey", (a) => {
        tname = a.convert<UnionKey>().value;
      });

      imports.type(member.type);
      const expandedName = expandType(member.type);
      this.write(
        `${
          fieldName(
            undefined as unknown as Annotated,
            tname,
          )
        } *${expandedName} ${tick}json:"${tname},omitempty" yaml:"${tname},omitempty" msgpack:"${tname},omitempty`,
      );
      this.triggerCallbacks(context, "UnionStructTags");
      this.write(`"${tick}\n`);
    });
    this.write(`}\n\n`);
  }
}
