import {
  Context,
  Enum,
  ObjectMap,
} from "../../../deps/@apexlang/core/model/mod.ts";
import { IndexTypeDirective } from "../directives.ts";
import {
  customAttributes,
  rustDoc,
  rustifyCaps,
  trimLines,
} from "../utils/mod.ts";
import { deriveDirective, visibility } from "../utils/mod.ts";
import { SourceGenerator } from "./base.ts";

export class EnumVisitor extends SourceGenerator<Enum> {
  hasDisplayValues = false;
  hasIndices = false;
  // deno-lint-ignore no-explicit-any
  config: ObjectMap<any>;
  visibility: visibility;

  constructor(e: Enum, context: Context) {
    super(e, context);
    this.config = context.config;
    this.visibility = visibility(this.root.name, this.config);
  }

  public override getSource(): string {
    const optionalDisplayImpl = this.hasDisplayValues
      ? displayImpl(this.root)
      : "";

    const optionalIndexConversion = this.hasIndices
      ? fromIndexImpl(this.root)
      : "";

    const optionalIntoIndexConversion = this.hasIndices
      ? intoIndexImpl(this.root)
      : "";

    const prefix = trimLines([
      rustDoc(this.root.description),
      deriveDirective(this.root.name, this.config),
      customAttributes(this.root.name, this.config),
    ]);
    return `
    ${prefix}
    ${this.visibility} enum ${rustifyCaps(this.root.name)}{
      ${this.source}
    }
    ${
      trimLines([
        optionalDisplayImpl,
        optionalIndexConversion,
        optionalIntoIndexConversion,
      ])
    }

    `;
  }

  public override visitEnumValue(context: Context): void {
    const { enumValue } = context;
    this.hasDisplayValues ||= enumValue.display !== undefined;
    this.hasIndices ||= enumValue.index !== undefined;

    this.append(
      `
      ${trimLines([rustDoc(enumValue.description)])}
      ${rustifyCaps(enumValue.name)},`.trim(),
    );
  }
}

function displayImpl(node: Enum): string {
  const values = node.values
    .map(
      (v) =>
        `Self::${rustifyCaps(v.name)} => ${
          v.display
            ? `"${v.display}"`
            : 'unimplemented!("No display value provided in schema")'
        }`,
    )
    .join(",");
  return `
  impl std::fmt::Display for ${rustifyCaps(node.name)} {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
      write!(f, "{}", match self {
        ${values}
      })
    }
  }
  `;
}

function fromIndexImpl(node: Enum): string {
  let type = "u32";
  node.annotation("index_type", (annotation) => {
    type = (annotation.convert() as IndexTypeDirective).type;
  });

  const patterns = node.values
    .filter((v) => v.index !== undefined)
    .map((v) => `${v.index} => Ok(Self::${rustifyCaps(v.name)})`)
    .join(",");

  return `
  impl std::convert::TryFrom<${type}> for ${rustifyCaps(node.name)} {
    type Error = String;
    fn try_from(index: ${type}) -> Result<Self, Self::Error> {
      match index {
        ${patterns},
        _ => Err(format!("{} is not a valid index for ${
    rustifyCaps(
      node.name,
    )
  }",index))
      }
    }
  }
  `;
}

function intoIndexImpl(node: Enum): string {
  const type = "u32";

  const patterns = node.values
    .map(
      (v) => `Self::${rustifyCaps(v.name)} => ${v.index || "unreachable!()"}`,
    )
    .join(",");

  return `
  impl Into<${type}> for ${rustifyCaps(node.name)} {
    fn into(self) -> ${type} {
      match self {
        ${patterns},
      }
    }
  }
  `;
}
