import chalk from "chalk";
export declare const STYLES: {
    ERROR: chalk.Chalk;
    WARN: chalk.Chalk;
    INFO: chalk.Chalk;
    VERBOSE: chalk.Chalk;
    DEBUG: chalk.Chalk;
    SILLY: chalk.Chalk;
};
export declare enum LABELS {
    ERROR = "ERROR",
    WARN = "WARN",
    INFO = "INFO",
    VERBOSE = "VERBOSE",
    DEBUG = "DEBUG",
    SILLY = "SILLY"
}
declare class ConsoleLogger {
    log: (style: chalk.Chalk, label: LABELS | string, ...messages: any[]) => void;
    error: (...messages: any[]) => void;
    warn: (...messages: any[]) => void;
    info: (...messages: any[]) => void;
    verbose: (...messages: any[]) => void;
    debug: (...messages: any[]) => void;
    silly: (...messages: any[]) => void;
}
export default ConsoleLogger;
//# sourceMappingURL=index.d.ts.map