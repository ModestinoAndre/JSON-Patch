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
/**
 * Efetua teste de identidade e de igualdade (equals) de forma bilateral. <br>
 * Nem sempre id1.equals(id2) será igual a id2.equals(id1) <br>
 * ex.: '123'.equals(Bson.ObjectId('123')) => false <br>
 * ex.: Bson.ObjectId('123').equals('123') => true <br>
 * isEquals() resolve essa questão.
 */
export function isEquals(id1, id2) {
    if ((id1 === 0 && id2 === '') || id2 === 0 && id1 === '') { // required to take the test 'should replace 0 with empty string' pass
        return false;
    }
    if (id1 == id2) {
        return true;
    }
    if (id1 == null || id2 == null) {
        return false;
    }
    if (typeof id1 === 'object' && 'equals' in id1) {
        if (id1.equals(id2)) {
            return true;
        }
    }
    if (typeof id2 === 'object' && 'equals' in id2) {
        if (id2.equals(id1)) {
            return true;
        }
    }
    return false;
}
export function hasSamePropertyValue(obj1, obj2, propertyName) {
    if (obj1 == null || obj2 == null || !propertyName) {
        return false;
    }
    var id1 = obj1[propertyName];
    var id2 = obj2[propertyName];
    return isEquals(id1, id2);
}
export function toString(value) {
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
export function getValue(obj, key, document) {
    if (document === void 0) { document = undefined; }
    if (Array.isArray(obj) && typeof key === 'string' && key.indexOf(':') !== -1) {
        // const [keyName, keyValue] = key.split(':'); // do not work in older browsers
        var parts = key.split(':');
        var keyName = parts[0];
        var keyValue = parts[1];
        var index = obj.findIndex(function (el) { return (keyName == null || keyName.length == 0) ? el == keyValue : isEquals(el[keyName], keyValue); });
        return index === -1 ? undefined : obj[index];
    }
    return obj[key];
}
var _hasOwnProperty = Object.prototype.hasOwnProperty;
export function hasOwnProperty(obj, key) {
    if (Array.isArray(obj) && typeof key === 'string' && key.indexOf(':') !== -1) {
        // const [keyName, keyValue] = key.split(':'); // do not work in older browsers
        var parts = key.split(':');
        var keyName = parts[0];
        var keyValue = parts[1];
        var index = obj.findIndex(function (el) { return (keyName == null || keyName.length == 0) ? el == keyValue : isEquals(el[keyName], keyValue); });
        return index !== -1;
    }
    return _hasOwnProperty.call(obj, key);
}
export function _objectKeys(obj, idFieldNames) {
    if (idFieldNames === void 0) { idFieldNames = ['_id']; }
    if (obj == null) {
        return [];
    }
    if (Array.isArray(obj)) {
        var keys_1 = new Array(obj.length);
        var _loop_1 = function (k) {
            var key = "" + k;
            var el = obj[key];
            if (el != null) {
                var idFN = idFieldNames.find(function (idField) { return !!el[idField]; });
                if (idFN) {
                    keys_1[k] = idFN + ':' + toString(el[idFN]);
                }
                else if (typeof el === 'string' || typeof el === 'bigint' || typeof el === 'boolean' || typeof el === 'number') {
                    keys_1[k] = ':' + el;
                }
                else {
                    keys_1[k] = key;
                }
            }
            else {
                keys_1[k] = key;
            }
        };
        for (var k = 0; k < keys_1.length; k++) {
            _loop_1(k);
        }
        return keys_1;
    }
    if (Object.keys) {
        return Object.keys(obj);
    }
    var keys = [];
    for (var i in obj) {
        if (hasOwnProperty(obj, i)) {
            keys.push(i);
        }
    }
    return keys;
}
;
/**
* Deeply clone the object.
* https://jsperf.com/deep-copy-vs-json-stringify-json-parse/25 (recursiveDeepCopy)
* @param  {any} obj value to clone
* @return {any} cloned obj
*/
export function _deepClone(obj) {
    switch (typeof obj) {
        case "object":
            return JSON.parse(JSON.stringify(obj)); //Faster than ES5 clone - http://jsperf.com/deep-cloning-of-objects/5
        case "undefined":
            return null; //this is how JSON.stringify behaves for array items
        default:
            return obj; //no need to clone primitives
    }
}
//3x faster than cached /^\d+$/.test(str)
export function isInteger(str) {
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
/**
* Escapes a json pointer path
* @param path The raw pointer
* @return the Escaped path
*/
export function escapePathComponent(path) {
    if (path.indexOf('/') === -1 && path.indexOf('~') === -1)
        return path;
    return path.replace(/~/g, '~0').replace(/\//g, '~1');
}
/**
 * Unescapes a json pointer path
 * @param path The escaped pointer
 * @return The unescaped path
 */
export function unescapePathComponent(path) {
    return path.replace(/~1/g, '/').replace(/~0/g, '~');
}
// TODO: modify for _id:id
export function _getPathRecursive(root, obj) {
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
export function getPath(root, obj) {
    if (root === obj) {
        return '/';
    }
    var path = _getPathRecursive(root, obj);
    if (path === '') {
        throw new Error("Object not found in root");
    }
    return "/" + path;
}
/**
* Recursively checks whether an object has any undefined values inside.
*/
export function hasUndefined(obj) {
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
            var objKeysLength = objKeys.length;
            for (var i = 0; i < objKeysLength; i++) {
                var value = getValue(obj, objKeys[i]);
                if (hasUndefined(value)) {
                    return true;
                }
            }
        }
    }
    return false;
}
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
export { PatchError };
