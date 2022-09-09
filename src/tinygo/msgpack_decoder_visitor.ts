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
import { fieldName } from "../go/index.js";
import { read } from "./msgpack_helpers.js";

export class MsgPackDecoderVisitor extends BaseVisitor {
  visitTypeFieldsBefore(context: Context): void {
    super.triggerTypeFieldsBefore(context);
    const type = context.type!;
    this.write(
      `func (o *${type.name}) Decode(decoder msgpack.Reader) error {
    numFields, err := decoder.ReadMapSize()
    if err != nil {
      return err
    }

    for numFields > 0 {
      numFields--;
      field, err := decoder.ReadString()
      if err != nil {
        return err
      }
      switch field {\n`
    );
  }

  visitTypeField(context: Context): void {
    const field = context.field!;
    this.write(`case "${field.name}":\n`);
    this.write(
      read(
        context,
        false,
        `o.${fieldName(field, field.name)}`,
        true,
        "",
        field.type,
        false
      )
    );
    super.triggerTypeField(context);
  }

  visitTypeFieldsAfter(context: Context): void {
    if (context.fields!.length > 0) {
      this.write(`default:
        err = decoder.Skip()
      }\n`);
    }
    this.write(`if err != nil {
      return err
    }
  }\n`);
    this.write(`
    return nil
  }\n\n`);
    super.triggerTypeFieldsAfter(context);
  }
}
