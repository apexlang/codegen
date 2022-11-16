import Transport from "winston-transport";
import ConsoleLogger, { STYLES } from "./index";
const levelStyleMap = {
    error: STYLES.ERROR,
    warn: STYLES.WARN,
    info: STYLES.INFO,
    verbose: STYLES.VERBOSE,
    debug: STYLES.DEBUG,
    silly: STYLES.SILLY,
};
export default class ConsoleLogTransport extends Transport {
    constructor() {
        super(...arguments);
        this.logger = new ConsoleLogger();
    }
    log(info, callback) {
        const style = levelStyleMap[info.level] || STYLES.DEBUG;
        const label = info.consoleLoggerOptions?.label || info.level.toUpperCase();
        const messages = [info.message];
        if (info.error) {
            messages.push(info.error);
        }
        this.logger.log(style, label, ...messages);
        callback();
    }
}
//# sourceMappingURL=winston-transport.js.map