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

import {
  Annotation,
  BaseVisitor,
  Context,
  Visitor,
  Writer,
} from "@apexlang/core/model";
import { camelCase, isProvider, isService } from "../utils";

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

export interface ComponentVisitor extends Visitor {
  services: Map<string, string[]>;
  dependencies: string[];
}

export class MainVisitor extends BaseVisitor {
  // Overridable visitor implementations
  roleVisitor = (writer: Writer): ComponentVisitor =>
    new RoleComponentVisitor(writer);

  visitNamespaceBefore(context: Context): void {
    const config = context.config as Config;
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

    config.package = config.package || "mypackage";
    config.module = config.module || "githib.com/myorg/mymodule";
    config.imports = config.imports || [];

    // Default import
    if (config.imports.length == 0) {
      config.imports.push(`${config.module}/pkg/${config.package}`);
    }

    const roleVisitor = this.roleVisitor(this.writer);
    context.namespace.accept(context, roleVisitor);

    this.write(`package main

import (
	"context"
	"errors"\n`);
    if (grpc.enabled) {
      this.write(`\t"net"\n`);
    }
    this.write(`\t"os"

	"github.com/go-logr/zapr"\n`);
    if (http.enabled) {
      this.write(`\t"github.com/gofiber/fiber/v2"\n`);
    }
    this.write(`\t"github.com/oklog/run"
	"go.uber.org/zap"\n`);
    if (grpc.enabled) {
      this.write(`\t"google.golang.org/grpc"\n`);
    }
    this.write(`\n`);
    if (http.enabled) {
      this.write(`\t"github.com/apexlang/api-go/errorz"
    "github.com/apexlang/api-go/transport/tfiber"\n`);
    }
    if (grpc.enabled) {
      this.write(`\t"github.com/apexlang/api-go/transport/tgrpc"\n`);
    }
    this.write(`\n`);

    config.imports.forEach((module) => this.write(`\t"${module}"\n`));

    this.write(`\n)

func main() {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// Initialize logger
	zapLog, err := zap.NewDevelopment()
	if err != nil {
		panic(err)
	}
	log := zapr.NewLogger(zapLog)

  // Connect to data sources

  // Create dependencies\n`);
    roleVisitor.dependencies.forEach((dependency) => {
      this.write(
        `${camelCase(dependency)}Dep := ${
          config.package
        }.New${dependency}Impl(log)\n`
      );
    });

    this.write(`\n\n// Create service components\n`);
    roleVisitor.services.forEach((dependencies, service) => {
      const deps =
        (dependencies.length > 0 ? ", " : "") +
        dependencies.map((d) => camelCase(d) + "Dep").join(", ");
      this.write(
        `${camelCase(service)}Service := ${
          config.package
        }.New${service}Impl(log${deps})\n`
      );
    });

    this.write(`\nvar g run.Group\n`);
    if (http.enabled) {
      this.write(`// REST/HTTP
    {
      // Fiber app config with custom error handler
      config := fiber.Config{
        DisableStartupMessage: true,
        ErrorHandler: func(c *fiber.Ctx, err error) error {
          errz := errorz.From(err)
          return c.Status(errz.Status).JSON(errz)
        },
      }
      app := fiber.New(config)\n`);

      roleVisitor.services.forEach((_, service) => {
        this.write(
          `tfiber.Register(app, ${config.package}.${service}Fiber(${camelCase(
            service
          )}Service))\n`
        );
      });

      this
        .write(`listenAddr := getEnv("${http.environmentKey}", "${http.defaultAddress}")
      log.Info("HTTP server", "address", listenAddr)
      g.Add(func() error {
        return app.Listen(listenAddr)
      }, func(err error) {
        app.Shutdown()
      })
    }\n`);
    }
    if (grpc.enabled) {
      this.write(`// gRPC
	{
		server := grpc.NewServer()\n`);

      roleVisitor.services.forEach((_, service) => {
        this.write(
          `tgrpc.Register(server, ${config.package}.${service}GRPC(${camelCase(
            service
          )}Service))\n`
        );
      });

      this
        .write(`listenAddr := getEnv("${grpc.environmentKey}", "${grpc.defaultAddress}")
    log.Info("gRPC server", "address", listenAddr)
		g.Add(func() error {
			ln, err := net.Listen("tcp", listenAddr)
			if err != nil {
				return err
			}
			return server.Serve(ln)
		}, func(err error) {
			server.GracefulStop()
		})
	}\n`);
    }
    this.write(`// Termination signals
	{
		g.Add(run.SignalHandler(ctx, os.Interrupt, os.Kill))
	}

	var se run.SignalError
	if err := g.Run(); err != nil && !errors.As(err, &se) {
		log.Error(err, "goroutine error")
		os.Exit(1)
	}
}

func getEnv(key string, defaultVal string) string {
	val, ok := os.LookupEnv(key)
	if !ok {
		val = defaultVal
	}
	return val
}
`);
  }
}

class RoleComponentVisitor extends BaseVisitor implements ComponentVisitor {
  services: Map<string, string[]> = new Map();
  dependencies: string[] = [];

  visitRole(context: Context): void {
    const { role } = context;
    if (isService(context)) {
      let dependencies: string[] = [];
      role.annotation("uses", (a: Annotation) => {
        if (a.arguments.length > 0) {
          dependencies = a.arguments[0].value.getValue() as string[];
        }
      });
      this.services.set(role.name, dependencies);
    }
    if (isProvider(context)) {
      this.dependencies.push(role.name);
    }
  }
}
