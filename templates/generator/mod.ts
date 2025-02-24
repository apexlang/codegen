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
        "_gitignore", // Is renamed to .gitignore
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
        "src/visitors/alias-visitor.ts",
        "src/visitors/base.ts",
        "src/visitors/enum-visitor.ts",
        "src/visitors/interface-visitor.ts",
        "src/visitors/mod.ts",
        "src/visitors/type-visitor.ts",
        "src/visitors/union-visitor.ts",
        "src/mod.ts",
        "src/utils/conversions.ts",
        "src/utils/mod.ts",
        "src/utils/types.ts",
        "src/default-visitor.ts",
        "templates/example/apex.axdl",
        "templates/example/apex.yaml.tmpl",
        "templates/example/mod.ts",
        "templates/example/.vscode/extensions.json",
        "templates/example/.vscode/settings.json",
        "templates/example/.vscode/tasks.json",
        "test/default.test.ts",
        "test/parse.ts",
        "testdata/snapshot/apex.axdl",
        "testdata/snapshot/apex.yaml",
        "testdata/diffcheck.sh",
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
