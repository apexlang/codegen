package com.example.codegen.services;

import com.example.codegen.models.MyType;
import com.example.codegen.models.MyOtherType;
import com.example.codegen.repositories.MyTypeRepository;
import java.util.*;
import java.io.*;
import java.lang.*;
import java.math.*;
import java.text.*;
import java.time.*;
import javax.persistence.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MyTypeService {

  @AutoWired
  MyTypeRepository myTypeRepository;

  public void emptyVoid() {
    return;
  }

  public MyType unaryType(MyType value) {
    return value;
  }

  public MyEnum unaryEnum(MyEnum value) {
    return value;
  }

  public UUID unaryAlias(UUID value) {
    return value;
  }

  public String unaryString(String value) {
    return value;
  }

  public long unaryI64(long value) {
    return value;
  }

  public int unaryI32(int value) {
    return value;
  }

  public short unaryI16(short value) {
    return value;
  }

  public byte unaryI8(byte value) {
    return value;
  }

  public String unaryU64(String value) {
    return value;
  }

  public long unaryU32(long value) {
    return value;
  }

  public int unaryU16(int value) {
    return value;
  }

  public int unaryU8(int value) {
    return value;
  }

  public double unaryF64(double value) {
    return value;
  }

  public float unaryF32(float value) {
    return value;
  }

  public byte unaryBytes(byte value) {
    return value;
  }

  public MyType funcType(MyType value, MyType optional) {
    return value;
  }

  public MyEnum funcEnum(MyEnum value, MyEnum optional) {
    return value;
  }

  public UUID funcAlias(UUID value, UUID optional) {
    return value;
  }

  public String funcString(String value, String optional) {
    return value;
  }

  public long funcI64(long value, long optional) {
    return value;
  }

  public int funcI32(int value, int optional) {
    return value;
  }

  public short funcI16(short value, short optional) {
    return value;
  }

  public byte funcI8(byte value, byte optional) {
    return value;
  }

  public String funcU64(String value, String optional) {
    return value;
  }

  public long funcU32(long value, long optional) {
    return value;
  }

  public int funcU16(int value, int optional) {
    return value;
  }

  public int funcU8(int value, int optional) {
    return value;
  }

  public double funcF64(double value, double optional) {
    return value;
  }

  public float funcF32(float value, float optional) {
    return value;
  }

  public byte funcBytes(byte value, byte optional) {
    return value;
  }

}