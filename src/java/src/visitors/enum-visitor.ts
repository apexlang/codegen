import { BaseVisitor, Context, Writer } from "@apexlang/core/model";

export class EnumVisitor extends BaseVisitor {
  constructor(writer: Writer) {
    super(writer);
  }

  visitEnumBefore(context: Context) {
    const { enum: enumNode } = context;
    enumNode.description && this.write(`// ${enumNode.description}\n`);
    super.visitEnumBefore(context);
  }

  visitEnum(context: Context) {
    const { enum: enumNode } = context;
    this.write(`public enum ${enumNode.name} {`);
    this.write(`\n`);
    super.visitEnum(context);
  }

  visitEnumValuesBefore(context: Context) {
    // const {enum: enumNode} = context;
    // enumNode.description && this.write(`// ${enumNode.description}\n`);
    const { enumValues } = context;
    enumValues.map((enumValue, index) => {
      if (index > 0) {
        enumValue.description && this.write(`,${enumValue.description}`);
      } else {
        enumValue.description && this.write(`\t // ${enumValue.description}`);
      }
    });
    this.write(`\n`);
    // enumValue.node.description?.getValue() && this.write(`// ${enumValue.node.description.getValue()}`);
    super.visitEnumValuesBefore(context);
  }

  visitEnumValue(context: Context) {
    const { enum: enumNode, enumValue, enumValues } = context;
    if (enumValues.length - 1 === enumValue.index) {
      this.write(`,\n`);
      this.write(`\t ${enumValue.name}(${enumValue.index});`);
      this.write(`\n`);
      this.write(`\n`);
      this.write(`\t private final int value;`);
      this.write(`\n`);
      this.write(`\t ${enumNode.name}(int value) {`);
      this.write(`\n`);
      this.write(`\t\t this.value = value;`);
      this.write(`\n`);
      this.write(`\t }`);
    } else if (enumValue.index > 0) {
      this.write(`,\n`);
      this.write(`\t ${enumValue.name}(${enumValue.index})`);
    } else {
      this.write(`\t ${enumValue.name}(${enumValue.index})`);
    }
    // this.write(`${enumValue.name} = ${enumValue.index} as "${enumValue.display}"`);
    super.visitEnumValue(context);
  }

  visitEnumAfter(context: Context) {
    this.write(`\n}`);
    super.visitEnumAfter(context);
  }
}
