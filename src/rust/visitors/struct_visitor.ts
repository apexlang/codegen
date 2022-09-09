import { Context, Kind, ObjectMap, Type } from "@apexlang/core/model";
import { isPrimitive } from "../../utils/index.js";
import { rustDoc, rustify, rustifyCaps, trimLines } from "../utils/index.js";
import { deriveDirective, useSerde, visibility } from "../utils/config.js";
import { apexToRustType, isRecursiveType } from "../utils/types.js";
import { SourceGenerator } from "./base.js";

export class StructVisitor extends SourceGenerator<Type> {
  config: ObjectMap<any>;
  visibility: visibility;

  constructor(context: Context) {
    super(context.type, context);
    this.config = context.config;
    this.visibility = visibility(this.root.name, this.config);
  }

  getSource(): string {
    return `
    ${rustDoc(this.root.description)}
    ${deriveDirective(this.root.name, this.config)}
    ${this.visibility} struct ${rustifyCaps(this.root.name)}{
      ${this.source}
    }`;
  }

  visitTypeField(context: Context): void {
    const { field } = context;
    let isRecursive = isRecursiveType(field.type, this.root);
    let isHeapAllocated =
      field.type.kind === Kind.Map || field.type.kind === Kind.List;
    let baseType = apexToRustType(field.type);
    let typeString =
      isRecursive && !isHeapAllocated ? `Box<${baseType}>` : baseType;

    let serdeAnnotation =
      useSerde(context.config) &&
      isPrimitive(field.type) &&
      field.type.name === "datetime"
        ? `#[serde(with = "time::serde::rfc3339")]`
        : "";

    const vis = visibility(this.root.name, this.config);

    this.append(
      `${trimLines([rustDoc(field.description), serdeAnnotation])}
      ${this.visibility} ${rustify(field.name)}: ${typeString},
      `
    );
  }
}
