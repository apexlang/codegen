pub type MyString = String;
pub type Uuid = String;

pub(crate) trait MyService {
    fn empty_void() -> ();

    fn unary_type(value: MyType) -> MyType;

    fn unary_enum(value: MyEnum) -> MyEnum;

    fn unary_alias(value: Uuid) -> Uuid;

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

    fn func_type(value: MyType, optional: Option<MyType>) -> MyType;

    fn func_enum(value: MyEnum, optional: Option<MyEnum>) -> MyEnum;

    fn func_alias(value: Uuid, optional: Option<Uuid>) -> Uuid;

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
    MyString(MyString),
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
    type Error = Box<dyn std::error::Error + Send + Sync + 'static>;
    fn try_from(index: u32) -> Result<Self, Self::Error> {
        match index {
            0 => Ok(Self::One),
            1 => Ok(Self::Two),
            2 => Ok(Self::Three),
            _ => Err(format!("{} is not a valid index for MyEnum", index).into()),
        }
    }
}
