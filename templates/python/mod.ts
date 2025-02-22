// deno-lint-ignore-file require-await
import { FSStructure, Template } from "../../deps/@apexlang/apex/config/mod.ts";

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
      files: [
        ".vscode/extensions.json",
        ".vscode/settings.json",
        ".vscode/tasks.json",
        ".gitignore",
        "apex.axdl",
        "apex.yaml",
        "Dockerfile",
        "requirements.txt",
      ],
    };
  },
};

export default template;
