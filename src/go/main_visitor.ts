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

import { Context, Writer } from "../../deps/@apexlang/core/model/mod.ts";
import { camelCase, InterfaceUsesVisitor, UsesVisitor } from "../utils/mod.ts";
import { IMPORTS } from "./constant.ts";
import { getImporter, getImports, GoVisitor } from "./go_visitor.ts";

interface Config {
  http: Listener;
  grpc: Listener;
  package: string;
  module: string;
  imports: string[];
}

interface Listener {
  enabled: boolean;
  defaultAddress: string;
  environmentKey: string;
}

export class MainVisitor extends GoVisitor {
  // Overridable visitor implementations
  usesVisitor = (writer: Writer): UsesVisitor =>
    new InterfaceUsesVisitor(writer);

  public override writeHead(context: Context): void {
    const prev = context.config.package;
    context.config.package = "main";
    context.config.doNotEdit = false;
    super.writeHead(context);
    context.config.package = prev;
  }

  public override visitNamespaceBefore(context: Context): void {
    const config = context.config as Config;
    const $ = getImporter(context, IMPORTS);
    const http = config.http || {};
    const grpc = config.grpc || {};

    if (http.enabled == undefined) {
      http.enabled = true;
    }
    http.defaultAddress = http.defaultAddress || ":3000";
    http.environmentKey = http.environmentKey || "HTTP_ADDRESS";

    if (grpc.enabled == undefined) {
      grpc.enabled = true;
    }
    grpc.defaultAddress = grpc.defaultAddress || ":4000";
    grpc.environmentKey = grpc.environmentKey || "GRPC_ADDRESS";

    const importer = getImports(context);

    config.package = config.package || "mypackage";
    config.module = config.module || "github.com/myorg/mymodule";

    // Import of main package
    importer.firstparty(`${config.module}/pkg/${config.package}`);

    const usesVisitor = this.usesVisitor(this.writer);
    context.namespace.accept(context, usesVisitor);

    this.write(`
func main() {
	ctx, cancel := ${$.context}.WithCancel(${$.context}.Background())
	defer cancel()

	// Initialize logger
	zapLog, err := ${$.zap}.NewDevelopment()
	if err != nil {
		panic(err)
	}
	log := ${$.zapr}.NewLogger(zapLog)

  // Connect to data sources

  // Create dependencies\n`);
    usesVisitor.dependencies.forEach((dependency) => {
      this.write(
        `${
          camelCase(dependency)
        }Dep := ${config.package}.New${dependency}(log)\n`,
      );
    });

    this.write(`\n\n// Create service components\n`);
    usesVisitor.services.forEach((dependencies, service) => {
      const deps = (dependencies.length > 0 ? ", " : "") +
        dependencies.map((d) => camelCase(d) + "Dep").join(", ");
      this.write(
        `${
          camelCase(service)
        }Service := ${config.package}.New${service}(log${deps})\n`,
      );
    });

    this.write(`\nvar g ${$.run}.Group\n`);
    if (http.enabled) {
      this.write(`// REST/HTTP
    {
      // Fiber app config with custom error handler
      config := ${$.fiber}.Config{
        DisableStartupMessage: true,
        ErrorHandler: tfiber.ErrorHandler,
      }
      app := ${$.fiber}.New(config)\n`);

      usesVisitor.services.forEach((_, service) => {
        this.write(
          `${$.tfiber}.Register(app, ${config.package}.${service}Fiber(${
            camelCase(
              service,
            )
          }Service))\n`,
        );
      });

      this
        .write(
          `listenAddr := getEnv("${http.environmentKey}", "${http.defaultAddress}")
      log.Info("HTTP server", "address", listenAddr)
      g.Add(func() error {
        return app.Listen(listenAddr)
      }, func(err error) {
        app.Shutdown()
      })
    }\n`,
        );
    }
    if (grpc.enabled) {
      this.write(`// gRPC
	{
		server := ${$.grpc}.NewServer()\n`);

      usesVisitor.services.forEach((_, service) => {
        this.write(
          `${$.tgrpc}.Register(server, ${config.package}.${service}GRPC(${
            camelCase(
              service,
            )
          }Service))\n`,
        );
      });

      this
        .write(
          `listenAddr := getEnv("${grpc.environmentKey}", "${grpc.defaultAddress}")
    log.Info("gRPC server", "address", listenAddr)
		g.Add(func() error {
			ln, err := ${$.net}.Listen("tcp", listenAddr)
			if err != nil {
				return err
			}
			return server.Serve(ln)
		}, func(err error) {
			server.GracefulStop()
		})
	}\n`,
        );
    }
    this.write(`// Termination signals
	{
		g.Add(${$.run}.SignalHandler(ctx, os.Interrupt, os.Kill))
	}

	var se ${$.run}.SignalError
	if err := g.Run(); err != nil && !${$.errors}.As(err, &se) {
		log.Error(err, "goroutine error")
		os.Exit(1)
	}
}

func getEnv(key string, defaultVal string) string {
	val, ok := ${$.os}.LookupEnv(key)
	if !ok {
		val = defaultVal
	}
	return val
}
`);
  }
}
