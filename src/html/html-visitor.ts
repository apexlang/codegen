import { BaseVisitor, Context, Writer } from "@apexlang/core/model";
import { expandType } from "./helpers";

import template from "lodash.template";
import indexSource from "./templates/index.ejs.txt";
import typeSource from "./templates/type.ejs.txt";
import enumSource from "./templates/enum.ejs.txt";
import aliasSource from "./templates/alias.ejs.txt";
import unionSource from "./templates/union.ejs.txt";
import interfaceSource from "./templates/interface.ejs.txt";
import stylesSource from "./templates/styles.css.txt";

const indexTemplate = template(indexSource);
const typeTemplate = template(typeSource);
const interfaceTemplate = template(interfaceSource);
const aliasTemplate = template(aliasSource);
const unionTemplate = template(unionSource);
const enumTemplate = template(enumSource);

export class HtmlVisitor extends BaseVisitor {
  protected source: string = "";
  protected namespace: string = "";
  protected description: string = "";
  protected types: string = "";
  protected enums: string = "";
  protected unions: string = "";
  protected aliases: string = "";
  protected interfaces: string = "";

  visitContextBefore(context: Context): void {
    this.source += `<h1>${context.config.title}</h1>`;
  }

  visitContextAfter(context: Context): void {
    this.write(
      indexTemplate({
        title: context.config.title,
        namespace: this.namespace,
        description: this.description,
        types: this.types,
        interfaces: this.interfaces,
        enums: this.enums,
        aliases: this.aliases,
        unions: this.unions,
        styles: context.config.styles || stylesSource,
      })
    );
  }

  visitNamespace(context: Context): void {
    this.namespace = context.namespace.name;
    this.description = context.namespace.description || "";
  }

  visitInterface(context: Context): void {
    const node = context.interface;
    this.interfaces += interfaceTemplate({
      name: node.name,
      description: node.description,
      operations: node.operations,
      expandType,
    });
  }

  visitType(context: Context): void {
    const typ = context.type;
    this.types += typeTemplate({
      name: typ.name,
      description: typ.description,
      fields: typ.fields,
      expandType,
    });
  }

  // visitEnum(context: Context): void {
  //   const typ = context.type;
  //   this.types += enumTemplate({
  //     name: typ.name,
  //     description: typ.description,
  //     fields: typ.fields,
  //     expandType,
  //   });
  // }

  // visitAlias(context: Context): void {
  //   const typ = context.type;
  //   this.types += aliasTemplate({
  //     name: typ.name,
  //     description: typ.description,
  //     fields: typ.fields,
  //     expandType,
  //   });
  // }

  // visitUnion(context: Context): void {
  //   const typ = context.type;
  //   this.types += unionTemplate({
  //     name: typ.name,
  //     description: typ.description,
  //     fields: typ.fields,
  //     expandType,
  //   });
  // }
}
