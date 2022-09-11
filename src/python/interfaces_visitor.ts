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
  Context,
  BaseVisitor,
  Kind,
  Type,
  Union,
  Enum,
  Alias,
  Visitor,
  AnyType,
} from "@apexlang/core/model";
import { ClassVisitor } from "./class_visitor.js";
import { InterfaceVisitor } from "./interface_visitor.js";
import { isHandler, isProvider, visitNamed } from "../utils/index.js";
import { HandlerVisitor } from "./handler_visitor.js";

export class InterfacesVisitor extends BaseVisitor {
  visitNamespaceBefore(context: Context): void {
    this.write(`from typing import Optional, Awaitable, Type, TypeVar
from serde import serialize, deserialize
from dataclasses import dataclass, field\n\n\n`);

    const types = new TypesVisitor(this.writer);
    taccept(context, types);
  }
}

class TypesVisitor extends BaseVisitor {
  visitTypeBefore(context: Context): void {
    const clazz = new ClassVisitor(this.writer);
    context.type!.accept(context, clazz);
  }

  visitInterfaceBefore(context: Context): void {
    if (isProvider(context)) {
      const iface = new InterfaceVisitor(this.writer);
      context.interface.accept(context, iface);
    } else if (isHandler(context)) {
      const handler = new HandlerVisitor(this.writer);
      context.interface.accept(context, handler);
    }
  }
}

function taccept(context: Context, visitor: Visitor): void {
  context = new Context(context.config, undefined, context);
  tsort(context);
  visitor.visitNamespaceBefore(context);

  const namespace = context.namespace;
  // visitor.visitImportsBefore(context);
  // namespace.imports.map((importDef) => {
  //   importDef.accept(context.clone({ importDef: importDef }), visitor);
  // });
  // visitor.visitImportsAfter(context);

  visitor.visitDirectivesBefore(context);
  for (const directive of Object.values(namespace.directives)) {
    directive.accept(context.clone({ directive: directive }), visitor);
  }
  visitor.visitDirectivesAfter(context);

  for (const t of Object.values(namespace.allTypes)) {
    switch (t.kind) {
      case Kind.Type:
        const td = t as Type;
        if (!td.annotation("novisit")) {
          td.accept(context.clone({ type: td }), visitor);
        }
        break;
      case Kind.Union:
        const ud = t as Union;
        ud.accept(context.clone({ union: ud }), visitor);
        break;
      case Kind.Alias:
        const ad = t as Alias;
        ad.accept(context.clone({ alias: ad }), visitor);
        break;
      case Kind.Enum:
        const ed = t as Enum;
        if (!ed.annotation("novisit")) {
          ed.accept(context.clone({ enumDef: ed }), visitor);
        }
        break;
    }
  }

  visitor.visitAllOperationsBefore(context);

  visitor.visitInterfacesBefore(context);
  for (const iface of Object.values(namespace.interfaces)) {
    iface.accept(context.clone({ interface: iface }), visitor);
  }
  visitor.visitInterfacesAfter(context);
  visitor.visitAllOperationsAfter(context);

  visitor.visitNamespaceAfter(context);
}

function tsort(context: Context): void {
  const deps: { [key: string]: string[] } = {};
  for (const iface of Object.values(context.namespace.interfaces)) {
    var d = deps[iface.name];
    if (!d) {
      d = [];
      deps[iface.name] = d;
    }
    iface.operations.map((oper) => {
      oper.parameters.map((param) => {
        visitNamed(param.type, (name: string) => {
          if (d.indexOf(name) == -1) {
            d.push(name);
          }
        });
      });
      visitNamed(oper.type, (name: string) => {
        if (d.indexOf(name) == -1) {
          d.push(name);
        }
      });
    });
  }
  for (const [name, t] of Object.entries(context.namespace.allTypes)) {
    var d = deps[name];
    if (!d) {
      d = [];
      deps[name] = d;
    }
    switch (t.kind) {
      case Kind.Type:
        const ty = t as Type;
        ty.fields.map((f) => {
          visitNamed(f.type, (name: string) => {
            if (d.indexOf(name) == -1) {
              d.push(name);
            }
          });
        });
        break;
      case Kind.Union:
        const un = t as Union;
        un.types.map((ty) => {
          visitNamed(ty, (name: string) => {
            if (d.indexOf(name) == -1) {
              d.push(name);
            }
          });
        });
        break;
      case Kind.Alias:
        const a = t as Alias;
        visitNamed(a.type, (name: string) => {
          if (d.indexOf(name) == -1) {
            d.push(name);
          }
        });
        break;
    }
  }

  const edges = createEdges(deps);

  class Node {
    id: string;
    afters: string[];

    constructor(id: string) {
      this.id = id;
      this.afters = [];
    }
  }

  const nodes: { [key: string]: Node } = {};
  const sorted: string[] = [];
  const visited: { [key: string]: boolean } = {};

  edges.forEach((v) => {
    let from = v[0],
      to = v[1];
    if (!nodes[from]) nodes[from] = new Node(from);
    if (!nodes[to]) nodes[to] = new Node(to);
    nodes[from].afters.push(to);
  });

  const ancestors: string[] = [];
  Object.keys(nodes).forEach(function visit(idstr) {
    let node = nodes[idstr],
      id = node.id;

    if (visited[idstr]) return;
    //if (!Array.isArray(ancestors)) ancestors = [];

    ancestors.push(id);
    visited[idstr] = true;
    node.afters.forEach(function (afterID) {
      //if (ancestors.indexOf(afterID) >= 0)
      //  throw new Error("closed chain : " + afterID + " is in " + id);
      if (ancestors.indexOf(afterID) < 0) visit(afterID.toString());
    });
    sorted.unshift(id);
  });

  const ordered: Map<string, AnyType> = new Map();
  sorted.forEach((n) => {
    const t = context.namespace.allTypes[n];
    if (t) {
      ordered.set(n, t);
    }
  });

  for (const [k, v] of Object.entries(ordered)) {
    delete context.namespace.allTypes[k];
    context.namespace.allTypes[k] = v;
  }
}

const createEdges = (deps: { [key: string]: string[] }) => {
  let result: [string, string][] = [];
  Object.keys(deps).forEach((key) => {
    deps[key].forEach((n) => {
      result.push([n, key]);
    });
  });
  return result;
};
