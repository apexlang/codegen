import { pascalCase, snakeCase } from "../../utils/index.js";

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
