import { parse as parseApex } from "@apexlang/core";
import { Context } from "../deps/@apexlang/core/model/mod.ts";

export function parse(src: string): Context {
  const doc = parseApex(src);
  const context = new Context({}, doc);
  return context;
}
