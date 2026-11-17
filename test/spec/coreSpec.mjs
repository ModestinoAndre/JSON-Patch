import * as jsonpatch from '../../index.mjs';

describe('jsonpatch.getValueByPointer', function () {
    it('should retrieve values by JSON pointer from tree - deep object', function () {
        const obj = {
            person: {name: 'Marilyn'}
        };
        const name = jsonpatch.getValueByPointer(obj, '/person/name');
        expect(name).toEqual('Marilyn');
    });

    it('should retrieve values by JSON pointer from tree - deep array', function () {
        const obj = {
            people: [{name: 'Marilyn'}, {name: 'Monroe'}]
        };
        const name = jsonpatch.getValueByPointer(obj, '/people/1/name');
        expect(name).toEqual('Monroe');
    });

    it('should retrieve values by JSON pointer from tree - root object', function () {
        const obj = {
            people: [{name: 'Marilyn'}, {name: 'Monroe'}]
        };
        const retrievedObject = jsonpatch.getValueByPointer(obj, '');

        expect(retrievedObject).toEqual({
            people: [{name: 'Marilyn'}, {name: 'Monroe'}]
        });
    });

    it('should retrieve values by JSON pointer from tree - root array', function () {
        const obj = [
            {
                people: [{name: 'Marilyn'}, {name: 'Monroe'}]
            }
        ];
        const retrievedObject = jsonpatch.getValueByPointer(obj, '');

        expect(retrievedObject).toEqual([
            {
                people: [{name: 'Marilyn'}, {name: 'Monroe'}]
            }
        ]);
    });
});

describe('jsonpatch.applyReducer - using with Array#reduce', function () {
    it('should work with Array.reduce on array of patches', function () {
        const obj = {
            hello: 'world'
        };
        const patch = [
            {op: 'replace', path: '/hello', value: 1},
            {op: 'add', path: '/bye', value: {testing: 'isGood'}}
        ];
        const obj2 = patch.reduce(jsonpatch.applyReducer, obj);
        expect(obj2).toEqual({
            hello: 1,
            bye: {testing: 'isGood'}
        });
    });
});

describe('root replacement with applyOperation', function () {
    describe('_get operation', function () {
        it('should get root value', function () {
            const obj = [
                {
                    people: [{name: 'Marilyn'}, {name: 'Monroe'}]
                }
            ];

            const patch = {op: '_get', path: ''};

            jsonpatch.applyOperation(obj, patch);

            expect(patch.value).toEqual([
                {
                    people: [{name: 'Marilyn'}, {name: 'Monroe'}]
                }
            ]);
        });
        it('should get deep value', function () {
            const obj = {
                people: [{name: 'Marilyn'}, {name: 'Monroe'}]
            };

            const patch = {op: '_get', path: '/people/1/name'};

            jsonpatch.applyOperation(obj, patch);

            expect(patch.value).toEqual('Monroe');
        });
    });
    describe('add operation', function () {
        it('should `add` an object (on a json document of type object)) - in place', function () {
            const obj = {
                hello: 'world'
            };
            const newObj = jsonpatch.applyOperation(obj, {
                op: 'add',
                path: '',
                value: {
                    hello: 'universe'
                }
            }).newDocument;

            expect(newObj).toEqual({
                hello: 'universe'
            });
        });
        it('should `add` an object (on a json document of type object) - and return', function () {
            const obj = {
                hello: 'world'
            };
            const newObj = jsonpatch.applyOperation(obj, {
                op: 'add',
                path: '',
                value: {
                    hello: 'universe'
                }
            }).newDocument;
            expect(newObj).toEqual({
                hello: 'universe'
            });
        });
        it('should `add` an object (on a json document of type array) - and return', function () {
            const obj = [
                {
                    hello: 'world'
                }
            ];
            const newObj = jsonpatch.applyOperation(obj, {
                op: 'add',
                path: '',
                value: {
                    hello: 'universe'
                }
            }).newDocument;
            expect(newObj).toEqual({
                hello: 'universe'
            });
        });
        it('should `add` an array (on a json document of type array) - in place', function () {
            const obj = [
                {
                    hello: 'world'
                }
            ];
            const newObj = jsonpatch.applyOperation(obj, {
                op: 'add',
                path: '',
                value: [
                    {
                        hello: 'universe'
                    }
                ]
            }).newDocument;
            expect(newObj).toEqual([
                {
                    hello: 'universe'
                }
            ]);
        });
        it('should `add` an array (on a json document of type array) - and return', function () {
            const obj = [
                {
                    hello: 'world'
                }
            ];
            const newObj = jsonpatch.applyOperation(obj, {
                op: 'add',
                path: '',
                value: [
                    {
                        hello: 'universe'
                    }
                ]
            }).newDocument;
            expect(newObj).toEqual([
                {
                    hello: 'universe'
                }
            ]);
        });
        it('should `add` an array prop', function () {
            const obj = [];

            const newObj = jsonpatch.applyOperation(obj, {
                op: 'add',
                path: '/prop',
                value: 'arrayProp'
            }).newDocument;

            expect(newObj.prop).toEqual('arrayProp');
        });
        it('should `replace` an array prop', function () {
            const obj = [];
            obj.prop = 'oldArrayProp';

            const newObj = jsonpatch.applyOperation(obj, {
                op: 'replace',
                path: '/prop',
                value: 'arrayProp'
            }).newDocument;

            expect(newObj.prop).toEqual('arrayProp');
        });
        it('should `add` an array (on a json document of type object) - and return', function () {
            const obj = {
                hello: 'world'
            };
            const newObj = jsonpatch.applyOperation(obj, {
                op: 'add',
                path: '',
                value: [
                    {
                        hello: 'universe'
                    }
                ]
            }).newDocument;
            expect(newObj).toEqual([
                {
                    hello: 'universe'
                }
            ]);
        });
        it('should `add` a primitive (on a json document of type object) - and return', function () {
            const obj = {
                hello: 'world'
            };
            const newObj = jsonpatch.applyOperation(obj, {
                op: 'add',
                path: '',
                value: 1
            }).newDocument;
            expect(newObj).toEqual(1);
        });
        it('should `add` with a primitive (on a json document of type array) - and return', function () {
            const obj = [
                {
                    hello: 'world'
                }
            ];
            const newObj = jsonpatch.applyOperation(obj, {
                op: 'add',
                path: '',
                value: 1
            }).newDocument;
            expect(newObj).toEqual(1);
        });
    });
    describe('replace operation', function () {
        it('should `replace` with an object (on a json document of type object)', function () {
            const obj = {
                hello: 'world'
            };
            const newObj = jsonpatch.applyOperation(obj, {
                op: 'replace',
                path: '',
                value: {
                    hello: 'universe'
                }
            }).newDocument;
            expect(newObj).toEqual({
                hello: 'universe'
            });
        });
        it('should `replace` with an object (on a json document of type array)', function () {
            const obj = [
                {
                    hello: 'world'
                }
            ];
            const newObj = jsonpatch.applyOperation(obj, {
                op: 'replace',
                path: '',
                value: {
                    hello: 'universe'
                }
            }).newDocument;
            expect(newObj).toEqual({
                hello: 'universe'
            });
        });
        it('should `replace` with an array (on a json document of type array)', function () {
            const obj = [
                {
                    hello: 'world'
                }
            ];
            const newObj = jsonpatch.applyOperation(obj, {
                op: 'replace',
                path: '',
                value: [
                    {
                        hello: 'universe'
                    }
                ]
            }).newDocument;
            expect(newObj).toEqual([
                {
                    hello: 'universe'
                }
            ]);
        });
        it('should `replace` with an array (on a json document of type object)', function () {
            const obj = {
                hello: 'world'
            };
            const newObj = jsonpatch.applyOperation(obj, {
                op: 'replace',
                path: '',
                value: [
                    {
                        hello: 'universe'
                    }
                ]
            }).newDocument;
            expect(newObj).toEqual([
                {
                    hello: 'universe'
                }
            ]);
        });
        it('should `replace` with a primitive (on a json document of type object)', function () {
            const obj = {
                hello: 'world'
            };
            const newObj = jsonpatch.applyOperation(obj, {
                op: 'add',
                path: '',
                value: 1
            }).newDocument;
            expect(newObj).toEqual(1);
        });
        it('should `replace` with a primitive (on a json document of type array)', function () {
            const obj = [
                {
                    hello: 'world'
                }
            ];
            const newObj = jsonpatch.applyOperation(obj, {
                op: 'replace',
                path: '',
                value: 1
            }).newDocument;
            expect(newObj).toEqual(1);
        });
    });
    describe('remove operation', function () {
        it('should `remove` root (on a json document of type array)', function () {
            const obj = [
                {
                    hello: 'world'
                }
            ];
            const newObj = jsonpatch.applyOperation(obj, {
                op: 'remove',
                path: ''
            }).newDocument;
            expect(newObj).toEqual(null);
        });
        it('should `remove` root (on a json document of type object)', function () {
            const obj = {
                hello: 'world'
            };
            const newObj = jsonpatch.applyOperation(obj, {
                op: 'remove',
                path: ''
            }).newDocument;
            expect(newObj).toEqual(null);
        });
    });

    describe('move operation', function () {
        it('should `move` a child of type object to root (on a json document of type object)', function () {
            const obj = {
                child: {name: 'Charles'}
            };
            const newObj = jsonpatch.applyOperation(obj, {
                op: 'move',
                from: '/child',
                path: ''
            }).newDocument;
            expect(newObj).toEqual({name: 'Charles'});
        });
        it('should `move` a child of type object to root (on a json document of type array)', function () {
            const obj = {
                child: [{name: 'Charles'}]
            };
            const newObj = jsonpatch.applyOperation(obj, {
                op: 'move',
                from: '/child/0',
                path: ''
            }).newDocument;
            expect(newObj).toEqual({name: 'Charles'});
        });
        it('should `move` a child of type array to root (on a json document of type object)', function () {
            const obj = {
                child: [{name: 'Charles'}]
            };
            const newObj = jsonpatch.applyOperation(obj, {
                op: 'move',
                from: '/child',
                path: ''
            }).newDocument;
            expect(newObj).toEqual([{name: 'Charles'}]);
        });
    });
    describe('copy operation', function () {
        it('should `copy` a child of type object to root (on a json document of type object) - and return', function () {
            const obj = {
                child: {name: 'Charles'}
            };
            const newObj = jsonpatch.applyOperation(obj, {
                op: 'copy',
                from: '/child',
                path: ''
            }).newDocument;
            expect(newObj).toEqual({name: 'Charles'});
        });
        it('should `copy` a child of type object to root (on a json document of type array) - and return', function () {
            const obj = {
                child: [{name: 'Charles'}]
            };
            const newObj = jsonpatch.applyOperation(obj, {
                op: 'copy',
                from: '/child/0',
                path: ''
            }).newDocument;
            expect(newObj).toEqual({name: 'Charles'});
        });
        it('should `copy` a child of type array to root (on a json document of type object) - and return', function () {
            const obj = {
                child: [{name: 'Charles'}]
            };
            const newObj = jsonpatch.applyOperation(obj, {
                op: 'copy',
                from: '/child',
                path: ''
            }).newDocument;
            expect(newObj).toEqual([{name: 'Charles'}]);
        });
    });
    describe('test operation', function () {
        it('should `test` against root (on a json document of type object) - and return true', function () {
            const obj = {
                hello: 'world'
            };
            const result = jsonpatch.applyOperation(obj, {
                op: 'test',
                path: '',
                value: {
                    hello: 'world'
                }
            }).newDocument;
            expect(result).toEqual(obj);
        });
        it('should `test` against root (on a json document of type object) - and return false', function () {
            const obj = {
                hello: 'world'
            };
            expect(() =>
                jsonpatch.applyOperation(obj, {
                    op: 'test',
                    path: '',
                    value: 1
                })
            ).toThrow();
        });
        it('should `test` against root (on a json document of type array) - and return false', function () {
            const obj = [
                {
                    hello: 'world'
                }
            ];

            expect(() =>
                jsonpatch.applyOperation(obj, {
                    op: 'test',
                    path: '',
                    value: 1
                })
            ).toThrow();
        });
    });
});

