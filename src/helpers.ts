/*!
 * https://github.com/Starcounter-Jack/JSON-Patch
 * (c) 2017 Joachim Wester
 * MIT license
 */

const _hasOwnProperty = Object.prototype.hasOwnProperty;
export function hasOwnProperty(obj, key) {
    if (Array.isArray(obj) && typeof key === 'string' && key.indexOf(':') !== -1) {
        // const [keyName, keyValue] = key.split(':'); // do not work in older browsers
        var parts = key.split(':');
        var keyName = parts[0];
        var keyValue = parts[1];
        var index = obj.findIndex(el => (keyName == null || keyName.length == 0) ? el == keyValue : el[keyName] == keyValue);
        return index !== -1;
    }
    return _hasOwnProperty.call(obj, key);
}
export function _objectKeys(obj) {
    if (obj == null) {
        return [];
    }
    if (Array.isArray(obj)) {
        var keys = new Array(obj.length);
        for (var k = 0; k < keys.length; k++) {
            var key = "" + k;
            var el = obj[key];
            if (!!el) {
                if (el._id != null && el._id.length > 0) {
                    keys[k] = '_id:' + el._id;
                } else if (typeof el === 'string' || typeof el === 'bigint' || typeof el === 'boolean' || typeof el === 'number') {
                    keys[k] = ':' + el;
                } else {
                    keys[k] = key;
                }
            } else {
                keys[k] = key;
            }
        }
        return keys;
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
};
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
export function isInteger(str: string): boolean {
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
export function escapePathComponent(path: string): string {
    if (path.indexOf('/') === -1 && path.indexOf('~') === -1) return path;
    return path.replace(/~/g, '~0').replace(/\//g, '~1');
}
/**
 * Unescapes a json pointer path
 * @param path The escaped pointer
 * @return The unescaped path
 */
export function unescapePathComponent(path: string): string {
    return path.replace(/~1/g, '/').replace(/~0/g, '~');
}

// TODO: modify for _id:id
export function _getPathRecursive(root: Object, obj: Object): string {
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

export function getPath(root: Object, obj: Object): string {
    if (root === obj) {
        return '/';
    }
    var path = _getPathRecursive(root, obj);
    if (path === '') {
        throw new Error("Object not found in root");
    }
    return '/' + path;
}
/**
* Recursively checks whether an object has any undefined values inside.
*/
export function hasUndefined(obj: any): boolean {
    if (obj === undefined) {
        return true;
    }
    if (obj) {
        if (Array.isArray(obj)) {
            for (var i = 0, len = obj.length; i < len; i++) {
                if (hasUndefined(obj[i])) {
                    return true;
                }
            }
        }
        else if (typeof obj === "object") {
            var objKeys = _objectKeys(obj);
            var objKeysLength = objKeys.length;
            for (var i = 0; i < objKeysLength; i++) {
                if (hasUndefined(obj[objKeys[i]])) {
                    return true;
                }
            }
        }
    }
    return false;
}

export type JsonPatchErrorName = 'SEQUENCE_NOT_AN_ARRAY' |
    'OPERATION_NOT_AN_OBJECT' |
    'OPERATION_OP_INVALID' |
    'OPERATION_PATH_INVALID' |
    'OPERATION_FROM_REQUIRED' |
    'OPERATION_VALUE_REQUIRED' |
    'OPERATION_VALUE_CANNOT_CONTAIN_UNDEFINED' |
    'OPERATION_PATH_CANNOT_ADD' |
    'OPERATION_PATH_UNRESOLVABLE' |
    'OPERATION_FROM_UNRESOLVABLE' |
    'OPERATION_PATH_ILLEGAL_ARRAY_INDEX' |
    'OPERATION_VALUE_OUT_OF_BOUNDS' |
    'TEST_OPERATION_FAILED';

function patchErrorMessageFormatter(message: String, args: Object): string {
    const messageParts = [message];
    for(const key in args) {
        const value = typeof args[key] === 'object' ? JSON.stringify(args[key], null, 2) : args[key]; // pretty print
        if(typeof value !== 'undefined') {
            messageParts.push(`${key}: ${value}`);
        }
    }
    return messageParts.join('\n');
}
export class PatchError extends Error {
    constructor(message: string, public name: JsonPatchErrorName, public index?: number, public operation?: any, public tree?: any) {
        super(patchErrorMessageFormatter(message, { name, index, operation, tree }));
        Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain, see https://stackoverflow.com/a/48342359
        this.message = patchErrorMessageFormatter(message, { name, index, operation, tree });
    }
}