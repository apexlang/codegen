import java.util.*;
import java.io.*;
import java.lang.*;
import java.math.*;
import java.text.*;
import java.time.*;

interface MyService {
	 void emptyVoid() throws Exception;
	 MyType unaryType(MyType value) throws Exception;
	 MyEnum unaryEnum(MyEnum value) throws Exception;
	 UUID unaryAlias(UUID value) throws Exception;
	 String unaryString(String value) throws Exception;
	 long unaryI64(long value) throws Exception;
	 int unaryI32(int value) throws Exception;
	 short unaryI16(short value) throws Exception;
	 byte unaryI8(byte value) throws Exception;
	 String unaryU64(String value) throws Exception;
	 long unaryU32(long value) throws Exception;
	 int unaryU16(int value) throws Exception;
	 int unaryU8(int value) throws Exception;
	 double unaryF64(double value) throws Exception;
	 float unaryF32(float value) throws Exception;
	 byte unaryBytes(byte value) throws Exception;
	 MyType funcType(MyType value, MyType optional) throws Exception;
	 MyEnum funcEnum(MyEnum value, MyEnum optional) throws Exception;
	 UUID funcAlias(UUID value, UUID optional) throws Exception;
	 String funcString(String value, String optional) throws Exception;
	 long funcI64(long value, long optional) throws Exception;
	 int funcI32(int value, int optional) throws Exception;
	 short funcI16(short value, short optional) throws Exception;
	 byte funcI8(byte value, byte optional) throws Exception;
	 String funcU64(String value, String optional) throws Exception;
	 long funcU32(long value, long optional) throws Exception;
	 int funcU16(int value, int optional) throws Exception;
	 int funcU8(int value, int optional) throws Exception;
	 double funcF64(double value, double optional) throws Exception;
	 float funcF32(float value, float optional) throws Exception;
	 byte funcBytes(byte value, byte optional) throws Exception;
}

interface Repository {
	 MyType getData() throws Exception;
}

  // MyType is a class
class MyType {

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
	 public Map<String, Long> MapValue;

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
	 public UUID AliasValue;

    // enum option
	 public UUID AliasOption;

}

class MyOtherType {

	 public String Foo;

	 public String Bar;

}

class MyUnion {

	 public MyType myType;
	 public MyEnum myEnum;
	 public String string;
}

// MyEnum is an emuneration
enum MyEnum {
	 // ONE value,TWO value,THREE value
	 ONE(0),
	 TWO(1),
	 THREE(2);

	 private final int value;
	 MyEnum(int value) {
		 this.value = value;
	 }
}