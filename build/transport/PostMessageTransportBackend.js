"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var postis_1 = require("./postis");
var DEFAULT_POSTIS_OPTIONS = {
    window: window.opener || window.parent
};
var POSTIS_METHOD_NAME = 'message';
var PostMessageTransportBackend = (function () {
    function PostMessageTransportBackend(_a) {
        var _this = this;
        var postisOptions = (_a === void 0 ? {} : _a).postisOptions;
        this.postis = postis_1.default(__assign(__assign({}, DEFAULT_POSTIS_OPTIONS), postisOptions));
        this._receiveCallback = function () {
        };
        this.postis.listen(POSTIS_METHOD_NAME, function (message) { return _this._receiveCallback(message); });
    }
    PostMessageTransportBackend.prototype.dispose = function () {
        this.postis.destroy();
    };
    PostMessageTransportBackend.prototype.send = function (message) {
        this.postis.send({
            method: POSTIS_METHOD_NAME,
            params: message
        });
    };
    PostMessageTransportBackend.prototype.setReceiveCallback = function (callback) {
        this._receiveCallback = callback;
    };
    return PostMessageTransportBackend;
}());
exports.default = PostMessageTransportBackend;
//# sourceMappingURL=PostMessageTransportBackend.js.map