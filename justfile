install:
  npx pnpm -r install

build: install
  npx pnpm -r build

watch:
  npx pnpm -r watch

test:
  npx pnpm -r test

update-deps:
  npx pnpm -r exec npx npm-check-updates -u

apex-install:
  npx pnpm -r devbuild

clean:
  rm -rf packages/*/node_modules
  rm -rf node_modules

