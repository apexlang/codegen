import { Configuration } from "https://deno.land/x/apex_cli@v0.0.18/src/config.ts";
import * as ast from "https://deno.land/x/apex_core@v0.1.5/ast.ts";

const importUrl = new URL(".", import.meta.url);

function _urlify(relpath: string): string {
  const url = new URL(relpath, importUrl).toString();
  console.error(url);
  return url;
}

export default function (
  _doc: ast.Document,
  config: Configuration,
): Configuration {
  config.generates ||= {};

  config.config ||= {};
  config.config.aliases ||= {};
  (config.config.aliases as Record<string, unknown>).UUID = {
    type: true,
    import: "v4 as uuidv4",
    from: "uuid",
    default: "uuidv4()",
  };
  config.generates[`./src/api.ts`] = {
    ifNotExists: true,
    module: "https://deno.land/x/apex_codegen/typescript/mod.ts",
    visitorClass: "ApiVisitor",
    config: {},
  };
  config.generates[`./src/interfaces.ts`] = {
    ifNotExists: true,
    module: "https://deno.land/x/apex_codegen/typescript/mod.ts",
    visitorClass: "InterfacesVisitor",
    config: {},
  };

  return config;
}
