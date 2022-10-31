import {BaseVisitor, Context} from "@apexlang/core/model";
import {convertType} from "../utils/types";
import {PathDirective} from "../../../rest";

interface Config {
    package: string;
    filename: string;
    module: string;
    imports: string[];
}

export class ControllerVisitor extends BaseVisitor {
    visitInterfacesBefore(context: Context) {
        const config = context.config as Config;
        const packageName = config.package || "com.example.codegen.controllers";
        this.write(`package ${packageName}.controllers;\n\n`);
        this.write(`import com.example.codegen.models.MyType;\n`);
        this.write(`import com.example.codegen.repositories.MyRepository;\n`);
        this.write(`import com.example.codegen.services.MyTypeService;\n`);
        this.write(`import org.springframework.beans.factory.annotation.Autowired;\n`);
        this.write(`import org.springframework.web.bind.annotation.*;\n`);
        this.write(`\n`);
        super.visitInterfacesBefore(context);
    }

    visitInterface(context: Context) {
        const {interface: iFace} = context;
        iFace.annotations.forEach((a) => {
            if (a.name === "service") {
                this.write(`@RestController\n`);
                let path = "";
                context.namespace.annotation("path", (a) => {
                    path = a?.convert<PathDirective>().value;
                });
                this.write(`@RequestMapping("${path}") produces = "application/json")\n`);
                this.write(`public class ${iFace.name} {\n`);
                this.write(`\n`);
                this.write(`\t@Autowired\n`);
                this.write(`\tprivate Service service;\n`);
                this.write(`\n`);
                iFace.operations.forEach((o) => {
                    o.annotations.forEach((a) => {
                        if (a.name === "GET") {
                            this.write(
                                `\t @RequestMapping(value = "/${o.name}", method = RequestMethod.GET)\n`
                            );
                        } else if (a.name === "POST") {
                            this.write(
                                `\t @RequestMapping(value = "/${o.name}", method = RequestMethod.POST)\n`
                            );
                        } else if (a.name === "PUT") {
                            this.write(
                                `\t @RequestMapping(value = "/${o.name}", method = RequestMethod.PUT)\n`
                            );
                        } else if (a.name === "DELETE") {
                            this.write(
                                `\t @RequestMapping(value = "/${o.name}", method = RequestMethod.DELETE)\n`
                            );
                        }
                    })
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
                        this.write(`return service.${o.name}(`);
                        this.write(`${o.parameters[0].name};`);
                        this.write(`);`);
                    } else {
                        this.write(`return service.${o.name}();`);
                    }
                    this.write(`\n`);
                    this.write(`\t}`);
                    this.write(`\n\n`);
                });

                this.write(`\n`);
                this.write(`}`);
            }
        });
        super.visitInterface(context);
    }
}