import java.io.*;
import java.util.*;
import java.time.*;

enum MyEnum {
    ONE(0),
    TWO(1),
    THREE(2);
}

interface Repository {
    MyType getData() throws Exception;
}

interface MyService {
    void emptyVoid() throws Exception;
    MyType unaryType(MyType value) throws Exception;
    MyEnum unaryEnum(MyEnum value) throws Exception;
    Uuid unaryAlias(Uuid value) throws Exception;
    String unaryString(String value) throws Exception;
    long unaryI64(long value) throws Exception;
    int unaryI32(int value) throws Exception;
    short unaryI16(short value) throws Exception;
    byte unaryI8(byte value) throws Exception;
    long unaryU64(long value) throws Exception;
    int unaryU32(int value) throws Exception;
    short unaryU16(short value) throws Exception;
    byte unaryU8(byte value) throws Exception;
    double unaryF64(double value) throws Exception;
    float unaryF32(float value) throws Exception;
    Byte[] unaryBytes(Byte[] value) throws Exception;
    MyType funcType(MyType value, Optional<MyType> optional) throws Exception;
    MyEnum funcEnum(MyEnum value, Optional<MyEnum> optional) throws Exception;
    Uuid funcAlias(Uuid value, Optional<Uuid> optional) throws Exception;
    String funcString(String value, Optional<String> optional) throws Exception;
    long funcI64(long value, Optional<Long> optional) throws Exception;
    int funcI32(int value, Optional<Integer> optional) throws Exception;
    short funcI16(short value, Optional<Short> optional) throws Exception;
    byte funcI8(byte value, Optional<Byte> optional) throws Exception;
    long funcU64(long value, Optional<Long> optional) throws Exception;
    int funcU32(int value, Optional<Integer> optional) throws Exception;
    short funcU16(short value, Optional<Short> optional) throws Exception;
    byte funcU8(byte value, Optional<Byte> optional) throws Exception;
    double funcF64(double value, Optional<Double> optional) throws Exception;
    float funcF32(float value, Optional<Float> optional) throws Exception;
    byte[] func_bytes(byte[] value, byte[] optional) throws Exception;
}

class Uuid{}

class MyUnion {
    public MyType myType;
    public MyEnum myEnum;
    public String myString;
}

  class MyType {
     public float F32Value;
     public float F32Option;
     public LocalTime DatetimeValue;
     public LocalTime DatetimeOption;
     public byte BytesValue;
     public byte BytesOption;
     public Map<String, Long> MapValue;
     public Map<String, MyType> MapOfTypes;
     public List<String> ArrayValue;
     public List<MyType> ArrayOfTypes;
     public MyUnion UnionValue;
     public MyUnion UnionOption;
     public MyEnum EnumValue;
     public MyEnum EnumOption;
     public Uuid AliasValue;
     public Uuid AliasOption;
  }

  class MyOtherType
  {
     public String Foo;
     public String Bar;
  }

public class Main
{
    public static void main(String[] args) {}
}
