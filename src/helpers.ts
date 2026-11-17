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

/**
 * Compares two document values when generating a diff. <br>
 * Unlike isEquals(), it does not use loose equality: 1 and '1', false and 0, '' and false are different values. <br>
 * null and undefined are equivalent, and an object exposing equals() (e.g. ObjectId) can match its serialized form.
 */
export function isSameValue(a, b) {
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

/**
 * Splits an array key like '_id:abc' into its field name and value. <br>
 * Only the first ':' is a separator, so the value itself may contain ':' (e.g. '_id:user:123'). <br>
 * A key like ':abc' (empty name) addresses a primitive element by its value.
 */
export function splitIdKey(key: string): { keyName: string, keyValue: string } {
    const pos = key.indexOf(':');
    return { keyName: key.substring(0, pos), keyValue: key.substring(pos + 1) };
}

function isSameId(id: any, keyValue: string): boolean {
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
export function findIndexByIdKey(arr: any[], keyName: string, keyValue: string): number {
    if (keyName == null || keyName.length == 0) {
        return arr.findIndex(el => {
            const type = typeof el;
            return (type === 'string' || type === 'number' || type === 'boolean' || type === 'bigint') && String(el) === keyValue;
        });
    }
    return arr.findIndex(el => el != null && isSameId(el[keyName], keyValue));
}

export function getValue(obj: any, key: any, document: any = undefined, objMap?: any): any {
    if (Array.isArray(obj)) {
        if (objMap) {
            // the map has every key of the array, so there is no need to scan it
            return _hasOwnProperty.call(objMap, key) ? objMap[key] : undefined;
        }
        if (typeof key === 'string' && key.indexOf(':') !== -1) {
            const idKey = splitIdKey(key);
            const index = findIndexByIdKey(obj, idKey.keyName, idKey.keyValue);
            return index === -1 ? undefined : obj[index];
        }
    }
    return obj[key];
}

const _hasOwnProperty = Object.prototype.hasOwnProperty;
export function hasOwnProperty(obj, key, objMap?: any) {
    if (Array.isArray(obj)) {
        if (objMap) {
            return _hasOwnProperty.call(objMap, key);
        }
        if (typeof key === 'string' && key.indexOf(':') !== -1) {
            const idKey = splitIdKey(key);
            return findIndexByIdKey(obj, idKey.keyName, idKey.keyValue) !== -1;
        }
    }
    return _hasOwnProperty.call(obj, key);
}

export function _objectKeys(obj, idFieldNames  = ['_id']): { keys: string[], map: { [key: string]: any } } {
    const result = { keys: [], map: {} };
    if (obj == null) {
        return result;
    }
    if (Array.isArray(obj)) {
        result.keys = new Array(obj.length);
        for (let k = 0; k < result.keys.length; k++) {
            let key = "" + k;
            let el = obj[key];
            if (el != null) {
                // 0 is a valid id; only null, undefined and '' mean "no id"
                const idFN = typeof el === 'object' ? idFieldNames.find(idField => el[idField] != null && el[idField] !== '') : undefined;
                if (idFN) {
                    const complexKey = idFN + ':' + toString(el[idFN]);
                    result.keys[k] = complexKey;
                    result.map[complexKey] = el;
                } else if (typeof el === 'string' || typeof el === 'bigint' || typeof el === 'boolean' || typeof el === 'number') {
                    const complexKey = ':' + el;
                    result.keys[k] = complexKey;
                    result.map[complexKey] = el;
                    // also reachable by position, so an element without id on the other side (e.g. null)
                    // is compared with the primitive that took its place
                    result.map[key] = el;
                } else {
                    result.keys[k] = key;
                    result.map[key] = el;
                }
            } else {
                result.keys[k] = key;
                result.map[key] = el;
            }
        }
        return result;
    }
    if (Object.keys) {
        result.keys = Object.keys(obj);
        result.map = obj;
        return result;
    }
    for (let i in obj) {
        if (hasOwnProperty(obj, i)) {
            result.keys.push(i);
            result.map[i] = obj[i];
        }
    }
    return result;
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
            try {
                return JSON.parse(JSON.stringify(obj)); //Faster than ES5 clone - http://jsperf.com/deep-cloning-of-objects/5
            } catch (e) {
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
// Same result as JSON.parse(JSON.stringify(obj)), but keeps BigInt values
function _deepCloneKeepingBigInt(obj) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
    if (typeof obj.toJSON === 'function') {
        return _deepCloneKeepingBigInt(obj.toJSON());
    }
    if (Array.isArray(obj)) {
        const arr = new Array(obj.length);
        for (let i = 0; i < obj.length; i++) {
            const el = obj[i];
            arr[i] = (el === undefined || typeof el === 'function' || typeof el === 'symbol') ? null : _deepCloneKeepingBigInt(el);
        }
        return arr;
    }
    const clone = {};
    const keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
        const value = obj[keys[i]];
        if (value !== undefined && typeof value !== 'function' && typeof value !== 'symbol') {
            clone[keys[i]] = _deepCloneKeepingBigInt(value);
        }
    }
    return clone;
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
            const objKeysLength = objKeys.keys.length;
            for (var i = 0; i < objKeysLength; i++) {
                const value = getValue(obj, objKeys.keys[i], undefined, objKeys.map);
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
