build:
  npx pnpm --filter codegen codegen
  # necessary install/build weirdness due to the generated files in @apexlang/codegen
  npx pnpm -r --filter !codegen install
  npx pnpm -r --filter !codegen build
  npx pnpm install
  npx pnpm -r --filter codegen build

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
  rm -rf packages/*/dist
  rm -rf node_modules

