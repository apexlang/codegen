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

import { Context, Kind, Named, Writer } from "../deps/core/model.ts";
import { expandType, fieldName } from "./helpers.ts";
import { translateAlias } from "./alias_visitor.ts";
import { formatComment } from "../utils/mod.ts";
import { getImports, GoVisitor } from "./go_visitor.ts";

interface Serialize {
  value: string;
}

export class StructVisitor extends GoVisitor {
  private writeTypeInfo: boolean;

  constructor(writer: Writer, writeTypeInfo: boolean = false) {
    super(writer);
    this.writeTypeInfo = writeTypeInfo;
  }

  visitTypeBefore(context: Context): void {
    const { type } = context;
    super.triggerTypeBefore(context);
    this.write(formatComment("// ", type.description));
    this.write(`type ${type.name} struct {\n`);
    if (this.writeTypeInfo) {
      this.write(`  ns\n`);
    }
  }

  visitTypeField(context: Context): void {
    const { field, type } = context;
    const importer = getImports(context);
    importer.type(field.type);
    const packageName = context.config.otherPackage;

    const omitempty = field.type.kind === Kind.Optional ? ",omitempty" : "";
    this.write(formatComment("// ", field.description));

    // Prevent illegal circular reference error.
    const ptr =
      field.type.kind === Kind.Type && (field.type as Named).name == type.name
        ? "*"
        : "";

    let fieldNameTag = field.name;
    field.annotation("serialize", (a) => {
      fieldNameTag = a.convert<Serialize>().value;
    });

    const mapstructure = context.config.mapstructureTag == true
      ? ` mapstructure:"${fieldNameTag}"`
      : ``;
    const customTags = this.structTags(context);

    this.write(
      `\t${fieldName(field, field.name)} ${ptr}${
        expandType(
          field.type!,
          packageName,
          true,
          translateAlias(context),
        )
      } \`json:"${fieldNameTag}${omitempty}" yaml:"${fieldNameTag}${omitempty}" msgpack:"${fieldNameTag}${omitempty}"${mapstructure}${customTags}`,
    );
    this.triggerCallbacks(context, "StructTags");
    this.write(`\`\n`);
    super.triggerTypeField(context);
  }

  visitTypeAfter(context: Context): void {
    const { type } = context;
    const receiver = type.name.substring(0, 1).toLowerCase();
    this.write(`}\n\n`);

    let writeTypeInfo = context.config.writeTypeInfo as boolean;
    if (writeTypeInfo == undefined) {
      writeTypeInfo = this.writeTypeInfo;
    }
    if (writeTypeInfo) {
      this.write(`func (${receiver} *${type.name}) Type() string {
        return "${type.name}"
      }\n\n`);
    }
    super.triggerTypeAfter(context);
  }

  structTags(_context: Context): string {
    return "";
  }
}