/* this is just a copy-paste of original specs, but with using applyOperation, to test for non-root patches */
describe('core - using applyOperation', function () {
    it("shouldn't touch original tree", function () {
        const obj = {
            foo: 1,
            baz: [
                {
                    qux: 'hello'
                }
            ]
        };
        const newObj = jsonpatch.applyOperation(
            obj,
            {
                op: 'add',
                path: '/bar',
                value: [1, 2, 3, 4]
            },
            false,
            false
        ).newDocument;

        expect(obj).toEqual({
            foo: 1,
            baz: [
                {
                    qux: 'hello'
                }
            ]
        });
    });
    it('should apply add', function () {
        let obj = {
            foo: 1,
            baz: [
                {
                    qux: 'hello'
                }
            ]
        };
        let newObj = jsonpatch.applyOperation(obj, {
            op: 'add',
            path: '/bar',
            value: [1, 2, 3, 4]
        }).newDocument;
        expect(newObj).toEqual({
            foo: 1,
            baz: [
                {
                    qux: 'hello'
                }
            ],
            bar: [1, 2, 3, 4]
        });
        newObj = jsonpatch.applyOperation(newObj, {
            op: 'add',
            path: '/baz/0/foo',
            value: 'world'
        }).newDocument;
        expect(newObj).toEqual({
            foo: 1,
            baz: [
                {
                    qux: 'hello',
                    foo: 'world'
                }
            ],
            bar: [1, 2, 3, 4]
        });

        obj = {
            foo: 1,
            baz: [
                {
                    qux: 'hello'
                }
            ]
        };
        newObj = jsonpatch.applyOperation(obj, {
            op: 'add',
            path: '/bar',
            value: true
        }).newDocument;
        expect(newObj).toEqual({
            foo: 1,
            baz: [
                {
                    qux: 'hello'
                }
            ],
            bar: true
        });

        obj = {
            foo: 1,
            baz: [
                {
                    qux: 'hello'
                }
            ]
        };
        newObj = jsonpatch.applyOperation(obj, {
            op: 'add',
            path: '/bar',
            value: false
        }).newDocument;
        expect(newObj).toEqual({
            foo: 1,
            baz: [
                {
                    qux: 'hello'
                }
            ],
            bar: false
        });

        obj = {
            foo: 1,
            baz: [
                {
                    qux: 'hello'
                }
            ]
        };
        newObj = jsonpatch.applyOperation(obj, {
            op: 'add',
            path: '/bar',
            value: null
        }).newDocument;
        expect(newObj).toEqual({
            foo: 1,
            baz: [
                {
                    qux: 'hello'
                }
            ],
            bar: null
        });
    });

    it('should apply add on root', function () {
        const obj = {
            hello: 'world'
        };
        const newObj = jsonpatch.applyOperation(obj, {
            op: 'add',
            path: '',
            value: {
                hello: 'universe'
            }
        }).newDocument;
        expect(newObj).toEqual({
            hello: 'universe'
        });
    });

    it('should apply remove', function () {
        const obj = {
            foo: 1,
            baz: [
                {
                    qux: 'hello'
                }
            ],
            bar: [1, 2, 3, 4]
        };

        let newObj = jsonpatch.applyOperation(obj, {
            op: 'remove',
            path: '/bar'
        }).newDocument;
        expect(newObj).toEqual({
            foo: 1,
            baz: [
                {
                    qux: 'hello'
                }
            ]
        });
        newObj = jsonpatch.applyOperation(newObj, {
            op: 'remove',
            path: '/baz/0/qux'
        }).newDocument;
        expect(newObj).toEqual({
            foo: 1,
            baz: [{}]
        });
    });
    it('should apply replace', function () {
        const obj = {
            foo: 1,
            baz: [
                {
                    qux: 'hello'
                }
            ]
        };
        let newObj = jsonpatch.applyOperation(obj, {
            op: 'replace',
            path: '/foo',
            value: [1, 2, 3, 4]
        }).newDocument;
        expect(newObj).toEqual({
            foo: [1, 2, 3, 4],
            baz: [
                {
                    qux: 'hello'
                }
            ]
        });
        newObj = jsonpatch.applyOperation(newObj, {
            op: 'replace',
            path: '/baz/0/qux',
            value: 'world'
        }).newDocument;
        expect(newObj).toEqual({
            foo: [1, 2, 3, 4],
            baz: [
                {
                    qux: 'world'
                }
            ]
        });
    });
    it('should apply replace on root', function () {
        const obj = {
            hello: 'world'
        };
        const newObj = jsonpatch.applyOperation(obj, {
            op: 'replace',
            path: '',
            value: {
                hello: 'universe'
            }
        }).newDocument;

        expect(newObj).toEqual({
            hello: 'universe'
        });
    });
    it('should apply test', function () {
        const obj = {
            foo: {
                bar: [1, 2, 5, 4]
            },
            bar: {
                a: 'a',
                b: 42,
                c: null,
                d: true
            }
        };
        expect(
            jsonpatch.applyOperation(obj, {
                op: 'test',
                path: '/foo',
                value: {
                    bar: [1, 2, 5, 4]
                }
            }).newDocument
        ).toEqual(obj);

        expect(() =>
            jsonpatch.applyOperation(obj, {
                op: 'test',
                path: '/foo',
                value: 1
            })
        ).toThrow();

        expect(
            jsonpatch.applyOperation(obj, {
                op: 'test',
                path: '/bar',
                value: {
                    d: true,
                    b: 42,
                    c: null,
                    a: 'a'
                }
            }).newDocument
        ).toEqual(obj);
        expect(
            jsonpatch.applyOperation(obj, {
                op: 'test',
                path: '/bar',
                value: obj.bar
            }).newDocument
        ).toEqual(obj);
        expect(
            jsonpatch.applyOperation(obj, {
                op: 'test',
                path: '/bar/a',
                value: 'a'
            }).newDocument
        ).toEqual(obj);
        expect(
            jsonpatch.applyOperation(obj, {
                op: 'test',
                path: '/bar/b',
                value: 42
            }).newDocument
        ).toEqual(obj);
        expect(
            jsonpatch.applyOperation(obj, {
                op: 'test',
                path: '/bar/c',
                value: null
            }).newDocument
        ).toEqual(obj);
        expect(
            jsonpatch.applyOperation(obj, {
                op: 'test',
                path: '/bar/d',
                value: true
            }).newDocument
        ).toEqual(obj);
        expect(() =>
            jsonpatch.applyOperation(obj, {
                op: 'test',
                path: '/bar/d',
                value: false
            })
        ).toThrow();
        expect(() =>
            jsonpatch.applyOperation(obj, {
                op: 'test',
                path: '/bar',
                value: {
                    d: true,
                    b: 42,
                    c: null,
                    a: 'a',
                    foo: 'bar'
                }
            })
        ).toThrow();
    });

    it('should apply test on root', function () {
        const obj = {
            hello: 'world'
        };
        expect(
            jsonpatch.applyOperation(obj, {
                op: 'test',
                path: '',
                value: {
                    hello: 'world'
                }
            }).newDocument
        ).toEqual(obj);
        expect(() =>
            jsonpatch.applyOperation(obj, {
                op: 'test',
                path: '',
                value: 1
            })
        ).toThrow();
    });

    it('should apply move', function () {
        const obj = {
            foo: 1,
            baz: [
                {
                    qux: 'hello'
                }
            ]
        };

        let newObj = jsonpatch.applyOperation(obj, {
            op: 'move',
            from: '/foo',
            path: '/bar'
        }).newDocument;
        expect(newObj).toEqual({
            baz: [
                {
                    qux: 'hello'
                }
            ],
            bar: 1
        });

        newObj = jsonpatch.applyOperation(newObj, {
            op: 'move',
            from: '/baz/0/qux',
            path: '/baz/1'
        }).newDocument;

        expect(newObj).toEqual({
            baz: [{}, 'hello'],
            bar: 1
        });
    });

    it('should apply move on root', function () {
        //investigate if this test is right (https://github.com/Starcounter-Jack/JSON-Patch/issues/40)
        const obj = {
            hello: 'world',
            location: {
                city: 'Vancouver'
            }
        };
        const newObj = jsonpatch.applyOperation(obj, {
            op: 'move',
            from: '/location',
            path: ''
        }).newDocument;

        expect(newObj).toEqual({
            city: 'Vancouver'
        });
    });

    it('should apply copy', function () {
        const obj = {
            foo: 1,
            baz: [
                {
                    qux: 'hello'
                }
            ]
        };

        let newObj = jsonpatch.applyOperation(obj, {
            op: 'copy',
            from: '/foo',
            path: '/bar'
        }).newDocument;

        expect(newObj).toEqual({
            foo: 1,
            baz: [
                {
                    qux: 'hello'
                }
            ],
            bar: 1
        });

        newObj = jsonpatch.applyOperation(newObj, {
            op: 'copy',
            from: '/baz/0/qux',
            path: '/baz/1'
        }).newDocument;

        expect(newObj).toEqual({
            foo: 1,
            baz: [
                {
                    qux: 'hello'
                },
                'hello'
            ],
            bar: 1
        });
    });

    it('should apply copy on root', function () {
        const obj = {
            hello: 'world',
            location: {
                city: 'Vancouver'
            }
        };
        const newObj = jsonpatch.applyOperation(obj, {
            op: 'copy',
            from: '/location',
            path: ''
        }).newDocument;
        expect(newObj).toEqual({
            city: 'Vancouver'
        });
    });
});

