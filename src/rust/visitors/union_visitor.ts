import {
  AnyType,
  Context,
  Kind,
  Named,
  ObjectMap,
  Union,
} from "@apexlang/core/model";
import { codegenType, isNamed } from "../../utils";
import { rustDoc, rustifyCaps, trimLines } from "../utils";
import { deriveDirective } from "../utils/config";
import { apexToRustType, isRecursiveType } from "../utils/types";
import { SourceGenerator } from "./base";

function getTypeName(t: AnyType): string {
  if (isNamed(t)) {
    return t.name;
  } else {
    const apexType = codegenType(t);
    throw new Error(
      `Can't represent an Apex union with primitive or non-named types as a Rust enum.` +
        ` Try turning "${apexType}" into an alias, e.g. "alias MyType = ${apexType}".`
    );
  }
}

export class UnionVisitor extends SourceGenerator<Union> {
  config: ObjectMap<any>;

  constructor(context: Context) {
    super(context.union, context);
    this.config = context.config;
  }

  getSource(): string {
    const variants = this.root.types.map((t) => {
      let isRecursive = isRecursiveType(t);
      let isHeapAllocated = t.kind === Kind.Map || t.kind === Kind.List;
      let baseType = apexToRustType(t);
      let typeString =
        isRecursive && !isHeapAllocated ? `Box<${baseType}>` : baseType;
      return `${getTypeName(t)}(${typeString})`;
    });
    return `
    ${trimLines([
      rustDoc(this.root.description),
      deriveDirective(this.root.name, this.config),
    ])}
    pub enum ${rustifyCaps(this.root.name)}{
      ${variants.join(",")}
    }
    `;
  }
}
