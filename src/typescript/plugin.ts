import { Configuration } from "../../deps/@apexlang/apex/config/mod.ts";
import * as ast from "../../deps/@apexlang/core/ast/mod.ts";
import { extractVersion } from "../utils/utilities.ts";

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

  const version = extractVersion(import.meta.url);
  const version_slug = version ? ("/" + version) : "";

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
    module: `jsr:@apexlang/codegen${version_slug}/typescript`,
    visitorClass: "ApiVisitor",
    config: {},
  };
  config.generates[`./src/interfaces.ts`] = {
    ifNotExists: true,
    module: `jsr:@apexlang/codegen${version_slug}/typescript`,
    visitorClass: "InterfacesVisitor",
    config: {},
  };

  return config;
}
