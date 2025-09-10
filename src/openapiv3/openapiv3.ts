// deno-lint-ignore-file no-explicit-any
/*
Copyright 2025 The Apex Authors.

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
  Alias,
  Annotation,
  AnyType,
  BaseVisitor,
  Context,
  Field,
  Interface,
  Kind,
  List as ListType,
  Map as MapType,
  Named,
  Operation,
  Optional,
  Primitive,
  Type,
  Writer,
} from "../../deps/@apexlang/core/model/mod.ts";
import {
  ComponentsObject,
  Document,
  ExternalDocumentationObject,
  InfoObject,
  OperationObject,
  ParameterObject,
  PathItemObject,
  ReferenceObject,
  RequestBodyObject,
  ResponsesObject,
  SchemaObject,
  ServerObject,
} from "./types.ts";

import { SummaryDirective } from "./directives.ts";
import * as yaml from "../../deps/@std/yaml/mod.ts";
import {
  convertArrayToObject,
  ExposedTypesVisitor,
  isService,
} from "../utils/mod.ts";
import { getPath, ResponseDirective, ScopesDirective } from "../rest/mod.ts";

type Method = "get" | "post" | "options" | "put" | "delete" | "patch";

type Mutable<T> = { -readonly [P in keyof T]: T[P] };

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

  const newObj: any = {};
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
          const newAry: any[] = [];
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

interface Config {
  securitySchemes: SecurityScheme;
}

interface SecurityScheme {
  oauth2: OAuth2Scheme;
}

interface OAuth2Scheme {
  flows: OAuth2Flow[];
  hasRefreshURL: boolean;
}

type OAuth2Flow =
  | "implicit"
  | "password"
  | "clientCredentials"
  | "authorizationCode";

export class OpenAPIV3Visitor extends BaseVisitor {
  private root: Mutable<Document> = {
    openapi: "3.0.3",
    info: { title: "", version: "" },
    servers: undefined,
    paths: {},
    tags: [],
    components: {},
  };
  private paths: { [path: string]: Mutable<PathItemObject> } = {};
  private schemas: { [name: string]: SchemaObject | ReferenceObject } = {};

  protected path = "";
  protected method = "";
  protected operation?: Mutable<OperationObject>;
  protected parameter?: Mutable<ParameterObject>;

  private exposedTypes = new Set<string>();

  constructor(writer: Writer) {
    super(writer);
  }

  public override visitNamespaceBefore(context: Context) {
    const ns = context.namespace;
    const visitor = new ExposedTypesVisitor(this.writer);
    ns.accept(context, visitor);
    this.exposedTypes = visitor.found;
  }

  public override visitNamespaceAfter(context: Context): void {
    const filename = context.config["$filename"];
    this.root.paths = this.paths;

    const components: Mutable<ComponentsObject> = {
      schemas: this.schemas,
    };

    const ns = context.namespace;
    const config = context.config as Config;
    if (config.securitySchemes && config.securitySchemes.oauth2) {
      const allScopes: Set<string> = new Set();
      Object.values(ns.interfaces).forEach((i: Interface) => {
        i.annotation("scopes", (a: Annotation) => {
          getScopes(a).forEach((v) => allScopes.add(v));
        });
        i.operations.forEach((o: Operation) => {
          o.annotation("scopes", (a: Annotation) => {
            getScopes(a).forEach((v) => allScopes.add(v));
          });
        });
      });
      const scopes: { [name: string]: string } = {};
      Array.from(allScopes).sort().forEach((v) => {
        scopes[v] = v;
      });
      const oauth2 = config.securitySchemes.oauth2;
      const flows: { [name: string]: any } = {};
      oauth2.flows.forEach((flow) => {
        switch (flow) {
          case "implicit":
            flows.implicit = {
              authorizationUrl: "{{OAUTH_AUTHORIZATION_URL}}",
              scopes: scopes,
            };
            if (oauth2.hasRefreshURL) {
              flows.implicit.refreshUrl = "{{OAUTH_REFRESH_URL}}";
            }
            break;
          case "password":
            flows.password = {
              tokenUrl: "{{OAUTH_ACCESS_TOKEN_URL}}",
              scopes: scopes,
            };
            if (oauth2.hasRefreshURL) {
              flows.password.refreshUrl = "{{OAUTH_REFRESH_URL}}";
            }
            break;
          case "clientCredentials":
            flows.clientCredentials = {
              tokenUrl: "{{OAUTH_ACCESS_TOKEN_URL}}",
              scopes: scopes,
            };
            if (oauth2.hasRefreshURL) {
              flows.clientCredentials.refreshUrl = "{{OAUTH_REFRESH_URL}}";
            }
            break;
          case "authorizationCode":
            flows.authorizationCode = {
              authorizationUrl: "{{OAUTH_AUTHORIZATION_URL}}",
              tokenUrl: "{{OAUTH_ACCESS_TOKEN_URL}}",
              scopes: scopes,
            };
            if (oauth2.hasRefreshURL) {
              flows.authorizationCode.refreshUrl = "{{OAUTH_REFRESH_URL}}";
            }
            break;
        }
      });
      components.securitySchemes = {
        oauth2: {
          type: "oauth2",
          flows: flows,
        },
      };
    }

    this.root.components = components;
    const contents = removeEmpty(this.root);
    if (filename.toLowerCase().endsWith(".json")) {
      this.write(JSON.stringify(contents, null, 2));
    } else {
      this.write(yaml.stringify(contents, { sortKeys: false }));
    }
  }

  public override visitNamespace(context: Context): void {
    const ns = context.namespace;
    ns.annotation("info", (a) => {
      this.root.info = a.convert<InfoObject>();
    });
    ns.annotation("externalDocs", (a) => {
      this.root.externalDocs = a.convert<ExternalDocumentationObject>();
    });
    ns.annotation("server", (a) => {
      this.root.servers ||= [];
      this.root.servers?.push(a.convert<ServerObject>());
    });
  }

  public override visitInterface(context: Context): void {
    if (!isService(context)) {
      return;
    }
    const { interface: iface } = context;
    this.root.tags ||= [];
    this.root.tags.push({
      name: iface.name,
      description: iface.description,
    });
  }

  public override visitOperationBefore(context: Context): void {
    if (!isService(context)) {
      return;
    }
    const { interface: iface, operation } = context;
    const path = getPath(context);
    if (path == "") {
      return;
    }

    let pathItem = this.paths[path];
    if (!pathItem) {
      pathItem = {};
      this.paths[path] = pathItem;
    }

    let method: Method | undefined = undefined;
    ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"].forEach(
      (m) => {
        operation.annotation(m, () => {
          method = m.toLowerCase() as Method;
        });
      },
    );
    if (!method) {
      return;
    }
    method = method as Method;

    let summary = operation.description;
    operation.annotation("summary", (a) => {
      summary = a.convert<SummaryDirective>().value;
    });

    let scopes: string[] = [];
    iface.annotation("scopes", (a) => {
      scopes = getScopes(a);
    });
    // Operation scopes override interface scopes
    operation.annotation("scopes", (a) => {
      scopes = getScopes(a);
    });

    this.path = path;
    this.method = method;
    this.operation = {
      operationId: operation.name,
      summary: summary,
      description: operation.description,
      responses: {},
      tags: [iface.name],
    };
    operation.annotation("deprecated", (_a) => {
      this.operation!.deprecated = true;
    });
    if (scopes.length > 0) {
      this.operation!.security = [{ oauth2: scopes }];
    }
    pathItem[method] = this.operation;
  }

  public override visitParameter(context: Context): void {
    if (!this.operation || !isService(context)) {
      return;
    }
    if (!this.operation.parameters) {
      this.operation!.parameters = [];
    }

    const { operation, parameter } = context;
    let paramIn = "query";

    let required = true;
    let t = parameter.type;
    if (t.kind == Kind.Optional) {
      t = (t as Optional).type;
      required = false;
    }

    if (this.path.indexOf(`{` + parameter.name + `}`) != -1) {
      paramIn = "path";
    } else if (parameter.annotation("query")) {
      paramIn = "query";
    } else if (parameter.annotation("header")) {
      paramIn = "header";
    } else if (parameter.annotation("cookie")) {
      paramIn = "cookie";
    } else {
      // Body
      if (operation.isUnary()) {
        if (
          t.kind == Kind.Type ||
          t.kind == Kind.Union ||
          t.kind == Kind.Alias ||
          t.kind == Kind.Enum
        ) {
          const type = t as Named;
          this.operation!.requestBody = {
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/" + type.name,
                },
              },
            },
            required: true,
          };
        } else if (t.kind == Kind.Primitive) {
          const named = t as Primitive;
          const typeFormat = primitiveTypeMap.get(named.name);
          if (!typeFormat) {
            throw Error(
              `body parameter "${parameter.name}" must be a required type: found "${t.kind}"`,
            );
          }
          this.operation!.requestBody = {
            content: {
              "application/json": {
                schema: {
                  ...typeFormat,
                },
              },
            },
            required: true,
          } as RequestBodyObject;
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
          content.properties![parameter.name] = {
            $ref: "#/components/schemas/" + type.name,
          };
        } else if (t.kind == Kind.Primitive) {
          const named = t as Primitive;
          const typeFormat = primitiveTypeMap.get(named.name);
          if (!typeFormat) {
            throw Error(
              `body parameter "${parameter.name}" must be a required type: found "${t.kind}"`,
            );
          }
          content.properties![parameter.name] = {
            ...typeFormat,
          } as SchemaObject;
          if (required) {
            content.required?.push(parameter.name);
          }
          return;
        }
      }

      return;
    }

    const p: ParameterObject = {
      name: parameter.name,
      in: paramIn,
      description: parameter.description,
      required: required,
    };

    switch (paramIn) {
      case "path": {
        let typeFormat: TypeFormat | undefined = undefined;
        if (t.kind == Kind.Alias) {
          t = (t as Alias).type;
        }
        if (t.kind == Kind.Primitive) {
          const named = t as Primitive;
          typeFormat = primitiveTypeMap.get(named.name);
        }
        if (!typeFormat) {
          throw Error(
            `path parameter "${parameter.name}" must be a required type: found "${t.kind}"`,
          );
        }
        this.operation!.parameters.push({
          ...p,
          schema: {
            ...typeFormat,
          },
        } as ParameterObject);
        return;
      }

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
                `query parameter "${parameter.name}" must be a built-type: found "${type.kind}"`,
              );
            }
            this.operation!.parameters.push({
              ...p,
              items: {
                ...typeFormat,
              },
            } as ParameterObject);
            break;
          }

          case Kind.Primitive: {
            const named = t as Primitive;
            const primitive = primitiveTypeMap.get(named.name);

            // primitive type
            if (primitive) {
              this.operation!.parameters.push({
                ...p,
                schema: {
                  ...primitive,
                },
              } as ParameterObject);
              break;
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
                  } as ParameterObject);
                }
              });
              break;
            }
            throw Error(
              `query parameter "${parameter.name}" must be a built-type: found "${named.name}"`,
            );
          }

          case Kind.Type: {
            const type = t as Type;
            type.fields.map((f) => {
              let value = f.type;
              if (value.kind == Kind.Optional) {
                value = (value as Optional).type;
              }
              if (value.kind != Kind.Primitive) {
                return;
              }
              const named = value as Named;
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
                } as ParameterObject);
              }
            });
            break;
          }
        }
    }
  }

  public override visitOperationAfter(context: Context): void {
    if (!this.operation || !isService(context)) {
      return;
    }
    const { operation } = context;
    const responses: Mutable<ResponsesObject> = {};

    const responseDirectives: ResponseDirective[] = [];
    let found2xx = false;
    operation.annotations.map((a) => {
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

    if (operation.type.kind == Kind.Void) {
      responses[204] = {
        description: "No Content",
      };
    } else if (!found2xx) {
      responses.default = {
        description: "Success",
        content: {
          "application/json": {
            schema: this.typeToSchema(operation.type),
          },
        },
      };
    }

    responseDirectives.map((resp) => {
      const code = statusCodes.get(resp.status) || "default";
      let type = operation.type;
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

  public override visitType(context: Context): void {
    const { type } = context;
    if (!this.exposedTypes.has(type.name)) {
      return;
    }
    const schema: SchemaObject = {
      description: type.description,
      ...this.typeDefinitionToSchema(type),
    };
    this.schemas[type.name] = schema;
  }

  public override visitEnum(context: Context): void {
    const e = context.enum;
    if (!this.exposedTypes.has(e.name)) {
      return;
    }

    const schema: SchemaObject = {
      type: Types.STRING,
      description: e.description,
      enum: e.values.map((ev) => ev.display || ev.name),
    };
    this.schemas[e.name] = schema;
  }

  public override visitUnion(context: Context): void {
    const { union } = context;
    const schema: SchemaObject = {
      type: Types.OBJECT,
      description: union.description,
      properties: convertArrayToObject(
        union.members.map((m) => m.type),
        (t: AnyType) => {
          switch (t.kind) {
            case Kind.Union:
            case Kind.Type:
            case Kind.Enum:
              return (t as Named).name;
            case Kind.Primitive:
              return (t as Primitive).name;
          }
          return "unknown";
        },
        this.typeToSchema,
      ),
    };
    this.schemas[union.name] = schema;
  }

  public override visitAlias(context: Context): void {
    const a = context.alias;
    const schema = this.typeToSchema(a);
    this.schemas[a.name] = schema;
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

  typeToSchema(type: AnyType): SchemaObject | ReferenceObject {
    switch (type.kind) {
      case Kind.Optional: {
        const optional = type as Optional;
        return this.typeToSchema(optional.type);
      }
      case Kind.Alias: {
        const a = type as Alias;
        return this.typeToSchema(a.type);
      }
      case Kind.Primitive: {
        const prim = type as Primitive;
        const primitive = primitiveTypeMap.get(prim.name);
        return {
          ...primitive,
        } as SchemaObject;
      }
      case Kind.Union:
      case Kind.Enum:
      case Kind.Type: {
        const named = type as Named;
        return {
          $ref: "#/components/schemas/" + named.name,
        } as ReferenceObject;
      }
      case Kind.List: {
        const list = type as ListType;
        return {
          type: Types.ARRAY,
          items: this.typeToSchema(list.type),
        };
      }
      case Kind.Map: {
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
      }
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
  ["any", {}],
  ["value", {}],
]);

function getScopes(a: Annotation): string[] {
  let scopes = a.convert<ScopesDirective>().value;
  // Convert single value to array
  if (typeof scopes === "string") {
    scopes = [scopes as string];
  }
  return scopes || [];
}
