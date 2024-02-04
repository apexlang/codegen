# My Apex API

Namespace: **`apex.testing`**

## Aliases

### **MyString**

`alias MyString = string`

### **UUID**

`alias UUID = string`

## Interfaces

### **MyService**

MyService service

- **`emptyVoid() -> void`**: This takes no parameters and returns nothing
- **`unaryType(value: MyType) -> MyType`**
- **`unaryEnum(value: MyEnum) -> MyEnum`**
- **`unaryAlias(value: UUID) -> UUID`**
- **`unaryString(value: string) -> string`**
- **`unaryI64(value: i64) -> i64`**
- **`unaryI32(value: i32) -> i32`**
- **`unaryI16(value: i16) -> i16`**
- **`unaryI8(value: i8) -> i8`**
- **`unaryU64(value: u64) -> u64`**
- **`unaryU32(value: u32) -> u32`**
- **`unaryU16(value: u16) -> u16`**
- **`unaryU8(value: u8) -> u8`**
- **`unaryF64(value: f64) -> f64`**
- **`unaryF32(value: f32) -> f32`**
- **`unaryBytes(value: bytes) -> bytes`**
- **`funcType(value: MyType, optional: MyType) -> MyType`**
- **`funcEnum(value: MyEnum, optional: MyEnum) -> MyEnum`**
- **`funcAlias(value: UUID, optional: UUID) -> UUID`**
- **`funcString(value: string, optional: string) -> string`**
- **`funcI64(value: i64, optional: i64) -> i64`**
- **`funcI32(value: i32, optional: i32) -> i32`**
- **`funcI16(value: i16, optional: i16) -> i16`**
- **`funcI8(value: i8, optional: i8) -> i8`**
- **`funcU64(value: u64, optional: u64) -> u64`**
- **`funcU32(value: u32, optional: u32) -> u32`**
- **`funcU16(value: u16, optional: u16) -> u16`**
- **`funcU8(value: u8, optional: u8) -> u8`**
- **`funcF64(value: f64, optional: f64) -> f64`**
- **`funcF32(value: f32, optional: f32) -> f32`**
- **`funcBytes(value: bytes, optional: bytes) -> bytes`**

### **Repository**

- **`getData() -> MyType`**

## Types

### **MyType**

MyType is a class

- **`sameValue: MyType`** : same type value
- **`typeValue: MyOtherType`** : type value
- **`stringValue: string`** : string value
- **`stringOption: string`** : string option
- **`i64Value: i64`** : i64 value
- **`i64Option: i64`** : i64 option
- **`i32Value: i32`** : i32 value
- **`i32Option: i32`** : i32 option
- **`i16Value: i16`** : i16 value
- **`i16Option: i16`** : i16 option
- **`i8Value: i8`** : i8 value
- **`i8Option: i8`** : i8 option
- **`u64Value: u64`** : u64 value
- **`u64Option: u64`** : u64 option
- **`u32Value: u32`** : u32 value
- **`u32Option: u32`** : u32 option
- **`u16Value: u16`** : u16 value
- **`u16Option: u16`** : u16 option
- **`u8Value: u8`** : u8 value
- **`u8Option: u8`** : u8 option
- **`f64Value: f64`** : f64 value
- **`f64Option: f64`** : f64 option
- **`f32Value: f32`** : f32 value
- **`f32Option: f32`** : f32 option
- **`datetimeValue: datetime`** : datetime value
- **`datetimeOption: datetime`** : datetime option
- **`bytesValue: bytes`** : bytes value
- **`bytesOption: bytes`** : bytes option
- **`mapValue: {string: i64}`** : map value
- **`mapOfTypes: {string: MyType}`** : map of types
- **`arrayValue: string[]`** : array value
- **`arrayOfTypes: MyType[]`** : array of types
- **`unionValue: MyUnion`** : union value
- **`unionOption: MyUnion`** : union option
- **`enumValue: MyEnum`** : enum value
- **`enumOption: MyEnum`** : enum option
- **`aliasValue: UUID`** : enum value
- **`aliasOption: UUID`** : enum option

### **MyOtherType**

- **`foo: string`**
- **`bar: string`**

## Unions

### **MyUnion**

`MyUnion = MyType | MyEnum | MyString`

## Enums

### **MyEnum**

MyEnum is an emuneration

- ONEONE value
- TWOTWO value
- THREETHREE value
