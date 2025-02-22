type UnknownRecord = Record<string, unknown>;

export type Document<T extends UnknownRecord = UnknownRecord> = {
  readonly openapi: string;
  readonly info: InfoObject;
  readonly servers?: ServerObject[];
  readonly paths: PathsObject<T>;
  readonly components?: ComponentsObject;
  readonly security?: SecurityRequirementObject[];
  readonly tags?: TagObject[];
  readonly externalDocs?: ExternalDocumentationObject;
};

export type InfoObject = {
  readonly title: string;
  readonly description?: string;
  readonly termsOfService?: string;
  readonly contact?: ContactObject;
  readonly license?: LicenseObject;
  readonly version: string;
};

export type ContactObject = {
  readonly name?: string;
  readonly url?: string;
  readonly email?: string;
};

export type LicenseObject = {
  readonly name: string;
  readonly url?: string;
};

export type ServerObject = {
  readonly url: string;
  readonly description?: string;
  readonly variables?: { [variable: string]: ServerVariableObject };
};

export type ServerVariableObject = {
  readonly enum?: string[];
  readonly default: string;
  readonly description?: string;
};

export type PathsObject<T extends UnknownRecord = UnknownRecord> = {
  readonly [pattern: string]: PathItemObject<T> | undefined;
};

export type PathItemObject<T extends UnknownRecord = UnknownRecord> = {
  readonly $ref?: string;
  readonly summary?: string;
  readonly description?: string;
  readonly get?: OperationObject<T>;
  readonly put?: OperationObject<T>;
  readonly post?: OperationObject<T>;
  readonly delete?: OperationObject<T>;
  readonly options?: OperationObject<T>;
  readonly head?: OperationObject<T>;
  readonly patch?: OperationObject<T>;
  readonly trace?: OperationObject<T>;
  readonly servers?: ServerObject[];
  readonly parameters?: (ReferenceObject | ParameterObject)[];
};

export type OperationObject<T extends UnknownRecord = UnknownRecord> = {
  readonly tags?: string[];
  readonly summary?: string;
  readonly description?: string;
  readonly externalDocs?: ExternalDocumentationObject;
  readonly operationId?: string;
  readonly parameters?: (ReferenceObject | ParameterObject)[];
  readonly requestBody?: ReferenceObject | RequestBodyObject;
  readonly responses?: ResponsesObject;
  readonly callbacks?: { [callback: string]: ReferenceObject | CallbackObject };
  readonly deprecated?: boolean;
  readonly security?: SecurityRequirementObject[];
  readonly servers?: ServerObject[];
} & T;

export type ExternalDocumentationObject = {
  readonly description?: string;
  readonly url: string;
};

export type ParameterObject = ParameterBaseObject & {
  readonly name: string;
  readonly in: string;
};

export type HeaderObject = ParameterBaseObject;

export type ParameterBaseObject = {
  readonly description?: string;
  readonly required?: boolean;
  readonly deprecated?: boolean;
  readonly allowEmptyValue?: boolean;
  readonly style?: string;
  readonly explode?: boolean;
  readonly allowReserved?: boolean;
  readonly schema?: ReferenceObject | SchemaObject;
  readonly example?: unknown;
  readonly examples?: { [media: string]: ReferenceObject | ExampleObject };
  readonly content?: { [media: string]: MediaTypeObject };
};

export type NonArraySchemaObjectType =
  | "boolean"
  | "object"
  | "number"
  | "string"
  | "integer";

export type ArraySchemaObjectType = "array";

export type SchemaObject = ArraySchemaObject | NonArraySchemaObject;

export type ArraySchemaObject = BaseSchemaObject & {
  readonly type: ArraySchemaObjectType;
  readonly items: ReferenceObject | SchemaObject;
};

export type NonArraySchemaObject = BaseSchemaObject & {
  readonly type?: NonArraySchemaObjectType;
};

export type BaseSchemaObject = {
  readonly title?: string;
  readonly description?: string;
  readonly format?: string;
  readonly default?: unknown;
  readonly multipleOf?: number;
  readonly maximum?: number;
  readonly exclusiveMaximum?: boolean;
  readonly minimum?: number;
  readonly exclusiveMinimum?: boolean;
  readonly maxLength?: number;
  readonly minLength?: number;
  readonly pattern?: string;
  readonly additionalProperties?: boolean | ReferenceObject | SchemaObject;
  readonly maxItems?: number;
  readonly minItems?: number;
  readonly uniqueItems?: boolean;
  readonly maxProperties?: number;
  readonly minProperties?: number;
  readonly required?: string[];
  readonly enum?: unknown[];
  readonly properties?: {
    [name: string]: ReferenceObject | SchemaObject;
  };
  readonly allOf?: (ReferenceObject | SchemaObject)[];
  readonly oneOf?: (ReferenceObject | SchemaObject)[];
  readonly anyOf?: (ReferenceObject | SchemaObject)[];
  readonly not?: ReferenceObject | SchemaObject;

  // OpenAPI-specific properties
  readonly nullable?: boolean;
  readonly discriminator?: DiscriminatorObject;
  readonly readOnly?: boolean;
  readonly writeOnly?: boolean;
  readonly xml?: XMLObject;
  readonly externalDocs?: ExternalDocumentationObject;
  readonly example?: unknown;
  readonly deprecated?: boolean;
};

