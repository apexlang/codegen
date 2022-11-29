install:
  npx pnpm -r install

build: install
  npx pnpm -r build

watch:
  npx pnpm -r watch

test:
  just unit
  just integration

unit:
  npx pnpm -r test:unit

integration:
  npx pnpm run --filter codegen test:snapshot

apex-install:
  just packages/codegen/apex-install

clean:
  rm -rf packages/*/node_modules
  rm -rf node_modules

