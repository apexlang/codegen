// Code generated by @apexlang/codegen. DO NOT EDIT.

using System;
using Microsoft.AspNetCore.Builder;

namespace Urlshortener {

  public class Setup {
    public Setup(WebApplication app, Shortener service) {
      app.MapPut("/v1/shorten", (string url) => service.Shorten(url));
      app.MapGet("/v1/lookup", (string id) => service.Lookup(id));
    }
  }
}
