import {BaseVisitor, Context} from "@apexlang/core/model";

interface Config {
    package: string;
    filename: string;
    module: string;
    imports: string[];
}

export class MainVisitor extends BaseVisitor {
    visitNamespaceBefore(context: Context) {
        const config = context.config as Config;
        const packageName = config.package || "com.example";
        const filename = config.filename || "Application";
        this.write(`package ${packageName};\n\n`);
        this.write(`import org.springframework.boot.SpringApplication;\n`);
        this.write(`import org.springframework.boot.autoconfigure.SpringBootApplication;\n\n`);
        this.write(`@SpringBootApplication\n`);
        this.write(`public class ${filename} {\n\n`);
        super.visitNamespaceBefore(context);
    }

    visitNamespace(context: Context) {
        const config = context.config as Config;
        const filename = config.filename || "MyApplication";
        this.write(`\tpublic static void main(String[] args) {\n`);
        this.write(`\t\tSpringApplication.run(${filename}.class, args);\n`);
        this.write(`\t}\n\n`);
    }

    visitNamespaceAfter(context: Context) {
        this.write(`}\n`);
        super.visitNamespaceAfter(context);
    }
}
