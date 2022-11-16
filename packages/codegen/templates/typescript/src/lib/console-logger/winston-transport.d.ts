import Transport from "winston-transport";
export default class ConsoleLogTransport extends Transport {
    private logger;
    log(info: any, callback: {
        (): void;
    }): void;
}
//# sourceMappingURL=winston-transport.d.ts.map