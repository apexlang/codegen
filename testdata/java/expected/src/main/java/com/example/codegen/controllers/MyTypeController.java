package com.example.codegen.controllers;

import com.example.codegen.models.MyType;
import com.example.codegen.repositories.MyRepository;
import com.example.codegen.services.MyTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1", produces = "application/json")
public class MyTypeController {

  @Autowired
  MyTypeService myTypeService;

  @GetMapping
  public void emptyVoid() {
    return myTypeService.emptyVoid();
  }

  @PostMapping("/unaryType")
  public MyType unaryType(@RequestBody MyType value) {
    return myTypeService.unaryType(value);
  }

  @PostMapping("/unaryEnum")
  public MyEnum unaryEnum(@RequestBody MyEnum value) {
    return myTypeService.unaryEnum(value);
  }

  @PostMapping("/unaryAlias")
  public UUID unaryAlias(@RequestBody UUID value) {
    return myTypeService.unaryAlias(value);
  }

  @PostMapping("/unaryString")
  public String unaryString(@RequestBody String value) {
    return myTypeService.unaryString(value);
  }

  @PostMapping("/unaryI64")
  public long unaryI64(@RequestBody long value) {
    return myTypeService.unaryI64(value);
  }

  @PostMapping("/unaryI32")
  public int unaryI32(@RequestBody int value) {
    return myTypeService.unaryI32(value);
  }

  @PostMapping("/unaryI16")
  public short unaryI16(@RequestBody short value) {
    return myTypeService.unaryI16(value);
  }

  @PostMapping("/unaryI8")
  public byte unaryI8(@RequestBody byte value) {
    return myTypeService.unaryI8(value);
  }

  @PostMapping("/unaryU64")
  public String unaryU64(@RequestBody String value) {
    return myTypeService.unaryU64(value);
  }

  @PostMapping("/unaryU32")
  public String unaryU32(@RequestBody String value) {
    return myTypeService.unaryU32(value);
  }

  @PostMapping("/unaryU16")
  public String unaryU16(@RequestBody String value) {
    return myTypeService.unaryU16(value);
  }

  @PostMapping("/unaryU8")
  public String unaryU8(@RequestBody String value) {
    return myTypeService.unaryU8(value);
  }

  @PostMapping("/unaryF64")
  public double unaryF64(@RequestBody double value) {
    return myTypeService.unaryF64(value);
  }

  @PostMapping("/unaryF32")
  public float unaryF32(@RequestBody float value) {
    return myTypeService.unaryF32(value);
  }

  @PostMapping("/unaryBool")
  public byte unaryBytes(@RequestBody byte value) {
    return myTypeService.unaryBytes(value);
  }

  @PostMapping("/funcType")
  public MyType funcType(@RequestBody MyType value, @RequestBody MyType optional) {
    return myTypeService.funcType(value);
  }

  @PostMapping("/funcEnum")
  public MyEnum funcEnum(@RequestBody MyEnum value, @RequestBody MyEnum optional) {
    return myTypeService.funcEnum(value);
  }

  @PostMapping("/funcAlias")
  public UUID funcAlias(@RequestBody UUID value, @RequestBody UUID optional) {
    return myTypeService.funcAlias(value);
  }

  @PostMapping("/funcString")
  public String funcString(@RequestBody String value, @RequestBody String optional) {
    return myTypeService.funcString(value);
  }

  @PostMapping("/funcI64")
  public long funcI64(@RequestBody long value, @RequestBody long optional) {
    return myTypeService.funcI64(value);
  }

  @PostMapping("/funcI32")
  public int funcI32(@RequestBody int value, @RequestBody int optional) {
    return myTypeService.funcI32(value);
  }

  @PostMapping("/funcI16")
  public short funcI16(@RequestBody short value, @RequestBody short optional) {
    return myTypeService.funcI16(value);
  }

  @PostMapping("/funcI8")
  public byte funcI8(@RequestBody byte value, @RequestBody byte optional) {
    return myTypeService.funcI8(value);
  }

  @PostMapping("/funcU64")
  public String funcU64(@RequestBody String value, @RequestBody String optional) {
    return myTypeService.funcU64(value);
  }

  @PostMapping("/funcU32")
  public String funcU32(@RequestBody String value, @RequestBody String optional) {
    return myTypeService.funcU32(value);
  }

  @PostMapping("/funcU16")
  public String funcU16(@RequestBody String value, @RequestBody String optional) {
    return myTypeService.funcU16(value);
  }

  @PostMapping("/funcU8")
  public String funcU8(@RequestBody String value, @RequestBody String optional) {
    return myTypeService.funcU8(value);
  }

  @PostMapping("/funcF64")
  public double funcF64(@RequestBody double value, @RequestBody double optional) {
    return myTypeService.funcF64(value);
  }

  @PostMapping("/funcF32")
  public float funcF32(@RequestBody float value, @RequestBody float optional) {
    return myTypeService.funcF32(value);
  }

  @PostMapping("/funcBytes")
  public byte[] funcBytes(@RequestBody byte value, @RequestBody byte optional) {
    return myTypeService.funcBytes(value);
  }
}