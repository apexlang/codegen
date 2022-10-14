import { BaseVisitor, Context } from "@apexlang/core/model";
import { convertType } from "../utils/types";

export class InterfaceVisitor extends BaseVisitor {
  visitInterfacesBefore(context: Context) {
    this.write(`\n`);
    super.visitInterfacesBefore(context);
  }

  visitInterface(context: Context) {
    const { interface: iFace } = context;
    iFace.annotations.forEach((a) => {
      if (a.name === "service") {
        this.write(`interface ${iFace.name} {`);
        this.write(`\n`);
        iFace.operations.forEach((o) => {
          this.write(`\t ${convertType(o.type, context.config)} ${o.name}(`);
          o.parameters.forEach((p, i) => {
            this.write(`${convertType(p.type, context.config)} ${p.name}`);
            if (i !== o.parameters.length - 1) {
              this.write(`, `);
            }
          });
          this.write(`)`);
          this.write(` throws Exception;`);
          this.write(`\n`);
        });
        this.write(`}`);
      }

      if (a.name === "dependency") {
        this.write(`interface ${iFace.name} {`);
        this.write(`\n`);
        iFace.operations.forEach((o) => {
          this.write(`\t ${convertType(o.type, context.config)} ${o.name}(`);
          o.parameters.forEach((p, i) => {
            this.write(`${p.name} ${convertType(p.type, context.config)}`);
            if (i !== o.parameters.length - 1) {
              this.write(`, `);
            }
          });
          this.write(`)`);
          this.write(` throws Exception;`);
          this.write(`\n`);
        });
        this.write(`}`);
      }
    });
    super.visitInterface(context);
  }

  visitOperation(context: Context) {
    // const {operation} = context;
    // this.write(`${operation.name}(${operation.parameters.map(p => `${p.name}:${p.type}`).join(", ")}): ${operation.type}`);
    super.visitOperation(context);
  }

  visitInterfaceAfter(context: Context) {
    this.write(`\n`);
    this.write(`\n`);
    super.visitInterfaceAfter(context);
  }
}
