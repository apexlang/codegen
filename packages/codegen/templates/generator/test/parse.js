import { parse as parseApex } from "@apexlang/core";
import { Context } from "@apexlang/core/model";
export function parse(src) {
    const doc = parseApex(src);
    const context = new Context({}, doc);
    return context;
}
//# sourceMappingURL=parse.js.map