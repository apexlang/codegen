import { Template } from "../deps/@apexlang/apex/config/mod.ts";

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
};

export default template;
