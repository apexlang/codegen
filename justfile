install:
  npx pnpm -r install

build: install
  npx pnpm -r build

watch:
  npx pnpm -r watch

test:
  npx pnpm -r test

apex-install:
  just packages/codegen/apex-install

clean:
  rm -rf packages/*/node_modules
  rm -rf node_modules

