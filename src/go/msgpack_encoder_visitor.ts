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
} from "https://raw.githubusercontent.com/apexlang/apex-js/deno-wip/src/model/mod.ts";
import { fieldName } from "./helpers.ts";
import { msgpackEncode } from "./msgpack_helpers.ts";

export class MsgPackEncoderVisitor extends BaseVisitor {
  visitTypeFieldsBefore(context: Context): void {
    super.triggerTypeFieldsBefore(context);
    this.write(
      `func (o *${context.type.name}) Encode(encoder msgpack.Writer) error {
    if o == nil {
      encoder.WriteNil()
      return nil
    }
    encoder.WriteMapSize(${context.fields!.length})\n`
    );
  }

  visitTypeField(context: Context): void {
    const field = context.field;
    this.write(`encoder.WriteString("${field.name}")\n`);
    this.write(
      msgpackEncode(
        context,
        false,
        "o." + fieldName(field, field.name),
        field.type
      )
    );
    super.triggerTypeField(context);
  }

  visitTypeFieldsAfter(context: Context): void {
    this.write(`
    return nil
  }\n\n`);
    super.triggerTypeFieldsAfter(context);
  }
}

export class MsgPackEncoderUnionVisitor extends BaseVisitor {
  visitTypeFieldsBefore(context: Context): void {
    super.triggerTypeFieldsBefore(context);
    this.write(
      `func (o *${context.type.name}) Encode(encoder msgpack.Writer) error {
    if o == nil {
      encoder.WriteNil()
      return nil
    }\n`
    );
  }

  visitTypeField(context: Context): void {
    const field = context.field;
    this.write(`if o.${fieldName(field, field.name)} != nil {\n`);
    this.write(`encoder.WriteMapSize(1)\n`);
    this.write(`encoder.WriteString("${field.name}")\n`);
    this.write(
      msgpackEncode(
        context,
        false,
        "o." + fieldName(field, field.name),
        field.type
      )
    );
    this.write(`return nil\n`);
    this.write(`}\n`);
    super.triggerTypeField(context);
  }

  visitTypeFieldsAfter(context: Context): void {
    this.write(`
    encoder.WriteNil()
    return nil
  }\n\n`);
    super.triggerTypeFieldsAfter(context);
  }
}
