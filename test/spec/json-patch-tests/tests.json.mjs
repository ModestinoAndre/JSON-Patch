export default [
    { "comment": "empty list, empty docs",
      "doc": {},
      "patch": [],
      "expected": {} },

    { "comment": "empty patch list",
      "doc": {"foo": 1},
      "patch": [],
      "expected": {"foo": 1} },

    { "comment": "rearrangements OK?",
      "doc": {"foo": 1, "bar": 2},
      "patch": [],
      "expected": {"bar":2, "foo": 1} },

    { "comment": "rearrangements OK?  How about one level down ... array",
      "doc": [{"foo": 1, "bar": 2}],
      "patch": [],
      "expected": [{"bar":2, "foo": 1}] },

    { "comment": "rearrangements OK?  How about one level down...",
      "doc": {"foo":{"foo": 1, "bar": 2}},
      "patch": [],
      "expected": {"foo":{"bar":2, "foo": 1}} },

    { "comment": "add replaces any existing field",
      "doc": {"foo": null},
      "patch": [{"op": "add", "path": "/foo", "value":1}],
      "expected": {"foo": 1} },

    { "comment": "toplevel array",
      "doc": [],
      "patch": [{"op": "add", "path": "/0", "value": "foo"}],
      "expected": ["foo"] },

    { "comment": "toplevel array, no change",
      "doc": ["foo"],
      "patch": [],
      "expected": ["foo"] },

    { "comment": "toplevel object, numeric string",
      "doc": {},
      "patch": [{"op": "add", "path": "/foo", "value": "1"}],
      "expected": {"foo":"1"} },

    { "comment": "toplevel object, integer",
      "doc": {},
      "patch": [{"op": "add", "path": "/foo", "value": 1}],
      "expected": {"foo":1} },

    { "comment": "Toplevel scalar values OK?",
      "doc": "foo",
      "patch": [{"op": "replace", "path": "", "value": "bar"}],
      "expected": "bar",
      "disabled": true },

    { "comment": "Add, / target",
      "doc": {},
      "patch": [ {"op": "add", "path": "/", "value":1 } ],
      "expected": {"":1} },

    { "comment": "Add composite value at top level",
      "doc": {"foo": 1},
      "patch": [{"op": "add", "path": "/bar", "value": [1, 2]}],
      "expected": {"foo": 1, "bar": [1, 2]} },

    { "comment": "Add into composite value",
      "doc": {"foo": 1, "baz": [{"qux": "hello"}]},
      "patch": [{"op": "add", "path": "/baz/0/foo", "value": "world"}],
      "expected": {"foo": 1, "baz": [{"qux": "hello", "foo": "world"}]} },

    { "doc": {"bar": [1, 2]},
      "patch": [{"op": "add", "path": "/bar/8", "value": "5"}],
      "error": "Out of bounds (upper)" },

    { "doc": {"bar": [1, 2]},
      "patch": [{"op": "add", "path": "/bar/-1", "value": "5"}],
      "error": "Out of bounds (lower)" },

    { "doc": {"foo": 1},
      "patch": [{"op": "add", "path": "/bar", "value": true}],
      "expected": {"foo": 1, "bar": true} },

    { "doc": {"foo": 1},
      "patch": [{"op": "add", "path": "/bar", "value": false}],
      "expected": {"foo": 1, "bar": false} },

    { "doc": {"foo": 1},
      "patch": [{"op": "add", "path": "/bar", "value": null}],
      "expected": {"foo": 1, "bar": null} },

    { "comment": "0 can be an array index or object element name",
      "doc": {"foo": 1},
      "patch": [{"op": "add", "path": "/0", "value": "bar"}],
      "expected": {"foo": 1, "0": "bar" } },

    { "doc": ["foo"],
      "patch": [{"op": "add", "path": "/1", "value": "bar"}],
      "expected": ["foo", "bar"] },

    { "doc": ["foo", "sil"],
      "patch": [{"op": "add", "path": "/1", "value": "bar"}],
      "expected": ["foo", "bar", "sil"] },

    { "doc": ["foo", "sil"],
      "patch": [{"op": "add", "path": "/0", "value": "bar"}],
      "expected": ["bar", "foo", "sil"] },

    { "doc": ["foo", "sil"],
      "patch": [{"op":"add", "path": "/2", "value": "bar"}],
      "expected": ["foo", "sil", "bar"] },

    { "comment": "test against implementation-specific numeric parsing",
      "doc": {"1e0": "foo"},
      "patch": [{"op": "test", "path": "/1e0", "value": "foo"}],
      "expected": {"1e0": "foo"} },

    { "comment": "test with bad number should fail",
      "doc": ["foo", "bar"],
      "patch": [{"op": "test", "path": "/1e0", "value": "bar"}],
      "error": "test op shouldn't get array element 1" },

    { "doc": ["foo", "sil"],
      "patch": [{"op": "add", "path": "/bar", "value": 42}],
      "error": "Object operation on array target" },

    { "doc": ["foo", "sil"],
      "patch": [{"op": "add", "path": "/1", "value": ["bar", "baz"]}],
      "expected": ["foo", ["bar", "baz"], "sil"],
      "comment": "value in array add not flattened" },

    { "doc": {"foo": 1, "bar": [1, 2, 3, 4]},
      "patch": [{"op": "remove", "path": "/bar"}],
      "expected": {"foo": 1} },

    { "doc": {"foo": 1, "baz": [{"qux": "hello"}]},
      "patch": [{"op": "remove", "path": "/baz/0/qux"}],
      "expected": {"foo": 1, "baz": [{}]} },

    { "doc": {"foo": 1, "baz": [{"qux": "hello"}]},
      "patch": [{"op": "replace", "path": "/foo", "value": [1, 2, 3, 4]}],
      "expected": {"foo": [1, 2, 3, 4], "baz": [{"qux": "hello"}]} },

    { "doc": {"foo": [1, 2, 3, 4], "baz": [{"qux": "hello"}]},
      "patch": [{"op": "replace", "path": "/baz/0/qux", "value": "world"}],
      "expected": {"foo": [1, 2, 3, 4], "baz": [{"qux": "world"}]} },

    { "doc": ["foo"],
      "patch": [{"op": "replace", "path": "/0", "value": "bar"}],
      "expected": ["bar"] },

    { "doc": [""],
      "patch": [{"op": "replace", "path": "/0", "value": 0}],
      "expected": [0] },

    { "doc": [""],
      "patch": [{"op": "replace", "path": "/0", "value": true}],
      "expected": [true] },

    { "doc": [""],
      "patch": [{"op": "replace", "path": "/0", "value": false}],
      "expected": [false] },

    { "doc": [""],
      "patch": [{"op": "replace", "path": "/0", "value": null}],
      "expected": [null] },

    { "doc": ["foo", "sil"],
      "patch": [{"op": "replace", "path": "/1", "value": ["bar", "baz"]}],
      "expected": ["foo", ["bar", "baz"]],
      "comment": "value in array replace not flattened" },

    { "comment": "replace whole document",
      "doc": {"foo": "bar"},
      "patch": [{"op": "replace", "path": "", "value": {"baz": "qux"}}],
      "expected": {"baz": "qux"} },

    { "comment": "spurious patch properties",
      "doc": {"foo": 1},
      "patch": [{"op": "test", "path": "/foo", "value": 1, "spurious": 1}],
      "expected": {"foo": 1} },

    { "doc": {"foo": null},
      "patch": [{"op": "test", "path": "/foo", "value": null}],
      "comment": "null value should be valid obj property" },

    { "doc": {"foo": null},
      "patch": [{"op": "replace", "path": "/foo", "value": "truthy"}],
      "expected": {"foo": "truthy"},
      "comment": "null value should be valid obj property to be replaced with something truthy" },

    { "doc": {"foo": null},
      "patch": [{"op": "move", "from": "/foo", "path": "/bar"}],
      "expected": {"bar": null},
      "comment": "null value should be valid obj property to be moved" },

    { "doc": {"foo": null},
      "patch": [{"op": "copy", "from": "/foo", "path": "/bar"}],
      "expected": {"foo": null, "bar": null},
      "comment": "null value should be valid obj property to be copied" },

    { "doc": {"foo": null},
      "patch": [{"op": "remove", "path": "/foo"}],
      "expected": {},
      "comment": "null value should be valid obj property to be removed" },

    { "doc": {"foo": "bar"},
      "patch": [{"op": "replace", "path": "/foo", "value": null}],
      "expected": {"foo": null},
      "comment": "null value should still be valid obj property replace other value" },

    { "doc": {"foo": {"foo": 1, "bar": 2}},
      "patch": [{"op": "test", "path": "/foo", "value": {"bar": 2, "foo": 1}}],
      "comment": "test should pass despite rearrangement" },

    { "doc": {"foo": [{"foo": 1, "bar": 2}]},
      "patch": [{"op": "test", "path": "/foo", "value": [{"bar": 2, "foo": 1}]}],
      "comment": "test should pass despite (nested) rearrangement" },

    { "doc": {"foo": {"bar": [1, 2, 5, 4]}},
      "patch": [{"op": "test", "path": "/foo", "value": {"bar": [1, 2, 5, 4]}}],
      "comment": "test should pass - no error" },

    { "doc": {"foo": {"bar": [1, 2, 5, 4]}},
      "patch": [{"op": "test", "path": "/foo", "value": [1, 2]}],
      "error": "test op should fail" },

    { "comment": "Whole document",
      "doc": { "foo": 1 },
      "patch": [{"op": "test", "path": "", "value": {"foo": 1}}],
      "disabled": true },

    { "comment": "Empty-string element",
      "doc": { "": 1 },
      "patch": [{"op": "test", "path": "/", "value": 1}] },

    { "doc": {
            "foo": ["bar", "baz"],
            "": 0,
            "a/b": 1,
            "c%d": 2,
            "e^f": 3,
            "g|h": 4,
            "i\\j": 5,
            "k\"l": 6,
            " ": 7,
            "m~n": 8
            },
      "patch": [{"op": "test", "path": "/foo", "value": ["bar", "baz"]},
                {"op": "test", "path": "/foo/0", "value": "bar"},
                {"op": "test", "path": "/", "value": 0},
                {"op": "test", "path": "/a~1b", "value": 1},
                {"op": "test", "path": "/c%d", "value": 2},
                {"op": "test", "path": "/e^f", "value": 3},
                {"op": "test", "path": "/g|h", "value": 4},
                {"op": "test", "path":  "/i\\j", "value": 5},
                {"op": "test", "path": "/k\"l", "value": 6},
                {"op": "test", "path": "/ ", "value": 7},
                {"op": "test", "path": "/m~0n", "value": 8}] },

    { "comment": "Move to same location has no effect",
      "doc": {"foo": 1},
      "patch": [{"op": "move", "from": "/foo", "path": "/foo"}],
      "expected": {"foo": 1} },

    { "doc": {"foo": 1, "baz": [{"qux": "hello"}]},
      "patch": [{"op": "move", "from": "/foo", "path": "/bar"}],
      "expected": {"baz": [{"qux": "hello"}], "bar": 1} },

    { "comment": "Move handles escaped paths",
      "doc": {"foo/": {"bar/": 1, "baz": 1}},
      "patch": [{"op": "move", "from": "/foo~1/bar~1", "path": "/bar"}],
      "expected": {"bar": 1, "foo/": {"baz": 1}} },

    { "doc": {"baz": [{"qux": "hello"}], "bar": 1},
      "patch": [{"op": "move", "from": "/baz/0/qux", "path": "/baz/1"}],
      "expected": {"baz": [{}, "hello"], "bar": 1} },

    { "doc": {"baz": [{"qux": "hello"}], "bar": 1},
      "patch": [{"op": "copy", "from": "/baz/0", "path": "/boo"}],
      "expected": {"baz":[{"qux":"hello"}],"bar":1,"boo":{"qux":"hello"}} },

    { "comment": "replacing the root of the document is possible with add",
      "doc": {"foo": "bar"},
      "patch": [{"op": "add", "path": "", "value": {"baz": "qux"}}],
      "expected": {"baz":"qux"}},

    { "comment": "Adding to \"/-\" adds to the end of the array",
      "doc": [ 1, 2 ],
      "patch": [ { "op": "add", "path": "/-", "value": { "foo": [ "bar", "baz" ] } } ],
      "expected": [ 1, 2, { "foo": [ "bar", "baz" ] } ]},

    { "comment": "Adding to \"/-\" adds to the end of the array, even n levels down",
      "doc": [ 1, 2, [ 3, [ 4, 5 ] ] ],
      "patch": [ { "op": "add", "path": "/2/1/-", "value": { "foo": [ "bar", "baz" ] } } ],
      "expected": [ 1, 2, [ 3, [ 4, 5, { "foo": [ "bar", "baz" ] } ] ] ]},

    { "comment": "test remove with bad number should fail",
      "doc": {"foo": 1, "baz": [{"qux": "hello"}]},
      "patch": [{"op": "remove", "path": "/baz/1e0/qux"}],
      "error": "remove op shouldn't remove from array with bad number" },

    { "comment": "test remove on array",
      "doc": [1, 2, 3, 4],
      "patch": [{"op": "remove", "path": "/0"}],
      "expected": [2, 3, 4] },

    { "comment": "test repeated removes",
      "doc": [1, 2, 3, 4],
      "patch": [{ "op": "remove", "path": "/1" },
                { "op": "remove", "path": "/2" }],
      "expected": [1, 3] },

    { "comment": "test remove with bad index should fail",
      "doc": [1, 2, 3, 4],
      "patch": [{"op": "remove", "path": "/1e0"}],
      "error": "remove op shouldn't remove from array with bad number" },

    { "comment": "test replace with bad number should fail",
      "doc": [""],
      "patch": [{"op": "replace", "path": "/1e0", "value": false}],
      "error": "replace op shouldn't replace in array with bad number" },

    { "comment": "test copy with bad number should fail",
      "doc": {"baz": [1,2,3], "bar": 1},
      "patch": [{"op": "copy", "from": "/baz/1e0", "path": "/boo"}],
      "error": "copy op shouldn't work with bad number" },

    { "comment": "test move with bad number should fail",
      "doc": {"foo": 1, "baz": [1,2,3,4]},
      "patch": [{"op": "move", "from": "/baz/1e0", "path": "/foo"}],
      "error": "move op shouldn't work with bad number" },

    { "comment": "test add with bad number should fail",
      "doc": ["foo", "sil"],
      "patch": [{"op": "add", "path": "/1e0", "value": "bar"}],
      "error": "add op shouldn't add to array with bad number" },

    { "comment": "missing 'value' parameter to add",
      "doc": [ 1 ],
      "patch": [ { "op": "add", "path": "/-" } ],
      "error": "missing 'value' parameter" },

    { "comment": "missing 'value' parameter to replace",
      "doc": [ 1 ],
      "patch": [ { "op": "replace", "path": "/0" } ],
      "error": "missing 'value' parameter" },

    { "comment": "missing 'value' parameter to test",
      "doc": [ null ],
      "patch": [ { "op": "test", "path": "/0" } ],
      "error": "missing 'value' parameter" },

    { "comment": "missing value parameter to test - where undef is falsy",
      "doc": [ false ],
      "patch": [ { "op": "test", "path": "/0" } ],
      "error": "missing 'value' parameter" },

    { "comment": "missing from parameter to copy",
      "doc": [ 1 ],
      "patch": [ { "op": "copy", "path": "/-" } ],
      "error": "missing 'from' parameter" },

    { "comment": "missing from parameter to move",
      "doc": { "foo": 1 },
      "patch": [ { "op": "move", "path": "" } ],
      "error": "missing 'from' parameter" },

    { "comment": "duplicate ops",
      "doc": { "foo": "bar" },
      "patch": [ { "op": "add", "path": "/baz", "value": "qux",
                   "op": "move", "from":"/foo" } ],
      "error": "patch has two 'op' members",
      "disabled": true },

    { "comment": "unrecognized op should fail",
      "doc": {"foo": 1},
      "patch": [{"op": "spam", "path": "/foo", "value": 1}],
      "error": "Unrecognized op 'spam'" },

    { "comment": "add to array",
        "doc": {"foo": 1, roles: ['a', 'b']},
        "patch": [{"op": "add", "path": "/roles/-", "value": "c"}],
        "expected": {"foo": 1, roles: ['a', 'b', 'c']} },

    { "comment": "remove from array by :value",
        "doc": {"foo": 1, roles: ['a', 'b', 'c']},
        "patch": [{"op": "remove", "path": "/roles/:b"}],
        "expected": {"foo": 1, roles: ['a', 'c']} },

    { "comment": "remove from array by _id:value",
        "doc": {"foo": 1, roles: [{ _id: '1a', n: 'a'}, { _id: '1b', n: 'b'}, { _id: '1c', n: 'c'}]},
        "patch": [{"op": "remove", "path": "/roles/_id:1b"}],
        "expected": {"foo": 1, roles: [{ _id: '1a', n: 'a'}, { _id: '1c', n: 'c'}]} },

    { "comment": "remove from array by otherId:value",
        "doc": {"foo": 1, roles: [{ otherId: '1a', n: 'a'}, { otherId: '1b', n: 'b'}, { otherId: '1c', n: 'c'}]},
        "patch": [{"op": "remove", "path": "/roles/otherId:1b"}],
        "expected": {"foo": 1, roles: [{ otherId: '1a', n: 'a'}, { otherId: '1c', n: 'c'}]} },

    { "comment": "remove all elements from array by _id:value",
        "doc": {"foo": 1, roles: [{ _id: '1a', n: 'a'}, { _id: '1b', n: 'b'}, { _id: '1c', n: 'c'}]},
        "patch": [{"op": "remove", "path": "/roles/_id:1b"},
            {"op": "remove", "path": "/roles/_id:1a"},
            {"op": "remove", "path": "/roles/_id:1c"}],
        "expected": {"foo": 1, roles: []} },

    { "comment": "remove all elements from array by otherId:value",
        "doc": {"foo": 1, roles: [{ otherId: '1a', n: 'a'}, { otherId: '1b', n: 'b'}, { otherId: '1c', n: 'c'}]},
        "patch": [{"op": "remove", "path": "/roles/otherId:1b"},
            {"op": "remove", "path": "/roles/otherId:1a"},
            {"op": "remove", "path": "/roles/otherId:1c"}],
        "expected": {"foo": 1, roles: []} },

    { "comment": "replace inside array object element by _id:value",
        "doc": {"foo": 1, roles: [{ _id: '1a', n: 'a'}, { _id: '1b', n: 'b'}, { _id: '1c', n: 'c'}]},
        "patch": [{"op": "replace", "path": "/roles/_id:1b/n", "value": 'bb'}],
        "expected": {"foo": 1, roles: [{ _id: '1a', n: 'a'}, { _id: '1b', n: 'bb'}, { _id: '1c', n: 'c'}]} },

    { "comment": "replace inside array object element by otherId:value",
        "doc": {"foo": 1, roles: [{ otherId: '1a', n: 'a'}, { otherId: '1b', n: 'b'}, { otherId: '1c', n: 'c'}]},
        "patch": [{"op": "replace", "path": "/roles/otherId:1b/n", "value": 'bb'}],
        "expected": {"foo": 1, roles: [{ otherId: '1a', n: 'a'}, { otherId: '1b', n: 'bb'}, { otherId: '1c', n: 'c'}]} },

    { "comment": "add inside array object element by _id:value",
        "doc": {"foo": 1, roles: [{ _id: '1a', n: 'a'}, { _id: '1b', n: 'b'}, { _id: '1c', n: 'c'}]},
        "patch": [{"op": "add", "path": "/roles/_id:1b/age", "value": 10}],
        "expected": {"foo": 1, roles: [{ _id: '1a', n: 'a'}, { _id: '1b', n: 'b', age: 10}, { _id: '1c', n: 'c'}]} },

    { "comment": "add inside array object element by otherId:value",
        "doc": {"foo": 1, roles: [{ otherId: '1a', n: 'a'}, { otherId: '1b', n: 'b'}, { otherId: '1c', n: 'c'}]},
        "patch": [{"op": "add", "path": "/roles/otherId:1b/age", "value": 10}],
        "expected": {"foo": 1, roles: [{ otherId: '1a', n: 'a'}, { otherId: '1b', n: 'b', age: 10}, { otherId: '1c', n: 'c'}]} },

    { "comment": "remove inside array object element by _id:value",
        "doc": {"foo": 1, roles: [{ _id: '1a', n: 'a'}, { _id: '1b', n: 'b'}, { _id: '1c', n: 'c'}]},
        "patch": [{"op": "remove", "path": "/roles/_id:1b/n"}],
        "expected": {"foo": 1, roles: [{ _id: '1a', n: 'a'}, { _id: '1b'}, { _id: '1c', n: 'c'}]} },

    { "comment": "remove inside array object element by otherId:value",
        "doc": {"foo": 1, roles: [{ otherId: '1a', n: 'a'}, { otherId: '1b', n: 'b'}, { otherId: '1c', n: 'c'}]},
        "patch": [{"op": "remove", "path": "/roles/otherId:1b/n"}],
        "expected": {"foo": 1, roles: [{ otherId: '1a', n: 'a'}, { otherId: '1b'}, { otherId: '1c', n: 'c'}]} },

]
