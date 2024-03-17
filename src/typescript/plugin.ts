import { Configuration } from "@apexlang/apex/config.ts";
import * as ast from "@apexlang/core/ast";

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
    module: "@apexlang/codegen/typescript",
    visitorClass: "ApiVisitor",
    config: {},
  };
  config.generates[`./src/interfaces.ts`] = {
    ifNotExists: true,
    module: "@apexlang/codegen/typescript",
    visitorClass: "InterfacesVisitor",
    config: {},
  };

  return config;
}
