import {
  Context,
  Kind,
  ObjectMap,
  Primitive,
  Type,
} from "@apexlang/core/model";
import { rustDoc, rustify, rustifyCaps, trimLines } from "../utils";
import { deriveDirective } from "../utils/config";
import { apexToRustType, isRecursiveType } from "../utils/types";
import { SourceGenerator } from "./base";

export class StructVisitor extends SourceGenerator<Type> {
  config: ObjectMap<any>;

  constructor(context: Context) {
    super(context.type, context);
    this.config = context.config;
  }

  getSource(): string {
    return `
    ${rustDoc(this.root.description)}
    ${deriveDirective(this.root.name, this.config)}
    pub struct ${rustifyCaps(this.root.name)}{
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
      field.type.kind === Kind.Primitive &&
      (field.type as Primitive).name === "datetime"
        ? `#[serde(with = "time::serde::rfc3339")]`
        : "";

    this.append(
      `${trimLines([rustDoc(field.description), serdeAnnotation])}
      ${rustify(field.name)}: ${typeString},
      `
    );
  }
}
