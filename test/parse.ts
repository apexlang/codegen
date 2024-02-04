import { parse as parseApex } from "https://deno.land/x/apex_core@v0.1.5/mod.ts";
import { Context, Namespace, Type } from "../src/deps/core/model.ts";

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
