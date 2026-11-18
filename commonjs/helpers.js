/*!
 * https://github.com/Starcounter-Jack/JSON-Patch
 * (c) 2017-2022 Joachim Wester
 * MIT licensed
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Efetua teste de identidade e de igualdade (equals) de forma bilateral. <br>
 * Nem sempre id1.equals(id2) será igual a id2.equals(id1) <br>
 * ex.: '123'.equals(Bson.ObjectId('123')) => false <br>
 * ex.: Bson.ObjectId('123').equals('123') => true <br>
 * isEquals() resolve essa questão.
 */
function isEquals(id1, id2) {
    if ((id1 === 0 && id2 === '') || id2 === 0 && id1 === '') { // required to take the test 'should replace 0 with empty string' pass
        return false;
    }
    if (id1 == id2) {
        return true;
    }
    if (id1 == null || id2 == null) {
        return false;
    }
    if (typeof id1 === 'object' && typeof id1.equals === 'function') {
        if (id1.equals(id2)) {
            return true;
        }
    }
    if (typeof id2 === 'object' && typeof id2.equals === 'function') {
        if (id2.equals(id1)) {
            return true;
        }
    }
    return false;
}
exports.isEquals = isEquals;
/**
 * Compares two document values when generating a diff. <br>
 * Unlike isEquals(), it does not use loose equality: 1 and '1', false and 0, '' and false are different values. <br>
 * null and undefined are equivalent, and an object exposing equals() (e.g. ObjectId) can match its serialized form.
 */
function isSameValue(a, b) {
    if (a === b) {
        return true;
    }
    if (a == null || b == null) {
        return a == null && b == null;
    }
    if (typeof a === 'object' && typeof a.equals === 'function') {
        if (a.equals(b)) {
            return true;
        }
    }
    if (typeof b === 'object' && typeof b.equals === 'function') {
        if (b.equals(a)) {
            return true;
        }
    }
    return a !== a && b !== b; // NaN
}
exports.isSameValue = isSameValue;
function hasSamePropertyValue(obj1, obj2, propertyName) {
    if (obj1 == null || obj2 == null || !propertyName) {
        return false;
    }
    var id1 = obj1[propertyName];
    var id2 = obj2[propertyName];
    return isEquals(id1, id2);
}
exports.hasSamePropertyValue = hasSamePropertyValue;
function toString(value) {
    if (value == null) {
        return undefined;
    }
    var type = typeof value;
    if (type === 'string') {
        return value;
    }
    if (type === 'number' || type === 'boolean' || type === 'bigint') {
        return String(value);
    }
    if (type === 'object') {
        if ('toString' in value) {
            return value.toString();
        }
    }
    return String(value);
}
exports.toString = toString;
/**
 * Splits an array key like '_id:abc' into its field name and value. <br>
 * Only the first ':' is a separator, so the value itself may contain ':' (e.g. '_id:user:123'). <br>
 * A key like ':abc' (empty name) addresses a primitive element by its value.
 */
function splitIdKey(key) {
    var pos = key.indexOf(':');
    return { keyName: key.substring(0, pos), keyValue: key.substring(pos + 1) };
}
exports.splitIdKey = splitIdKey;
function isSameId(id, keyValue) {
    if (id == null) {
        return false;
    }
    if (typeof id === 'string') {
        return id === keyValue;
    }
    if (toString(id) === keyValue) {
        return true;
    }
    return typeof id === 'object' && typeof id.equals === 'function' && !!id.equals(keyValue);
}
/**
 * Finds the index of the array element addressed by keyName/keyValue (see splitIdKey).
 * Returns -1 when there is no such element.
 */
