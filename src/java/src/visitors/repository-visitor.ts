import {BaseVisitor, Context} from "@apexlang/core/model";
import {convertType} from "../utils/types";

interface Config {
    package: string;
    filename: string;
    module: string;
    imports: string[];
}

export class RepositoryVisitor extends BaseVisitor {
    visitInterfacesBefore(context: Context) {
        const config = context.config as Config;
        const packageName = config.package || "com.example";
        config.filename = "Repository.java";
        this.write(`package ${packageName}.repositories;\n\n`);
        this.write(`import org.springframework.data.repository.CrudRepository;\n`);
        this.write(`import com.example.codegen.models.MyType;\n\n`);
        super.visitInterfacesBefore(context);
    }

    visitInterface(context: Context) {
        const { interface: iFace } = context;
        iFace.annotations.forEach((a) => {
            if (a.name === "dependency") {
                this.write(`public interface ${iFace.name} extends CrudRepository<MyType, Long> {\n\n`);
                iFace.operations.forEach((o) => {
                    this.write(
                        `\t public ${convertType(o.type, context.config)} ${o.name}(`
                    );
                    o.parameters.forEach((p, i) => {
                        this.write(`${p.name} ${convertType(p.type, context.config)}`);
                        if (i !== o.parameters.length - 1) {
                            this.write(`, `);
                        }
                    });
                    this.write(`)`);
                    this.write(`{`);
                    this.write(`\n`);
                    this.write(`\t\t`);
                    if (o.parameters.length > 0) {
                        this.write(`return ${o.parameters[0].name};`);
                    } else if (
                        iFace.operations.length > 0 &&
                        convertType(o.type, context.config) !== "void"
                    ) {
                        this.write(`return null;`);
                    } else {
                        this.write(`return;`);
                    }
                    this.write(`\n`);
                    this.write(`\t }`);
                    this.write(`\n`);
                    this.write(`\n`);
                });
                this.write(`}`);
            }
        });
        super.visitInterface(context);
    }
}