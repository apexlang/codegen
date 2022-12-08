import { pascalCase, snakeCase } from "../../utils/mod.ts";

export * as types from "./types.ts";

export function rustDoc(doc?: string): string {
  return doc ? `/// ${doc}` : "";
}

export function trimLines(lines: string[]): string {
  const finalLines = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.length > 0) finalLines.push(trimmed);
  }
  return finalLines.join("\n");
}

export function rustify(name: string): string {
  const base = snakeCase(name);

  return isReservedWord(base) ? `r#${base}` : base;
}

export function rustifyCaps(name: string): string {
  const base = pascalCase(name);
  if (isReservedWord(base)) {
    throw new Error(`Can not use ${base} as a Rust name or identifier`);
  }
  return base;
}

import { ObjectMap } from "https://raw.githubusercontent.com/apexlang/apex-js/deno-wip/src/model/mod.ts";

export type visibility = "pub" | "pub(crate)" | "";

export function deriveDirective(name: string, config: ObjectMap<any>): string {
  const derive = [];
  if (config.derive) {
    if (config.derive._all) {
      derive.push(...config.derive._all);
    }
    if (config.derive[name]) {
      derive.push(...config.derive[name]);
    }
  }
  if (useSerde(config)) {
    derive.push("serde::Serialize", "serde::Deserialize");
  }
  return `#[derive(${derive.join(",")})]`;
}

export function customAttributes(name: string, config: ObjectMap<any>): string {
  const attributes = [];
  if (config.attributes) {
    if (config.attributes._all) {
      if (
        Array.isArray(config.attributes._except) &&
        !config.attributes._except.some((n: string) => n == name)
      ) {
        attributes.push(...config.attributes._all);
      }
    }
    if (config.attributes[name]) {
      attributes.push(...config.attributes[name]);
    }
  }
  return attributes.join("\n");
}

export function isNewType(name: string, config: ObjectMap<any>): boolean {
  if (config.newtype) {
    if (config.newtype[name] !== undefined) {
      return !!config.newtype[name];
    }
    return !!config.newtype._all;
  }
  return false;
}

export function useSerde(config: ObjectMap<any>): boolean {
  return !!config.serde;
}

export function visibility(item: string, config: ObjectMap<any>): visibility {
  if (config.visibility) {
    if (config.visibility[item]) return _visibility(config.visibility[item]);
    return _visibility(config.visibility._all);
  }
  return _visibility("");
}

function _visibility(config: string): visibility {
  if (config.startsWith("pub")) {
    return "pub";
  } else if (config.startsWith("crate")) {
    return "pub(crate)";
  } else {
    return "";
  }
}

export function isReservedWord(name: string): boolean {
  return reservedWords.includes(name);
}

const reservedWords = [
  "as",
  "break",
  "const",
  "continue",
  "crate",
  "else",
  "enum",
  "extern",
  "false",
  "fn",
  "for",
  "if",
  "impl",
  "in",
  "let",
  "loop",
  "match",
  "mod",
  "move",
  "mut",
  "pub",
  "ref",
  "return",
  "self",
  "Self",
  "static",
  "struct",
  "super",
  "trait",
  "true",
  "type",
  "unsafe",
  "use",
  "where",
  "while",
  "async",
  "await",
  "dyn",
  "abstract",
  "become",
  "box",
  "do",
  "final",
  "macro",
  "override",
  "priv",
  "typeof",
  "unsized",
  "virtual",
  "yield",
  "try",
];
