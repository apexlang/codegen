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

import { BaseVisitor, Context } from "@apexlang/core/model";
import { expandType } from "./helpers.js";
import { formatComment } from "@apexlang/utils";

export interface Import {
  type: string;
  import?: string;
  parse?: string;
  format?: string;
}

export function translateAlias({
  config,
}: Context): (named: string) => string | undefined {
  const aliases = config.aliases as { [key: string]: Import };
  if (aliases == undefined) {
    return () => undefined;
  }

  return function (named: string): string | undefined {
    const i = aliases[named];
    if (i == undefined) {
      return undefined;
    }

    return i.type;
  };
}

export class AliasVisitor extends BaseVisitor {
  visitAlias(context: Context): void {
    const { config, alias } = context;
    const aliases = config.aliases as { [key: string]: Import };
    if (aliases && aliases[alias.name]) {
      return;
    }

    this.write(formatComment("// ", alias.description));
    this.write(
      `type ${alias.name} ${expandType(
        alias.type,
        undefined,
        true,
        translateAlias(context)
      )}\n\n`
    );
    super.triggerTypeField(context);
  }
}