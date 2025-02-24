// deno-lint-ignore-file require-await
import { FSStructure, Template } from "../../deps/@apexlang/apex/config/mod.ts";
import { importPlugin } from "../../src/utils/utilities.ts";

const template: Template = {
  info: {
    name: "@apexlang/nodejs",
    description: "Apex NodeJS project",
    variables: [
      {
        name: "description",
        description: "The project description",
        prompt: "Please enter the project description",
      },
      {
        name: "version",
        description: "The version number",
        prompt: "Please enter the version number",
        default: "0.0.1",
      },
    ],
  },

  // deno-lint-ignore no-explicit-any
  async process(_vars: any): Promise<FSStructure> {
    return {
      variables: {
        plugin_typescript: importPlugin(import.meta.url, "typescript"),
      },
      files: [
        ".vscode/extensions.json",
        ".vscode/settings.json",
        ".vscode/tasks.json",
        "_gitignore", // Is renamed to .gitignore
        "apex.axdl",
        "tsconfig.json",
      ],
      directories: [
        "src",
      ],
      templates: {
        "tmpl": [
          "apex.yaml.tmpl",
          "package.json.tmpl",
        ],
      },
    };
  },
};

export default template;
