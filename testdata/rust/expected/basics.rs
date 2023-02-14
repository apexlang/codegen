/************************************************
 * THIS FILE IS GENERATED, DO NOT EDIT          *
 *                                              *
 * See https://apexlang.io for more information *
 ***********************************************/

pub type Uuid = String;

pub type MyAlias = String;

fn some_calc(rhs: i64, lhs: i64) -> i64;

pub trait MyStreamer {
    fn request_stream_i64() -> Box<dyn Stream<Item = i64>>;

    fn request_stream_f64() -> Box<dyn Stream<Item = f64>>;

    fn request_stream_type() -> Box<dyn Stream<Item = MyType>>;

    fn request_stream_enum() -> Box<dyn Stream<Item = MyEnum>>;

    fn request_stream_uuid() -> Box<dyn Stream<Item = Uuid>>;

    fn request_stream_alias() -> Box<dyn Stream<Item = MyAlias>>;

    fn request_stream_string() -> Box<dyn Stream<Item = String>>;

    fn request_stream_bool() -> Box<dyn Stream<Item = bool>>;

    fn request_stream_datetime() -> Box<dyn Stream<Item = time::OffsetDateTime>>;

    fn request_stream_list() -> Box<dyn Stream<Item = Vec<String>>>;

    fn request_stream_map() -> Box<dyn Stream<Item = std::collections::HashMap<String, String>>>;

    fn request_stream_args_i64(value: i64) -> Box<dyn Stream<Item = i64>>;

    fn request_stream_args_f64(value: f64) -> Box<dyn Stream<Item = f64>>;

    fn request_stream_args_type(value: MyType) -> Box<dyn Stream<Item = MyType>>;

    fn request_stream_args_enum(value: MyEnum) -> Box<dyn Stream<Item = MyEnum>>;

    fn request_stream_args_uuid(value: Uuid) -> Box<dyn Stream<Item = Uuid>>;

    fn request_stream_args_alias(value: MyAlias) -> Box<dyn Stream<Item = MyAlias>>;

    fn request_stream_args_string(value: String) -> Box<dyn Stream<Item = String>>;

    fn request_stream_args_bool(value: bool) -> Box<dyn Stream<Item = bool>>;

    fn request_stream_args_datetime(
        value: time::OffsetDateTime,
    ) -> Box<dyn Stream<Item = time::OffsetDateTime>>;

    fn request_stream_args_list(value: Vec<String>) -> Box<dyn Stream<Item = Vec<String>>>;

    fn request_stream_args_map(
        value: std::collections::HashMap<String, String>,
    ) -> Box<dyn Stream<Item = std::collections::HashMap<String, String>>>;

