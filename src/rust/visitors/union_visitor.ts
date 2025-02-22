// deno-lint-ignore-file no-explicit-any
import {
  AnyType,
  Context,
  Kind,
  ObjectMap,
  Primitive,
  Union,
} from "../../../deps/@apexlang/core/model/mod.ts";
import { codegenType, isNamed, isRecursiveType } from "../../utils/mod.ts";
import {
  customAttributes,
  deriveDirective,
  rustDoc,
  rustifyCaps,
  trimLines,
  types,
  visibility,
} from "../utils/mod.ts";

import { SourceGenerator } from "./base.ts";

function getTypeName(t: AnyType): string {
  if (isNamed(t)) {
    return t.name;
  } else {
    switch (t.kind) {
      case Kind.Primitive:
        return (t as Primitive).name;
      default: {
        const apexType = codegenType(t);
        throw new Error(
          `Can't represent an Apex union with non-named types as a Rust enum.` +
            ` Try turning "${apexType}" into an alias, e.g. "alias MyType = ${apexType}".`,
        );
      }
    }
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

  public override getSource(): string {
    const variants = this.root.members.map((member) => {
      const t = member.type;
      const isRecursive = isRecursiveType(t);
      const isHeapAllocated = t.kind === Kind.Map || t.kind === Kind.List;
      const baseType = types.apexToRustType(t, this.config);
      const typeString = isRecursive && !isHeapAllocated
        ? `Box<${baseType}>`
        : baseType;
      return `${getTypeName(t)}(${typeString})`;
    });

    const prefix = trimLines([
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
