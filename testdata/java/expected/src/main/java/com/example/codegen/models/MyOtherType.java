package com.example.codegen.models;

import javax.persistence.*;

@Entity
@Table(name = "my_other_type")
public class MyOtherType {

  @Column
  public String Foo;

  @Column
  public String Bar;

  public String getFoo() {
    return Foo;
  }

  public void setFoo(String foo) {
    Foo = foo;
  }

  public String getBar() {
    return Bar;
  }

  public void setBar(String bar) {
    Bar = bar;
  }
}