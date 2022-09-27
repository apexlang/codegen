import { Argument, BaseVisitor, Context } from "@apexlang/core/model";
import { camelCase, formatComment, pascalCase } from "../utils";
import { expandType } from "./helpers";

export class TypeVisitor extends BaseVisitor {
  visitTypeBefore(context: Context): void {
    const { type } = context;

    this.write(formatComment("/// ", type.description));
    this.write(`class ${pascalCase(type.name)}\n{\n`);

    super.visitTypesBefore(context);
  }

  visitTypeBefore_(context: Context): string {
    const {type} = context;
    return pascalCase(type.name);
  }

  visitTypeField(context: Context) {
    const { field } = context;
    const type = expandType(field.type);

    const range = field.annotation("range");
    const email = field.annotation("email");
    const notEmpty = field.annotation("notEmpty");

    if (range || email || notEmpty) {
      const name = camelCase(field.name);
      let propName = pascalCase(field.name);
      const typeVisit = this.visitTypeBefore_(context);
      if (propName === typeVisit) {
        propName = propName + "_";
      }

      this.write(`  private ${type} ${name};`);

      this.write(formatComment("  /// ", field.description));
      this.write(`  public ${type} ${propName}\n`);
      this.write("  {\n");
      this.write(`    get { return this.${name}; }\n`);
      this.write("    set {\n");

      if (email && type === "string") {
        this.write(
          '      if (!System.Text.RegularExpressions.Regex.IsMatch(value, @"^([\\w-\\.]+)@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.)|(([\\w-]+\\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\\]?)$")) {\n'
        );
        this.write(
          `        throw new ArgumentException("value must be an email address", "${propName}");\n`
        );
        this.write("      }\n");
      }

      if (range && type === "string") {
        const { min, max } = getRangeArguments(range.arguments);

        this.write("      if (");
        if (min) {
          this.write(`value.Length < ${min}`);
        }

        if (min && max) {
          this.write(" || ");
        }

        if (max) {
          this.write(`value.Length > ${max}`);
        }
        this.write(") {\n");
        this.write(
          `        throw new ArgumentException("value must be in range", "${propName}");\n`
        );
        this.write("      }\n");
      }

      this.write(`      this.${name} = value;\n`);
      this.write("    }\n");
      this.write("  }\n");
    } else {
      const typeVisit = this.visitTypeBefore_(context);
      let propName = pascalCase(field.name);
      if (propName === typeVisit) {
        propName = propName + "_";
      }
      this.write(formatComment("  /// ", field.description));
      this.write(`  public ${type} ${propName}`);
      this.write(" { get; set; }\n");
    }
  }

  visitTypeAfter(context: Context) {
    this.write("}\n");

    super.visitTypeAfter(context);
  }
}

function getRangeArguments(args: Argument[]): { min: any; max: any } {
  let obj = { min: undefined, max: undefined };
  for (const arg of args) {
    // @ts-ignore
    obj[arg.name] = arg.value.getValue();
  }

  return obj;
}
