import { BaseVisitor, Context, Writer } from '../deps/core/model.ts';
import { expandType } from './helpers.ts';
import { templates } from './templates.ts';

import { render, compile } from 'https://deno.land/x/deno_ejs@v0.2.5/mod.ts';

// const indexTemplate = compile(templates.index, {});
// const typeTemplate = compile(templates.type, {});
// const interfaceTemplate = compile(templates.interface, {});
// const aliasTemplate = compile(templates.alias, {});
// const unionTemplate = compile(templates.union, {});
// const enumTemplate = compile(templates.enum, {});

function template(src: string, data: any): string {
  return render(src, data, {});
}

export class HtmlVisitor extends BaseVisitor {
  protected source = '';
  protected namespace = '';
  protected description = '';
  protected types = '';
  protected enums = '';
  protected unions = '';
  protected aliases = '';
  protected interfaces = '';

  visitContextBefore(context: Context): void {
    this.source += `<h1>${context.config.title}</h1>`;
  }

  visitContextAfter(context: Context): void {
    this.write(
      template(templates.index, {
        title: context.config.title,
        namespace: this.namespace,
        description: this.description,
        types: this.types,
        interfaces: this.interfaces,
        enums: this.enums,
        aliases: this.aliases,
        unions: this.unions,
        styles: context.config.styles || templates.styles,
      })
    );
  }

  visitNamespace(context: Context): void {
    this.namespace = context.namespace.name;
    this.description = context.namespace.description || '';
  }

  visitInterface(context: Context): void {
    const node = context.interface;
    this.interfaces += template(templates.interface, {
      name: node.name,
      description: node.description,
      operations: node.operations,
      expandType,
    });
  }

  visitType(context: Context): void {
    const typ = context.type;
    this.types += template(templates.type, {
      name: typ.name,
      description: typ.description,
      fields: typ.fields,
      expandType,
    });
  }

  visitEnum(context: Context): void {
    const e = context.enum;
    this.enums += template(templates.enum, {
      name: e.name,
      description: e.description,
      values: e.values,
      expandType,
    });
  }

  visitAlias(context: Context): void {
    const a = context.alias;
    this.aliases += template(templates.alias, {
      name: a.name,
      description: a.description,
      type: a.type,
      expandType,
    });
  }

  visitUnion(context: Context): void {
    const u = context.union;
    this.unions += template(templates.union, {
      name: u.name,
      description: u.description,
      types: u.types,
      expandType,
    });
  }
}
