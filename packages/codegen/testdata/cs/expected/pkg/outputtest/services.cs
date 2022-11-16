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

}
