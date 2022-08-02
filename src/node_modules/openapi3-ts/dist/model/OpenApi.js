"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SpecificationExtension_1 = require("./SpecificationExtension");
function getExtension(obj, extensionName) {
    if (SpecificationExtension_1.SpecificationExtension.isValidExtension(extensionName)) {
        return obj[extensionName];
    }
    return undefined;
}
exports.getExtension = getExtension;
function addExtension(obj, extensionName, extension) {
    if (SpecificationExtension_1.SpecificationExtension.isValidExtension(extensionName)) {
        obj[extensionName] = extension;
    }
}
exports.addExtension = addExtension;
function getPath(pathsObject, path) {
    if (SpecificationExtension_1.SpecificationExtension.isValidExtension(path)) {
        return undefined;
    }
    return pathsObject[path];
}
exports.getPath = getPath;
function isReferenceObject(obj) {
    return Object.prototype.hasOwnProperty.call(obj, '$ref');
}
exports.isReferenceObject = isReferenceObject;
function isSchemaObject(schema) {
    return !Object.prototype.hasOwnProperty.call(schema, '$ref');
}
exports.isSchemaObject = isSchemaObject;
//# sourceMappingURL=OpenApi.js.map