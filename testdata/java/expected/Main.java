import java.util.*;
import java.io.*;
import java.lang.*;
import java.math.*;
import java.text.*;
import java.time.*;

public class Main {

	public interface MyService {
		public static void emptyVoid() {
			return;
		}

		public static MyType unaryType(MyType value) {
			return value;
		}

		public static MyEnum unaryEnum(MyEnum value) {
			return value;
		}

		public static UUID unaryAlias(UUID value) {
			return value;
		}

		public static String unaryString(String value) {
			return value;
		}

		public static long unaryI64(long value) {
			return value;
		}

		public static int unaryI32(int value) {
			return value;
		}

		public static short unaryI16(short value) {
			return value;
		}

		public static byte unaryI8(byte value) {
			return value;
		}

		public static String unaryU64(String value) {
			return value;
		}

		public static long unaryU32(long value) {
			return value;
		}

		public static int unaryU16(int value) {
			return value;
		}

		public static int unaryU8(int value) {
			return value;
		}

		public static double unaryF64(double value) {
			return value;
		}

		public static float unaryF32(float value) {
			return value;
		}

		public static byte unaryBytes(byte value) {
			return value;
		}

		public static MyType funcType(MyType value, MyType optional) {
			return value;
		}

		public static MyEnum funcEnum(MyEnum value, MyEnum optional) {
			return value;
		}

		public static UUID funcAlias(UUID value, UUID optional) {
			return value;
		}

		public static String funcString(String value, String optional) {
			return value;
		}

		public static long funcI64(long value, long optional) {
			return value;
		}

		public static int funcI32(int value, int optional) {
			return value;
		}

		public static short funcI16(short value, short optional) {
			return value;
		}

		public static byte funcI8(byte value, byte optional) {
			return value;
		}

		public static String funcU64(String value, String optional) {
			return value;
		}

		public static long funcU32(long value, long optional) {
			return value;
		}

		public static int funcU16(int value, int optional) {
			return value;
		}

		public static int funcU8(int value, int optional) {
			return value;
		}

		public static double funcF64(double value, double optional) {
			return value;
		}

		public static float funcF32(float value, float optional) {
			return value;
		}

		public static byte funcBytes(byte value, byte optional) {
			return value;
		}

	}

	public interface Repository {
		public static MyType getData() {
			return null;
		}

	}

	// MyType is a class
	public static class MyType {

		// same type value
		public static MyType SameValue;

		// type value
		public static MyOtherType TypeValue;

		// string value
		public static String StringValue;

		// string option
		public static String StringOption;

		// i64 value
		public static long I64Value;

		// i64 option
		public static long I64Option;

		// i32 value
		public static int I32Value;

		// i32 option
		public static int I32Option;

		// i16 value
		public static short I16Value;

		// i16 option
		public static short I16Option;

		// i8 value
		public static byte I8Value;

		// i8 option
		public static byte I8Option;

		// u64 value
		public static String U64Value;

		// u64 option
		public static String U64Option;

		// u32 value
		public static long U32Value;

		// u32 option
		public static long U32Option;

		// u16 value
		public static int U16Value;

		// u16 option
		public static int U16Option;

		// u8 value
		public static int U8Value;

		// u8 option
		public static int U8Option;

		// f64 value
		public static double F64Value;

		// f64 option
		public static double F64Option;

		// f32 value
		public static float F32Value;

		// f32 option
		public static float F32Option;

		// datetime value
		public static LocalTime DatetimeValue;

		// datetime option
		public static LocalTime DatetimeOption;

		// bytes value
		public static byte BytesValue;

		// bytes option
		public static byte BytesOption;

		// map value
		public static Map<String, Long> MapValue;

		// map of types
		public static Map<String, MyType> MapOfTypes;

		// array value
		public static List<String> ArrayValue;

		// array of types
		public static List<MyType> ArrayOfTypes;

		// union value
		public static MyUnion UnionValue;

		// union option
		public static MyUnion UnionOption;

		// enum value
		public static MyEnum EnumValue;

		// enum option
		public static MyEnum EnumOption;

		// enum value
		public static UUID AliasValue;

		// enum option
		public static UUID AliasOption;

	}

	public static class MyOtherType {

		public static String Foo;

		public static String Bar;

	}

	public static class MyUnion {

		public static MyType myType;
		public static MyEnum myEnum;
		public static String string;

	}

// MyEnum is an emuneration
	public enum MyEnum {
		// ONE value,TWO value,THREE value
		ONE(0),
		TWO(1),
		THREE(2);

		private final int value;
		MyEnum(int value) {
			this.value = value;
		}
	}

	public static void main(String[] args) {
		System.out.println("Welcome to JAVA. Happy Coding :)");
	}
}