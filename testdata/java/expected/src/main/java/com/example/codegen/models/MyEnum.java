package com.example.codegen.models;

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