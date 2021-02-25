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
var browser_detection_1 = require("../browser-detection");
var BrowserCapabilities = (function () {
    function BrowserCapabilities(capabilitiesDB, isUsingIFrame, browserInfo) {
        if (capabilitiesDB === void 0) { capabilitiesDB = {}; }
        if (isUsingIFrame === void 0) { isUsingIFrame = false; }
        var browser = new browser_detection_1.BrowserDetection(browserInfo);
        var capabilitiesByVersion;
        if (typeof capabilitiesDB === 'object'
            && typeof browser.getVersion() === 'string') {
            var browserCapabilities = capabilitiesDB[browser.getName()] || [];
            for (var i = 0; i < browserCapabilities.length; i++) {
                var capabilities = browserCapabilities[i];
                if (typeof capabilities !== 'object') {
                    continue;
                }
                var version = capabilities.version;
                if (!version || !browser.isVersionGreaterThan(version)) {
                    capabilitiesByVersion = capabilities;
                    break;
                }
            }
        }
        if (!capabilitiesByVersion || !capabilitiesByVersion.capabilities) {
            this._capabilities = { isSupported: false };
        }
        else if (isUsingIFrame) {
            this._capabilities = __assign(__assign({}, capabilitiesByVersion.capabilities), capabilitiesByVersion.iframeCapabilities);
        }
        else {
            this._capabilities = capabilitiesByVersion.capabilities;
        }
        if (typeof this._capabilities.isSupported === 'undefined') {
            this._capabilities.isSupported = true;
        }
        else if (this._capabilities.isSupported === false) {
            this._capabilities = { isSupported: false };
        }
    }
    BrowserCapabilities.prototype.isSupported = function () {
        return this._capabilities.isSupported;
    };
    BrowserCapabilities.prototype.supportsAudioIn = function () {
        return this._capabilities.audioIn || false;
    };
    BrowserCapabilities.prototype.supportsAudioOut = function () {
        return this._capabilities.audioOut || false;
    };
    BrowserCapabilities.prototype.supportsScreenSharing = function () {
        return this._capabilities.screenSharing || false;
    };
    BrowserCapabilities.prototype.supportsVideoIn = function () {
        return this._capabilities.videoIn || false;
    };
    BrowserCapabilities.prototype.supportsVideoOut = function () {
        return this._capabilities.videoOut || false;
    };
    return BrowserCapabilities;
}());
exports.default = BrowserCapabilities;
//# sourceMappingURL=BrowserCapabilities.js.map