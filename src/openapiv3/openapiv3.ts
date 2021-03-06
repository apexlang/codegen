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
  Kind,
  Named,
  Type,
  Field,
  Optional,
  List as ListType,
  Map as MapType,
  AnyType,
  Primitive,
} from "@apexlang/core/model";
import {
  ExternalDocumentationObject,
  InfoObject,
  OpenApiBuilder,
  OperationObject,
  ParameterLocation,
  ParameterObject,
  PathObject,
  RequestBodyObject,
  ResponsesObject,
  SchemaObject,
  ServerObject,
} from "openapi3-ts";
import {
  SummaryDirective,
  PathDirective,
  ResponseDirective,
} from "./directives";
import * as yaml from "yaml";
import { ExposedTypesVisitor, isService } from "../utils";

const statusCodes = new Map<string, string>([
  ["OK", "200"],
  ["CREATED", "201"],
  ["NOT_FOUND", "400"],
  ["DEFAULT", "default"],
]);

enum Types {
  STRING = "string",
  NUMBER = "number",
  INTEGER = "integer",
  BOOLEAN = "boolean",
  ARRAY = "array",
  FILE = "file",
  OBJECT = "object",
}

const removeEmpty = (obj: any): any => {
  if (typeof obj !== "object" && !Array.isArray(obj)) {
    return obj;
  }

  let newObj: any = {};
  Object.keys(obj).forEach((key) => {
    if (obj[key]) {
      if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
        const o = removeEmpty(obj[key]);
        if (Object.keys(o).length > 0) {
          newObj[key] = o;
        }
      } else if (Array.isArray(obj[key])) {
        const ary = obj[key] as any[];
        if (ary.length > 0) {
          let newAry: any[] = [];
          ary.forEach((v: any) => {
            newAry.push(removeEmpty(v));
          });
          newObj[key] = newAry;
        }
      } else {
        newObj[key] = obj[key];
      }
    }
  });
  return newObj;
};

export class OpenAPIV3Visitor extends BaseVisitor {
  private root: OpenApiBuilder = new OpenApiBuilder();
  private paths: { [path: string]: PathObject } = {};
  private schemas: { [name: string]: SchemaObject } = {};

  protected path: string = "";
  protected method: string = "";
  protected operation?: OperationObject;
  protected parameter?: ParameterObject;

  private exposedTypes = new Set<string>();

  constructor(writer: Writer) {
    super(writer);
    this.root.rootDoc.openapi = "3.1.0";
  }

  visitNamespaceBefore(context: Context) {
    const ns = context.namespace;
    const visitor = new ExposedTypesVisitor(this.writer);
    ns.accept(context, visitor);
    this.exposedTypes = visitor.found;
  }

  visitNamespaceAfter(context: Context): void {
    const filename = context.config["$filename"];
    const contents = removeEmpty(this.root.rootDoc);
    if (filename.toLowerCase().endsWith(".json")) {
      this.write(JSON.stringify(contents, null, 2));
    } else {
      this.write(yaml.stringify(contents));
    }
  }

  visitNamespace(context: Context): void {
    const ns = context.namespace;
    ns.annotation("info", (a) => {
      this.root.addInfo(a.convert<InfoObject>());
    });
    ns.annotation("externalDocs", (a) => {
      this.root.addExternalDocs(a.convert<ExternalDocumentationObject>());
    });
    ns.annotation("server", (a) => {
      this.root.addServer(a.convert<ServerObject>());
    });
  }

  visitRole(context: Context): void {
    if (!isService(context)) {
      return;
    }
    const role = context.role!;
    this.root.addTag({
      name: role.name,
      description: role.description,
    });
  }

