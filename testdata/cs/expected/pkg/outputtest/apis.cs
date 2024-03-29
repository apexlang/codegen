// Code generated by @apexlang/codegen. DO NOT EDIT.

using System;
using Microsoft.AspNetCore.Builder;

namespace Apex.Testing
{
	public class Setup
	{
		public Setup(WebApplication app, MyService service)
		{
			app.MapGet("/v1", () => service.EmptyVoid());
			app.MapPost("/v1/unaryType", (MyType value) => service.UnaryType(value));
			app.MapPost("/v1/unaryEnum", (MyEnum value) => service.UnaryEnum(value));
			app.MapPost("/v1/unaryAlias", (Uuid value) => service.UnaryAlias(value));
			app.MapPost("/v1/unaryString", (string value) => service.UnaryString(value));
			app.MapPost("/v1/unaryI64", (long value) => service.UnaryI64(value));
			app.MapPost("/v1/unaryI32", (int value) => service.UnaryI32(value));
			app.MapPost("/v1/unaryI16", (short value) => service.UnaryI16(value));
			app.MapPost("/v1/unaryI8", (sbyte value) => service.UnaryI8(value));
			app.MapPost("/v1/unaryU64", (ulong value) => service.UnaryU64(value));
			app.MapPost("/v1/unaryU32", (uint value) => service.UnaryU32(value));
			app.MapPost("/v1/unaryU16", (ushort value) => service.UnaryU16(value));
			app.MapPost("/v1/unaryU8", (byte value) => service.UnaryU8(value));
			app.MapPost("/v1/unaryF64", (double value) => service.UnaryF64(value));
			app.MapPost("/v1/unaryF32", (float value) => service.UnaryF32(value));
			app.MapPost("/v1/unaryBytes", (byte[] value) => service.UnaryBytes(value));
			app.MapPost("/v1/funcType", (MyType value, MyType? optional) => service.FuncType(value, optional));
			app.MapPost("/v1/funcEnum", (MyEnum value, MyEnum? optional) => service.FuncEnum(value, optional));
			app.MapPost("/v1/funcEnum", (Uuid value, Uuid? optional) => service.FuncAlias(value, optional));
			app.MapPost("/v1/funcString", (string value, string? optional) => service.FuncString(value, optional));
			app.MapPost("/v1/funcI64", (long value, long? optional) => service.FuncI64(value, optional));
			app.MapPost("/v1/funcI32", (int value, int? optional) => service.FuncI32(value, optional));
			app.MapPost("/v1/funcI16", (short value, short? optional) => service.FuncI16(value, optional));
			app.MapPost("/v1/funcI8", (sbyte value, sbyte? optional) => service.FuncI8(value, optional));
			app.MapPost("/v1/funcU64", (ulong value, ulong? optional) => service.FuncU64(value, optional));
			app.MapPost("/v1/funcU32", (uint value, uint? optional) => service.FuncU32(value, optional));
			app.MapPost("/v1/funcU16", (ushort value, ushort? optional) => service.FuncU16(value, optional));
			app.MapPost("/v1/funcU8", (byte value, byte? optional) => service.FuncU8(value, optional));
			app.MapPost("/v1/funcF64", (double value, double? optional) => service.FuncF64(value, optional));
			app.MapPost("/v1/funcF32", (float value, float? optional) => service.FuncF32(value, optional));
			app.MapPost("/v1/funcBytes", (byte[] value, byte[]? optional) => service.FuncBytes(value, optional));
		}
	}
}
