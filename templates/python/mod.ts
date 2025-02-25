// deno-lint-ignore-file require-await
import { FSStructure, Template } from "../../deps/@apexlang/apex/config/mod.ts";
import { importModule } from "../../src/utils/utilities.ts";

const template: Template = {
  info: {
    name: "@apexlang/python",
    description: "Apex Python project",
    variables: [
      {
        name: "description",
        description: "The project description",
        prompt: "Please enter the project description",
      },
    ],
  },

  // deno-lint-ignore no-explicit-any
  async process(_vars: any): Promise<FSStructure> {
    return {
      variables: {
        module_python: importModule(import.meta.url, "python"),
      },
      files: [
        ".vscode/extensions.json",
        ".vscode/settings.json",
        ".vscode/tasks.json",
        "_gitignore", // Is renamed to .gitignore
        "apex.axdl",
        "Dockerfile",
        "requirements.txt",
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
