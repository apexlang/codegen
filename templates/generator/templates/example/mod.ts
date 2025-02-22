// deno-lint-ignore-file require-await
import { FSStructure, Template } from "../../deps/@apexlang/apex/config/mod.ts";

const template: Template = {
  info: {
    name: "@apexlang/example",
    description: "Example Apex project",
    variables: [],
  },

  // deno-lint-ignore no-explicit-any
  async process(_vars: any): Promise<FSStructure> {
    return {
      variables: {},
      files: [
        ".vscode/extensions.json",
        ".vscode/settings.json",
        ".vscode/tasks.json",
        "apex.axdl",
      ],
      templates: {
        "tmpl": [
          "apex.yaml.tmpl",
        ],
      },
    };
  },
};

export default template;
