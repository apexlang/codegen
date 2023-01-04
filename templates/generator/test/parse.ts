import { parse as parseApex } from 'https://deno.land/x/apex_core@v0.1.1/mod.ts';
import { Context } from 'https://deno.land/x/apex_core@v0.1.1/model/mod.ts';

export function parse(src: string): Context {
  const doc = parseApex(src);
  const context = new Context({}, doc);
  return context;
}
