import { parse as parseApex } from "@apexlang/core";
import { Context, Namespace, Type } from "@apexlang/core/model";
import * as ast from "@apexlang/core/ast";

export function parse(src: string): Namespace {
  const doc = parseApex(src);
  const context = new Context({}, doc);
  return context.namespace;
}

export function getTypes(namespace: Namespace, types: string[]): Type[] {
  return Object.entries(namespace.types)
    .filter(([name, type]) => (types.indexOf(name) === -1 ? false : true))
    .map(([n, t]) => t);
}
