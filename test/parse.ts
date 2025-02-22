import { parse as parseApex } from "../deps/@apexlang/core/mod.ts";
import { Context, Namespace, Type } from "../deps/@apexlang/core/model/mod.ts";

export function parse(src: string): Namespace {
  const doc = parseApex(src);
  const context = new Context({}, doc);
  return context.namespace;
}

export function getTypes(namespace: Namespace, types: string[]): Type[] {
  return Object.entries(namespace.types)
    .filter(([name, _type]) => (types.indexOf(name) === -1 ? false : true))
    .map(([_n, t]) => t);
}
