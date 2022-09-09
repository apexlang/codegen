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

import { Context, BaseVisitor } from "@apexlang/core/model";
import { formatComment, pascalCase } from "../utils/index.js";

export class EnumVisitor extends BaseVisitor {
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
      `\t${context.enum.name}${pascalCase(enumValue.name)} ${
        context.enum.name
      } = ${enumValue.index}\n`
    );
    super.triggerTypeField(context);
  }

  visitEnumAfter(context: Context): void {
    const tick = "`";
    this.write(`)\n\n`);

    const toStringVisitor = new EnumVisitorToStringMap(this.writer);
    context.enum.accept(context, toStringVisitor);
    const toIDVisitor = new EnumVisitorToIDMap(this.writer);
    context.enum.accept(context, toIDVisitor);

    this.write(`func (e ${context.enum.name}) Type() string {
      return "${context.enum.name}"
    }

    func (e ${context.enum.name}) String() string {
      str, ok := toString${context.enum.name}[e]
      if !ok {
        return "unknown"
      }
      return str
    }

    func (e *${context.enum.name}) FromString(str string) (ok bool) {
      *e, ok = toID${context.enum.name}[str]
      return ok
    }

    // MarshalJSON marshals the enum as a quoted json string
func (e ${context.enum.name}) MarshalJSON() ([]byte, error) {
  return json.Marshal(e.String())
}

// UnmarshalJSON unmashals a quoted json string to the enum value
func (e *${context.enum.name}) UnmarshalJSON(b []byte) error {
	var str string
	err := json.Unmarshal(b, &str)
	if err != nil {
		return err
	}
  if !e.FromString(str) {
		return fmt.Errorf("unknown value %q for ${context.enum.name}", str)
	}
	return nil
}
\n\n`);
    super.triggerEnumsAfter(context);
  }
}

export class EnumVisitorToStringMap extends BaseVisitor {
  visitEnumBefore(context: Context): void {
    super.triggerEnumsBefore(context);
    this.write(
      `var toString${context.enum.name} = map[${context.enum.name}]string{\n`
    );
  }

  visitEnumValue(context: Context): void {
    const { enumValue } = context;
    const display = enumValue.display ? enumValue.display : enumValue.name;
    this.write(
      `\t${context.enum.name}${pascalCase(enumValue.name)}:"${display}",\n`
    );
    super.triggerTypeField(context);
  }

  visitEnumAfter(context: Context): void {
    this.write(`}\n\n`);
    super.triggerEnumsAfter(context);
  }
}

export class EnumVisitorToIDMap extends BaseVisitor {
  visitEnumBefore(context: Context): void {
    super.triggerEnumsBefore(context);
    this.write(
      `var toID${context.enum.name} = map[string]${context.enum.name}{\n`
    );
  }

  visitEnumValue(context: Context): void {
    const { enumValue } = context;
    const display = enumValue.display ? enumValue.display : enumValue.name;
    this.write(
      `\t"${display}": ${context.enum.name}${pascalCase(enumValue.name)},\n`
    );
    super.triggerTypeField(context);
  }

  visitEnumAfter(context: Context): void {
    this.write(`}\n\n`);
    super.triggerEnumsAfter(context);
  }
}
