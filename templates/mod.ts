// deno-lint-ignore-file require-await
import { FSStructure, Template } from "../deps/@apexlang/apex/config/mod.ts";

const template: Template = {
  info: {
    name: "@apexlang/codegen",
    description: "Built-in Apex project templates",
  },

  templates: [
    "basic/mod.ts",
    "generator/mod.ts",
    "go/mod.ts",
    "nodejs/mod.ts",
    "python/mod.ts",
  ],

  // deno-lint-ignore no-explicit-any
  async process(_vars: any): Promise<FSStructure> {
    return {
      definitions: {
        "@apexlang/core": "../definitions/core/index.apex",
        "@apexlang/openapi": "../definitions/openapi/index.apex",
        "@apexlang/rest": "../definitions/rest/index.apex",
      },
    };
  },
};

export default template;
