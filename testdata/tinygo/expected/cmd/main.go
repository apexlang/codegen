package main

import (
	"github.com/apexlang/outputtest/pkg/outputtest"
)

func main() {
	// Create providers
	repositoryProvider := outputtest.NewRepository()

	// Create services
	myServiceService := outputtest.NewMyService(repositoryProvider)

	// Register services
	outputtest.RegisterMyService(myServiceService)
}
