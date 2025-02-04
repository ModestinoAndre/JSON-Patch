/*!
 * https://github.com/Starcounter-Jack/JSON-Patch
 * (c) 2017-2021 Joachim Wester
 * MIT license
 */
import { isEquals, _deepClone, getValue, _objectKeys, escapePathComponent, hasOwnProperty } from './helpers.mjs';
import { applyPatch } from './core.mjs';
var beforeDict = new WeakMap();
var Mirror = /** @class */ (function () {
    function Mirror(obj) {
        this.observers = new Map();
        this.obj = obj;
    }
    return Mirror;
}());
var ObserverInfo = /** @class */ (function () {
    function ObserverInfo(callback, observer) {
        this.callback = callback;
        this.observer = observer;
    }
    return ObserverInfo;
}());
function getMirror(obj) {
    return beforeDict.get(obj);
}
function getObserverFromMirror(mirror, callback) {
    return mirror.observers.get(callback);
}
function removeObserverFromMirror(mirror, observer) {
    mirror.observers.delete(observer.callback);
}
/**
 * Detach an observer from an object
 */
export function unobserve(root, observer) {
    observer.unobserve();
}
/**
 * Observes changes made to an object, which can then be retrieved using generate
 */
export function observe(obj, callback, idFieldNames) {
    if (idFieldNames === void 0) { idFieldNames = ['_id']; }
    var patches = [];
    var observer;
    var mirror = getMirror(obj);
    if (!mirror) {
        mirror = new Mirror(obj);
        beforeDict.set(obj, mirror);
    }
    else {
        var observerInfo = getObserverFromMirror(mirror, callback);
        observer = observerInfo && observerInfo.observer;
    }
    if (observer) {
        return observer;
    }
    observer = {};
    mirror.value = _deepClone(obj);
    if (callback) {
        observer.callback = callback;
        observer.next = null;
        var dirtyCheck = function () {
            generate(observer, false, idFieldNames);
        };
        var fastCheck = function () {
            clearTimeout(observer.next);
            observer.next = setTimeout(dirtyCheck);
        };
        if (typeof window !== 'undefined') { //not Node
            window.addEventListener('mouseup', fastCheck);
            window.addEventListener('keyup', fastCheck);
            window.addEventListener('mousedown', fastCheck);
            window.addEventListener('keydown', fastCheck);
            window.addEventListener('change', fastCheck);
        }
    }
    observer.patches = patches;
    observer.object = obj;
    observer.unobserve = function () {
        generate(observer, false, idFieldNames);
        clearTimeout(observer.next);
        removeObserverFromMirror(mirror, observer);
        if (typeof window !== 'undefined') {
            window.removeEventListener('mouseup', fastCheck);
            window.removeEventListener('keyup', fastCheck);
            window.removeEventListener('mousedown', fastCheck);
            window.removeEventListener('keydown', fastCheck);
            window.removeEventListener('change', fastCheck);
        }
    };
    mirror.observers.set(callback, new ObserverInfo(callback, observer));
    return observer;
}
/**
 * Generate an array of patches from an observer
 */
export function generate(observer, invertible, idFieldNames) {
    if (invertible === void 0) { invertible = false; }
    if (idFieldNames === void 0) { idFieldNames = ['_id']; }
    var mirror = beforeDict.get(observer.object);
    _generate(mirror.value, observer.object, observer.patches, "", invertible, idFieldNames);
    if (observer.patches.length) {
        applyPatch(mirror.value, observer.patches);
    }
    var temp = observer.patches;
    if (temp.length > 0) {
        observer.patches = [];
        if (observer.callback) {
            observer.callback(temp);
        }
    }
    return temp;
}
// Dirty check if obj is different from mirror, generate patches and update mirror
function _generate(mirror, obj, patches, path, invertible, idFieldNames) {
    if (idFieldNames === void 0) { idFieldNames = ['_id']; }
    if (obj === mirror) {
        return;
    }
    if (typeof obj.toJSON === "function") {
        obj = obj.toJSON();
    }
    var newKeys = _objectKeys(obj, idFieldNames);
    var oldKeys = _objectKeys(mirror, idFieldNames);
    var changed = false;
    var deleted = false;
    //if ever "move" operation is implemented here, make sure this test runs OK: "should not generate the same patch twice (move)"
    for (var t = oldKeys.length - 1; t >= 0; t--) {
        var key = oldKeys[t];
        var oldVal = getValue(mirror, key, mirror);
        var newVal = getValue(obj, key, obj);
        if (oldVal instanceof Date) {
            oldVal = oldVal.toISOString();
        }
        if (newVal instanceof Date) {
            newVal = newVal.toISOString();
        }
        if (hasOwnProperty(obj, key) && !(newVal === undefined && oldVal !== undefined && Array.isArray(obj) === false)) {
            if (typeof oldVal == "object" && oldVal != null && typeof newVal == "object" && newVal != null && Array.isArray(oldVal) === Array.isArray(newVal)) {
                _generate(oldVal, newVal, patches, path + "/" + escapePathComponent(key), invertible, idFieldNames);
            }
            else {
                if (!isEquals(oldVal, newVal)) {
                    changed = true;
                    if (invertible) {
                        patches.push({ op: "test", path: path + "/" + escapePathComponent(key), value: _deepClone(oldVal) });
                    }
                    patches.push({ op: "replace", path: path + "/" + escapePathComponent(key), value: _deepClone(newVal) });
                }
            }
        }
        else if (Array.isArray(mirror) === Array.isArray(obj)) {
            if (invertible) {
                patches.push({ op: "test", path: path + "/" + escapePathComponent(key), value: _deepClone(oldVal) });
            }
            patches.push({ op: "remove", path: path + "/" + escapePathComponent(key) });
            deleted = true; // property has been deleted
        }
        else {
            if (invertible) {
                patches.push({ op: "test", path: path, value: mirror });
            }
            patches.push({ op: "replace", path: path, value: obj });
            changed = true;
        }
    }
    if (!deleted && newKeys.length == oldKeys.length) {
        return;
    }
    for (var t = 0; t < newKeys.length; t++) {
        var key = newKeys[t];
        var newValue = getValue(obj, key, obj);
        if (!hasOwnProperty(mirror, key) && newValue !== undefined) {
            if (Array.isArray(obj)) {
                patches.push({ op: "add", path: path + "/-", value: _deepClone(newValue) });
            }
            else {
                patches.push({ op: "add", path: path + "/" + escapePathComponent(key), value: _deepClone(newValue) });
            }
        }
    }
}
/**
 * Create an array of patches from the differences in two objects
 */
export function compare(tree1, tree2, invertible, idFieldNames) {
    if (invertible === void 0) { invertible = false; }
    if (idFieldNames === void 0) { idFieldNames = ['_id']; }
    var patches = [];
    _generate(tree1, tree2, patches, '', invertible, idFieldNames);
    return patches;
}
