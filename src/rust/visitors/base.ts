import {
  AbstractVisitor,
  Alias,
  BaseVisitor,
  Context,
  Enum,
  Interface,
  Type,
  Union,
  Writer,
} from "../../deps/core/model.ts";

export type VisitorTypes = Alias | Type | Union | Enum | Interface;

export class SourceGenerator<T extends VisitorTypes> extends AbstractVisitor {
  root: T;
  context: Context;
  source = "";

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

export class ContextWriter extends BaseVisitor {
  source = "";

  constructor(writer: Writer) {
    super(writer);
  }

  append(source: string): void {
    this.source += source;
  }

  visitContextAfter(_context: Context): void {
    this.write(this.source);
  }
}
