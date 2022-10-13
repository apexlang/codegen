  // MyType is a class
  public class MyType
  {
    // same type value
	 public MyType SameValue;

    // type value
	 public MyOtherType TypeValue;

    // string value
	 public String StringValue;

    // string option
	 public String StringOption;

    // i64 value
	 public long I64Value;

    // i64 option
	 public long I64Option;

    // i32 value
	 public int I32Value;

    // i32 option
	 public int I32Option;

    // i16 value
	 public short I16Value;

    // i16 option
	 public short I16Option;

    // i8 value
	 public byte I8Value;

    // i8 option
	 public byte I8Option;

    // u64 value
	 public String U64Value;

    // u64 option
	 public String U64Option;

    // u32 value
	 public long U32Value;

    // u32 option
	 public long U32Option;

    // u16 value
	 public int U16Value;

    // u16 option
	 public int U16Option;

    // u8 value
	 public int U8Value;

    // u8 option
	 public int U8Option;

    // f64 value
	 public double F64Value;

    // f64 option
	 public double F64Option;

    // f32 value
	 public float F32Value;

    // f32 option
	 public float F32Option;

    // datetime value
	 public LocalTime DatetimeValue;

    // datetime option
	 public LocalTime DatetimeOption;

    // bytes value
	 public byte BytesValue;

    // bytes option
	 public byte BytesOption;

    // map value
	 public Map<String, long> MapValue;

    // map of types
	 public Map<String, MyType> MapOfTypes;

    // array value
	 public List<String> ArrayValue;

    // array of types
	 public List<MyType> ArrayOfTypes;

    // union value
	 public MyUnion UnionValue;

    // union option
	 public MyUnion UnionOption;

    // enum value
	 public MyEnum EnumValue;

    // enum option
	 public MyEnum EnumOption;

    // enum value
	 public Uuid AliasValue;

    // enum option
	 public Uuid AliasOption;

  }

  public class MyOtherType
  {
	 public String Foo;

	 public String Bar;

  }

// MyEnum is an emuneration
enum MyEnum {
	 // ONE value,TWO value,THREE value
	 ONE,TWO,THREE
}