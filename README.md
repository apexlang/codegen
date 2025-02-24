# Apex Code Generators

This library provides the built-in code generators for Apex.

## Installation

Make sure you have the Apex CLI installed. Here are
[the instructions](https://apexlang.io/docs/getting-started).

From your terminal, run:

```shell
apex install jsr:@apexlang/codegen/templates
```

```shell
INFO Installing @apexlang/basic...
INFO Installing @apexlang/generator...
INFO Installing @apexlang/go...
INFO Installing @apexlang/nodejs...
INFO Installing @apexlang/python...
```

Now you should see Apex project templates available.

```shell
apex list templates
```

```
┌──────────────────────┬────────────────────────────────────┐
│ Name                 │ Description                        │
└──────────────────────┴────────────────────────────────────┘
  @apexlang/basic        Basic Apex project                           
  @apexlang/generator    Apex code generator project                  
  @apexlang/go           Go API project                               
  @apexlang/nodejs       Apex NodeJS project                          
  @apexlang/python       Apex Python project  
```

If you load the project in VS Code (`code .` from the terminal if VS code is in
your path), a task will monitor the Apex interface definition for changes and
regenerate boilerplate code.
