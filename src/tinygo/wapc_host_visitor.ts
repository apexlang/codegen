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
  Writer,
  BaseVisitor,
  Optional,
  Named,
  Kind,
} from "@apexlang/core/model";
import {
  expandType,
  parameterName,
  fieldName,
  defaultValueForType,
  translateAlias,
  returnPointer,
} from "../go";
import {
  capitalize,
  isVoid,
  isObject,
  formatComment,
  isProvider,
  uncapitalize,
} from "../utils";
import { codecFuncs } from "./msgpack_constants";
import { read } from "./msgpack_helpers";

export class WapcHostVisitor extends BaseVisitor {
  constructor(writer: Writer) {
    super(writer);
  }

  visitOperation(context: Context): void {
    if (!isProvider(context)) {
      return;
    }
    const ns = context.namespace;
    const { role, operation } = context;
    const tr = translateAlias(context);
    this.write(`type ${role.name}Impl struct {
\tbinding string
}

func New${role.name}(binding ...string) *${role.name}Impl {
  var bindingName string
  if len(binding) > 0 {
    bindingName = binding[0]
  }
\treturn &${role.name}Impl{
\t\tbinding: bindingName,
\t}
}\n`);
    this.write(`\n`);

    this.write(formatComment("    // ", operation.description));
    this.write(
      `func (h *${role.name}Impl) ${capitalize(
        operation.name
      )}(ctx context.Context`
    );
    operation.parameters.map((param, index) => {
      this.write(`, `);
      this.write(
        `${parameterName(param, param.name)} ${expandType(
          param.type,
          undefined,
          true,
          tr
        )}`
      );
    });
    this.write(`) `);
    const retVoid = isVoid(operation.type);
    if (!retVoid) {
      this.write(
        `(${returnPointer(operation.type)}${expandType(
          operation.type,
          undefined,
          false,
          tr
        )}, error)`
      );
    } else {
      this.write(`error`);
    }
    this.write(` {\n`);

    let defaultVal = "";
    let defaultValWithComma = "";
    if (!retVoid) {
      defaultVal =
        operation.type.kind == Kind.Type
          ? "nil"
          : defaultValueForType(context, operation.type);
      defaultValWithComma = defaultVal + ", ";
    }
    if (operation.parameters.length == 0) {
      if (!retVoid) {
        this.write(`payload, err := `);
      } else {
        this.write(`_, err := `);
      }
      this.write(
        `wapc.HostCall(h.binding, "${ns.name}.${role.name}", "${operation.name}", []byte{})\n`
      );
    } else if (operation.isUnary()) {
      const unaryParam = operation.unaryOp();
      if (isObject(unaryParam.type)) {
        this.write(`inputBytes, err := msgpack.ToBytes(&${unaryParam.name})\n`);
      } else {
        const codecFunc = codecFuncs.get((unaryParam.type as Named).name);
        this.write(
          `inputBytes, err := msgpack.${codecFunc}(${unaryParam.name})\n`
        );
      }
      this.write(`if err != nil {
        return ${defaultValWithComma}err
      }\n`);
      if (!retVoid) {
        this.write(`payload, err := `);
      } else {
        this.write(`_, err = `);
      }
      this.write(
        `wapc.HostCall(h.binding, "${ns.name}.${role.name}", "${operation.name}", inputBytes)\n`
      );
    } else {
      this.write(
        `inputArgs := ${uncapitalize(role.name)}${fieldName(
          operation,
          operation.name
        )}Args{\n`
      );
      operation.parameters.map((param) => {
        const paramName = param.name;
        this.write(
          `  ${fieldName(param, paramName)}: ${parameterName(
            param,
            paramName
          )},\n`
        );
      });
      this.write(`}\n`);
      this.write(`inputBytes, err := msgpack.ToBytes(&inputArgs)
      if err != nil {
        return ${defaultValWithComma}err
      }\n`);
      if (!retVoid) {
        this.write(`payload, err := `);
      } else {
        this.write(`_, err = `);
      }
      this.write(`wapc.HostCall(
      h.binding,
      "${ns.name}.${role.name}",
      "${operation.name}",
      inputBytes,
    )\n`);
    }
    if (!retVoid) {
      this.write(`if err != nil {
        return ${defaultValWithComma}err
      }\n`);
      this.write(`decoder := msgpack.NewDecoder(payload)\n`);
      if (isObject(operation.type)) {
        this.write(
          `return msgpack.DecodeNillable[${expandType(
            operation.type,
            undefined,
            false,
            tr
          )}](&decoder)\n`
        );
      } else {
        var resultVar = "";
        if (operation.type instanceof Optional) {
          resultVar = "result";
          this.write(
            `var result ${expandType(operation.type, undefined, true, tr)}\n`
          );
        }
        this.write(
          `${read(
            context,
            true,
            resultVar,
            true,
            defaultVal,
            operation.type,
            false
          )}`
        );
        if (resultVar != "") {
          this.write(`return ${resultVar}, err\n`);
        }
      }
    } else {
      this.write(`return err\n`);
    }
    this.write(`}\n\n`);
    super.triggerOperation(context);
  }

  visitAllOperationsAfter(context: Context): void {
    super.triggerAllOperationsAfter(context);
  }
}