function findIndexByIdKey(arr, keyName, keyValue) {
    if (keyName == null || keyName.length == 0) {
        return arr.findIndex(function (el) {
            var type = typeof el;
            if (type === 'string' || type === 'number' || type === 'boolean' || type === 'bigint') {
                return String(el) === keyValue;
            }
            // a list of ObjectIds is addressed by the hex string, as compare() emits it from the serialized document
            return type === 'object' && el != null && typeof el.equals === 'function' && isSameId(el, keyValue);
        });
    }
    return arr.findIndex(function (el) { return el != null && isSameId(el[keyName], keyValue); });
}
exports.findIndexByIdKey = findIndexByIdKey;
function getValue(obj, key, document, objMap) {
    if (document === void 0) { document = undefined; }
    if (Array.isArray(obj)) {
        if (objMap) {
            // the map has every key of the array, so there is no need to scan it
            return _hasOwnProperty.call(objMap, key) ? objMap[key] : undefined;
        }
        if (typeof key === 'string' && key.indexOf(':') !== -1) {
            var idKey = splitIdKey(key);
            var index = findIndexByIdKey(obj, idKey.keyName, idKey.keyValue);
            return index === -1 ? undefined : obj[index];
        }
    }
    return obj[key];
}
exports.getValue = getValue;
var _hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwnProperty(obj, key, objMap) {
    if (Array.isArray(obj)) {
        if (objMap) {
            return _hasOwnProperty.call(objMap, key);
        }
        if (typeof key === 'string' && key.indexOf(':') !== -1) {
            var idKey = splitIdKey(key);
            return findIndexByIdKey(obj, idKey.keyName, idKey.keyValue) !== -1;
        }
    }
    return _hasOwnProperty.call(obj, key);
}
exports.hasOwnProperty = hasOwnProperty;
function _objectKeys(obj, idFieldNames) {
    if (idFieldNames === void 0) { idFieldNames = ['_id']; }
    var result = { keys: [], map: {} };
    if (obj == null) {
        return result;
    }
    if (Array.isArray(obj)) {
        result.keys = new Array(obj.length);
        var _loop_1 = function (k) {
            var key = "" + k;
            var el = obj[key];
            if (el != null) {
                // 0 is a valid id; only null, undefined and '' mean "no id"
                var idFN = typeof el === 'object' ? idFieldNames.find(function (idField) { return el[idField] != null && el[idField] !== ''; }) : undefined;
                if (idFN) {
                    var complexKey = idFN + ':' + toString(el[idFN]);
                    result.keys[k] = complexKey;
                    result.map[complexKey] = el;
                }
                else if (typeof el === 'string' || typeof el === 'bigint' || typeof el === 'boolean' || typeof el === 'number') {
                    var complexKey = ':' + el;
                    result.keys[k] = complexKey;
                    result.map[complexKey] = el;
                    // also reachable by position, so an element without id on the other side (e.g. null)
                    // is compared with the primitive that took its place
                    result.map[key] = el;
                }
                else {
                    result.keys[k] = key;
                    result.map[key] = el;
                }
            }
            else {
                result.keys[k] = key;
                result.map[key] = el;
            }
        };
        for (var k = 0; k < result.keys.length; k++) {
            _loop_1(k);
        }
        return result;
    }
    if (Object.keys) {
        result.keys = Object.keys(obj);
        result.map = obj;
        return result;
    }
    for (var i in obj) {
        if (hasOwnProperty(obj, i)) {
            result.keys.push(i);
            result.map[i] = obj[i];
        }
    }
    return result;
}
exports._objectKeys = _objectKeys;
;
/**
* Deeply clone the object.
* https://jsperf.com/deep-copy-vs-json-stringify-json-parse/25 (recursiveDeepCopy)
* @param  {any} obj value to clone
* @return {any} cloned obj
*/
function _deepClone(obj) {
    switch (typeof obj) {
        case "object":
            try {
                return JSON.parse(JSON.stringify(obj)); //Faster than ES5 clone - http://jsperf.com/deep-cloning-of-objects/5
            }
            catch (e) {
                if (e instanceof TypeError && /BigInt/i.test(e.message)) {
                    return _deepCloneKeepingBigInt(obj); // JSON cannot serialize BigInt
                }
                throw e;
            }
        case "undefined":
            return null; //this is how JSON.stringify behaves for array items
        default:
            return obj; //no need to clone primitives
    }
}
exports._deepClone = _deepClone;
// Same result as JSON.parse(JSON.stringify(obj)), but keeps BigInt values
function _deepCloneKeepingBigInt(obj) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
    if (typeof obj.toJSON === 'function') {
        return _deepCloneKeepingBigInt(obj.toJSON());
    }
    if (Array.isArray(obj)) {
        var arr = new Array(obj.length);
        for (var i = 0; i < obj.length; i++) {
            var el = obj[i];
            arr[i] = (el === undefined || typeof el === 'function' || typeof el === 'symbol') ? null : _deepCloneKeepingBigInt(el);
        }
        return arr;
    }
    var clone = {};
    var keys = Object.keys(obj);
    for (var i = 0; i < keys.length; i++) {
        var value = obj[keys[i]];
        if (value !== undefined && typeof value !== 'function' && typeof value !== 'symbol') {
            clone[keys[i]] = _deepCloneKeepingBigInt(value);
        }
    }
    return clone;
}
//3x faster than cached /^\d+$/.test(str)
function isInteger(str) {
    var i = 0;
    var len = str.length;
    var charCode;
    while (i < len) {
        charCode = str.charCodeAt(i);
        if (charCode >= 48 && charCode <= 57) {
            i++;
            continue;
        }
        return false;
    }
    return true;
}
exports.isInteger = isInteger;
/**
* Escapes a json pointer path
* @param path The raw pointer
* @return the Escaped path
*/
function escapePathComponent(path) {
    if (path.indexOf('/') === -1 && path.indexOf('~') === -1)
        return path;
    return path.replace(/~/g, '~0').replace(/\//g, '~1');
}
exports.escapePathComponent = escapePathComponent;
/**
 * Unescapes a json pointer path
 * @param path The escaped pointer
 * @return The unescaped path
 */
function unescapePathComponent(path) {
    return path.replace(/~1/g, '/').replace(/~0/g, '~');
}
exports.unescapePathComponent = unescapePathComponent;
// TODO: modify for _id:id
function _getPathRecursive(root, obj) {
    var found;
    for (var key in root) {
        if (hasOwnProperty(root, key)) {
            if (root[key] === obj) {
                return escapePathComponent(key) + '/';
            }
            else if (typeof root[key] === 'object') {
                found = _getPathRecursive(root[key], obj);
                if (found != '') {
                    return escapePathComponent(key) + '/' + found;
                }
            }
        }
    }
    return '';
}
exports._getPathRecursive = _getPathRecursive;
function getPath(root, obj) {
    if (root === obj) {
        return '/';
    }
    var path = _getPathRecursive(root, obj);
    if (path === '') {
        throw new Error("Object not found in root");
    }
    return "/" + path;
}
exports.getPath = getPath;
/**
* Recursively checks whether an object has any undefined values inside.
*/
function hasUndefined(obj) {
    if (obj === undefined) {
        return true;
    }
    if (obj) {
        if (Array.isArray(obj)) {
            for (var i_1 = 0, len = obj.length; i_1 < len; i_1++) {
                if (hasUndefined(obj[i_1])) {
                    return true;
                }
            }
        }
        else if (typeof obj === "object") {
            var objKeys = _objectKeys(obj);
            var objKeysLength = objKeys.keys.length;
            for (var i = 0; i < objKeysLength; i++) {
                var value = getValue(obj, objKeys.keys[i], undefined, objKeys.map);
                if (hasUndefined(value)) {
                    return true;
                }
            }
        }
    }
    return false;
}
exports.hasUndefined = hasUndefined;
function patchErrorMessageFormatter(message, args) {
    var messageParts = [message];
    for (var key in args) {
        var value = typeof args[key] === 'object' ? JSON.stringify(args[key], null, 2) : args[key]; // pretty print
        if (typeof value !== 'undefined') {
            messageParts.push(key + ": " + value);
        }
    }
    return messageParts.join('\n');
}
var PatchError = /** @class */ (function (_super) {
    __extends(PatchError, _super);
    function PatchError(message, name, index, operation, tree) {
        var _newTarget = this.constructor;
        var _this = _super.call(this, patchErrorMessageFormatter(message, { name: name, index: index, operation: operation, tree: tree })) || this;
        _this.name = name;
        _this.index = index;
        _this.operation = operation;
        _this.tree = tree;
        Object.setPrototypeOf(_this, _newTarget.prototype); // restore prototype chain, see https://stackoverflow.com/a/48342359
        _this.message = patchErrorMessageFormatter(message, { name: name, index: index, operation: operation, tree: tree });
        return _this;
    }
    return PatchError;
}(Error));
exports.PatchError = PatchError;
