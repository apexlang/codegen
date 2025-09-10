import { Context } from "../../deps/@apexlang/core/model/mod.ts";
import { getImports, GoVisitor } from "./go_visitor.ts";

interface Embed {
  path: string;
  var: string;
  type: string;
}

export class EmbedVisitor extends GoVisitor {
  public override visitInterfacesBefore(context: Context): void {
    const importer = getImports(context);
    const config = context.config.embed as Embed[];

    if (config && config.length && config.length > 0) {
      importer.stdlib("embed", "_");
      config.forEach((value) => {
        this.write(`//go:embed ${value.path}
var ${value.var} ${value.type}\n`);
      });
      this.write(`\n`);
    }
  }
}
