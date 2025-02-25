import { Context, Writer } from "../../deps/@apexlang/core/model/mod.ts";
import { ContextWriter } from "./visitors/base.ts";
import { StructVisitor } from "./visitors/struct_visitor.ts";
import {
  genOperation,
  InterfaceVisitor,
} from "./visitors/interface_visitor.ts";
import { EnumVisitor } from "./visitors/enum_visitor.ts";
import { UnionVisitor } from "./visitors/union_visitor.ts";
import {
  customAttributes,
  deriveDirective,
  isNewType,
  rustDoc,
  rustifyCaps,
  trimLines,
  types,
} from "./utils/mod.ts";
import { visibility } from "./utils/mod.ts";
import * as utils from "../utils/mod.ts";

export class RustBasic extends ContextWriter {
  constructor(writer: Writer) {
    super(writer);
  }

  public override visitContextBefore(context: Context): void {
    this.append(
      utils.generatedHeader(
        context.config.generatedHeader || [
          "THIS FILE IS GENERATED, DO NOT EDIT",
          "",
          `See https://apexlang.io for more information`,
        ],
      ),
    );
    if (context.config.header) {
      if (Array.isArray(context.config.header)) {
        this.append(context.config.header.join("\n"));
      } else {
        this.append(context.config.header);
      }
    }
  }

  public override visitType(context: Context): void {
    this.append(new StructVisitor(context.type, context).toString());
  }

  public override visitInterface(context: Context): void {
    this.append(new InterfaceVisitor(context.interface, context).toString());
  }

  public override visitEnum(context: Context): void {
    this.append(new EnumVisitor(context.enum, context).toString());
  }

  public override visitUnion(context: Context): void {
    this.append(new UnionVisitor(context.union, context).toString());
  }

  public override visitFunction(context: Context): void {
    const vis = visibility(context.operation.name, context.config);
    this.append(genOperation(context.operation, vis, context.config));
  }

  public override visitAlias(context: Context): void {
    const { alias } = context;
    const vis = visibility(alias.name, context.config);

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
        ${vis} struct ${rustifyCaps(alias.name)}(${vis} ${
          types.apexToRustType(
            alias.type,
            context.config,
          )
        });\n`);
    } else {
      this.append(`
        ${prefix}
        ${vis} type ${rustifyCaps(alias.name)} = ${
        types.apexToRustType(
          alias.type,
          context.config,
        )
      };\n`);
    }
  }
}