describe('core', function () {
    it("shouldn't touch original tree", function () {
        const obj = {
            foo: 1,
            baz: [
                {
                    qux: 'hello'
                }
            ]
        };
        const newObj = jsonpatch.applyPatch(
            obj,
            [
                {
                    op: 'add',
                    path: '/bar',
                    value: [1, 2, 3, 4]
                }
            ],
            false,
            false
        ).newDocument;

        expect(obj).toEqual({
            foo: 1,
            baz: [
                {
                    qux: 'hello'
                }
            ]
        });
    });
    it('should apply add', function () {
        let obj = {
            foo: 1,
            baz: [
                {
                    qux: 'hello'
                }
            ]
        };
        jsonpatch.applyPatch(obj, [
            {
                op: 'add',
                path: '/bar',
                value: [1, 2, 3, 4]
            }
        ]);
        expect(obj).toEqual({
            foo: 1,
            baz: [
                {
                    qux: 'hello'
                }
            ],
            bar: [1, 2, 3, 4]
        });

        jsonpatch.applyPatch(obj, [
            {
                op: 'add',
                path: '/baz/0/foo',
                value: 'world'
            }
        ]);
        expect(obj).toEqual({
            foo: 1,
            baz: [
                {
                    qux: 'hello',
                    foo: 'world'
                }
            ],
            bar: [1, 2, 3, 4]
        });
        obj = {
            foo: 1,
            baz: [
                {
                    qux: 'hello'
                }
            ]
        };
        jsonpatch.applyPatch(obj, [
            {
                op: 'add',
                path: '/bar',
                value: true
            }
        ]);
        expect(obj).toEqual({
            foo: 1,
            baz: [
                {
                    qux: 'hello'
                }
            ],
            bar: true
        });

        obj = {
            foo: 1,
            baz: [
                {
                    qux: 'hello'
                }
            ]
        };
        jsonpatch.applyPatch(obj, [
            {
                op: 'add',
                path: '/bar',
                value: false
            }
        ]);
        expect(obj).toEqual({
            foo: 1,
            baz: [
                {
                    qux: 'hello'
                }
            ],
            bar: false
        });

        obj = {
            foo: 1,
            baz: [
                {
                    qux: 'hello'
                }
            ]
        };
        jsonpatch.applyPatch(obj, [
            {
                op: 'add',
                path: '/bar',
                value: null
            }
        ]);
        expect(obj).toEqual({
            foo: 1,
            baz: [
                {
                    qux: 'hello'
                }
            ],
            bar: null
        });
    });

    it('should apply add on root', function () {
        const obj = {
            hello: 'world'
        };
        const newObj = jsonpatch.applyPatch(obj, [
            {
                op: 'add',
                path: '',
                value: {
                    hello: 'universe'
                }
            }
        ])[0].newDocument;

        expect(newObj).toEqual({
            hello: 'universe'
        });
    });

    it('should apply remove', function () {
        const obj = {
            foo: 1,
            baz: [
                {
                    qux: 'hello'
                }
            ],
            bar: [1, 2, 3, 4]
        };
        //jsonpatch.listenTo(obj,[]);

        jsonpatch.applyPatch(obj, [
            {
                op: 'remove',
                path: '/bar'
            }
        ]);
        expect(obj).toEqual({
            foo: 1,
            baz: [
                {
                    qux: 'hello'
                }
            ]
        });

        jsonpatch.applyPatch(obj, [
            {
                op: 'remove',
                path: '/baz/0/qux'
            }
        ]);
        expect(obj).toEqual({
            foo: 1,
            baz: [{}]
        });
    });

    it('should apply replace', function () {
        const obj = {
            foo: 1,
            baz: [
                {
                    qux: 'hello'
                }
            ]
        };

        jsonpatch.applyPatch(obj, [
            {
                op: 'replace',
                path: '/foo',
                value: [1, 2, 3, 4]
            }
        ]);
        expect(obj).toEqual({
            foo: [1, 2, 3, 4],
            baz: [
                {
                    qux: 'hello'
                }
            ]
        });

        jsonpatch.applyPatch(obj, [
            {
                op: 'replace',
                path: '/baz/0/qux',
                value: 'world'
            }
        ]);
        expect(obj).toEqual({
            foo: [1, 2, 3, 4],
            baz: [
                {
                    qux: 'world'
                }
            ]
        });
    });

    it('should apply replace on root', function () {
        const obj = {
            hello: 'world'
        };
        const newObject = jsonpatch.applyPatch(obj, [
            {
                op: 'replace',
                path: '',
                value: {
                    hello: 'universe'
                }
            }
        ])[0].newDocument;

        expect(newObject).toEqual({
            hello: 'universe'
        });
    });

    it('should apply test', function () {
        const obj = {
            foo: {
                bar: [1, 2, 5, 4]
            },
            bar: {
                a: 'a',
                b: 42,
                c: null,
                d: true
            }
        };
        expect(
            jsonpatch.applyPatch(obj, [
                {
                    op: 'test',
                    path: '/foo',
                    value: {
                        bar: [1, 2, 5, 4]
                    }
                }
            ])[0].test
        ).toBe(true);

        expect(() =>
            jsonpatch.applyPatch(obj, [
                {
                    op: 'test',
                    path: '/foo',
                    value: [1, 2]
                }
            ])
        ).toThrow();

        expect(
            jsonpatch.applyPatch(obj, [
                {
                    op: 'test',
                    path: '/bar',
                    value: {
                        d: true,
                        b: 42,
                        c: null,
                        a: 'a'
                    }
                }
            ])[0].test
        ).toBe(true);

        expect(
            jsonpatch.applyPatch(obj, [
                {
                    op: 'test',
                    path: '/bar',
                    value: obj.bar
                }
            ])[0].test
        ).toBe(true);
        expect(
            jsonpatch.applyPatch(obj, [
                {
                    op: 'test',
                    path: '/bar/a',
                    value: 'a'
                }
            ])[0].test
        ).toBe(true);
        expect(
            jsonpatch.applyPatch(obj, [
                {
                    op: 'test',
                    path: '/bar/b',
                    value: 42
                }
            ])[0].test
        ).toBe(true);
        expect(
            jsonpatch.applyPatch(obj, [
                {
                    op: 'test',
                    path: '/bar/c',
                    value: null
                }
            ])[0].test
        ).toBe(true);
        expect(
            jsonpatch.applyPatch(obj, [
                {
                    op: 'test',
                    path: '/bar/d',
                    value: true
                }
            ])[0].test
        ).toBe(true);
        expect(() =>
            jsonpatch.applyPatch(obj, [
                {
                    op: 'test',
                    path: '/bar/d',
                    value: false
                }
            ])
        ).toThrow();
        expect(() =>
            jsonpatch.applyPatch(obj, [
                {
                    op: 'test',
                    path: '/bar',
                    value: {
                        d: true,
                        b: 42,
                        c: null,
                        a: 'a',
                        foo: 'bar'
                    }
                }
            ])
        ).toThrow();
    });

    it('should apply test on root', function () {
        const obj = {
            hello: 'world'
        };
        expect(
            jsonpatch.applyPatch(obj, [
                {
                    op: 'test',
                    path: '',
                    value: {
                        hello: 'world'
                    }
                }
            ])[0].test
        ).toBe(true);
        expect(() =>
            jsonpatch.applyPatch(obj, [
                {
                    op: 'test',
                    path: '',
                    value: {
                        hello: 'universe'
                    }
                }
            ])
        ).toThrow();
    });

    it('should apply move', function () {
        const obj = {
            foo: 1,
            baz: [
                {
                    qux: 'hello'
                }
            ]
        };

        jsonpatch.applyPatch(obj, [
            {
                op: 'move',
                from: '/foo',
                path: '/bar'
            }
        ]);
        expect(obj).toEqual({
            baz: [
                {
                    qux: 'hello'
                }
            ],
            bar: 1
        });

        jsonpatch.applyPatch(obj, [
            {
                op: 'move',
                from: '/baz/0/qux',
                path: '/baz/1'
            }
        ]);
        expect(obj).toEqual({
            baz: [{}, 'hello'],
            bar: 1
        });
    });

    it('should apply move on root', function () {
        //investigate if this test is right (https://github.com/Starcounter-Jack/JSON-Patch/issues/40)
        const obj = {
            hello: 'world',
            location: {
                city: 'Vancouver'
            }
        };
        const newObj = jsonpatch.applyPatch(obj, [
            {
                op: 'move',
                from: '/location',
                path: ''
            }
        ])[0].newDocument;

        expect(newObj).toEqual({
            city: 'Vancouver'
        });
    });

    it('should apply copy', function () {
        const obj = {
            foo: 1,
            baz: [
                {
                    qux: 'hello'
                }
            ]
        };

        jsonpatch.applyPatch(obj, [
            {
                op: 'copy',
                from: '/foo',
                path: '/bar'
            }
        ]);
        expect(obj).toEqual({
            foo: 1,
            baz: [
                {
                    qux: 'hello'
                }
            ],
            bar: 1
        });

        jsonpatch.applyPatch(obj, [
            {
                op: 'copy',
                from: '/baz/0/qux',
                path: '/baz/1'
            }
        ]);
        expect(obj).toEqual({
            foo: 1,
            baz: [
                {
                    qux: 'hello'
                },
                'hello'
            ],
            bar: 1
        });
    });

    it('should apply copy on root', function () {
        const obj = {
            hello: 'world',
            location: {
                city: 'Vancouver'
            }
        };
        const newObj = jsonpatch.applyPatch(obj, [
            {
                op: 'copy',
                from: '/location',
                path: ''
            }
        ])[0].newDocument;

        expect(newObj).toEqual({
            city: 'Vancouver'
        });
    });

    it('should apply copy, without leaving cross-reference between nodes', function () {
        const obj = {};
        const patchset = [
            {op: 'add', path: '/foo', value: []},
            {op: 'add', path: '/foo/-', value: 1},
            {op: 'copy', from: '/foo', path: '/bar'},
            {op: 'add', path: '/bar/-', value: 2}
        ];

        jsonpatch.applyPatch(obj, patchset);

        expect(obj).toEqual({
            foo: [1],
            bar: [1, 2]
        });
    });

    it('should use value object as a reference', function () {
        const obj1 = {};
        const patch = [{op: 'add', path: '/foo', value: []}];

        jsonpatch.applyPatch(obj1, patch, false);

        expect(obj1.foo).toBe(patch[0].value);
    });

    describe('returning removed elements >', function () {
        let obj;
        beforeEach(function () {
            obj = {
                name: 'jack',
                languages: ['c#', 'haskell', 'python'],
                hobby: 'music'
            };
        });

        it('return removed element when removing from object', function () {
            const result = jsonpatch.applyPatch(obj, [
                {
                    op: 'remove',
                    path: '/name'
                }
            ]);
            expect(result[0].removed).toEqual('jack');
        });
        it('return removed element when replacing in object', function () {
            const result = jsonpatch.applyPatch(obj, [
                {
                    op: 'replace',
                    path: '/name',
                    value: 'john'
                }
            ]);
            expect(result[0].removed).toEqual('jack');
        });
        it('return removed element when moving in object', function () {
            const result = jsonpatch.applyPatch(obj, [
                {
                    op: 'move',
                    from: '/name',
                    path: '/hobby'
                }
            ]);
            expect(result[0].removed).toEqual('music');
        });

        it('return removed element when removing from array', function () {
            const result = jsonpatch.applyPatch(obj, [
                {
                    op: 'remove',
                    path: '/languages/1'
                }
            ]);
            expect(result[0].removed).toEqual('haskell');
        });
        it('return removed element when replacing in array', function () {
            const result = jsonpatch.applyPatch(obj, [
                {
                    op: 'replace',
                    path: '/languages/1',
                    value: 'erlang'
                }
            ]);
            expect(result[0].removed).toEqual('haskell');
        });
        it('return removed element when moving in array', function () {
            const result = jsonpatch.applyPatch(obj, [
                {
                    op: 'move',
                    from: '/hobby',
                    path: '/languages/1'
                }
            ]);
            expect(result[0].removed).toEqual('haskell');
        });
        it('return root when removing root', function () {
            const result = jsonpatch.applyPatch(obj, [
                {
                    op: 'remove',
                    path: ''
                }
            ]);
            expect(result[0].removed).toEqual({
                name: 'jack',
                languages: ['c#', 'haskell', 'python'],
                hobby: 'music'
            });
        });
        it('return root when replacing root', function () {
            const result = jsonpatch.applyPatch(obj, [
                {
                    op: 'replace',
                    path: '',
                    value: {
                        newRoot: 'yes'
                    }
                }
            ]);
            expect(result[0].removed).toEqual({
                name: 'jack',
                languages: ['c#', 'haskell', 'python'],
                hobby: 'music'
            });
        });
        it('return root when moving to root', function () {
            const result = jsonpatch.applyPatch(obj, [
                {
                    op: 'move',
                    from: '/languages',
                    path: ''
                }
            ]);
            expect(result[0].removed).toEqual({
                name: 'jack',
                languages: ['c#', 'haskell', 'python'],
                hobby: 'music'
            });
        });
    });
});

