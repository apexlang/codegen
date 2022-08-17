///MyService is an interface
pub trait MyService {
    fn empty_void() -> ();

    fn unary_type(thing: MyType) -> MyType;

    fn unary_enum(value: MyEnum) -> MyEnum;

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
}
///Repository is an interface
pub trait Repository {
    fn get_data() -> MyType;
}

///MyType is a class-like definition
#[derive(Clone, Debug, PartialEq)]
pub struct MyType {
    ///same type value
    same_value: Box<Option<MyType>>,
    ///type value
    type_value: MyOtherType,
    ///string value
    string_value: String,
    ///i64 value
    i64_value: i64,
    ///i32 value
    i32_value: i32,
    ///i16 value
    i16_value: i16,
    ///i8 value
    i8_value: i8,
    ///u64 value
    u64_value: u64,
    ///u32 value
    u32_value: u32,
    ///u16 value
    u16_value: u16,
    ///u8 value
    u8_value: u8,
    ///f64 value
    f64_value: f64,
    ///f32 value
    f32_value: f32,
    ///bytes value
    bytes_value: Vec<u8>,
    ///map value
    map_value: std::collections::HashMap<String, i64>,
    ///map of types
    map_of_types: std::collections::HashMap<String, MyType>,
    ///array value
    array_value: Vec<String>,
    ///array of types
    array_of_types: Vec<MyType>,
}

#[derive(Clone, Debug, PartialEq, serde::Serialize, serde::Deserialize)]
pub struct MyOtherType {
    foo: String,

    bar: String,
}
///MyUnion is either MyType or MyEnum
#[derive(Clone, Debug, PartialEq)]
pub enum MyUnion {
    MyType(Box<MyType>),
    MyEnum(MyEnum),
}

///MyEnum is an enumeration
#[derive(Clone, Debug, PartialEq)]
pub enum MyEnum {
    ///ONE value
    One,
    ///TWO value
    Two,
    ///THREE value
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
