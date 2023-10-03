/*!
 * https://github.com/Starcounter-Jack/JSON-Patch
 * (c) 2017-2022 Joachim Wester
 * MIT licensed
 */

/**
 * Efetua teste de identidade e de igualdade (equals) de forma bilateral. <br>
 * Nem sempre id1.equals(id2) será igual a id2.equals(id1) <br>
 * ex.: '123'.equals(Bson.ObjectId('123')) => false <br>
 * ex.: Bson.ObjectId('123').equals('123') => true <br>
 * isEquals() resolve essa questão.
 */
export function isEquals(id1, id2) {
    if ((id1 === 0  && id2 === '') || id2 === 0 && id1 === '') { // required to take the test 'should replace 0 with empty string' pass
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

export function hasSamePropertyValue(obj1: any, obj2: any, propertyName: string): boolean {
    if (obj1 == null || obj2 == null || !propertyName) {
        return false;
    }
    const id1 = obj1[propertyName];
    const id2 = obj2[propertyName];
    return isEquals(id1, id2);
}

export function toString(value: any): string {
    if (value == null) {
        return undefined;
    }
    const type = typeof value;
    if (type === 'string') {
        return value
    }
    if (type === 'number' || type === 'boolean' || type === 'bigint' ) {
        return String(value);
    }
    if (type === 'object') {
        if ('toString' in value) {
            return value.toString();
        }
    }
    return String(value);
}

export function getValue(obj: any, key: any, document: any = undefined): any {
    if (Array.isArray(obj) && typeof key === 'string' && key.indexOf(':') !== -1) {
        // const [keyName, keyValue] = key.split(':'); // do not work in older browsers
        var parts = key.split(':');
        var keyName = parts[0];
        var keyValue = parts[1];
        var index = obj.findIndex(el => (keyName == null || keyName.length == 0) ? el == keyValue : isEquals(el[keyName], keyValue));
        return index === -1 ? undefined : obj[index];
    }
    return obj[key];
}

const _hasOwnProperty = Object.prototype.hasOwnProperty;
export function hasOwnProperty(obj, key) {
    if (Array.isArray(obj) && typeof key === 'string' && key.indexOf(':') !== -1) {
        // const [keyName, keyValue] = key.split(':'); // do not work in older browsers
        var parts = key.split(':');
        var keyName = parts[0];
        var keyValue = parts[1];
        var index = obj.findIndex(el => (keyName == null || keyName.length == 0) ? el == keyValue : isEquals(el[keyName], keyValue));
        return index !== -1;
    }
    return _hasOwnProperty.call(obj, key);
}
export function _objectKeys(obj, idFieldNames  = ['_id']) {
    if (obj == null) {
        return [];
    }
    if (Array.isArray(obj)) {
        const keys = new Array(obj.length);
        for (let k = 0; k < keys.length; k++) {
            let key = "" + k;
            let el = obj[key];
            if (el != null) {
                const idFN = idFieldNames.find(idField => !!el[idField]);
                if (idFN) {
                    keys[k] = idFN + ':' + toString(el[idFN]);
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
    let keys = [];
    for (let i in obj) {
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
    let i = 0;
    const len = str.length;
    let charCode;
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
    let found;
    for (let key in root) {
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
    const path = _getPathRecursive(root, obj);
    if (path === '') {
        throw new Error("Object not found in root");
    }
    return `/${path}`;
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
            for (let i = 0, len = obj.length; i < len; i++) {
                if (hasUndefined(obj[i])) {
                    return true;
                }
            }
        }
        else if (typeof obj === "object") {
            const objKeys = _objectKeys(obj);
            const objKeysLength = objKeys.length;
            for (var i = 0; i < objKeysLength; i++) {
                const value = getValue(obj, objKeys[i]);
                if (hasUndefined(value)) {
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
    for (const key in args) {
        const value = typeof args[key] === 'object' ? JSON.stringify(args[key], null, 2) : args[key]; // pretty print
        if (typeof value !== 'undefined') {
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
