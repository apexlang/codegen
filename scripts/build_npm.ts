// ex. scripts/build_npm.ts
import { build, emptyDir } from "https://deno.land/x/dnt@0.40.0/mod.ts";

await emptyDir("./npm");

await build({
  entryPoints: [
    "./src/cs/mod.ts",
    "./src/go/mod.ts",
    "./src/json-schema/mod.ts",
    "./src/markdown/mod.ts",
    "./src/openapiv3/mod.ts",
    "./src/proto/mod.ts",
    "./src/python/mod.ts",
    "./src/rest/mod.ts",
    "./src/rust/mod.ts",
    "./src/typescript/mod.ts",
    "./src/utils/mod.ts",
  ],
  outDir: "./npm",
  test: false,
  shims: {
    // see JS docs for overview and more options
    deno: true,
  },
  package: {
    // package.json properties
    name: "@apexlang/core",
    version: Deno.args[0],
    description: "Apex language JavaScript support",
    keywords: ["apex", "idl", "codegen"],
    license: "Apache-2.0",
    repository: {
      type: "git",
      url: "https://github.com/apexlang/apex-js",
    },
    bugs: {
      url: "https://github.com/apexlang/apex-js/issues",
    },
  },
  postBuild() {
    // steps to run after building and before running the tests
    Deno.copyFileSync("LICENSE", "npm/LICENSE");
    Deno.copyFileSync("README.md", "npm/README.md");
  },
});
