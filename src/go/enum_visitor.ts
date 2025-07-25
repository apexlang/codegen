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

import { Context, Writer } from "../../deps/@apexlang/core/model/mod.ts";
import { formatComment, pascalCase, snakeCase } from "../utils/mod.ts";
import { IMPORTS } from "./constant.ts";
import { getImporter, GoVisitor } from "./go_visitor.ts";
import {
  shouldWriteTypeInfo,
  writeNamespaceEmbeddedStruct,
} from "./helpers.ts";

export class EnumVisitor extends GoVisitor {
  private writeTypeInfo: boolean;

  constructor(writer: Writer, writeTypeInfo: boolean = false) {
    super(writer);
    this.writeTypeInfo = writeTypeInfo;
  }

  public override visitEnumBefore(context: Context): void {
    super.triggerEnumsBefore(context);

    const writeTypeInfo = shouldWriteTypeInfo(context, this.writeTypeInfo);
    if (writeTypeInfo) {
      writeNamespaceEmbeddedStruct(context, this.writer);
    }

    this.write(formatComment("// ", context.enum.description));
    this.write(`type ${context.enum.name} int32

    const (\n`);
  }

  public override visitEnumValue(context: Context): void {
    const { enumValue } = context;
    this.write(formatComment("// ", enumValue.description));
    this.write(
      `\t${context.enum.name}${
        pascalCase(enumValue.name)
      } ${context.enum.name} = ${enumValue.index}\n`,
    );
    super.triggerTypeField(context);
  }

  public override visitEnumAfter(context: Context): void {
    const $ = getImporter(context, IMPORTS);
    this.write(`)\n\n`);

    const toStringVisitor = new EnumVisitorToStringMap(this.writer);
    context.enum.accept(context, toStringVisitor);
    const toIDVisitor = new EnumVisitorToIDMap(this.writer);
    context.enum.accept(context, toIDVisitor);

    if (this.writeTypeInfo) {
      const constName = `ENUM_${snakeCase(context.enum.name).toUpperCase()}`;
      this.write(
        `const ${constName} = "${context.enum.name}"\n\n`,
      );
      this.write(`func (e ${context.enum.name}) GetType() string {
        return ${constName}
      }\n\n`);
    }

    this.write(`func (e ${context.enum.name}) String() string {
      str, ok := toString${context.enum.name}[e]
      if !ok {
        return "unknown"
      }
      return str
    }

    func (e *${context.enum.name}) FromString(str string) error {
      var ok bool
      *e, ok = toID${context.enum.name}[str]
      if !ok {
        return ${$.errors}.New("unknown value \\"" + str + "\\" for ${context.enum.name}")
      }
      return nil
    }\n\n`);

    const jsonSupport = context.config.noEnumJSON
      ? !context.config.noEnumJSON
      : true;
    if (jsonSupport) {
      this.write(`// MarshalJSON marshals the enum as a quoted json string
func (e ${context.enum.name}) MarshalJSON() ([]byte, error) {
  return ${$.json}.Marshal(e.String())
}

// UnmarshalJSON unmarshals a quoted json string to the enum value
func (e *${context.enum.name}) UnmarshalJSON(b []byte) error {
	var str string
	err := ${$.json}.Unmarshal(b, &str)
	if err != nil {
		return err
	}
  return e.FromString(str)
}\n\n`);
    }
    const yamlSupport = context.config.noEnumYAML
      ? !context.config.noEnumYAML
      : true;
    if (yamlSupport) {
      this.write(`// MarshalYAML marshals the enum as a YAML string
  func (e ${context.enum.name}) MarshalYAML() (any, error) {
    return e.String(), nil
  }
  
  // UnmarshalYAML unmarshals a quoted YAML string to the enum value
  func (e *${context.enum.name}) UnmarshalYAML(unmarshal func(any) error) error {
    var str string
    if err := unmarshal(&str); err != nil {
      return err
    }

    return e.FromString(str)
  }\n\n`);
    }

    super.triggerEnumsAfter(context);
  }
}

export class EnumVisitorToStringMap extends GoVisitor {
  public override visitEnumBefore(context: Context): void {
    super.triggerEnumsBefore(context);
    this.write(
      `var toString${context.enum.name} = map[${context.enum.name}]string{\n`,
    );
  }

  public override visitEnumValue(context: Context): void {
    const { enumValue } = context;
    const display = enumValue.display ? enumValue.display : enumValue.name;
    this.write(
      `\t${context.enum.name}${pascalCase(enumValue.name)}:"${display}",\n`,
    );
    super.triggerTypeField(context);
  }

  public override visitEnumAfter(context: Context): void {
    this.write(`}\n\n`);
    super.triggerEnumsAfter(context);
  }
}

export class EnumVisitorToIDMap extends GoVisitor {
  public override visitEnumBefore(context: Context): void {
    super.triggerEnumsBefore(context);
    this.write(
      `var toID${context.enum.name} = map[string]${context.enum.name}{\n`,
    );
  }

  public override visitEnumValue(context: Context): void {
    const { enumValue } = context;
    const display = enumValue.display ? enumValue.display : enumValue.name;
    this.write(
      `\t"${display}": ${context.enum.name}${pascalCase(enumValue.name)},\n`,
    );
    super.triggerTypeField(context);
  }

  public override visitEnumAfter(context: Context): void {
    this.write(`}\n\n`);
    super.triggerEnumsAfter(context);
  }
}
