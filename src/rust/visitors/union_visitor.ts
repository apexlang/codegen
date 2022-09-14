import {
  AnyType,
  Context,
  Kind,
  Named,
  ObjectMap,
  Union,
} from "@apexlang/core/model";
import { codegenType, isNamed } from "../../utils/index.js";
import {
  rustDoc,
  rustifyCaps,
  trimLines,
  deriveDirective,
  visibility,
  types,
} from "../utils/index.js";

import { SourceGenerator } from "./base.js";

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
  visibility: visibility;

  constructor(u: Union, context: Context) {
    super(u, context);
    this.config = context.config;
    this.visibility = visibility(this.root.name, this.config);
  }

  getSource(): string {
    const variants = this.root.types.map((t) => {
      let isRecursive = types.isRecursiveType(t);
      let isHeapAllocated = t.kind === Kind.Map || t.kind === Kind.List;
      let baseType = types.apexToRustType(t, this.config);
      let typeString =
        isRecursive && !isHeapAllocated ? `Box<${baseType}>` : baseType;
      return `${getTypeName(t)}(${typeString})`;
    });
    return `
    ${trimLines([
      rustDoc(this.root.description),
      deriveDirective(this.root.name, this.config),
    ])}
    ${this.visibility} enum ${rustifyCaps(this.root.name)}{
      ${variants.join(",")}
    }
    `;
  }
}