export type DiscriminatorObject = {
  readonly propertyName: string;
  readonly mapping?: { [value: string]: string };
};

export type XMLObject = {
  readonly name?: string;
  readonly namespace?: string;
  readonly prefix?: string;
  readonly attribute?: boolean;
  readonly wrapped?: boolean;
};

export type ReferenceObject = {
  readonly $ref: string;
};

export type ExampleObject = {
  readonly summary?: string;
  readonly description?: string;
  readonly value?: unknown;
  readonly externalValue?: string;
};

export type MediaTypeObject = {
  readonly schema?: ReferenceObject | SchemaObject;
  readonly example?: unknown;
  readonly examples?: { [media: string]: ReferenceObject | ExampleObject };
  readonly encoding?: { [media: string]: EncodingObject };
};

export type EncodingObject = {
  readonly contentType?: string;
  readonly headers?: { [header: string]: ReferenceObject | HeaderObject };
  readonly style?: string;
  readonly explode?: boolean;
  readonly allowReserved?: boolean;
};

export type RequestBodyObject = {
  readonly description?: string;
  readonly content: { [media: string]: MediaTypeObject };
  readonly required?: boolean;
};

export type ResponsesObject = {
  readonly [code: string]: ReferenceObject | ResponseObject;
};

export type ResponseObject = {
  readonly description: string;
  readonly headers?: { [header: string]: ReferenceObject | HeaderObject };
  readonly content?: { [media: string]: MediaTypeObject };
  readonly links?: { [link: string]: ReferenceObject | LinkObject };
};

export type LinkObject = {
  readonly operationRef?: string;
  readonly operationId?: string;
  readonly parameters?: { [parameter: string]: unknown };
  readonly requestBody?: unknown;
  readonly description?: string;
  readonly server?: ServerObject;
};

export type CallbackObject = {
  readonly [url: string]: PathItemObject;
};

export type SecurityRequirementObject = {
  readonly [name: string]: string[];
};

export type ComponentsObject = {
  readonly schemas?: { [key: string]: ReferenceObject | SchemaObject };
  readonly responses?: { [key: string]: ReferenceObject | ResponseObject };
  readonly parameters?: { [key: string]: ReferenceObject | ParameterObject };
  readonly examples?: { [key: string]: ReferenceObject | ExampleObject };
  readonly requestBodies?: {
    [key: string]: ReferenceObject | RequestBodyObject;
  };
  readonly headers?: { [key: string]: ReferenceObject | HeaderObject };
  readonly securitySchemes?: {
    [key: string]: ReferenceObject | SecuritySchemeObject;
  };
  readonly links?: { [key: string]: ReferenceObject | LinkObject };
  readonly callbacks?: { [key: string]: ReferenceObject | CallbackObject };
};

export type SecuritySchemeObject =
  | HttpSecurityScheme
  | ApiKeySecurityScheme
  | OAuth2SecurityScheme
  | OpenIdSecurityScheme;

export type HttpSecurityScheme = {
  readonly type: "http";
  readonly description?: string;
  readonly scheme: string;
  readonly bearerFormat?: string;
};

export type ApiKeySecurityScheme = {
  readonly type: "apiKey";
  readonly description?: string;
  readonly name: string;
  readonly in: string;
};

export type OAuth2SecurityScheme = {
  readonly type: "oauth2";
  readonly flows: {
    readonly implicit?: {
      readonly authorizationUrl: string;
      readonly refreshUrl?: string;
      readonly scopes: { [scope: string]: string };
    };
    readonly password?: {
      readonly tokenUrl: string;
      readonly refreshUrl?: string;
      readonly scopes: { [scope: string]: string };
    };
    readonly clientCredentials?: {
      readonly tokenUrl: string;
      readonly refreshUrl?: string;
      readonly scopes: { [scope: string]: string };
    };
    readonly authorizationCode?: {
      readonly authorizationUrl: string;
      readonly tokenUrl: string;
      readonly refreshUrl?: string;
      readonly scopes: { [scope: string]: string };
    };
  };
};

export type OpenIdSecurityScheme = {
  readonly type: "openIdConnect";
  readonly description?: string;
  readonly openIdConnectUrl: string;
};

export type TagObject = {
  readonly name: string;
  readonly description?: string;
  readonly externalDocs?: ExternalDocumentationObject;
};
