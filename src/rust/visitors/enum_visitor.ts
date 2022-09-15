import { Context, Enum, ObjectMap, Type } from "@apexlang/core/model";
import { rustDoc, rustifyCaps, trimLines } from "../utils/index.js";
import { deriveDirective, visibility } from "../utils/index.js";
import { SourceGenerator } from "./base.js";

export class EnumVisitor extends SourceGenerator<Enum> {
  hasDisplayValues = false;
  hasIndices = false;
  config: ObjectMap<any>;
  visibility: visibility;

  constructor(e: Enum, context: Context) {
    super(e, context);
    this.config = context.config;
    this.visibility = visibility(this.root.name, this.config);
  }

  getSource(): string {
    const optionalDisplayImpl = this.hasDisplayValues
      ? displayImpl(this.root)
      : "";

    const optionalIndexConversion = this.hasIndices
      ? fromIndexImpl(this.root)
      : "";

    return `
    ${trimLines([
      rustDoc(this.root.description),
      deriveDirective(this.root.name, this.config),
    ])}
    ${this.visibility} enum ${rustifyCaps(this.root.name)}{
      ${this.source}
    }
    ${trimLines([optionalDisplayImpl, optionalIndexConversion])}

    `;
  }

  visitEnumValue(context: Context): void {
    const { enumValue } = context;
    this.hasDisplayValues ||= enumValue.display !== undefined;
    this.hasIndices ||= enumValue.index !== undefined;

    this.append(
      `
      ${trimLines([rustDoc(enumValue.description)])}
      ${rustifyCaps(enumValue.name)},`.trim()
    );
  }
}

function displayImpl(node: Enum): string {
  let values = node.values
    .map(
      (v) =>
        `Self::${rustifyCaps(v.name)} => ${
          v.display
            ? `"${v.display}"`
            : 'unimplemented!("No display value provided in schema")'
        }`
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

  let patterns = node.values
    .filter((v) => v.index !== undefined)
    .map((v) => `${v.index} => Ok(Self::${rustifyCaps(v.name)})`)
    .join(",");
  return `
  impl std::convert::TryFrom<${type}> for ${rustifyCaps(node.name)} {
    type Error = Box<dyn std::error::Error + Send + Sync + 'static>;
    fn try_from(index: ${type}) -> Result<Self, Self::Error> {
      match index {
        ${patterns},
        _ => Err(format!("{} is not a valid index for ${rustifyCaps(
          node.name
        )}",index).into())
      }
    }
  }
  `;
}
