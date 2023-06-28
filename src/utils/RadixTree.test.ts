import {RadixTree} from './RadixTree';

describe('RadixTree', () => {
    let radix: RadixTree;
    beforeEach(() => {
        radix = new RadixTree();

        radix.add('big');
        radix.add('bigger');
        radix.add('bill');
        radix.add('good');
        radix.add('gosh');
        radix.add('test');
        radix.add('tent');
        radix.add('testing');
        radix.add('tenting');
        radix.add('totem');
        radix.add('trot');
        radix.add('car');
        radix.add('cat');
        radix.add('cart');
        radix.add('dog');
        radix.add('carton');
    });

    test('should build a proper PATRICIA tree', () => {
        expect(radix.getTreeClone()).toEqual({
            word: null,
            children: {
                bi: {
                    word: null,
                    children: {
                        g: {
                            word: 'big',
                            children: {
                                ger: {
                                    word: 'bigger',
                                    children: {}
                                }
                            }
                        },
                        ll: {
                            word: 'bill',
                            children: {}
                        }
                    }
                },
                go: {
                    word: null,
                    children: {
                        od: {
                            word: 'good',
                            children: {}
                        },
                        sh: {
                            word: 'gosh',
                            children: {}
                        }
                    }
                },
                t: {
                    word: null,
                    children: {
                        e: {
                            word: null,
                            children: {
                                st: {
                                    word: 'test',
                                    children: {
                                        ing: {
                                            word: 'testing',
                                            children: {}
                                        }
                                    }
                                },
                                nt: {
                                    word: 'tent',
                                    children: {
                                        ing: {
                                            word: 'tenting',
                                            children: {}
                                        }
                                    }
                                }
                            }
                        },
                        otem: {
                            word: 'totem',
                            children: {}
                        },
                        rot: {
                            word: 'trot',
                            children: {}
                        }
                    }
                },
                ca: {
                    word: null,
                    children: {
                        r: {
                            word: 'car',
                            children: {
                                t: {
                                    word: 'cart',
                                    children: {
                                        on: {
                                            word: 'carton',
                                            children: {}
                                        }
                                    }
                                }
                            }
                        },
                        t: {
                            word: 'cat',
                            children: {}
                        }
                    }
                },
                dog: {
                    word: 'dog',
                    children: {}
                }
            }
        });
    });

    test('should filter words by prefix', () => {
        expect(radix.filter('te').sort()).toEqual(['test', 'testing', 'tent', 'tenting'].sort());
        expect(radix.filter('t').sort()).toEqual(['test', 'testing', 'tent', 'tenting', 'totem', 'trot'].sort());
        expect(radix.filter('to').sort()).toEqual(['totem'].sort());
        expect(radix.filter('tr').sort()).toEqual(['trot'].sort());
        expect(radix.filter('c').sort()).toEqual(['car', 'cat', 'cart', 'carton'].sort());
        expect(radix.filter('ca').sort()).toEqual(['car', 'cat', 'cart', 'carton'].sort());
        expect(radix.filter('car').sort()).toEqual(['car', 'cart', 'carton'].sort());
        expect(radix.filter("do").sort()).toEqual(["dog"].sort());
    });

    test('should return empty array if no words found', () => {
        expect(radix.filter('z')).toEqual([]);
        expect(radix.filter('xyz')).toEqual([]);
    });

    test('should return all stored words if empty string passed', () => {
        expect(radix.filter('').sort()).toEqual(['big', 'bigger', 'bill', 'good', 'gosh', 'test', 'tent', 'testing', 'tenting', 'totem', 'trot', 'car', 'cat', 'cart', 'dog', 'carton'].sort());
    });

    test('should handle wildcards', () => {
        expect(radix.filter('t*').sort()).toEqual(['test', 'testing', 'tent', 'tenting', 'totem', 'trot'].sort());
        expect(radix.filter('te*').sort()).toEqual(['test', 'testing', 'tent', 'tenting'].sort());
        expect(radix.filter('te*t').sort()).toEqual(['test', 'testing', 'tent', 'tenting'].sort());
        expect(radix.filter('te*ting').sort()).toEqual(['testing', 'tenting'].sort());
        expect(radix.filter('c*r').sort()).toEqual(['car', 'cart', 'carton'].sort());
        expect(radix.filter('t**t').sort()).toEqual(['test', 'testing', 'tent', 'tenting', 'trot'].sort());
    });
});
