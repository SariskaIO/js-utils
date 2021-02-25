"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGravatarURL = void 0;
var js_md5_1 = require("js-md5");
function getGravatarURL(key, baseURL) {
    if (baseURL === void 0) { baseURL = 'https://seccdn.libravatar.org/avatar/'; }
    var urlSuffix = '?d=404&size=200';
    var avatarKey = isValidEmail(key) ? js_md5_1.default.hex(key.trim().toLowerCase()) : key;
    return "" + baseURL + avatarKey + urlSuffix;
}
exports.getGravatarURL = getGravatarURL;
function isValidEmail(email) {
    return email && email.indexOf('@') > 0;
}
//# sourceMappingURL=index.js.map