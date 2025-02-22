// deno-lint-ignore-file require-await
import { FSStructure, Template } from "../../deps/@apexlang/apex/config/mod.ts";

const template: Template = {
  info: {
    name: "@apexlang/generator",
    description: "Apex code generator project",
    variables: [
      {
        name: "name",
        description: "The package name",
        type: "input",
        prompt: "Please enter the package name",
        default: "@myorg/mylib",
      },
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
      files: [
        ".vscode/extensions.json",
        ".vscode/settings.json",
        "apex.yaml",
        "deps/README.md",
        "deps/@apexlang/apex/mod.ts",
        "deps/@apexlang/apex/config/mod.ts",
        "deps/@apexlang/apex/task/mod.ts",
        "deps/@apexlang/codegen/utils/mod.ts",
        "deps/@apexlang/core/mod.ts",
        "deps/@apexlang/core/ast/mod.ts",
        "deps/@apexlang/core/model/mod.ts",
        "deps/@std/assert/mod.ts",
        "deps/@std/yaml/mod.ts",
        "example/apex.axdl",
        "example/apex.yaml",
        //
      ],
      templates: {
        "tmpl": [
          "jsr.json.tmpl",
          "README.md.tmpl",
        ],
      },
    };
  },
};

export default template;
