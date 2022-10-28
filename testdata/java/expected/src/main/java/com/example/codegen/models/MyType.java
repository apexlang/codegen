package com.example.codegen.models;

import com.example.codegen.models.MyType;
import com.example.codegen.models.MyOtherType;
import com.example.codegen.models.MyEnum;
import java.util.*;
import java.io.*;
import java.lang.*;
import java.math.*;
import java.text.*;
import java.time.*;
import javax.persistence.*;

@Entity
@Table(name = "my_type")
public class MyType {

  //     @Id
  //     @GeneratedValue(strategy = GenerationType.IDENTITY)
  //     private Long id;
  //
  //     private String name;
  //
  //     public Long getId() {
  //         return id;
  //     }
  //
  //     public void setId(Long id) {
  //         this.id = id;
  //     }
  //
  //     public String getName() {
  //         return name;
  //     }
  //
  //     public void setName(String name) {
  //         this.name = name;
  //     }

  // same type value
  @Column
  public MyType SameValue;

  // type value
  @Column
  public MyOtherType TypeValue;

  // string value
  @Column
  public String StringValue;

  // string option
  @Column
  public String StringOption;

  // i64 value
  @Column
  public long I64Value;

  // i64 option
  @Column
  public long I64Option;

  // i32 value
  @Column
  public int I32Value;

  // i32 option
  @Column
  public int I32Option;

  // i16 value
  @Column
  public short I16Value;

  // i16 option
  @Column
  public short I16Option;

  // i8 value
  @Column
  public byte I8Value;

  // i8 option
  @Column
  public byte I8Option;

  // u64 value
  @Column
  public String U64Value;

  // u64 option
  @Column
  public String U64Option;

  // u32 value
  @Column
  public long U32Value;

  // u32 option
  @Column
  public long U32Option;

  // u16 value
  @Column
  public int U16Value;

  // u16 option
  @Column
  public int U16Option;

  // u8 value
  @Column
  public int U8Value;

  // u8 option
  @Column
  public int U8Option;

  // f64 value
  @Column
  public double F64Value;

  // f64 option
  @Column
  public double F64Option;

  // f32 value
  @Column
  public float F32Value;

  // f32 option
  @Column
  public float F32Option;

  // datetime value
  @Column
  public LocalTime DatetimeValue;

  // datetime option
  @Column
  public LocalTime DatetimeOption;

  // bytes value
  @Column
  public byte BytesValue;

  // bytes option
  @Column
  public byte BytesOption;

  // map value
  @Column
  public Map < String, Long > MapValue;

  // map of types
  @Column
  public Map < String, MyType > MapOfTypes;

  // array value
  @Column
  public List < String > ArrayValue;

  // array of types
  @Column
  public List < MyType > ArrayOfTypes;

  // union value
  @Column
  public MyUnion UnionValue;

  // union option
  @Column
  public MyUnion UnionOption;

  // enum value
  @Column
  public MyEnum EnumValue;

  // enum option
  @Column
  public MyEnum EnumOption;

  // enum value
  @Column
  public UUID AliasValue;

  // enum option
  @Column
  public UUID AliasOption;

  public MyType getSameValue() {
    return SameValue;
  }

  public void setSameValue(MyType SameValue) {
    this.SameValue = SameValue;
  }

  public MyOtherType getTypeValue() {
    return TypeValue;
  }

  public void setTypeValue(MyOtherType TypeValue) {
    this.TypeValue = TypeValue;
  }

  public String getStringValue() {
    return StringValue;
  }

  public void setStringValue(String StringValue) {
    this.StringValue = StringValue;
  }

  public String getStringOption() {
    return StringOption;
  }

  public void setStringOption(String StringOption) {
    this.StringOption = StringOption;
  }

  public long getI64Value() {
    return I64Value;
  }

  public void setI64Value(long I64Value) {
    this.I64Value = I64Value;
  }

  public long getI64Option() {
    return I64Option;
  }

  public void setI64Option(long I64Option) {
    this.I64Option = I64Option;
  }

  public int getI32Value() {
    return I32Value;
  }

  public void setI32Value(int I32Value) {
    this.I32Value = I32Value;
  }

  public int getI32Option() {
    return I32Option;
  }

  public void setI32Option(int I32Option) {
    this.I32Option = I32Option;
  }

  public short getI16Value() {
    return I16Value;
  }

  public void setI16Value(short I16Value) {
    this.I16Value = I16Value;
  }

  public short getI16Option() {
    return I16Option;
  }

  public void setI16Option(short I16Option) {
    this.I16Option = I16Option;
  }

