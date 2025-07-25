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
  Context,
  Field,
  Kind,
  Named,
  Writer,
} from "../../deps/@apexlang/core/model/mod.ts";
import {
  defaultValueForType,
  expandType,
  fieldName,
  shouldWriteTypeInfo,
  writeNamespaceEmbeddedStruct,
} from "./helpers.ts";
import { translateAlias } from "./alias_visitor.ts";
import { formatComment } from "../utils/mod.ts";
import { getImports, GoVisitor } from "./go_visitor.ts";
import {
  Kind as ASTKind,
  StringValue,
  Value,
} from "../../deps/@apexlang/core/ast/mod.ts";
import { snakeCase } from "../utils/utilities.ts";

interface Serialize {
  value: string;
}

export class StructVisitor extends GoVisitor {
  private writeTypeInfo: boolean;

  constructor(writer: Writer, writeTypeInfo: boolean = false) {
    super(writer);
    this.writeTypeInfo = writeTypeInfo;
  }

  public override visitTypeBefore(context: Context): void {
    const { type } = context;
    super.triggerTypeBefore(context);

    const writeTypeInfo = shouldWriteTypeInfo(context, this.writeTypeInfo);
    if (writeTypeInfo) {
      writeNamespaceEmbeddedStruct(context, this.writer);
      this.write(
        `const TYPE_${snakeCase(type.name).toUpperCase()} = "${type.name}"\n\n`,
      );
    }

    this.write(formatComment("// ", type.description));
    this.write(`type ${type.name} struct {\n`);

    if (writeTypeInfo) {
      this.write('  ns `yaml:"-"`\n');
    }
  }

  public override visitTypeField(context: Context): void {
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

  public override visitTypeAfter(context: Context): void {
    const { type } = context;
    const importer = getImports(context);
    const receiver = type.name.substring(0, 1).toLowerCase();
    this.write(`}\n\n`);

    let writeTypeInfo = context.config.writeTypeInfo as boolean;
    if (writeTypeInfo == undefined) {
      writeTypeInfo = this.writeTypeInfo;
    }
    if (writeTypeInfo) {
      const idField = type.fields.find((f: Field) => f.name == "id");
      if (idField) {
        importer.type(idField.type);
        const packageName = context.config.otherPackage;
        const idType = expandType(
          idField.type!,
          packageName,
          true,
          translateAlias(context),
        );
        const idDefault = defaultValueForType(
          context,
          idField.type,
          packageName,
        );
        this.write(`func (${receiver} *${type.name}) GetID() ${idType} {
          if ${receiver} == nil {
            return ${idDefault}
          }
        
          return ${receiver}.ID
        }
        
        func (${receiver} *${type.name}) SetID(id ${idType}) {
          if ${receiver} == nil {
            return
          }
        
          ${receiver}.ID = id
        }\n\n`);
      }
      this.write(`func (${receiver} *${type.name}) GetType() string {
        return TYPE_${snakeCase(type.name).toUpperCase()}
      }\n\n`);
    }
    super.triggerTypeAfter(context);
  }

  structTags(_context: Context): string {
    return "";
  }
}

export class DefaultsVisitor extends GoVisitor {
  public override visitTypeBefore(context: Context): void {
    const { type } = context;
    super.triggerTypeBefore(context);
    this.write(
      formatComment(
        "// ",
        `Default${type.name} returns a \`${type.name}\` struct populated with its default values.`,
      ),
    );
    this.write(`func Default${type.name}() ${type.name} {
      return ${type.name}{\n`);
  }

  public override visitTypeField(context: Context): void {
    const { field } = context;
    if (!field.default) {
      return;
    }
    this.write(
      `\t${fieldName(field, field.name)}: ${valueLiteral(field.default)},\n`,
    );
  }

  public override visitTypeAfter(_context: Context): void {
    this.write(`}\n}\n\n`);
  }
}

function valueLiteral(value: Value): string {
  switch (value.getKind()) {
    case ASTKind.StringValue: {
      const sv = value as StringValue;
      return `"${
        sv.value.replaceAll(`\\`, `\\\\`).replaceAll(`"`, `\\"`).replaceAll(
          `\n`,
          `\\n`,
        )
      }"`;
    }
  }
  return `${value.getValue()}`;
}
