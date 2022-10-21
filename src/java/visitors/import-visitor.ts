import { BaseVisitor, Context } from "@apexlang/core/model";

export class ImportVisitor extends BaseVisitor {
  visitNamespaceBefore(context: Context) {
    this.write(`import java.util.*;`);
    this.write(`\n`);
    this.write(`import java.io.*;`);
    this.write(`\n`);
    this.write(`import java.lang.*;`);
    this.write(`\n`);
    this.write(`import java.math.*;`);
    this.write(`\n`);
    this.write(`import java.text.*;`);
    this.write(`\n`);
    this.write(`import java.time.*;`);
    this.write(`\n`);
    this.write(`\n`);
    this.write(`public class Main {`);
    this.write(`\n`);
    this.write(`\n`);

    // const packageName = context.namespace.name
    //   .split(".")
    //   .map((n, i) => {
    //     if (i === 0) {
    //       return n;
    //     }
    //     return pascalCase(n);
    //   })
    //   .join("");
    // this.write(`package ${camelCase(packageName)};`);
    // this.write(`\n`);
    // this.write(`\n`);
    super.visitNamespaceBefore(context);
  }

  // visitNamespaceAfter(context: Context) {
  //     this.write(`\n`);
  //     this.write(`\n`);
  //     this.write(`}`);
  //     super.visitNamespaceAfter(context);
  // }
}
