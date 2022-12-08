import { Expose, Type } from "class-transformer";

export type UUID = string;

export interface MyService {
  emptyVoid(): Promise<unknown>;
  unaryType(value: MyType): Promise<MyType>;
  unaryEnum(value: MyEnum): Promise<MyEnum>;
  unaryAlias(value: UUID): Promise<UUID>;
  unaryString(value: string): Promise<string>;
  unaryI64(value: number): Promise<number>;
  unaryI32(value: number): Promise<number>;
  unaryI16(value: number): Promise<number>;
  unaryI8(value: number): Promise<number>;
  unaryU64(value: number): Promise<number>;
  unaryU32(value: number): Promise<number>;
  unaryU16(value: number): Promise<number>;
  unaryU8(value: number): Promise<number>;
  unaryF64(value: number): Promise<number>;
  unaryF32(value: number): Promise<number>;
  unaryBytes(value: ArrayBuffer): Promise<ArrayBuffer>;
  funcType(value: MyType, optional: MyType | undefined): Promise<MyType>;
  funcEnum(value: MyEnum, optional: MyEnum | undefined): Promise<MyEnum>;
  funcAlias(value: UUID, optional: UUID | undefined): Promise<UUID>;
  funcString(value: string, optional: string | undefined): Promise<string>;
  funcI64(value: number, optional: number | undefined): Promise<number>;
  funcI32(value: number, optional: number | undefined): Promise<number>;
  funcI16(value: number, optional: number | undefined): Promise<number>;
  funcI8(value: number, optional: number | undefined): Promise<number>;
  funcU64(value: number, optional: number | undefined): Promise<number>;
  funcU32(value: number, optional: number | undefined): Promise<number>;
  funcU16(value: number, optional: number | undefined): Promise<number>;
  funcU8(value: number, optional: number | undefined): Promise<number>;
  funcF64(value: number, optional: number | undefined): Promise<number>;
  funcF32(value: number, optional: number | undefined): Promise<number>;
  funcBytes(
    value: ArrayBuffer,
    optional: ArrayBuffer | undefined
  ): Promise<ArrayBuffer>;
}

export interface Repository {
  getData(): Promise<MyType>;
}

// MyType is a class
export class MyType {
  // same type value
  @Expose() sameValue: MyType | undefined;
  // type value
  @Expose() typeValue: MyOtherType;
  // string value
  @Expose() stringValue: string;
  // string option
  @Expose() stringOption: string | undefined;
  // i64 value
  @Expose() i64Value: number;
  // i64 option
  @Expose() i64Option: number | undefined;
  // i32 value
  @Expose() i32Value: number;
  // i32 option
  @Expose() i32Option: number | undefined;
  // i16 value
  @Expose() i16Value: number;
  // i16 option
  @Expose() i16Option: number | undefined;
  // i8 value
  @Expose() i8Value: number;
  // i8 option
  @Expose() i8Option: number | undefined;
  // u64 value
  @Expose() u64Value: number;
  // u64 option
  @Expose() u64Option: number | undefined;
  // u32 value
  @Expose() u32Value: number;
  // u32 option
  @Expose() u32Option: number | undefined;
  // u16 value
  @Expose() u16Value: number;
  // u16 option
  @Expose() u16Option: number | undefined;
  // u8 value
  @Expose() u8Value: number;
  // u8 option
  @Expose() u8Option: number | undefined;
  // f64 value
  @Expose() f64Value: number;
  // f64 option
  @Expose() f64Option: number | undefined;
  // f32 value
  @Expose() f32Value: number;
  // f32 option
  @Expose() f32Option: number | undefined;
  // datetime value
  @Type(() => Date) @Expose() datetimeValue: Date;
  // datetime option
  @Type(() => Date) @Expose() datetimeOption: Date | undefined;
  // bytes value
  @Expose() bytesValue: ArrayBuffer;
  // bytes option
  @Expose() bytesOption: ArrayBuffer | undefined;
  // map value
  @Expose() mapValue: Map<string, number>;
  // map of types
  @Expose() mapOfTypes: Map<string, MyType>;
  // array value
  @Expose() arrayValue: Array<string>;
  // array of types
  @Expose() arrayOfTypes: Array<MyType>;
  // union value
  @Expose() unionValue: MyUnion;
  // union option
  @Expose() unionOption: MyUnion | undefined;
  // enum value
  @Expose() enumValue: MyEnum;
  // enum option
  @Expose() enumOption: MyEnum | undefined;
  // enum value
  @Expose() aliasValue: UUID;
  // enum option
  @Expose() aliasOption: UUID | undefined;

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
  @Expose() foo: string;
  @Expose() bar: string;

  constructor({ foo = "", bar = "" }: { foo?: string; bar?: string } = {}) {
    this.foo = foo;
    this.bar = bar;
  }
}
