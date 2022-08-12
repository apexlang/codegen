package outputtest

import (
	"context"

	"github.com/go-logr/logr"
	"github.com/google/uuid"
)

type MyServiceImpl struct {
	log        logr.Logger
	repository Repository
}

func NewMyServiceImpl(log logr.Logger, repository Repository) *MyServiceImpl {
	return &MyServiceImpl{
		log:        log,
		repository: repository,
	}
}

func (s *MyServiceImpl) EmptyVoid(ctx context.Context) error {
	return nil // TODO: Provide implementation.
}

func (s *MyServiceImpl) UnaryType(ctx context.Context, value *MyType) (*MyType, error) {
	return &MyType{}, nil // TODO: Provide implementation.
}

func (s *MyServiceImpl) UnaryEnum(ctx context.Context, value MyEnum) (MyEnum, error) {
	return MyEnum(0), nil // TODO: Provide implementation.
}

func (s *MyServiceImpl) UnaryAlias(ctx context.Context, value uuid.UUID) (uuid.UUID, error) {
	return uuid.UUID{}, nil // TODO: Provide implementation.
}

func (s *MyServiceImpl) UnaryString(ctx context.Context, value string) (string, error) {
	return "", nil // TODO: Provide implementation.
}

func (s *MyServiceImpl) UnaryI64(ctx context.Context, value int64) (int64, error) {
	return 0, nil // TODO: Provide implementation.
}

func (s *MyServiceImpl) UnaryI32(ctx context.Context, value int32) (int32, error) {
	return 0, nil // TODO: Provide implementation.
}

func (s *MyServiceImpl) UnaryI16(ctx context.Context, value int16) (int16, error) {
	return 0, nil // TODO: Provide implementation.
}

func (s *MyServiceImpl) UnaryI8(ctx context.Context, value int8) (int8, error) {
	return 0, nil // TODO: Provide implementation.
}

func (s *MyServiceImpl) UnaryU64(ctx context.Context, value uint64) (uint64, error) {
	return 0, nil // TODO: Provide implementation.
}

func (s *MyServiceImpl) UnaryU32(ctx context.Context, value uint32) (uint32, error) {
	return 0, nil // TODO: Provide implementation.
}

func (s *MyServiceImpl) UnaryU16(ctx context.Context, value uint16) (uint16, error) {
	return 0, nil // TODO: Provide implementation.
}

func (s *MyServiceImpl) UnaryU8(ctx context.Context, value uint8) (uint8, error) {
	return 0, nil // TODO: Provide implementation.
}

func (s *MyServiceImpl) UnaryF64(ctx context.Context, value float64) (float64, error) {
	return 0, nil // TODO: Provide implementation.
}

func (s *MyServiceImpl) UnaryF32(ctx context.Context, value float32) (float32, error) {
	return 0, nil // TODO: Provide implementation.
}

func (s *MyServiceImpl) UnaryBytes(ctx context.Context, value []byte) ([]byte, error) {
	return []byte{}, nil // TODO: Provide implementation.
}

func (s *MyServiceImpl) FuncType(ctx context.Context, value *MyType, optional *MyType) (*MyType, error) {
	return &MyType{}, nil // TODO: Provide implementation.
}

func (s *MyServiceImpl) FuncEnum(ctx context.Context, value MyEnum, optional *MyEnum) (MyEnum, error) {
	return MyEnum(0), nil // TODO: Provide implementation.
}

func (s *MyServiceImpl) FuncAlias(ctx context.Context, value uuid.UUID, optional *uuid.UUID) (uuid.UUID, error) {
	return uuid.UUID{}, nil // TODO: Provide implementation.
}

func (s *MyServiceImpl) FuncString(ctx context.Context, value string, optional *string) (string, error) {
	return "", nil // TODO: Provide implementation.
}

func (s *MyServiceImpl) FuncI64(ctx context.Context, value int64, optional *int64) (int64, error) {
	return 0, nil // TODO: Provide implementation.
}

func (s *MyServiceImpl) FuncI32(ctx context.Context, value int32, optional *int32) (int32, error) {
	return 0, nil // TODO: Provide implementation.
}

func (s *MyServiceImpl) FuncI16(ctx context.Context, value int16, optional *int16) (int16, error) {
	return 0, nil // TODO: Provide implementation.
}

func (s *MyServiceImpl) FuncI8(ctx context.Context, value int8, optional *int8) (int8, error) {
	return 0, nil // TODO: Provide implementation.
}

func (s *MyServiceImpl) FuncU64(ctx context.Context, value uint64, optional *uint64) (uint64, error) {
	return 0, nil // TODO: Provide implementation.
}

func (s *MyServiceImpl) FuncU32(ctx context.Context, value uint32, optional *uint32) (uint32, error) {
	return 0, nil // TODO: Provide implementation.
}

func (s *MyServiceImpl) FuncU16(ctx context.Context, value uint16, optional *uint16) (uint16, error) {
	return 0, nil // TODO: Provide implementation.
}

func (s *MyServiceImpl) FuncU8(ctx context.Context, value uint8, optional *uint8) (uint8, error) {
	return 0, nil // TODO: Provide implementation.
}

func (s *MyServiceImpl) FuncF64(ctx context.Context, value float64, optional *float64) (float64, error) {
	return 0, nil // TODO: Provide implementation.
}

func (s *MyServiceImpl) FuncF32(ctx context.Context, value float32, optional *float32) (float32, error) {
	return 0, nil // TODO: Provide implementation.
}

func (s *MyServiceImpl) FuncBytes(ctx context.Context, value []byte, optional []byte) ([]byte, error) {
	return []byte{}, nil // TODO: Provide implementation.
}
