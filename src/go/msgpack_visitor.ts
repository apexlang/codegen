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
  BaseVisitor,
  Context,
  Kind,
  Writer,
} from "https://deno.land/x/apex_core@v0.1.0/model/mod.ts";
import { convertOperationToType, convertUnionToType } from "../utils/mod.ts";
import { Import } from "./alias_visitor.ts";
import { MsgPackDecoderVisitor } from "./msgpack_decoder_visitor.ts";
import {
  MsgPackEncoderUnionVisitor,
  MsgPackEncoderVisitor,
} from "./msgpack_encoder_visitor.ts";
import { StructVisitor } from "./struct_visitor.ts";

export class MsgPackVisitor extends BaseVisitor {
  constructor(writer: Writer) {
    super(writer);
    const operArgs = (context: Context): void => {
      const { interface: iface, operation } = context;
      const parameters = operation.parameters.filter(
        (p) => p.type.kind != Kind.Stream,
      );
      if (parameters.length == 0 || operation.isUnary()) {
        return;
      }
      const tr = context.getType.bind(context);
      const type = convertOperationToType(tr, iface, operation);
      const ctx = context.clone({ type: type });
      const struct = new StructVisitor(this.writer);
      type.accept(ctx, struct);
      const decoder = new MsgPackDecoderVisitor(this.writer);
      type.accept(ctx, decoder);
      const encoder = new MsgPackEncoderVisitor(this.writer);
      type.accept(ctx, encoder);
      this.write(`\n`);
    };
    this.setCallback("FunctionAfter", "arguments", operArgs);
    this.setCallback("OperationAfter", "arguments", operArgs);
  }

  visitNamespaceBefore(context: Context): void {
    const packageName = context.config["package"] || "module";
    this.write(`// Code generated by @apexlang/codegen. DO NOT EDIT.

    package ${packageName}

    import (
      "github.com/wapc/tinygo-msgpack"
      "github.com/wapc/tinygo-msgpack/convert"\n`);
    const aliases = (context.config.aliases as { [key: string]: Import }) || {};
    for (const a of Object.values(aliases)) {
      if (a.import) {
        this.write(`\t"${a.import}"\n`);
      }
    }
    this.write(`)

    var _ = convert.Package\n\n`);
    super.triggerNamespaceBefore(context);
  }

  visitType(context: Context): void {
    const { type } = context;
    const decoder = new MsgPackDecoderVisitor(this.writer);
    type.accept(context, decoder);
    const encoder = new MsgPackEncoderVisitor(this.writer);
    type.accept(context, encoder);
    this.write(`\n`);
  }

  visitUnion(context: Context): void {
    const { union } = context;
    const tr = context.getType.bind(context);
    const type = convertUnionToType(tr, union);
    const ctx = context.clone({ type: type });
    const decoder = new MsgPackDecoderVisitor(this.writer);
    type.accept(ctx, decoder);
    const encoder = new MsgPackEncoderUnionVisitor(this.writer);
    type.accept(ctx, encoder);
    this.write(`\n`);
  }
}
