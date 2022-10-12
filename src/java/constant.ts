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

export const translations = new Map<string, string>([
  ["ID", "String"],
  ["string", "String"],
  ["bytes", "byte[]"],
  ["datetime", "LocalTime"],
  ["any", "Object"],
  ["raw", "Object"],
  ["i64", "long"],
  ["i32", "int"],
  ["i16", "short"],
  ["i8", "byte"],
  ["u64", "string"], // java doesn't support ulong like c#
  ["u32", "long"], // java doesn't support uint like c#
  ["u16", "int"], // java doesn't support ushort like c#
  ["u8", "int"],
  ["f64", "double"],
  ["f32", "float"],
]);