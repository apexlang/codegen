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
  Annotation,
  BaseVisitor,
  Context,
  Visitor,
} from "../../../apex-js/src/model/index.ts";
import { isProvider, isService } from "./utilities.ts";

export interface UsesVisitor extends Visitor {
  services: Map<string, string[]>;
  dependencies: string[];
}

export class InterfaceUsesVisitor extends BaseVisitor implements UsesVisitor {
  services: Map<string, string[]> = new Map();
  dependencies: string[] = [];

  visitInterface(context: Context): void {
    const { interface: iface } = context;
    if (isService(context)) {
      let dependencies: string[] = [];
      iface.annotation("uses", (a: Annotation) => {
        if (a.arguments.length > 0) {
          dependencies = a.arguments[0].value.getValue() as string[];
        }
      });
      this.services.set(iface.name, dependencies);
    }
    if (isProvider(context)) {
      this.dependencies.push(iface.name);
    }
  }
}
