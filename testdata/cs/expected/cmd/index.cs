// Code generated by @apexlang/codegen. DO NOT EDIT.

using System;
using Microsoft.AspNetCore.Builder;

namespace Apex.Testing
{
	public class Setup
	{
		public Setup(WebApplication app, MyService service)
		{
			app.MapGet("/v1", () => service.EmptyVoid());
			app.MapPost("/v1/unaryType", (MyType value) => service.UnaryType(value));
			app.MapPost("/v1/unaryEnum", (MyEnum value) => service.UnaryEnum(value));
			app.MapPost("/v1/unaryAlias", (Uuid value) => service.UnaryAlias(value));
			app.MapPost("/v1/unaryString", (string value) => service.UnaryString(value));
			app.MapPost("/v1/unaryI64", (long value) => service.UnaryI64(value));
			app.MapPost("/v1/unaryI32", (int value) => service.UnaryI32(value));
			app.MapPost("/v1/unaryI16", (short value) => service.UnaryI16(value));
			app.MapPost("/v1/unaryI8", (sbyte value) => service.UnaryI8(value));
			app.MapPost("/v1/unaryU64", (ulong value) => service.UnaryU64(value));
			app.MapPost("/v1/unaryU32", (uint value) => service.UnaryU32(value));
			app.MapPost("/v1/unaryU16", (ushort value) => service.UnaryU16(value));
			app.MapPost("/v1/unaryU8", (byte value) => service.UnaryU8(value));
			app.MapPost("/v1/unaryF64", (double value) => service.UnaryF64(value));
			app.MapPost("/v1/unaryF32", (float value) => service.UnaryF32(value));
			app.MapPost("/v1/unaryBytes", (byte[] value) => service.UnaryBytes(value));
			app.MapPost("/v1/funcType", (MyType value, MyType? optional) => service.FuncType(value, optional));
			app.MapPost("/v1/funcEnum", (MyEnum value, MyEnum? optional) => service.FuncEnum(value, optional));
			app.MapPost("/v1/funcEnum", (Uuid value, Uuid? optional) => service.FuncAlias(value, optional));
			app.MapPost("/v1/funcString", (string value, string? optional) => service.FuncString(value, optional));
			app.MapPost("/v1/funcI64", (long value, long? optional) => service.FuncI64(value, optional));
			app.MapPost("/v1/funcI32", (int value, int? optional) => service.FuncI32(value, optional));
			app.MapPost("/v1/funcI16", (short value, short? optional) => service.FuncI16(value, optional));
			app.MapPost("/v1/funcI8", (sbyte value, sbyte? optional) => service.FuncI8(value, optional));
			app.MapPost("/v1/funcU64", (ulong value, ulong? optional) => service.FuncU64(value, optional));
			app.MapPost("/v1/funcU32", (uint value, uint? optional) => service.FuncU32(value, optional));
			app.MapPost("/v1/funcU16", (ushort value, ushort? optional) => service.FuncU16(value, optional));
			app.MapPost("/v1/funcU8", (byte value, byte? optional) => service.FuncU8(value, optional));
			app.MapPost("/v1/funcF64", (double value, double? optional) => service.FuncF64(value, optional));
			app.MapPost("/v1/funcF32", (float value, float? optional) => service.FuncF32(value, optional));
			app.MapPost("/v1/funcBytes", (byte[] value, byte[]? optional) => service.FuncBytes(value, optional));
		}
	}
}

namespace Apex.Testing
{
	public class MyServiceImpl : MyService
	{
		private Repository repository;

		public MyServiceImpl (RepositoryImpl repository)
		{
			this.repository = repository;
		}

		public void EmptyVoid()
		{
			return; // TODO: Provide implementation.
		}

		public MyType UnaryType(MyType value)
		{
			return new MyType(); // TODO: Provide implementation.
		}

		public MyEnum UnaryEnum(MyEnum value)
		{
			return new MyEnum(); // TODO: Provide implementation.
		}

