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

import { Context, Operation } from "@apexlang/core/model";

export interface PathDirective {
  value: string;
}

export interface ResponseDirective {
  status: string;
  returns?: string;
  description?: string;
  examples?: { [k: string]: string };
}

export function getPath(context: Context): string {
  const ns = context.namespace;
  const inter = context.interface;
  const { interface: iface, operation } = context;

  let path = "";
  ns.annotation("path", (a) => {
    path += a.convert<PathDirective>().value;
  });
  if (inter) {
    inter.annotation("path", (a) => {
      path += a.convert<PathDirective>().value;
    });
  }
  if (iface) {
    iface.annotation("path", (a) => {
      path += a.convert<PathDirective>().value;
    });
  }
  operation.annotation("path", (a) => {
    path += a.convert<PathDirective>().value;
  });

  return path;
}

export function getMethods(oper: Operation): string[] {
  return ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"].filter(
    (m) => oper.annotation(m) != undefined
  );
}

export function hasBody(method: string): boolean {
  switch (method.toUpperCase()) {
    case "POST":
    case "PUT":
    case "PATCH":
      return true;
  }
  return false;
}
