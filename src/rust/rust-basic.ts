import { Context, Writer } from "@apexlang/core/model";
import { ContextWriter } from "./visitors/base.js";
import { StructVisitor } from "./visitors/struct_visitor.js";
import {
  genOperation,
  InterfaceVisitor,
} from "./visitors/interface_visitor.js";
import { EnumVisitor } from "./visitors/enum_visitor.js";
import { UnionVisitor } from "./visitors/union_visitor.js";
import {
  customAttributes,
  deriveDirective,
  isNewType,
  rustDoc,
  rustifyCaps,
  trimLines,
  types,
} from "./utils/index.js";
import { visibility } from "./utils/index.js";
import * as utils from "../utils/index.js";

export class RustBasic extends ContextWriter {
  constructor(writer: Writer) {
    super(writer);
  }

  visitContextBefore(context: Context): void {
    this.append(
      utils.generatedHeader(
        context.config.generatedHeader || [
          "THIS FILE IS GENERATED, DO NOT EDIT",
          "",
          `See https://apexlang.io for more information`,
        ]
      )
    );
    if (context.config.header) {
      if (Array.isArray(context.config.header)) {
        this.append(context.config.header.join("\n"));
      } else {
        this.append(context.config.header);
      }
    }
  }

  visitType(context: Context): void {
    this.append(new StructVisitor(context.type, context).toString());
  }

  visitInterface(context: Context): void {
    this.append(new InterfaceVisitor(context.interface, context).toString());
  }

  visitEnum(context: Context): void {
    this.append(new EnumVisitor(context.enum, context).toString());
  }

  visitUnion(context: Context): void {
    this.append(new UnionVisitor(context.union, context).toString());
  }

  visitFunction(context: Context): void {
    const vis = visibility(context.operation.name, context.config);
    this.append(genOperation(context.operation, vis, context.config));
  }

  visitAlias(context: Context): void {
    const { alias } = context;
    let vis = visibility(alias.name, context.config);

    let prefix = rustDoc(alias.description);

    if (isNewType(alias.name, context.config)) {
      prefix = trimLines([
        prefix,
        customAttributes(alias.name, context.config),
        deriveDirective(alias.name, context.config),
      ]);
      customAttributes(alias.name, context.config),
        this.append(`
        ${prefix}
        ${vis} struct ${rustifyCaps(alias.name)}(${vis} ${types.apexToRustType(
          alias.type,
          context.config
        )});\n`);
    } else {
      this.append(`
        ${prefix}
        ${vis} type ${rustifyCaps(alias.name)} = ${types.apexToRustType(
        alias.type,
        context.config
      )};\n`);
    }
  }
}
