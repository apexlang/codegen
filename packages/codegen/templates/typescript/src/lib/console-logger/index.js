/* eslint-disable  */
import chalk from "chalk";
const getTimeStampString = () => new Date(Date.now()).toISOString();
export const STYLES = {
    ERROR: chalk.bold.red,
    WARN: chalk.keyword("orange"),
    INFO: chalk.hex("#c4c64f"),
    VERBOSE: chalk.hex("#6435c9"),
    DEBUG: chalk.hex("#2185d0"),
    SILLY: chalk.hex("#f011ce"),
};
export var LABELS;
(function (LABELS) {
    LABELS["ERROR"] = "ERROR";
    LABELS["WARN"] = "WARN";
    LABELS["INFO"] = "INFO";
    LABELS["VERBOSE"] = "VERBOSE";
    LABELS["DEBUG"] = "DEBUG";
    LABELS["SILLY"] = "SILLY";
})(LABELS || (LABELS = {}));
class ConsoleLogger {
    constructor() {
        this.log = (style, label, ...messages) => {
            const finalMessage = `[${getTimeStampString()}] [${label}]`;
            console.log(style(finalMessage, ...messages.map((item) => {
                if (item.stack) {
                    return "\n" + item.stack;
                }
                else if (item.message) {
                    return item.message;
                }
                return item;
            })));
        };
        this.error = (...messages) => this.log(STYLES.ERROR, LABELS.ERROR, ...messages);
        this.warn = (...messages) => this.log(STYLES.WARN, LABELS.WARN, ...messages);
        this.info = (...messages) => this.log(STYLES.INFO, LABELS.INFO, ...messages);
        this.verbose = (...messages) => this.log(STYLES.VERBOSE, LABELS.VERBOSE, ...messages);
        this.debug = (...messages) => this.log(STYLES.DEBUG, LABELS.DEBUG, ...messages);
        this.silly = (...messages) => this.log(STYLES.SILLY, LABELS.SILLY, ...messages);
    }
}
export default ConsoleLogger;
//# sourceMappingURL=index.js.map