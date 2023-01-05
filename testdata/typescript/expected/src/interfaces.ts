export type UUID = string;

export interface MyService {
  emptyVoid(): unknown;
  unaryType(value: MyType): MyType;
  unaryEnum(value: MyEnum): MyEnum;
  unaryAlias(value: UUID): UUID;
  unaryString(value: string): string;
  unaryI64(value: number): number;
  unaryI32(value: number): number;
  unaryI16(value: number): number;
  unaryI8(value: number): number;
  unaryU64(value: number): number;
  unaryU32(value: number): number;
  unaryU16(value: number): number;
  unaryU8(value: number): number;
  unaryF64(value: number): number;
  unaryF32(value: number): number;
  unaryBytes(value: ArrayBuffer): ArrayBuffer;
  funcType(value: MyType, optional: MyType | undefined): MyType;
  funcEnum(value: MyEnum, optional: MyEnum | undefined): MyEnum;
  funcAlias(value: UUID, optional: UUID | undefined): UUID;
  funcString(value: string, optional: string | undefined): string;
  funcI64(value: number, optional: number | undefined): number;
  funcI32(value: number, optional: number | undefined): number;
  funcI16(value: number, optional: number | undefined): number;
  funcI8(value: number, optional: number | undefined): number;
  funcU64(value: number, optional: number | undefined): number;
  funcU32(value: number, optional: number | undefined): number;
  funcU16(value: number, optional: number | undefined): number;
  funcU8(value: number, optional: number | undefined): number;
  funcF64(value: number, optional: number | undefined): number;
  funcF32(value: number, optional: number | undefined): number;
  funcBytes(value: ArrayBuffer, optional: ArrayBuffer | undefined): ArrayBuffer;
}

export interface Repository {
  getData(): MyType;
}

// MyType is a class
export class MyType {
  // same type value
  sameValue: MyType | undefined;
  // type value
  typeValue: MyOtherType;
  // string value
  stringValue: string;
  // string option
  stringOption: string | undefined;
  // i64 value
  i64Value: number;
  // i64 option
  i64Option: number | undefined;
  // i32 value
  i32Value: number;
  // i32 option
  i32Option: number | undefined;
  // i16 value
  i16Value: number;
  // i16 option
  i16Option: number | undefined;
  // i8 value
  i8Value: number;
  // i8 option
  i8Option: number | undefined;
  // u64 value
  u64Value: number;
  // u64 option
  u64Option: number | undefined;
  // u32 value
  u32Value: number;
  // u32 option
  u32Option: number | undefined;
  // u16 value
  u16Value: number;
  // u16 option
  u16Option: number | undefined;
  // u8 value
  u8Value: number;
  // u8 option
  u8Option: number | undefined;
  // f64 value
  f64Value: number;
  // f64 option
  f64Option: number | undefined;
  // f32 value
  f32Value: number;
  // f32 option
  f32Option: number | undefined;
  // datetime value
  datetimeValue: Date;
  // datetime option
  datetimeOption: Date | undefined;
  // bytes value
  bytesValue: ArrayBuffer;
  // bytes option
  bytesOption: ArrayBuffer | undefined;
  // map value
  mapValue: Map<string, number>;
  // map of types
  mapOfTypes: Map<string, MyType>;
  // array value
  arrayValue: Array<string>;
  // array of types
  arrayOfTypes: Array<MyType>;
  // union value
  unionValue: MyUnion;
  // union option
  unionOption: MyUnion | undefined;
  // enum value
  enumValue: MyEnum;
  // enum option
  enumOption: MyEnum | undefined;
  // enum value
  aliasValue: UUID;
  // enum option
  aliasOption: UUID | undefined;

