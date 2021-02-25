"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomInt = exports.randomHexString = exports.randomHexDigit = exports.randomElement = exports.randomAlphanumString = void 0;
var ALPHANUM = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
var HEX_DIGITS = '0123456789abcdef';
function randomAlphanumString(length) {
    return _randomString(length, ALPHANUM);
}
exports.randomAlphanumString = randomAlphanumString;
function randomElement(arr) {
    return arr[randomInt(0, arr.length - 1)];
}
exports.randomElement = randomElement;
function randomHexDigit() {
    return randomElement(HEX_DIGITS);
}
exports.randomHexDigit = randomHexDigit;
function randomHexString(length) {
    return _randomString(length, HEX_DIGITS);
}
exports.randomHexString = randomHexString;
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
exports.randomInt = randomInt;
function _randomString(length, characters) {
    var result = '';
    for (var i = 0; i < length; ++i) {
        result += randomElement(characters);
    }
    return result;
}
//# sourceMappingURL=randomUtil.js.map