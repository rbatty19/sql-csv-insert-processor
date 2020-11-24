"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNumber = void 0;
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
