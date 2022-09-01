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

import { Context, BaseVisitor, Kind, Alias } from "@apexlang/core/model";
import { expandType, mapParams, returnShare, translateAlias } from "../go";
import {
  capitalize,
  isVoid,
  isObject,
  uncapitalize,
  isService,
} from "../utils";
import { encodeFuncs } from "./msgpack_constants";
import { size, encode, read, varAccessParam } from "./msgpack_helpers";

export class WapcWrapperVarsVisitor extends BaseVisitor {
  visitOperation(context: Context): void {
    if (!isService(context)) {
      return;
    }
    const tr = translateAlias(context);
    if (context.config.handlerPreamble != true) {
      this.write(`var (\n`);
      context.config.handlerPreamble = true;
    }
    const operation = context.operation!;
    this.write(
      `\t${uncapitalize(operation.name)}Handler func (${mapParams(
        context,
        operation.parameters
      )}) `
    );
    if (!isVoid(operation.type)) {
      this.write(`(${expandType(operation.type, undefined, true, tr)}, error)`);
    } else {
      this.write(`error`);
    }
    this.write(`\n`);
  }

  visitAllOperationsAfter(context: Context): void {
    if (context.config.handlerPreamble == true) {
      this.write(`)\n\n`);
      delete context.config.handlerPreamble;
    }
    super.triggerAllOperationsAfter(context);
  }
}

export class WrapperFuncsVisitor extends BaseVisitor {
  visitOperation(context: Context): void {
    if (!isService(context)) {
      return;
    }
    const tr = translateAlias(context);
    const role = context.role;
    const operation = context.operation;
    this.write(
      `func ${uncapitalize(role.name)}${capitalize(
        operation.name
      )}Wrapper(svc ${role.name}) wapc.Function {
        return func(payload []byte) ([]byte, error) {
          ctx := context.Background()\n`
    );
    if (operation.parameters.length > 0) {
      this.write(`decoder := msgpack.NewDecoder(payload)\n`);
    }
    if (operation.isUnary()) {
      const unaryParam = operation.parameters[0];
      if (unaryParam.type.kind == Kind.Enum) {
        this.write(`enumVal, err := decoder.ReadInt32()
        if err != nil {
          return nil, err
        }
        request := ${expandType(
          operation.unaryOp().type,
          undefined,
          false,
          tr
        )}(enumVal)\n`);
      } else if (isObject(unaryParam.type)) {
        this.write(`var request ${expandType(
          operation.unaryOp().type,
          undefined,
          false,
          tr
        )}
        if err := request.Decode(&decoder); err != nil {
          return nil, err
        }\n`);
      } else {
        this.write(
          `${read(context, false, "request", true, "", unaryParam.type, false)}`
        );
        this.write(`if err != nil {
          return nil, err
        }\n`);
      }
      this.write(isVoid(operation.type) ? "err := " : "response, err := ");
      this.write(
        `svc.${capitalize(operation.name)}(ctx, ${returnShare(
          unaryParam.type
        )}request)\n`
      );
    } else {
      if (operation.parameters.length > 0) {
        this.write(`var inputArgs ${uncapitalize(role.name)}${capitalize(
          operation.name
        )}Args
        inputArgs.Decode(&decoder)\n`);
      }
      this.write(isVoid(operation.type) ? "err := " : "response, err := ");
      this.write(
        `svc.${capitalize(operation.name)}(${varAccessParam(
          "inputArgs",
          operation.parameters
        )})\n`
      );
    }
    this.write(`if err != nil {
      return nil, err
    }\n`);
    if (isVoid(operation.type)) {
      this.visitWrapperBeforeReturn(context);
      this.write(`return []byte{}, nil\n`);
    } else if (operation.type.kind == Kind.Alias) {
      const a = operation.type as Alias;
      const aet = expandType(a.type);
      const encodeFn = encodeFuncs.get(aet);
      this.write(`var sizer msgpack.Sizer
      sizer.${encodeFn}(${aet}(response))
      ua := make([]byte, sizer.Len());
      encoder := msgpack.NewEncoder(ua);
      encoder.${encodeFn}(${aet}(response))\n`);
      this.visitWrapperBeforeReturn(context);
      this.write(`return ua, nil\n`);
    } else if (operation.type.kind == Kind.Enum) {
      this.write(`var sizer msgpack.Sizer
      sizer.WriteInt32(int32(response))
      ua := make([]byte, sizer.Len());
      encoder := msgpack.NewEncoder(ua);
      encoder.WriteInt32(int32(response))\n`);
      this.visitWrapperBeforeReturn(context);
      this.write(`return ua, nil\n`);
    } else if (isObject(operation.type)) {
      this.visitWrapperBeforeReturn(context);
      this.write(`return msgpack.ToBytes(response)\n`);
    } else {
      this.write(`var sizer msgpack.Sizer
      ${size(true, "response", operation.type)}
      ua := make([]byte, sizer.Len());
      encoder := msgpack.NewEncoder(ua);
      ${encode(true, "response", operation.type)}\n`);
      this.visitWrapperBeforeReturn(context);
      this.write(`return ua, nil\n`);
    }
    this.write(`}
  }\n\n`);
  }

  visitWrapperBeforeReturn(context: Context): void {
    this.triggerCallbacks(context, "WrapperBeforeReturn");
  }
}
