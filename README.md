# Apex Code Generators

This library provides the built-in code generators for Apex.

## Structure

- _./packages/codegen_: a utility package that re-exports every language-specific generator.
- _./packages/[language]_: language-specific generators.

## Local development

This repository includes a `justfile` to simplify running development tasks. Install `just` via the instructions [here](https://github.com/casey/just#installation) or view the contents of the `justfile` to learn how to run the commands manually.

### Install dependencies

```
just install
```

## Compile TypeScript

```
just build
```

## Run tests

```
just test
```
