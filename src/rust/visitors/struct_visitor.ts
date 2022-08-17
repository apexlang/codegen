import { Context, Kind, ObjectMap, Type } from "@apexlang/core/model";
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

    this.append(
      `${trimLines([rustDoc(field.description)])}
      ${rustify(field.name)}: ${typeString},
      `
    );
  }
}