  public byte getI8Value() {
    return I8Value;
  }

  public void setI8Value(byte I8Value) {
    this.I8Value = I8Value;
  }

  public byte getI8Option() {
    return I8Option;
  }

  public void setI8Option(byte I8Option) {
    this.I8Option = I8Option;
  }

  public String getU64Value() {
    return U64Value;
  }

  public void setU64Value(String U64Value) {
    this.U64Value = U64Value;
  }

  public String getU64Option() {
    return U64Option;
  }

  public void setU64Option(String U64Option) {
    this.U64Option = U64Option;
  }

  public long getU32Value() {
    return U32Value;
  }

  public void setU32Value(long U32Value) {
    this.U32Value = U32Value;
  }

  public long getU32Option() {
    return U32Option;
  }

  public void setU32Option(long U32Option) {
    this.U32Option = U32Option;
  }

  public int getU16Value() {
    return U16Value;
  }

  public void setU16Value(int U16Value) {
    this.U16Value = U16Value;
  }

  public int getU16Option() {
    return U16Option;
  }

  public void setU16Option(int U16Option) {
    this.U16Option = U16Option;
  }

  public int getU8Value() {
    return U8Value;
  }

  public void setU8Value(int U8Value) {
    this.U8Value = U8Value;
  }

  public int getU8Option() {
    return U8Option;
  }

  public void setU8Option(int U8Option) {
    this.U8Option = U8Option;
  }

  public double getF64Value() {
    return F64Value;
  }

  public void setF64Value(double F64Value) {
    this.F64Value = F64Value;
  }

  public double getF64Option() {
    return F64Option;
  }

  public void setF64Option(double F64Option) {
    this.F64Option = F64Option;
  }

  public float getF32Value() {
    return F32Value;
  }

  public void setF32Value(float F32Value) {
    this.F32Value = F32Value;
  }

  public float getF32Option() {
    return F32Option;
  }

  public void setF32Option(float F32Option) {
    this.F32Option = F32Option;
  }

  public LocalTime getDateTimeValue() {
    return DateTimeValue;
  }

  public void setDateTimeValue(LocalTime DateTimeValue) {
    this.DateTimeValue = DateTimeValue;
  }

  public LocalTime getDateTimeOption() {
    return DateTimeOption;
  }

  public void setDateTimeOption(LocalTime DateTimeOption) {
    this.DateTimeOption = DateTimeOption;
  }

  public byte getBytesValue() {
    return BytesValue;
  }

  public void setBytesValue(byte BytesValue) {
    this.BytesValue = BytesValue;
  }

  public byte getBytesOption() {
    return BytesOption;
  }

  public void setBytesOption(byte BytesOption) {
    this.BytesOption = BytesOption;
  }

  public Map < String, Long > getMapValue() {
    return MapValue;
  }

  public void setMapValue(Map < String, Long > MapValue) {
    this.MapValue = MapValue;
  }

  public Map < String, MyType > getMapOfTypes() {
    return MapOfTypes;
  }

  public void setMapOfTypes(Map < String, MyType > MapOfTypes) {
    this.MapOfTypes = MapOfTypes;
  }

  public List < String > getArrayValue() {
    return ArrayValue;
  }

  public void setArrayValue(List < String > ArrayValue) {
    this.ArrayValue = ArrayValue;
  }

  public List < MyType > getArrayOfTypes() {
    return ArrayOfTypes;
  }

  public void setArrayOfTypes(List < MyType > ArrayOfTypes) {
    this.ArrayOfTypes = ArrayOfTypes;
  }

  public MyUnion getUnionValue() {
    return UnionValue;
  }

  public void setUnionValue(MyUnion UnionValue) {
    this.UnionValue = UnionValue;
  }

  public MyUnion getUnionOption() {
    return UnionOption;
  }

  public void setUnionOption(MyUnion UnionOption) {
    this.UnionOption = UnionOption;
  }

  public MyEnum getEnumValue() {
    return EnumValue;
  }

  public void setEnumValue(MyEnum EnumValue) {
    this.EnumValue = EnumValue;
  }

  public MyEnum getEnumOption() {
    return EnumOption;
  }

  public void setEnumOption(MyEnum EnumOption) {
    this.EnumOption = EnumOption;
  }

  public UUID getAliasValue() {
    return AliasValue;
  }

  public void setAliasValue(UUID AliasValue) {
    this.AliasValue = AliasValue;
  }

  public UUID getAliasOption() {
    return AliasOption;
  }

  public void setAliasOption(UUID AliasOption) {
    this.AliasOption = AliasOption;
  }
}