		public Uuid UnaryAlias(Uuid value)
		{
			return new Uuid(); // TODO: Provide implementation.
		}

		public string UnaryString(string value)
		{
			return new string(); // TODO: Provide implementation.
		}

		public long UnaryI64(long value)
		{
			return new long(); // TODO: Provide implementation.
		}

		public int UnaryI32(int value)
		{
			return new int(); // TODO: Provide implementation.
		}

		public short UnaryI16(short value)
		{
			return new short(); // TODO: Provide implementation.
		}

		public sbyte UnaryI8(sbyte value)
		{
			return new sbyte(); // TODO: Provide implementation.
		}

		public ulong UnaryU64(ulong value)
		{
			return new ulong(); // TODO: Provide implementation.
		}

		public uint UnaryU32(uint value)
		{
			return new uint(); // TODO: Provide implementation.
		}

		public ushort UnaryU16(ushort value)
		{
			return new ushort(); // TODO: Provide implementation.
		}

		public byte UnaryU8(byte value)
		{
			return new byte(); // TODO: Provide implementation.
		}

		public double UnaryF64(double value)
		{
			return new double(); // TODO: Provide implementation.
		}

		public float UnaryF32(float value)
		{
			return new float(); // TODO: Provide implementation.
		}

		public byte[] UnaryBytes(byte[] value)
		{
			return new byte[](); // TODO: Provide implementation.
		}

		public MyType FuncType(MyType value, MyType? optional)
		{
			return new MyType(); // TODO: Provide implementation.
		}

		public MyEnum FuncEnum(MyEnum value, MyEnum? optional)
		{
			return new MyEnum(); // TODO: Provide implementation.
		}

		public Uuid FuncAlias(Uuid value, Uuid? optional)
		{
			return new Uuid(); // TODO: Provide implementation.
		}

		public string FuncString(string value, string? optional)
		{
			return new string(); // TODO: Provide implementation.
		}

		public long FuncI64(long value, long? optional)
		{
			return new long(); // TODO: Provide implementation.
		}

		public int FuncI32(int value, int? optional)
		{
			return new int(); // TODO: Provide implementation.
		}

		public short FuncI16(short value, short? optional)
		{
			return new short(); // TODO: Provide implementation.
		}

		public sbyte FuncI8(sbyte value, sbyte? optional)
		{
			return new sbyte(); // TODO: Provide implementation.
		}

		public ulong FuncU64(ulong value, ulong? optional)
		{
			return new ulong(); // TODO: Provide implementation.
		}

		public uint FuncU32(uint value, uint? optional)
		{
			return new uint(); // TODO: Provide implementation.
		}

		public ushort FuncU16(ushort value, ushort? optional)
		{
			return new ushort(); // TODO: Provide implementation.
		}

		public byte FuncU8(byte value, byte? optional)
		{
			return new byte(); // TODO: Provide implementation.
		}

		public double FuncF64(double value, double? optional)
		{
			return new double(); // TODO: Provide implementation.
		}

		public float FuncF32(float value, float? optional)
		{
			return new float(); // TODO: Provide implementation.
		}

		public byte[] FuncBytes(byte[] value, byte[]? optional)
		{
			return new byte[](); // TODO: Provide implementation.
		}
	}

	public class RepositoryImpl : Repository
	{
		public MyType GetData()
		{
			return new MyType(); // TODO: Provide implementation.
		}
	}

}

public interface MyService
{
	public void EmptyVoid();

	public MyType UnaryType(MyType value);

	public MyEnum UnaryEnum(MyEnum value);

	public Uuid UnaryAlias(Uuid value);

	public string UnaryString(string value);

	public long UnaryI64(long value);

	public int UnaryI32(int value);

	public short UnaryI16(short value);

	public sbyte UnaryI8(sbyte value);

	public ulong UnaryU64(ulong value);

