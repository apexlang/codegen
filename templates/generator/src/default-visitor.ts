import { BaseVisitor, Context, Writer } from "@apexlang/core/model";
import { TypeVisitor } from "./visitors/type-visitor.js";
import { InterfaceVisitor } from "./visitors/interface-visitor.js";
import { EnumVisitor } from "./visitors/enum-visitor.js";
import { UnionVisitor } from "./visitors/union-visitor.js";
import { AliasVisitor } from "./visitors/alias-visitor.js";
import { convertOperation } from "./utils/conversions.js";

export class DefaultVisitor extends BaseVisitor {
  /* ************************************************************************ *
   *  Override the BaseVisitor's visitXxxx methods to add custom logic        *
   *  that runs each time your class visit's a node in the Apex schema.       *
   *                                                                          *
   *  Every visitor has corresponding visitXxxxBefore() and visitXxxxAfter()  *
   *  methods that run before and after a visit.                              *
   * ************************************************************************ */

  // .visitContextBefore() runs at the start of execution.
  visitContextBefore(context: Context): void {
    // Add a generated header to your source by
    // uncommenting the following lines:
    /*
    this.write(
      utils.generatedHeader(
        context.config.generatedHeader || [
          "THIS FILE IS GENERATED, DO NOT EDIT",
          "",
          `See https://apexlang.io for more information`,
        ]
      )
    );
    */

    /*
      If a "header" option exists in the configuration, add it to the
      generated output. Useful for license or contact information.
    */
    if (context.config.header) {
      if (Array.isArray(context.config.header)) {
        // If it's an array, join each line with a newline.
        this.write(context.config.header.join("\n"));
      } else {
        // Otherwise add it directly.
        this.write(context.config.header);
      }
    }
  }

  visitContextAfter(context: Context): void {
    /*
      If a "footer" option exists in the configuration, add it to the
      generated output.
    */
    if (context.config.footer) {
      if (Array.isArray(context.config.footer)) {
        this.write(context.config.footer.join("\n"));
      } else {
        this.write(context.config.footer);
      }
    }
  }

  visitNamespace(context: Context): void {
    const { namespace } = context;

    // The name of the namespace from the Apex schema.
    const name = namespace.name;

    // Use `.write()` to write to the destination buffer.
    this.write(``);
  }

  visitType(context: Context): void {
    this.write(new TypeVisitor(context).buffer());
  }

  visitInterface(context: Context): void {
    this.write(new InterfaceVisitor(context).buffer());
  }

  visitEnum(context: Context): void {
    this.write(new EnumVisitor(context).buffer());
  }

  visitUnion(context: Context): void {
    this.write(new UnionVisitor(context).buffer());
  }

  visitFunction(context: Context): void {
    this.write(convertOperation(context.operation, true, context.config));
  }

  visitAlias(context: Context): void {
    this.write(new AliasVisitor(context).buffer());
  }
}