describe('undefined - JS to JSON projection / JSON to JS extension', function () {
    describe('jsonpatch should apply', function () {
        it('add for properties already set to `undefined` in target JS document', function () {
            const obj = {
                hello: 'world',
                nothing: undefined
            };
            jsonpatch.applyPatch(obj, [
                {
                    op: 'add',
                    path: '/nothing',
                    value: 'defined'
                }
            ]);

            expect(obj).toEqual({
                hello: 'world',
                nothing: 'defined'
            });
        });

        it('add for properties with value set to `undefined` (extension)', function () {
            const obj = {
                hello: 'world'
            };
            jsonpatch.applyPatch(obj, [
                {
                    op: 'add',
                    path: '/nothing',
                    value: undefined
                }
            ]);

            expect(obj).toEqual({
                hello: 'world',
                nothing: undefined
            });
        });

        it('remove on element already set to `undefined`, and remove it completely', function () {
            const obj = {
                foo: 1,
                not: undefined
            };

            jsonpatch.applyPatch(obj, [
                {
                    op: 'remove',
                    path: '/not'
                }
            ]);
            expect(obj).toEqual({
                foo: 1
            });
        });
        it('remove on array element set to `undefined`', function () {
            const obj = {
                foo: 1,
                bar: [0, 1, undefined, 3]
            };

            jsonpatch.applyPatch(obj, [
                {
                    op: 'remove',
                    path: '/bar/2'
                }
            ]);
            expect(obj).toEqual({
                foo: 1,
                bar: [0, 1, 3]
            });
        });

        it('replace on element set to `undefined`', function () {
            const obj = {
                foo: 1,
                not: undefined
            };

            jsonpatch.applyPatch(obj, [
                {
                    op: 'replace',
                    path: '/not',
                    value: 'defined'
                }
            ]);
            expect(obj).toEqual({
                foo: 1,
                not: 'defined'
            });
        });
        it('replace on array element set to `undefined`', function () {
            const obj = {
                foo: 1,
                bar: [0, 1, undefined, 3]
            };

            jsonpatch.applyPatch(obj, [
                {
                    op: 'replace',
                    path: '/bar/2',
                    value: 'defined'
                }
            ]);
            expect(obj).toEqual({
                foo: 1,
                bar: [0, 1, 'defined', 3]
            });
        });
        it('replace element with `undefined` (extension)', function () {
            const obj = {
                foo: 1
            };

            jsonpatch.applyPatch(obj, [
                {
                    op: 'replace',
                    path: '/foo',
                    value: undefined
                }
            ]);
            expect(obj).toEqual({
                foo: undefined
            });
        });
        it('replace array element with `undefined` (extension)', function () {
            const obj = {
                foo: 1,
                bar: [0, 1, 2, 3]
            };

            jsonpatch.applyPatch(obj, [
                {
                    op: 'replace',
                    path: '/bar/2',
                    value: undefined
                }
            ]);
            expect(obj).toEqual({
                foo: 1,
                bar: [0, 1, undefined, 3]
            });
        });
        it('test on element set to `undefined`', function () {
            const obj = {
                foo: 1,
                not: undefined
            };
            expect(() =>
                jsonpatch.applyPatch(obj, [
                    {
                        op: 'test',
                        path: '/not',
                        value: 'defined'
                    }
                ])
            ).toThrow();
            expect(
                jsonpatch.applyPatch(obj, [
                    {
                        op: 'test',
                        path: '/not',
                        value: undefined
                    }
                ])[0].test
            ).toBe(true);
        });
        it('test on array element set to `undefined`', function () {
            const obj = {
                foo: 1,
                bar: [0, 1, undefined, 3]
            };
            expect(() =>
                jsonpatch.applyPatch(obj, [
                    {
                        op: 'test',
                        path: '/bar/2',
                        value: 'defined'
                    }
                ])
            ).toThrow();
            expect(() =>
                jsonpatch.applyPatch(obj, [
                    {
                        op: 'test',
                        path: '/bar/2',
                        value: null
                    }
                ])
            ).toThrow();
            expect(
                jsonpatch.applyPatch(obj, [
                    {
                        op: 'test',
                        path: '/bar/2',
                        value: undefined
                    }
                ])[0].test
            ).toBe(true);
        });

        it('move of `undefined`', function () {
            const obj = {
                foo: undefined,
                baz: 'defined'
            };

            jsonpatch.applyPatch(obj, [
                {
                    op: 'move',
                    from: '/foo',
                    path: '/bar'
                }
            ]);
            expect(obj).toEqual({
                baz: 'defined',
                bar: undefined
            });

            jsonpatch.applyPatch(obj, [
                {
                    op: 'move',
                    from: '/bar',
                    path: '/baz'
                }
            ]);
            expect(obj).toEqual({
                baz: undefined
            });
        });

        it('copy of `undefined` as `null` (like `JSON.stringify` does)', function () {
            const obj = {
                foo: undefined,
                baz: 'defined'
            };
            jsonpatch.applyPatch(obj, [
                {
                    op: 'copy',
                    from: '/foo',
                    path: '/bar'
                }
            ]);
            expect(obj).toEqual({
                foo: undefined,
                baz: 'defined',
                bar: null
            });

            jsonpatch.applyPatch(obj, [
                {
                    op: 'copy',
                    from: '/bar',
                    path: '/baz'
                }
            ]);
            expect(obj).toEqual({
                foo: undefined,
                baz: null,
                bar: null
            });
        });

        it(`should allow __proto__ modifications when the banPrototypeModifications flag is set`, function () {
            function SomeClass() {
                this.foo = 'bar';
            }

            let doc = new SomeClass();
            let otherDoc = new SomeClass();

            const patch = [
                {op: 'replace', path: `/__proto__/x`, value: 'polluted'}
            ];

            jsonpatch.applyPatch(doc, patch, false, true, false);

            expect(otherDoc.x).toEqual('polluted');
        });

        it(`should not allow __proto__ modifications without unsetting the banPrototypeModifications flag and should throw an error`, function () {
            const expectedErrorMessage =
                'JSON-Patch: modifying `__proto__` or `constructor/prototype` prop is banned for security reasons, if this was on purpose, please set `banPrototypeModifications` flag false and pass it to this function. More info in fast-json-patch README';

            function SomeClass() {
                this.foo = 'bar';
            }

            let doc = new SomeClass();
            let otherDoc = new SomeClass();

            const patch = [
                {op: 'replace', path: `/__proto__/x`, value: 'polluted'}
            ];

            expect(() => jsonpatch.applyPatch(doc, patch)).toThrow(new TypeError(expectedErrorMessage));

            expect(otherDoc.x).toEqual(undefined);
            expect(doc.x).toEqual(undefined);

            let arr = [];
            expect(() => jsonpatch.applyPatch(arr, patch)).toThrow(new TypeError(expectedErrorMessage));
            expect(arr.x).toEqual(undefined);
        });
    });
});

