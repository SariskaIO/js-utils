"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.urlObjectToString = exports.toURLString = exports.parseURIString = exports.parseStandardURIString = exports.getLocationContextRoot = exports.URI_PROTOCOL_PATTERN = void 0;
var _ROOM_EXCLUDE_PATTERN = '[\\:\\?#\\[\\]@!$&\'()*+,;=></"]';
var _URI_AUTHORITY_PATTERN = '(//[^/?#]+)';
var _URI_PATH_PATTERN = '([^?#]*)';
exports.URI_PROTOCOL_PATTERN = '^([a-z][a-z0-9\\.\\+-]*:)';
function _fixRoom(room) {
    return room
        ? room.replace(new RegExp(_ROOM_EXCLUDE_PATTERN, 'g'), '')
        : room;
}
function _fixURIStringScheme(uri) {
    var regex = new RegExp(exports.URI_PROTOCOL_PATTERN + "+", 'gi');
    var match = regex.exec(uri);
    if (match) {
        var protocol = match[match.length - 1].toLowerCase();
        if (protocol !== 'http:' && protocol !== 'https:') {
            protocol = 'https:';
        }
        uri = uri.substring(regex.lastIndex);
        if (uri.startsWith('//')) {
            uri = protocol + uri;
        }
    }
    return uri;
}
function getLocationContextRoot(_a) {
    var pathname = _a.pathname;
    var contextRootEndIndex = pathname.lastIndexOf('/');
    return (contextRootEndIndex === -1
        ? '/'
        : pathname.substring(0, contextRootEndIndex + 1));
}
exports.getLocationContextRoot = getLocationContextRoot;
function _objectToURLParamsArray(obj) {
    if (obj === void 0) { obj = {}; }
    var params = [];
    for (var key in obj) {
        try {
            params.push(key + "=" + encodeURIComponent(JSON.stringify(obj[key])));
        }
        catch (e) {
            console.warn("Error encoding " + key + ": " + e);
        }
    }
    return params;
}
function parseStandardURIString(str) {
    var obj = {
        toString: _standardURIToString
    };
    var regex;
    var match;
    str = str.replace(/\s/g, '');
    regex = new RegExp(exports.URI_PROTOCOL_PATTERN, 'gi');
    match = regex.exec(str);
    if (match) {
        obj.protocol = match[1].toLowerCase();
        str = str.substring(regex.lastIndex);
    }
    regex = new RegExp("^" + _URI_AUTHORITY_PATTERN, 'gi');
    match = regex.exec(str);
    if (match) {
        var authority = match[1].substring(2);
        str = str.substring(regex.lastIndex);
        var userinfoEndIndex = authority.indexOf('@');
        if (userinfoEndIndex !== -1) {
            authority = authority.substring(userinfoEndIndex + 1);
        }
        obj.host = authority;
        var portBeginIndex = authority.lastIndexOf(':');
        if (portBeginIndex !== -1) {
            obj.port = authority.substring(portBeginIndex + 1);
            authority = authority.substring(0, portBeginIndex);
        }
        obj.hostname = authority;
    }
    regex = new RegExp("^" + _URI_PATH_PATTERN, 'gi');
    match = regex.exec(str);
    var pathname;
    if (match) {
        pathname = match[1];
        str = str.substring(regex.lastIndex);
    }
    if (pathname) {
        pathname.startsWith('/') || (pathname = "/" + pathname);
    }
    else {
        pathname = '/';
    }
    obj.pathname = pathname;
    if (str.startsWith('?')) {
        var hashBeginIndex = str.indexOf('#', 1);
        if (hashBeginIndex === -1) {
            hashBeginIndex = str.length;
        }
        obj.search = str.substring(0, hashBeginIndex);
        str = str.substring(hashBeginIndex);
    }
    else {
        obj.search = '';
    }
    obj.hash = str.startsWith('#') ? str : '';
    return obj;
}
exports.parseStandardURIString = parseStandardURIString;
function parseURIString(uri) {
    if (typeof uri !== 'string') {
        return undefined;
    }
    var obj = parseStandardURIString(_fixURIStringScheme(uri));
    obj.contextRoot = getLocationContextRoot(obj);
    var pathname = obj.pathname;
    var contextRootEndIndex = pathname.lastIndexOf('/');
    var room = pathname.substring(contextRootEndIndex + 1) || undefined;
    if (room) {
        var fixedRoom = _fixRoom(room);
        if (fixedRoom !== room) {
            room = fixedRoom;
            obj.pathname
                = pathname.substring(0, contextRootEndIndex + 1) + (room || '');
        }
    }
    obj.room = room;
    return obj;
}
exports.parseURIString = parseURIString;
function _standardURIToString(thiz) {
    var _a = thiz || this, hash = _a.hash, host = _a.host, pathname = _a.pathname, protocol = _a.protocol, search = _a.search;
    var str = '';
    protocol && (str += protocol);
    host && (str += "//" + host);
    str += pathname || '/';
    search && (str += search);
    hash && (str += hash);
    return str;
}
function toURLString(obj) {
    var str;
    switch (typeof obj) {
        case 'object':
            if (obj) {
                if (obj instanceof URL) {
                    str = obj.href;
                }
                else {
                    str = urlObjectToString(obj);
                }
            }
            break;
        case 'string':
            str = String(obj);
            break;
    }
    return str;
}
exports.toURLString = toURLString;
function urlObjectToString(o) {
    var tmp;
    if (o.serverURL && o.room) {
        tmp = new URL(o.room, o.serverURL).toString();
    }
    else if (o.room) {
        tmp = o.room;
    }
    else {
        tmp = o.url || '';
    }
    var url = parseStandardURIString(_fixURIStringScheme(tmp));
    if (!url.protocol) {
        var protocol = o.protocol || o.scheme;
        if (protocol) {
            protocol.endsWith(':') || (protocol += ':');
            url.protocol = protocol;
        }
    }
    var pathname = url.pathname;
    if (!url.host) {
        var domain = o.domain || o.host || o.hostname;
        if (domain && o.appLinkScheme) {
            var _a = parseStandardURIString(_fixURIStringScheme(o.appLinkScheme + "//" + domain)), host = _a.host, hostname = _a.hostname, contextRoot = _a.pathname, port = _a.port;
            if (host) {
                url.host = host;
                url.hostname = hostname;
                url.port = port;
            }
            pathname === '/' && contextRoot !== '/' && (pathname = contextRoot);
        }
    }
    var room = o.roomName || o.room;
    if (room
        && (url.pathname.endsWith('/')
            || !url.pathname.endsWith("/" + room))) {
        pathname.endsWith('/') || (pathname += '/');
        pathname += room;
    }
    url.pathname = pathname;
    var jwt = o.jwt;
    if (jwt) {
        var search = url.search;
        if (search.indexOf('?jwt=') === -1 && search.indexOf('&jwt=') === -1) {
            search.startsWith('?') || (search = "?" + search);
            search.length === 1 || (search += '&');
            search += "jwt=" + jwt;
            url.search = search;
        }
    }
    var hash = url.hash;
    for (var _i = 0, _b = ['config', 'interfaceConfig', 'devices']; _i < _b.length; _i++) {
        var urlPrefix = _b[_i];
        var urlParamsArray = _objectToURLParamsArray(o[urlPrefix + "Overwrite"]
            || o[urlPrefix]
            || o[urlPrefix + "Override"]);
        if (urlParamsArray.length) {
            var urlParamsString = urlPrefix + "." + urlParamsArray.join("&" + urlPrefix + ".");
            if (hash.length) {
                urlParamsString = "&" + urlParamsString;
            }
            else {
                hash = '#';
            }
            hash += urlParamsString;
        }
    }
    url.hash = hash;
    return url.toString() || undefined;
}
exports.urlObjectToString = urlObjectToString;
//# sourceMappingURL=uri.js.map