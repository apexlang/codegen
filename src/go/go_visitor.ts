// deno-lint-ignore-file no-explicit-any
/*
Copyright 2022 The Apex Authors.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import {
  type Alias,
  type AnyType,
  BaseVisitor,
  type Context,
  Kind,
  type List,
  type Map as MapType,
  type Optional,
  type Primitive,
  PrimitiveName,
  type Type,
} from "@apexlang/core/model";
import type { Import } from "./alias_visitor.ts";

interface Imported {
  as?: string;
  package: string;
}

/**
 * Tracks Go package imports throughout the visiting process
 * and renders a valid Go import section to replace the
 * [[IMPORTS SECTION]] placehold.
 */
export class Imports {
  private aliases: Record<string, Import>;
  private _stdlib: Map<string, Imported> = new Map();
  private _thirdparty: Map<string, Imported> = new Map();
  private _firstparty: Map<string, Imported> = new Map();

  constructor(aliases: Record<string, Import>) {
    this.aliases = aliases;
  }

  /**
   * Add a package from the Go standard library.
   * @param pkg The package to add
   * @param as Optional alias for the package
   */
  public stdlib(pkg: string, as?: string) {
    this.addImport(this._stdlib, pkg, as);
  }

  /**
   * Add a package from a third party.
   * @param pkg The package to add
   * @param as Optional alias for the package
   */
  public thirdparty(pkg: string, as?: string) {
    this.addImport(this._thirdparty, pkg, as);
  }

  /**
   * Add a first party package.
   * @param pkg The package to add
   * @param as Optional alias for the package
   */
  public firstparty(pkg: string, as?: string) {
    this.addImport(this._firstparty, pkg, as);
  }

  /**
   * Adds an import from an `Import` interface.
   * @param i The `Import` to add.
   */
  public add(i: Import) {
    if (i == undefined || i.import == undefined) {
      return;
    }
    if (i.import.indexOf(".") != -1) {
      this.thirdparty(i.import);
    } else {
      this.stdlib(i.import);
    }
  }

  /**
   * Checks that a type is imported, if needed.
   *
   * @param type The type to ensure is imported.
   */
  public type(type: AnyType) {
    this.checkType(type);
  }

  private checkType(type: AnyType): void {
    switch (type.kind) {
      case Kind.Alias: {
        const a = type as Alias;
        const i = this.aliases[a.name];
        this.add(i);
        break;
      }

      case Kind.Primitive: {
        const prim = type as Primitive;
        switch (prim.name) {
          case PrimitiveName.DateTime:
            this.stdlib("time");
            break;
        }
        break;
      }

      case Kind.Type: {
        const named = type as Type;
        const i = this.aliases[named.name];
        if (named.name === "datetime" && i == undefined) {
          this.stdlib("time");
          return;
        }
        this.add(i);
        break;
      }

      case Kind.List: {
        const list = type as List;
        this.checkType(list.type);
        break;
      }

      case Kind.Map: {
        const map = type as MapType;
        this.checkType(map.keyType);
        this.checkType(map.valueType);
        break;
      }

      case Kind.Optional: {
        const optional = type as Optional;
        this.checkType(optional.type);
        break;
      }

      case Kind.Enum: {
        break;
      }
    }
  }

  private addImport(m: Map<string, Imported>, pkg: string, as?: string) {
    const key = `${as ? `${as} ` : ""}"${pkg}"`;
    m.set(key, {
      as: as,
      package: pkg,
    });
  }

  /**
   * Generates a Go import section from the imported packages.
   * @returns A valid Go import section
   */
  public render(): string {
    if (
      this._stdlib.size == 0 &&
      this._thirdparty.size == 0 &&
      this._firstparty.size == 0
    ) {
      return "";
    }

    const stdlib = this.makeStatements(this._stdlib);
    const thirdparty = this.makeStatements(this._thirdparty);
    const firstparty = this.makeStatements(this._firstparty);

    const lines = ((stdlib != "" ? stdlib + "\n\n" : "") +
      (thirdparty != "" ? thirdparty + "\n\n" : "") +
      (firstparty != "" ? firstparty : "")).trim();

    return `import (
${lines}
)`;
  }

  private makeStatements(m: Map<string, Imported>): string {
    return Array.from(m.values()).sort((a, b) => {
      return a.package.localeCompare(b.package) ||
        (a.as || "").localeCompare(b.as || "");
    }).map((v) => `  ${v.as ? `${v.as} ` : ""}"${v.package}"`).join("\n");
  }
}

export type ImportMap = Record<string, string | string[]>;

/**
 * The mapping of imports variables to package names.
 * This is backed by a `Proxy` to automatically
 * add imports as they are referenced.
 */
export type ImportNames<Type> = {
  [Property in keyof Type]: string;
};

/**
 * The base class that a visitor that emits Go code
 * should consider extending. It provides a header and packge statement
 * but also a [[IMPORTS SECTION]] placeholder to imports to be written.
 * The Apex CLI handles calling writeHead, visitors, writeTail, then
 * replaces the placeholder with the result of `renderImports`.
 */
export class GoVisitor extends BaseVisitor {
  private _ctx: Context | undefined;
  aliases: Record<string, Import> = {};

  public override writeHead(context: Context): void {
    this.aliases = (context?.config?.aliases as Record<string, Import>) || {};
    const packageName = context.config.package || "module";

    let doNotEdit = context.config.doNotEdit as boolean | undefined;
    if (doNotEdit === undefined) {
      doNotEdit = true;
    }

    if (doNotEdit == true) {
      this.write(`// Code generated by @apexlang/codegen. DO NOT EDIT.\n\n`);
    }

    this.write(`package ${packageName}

[[IMPORTS SECTION]]
\n`);
    super.writeHead(context);
  }

  public override renderImports(context: Context): string {
    return getImports(context).render();
  }
}

/**
 * getImports returns the context
 * @param context The context to extract the Imports from.
 * @returns the existing or newly created Imports.
 */
export function getImports(context: Context): Imports {
  let imports = context.config.imports as Imports | undefined;
  if (!imports) {
    const aliases = (context?.config?.aliases as Record<string, Import>) ||
      {};
    imports = new Imports(aliases);
    context.config.imports = imports;
  }
  return imports;
}

/**
 * getImporter returns a `Proxy` for imports that
 * automatically adds imports as they are referenced.
 *
 * @param context The context to extract the Imports from.
 * @param imports The import map of name to module.
 * @returns a proxy for go imports.
 */
export function getImporter<T extends ImportMap>(
  context: Context,
  imports: T,
): ImportNames<T> {
  const importer = getImports(context);
  const values: Record<string, string> = {};
  for (const key of Object.keys(imports)) {
    values[key] = key;
  }

  return new Proxy(values, {
    get(_target: any, prop: string, _receiver: unknown): any {
      const imp = imports[prop];
      if (imp) {
        let module;
        if (imp instanceof Array) {
          prop = imp[0];
          module = imp[1];
        } else {
          module = imp;
        }

        if (module.indexOf(".") != -1) {
          importer.thirdparty(module);
        } else {
          importer.stdlib(module);
        }
      }

      return prop;
    },
  }) as ImportNames<T>;
}