describe('compare - index array by (_id:value | :value), ', function () {
    it('add element to array', function () {
        const obj = {
            hello: 'world',
            roles: ['a', 'b']
        };
        let obj2 = {
            hello: 'world',
            roles: ['a', 'b', 'c']
        };
        const patches = jsonpatch.compare(obj, obj2);
        expect(patches).toEqual([{op: 'add', path: '/roles/-', value: 'c'}]);

        jsonpatch.applyPatch(obj, patches, true, true);
        expect(obj).toEqual(obj2);
    });

    it('add object element to array', function () {
        const obj = {
            hello: 'world',
            roles: [{_id: '1a', n: 'a'}, {_id: '1b', n: 'b'}]
        };
        let obj2 = {
            hello: 'world',
            roles: [{_id: '1a', n: 'a'}, {_id: '1b', n: 'b'}, {_id: '1c', n: 'c'}]
        };
        const patches = jsonpatch.compare(obj, obj2);
        expect(patches).toEqual([{op: 'add', path: '/roles/-', value: {_id: '1c', n: 'c'}}]);

        jsonpatch.applyPatch(obj, patches, true, true);
        expect(obj).toEqual(obj2);
    });

    it('add duplicate element to array', function () {
        const obj = {
            hello: 'world',
            roles: ['a', 'b']
        };
        const obj2 = jsonpatch.applyPatch(obj, [{op: 'add', path: '/roles/-', value: 'a'}], true, false);
        expect(obj2.newDocument).toEqual(obj);
    });

    it('add duplicate object element to array', function () {
        const obj = {
            hello: 'world',
            roles: [{_id: '1a', n: 'a'}, {_id: '1b', n: 'b'}]
        };
        const obj2 = jsonpatch.applyPatch(obj, [{
            op: 'add',
            path: '/roles/-',
            value: {_id: '1a', n: 'a'}
        }], true, false);
        expect(obj2.newDocument).toEqual(obj);
    });

    it('remove element from array', function () {
        const obj = {
            hello: 'world',
            roles: ['a', 'b', 'c']
        };
        let obj2 = {
            hello: 'world',
            roles: ['a', 'c']
        };
        const patches = jsonpatch.compare(obj, obj2);
        expect(patches).toEqual([{op: 'remove', path: '/roles/:b'}]);

        jsonpatch.applyPatch(obj, patches, true, true);
        expect(obj).toEqual(obj2);
    });

    it('remove object element from array', function () {
        const obj = {
            hello: 'world',
            roles: [{_id: '1a', n: 'a'}, {_id: '1b', n: 'b'}, {_id: '1c', n: 'c'}]
        };
        let obj2 = {
            hello: 'world',
            roles: [{_id: '1a', n: 'a'}, {_id: '1c', n: 'c'}]
        };
        const patches = jsonpatch.compare(obj, obj2);
        expect(patches).toEqual([{op: 'remove', path: '/roles/_id:1b'}]);

        jsonpatch.applyPatch(obj, patches, true, true);
        expect(obj).toEqual(obj2);
    });

    it('replace object element from array', function () {
        const obj = {
            hello: 'world',
            roles: [{_id: '1a', n: 'a'}, {_id: '1b', n: 'b'}, {_id: '1c', n: 'c'}]
        };
        const obj2 = {
            hello: 'world',
            roles: [{_id: '1a', n: 'a'}, {_id: '1d', n: 'd'}, {_id: '1c', n: 'c'}]
        };
        const patches = [{op: 'replace', path: '/roles/_id:1b', value: {_id: '1d', n: 'd'}}]
        jsonpatch.applyPatch(obj, patches, true, true);
        expect(obj).toEqual(obj2);
    });

    it('replace property of object inside from array', function () {
        const obj = {
            hello: 'world',
            roles: [{_id: '1a', n: 'a'}, {_id: '1b', n: 'b'}, {_id: '1c', n: 'c'}]
        };
        const obj2 = {
            hello: 'world',
            roles: [{_id: '1a', n: 'a'}, {_id: '1b', n: 'bb'}, {_id: '1c', n: 'c'}]
        };
        const patches = jsonpatch.compare(obj, obj2);
        expect(patches).toEqual([{op: 'replace', path: '/roles/_id:1b/n', value: 'bb'}]);

        jsonpatch.applyPatch(obj, patches, true, true);
        expect(obj).toEqual(obj2);
    })

    it('order does not matter', function () {
        const obj = {
            hello: 'world',
            roles: [{_id: '1a', n: 'a'}, {_id: '1b', n: 'b'}, {_id: '1c', n: 'c'}]
        };
        const obj2 = {
            hello: 'world',
            roles: [{_id: '1b', n: 'b'}, {_id: '1a', n: 'a'}, {_id: '1c', n: 'c'}]
        };
        const patches = jsonpatch.compare(obj, obj2);
        expect(patches).toEqual([]);
    });

    it('works with numeric _id', function () {
        const obj = {
            hello: 'world',
            roles: [{_id: 1, n: 'a'}, {_id: 2, n: 'b'}, {_id: 3, n: 'c'}]
        };
        const obj2 = {
            hello: 'world',
            roles: [{_id: 2, n: 'b'}, {_id: 1, n: 'a'}, {_id: 3, n: 'c'}]
        };
        const patches = jsonpatch.compare(obj, obj2);
        expect(patches).toEqual([]);
    });

    describe('id not found (without validation)', function () {
        const makeRoles = () => [{_id: '1a', n: 'a'}, {_id: '1b', n: 'b'}, {_id: '1c', n: 'c'}];
        const expectUnresolvable = (fn) => {
            let error;
            try {
                fn();
            } catch (e) {
                error = e;
            }
            expect(error instanceof jsonpatch.JsonPatchError).toBe(true);
            expect(error && error.name).toEqual('OPERATION_PATH_UNRESOLVABLE');
        };

        it('remove is a no-op and does not remove the last element', function () {
            const obj = {roles: makeRoles()};
            const results = jsonpatch.applyPatch(obj, [{op: 'remove', path: '/roles/_id:1x'}]);
            expect(obj.roles).toEqual(makeRoles());
            expect(results[0].removed).toBeUndefined();
        });

        it('remove is a no-op inside a big patch (arrays map)', function () {
            const obj = {roles: makeRoles()};
            const patches = [];
            for (let i = 0; i < 60; i++) {
                patches.push({op: 'remove', path: '/roles/_id:1x'});
            }
            jsonpatch.applyPatch(obj, patches);
            expect(obj.roles).toEqual(makeRoles());
        });

        it('remove of the same id twice only removes it once', function () {
            const obj = {roles: makeRoles()};
            jsonpatch.applyPatch(obj, [{op: 'remove', path: '/roles/_id:1b'}]);
            jsonpatch.applyPatch(obj, [{op: 'remove', path: '/roles/_id:1b'}]);
            expect(obj.roles).toEqual([{_id: '1a', n: 'a'}, {_id: '1c', n: 'c'}]);
        });

        it('replace throws and leaves the array untouched', function () {
            const obj = {roles: makeRoles()};
            expectUnresolvable(() => jsonpatch.applyPatch(obj, [{op: 'replace', path: '/roles/_id:1x', value: {_id: '1x', n: 'x'}}]));
            expect(obj.roles).toEqual(makeRoles());
            expect(obj.roles['-1']).toBeUndefined();
        });

        it('add throws and leaves the array untouched', function () {
            const obj = {roles: makeRoles()};
            expectUnresolvable(() => jsonpatch.applyPatch(obj, [{op: 'add', path: '/roles/_id:1x', value: {_id: '1z', n: 'z'}}]));
            expect(obj.roles).toEqual(makeRoles());
        });

        it('nested path throws JsonPatchError instead of TypeError', function () {
            const obj = {roles: makeRoles()};
            expectUnresolvable(() => jsonpatch.applyPatch(obj, [{op: 'replace', path: '/roles/_id:1x/n', value: 'x'}]));
            expectUnresolvable(() => jsonpatch.applyPatch(obj, [{op: 'remove', path: '/roles/_id:1x/n'}]));
            expect(obj.roles).toEqual(makeRoles());
        });

        it('getValueByPointer still returns undefined', function () {
            const obj = {roles: makeRoles()};
            expect(jsonpatch.getValueByPointer(obj, '/roles/_id:1x')).toBeUndefined();
        });
    });
});

