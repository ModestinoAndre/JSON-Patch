!function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=0)}([function(e,t,n){"use strict";n.r(t);var r={};n.r(r),n.d(r,"JsonPatchError",function(){return O}),n.d(r,"deepClone",function(){return A}),n.d(r,"getValueByPointer",function(){return E}),n.d(r,"applyOperation",function(){return x}),n.d(r,"applyPatch",function(){return P}),n.d(r,"applyReducer",function(){return T}),n.d(r,"validator",function(){return D}),n.d(r,"validate",function(){return N}),n.d(r,"_areEquals",function(){return j});var o={};n.r(o),n.d(o,"unobserve",function(){return L}),n.d(o,"observe",function(){return S}),n.d(o,"generate",function(){return B}),n.d(o,"compare",function(){return U});var i={};n.r(i),n.d(i,"JsonPatchError",function(){return b}),n.d(i,"deepClone",function(){return h}),n.d(i,"escapePathComponent",function(){return w}),n.d(i,"unescapePathComponent",function(){return y}),n.d(i,"default",function(){return V}),n.d(i,"getValueByPointer",function(){return E}),n.d(i,"applyOperation",function(){return x}),n.d(i,"applyPatch",function(){return P}),n.d(i,"applyReducer",function(){return T}),n.d(i,"validator",function(){return D}),n.d(i,"validate",function(){return N}),n.d(i,"_areEquals",function(){return j}),n.d(i,"unobserve",function(){return L}),n.d(i,"observe",function(){return S}),n.d(i,"generate",function(){return B}),n.d(i,"compare",function(){return U});
/*!
 * https://github.com/Starcounter-Jack/JSON-Patch
 * (c) 2017 Joachim Wester
 * MIT license
 */
var a,u=(a=function(e,t){return(a=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n])})(e,t)},function(e,t){function n(){this.constructor=e}a(e,t),e.prototype=null===t?Object.create(t):(n.prototype=t.prototype,new n)});function p(e,t){return!(0===e&&""===t||0===t&&""===e)&&(e==t||null!=e&&null!=t&&(!!("object"==typeof e&&"equals"in e&&e.equals(t))||!!("object"==typeof t&&"equals"in t&&t.equals(e))))}function c(e){if(null!=e){var t=typeof e;return"string"===t?e:"number"===t||"boolean"===t||"bigint"===t?String(e):"object"===t&&"toString"in e?e.toString():String(e)}}function f(e,t,n){if(void 0===n&&(n=void 0),Array.isArray(e)&&"string"==typeof t&&-1!==t.indexOf(":")){var r=t.split(":"),o=r[0],i=r[1],a=e.findIndex(function(e){return null==o||0==o.length?e==i:p(e[o],i)});return-1===a?void 0:e[a]}return e[t]}var d=Object.prototype.hasOwnProperty;function s(e,t){if(Array.isArray(e)&&"string"==typeof t&&-1!==t.indexOf(":")){var n=t.split(":"),r=n[0],o=n[1];return-1!==e.findIndex(function(e){return null==r||0==r.length?e==o:p(e[r],o)})}return d.call(e,t)}function l(e,t){if(void 0===t&&(t=["_id"]),null==e)return[];if(Array.isArray(e)){for(var n=new Array(e.length),r=0;r<n.length;r++){var o=""+r,i=e[o];if(null!=i){var a=t.find(function(e){return!!i[e]});n[r]=a?a+":"+c(i[a]):"string"==typeof i||"bigint"==typeof i||"boolean"==typeof i||"number"==typeof i?":"+i:o}else n[r]=o}return n}if(Object.keys)return Object.keys(e);n=[];for(var u in e)s(e,u)&&n.push(u);return n}function h(e){switch(typeof e){case"object":return JSON.parse(JSON.stringify(e));case"undefined":return null;default:return e}}function v(e){for(var t,n=0,r=e.length;n<r;){if(!((t=e.charCodeAt(n))>=48&&t<=57))return!1;n++}return!0}function w(e){return-1===e.indexOf("/")&&-1===e.indexOf("~")?e:e.replace(/~/g,"~0").replace(/\//g,"~1")}function y(e){return e.replace(/~1/g,"/").replace(/~0/g,"~")}function m(e,t){var n=[e];for(var r in t){var o="object"==typeof t[r]?JSON.stringify(t[r],null,2):t[r];void 0!==o&&n.push(r+": "+o)}return n.join("\n")}var b=function(e){function t(t,n,r,o,i){var a=this.constructor,u=e.call(this,m(t,{name:n,index:r,operation:o,tree:i}))||this;return u.name=n,u.index=r,u.operation=o,u.tree=i,Object.setPrototypeOf(u,a.prototype),u.message=m(t,{name:n,index:r,operation:o,tree:i}),u}return u(t,e),t}(Error),O=b,A=h,_={add:function(e,t,n){return e[t]=this.value,{newDocument:n}},remove:function(e,t,n){var r=e[t];return delete e[t],{newDocument:n,removed:r}},replace:function(e,t,n){var r=e[t];return e[t]=this.value,{newDocument:n,removed:r}},move:function(e,t,n){var r=E(n,this.path);r&&(r=h(r));var o=x(n,{op:"remove",path:this.from}).removed;return x(n,{op:"add",path:this.path,value:o}),{newDocument:n,removed:r}},copy:function(e,t,n){var r=E(n,this.from);return x(n,{op:"add",path:this.path,value:h(r)}),{newDocument:n}},test:function(e,t,n){return{newDocument:n,test:j(e[t],this.value)}},_get:function(e,t,n){return this.value=e[t],{newDocument:n}}},g={add:function(e,t,n,r){var o=this;if((void 0===r&&(r=["_id"]),"string"==typeof this.value||"bigint"==typeof this.value||"boolean"==typeof this.value||"number"==typeof this.value)&&-1!==e.findIndex(function(e){return e===o.value}))return{newDocument:n,index:t};var i=r.find(function(e){return null!=o.value[e]});if(i&&-1!==e.findIndex(function(e){return t=e,n=o.value,r=i,!(null==t||null==n||!r)&&p(t[r],n[r]);var t,n,r}))return{newDocument:n,index:t};return v(t)?e.splice(t,0,this.value):e[t]=this.value,{newDocument:n,index:t}},remove:function(e,t,n){return{newDocument:n,removed:e.splice(t,1)[0]}},replace:function(e,t,n){var r=e[t];return e[t]=this.value,{newDocument:n,removed:r}},move:_.move,copy:_.copy,test:_.test,_get:_._get};function E(e,t){if(""==t)return e;var n={op:"_get",path:t};return x(e,n),n.value}function x(e,t,n,r,o,i,a){if(void 0===n&&(n=!1),void 0===r&&(r=!0),void 0===o&&(o=!0),void 0===i&&(i=0),void 0===a&&(a=["_id"]),n&&("function"==typeof n?n(t,0,e,t.path):D(t,0)),""===t.path){var u={newDocument:e};if("add"===t.op)return u.newDocument=t.value,u;if("replace"===t.op)return u.newDocument=t.value,u.removed=e,u;if("move"===t.op||"copy"===t.op)return u.newDocument=E(e,t.from),"move"===t.op&&(u.removed=e),u;if("test"===t.op){if(u.test=j(e,t.value),!1===u.test)throw new O("Test operation failed","TEST_OPERATION_FAILED",i,t,e);return u.newDocument=e,u}if("remove"===t.op)return u.removed=e,u.newDocument=null,u;if("_get"===t.op)return t.value=e,u;if(n)throw new O("Operation `op` property is not one of operations defined in RFC-6902","OPERATION_OP_INVALID",i,t,e);return u}r||(e=h(e));var c=(t.path||"").split("/"),d=e,s=1,l=c.length,w=void 0,m=void 0,b=void 0;for(b="function"==typeof n?n:D;;){if((m=c[s])&&-1!=m.indexOf("~")&&(m=y(m)),o&&("__proto__"==m||"prototype"==m&&s>0&&"constructor"==c[s-1]))throw new TypeError("JSON-Patch: modifying `__proto__` or `constructor/prototype` prop is banned for security reasons, if this was on purpose, please set `banPrototypeModifications` flag false and pass it to this function. More info in fast-json-patch README");if(n&&void 0===w&&(void 0===f(d,m,e)?w=c.slice(0,s).join("/"):s==l-1&&(w=t.path),void 0!==w&&b(t,0,e,w)),s++,Array.isArray(d)){if("-"===m)m=d.length;else{var A=-1!==m.indexOf(":");if(n&&!v(m)&&!A)throw new O("Expected an unsigned base-10 integer value, making the new referenced value the array element with the zero-based index","OPERATION_PATH_ILLEGAL_ARRAY_INDEX",i,t,e);if(v(m))m=~~m;else if(A){var x=m.split(":"),P=x[0],T=x[1];if(m=d.findIndex(function(e){return null==P||0==P.length?e==T:p(e[P],T)}),n&&-1===m)throw new O("Cannot perform the operation at a path that does not exist","OPERATION_PATH_UNRESOLVABLE",i,t,e)}}if(s>=l){if(n&&"add"===t.op&&m>d.length)throw new O("The specified index MUST NOT be greater than the number of elements in the array","OPERATION_VALUE_OUT_OF_BOUNDS",i,t,e);if(!1===(u=g[t.op].call(t,d,m,e,a)).test)throw new O("Test operation failed","TEST_OPERATION_FAILED",i,t,e);return u}}else if(s>=l){if(!1===(u=_[t.op].call(t,d,m,e)).test)throw new O("Test operation failed","TEST_OPERATION_FAILED",i,t,e);return u}if(d=d[m],n&&s<l&&(!d||"object"!=typeof d))throw new O("Cannot perform operation at the desired path","OPERATION_PATH_UNRESOLVABLE",i,t,e)}}function P(e,t,n,r,o,i){if(void 0===r&&(r=!0),void 0===o&&(o=!0),void 0===i&&(i=["_id"]),n&&!Array.isArray(t))throw new O("Patch sequence must be an array","SEQUENCE_NOT_AN_ARRAY");r||(e=h(e));for(var a=new Array(t.length),u=0,p=t.length;u<p;u++)a[u]=x(e,t[u],n,!0,o,u,i),e=a[u].newDocument;return a.newDocument=e,a}function T(e,t,n){var r=x(e,t);if(!1===r.test)throw new O("Test operation failed","TEST_OPERATION_FAILED",n,t,e);return r.newDocument}function D(e,t,n,r){if("object"!=typeof e||null===e||Array.isArray(e))throw new O("Operation is not an object","OPERATION_NOT_AN_OBJECT",t,e,n);if(!_[e.op])throw new O("Operation `op` property is not one of operations defined in RFC-6902","OPERATION_OP_INVALID",t,e,n);if("string"!=typeof e.path)throw new O("Operation `path` property is not a string","OPERATION_PATH_INVALID",t,e,n);if(0!==e.path.indexOf("/")&&e.path.length>0)throw new O('Operation `path` property must start with "/"',"OPERATION_PATH_INVALID",t,e,n);if(("move"===e.op||"copy"===e.op)&&"string"!=typeof e.from)throw new O("Operation `from` property is not present (applicable in `move` and `copy` operations)","OPERATION_FROM_REQUIRED",t,e,n);if(("add"===e.op||"replace"===e.op||"test"===e.op)&&void 0===e.value)throw new O("Operation `value` property is not present (applicable in `add`, `replace` and `test` operations)","OPERATION_VALUE_REQUIRED",t,e,n);if(("add"===e.op||"replace"===e.op||"test"===e.op)&&function e(t){if(void 0===t)return!0;if(t)if(Array.isArray(t)){for(var n=0,r=t.length;n<r;n++)if(e(t[n]))return!0}else if("object"==typeof t){var o=l(t),i=o.length;for(n=0;n<i;n++)if(e(f(t,o[n])))return!0}return!1}(e.value))throw new O("Operation `value` property is not present (applicable in `add`, `replace` and `test` operations)","OPERATION_VALUE_CANNOT_CONTAIN_UNDEFINED",t,e,n);if(n)if("add"==e.op){var o=e.path.split("/").length,i=r.split("/").length;if(o!==i+1&&o!==i)throw new O("Cannot perform an `add` operation at the desired path","OPERATION_PATH_CANNOT_ADD",t,e,n)}else if("replace"===e.op||"remove"===e.op||"_get"===e.op){if(e.path!==r)throw new O("Cannot perform the operation at a path that does not exist","OPERATION_PATH_UNRESOLVABLE",t,e,n)}else if("move"===e.op||"copy"===e.op){var a=N([{op:"_get",path:e.from,value:void 0}],n);if(a&&"OPERATION_PATH_UNRESOLVABLE"===a.name)throw new O("Cannot perform the operation from a path that does not exist","OPERATION_FROM_UNRESOLVABLE",t,e,n)}}function N(e,t,n){try{if(!Array.isArray(e))throw new O("Patch sequence must be an array","SEQUENCE_NOT_AN_ARRAY");if(t)P(h(t),h(e),n||!0);else{n=n||D;for(var r=0;r<e.length;r++)n(e[r],r,t,void 0)}}catch(e){if(e instanceof O)return e;throw e}}function j(e,t){if(e===t)return!0;if(e&&t&&"object"==typeof e&&"object"==typeof t){var n,r,o,i=Array.isArray(e),a=Array.isArray(t);if(i&&a){if((r=e.length)!=t.length)return!1;for(n=r;0!=n--;)if(!j(e[n],t[n]))return!1;return!0}if(i!=a)return!1;var u=Object.keys(e);if((r=u.length)!==Object.keys(t).length)return!1;for(n=r;0!=n--;)if(!t.hasOwnProperty(u[n]))return!1;for(n=r;0!=n--;)if(!j(e[o=u[n]],t[o]))return!1;return!0}return e!=e&&t!=t}
/*!
 * https://github.com/Starcounter-Jack/JSON-Patch
 * (c) 2017-2021 Joachim Wester
 * MIT license
 */
var C=new WeakMap,I=function(e){this.observers=new Map,this.obj=e},R=function(e,t){this.callback=e,this.observer=t};function L(e,t){t.unobserve()}function S(e,t,n){void 0===n&&(n=["_id"]);var r,o=function(e){return C.get(e)}(e);if(o){var i=function(e,t){return e.observers.get(t)}(o,t);r=i&&i.observer}else o=new I(e),C.set(e,o);if(r)return r;if(r={},o.value=h(e),t){r.callback=t,r.next=null;var a=function(){B(r,!1,n)},u=function(){clearTimeout(r.next),r.next=setTimeout(a)};"undefined"!=typeof window&&(window.addEventListener("mouseup",u),window.addEventListener("keyup",u),window.addEventListener("mousedown",u),window.addEventListener("keydown",u),window.addEventListener("change",u))}return r.patches=[],r.object=e,r.unobserve=function(){B(r,!1,n),clearTimeout(r.next),function(e,t){e.observers.delete(t.callback)}(o,r),"undefined"!=typeof window&&(window.removeEventListener("mouseup",u),window.removeEventListener("keyup",u),window.removeEventListener("mousedown",u),window.removeEventListener("keydown",u),window.removeEventListener("change",u))},o.observers.set(t,new R(t,r)),r}function B(e,t,n){void 0===t&&(t=!1),void 0===n&&(n=["_id"]);var r=C.get(e.object);k(r.value,e.object,e.patches,"",t,n),e.patches.length&&P(r.value,e.patches);var o=e.patches;return o.length>0&&(e.patches=[],e.callback&&e.callback(o)),o}function k(e,t,n,r,o,i){if(void 0===i&&(i=["_id"]),t!==e){"function"==typeof t.toJSON&&(t=t.toJSON());for(var a=l(t,i),u=l(e,i),c=!1,d=u.length-1;d>=0;d--){var v=f(e,m=u[d],e),y=f(t,m,t);v instanceof Date&&(v=v.toISOString()),y instanceof Date&&(y=y.toISOString()),!s(t,m)||void 0===y&&void 0!==v&&!1===Array.isArray(t)?Array.isArray(e)===Array.isArray(t)?(o&&n.push({op:"test",path:r+"/"+w(m),value:h(v)}),n.push({op:"remove",path:r+"/"+w(m)}),c=!0):(o&&n.push({op:"test",path:r,value:e}),n.push({op:"replace",path:r,value:t}),!0):"object"==typeof v&&null!=v&&"object"==typeof y&&null!=y&&Array.isArray(v)===Array.isArray(y)?k(v,y,n,r+"/"+w(m),o,i):p(v,y)||(!0,o&&n.push({op:"test",path:r+"/"+w(m),value:h(v)}),n.push({op:"replace",path:r+"/"+w(m),value:h(y)}))}if(c||a.length!=u.length)for(d=0;d<a.length;d++){var m,b=f(t,m=a[d],t);s(e,m)||void 0===b||(Array.isArray(t)?n.push({op:"add",path:r+"/-",value:h(b)}):n.push({op:"add",path:r+"/"+w(m),value:h(b)}))}}}function U(e,t,n,r){void 0===n&&(n=!1),void 0===r&&(r=["_id"]);var o=[];return k(e,t,o,"",n,r),o}var V=Object.assign({},r,o,{JsonPatchError:b,deepClone:h,escapePathComponent:w,unescapePathComponent:y});function q(e){expect(typeof e).withContext("result from import should be an object").toEqual("object"),expect(typeof e).withContext("result from import should not be a function").not.toEqual("function"),expect(e.applyOperation).withContext("applyOperation should be a method within the object").toBeDefined(),expect(e.applyPatch).withContext("applyPatch should be a method within the object").toBeDefined(),expect(e.applyReducer).withContext("applyReducer should be a method within the object").toBeDefined(),expect(e.getValueByPointer).withContext("getValueByPointer should be a method within the object").toBeDefined(),expect(e.validate).withContext("validate should be a method within the object").toBeDefined(),expect(e.validator).withContext("validator should be a method within the object").toBeDefined(),expect(e._areEquals).withContext("_areEquals should be a method within the object").toBeDefined(),expect(e.JsonPatchError).withContext("JsonPatchError should be a method within the object").toBeDefined(),expect(e.deepClone).withContext("deepClone should be a method within the object").toBeDefined(),expect(e.escapePathComponent).withContext("escapePathComponent should be a method within the object").toBeDefined(),expect(e.unescapePathComponent).withContext("unescapePathComponent should be a method within the object").toBeDefined(),expect(e.unobserve).withContext("unobserve should be a method within the object").toBeDefined(),expect(e.observe).withContext("observe should be a method within the object").toBeDefined(),expect(e.generate).withContext("generate should be a method within the object").toBeDefined(),expect(e.compare).withContext("compare should be a method within the object").toBeDefined()}describe("This package imported by Webpack",function(){describe("import default",function(){it("should have the expected structure",function(){q(V)})}),describe("import asterisk",function(){it("should have the expected structure",function(){q(i)})}),describe("named import",function(){it("should have the expected structure",function(){expect(x).withContext("applyOperation should be defined").toBeDefined()})})})}]);