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
export declare function isEquals(id1: any, id2: any): boolean;
/**
 * Compares two document values when generating a diff. <br>
 * Unlike isEquals(), it does not use loose equality: 1 and '1', false and 0, '' and false are different values. <br>
 * null and undefined are equivalent, and an object exposing equals() (e.g. ObjectId) can match its serialized form.
 */
export declare function isSameValue(a: any, b: any): boolean;
export declare function hasSamePropertyValue(obj1: any, obj2: any, propertyName: string): boolean;
export declare function toString(value: any): string;
/**
 * Splits an array key like '_id:abc' into its field name and value. <br>
 * Only the first ':' is a separator, so the value itself may contain ':' (e.g. '_id:user:123'). <br>
 * A key like ':abc' (empty name) addresses a primitive element by its value.
 */
export declare function splitIdKey(key: string): {
    keyName: string;
    keyValue: string;
};
/**
 * Finds the index of the array element addressed by keyName/keyValue (see splitIdKey).
 * Returns -1 when there is no such element.
 */
export declare function findIndexByIdKey(arr: any[], keyName: string, keyValue: string): number;
export declare function getValue(obj: any, key: any, document?: any, objMap?: any): any;
export declare function hasOwnProperty(obj: any, key: any, objMap?: any): any;
export declare function _objectKeys(obj: any, idFieldNames?: string[]): {
    keys: string[];
    map: {
        [key: string]: any;
    };
};
/**
* Deeply clone the object.
* https://jsperf.com/deep-copy-vs-json-stringify-json-parse/25 (recursiveDeepCopy)
* @param  {any} obj value to clone
* @return {any} cloned obj
*/
export declare function _deepClone(obj: any): any;
export declare function isInteger(str: string): boolean;
/**
* Escapes a json pointer path
* @param path The raw pointer
* @return the Escaped path
*/
export declare function escapePathComponent(path: string): string;
/**
 * Unescapes a json pointer path
 * @param path The escaped pointer
 * @return The unescaped path
 */
export declare function unescapePathComponent(path: string): string;
export declare function _getPathRecursive(root: Object, obj: Object): string;
export declare function getPath(root: Object, obj: Object): string;
/**
* Recursively checks whether an object has any undefined values inside.
*/
export declare function hasUndefined(obj: any): boolean;
export declare type JsonPatchErrorName = 'SEQUENCE_NOT_AN_ARRAY' | 'OPERATION_NOT_AN_OBJECT' | 'OPERATION_OP_INVALID' | 'OPERATION_PATH_INVALID' | 'OPERATION_FROM_REQUIRED' | 'OPERATION_VALUE_REQUIRED' | 'OPERATION_VALUE_CANNOT_CONTAIN_UNDEFINED' | 'OPERATION_PATH_CANNOT_ADD' | 'OPERATION_PATH_UNRESOLVABLE' | 'OPERATION_FROM_UNRESOLVABLE' | 'OPERATION_PATH_ILLEGAL_ARRAY_INDEX' | 'OPERATION_VALUE_OUT_OF_BOUNDS' | 'TEST_OPERATION_FAILED';
export declare class PatchError extends Error {
    name: JsonPatchErrorName;
    index?: number;
    operation?: any;
    tree?: any;
    constructor(message: string, name: JsonPatchErrorName, index?: number, operation?: any, tree?: any);
}
