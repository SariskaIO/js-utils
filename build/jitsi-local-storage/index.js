"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.jitsiLocalStorage = void 0;
var events_1 = require("events");
var DummyLocalStorage = (function (_super) {
    __extends(DummyLocalStorage, _super);
    function DummyLocalStorage() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._storage = {};
        return _this;
    }
    DummyLocalStorage.prototype.clear = function () {
        this._storage = {};
    };
    Object.defineProperty(DummyLocalStorage.prototype, "length", {
        get: function () {
            return Object.keys(this._storage).length;
        },
        enumerable: false,
        configurable: true
    });
    DummyLocalStorage.prototype.getItem = function (keyName) {
        return this._storage[keyName];
    };
    DummyLocalStorage.prototype.setItem = function (keyName, keyValue) {
        this._storage[keyName] = keyValue;
    };
    DummyLocalStorage.prototype.removeItem = function (keyName) {
        delete this._storage[keyName];
    };
    DummyLocalStorage.prototype.key = function (n) {
        var keys = Object.keys(this._storage);
        if (keys.length <= n) {
            return undefined;
        }
        return keys[n];
    };
    DummyLocalStorage.prototype.serialize = function () {
        return JSON.stringify(this._storage);
    };
    return DummyLocalStorage;
}(events_1.default));
var JitsiLocalStorage = (function (_super) {
    __extends(JitsiLocalStorage, _super);
    function JitsiLocalStorage() {
        var _this = _super.call(this) || this;
        try {
            _this._storage = window.localStorage;
            _this._localStorageDisabled = false;
        }
        catch (ignore) {
        }
        if (!_this._storage) {
            console.warn('Local storage is disabled.');
            _this._storage = new DummyLocalStorage();
            _this._localStorageDisabled = true;
        }
        return _this;
    }
    JitsiLocalStorage.prototype.isLocalStorageDisabled = function () {
        return this._localStorageDisabled;
    };
    JitsiLocalStorage.prototype.clear = function () {
        this._storage.clear();
        this.emit('changed');
    };
    Object.defineProperty(JitsiLocalStorage.prototype, "length", {
        get: function () {
            return this._storage.length;
        },
        enumerable: false,
        configurable: true
    });
    JitsiLocalStorage.prototype.getItem = function (keyName) {
        return this._storage.getItem(keyName);
    };
    JitsiLocalStorage.prototype.setItem = function (keyName, keyValue, dontEmitChangedEvent) {
        if (dontEmitChangedEvent === void 0) { dontEmitChangedEvent = false; }
        this._storage.setItem(keyName, keyValue);
        if (!dontEmitChangedEvent) {
            this.emit('changed');
        }
    };
    JitsiLocalStorage.prototype.removeItem = function (keyName) {
        this._storage.removeItem(keyName);
        this.emit('changed');
    };
    JitsiLocalStorage.prototype.key = function (i) {
        return this._storage.key(i);
    };
    JitsiLocalStorage.prototype.serialize = function () {
        if (this.isLocalStorageDisabled()) {
            return this._storage.serialize();
        }
        var length = this._storage.length;
        var localStorageContent = {};
        for (var i = 0; i < length; i++) {
            var key = this._storage.key(i);
            localStorageContent[key] = this._storage.getItem(key);
        }
        return JSON.stringify(localStorageContent);
    };
    return JitsiLocalStorage;
}(events_1.default));
exports.jitsiLocalStorage = new JitsiLocalStorage();
//# sourceMappingURL=index.js.map