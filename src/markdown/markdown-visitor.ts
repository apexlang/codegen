import { BaseVisitor, type Context } from "@apexlang/core/model";
import { expandType } from "./helpers.ts";

export class MarkdownVisitor extends BaseVisitor {
  writeDescription(description?: string) {
    if (description) {
      this.writeLn(`${description.trim()}\n`);
    }
  }

  writeLn(line: string) {
    this.write(line + "\n");
  }

  writeHeader(header: string) {
    this.write(`\n## ${header}\n`);
  }

  writeDefinitionName(name: string) {
    this.writeLn(`\n### **${name}**\n`);
  }

  inlineDescription(desc?: string): string {
    return desc ? `: ${desc}` : "";
  }

  public override visitNamespace(context: Context): void {
    if (context.config.title) {
      this.writeLn(`# ${context.config.title}\n`);
      this.writeLn(`Namespace: **\`${context.namespace.name}\`**`);
    } else {
      this.writeLn(`# ${context.namespace.name}\n`);
    }
    this.writeDescription(context.namespace.description);
  }

  public override visitInterfacesBefore(_: Context): void {
    this.writeHeader("Interfaces");
  }

  public override visitInterface(context: Context): void {
    const node = context.interface;
    this.writeDefinitionName(node.name);
    this.writeDescription(node.description);
    for (const operation of node.operations) {
      const params = operation.parameters
        .map((p) => `${p.name}: ${expandType(p.type)}`)
        .join(", ");
      this.writeLn(
        `- **\`${operation.name}(${params}) -> ${
          expandType(
            operation.type,
          )
        }\`**${this.inlineDescription(operation.description)}`.trimEnd(),
      );
    }
  }

  public override visitTypesBefore(_: Context): void {
    this.writeHeader("Types");
  }

  public override visitType(context: Context): void {
    const typ = context.type;
    this.writeDefinitionName(typ.name);
    this.writeDescription(typ.description);
    for (const field of typ.fields) {
      this.writeLn(
        `- **\`${field.name}: ${
          expandType(
            field.type,
          )
        }\`** ${this.inlineDescription(field.description)}`.trimEnd(),
      );
    }
  }

  public override visitEnumsBefore(_: Context): void {
    this.writeHeader("Enums");
  }

  public override visitEnum(context: Context): void {
    const e = context.enum;
    this.writeDefinitionName(e.name);

    this.writeDescription(e.description);
    for (const value of e.values) {
      this.writeLn(`- ${value.name}${value.description || ""}`);
    }
  }

  public override visitAliasesBefore(_: Context): void {
    this.writeHeader("Aliases");
  }

  public override visitAlias(context: Context): void {
    const a = context.alias;
    this.writeDefinitionName(a.name);
    this.writeLn(`\`alias ${a.name} = ${expandType(a.type)}\``);
    this.writeDescription(a.description);
  }

  public override visitUnionsBefore(_: Context): void {
    this.writeHeader("Unions");
  }

  public override visitUnion(context: Context): void {
    const u = context.union;
    this.writeDefinitionName(u.name);
    this.writeLn(
      `\`${u.name} = ${
        u.members.map((m) => m.type).map(expandType).join(" | ")
      }\``,
    );
  }
}