  visitOperationBefore(context: Context): void {
    if (!isService(context)) {
      return;
    }
    const ns = context.namespace;
    const inter = context.interface;
    const role = context.role;
    const oper = context.operation!;
    let path = "";
    ns.annotation("path", (a) => {
      path += a.convert<PathDirective>().value;
    });
    if (inter) {
      inter.annotation("path", (a) => {
        path += a.convert<PathDirective>().value;
      });
    }
    if (role) {
      role.annotation("path", (a) => {
        path += a.convert<PathDirective>().value;
      });
    }
    oper.annotation("path", (a) => {
      path += a.convert<PathDirective>().value;
    });
    if (path == "") {
      return;
    }

    let pathItem = this.paths[path];
    if (!pathItem) {
      pathItem = {};
      this.root.addPath(path, pathItem);
      this.paths[path] = pathItem;
    }

    let method = "";
    ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"].forEach(
      (m) => {
        oper.annotation(m, () => {
          method = m.toLowerCase();
        });
      }
    );
    if (method == "") {
      return;
    }

    let summary = oper.description;
    oper.annotation("summary", (a) => {
      summary = a.convert<SummaryDirective>().value;
    });

    this.path = path;
    this.method = method;
    this.operation = {
      operationId: oper.name,
      summary: summary,
      description: oper.description,
      responses: {},
      tags: [role!.name],
    };
    oper.annotation("deprecated", (a) => {
      this.operation!.deprecated = true;
    });
    pathItem[method] = this.operation;
  }

  visitParameter(context: Context): void {
    if (!this.operation || !isService(context)) {
      return;
    }
    if (!this.operation!.parameters) {
      this.operation!.parameters = [];
    }

    const oper = context.operation!;
    const param = context.parameter!;
    let paramIn: ParameterLocation;

    let required = true;
    let t = param.type;
    if (t.kind == Kind.Optional) {
      t = (t as Optional).type;
      required = false;
    }

    if (this.path.indexOf(`{` + param.name + `}`) != -1) {
      paramIn = "path";
    } else if (param.annotation("query")) {
      paramIn = "query";
    } else if (param.annotation("header")) {
      paramIn = "header";
    } else if (param.annotation("cookie")) {
      paramIn = "cookie";
    } else {
      // Body
      if (oper.isUnary()) {
        if (
          t.kind == Kind.Type ||
          t.kind == Kind.Union ||
          t.kind == Kind.Alias ||
          t.kind == Kind.Enum
        ) {
          const type = t as Named;
          this.operation!.requestBody = {
            $ref: "#/components/schemas/" + type.name,
          };
        } else if (t.kind == Kind.Primitive) {
          const named = t as Primitive;
          const typeFormat = primitiveTypeMap.get(named.name);
          if (!typeFormat) {
            throw Error(
              `path parameter "${param.name}" must be a required type: found "${t.kind}"`
            );
          }
          this.operation!.requestBody = {
            content: {
              "application/json": {
                ...typeFormat,
              },
            },
            required: true,
          };
          return;
        }
      } else {
        if (!this.operation!.requestBody) {
          this.operation!.requestBody = {
            content: {
              "application/json": {
                schema: {
                  properties: {},
                  required: [],
                },
              },
            },
            required: true,
          };
        }
        const c = this.operation!.requestBody! as RequestBodyObject;
        const content = c.content["application/json"].schema as SchemaObject;

        if (
          t.kind == Kind.Type ||
          t.kind == Kind.Union ||
          t.kind == Kind.Alias ||
          t.kind == Kind.Enum
        ) {
          const type = t as Named;
          content.properties![param.name] = {
            $ref: "#/components/schemas/" + type.name,
          };
        } else if (t.kind == Kind.Primitive) {
          const named = t as Primitive;
          const typeFormat = primitiveTypeMap.get(named.name);
          if (!typeFormat) {
            throw Error(
              `path parameter "${param.name}" must be a required type: found "${t.kind}"`
            );
          }
          content.properties![param.name] = {
            ...typeFormat,
          };
          if (required) {
            content.required?.push(param.name);
          }
          return;
        }
      }

      return;
    }

    const p: ParameterObject = {
      name: param.name,
      in: paramIn,
      description: param.description,
      required: required,
    };

    if (t.kind == Kind.List) {
    }

    switch (paramIn) {
      case "path":
        let typeFormat: TypeFormat | undefined = undefined;
        if (t.kind == Kind.Primitive) {
          const named = t as Primitive;
          typeFormat = primitiveTypeMap.get(named.name);
        }
        if (!typeFormat) {
          throw Error(
            `path parameter "${param.name}" must be a required type: found "${t.kind}"`
          );
        }
        this.operation!.parameters.push({
          ...p,
          schema: {
            ...typeFormat,
          },
        });
        return;

      case "query":
        switch (t.kind) {
          case Kind.List: {
            const list = t as ListType;
            const type = list.type;
            let typeFormat: TypeFormat | undefined = undefined;
            if (type.kind == Kind.Primitive) {
              const named = type as Primitive;
              typeFormat = primitiveTypeMap.get(named.name);
            }
            if (!typeFormat) {
              throw Error(
                `query parameter "${param.name}" must be a built-type: found "${type.kind}"`
              );
            }
            this.operation!.parameters.push({
              ...p,
              items: {
                ...typeFormat,
              },
            });
            break;
          }

          case Kind.Primitive:
            const named = t as Primitive;
            const primitive = primitiveTypeMap.get(named.name);

            // primitive type
            if (primitive) {
              this.operation!.parameters.push({
                ...p,
                schema: {
                  ...primitive,
                },
              });
              return;
            }

            // query parameters encapsulated inside a type
            const typeDef = context.namespace.allTypes[named.name];
            if (typeDef && typeDef.kind == Kind.Type) {
              const type = typeDef as Type;
              type.fields.map((f) => {
                const named = f.type as Named;
                const primitive = primitiveTypeMap.get(named.name);
                if (primitive) {
                  this.operation!.parameters!.push({
                    name: f.name,
                    in: "query",
                    description: f.description,
                    required: f.type.kind != Kind.Optional,
                    schema: {
                      ...primitive,
                    },
                  });
                }
              });
              return;
            }
            throw Error(
              `query parameter "${param.name}" must be a built-type: found "${named.name}"`
            );
        }
    }

    this.operation!.parameters.push(p);
  }

  visitOperationAfter(context: Context): void {
    if (!this.operation || !isService(context)) {
      return;
    }
    const oper = context.operation!;
    const responses: ResponsesObject = {};

    const responseDirectives: ResponseDirective[] = [];
    let found2xx = false;
    oper.annotations.map((a) => {
      if (a.name != "response") {
        return;
      }

      const resp = a.convert<ResponseDirective>();
      const code = statusCodes.get(resp.status) || "default";
      if (code.substring(0, 1) == "2") {
        found2xx = true;
      }
      responseDirectives.push(resp);
    });

    if (!found2xx) {
      const status = this.method == "post" ? "201" : "200";
      responses.default = {
        description: "Success",
        content: {
          "application/json": {
            //example: resp.examples?["application/json"],
            schema: this.typeToSchema(oper.type),
          },
        },
      };
    }

    responseDirectives.map((resp) => {
      const code = statusCodes.get(resp.status) || "default";
      let type = oper.type;
      if (resp.returns) {
        type = context.namespace.types[resp.returns];
      }
      responses[code] = {
        description: resp.description || "Success",
        content: {
          "application/json": {
            //example: resp.examples?["application/json"],
            schema: this.typeToSchema(type),
          },
        },
      };
    });

    if (Object.keys(responses).length > 0) {
      this.operation!.responses = responses;
    }

    this.path = "";
    this.operation = undefined;
  }

  visitType(context: Context): void {
    const type = context.type!;
    if (!this.exposedTypes.has(type.name)) {
      return;
    }
    const schema = {
      description: type.description,
      ...this.typeDefinitionToSchema(type),
    };
    this.schemas[type.name] = schema;
    this.root.addSchema(type.name, schema);
  }

  typeDefinitionToSchema(type: Type): SchemaObject {
    return {
      type: Types.OBJECT,
      description: type.description,
      properties: this.fieldsToDefinitions(type.fields),
      required: this.requestFieldList(type.fields),
    };
  }

  requestFieldList(fields: Field[]): string[] {
    const required: string[] = [];
    fields.map((f) => {
      if (f.type.kind != Kind.Optional) {
        required.push(f.name);
      }
    });
    return required;
  }

  fieldsToDefinitions(fields: Field[]): { [name: string]: SchemaObject } {
    const defs: { [name: string]: SchemaObject } = {};
    fields.map((f) => {
      defs[f.name] = {
        description: f.description,
        ...this.typeToSchema(f.type),
      };
    });
    return defs;
  }

  typeToSchema(type: AnyType, required: boolean = true): SchemaObject {
    switch (type.kind) {
      case Kind.Optional:
        const optional = type as Optional;
        return this.typeToSchema(optional.type, false);
      case Kind.Primitive:
        const prim = type as Primitive;
        const primitive = primitiveTypeMap.get(prim.name);
        return {
          ...primitive,
        };
      case Kind.Type:
        const named = type as Type;
        return {
          $ref: "#/components/schemas/" + named.name,
        };
      case Kind.List:
        const list = type as ListType;
        return {
          type: Types.ARRAY,
          items: this.typeToSchema(list.type),
        };
      case Kind.Map:
        const map = type as MapType;
        let valid = false;
        if (map.keyType.kind == Kind.Primitive) {
          valid = (map.keyType as Primitive).name == "string";
        }
        if (!valid) {
          throw Error(`maps must have a key type of string`);
        }
        return {
          type: Types.OBJECT,
          additionalProperties: this.typeToSchema(map.valueType),
        };
      default:
        throw Error(`unexpected kind "${type.kind}"`);
    }
  }
}

