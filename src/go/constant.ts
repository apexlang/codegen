/*
Copyright 2025 The Apex Authors.

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

export const translations: Map<string, string> = new Map<string, string>([
  ["ID", "string"],
  ["string", "string"],
  ["bytes", "[]byte"],
  ["i8", "int8"],
  ["i16", "int16"],
  ["i32", "int32"],
  ["i64", "int64"],
  ["u8", "uint8"],
  ["u16", "uint16"],
  ["u32", "uint32"],
  ["u64", "uint64"],
  ["f32", "float32"],
  ["f64", "float64"],
  ["datetime", "time.Time"],
  ["raw", "[]byte"],
]);

export const IMPORTS = {
  context: "context",
  embed: "embed",
  errors: "errors",
  json: "encoding/json",
  net: "net",
  os: "os",
  http: "net/http",
  fiber: "github.com/gofiber/fiber/v2",
  emptypb: "google.golang.org/protobuf/types/known/emptypb",
  timestamppb: "google.golang.org/protobuf/types/known/timestamppb",
  wrapperspb: "google.golang.org/protobuf/types/known/wrapperspb",
  grpc: "google.golang.org/grpc",
  convert: "github.com/apexlang/api-go/convert",
  errorz: "github.com/apexlang/api-go/errorz",
  httpresponse: "github.com/apexlang/api-go/transport/httpresponse",
  authorization: "github.com/apexlang/api-go/transport/authorization",
  tfiber: "github.com/apexlang/api-go/transport/tfiber",
  tgrpc: "github.com/apexlang/api-go/transport/tgrpc",
  thttp: "github.com/apexlang/api-go/transport/thttp",
  msgpack: "github.com/wapc/tinygo-msgpack",
  msgpackconvert: ["convert", "github.com/wapc/tinygo-msgpack/convert"],
  zap: "go.uber.org/zap",
  zapr: "github.com/go-logr/zapr",
  run: "github.com/oklog/run",
};
