export * as types from "./types.js";

export function isReservedWord(name: string): boolean {
  return reservedWords.includes(name);
}

export function generateComment(description?: string): string {
  return description ? `"${description}"` : "";
}

// Add any reserved words that can not be used in your target language here
const reservedWords = [
  "new", // examples
  "function",
];
