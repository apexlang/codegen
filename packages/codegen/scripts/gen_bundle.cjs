const fs = require("fs-extra");
const path = require("path");

const root = path.join(__dirname, "..");
const pkg = require(path.join(root, "package.json"));

function camelCase(str) {
  return str.replace(/\-(\w)/g, (match, a) => a.toUpperCase());
}

async function main() {
  const dirs = await fs.readdir(path.join(root, ".."));
  const deps = dirs.filter((dir) => dir !== "codegen");

  const indexSrc = [];
  const files = [];
  for (const dir of deps) {
    // add/update module in package.json dependencies;
    pkg.dependencies[`@apexlang/${dir}`] = `file:../${dir}`;

    // add export line to our index.js src
    indexSrc.push(`export * as ${camelCase(dir)} from "@apexlang/${dir}";`);

    // add a root level file export
    files.push([`${dir}.js`, `export * from "@apexlang/${dir}";`]);

    // add a root level .d.ts types export
    files.push([`${dir}.d.ts`, `export * from "@apexlang/${dir}";`]);
  }
  // add our index src
  files.push([path.join(root, "src", "index.ts"), indexSrc.join("\n")]);

  // add our package.json src to list of files to write.
  files.push([path.join(root, "package.json"), JSON.stringify(pkg, null, 2)]);

  // write files.
  for (const pair of files) {
    console.log(`Writing ${pair[0]}...`);
    await fs.writeFile(pair[0], pair[1]);
  }
}

main();
