"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceAll = exports.isNumber = void 0;
function isNumber(value) {
    try {
        value = Number(value);
        return typeof value === 'number' && isFinite(value);
    }
    catch (error) {
        return false;
    }
}
exports.isNumber = isNumber;
function replaceAll(string, search, replace) {
    return string.split(search).join(replace);
}
exports.replaceAll = replaceAll;