    fn request_channel_i64(r#in: Box<dyn Stream<Item = i64>>) -> Box<dyn Stream<Item = i64>>;

    fn request_channel_f64(r#in: Box<dyn Stream<Item = f64>>) -> Box<dyn Stream<Item = f64>>;

    fn request_channel_type(r#in: Box<dyn Stream<Item = MyType>>)
        -> Box<dyn Stream<Item = MyType>>;

    fn request_channel_enum(r#in: Box<dyn Stream<Item = MyEnum>>)
        -> Box<dyn Stream<Item = MyEnum>>;

    fn request_channel_alias(r#in: Box<dyn Stream<Item = Uuid>>) -> Box<dyn Stream<Item = Uuid>>;

    fn request_channel_string(
        r#in: Box<dyn Stream<Item = String>>,
    ) -> Box<dyn Stream<Item = String>>;

    fn request_channel_bool(r#in: Box<dyn Stream<Item = bool>>) -> Box<dyn Stream<Item = bool>>;

    fn request_channel_datetime(
        r#in: Box<dyn Stream<Item = time::OffsetDateTime>>,
    ) -> Box<dyn Stream<Item = time::OffsetDateTime>>;

    fn request_channel_list(
        r#in: Box<dyn Stream<Item = Vec<String>>>,
    ) -> Box<dyn Stream<Item = Vec<String>>>;

    fn request_channel_map(
        r#in: Box<dyn Stream<Item = std::collections::HashMap<String, String>>>,
    ) -> Box<dyn Stream<Item = std::collections::HashMap<String, String>>>;

    fn request_channel_args_i64(
        value: i64,
        r#in: Box<dyn Stream<Item = i64>>,
    ) -> Box<dyn Stream<Item = i64>>;

    fn request_channel_args_f64(
        value: f64,
        r#in: Box<dyn Stream<Item = f64>>,
    ) -> Box<dyn Stream<Item = f64>>;

    fn request_channel_args_type(
        value: MyType,
        r#in: Box<dyn Stream<Item = MyType>>,
    ) -> Box<dyn Stream<Item = MyType>>;

    fn request_channel_args_enum(
        value: MyEnum,
        r#in: Box<dyn Stream<Item = MyEnum>>,
    ) -> Box<dyn Stream<Item = MyEnum>>;

    fn request_channel_args_alias(
        value: Uuid,
        r#in: Box<dyn Stream<Item = Uuid>>,
    ) -> Box<dyn Stream<Item = Uuid>>;

    fn request_channel_args_string(
        value: String,
        r#in: Box<dyn Stream<Item = String>>,
    ) -> Box<dyn Stream<Item = String>>;

    fn request_channel_args_bool(
        value: bool,
        r#in: Box<dyn Stream<Item = bool>>,
    ) -> Box<dyn Stream<Item = bool>>;

    fn request_channel_args_datetime(
        value: time::OffsetDateTime,
        r#in: Box<dyn Stream<Item = time::OffsetDateTime>>,
    ) -> Box<dyn Stream<Item = time::OffsetDateTime>>;

    fn request_channel_args_list(
        value: Vec<String>,
        r#in: Box<dyn Stream<Item = Vec<String>>>,
    ) -> Box<dyn Stream<Item = Vec<String>>>;

    fn request_channel_args_map(
        value: std::collections::HashMap<String, String>,
        r#in: Box<dyn Stream<Item = std::collections::HashMap<String, String>>>,
    ) -> Box<dyn Stream<Item = std::collections::HashMap<String, String>>>;
}

pub(crate) trait MyService {
    fn empty_void() -> ();

    fn unary_type(value: MyType) -> MyType;

    fn unary_enum(value: MyEnum) -> MyEnum;

    fn unary_uuid(value: Uuid) -> Uuid;

    fn unary_alias(value: MyAlias) -> MyAlias;

    fn unary_string(value: String) -> String;

    fn unary_i64(value: i64) -> i64;

    fn unary_i32(value: i32) -> i32;

    fn unary_i16(value: i16) -> i16;

    fn unary_i8(value: i8) -> i8;

    fn unary_u64(value: u64) -> u64;

    fn unary_u32(value: u32) -> u32;

    fn unary_u16(value: u16) -> u16;

    fn unary_u8(value: u8) -> u8;

    fn unary_f64(value: f64) -> f64;

    fn unary_f32(value: f32) -> f32;

    fn unary_bytes(value: Vec<u8>) -> Vec<u8>;

    fn unary_datetime(value: time::OffsetDateTime) -> time::OffsetDateTime;

    fn unary_list(value: Vec<String>) -> Vec<String>;

    fn unary_map(
        value: std::collections::HashMap<String, String>,
    ) -> std::collections::HashMap<String, String>;

    fn func_type(value: MyType, optional: Option<MyType>) -> MyType;

    fn func_enum(value: MyEnum, optional: Option<MyEnum>) -> MyEnum;

    fn func_uuid(value: Uuid, optional: Option<Uuid>) -> Uuid;

    fn func_alias(value: MyAlias, optional: Option<MyAlias>) -> MyAlias;

    fn func_string(value: String, optional: Option<String>) -> String;

    fn func_i64(value: i64, optional: Option<i64>) -> i64;

    fn func_i32(value: i32, optional: Option<i32>) -> i32;

    fn func_i16(value: i16, optional: Option<i16>) -> i16;

    fn func_i8(value: i8, optional: Option<i8>) -> i8;

    fn func_u64(value: u64, optional: Option<u64>) -> u64;

    fn func_u32(value: u32, optional: Option<u32>) -> u32;

    fn func_u16(value: u16, optional: Option<u16>) -> u16;

    fn func_u8(value: u8, optional: Option<u8>) -> u8;

    fn func_f64(value: f64, optional: Option<f64>) -> f64;

    fn func_f32(value: f32, optional: Option<f32>) -> f32;

    fn func_bytes(value: Vec<u8>, optional: Option<Vec<u8>>) -> Vec<u8>;

    fn func_datetime(
        value: time::OffsetDateTime,
        optional: Option<time::OffsetDateTime>,
    ) -> time::OffsetDateTime;

    fn func_list(value: Vec<String>, optional: Option<Vec<String>>) -> Vec<String>;

    fn func_map(
        value: std::collections::HashMap<String, String>,
        optional: Option<std::collections::HashMap<String, String>>,
    ) -> std::collections::HashMap<String, String>;
}

pub trait Repository {
    fn get_data() -> MyType;
}

/// MyType is a class
#[derive(Clone, Debug, PartialEq, serde::Serialize, serde::Deserialize)]
pub struct MyType {
    /// same type value
    #[serde(rename = "sameValue")]
    pub same_value: Box<Option<MyType>>,
    /// type value
    #[serde(rename = "typeValue")]
    pub type_value: MyOtherType,
    /// string value
    #[serde(rename = "stringValue")]
    pub string_value: String,
    /// string option
    #[serde(rename = "stringOption")]
    pub string_option: Option<String>,
    /// i64 value
    #[serde(rename = "i64Value")]
    pub i64_value: i64,
    /// i64 option
    #[serde(rename = "i64Option")]
    pub i64_option: Option<i64>,
    /// i32 value
    #[serde(rename = "i32Value")]
    pub i32_value: i32,
    /// i32 option
    #[serde(rename = "i32Option")]
    pub i32_option: Option<i32>,
    /// i16 value
    #[serde(rename = "i16Value")]
    pub i16_value: i16,
    /// i16 option
    #[serde(rename = "i16Option")]
    pub i16_option: Option<i16>,
    /// i8 value
    #[serde(rename = "i8Value")]
    pub i8_value: i8,
    /// i8 option
    #[serde(rename = "i8Option")]
    pub i8_option: Option<i8>,
    /// u64 value
    #[serde(rename = "u64Value")]
    pub u64_value: u64,
    /// u64 option
    #[serde(rename = "u64Option")]
    pub u64_option: Option<u64>,
    /// u32 value
    #[serde(rename = "u32Value")]
    pub u32_value: u32,
    /// u32 option
    #[serde(rename = "u32Option")]
    pub u32_option: Option<u32>,
    /// u16 value
    #[serde(rename = "u16Value")]
    pub u16_value: u16,
    /// u16 option
    #[serde(rename = "u16Option")]
    pub u16_option: Option<u16>,
    /// u8 value
    #[serde(rename = "u8Value")]
    pub u8_value: u8,
    /// u8 option
    #[serde(rename = "u8Option")]
    pub u8_option: Option<u8>,
    /// f64 value
    #[serde(rename = "f64Value")]
    pub f64_value: f64,
    /// f64 option
    #[serde(rename = "f64Option")]
    pub f64_option: Option<f64>,
    /// f32 value
    #[serde(rename = "f32Value")]
    pub f32_value: f32,
    /// f32 option
    #[serde(rename = "f32Option")]
    pub f32_option: Option<f32>,
    /// datetime value
    #[serde(rename = "datetimeValue", with = "time::serde::rfc3339")]
    pub datetime_value: time::OffsetDateTime,
    /// datetime option
    #[serde(rename = "datetimeOption")]
    pub datetime_option: Option<time::OffsetDateTime>,
    /// bytes value
    #[serde(rename = "bytesValue")]
    pub bytes_value: Vec<u8>,
    /// bytes option
    #[serde(rename = "bytesOption")]
    pub bytes_option: Option<Vec<u8>>,
    /// map value
    #[serde(rename = "mapValue")]
    pub map_value: std::collections::HashMap<String, i64>,
    /// map of types
    #[serde(rename = "mapOfTypes")]
    pub map_of_types: std::collections::HashMap<String, MyType>,
    /// array value
    #[serde(rename = "arrayValue")]
    pub array_value: Vec<String>,
    /// array of types
    #[serde(rename = "arrayOfTypes")]
    pub array_of_types: Vec<MyType>,
    /// union value
    #[serde(rename = "unionValue")]
    pub union_value: Box<MyUnion>,
    /// union option
    #[serde(rename = "unionOption")]
    pub union_option: Box<Option<MyUnion>>,
    /// enum value
    #[serde(rename = "enumValue")]
    pub enum_value: MyEnum,
    /// enum option
    #[serde(rename = "enumOption")]
    pub enum_option: Option<MyEnum>,
    /// enum value
    #[serde(rename = "aliasValue")]
    pub alias_value: Uuid,
    /// enum option
    #[serde(rename = "aliasOption")]
    pub alias_option: Option<Uuid>,
}
#[derive(Clone, Debug, PartialEq, serde::Serialize, serde::Deserialize)]
pub struct MyOtherType {
    #[serde(rename = "foo")]
    pub foo: String,
    #[serde(rename = "bar")]
    pub bar: String,
}
#[derive(Clone, Debug, PartialEq, serde::Serialize, serde::Deserialize)]
pub enum MyUnion {
    MyType(Box<MyType>),
    MyEnum(MyEnum),
    string(String),
}

/// MyEnum is an emuneration
#[derive(Clone, Debug, PartialEq, serde::Serialize, serde::Deserialize)]
pub enum MyEnum {
    /// ONE value
    One,
    /// TWO value
    Two,
    /// THREE value
    Three,
}
impl std::fmt::Display for MyEnum {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(
            f,
            "{}",
            match self {
                Self::One => "one",
                Self::Two => unimplemented!("No display value provided in schema"),
                Self::Three => "three",
            }
        )
    }
}
impl std::convert::TryFrom<u32> for MyEnum {
    type Error = String;
    fn try_from(index: u32) -> Result<Self, Self::Error> {
        match index {
            0 => Ok(Self::One),
            1 => Ok(Self::Two),
            2 => Ok(Self::Three),
            _ => Err(format!("{} is not a valid index for MyEnum", index)),
        }
    }
}
impl Into<u32> for MyEnum {
    fn into(self) -> u32 {
        match self {
            Self::One => unreachable!(),
            Self::Two => 1,
            Self::Three => 2,
        }
    }
}