describe('compare - index array by (otherId:value | :value), ', function () {
    class ObjectId {
        getValue;

        constructor(_abc) {
            this.getValue = () => _abc;
        }

        equals(other) {
            return other === this.getValue() || (other instanceof this.constructor && other.getValue() === this.getValue());
        }

        toString() {
            return this.getValue();
        }
    }

    // const idFieldNames = ['otherId', '_id'];
    const idFieldNames = ['_id', 'otherId'];

    it('ObjectId works', function () {
        let a = new ObjectId('123');
        let a2 = new ObjectId('123');
        let b = new ObjectId('000');
        expect(a.equals('123')).toBeTruthy();
        expect(a.equals(a2)).toBeTruthy();
        expect(a.equals(b)).toBeFalsy();
        expect(a.equals('000')).toBeFalsy();
    });

    it('add object element to array', function () {
        const obj = {
            hello: 'world',
            roles: [{otherId: '1a', n: 'a'}, {otherId: '1b', n: 'b'}]
        };
        let obj2 = {
            hello: 'world',
            roles: [{otherId: '1a', n: 'a'}, {otherId: '1b', n: 'b'}, {otherId: '1c', n: 'c'}]
        };
        const patches = jsonpatch.compare(obj, obj2);
        expect(patches).toEqual([{op: 'add', path: '/roles/-', value: {otherId: '1c', n: 'c'}}]);

        jsonpatch.applyPatch(obj, patches, true, true);
        expect(obj).toEqual(obj2);
    });

    it('add duplicate object element to array', function () {
        const obj = {
            hello: 'world',
            roles: [{otherId: '1a', n: 'a'}, {otherId: '1b', n: 'b'}]
        };
        const obj2 = jsonpatch.applyPatch(obj, [{
            op: 'add',
            path: '/roles/-',
            value: {otherId: '1a', n: 'a'}
        }], true, false, true, idFieldNames);
        expect(obj2.newDocument).toEqual(obj);
    });

    it('remove object element from array', function () {
        const obj = {
            hello: 'world',
            roles: [{otherId: '1a', n: 'a'}, {otherId: '1b', n: 'b'}, {otherId: '1c', n: 'c'}]
        };
        let obj2 = {
            hello: 'world',
            roles: [{otherId: '1a', n: 'a'}, {otherId: '1c', n: 'c'}]
        };
        const patches = jsonpatch.compare(obj, obj2, false, idFieldNames);
        expect(patches).toEqual([{op: 'remove', path: '/roles/otherId:1b'}]);

        jsonpatch.applyPatch(obj, patches, true, true);
        expect(obj).toEqual(obj2);
    });

    it('replace object element from array', function () {
        const obj = {
            hello: 'world',
            roles: [{otherId: '1a', n: 'a'}, {otherId: '1b', n: 'b'}, {otherId: '1c', n: 'c'}]
        };
        const obj2 = {
            hello: 'world',
            roles: [{otherId: '1a', n: 'a'}, {otherId: '1d', n: 'd'}, {otherId: '1c', n: 'c'}]
        };
        const patches = [{op: 'replace', path: '/roles/otherId:1b', value: {otherId: '1d', n: 'd'}}]
        jsonpatch.applyPatch(obj, patches, true, true);
        expect(obj).toEqual(obj2);
    });

    it('replace property of object inside from array', function () {
        const obj = {
            hello: 'world',
            roles: [{otherId: '1a', n: 'a'}, {otherId: '1b', n: 'b'}, {otherId: '1c', n: 'c'}]
        };
        const obj2 = {
            hello: 'world',
            roles: [{otherId: '1a', n: 'a'}, {otherId: '1b', n: 'bb'}, {otherId: '1c', n: 'c'}]
        };
        const patches = jsonpatch.compare(obj, obj2, false, idFieldNames);
        expect(patches).toEqual([{op: 'replace', path: '/roles/otherId:1b/n', value: 'bb'}]);

        jsonpatch.applyPatch(obj, patches, true, true);
        expect(obj).toEqual(obj2);
    });

    it('order does not matter', function () {
        const obj = {
            hello: 'world',
            roles: [{otherId: '1a', n: 'a'}, {otherId: '1b', n: 'b'}, {otherId: '1c', n: 'c'}]
        };
        const obj2 = {
            hello: 'world',
            roles: [{otherId: '1b', n: 'b'}, {otherId: '1a', n: 'a'}, {otherId: '1c', n: 'c'}]
        };
        const patches = jsonpatch.compare(obj, obj2, false, idFieldNames);
        expect(patches).toEqual([]);
    });

    it('works with numeric otherId', function () {
        const obj = {
            hello: 'world',
            roles: [{otherId: 1, n: 'a'}, {otherId: 2, n: 'b'}, {otherId: 3, n: 'c'}]
        };
        const obj2 = {
            hello: 'world',
            roles: [{otherId: 2, n: 'b'}, {otherId: 1, n: 'a'}, {otherId: 3, n: 'c'}]
        };
        const patches = jsonpatch.compare(obj, obj2, false, idFieldNames);
        expect(patches).toEqual([]);
    });

    it('works with ObjectId: compare', function () {
        const obj = {
            hello: 'world',
            roles: [{_id: '1', n: 'a'}, {_id: '2', n: 'b'}, {_id: '3', n: 'c'}]
        };
        const obj2 = {
            hello: 'world',
            roles: [{_id: new ObjectId('2'), n: 'b'}, {_id: '1', n: 'a'}, {_id: '3', n: 'c'}]
        };
        const patches = jsonpatch.compare(obj, obj2, false);
        expect(patches).toEqual([]);
    });

    it('works with ObjectId: replace inside object', function () {
        const obj = {
            hello: 'world',
            roles: [{_id: '1', n: 'a'}, {_id: '2', n: 'b'}, {_id: '3', n: 'c'}]
        };
        const obj2 = {
            hello: 'world',
            roles: [{_id: new ObjectId('2'), n: 'bb'}, {_id: '1', n: 'a'}, {_id: '3', n: 'c'}]
        };
        const patches = jsonpatch.compare(obj, obj2, false);
        expect(patches).toEqual([{op: 'replace', path: '/roles/_id:2/n', value: 'bb'}]);
    });

    it('works with ObjectId: replace inside object', function () {
        const obj2 = {
            hello: 'world',
            roles: [{_id: new ObjectId('2'), n: 'b'}, {_id: '1', n: 'a'}, {_id: '3', n: 'c'}]
        };
        expect(obj2.roles[0].n).toBe('b');
        jsonpatch.applyPatch(obj2, [{op: 'replace', path: '/roles/_id:2/n', value: 'bb'}], false, true);
        expect(obj2.roles[0].n).toBe('bb');
    });

    it('works with ObjectId: remove inside object', function () {
        const obj2 = {
            hello: 'world',
            roles: [{_id: new ObjectId('2'), n: 'b'}, {_id: '1', n: 'a'}, {_id: '3', n: 'c'}]
        };
        jsonpatch.applyPatch(obj2, [{op: 'remove', path: '/roles/_id:2'}], false, true);
        expect(obj2.roles.length).toBe(2);
        expect(obj2.roles[0].n).toBe('a');
        expect(obj2.roles[1].n).toBe('c');
    });

});
describe('audit regressions - applying patches', function () {
    const errorName = (fn) => {
        try {
            fn();
        } catch (e) {
            return e instanceof jsonpatch.JsonPatchError ? e.name : 'NOT_A_JSON_PATCH_ERROR: ' + e;
        }
        return 'DID_NOT_THROW';
    };
    const manyOps = (operation, count = 60) => {
        const patches = [];
        for (let i = 0; i < count; i++) {
            patches.push(Object.assign({}, operation));
        }
        return patches;
    };

    describe('ids containing ":"', function () {
        it('addresses the right element when one id is the prefix of another', function () {
            const obj = {r: [{_id: 'u', n: 0}, {_id: 'u:2', n: 2}]};
            jsonpatch.applyPatch(obj, [{op: 'replace', path: '/r/_id:u:2/n', value: 9}]);
            expect(obj.r).toEqual([{_id: 'u', n: 0}, {_id: 'u:2', n: 9}]);
        });

        it('removes the right element', function () {
            const obj = {r: [{_id: 'u:1'}, {_id: 'u:2'}, {_id: 'u:3'}]};
            jsonpatch.applyPatch(obj, [{op: 'remove', path: '/r/_id:u:2'}]);
            expect(obj.r).toEqual([{_id: 'u:1'}, {_id: 'u:3'}]);
        });

        it('works with validation on', function () {
            const obj = {r: [{_id: 'u:1', n: 1}, {_id: 'u:2', n: 2}]};
            jsonpatch.applyPatch(obj, [{op: 'replace', path: '/r/_id:u:2/n', value: 9}], true);
            expect(obj.r[1].n).toEqual(9);
        });

        it('works in a big patch (arrays map)', function () {
            const obj = {r: [{_id: 'u', n: 0}, {_id: 'u:2', n: 2}]};
            jsonpatch.applyPatch(obj, manyOps({op: 'replace', path: '/r/_id:u:2/n', value: 9}));
            expect(obj.r).toEqual([{_id: 'u', n: 0}, {_id: 'u:2', n: 9}]);
        });

        it('addresses primitive elements containing ":"', function () {
            const obj = {r: ['a', 'a:c']};
            jsonpatch.applyPatch(obj, [{op: 'remove', path: '/r/:a:c'}]);
            expect(obj.r).toEqual(['a']);
        });

        it('getValueByPointer resolves them', function () {
            const obj = {r: [{_id: 'u', n: 0}, {_id: 'u:2', n: 2}]};
            expect(jsonpatch.getValueByPointer(obj, '/r/_id:u:2/n')).toEqual(2);
        });
    });

    describe('id matching', function () {
        it('matches a numeric id with the string in the path', function () {
            const obj = {r: [{_id: 1}, {_id: 2}]};
            jsonpatch.applyPatch(obj, [{op: 'remove', path: '/r/_id:2'}]);
            expect(obj.r).toEqual([{_id: 1}]);
        });

        it('does not match by loose equality (true is not 1)', function () {
            const obj = {r: [{_id: true}, {_id: 1}]};
            jsonpatch.applyPatch(obj, [{op: 'remove', path: '/r/_id:1'}]);
            expect(obj.r).toEqual([{_id: true}]);
        });

        it('does not match a primitive by loose equality', function () {
            const obj = {r: [true, 1]};
            jsonpatch.applyPatch(obj, [{op: 'remove', path: '/r/:1'}]);
            expect(obj.r).toEqual([true]);
        });

        it('matches ids that expose equals() (ObjectId like)', function () {
            class Id {
                constructor(v) { this.v = v; }
                equals(other) { return (other instanceof Id ? other.v : other) === this.v; }
                toString() { return 'Id(' + this.v + ')'; }
            }
            const obj = {r: [{_id: new Id('aa'), n: 1}, {_id: new Id('bb'), n: 2}]};
            jsonpatch.applyPatch(obj, [{op: 'replace', path: '/r/_id:bb/n', value: 9}]);
            expect(obj.r[0].n).toEqual(1);
            expect(obj.r[1].n).toEqual(9);
        });

        it('ignores an id whose "equals" property is not a function', function () {
            const obj = {r: [{_id: {equals: 1}}, {_id: 'x'}]};
            jsonpatch.applyPatch(obj, [{op: 'remove', path: '/r/_id:x'}]);
            expect(obj.r).toEqual([{_id: {equals: 1}}]);
        });

        it('skips null and undefined elements', function () {
            const obj = {r: [null, undefined, {_id: 'x'}, {_id: 'y'}]};
            jsonpatch.applyPatch(obj, [{op: 'remove', path: '/r/_id:x'}]);
            expect(obj.r).toEqual([null, undefined, {_id: 'y'}]);
        });

        it('skips null elements in a big patch (arrays map)', function () {
            const obj = {r: [null, {_id: 'x', n: 0}]};
            jsonpatch.applyPatch(obj, manyOps({op: 'replace', path: '/r/_id:x/n', value: 5}));
            expect(obj.r).toEqual([null, {_id: 'x', n: 5}]);
        });

        it('with duplicated ids the first element wins, in small and big patches', function () {
            const small = {r: [{_id: 1, n: 'a'}, {_id: 1, n: 'b'}]};
            jsonpatch.applyPatch(small, [{op: 'replace', path: '/r/_id:1/n', value: 'z'}]);
            const big = {r: [{_id: 1, n: 'a'}, {_id: 1, n: 'b'}]};
            jsonpatch.applyPatch(big, manyOps({op: 'replace', path: '/r/_id:1/n', value: 'z'}));
            expect(small.r).toEqual([{_id: 1, n: 'z'}, {_id: 1, n: 'b'}]);
            expect(big.r).toEqual(small.r);
        });

        it('an id named like an Object.prototype member is handled in a big patch', function () {
            const obj = {r: [{_id: '__proto__', n: 0}, {_id: 'constructor', n: 0}, {_id: 'b', n: 0}]};
            const patches = manyOps({op: 'replace', path: '/r/_id:__proto__/n', value: 1}, 30)
                .concat(manyOps({op: 'replace', path: '/r/_id:constructor/n', value: 2}, 30));
            jsonpatch.applyPatch(obj, patches);
            expect(obj.r).toEqual([{_id: '__proto__', n: 1}, {_id: 'constructor', n: 2}, {_id: 'b', n: 0}]);
            expect(({}).item).toBeUndefined();
            expect(({}).index).toBeUndefined();
        });
    });

    describe('big patches (arrays map) give the same result as one operation at a time', function () {
        it('mixing add, remove and replace on the same array', function () {
            const makeDoc = () => {
                const r = [];
                for (let i = 0; i < 40; i++) {
                    r.push({_id: 'id' + i, n: i});
                }
                return {r};
            };
            const patches = [];
            for (let i = 0; i < 40; i++) {
                if (i % 3 === 0) {
                    patches.push({op: 'remove', path: '/r/_id:id' + i});
                } else {
                    patches.push({op: 'replace', path: '/r/_id:id' + i + '/n', value: i * 10});
                }
                patches.push({op: 'add', path: '/r/0', value: {_id: 'new' + i, n: -i}});
                patches.push({op: 'replace', path: '/r/_id:new' + i + '/n', value: i});
            }
            patches.push({op: 'remove', path: '/r/_id:id0'}); // already removed
            expect(patches.length).toBeGreaterThan(50);

            const atOnce = makeDoc();
            jsonpatch.applyPatch(atOnce, jsonpatch.deepClone(patches));
            const oneByOne = makeDoc();
            patches.forEach(p => jsonpatch.applyPatch(oneByOne, [jsonpatch.deepClone(p)]));

            expect(atOnce).toEqual(oneByOne);
            expect(atOnce.r.length).toEqual(40 - 14 + 40);
        });
    });

    describe('array indexes that cannot address an element (without validation)', function () {
        ['4294967295', '99999999999999999999', ''].forEach(function (segment) {
            const path = '/r/' + segment;

            it('remove ' + JSON.stringify(path) + ' is a no-op', function () {
                const obj = {r: [1, 2, 3]};
                jsonpatch.applyPatch(obj, [{op: 'remove', path}]);
                expect(obj.r).toEqual([1, 2, 3]);
            });

            it('replace and add at ' + JSON.stringify(path) + ' throw and change nothing', function () {
                const obj = {r: [1, 2, 3]};
                expect(errorName(() => jsonpatch.applyPatch(obj, [{op: 'replace', path, value: 9}]))).toEqual('OPERATION_PATH_UNRESOLVABLE');
                expect(errorName(() => jsonpatch.applyPatch(obj, [{op: 'add', path, value: 9}]))).toEqual('OPERATION_PATH_UNRESOLVABLE');
                expect(obj.r).toEqual([1, 2, 3]);
                expect(Object.keys(obj.r)).toEqual(['0', '1', '2']);
            });

            it('nested path through ' + JSON.stringify(path) + ' throws', function () {
                const obj = {r: [{n: 1}, {n: 2}]};
                expect(errorName(() => jsonpatch.applyPatch(obj, [{op: 'replace', path: path + '/n', value: 9}]))).toEqual('OPERATION_PATH_UNRESOLVABLE');
                expect(obj.r).toEqual([{n: 1}, {n: 2}]);
            });
        });

        it('replace beyond the end of the array throws instead of growing the array', function () {
            ['3', '99', '2147483648', '4000000000'].forEach(function (segment) {
                const obj = {r: [1, 2, 3]};
                expect(errorName(() => jsonpatch.applyPatch(obj, [{op: 'replace', path: '/r/' + segment, value: 9}]))).toEqual('OPERATION_PATH_UNRESOLVABLE');
                expect(obj.r.length).toEqual(3);
                expect(obj.r).toEqual([1, 2, 3]);
            });
        });

        it('remove and add beyond the end of the array do not grow it', function () {
            const obj = {r: [1, 2, 3]};
            jsonpatch.applyPatch(obj, [{op: 'remove', path: '/r/2147483648'}, {op: 'remove', path: '/r/99'}]);
            expect(obj.r).toEqual([1, 2, 3]);
            jsonpatch.applyPatch(obj, [{op: 'add', path: '/r/2147483648', value: 4}]);
            expect(obj.r).toEqual([1, 2, 3, 4]);
            expect(errorName(() => jsonpatch.applyPatch(obj, [{op: 'add', path: '/r/2147483648', value: 5}], true))).toEqual('OPERATION_VALUE_OUT_OF_BOUNDS');
        });

        it('a regular index still works, including leading zeros and a 9 digit index', function () {
            const obj = {r: [1, 2, 3]};
            jsonpatch.applyPatch(obj, [{op: 'remove', path: '/r/01'}]);
            expect(obj.r).toEqual([1, 3]);
            jsonpatch.applyPatch(obj, [{op: 'remove', path: '/r/123456789'}]);
            expect(obj.r).toEqual([1, 3]);
        });

        it('an empty segment is rejected with validation on', function () {
            const obj = {r: [1, 2, 3]};
            expect(errorName(() => jsonpatch.applyPatch(obj, [{op: 'remove', path: '/r/'}], true))).toEqual('OPERATION_PATH_UNRESOLVABLE');
            expect(obj.r).toEqual([1, 2, 3]);
        });
    });

    describe('move and copy from an array element that does not exist', function () {
        it('move throws and changes nothing', function () {
            const obj = {r: [{_id: 'a'}], o: {}};
            expect(errorName(() => jsonpatch.applyPatch(obj, [{op: 'move', from: '/r/_id:zz', path: '/o/k'}]))).toEqual('OPERATION_FROM_UNRESOLVABLE');
            expect(obj).toEqual({r: [{_id: 'a'}], o: {}});
            expect('k' in obj.o).toBe(false);
        });

        it('copy throws and changes nothing', function () {
            const obj = {r: [{_id: 'a'}], o: {}};
            expect(errorName(() => jsonpatch.applyPatch(obj, [{op: 'copy', from: '/r/_id:zz', path: '/o/k'}]))).toEqual('OPERATION_FROM_UNRESOLVABLE');
            expect('k' in obj.o).toBe(false);
        });

        it('move and copy to the root throw', function () {
            const obj = {r: [{_id: 'a'}]};
            expect(errorName(() => jsonpatch.applyPatch(obj, [{op: 'move', from: '/r/_id:zz', path: ''}]))).toEqual('OPERATION_FROM_UNRESOLVABLE');
            expect(errorName(() => jsonpatch.applyPatch(obj, [{op: 'copy', from: '/r/4294967295', path: ''}]))).toEqual('OPERATION_FROM_UNRESOLVABLE');
        });

        it('move and copy by id work when the element exists', function () {
            const obj = {r: [{_id: 'a'}, {_id: 'b'}], o: {}};
            jsonpatch.applyPatch(obj, [
                {op: 'copy', from: '/r/_id:a', path: '/o/copied'},
                {op: 'move', from: '/r/_id:b', path: '/o/moved'}
            ]);
            expect(obj).toEqual({r: [{_id: 'a'}], o: {copied: {_id: 'a'}, moved: {_id: 'b'}}});
            expect(obj.o.copied).not.toBe(obj.r[0]);
        });
    });

    describe('prototype chain', function () {
        const expectBanned = (document, operation) => {
            let error;
            try {
                jsonpatch.applyPatch(document, [operation]);
            } catch (e) {
                error = e;
            }
            expect(error instanceof TypeError).toBe(true);
            expect(error && error.message).toContain('banned for security reasons');
        };

        it('does not overwrite Object.keys through /constructor/keys', function () {
            const original = Object.keys;
            try {
                expectBanned({}, {op: 'replace', path: '/constructor/keys', value: 'pwned'});
                expect(Object.keys).toBe(original);
            } finally {
                Object.keys = original;
            }
        });

        it('does not overwrite Array.isArray through an array constructor', function () {
            const original = Array.isArray;
            try {
                expectBanned({r: []}, {op: 'add', path: '/r/constructor/isArray', value: 'pwned'});
                expect(Array.isArray).toBe(original);
            } finally {
                Array.isArray = original;
            }
        });

        it('does not write into inherited methods', function () {
            try {
                expectBanned({a: {}}, {op: 'add', path: '/a/toString/x', value: 'pwned'});
                expect(Object.prototype.toString.x).toBeUndefined();
            } finally {
                delete Object.prototype.toString.x;
            }
        });

        it('does not read through inherited functions in `from`', function () {
            expectBanned({a: {}}, {op: 'copy', from: '/a/constructor/name', path: '/b'});
        });

        it('bans __proto__ and constructor/prototype after an id segment and in `from`', function () {
            expectBanned({r: [{_id: 'a'}]}, {op: 'add', path: '/r/_id:a/__proto__/x', value: 1});
            expectBanned({r: [{_id: 'a'}]}, {op: 'add', path: '/r/_id:a/constructor/prototype/x', value: 1});
            expectBanned({a: {}}, {op: 'copy', from: '/a/__proto__', path: '/b'});
            expect(({}).x).toBeUndefined();
        });

        it('an own property called "constructor" is still patchable', function () {
            const obj = {constructor: {keys: 1}};
            jsonpatch.applyPatch(obj, [{op: 'replace', path: '/constructor/keys', value: 2}]);
            expect(obj.constructor.keys).toEqual(2);
        });
    });

    describe('malformed operations throw JsonPatchError even without validation', function () {
        it('unknown op', function () {
            expect(errorName(() => jsonpatch.applyPatch({a: 1}, [{op: 'foo', path: '/a'}]))).toEqual('OPERATION_OP_INVALID');
        });

        ['constructor', 'toString', 'hasOwnProperty', '__proto__'].forEach(function (op) {
            it('op named like an inherited property: ' + op, function () {
                const obj = {a: 1};
                expect(errorName(() => jsonpatch.applyPatch(obj, [{op, path: '/a'}]))).toEqual('OPERATION_OP_INVALID');
                expect(errorName(() => jsonpatch.applyPatch(obj, [{op, path: '/a'}], true))).toEqual('OPERATION_OP_INVALID');
                const error = jsonpatch.validate([{op, path: '/a'}]);
                expect(error && error.name).toEqual('OPERATION_OP_INVALID');
                expect(obj).toEqual({a: 1});
            });
        });

        it('missing path', function () {
            const obj = {a: [1]};
            expect(errorName(() => jsonpatch.applyPatch(obj, [{op: 'remove'}]))).toEqual('OPERATION_PATH_INVALID');
            expect(errorName(() => jsonpatch.applyPatch(obj, [{op: 'remove', path: 5}]))).toEqual('OPERATION_PATH_INVALID');
            expect(obj).toEqual({a: [1]});
        });

        it('path through a property that does not exist', function () {
            const obj = {a: 1, n: null};
            expect(errorName(() => jsonpatch.applyPatch(obj, [{op: 'add', path: '/x/y/z', value: 1}]))).toEqual('OPERATION_PATH_UNRESOLVABLE');
            expect(errorName(() => jsonpatch.applyPatch(obj, [{op: 'replace', path: '/n/y', value: 1}]))).toEqual('OPERATION_PATH_UNRESOLVABLE');
            expect(obj).toEqual({a: 1, n: null});
        });
    });

    describe('test operation', function () {
        it('compares values that have a key called "hasOwnProperty"', function () {
            const obj = {a: {hasOwnProperty: 1}};
            jsonpatch.applyPatch(obj, [{op: 'test', path: '/a', value: {hasOwnProperty: 1}}], true);
            expect(errorName(() => jsonpatch.applyPatch(obj, [{op: 'test', path: '/a', value: {hasOwnProperty: 2}}]))).toEqual('TEST_OPERATION_FAILED');
            expect(errorName(() => jsonpatch.applyPatch(obj, [{op: 'test', path: '/a', value: {other: 1}}]))).toEqual('TEST_OPERATION_FAILED');
        });

        it('by id passes and fails as expected', function () {
            const obj = {r: [{_id: 'a', n: 1}]};
            jsonpatch.applyPatch(obj, [{op: 'test', path: '/r/_id:a/n', value: 1}]);
            expect(errorName(() => jsonpatch.applyPatch(obj, [{op: 'test', path: '/r/_id:a/n', value: 2}]))).toEqual('TEST_OPERATION_FAILED');
            expect(errorName(() => jsonpatch.applyPatch(obj, [{op: 'test', path: '/r/_id:zz', value: 2}]))).toEqual('OPERATION_PATH_UNRESOLVABLE');
        });
    });

    describe('documented fork semantics', function () {
        it('add of a primitive that is already in the array is ignored (arrays of primitives are sets)', function () {
            const obj = {r: [7, 5]};
            jsonpatch.applyPatch(obj, [{op: 'add', path: '/r/-', value: 5}, {op: 'add', path: '/r/0', value: 5}]);
            expect(obj.r).toEqual([7, 5]);
        });

        it('add of an object whose _id is already in the array is ignored, even with other content', function () {
            const obj = {r: [{_id: 1, n: 'old'}]};
            jsonpatch.applyPatch(obj, [{op: 'add', path: '/r/-', value: {_id: 1, n: 'new'}}]);
            expect(obj.r).toEqual([{_id: 1, n: 'old'}]);
        });

        it('add is idempotent by a custom id field only when idFieldNames is given', function () {
            const patch = () => [{op: 'add', path: '/r/-', value: {id: 1, n: 'new'}}];
            const withCustom = {r: [{id: 1, n: 'old'}]};
            jsonpatch.applyPatch(withCustom, patch(), false, true, true, ['id']);
            expect(withCustom.r).toEqual([{id: 1, n: 'old'}]);
            const withDefault = {r: [{id: 1, n: 'old'}]};
            jsonpatch.applyPatch(withDefault, patch());
            expect(withDefault.r).toEqual([{id: 1, n: 'old'}, {id: 1, n: 'new'}]);
        });

        it('a path can address an element by any field, whatever idFieldNames is', function () {
            const obj = {r: [{_id: 1, role: 'user'}, {_id: 2, role: 'admin'}]};
            jsonpatch.applyPatch(obj, [{op: 'remove', path: '/r/role:admin'}]);
            expect(obj.r).toEqual([{_id: 1, role: 'user'}]);
        });

        it('mutateDocument = false leaves the original untouched when an operation fails', function () {
            const obj = {r: [{_id: 'a', n: 1}]};
            expect(errorName(() => jsonpatch.applyPatch(obj, [
                {op: 'replace', path: '/r/_id:a/n', value: 2},
                {op: 'replace', path: '/r/_id:zz/n', value: 3}
            ], false, false))).toEqual('OPERATION_PATH_UNRESOLVABLE');
            expect(obj).toEqual({r: [{_id: 'a', n: 1}]});
        });
    });

    describe('deepClone', function () {
        it('keeps BigInt values', function () {
            const source = {n: BigInt(1), l: [BigInt(2), undefined], o: {u: undefined, d: new Date(0)}};
            const clone = jsonpatch.deepClone(source);
            expect(clone.n).toBe(BigInt(1));
            expect(clone.l[0]).toBe(BigInt(2));
            expect(clone.l[1]).toBe(null);
            expect('u' in clone.o).toBe(false);
            expect(clone.o.d).toEqual('1970-01-01T00:00:00.000Z');
            expect(clone).not.toBe(source);
        });
    });
});
