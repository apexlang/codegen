import {BaseVisitor, Context} from "@apexlang/core/model";
import {convertType} from "../utils/types";

interface Config {
    package: string;
    filename: string;
    module: string;
    imports: string[];
}

export class ServiceVisitor extends BaseVisitor {
    visitInterfacesBefore(context: Context) {
        const config = context.config as Config;
        const packageName = config.package || "com.example.codegen.services";
        this.write(`package ${packageName}.services;\n\n`);
        this.write(`import com.example.codegen.models.MyType;\n`);
        this.write(`import com.example.codegen.models.MyOtherType;\n`);
        this.write(`import com.example.codegen.repositories.MyTypeRepository;\n`);
        this.write(`import java.util.*;\n`);
        this.write(`import java.io.*;\n`);
        this.write(`import java.lang.*;\n`);
        this.write(`import java.math.*;\n`);
        this.write(`import java.text.*;\n`);
        this.write(`import java.time.*;\n`);
        this.write(`import javax.persistence.*;\n`);
        this.write(`import org.springframework.beans.factory.annotation.Autowired;\n`);
        this.write(`import org.springframework.stereotype.Service;\n\n`);
        super.visitInterfacesBefore(context);
    }

    visitInterface(context: Context) {
        const {interface: iFace} = context;
        iFace.annotations.forEach((a) => {
            if (a.name === "service") {
                this.write(`@Service\n`);
                this.write(`public class ${iFace.name} {\n`);
                this.write(`\n`);
                this.write(`\t@Autowired\n`);
                this.write(`\tprivate Repository repository;\n`);
                this.write(`\n`);
                iFace.operations.forEach((o) => {
                    this.write(
                        `\t public ${convertType(o.type, context.config)} ${o.name}(`
                    );
                    o.parameters.forEach((p, i) => {
                        this.write(`${convertType(p.type, context.config)} ${p.name}`);
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