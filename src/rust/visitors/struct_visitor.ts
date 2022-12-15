// deno-lint-ignore-file no-explicit-any
import { Context, Kind, ObjectMap, Type } from "../../deps/core/model.ts";
import { isPrimitive, isRecursiveType } from "../../utils/mod.ts";
import {
  customAttributes,
  deriveDirective,
  rustDoc,
  rustify,
  rustifyCaps,
  trimLines,
  types,
  useSerde,
  visibility,
} from "../utils/mod.ts";

import { SourceGenerator } from "./base.ts";

export class StructVisitor extends SourceGenerator<Type> {
  config: ObjectMap<any>;
  visibility: visibility;

  constructor(type: Type, context: Context) {
    super(type, context);
    this.config = context.config;
    this.visibility = visibility(this.root.name, this.config);
  }

  getSource(): string {
    const prefix = trimLines([
      rustDoc(this.root.description),
      deriveDirective(this.root.name, this.config),
      customAttributes(this.root.name, this.config),
    ]);

    return `
    ${prefix}
    ${this.visibility} struct ${rustifyCaps(this.root.name)}{
      ${this.source}
    }`;
  }

  visitTypeField(context: Context): void {
    const { field } = context;
    const isRecursive = isRecursiveType(field.type);
    const isHeapAllocated = field.type.kind === Kind.Map ||
      field.type.kind === Kind.List;
    const baseType = types.apexToRustType(field.type, context.config);
    const typeString = isRecursive && !isHeapAllocated
      ? `Box<${baseType}>`
      : baseType;

    let serdeAnnotation = "";
    if (useSerde(context.config)) {
      let date_with = "";
      if (
        isPrimitive(field.type) &&
        field.type.name === "datetime" &&
        !this.config.datetime
      ) {
        date_with = ',with = "time::serde::rfc3339"';
      }
      serdeAnnotation = `#[serde(rename = "${field.name}"${date_with})]`;
    }

    this.append(
      `${trimLines([rustDoc(field.description), serdeAnnotation])}
      ${this.visibility} ${rustify(field.name)}: ${typeString},
      `.trim(),
    );
  }
}