  constructor({
    sameValue = null,
    typeValue = new MyOtherType(),
    stringValue = "",
    stringOption = null,
    i64Value = 0,
    i64Option = null,
    i32Value = 0,
    i32Option = null,
    i16Value = 0,
    i16Option = null,
    i8Value = 0,
    i8Option = null,
    u64Value = 0,
    u64Option = null,
    u32Value = 0,
    u32Option = null,
    u16Value = 0,
    u16Option = null,
    u8Value = 0,
    u8Option = null,
    f64Value = 0,
    f64Option = null,
    f32Value = 0,
    f32Option = null,
    datetimeValue = new Date(),
    datetimeOption = null,
    bytesValue = new ArrayBuffer(0),
    bytesOption = null,
    mapValue = new Map<string, number>(),
    mapOfTypes = new Map<string, MyType>(),
    arrayValue = new Array<string>(),
    arrayOfTypes = new Array<MyType>(),
    unionValue = new MyUnion(),
    unionOption = null,
    enumValue = new MyEnum(),
    enumOption = null,
    aliasValue = new UUID(),
    aliasOption = null
  }: {
    sameValue?: MyType | undefined;
    typeValue?: MyOtherType;
    stringValue?: string;
    stringOption?: string | undefined;
    i64Value?: number;
    i64Option?: number | undefined;
    i32Value?: number;
    i32Option?: number | undefined;
    i16Value?: number;
    i16Option?: number | undefined;
    i8Value?: number;
    i8Option?: number | undefined;
    u64Value?: number;
    u64Option?: number | undefined;
    u32Value?: number;
    u32Option?: number | undefined;
    u16Value?: number;
    u16Option?: number | undefined;
    u8Value?: number;
    u8Option?: number | undefined;
    f64Value?: number;
    f64Option?: number | undefined;
    f32Value?: number;
    f32Option?: number | undefined;
    datetimeValue?: Date;
    datetimeOption?: Date | undefined;
    bytesValue?: ArrayBuffer;
    bytesOption?: ArrayBuffer | undefined;
    mapValue?: Map<string, number>;
    mapOfTypes?: Map<string, MyType>;
    arrayValue?: Array<string>;
    arrayOfTypes?: Array<MyType>;
    unionValue?: MyUnion;
    unionOption?: MyUnion | undefined;
    enumValue?: MyEnum;
    enumOption?: MyEnum | undefined;
    aliasValue?: UUID;
    aliasOption?: UUID | undefined;
  } = {}) {
    this.sameValue = sameValue;
    this.typeValue = typeValue;
    this.stringValue = stringValue;
    this.stringOption = stringOption;
    this.i64Value = i64Value;
    this.i64Option = i64Option;
    this.i32Value = i32Value;
    this.i32Option = i32Option;
    this.i16Value = i16Value;
    this.i16Option = i16Option;
    this.i8Value = i8Value;
    this.i8Option = i8Option;
    this.u64Value = u64Value;
    this.u64Option = u64Option;
    this.u32Value = u32Value;
    this.u32Option = u32Option;
    this.u16Value = u16Value;
    this.u16Option = u16Option;
    this.u8Value = u8Value;
    this.u8Option = u8Option;
    this.f64Value = f64Value;
    this.f64Option = f64Option;
    this.f32Value = f32Value;
    this.f32Option = f32Option;
    this.datetimeValue = datetimeValue;
    this.datetimeOption = datetimeOption;
    this.bytesValue = bytesValue;
    this.bytesOption = bytesOption;
    this.mapValue = mapValue;
    this.mapOfTypes = mapOfTypes;
    this.arrayValue = arrayValue;
    this.arrayOfTypes = arrayOfTypes;
    this.unionValue = unionValue;
    this.unionOption = unionOption;
    this.enumValue = enumValue;
    this.enumOption = enumOption;
    this.aliasValue = aliasValue;
    this.aliasOption = aliasOption;
  }
}

export class MyOtherType {
  foo: string;
  bar: string;

  constructor({ foo = "", bar = "" }: { foo?: string; bar?: string } = {}) {
    this.foo = foo;
    this.bar = bar;
  }
}
