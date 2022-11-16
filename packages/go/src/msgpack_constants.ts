/*
Copyright 2022 The Apex Authors.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

export const msgpackCodecFuncs = new Map<string, string>([
  ["ID", "StringToBytes"],
  ["bool", "BoolToBytes"],
  ["string", "StringToBytes"],
  ["datetime", "TimeToBytes"],
  ["i8", "Int8ToBytes"],
  ["u8", "Uint8ToBytes"],
  ["i16", "Int16ToBytes"],
  ["u16", "Uint16ToBytes"],
  ["i32", "Int32ToBytes"],
  ["u32", "Uint32ToBytes"],
  ["i64", "Int64ToBytes"],
  ["u64", "Uint64ToBytes"],
  ["f32", "Float32ToBytes"],
  ["f64", "Float64ToBytes"],
  ["bytes", "ByteArraToBytesy"],
]);

export const msgpackDecodeFuncs = new Map<string, string>([
  ["ID", "ReadString"],
  ["bool", "ReadBool"],
  ["string", "ReadString"],
  ["datetime", "ReadTime"],
  ["i8", "ReadInt8"],
  ["u8", "ReadUint8"],
  ["i16", "ReadInt16"],
  ["u16", "ReadUint16"],
  ["i32", "ReadInt32"],
  ["u32", "ReadUint32"],
  ["i64", "ReadInt64"],
  ["u64", "ReadUint64"],
  ["f32", "ReadFloat32"],
  ["f64", "ReadFloat64"],
  ["bytes", "ReadByteArray"],
]);

export const msgpackDecodeNillableFuncs = new Map<string, string>([
  ["ID", "ReadNillableString"],
  ["bool", "ReadNillableBool"],
  ["string", "ReadNillableString"],
  ["datetime", "ReadNillableTime"],
  ["i8", "ReadNillableInt8"],
  ["u8", "ReadNillableUint8"],
  ["i16", "ReadNillableInt16"],
  ["u16", "ReadNillableUint16"],
  ["i32", "ReadNillableInt32"],
  ["u32", "ReadNillableUint32"],
  ["i64", "ReadNillableInt64"],
  ["u64", "ReadNillableUint64"],
  ["f32", "ReadNillableFloat32"],
  ["f64", "ReadNillableFloat64"],
  ["bytes", "ReadNillableByteArray"],
]);

export const msgpackEncodeFuncs = new Map<string, string>([
  ["ID", "WriteString"],
  ["bool", "WriteBool"],
  ["string", "WriteString"],
  ["datetime", "WriteTime"],
  ["i8", "WriteInt8"],
  ["u8", "WriteUint8"],
  ["i16", "WriteInt16"],
  ["u16", "WriteUint16"],
  ["i32", "WriteInt32"],
  ["u32", "WriteUint32"],
  ["i64", "WriteInt64"],
  ["u64", "WriteUint64"],
  ["f32", "WriteFloat32"],
  ["f64", "WriteFloat64"],
  ["bytes", "WriteByteArray"],
]);

export const msgpackEncodeNillableFuncs = new Map<string, string>([
  ["ID", "WriteNillableString"],
  ["bool", "WriteNillableBool"],
  ["string", "WriteNillableString"],
  ["datetime", "WriteNillableTime"],
  ["i8", "WriteNillableInt8"],
  ["u8", "WriteNillableUint8"],
  ["i16", "WriteNillableInt16"],
  ["u16", "WriteNillableUint16"],
  ["i32", "WriteNillableInt32"],
  ["u32", "WriteNillableUint32"],
  ["i64", "WriteNillableInt64"],
  ["u64", "WriteNillableUint64"],
  ["f32", "WriteNillableFloat32"],
  ["f64", "WriteNillableFloat64"],
  ["bytes", "WriteNillableByteArray"],
]);

export const msgpackCastFuncs = new Map<string, string>([
  ["ID", "convert.String"],
  ["bool", "convert.Bool"],
  ["string", "convert.String"],
  ["i8", "convert.Numeric"],
  ["u8", "convert.Numeric.Numerict8"],
  ["i16", "convert.Numeric"],
  ["u16", "convert.Numeric"],
  ["i32", "convert.Numeric"],
  ["u32", "convert.Numeric"],
  ["i64", "convert.Numeric"],
  ["u64", "convert.Numeric"],
  ["f32", "convert.Numeric"],
  ["f64", "convert.Numeric"],
  ["bytes", "convert.ByteArray"],
]);

export const msgpackCastNillableFuncs = new Map<string, string>([
  ["ID", "convert.NillableString"],
  ["bool", "convert.NillableBool"],
  ["string", "convert.NillableString"],
  ["i8", "convert.NillableNumeric"],
  ["u8", "convert.NillableNumeric"],
  ["i16", "convert.NillableNumeric"],
  ["u16", "convert.NillableNumeric"],
  ["i32", "convert.NillableNumeric"],
  ["u32", "convert.NillableNumeric"],
  ["i64", "convert.NillableNumeric"],
  ["u64", "convert.NillableNumeric"],
  ["f32", "convert.NillableNumeric"],
  ["f64", "convert.NillableNumeric"],
  ["bytes", "convert.ByteArray"],
]);
