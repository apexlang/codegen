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
  BaseVisitor,
  Context,
  Field,
} from "../../deps/@apexlang/core/model/mod.ts";
import { defValue, expandType } from "./helpers.ts";
import { formatComment } from "../utils/mod.ts";

export class ClassVisitor extends BaseVisitor {
  decorate(_field: Field): string {
    return "";
  }

  public override visitTypeBefore(context: Context): void {
    super.triggerTypeBefore(context);
    const t = context.type!;
    this.write(formatComment("// ", t.description));
    if (!t.name.endsWith("Args")) {
      this.write(`export `);
    }
    this.write(`class ${t.name} {\n`);
  }

  public override visitTypeField(context: Context): void {
    const field = context.field!;
    this.write(formatComment("  // ", field.description));
    const et = expandType(field.type!, true);
    if (et.indexOf("Date") != -1) {
      this.write(`${this.decorate(field)} `);
    }
    this.write(`  ${this.decorate(field)} ${field.name}: ${et};\n`);
    super.triggerTypeField(context);
  }

  public override visitTypeAfter(context: Context): void {
    this.write(`\n`);
    const ctor = new ConstructorVisitor(this.writer);
    context.type!.accept(context.clone({ type: context.type! }), ctor);

    this.write(`}\n\n`);
    super.triggerTypeAfter(context);
  }
}

class ConstructorVisitor extends BaseVisitor {
  public override visitTypeBefore(context: Context): void {
    super.triggerTypeBefore(context);
    const t = context.type!;
    this.write(`constructor({\n`);
    this.write(
      t.fields
        .map((field) => `${field.name} = ${defValue(context, field)}`)
        .join(`,\n`),
    );
    this.write(`}: {`);
    this.write(
      t.fields
        .map((field) => `${field.name}?: ${expandType(field.type!, true)}`)
        .join(`,\n`),
    );
    this.write(`} = {}) {\n`);
  }

  public override visitTypeField(context: Context): void {
    const field = context.field!;
    this.write(`  this.${field.name} = ${field.name}\n`);
    super.triggerTypeField(context);
  }

  public override visitTypeAfter(context: Context): void {
    this.write(`}\n`);
    super.triggerTypeAfter(context);
  }
}
