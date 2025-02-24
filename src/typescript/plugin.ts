import { Configuration } from "../../deps/@apexlang/apex/config/mod.ts";
import * as ast from "../../deps/@apexlang/core/ast/mod.ts";
import { importModule } from "../utils/utilities.ts";

export default function (
  _doc: ast.Document,
  config: Configuration,
): Configuration {
  config.generates ||= {};

  const tsModule = importModule(import.meta.url, "typescript");

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
    module: tsModule,
    visitorClass: "ApiVisitor",
    config: {},
  };
  config.generates[`./src/interfaces.ts`] = {
    ifNotExists: true,
    module: tsModule,
    visitorClass: "InterfacesVisitor",
    config: {},
  };

  return config;
}
