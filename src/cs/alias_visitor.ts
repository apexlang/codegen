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
  BaseVisitor,
  Context,
} from "https://deno.land/x/apex_core@v0.1.0/model/mod.ts";
import { formatComment, pascalCase } from "../utils/mod.ts";
import { expandType, Import } from "../go/mod.ts";

export class AliasVisitor extends BaseVisitor {
  visitAlias(context: Context): void {
    const { config, alias } = context;
    const aliases = config.aliases as { [key: string]: Import };
    if (aliases && aliases[alias.name]) {
      return;
    }

    this.write(formatComment("// ", alias.description));
    this.write(
      `  using ${pascalCase(alias.name)} = ${expandType(alias.type)};\n\n`,
    );
    super.triggerTypeField(context);
  }
}