interface TypeFormat {
  type?:
    | "integer"
    | "number"
    | "string"
    | "boolean"
    | "object"
    | "null"
    | "array";
  format?:
    | "int32"
    | "int64"
    | "float"
    | "double"
    | "byte"
    | "binary"
    | "date"
    | "date-time"
    | "password"
    | string;
  minimum?: number;
  maximum?: number;
}
const primitiveTypeMap = new Map<string, TypeFormat>([
  ["i8", { type: Types.INTEGER, format: "int32", minimum: -128, maximum: 127 }],
  [
    "i16",
    { type: Types.INTEGER, format: "int32", minimum: -32768, maximum: 32767 },
  ],
  ["i32", { type: Types.INTEGER, format: "int32" }],
  ["i64", { type: Types.INTEGER, format: "int64" }],
  ["u8", { type: Types.INTEGER, format: "int32", minimum: 0, maximum: 255 }],
  ["u16", { type: Types.INTEGER, format: "int32", minimum: 0, maximum: 65535 }],
  [
    "u32",
    { type: Types.INTEGER, format: "int64", minimum: 0, maximum: 4294967295 },
  ],
  ["u64", { type: Types.INTEGER, format: "int64", minimum: 0 }],
  ["f32", { type: Types.NUMBER, format: "float" }],
  ["f64", { type: Types.NUMBER, format: "double" }],
  ["string", { type: Types.STRING }],
  ["bytes", { type: Types.STRING, format: "byte" }],
  ["boolean", { type: Types.BOOLEAN }],
  ["date", { type: Types.STRING, format: "date" }],
  ["datetime", { type: Types.STRING, format: "date-time" }],
]);

function fieldsSignature(fields: Field[]): string {
  let sig = "";
  let clone = Object.assign([], fields) as Field[];
  clone = clone.sort((a, b) => (a.name > b.name ? 1 : -1));
  clone.forEach((f) => {
    sig += `${f.name}: ${typeSignature(f.type)}\n`;
  });
  return sig;
}

function typeSignature(type: AnyType): string {
  switch (type.kind) {
    case Kind.Primitive:
      return (type as Named).name;
    case Kind.Type:
    case Kind.Alias:
    case Kind.Union:
    case Kind.Enum:
      return (type as Named).name;
    case Kind.List:
      return `[${typeSignature((type as ListType).type)}]`;
    case Kind.Map:
      const map = type as MapType;
      return `{${typeSignature(map.keyType)}: ${typeSignature(map.valueType)}}`;
    case Kind.Optional:
      return `${typeSignature((type as Optional).type)}?`;
    default:
      throw new Error("unexpected kind: " + type.kind);
  }
}
