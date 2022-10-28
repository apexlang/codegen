package com.example.codegen.models;

import com.example.codegen.models.MyType;
import com.example.codegen.models.MyEnum;
import javax.persistence.*;

@Entity
@Table(name = "my_union")
public class MyUnion {

  @Column
  public MyType myType;

  @Column
  public MyEnum myEnum;

  @Column
  public String string;

  public MyType getMyType() {
    return myType;
  }

  public void setMyType(MyType myType) {
    this.myType = myType;
  }

  public MyEnum getMyEnum() {
    return myEnum;
  }

  public void setMyEnum(MyEnum myEnum) {
    this.myEnum = myEnum;
  }

  public String getString() {
    return string;
  }

  public void setString(String string) {
    this.string = string;
  }
}