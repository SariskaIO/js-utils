"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bowser_1 = require("bowser");
var browsers_1 = require("./browsers");
var bowserNameToJitsiName = {
    'Chrome': browsers_1.CHROME,
    'Chromium': browsers_1.CHROME,
    'Opera': browsers_1.OPERA,
    'Firefox': browsers_1.FIREFOX,
    'Internet Explorer': browsers_1.INTERNET_EXPLORER,
    'Safari': browsers_1.SAFARI
};
function _detectChromiumBased() {
    var userAgent = navigator.userAgent;
    var browserInfo = {
        name: browsers_1.UNKNOWN,
        version: undefined
    };
    if (userAgent.match(/Chrome/) && !userAgent.match(/Edge/)) {
        if (userAgent.match(/Edg(A?)/)) {
            var version = userAgent.match(/Chrome\/([\d.]+)/)[1];
            if (Number.parseInt(version, 10) > 72) {
                browserInfo.name = browsers_1.CHROME;
                browserInfo.version = version;
            }
        }
        else {
            browserInfo.name = browsers_1.CHROME;
            browserInfo.version = userAgent.match(/Chrome\/([\d.]+)/)[1];
        }
    }
    return browserInfo;
}
function _detectElectron() {
    var userAgent = navigator.userAgent;
    if (userAgent.match(/Electron/)) {
        var version = userAgent.match(/Electron(?:\s|\/)([\d.]+)/)[1];
        return {
            name: browsers_1.ELECTRON,
            version: version
        };
    }
}
function _detectNWJS() {
    var userAgent = navigator.userAgent;
    if (userAgent.match(/JitsiMeetNW/)) {
        var version = userAgent.match(/JitsiMeetNW\/([\d.]+)/)[1];
        return {
            name: browsers_1.NWJS,
            version: version
        };
    }
}
function _detectReactNative() {
    var match = navigator.userAgent.match(/\b(react[ \t_-]*native)(?:\/(\S+))?/i);
    var version;
    if (match || navigator.product === 'ReactNative') {
        var name_1;
        if (match && match.length > 2) {
            name_1 = match[1];
            version = match[2];
        }
        name_1 || (name_1 = 'react-native');
        version || (version = 'unknown');
        return {
            name: browsers_1.REACT_NATIVE,
            version: version
        };
    }
}
function _detect(bowser) {
    var browserInfo;
    var detectors = [
        _detectReactNative,
        _detectElectron,
        _detectNWJS
    ];
    for (var i = 0; i < detectors.length; i++) {
        browserInfo = detectors[i]();
        if (browserInfo) {
            return browserInfo;
        }
    }
    var name = bowser.getBrowserName();
    if (name in bowserNameToJitsiName) {
        return {
            name: bowserNameToJitsiName[name],
            version: bowser.getBrowserVersion()
        };
    }
    browserInfo = _detectChromiumBased();
    if (browserInfo) {
        return browserInfo;
    }
    return {
        name: browsers_1.UNKNOWN,
        version: undefined
    };
}
var BrowserDetection = (function () {
    function BrowserDetection(browserInfo) {
        var name, version;
        this._bowser = bowser_1.default.getParser(navigator.userAgent);
        if (typeof browserInfo === 'undefined') {
            var detectedBrowserInfo = _detect(this._bowser);
            name = detectedBrowserInfo.name;
            version = detectedBrowserInfo.version;
        }
        else if (browserInfo.name in bowserNameToJitsiName) {
            name = bowserNameToJitsiName[browserInfo.name];
            version = browserInfo.version;
        }
        else {
            name = browsers_1.UNKNOWN;
            version = undefined;
        }
        this._name = name;
        this._version = version;
    }
    BrowserDetection.prototype.getName = function () {
        return this._name;
    };
    BrowserDetection.prototype.isChrome = function () {
        return this._name === browsers_1.CHROME;
    };
    BrowserDetection.prototype.isOpera = function () {
        return this._name === browsers_1.OPERA;
    };
    BrowserDetection.prototype.isFirefox = function () {
        return this._name === browsers_1.FIREFOX;
    };
    BrowserDetection.prototype.isIExplorer = function () {
        return this._name === browsers_1.INTERNET_EXPLORER;
    };
    BrowserDetection.prototype.isSafari = function () {
        return this._name === browsers_1.SAFARI;
    };
    BrowserDetection.prototype.isNWJS = function () {
        return this._name === browsers_1.NWJS;
    };
    BrowserDetection.prototype.isElectron = function () {
        return this._name === browsers_1.ELECTRON;
    };
    BrowserDetection.prototype.isReactNative = function () {
        return this._name === browsers_1.REACT_NATIVE;
    };
    BrowserDetection.prototype.getVersion = function () {
        return this._version;
    };
    BrowserDetection.prototype._checkCondition = function (checkTree) {
        if (this._version) {
            return this._bowser.satisfies(checkTree);
        }
    };
    BrowserDetection.prototype.isVersionGreaterThan = function (version) {
        var _a;
        return this._checkCondition((_a = {}, _a[this._name] = ">" + version, _a));
    };
    BrowserDetection.prototype.isVersionLessThan = function (version) {
        var _a;
        return this._checkCondition((_a = {}, _a[this._name] = "<" + version, _a));
    };
    BrowserDetection.prototype.isVersionEqualTo = function (version) {
        var _a;
        return this._checkCondition((_a = {}, _a[this._name] = "~" + version, _a));
    };
    return BrowserDetection;
}());
exports.default = BrowserDetection;
//# sourceMappingURL=BrowserDetection.js.map