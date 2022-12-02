import {
  AnyType,
  Context,
  Kind,
  Named,
  ObjectMap,
  Union,
} from "../../../../apex-js/src/model/index.ts";
import { codegenType, isNamed, isRecursiveType } from "../../utils/index.ts";
import {
  rustDoc,
  rustifyCaps,
  trimLines,
  deriveDirective,
  visibility,
  types,
  customAttributes,
} from "../utils/index.ts";

import { SourceGenerator } from "./base.ts";

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
      let isRecursive = isRecursiveType(t);
      let isHeapAllocated = t.kind === Kind.Map || t.kind === Kind.List;
      let baseType = types.apexToRustType(t, this.config);
      let typeString =
        isRecursive && !isHeapAllocated ? `Box<${baseType}>` : baseType;
      return `${getTypeName(t)}(${typeString})`;
    });

    let prefix = trimLines([
      rustDoc(this.root.description),
      deriveDirective(this.root.name, this.config),
      customAttributes(this.root.name, this.config),
    ]);

    return `
    ${prefix}
    ${this.visibility} enum ${rustifyCaps(this.root.name)}{
      ${variants.join(",")}
    }
    `;
  }
}
