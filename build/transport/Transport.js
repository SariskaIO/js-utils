"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = require("./constants");
var Transport = (function () {
    function Transport(_a) {
        var backend = (_a === void 0 ? {} : _a).backend;
        this._listeners = new Map();
        this._requestID = 0;
        this._responseHandlers = new Map();
        this._unprocessedMessages = new Set();
        this.addListener = this.on;
        if (backend) {
            this.setBackend(backend);
        }
    }
    Transport.prototype._disposeBackend = function () {
        if (this._backend) {
            this._backend.dispose();
            this._backend = null;
        }
    };
    Transport.prototype._onMessageReceived = function (message) {
        var _this = this;
        if (message.type === constants_1.MESSAGE_TYPE_RESPONSE) {
            var handler = this._responseHandlers.get(message.id);
            if (handler) {
                handler(message);
                this._responseHandlers.delete(message.id);
            }
        }
        else if (message.type === constants_1.MESSAGE_TYPE_REQUEST) {
            this.emit('request', message.data, function (result, error) {
                _this._backend.send({
                    type: constants_1.MESSAGE_TYPE_RESPONSE,
                    error: error,
                    id: message.id,
                    result: result
                });
            });
        }
        else {
            this.emit('event', message.data);
        }
    };
    Transport.prototype.dispose = function () {
        this._responseHandlers.clear();
        this._unprocessedMessages.clear();
        this.removeAllListeners();
        this._disposeBackend();
    };
    Transport.prototype.emit = function (eventName) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var listenersForEvent = this._listeners.get(eventName);
        var isProcessed = false;
        if (listenersForEvent && listenersForEvent.size) {
            listenersForEvent.forEach(function (listener) {
                isProcessed = listener.apply(void 0, args) || isProcessed;
            });
        }
        if (!isProcessed) {
            this._unprocessedMessages.add(args);
        }
        return isProcessed;
    };
    Transport.prototype.on = function (eventName, listener) {
        var _this = this;
        var listenersForEvent = this._listeners.get(eventName);
        if (!listenersForEvent) {
            listenersForEvent = new Set();
            this._listeners.set(eventName, listenersForEvent);
        }
        listenersForEvent.add(listener);
        this._unprocessedMessages.forEach(function (args) {
            if (listener.apply(void 0, args)) {
                _this._unprocessedMessages.delete(args);
            }
        });
        return this;
    };
    Transport.prototype.removeAllListeners = function (eventName) {
        if (eventName) {
            this._listeners.delete(eventName);
        }
        else {
            this._listeners.clear();
        }
        return this;
    };
    Transport.prototype.removeListener = function (eventName, listener) {
        var listenersForEvent = this._listeners.get(eventName);
        if (listenersForEvent) {
            listenersForEvent.delete(listener);
        }
        return this;
    };
    Transport.prototype.sendEvent = function (event) {
        if (event === void 0) { event = {}; }
        if (this._backend) {
            this._backend.send({
                type: constants_1.MESSAGE_TYPE_EVENT,
                data: event
            });
        }
    };
    Transport.prototype.sendRequest = function (request) {
        var _this = this;
        if (!this._backend) {
            return Promise.reject(new Error('No transport backend defined!'));
        }
        this._requestID++;
        var id = this._requestID;
        return new Promise(function (resolve, reject) {
            _this._responseHandlers.set(id, function (_a) {
                var error = _a.error, result = _a.result;
                if (typeof result !== 'undefined') {
                    resolve(result);
                }
                else if (typeof error !== 'undefined') {
                    reject(error);
                }
                else {
                    reject(new Error('Unexpected response format!'));
                }
            });
            _this._backend.send({
                type: constants_1.MESSAGE_TYPE_REQUEST,
                data: request,
                id: id
            });
        });
    };
    Transport.prototype.setBackend = function (backend) {
        this._disposeBackend();
        this._backend = backend;
        this._backend.setReceiveCallback(this._onMessageReceived.bind(this));
    };
    return Transport;
}());
exports.default = Transport;
//# sourceMappingURL=Transport.js.map