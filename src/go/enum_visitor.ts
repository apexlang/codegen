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

import { Context, Writer } from "../deps/core/model.ts";
import { formatComment, pascalCase } from "../utils/mod.ts";
import { IMPORTS } from "./constant.ts";
import { getImporter, GoVisitor } from "./go_visitor.ts";

export class EnumVisitor extends GoVisitor {
  private writeTypeInfo: boolean;

  constructor(writer: Writer, writeTypeInfo: boolean = false) {
    super(writer);
    this.writeTypeInfo = writeTypeInfo;
  }

  visitEnumBefore(context: Context): void {
    super.triggerEnumsBefore(context);
    this.write(formatComment("// ", context.enum.description));
    this.write(`type ${context.enum.name} int32

    const (\n`);
  }

  visitEnumValue(context: Context): void {
    const { enumValue } = context;
    this.write(formatComment("// ", enumValue.description));
    this.write(
      `\t${context.enum.name}${
        pascalCase(enumValue.name)
      } ${context.enum.name} = ${enumValue.index}\n`,
    );
    super.triggerTypeField(context);
  }

  visitEnumAfter(context: Context): void {
    const $ = getImporter(context, IMPORTS);
    this.write(`)\n\n`);

    const toStringVisitor = new EnumVisitorToStringMap(this.writer);
    context.enum.accept(context, toStringVisitor);
    const toIDVisitor = new EnumVisitorToIDMap(this.writer);
    context.enum.accept(context, toIDVisitor);

    if (this.writeTypeInfo) {
      this.write(`func (e ${context.enum.name}) Type() string {
        return "${context.enum.name}"
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

// UnmarshalJSON unmashals a quoted json string to the enum value
func (e *${context.enum.name}) UnmarshalJSON(b []byte) error {
	var str string
	err := ${$.json}.Unmarshal(b, &str)
	if err != nil {
		return err
	}
  return e.FromString(str)
}
\n\n`);
    }
    super.triggerEnumsAfter(context);
  }
}

export class EnumVisitorToStringMap extends GoVisitor {
  visitEnumBefore(context: Context): void {
    super.triggerEnumsBefore(context);
    this.write(
      `var toString${context.enum.name} = map[${context.enum.name}]string{\n`,
    );
  }

  visitEnumValue(context: Context): void {
    const { enumValue } = context;
    const display = enumValue.display ? enumValue.display : enumValue.name;
    this.write(
      `\t${context.enum.name}${pascalCase(enumValue.name)}:"${display}",\n`,
    );
    super.triggerTypeField(context);
  }

  visitEnumAfter(context: Context): void {
    this.write(`}\n\n`);
    super.triggerEnumsAfter(context);
  }
}

export class EnumVisitorToIDMap extends GoVisitor {
  visitEnumBefore(context: Context): void {
    super.triggerEnumsBefore(context);
    this.write(
      `var toID${context.enum.name} = map[string]${context.enum.name}{\n`,
    );
  }

  visitEnumValue(context: Context): void {
    const { enumValue } = context;
    const display = enumValue.display ? enumValue.display : enumValue.name;
    this.write(
      `\t"${display}": ${context.enum.name}${pascalCase(enumValue.name)},\n`,
    );
    super.triggerTypeField(context);
  }

  visitEnumAfter(context: Context): void {
    this.write(`}\n\n`);
    super.triggerEnumsAfter(context);
  }
}