	public uint UnaryU32(uint value);

	public ushort UnaryU16(ushort value);

	public byte UnaryU8(byte value);

	public double UnaryF64(double value);

	public float UnaryF32(float value);

	public byte[] UnaryBytes(byte[] value);

	public MyType FuncType(MyType value, MyType? optional);

	public MyEnum FuncEnum(MyEnum value, MyEnum? optional);

	public Uuid FuncAlias(Uuid value, Uuid? optional);

	public string FuncString(string value, string? optional);

	public long FuncI64(long value, long? optional);

	public int FuncI32(int value, int? optional);

	public short FuncI16(short value, short? optional);

	public sbyte FuncI8(sbyte value, sbyte? optional);

	public ulong FuncU64(ulong value, ulong? optional);

	public uint FuncU32(uint value, uint? optional);

	public ushort FuncU16(ushort value, ushort? optional);

	public byte FuncU8(byte value, byte? optional);

	public double FuncF64(double value, double? optional);

	public float FuncF32(float value, float? optional);

	public byte[] FuncBytes(byte[] value, byte[]? optional);
}


public interface Repository
{
	public MyType GetData();
}


// MyType is a class
public record MyType {
	// same type value
	public MyType? SameValue   { get; set; }

	// type value
	public MyOtherType TypeValue   { get; set; }

	// string value
	public string StringValue   { get; set; }

	// string option
	public string? StringOption   { get; set; }

	// i64 value
	public long I64Value   { get; set; }

	// i64 option
	public long? I64Option   { get; set; }

	// i32 value
	public int I32Value   { get; set; }

	// i32 option
	public int? I32Option   { get; set; }

	// i16 value
	public short I16Value   { get; set; }

	// i16 option
	public short? I16Option   { get; set; }

	// i8 value
	public sbyte I8Value   { get; set; }

	// i8 option
	public sbyte? I8Option   { get; set; }

	// u64 value
	public ulong U64Value   { get; set; }

	// u64 option
	public ulong? U64Option   { get; set; }

	// u32 value
	public uint U32Value   { get; set; }

	// u32 option
	public uint? U32Option   { get; set; }

	// u16 value
	public ushort U16Value   { get; set; }

	// u16 option
	public ushort? U16Option   { get; set; }

	// u8 value
	public byte U8Value   { get; set; }

	// u8 option
	public byte? U8Option   { get; set; }

	// f64 value
	public double F64Value   { get; set; }

	// f64 option
	public double? F64Option   { get; set; }

	// f32 value
	public float F32Value   { get; set; }

	// f32 option
	public float? F32Option   { get; set; }

	// datetime value
	public DateTime DatetimeValue   { get; set; }

	// datetime option
	public DateTime? DatetimeOption   { get; set; }

	// bytes value
	public byte[] BytesValue   { get; set; }

	// bytes option
	public byte[]? BytesOption   { get; set; }

	// map value
	public Dictionary<string, long> MapValue   { get; set; }

	// map of types
	public Dictionary<string, MyType> MapOfTypes   { get; set; }

	// array value
	public List<string> ArrayValue   { get; set; }

	// array of types
	public List<MyType> ArrayOfTypes   { get; set; }

	// union value
	public MyUnion UnionValue   { get; set; }

	// union option
	public MyUnion? UnionOption   { get; set; }

	// enum value
	public MyEnum EnumValue   { get; set; }

	// enum option
	public MyEnum? EnumOption   { get; set; }

	// enum value
	public Uuid AliasValue   { get; set; }

	// enum option
	public Uuid? AliasOption   { get; set; }
}

public record MyOtherType {
	public string Foo   { get; set; }

	public string Bar   { get; set; }
}

namespace Apex.Testing
{
	public class MainClass
	{
		public static void Main(String[] args)
		{
			MyServiceImpl myservice = new MyServiceImpl(new RepositoryImpl());
		}
	}
}
