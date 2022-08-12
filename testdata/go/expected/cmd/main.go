package main

import (
	"context"
	"errors"
	"net"
	"os"

	"github.com/go-logr/zapr"
	"github.com/gofiber/fiber/v2"
	"github.com/oklog/run"
	"go.uber.org/zap"
	"google.golang.org/grpc"

	"github.com/apexlang/api-go/errorz"
	"github.com/apexlang/api-go/transport/tfiber"
	"github.com/apexlang/api-go/transport/tgrpc"

	"github.com/apexlang/outputtest/pkg/outputtest"
)

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

	// Create dependencies
	repositoryDep := outputtest.NewRepositoryImpl(log)

	// Create service components
	myServiceService := outputtest.NewMyServiceImpl(log, repositoryDep)

	var g run.Group
	// REST/HTTP
	{
		// Fiber app config with custom error handler
		config := fiber.Config{
			DisableStartupMessage: true,
			ErrorHandler: func(c *fiber.Ctx, err error) error {
				errz := errorz.From(err)
				return c.Status(errz.Status).JSON(errz)
			},
		}
		app := fiber.New(config)
		tfiber.Register(app, outputtest.MyServiceFiber(myServiceService))
		listenAddr := getEnv("HTTP_ADDRESS", ":3000")
		log.Info("HTTP server", "address", listenAddr)
		g.Add(func() error {
			return app.Listen(listenAddr)
		}, func(err error) {
			app.Shutdown()
		})
	}
	// gRPC
	{
		server := grpc.NewServer()
		tgrpc.Register(server, outputtest.MyServiceGRPC(myServiceService))
		listenAddr := getEnv("GRPC_ADDRESS", ":4000")
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
	}
	// Termination signals
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
