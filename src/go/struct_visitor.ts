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
  Context,
  BaseVisitor,
  Writer,
  Kind,
  Named,
} from "@apexlang/core/model";
import { expandType, fieldName } from "./helpers.js";
import { translateAlias } from "./alias_visitor.js";
import { formatComment } from "../utils/index.js";

export class StructVisitor extends BaseVisitor {
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
    const packageName = context.config.otherPackage;

    const omitempty = field.type.kind === Kind.Optional ? ",omitempty" : "";
    this.write(formatComment("// ", field.description));

    // Prevent illegal circular reference error.
    const ptr =
      field.type.kind === Kind.Type && (field.type as Named).name == type.name
        ? "*"
        : "";

    this.write(
      `\t${fieldName(field, field.name)} ${ptr}${expandType(
        field.type!,
        packageName,
        true,
        translateAlias(context)
      )} \`json:"${field.name}${omitempty}" yaml:"${
        field.name
      }${omitempty}" msgpack:"${field.name}${omitempty}"`
    );
    this.triggerCallbacks(context, "StructTags");
    this.write(`\`\n`);
    super.triggerTypeField(context);
  }

  visitTypeAfter(context: Context): void {
    const { type } = context;
    const receiver = type.name.substring(0, 1).toLowerCase();
    this.write(`}\n\n`);

    if (this.writeTypeInfo) {
      this.write(`func (${receiver} *${type.name}) Type() string {
        return "${type.name}"
      }\n\n`);
    }
    super.triggerTypeAfter(context);
  }
}
