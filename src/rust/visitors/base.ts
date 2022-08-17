import {
  AbstractVisitor,
  Alias,
  BaseVisitor,
  Context,
  Enum,
  Type,
  Union,
  Writer,
  Role,
  Interface,
} from "@apexlang/core/model";

export type VisitorTypes = Alias | Type | Union | Enum | Role | Interface;

export class SourceGenerator<T extends VisitorTypes> extends AbstractVisitor {
  root: T;
  context: Context;
  source: string = "";

  constructor(root: T, context: Context) {
    super();
    this.root = root;
    this.context = context;
  }

  append(source: string): void {
    this.source += source;
  }

  getSource(): string {
    return this.source;
  }

  toString(): string {
    this.root.accept(this.context, this);
    return this.getSource();
  }
}

export class NamespaceWriter extends BaseVisitor {
  source: string = "";

  constructor(writer: Writer) {
    super(writer);
  }

  append(source: string): void {
    this.source += source;
  }

  visitNamespaceAfter(context: Context): void {
    this.write(this.source);
  }
}
