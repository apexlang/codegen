package outputtest

import (
	"context"

	"github.com/go-logr/logr"
)

type RepositoryImpl struct {
	log logr.Logger
}

func NewRepository(log logr.Logger) *RepositoryImpl {
	return &RepositoryImpl{
		log: log,
	}
}

func (r *RepositoryImpl) GetData(ctx context.Context) (*MyType, error) {
	return &MyType{}, nil // TODO: Provide implementation.
}
