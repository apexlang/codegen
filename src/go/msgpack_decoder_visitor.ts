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

import { Context } from "../../deps/@apexlang/core/model/mod.ts";
import { IMPORTS } from "./constant.ts";
import { getImporter, GoVisitor } from "./go_visitor.ts";
import { fieldName } from "./helpers.ts";
import { msgpackRead } from "./msgpack_helpers.ts";

export class MsgPackDecoderVisitor extends GoVisitor {
  public override visitTypeFieldsBefore(context: Context): void {
    super.triggerTypeFieldsBefore(context);
    const $ = getImporter(context, IMPORTS);

    const type = context.type;
    this.write(
      `func (o *${type.name}) Decode(decoder ${$.msgpack}.Reader) error {
    numFields, err := decoder.ReadMapSize()
    if err != nil {
      return err
    }

    var _o ${type.name}
    for numFields > 0 {
      numFields--;
      ${context.fields.length > 0 ? "field" : "_"}, err := decoder.ReadString()
      if err != nil {
        return err
      }\n`,
    );
    if (context.fields.length > 0) {
      this.write(`switch field {\n`);
    }
  }

  public override visitTypeField(context: Context): void {
    const field = context.field!;
    this.write(`case "${field.name}":\n`);
    this.write(
      msgpackRead(
        context,
        false,
        `_o.${fieldName(field, field.name)}`,
        true,
        "",
        field.type,
        false,
      ),
    );
    super.triggerTypeField(context);
  }

  public override visitTypeFieldsAfter(context: Context): void {
    if (context.fields.length > 0) {
      this.write(`default:
        err = decoder.Skip()
      }\n`);
    } else {
      this.write(`err = decoder.Skip()\n`);
    }
    this.write(`if err != nil {
      return err
    }
    *o = _o
  }\n`);
    this.write(`
    return nil
  }\n\n`);
    super.triggerTypeFieldsAfter(context);
  }
}
