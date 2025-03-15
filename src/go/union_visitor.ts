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

import {
  Annotated,
  Context,
  Writer,
} from "../../deps/@apexlang/core/model/mod.ts";
import { formatComment, snakeCase, typeName } from "../utils/mod.ts";
import { getImports, GoVisitor } from "./go_visitor.ts";
import {
  expandType,
  fieldName,
  shouldWriteTypeInfo,
  writeNamespaceEmbeddedStruct,
} from "./helpers.ts";

interface UnionKey {
  value: string;
}

export class UnionVisitor extends GoVisitor {
  private writeTypeInfo: boolean;

  constructor(writer: Writer, writeTypeInfo: boolean = false) {
    super(writer);
    this.writeTypeInfo = writeTypeInfo;
  }

  public override visitUnion(context: Context): void {
    const tick = "`";
    const { union } = context;
    const imports = getImports(context);

    const writeTypeInfo = shouldWriteTypeInfo(context, this.writeTypeInfo);
    if (writeTypeInfo) {
      writeNamespaceEmbeddedStruct(context, this.writer);

      this.write(
        `const UNION_${
          snakeCase(union.name).toUpperCase()
        } = "${union.name}"\n\n`,
      );
    }

    this.write(formatComment("// ", union.description));
    this.write(`type ${union.name} struct {\n`);
    if (writeTypeInfo) {
      this.write(`ns\n`);
    }
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

    if (writeTypeInfo) {
      const receiver = union.name.substring(0, 1).toLowerCase();
      this.write(`func (${receiver} *${union.name}) GetType() string {
      return UNION_${snakeCase(union.name).toUpperCase()}
    }\n\n`);
    }
  }
}
