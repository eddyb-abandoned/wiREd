/** @file arch-x86.js This file was auto-generated */
var util = require('util');
var known = exports.known = function known(x) {
    return typeof x === 'number';
}
var bitsof = exports.bitsof = function bitsof(x) {
    if(typeof x === 'object' && 'bitsof' in x)
        return x.bitsof;
    throw new TypeError('Missing bit size for '+inspect(x));
}
var sizeof = exports.sizeof = function sizeof(x) {
    return Math.ceil(bitsof(x)/8);
}
var valueof = exports.valueof = function valueof(x) {
    if(known(x))
        return x;
    var v = x.value;
    if(v === null || v === void 0)
        return x;
    return v;
}
var lvalueof = exports.lvalueof = function lvalueof(x) {
    if(typeof x !== 'object' || !('lvalue' in x))
        return valueof(x);
    var v = x.lvalue;
    if(v === null || v === void 0)
        return x;
    return v;
}
var inspect = exports.inspect = function inspect(x, p) {
    if(known(x) && x >= 100)
        return '0x'+x.toString(16);
    if(typeof x === 'object' && x.inspect)
        return x.inspect(0, p || 16);
    return util.inspect(x);
}
var uint = [], int = [];
function Nop() {
    var args = [].slice.call(arguments);
    return {
        constructor: Nop, fn: 'Nop', args: args,
        get value() {
            var changes = false, v = args.map(function(x) {
                var v = valueof(x);
                if(v !== x)
                    changes = true;
                return v;
            });
            if(changes) return Nop.apply(null, v);
        },
        inspect: function() {
            return 'Nop('+args.map(function(x) {return inspect(x);}).join(', ')+')';
        }
    };
}
function Interrupt() {
    var args = [].slice.call(arguments);
    return {
        constructor: Interrupt, fn: 'Interrupt', args: args,
        get value() {
            var changes = false, v = args.map(function(x) {
                var v = valueof(x);
                if(v !== x)
                    changes = true;
                return v;
            });
            if(changes) return Interrupt.apply(null, v);
        },
        inspect: function() {
            return 'Interrupt('+args.map(function(x) {return inspect(x);}).join(', ')+')';
        }
    };
}
var If = exports.If = function If(cond, then) {
    if(known(cond)) return cond ? then : Nop();
    return {
        constructor: If, fn: 'If', cond: cond, then: then,
        get value() {
            var vcond = valueof(cond);
            if(vcond !== cond) {
                if(known(vcond)) return cond ? valueof(then) : Nop();
                return If(vcond, then);
            }
        },
        inspect: function() {
            return 'if('+inspect(cond)+') '+inspect(then)+';';
        }
    };
};

var Mem = exports.Mem = function Mem(a) {
    return {
        constructor: Mem, fn: 'Mem', a: a,
        get lvalue() {
            var v = valueof(a);
            if(v !== a) return Mem(v);
        },
        get value() {
            var v = valueof(a), m = Mem.read(v, bitsof(this));
            if(m !== null && m !== void 0)
                return m;
            if(v !== a) return Mem(v);
        },
        set value(v) {
            return Mem.write(valueof(a), bitsof(this), v);
        },
        inspect: function() {
            return '['+inspect(a)+']'+(this.bitsof || '');
        }
    };
};
Mem.read = function(address, bits) {
    console.error('Non-implemented Mem read ['+inspect(address)+']'+bits);
};
Mem.write = function(address, bits, value) {
    console.error('Non-implemented Mem write ['+inspect(address)+']'+bits+' = '+inspect(value));
};

function Not(a) {
    if(known(a)) return ~a;
    if(a.op == '~') return a.a;
    return {
        constructor: Not, fn: 'Not', op: '~', a: a,
        get value() {
            var v = valueof(a);
            if(v !== a) return Not(v);
        },
        inspect: function(_, p) {
            if(this.bitsof == 1 && a.op == '==') {
                var expr = inspect(a.a, 7)+' != '+inspect(a.b, 7);
                return 7 <= p ? expr : '('+expr+')'
            }
            if(this.bitsof == 1 && a.op == '<') {
                var expr = inspect(a.a, 6)+' >= '+inspect(a.b, 6);
                return 6 <= p ? expr : '('+expr+')'
            }
            var expr = '~'+inspect(a, 2);
            return 2 <= p ? expr : '('+expr+')';
        }
    };
}
function Neg(a) {
    if(known(a)) return -a;
    if(a.op == '-') return a.a;
    return {
        constructor: Neg, fn: 'Neg', op: '-', a: a,
        get value() {
            var v = valueof(a);
            if(v !== a) return Neg(v);
        },
        inspect: function(_, p) {
            var expr = '-'+inspect(a, 2);
            return 2 <= p ? expr : '('+expr+')';
        }
    };
}
var Mov = exports.Mov = function Mov(a, b) {
    return {
        constructor: Mov, fn: 'Mov', op: '=', a: a, b: b, bitsof: 1,
        get value() {
            var va = lvalueof(a), vb = valueof(b);
            if(va !== a || vb !== b) return Mov(va, vb);
        },
        inspect: function(_, p) {
            var a = this.a, b = this.b;
            var op = '=';
            if(b.op && b.op != '=' && b.op != '<->' && b.op != '==' && b.op != '<' && b.op != '-' && b.op != '~' && b.a === a) {
                if(b.op == '+' && b.b < 0) {
                    op = '-=';
                    b = -b.b;
                } else {
                    op = b.op+'=';
                    b = b.b;
                }
            }var expr = inspect(a, 13)+' '+op+' '+inspect(b, 13);
            return 13 <= p ? expr : '('+expr+')';
        }
    };
}
var Swap = exports.Swap = function Swap(a, b) {
    return {
        constructor: Swap, fn: 'Swap', op: '<->', a: a, b: b,
        get value() {
            var va = lvalueof(a), vb = lvalueof(b);
            if(va !== a || vb !== b) return Swap(va, vb);
        },
        inspect: function(_, p) {
            var a = this.a, b = this.b;var expr = inspect(a, 13)+' <-> '+inspect(b, 13);
            return 13 <= p ? expr : '('+expr+')';
        }
    };
}
var Add = exports.Add = function Add(a, b) {
    if(known(a) && !known(b)) return Add(b, a);
    if(a == 0) return b;
    if(b == 0) return a;
    if(known(a) && known(b)) return +(a + b);
    if(a.op == '+' && known(a.b) && known(b)) return Add(a.a, a.b+b);
    if(a.op == '-' && a.a == b || b.op == '-' && b.a == a) return 0;
    return {
        constructor: Add, fn: 'Add', op: '+', a: a, b: b,
        get value() {
            var va = valueof(a), vb = valueof(b);
            if(va !== a || vb !== b) return Add(va, vb);
        },
        inspect: function(_, p) {
            var a = this.a, b = this.b;
            var op = '+';
            if(b < 0) {
                op = '-';
                b = -b;
            } else if(b.op == '-') {
                op = '-';
                b = b.a;
            }var expr = inspect(a, 4)+' '+op+' '+inspect(b, 4);
            return 4 <= p ? expr : '('+expr+')';
        }
    };
}
var Mul = exports.Mul = function Mul(a, b) {
    if(known(a) && known(b)) return +(a * b);
    return {
        constructor: Mul, fn: 'Mul', op: '*', a: a, b: b,
        get value() {
            var va = valueof(a), vb = valueof(b);
            if(va !== a || vb !== b) return Mul(va, vb);
        },
        inspect: function(_, p) {
            var a = this.a, b = this.b;var expr = inspect(a, 3)+' * '+inspect(b, 3);
            return 3 <= p ? expr : '('+expr+')';
        }
    };
}
var Div = exports.Div = function Div(a, b) {
    if(known(a) && known(b)) return +(a / b);
    return {
        constructor: Div, fn: 'Div', op: '/', a: a, b: b,
        get value() {
            var va = valueof(a), vb = valueof(b);
            if(va !== a || vb !== b) return Div(va, vb);
        },
        inspect: function(_, p) {
            var a = this.a, b = this.b;var expr = inspect(a, 3)+' / '+inspect(b, 3);
            return 3 <= p ? expr : '('+expr+')';
        }
    };
}
var And = exports.And = function And(a, b) {
    if(known(a) && !known(b)) return And(b, a);
    if(a === b) return a;
    if(known(a) && known(b)) return +(a & b);
    if(b == -1 || !known(a) && a.bitsof && b == Math.pow(2, a.bitsof)-1) return a;
    return {
        constructor: And, fn: 'And', op: '&', a: a, b: b,
        get value() {
            var va = valueof(a), vb = valueof(b);
            if(va !== a || vb !== b) return And(va, vb);
        },
        inspect: function(_, p) {
            var a = this.a, b = this.b;var expr = inspect(a, 8)+' & '+inspect(b, 8);
            return 8 <= p ? expr : '('+expr+')';
        }
    };
}
var Or = exports.Or = function Or(a, b) {
    if(known(a) && !known(b)) return Or(b, a);
    if(a == 0) return b;
    if(b == 0) return a;
    if(a === b) return a;
    if(known(a) && known(b)) return +(a | b);
    if(b == -1 || !known(a) && a.bitsof && b == Math.pow(2, a.bitsof)-1) return b;
    return {
        constructor: Or, fn: 'Or', op: '|', a: a, b: b,
        get value() {
            var va = valueof(a), vb = valueof(b);
            if(va !== a || vb !== b) return Or(va, vb);
        },
        inspect: function(_, p) {
            var a = this.a, b = this.b;var expr = inspect(a, 10)+' | '+inspect(b, 10);
            return 10 <= p ? expr : '('+expr+')';
        }
    };
}
var Xor = exports.Xor = function Xor(a, b) {
    if(known(a) && !known(b)) return Xor(b, a);
    if(a == 0) return b;
    if(b == 0) return a;
    if(a === b) return 0;
    if(known(a) && known(b)) return +(a ^ b);
    return {
        constructor: Xor, fn: 'Xor', op: '^', a: a, b: b,
        get value() {
            var va = valueof(a), vb = valueof(b);
            if(va !== a || vb !== b) return Xor(va, vb);
        },
        inspect: function(_, p) {
            var a = this.a, b = this.b;var expr = inspect(a, 9)+' ^ '+inspect(b, 9);
            return 9 <= p ? expr : '('+expr+')';
        }
    };
}
var Eq = exports.Eq = function Eq(a, b) {
    if(known(a) && known(b)) return +(a == b);
    return {
        constructor: Eq, fn: 'Eq', op: '==', a: a, b: b,
        get value() {
            var va = valueof(a), vb = valueof(b);
            if(va !== a || vb !== b) return Eq(va, vb);
        },
        inspect: function(_, p) {
            var a = this.a, b = this.b;var expr = inspect(a, 7)+' == '+inspect(b, 7);
            return 7 <= p ? expr : '('+expr+')';
        }
    };
}
var Lt = exports.Lt = function Lt(a, b) {
    if(known(a) && known(b)) return +(a < b);
    return {
        constructor: Lt, fn: 'Lt', op: '<', a: a, b: b, bitsof: 1,
        get value() {
            var va = valueof(a), vb = valueof(b);
            if(va !== a || vb !== b) return Lt(va, vb);
        },
        inspect: function(_, p) {
            var a = this.a, b = this.b;var expr = inspect(a, 6)+' < '+inspect(b, 6);
            return 6 <= p ? expr : '('+expr+')';
        }
    };
}
var LSL = exports.LSL = function LSL(a, b) {
    if(b == 0) return a;
    if(known(a) && known(b)) return +(a << b);
    return {
        constructor: LSL, fn: 'LSL', op: '<<', a: a, b: b,
        get value() {
            var va = valueof(a), vb = valueof(b);
            if(va !== a || vb !== b) return LSL(va, vb);
        },
        inspect: function(_, p) {
            var a = this.a, b = this.b;var expr = inspect(a, 5)+' << '+inspect(b, 5);
            return 5 <= p ? expr : '('+expr+')';
        }
    };
}
var LSR = exports.LSR = function LSR(a, b) {
    if(b == 0) return a;
    if(known(a) && known(b)) return +(a >>> b);
    return {
        constructor: LSR, fn: 'LSR', op: '>>>', a: a, b: b,
        get value() {
            var va = valueof(a), vb = valueof(b);
            if(va !== a || vb !== b) return LSR(va, vb);
        },
        inspect: function(_, p) {
            var a = this.a, b = this.b;var expr = inspect(a, 5)+' >>> '+inspect(b, 5);
            return 5 <= p ? expr : '('+expr+')';
        }
    };
}
var ASR = exports.ASR = function ASR(a, b) {
    if(b == 0) return a;
    if(known(a) && known(b)) return +(a >> b);
    return {
        constructor: ASR, fn: 'ASR', op: '>>', a: a, b: b,
        get value() {
            var va = valueof(a), vb = valueof(b);
            if(va !== a || vb !== b) return ASR(va, vb);
        },
        inspect: function(_, p) {
            var a = this.a, b = this.b;var expr = inspect(a, 5)+' >> '+inspect(b, 5);
            return 5 <= p ? expr : '('+expr+')';
        }
    };
}
var R = exports.R = {}, R_ = [];
R_[8] = []; R_[16] = []; R_[32] = []; R_.S = []; R_.FLAGS = [];
R.AL = R_[8][0] = {bitsof: 8, signed: false, inspect: function() {return 'AL';}};
R.AH = R_[8][4] = {bitsof: 8, signed: false, inspect: function() {return 'AH';}};
R.AX = R_[16][0] = {bitsof: 16, signed: false, inspect: function() {return 'AX';}};
R.EAX = R_[32][0] = {bitsof: 32, signed: false, inspect: function() {return 'EAX';}};
R.CL = R_[8][1] = {bitsof: 8, signed: false, inspect: function() {return 'CL';}};
R.CH = R_[8][5] = {bitsof: 8, signed: false, inspect: function() {return 'CH';}};
R.CX = R_[16][1] = {bitsof: 16, signed: false, inspect: function() {return 'CX';}};
R.ECX = R_[32][1] = {bitsof: 32, signed: false, inspect: function() {return 'ECX';}};
R.DL = R_[8][2] = {bitsof: 8, signed: false, inspect: function() {return 'DL';}};
R.DH = R_[8][6] = {bitsof: 8, signed: false, inspect: function() {return 'DH';}};
R.DX = R_[16][2] = {bitsof: 16, signed: false, inspect: function() {return 'DX';}};
R.EDX = R_[32][2] = {bitsof: 32, signed: false, inspect: function() {return 'EDX';}};
R.BL = R_[8][3] = {bitsof: 8, signed: false, inspect: function() {return 'BL';}};
R.BH = R_[8][7] = {bitsof: 8, signed: false, inspect: function() {return 'BH';}};
R.BX = R_[16][3] = {bitsof: 16, signed: false, inspect: function() {return 'BX';}};
R.EBX = R_[32][3] = {bitsof: 32, signed: false, inspect: function() {return 'EBX';}};
R.ES = R_.S[0] = {bitsof: 16, signed: false, inspect: function() {return 'ES';}};
R.CS = R_.S[1] = {bitsof: 16, signed: false, inspect: function() {return 'CS';}};
R.SS = R_.S[2] = {bitsof: 16, signed: false, inspect: function() {return 'SS';}};
R.DS = R_.S[3] = {bitsof: 16, signed: false, inspect: function() {return 'DS';}};
R.FS = R_.S[4] = {bitsof: 16, signed: false, inspect: function() {return 'FS';}};
R.SS = R_.S[5] = {bitsof: 16, signed: false, inspect: function() {return 'SS';}};
R.GS = R_.S[6] = {bitsof: 16, signed: false, inspect: function() {return 'GS';}};
R.SP = R_[16][4] = {bitsof: 16, signed: false, inspect: function() {return 'SP';}};
R.ESP = R_[32][4] = {bitsof: 32, signed: false, inspect: function() {return 'ESP';}};
R.BP = R_[16][5] = {bitsof: 16, signed: false, inspect: function() {return 'BP';}};
R.EBP = R_[32][5] = {bitsof: 32, signed: false, inspect: function() {return 'EBP';}};
R.SI = R_[16][6] = {bitsof: 16, signed: false, inspect: function() {return 'SI';}};
R.ESI = R_[32][6] = {bitsof: 32, signed: false, inspect: function() {return 'ESI';}};
R.DI = R_[16][7] = {bitsof: 16, signed: false, inspect: function() {return 'DI';}};
R.EDI = R_[32][7] = {bitsof: 32, signed: false, inspect: function() {return 'EDI';}};
R.IP = R_[16][8] = {bitsof: 16, signed: false, inspect: function() {return 'IP';}};
R.EIP = R_[32][8] = {bitsof: 32, signed: false, inspect: function() {return 'EIP';}};
R.EFLAGS = R_.FLAGS[0] = {bitsof: 32, signed: false, inspect: function() {return 'EFLAGS';}};
var F = [];
R.OF = F[0] = {bitsof: 1, signed: false, inspect: function() {return 'OF';}};
R.CF = F[1] = {bitsof: 1, signed: false, inspect: function() {return 'CF';}};
R.ZF = F[2] = {bitsof: 1, signed: false, inspect: function() {return 'ZF';}};
R.SF = F[3] = {bitsof: 1, signed: false, inspect: function() {return 'SF';}};
R.PF = F[4] = {bitsof: 1, signed: false, inspect: function() {return 'PF';}};
R.VF = F[5] = {bitsof: 1, signed: false, inspect: function() {return 'VF';}};
R.DF = F[6] = {bitsof: 1, signed: false, inspect: function() {return 'DF';}};
R.IF = F[7] = {bitsof: 1, signed: false, inspect: function() {return 'IF';}};
var u8 = uint[8] = function u8(x) {
    if(known(x))
        return (x&0xff);
    if(x.bitsof === 8 && x.signed === false)
        return x;
    if(x.hasOwnProperty('fn') && x.fn == 'Mem') {
        x.bitsof = 8;
        return Object.create(x, {
            value: {get: function() {
                var v = valueof(x);
                if(v !== x)
                    return v.fn == 'Mem' ? u8(v) : v;
            }, set: function(v) {
                x.value = v;
            }},
            lvalue: {get: function() {
                var v = lvalueof(x);
                if(v !== x)
                    return v.fn == 'Mem' ? u8(v) : v;
            }},
        });
    }
    return Object.create(x, {
        bitsof: {value: 8},
        signed: {value: false},
        value: {get: function() {
            var v = valueof(x);
            if(v !== x)
                return u8(v);
        }, set: function(v) {
            x.value = v;
        }},
        lvalue: {get: function() {
            if(x.fn != 'Mem')
                return;
            var v = lvalueof(x);
            if(v !== x)
                return u8(v);
        }},
        inspect: {value: function(_, p) {
            var wrap = ('bitsof' in x) && x.bitsof != 8;
            var ix = x.inspect ? x.inspect.call(this, _, !wrap && p || 16) : inspect(x, !wrap && p);
            return wrap ? 'u8('+ix+')' : ix;
        }}
    });
}
var u32 = uint[32] = function u32(x) {
    if(known(x))
        return ((x = x&~0), (x = x < 0 ? x+0x100000000 : x));
    if(x.bitsof === 32 && x.signed === false)
        return x;
    if(x.hasOwnProperty('fn') && x.fn == 'Mem') {
        x.bitsof = 32;
        return Object.create(x, {
            value: {get: function() {
                var v = valueof(x);
                if(v !== x)
                    return v.fn == 'Mem' ? u32(v) : v;
            }, set: function(v) {
                x.value = v;
            }},
            lvalue: {get: function() {
                var v = lvalueof(x);
                if(v !== x)
                    return v.fn == 'Mem' ? u32(v) : v;
            }},
        });
    }
    return Object.create(x, {
        bitsof: {value: 32},
        signed: {value: false},
        value: {get: function() {
            var v = valueof(x);
            if(v !== x)
                return u32(v);
        }, set: function(v) {
            x.value = v;
        }},
        lvalue: {get: function() {
            if(x.fn != 'Mem')
                return;
            var v = lvalueof(x);
            if(v !== x)
                return u32(v);
        }},
        inspect: {value: function(_, p) {
            var wrap = ('bitsof' in x) && x.bitsof != 32;
            var ix = x.inspect ? x.inspect.call(this, _, !wrap && p || 16) : inspect(x, !wrap && p);
            return wrap ? 'u32('+ix+')' : ix;
        }}
    });
}
var i8 = int[8] = function i8(x) {
    if(known(x))
        return ((x<<24)>>24);
    if(x.bitsof === 8 && x.signed === true)
        return x;
    if(x.hasOwnProperty('fn') && x.fn == 'Mem')
        x.bitsof = 8;
    return Object.create(x, {
        bitsof: {value: 8},
        signed: {value: true},
        value: {get: function() {
            var v = valueof(x);
            if(v !== x)
                return i8(v);
        }, set: function(v) {
            x.value = v;
        }},
        lvalue: {get: function() {
            if(x.fn != 'Mem')
                return;
            var v = lvalueof(x);
            if(v !== x)
                return i8(v);
        }},
        inspect: {value: function(_, p) {
            var wrap = ('bitsof' in x) && x.bitsof != 8;
            var ix = x.inspect ? x.inspect.call(this, _, !wrap && p || 16) : inspect(x, !wrap && p);
            return wrap ? 'i8('+ix+')' : ix;
        }}
    });
}
var i32 = int[32] = function i32(x) {
    if(known(x))
        return (x&~0);
    if(x.bitsof === 32 && x.signed === true)
        return x;
    if(x.hasOwnProperty('fn') && x.fn == 'Mem')
        x.bitsof = 32;
    return Object.create(x, {
        bitsof: {value: 32},
        signed: {value: true},
        value: {get: function() {
            var v = valueof(x);
            if(v !== x)
                return i32(v);
        }, set: function(v) {
            x.value = v;
        }},
        lvalue: {get: function() {
            if(x.fn != 'Mem')
                return;
            var v = lvalueof(x);
            if(v !== x)
                return i32(v);
        }},
        inspect: {value: function(_, p) {
            var wrap = ('bitsof' in x) && x.bitsof != 32;
            var ix = x.inspect ? x.inspect.call(this, _, !wrap && p || 16) : inspect(x, !wrap && p);
            return wrap ? 'i32('+ix+')' : ix;
        }}
    });
}
var u16 = uint[16] = function u16(x) {
    if(known(x))
        return (x&0xffff);
    if(x.bitsof === 16 && x.signed === false)
        return x;
    if(x.hasOwnProperty('fn') && x.fn == 'Mem') {
        x.bitsof = 16;
        return Object.create(x, {
            value: {get: function() {
                var v = valueof(x);
                if(v !== x)
                    return v.fn == 'Mem' ? u16(v) : v;
            }, set: function(v) {
                x.value = v;
            }},
            lvalue: {get: function() {
                var v = lvalueof(x);
                if(v !== x)
                    return v.fn == 'Mem' ? u16(v) : v;
            }},
        });
    }
    return Object.create(x, {
        bitsof: {value: 16},
        signed: {value: false},
        value: {get: function() {
            var v = valueof(x);
            if(v !== x)
                return u16(v);
        }, set: function(v) {
            x.value = v;
        }},
        lvalue: {get: function() {
            if(x.fn != 'Mem')
                return;
            var v = lvalueof(x);
            if(v !== x)
                return u16(v);
        }},
        inspect: {value: function(_, p) {
            var wrap = ('bitsof' in x) && x.bitsof != 16;
            var ix = x.inspect ? x.inspect.call(this, _, !wrap && p || 16) : inspect(x, !wrap && p);
            return wrap ? 'u16('+ix+')' : ix;
        }}
    });
}
var u1 = uint[1] = function u1(x) {
    if(known(x))
        return (x&0x1);
    if(x.bitsof === 1 && x.signed === false)
        return x;
    if(x.hasOwnProperty('fn') && x.fn == 'Mem') {
        x.bitsof = 1;
        return Object.create(x, {
            value: {get: function() {
                var v = valueof(x);
                if(v !== x)
                    return v.fn == 'Mem' ? u1(v) : v;
            }, set: function(v) {
                x.value = v;
            }},
            lvalue: {get: function() {
                var v = lvalueof(x);
                if(v !== x)
                    return v.fn == 'Mem' ? u1(v) : v;
            }},
        });
    }
    return Object.create(x, {
        bitsof: {value: 1},
        signed: {value: false},
        value: {get: function() {
            var v = valueof(x);
            if(v !== x)
                return u1(v);
        }, set: function(v) {
            x.value = v;
        }},
        lvalue: {get: function() {
            if(x.fn != 'Mem')
                return;
            var v = lvalueof(x);
            if(v !== x)
                return u1(v);
        }},
        inspect: {value: function(_, p) {
            var wrap = ('bitsof' in x) && x.bitsof != 1;
            var ix = x.inspect ? x.inspect.call(this, _, !wrap && p || 16) : inspect(x, !wrap && p);
            return wrap ? 'u1('+ix+')' : ix;
        }}
    });
}
var i16 = int[16] = function i16(x) {
    if(known(x))
        return ((x<<16)>>16);
    if(x.bitsof === 16 && x.signed === true)
        return x;
    if(x.hasOwnProperty('fn') && x.fn == 'Mem')
        x.bitsof = 16;
    return Object.create(x, {
        bitsof: {value: 16},
        signed: {value: true},
        value: {get: function() {
            var v = valueof(x);
            if(v !== x)
                return i16(v);
        }, set: function(v) {
            x.value = v;
        }},
        lvalue: {get: function() {
            if(x.fn != 'Mem')
                return;
            var v = lvalueof(x);
            if(v !== x)
                return i16(v);
        }},
        inspect: {value: function(_, p) {
            var wrap = ('bitsof' in x) && x.bitsof != 16;
            var ix = x.inspect ? x.inspect.call(this, _, !wrap && p || 16) : inspect(x, !wrap && p);
            return wrap ? 'i16('+ix+')' : ix;
        }}
    });
}
exports.dis = function x86dis(b, i) {
    // HACK allows skipping prefixes.
    var _pfxLength = 0, _pfxSizeSpecifier = false;
    for(; b[i] >= 0x64 && b[i] <= 0x67 || b[i] == 0xF2 || b[i] == 0xF3; i++, _pfxLength++) {
        if(b[i] == 0x66)
            _pfxSizeSpecifier = true;
        else
            console.error('[PREFIX] '+b[i].toString(16).toUpperCase());
    }
    
	var $0, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, $40, $41, $42, $43, $44, $45, $46, $47, $48, $49, $50, $51, $52, $53, $54, $55, $56, $57, $58, $59, $60, $61, $62, $63, $64, $65, $66, $67, $68, $69, $70, $71, $72, $73, $74, $75, $76, $77, $78, $79, $80, $81, $82, $83, $84, $85, $86;
if(((b[i+0]|(b[i+1]<<8)|((b[i+2] & 0x3f)<<16)) & 0x3f47ff) == 0x250469)
	switch((((b[i+1] & 0x80)>>>7)) & 0x1) {
	case 0x0: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 11),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Mul(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24)))))];
	case 0x1: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 11),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Mul(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))), int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24)))))];
	}
if(((b[i+0]|(b[i+1]<<8)|((b[i+2] & 0x3f)<<16)) & 0x38c7ff) == 0x208469)
	switch(0) {
	case 0x0: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 11),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Mul(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))), int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24)))))];
	}
if(((b[i+0]|(b[i+1]<<8)|((b[i+2] & 0x7)<<16)) & 0x747ff) == 0x50469)
	switch((((b[i+1] & 0x80)>>>7)) & 0x1) {
	case 0x0: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 11),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Mul(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))), int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24)))))];
	case 0x1: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 11),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Mul(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))))), int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24)))))];
	}
if(((b[i+0]|(b[i+1]<<8)) & 0xc7ff) == 0x8469)
	switch(0) {
	case 0x0: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 11),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Mul(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))), int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24)))))];
	}
if(((b[i+0]|(b[i+1]<<8)|((b[i+2] & 0x3f)<<16)) & 0x3f4789) == 0x250481)
	switch((((b[i+0] & 0xfe)>>>1)|(b[i+1]<<7)) & 0x5c3b) {
	case 0x0: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 11),Mov(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))), Add($1, int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24)))))];
	case 0x4000: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 11),Mov(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), Add($1, int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24)))))];
	case 0x400: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 11),Mov(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))), Or($1, uint[(_pfxSizeSpecifier ? 16 : 32)](int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24))))))];
	case 0x4400: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 11),Mov(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), Or($1, uint[(_pfxSizeSpecifier ? 16 : 32)](int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24))))))];
	case 0x800: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 11),Mov(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))), Add($1, Add(int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24))), uint[(_pfxSizeSpecifier ? 16 : 32)](F[1]))))];
	case 0x4800: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 11),Mov(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), Add($1, Add(int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24))), uint[(_pfxSizeSpecifier ? 16 : 32)](F[1]))))];
	case 0xc00: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 11),Mov(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))), Add(($2 = Add($1, int[(_pfxSizeSpecifier ? 16 : 32)](-($3 = int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24))))))), int[(_pfxSizeSpecifier ? 16 : 32)](Neg(($4 = uint[(_pfxSizeSpecifier ? 16 : 32)](F[1]))))))];
	case 0x4c00: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 11),Mov(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), Add(($2 = Add($1, int[(_pfxSizeSpecifier ? 16 : 32)](-($3 = int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24))))))), int[(_pfxSizeSpecifier ? 16 : 32)](Neg(($4 = uint[(_pfxSizeSpecifier ? 16 : 32)](F[1]))))))];
	case 0x1000: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 11),Mov(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))), And($1, uint[(_pfxSizeSpecifier ? 16 : 32)](int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24))))))];
	case 0x5000: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 11),Mov(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), And($1, uint[(_pfxSizeSpecifier ? 16 : 32)](int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24))))))];
	case 0x1400: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 11),Mov(F[2], Eq(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))), ($2 = int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24)))))),Mov(F[1], Lt($1, $2)),Mov($1, Add($1, int[(_pfxSizeSpecifier ? 16 : 32)](-$2)))];
	case 0x5400: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 11),Mov(F[2], Eq(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), ($2 = int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24)))))),Mov(F[1], Lt($1, $2)),Mov($1, Add($1, int[(_pfxSizeSpecifier ? 16 : 32)](-$2)))];
	case 0x1800: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 11),Mov(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))), Xor($1, int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24)))))];
	case 0x5800: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 11),Mov(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), Xor($1, int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24)))))];
	case 0x1c00: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 11),Mov(F[2], Eq(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))), ($2 = int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24)))))),Mov(F[1], Lt($1, $2))];
	case 0x5c00: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 11),Mov(F[2], Eq(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), ($2 = int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24)))))),Mov(F[1], Lt($1, $2))];
	case 0x23: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 11),Mov(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24))))];
	case 0x4023: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 11),Mov(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))), int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24))))];
	case 0x3b: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 11),Mov(F[2], Eq(And(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24)))), 0)),Mov(F[1], 0),Mov(F[0], 0)];
	case 0x403b: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 11),Mov(F[2], Eq(And(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))), int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24)))), 0)),Mov(F[1], 0),Mov(F[0], 0)];
	}
if(((b[i+0]|(b[i+1]<<8)|((b[i+2] & 0x3f)<<16)) & 0x38c789) == 0x208481)
	switch((((b[i+0] & 0xfe)>>>1)|((b[i+1] & 0x3f)<<7)) & 0x1c3b) {
	case 0x0: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 11),Mov(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), Add($1, int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24)))))];
	case 0x400: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 11),Mov(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), Or($1, uint[(_pfxSizeSpecifier ? 16 : 32)](int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24))))))];
	case 0x800: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 11),Mov(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), Add($1, Add(int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24))), uint[(_pfxSizeSpecifier ? 16 : 32)](F[1]))))];
	case 0xc00: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 11),Mov(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), Add(($2 = Add($1, int[(_pfxSizeSpecifier ? 16 : 32)](-($3 = int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24))))))), int[(_pfxSizeSpecifier ? 16 : 32)](Neg(($4 = uint[(_pfxSizeSpecifier ? 16 : 32)](F[1]))))))];
	case 0x1000: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 11),Mov(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), And($1, uint[(_pfxSizeSpecifier ? 16 : 32)](int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24))))))];
	case 0x1400: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 11),Mov(F[2], Eq(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), ($2 = int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24)))))),Mov(F[1], Lt($1, $2)),Mov($1, Add($1, int[(_pfxSizeSpecifier ? 16 : 32)](-$2)))];
	case 0x1800: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 11),Mov(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), Xor($1, int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24)))))];
	case 0x1c00: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 11),Mov(F[2], Eq(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), ($2 = int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24)))))),Mov(F[1], Lt($1, $2))];
	case 0x23: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 11),Mov(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))), int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24))))];
	case 0x3b: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 11),Mov(F[2], Eq(And(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))), int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24)))), 0)),Mov(F[1], 0),Mov(F[0], 0)];
	}
if(((b[i+0]|(b[i+1]<<8)|((b[i+2] & 0x7)<<16)) & 0x74789) == 0x50481)
	switch((((b[i+0] & 0xfe)>>>1)|(b[i+1]<<7)) & 0x5c3b) {
	case 0x0: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 11),Mov(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), Add($1, int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24)))))];
	case 0x4000: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 11),Mov(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))), Add($1, int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24)))))];
	case 0x400: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 11),Mov(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), Or($1, uint[(_pfxSizeSpecifier ? 16 : 32)](int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24))))))];
	case 0x4400: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 11),Mov(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))), Or($1, uint[(_pfxSizeSpecifier ? 16 : 32)](int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24))))))];
	case 0x800: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 11),Mov(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), Add($1, Add(int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24))), uint[(_pfxSizeSpecifier ? 16 : 32)](F[1]))))];
	case 0x4800: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 11),Mov(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))), Add($1, Add(int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24))), uint[(_pfxSizeSpecifier ? 16 : 32)](F[1]))))];
	case 0xc00: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 11),Mov(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), Add(($2 = Add($1, int[(_pfxSizeSpecifier ? 16 : 32)](-($3 = int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24))))))), int[(_pfxSizeSpecifier ? 16 : 32)](Neg(($4 = uint[(_pfxSizeSpecifier ? 16 : 32)](F[1]))))))];
	case 0x4c00: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 11),Mov(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))), Add(($2 = Add($1, int[(_pfxSizeSpecifier ? 16 : 32)](-($3 = int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24))))))), int[(_pfxSizeSpecifier ? 16 : 32)](Neg(($4 = uint[(_pfxSizeSpecifier ? 16 : 32)](F[1]))))))];
	case 0x1000: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 11),Mov(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), And($1, uint[(_pfxSizeSpecifier ? 16 : 32)](int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24))))))];
	case 0x5000: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 11),Mov(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))), And($1, uint[(_pfxSizeSpecifier ? 16 : 32)](int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24))))))];
	case 0x1400: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 11),Mov(F[2], Eq(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), ($2 = int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24)))))),Mov(F[1], Lt($1, $2)),Mov($1, Add($1, int[(_pfxSizeSpecifier ? 16 : 32)](-$2)))];
	case 0x5400: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 11),Mov(F[2], Eq(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))), ($2 = int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24)))))),Mov(F[1], Lt($1, $2)),Mov($1, Add($1, int[(_pfxSizeSpecifier ? 16 : 32)](-$2)))];
	case 0x1800: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 11),Mov(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), Xor($1, int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24)))))];
	case 0x5800: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 11),Mov(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))), Xor($1, int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24)))))];
	case 0x1c00: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 11),Mov(F[2], Eq(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), ($2 = int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24)))))),Mov(F[1], Lt($1, $2))];
	case 0x5c00: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 11),Mov(F[2], Eq(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))), ($2 = int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24)))))),Mov(F[1], Lt($1, $2))];
	case 0x23: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 11),Mov(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))), int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24))))];
	case 0x4023: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 11),Mov(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))))), int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24))))];
	case 0x3b: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 11),Mov(F[2], Eq(And(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))), int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24)))), 0)),Mov(F[1], 0),Mov(F[0], 0)];
	case 0x403b: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 11),Mov(F[2], Eq(And(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))))), int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24)))), 0)),Mov(F[1], 0),Mov(F[0], 0)];
	}
if(((b[i+0]|(b[i+1]<<8)) & 0xc789) == 0x8481)
	switch((((b[i+0] & 0xfe)>>>1)|((b[i+1] & 0x3f)<<7)) & 0x1c3b) {
	case 0x0: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 11),Mov(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), Add($1, int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24)))))];
	case 0x400: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 11),Mov(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), Or($1, uint[(_pfxSizeSpecifier ? 16 : 32)](int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24))))))];
	case 0x800: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 11),Mov(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), Add($1, Add(int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24))), uint[(_pfxSizeSpecifier ? 16 : 32)](F[1]))))];
	case 0xc00: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 11),Mov(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), Add(($2 = Add($1, int[(_pfxSizeSpecifier ? 16 : 32)](-($3 = int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24))))))), int[(_pfxSizeSpecifier ? 16 : 32)](Neg(($4 = uint[(_pfxSizeSpecifier ? 16 : 32)](F[1]))))))];
	case 0x1000: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 11),Mov(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), And($1, uint[(_pfxSizeSpecifier ? 16 : 32)](int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24))))))];
	case 0x1400: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 11),Mov(F[2], Eq(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), ($2 = int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24)))))),Mov(F[1], Lt($1, $2)),Mov($1, Add($1, int[(_pfxSizeSpecifier ? 16 : 32)](-$2)))];
	case 0x1800: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 11),Mov(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), Xor($1, int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24)))))];
	case 0x1c00: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 11),Mov(F[2], Eq(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), ($2 = int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24)))))),Mov(F[1], Lt($1, $2))];
	case 0x23: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 11),Mov(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))), int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24))))];
	case 0x3b: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 11),Mov(F[2], Eq(And(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))), int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24)))), 0)),Mov(F[1], 0),Mov(F[0], 0)];
	}
if(((b[i+0]|(b[i+1]<<8)) & 0xc7ff) == 0x569)
	switch(0) {
	case 0x0: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 10),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Mul(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)))), int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+6]|(b[i+7]<<8)|(b[i+8]<<16)|(b[i+9]<<24)))))];
	}
if(((b[i+0]|(b[i+1]<<8)) & 0xc789) == 0x581)
	switch((((b[i+0] & 0xfe)>>>1)|((b[i+1] & 0x3f)<<7)) & 0x1c3b) {
	case 0x0: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 10),Mov(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))), Add($1, int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+6]|(b[i+7]<<8)|(b[i+8]<<16)|(b[i+9]<<24)))))];
	case 0x400: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 10),Mov(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))), Or($1, uint[(_pfxSizeSpecifier ? 16 : 32)](int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+6]|(b[i+7]<<8)|(b[i+8]<<16)|(b[i+9]<<24))))))];
	case 0x800: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 10),Mov(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))), Add($1, Add(int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+6]|(b[i+7]<<8)|(b[i+8]<<16)|(b[i+9]<<24))), uint[(_pfxSizeSpecifier ? 16 : 32)](F[1]))))];
	case 0xc00: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 10),Mov(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))), Add(($2 = Add($1, int[(_pfxSizeSpecifier ? 16 : 32)](-($3 = int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+6]|(b[i+7]<<8)|(b[i+8]<<16)|(b[i+9]<<24))))))), int[(_pfxSizeSpecifier ? 16 : 32)](Neg(($4 = uint[(_pfxSizeSpecifier ? 16 : 32)](F[1]))))))];
	case 0x1000: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 10),Mov(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))), And($1, uint[(_pfxSizeSpecifier ? 16 : 32)](int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+6]|(b[i+7]<<8)|(b[i+8]<<16)|(b[i+9]<<24))))))];
	case 0x1400: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 10),Mov(F[2], Eq(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))), ($2 = int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+6]|(b[i+7]<<8)|(b[i+8]<<16)|(b[i+9]<<24)))))),Mov(F[1], Lt($1, $2)),Mov($1, Add($1, int[(_pfxSizeSpecifier ? 16 : 32)](-$2)))];
	case 0x1800: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 10),Mov(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))), Xor($1, int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+6]|(b[i+7]<<8)|(b[i+8]<<16)|(b[i+9]<<24)))))];
	case 0x1c00: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 10),Mov(F[2], Eq(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))), ($2 = int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+6]|(b[i+7]<<8)|(b[i+8]<<16)|(b[i+9]<<24)))))),Mov(F[1], Lt($1, $2))];
	case 0x23: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 10),Mov(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)))), int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+6]|(b[i+7]<<8)|(b[i+8]<<16)|(b[i+9]<<24))))];
	case 0x3b: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 10),Mov(F[2], Eq(And(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)))), int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+6]|(b[i+7]<<8)|(b[i+8]<<16)|(b[i+9]<<24)))), 0)),Mov(F[1], 0),Mov(F[0], 0)];
	}
if(((b[i+0]|(b[i+1]<<8)) & 0xc0ff) == 0x8069)
	switch(0) {
	case 0x0: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 10),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Mul(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)))))), int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+6]|(b[i+7]<<8)|(b[i+8]<<16)|(b[i+9]<<24)))))];
	}
if(((b[i+0]|(b[i+1]<<8)) & 0xc089) == 0x8081)
	switch((((b[i+0] & 0xfe)>>>1)|((b[i+1] & 0x3f)<<7)) & 0x1c3b) {
	case 0x0: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 10),Mov(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))), Add($1, int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+6]|(b[i+7]<<8)|(b[i+8]<<16)|(b[i+9]<<24)))))];
	case 0x400: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 10),Mov(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))), Or($1, uint[(_pfxSizeSpecifier ? 16 : 32)](int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+6]|(b[i+7]<<8)|(b[i+8]<<16)|(b[i+9]<<24))))))];
	case 0x800: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 10),Mov(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))), Add($1, Add(int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+6]|(b[i+7]<<8)|(b[i+8]<<16)|(b[i+9]<<24))), uint[(_pfxSizeSpecifier ? 16 : 32)](F[1]))))];
	case 0xc00: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 10),Mov(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))), Add(($2 = Add($1, int[(_pfxSizeSpecifier ? 16 : 32)](-($3 = int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+6]|(b[i+7]<<8)|(b[i+8]<<16)|(b[i+9]<<24))))))), int[(_pfxSizeSpecifier ? 16 : 32)](Neg(($4 = uint[(_pfxSizeSpecifier ? 16 : 32)](F[1]))))))];
	case 0x1000: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 10),Mov(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))), And($1, uint[(_pfxSizeSpecifier ? 16 : 32)](int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+6]|(b[i+7]<<8)|(b[i+8]<<16)|(b[i+9]<<24))))))];
	case 0x1400: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 10),Mov(F[2], Eq(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))), ($2 = int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+6]|(b[i+7]<<8)|(b[i+8]<<16)|(b[i+9]<<24)))))),Mov(F[1], Lt($1, $2)),Mov($1, Add($1, int[(_pfxSizeSpecifier ? 16 : 32)](-$2)))];
	case 0x1800: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 10),Mov(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))), Xor($1, int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+6]|(b[i+7]<<8)|(b[i+8]<<16)|(b[i+9]<<24)))))];
	case 0x1c00: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 10),Mov(F[2], Eq(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))), ($2 = int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+6]|(b[i+7]<<8)|(b[i+8]<<16)|(b[i+9]<<24)))))),Mov(F[1], Lt($1, $2))];
	case 0x23: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 10),Mov(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)))))), int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+6]|(b[i+7]<<8)|(b[i+8]<<16)|(b[i+9]<<24))))];
	case 0x3b: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 10),Mov(F[2], Eq(And(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)))))), int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+6]|(b[i+7]<<8)|(b[i+8]<<16)|(b[i+9]<<24)))), 0)),Mov(F[1], 0),Mov(F[0], 0)];
	}
if(((b[i+0]|(b[i+1]<<8)|(b[i+2]<<16)|((b[i+3] & 0x3f)<<24)) & 0x3f47ffff) == 0x2504ac0f)
	switch((((b[i+2] & 0x80)>>>7)) & 0x1) {
	case 0x0: return [(_pfxLength + 9),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, ($1 = (((b[i+8])<<24)>>24)))), u32(And(R_[32][(((b[i+2] & 0x38)>>>3))], (($50 = ((($49 = ((($48 = (1 << $1)&~0), ($48 < 0 ? $48+0x100000000 : $48)) + -1)&~0), ($49 < 0 ? $49+0x100000000 : $49)) << (((((-$1<<24)>>24) + 32)<<24)>>24))&~0), ($50 < 0 ? $50+0x100000000 : $50))))))];
	case 0x1: return [(_pfxLength + 9),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))))))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, ($1 = (((b[i+8])<<24)>>24)))), u32(And(R_[32][(((b[i+2] & 0x38)>>>3))], (($80 = ((($79 = ((($78 = (1 << $1)&~0), ($78 < 0 ? $78+0x100000000 : $78)) + -1)&~0), ($79 < 0 ? $79+0x100000000 : $79)) << (((((-$1<<24)>>24) + 32)<<24)>>24))&~0), ($80 < 0 ? $80+0x100000000 : $80))))))];
	}
if(((b[i+0]|(b[i+1]<<8)|(b[i+2]<<16)|((b[i+3] & 0x3f)<<24)) & 0x38c7ffff) == 0x2084ac0f)
	switch(0) {
	case 0x0: return [(_pfxLength + 9),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+3] & 0x7))], (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))))))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, ($1 = (((b[i+8])<<24)>>24)))), u32(And(R_[32][(((b[i+2] & 0x38)>>>3))], (($74 = ((($73 = ((($72 = (1 << $1)&~0), ($72 < 0 ? $72+0x100000000 : $72)) + -1)&~0), ($73 < 0 ? $73+0x100000000 : $73)) << (((((-$1<<24)>>24) + 32)<<24)>>24))&~0), ($74 < 0 ? $74+0x100000000 : $74))))))];
	}
if(((b[i+0]|(b[i+1]<<8)|(b[i+2]<<16)|((b[i+3] & 0x7)<<24)) & 0x747ffff) == 0x504ac0f)
	switch((((b[i+2] & 0x80)>>>7)) & 0x1) {
	case 0x0: return [(_pfxLength + 9),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))))))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, ($1 = (((b[i+8])<<24)>>24)))), u32(And(R_[32][(((b[i+2] & 0x38)>>>3))], (($47 = ((($46 = ((($45 = (1 << $1)&~0), ($45 < 0 ? $45+0x100000000 : $45)) + -1)&~0), ($46 < 0 ? $46+0x100000000 : $46)) << (((((-$1<<24)>>24) + 32)<<24)>>24))&~0), ($47 < 0 ? $47+0x100000000 : $47))))))];
	case 0x1: return [(_pfxLength + 9),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))))))))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, ($1 = (((b[i+8])<<24)>>24)))), u32(And(R_[32][(((b[i+2] & 0x38)>>>3))], (($77 = ((($76 = ((($75 = (1 << $1)&~0), ($75 < 0 ? $75+0x100000000 : $75)) + -1)&~0), ($76 < 0 ? $76+0x100000000 : $76)) << (((((-$1<<24)>>24) + 32)<<24)>>24))&~0), ($77 < 0 ? $77+0x100000000 : $77))))))];
	}
if(((b[i+0]|(b[i+1]<<8)|(b[i+2]<<16)) & 0xc7ffff) == 0x84ac0f)
	switch(0) {
	case 0x0: return [(_pfxLength + 9),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+3] & 0x7))], u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))))))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, ($1 = (((b[i+8])<<24)>>24)))), u32(And(R_[32][(((b[i+2] & 0x38)>>>3))], (($71 = ((($70 = ((($69 = (1 << $1)&~0), ($69 < 0 ? $69+0x100000000 : $69)) + -1)&~0), ($70 < 0 ? $70+0x100000000 : $70)) << (((((-$1<<24)>>24) + 32)<<24)>>24))&~0), ($71 < 0 ? $71+0x100000000 : $71))))))];
	}
if(((b[i+0]|(b[i+1]<<8)|(b[i+2]<<16)|((b[i+3] & 0x3f)<<24)) & 0x3f47c0ff) == 0x2504800f)
	switch((b[i+1]|(b[i+2]<<8)) & 0x803f) {
	case 0x10: return [(_pfxLength + 8),Mov(u8(Mem((b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))), F[0])];
	case 0x8010: return [(_pfxLength + 8),Mov(u8(Mem(u32(Add(R_[32][5], (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))))), F[0])];
	case 0x11: return [(_pfxLength + 8),Mov(u8(Mem((b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))), u1(Not(F[0])))];
	case 0x8011: return [(_pfxLength + 8),Mov(u8(Mem(u32(Add(R_[32][5], (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))))), u1(Not(F[0])))];
	case 0x12: return [(_pfxLength + 8),Mov(u8(Mem((b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))), F[1])];
	case 0x8012: return [(_pfxLength + 8),Mov(u8(Mem(u32(Add(R_[32][5], (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))))), F[1])];
	case 0x13: return [(_pfxLength + 8),Mov(u8(Mem((b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))), u1(Not(F[1])))];
	case 0x8013: return [(_pfxLength + 8),Mov(u8(Mem(u32(Add(R_[32][5], (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))))), u1(Not(F[1])))];
	case 0x14: return [(_pfxLength + 8),Mov(u8(Mem((b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))), F[2])];
	case 0x8014: return [(_pfxLength + 8),Mov(u8(Mem(u32(Add(R_[32][5], (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))))), F[2])];
	case 0x15: return [(_pfxLength + 8),Mov(u8(Mem((b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))), u1(Not(F[2])))];
	case 0x8015: return [(_pfxLength + 8),Mov(u8(Mem(u32(Add(R_[32][5], (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))))), u1(Not(F[2])))];
	case 0x16: return [(_pfxLength + 8),Mov(u8(Mem((b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))), u1(Or(F[1], F[2])))];
	case 0x8016: return [(_pfxLength + 8),Mov(u8(Mem(u32(Add(R_[32][5], (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))))), u1(Or(F[1], F[2])))];
	case 0x17: return [(_pfxLength + 8),Mov(u8(Mem((b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))), u1(And(u1(Not(F[1])), u1(Not(F[2])))))];
	case 0x8017: return [(_pfxLength + 8),Mov(u8(Mem(u32(Add(R_[32][5], (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))))), u1(And(u1(Not(F[1])), u1(Not(F[2])))))];
	case 0x18: return [(_pfxLength + 8),Mov(u8(Mem((b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))), F[3])];
	case 0x8018: return [(_pfxLength + 8),Mov(u8(Mem(u32(Add(R_[32][5], (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))))), F[3])];
	case 0x19: return [(_pfxLength + 8),Mov(u8(Mem((b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))), u1(Not(F[3])))];
	case 0x8019: return [(_pfxLength + 8),Mov(u8(Mem(u32(Add(R_[32][5], (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))))), u1(Not(F[3])))];
	case 0x1a: return [(_pfxLength + 8),Mov(u8(Mem((b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))), F[4])];
	case 0x801a: return [(_pfxLength + 8),Mov(u8(Mem(u32(Add(R_[32][5], (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))))), F[4])];
	case 0x1b: return [(_pfxLength + 8),Mov(u8(Mem((b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))), u1(Not(F[4])))];
	case 0x801b: return [(_pfxLength + 8),Mov(u8(Mem(u32(Add(R_[32][5], (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))))), u1(Not(F[4])))];
	case 0x1c: return [(_pfxLength + 8),Mov(u8(Mem((b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))), u1(Not(Eq(F[0], F[3]))))];
	case 0x801c: return [(_pfxLength + 8),Mov(u8(Mem(u32(Add(R_[32][5], (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))))), u1(Not(Eq(F[0], F[3]))))];
	case 0x1d: return [(_pfxLength + 8),Mov(u8(Mem((b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))), Eq(F[0], F[3]))];
	case 0x801d: return [(_pfxLength + 8),Mov(u8(Mem(u32(Add(R_[32][5], (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))))), Eq(F[0], F[3]))];
	case 0x1e: return [(_pfxLength + 8),Mov(u8(Mem((b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))), u1(Or(F[2], u1(Not(Eq(F[0], F[3]))))))];
	case 0x801e: return [(_pfxLength + 8),Mov(u8(Mem(u32(Add(R_[32][5], (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))))), u1(Or(F[2], u1(Not(Eq(F[0], F[3]))))))];
	case 0x1f: return [(_pfxLength + 8),Mov(u8(Mem((b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))), u1(And(u1(Not(F[2])), Eq(F[0], F[3]))))];
	case 0x801f: return [(_pfxLength + 8),Mov(u8(Mem(u32(Add(R_[32][5], (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))))), u1(And(u1(Not(F[2])), Eq(F[0], F[3]))))];
	case 0x23: return [(_pfxLength + 8),Mov(F[1], u1(Not(Eq(And(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))), LSL(1, R_[32][(((b[i+2] & 0x38)>>>3))])), 0))))];
	case 0x8023: return [(_pfxLength + 8),Mov(F[1], u1(Not(Eq(And(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))))), LSL(1, R_[32][(((b[i+2] & 0x38)>>>3))])), 0))))];
	case 0x2b: return [(_pfxLength + 8),Mov(F[1], u1(Not(Eq(And(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))))), LSL(1, R_[32][(((b[i+2] & 0x38)>>>3))])), 0)))),Mov($0, Or($0, LSL(1, R_[32][(((b[i+2] & 0x38)>>>3))])))];
	case 0x802b: return [(_pfxLength + 8),Mov(F[1], u1(Not(Eq(And(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))))))), LSL(1, R_[32][(((b[i+2] & 0x38)>>>3))])), 0)))),Mov($0, Or($0, LSL(1, R_[32][(((b[i+2] & 0x38)>>>3))])))];
	case 0x2d: return [(_pfxLength + 8),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, R_[8][1])), u32(And(R_[32][(((b[i+2] & 0x38)>>>3))], u32(LSL(u32(Add(u32(LSL(1, R_[8][1])), -1)), i8(Add(i8(Neg(R_[8][1])), 32))))))))];
	case 0x802d: return [(_pfxLength + 8),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))))))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, R_[8][1])), u32(And(R_[32][(((b[i+2] & 0x38)>>>3))], u32(LSL(u32(Add(u32(LSL(1, R_[8][1])), -1)), i8(Add(i8(Neg(R_[8][1])), 32))))))))];
	case 0x2f: return [(_pfxLength + 8),Mov(($0 = i32(R_[32][(((b[i+2] & 0x38)>>>3))])), Mul($0, int[(_pfxSizeSpecifier ? 16 : 32)](uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))))))];
	case 0x802f: return [(_pfxLength + 8),Mov(($0 = i32(R_[32][(((b[i+2] & 0x38)>>>3))])), Mul($0, int[(_pfxSizeSpecifier ? 16 : 32)](uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))))))))];
	case 0x36: return [(_pfxLength + 8),Mov(R_[32][(((b[i+2] & 0x38)>>>3))], u8(Mem((b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))))];
	case 0x8036: return [(_pfxLength + 8),Mov(R_[32][(((b[i+2] & 0x38)>>>3))], u8(Mem(u32(Add(R_[32][5], (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))))))];
	case 0x37: return [(_pfxLength + 8),Mov(R_[32][(((b[i+2] & 0x38)>>>3))], u16(Mem((b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))))];
	case 0x8037: return [(_pfxLength + 8),Mov(R_[32][(((b[i+2] & 0x38)>>>3))], u16(Mem(u32(Add(R_[32][5], (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))))))];
	case 0x3e: return [(_pfxLength + 8),Mov(R_[32][(((b[i+2] & 0x38)>>>3))], i32(u8(Mem((b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))))))];
	case 0x803e: return [(_pfxLength + 8),Mov(R_[32][(((b[i+2] & 0x38)>>>3))], i32(u8(Mem(u32(Add(R_[32][5], (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))))))))];
	case 0x3f: return [(_pfxLength + 8),Mov(R_[32][(((b[i+2] & 0x38)>>>3))], i32(u16(Mem((b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))))))];
	case 0x803f: return [(_pfxLength + 8),Mov(R_[32][(((b[i+2] & 0x38)>>>3))], i32(u16(Mem(u32(Add(R_[32][5], (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))))))))];
	}
if(((b[i+0]|(b[i+1]<<8)|(b[i+2]<<16)|((b[i+3] & 0x3f)<<24)) & 0x38c7c0ff) == 0x2084800f)
	switch(((b[i+1] & 0x3f)) & 0x3f) {
	case 0x10: return [(_pfxLength + 8),Mov(u8(Mem(u32(Add(R_[32][((b[i+3] & 0x7))], (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))))), F[0])];
	case 0x11: return [(_pfxLength + 8),Mov(u8(Mem(u32(Add(R_[32][((b[i+3] & 0x7))], (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))))), u1(Not(F[0])))];
	case 0x12: return [(_pfxLength + 8),Mov(u8(Mem(u32(Add(R_[32][((b[i+3] & 0x7))], (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))))), F[1])];
	case 0x13: return [(_pfxLength + 8),Mov(u8(Mem(u32(Add(R_[32][((b[i+3] & 0x7))], (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))))), u1(Not(F[1])))];
	case 0x14: return [(_pfxLength + 8),Mov(u8(Mem(u32(Add(R_[32][((b[i+3] & 0x7))], (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))))), F[2])];
	case 0x15: return [(_pfxLength + 8),Mov(u8(Mem(u32(Add(R_[32][((b[i+3] & 0x7))], (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))))), u1(Not(F[2])))];
	case 0x16: return [(_pfxLength + 8),Mov(u8(Mem(u32(Add(R_[32][((b[i+3] & 0x7))], (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))))), u1(Or(F[1], F[2])))];
	case 0x17: return [(_pfxLength + 8),Mov(u8(Mem(u32(Add(R_[32][((b[i+3] & 0x7))], (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))))), u1(And(u1(Not(F[1])), u1(Not(F[2])))))];
	case 0x18: return [(_pfxLength + 8),Mov(u8(Mem(u32(Add(R_[32][((b[i+3] & 0x7))], (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))))), F[3])];
	case 0x19: return [(_pfxLength + 8),Mov(u8(Mem(u32(Add(R_[32][((b[i+3] & 0x7))], (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))))), u1(Not(F[3])))];
	case 0x1a: return [(_pfxLength + 8),Mov(u8(Mem(u32(Add(R_[32][((b[i+3] & 0x7))], (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))))), F[4])];
	case 0x1b: return [(_pfxLength + 8),Mov(u8(Mem(u32(Add(R_[32][((b[i+3] & 0x7))], (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))))), u1(Not(F[4])))];
	case 0x1c: return [(_pfxLength + 8),Mov(u8(Mem(u32(Add(R_[32][((b[i+3] & 0x7))], (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))))), u1(Not(Eq(F[0], F[3]))))];
	case 0x1d: return [(_pfxLength + 8),Mov(u8(Mem(u32(Add(R_[32][((b[i+3] & 0x7))], (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))))), Eq(F[0], F[3]))];
	case 0x1e: return [(_pfxLength + 8),Mov(u8(Mem(u32(Add(R_[32][((b[i+3] & 0x7))], (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))))), u1(Or(F[2], u1(Not(Eq(F[0], F[3]))))))];
	case 0x1f: return [(_pfxLength + 8),Mov(u8(Mem(u32(Add(R_[32][((b[i+3] & 0x7))], (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))))), u1(And(u1(Not(F[2])), Eq(F[0], F[3]))))];
	case 0x23: return [(_pfxLength + 8),Mov(F[1], u1(Not(Eq(And(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+3] & 0x7))], (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))))), LSL(1, R_[32][(((b[i+2] & 0x38)>>>3))])), 0))))];
	case 0x2b: return [(_pfxLength + 8),Mov(F[1], u1(Not(Eq(And(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+3] & 0x7))], (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))))))), LSL(1, R_[32][(((b[i+2] & 0x38)>>>3))])), 0)))),Mov($0, Or($0, LSL(1, R_[32][(((b[i+2] & 0x38)>>>3))])))];
	case 0x2d: return [(_pfxLength + 8),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+3] & 0x7))], (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))))))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, R_[8][1])), u32(And(R_[32][(((b[i+2] & 0x38)>>>3))], u32(LSL(u32(Add(u32(LSL(1, R_[8][1])), -1)), i8(Add(i8(Neg(R_[8][1])), 32))))))))];
	case 0x2f: return [(_pfxLength + 8),Mov(($0 = i32(R_[32][(((b[i+2] & 0x38)>>>3))])), Mul($0, int[(_pfxSizeSpecifier ? 16 : 32)](uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+3] & 0x7))], (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))))))))];
	case 0x36: return [(_pfxLength + 8),Mov(R_[32][(((b[i+2] & 0x38)>>>3))], u8(Mem(u32(Add(R_[32][((b[i+3] & 0x7))], (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))))))];
	case 0x37: return [(_pfxLength + 8),Mov(R_[32][(((b[i+2] & 0x38)>>>3))], u16(Mem(u32(Add(R_[32][((b[i+3] & 0x7))], (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))))))];
	case 0x3e: return [(_pfxLength + 8),Mov(R_[32][(((b[i+2] & 0x38)>>>3))], i32(u8(Mem(u32(Add(R_[32][((b[i+3] & 0x7))], (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))))))))];
	case 0x3f: return [(_pfxLength + 8),Mov(R_[32][(((b[i+2] & 0x38)>>>3))], i32(u16(Mem(u32(Add(R_[32][((b[i+3] & 0x7))], (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))))))))];
	}
if(((b[i+0]|(b[i+1]<<8)|(b[i+2]<<16)|((b[i+3] & 0x7)<<24)) & 0x747c0ff) == 0x504800f)
	switch((b[i+1]|(b[i+2]<<8)) & 0x803f) {
	case 0x10: return [(_pfxLength + 8),Mov(u8(Mem(u32(Add(u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))))), F[0])];
	case 0x8010: return [(_pfxLength + 8),Mov(u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))))))))), F[0])];
	case 0x11: return [(_pfxLength + 8),Mov(u8(Mem(u32(Add(u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))))), u1(Not(F[0])))];
	case 0x8011: return [(_pfxLength + 8),Mov(u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))))))))), u1(Not(F[0])))];
	case 0x12: return [(_pfxLength + 8),Mov(u8(Mem(u32(Add(u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))))), F[1])];
	case 0x8012: return [(_pfxLength + 8),Mov(u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))))))))), F[1])];
	case 0x13: return [(_pfxLength + 8),Mov(u8(Mem(u32(Add(u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))))), u1(Not(F[1])))];
	case 0x8013: return [(_pfxLength + 8),Mov(u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))))))))), u1(Not(F[1])))];
	case 0x14: return [(_pfxLength + 8),Mov(u8(Mem(u32(Add(u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))))), F[2])];
	case 0x8014: return [(_pfxLength + 8),Mov(u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))))))))), F[2])];
	case 0x15: return [(_pfxLength + 8),Mov(u8(Mem(u32(Add(u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))))), u1(Not(F[2])))];
	case 0x8015: return [(_pfxLength + 8),Mov(u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))))))))), u1(Not(F[2])))];
	case 0x16: return [(_pfxLength + 8),Mov(u8(Mem(u32(Add(u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))))), u1(Or(F[1], F[2])))];
	case 0x8016: return [(_pfxLength + 8),Mov(u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))))))))), u1(Or(F[1], F[2])))];
	case 0x17: return [(_pfxLength + 8),Mov(u8(Mem(u32(Add(u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))))), u1(And(u1(Not(F[1])), u1(Not(F[2])))))];
	case 0x8017: return [(_pfxLength + 8),Mov(u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))))))))), u1(And(u1(Not(F[1])), u1(Not(F[2])))))];
	case 0x18: return [(_pfxLength + 8),Mov(u8(Mem(u32(Add(u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))))), F[3])];
	case 0x8018: return [(_pfxLength + 8),Mov(u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))))))))), F[3])];
	case 0x19: return [(_pfxLength + 8),Mov(u8(Mem(u32(Add(u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))))), u1(Not(F[3])))];
	case 0x8019: return [(_pfxLength + 8),Mov(u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))))))))), u1(Not(F[3])))];
	case 0x1a: return [(_pfxLength + 8),Mov(u8(Mem(u32(Add(u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))))), F[4])];
	case 0x801a: return [(_pfxLength + 8),Mov(u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))))))))), F[4])];
	case 0x1b: return [(_pfxLength + 8),Mov(u8(Mem(u32(Add(u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))))), u1(Not(F[4])))];
	case 0x801b: return [(_pfxLength + 8),Mov(u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))))))))), u1(Not(F[4])))];
	case 0x1c: return [(_pfxLength + 8),Mov(u8(Mem(u32(Add(u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))))), u1(Not(Eq(F[0], F[3]))))];
	case 0x801c: return [(_pfxLength + 8),Mov(u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))))))))), u1(Not(Eq(F[0], F[3]))))];
	case 0x1d: return [(_pfxLength + 8),Mov(u8(Mem(u32(Add(u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))))), Eq(F[0], F[3]))];
	case 0x801d: return [(_pfxLength + 8),Mov(u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))))))))), Eq(F[0], F[3]))];
	case 0x1e: return [(_pfxLength + 8),Mov(u8(Mem(u32(Add(u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))))), u1(Or(F[2], u1(Not(Eq(F[0], F[3]))))))];
	case 0x801e: return [(_pfxLength + 8),Mov(u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))))))))), u1(Or(F[2], u1(Not(Eq(F[0], F[3]))))))];
	case 0x1f: return [(_pfxLength + 8),Mov(u8(Mem(u32(Add(u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))))), u1(And(u1(Not(F[2])), Eq(F[0], F[3]))))];
	case 0x801f: return [(_pfxLength + 8),Mov(u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))))))))), u1(And(u1(Not(F[2])), Eq(F[0], F[3]))))];
	case 0x23: return [(_pfxLength + 8),Mov(F[1], u1(Not(Eq(And(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))))), LSL(1, R_[32][(((b[i+2] & 0x38)>>>3))])), 0))))];
	case 0x8023: return [(_pfxLength + 8),Mov(F[1], u1(Not(Eq(And(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))))))))), LSL(1, R_[32][(((b[i+2] & 0x38)>>>3))])), 0))))];
	case 0x2b: return [(_pfxLength + 8),Mov(F[1], u1(Not(Eq(And(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))))))), LSL(1, R_[32][(((b[i+2] & 0x38)>>>3))])), 0)))),Mov($0, Or($0, LSL(1, R_[32][(((b[i+2] & 0x38)>>>3))])))];
	case 0x802b: return [(_pfxLength + 8),Mov(F[1], u1(Not(Eq(And(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))))))))), LSL(1, R_[32][(((b[i+2] & 0x38)>>>3))])), 0)))),Mov($0, Or($0, LSL(1, R_[32][(((b[i+2] & 0x38)>>>3))])))];
	case 0x2d: return [(_pfxLength + 8),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))))))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, R_[8][1])), u32(And(R_[32][(((b[i+2] & 0x38)>>>3))], u32(LSL(u32(Add(u32(LSL(1, R_[8][1])), -1)), i8(Add(i8(Neg(R_[8][1])), 32))))))))];
	case 0x802d: return [(_pfxLength + 8),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))))))))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, R_[8][1])), u32(And(R_[32][(((b[i+2] & 0x38)>>>3))], u32(LSL(u32(Add(u32(LSL(1, R_[8][1])), -1)), i8(Add(i8(Neg(R_[8][1])), 32))))))))];
	case 0x2f: return [(_pfxLength + 8),Mov(($0 = i32(R_[32][(((b[i+2] & 0x38)>>>3))])), Mul($0, int[(_pfxSizeSpecifier ? 16 : 32)](uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))))))))];
	case 0x802f: return [(_pfxLength + 8),Mov(($0 = i32(R_[32][(((b[i+2] & 0x38)>>>3))])), Mul($0, int[(_pfxSizeSpecifier ? 16 : 32)](uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))))))))))))];
	case 0x36: return [(_pfxLength + 8),Mov(R_[32][(((b[i+2] & 0x38)>>>3))], u8(Mem(u32(Add(u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))))))];
	case 0x8036: return [(_pfxLength + 8),Mov(R_[32][(((b[i+2] & 0x38)>>>3))], u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))))))))))];
	case 0x37: return [(_pfxLength + 8),Mov(R_[32][(((b[i+2] & 0x38)>>>3))], u16(Mem(u32(Add(u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))))))];
	case 0x8037: return [(_pfxLength + 8),Mov(R_[32][(((b[i+2] & 0x38)>>>3))], u16(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))))))))))];
	case 0x3e: return [(_pfxLength + 8),Mov(R_[32][(((b[i+2] & 0x38)>>>3))], i32(u8(Mem(u32(Add(u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))))))))];
	case 0x803e: return [(_pfxLength + 8),Mov(R_[32][(((b[i+2] & 0x38)>>>3))], i32(u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))))))))))];
	case 0x3f: return [(_pfxLength + 8),Mov(R_[32][(((b[i+2] & 0x38)>>>3))], i32(u16(Mem(u32(Add(u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))))))))];
	case 0x803f: return [(_pfxLength + 8),Mov(R_[32][(((b[i+2] & 0x38)>>>3))], i32(u16(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))))))))))];
	}
if(((b[i+0]|(b[i+1]<<8)|(b[i+2]<<16)) & 0xc0ffff) == 0x80ac0f)
	switch(0) {
	case 0x0: return [(_pfxLength + 8),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, ($1 = (((b[i+7])<<24)>>24)))), u32(And(R_[32][(((b[i+2] & 0x38)>>>3))], (($68 = ((($67 = ((($66 = (1 << $1)&~0), ($66 < 0 ? $66+0x100000000 : $66)) + -1)&~0), ($67 < 0 ? $67+0x100000000 : $67)) << (((((-$1<<24)>>24) + 32)<<24)>>24))&~0), ($68 < 0 ? $68+0x100000000 : $68))))))];
	}
if(((b[i+0]|(b[i+1]<<8)|((b[i+2] & 0x7f)<<16)) & 0x46c0ff) == 0x4800f)
	switch((b[i+1]|(b[i+2]<<8)) & 0x813f) {
	case 0x8010: return [(_pfxLength + 8),Mov(u8(Mem(u32(Add(u32(Add(R_[32][((b[i+3] & 0x7))], u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))))), F[0])];
	case 0x8011: return [(_pfxLength + 8),Mov(u8(Mem(u32(Add(u32(Add(R_[32][((b[i+3] & 0x7))], u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))))), u1(Not(F[0])))];
	case 0x8012: return [(_pfxLength + 8),Mov(u8(Mem(u32(Add(u32(Add(R_[32][((b[i+3] & 0x7))], u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))))), F[1])];
	case 0x8013: return [(_pfxLength + 8),Mov(u8(Mem(u32(Add(u32(Add(R_[32][((b[i+3] & 0x7))], u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))))), u1(Not(F[1])))];
	case 0x8014: return [(_pfxLength + 8),Mov(u8(Mem(u32(Add(u32(Add(R_[32][((b[i+3] & 0x7))], u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))))), F[2])];
	case 0x8015: return [(_pfxLength + 8),Mov(u8(Mem(u32(Add(u32(Add(R_[32][((b[i+3] & 0x7))], u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))))), u1(Not(F[2])))];
	case 0x8016: return [(_pfxLength + 8),Mov(u8(Mem(u32(Add(u32(Add(R_[32][((b[i+3] & 0x7))], u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))))), u1(Or(F[1], F[2])))];
	case 0x8017: return [(_pfxLength + 8),Mov(u8(Mem(u32(Add(u32(Add(R_[32][((b[i+3] & 0x7))], u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))))), u1(And(u1(Not(F[1])), u1(Not(F[2])))))];
	case 0x8018: return [(_pfxLength + 8),Mov(u8(Mem(u32(Add(u32(Add(R_[32][((b[i+3] & 0x7))], u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))))), F[3])];
	case 0x8019: return [(_pfxLength + 8),Mov(u8(Mem(u32(Add(u32(Add(R_[32][((b[i+3] & 0x7))], u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))))), u1(Not(F[3])))];
	case 0x801a: return [(_pfxLength + 8),Mov(u8(Mem(u32(Add(u32(Add(R_[32][((b[i+3] & 0x7))], u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))))), F[4])];
	case 0x801b: return [(_pfxLength + 8),Mov(u8(Mem(u32(Add(u32(Add(R_[32][((b[i+3] & 0x7))], u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))))), u1(Not(F[4])))];
	case 0x801c: return [(_pfxLength + 8),Mov(u8(Mem(u32(Add(u32(Add(R_[32][((b[i+3] & 0x7))], u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))))), u1(Not(Eq(F[0], F[3]))))];
	case 0x801d: return [(_pfxLength + 8),Mov(u8(Mem(u32(Add(u32(Add(R_[32][((b[i+3] & 0x7))], u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))))), Eq(F[0], F[3]))];
	case 0x801e: return [(_pfxLength + 8),Mov(u8(Mem(u32(Add(u32(Add(R_[32][((b[i+3] & 0x7))], u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))))), u1(Or(F[2], u1(Not(Eq(F[0], F[3]))))))];
	case 0x801f: return [(_pfxLength + 8),Mov(u8(Mem(u32(Add(u32(Add(R_[32][((b[i+3] & 0x7))], u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))))), u1(And(u1(Not(F[2])), Eq(F[0], F[3]))))];
	case 0x8023: return [(_pfxLength + 8),Mov(F[1], u1(Not(Eq(And(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+3] & 0x7))], u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))))), LSL(1, R_[32][(((b[i+2] & 0x38)>>>3))])), 0))))];
	case 0x802b: return [(_pfxLength + 8),Mov(F[1], u1(Not(Eq(And(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+3] & 0x7))], u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))))))), LSL(1, R_[32][(((b[i+2] & 0x38)>>>3))])), 0)))),Mov($0, Or($0, LSL(1, R_[32][(((b[i+2] & 0x38)>>>3))])))];
	case 0x12c: return [(_pfxLength + 8),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, ($1 = (((b[i+7])<<24)>>24)))), u32(And(R_[32][(((b[i+2] & 0x38)>>>3))], (($83 = ((($82 = ((($81 = (1 << $1)&~0), ($81 < 0 ? $81+0x100000000 : $81)) + -1)&~0), ($82 < 0 ? $82+0x100000000 : $82)) << (((((-$1<<24)>>24) + 32)<<24)>>24))&~0), ($83 < 0 ? $83+0x100000000 : $83))))))];
	case 0x802d: return [(_pfxLength + 8),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+3] & 0x7))], u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))))))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, R_[8][1])), u32(And(R_[32][(((b[i+2] & 0x38)>>>3))], u32(LSL(u32(Add(u32(LSL(1, R_[8][1])), -1)), i8(Add(i8(Neg(R_[8][1])), 32))))))))];
	case 0x802f: return [(_pfxLength + 8),Mov(($0 = i32(R_[32][(((b[i+2] & 0x38)>>>3))])), Mul($0, int[(_pfxSizeSpecifier ? 16 : 32)](uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+3] & 0x7))], u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))))))))];
	case 0x8036: return [(_pfxLength + 8),Mov(R_[32][(((b[i+2] & 0x38)>>>3))], u8(Mem(u32(Add(u32(Add(R_[32][((b[i+3] & 0x7))], u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))))))];
	case 0x8037: return [(_pfxLength + 8),Mov(R_[32][(((b[i+2] & 0x38)>>>3))], u16(Mem(u32(Add(u32(Add(R_[32][((b[i+3] & 0x7))], u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))))))];
	case 0x803e: return [(_pfxLength + 8),Mov(R_[32][(((b[i+2] & 0x38)>>>3))], i32(u8(Mem(u32(Add(u32(Add(R_[32][((b[i+3] & 0x7))], u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))))))))];
	case 0x803f: return [(_pfxLength + 8),Mov(R_[32][(((b[i+2] & 0x38)>>>3))], i32(u16(Mem(u32(Add(u32(Add(R_[32][((b[i+3] & 0x7))], u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))))))))];
	}
if(((b[i+0]|(b[i+1]<<8)|((b[i+2] & 0x3f)<<16)) & 0x3f07fd) == 0x250469)
	switch((((b[i+0] & 0xfe)>>>1)|(b[i+1]<<7)) & 0x6001) {
	case 0x2000: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 8),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Mul(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24))))), int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))))];
	case 0x1: return [(_pfxLength + 8),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Mul(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), ((((b[i+7])<<24)>>24)&~0)))];
	case 0x4001: return [(_pfxLength + 8),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Mul(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))), ((((b[i+7])<<24)>>24)&~0)))];
	}
if(((b[i+0]|(b[i+1]<<8)|((b[i+2] & 0x3f)<<16)) & 0x3807fd) == 0x200469)
	switch((((b[i+0] & 0xfe)>>>1)|(b[i+1]<<7)) & 0x6001) {
	case 0x2000: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 8),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Mul(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24))))), int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))))];
	case 0x4001: return [(_pfxLength + 8),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Mul(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))), ((((b[i+7])<<24)>>24)&~0)))];
	}
if(((b[i+0]|(b[i+1]<<8)|((b[i+2] & 0x7)<<16)) & 0x707fd) == 0x50469)
	switch((((b[i+0] & 0xfe)>>>1)|(b[i+1]<<7)) & 0x6001) {
	case 0x2000: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 8),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Mul(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24)))))))), int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))))];
	case 0x1: return [(_pfxLength + 8),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Mul(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))), ((((b[i+7])<<24)>>24)&~0)))];
	case 0x4001: return [(_pfxLength + 8),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Mul(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))))), ((((b[i+7])<<24)>>24)&~0)))];
	}
if(((b[i+0]|((b[i+1] & 0x7)<<8)) & 0x7fd) == 0x469)
	switch((((b[i+0] & 0xfe)>>>1)|(b[i+1]<<7)) & 0x6001) {
	case 0x2000: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 8),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Mul(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24))))), int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))))];
	case 0x4001: return [(_pfxLength + 8),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Mul(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))), ((((b[i+7])<<24)>>24)&~0)))];
	}
if(((((b[i+0] & 0xf8)>>>3)|(b[i+1]<<5)|((b[i+2] & 0x3f)<<13)) & 0x7e0f1) == 0x4a090)
	switch((b[i+0]|(b[i+1]<<8)) & 0xf877) {
	case 0x0: return [(_pfxLength + 8),Mov(($0 = u8(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))), u8(Add($0, (((b[i+7])<<24)>>24))))];
	case 0x8000: return [(_pfxLength + 8),Mov(($0 = u8(Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(Add($0, (((b[i+7])<<24)>>24))))];
	case 0x4001: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 8),Mov(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24)))))), Add($1, int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))))];
	case 0x2: return [(_pfxLength + 8),Mov(($0 = u8(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))), u8(Add($0, (((b[i+7])<<24)>>24))))];
	case 0x8002: return [(_pfxLength + 8),Mov(($0 = u8(Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(Add($0, (((b[i+7])<<24)>>24))))];
	case 0x3: return [(_pfxLength + 8),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))), Add($0, (((b[i+7])<<24)>>24)))];
	case 0x8003: return [(_pfxLength + 8),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), Add($0, (((b[i+7])<<24)>>24)))];
	case 0x800: return [(_pfxLength + 8),Mov(($0 = u8(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))), u8(Or($0, ((((b[i+7])<<24)>>24)&0xff))))];
	case 0x8800: return [(_pfxLength + 8),Mov(($0 = u8(Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(Or($0, ((((b[i+7])<<24)>>24)&0xff))))];
	case 0x4801: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 8),Mov(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24)))))), Or($1, uint[(_pfxSizeSpecifier ? 16 : 32)](int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))))))];
	case 0x802: return [(_pfxLength + 8),Mov(($0 = u8(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))), u8(Or($0, ((((b[i+7])<<24)>>24)&0xff))))];
	case 0x8802: return [(_pfxLength + 8),Mov(($0 = u8(Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(Or($0, ((((b[i+7])<<24)>>24)&0xff))))];
	case 0x803: return [(_pfxLength + 8),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))), Or($0, uint[(_pfxSizeSpecifier ? 16 : 32)]((((b[i+7])<<24)>>24))))];
	case 0x8803: return [(_pfxLength + 8),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), Or($0, uint[(_pfxSizeSpecifier ? 16 : 32)]((((b[i+7])<<24)>>24))))];
	case 0x1000: return [(_pfxLength + 8),Mov(($0 = u8(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))), u8(Add($0, u8(Add((((b[i+7])<<24)>>24), u8(F[1]))))))];
	case 0x9000: return [(_pfxLength + 8),Mov(($0 = u8(Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(Add($0, u8(Add((((b[i+7])<<24)>>24), u8(F[1]))))))];
	case 0x5001: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 8),Mov(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24)))))), Add($1, Add(int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))), uint[(_pfxSizeSpecifier ? 16 : 32)](F[1]))))];
	case 0x1002: return [(_pfxLength + 8),Mov(($0 = u8(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))), u8(Add($0, u8(Add((((b[i+7])<<24)>>24), u8(F[1]))))))];
	case 0x9002: return [(_pfxLength + 8),Mov(($0 = u8(Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(Add($0, u8(Add((((b[i+7])<<24)>>24), u8(F[1]))))))];
	case 0x1003: return [(_pfxLength + 8),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))), Add($0, Add((((b[i+7])<<24)>>24), uint[(_pfxSizeSpecifier ? 16 : 32)](F[1]))))];
	case 0x9003: return [(_pfxLength + 8),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), Add($0, Add((((b[i+7])<<24)>>24), uint[(_pfxSizeSpecifier ? 16 : 32)](F[1]))))];
	case 0x1800: return [(_pfxLength + 8),Mov(($0 = u8(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))), u8(Add(($1 = u8(Add($0, ((-($2 = (((b[i+7])<<24)>>24))<<24)>>24)))), i8(Neg(($3 = u8(F[1])))))))];
	case 0x9800: return [(_pfxLength + 8),Mov(($0 = u8(Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(Add(($1 = u8(Add($0, ((-($2 = (((b[i+7])<<24)>>24))<<24)>>24)))), i8(Neg(($3 = u8(F[1])))))))];
	case 0x5801: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 8),Mov(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24)))))), Add(($2 = Add($1, int[(_pfxSizeSpecifier ? 16 : 32)](-($3 = int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))))))), int[(_pfxSizeSpecifier ? 16 : 32)](Neg(($4 = uint[(_pfxSizeSpecifier ? 16 : 32)](F[1]))))))];
	case 0x1802: return [(_pfxLength + 8),Mov(($0 = u8(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))), u8(Add(($1 = u8(Add($0, ((-($2 = (((b[i+7])<<24)>>24))<<24)>>24)))), i8(Neg(($3 = u8(F[1])))))))];
	case 0x9802: return [(_pfxLength + 8),Mov(($0 = u8(Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(Add(($1 = u8(Add($0, ((-($2 = (((b[i+7])<<24)>>24))<<24)>>24)))), i8(Neg(($3 = u8(F[1])))))))];
	case 0x1803: return [(_pfxLength + 8),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))), Add(($1 = Add($0, ((-($2 = (((b[i+7])<<24)>>24))<<24)>>24))), int[(_pfxSizeSpecifier ? 16 : 32)](Neg(($3 = uint[(_pfxSizeSpecifier ? 16 : 32)](F[1]))))))];
	case 0x9803: return [(_pfxLength + 8),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), Add(($1 = Add($0, ((-($2 = (((b[i+7])<<24)>>24))<<24)>>24))), int[(_pfxSizeSpecifier ? 16 : 32)](Neg(($3 = uint[(_pfxSizeSpecifier ? 16 : 32)](F[1]))))))];
	case 0x2000: return [(_pfxLength + 8),Mov(($0 = u8(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))), u8(And($0, ((((b[i+7])<<24)>>24)&0xff))))];
	case 0xa000: return [(_pfxLength + 8),Mov(($0 = u8(Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(And($0, ((((b[i+7])<<24)>>24)&0xff))))];
	case 0x6001: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 8),Mov(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24)))))), And($1, uint[(_pfxSizeSpecifier ? 16 : 32)](int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))))))];
	case 0x2002: return [(_pfxLength + 8),Mov(($0 = u8(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))), u8(And($0, ((((b[i+7])<<24)>>24)&0xff))))];
	case 0xa002: return [(_pfxLength + 8),Mov(($0 = u8(Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(And($0, ((((b[i+7])<<24)>>24)&0xff))))];
	case 0x2003: return [(_pfxLength + 8),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))), And($0, uint[(_pfxSizeSpecifier ? 16 : 32)]((((b[i+7])<<24)>>24))))];
	case 0xa003: return [(_pfxLength + 8),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), And($0, uint[(_pfxSizeSpecifier ? 16 : 32)]((((b[i+7])<<24)>>24))))];
	case 0x2800: return [(_pfxLength + 8),Mov(F[2], Eq(($0 = u8(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))), ($1 = (((b[i+7])<<24)>>24)))),Mov(F[1], Lt($0, $1)),Mov($0, u8(Add($0, ((-$1<<24)>>24))))];
	case 0xa800: return [(_pfxLength + 8),Mov(F[2], Eq(($0 = u8(Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), ($1 = (((b[i+7])<<24)>>24)))),Mov(F[1], Lt($0, $1)),Mov($0, u8(Add($0, ((-$1<<24)>>24))))];
	case 0x6801: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 8),Mov(F[2], Eq(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24)))))), ($2 = int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))))),Mov(F[1], Lt($1, $2)),Mov($1, Add($1, int[(_pfxSizeSpecifier ? 16 : 32)](-$2)))];
	case 0x2802: return [(_pfxLength + 8),Mov(F[2], Eq(($0 = u8(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))), ($1 = (((b[i+7])<<24)>>24)))),Mov(F[1], Lt($0, $1)),Mov($0, u8(Add($0, ((-$1<<24)>>24))))];
	case 0xa802: return [(_pfxLength + 8),Mov(F[2], Eq(($0 = u8(Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), ($1 = (((b[i+7])<<24)>>24)))),Mov(F[1], Lt($0, $1)),Mov($0, u8(Add($0, ((-$1<<24)>>24))))];
	case 0x2803: return [(_pfxLength + 8),Mov(F[2], Eq(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))), ($1 = (((b[i+7])<<24)>>24)))),Mov(F[1], Lt($0, $1)),Mov($0, Add($0, ((-$1<<24)>>24)))];
	case 0xa803: return [(_pfxLength + 8),Mov(F[2], Eq(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), ($1 = (((b[i+7])<<24)>>24)))),Mov(F[1], Lt($0, $1)),Mov($0, Add($0, ((-$1<<24)>>24)))];
	case 0x3000: return [(_pfxLength + 8),Mov(($0 = u8(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))), u8(Xor($0, (((b[i+7])<<24)>>24))))];
	case 0xb000: return [(_pfxLength + 8),Mov(($0 = u8(Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(Xor($0, (((b[i+7])<<24)>>24))))];
	case 0x7001: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 8),Mov(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24)))))), Xor($1, int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))))];
	case 0x3002: return [(_pfxLength + 8),Mov(($0 = u8(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))), u8(Xor($0, (((b[i+7])<<24)>>24))))];
	case 0xb002: return [(_pfxLength + 8),Mov(($0 = u8(Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(Xor($0, (((b[i+7])<<24)>>24))))];
	case 0x3003: return [(_pfxLength + 8),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))), Xor($0, (((b[i+7])<<24)>>24)))];
	case 0xb003: return [(_pfxLength + 8),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), Xor($0, (((b[i+7])<<24)>>24)))];
	case 0x3800: return [(_pfxLength + 8),Mov(F[2], Eq(($0 = u8(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))), ($1 = (((b[i+7])<<24)>>24)))),Mov(F[1], Lt($0, $1))];
	case 0xb800: return [(_pfxLength + 8),Mov(F[2], Eq(($0 = u8(Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), ($1 = (((b[i+7])<<24)>>24)))),Mov(F[1], Lt($0, $1))];
	case 0x7801: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 8),Mov(F[2], Eq(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24)))))), ($2 = int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))))),Mov(F[1], Lt($1, $2))];
	case 0x3802: return [(_pfxLength + 8),Mov(F[2], Eq(($0 = u8(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))), ($1 = (((b[i+7])<<24)>>24)))),Mov(F[1], Lt($0, $1))];
	case 0xb802: return [(_pfxLength + 8),Mov(F[2], Eq(($0 = u8(Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), ($1 = (((b[i+7])<<24)>>24)))),Mov(F[1], Lt($0, $1))];
	case 0x3803: return [(_pfxLength + 8),Mov(F[2], Eq(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))), ($1 = (((b[i+7])<<24)>>24)))),Mov(F[1], Lt($0, $1))];
	case 0xb803: return [(_pfxLength + 8),Mov(F[2], Eq(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), ($1 = (((b[i+7])<<24)>>24)))),Mov(F[1], Lt($0, $1))];
	case 0x46: return [(_pfxLength + 8),Mov(u8(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), (((b[i+7])<<24)>>24))];
	case 0x8046: return [(_pfxLength + 8),Mov(u8(Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))), (((b[i+7])<<24)>>24))];
	case 0x4047: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 8),Mov(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24))))), int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))))];
	case 0x40: return [(_pfxLength + 8),Mov(($0 = u8(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))), u8(Or(u8(LSL($0, ($1 = (((b[i+7])<<24)>>24)))), u8(LSR($0, (((((-$1<<24)>>24) + 8)<<24)>>24))))))];
	case 0x8040: return [(_pfxLength + 8),Mov(($0 = u8(Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(Or(u8(LSL($0, ($1 = (((b[i+7])<<24)>>24)))), u8(LSR($0, (((((-$1<<24)>>24) + 8)<<24)>>24))))))];
	case 0x41: return [(_pfxLength + 8),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, ($1 = (((b[i+7])<<24)>>24)))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, ((_pfxSizeSpecifier ? 16 : 32) + ((-$1<<24)>>24))))))];
	case 0x8041: return [(_pfxLength + 8),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, ($1 = (((b[i+7])<<24)>>24)))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, ((_pfxSizeSpecifier ? 16 : 32) + ((-$1<<24)>>24))))))];
	case 0x840: return [(_pfxLength + 8),Mov(($0 = u8(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))), u8(Or(u8(LSR($0, ($1 = (((b[i+7])<<24)>>24)))), u8(LSL($0, (((((-$1<<24)>>24) + 8)<<24)>>24))))))];
	case 0x8840: return [(_pfxLength + 8),Mov(($0 = u8(Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(Or(u8(LSR($0, ($1 = (((b[i+7])<<24)>>24)))), u8(LSL($0, (((((-$1<<24)>>24) + 8)<<24)>>24))))))];
	case 0x841: return [(_pfxLength + 8),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, ($1 = (((b[i+7])<<24)>>24)))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, ((_pfxSizeSpecifier ? 16 : 32) + ((-$1<<24)>>24))))))];
	case 0x8841: return [(_pfxLength + 8),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, ($1 = (((b[i+7])<<24)>>24)))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, ((_pfxSizeSpecifier ? 16 : 32) + ((-$1<<24)>>24))))))];
	case 0x2040: return [(_pfxLength + 8),Mov(($0 = u8(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))), u8(LSL($0, (((b[i+7])<<24)>>24))))];
	case 0xa040: return [(_pfxLength + 8),Mov(($0 = u8(Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(LSL($0, (((b[i+7])<<24)>>24))))];
	case 0x2041: return [(_pfxLength + 8),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, (((b[i+7])<<24)>>24))))];
	case 0xa041: return [(_pfxLength + 8),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, (((b[i+7])<<24)>>24))))];
	case 0x2840: return [(_pfxLength + 8),Mov(($0 = u8(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))), u8(LSR($0, (((b[i+7])<<24)>>24))))];
	case 0xa840: return [(_pfxLength + 8),Mov(($0 = u8(Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(LSR($0, (((b[i+7])<<24)>>24))))];
	case 0x2841: return [(_pfxLength + 8),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, (((b[i+7])<<24)>>24))))];
	case 0xa841: return [(_pfxLength + 8),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, (((b[i+7])<<24)>>24))))];
	case 0x3840: return [(_pfxLength + 8),Mov(($0 = u8(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))), u8(ASR($0, (((b[i+7])<<24)>>24))))];
	case 0xb840: return [(_pfxLength + 8),Mov(($0 = u8(Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(ASR($0, (((b[i+7])<<24)>>24))))];
	case 0x3841: return [(_pfxLength + 8),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))), uint[(_pfxSizeSpecifier ? 16 : 32)](ASR($0, (((b[i+7])<<24)>>24))))];
	case 0xb841: return [(_pfxLength + 8),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), uint[(_pfxSizeSpecifier ? 16 : 32)](ASR($0, (((b[i+7])<<24)>>24))))];
	case 0x76: return [(_pfxLength + 8),Mov(F[2], Eq(And(u8(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), (((b[i+7])<<24)>>24)), 0)),Mov(F[1], 0),Mov(F[0], 0)];
	case 0x8076: return [(_pfxLength + 8),Mov(F[2], Eq(And(u8(Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))), (((b[i+7])<<24)>>24)), 0)),Mov(F[1], 0),Mov(F[0], 0)];
	case 0x4077: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 8),Mov(F[2], Eq(And(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24))))), int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))), 0)),Mov(F[1], 0),Mov(F[0], 0)];
	}
if(((((b[i+0] & 0xf8)>>>3)|(b[i+1]<<5)|((b[i+2] & 0x3f)<<13)) & 0x700f1) == 0x40090)
	switch((b[i+0]|(b[i+1]<<8)) & 0xf877) {
	case 0x8000: return [(_pfxLength + 8),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(Add($0, (((b[i+7])<<24)>>24))))];
	case 0x4001: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 8),Mov(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24)))))), Add($1, int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))))];
	case 0x8002: return [(_pfxLength + 8),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(Add($0, (((b[i+7])<<24)>>24))))];
	case 0x8003: return [(_pfxLength + 8),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), Add($0, (((b[i+7])<<24)>>24)))];
	case 0x8800: return [(_pfxLength + 8),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(Or($0, ((((b[i+7])<<24)>>24)&0xff))))];
	case 0x4801: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 8),Mov(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24)))))), Or($1, uint[(_pfxSizeSpecifier ? 16 : 32)](int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))))))];
	case 0x8802: return [(_pfxLength + 8),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(Or($0, ((((b[i+7])<<24)>>24)&0xff))))];
	case 0x8803: return [(_pfxLength + 8),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), Or($0, uint[(_pfxSizeSpecifier ? 16 : 32)]((((b[i+7])<<24)>>24))))];
	case 0x9000: return [(_pfxLength + 8),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(Add($0, u8(Add((((b[i+7])<<24)>>24), u8(F[1]))))))];
	case 0x5001: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 8),Mov(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24)))))), Add($1, Add(int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))), uint[(_pfxSizeSpecifier ? 16 : 32)](F[1]))))];
	case 0x9002: return [(_pfxLength + 8),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(Add($0, u8(Add((((b[i+7])<<24)>>24), u8(F[1]))))))];
	case 0x9003: return [(_pfxLength + 8),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), Add($0, Add((((b[i+7])<<24)>>24), uint[(_pfxSizeSpecifier ? 16 : 32)](F[1]))))];
	case 0x9800: return [(_pfxLength + 8),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(Add(($1 = u8(Add($0, ((-($2 = (((b[i+7])<<24)>>24))<<24)>>24)))), i8(Neg(($3 = u8(F[1])))))))];
	case 0x5801: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 8),Mov(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24)))))), Add(($2 = Add($1, int[(_pfxSizeSpecifier ? 16 : 32)](-($3 = int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))))))), int[(_pfxSizeSpecifier ? 16 : 32)](Neg(($4 = uint[(_pfxSizeSpecifier ? 16 : 32)](F[1]))))))];
	case 0x9802: return [(_pfxLength + 8),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(Add(($1 = u8(Add($0, ((-($2 = (((b[i+7])<<24)>>24))<<24)>>24)))), i8(Neg(($3 = u8(F[1])))))))];
	case 0x9803: return [(_pfxLength + 8),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), Add(($1 = Add($0, ((-($2 = (((b[i+7])<<24)>>24))<<24)>>24))), int[(_pfxSizeSpecifier ? 16 : 32)](Neg(($3 = uint[(_pfxSizeSpecifier ? 16 : 32)](F[1]))))))];
	case 0xa000: return [(_pfxLength + 8),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(And($0, ((((b[i+7])<<24)>>24)&0xff))))];
	case 0x6001: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 8),Mov(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24)))))), And($1, uint[(_pfxSizeSpecifier ? 16 : 32)](int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))))))];
	case 0xa002: return [(_pfxLength + 8),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(And($0, ((((b[i+7])<<24)>>24)&0xff))))];
	case 0xa003: return [(_pfxLength + 8),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), And($0, uint[(_pfxSizeSpecifier ? 16 : 32)]((((b[i+7])<<24)>>24))))];
	case 0xa800: return [(_pfxLength + 8),Mov(F[2], Eq(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), ($1 = (((b[i+7])<<24)>>24)))),Mov(F[1], Lt($0, $1)),Mov($0, u8(Add($0, ((-$1<<24)>>24))))];
	case 0x6801: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 8),Mov(F[2], Eq(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24)))))), ($2 = int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))))),Mov(F[1], Lt($1, $2)),Mov($1, Add($1, int[(_pfxSizeSpecifier ? 16 : 32)](-$2)))];
	case 0xa802: return [(_pfxLength + 8),Mov(F[2], Eq(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), ($1 = (((b[i+7])<<24)>>24)))),Mov(F[1], Lt($0, $1)),Mov($0, u8(Add($0, ((-$1<<24)>>24))))];
	case 0xa803: return [(_pfxLength + 8),Mov(F[2], Eq(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), ($1 = (((b[i+7])<<24)>>24)))),Mov(F[1], Lt($0, $1)),Mov($0, Add($0, ((-$1<<24)>>24)))];
	case 0xb000: return [(_pfxLength + 8),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(Xor($0, (((b[i+7])<<24)>>24))))];
	case 0x7001: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 8),Mov(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24)))))), Xor($1, int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))))];
	case 0xb002: return [(_pfxLength + 8),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(Xor($0, (((b[i+7])<<24)>>24))))];
	case 0xb003: return [(_pfxLength + 8),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), Xor($0, (((b[i+7])<<24)>>24)))];
	case 0xb800: return [(_pfxLength + 8),Mov(F[2], Eq(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), ($1 = (((b[i+7])<<24)>>24)))),Mov(F[1], Lt($0, $1))];
	case 0x7801: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 8),Mov(F[2], Eq(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24)))))), ($2 = int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))))),Mov(F[1], Lt($1, $2))];
	case 0xb802: return [(_pfxLength + 8),Mov(F[2], Eq(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), ($1 = (((b[i+7])<<24)>>24)))),Mov(F[1], Lt($0, $1))];
	case 0xb803: return [(_pfxLength + 8),Mov(F[2], Eq(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), ($1 = (((b[i+7])<<24)>>24)))),Mov(F[1], Lt($0, $1))];
	case 0x8046: return [(_pfxLength + 8),Mov(u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))), (((b[i+7])<<24)>>24))];
	case 0x4047: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 8),Mov(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24))))), int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))))];
	case 0x8040: return [(_pfxLength + 8),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(Or(u8(LSL($0, ($1 = (((b[i+7])<<24)>>24)))), u8(LSR($0, (((((-$1<<24)>>24) + 8)<<24)>>24))))))];
	case 0x8041: return [(_pfxLength + 8),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, ($1 = (((b[i+7])<<24)>>24)))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, ((_pfxSizeSpecifier ? 16 : 32) + ((-$1<<24)>>24))))))];
	case 0x8840: return [(_pfxLength + 8),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(Or(u8(LSR($0, ($1 = (((b[i+7])<<24)>>24)))), u8(LSL($0, (((((-$1<<24)>>24) + 8)<<24)>>24))))))];
	case 0x8841: return [(_pfxLength + 8),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, ($1 = (((b[i+7])<<24)>>24)))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, ((_pfxSizeSpecifier ? 16 : 32) + ((-$1<<24)>>24))))))];
	case 0xa040: return [(_pfxLength + 8),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(LSL($0, (((b[i+7])<<24)>>24))))];
	case 0xa041: return [(_pfxLength + 8),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, (((b[i+7])<<24)>>24))))];
	case 0xa840: return [(_pfxLength + 8),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(LSR($0, (((b[i+7])<<24)>>24))))];
	case 0xa841: return [(_pfxLength + 8),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, (((b[i+7])<<24)>>24))))];
	case 0xb840: return [(_pfxLength + 8),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(ASR($0, (((b[i+7])<<24)>>24))))];
	case 0xb841: return [(_pfxLength + 8),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), uint[(_pfxSizeSpecifier ? 16 : 32)](ASR($0, (((b[i+7])<<24)>>24))))];
	case 0x8076: return [(_pfxLength + 8),Mov(F[2], Eq(And(u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))), (((b[i+7])<<24)>>24)), 0)),Mov(F[1], 0),Mov(F[0], 0)];
	case 0x4077: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 8),Mov(F[2], Eq(And(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24))))), int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))), 0)),Mov(F[1], 0),Mov(F[0], 0)];
	}
if(((((b[i+0] & 0xf8)>>>3)|(b[i+1]<<5)|((b[i+2] & 0x7)<<13)) & 0xe0f1) == 0xa090)
	switch((b[i+0]|(b[i+1]<<8)) & 0xf877) {
	case 0x0: return [(_pfxLength + 8),Mov(($0 = u8(Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(Add($0, (((b[i+7])<<24)>>24))))];
	case 0x8000: return [(_pfxLength + 8),Mov(($0 = u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))), u8(Add($0, (((b[i+7])<<24)>>24))))];
	case 0x4001: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 8),Mov(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24))))))))), Add($1, int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))))];
	case 0x2: return [(_pfxLength + 8),Mov(($0 = u8(Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(Add($0, (((b[i+7])<<24)>>24))))];
	case 0x8002: return [(_pfxLength + 8),Mov(($0 = u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))), u8(Add($0, (((b[i+7])<<24)>>24))))];
	case 0x3: return [(_pfxLength + 8),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), Add($0, (((b[i+7])<<24)>>24)))];
	case 0x8003: return [(_pfxLength + 8),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))), Add($0, (((b[i+7])<<24)>>24)))];
	case 0x800: return [(_pfxLength + 8),Mov(($0 = u8(Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(Or($0, ((((b[i+7])<<24)>>24)&0xff))))];
	case 0x8800: return [(_pfxLength + 8),Mov(($0 = u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))), u8(Or($0, ((((b[i+7])<<24)>>24)&0xff))))];
	case 0x4801: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 8),Mov(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24))))))))), Or($1, uint[(_pfxSizeSpecifier ? 16 : 32)](int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))))))];
	case 0x802: return [(_pfxLength + 8),Mov(($0 = u8(Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(Or($0, ((((b[i+7])<<24)>>24)&0xff))))];
	case 0x8802: return [(_pfxLength + 8),Mov(($0 = u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))), u8(Or($0, ((((b[i+7])<<24)>>24)&0xff))))];
	case 0x803: return [(_pfxLength + 8),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), Or($0, uint[(_pfxSizeSpecifier ? 16 : 32)]((((b[i+7])<<24)>>24))))];
	case 0x8803: return [(_pfxLength + 8),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))), Or($0, uint[(_pfxSizeSpecifier ? 16 : 32)]((((b[i+7])<<24)>>24))))];
	case 0x1000: return [(_pfxLength + 8),Mov(($0 = u8(Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(Add($0, u8(Add((((b[i+7])<<24)>>24), u8(F[1]))))))];
	case 0x9000: return [(_pfxLength + 8),Mov(($0 = u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))), u8(Add($0, u8(Add((((b[i+7])<<24)>>24), u8(F[1]))))))];
	case 0x5001: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 8),Mov(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24))))))))), Add($1, Add(int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))), uint[(_pfxSizeSpecifier ? 16 : 32)](F[1]))))];
	case 0x1002: return [(_pfxLength + 8),Mov(($0 = u8(Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(Add($0, u8(Add((((b[i+7])<<24)>>24), u8(F[1]))))))];
	case 0x9002: return [(_pfxLength + 8),Mov(($0 = u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))), u8(Add($0, u8(Add((((b[i+7])<<24)>>24), u8(F[1]))))))];
	case 0x1003: return [(_pfxLength + 8),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), Add($0, Add((((b[i+7])<<24)>>24), uint[(_pfxSizeSpecifier ? 16 : 32)](F[1]))))];
	case 0x9003: return [(_pfxLength + 8),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))), Add($0, Add((((b[i+7])<<24)>>24), uint[(_pfxSizeSpecifier ? 16 : 32)](F[1]))))];
	case 0x1800: return [(_pfxLength + 8),Mov(($0 = u8(Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(Add(($1 = u8(Add($0, ((-($2 = (((b[i+7])<<24)>>24))<<24)>>24)))), i8(Neg(($3 = u8(F[1])))))))];
	case 0x9800: return [(_pfxLength + 8),Mov(($0 = u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))), u8(Add(($1 = u8(Add($0, ((-($2 = (((b[i+7])<<24)>>24))<<24)>>24)))), i8(Neg(($3 = u8(F[1])))))))];
	case 0x5801: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 8),Mov(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24))))))))), Add(($2 = Add($1, int[(_pfxSizeSpecifier ? 16 : 32)](-($3 = int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))))))), int[(_pfxSizeSpecifier ? 16 : 32)](Neg(($4 = uint[(_pfxSizeSpecifier ? 16 : 32)](F[1]))))))];
	case 0x1802: return [(_pfxLength + 8),Mov(($0 = u8(Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(Add(($1 = u8(Add($0, ((-($2 = (((b[i+7])<<24)>>24))<<24)>>24)))), i8(Neg(($3 = u8(F[1])))))))];
	case 0x9802: return [(_pfxLength + 8),Mov(($0 = u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))), u8(Add(($1 = u8(Add($0, ((-($2 = (((b[i+7])<<24)>>24))<<24)>>24)))), i8(Neg(($3 = u8(F[1])))))))];
	case 0x1803: return [(_pfxLength + 8),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), Add(($1 = Add($0, ((-($2 = (((b[i+7])<<24)>>24))<<24)>>24))), int[(_pfxSizeSpecifier ? 16 : 32)](Neg(($3 = uint[(_pfxSizeSpecifier ? 16 : 32)](F[1]))))))];
	case 0x9803: return [(_pfxLength + 8),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))), Add(($1 = Add($0, ((-($2 = (((b[i+7])<<24)>>24))<<24)>>24))), int[(_pfxSizeSpecifier ? 16 : 32)](Neg(($3 = uint[(_pfxSizeSpecifier ? 16 : 32)](F[1]))))))];
	case 0x2000: return [(_pfxLength + 8),Mov(($0 = u8(Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(And($0, ((((b[i+7])<<24)>>24)&0xff))))];
	case 0xa000: return [(_pfxLength + 8),Mov(($0 = u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))), u8(And($0, ((((b[i+7])<<24)>>24)&0xff))))];
	case 0x6001: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 8),Mov(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24))))))))), And($1, uint[(_pfxSizeSpecifier ? 16 : 32)](int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))))))];
	case 0x2002: return [(_pfxLength + 8),Mov(($0 = u8(Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(And($0, ((((b[i+7])<<24)>>24)&0xff))))];
	case 0xa002: return [(_pfxLength + 8),Mov(($0 = u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))), u8(And($0, ((((b[i+7])<<24)>>24)&0xff))))];
	case 0x2003: return [(_pfxLength + 8),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), And($0, uint[(_pfxSizeSpecifier ? 16 : 32)]((((b[i+7])<<24)>>24))))];
	case 0xa003: return [(_pfxLength + 8),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))), And($0, uint[(_pfxSizeSpecifier ? 16 : 32)]((((b[i+7])<<24)>>24))))];
	case 0x2800: return [(_pfxLength + 8),Mov(F[2], Eq(($0 = u8(Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), ($1 = (((b[i+7])<<24)>>24)))),Mov(F[1], Lt($0, $1)),Mov($0, u8(Add($0, ((-$1<<24)>>24))))];
	case 0xa800: return [(_pfxLength + 8),Mov(F[2], Eq(($0 = u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))), ($1 = (((b[i+7])<<24)>>24)))),Mov(F[1], Lt($0, $1)),Mov($0, u8(Add($0, ((-$1<<24)>>24))))];
	case 0x6801: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 8),Mov(F[2], Eq(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24))))))))), ($2 = int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))))),Mov(F[1], Lt($1, $2)),Mov($1, Add($1, int[(_pfxSizeSpecifier ? 16 : 32)](-$2)))];
	case 0x2802: return [(_pfxLength + 8),Mov(F[2], Eq(($0 = u8(Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), ($1 = (((b[i+7])<<24)>>24)))),Mov(F[1], Lt($0, $1)),Mov($0, u8(Add($0, ((-$1<<24)>>24))))];
	case 0xa802: return [(_pfxLength + 8),Mov(F[2], Eq(($0 = u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))), ($1 = (((b[i+7])<<24)>>24)))),Mov(F[1], Lt($0, $1)),Mov($0, u8(Add($0, ((-$1<<24)>>24))))];
	case 0x2803: return [(_pfxLength + 8),Mov(F[2], Eq(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), ($1 = (((b[i+7])<<24)>>24)))),Mov(F[1], Lt($0, $1)),Mov($0, Add($0, ((-$1<<24)>>24)))];
	case 0xa803: return [(_pfxLength + 8),Mov(F[2], Eq(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))), ($1 = (((b[i+7])<<24)>>24)))),Mov(F[1], Lt($0, $1)),Mov($0, Add($0, ((-$1<<24)>>24)))];
	case 0x3000: return [(_pfxLength + 8),Mov(($0 = u8(Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(Xor($0, (((b[i+7])<<24)>>24))))];
	case 0xb000: return [(_pfxLength + 8),Mov(($0 = u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))), u8(Xor($0, (((b[i+7])<<24)>>24))))];
	case 0x7001: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 8),Mov(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24))))))))), Xor($1, int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))))];
	case 0x3002: return [(_pfxLength + 8),Mov(($0 = u8(Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(Xor($0, (((b[i+7])<<24)>>24))))];
	case 0xb002: return [(_pfxLength + 8),Mov(($0 = u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))), u8(Xor($0, (((b[i+7])<<24)>>24))))];
	case 0x3003: return [(_pfxLength + 8),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), Xor($0, (((b[i+7])<<24)>>24)))];
	case 0xb003: return [(_pfxLength + 8),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))), Xor($0, (((b[i+7])<<24)>>24)))];
	case 0x3800: return [(_pfxLength + 8),Mov(F[2], Eq(($0 = u8(Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), ($1 = (((b[i+7])<<24)>>24)))),Mov(F[1], Lt($0, $1))];
	case 0xb800: return [(_pfxLength + 8),Mov(F[2], Eq(($0 = u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))), ($1 = (((b[i+7])<<24)>>24)))),Mov(F[1], Lt($0, $1))];
	case 0x7801: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 8),Mov(F[2], Eq(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24))))))))), ($2 = int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))))),Mov(F[1], Lt($1, $2))];
	case 0x3802: return [(_pfxLength + 8),Mov(F[2], Eq(($0 = u8(Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), ($1 = (((b[i+7])<<24)>>24)))),Mov(F[1], Lt($0, $1))];
	case 0xb802: return [(_pfxLength + 8),Mov(F[2], Eq(($0 = u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))), ($1 = (((b[i+7])<<24)>>24)))),Mov(F[1], Lt($0, $1))];
	case 0x3803: return [(_pfxLength + 8),Mov(F[2], Eq(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), ($1 = (((b[i+7])<<24)>>24)))),Mov(F[1], Lt($0, $1))];
	case 0xb803: return [(_pfxLength + 8),Mov(F[2], Eq(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))), ($1 = (((b[i+7])<<24)>>24)))),Mov(F[1], Lt($0, $1))];
	case 0x46: return [(_pfxLength + 8),Mov(u8(Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))), (((b[i+7])<<24)>>24))];
	case 0x8046: return [(_pfxLength + 8),Mov(u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))))), (((b[i+7])<<24)>>24))];
	case 0x4047: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 8),Mov(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24)))))))), int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))))];
	case 0x40: return [(_pfxLength + 8),Mov(($0 = u8(Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(Or(u8(LSL($0, ($1 = (((b[i+7])<<24)>>24)))), u8(LSR($0, (((((-$1<<24)>>24) + 8)<<24)>>24))))))];
	case 0x8040: return [(_pfxLength + 8),Mov(($0 = u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))), u8(Or(u8(LSL($0, ($1 = (((b[i+7])<<24)>>24)))), u8(LSR($0, (((((-$1<<24)>>24) + 8)<<24)>>24))))))];
	case 0x41: return [(_pfxLength + 8),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, ($1 = (((b[i+7])<<24)>>24)))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, ((_pfxSizeSpecifier ? 16 : 32) + ((-$1<<24)>>24))))))];
	case 0x8041: return [(_pfxLength + 8),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, ($1 = (((b[i+7])<<24)>>24)))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, ((_pfxSizeSpecifier ? 16 : 32) + ((-$1<<24)>>24))))))];
	case 0x840: return [(_pfxLength + 8),Mov(($0 = u8(Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(Or(u8(LSR($0, ($1 = (((b[i+7])<<24)>>24)))), u8(LSL($0, (((((-$1<<24)>>24) + 8)<<24)>>24))))))];
	case 0x8840: return [(_pfxLength + 8),Mov(($0 = u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))), u8(Or(u8(LSR($0, ($1 = (((b[i+7])<<24)>>24)))), u8(LSL($0, (((((-$1<<24)>>24) + 8)<<24)>>24))))))];
	case 0x841: return [(_pfxLength + 8),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, ($1 = (((b[i+7])<<24)>>24)))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, ((_pfxSizeSpecifier ? 16 : 32) + ((-$1<<24)>>24))))))];
	case 0x8841: return [(_pfxLength + 8),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, ($1 = (((b[i+7])<<24)>>24)))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, ((_pfxSizeSpecifier ? 16 : 32) + ((-$1<<24)>>24))))))];
	case 0x2040: return [(_pfxLength + 8),Mov(($0 = u8(Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(LSL($0, (((b[i+7])<<24)>>24))))];
	case 0xa040: return [(_pfxLength + 8),Mov(($0 = u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))), u8(LSL($0, (((b[i+7])<<24)>>24))))];
	case 0x2041: return [(_pfxLength + 8),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, (((b[i+7])<<24)>>24))))];
	case 0xa041: return [(_pfxLength + 8),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, (((b[i+7])<<24)>>24))))];
	case 0x2840: return [(_pfxLength + 8),Mov(($0 = u8(Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(LSR($0, (((b[i+7])<<24)>>24))))];
	case 0xa840: return [(_pfxLength + 8),Mov(($0 = u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))), u8(LSR($0, (((b[i+7])<<24)>>24))))];
	case 0x2841: return [(_pfxLength + 8),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, (((b[i+7])<<24)>>24))))];
	case 0xa841: return [(_pfxLength + 8),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, (((b[i+7])<<24)>>24))))];
	case 0x3840: return [(_pfxLength + 8),Mov(($0 = u8(Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(ASR($0, (((b[i+7])<<24)>>24))))];
	case 0xb840: return [(_pfxLength + 8),Mov(($0 = u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))), u8(ASR($0, (((b[i+7])<<24)>>24))))];
	case 0x3841: return [(_pfxLength + 8),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), uint[(_pfxSizeSpecifier ? 16 : 32)](ASR($0, (((b[i+7])<<24)>>24))))];
	case 0xb841: return [(_pfxLength + 8),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))), uint[(_pfxSizeSpecifier ? 16 : 32)](ASR($0, (((b[i+7])<<24)>>24))))];
	case 0x76: return [(_pfxLength + 8),Mov(F[2], Eq(And(u8(Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))), (((b[i+7])<<24)>>24)), 0)),Mov(F[1], 0),Mov(F[0], 0)];
	case 0x8076: return [(_pfxLength + 8),Mov(F[2], Eq(And(u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))))), (((b[i+7])<<24)>>24)), 0)),Mov(F[1], 0),Mov(F[0], 0)];
	case 0x4077: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 8),Mov(F[2], Eq(And(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24)))))))), int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))), 0)),Mov(F[1], 0),Mov(F[0], 0)];
	}
if(((((b[i+0] & 0xf8)>>>3)|((b[i+1] & 0x7)<<5)) & 0xf1) == 0x90)
	switch((b[i+0]|(b[i+1]<<8)) & 0xf877) {
	case 0x8000: return [(_pfxLength + 8),Mov(($0 = u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(Add($0, (((b[i+7])<<24)>>24))))];
	case 0x4001: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 8),Mov(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24)))))), Add($1, int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))))];
	case 0x8002: return [(_pfxLength + 8),Mov(($0 = u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(Add($0, (((b[i+7])<<24)>>24))))];
	case 0x8003: return [(_pfxLength + 8),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), Add($0, (((b[i+7])<<24)>>24)))];
	case 0x8800: return [(_pfxLength + 8),Mov(($0 = u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(Or($0, ((((b[i+7])<<24)>>24)&0xff))))];
	case 0x4801: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 8),Mov(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24)))))), Or($1, uint[(_pfxSizeSpecifier ? 16 : 32)](int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))))))];
	case 0x8802: return [(_pfxLength + 8),Mov(($0 = u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(Or($0, ((((b[i+7])<<24)>>24)&0xff))))];
	case 0x8803: return [(_pfxLength + 8),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), Or($0, uint[(_pfxSizeSpecifier ? 16 : 32)]((((b[i+7])<<24)>>24))))];
	case 0x9000: return [(_pfxLength + 8),Mov(($0 = u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(Add($0, u8(Add((((b[i+7])<<24)>>24), u8(F[1]))))))];
	case 0x5001: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 8),Mov(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24)))))), Add($1, Add(int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))), uint[(_pfxSizeSpecifier ? 16 : 32)](F[1]))))];
	case 0x9002: return [(_pfxLength + 8),Mov(($0 = u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(Add($0, u8(Add((((b[i+7])<<24)>>24), u8(F[1]))))))];
	case 0x9003: return [(_pfxLength + 8),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), Add($0, Add((((b[i+7])<<24)>>24), uint[(_pfxSizeSpecifier ? 16 : 32)](F[1]))))];
	case 0x9800: return [(_pfxLength + 8),Mov(($0 = u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(Add(($1 = u8(Add($0, ((-($2 = (((b[i+7])<<24)>>24))<<24)>>24)))), i8(Neg(($3 = u8(F[1])))))))];
	case 0x5801: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 8),Mov(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24)))))), Add(($2 = Add($1, int[(_pfxSizeSpecifier ? 16 : 32)](-($3 = int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))))))), int[(_pfxSizeSpecifier ? 16 : 32)](Neg(($4 = uint[(_pfxSizeSpecifier ? 16 : 32)](F[1]))))))];
	case 0x9802: return [(_pfxLength + 8),Mov(($0 = u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(Add(($1 = u8(Add($0, ((-($2 = (((b[i+7])<<24)>>24))<<24)>>24)))), i8(Neg(($3 = u8(F[1])))))))];
	case 0x9803: return [(_pfxLength + 8),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), Add(($1 = Add($0, ((-($2 = (((b[i+7])<<24)>>24))<<24)>>24))), int[(_pfxSizeSpecifier ? 16 : 32)](Neg(($3 = uint[(_pfxSizeSpecifier ? 16 : 32)](F[1]))))))];
	case 0xa000: return [(_pfxLength + 8),Mov(($0 = u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(And($0, ((((b[i+7])<<24)>>24)&0xff))))];
	case 0x6001: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 8),Mov(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24)))))), And($1, uint[(_pfxSizeSpecifier ? 16 : 32)](int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))))))];
	case 0xa002: return [(_pfxLength + 8),Mov(($0 = u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(And($0, ((((b[i+7])<<24)>>24)&0xff))))];
	case 0xa003: return [(_pfxLength + 8),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), And($0, uint[(_pfxSizeSpecifier ? 16 : 32)]((((b[i+7])<<24)>>24))))];
	case 0xa800: return [(_pfxLength + 8),Mov(F[2], Eq(($0 = u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), ($1 = (((b[i+7])<<24)>>24)))),Mov(F[1], Lt($0, $1)),Mov($0, u8(Add($0, ((-$1<<24)>>24))))];
	case 0x6801: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 8),Mov(F[2], Eq(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24)))))), ($2 = int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))))),Mov(F[1], Lt($1, $2)),Mov($1, Add($1, int[(_pfxSizeSpecifier ? 16 : 32)](-$2)))];
	case 0xa802: return [(_pfxLength + 8),Mov(F[2], Eq(($0 = u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), ($1 = (((b[i+7])<<24)>>24)))),Mov(F[1], Lt($0, $1)),Mov($0, u8(Add($0, ((-$1<<24)>>24))))];
	case 0xa803: return [(_pfxLength + 8),Mov(F[2], Eq(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), ($1 = (((b[i+7])<<24)>>24)))),Mov(F[1], Lt($0, $1)),Mov($0, Add($0, ((-$1<<24)>>24)))];
	case 0xb000: return [(_pfxLength + 8),Mov(($0 = u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(Xor($0, (((b[i+7])<<24)>>24))))];
	case 0x7001: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 8),Mov(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24)))))), Xor($1, int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))))];
	case 0xb002: return [(_pfxLength + 8),Mov(($0 = u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(Xor($0, (((b[i+7])<<24)>>24))))];
	case 0xb003: return [(_pfxLength + 8),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), Xor($0, (((b[i+7])<<24)>>24)))];
	case 0xb800: return [(_pfxLength + 8),Mov(F[2], Eq(($0 = u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), ($1 = (((b[i+7])<<24)>>24)))),Mov(F[1], Lt($0, $1))];
	case 0x7801: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 8),Mov(F[2], Eq(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24)))))), ($2 = int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))))),Mov(F[1], Lt($1, $2))];
	case 0xb802: return [(_pfxLength + 8),Mov(F[2], Eq(($0 = u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), ($1 = (((b[i+7])<<24)>>24)))),Mov(F[1], Lt($0, $1))];
	case 0xb803: return [(_pfxLength + 8),Mov(F[2], Eq(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), ($1 = (((b[i+7])<<24)>>24)))),Mov(F[1], Lt($0, $1))];
	case 0x8046: return [(_pfxLength + 8),Mov(u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))), (((b[i+7])<<24)>>24))];
	case 0x4047: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 8),Mov(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24))))), int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))))];
	case 0x8040: return [(_pfxLength + 8),Mov(($0 = u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(Or(u8(LSL($0, ($1 = (((b[i+7])<<24)>>24)))), u8(LSR($0, (((((-$1<<24)>>24) + 8)<<24)>>24))))))];
	case 0x8041: return [(_pfxLength + 8),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, ($1 = (((b[i+7])<<24)>>24)))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, ((_pfxSizeSpecifier ? 16 : 32) + ((-$1<<24)>>24))))))];
	case 0x8840: return [(_pfxLength + 8),Mov(($0 = u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(Or(u8(LSR($0, ($1 = (((b[i+7])<<24)>>24)))), u8(LSL($0, (((((-$1<<24)>>24) + 8)<<24)>>24))))))];
	case 0x8841: return [(_pfxLength + 8),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, ($1 = (((b[i+7])<<24)>>24)))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, ((_pfxSizeSpecifier ? 16 : 32) + ((-$1<<24)>>24))))))];
	case 0xa040: return [(_pfxLength + 8),Mov(($0 = u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(LSL($0, (((b[i+7])<<24)>>24))))];
	case 0xa041: return [(_pfxLength + 8),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, (((b[i+7])<<24)>>24))))];
	case 0xa840: return [(_pfxLength + 8),Mov(($0 = u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(LSR($0, (((b[i+7])<<24)>>24))))];
	case 0xa841: return [(_pfxLength + 8),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, (((b[i+7])<<24)>>24))))];
	case 0xb840: return [(_pfxLength + 8),Mov(($0 = u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(ASR($0, (((b[i+7])<<24)>>24))))];
	case 0xb841: return [(_pfxLength + 8),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), uint[(_pfxSizeSpecifier ? 16 : 32)](ASR($0, (((b[i+7])<<24)>>24))))];
	case 0x8076: return [(_pfxLength + 8),Mov(F[2], Eq(And(u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))), (((b[i+7])<<24)>>24)), 0)),Mov(F[1], 0),Mov(F[0], 0)];
	case 0x4077: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 8),Mov(F[2], Eq(And(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24))))), int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))), 0)),Mov(F[1], 0),Mov(F[0], 0)];
	}
if(((b[i+0]|(b[i+1]<<8)|(b[i+2]<<16)) & 0xc7c0ff) == 0x5800f)
	switch(((b[i+1] & 0x3f)) & 0x3f) {
	case 0x10: return [(_pfxLength + 7),Mov(u8(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), F[0])];
	case 0x11: return [(_pfxLength + 7),Mov(u8(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), u1(Not(F[0])))];
	case 0x12: return [(_pfxLength + 7),Mov(u8(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), F[1])];
	case 0x13: return [(_pfxLength + 7),Mov(u8(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), u1(Not(F[1])))];
	case 0x14: return [(_pfxLength + 7),Mov(u8(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), F[2])];
	case 0x15: return [(_pfxLength + 7),Mov(u8(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), u1(Not(F[2])))];
	case 0x16: return [(_pfxLength + 7),Mov(u8(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), u1(Or(F[1], F[2])))];
	case 0x17: return [(_pfxLength + 7),Mov(u8(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), u1(And(u1(Not(F[1])), u1(Not(F[2])))))];
	case 0x18: return [(_pfxLength + 7),Mov(u8(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), F[3])];
	case 0x19: return [(_pfxLength + 7),Mov(u8(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), u1(Not(F[3])))];
	case 0x1a: return [(_pfxLength + 7),Mov(u8(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), F[4])];
	case 0x1b: return [(_pfxLength + 7),Mov(u8(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), u1(Not(F[4])))];
	case 0x1c: return [(_pfxLength + 7),Mov(u8(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), u1(Not(Eq(F[0], F[3]))))];
	case 0x1d: return [(_pfxLength + 7),Mov(u8(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), Eq(F[0], F[3]))];
	case 0x1e: return [(_pfxLength + 7),Mov(u8(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), u1(Or(F[2], u1(Not(Eq(F[0], F[3]))))))];
	case 0x1f: return [(_pfxLength + 7),Mov(u8(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), u1(And(u1(Not(F[2])), Eq(F[0], F[3]))))];
	case 0x23: return [(_pfxLength + 7),Mov(F[1], u1(Not(Eq(And(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), LSL(1, R_[32][(((b[i+2] & 0x38)>>>3))])), 0))))];
	case 0x2b: return [(_pfxLength + 7),Mov(F[1], u1(Not(Eq(And(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))), LSL(1, R_[32][(((b[i+2] & 0x38)>>>3))])), 0)))),Mov($0, Or($0, LSL(1, R_[32][(((b[i+2] & 0x38)>>>3))])))];
	case 0x2d: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, R_[8][1])), u32(And(R_[32][(((b[i+2] & 0x38)>>>3))], u32(LSL(u32(Add(u32(LSL(1, R_[8][1])), -1)), i8(Add(i8(Neg(R_[8][1])), 32))))))))];
	case 0x2f: return [(_pfxLength + 7),Mov(($0 = i32(R_[32][(((b[i+2] & 0x38)>>>3))])), Mul($0, int[(_pfxSizeSpecifier ? 16 : 32)](uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))];
	case 0x36: return [(_pfxLength + 7),Mov(R_[32][(((b[i+2] & 0x38)>>>3))], u8(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))];
	case 0x37: return [(_pfxLength + 7),Mov(R_[32][(((b[i+2] & 0x38)>>>3))], u16(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))];
	case 0x3e: return [(_pfxLength + 7),Mov(R_[32][(((b[i+2] & 0x38)>>>3))], i32(u8(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))];
	case 0x3f: return [(_pfxLength + 7),Mov(R_[32][(((b[i+2] & 0x38)>>>3))], i32(u16(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))];
	}
if(((b[i+0]|(b[i+1]<<8)|(b[i+2]<<16)) & 0xc0c0ff) == 0x80800f)
	switch(((b[i+1] & 0x3f)) & 0x3f) {
	case 0x10: return [(_pfxLength + 7),Mov(u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))), F[0])];
	case 0x11: return [(_pfxLength + 7),Mov(u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))), u1(Not(F[0])))];
	case 0x12: return [(_pfxLength + 7),Mov(u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))), F[1])];
	case 0x13: return [(_pfxLength + 7),Mov(u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))), u1(Not(F[1])))];
	case 0x14: return [(_pfxLength + 7),Mov(u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))), F[2])];
	case 0x15: return [(_pfxLength + 7),Mov(u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))), u1(Not(F[2])))];
	case 0x16: return [(_pfxLength + 7),Mov(u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))), u1(Or(F[1], F[2])))];
	case 0x17: return [(_pfxLength + 7),Mov(u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))), u1(And(u1(Not(F[1])), u1(Not(F[2])))))];
	case 0x18: return [(_pfxLength + 7),Mov(u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))), F[3])];
	case 0x19: return [(_pfxLength + 7),Mov(u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))), u1(Not(F[3])))];
	case 0x1a: return [(_pfxLength + 7),Mov(u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))), F[4])];
	case 0x1b: return [(_pfxLength + 7),Mov(u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))), u1(Not(F[4])))];
	case 0x1c: return [(_pfxLength + 7),Mov(u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))), u1(Not(Eq(F[0], F[3]))))];
	case 0x1d: return [(_pfxLength + 7),Mov(u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))), Eq(F[0], F[3]))];
	case 0x1e: return [(_pfxLength + 7),Mov(u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))), u1(Or(F[2], u1(Not(Eq(F[0], F[3]))))))];
	case 0x1f: return [(_pfxLength + 7),Mov(u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))), u1(And(u1(Not(F[2])), Eq(F[0], F[3]))))];
	case 0x23: return [(_pfxLength + 7),Mov(F[1], u1(Not(Eq(And(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))), LSL(1, R_[32][(((b[i+2] & 0x38)>>>3))])), 0))))];
	case 0x2b: return [(_pfxLength + 7),Mov(F[1], u1(Not(Eq(And(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), LSL(1, R_[32][(((b[i+2] & 0x38)>>>3))])), 0)))),Mov($0, Or($0, LSL(1, R_[32][(((b[i+2] & 0x38)>>>3))])))];
	case 0x2d: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, R_[8][1])), u32(And(R_[32][(((b[i+2] & 0x38)>>>3))], u32(LSL(u32(Add(u32(LSL(1, R_[8][1])), -1)), i8(Add(i8(Neg(R_[8][1])), 32))))))))];
	case 0x2f: return [(_pfxLength + 7),Mov(($0 = i32(R_[32][(((b[i+2] & 0x38)>>>3))])), Mul($0, int[(_pfxSizeSpecifier ? 16 : 32)](uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))];
	case 0x36: return [(_pfxLength + 7),Mov(R_[32][(((b[i+2] & 0x38)>>>3))], u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))];
	case 0x37: return [(_pfxLength + 7),Mov(R_[32][(((b[i+2] & 0x38)>>>3))], u16(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))];
	case 0x3e: return [(_pfxLength + 7),Mov(R_[32][(((b[i+2] & 0x38)>>>3))], i32(u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))))];
	case 0x3f: return [(_pfxLength + 7),Mov(R_[32][(((b[i+2] & 0x38)>>>3))], i32(u16(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))))];
	}
if(((b[i+0]) & 0xfd) == 0x69)
	switch((((b[i+0] & 0xfe)>>>1)|(b[i+1]<<7)) & 0x6001) {
	case 0x2000: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 7),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Mul(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24))))), int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))];
	case 0x4001: return [(_pfxLength + 7),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Mul(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)))))), ((((b[i+6])<<24)>>24)&~0)))];
	}
if(((((b[i+0] & 0x80)>>>7)|(b[i+1]<<1)|((b[i+2] & 0x3f)<<9)) & 0x7e8f) == 0x4a09)
	switch((b[i+0]|(b[i+1]<<8)) & 0xb87f) {
	case 0xf: return [(_pfxLength + 7),Mov(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][4]))),Mov(R_[32][4], Add(R_[32][4], ((_pfxSizeSpecifier ? 16 : 32) >>> 3)))];
	case 0x800f: return [(_pfxLength + 7),Mov(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))), uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][4]))),Mov(R_[32][4], Add(R_[32][4], ((_pfxSizeSpecifier ? 16 : 32) >>> 3)))];
	case 0x50: return [(_pfxLength + 7),Mov(($0 = u8(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))), u8(Or(u8(LSL($0, 1)), u8(LSR($0, 7)))))];
	case 0x8050: return [(_pfxLength + 7),Mov(($0 = u8(Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(Or(u8(LSL($0, 1)), u8(LSR($0, 7)))))];
	case 0x51: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, 1)), uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, ((_pfxSizeSpecifier ? 16 : 32) + -1)))))];
	case 0x8051: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, 1)), uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, ((_pfxSizeSpecifier ? 16 : 32) + -1)))))];
	case 0x52: return [(_pfxLength + 7),Mov(($0 = u8(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))), u8(Or(u8(LSL($0, R_[8][1])), u8(LSR($0, i8(Add(i8(Neg(R_[8][1])), 8)))))))];
	case 0x8052: return [(_pfxLength + 7),Mov(($0 = u8(Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(Or(u8(LSL($0, R_[8][1])), u8(LSR($0, i8(Add(i8(Neg(R_[8][1])), 8)))))))];
	case 0x53: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, R_[8][1])), uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, Add((_pfxSizeSpecifier ? 16 : 32), i8(Neg(R_[8][1])))))))];
	case 0x8053: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, R_[8][1])), uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, Add((_pfxSizeSpecifier ? 16 : 32), i8(Neg(R_[8][1])))))))];
	case 0x850: return [(_pfxLength + 7),Mov(($0 = u8(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))), u8(Or(u8(LSR($0, 1)), u8(LSL($0, 7)))))];
	case 0x8850: return [(_pfxLength + 7),Mov(($0 = u8(Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(Or(u8(LSR($0, 1)), u8(LSL($0, 7)))))];
	case 0x851: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, 1)), uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, ((_pfxSizeSpecifier ? 16 : 32) + -1)))))];
	case 0x8851: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, 1)), uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, ((_pfxSizeSpecifier ? 16 : 32) + -1)))))];
	case 0x852: return [(_pfxLength + 7),Mov(($0 = u8(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))), u8(Or(u8(LSR($0, R_[8][1])), u8(LSL($0, i8(Add(i8(Neg(R_[8][1])), 8)))))))];
	case 0x8852: return [(_pfxLength + 7),Mov(($0 = u8(Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(Or(u8(LSR($0, R_[8][1])), u8(LSL($0, i8(Add(i8(Neg(R_[8][1])), 8)))))))];
	case 0x853: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, R_[8][1])), uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, Add((_pfxSizeSpecifier ? 16 : 32), i8(Neg(R_[8][1])))))))];
	case 0x8853: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, R_[8][1])), uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, Add((_pfxSizeSpecifier ? 16 : 32), i8(Neg(R_[8][1])))))))];
	case 0x2050: return [(_pfxLength + 7),Mov(($0 = u8(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))), u8(LSL($0, 1)))];
	case 0xa050: return [(_pfxLength + 7),Mov(($0 = u8(Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(LSL($0, 1)))];
	case 0x2051: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, 1)))];
	case 0xa051: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, 1)))];
	case 0x2052: return [(_pfxLength + 7),Mov(($0 = u8(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))), u8(LSL($0, R_[8][1])))];
	case 0xa052: return [(_pfxLength + 7),Mov(($0 = u8(Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(LSL($0, R_[8][1])))];
	case 0x2053: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, R_[8][1])))];
	case 0xa053: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, R_[8][1])))];
	case 0x2850: return [(_pfxLength + 7),Mov(($0 = u8(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))), u8(LSR($0, 1)))];
	case 0xa850: return [(_pfxLength + 7),Mov(($0 = u8(Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(LSR($0, 1)))];
	case 0x2851: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, 1)))];
	case 0xa851: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, 1)))];
	case 0x2852: return [(_pfxLength + 7),Mov(($0 = u8(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))), u8(LSR($0, R_[8][1])))];
	case 0xa852: return [(_pfxLength + 7),Mov(($0 = u8(Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(LSR($0, R_[8][1])))];
	case 0x2853: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, R_[8][1])))];
	case 0xa853: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, R_[8][1])))];
	case 0x3850: return [(_pfxLength + 7),Mov(($0 = u8(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))), u8(ASR($0, 1)))];
	case 0xb850: return [(_pfxLength + 7),Mov(($0 = u8(Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(ASR($0, 1)))];
	case 0x3851: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))), uint[(_pfxSizeSpecifier ? 16 : 32)](ASR($0, 1)))];
	case 0xb851: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), uint[(_pfxSizeSpecifier ? 16 : 32)](ASR($0, 1)))];
	case 0x3852: return [(_pfxLength + 7),Mov(($0 = u8(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))), u8(ASR($0, R_[8][1])))];
	case 0xb852: return [(_pfxLength + 7),Mov(($0 = u8(Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(ASR($0, R_[8][1])))];
	case 0x3853: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))), uint[(_pfxSizeSpecifier ? 16 : 32)](ASR($0, R_[8][1])))];
	case 0xb853: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), uint[(_pfxSizeSpecifier ? 16 : 32)](ASR($0, R_[8][1])))];
	case 0x1076: return [(_pfxLength + 7),Mov(($0 = u8(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))), u8(Not($0)))];
	case 0x9076: return [(_pfxLength + 7),Mov(($0 = u8(Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(Not($0)))];
	case 0x1077: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))), uint[(_pfxSizeSpecifier ? 16 : 32)](Not($0)))];
	case 0x9077: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), uint[(_pfxSizeSpecifier ? 16 : 32)](Not($0)))];
	case 0x1876: return [(_pfxLength + 7),Mov(F[1], u1(Not(Eq(($0 = u8(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))), 0)))),Mov($0, i8(Neg($0)))];
	case 0x9876: return [(_pfxLength + 7),Mov(F[1], u1(Not(Eq(($0 = u8(Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), 0)))),Mov($0, i8(Neg($0)))];
	case 0x1877: return [(_pfxLength + 7),Mov(F[1], u1(Not(Eq(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))), 0)))),Mov($0, int[(_pfxSizeSpecifier ? 16 : 32)](Neg($0)))];
	case 0x9877: return [(_pfxLength + 7),Mov(F[1], u1(Not(Eq(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), 0)))),Mov($0, int[(_pfxSizeSpecifier ? 16 : 32)](Neg($0)))];
	case 0x2076: return [(_pfxLength + 7),Mov(R_[16][0], u8(Mul(R_[8][0], u8(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))];
	case 0xa076: return [(_pfxLength + 7),Mov(R_[16][0], u8(Mul(R_[8][0], u8(Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))];
	case 0x2077: return [(_pfxLength + 7),Mov(R_[32][0], Mul(R_[32][0], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))];
	case 0xa077: return [(_pfxLength + 7),Mov(R_[32][0], Mul(R_[32][0], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))))];
	case 0x2876: return [(_pfxLength + 7),Mov(R_[16][0], u8(Mul(R_[8][0], u8(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))];
	case 0xa876: return [(_pfxLength + 7),Mov(R_[16][0], u8(Mul(R_[8][0], u8(Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))];
	case 0x2877: return [(_pfxLength + 7),Mov(R_[32][0], Mul(R_[32][0], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))];
	case 0xa877: return [(_pfxLength + 7),Mov(R_[32][0], Mul(R_[32][0], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))))];
	case 0x3076: return [(_pfxLength + 7),Mov(R_[16][0], u8(Div(R_[8][0], u8(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))];
	case 0xb076: return [(_pfxLength + 7),Mov(R_[16][0], u8(Div(R_[8][0], u8(Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))];
	case 0x3077: return [(_pfxLength + 7),Mov(R_[32][0], Div(R_[32][0], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))];
	case 0xb077: return [(_pfxLength + 7),Mov(R_[32][0], Div(R_[32][0], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))))];
	case 0x3876: return [(_pfxLength + 7),Mov(R_[16][0], u8(Div(R_[8][0], u8(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))];
	case 0xb876: return [(_pfxLength + 7),Mov(R_[16][0], u8(Div(R_[8][0], u8(Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))];
	case 0x3877: return [(_pfxLength + 7),Mov(R_[32][0], Div(R_[32][0], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))];
	case 0xb877: return [(_pfxLength + 7),Mov(R_[32][0], Div(R_[32][0], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))))];
	case 0x7e: return [(_pfxLength + 7),Mov(($0 = u8(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))), u8(Add($0, 1)))];
	case 0x807e: return [(_pfxLength + 7),Mov(($0 = u8(Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(Add($0, 1)))];
	case 0x7f: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))), Add($0, 1))];
	case 0x807f: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), Add($0, 1))];
	case 0x87e: return [(_pfxLength + 7),Mov(($0 = u8(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))), u8(Add($0, -1)))];
	case 0x887e: return [(_pfxLength + 7),Mov(($0 = u8(Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(Add($0, -1)))];
	case 0x87f: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))), Add($0, -1))];
	case 0x887f: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), Add($0, -1))];
	case 0x107f: return [(_pfxLength + 7),Mov(R_[32][4], u32(Add(R_[32][4], -4))),Mov(u32(Mem(R_[32][4])), u32(Add(R_[32][8], (_pfxLength + 7)))),Mov(R_[32][8], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))];
	case 0x907f: return [(_pfxLength + 7),Mov(R_[32][4], u32(Add(R_[32][4], -4))),Mov(u32(Mem(R_[32][4])), u32(Add(R_[32][8], (_pfxLength + 7)))),Mov(R_[32][8], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))];
	case 0x207f: return [(_pfxLength + 7),Mov(R_[32][8], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))];
	case 0xa07f: return [(_pfxLength + 7),Mov(R_[32][8], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))];
	case 0x307f: return [(_pfxLength + 7),Mov(R_[32][4], Add(R_[32][4], -($0 = ((_pfxSizeSpecifier ? 16 : 32) >>> 3)))),Mov(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][4])), uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))];
	case 0xb07f: return [(_pfxLength + 7),Mov(R_[32][4], Add(R_[32][4], -($0 = ((_pfxSizeSpecifier ? 16 : 32) >>> 3)))),Mov(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][4])), uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))];
	}
if(((((b[i+0] & 0xc0)>>>6)|(b[i+1]<<2)|((b[i+2] & 0x3f)<<10)) & 0xfd1d) == 0x9410)
	switch((b[i+0]|(b[i+1]<<8)) & 0x80bf) {
	case 0x0: return [(_pfxLength + 7),Mov(($0 = u8(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))), u8(Add($0, R_[8][(((b[i+1] & 0x38)>>>3))])))];
	case 0x8000: return [(_pfxLength + 7),Mov(($0 = u8(Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(Add($0, R_[8][(((b[i+1] & 0x38)>>>3))])))];
	case 0x1: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))), Add($0, R_[32][(((b[i+1] & 0x38)>>>3))]))];
	case 0x8001: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), Add($0, R_[32][(((b[i+1] & 0x38)>>>3))]))];
	case 0x2: return [(_pfxLength + 7),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Add(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))];
	case 0x8002: return [(_pfxLength + 7),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Add(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))];
	case 0x3: return [(_pfxLength + 7),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Add(R_[32][(((b[i+1] & 0x38)>>>3))], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))];
	case 0x8003: return [(_pfxLength + 7),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Add(R_[32][(((b[i+1] & 0x38)>>>3))], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))))];
	case 0x8: return [(_pfxLength + 7),Mov(($0 = u8(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))), u8(Or($0, R_[8][(((b[i+1] & 0x38)>>>3))])))];
	case 0x8008: return [(_pfxLength + 7),Mov(($0 = u8(Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(Or($0, R_[8][(((b[i+1] & 0x38)>>>3))])))];
	case 0x9: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))), Or($0, R_[32][(((b[i+1] & 0x38)>>>3))]))];
	case 0x8009: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), Or($0, R_[32][(((b[i+1] & 0x38)>>>3))]))];
	case 0xa: return [(_pfxLength + 7),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Or(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))];
	case 0x800a: return [(_pfxLength + 7),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Or(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))];
	case 0xb: return [(_pfxLength + 7),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Or(R_[32][(((b[i+1] & 0x38)>>>3))], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))];
	case 0x800b: return [(_pfxLength + 7),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Or(R_[32][(((b[i+1] & 0x38)>>>3))], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))))];
	case 0x10: return [(_pfxLength + 7),Mov(($0 = u8(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))), u8(Add($0, u8(Add(R_[8][(((b[i+1] & 0x38)>>>3))], u8(F[1]))))))];
	case 0x8010: return [(_pfxLength + 7),Mov(($0 = u8(Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(Add($0, u8(Add(R_[8][(((b[i+1] & 0x38)>>>3))], u8(F[1]))))))];
	case 0x11: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))), Add($0, Add(R_[32][(((b[i+1] & 0x38)>>>3))], uint[(_pfxSizeSpecifier ? 16 : 32)](F[1]))))];
	case 0x8011: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), Add($0, Add(R_[32][(((b[i+1] & 0x38)>>>3))], uint[(_pfxSizeSpecifier ? 16 : 32)](F[1]))))];
	case 0x12: return [(_pfxLength + 7),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Add(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Add(u8(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), u8(F[1]))))))];
	case 0x8012: return [(_pfxLength + 7),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Add(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Add(u8(Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))), u8(F[1]))))))];
	case 0x13: return [(_pfxLength + 7),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Add(R_[32][(((b[i+1] & 0x38)>>>3))], Add(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), u32(F[1]))))];
	case 0x8013: return [(_pfxLength + 7),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Add(R_[32][(((b[i+1] & 0x38)>>>3))], Add(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))), u32(F[1]))))];
	case 0x18: return [(_pfxLength + 7),Mov(($0 = u8(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))), u8(Add(($1 = u8(Add($0, i8(Neg(R_[8][(((b[i+1] & 0x38)>>>3))]))))), i8(Neg(($2 = u8(F[1])))))))];
	case 0x8018: return [(_pfxLength + 7),Mov(($0 = u8(Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(Add(($1 = u8(Add($0, i8(Neg(R_[8][(((b[i+1] & 0x38)>>>3))]))))), i8(Neg(($2 = u8(F[1])))))))];
	case 0x19: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))), Add(($1 = Add($0, i32(Neg(R_[32][(((b[i+1] & 0x38)>>>3))])))), int[(_pfxSizeSpecifier ? 16 : 32)](Neg(($2 = uint[(_pfxSizeSpecifier ? 16 : 32)](F[1]))))))];
	case 0x8019: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), Add(($1 = Add($0, i32(Neg(R_[32][(((b[i+1] & 0x38)>>>3))])))), int[(_pfxSizeSpecifier ? 16 : 32)](Neg(($2 = uint[(_pfxSizeSpecifier ? 16 : 32)](F[1]))))))];
	case 0x1a: return [(_pfxLength + 7),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Add(($0 = u8(Add(R_[8][(((b[i+1] & 0x38)>>>3))], i8(Neg(($1 = u8(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))), i8(Neg(($2 = u8(F[1])))))))];
	case 0x801a: return [(_pfxLength + 7),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Add(($0 = u8(Add(R_[8][(((b[i+1] & 0x38)>>>3))], i8(Neg(($1 = u8(Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))))), i8(Neg(($2 = u8(F[1])))))))];
	case 0x1b: return [(_pfxLength + 7),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Add(($0 = Add(R_[32][(((b[i+1] & 0x38)>>>3))], int[(_pfxSizeSpecifier ? 16 : 32)](Neg(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))))), i32(Neg(($2 = u32(F[1]))))))];
	case 0x801b: return [(_pfxLength + 7),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Add(($0 = Add(R_[32][(((b[i+1] & 0x38)>>>3))], int[(_pfxSizeSpecifier ? 16 : 32)](Neg(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))))))), i32(Neg(($2 = u32(F[1]))))))];
	case 0x20: return [(_pfxLength + 7),Mov(($0 = u8(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))), u8(And($0, R_[8][(((b[i+1] & 0x38)>>>3))])))];
	case 0x8020: return [(_pfxLength + 7),Mov(($0 = u8(Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(And($0, R_[8][(((b[i+1] & 0x38)>>>3))])))];
	case 0x21: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))), And($0, R_[32][(((b[i+1] & 0x38)>>>3))]))];
	case 0x8021: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), And($0, R_[32][(((b[i+1] & 0x38)>>>3))]))];
	case 0x22: return [(_pfxLength + 7),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(And(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))];
	case 0x8022: return [(_pfxLength + 7),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(And(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))];
	case 0x23: return [(_pfxLength + 7),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], And(R_[32][(((b[i+1] & 0x38)>>>3))], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))];
	case 0x8023: return [(_pfxLength + 7),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], And(R_[32][(((b[i+1] & 0x38)>>>3))], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))))];
	case 0x28: return [(_pfxLength + 7),Mov(F[2], Eq(($0 = u8(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))), R_[8][(((b[i+1] & 0x38)>>>3))])),Mov(F[1], Lt($0, R_[8][(((b[i+1] & 0x38)>>>3))])),Mov($0, u8(Add($0, i8(Neg(R_[8][(((b[i+1] & 0x38)>>>3))])))))];
	case 0x8028: return [(_pfxLength + 7),Mov(F[2], Eq(($0 = u8(Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), R_[8][(((b[i+1] & 0x38)>>>3))])),Mov(F[1], Lt($0, R_[8][(((b[i+1] & 0x38)>>>3))])),Mov($0, u8(Add($0, i8(Neg(R_[8][(((b[i+1] & 0x38)>>>3))])))))];
	case 0x29: return [(_pfxLength + 7),Mov(F[2], Eq(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))), R_[32][(((b[i+1] & 0x38)>>>3))])),Mov(F[1], Lt($0, R_[32][(((b[i+1] & 0x38)>>>3))])),Mov($0, Add($0, i32(Neg(R_[32][(((b[i+1] & 0x38)>>>3))]))))];
	case 0x8029: return [(_pfxLength + 7),Mov(F[2], Eq(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), R_[32][(((b[i+1] & 0x38)>>>3))])),Mov(F[1], Lt($0, R_[32][(((b[i+1] & 0x38)>>>3))])),Mov($0, Add($0, i32(Neg(R_[32][(((b[i+1] & 0x38)>>>3))]))))];
	case 0x2a: return [(_pfxLength + 7),Mov(F[2], Eq(R_[8][(((b[i+1] & 0x38)>>>3))], ($0 = u8(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))),Mov(F[1], Lt(R_[8][(((b[i+1] & 0x38)>>>3))], $0)),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Add(R_[8][(((b[i+1] & 0x38)>>>3))], i8(Neg($0)))))];
	case 0x802a: return [(_pfxLength + 7),Mov(F[2], Eq(R_[8][(((b[i+1] & 0x38)>>>3))], ($0 = u8(Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))))),Mov(F[1], Lt(R_[8][(((b[i+1] & 0x38)>>>3))], $0)),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Add(R_[8][(((b[i+1] & 0x38)>>>3))], i8(Neg($0)))))];
	case 0x2b: return [(_pfxLength + 7),Mov(F[2], Eq(R_[32][(((b[i+1] & 0x38)>>>3))], ($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))),Mov(F[1], Lt(R_[32][(((b[i+1] & 0x38)>>>3))], $0)),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Add(R_[32][(((b[i+1] & 0x38)>>>3))], int[(_pfxSizeSpecifier ? 16 : 32)](Neg($0))))];
	case 0x802b: return [(_pfxLength + 7),Mov(F[2], Eq(R_[32][(((b[i+1] & 0x38)>>>3))], ($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))))),Mov(F[1], Lt(R_[32][(((b[i+1] & 0x38)>>>3))], $0)),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Add(R_[32][(((b[i+1] & 0x38)>>>3))], int[(_pfxSizeSpecifier ? 16 : 32)](Neg($0))))];
	case 0x30: return [(_pfxLength + 7),Mov(($0 = u8(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))), u8(Xor($0, R_[8][(((b[i+1] & 0x38)>>>3))])))];
	case 0x8030: return [(_pfxLength + 7),Mov(($0 = u8(Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(Xor($0, R_[8][(((b[i+1] & 0x38)>>>3))])))];
	case 0x31: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))), Xor($0, R_[32][(((b[i+1] & 0x38)>>>3))]))];
	case 0x8031: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), Xor($0, R_[32][(((b[i+1] & 0x38)>>>3))]))];
	case 0x32: return [(_pfxLength + 7),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Xor(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))];
	case 0x8032: return [(_pfxLength + 7),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Xor(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))];
	case 0x33: return [(_pfxLength + 7),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Xor(R_[32][(((b[i+1] & 0x38)>>>3))], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))];
	case 0x8033: return [(_pfxLength + 7),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Xor(R_[32][(((b[i+1] & 0x38)>>>3))], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))))];
	case 0x38: return [(_pfxLength + 7),Mov(F[2], Eq(($0 = u8(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))), R_[8][(((b[i+1] & 0x38)>>>3))])),Mov(F[1], Lt($0, R_[8][(((b[i+1] & 0x38)>>>3))]))];
	case 0x8038: return [(_pfxLength + 7),Mov(F[2], Eq(($0 = u8(Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), R_[8][(((b[i+1] & 0x38)>>>3))])),Mov(F[1], Lt($0, R_[8][(((b[i+1] & 0x38)>>>3))]))];
	case 0x39: return [(_pfxLength + 7),Mov(F[2], Eq(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))), R_[32][(((b[i+1] & 0x38)>>>3))])),Mov(F[1], Lt($0, R_[32][(((b[i+1] & 0x38)>>>3))]))];
	case 0x8039: return [(_pfxLength + 7),Mov(F[2], Eq(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), R_[32][(((b[i+1] & 0x38)>>>3))])),Mov(F[1], Lt($0, R_[32][(((b[i+1] & 0x38)>>>3))]))];
	case 0x3a: return [(_pfxLength + 7),Mov(F[2], Eq(R_[8][(((b[i+1] & 0x38)>>>3))], ($0 = u8(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))),Mov(F[1], Lt(R_[8][(((b[i+1] & 0x38)>>>3))], $0))];
	case 0x803a: return [(_pfxLength + 7),Mov(F[2], Eq(R_[8][(((b[i+1] & 0x38)>>>3))], ($0 = u8(Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))))),Mov(F[1], Lt(R_[8][(((b[i+1] & 0x38)>>>3))], $0))];
	case 0x3b: return [(_pfxLength + 7),Mov(F[2], Eq(R_[32][(((b[i+1] & 0x38)>>>3))], ($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))),Mov(F[1], Lt(R_[32][(((b[i+1] & 0x38)>>>3))], $0))];
	case 0x803b: return [(_pfxLength + 7),Mov(F[2], Eq(R_[32][(((b[i+1] & 0x38)>>>3))], ($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))))),Mov(F[1], Lt(R_[32][(((b[i+1] & 0x38)>>>3))], $0))];
	case 0x84: return [(_pfxLength + 7),Mov(F[2], Eq(And(u8(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), R_[8][(((b[i+1] & 0x38)>>>3))]), 0)),Mov(F[1], 0),Mov(F[0], 0)];
	case 0x8084: return [(_pfxLength + 7),Mov(F[2], Eq(And(u8(Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))), R_[8][(((b[i+1] & 0x38)>>>3))]), 0)),Mov(F[1], 0),Mov(F[0], 0)];
	case 0x85: return [(_pfxLength + 7),Mov(F[2], Eq(And(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), R_[32][(((b[i+1] & 0x38)>>>3))]), 0)),Mov(F[1], 0),Mov(F[0], 0)];
	case 0x8085: return [(_pfxLength + 7),Mov(F[2], Eq(And(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))), R_[32][(((b[i+1] & 0x38)>>>3))]), 0)),Mov(F[1], 0),Mov(F[0], 0)];
	case 0x86: return [(_pfxLength + 7),Swap(u8(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), R_[8][(((b[i+1] & 0x38)>>>3))])];
	case 0x8086: return [(_pfxLength + 7),Swap(u8(Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))), R_[8][(((b[i+1] & 0x38)>>>3))])];
	case 0x87: return [(_pfxLength + 7),Swap(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), R_[32][(((b[i+1] & 0x38)>>>3))])];
	case 0x8087: return [(_pfxLength + 7),Swap(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))), R_[32][(((b[i+1] & 0x38)>>>3))])];
	case 0x88: return [(_pfxLength + 7),Mov(u8(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), R_[8][(((b[i+1] & 0x38)>>>3))])];
	case 0x8088: return [(_pfxLength + 7),Mov(u8(Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))), R_[8][(((b[i+1] & 0x38)>>>3))])];
	case 0x89: return [(_pfxLength + 7),Mov(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), R_[32][(((b[i+1] & 0x38)>>>3))])];
	case 0x8089: return [(_pfxLength + 7),Mov(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))), R_[32][(((b[i+1] & 0x38)>>>3))])];
	case 0x8a: return [(_pfxLength + 7),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))];
	case 0x808a: return [(_pfxLength + 7),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))];
	case 0x8b: return [(_pfxLength + 7),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))];
	case 0x808b: return [(_pfxLength + 7),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))];
	case 0x8c: return [(_pfxLength + 7),Mov(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), R_.S[(((b[i+1] & 0x38)>>>3))])];
	case 0x808c: return [(_pfxLength + 7),Mov(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))), R_.S[(((b[i+1] & 0x38)>>>3))])];
	case 0x8d: return [(_pfxLength + 7),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], ($0 = (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))];
	case 0x808d: return [(_pfxLength + 7),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], ($0 = u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))];
	case 0x8e: return [(_pfxLength + 7),Mov(R_.S[(((b[i+1] & 0x38)>>>3))], u16(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))];
	case 0x808e: return [(_pfxLength + 7),Mov(R_.S[(((b[i+1] & 0x38)>>>3))], u16(Mem(u32(Add(R_[32][5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))];
	}
if(((((b[i+0] & 0x80)>>>7)|(b[i+1]<<1)|((b[i+2] & 0x3f)<<9)) & 0x708f) == 0x4009)
	switch((b[i+0]|(b[i+1]<<8)) & 0xb87f) {
	case 0x1: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 7),Mov(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+2] & 0x7))]))), Add($1, int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))];
	case 0x801: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 7),Mov(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+2] & 0x7))]))), Or($1, uint[(_pfxSizeSpecifier ? 16 : 32)](int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))];
	case 0x1001: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 7),Mov(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+2] & 0x7))]))), Add($1, Add(int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), uint[(_pfxSizeSpecifier ? 16 : 32)](F[1]))))];
	case 0x1801: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 7),Mov(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+2] & 0x7))]))), Add(($2 = Add($1, int[(_pfxSizeSpecifier ? 16 : 32)](-($3 = int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), int[(_pfxSizeSpecifier ? 16 : 32)](Neg(($4 = uint[(_pfxSizeSpecifier ? 16 : 32)](F[1]))))))];
	case 0x2001: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 7),Mov(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+2] & 0x7))]))), And($1, uint[(_pfxSizeSpecifier ? 16 : 32)](int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))];
	case 0x2801: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 7),Mov(F[2], Eq(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+2] & 0x7))]))), ($2 = int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))),Mov(F[1], Lt($1, $2)),Mov($1, Add($1, int[(_pfxSizeSpecifier ? 16 : 32)](-$2)))];
	case 0x3001: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 7),Mov(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+2] & 0x7))]))), Xor($1, int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))];
	case 0x3801: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 7),Mov(F[2], Eq(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+2] & 0x7))]))), ($2 = int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))),Mov(F[1], Lt($1, $2))];
	case 0x800f: return [(_pfxLength + 7),Mov(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))), uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][4]))),Mov(R_[32][4], Add(R_[32][4], ((_pfxSizeSpecifier ? 16 : 32) >>> 3)))];
	case 0x47: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 7),Mov(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+2] & 0x7))])), int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))];
	case 0x8050: return [(_pfxLength + 7),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(Or(u8(LSL($0, 1)), u8(LSR($0, 7)))))];
	case 0x8051: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, 1)), uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, ((_pfxSizeSpecifier ? 16 : 32) + -1)))))];
	case 0x8052: return [(_pfxLength + 7),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(Or(u8(LSL($0, R_[8][1])), u8(LSR($0, i8(Add(i8(Neg(R_[8][1])), 8)))))))];
	case 0x8053: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, R_[8][1])), uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, Add((_pfxSizeSpecifier ? 16 : 32), i8(Neg(R_[8][1])))))))];
	case 0x8850: return [(_pfxLength + 7),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(Or(u8(LSR($0, 1)), u8(LSL($0, 7)))))];
	case 0x8851: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, 1)), uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, ((_pfxSizeSpecifier ? 16 : 32) + -1)))))];
	case 0x8852: return [(_pfxLength + 7),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(Or(u8(LSR($0, R_[8][1])), u8(LSL($0, i8(Add(i8(Neg(R_[8][1])), 8)))))))];
	case 0x8853: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, R_[8][1])), uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, Add((_pfxSizeSpecifier ? 16 : 32), i8(Neg(R_[8][1])))))))];
	case 0xa050: return [(_pfxLength + 7),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(LSL($0, 1)))];
	case 0xa051: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, 1)))];
	case 0xa052: return [(_pfxLength + 7),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(LSL($0, R_[8][1])))];
	case 0xa053: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, R_[8][1])))];
	case 0xa850: return [(_pfxLength + 7),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(LSR($0, 1)))];
	case 0xa851: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, 1)))];
	case 0xa852: return [(_pfxLength + 7),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(LSR($0, R_[8][1])))];
	case 0xa853: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, R_[8][1])))];
	case 0xb850: return [(_pfxLength + 7),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(ASR($0, 1)))];
	case 0xb851: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), uint[(_pfxSizeSpecifier ? 16 : 32)](ASR($0, 1)))];
	case 0xb852: return [(_pfxLength + 7),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(ASR($0, R_[8][1])))];
	case 0xb853: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), uint[(_pfxSizeSpecifier ? 16 : 32)](ASR($0, R_[8][1])))];
	case 0x77: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 7),Mov(F[2], Eq(And(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+2] & 0x7))])), int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 0)),Mov(F[1], 0),Mov(F[0], 0)];
	case 0x9076: return [(_pfxLength + 7),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(Not($0)))];
	case 0x9077: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), uint[(_pfxSizeSpecifier ? 16 : 32)](Not($0)))];
	case 0x9876: return [(_pfxLength + 7),Mov(F[1], u1(Not(Eq(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), 0)))),Mov($0, i8(Neg($0)))];
	case 0x9877: return [(_pfxLength + 7),Mov(F[1], u1(Not(Eq(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), 0)))),Mov($0, int[(_pfxSizeSpecifier ? 16 : 32)](Neg($0)))];
	case 0xa076: return [(_pfxLength + 7),Mov(R_[16][0], u8(Mul(R_[8][0], u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))];
	case 0xa077: return [(_pfxLength + 7),Mov(R_[32][0], Mul(R_[32][0], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))))];
	case 0xa876: return [(_pfxLength + 7),Mov(R_[16][0], u8(Mul(R_[8][0], u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))];
	case 0xa877: return [(_pfxLength + 7),Mov(R_[32][0], Mul(R_[32][0], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))))];
	case 0xb076: return [(_pfxLength + 7),Mov(R_[16][0], u8(Div(R_[8][0], u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))];
	case 0xb077: return [(_pfxLength + 7),Mov(R_[32][0], Div(R_[32][0], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))))];
	case 0xb876: return [(_pfxLength + 7),Mov(R_[16][0], u8(Div(R_[8][0], u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))];
	case 0xb877: return [(_pfxLength + 7),Mov(R_[32][0], Div(R_[32][0], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))))];
	case 0x807e: return [(_pfxLength + 7),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(Add($0, 1)))];
	case 0x807f: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), Add($0, 1))];
	case 0x887e: return [(_pfxLength + 7),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(Add($0, -1)))];
	case 0x887f: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), Add($0, -1))];
	case 0x907f: return [(_pfxLength + 7),Mov(R_[32][4], u32(Add(R_[32][4], -4))),Mov(u32(Mem(R_[32][4])), u32(Add(R_[32][8], (_pfxLength + 7)))),Mov(R_[32][8], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))];
	case 0xa07f: return [(_pfxLength + 7),Mov(R_[32][8], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))];
	case 0xb07f: return [(_pfxLength + 7),Mov(R_[32][4], Add(R_[32][4], -($0 = ((_pfxSizeSpecifier ? 16 : 32) >>> 3)))),Mov(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][4])), uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))];
	}
if(((b[i+1]|((b[i+2] & 0x3f)<<8)) & 0x3847) == 0x2004)
	switch((b[i+0]|(b[i+1]<<8)) & 0x80ff) {
	case 0x8000: return [(_pfxLength + 7),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(Add($0, R_[8][(((b[i+1] & 0x38)>>>3))])))];
	case 0x8001: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), Add($0, R_[32][(((b[i+1] & 0x38)>>>3))]))];
	case 0x8002: return [(_pfxLength + 7),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Add(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))];
	case 0x8003: return [(_pfxLength + 7),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Add(R_[32][(((b[i+1] & 0x38)>>>3))], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))))];
	case 0x8008: return [(_pfxLength + 7),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(Or($0, R_[8][(((b[i+1] & 0x38)>>>3))])))];
	case 0x8009: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), Or($0, R_[32][(((b[i+1] & 0x38)>>>3))]))];
	case 0x800a: return [(_pfxLength + 7),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Or(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))];
	case 0x800b: return [(_pfxLength + 7),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Or(R_[32][(((b[i+1] & 0x38)>>>3))], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))))];
	case 0x8010: return [(_pfxLength + 7),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(Add($0, u8(Add(R_[8][(((b[i+1] & 0x38)>>>3))], u8(F[1]))))))];
	case 0x8011: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), Add($0, Add(R_[32][(((b[i+1] & 0x38)>>>3))], uint[(_pfxSizeSpecifier ? 16 : 32)](F[1]))))];
	case 0x8012: return [(_pfxLength + 7),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Add(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Add(u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))), u8(F[1]))))))];
	case 0x8013: return [(_pfxLength + 7),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Add(R_[32][(((b[i+1] & 0x38)>>>3))], Add(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))), u32(F[1]))))];
	case 0x8018: return [(_pfxLength + 7),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(Add(($1 = u8(Add($0, i8(Neg(R_[8][(((b[i+1] & 0x38)>>>3))]))))), i8(Neg(($2 = u8(F[1])))))))];
	case 0x8019: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), Add(($1 = Add($0, i32(Neg(R_[32][(((b[i+1] & 0x38)>>>3))])))), int[(_pfxSizeSpecifier ? 16 : 32)](Neg(($2 = uint[(_pfxSizeSpecifier ? 16 : 32)](F[1]))))))];
	case 0x801a: return [(_pfxLength + 7),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Add(($0 = u8(Add(R_[8][(((b[i+1] & 0x38)>>>3))], i8(Neg(($1 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))))), i8(Neg(($2 = u8(F[1])))))))];
	case 0x801b: return [(_pfxLength + 7),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Add(($0 = Add(R_[32][(((b[i+1] & 0x38)>>>3))], int[(_pfxSizeSpecifier ? 16 : 32)](Neg(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))))))), i32(Neg(($2 = u32(F[1]))))))];
	case 0x8020: return [(_pfxLength + 7),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(And($0, R_[8][(((b[i+1] & 0x38)>>>3))])))];
	case 0x8021: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), And($0, R_[32][(((b[i+1] & 0x38)>>>3))]))];
	case 0x8022: return [(_pfxLength + 7),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(And(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))];
	case 0x8023: return [(_pfxLength + 7),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], And(R_[32][(((b[i+1] & 0x38)>>>3))], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))))];
	case 0x8028: return [(_pfxLength + 7),Mov(F[2], Eq(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), R_[8][(((b[i+1] & 0x38)>>>3))])),Mov(F[1], Lt($0, R_[8][(((b[i+1] & 0x38)>>>3))])),Mov($0, u8(Add($0, i8(Neg(R_[8][(((b[i+1] & 0x38)>>>3))])))))];
	case 0x8029: return [(_pfxLength + 7),Mov(F[2], Eq(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), R_[32][(((b[i+1] & 0x38)>>>3))])),Mov(F[1], Lt($0, R_[32][(((b[i+1] & 0x38)>>>3))])),Mov($0, Add($0, i32(Neg(R_[32][(((b[i+1] & 0x38)>>>3))]))))];
	case 0x802a: return [(_pfxLength + 7),Mov(F[2], Eq(R_[8][(((b[i+1] & 0x38)>>>3))], ($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))))),Mov(F[1], Lt(R_[8][(((b[i+1] & 0x38)>>>3))], $0)),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Add(R_[8][(((b[i+1] & 0x38)>>>3))], i8(Neg($0)))))];
	case 0x802b: return [(_pfxLength + 7),Mov(F[2], Eq(R_[32][(((b[i+1] & 0x38)>>>3))], ($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))))),Mov(F[1], Lt(R_[32][(((b[i+1] & 0x38)>>>3))], $0)),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Add(R_[32][(((b[i+1] & 0x38)>>>3))], int[(_pfxSizeSpecifier ? 16 : 32)](Neg($0))))];
	case 0x8030: return [(_pfxLength + 7),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(Xor($0, R_[8][(((b[i+1] & 0x38)>>>3))])))];
	case 0x8031: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), Xor($0, R_[32][(((b[i+1] & 0x38)>>>3))]))];
	case 0x8032: return [(_pfxLength + 7),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Xor(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))];
	case 0x8033: return [(_pfxLength + 7),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Xor(R_[32][(((b[i+1] & 0x38)>>>3))], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))))];
	case 0x8038: return [(_pfxLength + 7),Mov(F[2], Eq(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), R_[8][(((b[i+1] & 0x38)>>>3))])),Mov(F[1], Lt($0, R_[8][(((b[i+1] & 0x38)>>>3))]))];
	case 0x8039: return [(_pfxLength + 7),Mov(F[2], Eq(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), R_[32][(((b[i+1] & 0x38)>>>3))])),Mov(F[1], Lt($0, R_[32][(((b[i+1] & 0x38)>>>3))]))];
	case 0x803a: return [(_pfxLength + 7),Mov(F[2], Eq(R_[8][(((b[i+1] & 0x38)>>>3))], ($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))))),Mov(F[1], Lt(R_[8][(((b[i+1] & 0x38)>>>3))], $0))];
	case 0x803b: return [(_pfxLength + 7),Mov(F[2], Eq(R_[32][(((b[i+1] & 0x38)>>>3))], ($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))))),Mov(F[1], Lt(R_[32][(((b[i+1] & 0x38)>>>3))], $0))];
	case 0x69: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 7),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Mul(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+2] & 0x7))])), int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))];
	case 0x8084: return [(_pfxLength + 7),Mov(F[2], Eq(And(u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))), R_[8][(((b[i+1] & 0x38)>>>3))]), 0)),Mov(F[1], 0),Mov(F[0], 0)];
	case 0x8085: return [(_pfxLength + 7),Mov(F[2], Eq(And(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))), R_[32][(((b[i+1] & 0x38)>>>3))]), 0)),Mov(F[1], 0),Mov(F[0], 0)];
	case 0x8086: return [(_pfxLength + 7),Swap(u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))), R_[8][(((b[i+1] & 0x38)>>>3))])];
	case 0x8087: return [(_pfxLength + 7),Swap(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))), R_[32][(((b[i+1] & 0x38)>>>3))])];
	case 0x8088: return [(_pfxLength + 7),Mov(u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))), R_[8][(((b[i+1] & 0x38)>>>3))])];
	case 0x8089: return [(_pfxLength + 7),Mov(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))), R_[32][(((b[i+1] & 0x38)>>>3))])];
	case 0x808a: return [(_pfxLength + 7),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))];
	case 0x808b: return [(_pfxLength + 7),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))];
	case 0x808c: return [(_pfxLength + 7),Mov(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))), R_.S[(((b[i+1] & 0x38)>>>3))])];
	case 0x808d: return [(_pfxLength + 7),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], ($0 = u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))];
	case 0x808e: return [(_pfxLength + 7),Mov(R_.S[(((b[i+1] & 0x38)>>>3))], u16(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))];
	}
if(((((b[i+0] & 0x80)>>>7)|(b[i+1]<<1)|((b[i+2] & 0x7)<<9)) & 0xe8f) == 0xa09)
	switch((b[i+0]|(b[i+1]<<8)) & 0xb87f) {
	case 0xf: return [(_pfxLength + 7),Mov(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))), uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][4]))),Mov(R_[32][4], Add(R_[32][4], ((_pfxSizeSpecifier ? 16 : 32) >>> 3)))];
	case 0x800f: return [(_pfxLength + 7),Mov(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))))), uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][4]))),Mov(R_[32][4], Add(R_[32][4], ((_pfxSizeSpecifier ? 16 : 32) >>> 3)))];
	case 0x50: return [(_pfxLength + 7),Mov(($0 = u8(Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(Or(u8(LSL($0, 1)), u8(LSR($0, 7)))))];
	case 0x8050: return [(_pfxLength + 7),Mov(($0 = u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))), u8(Or(u8(LSL($0, 1)), u8(LSR($0, 7)))))];
	case 0x51: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, 1)), uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, ((_pfxSizeSpecifier ? 16 : 32) + -1)))))];
	case 0x8051: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, 1)), uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, ((_pfxSizeSpecifier ? 16 : 32) + -1)))))];
	case 0x52: return [(_pfxLength + 7),Mov(($0 = u8(Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(Or(u8(LSL($0, R_[8][1])), u8(LSR($0, i8(Add(i8(Neg(R_[8][1])), 8)))))))];
	case 0x8052: return [(_pfxLength + 7),Mov(($0 = u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))), u8(Or(u8(LSL($0, R_[8][1])), u8(LSR($0, i8(Add(i8(Neg(R_[8][1])), 8)))))))];
	case 0x53: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, R_[8][1])), uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, Add((_pfxSizeSpecifier ? 16 : 32), i8(Neg(R_[8][1])))))))];
	case 0x8053: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, R_[8][1])), uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, Add((_pfxSizeSpecifier ? 16 : 32), i8(Neg(R_[8][1])))))))];
	case 0x850: return [(_pfxLength + 7),Mov(($0 = u8(Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(Or(u8(LSR($0, 1)), u8(LSL($0, 7)))))];
	case 0x8850: return [(_pfxLength + 7),Mov(($0 = u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))), u8(Or(u8(LSR($0, 1)), u8(LSL($0, 7)))))];
	case 0x851: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, 1)), uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, ((_pfxSizeSpecifier ? 16 : 32) + -1)))))];
	case 0x8851: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, 1)), uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, ((_pfxSizeSpecifier ? 16 : 32) + -1)))))];
	case 0x852: return [(_pfxLength + 7),Mov(($0 = u8(Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(Or(u8(LSR($0, R_[8][1])), u8(LSL($0, i8(Add(i8(Neg(R_[8][1])), 8)))))))];
	case 0x8852: return [(_pfxLength + 7),Mov(($0 = u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))), u8(Or(u8(LSR($0, R_[8][1])), u8(LSL($0, i8(Add(i8(Neg(R_[8][1])), 8)))))))];
	case 0x853: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, R_[8][1])), uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, Add((_pfxSizeSpecifier ? 16 : 32), i8(Neg(R_[8][1])))))))];
	case 0x8853: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, R_[8][1])), uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, Add((_pfxSizeSpecifier ? 16 : 32), i8(Neg(R_[8][1])))))))];
	case 0x2050: return [(_pfxLength + 7),Mov(($0 = u8(Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(LSL($0, 1)))];
	case 0xa050: return [(_pfxLength + 7),Mov(($0 = u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))), u8(LSL($0, 1)))];
	case 0x2051: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, 1)))];
	case 0xa051: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, 1)))];
	case 0x2052: return [(_pfxLength + 7),Mov(($0 = u8(Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(LSL($0, R_[8][1])))];
	case 0xa052: return [(_pfxLength + 7),Mov(($0 = u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))), u8(LSL($0, R_[8][1])))];
	case 0x2053: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, R_[8][1])))];
	case 0xa053: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, R_[8][1])))];
	case 0x2850: return [(_pfxLength + 7),Mov(($0 = u8(Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(LSR($0, 1)))];
	case 0xa850: return [(_pfxLength + 7),Mov(($0 = u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))), u8(LSR($0, 1)))];
	case 0x2851: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, 1)))];
	case 0xa851: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, 1)))];
	case 0x2852: return [(_pfxLength + 7),Mov(($0 = u8(Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(LSR($0, R_[8][1])))];
	case 0xa852: return [(_pfxLength + 7),Mov(($0 = u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))), u8(LSR($0, R_[8][1])))];
	case 0x2853: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, R_[8][1])))];
	case 0xa853: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, R_[8][1])))];
	case 0x3850: return [(_pfxLength + 7),Mov(($0 = u8(Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(ASR($0, 1)))];
	case 0xb850: return [(_pfxLength + 7),Mov(($0 = u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))), u8(ASR($0, 1)))];
	case 0x3851: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), uint[(_pfxSizeSpecifier ? 16 : 32)](ASR($0, 1)))];
	case 0xb851: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))), uint[(_pfxSizeSpecifier ? 16 : 32)](ASR($0, 1)))];
	case 0x3852: return [(_pfxLength + 7),Mov(($0 = u8(Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(ASR($0, R_[8][1])))];
	case 0xb852: return [(_pfxLength + 7),Mov(($0 = u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))), u8(ASR($0, R_[8][1])))];
	case 0x3853: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), uint[(_pfxSizeSpecifier ? 16 : 32)](ASR($0, R_[8][1])))];
	case 0xb853: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))), uint[(_pfxSizeSpecifier ? 16 : 32)](ASR($0, R_[8][1])))];
	case 0x1076: return [(_pfxLength + 7),Mov(($0 = u8(Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(Not($0)))];
	case 0x9076: return [(_pfxLength + 7),Mov(($0 = u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))), u8(Not($0)))];
	case 0x1077: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), uint[(_pfxSizeSpecifier ? 16 : 32)](Not($0)))];
	case 0x9077: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))), uint[(_pfxSizeSpecifier ? 16 : 32)](Not($0)))];
	case 0x1876: return [(_pfxLength + 7),Mov(F[1], u1(Not(Eq(($0 = u8(Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), 0)))),Mov($0, i8(Neg($0)))];
	case 0x9876: return [(_pfxLength + 7),Mov(F[1], u1(Not(Eq(($0 = u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))), 0)))),Mov($0, i8(Neg($0)))];
	case 0x1877: return [(_pfxLength + 7),Mov(F[1], u1(Not(Eq(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), 0)))),Mov($0, int[(_pfxSizeSpecifier ? 16 : 32)](Neg($0)))];
	case 0x9877: return [(_pfxLength + 7),Mov(F[1], u1(Not(Eq(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))), 0)))),Mov($0, int[(_pfxSizeSpecifier ? 16 : 32)](Neg($0)))];
	case 0x2076: return [(_pfxLength + 7),Mov(R_[16][0], u8(Mul(R_[8][0], u8(Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))];
	case 0xa076: return [(_pfxLength + 7),Mov(R_[16][0], u8(Mul(R_[8][0], u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))))))))];
	case 0x2077: return [(_pfxLength + 7),Mov(R_[32][0], Mul(R_[32][0], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))))];
	case 0xa077: return [(_pfxLength + 7),Mov(R_[32][0], Mul(R_[32][0], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))))];
	case 0x2876: return [(_pfxLength + 7),Mov(R_[16][0], u8(Mul(R_[8][0], u8(Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))];
	case 0xa876: return [(_pfxLength + 7),Mov(R_[16][0], u8(Mul(R_[8][0], u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))))))))];
	case 0x2877: return [(_pfxLength + 7),Mov(R_[32][0], Mul(R_[32][0], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))))];
	case 0xa877: return [(_pfxLength + 7),Mov(R_[32][0], Mul(R_[32][0], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))))];
	case 0x3076: return [(_pfxLength + 7),Mov(R_[16][0], u8(Div(R_[8][0], u8(Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))];
	case 0xb076: return [(_pfxLength + 7),Mov(R_[16][0], u8(Div(R_[8][0], u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))))))))];
	case 0x3077: return [(_pfxLength + 7),Mov(R_[32][0], Div(R_[32][0], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))))];
	case 0xb077: return [(_pfxLength + 7),Mov(R_[32][0], Div(R_[32][0], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))))];
	case 0x3876: return [(_pfxLength + 7),Mov(R_[16][0], u8(Div(R_[8][0], u8(Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))];
	case 0xb876: return [(_pfxLength + 7),Mov(R_[16][0], u8(Div(R_[8][0], u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))))))))];
	case 0x3877: return [(_pfxLength + 7),Mov(R_[32][0], Div(R_[32][0], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))))];
	case 0xb877: return [(_pfxLength + 7),Mov(R_[32][0], Div(R_[32][0], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))))];
	case 0x7e: return [(_pfxLength + 7),Mov(($0 = u8(Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(Add($0, 1)))];
	case 0x807e: return [(_pfxLength + 7),Mov(($0 = u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))), u8(Add($0, 1)))];
	case 0x7f: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), Add($0, 1))];
	case 0x807f: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))), Add($0, 1))];
	case 0x87e: return [(_pfxLength + 7),Mov(($0 = u8(Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(Add($0, -1)))];
	case 0x887e: return [(_pfxLength + 7),Mov(($0 = u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))), u8(Add($0, -1)))];
	case 0x87f: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), Add($0, -1))];
	case 0x887f: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))), Add($0, -1))];
	case 0x107f: return [(_pfxLength + 7),Mov(R_[32][4], u32(Add(R_[32][4], -4))),Mov(u32(Mem(R_[32][4])), u32(Add(R_[32][8], (_pfxLength + 7)))),Mov(R_[32][8], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))];
	case 0x907f: return [(_pfxLength + 7),Mov(R_[32][4], u32(Add(R_[32][4], -4))),Mov(u32(Mem(R_[32][4])), u32(Add(R_[32][8], (_pfxLength + 7)))),Mov(R_[32][8], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))))))];
	case 0x207f: return [(_pfxLength + 7),Mov(R_[32][8], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))];
	case 0xa07f: return [(_pfxLength + 7),Mov(R_[32][8], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))))))];
	case 0x307f: return [(_pfxLength + 7),Mov(R_[32][4], Add(R_[32][4], -($0 = ((_pfxSizeSpecifier ? 16 : 32) >>> 3)))),Mov(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][4])), uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))];
	case 0xb07f: return [(_pfxLength + 7),Mov(R_[32][4], Add(R_[32][4], -($0 = ((_pfxSizeSpecifier ? 16 : 32) >>> 3)))),Mov(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][4])), uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))))))];
	}
if(((((b[i+0] & 0xc0)>>>6)|(b[i+1]<<2)|((b[i+2] & 0x7)<<10)) & 0x1d1d) == 0x1410)
	switch((b[i+0]|(b[i+1]<<8)) & 0x80bf) {
	case 0x0: return [(_pfxLength + 7),Mov(($0 = u8(Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(Add($0, R_[8][(((b[i+1] & 0x38)>>>3))])))];
	case 0x8000: return [(_pfxLength + 7),Mov(($0 = u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))), u8(Add($0, R_[8][(((b[i+1] & 0x38)>>>3))])))];
	case 0x1: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), Add($0, R_[32][(((b[i+1] & 0x38)>>>3))]))];
	case 0x8001: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))), Add($0, R_[32][(((b[i+1] & 0x38)>>>3))]))];
	case 0x2: return [(_pfxLength + 7),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Add(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))];
	case 0x8002: return [(_pfxLength + 7),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Add(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))))))))];
	case 0x3: return [(_pfxLength + 7),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Add(R_[32][(((b[i+1] & 0x38)>>>3))], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))))];
	case 0x8003: return [(_pfxLength + 7),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Add(R_[32][(((b[i+1] & 0x38)>>>3))], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))))];
	case 0x8: return [(_pfxLength + 7),Mov(($0 = u8(Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(Or($0, R_[8][(((b[i+1] & 0x38)>>>3))])))];
	case 0x8008: return [(_pfxLength + 7),Mov(($0 = u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))), u8(Or($0, R_[8][(((b[i+1] & 0x38)>>>3))])))];
	case 0x9: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), Or($0, R_[32][(((b[i+1] & 0x38)>>>3))]))];
	case 0x8009: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))), Or($0, R_[32][(((b[i+1] & 0x38)>>>3))]))];
	case 0xa: return [(_pfxLength + 7),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Or(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))];
	case 0x800a: return [(_pfxLength + 7),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Or(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))))))))];
	case 0xb: return [(_pfxLength + 7),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Or(R_[32][(((b[i+1] & 0x38)>>>3))], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))))];
	case 0x800b: return [(_pfxLength + 7),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Or(R_[32][(((b[i+1] & 0x38)>>>3))], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))))];
	case 0x10: return [(_pfxLength + 7),Mov(($0 = u8(Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(Add($0, u8(Add(R_[8][(((b[i+1] & 0x38)>>>3))], u8(F[1]))))))];
	case 0x8010: return [(_pfxLength + 7),Mov(($0 = u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))), u8(Add($0, u8(Add(R_[8][(((b[i+1] & 0x38)>>>3))], u8(F[1]))))))];
	case 0x11: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), Add($0, Add(R_[32][(((b[i+1] & 0x38)>>>3))], uint[(_pfxSizeSpecifier ? 16 : 32)](F[1]))))];
	case 0x8011: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))), Add($0, Add(R_[32][(((b[i+1] & 0x38)>>>3))], uint[(_pfxSizeSpecifier ? 16 : 32)](F[1]))))];
	case 0x12: return [(_pfxLength + 7),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Add(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Add(u8(Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))), u8(F[1]))))))];
	case 0x8012: return [(_pfxLength + 7),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Add(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Add(u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))))), u8(F[1]))))))];
	case 0x13: return [(_pfxLength + 7),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Add(R_[32][(((b[i+1] & 0x38)>>>3))], Add(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))), u32(F[1]))))];
	case 0x8013: return [(_pfxLength + 7),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Add(R_[32][(((b[i+1] & 0x38)>>>3))], Add(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))))), u32(F[1]))))];
	case 0x18: return [(_pfxLength + 7),Mov(($0 = u8(Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(Add(($1 = u8(Add($0, i8(Neg(R_[8][(((b[i+1] & 0x38)>>>3))]))))), i8(Neg(($2 = u8(F[1])))))))];
	case 0x8018: return [(_pfxLength + 7),Mov(($0 = u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))), u8(Add(($1 = u8(Add($0, i8(Neg(R_[8][(((b[i+1] & 0x38)>>>3))]))))), i8(Neg(($2 = u8(F[1])))))))];
	case 0x19: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), Add(($1 = Add($0, i32(Neg(R_[32][(((b[i+1] & 0x38)>>>3))])))), int[(_pfxSizeSpecifier ? 16 : 32)](Neg(($2 = uint[(_pfxSizeSpecifier ? 16 : 32)](F[1]))))))];
	case 0x8019: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))), Add(($1 = Add($0, i32(Neg(R_[32][(((b[i+1] & 0x38)>>>3))])))), int[(_pfxSizeSpecifier ? 16 : 32)](Neg(($2 = uint[(_pfxSizeSpecifier ? 16 : 32)](F[1]))))))];
	case 0x1a: return [(_pfxLength + 7),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Add(($0 = u8(Add(R_[8][(((b[i+1] & 0x38)>>>3))], i8(Neg(($1 = u8(Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))))), i8(Neg(($2 = u8(F[1])))))))];
	case 0x801a: return [(_pfxLength + 7),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Add(($0 = u8(Add(R_[8][(((b[i+1] & 0x38)>>>3))], i8(Neg(($1 = u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))))))))))), i8(Neg(($2 = u8(F[1])))))))];
	case 0x1b: return [(_pfxLength + 7),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Add(($0 = Add(R_[32][(((b[i+1] & 0x38)>>>3))], int[(_pfxSizeSpecifier ? 16 : 32)](Neg(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))))))), i32(Neg(($2 = u32(F[1]))))))];
	case 0x801b: return [(_pfxLength + 7),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Add(($0 = Add(R_[32][(((b[i+1] & 0x38)>>>3))], int[(_pfxSizeSpecifier ? 16 : 32)](Neg(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))))))), i32(Neg(($2 = u32(F[1]))))))];
	case 0x20: return [(_pfxLength + 7),Mov(($0 = u8(Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(And($0, R_[8][(((b[i+1] & 0x38)>>>3))])))];
	case 0x8020: return [(_pfxLength + 7),Mov(($0 = u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))), u8(And($0, R_[8][(((b[i+1] & 0x38)>>>3))])))];
	case 0x21: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), And($0, R_[32][(((b[i+1] & 0x38)>>>3))]))];
	case 0x8021: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))), And($0, R_[32][(((b[i+1] & 0x38)>>>3))]))];
	case 0x22: return [(_pfxLength + 7),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(And(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))];
	case 0x8022: return [(_pfxLength + 7),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(And(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))))))))];
	case 0x23: return [(_pfxLength + 7),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], And(R_[32][(((b[i+1] & 0x38)>>>3))], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))))];
	case 0x8023: return [(_pfxLength + 7),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], And(R_[32][(((b[i+1] & 0x38)>>>3))], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))))];
	case 0x28: return [(_pfxLength + 7),Mov(F[2], Eq(($0 = u8(Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), R_[8][(((b[i+1] & 0x38)>>>3))])),Mov(F[1], Lt($0, R_[8][(((b[i+1] & 0x38)>>>3))])),Mov($0, u8(Add($0, i8(Neg(R_[8][(((b[i+1] & 0x38)>>>3))])))))];
	case 0x8028: return [(_pfxLength + 7),Mov(F[2], Eq(($0 = u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))), R_[8][(((b[i+1] & 0x38)>>>3))])),Mov(F[1], Lt($0, R_[8][(((b[i+1] & 0x38)>>>3))])),Mov($0, u8(Add($0, i8(Neg(R_[8][(((b[i+1] & 0x38)>>>3))])))))];
	case 0x29: return [(_pfxLength + 7),Mov(F[2], Eq(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), R_[32][(((b[i+1] & 0x38)>>>3))])),Mov(F[1], Lt($0, R_[32][(((b[i+1] & 0x38)>>>3))])),Mov($0, Add($0, i32(Neg(R_[32][(((b[i+1] & 0x38)>>>3))]))))];
	case 0x8029: return [(_pfxLength + 7),Mov(F[2], Eq(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))), R_[32][(((b[i+1] & 0x38)>>>3))])),Mov(F[1], Lt($0, R_[32][(((b[i+1] & 0x38)>>>3))])),Mov($0, Add($0, i32(Neg(R_[32][(((b[i+1] & 0x38)>>>3))]))))];
	case 0x2a: return [(_pfxLength + 7),Mov(F[2], Eq(R_[8][(((b[i+1] & 0x38)>>>3))], ($0 = u8(Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))))),Mov(F[1], Lt(R_[8][(((b[i+1] & 0x38)>>>3))], $0)),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Add(R_[8][(((b[i+1] & 0x38)>>>3))], i8(Neg($0)))))];
	case 0x802a: return [(_pfxLength + 7),Mov(F[2], Eq(R_[8][(((b[i+1] & 0x38)>>>3))], ($0 = u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))))),Mov(F[1], Lt(R_[8][(((b[i+1] & 0x38)>>>3))], $0)),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Add(R_[8][(((b[i+1] & 0x38)>>>3))], i8(Neg($0)))))];
	case 0x2b: return [(_pfxLength + 7),Mov(F[2], Eq(R_[32][(((b[i+1] & 0x38)>>>3))], ($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))))),Mov(F[1], Lt(R_[32][(((b[i+1] & 0x38)>>>3))], $0)),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Add(R_[32][(((b[i+1] & 0x38)>>>3))], int[(_pfxSizeSpecifier ? 16 : 32)](Neg($0))))];
	case 0x802b: return [(_pfxLength + 7),Mov(F[2], Eq(R_[32][(((b[i+1] & 0x38)>>>3))], ($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))))),Mov(F[1], Lt(R_[32][(((b[i+1] & 0x38)>>>3))], $0)),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Add(R_[32][(((b[i+1] & 0x38)>>>3))], int[(_pfxSizeSpecifier ? 16 : 32)](Neg($0))))];
	case 0x30: return [(_pfxLength + 7),Mov(($0 = u8(Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(Xor($0, R_[8][(((b[i+1] & 0x38)>>>3))])))];
	case 0x8030: return [(_pfxLength + 7),Mov(($0 = u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))), u8(Xor($0, R_[8][(((b[i+1] & 0x38)>>>3))])))];
	case 0x31: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), Xor($0, R_[32][(((b[i+1] & 0x38)>>>3))]))];
	case 0x8031: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))), Xor($0, R_[32][(((b[i+1] & 0x38)>>>3))]))];
	case 0x32: return [(_pfxLength + 7),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Xor(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))];
	case 0x8032: return [(_pfxLength + 7),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Xor(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))))))))];
	case 0x33: return [(_pfxLength + 7),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Xor(R_[32][(((b[i+1] & 0x38)>>>3))], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))))];
	case 0x8033: return [(_pfxLength + 7),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Xor(R_[32][(((b[i+1] & 0x38)>>>3))], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))))];
	case 0x38: return [(_pfxLength + 7),Mov(F[2], Eq(($0 = u8(Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), R_[8][(((b[i+1] & 0x38)>>>3))])),Mov(F[1], Lt($0, R_[8][(((b[i+1] & 0x38)>>>3))]))];
	case 0x8038: return [(_pfxLength + 7),Mov(F[2], Eq(($0 = u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))), R_[8][(((b[i+1] & 0x38)>>>3))])),Mov(F[1], Lt($0, R_[8][(((b[i+1] & 0x38)>>>3))]))];
	case 0x39: return [(_pfxLength + 7),Mov(F[2], Eq(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), R_[32][(((b[i+1] & 0x38)>>>3))])),Mov(F[1], Lt($0, R_[32][(((b[i+1] & 0x38)>>>3))]))];
	case 0x8039: return [(_pfxLength + 7),Mov(F[2], Eq(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))), R_[32][(((b[i+1] & 0x38)>>>3))])),Mov(F[1], Lt($0, R_[32][(((b[i+1] & 0x38)>>>3))]))];
	case 0x3a: return [(_pfxLength + 7),Mov(F[2], Eq(R_[8][(((b[i+1] & 0x38)>>>3))], ($0 = u8(Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))))),Mov(F[1], Lt(R_[8][(((b[i+1] & 0x38)>>>3))], $0))];
	case 0x803a: return [(_pfxLength + 7),Mov(F[2], Eq(R_[8][(((b[i+1] & 0x38)>>>3))], ($0 = u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))))),Mov(F[1], Lt(R_[8][(((b[i+1] & 0x38)>>>3))], $0))];
	case 0x3b: return [(_pfxLength + 7),Mov(F[2], Eq(R_[32][(((b[i+1] & 0x38)>>>3))], ($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))))),Mov(F[1], Lt(R_[32][(((b[i+1] & 0x38)>>>3))], $0))];
	case 0x803b: return [(_pfxLength + 7),Mov(F[2], Eq(R_[32][(((b[i+1] & 0x38)>>>3))], ($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))))),Mov(F[1], Lt(R_[32][(((b[i+1] & 0x38)>>>3))], $0))];
	case 0x84: return [(_pfxLength + 7),Mov(F[2], Eq(And(u8(Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))), R_[8][(((b[i+1] & 0x38)>>>3))]), 0)),Mov(F[1], 0),Mov(F[0], 0)];
	case 0x8084: return [(_pfxLength + 7),Mov(F[2], Eq(And(u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))))), R_[8][(((b[i+1] & 0x38)>>>3))]), 0)),Mov(F[1], 0),Mov(F[0], 0)];
	case 0x85: return [(_pfxLength + 7),Mov(F[2], Eq(And(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))), R_[32][(((b[i+1] & 0x38)>>>3))]), 0)),Mov(F[1], 0),Mov(F[0], 0)];
	case 0x8085: return [(_pfxLength + 7),Mov(F[2], Eq(And(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))))), R_[32][(((b[i+1] & 0x38)>>>3))]), 0)),Mov(F[1], 0),Mov(F[0], 0)];
	case 0x86: return [(_pfxLength + 7),Swap(u8(Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))), R_[8][(((b[i+1] & 0x38)>>>3))])];
	case 0x8086: return [(_pfxLength + 7),Swap(u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))))), R_[8][(((b[i+1] & 0x38)>>>3))])];
	case 0x87: return [(_pfxLength + 7),Swap(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))), R_[32][(((b[i+1] & 0x38)>>>3))])];
	case 0x8087: return [(_pfxLength + 7),Swap(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))))), R_[32][(((b[i+1] & 0x38)>>>3))])];
	case 0x88: return [(_pfxLength + 7),Mov(u8(Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))), R_[8][(((b[i+1] & 0x38)>>>3))])];
	case 0x8088: return [(_pfxLength + 7),Mov(u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))))), R_[8][(((b[i+1] & 0x38)>>>3))])];
	case 0x89: return [(_pfxLength + 7),Mov(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))), R_[32][(((b[i+1] & 0x38)>>>3))])];
	case 0x8089: return [(_pfxLength + 7),Mov(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))))), R_[32][(((b[i+1] & 0x38)>>>3))])];
	case 0x8a: return [(_pfxLength + 7),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))];
	case 0x808a: return [(_pfxLength + 7),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))))))];
	case 0x8b: return [(_pfxLength + 7),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))];
	case 0x808b: return [(_pfxLength + 7),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))))))];
	case 0x8c: return [(_pfxLength + 7),Mov(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))), R_.S[(((b[i+1] & 0x38)>>>3))])];
	case 0x808c: return [(_pfxLength + 7),Mov(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))))), R_.S[(((b[i+1] & 0x38)>>>3))])];
	case 0x8d: return [(_pfxLength + 7),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], ($0 = u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))];
	case 0x808d: return [(_pfxLength + 7),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], ($0 = u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))];
	case 0x8e: return [(_pfxLength + 7),Mov(R_.S[(((b[i+1] & 0x38)>>>3))], u16(Mem(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))];
	case 0x808e: return [(_pfxLength + 7),Mov(R_.S[(((b[i+1] & 0x38)>>>3))], u16(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))))))];
	}
if(((((b[i+0] & 0x80)>>>7)|((b[i+1] & 0x7f)<<1)) & 0x8d) == 0x9)
	switch((b[i+0]|(b[i+1]<<8)) & 0xb97f) {
	case 0x100: return [(_pfxLength + 7),Mov(($0 = u8(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))), u8(Add($0, (((b[i+6])<<24)>>24))))];
	case 0x1: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 7),Mov(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))))))))), Add($1, int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))];
	case 0x102: return [(_pfxLength + 7),Mov(($0 = u8(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))), u8(Add($0, (((b[i+6])<<24)>>24))))];
	case 0x103: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))), Add($0, (((b[i+6])<<24)>>24)))];
	case 0x900: return [(_pfxLength + 7),Mov(($0 = u8(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))), u8(Or($0, ((((b[i+6])<<24)>>24)&0xff))))];
	case 0x801: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 7),Mov(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))))))))), Or($1, uint[(_pfxSizeSpecifier ? 16 : 32)](int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))];
	case 0x902: return [(_pfxLength + 7),Mov(($0 = u8(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))), u8(Or($0, ((((b[i+6])<<24)>>24)&0xff))))];
	case 0x903: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))), Or($0, uint[(_pfxSizeSpecifier ? 16 : 32)]((((b[i+6])<<24)>>24))))];
	case 0x1100: return [(_pfxLength + 7),Mov(($0 = u8(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))), u8(Add($0, u8(Add((((b[i+6])<<24)>>24), u8(F[1]))))))];
	case 0x1001: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 7),Mov(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))))))))), Add($1, Add(int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), uint[(_pfxSizeSpecifier ? 16 : 32)](F[1]))))];
	case 0x1102: return [(_pfxLength + 7),Mov(($0 = u8(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))), u8(Add($0, u8(Add((((b[i+6])<<24)>>24), u8(F[1]))))))];
	case 0x1103: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))), Add($0, Add((((b[i+6])<<24)>>24), uint[(_pfxSizeSpecifier ? 16 : 32)](F[1]))))];
	case 0x1900: return [(_pfxLength + 7),Mov(($0 = u8(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))), u8(Add(($1 = u8(Add($0, ((-($2 = (((b[i+6])<<24)>>24))<<24)>>24)))), i8(Neg(($3 = u8(F[1])))))))];
	case 0x1801: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 7),Mov(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))))))))), Add(($2 = Add($1, int[(_pfxSizeSpecifier ? 16 : 32)](-($3 = int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), int[(_pfxSizeSpecifier ? 16 : 32)](Neg(($4 = uint[(_pfxSizeSpecifier ? 16 : 32)](F[1]))))))];
	case 0x1902: return [(_pfxLength + 7),Mov(($0 = u8(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))), u8(Add(($1 = u8(Add($0, ((-($2 = (((b[i+6])<<24)>>24))<<24)>>24)))), i8(Neg(($3 = u8(F[1])))))))];
	case 0x1903: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))), Add(($1 = Add($0, ((-($2 = (((b[i+6])<<24)>>24))<<24)>>24))), int[(_pfxSizeSpecifier ? 16 : 32)](Neg(($3 = uint[(_pfxSizeSpecifier ? 16 : 32)](F[1]))))))];
	case 0x2100: return [(_pfxLength + 7),Mov(($0 = u8(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))), u8(And($0, ((((b[i+6])<<24)>>24)&0xff))))];
	case 0x2001: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 7),Mov(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))))))))), And($1, uint[(_pfxSizeSpecifier ? 16 : 32)](int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))];
	case 0x2102: return [(_pfxLength + 7),Mov(($0 = u8(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))), u8(And($0, ((((b[i+6])<<24)>>24)&0xff))))];
	case 0x2103: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))), And($0, uint[(_pfxSizeSpecifier ? 16 : 32)]((((b[i+6])<<24)>>24))))];
	case 0x2900: return [(_pfxLength + 7),Mov(F[2], Eq(($0 = u8(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))), ($1 = (((b[i+6])<<24)>>24)))),Mov(F[1], Lt($0, $1)),Mov($0, u8(Add($0, ((-$1<<24)>>24))))];
	case 0x2801: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 7),Mov(F[2], Eq(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))))))))), ($2 = int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))),Mov(F[1], Lt($1, $2)),Mov($1, Add($1, int[(_pfxSizeSpecifier ? 16 : 32)](-$2)))];
	case 0x2902: return [(_pfxLength + 7),Mov(F[2], Eq(($0 = u8(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))), ($1 = (((b[i+6])<<24)>>24)))),Mov(F[1], Lt($0, $1)),Mov($0, u8(Add($0, ((-$1<<24)>>24))))];
	case 0x2903: return [(_pfxLength + 7),Mov(F[2], Eq(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))), ($1 = (((b[i+6])<<24)>>24)))),Mov(F[1], Lt($0, $1)),Mov($0, Add($0, ((-$1<<24)>>24)))];
	case 0x3100: return [(_pfxLength + 7),Mov(($0 = u8(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))), u8(Xor($0, (((b[i+6])<<24)>>24))))];
	case 0x3001: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 7),Mov(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))))))))), Xor($1, int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))];
	case 0x3102: return [(_pfxLength + 7),Mov(($0 = u8(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))), u8(Xor($0, (((b[i+6])<<24)>>24))))];
	case 0x3103: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))), Xor($0, (((b[i+6])<<24)>>24)))];
	case 0x3900: return [(_pfxLength + 7),Mov(F[2], Eq(($0 = u8(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))), ($1 = (((b[i+6])<<24)>>24)))),Mov(F[1], Lt($0, $1))];
	case 0x3801: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 7),Mov(F[2], Eq(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))))))))), ($2 = int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))),Mov(F[1], Lt($1, $2))];
	case 0x3902: return [(_pfxLength + 7),Mov(F[2], Eq(($0 = u8(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))), ($1 = (((b[i+6])<<24)>>24)))),Mov(F[1], Lt($0, $1))];
	case 0x3903: return [(_pfxLength + 7),Mov(F[2], Eq(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))), ($1 = (((b[i+6])<<24)>>24)))),Mov(F[1], Lt($0, $1))];
	case 0x800f: return [(_pfxLength + 7),Mov(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))), uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][4]))),Mov(R_[32][4], Add(R_[32][4], ((_pfxSizeSpecifier ? 16 : 32) >>> 3)))];
	case 0x146: return [(_pfxLength + 7),Mov(u8(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)))), (((b[i+6])<<24)>>24))];
	case 0x47: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 7),Mov(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))))), int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))];
	case 0x140: return [(_pfxLength + 7),Mov(($0 = u8(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))), u8(Or(u8(LSL($0, ($1 = (((b[i+6])<<24)>>24)))), u8(LSR($0, (((((-$1<<24)>>24) + 8)<<24)>>24))))))];
	case 0x141: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, ($1 = (((b[i+6])<<24)>>24)))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, ((_pfxSizeSpecifier ? 16 : 32) + ((-$1<<24)>>24))))))];
	case 0x8050: return [(_pfxLength + 7),Mov(($0 = u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(Or(u8(LSL($0, 1)), u8(LSR($0, 7)))))];
	case 0x8051: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, 1)), uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, ((_pfxSizeSpecifier ? 16 : 32) + -1)))))];
	case 0x8052: return [(_pfxLength + 7),Mov(($0 = u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(Or(u8(LSL($0, R_[8][1])), u8(LSR($0, i8(Add(i8(Neg(R_[8][1])), 8)))))))];
	case 0x8053: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, R_[8][1])), uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, Add((_pfxSizeSpecifier ? 16 : 32), i8(Neg(R_[8][1])))))))];
	case 0x940: return [(_pfxLength + 7),Mov(($0 = u8(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))), u8(Or(u8(LSR($0, ($1 = (((b[i+6])<<24)>>24)))), u8(LSL($0, (((((-$1<<24)>>24) + 8)<<24)>>24))))))];
	case 0x941: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, ($1 = (((b[i+6])<<24)>>24)))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, ((_pfxSizeSpecifier ? 16 : 32) + ((-$1<<24)>>24))))))];
	case 0x8850: return [(_pfxLength + 7),Mov(($0 = u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(Or(u8(LSR($0, 1)), u8(LSL($0, 7)))))];
	case 0x8851: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, 1)), uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, ((_pfxSizeSpecifier ? 16 : 32) + -1)))))];
	case 0x8852: return [(_pfxLength + 7),Mov(($0 = u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(Or(u8(LSR($0, R_[8][1])), u8(LSL($0, i8(Add(i8(Neg(R_[8][1])), 8)))))))];
	case 0x8853: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, R_[8][1])), uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, Add((_pfxSizeSpecifier ? 16 : 32), i8(Neg(R_[8][1])))))))];
	case 0x2140: return [(_pfxLength + 7),Mov(($0 = u8(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))), u8(LSL($0, (((b[i+6])<<24)>>24))))];
	case 0x2141: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, (((b[i+6])<<24)>>24))))];
	case 0xa050: return [(_pfxLength + 7),Mov(($0 = u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(LSL($0, 1)))];
	case 0xa051: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, 1)))];
	case 0xa052: return [(_pfxLength + 7),Mov(($0 = u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(LSL($0, R_[8][1])))];
	case 0xa053: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, R_[8][1])))];
	case 0x2940: return [(_pfxLength + 7),Mov(($0 = u8(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))), u8(LSR($0, (((b[i+6])<<24)>>24))))];
	case 0x2941: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, (((b[i+6])<<24)>>24))))];
	case 0xa850: return [(_pfxLength + 7),Mov(($0 = u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(LSR($0, 1)))];
	case 0xa851: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, 1)))];
	case 0xa852: return [(_pfxLength + 7),Mov(($0 = u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(LSR($0, R_[8][1])))];
	case 0xa853: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, R_[8][1])))];
	case 0x3940: return [(_pfxLength + 7),Mov(($0 = u8(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))), u8(ASR($0, (((b[i+6])<<24)>>24))))];
	case 0x3941: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))), uint[(_pfxSizeSpecifier ? 16 : 32)](ASR($0, (((b[i+6])<<24)>>24))))];
	case 0xb850: return [(_pfxLength + 7),Mov(($0 = u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(ASR($0, 1)))];
	case 0xb851: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), uint[(_pfxSizeSpecifier ? 16 : 32)](ASR($0, 1)))];
	case 0xb852: return [(_pfxLength + 7),Mov(($0 = u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(ASR($0, R_[8][1])))];
	case 0xb853: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), uint[(_pfxSizeSpecifier ? 16 : 32)](ASR($0, R_[8][1])))];
	case 0x176: return [(_pfxLength + 7),Mov(F[2], Eq(And(u8(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)))), (((b[i+6])<<24)>>24)), 0)),Mov(F[1], 0),Mov(F[0], 0)];
	case 0x77: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 7),Mov(F[2], Eq(And(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))))), int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 0)),Mov(F[1], 0),Mov(F[0], 0)];
	case 0x9076: return [(_pfxLength + 7),Mov(($0 = u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(Not($0)))];
	case 0x9077: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), uint[(_pfxSizeSpecifier ? 16 : 32)](Not($0)))];
	case 0x9876: return [(_pfxLength + 7),Mov(F[1], u1(Not(Eq(($0 = u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), 0)))),Mov($0, i8(Neg($0)))];
	case 0x9877: return [(_pfxLength + 7),Mov(F[1], u1(Not(Eq(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), 0)))),Mov($0, int[(_pfxSizeSpecifier ? 16 : 32)](Neg($0)))];
	case 0xa076: return [(_pfxLength + 7),Mov(R_[16][0], u8(Mul(R_[8][0], u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))];
	case 0xa077: return [(_pfxLength + 7),Mov(R_[32][0], Mul(R_[32][0], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))))];
	case 0xa876: return [(_pfxLength + 7),Mov(R_[16][0], u8(Mul(R_[8][0], u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))];
	case 0xa877: return [(_pfxLength + 7),Mov(R_[32][0], Mul(R_[32][0], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))))];
	case 0xb076: return [(_pfxLength + 7),Mov(R_[16][0], u8(Div(R_[8][0], u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))];
	case 0xb077: return [(_pfxLength + 7),Mov(R_[32][0], Div(R_[32][0], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))))];
	case 0xb876: return [(_pfxLength + 7),Mov(R_[16][0], u8(Div(R_[8][0], u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))];
	case 0xb877: return [(_pfxLength + 7),Mov(R_[32][0], Div(R_[32][0], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))))];
	case 0x807e: return [(_pfxLength + 7),Mov(($0 = u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(Add($0, 1)))];
	case 0x807f: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), Add($0, 1))];
	case 0x887e: return [(_pfxLength + 7),Mov(($0 = u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(Add($0, -1)))];
	case 0x887f: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), Add($0, -1))];
	case 0x907f: return [(_pfxLength + 7),Mov(R_[32][4], u32(Add(R_[32][4], -4))),Mov(u32(Mem(R_[32][4])), u32(Add(R_[32][8], (_pfxLength + 7)))),Mov(R_[32][8], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))];
	case 0xa07f: return [(_pfxLength + 7),Mov(R_[32][8], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))];
	case 0xb07f: return [(_pfxLength + 7),Mov(R_[32][4], Add(R_[32][4], -($0 = ((_pfxSizeSpecifier ? 16 : 32) >>> 3)))),Mov(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][4])), uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))];
	}
if(((((b[i+1] & 0x7e)>>>1)) & 0x23) == 0x2)
	switch((b[i+0]|(b[i+1]<<8)) & 0x81ff) {
	case 0x8000: return [(_pfxLength + 7),Mov(($0 = u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(Add($0, R_[8][(((b[i+1] & 0x38)>>>3))])))];
	case 0x8001: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), Add($0, R_[32][(((b[i+1] & 0x38)>>>3))]))];
	case 0x8002: return [(_pfxLength + 7),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Add(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))];
	case 0x8003: return [(_pfxLength + 7),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Add(R_[32][(((b[i+1] & 0x38)>>>3))], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))))];
	case 0x8008: return [(_pfxLength + 7),Mov(($0 = u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(Or($0, R_[8][(((b[i+1] & 0x38)>>>3))])))];
	case 0x8009: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), Or($0, R_[32][(((b[i+1] & 0x38)>>>3))]))];
	case 0x800a: return [(_pfxLength + 7),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Or(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))];
	case 0x800b: return [(_pfxLength + 7),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Or(R_[32][(((b[i+1] & 0x38)>>>3))], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))))];
	case 0x8010: return [(_pfxLength + 7),Mov(($0 = u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(Add($0, u8(Add(R_[8][(((b[i+1] & 0x38)>>>3))], u8(F[1]))))))];
	case 0x8011: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), Add($0, Add(R_[32][(((b[i+1] & 0x38)>>>3))], uint[(_pfxSizeSpecifier ? 16 : 32)](F[1]))))];
	case 0x8012: return [(_pfxLength + 7),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Add(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Add(u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))), u8(F[1]))))))];
	case 0x8013: return [(_pfxLength + 7),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Add(R_[32][(((b[i+1] & 0x38)>>>3))], Add(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))), u32(F[1]))))];
	case 0x8018: return [(_pfxLength + 7),Mov(($0 = u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(Add(($1 = u8(Add($0, i8(Neg(R_[8][(((b[i+1] & 0x38)>>>3))]))))), i8(Neg(($2 = u8(F[1])))))))];
	case 0x8019: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), Add(($1 = Add($0, i32(Neg(R_[32][(((b[i+1] & 0x38)>>>3))])))), int[(_pfxSizeSpecifier ? 16 : 32)](Neg(($2 = uint[(_pfxSizeSpecifier ? 16 : 32)](F[1]))))))];
	case 0x801a: return [(_pfxLength + 7),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Add(($0 = u8(Add(R_[8][(((b[i+1] & 0x38)>>>3))], i8(Neg(($1 = u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))))), i8(Neg(($2 = u8(F[1])))))))];
	case 0x801b: return [(_pfxLength + 7),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Add(($0 = Add(R_[32][(((b[i+1] & 0x38)>>>3))], int[(_pfxSizeSpecifier ? 16 : 32)](Neg(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))))))), i32(Neg(($2 = u32(F[1]))))))];
	case 0x8020: return [(_pfxLength + 7),Mov(($0 = u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(And($0, R_[8][(((b[i+1] & 0x38)>>>3))])))];
	case 0x8021: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), And($0, R_[32][(((b[i+1] & 0x38)>>>3))]))];
	case 0x8022: return [(_pfxLength + 7),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(And(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))];
	case 0x8023: return [(_pfxLength + 7),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], And(R_[32][(((b[i+1] & 0x38)>>>3))], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))))];
	case 0x8028: return [(_pfxLength + 7),Mov(F[2], Eq(($0 = u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), R_[8][(((b[i+1] & 0x38)>>>3))])),Mov(F[1], Lt($0, R_[8][(((b[i+1] & 0x38)>>>3))])),Mov($0, u8(Add($0, i8(Neg(R_[8][(((b[i+1] & 0x38)>>>3))])))))];
	case 0x8029: return [(_pfxLength + 7),Mov(F[2], Eq(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), R_[32][(((b[i+1] & 0x38)>>>3))])),Mov(F[1], Lt($0, R_[32][(((b[i+1] & 0x38)>>>3))])),Mov($0, Add($0, i32(Neg(R_[32][(((b[i+1] & 0x38)>>>3))]))))];
	case 0x802a: return [(_pfxLength + 7),Mov(F[2], Eq(R_[8][(((b[i+1] & 0x38)>>>3))], ($0 = u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))))),Mov(F[1], Lt(R_[8][(((b[i+1] & 0x38)>>>3))], $0)),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Add(R_[8][(((b[i+1] & 0x38)>>>3))], i8(Neg($0)))))];
	case 0x802b: return [(_pfxLength + 7),Mov(F[2], Eq(R_[32][(((b[i+1] & 0x38)>>>3))], ($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))))),Mov(F[1], Lt(R_[32][(((b[i+1] & 0x38)>>>3))], $0)),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Add(R_[32][(((b[i+1] & 0x38)>>>3))], int[(_pfxSizeSpecifier ? 16 : 32)](Neg($0))))];
	case 0x8030: return [(_pfxLength + 7),Mov(($0 = u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), u8(Xor($0, R_[8][(((b[i+1] & 0x38)>>>3))])))];
	case 0x8031: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), Xor($0, R_[32][(((b[i+1] & 0x38)>>>3))]))];
	case 0x8032: return [(_pfxLength + 7),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Xor(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))))];
	case 0x8033: return [(_pfxLength + 7),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Xor(R_[32][(((b[i+1] & 0x38)>>>3))], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))))];
	case 0x8038: return [(_pfxLength + 7),Mov(F[2], Eq(($0 = u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), R_[8][(((b[i+1] & 0x38)>>>3))])),Mov(F[1], Lt($0, R_[8][(((b[i+1] & 0x38)>>>3))]))];
	case 0x8039: return [(_pfxLength + 7),Mov(F[2], Eq(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), R_[32][(((b[i+1] & 0x38)>>>3))])),Mov(F[1], Lt($0, R_[32][(((b[i+1] & 0x38)>>>3))]))];
	case 0x803a: return [(_pfxLength + 7),Mov(F[2], Eq(R_[8][(((b[i+1] & 0x38)>>>3))], ($0 = u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))))),Mov(F[1], Lt(R_[8][(((b[i+1] & 0x38)>>>3))], $0))];
	case 0x803b: return [(_pfxLength + 7),Mov(F[2], Eq(R_[32][(((b[i+1] & 0x38)>>>3))], ($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))))),Mov(F[1], Lt(R_[32][(((b[i+1] & 0x38)>>>3))], $0))];
	case 0x69: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 7),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Mul(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))))), int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))];
	case 0x16b: return [(_pfxLength + 7),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Mul(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)))), ((((b[i+6])<<24)>>24)&~0)))];
	case 0x8084: return [(_pfxLength + 7),Mov(F[2], Eq(And(u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))), R_[8][(((b[i+1] & 0x38)>>>3))]), 0)),Mov(F[1], 0),Mov(F[0], 0)];
	case 0x8085: return [(_pfxLength + 7),Mov(F[2], Eq(And(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))), R_[32][(((b[i+1] & 0x38)>>>3))]), 0)),Mov(F[1], 0),Mov(F[0], 0)];
	case 0x8086: return [(_pfxLength + 7),Swap(u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))), R_[8][(((b[i+1] & 0x38)>>>3))])];
	case 0x8087: return [(_pfxLength + 7),Swap(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))), R_[32][(((b[i+1] & 0x38)>>>3))])];
	case 0x8088: return [(_pfxLength + 7),Mov(u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))), R_[8][(((b[i+1] & 0x38)>>>3))])];
	case 0x8089: return [(_pfxLength + 7),Mov(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))), R_[32][(((b[i+1] & 0x38)>>>3))])];
	case 0x808a: return [(_pfxLength + 7),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))];
	case 0x808b: return [(_pfxLength + 7),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))];
	case 0x808c: return [(_pfxLength + 7),Mov(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))), R_.S[(((b[i+1] & 0x38)>>>3))])];
	case 0x808d: return [(_pfxLength + 7),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], ($0 = u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))];
	case 0x808e: return [(_pfxLength + 7),Mov(R_.S[(((b[i+1] & 0x38)>>>3))], u16(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))))];
	}
if(((((b[i+0] & 0xf8)>>>3)) & 0x11) == 0x10)
	switch((b[i+0]|(b[i+1]<<8)) & 0xf877) {
	case 0x8000: return [(_pfxLength + 7),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))), u8(Add($0, (((b[i+6])<<24)>>24))))];
	case 0x4001: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 7),Mov(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24)))))), Add($1, int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))];
	case 0x8002: return [(_pfxLength + 7),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))), u8(Add($0, (((b[i+6])<<24)>>24))))];
	case 0x8003: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))), Add($0, (((b[i+6])<<24)>>24)))];
	case 0x8800: return [(_pfxLength + 7),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))), u8(Or($0, ((((b[i+6])<<24)>>24)&0xff))))];
	case 0x4801: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 7),Mov(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24)))))), Or($1, uint[(_pfxSizeSpecifier ? 16 : 32)](int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))];
	case 0x8802: return [(_pfxLength + 7),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))), u8(Or($0, ((((b[i+6])<<24)>>24)&0xff))))];
	case 0x8803: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))), Or($0, uint[(_pfxSizeSpecifier ? 16 : 32)]((((b[i+6])<<24)>>24))))];
	case 0x9000: return [(_pfxLength + 7),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))), u8(Add($0, u8(Add((((b[i+6])<<24)>>24), u8(F[1]))))))];
	case 0x5001: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 7),Mov(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24)))))), Add($1, Add(int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), uint[(_pfxSizeSpecifier ? 16 : 32)](F[1]))))];
	case 0x9002: return [(_pfxLength + 7),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))), u8(Add($0, u8(Add((((b[i+6])<<24)>>24), u8(F[1]))))))];
	case 0x9003: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))), Add($0, Add((((b[i+6])<<24)>>24), uint[(_pfxSizeSpecifier ? 16 : 32)](F[1]))))];
	case 0x9800: return [(_pfxLength + 7),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))), u8(Add(($1 = u8(Add($0, ((-($2 = (((b[i+6])<<24)>>24))<<24)>>24)))), i8(Neg(($3 = u8(F[1])))))))];
	case 0x5801: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 7),Mov(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24)))))), Add(($2 = Add($1, int[(_pfxSizeSpecifier ? 16 : 32)](-($3 = int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))), int[(_pfxSizeSpecifier ? 16 : 32)](Neg(($4 = uint[(_pfxSizeSpecifier ? 16 : 32)](F[1]))))))];
	case 0x9802: return [(_pfxLength + 7),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))), u8(Add(($1 = u8(Add($0, ((-($2 = (((b[i+6])<<24)>>24))<<24)>>24)))), i8(Neg(($3 = u8(F[1])))))))];
	case 0x9803: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))), Add(($1 = Add($0, ((-($2 = (((b[i+6])<<24)>>24))<<24)>>24))), int[(_pfxSizeSpecifier ? 16 : 32)](Neg(($3 = uint[(_pfxSizeSpecifier ? 16 : 32)](F[1]))))))];
	case 0xa000: return [(_pfxLength + 7),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))), u8(And($0, ((((b[i+6])<<24)>>24)&0xff))))];
	case 0x6001: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 7),Mov(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24)))))), And($1, uint[(_pfxSizeSpecifier ? 16 : 32)](int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))))];
	case 0xa002: return [(_pfxLength + 7),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))), u8(And($0, ((((b[i+6])<<24)>>24)&0xff))))];
	case 0xa003: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))), And($0, uint[(_pfxSizeSpecifier ? 16 : 32)]((((b[i+6])<<24)>>24))))];
	case 0xa800: return [(_pfxLength + 7),Mov(F[2], Eq(($0 = u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))), ($1 = (((b[i+6])<<24)>>24)))),Mov(F[1], Lt($0, $1)),Mov($0, u8(Add($0, ((-$1<<24)>>24))))];
	case 0x6801: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 7),Mov(F[2], Eq(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24)))))), ($2 = int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))),Mov(F[1], Lt($1, $2)),Mov($1, Add($1, int[(_pfxSizeSpecifier ? 16 : 32)](-$2)))];
	case 0xa802: return [(_pfxLength + 7),Mov(F[2], Eq(($0 = u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))), ($1 = (((b[i+6])<<24)>>24)))),Mov(F[1], Lt($0, $1)),Mov($0, u8(Add($0, ((-$1<<24)>>24))))];
	case 0xa803: return [(_pfxLength + 7),Mov(F[2], Eq(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))), ($1 = (((b[i+6])<<24)>>24)))),Mov(F[1], Lt($0, $1)),Mov($0, Add($0, ((-$1<<24)>>24)))];
	case 0xb000: return [(_pfxLength + 7),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))), u8(Xor($0, (((b[i+6])<<24)>>24))))];
	case 0x7001: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 7),Mov(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24)))))), Xor($1, int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))];
	case 0xb002: return [(_pfxLength + 7),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))), u8(Xor($0, (((b[i+6])<<24)>>24))))];
	case 0xb003: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))), Xor($0, (((b[i+6])<<24)>>24)))];
	case 0xb800: return [(_pfxLength + 7),Mov(F[2], Eq(($0 = u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))), ($1 = (((b[i+6])<<24)>>24)))),Mov(F[1], Lt($0, $1))];
	case 0x7801: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 7),Mov(F[2], Eq(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24)))))), ($2 = int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))),Mov(F[1], Lt($1, $2))];
	case 0xb802: return [(_pfxLength + 7),Mov(F[2], Eq(($0 = u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))), ($1 = (((b[i+6])<<24)>>24)))),Mov(F[1], Lt($0, $1))];
	case 0xb803: return [(_pfxLength + 7),Mov(F[2], Eq(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))), ($1 = (((b[i+6])<<24)>>24)))),Mov(F[1], Lt($0, $1))];
	case 0x8046: return [(_pfxLength + 7),Mov(u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)))))), (((b[i+6])<<24)>>24))];
	case 0x4047: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 7),Mov(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24))))), int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))];
	case 0x8040: return [(_pfxLength + 7),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))), u8(Or(u8(LSL($0, ($1 = (((b[i+6])<<24)>>24)))), u8(LSR($0, (((((-$1<<24)>>24) + 8)<<24)>>24))))))];
	case 0x8041: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, ($1 = (((b[i+6])<<24)>>24)))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, ((_pfxSizeSpecifier ? 16 : 32) + ((-$1<<24)>>24))))))];
	case 0x8840: return [(_pfxLength + 7),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))), u8(Or(u8(LSR($0, ($1 = (((b[i+6])<<24)>>24)))), u8(LSL($0, (((((-$1<<24)>>24) + 8)<<24)>>24))))))];
	case 0x8841: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, ($1 = (((b[i+6])<<24)>>24)))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, ((_pfxSizeSpecifier ? 16 : 32) + ((-$1<<24)>>24))))))];
	case 0xa040: return [(_pfxLength + 7),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))), u8(LSL($0, (((b[i+6])<<24)>>24))))];
	case 0xa041: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, (((b[i+6])<<24)>>24))))];
	case 0xa840: return [(_pfxLength + 7),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))), u8(LSR($0, (((b[i+6])<<24)>>24))))];
	case 0xa841: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, (((b[i+6])<<24)>>24))))];
	case 0xb840: return [(_pfxLength + 7),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))), u8(ASR($0, (((b[i+6])<<24)>>24))))];
	case 0xb841: return [(_pfxLength + 7),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))), uint[(_pfxSizeSpecifier ? 16 : 32)](ASR($0, (((b[i+6])<<24)>>24))))];
	case 0x8076: return [(_pfxLength + 7),Mov(F[2], Eq(And(u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)))))), (((b[i+6])<<24)>>24)), 0)),Mov(F[1], 0),Mov(F[0], 0)];
	case 0x4077: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 7),Mov(F[2], Eq(And(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24))))), int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 0)),Mov(F[1], 0),Mov(F[0], 0)];
	}
if(((((b[i+0] & 0xc0)>>>6)|(b[i+1]<<2)) & 0x31d) == 0x14)
	switch((b[i+0]) & 0xbf) {
	case 0x0: return [(_pfxLength + 6),Mov(($0 = u8(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))), u8(Add($0, R_[8][(((b[i+1] & 0x38)>>>3))])))];
	case 0x1: return [(_pfxLength + 6),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))), Add($0, R_[32][(((b[i+1] & 0x38)>>>3))]))];
	case 0x2: return [(_pfxLength + 6),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Add(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)))))))];
	case 0x3: return [(_pfxLength + 6),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Add(R_[32][(((b[i+1] & 0x38)>>>3))], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))];
	case 0x8: return [(_pfxLength + 6),Mov(($0 = u8(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))), u8(Or($0, R_[8][(((b[i+1] & 0x38)>>>3))])))];
	case 0x9: return [(_pfxLength + 6),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))), Or($0, R_[32][(((b[i+1] & 0x38)>>>3))]))];
	case 0xa: return [(_pfxLength + 6),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Or(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)))))))];
	case 0xb: return [(_pfxLength + 6),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Or(R_[32][(((b[i+1] & 0x38)>>>3))], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))];
	case 0x10: return [(_pfxLength + 6),Mov(($0 = u8(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))), u8(Add($0, u8(Add(R_[8][(((b[i+1] & 0x38)>>>3))], u8(F[1]))))))];
	case 0x11: return [(_pfxLength + 6),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))), Add($0, Add(R_[32][(((b[i+1] & 0x38)>>>3))], uint[(_pfxSizeSpecifier ? 16 : 32)](F[1]))))];
	case 0x12: return [(_pfxLength + 6),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Add(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Add(u8(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)))), u8(F[1]))))))];
	case 0x13: return [(_pfxLength + 6),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Add(R_[32][(((b[i+1] & 0x38)>>>3))], Add(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)))), u32(F[1]))))];
	case 0x18: return [(_pfxLength + 6),Mov(($0 = u8(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))), u8(Add(($1 = u8(Add($0, i8(Neg(R_[8][(((b[i+1] & 0x38)>>>3))]))))), i8(Neg(($2 = u8(F[1])))))))];
	case 0x19: return [(_pfxLength + 6),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))), Add(($1 = Add($0, i32(Neg(R_[32][(((b[i+1] & 0x38)>>>3))])))), int[(_pfxSizeSpecifier ? 16 : 32)](Neg(($2 = uint[(_pfxSizeSpecifier ? 16 : 32)](F[1]))))))];
	case 0x1a: return [(_pfxLength + 6),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Add(($0 = u8(Add(R_[8][(((b[i+1] & 0x38)>>>3))], i8(Neg(($1 = u8(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)))))))))), i8(Neg(($2 = u8(F[1])))))))];
	case 0x1b: return [(_pfxLength + 6),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Add(($0 = Add(R_[32][(((b[i+1] & 0x38)>>>3))], int[(_pfxSizeSpecifier ? 16 : 32)](Neg(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))))), i32(Neg(($2 = u32(F[1]))))))];
	case 0x20: return [(_pfxLength + 6),Mov(($0 = u8(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))), u8(And($0, R_[8][(((b[i+1] & 0x38)>>>3))])))];
	case 0x21: return [(_pfxLength + 6),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))), And($0, R_[32][(((b[i+1] & 0x38)>>>3))]))];
	case 0x22: return [(_pfxLength + 6),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(And(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)))))))];
	case 0x23: return [(_pfxLength + 6),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], And(R_[32][(((b[i+1] & 0x38)>>>3))], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))];
	case 0x28: return [(_pfxLength + 6),Mov(F[2], Eq(($0 = u8(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))), R_[8][(((b[i+1] & 0x38)>>>3))])),Mov(F[1], Lt($0, R_[8][(((b[i+1] & 0x38)>>>3))])),Mov($0, u8(Add($0, i8(Neg(R_[8][(((b[i+1] & 0x38)>>>3))])))))];
	case 0x29: return [(_pfxLength + 6),Mov(F[2], Eq(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))), R_[32][(((b[i+1] & 0x38)>>>3))])),Mov(F[1], Lt($0, R_[32][(((b[i+1] & 0x38)>>>3))])),Mov($0, Add($0, i32(Neg(R_[32][(((b[i+1] & 0x38)>>>3))]))))];
	case 0x2a: return [(_pfxLength + 6),Mov(F[2], Eq(R_[8][(((b[i+1] & 0x38)>>>3))], ($0 = u8(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))),Mov(F[1], Lt(R_[8][(((b[i+1] & 0x38)>>>3))], $0)),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Add(R_[8][(((b[i+1] & 0x38)>>>3))], i8(Neg($0)))))];
	case 0x2b: return [(_pfxLength + 6),Mov(F[2], Eq(R_[32][(((b[i+1] & 0x38)>>>3))], ($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))),Mov(F[1], Lt(R_[32][(((b[i+1] & 0x38)>>>3))], $0)),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Add(R_[32][(((b[i+1] & 0x38)>>>3))], int[(_pfxSizeSpecifier ? 16 : 32)](Neg($0))))];
	case 0x30: return [(_pfxLength + 6),Mov(($0 = u8(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))), u8(Xor($0, R_[8][(((b[i+1] & 0x38)>>>3))])))];
	case 0x31: return [(_pfxLength + 6),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))), Xor($0, R_[32][(((b[i+1] & 0x38)>>>3))]))];
	case 0x32: return [(_pfxLength + 6),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Xor(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)))))))];
	case 0x33: return [(_pfxLength + 6),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Xor(R_[32][(((b[i+1] & 0x38)>>>3))], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))];
	case 0x38: return [(_pfxLength + 6),Mov(F[2], Eq(($0 = u8(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))), R_[8][(((b[i+1] & 0x38)>>>3))])),Mov(F[1], Lt($0, R_[8][(((b[i+1] & 0x38)>>>3))]))];
	case 0x39: return [(_pfxLength + 6),Mov(F[2], Eq(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))), R_[32][(((b[i+1] & 0x38)>>>3))])),Mov(F[1], Lt($0, R_[32][(((b[i+1] & 0x38)>>>3))]))];
	case 0x3a: return [(_pfxLength + 6),Mov(F[2], Eq(R_[8][(((b[i+1] & 0x38)>>>3))], ($0 = u8(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))),Mov(F[1], Lt(R_[8][(((b[i+1] & 0x38)>>>3))], $0))];
	case 0x3b: return [(_pfxLength + 6),Mov(F[2], Eq(R_[32][(((b[i+1] & 0x38)>>>3))], ($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))),Mov(F[1], Lt(R_[32][(((b[i+1] & 0x38)>>>3))], $0))];
	case 0x84: return [(_pfxLength + 6),Mov(F[2], Eq(And(u8(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)))), R_[8][(((b[i+1] & 0x38)>>>3))]), 0)),Mov(F[1], 0),Mov(F[0], 0)];
	case 0x85: return [(_pfxLength + 6),Mov(F[2], Eq(And(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)))), R_[32][(((b[i+1] & 0x38)>>>3))]), 0)),Mov(F[1], 0),Mov(F[0], 0)];
	case 0x86: return [(_pfxLength + 6),Swap(u8(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)))), R_[8][(((b[i+1] & 0x38)>>>3))])];
	case 0x87: return [(_pfxLength + 6),Swap(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)))), R_[32][(((b[i+1] & 0x38)>>>3))])];
	case 0x88: return [(_pfxLength + 6),Mov(u8(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)))), R_[8][(((b[i+1] & 0x38)>>>3))])];
	case 0x89: return [(_pfxLength + 6),Mov(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)))), R_[32][(((b[i+1] & 0x38)>>>3))])];
	case 0x8a: return [(_pfxLength + 6),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)))))];
	case 0x8b: return [(_pfxLength + 6),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)))))];
	case 0x8c: return [(_pfxLength + 6),Mov(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)))), R_.S[(((b[i+1] & 0x38)>>>3))])];
	case 0x8d: return [(_pfxLength + 6),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], ($0 = (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))];
	case 0x8e: return [(_pfxLength + 6),Mov(R_.S[(((b[i+1] & 0x38)>>>3))], u16(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)))))];
	}
if(((b[i+0]|(b[i+1]<<8)|(b[i+2]<<16)|((b[i+3] & 0x3f)<<24)) & 0x3fc7ffff) == 0x2544ac0f)
	switch(0) {
	case 0x0: return [(_pfxLength + 6),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (((b[i+4])<<24)>>24)))))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, ($1 = (((b[i+5])<<24)>>24)))), u32(And(R_[32][(((b[i+2] & 0x38)>>>3))], (($65 = ((($64 = ((($63 = (1 << $1)&~0), ($63 < 0 ? $63+0x100000000 : $63)) + -1)&~0), ($64 < 0 ? $64+0x100000000 : $64)) << (((((-$1<<24)>>24) + 32)<<24)>>24))&~0), ($65 < 0 ? $65+0x100000000 : $65))))))];
	}
if(((b[i+0]|(b[i+1]<<8)|(b[i+2]<<16)|((b[i+3] & 0x3f)<<24)) & 0x38c7ffff) == 0x2044ac0f)
	switch(0) {
	case 0x0: return [(_pfxLength + 6),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+3] & 0x7))], (((b[i+4])<<24)>>24)))))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, ($1 = (((b[i+5])<<24)>>24)))), u32(And(R_[32][(((b[i+2] & 0x38)>>>3))], (($59 = ((($58 = ((($57 = (1 << $1)&~0), ($57 < 0 ? $57+0x100000000 : $57)) + -1)&~0), ($58 < 0 ? $58+0x100000000 : $58)) << (((((-$1<<24)>>24) + 32)<<24)>>24))&~0), ($59 < 0 ? $59+0x100000000 : $59))))))];
	}
if(((b[i+0]|(b[i+1]<<8)|(b[i+2]<<16)|((b[i+3] & 0x7)<<24)) & 0x7c7ffff) == 0x544ac0f)
	switch(0) {
	case 0x0: return [(_pfxLength + 6),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (((b[i+4])<<24)>>24))))))))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, ($1 = (((b[i+5])<<24)>>24)))), u32(And(R_[32][(((b[i+2] & 0x38)>>>3))], (($62 = ((($61 = ((($60 = (1 << $1)&~0), ($60 < 0 ? $60+0x100000000 : $60)) + -1)&~0), ($61 < 0 ? $61+0x100000000 : $61)) << (((((-$1<<24)>>24) + 32)<<24)>>24))&~0), ($62 < 0 ? $62+0x100000000 : $62))))))];
	}
if(((b[i+0]|(b[i+1]<<8)|(b[i+2]<<16)) & 0xc7ffff) == 0x44ac0f)
	switch(0) {
	case 0x0: return [(_pfxLength + 6),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+3] & 0x7))], u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))))), (((b[i+4])<<24)>>24)))))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, ($1 = (((b[i+5])<<24)>>24)))), u32(And(R_[32][(((b[i+2] & 0x38)>>>3))], (($56 = ((($55 = ((($54 = (1 << $1)&~0), ($54 < 0 ? $54+0x100000000 : $54)) + -1)&~0), ($55 < 0 ? $55+0x100000000 : $55)) << (((((-$1<<24)>>24) + 32)<<24)>>24))&~0), ($56 < 0 ? $56+0x100000000 : $56))))))];
	}
if(((((b[i+1] & 0x40)>>>6)) & 0x1) == 0x0)
	switch((b[i+0]|(b[i+1]<<8)) & 0xbfff) {
	case 0x58f: return [(_pfxLength + 6),Mov(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)))), uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][4]))),Mov(R_[32][4], Add(R_[32][4], ((_pfxSizeSpecifier ? 16 : 32) >>> 3)))];
	case 0x5d0: return [(_pfxLength + 6),Mov(($0 = u8(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))), u8(Or(u8(LSL($0, 1)), u8(LSR($0, 7)))))];
	case 0x5d1: return [(_pfxLength + 6),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, 1)), uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, ((_pfxSizeSpecifier ? 16 : 32) + -1)))))];
	case 0x5d2: return [(_pfxLength + 6),Mov(($0 = u8(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))), u8(Or(u8(LSL($0, R_[8][1])), u8(LSR($0, i8(Add(i8(Neg(R_[8][1])), 8)))))))];
	case 0x5d3: return [(_pfxLength + 6),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, R_[8][1])), uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, Add((_pfxSizeSpecifier ? 16 : 32), i8(Neg(R_[8][1])))))))];
	case 0xdd0: return [(_pfxLength + 6),Mov(($0 = u8(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))), u8(Or(u8(LSR($0, 1)), u8(LSL($0, 7)))))];
	case 0xdd1: return [(_pfxLength + 6),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, 1)), uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, ((_pfxSizeSpecifier ? 16 : 32) + -1)))))];
	case 0xdd2: return [(_pfxLength + 6),Mov(($0 = u8(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))), u8(Or(u8(LSR($0, R_[8][1])), u8(LSL($0, i8(Add(i8(Neg(R_[8][1])), 8)))))))];
	case 0xdd3: return [(_pfxLength + 6),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, R_[8][1])), uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, Add((_pfxSizeSpecifier ? 16 : 32), i8(Neg(R_[8][1])))))))];
	case 0x25d0: return [(_pfxLength + 6),Mov(($0 = u8(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))), u8(LSL($0, 1)))];
	case 0x25d1: return [(_pfxLength + 6),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, 1)))];
	case 0x25d2: return [(_pfxLength + 6),Mov(($0 = u8(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))), u8(LSL($0, R_[8][1])))];
	case 0x25d3: return [(_pfxLength + 6),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, R_[8][1])))];
	case 0x2dd0: return [(_pfxLength + 6),Mov(($0 = u8(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))), u8(LSR($0, 1)))];
	case 0x2dd1: return [(_pfxLength + 6),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, 1)))];
	case 0x2dd2: return [(_pfxLength + 6),Mov(($0 = u8(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))), u8(LSR($0, R_[8][1])))];
	case 0x2dd3: return [(_pfxLength + 6),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, R_[8][1])))];
	case 0x3dd0: return [(_pfxLength + 6),Mov(($0 = u8(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))), u8(ASR($0, 1)))];
	case 0x3dd1: return [(_pfxLength + 6),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))), uint[(_pfxSizeSpecifier ? 16 : 32)](ASR($0, 1)))];
	case 0x3dd2: return [(_pfxLength + 6),Mov(($0 = u8(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))), u8(ASR($0, R_[8][1])))];
	case 0x3dd3: return [(_pfxLength + 6),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))), uint[(_pfxSizeSpecifier ? 16 : 32)](ASR($0, R_[8][1])))];
	case 0x15f6: return [(_pfxLength + 6),Mov(($0 = u8(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))), u8(Not($0)))];
	case 0x15f7: return [(_pfxLength + 6),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))), uint[(_pfxSizeSpecifier ? 16 : 32)](Not($0)))];
	case 0x1df6: return [(_pfxLength + 6),Mov(F[1], u1(Not(Eq(($0 = u8(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))), 0)))),Mov($0, i8(Neg($0)))];
	case 0x1df7: return [(_pfxLength + 6),Mov(F[1], u1(Not(Eq(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))), 0)))),Mov($0, int[(_pfxSizeSpecifier ? 16 : 32)](Neg($0)))];
	case 0x25f6: return [(_pfxLength + 6),Mov(R_[16][0], u8(Mul(R_[8][0], u8(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)))))))];
	case 0x25f7: return [(_pfxLength + 6),Mov(R_[32][0], Mul(R_[32][0], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))];
	case 0x2df6: return [(_pfxLength + 6),Mov(R_[16][0], u8(Mul(R_[8][0], u8(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)))))))];
	case 0x2df7: return [(_pfxLength + 6),Mov(R_[32][0], Mul(R_[32][0], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))];
	case 0x35f6: return [(_pfxLength + 6),Mov(R_[16][0], u8(Div(R_[8][0], u8(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)))))))];
	case 0x35f7: return [(_pfxLength + 6),Mov(R_[32][0], Div(R_[32][0], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))];
	case 0x3df6: return [(_pfxLength + 6),Mov(R_[16][0], u8(Div(R_[8][0], u8(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)))))))];
	case 0x3df7: return [(_pfxLength + 6),Mov(R_[32][0], Div(R_[32][0], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))];
	case 0x5fe: return [(_pfxLength + 6),Mov(($0 = u8(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))), u8(Add($0, 1)))];
	case 0x5ff: return [(_pfxLength + 6),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))), Add($0, 1))];
	case 0xdfe: return [(_pfxLength + 6),Mov(($0 = u8(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))), u8(Add($0, -1)))];
	case 0xdff: return [(_pfxLength + 6),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))), Add($0, -1))];
	case 0x15ff: return [(_pfxLength + 6),Mov(R_[32][4], u32(Add(R_[32][4], -4))),Mov(u32(Mem(R_[32][4])), u32(Add(R_[32][8], (_pfxLength + 6)))),Mov(R_[32][8], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)))))];
	case 0x25ff: return [(_pfxLength + 6),Mov(R_[32][8], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)))))];
	case 0x35ff: return [(_pfxLength + 6),Mov(R_[32][4], Add(R_[32][4], -($0 = ((_pfxSizeSpecifier ? 16 : 32) >>> 3)))),Mov(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][4])), uint[(_pfxSizeSpecifier ? 16 : 32)](Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)))))];
	case 0x800f: return [(_pfxLength + 6),If(F[0], Mov(R_[32][8], u32(Add(R_[32][8], (($20 = ((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)) + (_pfxLength + 6))&~0), ($20 < 0 ? $20+0x100000000 : $20))))))];
	case 0x810f: return [(_pfxLength + 6),If(u1(Not(F[0])), Mov(R_[32][8], u32(Add(R_[32][8], (($21 = ((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)) + (_pfxLength + 6))&~0), ($21 < 0 ? $21+0x100000000 : $21))))))];
	case 0x820f: return [(_pfxLength + 6),If(F[1], Mov(R_[32][8], u32(Add(R_[32][8], (($22 = ((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)) + (_pfxLength + 6))&~0), ($22 < 0 ? $22+0x100000000 : $22))))))];
	case 0x830f: return [(_pfxLength + 6),If(u1(Not(F[1])), Mov(R_[32][8], u32(Add(R_[32][8], (($23 = ((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)) + (_pfxLength + 6))&~0), ($23 < 0 ? $23+0x100000000 : $23))))))];
	case 0x840f: return [(_pfxLength + 6),If(F[2], Mov(R_[32][8], u32(Add(R_[32][8], (($24 = ((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)) + (_pfxLength + 6))&~0), ($24 < 0 ? $24+0x100000000 : $24))))))];
	case 0x850f: return [(_pfxLength + 6),If(u1(Not(F[2])), Mov(R_[32][8], u32(Add(R_[32][8], (($25 = ((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)) + (_pfxLength + 6))&~0), ($25 < 0 ? $25+0x100000000 : $25))))))];
	case 0x860f: return [(_pfxLength + 6),If(u1(Or(F[1], F[2])), Mov(R_[32][8], u32(Add(R_[32][8], (($26 = ((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)) + (_pfxLength + 6))&~0), ($26 < 0 ? $26+0x100000000 : $26))))))];
	case 0x870f: return [(_pfxLength + 6),If(u1(And(u1(Not(F[1])), u1(Not(F[2])))), Mov(R_[32][8], u32(Add(R_[32][8], (($27 = ((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)) + (_pfxLength + 6))&~0), ($27 < 0 ? $27+0x100000000 : $27))))))];
	case 0x880f: return [(_pfxLength + 6),If(F[3], Mov(R_[32][8], u32(Add(R_[32][8], (($28 = ((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)) + (_pfxLength + 6))&~0), ($28 < 0 ? $28+0x100000000 : $28))))))];
	case 0x890f: return [(_pfxLength + 6),If(u1(Not(F[3])), Mov(R_[32][8], u32(Add(R_[32][8], (($29 = ((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)) + (_pfxLength + 6))&~0), ($29 < 0 ? $29+0x100000000 : $29))))))];
	case 0x8a0f: return [(_pfxLength + 6),If(F[4], Mov(R_[32][8], u32(Add(R_[32][8], (($30 = ((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)) + (_pfxLength + 6))&~0), ($30 < 0 ? $30+0x100000000 : $30))))))];
	case 0x8b0f: return [(_pfxLength + 6),If(u1(Not(F[4])), Mov(R_[32][8], u32(Add(R_[32][8], (($31 = ((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)) + (_pfxLength + 6))&~0), ($31 < 0 ? $31+0x100000000 : $31))))))];
	case 0x8c0f: return [(_pfxLength + 6),If(u1(Not(Eq(F[0], F[3]))), Mov(R_[32][8], u32(Add(R_[32][8], (($32 = ((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)) + (_pfxLength + 6))&~0), ($32 < 0 ? $32+0x100000000 : $32))))))];
	case 0x8d0f: return [(_pfxLength + 6),If(Eq(F[0], F[3]), Mov(R_[32][8], u32(Add(R_[32][8], (($33 = ((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)) + (_pfxLength + 6))&~0), ($33 < 0 ? $33+0x100000000 : $33))))))];
	case 0x8e0f: return [(_pfxLength + 6),If(u1(Or(F[2], u1(Not(Eq(F[0], F[3]))))), Mov(R_[32][8], u32(Add(R_[32][8], (($34 = ((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)) + (_pfxLength + 6))&~0), ($34 < 0 ? $34+0x100000000 : $34))))))];
	case 0x8f0f: return [(_pfxLength + 6),If(u1(And(u1(Not(F[2])), Eq(F[0], F[3]))), Mov(R_[32][8], u32(Add(R_[32][8], (($35 = ((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)) + (_pfxLength + 6))&~0), ($35 < 0 ? $35+0x100000000 : $35))))))];
	}
if(((((b[i+0] & 0x80)>>>7)) & 0x1) == 0x1)
	switch((b[i+0]|(b[i+1]<<8)) & 0xf87f) {
	case 0x1: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 6),Mov(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+1] & 0x7))]))), Add($1, int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)))))];
	case 0xc001: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 6),Mov(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))], Add(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))], int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)))))];
	case 0x801: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 6),Mov(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+1] & 0x7))]))), Or($1, uint[(_pfxSizeSpecifier ? 16 : 32)](int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))];
	case 0xc801: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 6),Mov(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))], Or(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))], uint[(_pfxSizeSpecifier ? 16 : 32)](int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))];
	case 0x1001: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 6),Mov(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+1] & 0x7))]))), Add($1, Add(int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), uint[(_pfxSizeSpecifier ? 16 : 32)](F[1]))))];
	case 0xd001: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 6),Mov(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))], Add(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))], Add(int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), uint[(_pfxSizeSpecifier ? 16 : 32)](F[1]))))];
	case 0x1801: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 6),Mov(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+1] & 0x7))]))), Add(($2 = Add($1, int[(_pfxSizeSpecifier ? 16 : 32)](-($3 = int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))), int[(_pfxSizeSpecifier ? 16 : 32)](Neg(($4 = uint[(_pfxSizeSpecifier ? 16 : 32)](F[1]))))))];
	case 0xd801: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 6),Mov(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))], Add(($1 = Add(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))], int[(_pfxSizeSpecifier ? 16 : 32)](-($2 = int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))), int[(_pfxSizeSpecifier ? 16 : 32)](Neg(($3 = uint[(_pfxSizeSpecifier ? 16 : 32)](F[1]))))))];
	case 0x2001: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 6),Mov(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+1] & 0x7))]))), And($1, uint[(_pfxSizeSpecifier ? 16 : 32)](int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))];
	case 0xe001: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 6),Mov(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))], And(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))], uint[(_pfxSizeSpecifier ? 16 : 32)](int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))];
	case 0x2801: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 6),Mov(F[2], Eq(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+1] & 0x7))]))), ($2 = int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)))))),Mov(F[1], Lt($1, $2)),Mov($1, Add($1, int[(_pfxSizeSpecifier ? 16 : 32)](-$2)))];
	case 0xe801: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 6),Mov(F[2], Eq(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))], ($1 = int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)))))),Mov(F[1], Lt(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))], $1)),Mov(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))], Add(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))], int[(_pfxSizeSpecifier ? 16 : 32)](-$1)))];
	case 0x3001: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 6),Mov(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+1] & 0x7))]))), Xor($1, int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)))))];
	case 0xf001: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 6),Mov(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))], Xor(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))], int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)))))];
	case 0x3801: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 6),Mov(F[2], Eq(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+1] & 0x7))]))), ($2 = int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)))))),Mov(F[1], Lt($1, $2))];
	case 0xf801: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 6),Mov(F[2], Eq(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))], ($1 = int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)))))),Mov(F[1], Lt(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))], $1))];
	case 0x800f: return [(_pfxLength + 6),Mov(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)))))), uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][4]))),Mov(R_[32][4], Add(R_[32][4], ((_pfxSizeSpecifier ? 16 : 32) >>> 3)))];
	case 0x47: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 6),Mov(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+1] & 0x7))])), int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))];
	case 0xc047: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 6),Mov(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))], int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))];
	case 0x8050: return [(_pfxLength + 6),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))), u8(Or(u8(LSL($0, 1)), u8(LSR($0, 7)))))];
	case 0x8051: return [(_pfxLength + 6),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, 1)), uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, ((_pfxSizeSpecifier ? 16 : 32) + -1)))))];
	case 0x8052: return [(_pfxLength + 6),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))), u8(Or(u8(LSL($0, R_[8][1])), u8(LSR($0, i8(Add(i8(Neg(R_[8][1])), 8)))))))];
	case 0x8053: return [(_pfxLength + 6),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, R_[8][1])), uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, Add((_pfxSizeSpecifier ? 16 : 32), i8(Neg(R_[8][1])))))))];
	case 0x8850: return [(_pfxLength + 6),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))), u8(Or(u8(LSR($0, 1)), u8(LSL($0, 7)))))];
	case 0x8851: return [(_pfxLength + 6),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, 1)), uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, ((_pfxSizeSpecifier ? 16 : 32) + -1)))))];
	case 0x8852: return [(_pfxLength + 6),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))), u8(Or(u8(LSR($0, R_[8][1])), u8(LSL($0, i8(Add(i8(Neg(R_[8][1])), 8)))))))];
	case 0x8853: return [(_pfxLength + 6),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, R_[8][1])), uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, Add((_pfxSizeSpecifier ? 16 : 32), i8(Neg(R_[8][1])))))))];
	case 0xa050: return [(_pfxLength + 6),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))), u8(LSL($0, 1)))];
	case 0xa051: return [(_pfxLength + 6),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, 1)))];
	case 0xa052: return [(_pfxLength + 6),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))), u8(LSL($0, R_[8][1])))];
	case 0xa053: return [(_pfxLength + 6),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, R_[8][1])))];
	case 0xa850: return [(_pfxLength + 6),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))), u8(LSR($0, 1)))];
	case 0xa851: return [(_pfxLength + 6),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, 1)))];
	case 0xa852: return [(_pfxLength + 6),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))), u8(LSR($0, R_[8][1])))];
	case 0xa853: return [(_pfxLength + 6),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, R_[8][1])))];
	case 0xb850: return [(_pfxLength + 6),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))), u8(ASR($0, 1)))];
	case 0xb851: return [(_pfxLength + 6),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))), uint[(_pfxSizeSpecifier ? 16 : 32)](ASR($0, 1)))];
	case 0xb852: return [(_pfxLength + 6),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))), u8(ASR($0, R_[8][1])))];
	case 0xb853: return [(_pfxLength + 6),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))), uint[(_pfxSizeSpecifier ? 16 : 32)](ASR($0, R_[8][1])))];
	case 0x77: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 6),Mov(F[2], Eq(And(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+1] & 0x7))])), int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)))), 0)),Mov(F[1], 0),Mov(F[0], 0)];
	case 0xc077: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 6),Mov(F[2], Eq(And(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))], int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)))), 0)),Mov(F[1], 0),Mov(F[0], 0)];
	case 0x9076: return [(_pfxLength + 6),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))), u8(Not($0)))];
	case 0x9077: return [(_pfxLength + 6),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))), uint[(_pfxSizeSpecifier ? 16 : 32)](Not($0)))];
	case 0x9876: return [(_pfxLength + 6),Mov(F[1], u1(Not(Eq(($0 = u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))), 0)))),Mov($0, i8(Neg($0)))];
	case 0x9877: return [(_pfxLength + 6),Mov(F[1], u1(Not(Eq(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))), 0)))),Mov($0, int[(_pfxSizeSpecifier ? 16 : 32)](Neg($0)))];
	case 0xa076: return [(_pfxLength + 6),Mov(R_[16][0], u8(Mul(R_[8][0], u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)))))))))];
	case 0xa077: return [(_pfxLength + 6),Mov(R_[32][0], Mul(R_[32][0], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))))];
	case 0xa876: return [(_pfxLength + 6),Mov(R_[16][0], u8(Mul(R_[8][0], u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)))))))))];
	case 0xa877: return [(_pfxLength + 6),Mov(R_[32][0], Mul(R_[32][0], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))))];
	case 0xb076: return [(_pfxLength + 6),Mov(R_[16][0], u8(Div(R_[8][0], u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)))))))))];
	case 0xb077: return [(_pfxLength + 6),Mov(R_[32][0], Div(R_[32][0], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))))];
	case 0xb876: return [(_pfxLength + 6),Mov(R_[16][0], u8(Div(R_[8][0], u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)))))))))];
	case 0xb877: return [(_pfxLength + 6),Mov(R_[32][0], Div(R_[32][0], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))))];
	case 0x807e: return [(_pfxLength + 6),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))), u8(Add($0, 1)))];
	case 0x807f: return [(_pfxLength + 6),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))), Add($0, 1))];
	case 0x887e: return [(_pfxLength + 6),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))), u8(Add($0, -1)))];
	case 0x887f: return [(_pfxLength + 6),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))), Add($0, -1))];
	case 0x907f: return [(_pfxLength + 6),Mov(R_[32][4], u32(Add(R_[32][4], -4))),Mov(u32(Mem(R_[32][4])), u32(Add(R_[32][8], (_pfxLength + 6)))),Mov(R_[32][8], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)))))))];
	case 0xa07f: return [(_pfxLength + 6),Mov(R_[32][8], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)))))))];
	case 0xb07f: return [(_pfxLength + 6),Mov(R_[32][4], Add(R_[32][4], -($0 = ((_pfxSizeSpecifier ? 16 : 32) >>> 3)))),Mov(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][4])), uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)))))))];
	}

	switch((b[i+0]|(b[i+1]<<8)) & 0xc0ff) {
	case 0x8000: return [(_pfxLength + 6),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))), u8(Add($0, R_[8][(((b[i+1] & 0x38)>>>3))])))];
	case 0x8001: return [(_pfxLength + 6),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))), Add($0, R_[32][(((b[i+1] & 0x38)>>>3))]))];
	case 0x8002: return [(_pfxLength + 6),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Add(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)))))))))];
	case 0x8003: return [(_pfxLength + 6),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Add(R_[32][(((b[i+1] & 0x38)>>>3))], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))))];
	case 0x8008: return [(_pfxLength + 6),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))), u8(Or($0, R_[8][(((b[i+1] & 0x38)>>>3))])))];
	case 0x8009: return [(_pfxLength + 6),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))), Or($0, R_[32][(((b[i+1] & 0x38)>>>3))]))];
	case 0x800a: return [(_pfxLength + 6),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Or(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)))))))))];
	case 0x800b: return [(_pfxLength + 6),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Or(R_[32][(((b[i+1] & 0x38)>>>3))], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))))];
	case 0x8010: return [(_pfxLength + 6),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))), u8(Add($0, u8(Add(R_[8][(((b[i+1] & 0x38)>>>3))], u8(F[1]))))))];
	case 0x8011: return [(_pfxLength + 6),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))), Add($0, Add(R_[32][(((b[i+1] & 0x38)>>>3))], uint[(_pfxSizeSpecifier ? 16 : 32)](F[1]))))];
	case 0x8012: return [(_pfxLength + 6),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Add(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Add(u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)))))), u8(F[1]))))))];
	case 0x8013: return [(_pfxLength + 6),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Add(R_[32][(((b[i+1] & 0x38)>>>3))], Add(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)))))), u32(F[1]))))];
	case 0x8018: return [(_pfxLength + 6),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))), u8(Add(($1 = u8(Add($0, i8(Neg(R_[8][(((b[i+1] & 0x38)>>>3))]))))), i8(Neg(($2 = u8(F[1])))))))];
	case 0x8019: return [(_pfxLength + 6),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))), Add(($1 = Add($0, i32(Neg(R_[32][(((b[i+1] & 0x38)>>>3))])))), int[(_pfxSizeSpecifier ? 16 : 32)](Neg(($2 = uint[(_pfxSizeSpecifier ? 16 : 32)](F[1]))))))];
	case 0x801a: return [(_pfxLength + 6),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Add(($0 = u8(Add(R_[8][(((b[i+1] & 0x38)>>>3))], i8(Neg(($1 = u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)))))))))))), i8(Neg(($2 = u8(F[1])))))))];
	case 0x801b: return [(_pfxLength + 6),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Add(($0 = Add(R_[32][(((b[i+1] & 0x38)>>>3))], int[(_pfxSizeSpecifier ? 16 : 32)](Neg(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))))))), i32(Neg(($2 = u32(F[1]))))))];
	case 0x8020: return [(_pfxLength + 6),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))), u8(And($0, R_[8][(((b[i+1] & 0x38)>>>3))])))];
	case 0x8021: return [(_pfxLength + 6),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))), And($0, R_[32][(((b[i+1] & 0x38)>>>3))]))];
	case 0x8022: return [(_pfxLength + 6),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(And(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)))))))))];
	case 0x8023: return [(_pfxLength + 6),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], And(R_[32][(((b[i+1] & 0x38)>>>3))], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))))];
	case 0x8028: return [(_pfxLength + 6),Mov(F[2], Eq(($0 = u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))), R_[8][(((b[i+1] & 0x38)>>>3))])),Mov(F[1], Lt($0, R_[8][(((b[i+1] & 0x38)>>>3))])),Mov($0, u8(Add($0, i8(Neg(R_[8][(((b[i+1] & 0x38)>>>3))])))))];
	case 0x8029: return [(_pfxLength + 6),Mov(F[2], Eq(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))), R_[32][(((b[i+1] & 0x38)>>>3))])),Mov(F[1], Lt($0, R_[32][(((b[i+1] & 0x38)>>>3))])),Mov($0, Add($0, i32(Neg(R_[32][(((b[i+1] & 0x38)>>>3))]))))];
	case 0x802a: return [(_pfxLength + 6),Mov(F[2], Eq(R_[8][(((b[i+1] & 0x38)>>>3))], ($0 = u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))))),Mov(F[1], Lt(R_[8][(((b[i+1] & 0x38)>>>3))], $0)),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Add(R_[8][(((b[i+1] & 0x38)>>>3))], i8(Neg($0)))))];
	case 0x802b: return [(_pfxLength + 6),Mov(F[2], Eq(R_[32][(((b[i+1] & 0x38)>>>3))], ($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))))),Mov(F[1], Lt(R_[32][(((b[i+1] & 0x38)>>>3))], $0)),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Add(R_[32][(((b[i+1] & 0x38)>>>3))], int[(_pfxSizeSpecifier ? 16 : 32)](Neg($0))))];
	case 0x8030: return [(_pfxLength + 6),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))), u8(Xor($0, R_[8][(((b[i+1] & 0x38)>>>3))])))];
	case 0x8031: return [(_pfxLength + 6),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))), Xor($0, R_[32][(((b[i+1] & 0x38)>>>3))]))];
	case 0x8032: return [(_pfxLength + 6),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Xor(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)))))))))];
	case 0x8033: return [(_pfxLength + 6),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Xor(R_[32][(((b[i+1] & 0x38)>>>3))], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))))];
	case 0x8038: return [(_pfxLength + 6),Mov(F[2], Eq(($0 = u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))), R_[8][(((b[i+1] & 0x38)>>>3))])),Mov(F[1], Lt($0, R_[8][(((b[i+1] & 0x38)>>>3))]))];
	case 0x8039: return [(_pfxLength + 6),Mov(F[2], Eq(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))), R_[32][(((b[i+1] & 0x38)>>>3))])),Mov(F[1], Lt($0, R_[32][(((b[i+1] & 0x38)>>>3))]))];
	case 0x803a: return [(_pfxLength + 6),Mov(F[2], Eq(R_[8][(((b[i+1] & 0x38)>>>3))], ($0 = u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))))),Mov(F[1], Lt(R_[8][(((b[i+1] & 0x38)>>>3))], $0))];
	case 0x803b: return [(_pfxLength + 6),Mov(F[2], Eq(R_[32][(((b[i+1] & 0x38)>>>3))], ($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))))),Mov(F[1], Lt(R_[32][(((b[i+1] & 0x38)>>>3))], $0))];
	case 0x69: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 6),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Mul(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+1] & 0x7))])), int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)))))];
	case 0xc069: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 6),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Mul(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))], int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)))))];
	case 0x8084: return [(_pfxLength + 6),Mov(F[2], Eq(And(u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)))))), R_[8][(((b[i+1] & 0x38)>>>3))]), 0)),Mov(F[1], 0),Mov(F[0], 0)];
	case 0x8085: return [(_pfxLength + 6),Mov(F[2], Eq(And(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)))))), R_[32][(((b[i+1] & 0x38)>>>3))]), 0)),Mov(F[1], 0),Mov(F[0], 0)];
	case 0x8086: return [(_pfxLength + 6),Swap(u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)))))), R_[8][(((b[i+1] & 0x38)>>>3))])];
	case 0x8087: return [(_pfxLength + 6),Swap(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)))))), R_[32][(((b[i+1] & 0x38)>>>3))])];
	case 0x8088: return [(_pfxLength + 6),Mov(u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)))))), R_[8][(((b[i+1] & 0x38)>>>3))])];
	case 0x8089: return [(_pfxLength + 6),Mov(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)))))), R_[32][(((b[i+1] & 0x38)>>>3))])];
	case 0x808a: return [(_pfxLength + 6),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)))))))];
	case 0x808b: return [(_pfxLength + 6),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)))))))];
	case 0x808c: return [(_pfxLength + 6),Mov(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)))))), R_.S[(((b[i+1] & 0x38)>>>3))])];
	case 0x808d: return [(_pfxLength + 6),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], ($0 = u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))))];
	case 0x808e: return [(_pfxLength + 6),Mov(R_.S[(((b[i+1] & 0x38)>>>3))], u16(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)))))))];
	}
if(((b[i+0]|(b[i+1]<<8)|((b[i+2] & 0x3f)<<16)) & 0x3fc7ff) == 0x25446b)
	switch(0) {
	case 0x0: return [(_pfxLength + 5),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Mul(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24))))), ((((b[i+4])<<24)>>24)&~0)))];
	}
if(((b[i+0]|(b[i+1]<<8)|((b[i+2] & 0x3f)<<16)) & 0x38c7ff) == 0x20446b)
	switch(0) {
	case 0x0: return [(_pfxLength + 5),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Mul(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24))))), ((((b[i+4])<<24)>>24)&~0)))];
	}
if(((b[i+0]|(b[i+1]<<8)|((b[i+2] & 0x7)<<16)) & 0x7c7ff) == 0x5446b)
	switch(0) {
	case 0x0: return [(_pfxLength + 5),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Mul(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24)))))))), ((((b[i+4])<<24)>>24)&~0)))];
	}
if(((b[i+0]|(b[i+1]<<8)) & 0xc7ff) == 0x446b)
	switch(0) {
	case 0x0: return [(_pfxLength + 5),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Mul(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24))))), ((((b[i+4])<<24)>>24)&~0)))];
	}
if(((((b[i+0] & 0xf8)>>>3)|(b[i+1]<<5)|((b[i+2] & 0x3f)<<13)) & 0x718f1) == 0x40890)
	switch((b[i+0]|((b[i+1] & 0x3f)<<8)) & 0x3877) {
	case 0x0: return [(_pfxLength + 5),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24)))))), u8(Add($0, (((b[i+4])<<24)>>24))))];
	case 0x2: return [(_pfxLength + 5),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24)))))), u8(Add($0, (((b[i+4])<<24)>>24))))];
	case 0x3: return [(_pfxLength + 5),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24)))))), Add($0, (((b[i+4])<<24)>>24)))];
	case 0x800: return [(_pfxLength + 5),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24)))))), u8(Or($0, ((((b[i+4])<<24)>>24)&0xff))))];
	case 0x802: return [(_pfxLength + 5),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24)))))), u8(Or($0, ((((b[i+4])<<24)>>24)&0xff))))];
	case 0x803: return [(_pfxLength + 5),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24)))))), Or($0, uint[(_pfxSizeSpecifier ? 16 : 32)]((((b[i+4])<<24)>>24))))];
	case 0x1000: return [(_pfxLength + 5),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24)))))), u8(Add($0, u8(Add((((b[i+4])<<24)>>24), u8(F[1]))))))];
	case 0x1002: return [(_pfxLength + 5),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24)))))), u8(Add($0, u8(Add((((b[i+4])<<24)>>24), u8(F[1]))))))];
	case 0x1003: return [(_pfxLength + 5),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24)))))), Add($0, Add((((b[i+4])<<24)>>24), uint[(_pfxSizeSpecifier ? 16 : 32)](F[1]))))];
	case 0x1800: return [(_pfxLength + 5),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24)))))), u8(Add(($1 = u8(Add($0, ((-($2 = (((b[i+4])<<24)>>24))<<24)>>24)))), i8(Neg(($3 = u8(F[1])))))))];
	case 0x1802: return [(_pfxLength + 5),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24)))))), u8(Add(($1 = u8(Add($0, ((-($2 = (((b[i+4])<<24)>>24))<<24)>>24)))), i8(Neg(($3 = u8(F[1])))))))];
	case 0x1803: return [(_pfxLength + 5),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24)))))), Add(($1 = Add($0, ((-($2 = (((b[i+4])<<24)>>24))<<24)>>24))), int[(_pfxSizeSpecifier ? 16 : 32)](Neg(($3 = uint[(_pfxSizeSpecifier ? 16 : 32)](F[1]))))))];
	case 0x2000: return [(_pfxLength + 5),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24)))))), u8(And($0, ((((b[i+4])<<24)>>24)&0xff))))];
	case 0x2002: return [(_pfxLength + 5),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24)))))), u8(And($0, ((((b[i+4])<<24)>>24)&0xff))))];
	case 0x2003: return [(_pfxLength + 5),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24)))))), And($0, uint[(_pfxSizeSpecifier ? 16 : 32)]((((b[i+4])<<24)>>24))))];
	case 0x2800: return [(_pfxLength + 5),Mov(F[2], Eq(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24)))))), ($1 = (((b[i+4])<<24)>>24)))),Mov(F[1], Lt($0, $1)),Mov($0, u8(Add($0, ((-$1<<24)>>24))))];
	case 0x2802: return [(_pfxLength + 5),Mov(F[2], Eq(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24)))))), ($1 = (((b[i+4])<<24)>>24)))),Mov(F[1], Lt($0, $1)),Mov($0, u8(Add($0, ((-$1<<24)>>24))))];
	case 0x2803: return [(_pfxLength + 5),Mov(F[2], Eq(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24)))))), ($1 = (((b[i+4])<<24)>>24)))),Mov(F[1], Lt($0, $1)),Mov($0, Add($0, ((-$1<<24)>>24)))];
	case 0x3000: return [(_pfxLength + 5),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24)))))), u8(Xor($0, (((b[i+4])<<24)>>24))))];
	case 0x3002: return [(_pfxLength + 5),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24)))))), u8(Xor($0, (((b[i+4])<<24)>>24))))];
	case 0x3003: return [(_pfxLength + 5),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24)))))), Xor($0, (((b[i+4])<<24)>>24)))];
	case 0x3800: return [(_pfxLength + 5),Mov(F[2], Eq(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24)))))), ($1 = (((b[i+4])<<24)>>24)))),Mov(F[1], Lt($0, $1))];
	case 0x3802: return [(_pfxLength + 5),Mov(F[2], Eq(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24)))))), ($1 = (((b[i+4])<<24)>>24)))),Mov(F[1], Lt($0, $1))];
	case 0x3803: return [(_pfxLength + 5),Mov(F[2], Eq(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24)))))), ($1 = (((b[i+4])<<24)>>24)))),Mov(F[1], Lt($0, $1))];
	case 0x46: return [(_pfxLength + 5),Mov(u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24))))), (((b[i+4])<<24)>>24))];
	case 0x40: return [(_pfxLength + 5),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24)))))), u8(Or(u8(LSL($0, ($1 = (((b[i+4])<<24)>>24)))), u8(LSR($0, (((((-$1<<24)>>24) + 8)<<24)>>24))))))];
	case 0x41: return [(_pfxLength + 5),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24)))))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, ($1 = (((b[i+4])<<24)>>24)))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, ((_pfxSizeSpecifier ? 16 : 32) + ((-$1<<24)>>24))))))];
	case 0x840: return [(_pfxLength + 5),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24)))))), u8(Or(u8(LSR($0, ($1 = (((b[i+4])<<24)>>24)))), u8(LSL($0, (((((-$1<<24)>>24) + 8)<<24)>>24))))))];
	case 0x841: return [(_pfxLength + 5),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24)))))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, ($1 = (((b[i+4])<<24)>>24)))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, ((_pfxSizeSpecifier ? 16 : 32) + ((-$1<<24)>>24))))))];
	case 0x2040: return [(_pfxLength + 5),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24)))))), u8(LSL($0, (((b[i+4])<<24)>>24))))];
	case 0x2041: return [(_pfxLength + 5),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24)))))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, (((b[i+4])<<24)>>24))))];
	case 0x2840: return [(_pfxLength + 5),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24)))))), u8(LSR($0, (((b[i+4])<<24)>>24))))];
	case 0x2841: return [(_pfxLength + 5),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24)))))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, (((b[i+4])<<24)>>24))))];
	case 0x3840: return [(_pfxLength + 5),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24)))))), u8(ASR($0, (((b[i+4])<<24)>>24))))];
	case 0x3841: return [(_pfxLength + 5),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24)))))), uint[(_pfxSizeSpecifier ? 16 : 32)](ASR($0, (((b[i+4])<<24)>>24))))];
	case 0x76: return [(_pfxLength + 5),Mov(F[2], Eq(And(u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24))))), (((b[i+4])<<24)>>24)), 0)),Mov(F[1], 0),Mov(F[0], 0)];
	}
if(((((b[i+0] & 0xf8)>>>3)|(b[i+1]<<5)) & 0x18f1) == 0x890)
	switch((b[i+0]|((b[i+1] & 0x3f)<<8)) & 0x3877) {
	case 0x0: return [(_pfxLength + 5),Mov(($0 = u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24)))))), u8(Add($0, (((b[i+4])<<24)>>24))))];
	case 0x2: return [(_pfxLength + 5),Mov(($0 = u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24)))))), u8(Add($0, (((b[i+4])<<24)>>24))))];
	case 0x3: return [(_pfxLength + 5),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24)))))), Add($0, (((b[i+4])<<24)>>24)))];
	case 0x800: return [(_pfxLength + 5),Mov(($0 = u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24)))))), u8(Or($0, ((((b[i+4])<<24)>>24)&0xff))))];
	case 0x802: return [(_pfxLength + 5),Mov(($0 = u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24)))))), u8(Or($0, ((((b[i+4])<<24)>>24)&0xff))))];
	case 0x803: return [(_pfxLength + 5),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24)))))), Or($0, uint[(_pfxSizeSpecifier ? 16 : 32)]((((b[i+4])<<24)>>24))))];
	case 0x1000: return [(_pfxLength + 5),Mov(($0 = u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24)))))), u8(Add($0, u8(Add((((b[i+4])<<24)>>24), u8(F[1]))))))];
	case 0x1002: return [(_pfxLength + 5),Mov(($0 = u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24)))))), u8(Add($0, u8(Add((((b[i+4])<<24)>>24), u8(F[1]))))))];
	case 0x1003: return [(_pfxLength + 5),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24)))))), Add($0, Add((((b[i+4])<<24)>>24), uint[(_pfxSizeSpecifier ? 16 : 32)](F[1]))))];
	case 0x1800: return [(_pfxLength + 5),Mov(($0 = u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24)))))), u8(Add(($1 = u8(Add($0, ((-($2 = (((b[i+4])<<24)>>24))<<24)>>24)))), i8(Neg(($3 = u8(F[1])))))))];
	case 0x1802: return [(_pfxLength + 5),Mov(($0 = u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24)))))), u8(Add(($1 = u8(Add($0, ((-($2 = (((b[i+4])<<24)>>24))<<24)>>24)))), i8(Neg(($3 = u8(F[1])))))))];
	case 0x1803: return [(_pfxLength + 5),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24)))))), Add(($1 = Add($0, ((-($2 = (((b[i+4])<<24)>>24))<<24)>>24))), int[(_pfxSizeSpecifier ? 16 : 32)](Neg(($3 = uint[(_pfxSizeSpecifier ? 16 : 32)](F[1]))))))];
	case 0x2000: return [(_pfxLength + 5),Mov(($0 = u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24)))))), u8(And($0, ((((b[i+4])<<24)>>24)&0xff))))];
	case 0x2002: return [(_pfxLength + 5),Mov(($0 = u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24)))))), u8(And($0, ((((b[i+4])<<24)>>24)&0xff))))];
	case 0x2003: return [(_pfxLength + 5),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24)))))), And($0, uint[(_pfxSizeSpecifier ? 16 : 32)]((((b[i+4])<<24)>>24))))];
	case 0x2800: return [(_pfxLength + 5),Mov(F[2], Eq(($0 = u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24)))))), ($1 = (((b[i+4])<<24)>>24)))),Mov(F[1], Lt($0, $1)),Mov($0, u8(Add($0, ((-$1<<24)>>24))))];
	case 0x2802: return [(_pfxLength + 5),Mov(F[2], Eq(($0 = u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24)))))), ($1 = (((b[i+4])<<24)>>24)))),Mov(F[1], Lt($0, $1)),Mov($0, u8(Add($0, ((-$1<<24)>>24))))];
	case 0x2803: return [(_pfxLength + 5),Mov(F[2], Eq(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24)))))), ($1 = (((b[i+4])<<24)>>24)))),Mov(F[1], Lt($0, $1)),Mov($0, Add($0, ((-$1<<24)>>24)))];
	case 0x3000: return [(_pfxLength + 5),Mov(($0 = u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24)))))), u8(Xor($0, (((b[i+4])<<24)>>24))))];
	case 0x3002: return [(_pfxLength + 5),Mov(($0 = u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24)))))), u8(Xor($0, (((b[i+4])<<24)>>24))))];
	case 0x3003: return [(_pfxLength + 5),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24)))))), Xor($0, (((b[i+4])<<24)>>24)))];
	case 0x3800: return [(_pfxLength + 5),Mov(F[2], Eq(($0 = u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24)))))), ($1 = (((b[i+4])<<24)>>24)))),Mov(F[1], Lt($0, $1))];
	case 0x3802: return [(_pfxLength + 5),Mov(F[2], Eq(($0 = u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24)))))), ($1 = (((b[i+4])<<24)>>24)))),Mov(F[1], Lt($0, $1))];
	case 0x3803: return [(_pfxLength + 5),Mov(F[2], Eq(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24)))))), ($1 = (((b[i+4])<<24)>>24)))),Mov(F[1], Lt($0, $1))];
	case 0x46: return [(_pfxLength + 5),Mov(u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24))))), (((b[i+4])<<24)>>24))];
	case 0x40: return [(_pfxLength + 5),Mov(($0 = u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24)))))), u8(Or(u8(LSL($0, ($1 = (((b[i+4])<<24)>>24)))), u8(LSR($0, (((((-$1<<24)>>24) + 8)<<24)>>24))))))];
	case 0x41: return [(_pfxLength + 5),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24)))))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, ($1 = (((b[i+4])<<24)>>24)))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, ((_pfxSizeSpecifier ? 16 : 32) + ((-$1<<24)>>24))))))];
	case 0x840: return [(_pfxLength + 5),Mov(($0 = u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24)))))), u8(Or(u8(LSR($0, ($1 = (((b[i+4])<<24)>>24)))), u8(LSL($0, (((((-$1<<24)>>24) + 8)<<24)>>24))))))];
	case 0x841: return [(_pfxLength + 5),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24)))))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, ($1 = (((b[i+4])<<24)>>24)))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, ((_pfxSizeSpecifier ? 16 : 32) + ((-$1<<24)>>24))))))];
	case 0x2040: return [(_pfxLength + 5),Mov(($0 = u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24)))))), u8(LSL($0, (((b[i+4])<<24)>>24))))];
	case 0x2041: return [(_pfxLength + 5),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24)))))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, (((b[i+4])<<24)>>24))))];
	case 0x2840: return [(_pfxLength + 5),Mov(($0 = u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24)))))), u8(LSR($0, (((b[i+4])<<24)>>24))))];
	case 0x2841: return [(_pfxLength + 5),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24)))))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, (((b[i+4])<<24)>>24))))];
	case 0x3840: return [(_pfxLength + 5),Mov(($0 = u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24)))))), u8(ASR($0, (((b[i+4])<<24)>>24))))];
	case 0x3841: return [(_pfxLength + 5),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24)))))), uint[(_pfxSizeSpecifier ? 16 : 32)](ASR($0, (((b[i+4])<<24)>>24))))];
	case 0x76: return [(_pfxLength + 5),Mov(F[2], Eq(And(u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24))))), (((b[i+4])<<24)>>24)), 0)),Mov(F[1], 0),Mov(F[0], 0)];
	}
if(((b[i+0]|(b[i+1]<<8)|(b[i+2]<<16)|((b[i+3] & 0x3f)<<24)) & 0x3fc7c0ff) == 0x2544800f)
	switch(((b[i+1] & 0x3f)) & 0x3f) {
	case 0x10: return [(_pfxLength + 5),Mov(u8(Mem(u32(Add(R_[32][5], (((b[i+4])<<24)>>24))))), F[0])];
	case 0x11: return [(_pfxLength + 5),Mov(u8(Mem(u32(Add(R_[32][5], (((b[i+4])<<24)>>24))))), u1(Not(F[0])))];
	case 0x12: return [(_pfxLength + 5),Mov(u8(Mem(u32(Add(R_[32][5], (((b[i+4])<<24)>>24))))), F[1])];
	case 0x13: return [(_pfxLength + 5),Mov(u8(Mem(u32(Add(R_[32][5], (((b[i+4])<<24)>>24))))), u1(Not(F[1])))];
	case 0x14: return [(_pfxLength + 5),Mov(u8(Mem(u32(Add(R_[32][5], (((b[i+4])<<24)>>24))))), F[2])];
	case 0x15: return [(_pfxLength + 5),Mov(u8(Mem(u32(Add(R_[32][5], (((b[i+4])<<24)>>24))))), u1(Not(F[2])))];
	case 0x16: return [(_pfxLength + 5),Mov(u8(Mem(u32(Add(R_[32][5], (((b[i+4])<<24)>>24))))), u1(Or(F[1], F[2])))];
	case 0x17: return [(_pfxLength + 5),Mov(u8(Mem(u32(Add(R_[32][5], (((b[i+4])<<24)>>24))))), u1(And(u1(Not(F[1])), u1(Not(F[2])))))];
	case 0x18: return [(_pfxLength + 5),Mov(u8(Mem(u32(Add(R_[32][5], (((b[i+4])<<24)>>24))))), F[3])];
	case 0x19: return [(_pfxLength + 5),Mov(u8(Mem(u32(Add(R_[32][5], (((b[i+4])<<24)>>24))))), u1(Not(F[3])))];
	case 0x1a: return [(_pfxLength + 5),Mov(u8(Mem(u32(Add(R_[32][5], (((b[i+4])<<24)>>24))))), F[4])];
	case 0x1b: return [(_pfxLength + 5),Mov(u8(Mem(u32(Add(R_[32][5], (((b[i+4])<<24)>>24))))), u1(Not(F[4])))];
	case 0x1c: return [(_pfxLength + 5),Mov(u8(Mem(u32(Add(R_[32][5], (((b[i+4])<<24)>>24))))), u1(Not(Eq(F[0], F[3]))))];
	case 0x1d: return [(_pfxLength + 5),Mov(u8(Mem(u32(Add(R_[32][5], (((b[i+4])<<24)>>24))))), Eq(F[0], F[3]))];
	case 0x1e: return [(_pfxLength + 5),Mov(u8(Mem(u32(Add(R_[32][5], (((b[i+4])<<24)>>24))))), u1(Or(F[2], u1(Not(Eq(F[0], F[3]))))))];
	case 0x1f: return [(_pfxLength + 5),Mov(u8(Mem(u32(Add(R_[32][5], (((b[i+4])<<24)>>24))))), u1(And(u1(Not(F[2])), Eq(F[0], F[3]))))];
	case 0x23: return [(_pfxLength + 5),Mov(F[1], u1(Not(Eq(And(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (((b[i+4])<<24)>>24))))), LSL(1, R_[32][(((b[i+2] & 0x38)>>>3))])), 0))))];
	case 0x2b: return [(_pfxLength + 5),Mov(F[1], u1(Not(Eq(And(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (((b[i+4])<<24)>>24)))))), LSL(1, R_[32][(((b[i+2] & 0x38)>>>3))])), 0)))),Mov($0, Or($0, LSL(1, R_[32][(((b[i+2] & 0x38)>>>3))])))];
	case 0x2d: return [(_pfxLength + 5),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (((b[i+4])<<24)>>24)))))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, R_[8][1])), u32(And(R_[32][(((b[i+2] & 0x38)>>>3))], u32(LSL(u32(Add(u32(LSL(1, R_[8][1])), -1)), i8(Add(i8(Neg(R_[8][1])), 32))))))))];
	case 0x2f: return [(_pfxLength + 5),Mov(($0 = i32(R_[32][(((b[i+2] & 0x38)>>>3))])), Mul($0, int[(_pfxSizeSpecifier ? 16 : 32)](uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (((b[i+4])<<24)>>24))))))))];
	case 0x36: return [(_pfxLength + 5),Mov(R_[32][(((b[i+2] & 0x38)>>>3))], u8(Mem(u32(Add(R_[32][5], (((b[i+4])<<24)>>24))))))];
	case 0x37: return [(_pfxLength + 5),Mov(R_[32][(((b[i+2] & 0x38)>>>3))], u16(Mem(u32(Add(R_[32][5], (((b[i+4])<<24)>>24))))))];
	case 0x3e: return [(_pfxLength + 5),Mov(R_[32][(((b[i+2] & 0x38)>>>3))], i32(u8(Mem(u32(Add(R_[32][5], (((b[i+4])<<24)>>24)))))))];
	case 0x3f: return [(_pfxLength + 5),Mov(R_[32][(((b[i+2] & 0x38)>>>3))], i32(u16(Mem(u32(Add(R_[32][5], (((b[i+4])<<24)>>24)))))))];
	}
if(((b[i+0]|(b[i+1]<<8)|(b[i+2]<<16)|((b[i+3] & 0x3f)<<24)) & 0x3887c0ff) == 0x2004800f)
	switch((b[i+1]|((b[i+2] & 0x7f)<<8)) & 0x403f) {
	case 0x4010: return [(_pfxLength + 5),Mov(u8(Mem(u32(Add(R_[32][((b[i+3] & 0x7))], (((b[i+4])<<24)>>24))))), F[0])];
	case 0x4011: return [(_pfxLength + 5),Mov(u8(Mem(u32(Add(R_[32][((b[i+3] & 0x7))], (((b[i+4])<<24)>>24))))), u1(Not(F[0])))];
	case 0x4012: return [(_pfxLength + 5),Mov(u8(Mem(u32(Add(R_[32][((b[i+3] & 0x7))], (((b[i+4])<<24)>>24))))), F[1])];
	case 0x4013: return [(_pfxLength + 5),Mov(u8(Mem(u32(Add(R_[32][((b[i+3] & 0x7))], (((b[i+4])<<24)>>24))))), u1(Not(F[1])))];
	case 0x4014: return [(_pfxLength + 5),Mov(u8(Mem(u32(Add(R_[32][((b[i+3] & 0x7))], (((b[i+4])<<24)>>24))))), F[2])];
	case 0x4015: return [(_pfxLength + 5),Mov(u8(Mem(u32(Add(R_[32][((b[i+3] & 0x7))], (((b[i+4])<<24)>>24))))), u1(Not(F[2])))];
	case 0x4016: return [(_pfxLength + 5),Mov(u8(Mem(u32(Add(R_[32][((b[i+3] & 0x7))], (((b[i+4])<<24)>>24))))), u1(Or(F[1], F[2])))];
	case 0x4017: return [(_pfxLength + 5),Mov(u8(Mem(u32(Add(R_[32][((b[i+3] & 0x7))], (((b[i+4])<<24)>>24))))), u1(And(u1(Not(F[1])), u1(Not(F[2])))))];
	case 0x4018: return [(_pfxLength + 5),Mov(u8(Mem(u32(Add(R_[32][((b[i+3] & 0x7))], (((b[i+4])<<24)>>24))))), F[3])];
	case 0x4019: return [(_pfxLength + 5),Mov(u8(Mem(u32(Add(R_[32][((b[i+3] & 0x7))], (((b[i+4])<<24)>>24))))), u1(Not(F[3])))];
	case 0x401a: return [(_pfxLength + 5),Mov(u8(Mem(u32(Add(R_[32][((b[i+3] & 0x7))], (((b[i+4])<<24)>>24))))), F[4])];
	case 0x401b: return [(_pfxLength + 5),Mov(u8(Mem(u32(Add(R_[32][((b[i+3] & 0x7))], (((b[i+4])<<24)>>24))))), u1(Not(F[4])))];
	case 0x401c: return [(_pfxLength + 5),Mov(u8(Mem(u32(Add(R_[32][((b[i+3] & 0x7))], (((b[i+4])<<24)>>24))))), u1(Not(Eq(F[0], F[3]))))];
	case 0x401d: return [(_pfxLength + 5),Mov(u8(Mem(u32(Add(R_[32][((b[i+3] & 0x7))], (((b[i+4])<<24)>>24))))), Eq(F[0], F[3]))];
	case 0x401e: return [(_pfxLength + 5),Mov(u8(Mem(u32(Add(R_[32][((b[i+3] & 0x7))], (((b[i+4])<<24)>>24))))), u1(Or(F[2], u1(Not(Eq(F[0], F[3]))))))];
	case 0x401f: return [(_pfxLength + 5),Mov(u8(Mem(u32(Add(R_[32][((b[i+3] & 0x7))], (((b[i+4])<<24)>>24))))), u1(And(u1(Not(F[2])), Eq(F[0], F[3]))))];
	case 0x4023: return [(_pfxLength + 5),Mov(F[1], u1(Not(Eq(And(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+3] & 0x7))], (((b[i+4])<<24)>>24))))), LSL(1, R_[32][(((b[i+2] & 0x38)>>>3))])), 0))))];
	case 0x402b: return [(_pfxLength + 5),Mov(F[1], u1(Not(Eq(And(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+3] & 0x7))], (((b[i+4])<<24)>>24)))))), LSL(1, R_[32][(((b[i+2] & 0x38)>>>3))])), 0)))),Mov($0, Or($0, LSL(1, R_[32][(((b[i+2] & 0x38)>>>3))])))];
	case 0x2c: return [(_pfxLength + 5),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+3] & 0x7))]))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, ($1 = (((b[i+4])<<24)>>24)))), u32(And(R_[32][(((b[i+2] & 0x38)>>>3))], (($44 = ((($43 = ((($42 = (1 << $1)&~0), ($42 < 0 ? $42+0x100000000 : $42)) + -1)&~0), ($43 < 0 ? $43+0x100000000 : $43)) << (((((-$1<<24)>>24) + 32)<<24)>>24))&~0), ($44 < 0 ? $44+0x100000000 : $44))))))];
	case 0x402d: return [(_pfxLength + 5),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+3] & 0x7))], (((b[i+4])<<24)>>24)))))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, R_[8][1])), u32(And(R_[32][(((b[i+2] & 0x38)>>>3))], u32(LSL(u32(Add(u32(LSL(1, R_[8][1])), -1)), i8(Add(i8(Neg(R_[8][1])), 32))))))))];
	case 0x402f: return [(_pfxLength + 5),Mov(($0 = i32(R_[32][(((b[i+2] & 0x38)>>>3))])), Mul($0, int[(_pfxSizeSpecifier ? 16 : 32)](uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+3] & 0x7))], (((b[i+4])<<24)>>24))))))))];
	case 0x4036: return [(_pfxLength + 5),Mov(R_[32][(((b[i+2] & 0x38)>>>3))], u8(Mem(u32(Add(R_[32][((b[i+3] & 0x7))], (((b[i+4])<<24)>>24))))))];
	case 0x4037: return [(_pfxLength + 5),Mov(R_[32][(((b[i+2] & 0x38)>>>3))], u16(Mem(u32(Add(R_[32][((b[i+3] & 0x7))], (((b[i+4])<<24)>>24))))))];
	case 0x403e: return [(_pfxLength + 5),Mov(R_[32][(((b[i+2] & 0x38)>>>3))], i32(u8(Mem(u32(Add(R_[32][((b[i+3] & 0x7))], (((b[i+4])<<24)>>24)))))))];
	case 0x403f: return [(_pfxLength + 5),Mov(R_[32][(((b[i+2] & 0x38)>>>3))], i32(u16(Mem(u32(Add(R_[32][((b[i+3] & 0x7))], (((b[i+4])<<24)>>24)))))))];
	}
if(((b[i+0]|(b[i+1]<<8)|(b[i+2]<<16)|((b[i+3] & 0x7)<<24)) & 0x7c7c0ff) == 0x544800f)
	switch(((b[i+1] & 0x3f)) & 0x3f) {
	case 0x10: return [(_pfxLength + 5),Mov(u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (((b[i+4])<<24)>>24)))))))), F[0])];
	case 0x11: return [(_pfxLength + 5),Mov(u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (((b[i+4])<<24)>>24)))))))), u1(Not(F[0])))];
	case 0x12: return [(_pfxLength + 5),Mov(u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (((b[i+4])<<24)>>24)))))))), F[1])];
	case 0x13: return [(_pfxLength + 5),Mov(u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (((b[i+4])<<24)>>24)))))))), u1(Not(F[1])))];
	case 0x14: return [(_pfxLength + 5),Mov(u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (((b[i+4])<<24)>>24)))))))), F[2])];
	case 0x15: return [(_pfxLength + 5),Mov(u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (((b[i+4])<<24)>>24)))))))), u1(Not(F[2])))];
	case 0x16: return [(_pfxLength + 5),Mov(u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (((b[i+4])<<24)>>24)))))))), u1(Or(F[1], F[2])))];
	case 0x17: return [(_pfxLength + 5),Mov(u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (((b[i+4])<<24)>>24)))))))), u1(And(u1(Not(F[1])), u1(Not(F[2])))))];
	case 0x18: return [(_pfxLength + 5),Mov(u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (((b[i+4])<<24)>>24)))))))), F[3])];
	case 0x19: return [(_pfxLength + 5),Mov(u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (((b[i+4])<<24)>>24)))))))), u1(Not(F[3])))];
	case 0x1a: return [(_pfxLength + 5),Mov(u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (((b[i+4])<<24)>>24)))))))), F[4])];
	case 0x1b: return [(_pfxLength + 5),Mov(u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (((b[i+4])<<24)>>24)))))))), u1(Not(F[4])))];
	case 0x1c: return [(_pfxLength + 5),Mov(u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (((b[i+4])<<24)>>24)))))))), u1(Not(Eq(F[0], F[3]))))];
	case 0x1d: return [(_pfxLength + 5),Mov(u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (((b[i+4])<<24)>>24)))))))), Eq(F[0], F[3]))];
	case 0x1e: return [(_pfxLength + 5),Mov(u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (((b[i+4])<<24)>>24)))))))), u1(Or(F[2], u1(Not(Eq(F[0], F[3]))))))];
	case 0x1f: return [(_pfxLength + 5),Mov(u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (((b[i+4])<<24)>>24)))))))), u1(And(u1(Not(F[2])), Eq(F[0], F[3]))))];
	case 0x23: return [(_pfxLength + 5),Mov(F[1], u1(Not(Eq(And(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (((b[i+4])<<24)>>24)))))))), LSL(1, R_[32][(((b[i+2] & 0x38)>>>3))])), 0))))];
	case 0x2b: return [(_pfxLength + 5),Mov(F[1], u1(Not(Eq(And(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (((b[i+4])<<24)>>24))))))))), LSL(1, R_[32][(((b[i+2] & 0x38)>>>3))])), 0)))),Mov($0, Or($0, LSL(1, R_[32][(((b[i+2] & 0x38)>>>3))])))];
	case 0x2d: return [(_pfxLength + 5),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (((b[i+4])<<24)>>24))))))))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, R_[8][1])), u32(And(R_[32][(((b[i+2] & 0x38)>>>3))], u32(LSL(u32(Add(u32(LSL(1, R_[8][1])), -1)), i8(Add(i8(Neg(R_[8][1])), 32))))))))];
	case 0x2f: return [(_pfxLength + 5),Mov(($0 = i32(R_[32][(((b[i+2] & 0x38)>>>3))])), Mul($0, int[(_pfxSizeSpecifier ? 16 : 32)](uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (((b[i+4])<<24)>>24)))))))))))];
	case 0x36: return [(_pfxLength + 5),Mov(R_[32][(((b[i+2] & 0x38)>>>3))], u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (((b[i+4])<<24)>>24)))))))))];
	case 0x37: return [(_pfxLength + 5),Mov(R_[32][(((b[i+2] & 0x38)>>>3))], u16(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (((b[i+4])<<24)>>24)))))))))];
	case 0x3e: return [(_pfxLength + 5),Mov(R_[32][(((b[i+2] & 0x38)>>>3))], i32(u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (((b[i+4])<<24)>>24))))))))))];
	case 0x3f: return [(_pfxLength + 5),Mov(R_[32][(((b[i+2] & 0x38)>>>3))], i32(u16(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (((b[i+4])<<24)>>24))))))))))];
	}
if(((b[i+0]|(b[i+1]<<8)|(b[i+2]<<16)) & 0xc0ffff) == 0x40ac0f)
	switch(0) {
	case 0x0: return [(_pfxLength + 5),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24)))))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, ($1 = (((b[i+4])<<24)>>24)))), u32(And(R_[32][(((b[i+2] & 0x38)>>>3))], (($53 = ((($52 = ((($51 = (1 << $1)&~0), ($51 < 0 ? $51+0x100000000 : $51)) + -1)&~0), ($52 < 0 ? $52+0x100000000 : $52)) << (((((-$1<<24)>>24) + 32)<<24)>>24))&~0), ($53 < 0 ? $53+0x100000000 : $53))))))];
	}
if(((b[i+0]|(b[i+1]<<8)|(b[i+2]<<16)) & 0x87c0ff) == 0x4800f)
	switch((b[i+1]|((b[i+2] & 0x7f)<<8)) & 0x403f) {
	case 0x4010: return [(_pfxLength + 5),Mov(u8(Mem(u32(Add(u32(Add(R_[32][((b[i+3] & 0x7))], u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))))), (((b[i+4])<<24)>>24))))), F[0])];
	case 0x4011: return [(_pfxLength + 5),Mov(u8(Mem(u32(Add(u32(Add(R_[32][((b[i+3] & 0x7))], u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))))), (((b[i+4])<<24)>>24))))), u1(Not(F[0])))];
	case 0x4012: return [(_pfxLength + 5),Mov(u8(Mem(u32(Add(u32(Add(R_[32][((b[i+3] & 0x7))], u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))))), (((b[i+4])<<24)>>24))))), F[1])];
	case 0x4013: return [(_pfxLength + 5),Mov(u8(Mem(u32(Add(u32(Add(R_[32][((b[i+3] & 0x7))], u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))))), (((b[i+4])<<24)>>24))))), u1(Not(F[1])))];
	case 0x4014: return [(_pfxLength + 5),Mov(u8(Mem(u32(Add(u32(Add(R_[32][((b[i+3] & 0x7))], u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))))), (((b[i+4])<<24)>>24))))), F[2])];
	case 0x4015: return [(_pfxLength + 5),Mov(u8(Mem(u32(Add(u32(Add(R_[32][((b[i+3] & 0x7))], u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))))), (((b[i+4])<<24)>>24))))), u1(Not(F[2])))];
	case 0x4016: return [(_pfxLength + 5),Mov(u8(Mem(u32(Add(u32(Add(R_[32][((b[i+3] & 0x7))], u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))))), (((b[i+4])<<24)>>24))))), u1(Or(F[1], F[2])))];
	case 0x4017: return [(_pfxLength + 5),Mov(u8(Mem(u32(Add(u32(Add(R_[32][((b[i+3] & 0x7))], u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))))), (((b[i+4])<<24)>>24))))), u1(And(u1(Not(F[1])), u1(Not(F[2])))))];
	case 0x4018: return [(_pfxLength + 5),Mov(u8(Mem(u32(Add(u32(Add(R_[32][((b[i+3] & 0x7))], u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))))), (((b[i+4])<<24)>>24))))), F[3])];
	case 0x4019: return [(_pfxLength + 5),Mov(u8(Mem(u32(Add(u32(Add(R_[32][((b[i+3] & 0x7))], u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))))), (((b[i+4])<<24)>>24))))), u1(Not(F[3])))];
	case 0x401a: return [(_pfxLength + 5),Mov(u8(Mem(u32(Add(u32(Add(R_[32][((b[i+3] & 0x7))], u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))))), (((b[i+4])<<24)>>24))))), F[4])];
	case 0x401b: return [(_pfxLength + 5),Mov(u8(Mem(u32(Add(u32(Add(R_[32][((b[i+3] & 0x7))], u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))))), (((b[i+4])<<24)>>24))))), u1(Not(F[4])))];
	case 0x401c: return [(_pfxLength + 5),Mov(u8(Mem(u32(Add(u32(Add(R_[32][((b[i+3] & 0x7))], u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))))), (((b[i+4])<<24)>>24))))), u1(Not(Eq(F[0], F[3]))))];
	case 0x401d: return [(_pfxLength + 5),Mov(u8(Mem(u32(Add(u32(Add(R_[32][((b[i+3] & 0x7))], u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))))), (((b[i+4])<<24)>>24))))), Eq(F[0], F[3]))];
	case 0x401e: return [(_pfxLength + 5),Mov(u8(Mem(u32(Add(u32(Add(R_[32][((b[i+3] & 0x7))], u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))))), (((b[i+4])<<24)>>24))))), u1(Or(F[2], u1(Not(Eq(F[0], F[3]))))))];
	case 0x401f: return [(_pfxLength + 5),Mov(u8(Mem(u32(Add(u32(Add(R_[32][((b[i+3] & 0x7))], u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))))), (((b[i+4])<<24)>>24))))), u1(And(u1(Not(F[2])), Eq(F[0], F[3]))))];
	case 0x4023: return [(_pfxLength + 5),Mov(F[1], u1(Not(Eq(And(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+3] & 0x7))], u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))))), (((b[i+4])<<24)>>24))))), LSL(1, R_[32][(((b[i+2] & 0x38)>>>3))])), 0))))];
	case 0x402b: return [(_pfxLength + 5),Mov(F[1], u1(Not(Eq(And(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+3] & 0x7))], u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))))), (((b[i+4])<<24)>>24)))))), LSL(1, R_[32][(((b[i+2] & 0x38)>>>3))])), 0)))),Mov($0, Or($0, LSL(1, R_[32][(((b[i+2] & 0x38)>>>3))])))];
	case 0x2c: return [(_pfxLength + 5),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+3] & 0x7))], u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6))))))))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, ($1 = (((b[i+4])<<24)>>24)))), u32(And(R_[32][(((b[i+2] & 0x38)>>>3))], (($41 = ((($40 = ((($39 = (1 << $1)&~0), ($39 < 0 ? $39+0x100000000 : $39)) + -1)&~0), ($40 < 0 ? $40+0x100000000 : $40)) << (((((-$1<<24)>>24) + 32)<<24)>>24))&~0), ($41 < 0 ? $41+0x100000000 : $41))))))];
	case 0x402d: return [(_pfxLength + 5),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+3] & 0x7))], u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))))), (((b[i+4])<<24)>>24)))))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, R_[8][1])), u32(And(R_[32][(((b[i+2] & 0x38)>>>3))], u32(LSL(u32(Add(u32(LSL(1, R_[8][1])), -1)), i8(Add(i8(Neg(R_[8][1])), 32))))))))];
	case 0x402f: return [(_pfxLength + 5),Mov(($0 = i32(R_[32][(((b[i+2] & 0x38)>>>3))])), Mul($0, int[(_pfxSizeSpecifier ? 16 : 32)](uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+3] & 0x7))], u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))))), (((b[i+4])<<24)>>24))))))))];
	case 0x4036: return [(_pfxLength + 5),Mov(R_[32][(((b[i+2] & 0x38)>>>3))], u8(Mem(u32(Add(u32(Add(R_[32][((b[i+3] & 0x7))], u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))))), (((b[i+4])<<24)>>24))))))];
	case 0x4037: return [(_pfxLength + 5),Mov(R_[32][(((b[i+2] & 0x38)>>>3))], u16(Mem(u32(Add(u32(Add(R_[32][((b[i+3] & 0x7))], u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))))), (((b[i+4])<<24)>>24))))))];
	case 0x403e: return [(_pfxLength + 5),Mov(R_[32][(((b[i+2] & 0x38)>>>3))], i32(u8(Mem(u32(Add(u32(Add(R_[32][((b[i+3] & 0x7))], u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))))), (((b[i+4])<<24)>>24)))))))];
	case 0x403f: return [(_pfxLength + 5),Mov(R_[32][(((b[i+2] & 0x38)>>>3))], i32(u16(Mem(u32(Add(u32(Add(R_[32][((b[i+3] & 0x7))], u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))))), (((b[i+4])<<24)>>24)))))))];
	}
if(((((b[i+0] & 0xf8)>>>3)|(b[i+1]<<5)|((b[i+2] & 0x3f)<<13)) & 0x7f8f1) == 0x4a890)
	switch((b[i+0]|((b[i+1] & 0x3f)<<8)) & 0x3877) {
	case 0x0: return [(_pfxLength + 5),Mov(($0 = u8(Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24)))))), u8(Add($0, (((b[i+4])<<24)>>24))))];
	case 0x2: return [(_pfxLength + 5),Mov(($0 = u8(Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24)))))), u8(Add($0, (((b[i+4])<<24)>>24))))];
	case 0x3: return [(_pfxLength + 5),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24)))))), Add($0, (((b[i+4])<<24)>>24)))];
	case 0x800: return [(_pfxLength + 5),Mov(($0 = u8(Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24)))))), u8(Or($0, ((((b[i+4])<<24)>>24)&0xff))))];
	case 0x802: return [(_pfxLength + 5),Mov(($0 = u8(Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24)))))), u8(Or($0, ((((b[i+4])<<24)>>24)&0xff))))];
	case 0x803: return [(_pfxLength + 5),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24)))))), Or($0, uint[(_pfxSizeSpecifier ? 16 : 32)]((((b[i+4])<<24)>>24))))];
	case 0x1000: return [(_pfxLength + 5),Mov(($0 = u8(Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24)))))), u8(Add($0, u8(Add((((b[i+4])<<24)>>24), u8(F[1]))))))];
	case 0x1002: return [(_pfxLength + 5),Mov(($0 = u8(Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24)))))), u8(Add($0, u8(Add((((b[i+4])<<24)>>24), u8(F[1]))))))];
	case 0x1003: return [(_pfxLength + 5),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24)))))), Add($0, Add((((b[i+4])<<24)>>24), uint[(_pfxSizeSpecifier ? 16 : 32)](F[1]))))];
	case 0x1800: return [(_pfxLength + 5),Mov(($0 = u8(Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24)))))), u8(Add(($1 = u8(Add($0, ((-($2 = (((b[i+4])<<24)>>24))<<24)>>24)))), i8(Neg(($3 = u8(F[1])))))))];
	case 0x1802: return [(_pfxLength + 5),Mov(($0 = u8(Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24)))))), u8(Add(($1 = u8(Add($0, ((-($2 = (((b[i+4])<<24)>>24))<<24)>>24)))), i8(Neg(($3 = u8(F[1])))))))];
	case 0x1803: return [(_pfxLength + 5),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24)))))), Add(($1 = Add($0, ((-($2 = (((b[i+4])<<24)>>24))<<24)>>24))), int[(_pfxSizeSpecifier ? 16 : 32)](Neg(($3 = uint[(_pfxSizeSpecifier ? 16 : 32)](F[1]))))))];
	case 0x2000: return [(_pfxLength + 5),Mov(($0 = u8(Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24)))))), u8(And($0, ((((b[i+4])<<24)>>24)&0xff))))];
	case 0x2002: return [(_pfxLength + 5),Mov(($0 = u8(Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24)))))), u8(And($0, ((((b[i+4])<<24)>>24)&0xff))))];
	case 0x2003: return [(_pfxLength + 5),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24)))))), And($0, uint[(_pfxSizeSpecifier ? 16 : 32)]((((b[i+4])<<24)>>24))))];
	case 0x2800: return [(_pfxLength + 5),Mov(F[2], Eq(($0 = u8(Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24)))))), ($1 = (((b[i+4])<<24)>>24)))),Mov(F[1], Lt($0, $1)),Mov($0, u8(Add($0, ((-$1<<24)>>24))))];
	case 0x2802: return [(_pfxLength + 5),Mov(F[2], Eq(($0 = u8(Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24)))))), ($1 = (((b[i+4])<<24)>>24)))),Mov(F[1], Lt($0, $1)),Mov($0, u8(Add($0, ((-$1<<24)>>24))))];
	case 0x2803: return [(_pfxLength + 5),Mov(F[2], Eq(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24)))))), ($1 = (((b[i+4])<<24)>>24)))),Mov(F[1], Lt($0, $1)),Mov($0, Add($0, ((-$1<<24)>>24)))];
	case 0x3000: return [(_pfxLength + 5),Mov(($0 = u8(Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24)))))), u8(Xor($0, (((b[i+4])<<24)>>24))))];
	case 0x3002: return [(_pfxLength + 5),Mov(($0 = u8(Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24)))))), u8(Xor($0, (((b[i+4])<<24)>>24))))];
	case 0x3003: return [(_pfxLength + 5),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24)))))), Xor($0, (((b[i+4])<<24)>>24)))];
	case 0x3800: return [(_pfxLength + 5),Mov(F[2], Eq(($0 = u8(Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24)))))), ($1 = (((b[i+4])<<24)>>24)))),Mov(F[1], Lt($0, $1))];
	case 0x3802: return [(_pfxLength + 5),Mov(F[2], Eq(($0 = u8(Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24)))))), ($1 = (((b[i+4])<<24)>>24)))),Mov(F[1], Lt($0, $1))];
	case 0x3803: return [(_pfxLength + 5),Mov(F[2], Eq(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24)))))), ($1 = (((b[i+4])<<24)>>24)))),Mov(F[1], Lt($0, $1))];
	case 0x46: return [(_pfxLength + 5),Mov(u8(Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24))))), (((b[i+4])<<24)>>24))];
	case 0x40: return [(_pfxLength + 5),Mov(($0 = u8(Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24)))))), u8(Or(u8(LSL($0, ($1 = (((b[i+4])<<24)>>24)))), u8(LSR($0, (((((-$1<<24)>>24) + 8)<<24)>>24))))))];
	case 0x41: return [(_pfxLength + 5),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24)))))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, ($1 = (((b[i+4])<<24)>>24)))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, ((_pfxSizeSpecifier ? 16 : 32) + ((-$1<<24)>>24))))))];
	case 0x840: return [(_pfxLength + 5),Mov(($0 = u8(Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24)))))), u8(Or(u8(LSR($0, ($1 = (((b[i+4])<<24)>>24)))), u8(LSL($0, (((((-$1<<24)>>24) + 8)<<24)>>24))))))];
	case 0x841: return [(_pfxLength + 5),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24)))))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, ($1 = (((b[i+4])<<24)>>24)))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, ((_pfxSizeSpecifier ? 16 : 32) + ((-$1<<24)>>24))))))];
	case 0x2040: return [(_pfxLength + 5),Mov(($0 = u8(Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24)))))), u8(LSL($0, (((b[i+4])<<24)>>24))))];
	case 0x2041: return [(_pfxLength + 5),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24)))))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, (((b[i+4])<<24)>>24))))];
	case 0x2840: return [(_pfxLength + 5),Mov(($0 = u8(Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24)))))), u8(LSR($0, (((b[i+4])<<24)>>24))))];
	case 0x2841: return [(_pfxLength + 5),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24)))))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, (((b[i+4])<<24)>>24))))];
	case 0x3840: return [(_pfxLength + 5),Mov(($0 = u8(Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24)))))), u8(ASR($0, (((b[i+4])<<24)>>24))))];
	case 0x3841: return [(_pfxLength + 5),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24)))))), uint[(_pfxSizeSpecifier ? 16 : 32)](ASR($0, (((b[i+4])<<24)>>24))))];
	case 0x76: return [(_pfxLength + 5),Mov(F[2], Eq(And(u8(Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24))))), (((b[i+4])<<24)>>24)), 0)),Mov(F[1], 0),Mov(F[0], 0)];
	}
if(((((b[i+0] & 0xf8)>>>3)|(b[i+1]<<5)|((b[i+2] & 0x7)<<13)) & 0xf8f1) == 0xa890)
	switch((b[i+0]|((b[i+1] & 0x3f)<<8)) & 0x3877) {
	case 0x0: return [(_pfxLength + 5),Mov(($0 = u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24))))))))), u8(Add($0, (((b[i+4])<<24)>>24))))];
	case 0x2: return [(_pfxLength + 5),Mov(($0 = u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24))))))))), u8(Add($0, (((b[i+4])<<24)>>24))))];
	case 0x3: return [(_pfxLength + 5),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24))))))))), Add($0, (((b[i+4])<<24)>>24)))];
	case 0x800: return [(_pfxLength + 5),Mov(($0 = u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24))))))))), u8(Or($0, ((((b[i+4])<<24)>>24)&0xff))))];
	case 0x802: return [(_pfxLength + 5),Mov(($0 = u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24))))))))), u8(Or($0, ((((b[i+4])<<24)>>24)&0xff))))];
	case 0x803: return [(_pfxLength + 5),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24))))))))), Or($0, uint[(_pfxSizeSpecifier ? 16 : 32)]((((b[i+4])<<24)>>24))))];
	case 0x1000: return [(_pfxLength + 5),Mov(($0 = u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24))))))))), u8(Add($0, u8(Add((((b[i+4])<<24)>>24), u8(F[1]))))))];
	case 0x1002: return [(_pfxLength + 5),Mov(($0 = u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24))))))))), u8(Add($0, u8(Add((((b[i+4])<<24)>>24), u8(F[1]))))))];
	case 0x1003: return [(_pfxLength + 5),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24))))))))), Add($0, Add((((b[i+4])<<24)>>24), uint[(_pfxSizeSpecifier ? 16 : 32)](F[1]))))];
	case 0x1800: return [(_pfxLength + 5),Mov(($0 = u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24))))))))), u8(Add(($1 = u8(Add($0, ((-($2 = (((b[i+4])<<24)>>24))<<24)>>24)))), i8(Neg(($3 = u8(F[1])))))))];
	case 0x1802: return [(_pfxLength + 5),Mov(($0 = u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24))))))))), u8(Add(($1 = u8(Add($0, ((-($2 = (((b[i+4])<<24)>>24))<<24)>>24)))), i8(Neg(($3 = u8(F[1])))))))];
	case 0x1803: return [(_pfxLength + 5),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24))))))))), Add(($1 = Add($0, ((-($2 = (((b[i+4])<<24)>>24))<<24)>>24))), int[(_pfxSizeSpecifier ? 16 : 32)](Neg(($3 = uint[(_pfxSizeSpecifier ? 16 : 32)](F[1]))))))];
	case 0x2000: return [(_pfxLength + 5),Mov(($0 = u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24))))))))), u8(And($0, ((((b[i+4])<<24)>>24)&0xff))))];
	case 0x2002: return [(_pfxLength + 5),Mov(($0 = u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24))))))))), u8(And($0, ((((b[i+4])<<24)>>24)&0xff))))];
	case 0x2003: return [(_pfxLength + 5),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24))))))))), And($0, uint[(_pfxSizeSpecifier ? 16 : 32)]((((b[i+4])<<24)>>24))))];
	case 0x2800: return [(_pfxLength + 5),Mov(F[2], Eq(($0 = u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24))))))))), ($1 = (((b[i+4])<<24)>>24)))),Mov(F[1], Lt($0, $1)),Mov($0, u8(Add($0, ((-$1<<24)>>24))))];
	case 0x2802: return [(_pfxLength + 5),Mov(F[2], Eq(($0 = u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24))))))))), ($1 = (((b[i+4])<<24)>>24)))),Mov(F[1], Lt($0, $1)),Mov($0, u8(Add($0, ((-$1<<24)>>24))))];
	case 0x2803: return [(_pfxLength + 5),Mov(F[2], Eq(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24))))))))), ($1 = (((b[i+4])<<24)>>24)))),Mov(F[1], Lt($0, $1)),Mov($0, Add($0, ((-$1<<24)>>24)))];
	case 0x3000: return [(_pfxLength + 5),Mov(($0 = u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24))))))))), u8(Xor($0, (((b[i+4])<<24)>>24))))];
	case 0x3002: return [(_pfxLength + 5),Mov(($0 = u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24))))))))), u8(Xor($0, (((b[i+4])<<24)>>24))))];
	case 0x3003: return [(_pfxLength + 5),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24))))))))), Xor($0, (((b[i+4])<<24)>>24)))];
	case 0x3800: return [(_pfxLength + 5),Mov(F[2], Eq(($0 = u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24))))))))), ($1 = (((b[i+4])<<24)>>24)))),Mov(F[1], Lt($0, $1))];
	case 0x3802: return [(_pfxLength + 5),Mov(F[2], Eq(($0 = u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24))))))))), ($1 = (((b[i+4])<<24)>>24)))),Mov(F[1], Lt($0, $1))];
	case 0x3803: return [(_pfxLength + 5),Mov(F[2], Eq(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24))))))))), ($1 = (((b[i+4])<<24)>>24)))),Mov(F[1], Lt($0, $1))];
	case 0x46: return [(_pfxLength + 5),Mov(u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24)))))))), (((b[i+4])<<24)>>24))];
	case 0x40: return [(_pfxLength + 5),Mov(($0 = u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24))))))))), u8(Or(u8(LSL($0, ($1 = (((b[i+4])<<24)>>24)))), u8(LSR($0, (((((-$1<<24)>>24) + 8)<<24)>>24))))))];
	case 0x41: return [(_pfxLength + 5),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24))))))))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, ($1 = (((b[i+4])<<24)>>24)))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, ((_pfxSizeSpecifier ? 16 : 32) + ((-$1<<24)>>24))))))];
	case 0x840: return [(_pfxLength + 5),Mov(($0 = u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24))))))))), u8(Or(u8(LSR($0, ($1 = (((b[i+4])<<24)>>24)))), u8(LSL($0, (((((-$1<<24)>>24) + 8)<<24)>>24))))))];
	case 0x841: return [(_pfxLength + 5),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24))))))))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, ($1 = (((b[i+4])<<24)>>24)))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, ((_pfxSizeSpecifier ? 16 : 32) + ((-$1<<24)>>24))))))];
	case 0x2040: return [(_pfxLength + 5),Mov(($0 = u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24))))))))), u8(LSL($0, (((b[i+4])<<24)>>24))))];
	case 0x2041: return [(_pfxLength + 5),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24))))))))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, (((b[i+4])<<24)>>24))))];
	case 0x2840: return [(_pfxLength + 5),Mov(($0 = u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24))))))))), u8(LSR($0, (((b[i+4])<<24)>>24))))];
	case 0x2841: return [(_pfxLength + 5),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24))))))))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, (((b[i+4])<<24)>>24))))];
	case 0x3840: return [(_pfxLength + 5),Mov(($0 = u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24))))))))), u8(ASR($0, (((b[i+4])<<24)>>24))))];
	case 0x3841: return [(_pfxLength + 5),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24))))))))), uint[(_pfxSizeSpecifier ? 16 : 32)](ASR($0, (((b[i+4])<<24)>>24))))];
	case 0x76: return [(_pfxLength + 5),Mov(F[2], Eq(And(u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24)))))))), (((b[i+4])<<24)>>24)), 0)),Mov(F[1], 0),Mov(F[0], 0)];
	}

	switch((b[i+0]) & 0xff) {
	case 0x5: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 5),Mov(R_[32][0], Add(R_[32][0], int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+1]|(b[i+2]<<8)|(b[i+3]<<16)|(b[i+4]<<24)))))];
	case 0xd: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 5),Mov(R_[32][0], Or(R_[32][0], uint[(_pfxSizeSpecifier ? 16 : 32)](int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+1]|(b[i+2]<<8)|(b[i+3]<<16)|(b[i+4]<<24))))))];
	case 0x15: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 5),Mov(R_[32][0], Add(R_[32][0], Add(int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+1]|(b[i+2]<<8)|(b[i+3]<<16)|(b[i+4]<<24))), u32(F[1]))))];
	case 0x1d: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 5),Mov(R_[32][0], Add(($1 = Add(R_[32][0], int[(_pfxSizeSpecifier ? 16 : 32)](-($2 = int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+1]|(b[i+2]<<8)|(b[i+3]<<16)|(b[i+4]<<24))))))), i32(Neg(($3 = u32(F[1]))))))];
	case 0x25: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 5),Mov(R_[32][0], And(R_[32][0], uint[(_pfxSizeSpecifier ? 16 : 32)](int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+1]|(b[i+2]<<8)|(b[i+3]<<16)|(b[i+4]<<24))))))];
	case 0x2d: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 5),Mov(F[2], Eq(R_[32][0], ($1 = int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+1]|(b[i+2]<<8)|(b[i+3]<<16)|(b[i+4]<<24)))))),Mov(F[1], Lt(R_[32][0], $1)),Mov(R_[32][0], Add(R_[32][0], int[(_pfxSizeSpecifier ? 16 : 32)](-$1)))];
	case 0x35: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 5),Mov(R_[32][0], Xor(R_[32][0], int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+1]|(b[i+2]<<8)|(b[i+3]<<16)|(b[i+4]<<24)))))];
	case 0x3d: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 5),Mov(F[2], Eq(R_[32][0], ($1 = int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+1]|(b[i+2]<<8)|(b[i+3]<<16)|(b[i+4]<<24)))))),Mov(F[1], Lt(R_[32][0], $1))];
	case 0x68: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 5),Mov(R_[32][4], u32(Add(R_[32][4], (-($1 = ((_pfxSizeSpecifier ? 16 : 32) >>> 3))&~0)))),Mov(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][4])), int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+1]|(b[i+2]<<8)|(b[i+3]<<16)|(b[i+4]<<24))))];
	case 0xa0: return [(_pfxLength + 5),Mov(R_[8][0], u8(Mem((b[i+1]|(b[i+2]<<8)|(b[i+3]<<16)|(b[i+4]<<24)))))];
	case 0xa1: return [(_pfxLength + 5),Mov(R_[32][0], u32(Mem((b[i+1]|(b[i+2]<<8)|(b[i+3]<<16)|(b[i+4]<<24)))))];
	case 0xa2: return [(_pfxLength + 5),Mov(u8(Mem((b[i+1]|(b[i+2]<<8)|(b[i+3]<<16)|(b[i+4]<<24)))), R_[8][0])];
	case 0xa3: return [(_pfxLength + 5),Mov(u32(Mem((b[i+1]|(b[i+2]<<8)|(b[i+3]<<16)|(b[i+4]<<24)))), R_[32][0])];
	case 0xa9: return [(($0 = (_pfxLength + (_pfxSizeSpecifier ? -2 : 0))) + 5),Mov(F[2], Eq(And(R_[32][0], int[(_pfxSizeSpecifier ? 16 : 32)]((b[i+1]|(b[i+2]<<8)|(b[i+3]<<16)|(b[i+4]<<24)))), 0)),Mov(F[1], 0),Mov(F[0], 0)];
	case 0xb8: return [(_pfxLength + 5),Mov(R_[32][0], (b[i+1]|(b[i+2]<<8)|(b[i+3]<<16)|(b[i+4]<<24)))];
	case 0xb9: return [(_pfxLength + 5),Mov(R_[32][1], (b[i+1]|(b[i+2]<<8)|(b[i+3]<<16)|(b[i+4]<<24)))];
	case 0xba: return [(_pfxLength + 5),Mov(R_[32][2], (b[i+1]|(b[i+2]<<8)|(b[i+3]<<16)|(b[i+4]<<24)))];
	case 0xbb: return [(_pfxLength + 5),Mov(R_[32][3], (b[i+1]|(b[i+2]<<8)|(b[i+3]<<16)|(b[i+4]<<24)))];
	case 0xbc: return [(_pfxLength + 5),Mov(R_[32][4], (b[i+1]|(b[i+2]<<8)|(b[i+3]<<16)|(b[i+4]<<24)))];
	case 0xbd: return [(_pfxLength + 5),Mov(R_[32][5], (b[i+1]|(b[i+2]<<8)|(b[i+3]<<16)|(b[i+4]<<24)))];
	case 0xbe: return [(_pfxLength + 5),Mov(R_[32][6], (b[i+1]|(b[i+2]<<8)|(b[i+3]<<16)|(b[i+4]<<24)))];
	case 0xbf: return [(_pfxLength + 5),Mov(R_[32][7], (b[i+1]|(b[i+2]<<8)|(b[i+3]<<16)|(b[i+4]<<24)))];
	case 0xe8: return [(_pfxLength + 5),Mov(R_[32][4], u32(Add(R_[32][4], -4))),Mov(u32(Mem(R_[32][4])), u32(Add(R_[32][8], ($0 = (_pfxLength + 5))))),Mov(R_[32][8], u32(Add(R_[32][8], (($17 = ((b[i+1]|(b[i+2]<<8)|(b[i+3]<<16)|(b[i+4]<<24)) + $0)&~0), ($17 < 0 ? $17+0x100000000 : $17)))))];
	case 0xe9: return [(_pfxLength + 5),Mov(R_[32][8], u32(Add(R_[32][8], (($18 = ((b[i+1]|(b[i+2]<<8)|(b[i+3]<<16)|(b[i+4]<<24)) + (_pfxLength + 5))&~0), ($18 < 0 ? $18+0x100000000 : $18)))))];
	}
if(((b[i+0]|(b[i+1]<<8)) & 0xc0ff) == 0x406b)
	switch(0) {
	case 0x0: return [(_pfxLength + 4),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Mul(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24))))), ((((b[i+3])<<24)>>24)&~0)))];
	}
if(((b[i+0]|(b[i+1]<<8)|(b[i+2]<<16)|((b[i+3] & 0x3f)<<24)) & 0x38c7c0ff) == 0x2004800f)
	switch(((b[i+1] & 0x3f)) & 0x3f) {
	case 0x10: return [(_pfxLength + 4),Mov(u8(Mem(R_[32][((b[i+3] & 0x7))])), F[0])];
	case 0x11: return [(_pfxLength + 4),Mov(u8(Mem(R_[32][((b[i+3] & 0x7))])), u1(Not(F[0])))];
	case 0x12: return [(_pfxLength + 4),Mov(u8(Mem(R_[32][((b[i+3] & 0x7))])), F[1])];
	case 0x13: return [(_pfxLength + 4),Mov(u8(Mem(R_[32][((b[i+3] & 0x7))])), u1(Not(F[1])))];
	case 0x14: return [(_pfxLength + 4),Mov(u8(Mem(R_[32][((b[i+3] & 0x7))])), F[2])];
	case 0x15: return [(_pfxLength + 4),Mov(u8(Mem(R_[32][((b[i+3] & 0x7))])), u1(Not(F[2])))];
	case 0x16: return [(_pfxLength + 4),Mov(u8(Mem(R_[32][((b[i+3] & 0x7))])), u1(Or(F[1], F[2])))];
	case 0x17: return [(_pfxLength + 4),Mov(u8(Mem(R_[32][((b[i+3] & 0x7))])), u1(And(u1(Not(F[1])), u1(Not(F[2])))))];
	case 0x18: return [(_pfxLength + 4),Mov(u8(Mem(R_[32][((b[i+3] & 0x7))])), F[3])];
	case 0x19: return [(_pfxLength + 4),Mov(u8(Mem(R_[32][((b[i+3] & 0x7))])), u1(Not(F[3])))];
	case 0x1a: return [(_pfxLength + 4),Mov(u8(Mem(R_[32][((b[i+3] & 0x7))])), F[4])];
	case 0x1b: return [(_pfxLength + 4),Mov(u8(Mem(R_[32][((b[i+3] & 0x7))])), u1(Not(F[4])))];
	case 0x1c: return [(_pfxLength + 4),Mov(u8(Mem(R_[32][((b[i+3] & 0x7))])), u1(Not(Eq(F[0], F[3]))))];
	case 0x1d: return [(_pfxLength + 4),Mov(u8(Mem(R_[32][((b[i+3] & 0x7))])), Eq(F[0], F[3]))];
	case 0x1e: return [(_pfxLength + 4),Mov(u8(Mem(R_[32][((b[i+3] & 0x7))])), u1(Or(F[2], u1(Not(Eq(F[0], F[3]))))))];
	case 0x1f: return [(_pfxLength + 4),Mov(u8(Mem(R_[32][((b[i+3] & 0x7))])), u1(And(u1(Not(F[2])), Eq(F[0], F[3]))))];
	case 0x23: return [(_pfxLength + 4),Mov(F[1], u1(Not(Eq(And(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+3] & 0x7))])), LSL(1, R_[32][(((b[i+2] & 0x38)>>>3))])), 0))))];
	case 0x2b: return [(_pfxLength + 4),Mov(F[1], u1(Not(Eq(And(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+3] & 0x7))]))), LSL(1, R_[32][(((b[i+2] & 0x38)>>>3))])), 0)))),Mov($0, Or($0, LSL(1, R_[32][(((b[i+2] & 0x38)>>>3))])))];
	case 0x2d: return [(_pfxLength + 4),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+3] & 0x7))]))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, R_[8][1])), u32(And(R_[32][(((b[i+2] & 0x38)>>>3))], u32(LSL(u32(Add(u32(LSL(1, R_[8][1])), -1)), i8(Add(i8(Neg(R_[8][1])), 32))))))))];
	case 0x2f: return [(_pfxLength + 4),Mov(($0 = i32(R_[32][(((b[i+2] & 0x38)>>>3))])), Mul($0, int[(_pfxSizeSpecifier ? 16 : 32)](uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+3] & 0x7))])))))];
	case 0x36: return [(_pfxLength + 4),Mov(R_[32][(((b[i+2] & 0x38)>>>3))], u8(Mem(R_[32][((b[i+3] & 0x7))])))];
	case 0x37: return [(_pfxLength + 4),Mov(R_[32][(((b[i+2] & 0x38)>>>3))], u16(Mem(R_[32][((b[i+3] & 0x7))])))];
	case 0x3e: return [(_pfxLength + 4),Mov(R_[32][(((b[i+2] & 0x38)>>>3))], i32(u8(Mem(R_[32][((b[i+3] & 0x7))]))))];
	case 0x3f: return [(_pfxLength + 4),Mov(R_[32][(((b[i+2] & 0x38)>>>3))], i32(u16(Mem(R_[32][((b[i+3] & 0x7))]))))];
	}
if(((b[i+0]|(b[i+1]<<8)|(b[i+2]<<16)) & 0xc7c0ff) == 0x4800f)
	switch(((b[i+1] & 0x3f)) & 0x3f) {
	case 0x10: return [(_pfxLength + 4),Mov(u8(Mem(u32(Add(R_[32][((b[i+3] & 0x7))], u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))))))), F[0])];
	case 0x11: return [(_pfxLength + 4),Mov(u8(Mem(u32(Add(R_[32][((b[i+3] & 0x7))], u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))))))), u1(Not(F[0])))];
	case 0x12: return [(_pfxLength + 4),Mov(u8(Mem(u32(Add(R_[32][((b[i+3] & 0x7))], u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))))))), F[1])];
	case 0x13: return [(_pfxLength + 4),Mov(u8(Mem(u32(Add(R_[32][((b[i+3] & 0x7))], u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))))))), u1(Not(F[1])))];
	case 0x14: return [(_pfxLength + 4),Mov(u8(Mem(u32(Add(R_[32][((b[i+3] & 0x7))], u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))))))), F[2])];
	case 0x15: return [(_pfxLength + 4),Mov(u8(Mem(u32(Add(R_[32][((b[i+3] & 0x7))], u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))))))), u1(Not(F[2])))];
	case 0x16: return [(_pfxLength + 4),Mov(u8(Mem(u32(Add(R_[32][((b[i+3] & 0x7))], u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))))))), u1(Or(F[1], F[2])))];
	case 0x17: return [(_pfxLength + 4),Mov(u8(Mem(u32(Add(R_[32][((b[i+3] & 0x7))], u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))))))), u1(And(u1(Not(F[1])), u1(Not(F[2])))))];
	case 0x18: return [(_pfxLength + 4),Mov(u8(Mem(u32(Add(R_[32][((b[i+3] & 0x7))], u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))))))), F[3])];
	case 0x19: return [(_pfxLength + 4),Mov(u8(Mem(u32(Add(R_[32][((b[i+3] & 0x7))], u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))))))), u1(Not(F[3])))];
	case 0x1a: return [(_pfxLength + 4),Mov(u8(Mem(u32(Add(R_[32][((b[i+3] & 0x7))], u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))))))), F[4])];
	case 0x1b: return [(_pfxLength + 4),Mov(u8(Mem(u32(Add(R_[32][((b[i+3] & 0x7))], u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))))))), u1(Not(F[4])))];
	case 0x1c: return [(_pfxLength + 4),Mov(u8(Mem(u32(Add(R_[32][((b[i+3] & 0x7))], u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))))))), u1(Not(Eq(F[0], F[3]))))];
	case 0x1d: return [(_pfxLength + 4),Mov(u8(Mem(u32(Add(R_[32][((b[i+3] & 0x7))], u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))))))), Eq(F[0], F[3]))];
	case 0x1e: return [(_pfxLength + 4),Mov(u8(Mem(u32(Add(R_[32][((b[i+3] & 0x7))], u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))))))), u1(Or(F[2], u1(Not(Eq(F[0], F[3]))))))];
	case 0x1f: return [(_pfxLength + 4),Mov(u8(Mem(u32(Add(R_[32][((b[i+3] & 0x7))], u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))))))), u1(And(u1(Not(F[2])), Eq(F[0], F[3]))))];
	case 0x23: return [(_pfxLength + 4),Mov(F[1], u1(Not(Eq(And(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+3] & 0x7))], u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))))))), LSL(1, R_[32][(((b[i+2] & 0x38)>>>3))])), 0))))];
	case 0x2b: return [(_pfxLength + 4),Mov(F[1], u1(Not(Eq(And(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+3] & 0x7))], u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6))))))))), LSL(1, R_[32][(((b[i+2] & 0x38)>>>3))])), 0)))),Mov($0, Or($0, LSL(1, R_[32][(((b[i+2] & 0x38)>>>3))])))];
	case 0x2d: return [(_pfxLength + 4),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+3] & 0x7))], u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6))))))))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, R_[8][1])), u32(And(R_[32][(((b[i+2] & 0x38)>>>3))], u32(LSL(u32(Add(u32(LSL(1, R_[8][1])), -1)), i8(Add(i8(Neg(R_[8][1])), 32))))))))];
	case 0x2f: return [(_pfxLength + 4),Mov(($0 = i32(R_[32][(((b[i+2] & 0x38)>>>3))])), Mul($0, int[(_pfxSizeSpecifier ? 16 : 32)](uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+3] & 0x7))], u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))))))))))];
	case 0x36: return [(_pfxLength + 4),Mov(R_[32][(((b[i+2] & 0x38)>>>3))], u8(Mem(u32(Add(R_[32][((b[i+3] & 0x7))], u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))))))))];
	case 0x37: return [(_pfxLength + 4),Mov(R_[32][(((b[i+2] & 0x38)>>>3))], u16(Mem(u32(Add(R_[32][((b[i+3] & 0x7))], u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))))))))];
	case 0x3e: return [(_pfxLength + 4),Mov(R_[32][(((b[i+2] & 0x38)>>>3))], i32(u8(Mem(u32(Add(R_[32][((b[i+3] & 0x7))], u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6))))))))))];
	case 0x3f: return [(_pfxLength + 4),Mov(R_[32][(((b[i+2] & 0x38)>>>3))], i32(u16(Mem(u32(Add(R_[32][((b[i+3] & 0x7))], u32(LSL(R_[32][(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6))))))))))];
	}
if(((((b[i+0] & 0x80)>>>7)|(b[i+1]<<1)|((b[i+2] & 0x3f)<<9)) & 0x7f8f) == 0x4a89)
	switch((b[i+0]|((b[i+1] & 0x3f)<<8)) & 0x387f) {
	case 0xf: return [(_pfxLength + 4),Mov(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24))))), uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][4]))),Mov(R_[32][4], Add(R_[32][4], ((_pfxSizeSpecifier ? 16 : 32) >>> 3)))];
	case 0x50: return [(_pfxLength + 4),Mov(($0 = u8(Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24)))))), u8(Or(u8(LSL($0, 1)), u8(LSR($0, 7)))))];
	case 0x51: return [(_pfxLength + 4),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24)))))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, 1)), uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, ((_pfxSizeSpecifier ? 16 : 32) + -1)))))];
	case 0x52: return [(_pfxLength + 4),Mov(($0 = u8(Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24)))))), u8(Or(u8(LSL($0, R_[8][1])), u8(LSR($0, i8(Add(i8(Neg(R_[8][1])), 8)))))))];
	case 0x53: return [(_pfxLength + 4),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24)))))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, R_[8][1])), uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, Add((_pfxSizeSpecifier ? 16 : 32), i8(Neg(R_[8][1])))))))];
	case 0x850: return [(_pfxLength + 4),Mov(($0 = u8(Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24)))))), u8(Or(u8(LSR($0, 1)), u8(LSL($0, 7)))))];
	case 0x851: return [(_pfxLength + 4),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24)))))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, 1)), uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, ((_pfxSizeSpecifier ? 16 : 32) + -1)))))];
	case 0x852: return [(_pfxLength + 4),Mov(($0 = u8(Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24)))))), u8(Or(u8(LSR($0, R_[8][1])), u8(LSL($0, i8(Add(i8(Neg(R_[8][1])), 8)))))))];
	case 0x853: return [(_pfxLength + 4),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24)))))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, R_[8][1])), uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, Add((_pfxSizeSpecifier ? 16 : 32), i8(Neg(R_[8][1])))))))];
	case 0x2050: return [(_pfxLength + 4),Mov(($0 = u8(Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24)))))), u8(LSL($0, 1)))];
	case 0x2051: return [(_pfxLength + 4),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24)))))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, 1)))];
	case 0x2052: return [(_pfxLength + 4),Mov(($0 = u8(Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24)))))), u8(LSL($0, R_[8][1])))];
	case 0x2053: return [(_pfxLength + 4),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24)))))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, R_[8][1])))];
	case 0x2850: return [(_pfxLength + 4),Mov(($0 = u8(Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24)))))), u8(LSR($0, 1)))];
	case 0x2851: return [(_pfxLength + 4),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24)))))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, 1)))];
	case 0x2852: return [(_pfxLength + 4),Mov(($0 = u8(Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24)))))), u8(LSR($0, R_[8][1])))];
	case 0x2853: return [(_pfxLength + 4),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24)))))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, R_[8][1])))];
	case 0x3850: return [(_pfxLength + 4),Mov(($0 = u8(Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24)))))), u8(ASR($0, 1)))];
	case 0x3851: return [(_pfxLength + 4),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24)))))), uint[(_pfxSizeSpecifier ? 16 : 32)](ASR($0, 1)))];
	case 0x3852: return [(_pfxLength + 4),Mov(($0 = u8(Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24)))))), u8(ASR($0, R_[8][1])))];
	case 0x3853: return [(_pfxLength + 4),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24)))))), uint[(_pfxSizeSpecifier ? 16 : 32)](ASR($0, R_[8][1])))];
	case 0x1076: return [(_pfxLength + 4),Mov(($0 = u8(Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24)))))), u8(Not($0)))];
	case 0x1077: return [(_pfxLength + 4),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24)))))), uint[(_pfxSizeSpecifier ? 16 : 32)](Not($0)))];
	case 0x1876: return [(_pfxLength + 4),Mov(F[1], u1(Not(Eq(($0 = u8(Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24)))))), 0)))),Mov($0, i8(Neg($0)))];
	case 0x1877: return [(_pfxLength + 4),Mov(F[1], u1(Not(Eq(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24)))))), 0)))),Mov($0, int[(_pfxSizeSpecifier ? 16 : 32)](Neg($0)))];
	case 0x2076: return [(_pfxLength + 4),Mov(R_[16][0], u8(Mul(R_[8][0], u8(Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24))))))))];
	case 0x2077: return [(_pfxLength + 4),Mov(R_[32][0], Mul(R_[32][0], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24)))))))];
	case 0x2876: return [(_pfxLength + 4),Mov(R_[16][0], u8(Mul(R_[8][0], u8(Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24))))))))];
	case 0x2877: return [(_pfxLength + 4),Mov(R_[32][0], Mul(R_[32][0], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24)))))))];
	case 0x3076: return [(_pfxLength + 4),Mov(R_[16][0], u8(Div(R_[8][0], u8(Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24))))))))];
	case 0x3077: return [(_pfxLength + 4),Mov(R_[32][0], Div(R_[32][0], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24)))))))];
	case 0x3876: return [(_pfxLength + 4),Mov(R_[16][0], u8(Div(R_[8][0], u8(Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24))))))))];
	case 0x3877: return [(_pfxLength + 4),Mov(R_[32][0], Div(R_[32][0], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24)))))))];
	case 0x7e: return [(_pfxLength + 4),Mov(($0 = u8(Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24)))))), u8(Add($0, 1)))];
	case 0x7f: return [(_pfxLength + 4),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24)))))), Add($0, 1))];
	case 0x87e: return [(_pfxLength + 4),Mov(($0 = u8(Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24)))))), u8(Add($0, -1)))];
	case 0x87f: return [(_pfxLength + 4),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24)))))), Add($0, -1))];
	case 0x107f: return [(_pfxLength + 4),Mov(R_[32][4], u32(Add(R_[32][4], -4))),Mov(u32(Mem(R_[32][4])), u32(Add(R_[32][8], (_pfxLength + 4)))),Mov(R_[32][8], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24))))))];
	case 0x207f: return [(_pfxLength + 4),Mov(R_[32][8], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24))))))];
	case 0x307f: return [(_pfxLength + 4),Mov(R_[32][4], Add(R_[32][4], -($0 = ((_pfxSizeSpecifier ? 16 : 32) >>> 3)))),Mov(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][4])), uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24))))))];
	}
if(((((b[i+0] & 0xc0)>>>6)|(b[i+1]<<2)|((b[i+2] & 0x3f)<<10)) & 0xff1d) == 0x9510)
	switch((b[i+0]) & 0xbf) {
	case 0x0: return [(_pfxLength + 4),Mov(($0 = u8(Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24)))))), u8(Add($0, R_[8][(((b[i+1] & 0x38)>>>3))])))];
	case 0x1: return [(_pfxLength + 4),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24)))))), Add($0, R_[32][(((b[i+1] & 0x38)>>>3))]))];
	case 0x2: return [(_pfxLength + 4),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Add(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24))))))))];
	case 0x3: return [(_pfxLength + 4),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Add(R_[32][(((b[i+1] & 0x38)>>>3))], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24)))))))];
	case 0x8: return [(_pfxLength + 4),Mov(($0 = u8(Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24)))))), u8(Or($0, R_[8][(((b[i+1] & 0x38)>>>3))])))];
	case 0x9: return [(_pfxLength + 4),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24)))))), Or($0, R_[32][(((b[i+1] & 0x38)>>>3))]))];
	case 0xa: return [(_pfxLength + 4),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Or(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24))))))))];
	case 0xb: return [(_pfxLength + 4),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Or(R_[32][(((b[i+1] & 0x38)>>>3))], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24)))))))];
	case 0x10: return [(_pfxLength + 4),Mov(($0 = u8(Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24)))))), u8(Add($0, u8(Add(R_[8][(((b[i+1] & 0x38)>>>3))], u8(F[1]))))))];
	case 0x11: return [(_pfxLength + 4),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24)))))), Add($0, Add(R_[32][(((b[i+1] & 0x38)>>>3))], uint[(_pfxSizeSpecifier ? 16 : 32)](F[1]))))];
	case 0x12: return [(_pfxLength + 4),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Add(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Add(u8(Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24))))), u8(F[1]))))))];
	case 0x13: return [(_pfxLength + 4),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Add(R_[32][(((b[i+1] & 0x38)>>>3))], Add(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24))))), u32(F[1]))))];
	case 0x18: return [(_pfxLength + 4),Mov(($0 = u8(Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24)))))), u8(Add(($1 = u8(Add($0, i8(Neg(R_[8][(((b[i+1] & 0x38)>>>3))]))))), i8(Neg(($2 = u8(F[1])))))))];
	case 0x19: return [(_pfxLength + 4),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24)))))), Add(($1 = Add($0, i32(Neg(R_[32][(((b[i+1] & 0x38)>>>3))])))), int[(_pfxSizeSpecifier ? 16 : 32)](Neg(($2 = uint[(_pfxSizeSpecifier ? 16 : 32)](F[1]))))))];
	case 0x1a: return [(_pfxLength + 4),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Add(($0 = u8(Add(R_[8][(((b[i+1] & 0x38)>>>3))], i8(Neg(($1 = u8(Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24))))))))))), i8(Neg(($2 = u8(F[1])))))))];
	case 0x1b: return [(_pfxLength + 4),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Add(($0 = Add(R_[32][(((b[i+1] & 0x38)>>>3))], int[(_pfxSizeSpecifier ? 16 : 32)](Neg(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24)))))))))), i32(Neg(($2 = u32(F[1]))))))];
	case 0x20: return [(_pfxLength + 4),Mov(($0 = u8(Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24)))))), u8(And($0, R_[8][(((b[i+1] & 0x38)>>>3))])))];
	case 0x21: return [(_pfxLength + 4),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24)))))), And($0, R_[32][(((b[i+1] & 0x38)>>>3))]))];
	case 0x22: return [(_pfxLength + 4),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(And(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24))))))))];
	case 0x23: return [(_pfxLength + 4),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], And(R_[32][(((b[i+1] & 0x38)>>>3))], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24)))))))];
	case 0x28: return [(_pfxLength + 4),Mov(F[2], Eq(($0 = u8(Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24)))))), R_[8][(((b[i+1] & 0x38)>>>3))])),Mov(F[1], Lt($0, R_[8][(((b[i+1] & 0x38)>>>3))])),Mov($0, u8(Add($0, i8(Neg(R_[8][(((b[i+1] & 0x38)>>>3))])))))];
	case 0x29: return [(_pfxLength + 4),Mov(F[2], Eq(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24)))))), R_[32][(((b[i+1] & 0x38)>>>3))])),Mov(F[1], Lt($0, R_[32][(((b[i+1] & 0x38)>>>3))])),Mov($0, Add($0, i32(Neg(R_[32][(((b[i+1] & 0x38)>>>3))]))))];
	case 0x2a: return [(_pfxLength + 4),Mov(F[2], Eq(R_[8][(((b[i+1] & 0x38)>>>3))], ($0 = u8(Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24)))))))),Mov(F[1], Lt(R_[8][(((b[i+1] & 0x38)>>>3))], $0)),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Add(R_[8][(((b[i+1] & 0x38)>>>3))], i8(Neg($0)))))];
	case 0x2b: return [(_pfxLength + 4),Mov(F[2], Eq(R_[32][(((b[i+1] & 0x38)>>>3))], ($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24)))))))),Mov(F[1], Lt(R_[32][(((b[i+1] & 0x38)>>>3))], $0)),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Add(R_[32][(((b[i+1] & 0x38)>>>3))], int[(_pfxSizeSpecifier ? 16 : 32)](Neg($0))))];
	case 0x30: return [(_pfxLength + 4),Mov(($0 = u8(Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24)))))), u8(Xor($0, R_[8][(((b[i+1] & 0x38)>>>3))])))];
	case 0x31: return [(_pfxLength + 4),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24)))))), Xor($0, R_[32][(((b[i+1] & 0x38)>>>3))]))];
	case 0x32: return [(_pfxLength + 4),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Xor(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24))))))))];
	case 0x33: return [(_pfxLength + 4),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Xor(R_[32][(((b[i+1] & 0x38)>>>3))], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24)))))))];
	case 0x38: return [(_pfxLength + 4),Mov(F[2], Eq(($0 = u8(Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24)))))), R_[8][(((b[i+1] & 0x38)>>>3))])),Mov(F[1], Lt($0, R_[8][(((b[i+1] & 0x38)>>>3))]))];
	case 0x39: return [(_pfxLength + 4),Mov(F[2], Eq(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24)))))), R_[32][(((b[i+1] & 0x38)>>>3))])),Mov(F[1], Lt($0, R_[32][(((b[i+1] & 0x38)>>>3))]))];
	case 0x3a: return [(_pfxLength + 4),Mov(F[2], Eq(R_[8][(((b[i+1] & 0x38)>>>3))], ($0 = u8(Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24)))))))),Mov(F[1], Lt(R_[8][(((b[i+1] & 0x38)>>>3))], $0))];
	case 0x3b: return [(_pfxLength + 4),Mov(F[2], Eq(R_[32][(((b[i+1] & 0x38)>>>3))], ($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24)))))))),Mov(F[1], Lt(R_[32][(((b[i+1] & 0x38)>>>3))], $0))];
	case 0x84: return [(_pfxLength + 4),Mov(F[2], Eq(And(u8(Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24))))), R_[8][(((b[i+1] & 0x38)>>>3))]), 0)),Mov(F[1], 0),Mov(F[0], 0)];
	case 0x85: return [(_pfxLength + 4),Mov(F[2], Eq(And(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24))))), R_[32][(((b[i+1] & 0x38)>>>3))]), 0)),Mov(F[1], 0),Mov(F[0], 0)];
	case 0x86: return [(_pfxLength + 4),Swap(u8(Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24))))), R_[8][(((b[i+1] & 0x38)>>>3))])];
	case 0x87: return [(_pfxLength + 4),Swap(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24))))), R_[32][(((b[i+1] & 0x38)>>>3))])];
	case 0x88: return [(_pfxLength + 4),Mov(u8(Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24))))), R_[8][(((b[i+1] & 0x38)>>>3))])];
	case 0x89: return [(_pfxLength + 4),Mov(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24))))), R_[32][(((b[i+1] & 0x38)>>>3))])];
	case 0x8a: return [(_pfxLength + 4),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24))))))];
	case 0x8b: return [(_pfxLength + 4),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24))))))];
	case 0x8c: return [(_pfxLength + 4),Mov(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24))))), R_.S[(((b[i+1] & 0x38)>>>3))])];
	case 0x8d: return [(_pfxLength + 4),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], ($0 = u32(Add(R_[32][5], (((b[i+3])<<24)>>24)))))];
	case 0x8e: return [(_pfxLength + 4),Mov(R_.S[(((b[i+1] & 0x38)>>>3))], u16(Mem(u32(Add(R_[32][5], (((b[i+3])<<24)>>24))))))];
	}
if(((((b[i+0] & 0x80)>>>7)|(b[i+1]<<1)|((b[i+2] & 0x3f)<<9)) & 0x710f) == 0x4009)
	switch((b[i+0]|((b[i+1] & 0x7f)<<8)) & 0x787f) {
	case 0x0: return [(_pfxLength + 4),Mov(($0 = u8(Mem(R_[32][((b[i+2] & 0x7))]))), u8(Add($0, (((b[i+3])<<24)>>24))))];
	case 0x2: return [(_pfxLength + 4),Mov(($0 = u8(Mem(R_[32][((b[i+2] & 0x7))]))), u8(Add($0, (((b[i+3])<<24)>>24))))];
	case 0x3: return [(_pfxLength + 4),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+2] & 0x7))]))), Add($0, (((b[i+3])<<24)>>24)))];
	case 0x800: return [(_pfxLength + 4),Mov(($0 = u8(Mem(R_[32][((b[i+2] & 0x7))]))), u8(Or($0, ((((b[i+3])<<24)>>24)&0xff))))];
	case 0x802: return [(_pfxLength + 4),Mov(($0 = u8(Mem(R_[32][((b[i+2] & 0x7))]))), u8(Or($0, ((((b[i+3])<<24)>>24)&0xff))))];
	case 0x803: return [(_pfxLength + 4),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+2] & 0x7))]))), Or($0, uint[(_pfxSizeSpecifier ? 16 : 32)]((((b[i+3])<<24)>>24))))];
	case 0x1000: return [(_pfxLength + 4),Mov(($0 = u8(Mem(R_[32][((b[i+2] & 0x7))]))), u8(Add($0, u8(Add((((b[i+3])<<24)>>24), u8(F[1]))))))];
	case 0x1002: return [(_pfxLength + 4),Mov(($0 = u8(Mem(R_[32][((b[i+2] & 0x7))]))), u8(Add($0, u8(Add((((b[i+3])<<24)>>24), u8(F[1]))))))];
	case 0x1003: return [(_pfxLength + 4),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+2] & 0x7))]))), Add($0, Add((((b[i+3])<<24)>>24), uint[(_pfxSizeSpecifier ? 16 : 32)](F[1]))))];
	case 0x1800: return [(_pfxLength + 4),Mov(($0 = u8(Mem(R_[32][((b[i+2] & 0x7))]))), u8(Add(($1 = u8(Add($0, ((-($2 = (((b[i+3])<<24)>>24))<<24)>>24)))), i8(Neg(($3 = u8(F[1])))))))];
	case 0x1802: return [(_pfxLength + 4),Mov(($0 = u8(Mem(R_[32][((b[i+2] & 0x7))]))), u8(Add(($1 = u8(Add($0, ((-($2 = (((b[i+3])<<24)>>24))<<24)>>24)))), i8(Neg(($3 = u8(F[1])))))))];
	case 0x1803: return [(_pfxLength + 4),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+2] & 0x7))]))), Add(($1 = Add($0, ((-($2 = (((b[i+3])<<24)>>24))<<24)>>24))), int[(_pfxSizeSpecifier ? 16 : 32)](Neg(($3 = uint[(_pfxSizeSpecifier ? 16 : 32)](F[1]))))))];
	case 0x2000: return [(_pfxLength + 4),Mov(($0 = u8(Mem(R_[32][((b[i+2] & 0x7))]))), u8(And($0, ((((b[i+3])<<24)>>24)&0xff))))];
	case 0x2002: return [(_pfxLength + 4),Mov(($0 = u8(Mem(R_[32][((b[i+2] & 0x7))]))), u8(And($0, ((((b[i+3])<<24)>>24)&0xff))))];
	case 0x2003: return [(_pfxLength + 4),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+2] & 0x7))]))), And($0, uint[(_pfxSizeSpecifier ? 16 : 32)]((((b[i+3])<<24)>>24))))];
	case 0x2800: return [(_pfxLength + 4),Mov(F[2], Eq(($0 = u8(Mem(R_[32][((b[i+2] & 0x7))]))), ($1 = (((b[i+3])<<24)>>24)))),Mov(F[1], Lt($0, $1)),Mov($0, u8(Add($0, ((-$1<<24)>>24))))];
	case 0x2802: return [(_pfxLength + 4),Mov(F[2], Eq(($0 = u8(Mem(R_[32][((b[i+2] & 0x7))]))), ($1 = (((b[i+3])<<24)>>24)))),Mov(F[1], Lt($0, $1)),Mov($0, u8(Add($0, ((-$1<<24)>>24))))];
	case 0x2803: return [(_pfxLength + 4),Mov(F[2], Eq(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+2] & 0x7))]))), ($1 = (((b[i+3])<<24)>>24)))),Mov(F[1], Lt($0, $1)),Mov($0, Add($0, ((-$1<<24)>>24)))];
	case 0x3000: return [(_pfxLength + 4),Mov(($0 = u8(Mem(R_[32][((b[i+2] & 0x7))]))), u8(Xor($0, (((b[i+3])<<24)>>24))))];
	case 0x3002: return [(_pfxLength + 4),Mov(($0 = u8(Mem(R_[32][((b[i+2] & 0x7))]))), u8(Xor($0, (((b[i+3])<<24)>>24))))];
	case 0x3003: return [(_pfxLength + 4),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+2] & 0x7))]))), Xor($0, (((b[i+3])<<24)>>24)))];
	case 0x3800: return [(_pfxLength + 4),Mov(F[2], Eq(($0 = u8(Mem(R_[32][((b[i+2] & 0x7))]))), ($1 = (((b[i+3])<<24)>>24)))),Mov(F[1], Lt($0, $1))];
	case 0x3802: return [(_pfxLength + 4),Mov(F[2], Eq(($0 = u8(Mem(R_[32][((b[i+2] & 0x7))]))), ($1 = (((b[i+3])<<24)>>24)))),Mov(F[1], Lt($0, $1))];
	case 0x3803: return [(_pfxLength + 4),Mov(F[2], Eq(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+2] & 0x7))]))), ($1 = (((b[i+3])<<24)>>24)))),Mov(F[1], Lt($0, $1))];
	case 0x400f: return [(_pfxLength + 4),Mov(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24))))), uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][4]))),Mov(R_[32][4], Add(R_[32][4], ((_pfxSizeSpecifier ? 16 : 32) >>> 3)))];
	case 0x46: return [(_pfxLength + 4),Mov(u8(Mem(R_[32][((b[i+2] & 0x7))])), (((b[i+3])<<24)>>24))];
	case 0x40: return [(_pfxLength + 4),Mov(($0 = u8(Mem(R_[32][((b[i+2] & 0x7))]))), u8(Or(u8(LSL($0, ($1 = (((b[i+3])<<24)>>24)))), u8(LSR($0, (((((-$1<<24)>>24) + 8)<<24)>>24))))))];
	case 0x41: return [(_pfxLength + 4),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+2] & 0x7))]))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, ($1 = (((b[i+3])<<24)>>24)))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, ((_pfxSizeSpecifier ? 16 : 32) + ((-$1<<24)>>24))))))];
	case 0x4050: return [(_pfxLength + 4),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24)))))), u8(Or(u8(LSL($0, 1)), u8(LSR($0, 7)))))];
	case 0x4051: return [(_pfxLength + 4),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24)))))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, 1)), uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, ((_pfxSizeSpecifier ? 16 : 32) + -1)))))];
	case 0x4052: return [(_pfxLength + 4),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24)))))), u8(Or(u8(LSL($0, R_[8][1])), u8(LSR($0, i8(Add(i8(Neg(R_[8][1])), 8)))))))];
	case 0x4053: return [(_pfxLength + 4),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24)))))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, R_[8][1])), uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, Add((_pfxSizeSpecifier ? 16 : 32), i8(Neg(R_[8][1])))))))];
	case 0x840: return [(_pfxLength + 4),Mov(($0 = u8(Mem(R_[32][((b[i+2] & 0x7))]))), u8(Or(u8(LSR($0, ($1 = (((b[i+3])<<24)>>24)))), u8(LSL($0, (((((-$1<<24)>>24) + 8)<<24)>>24))))))];
	case 0x841: return [(_pfxLength + 4),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+2] & 0x7))]))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, ($1 = (((b[i+3])<<24)>>24)))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, ((_pfxSizeSpecifier ? 16 : 32) + ((-$1<<24)>>24))))))];
	case 0x4850: return [(_pfxLength + 4),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24)))))), u8(Or(u8(LSR($0, 1)), u8(LSL($0, 7)))))];
	case 0x4851: return [(_pfxLength + 4),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24)))))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, 1)), uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, ((_pfxSizeSpecifier ? 16 : 32) + -1)))))];
	case 0x4852: return [(_pfxLength + 4),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24)))))), u8(Or(u8(LSR($0, R_[8][1])), u8(LSL($0, i8(Add(i8(Neg(R_[8][1])), 8)))))))];
	case 0x4853: return [(_pfxLength + 4),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24)))))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, R_[8][1])), uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, Add((_pfxSizeSpecifier ? 16 : 32), i8(Neg(R_[8][1])))))))];
	case 0x2040: return [(_pfxLength + 4),Mov(($0 = u8(Mem(R_[32][((b[i+2] & 0x7))]))), u8(LSL($0, (((b[i+3])<<24)>>24))))];
	case 0x2041: return [(_pfxLength + 4),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+2] & 0x7))]))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, (((b[i+3])<<24)>>24))))];
	case 0x6050: return [(_pfxLength + 4),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24)))))), u8(LSL($0, 1)))];
	case 0x6051: return [(_pfxLength + 4),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24)))))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, 1)))];
	case 0x6052: return [(_pfxLength + 4),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24)))))), u8(LSL($0, R_[8][1])))];
	case 0x6053: return [(_pfxLength + 4),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24)))))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, R_[8][1])))];
	case 0x2840: return [(_pfxLength + 4),Mov(($0 = u8(Mem(R_[32][((b[i+2] & 0x7))]))), u8(LSR($0, (((b[i+3])<<24)>>24))))];
	case 0x2841: return [(_pfxLength + 4),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+2] & 0x7))]))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, (((b[i+3])<<24)>>24))))];
	case 0x6850: return [(_pfxLength + 4),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24)))))), u8(LSR($0, 1)))];
	case 0x6851: return [(_pfxLength + 4),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24)))))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, 1)))];
	case 0x6852: return [(_pfxLength + 4),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24)))))), u8(LSR($0, R_[8][1])))];
	case 0x6853: return [(_pfxLength + 4),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24)))))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, R_[8][1])))];
	case 0x3840: return [(_pfxLength + 4),Mov(($0 = u8(Mem(R_[32][((b[i+2] & 0x7))]))), u8(ASR($0, (((b[i+3])<<24)>>24))))];
	case 0x3841: return [(_pfxLength + 4),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+2] & 0x7))]))), uint[(_pfxSizeSpecifier ? 16 : 32)](ASR($0, (((b[i+3])<<24)>>24))))];
	case 0x7850: return [(_pfxLength + 4),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24)))))), u8(ASR($0, 1)))];
	case 0x7851: return [(_pfxLength + 4),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24)))))), uint[(_pfxSizeSpecifier ? 16 : 32)](ASR($0, 1)))];
	case 0x7852: return [(_pfxLength + 4),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24)))))), u8(ASR($0, R_[8][1])))];
	case 0x7853: return [(_pfxLength + 4),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24)))))), uint[(_pfxSizeSpecifier ? 16 : 32)](ASR($0, R_[8][1])))];
	case 0x76: return [(_pfxLength + 4),Mov(F[2], Eq(And(u8(Mem(R_[32][((b[i+2] & 0x7))])), (((b[i+3])<<24)>>24)), 0)),Mov(F[1], 0),Mov(F[0], 0)];
	case 0x5076: return [(_pfxLength + 4),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24)))))), u8(Not($0)))];
	case 0x5077: return [(_pfxLength + 4),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24)))))), uint[(_pfxSizeSpecifier ? 16 : 32)](Not($0)))];
	case 0x5876: return [(_pfxLength + 4),Mov(F[1], u1(Not(Eq(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24)))))), 0)))),Mov($0, i8(Neg($0)))];
	case 0x5877: return [(_pfxLength + 4),Mov(F[1], u1(Not(Eq(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24)))))), 0)))),Mov($0, int[(_pfxSizeSpecifier ? 16 : 32)](Neg($0)))];
	case 0x6076: return [(_pfxLength + 4),Mov(R_[16][0], u8(Mul(R_[8][0], u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24))))))))];
	case 0x6077: return [(_pfxLength + 4),Mov(R_[32][0], Mul(R_[32][0], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24)))))))];
	case 0x6876: return [(_pfxLength + 4),Mov(R_[16][0], u8(Mul(R_[8][0], u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24))))))))];
	case 0x6877: return [(_pfxLength + 4),Mov(R_[32][0], Mul(R_[32][0], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24)))))))];
	case 0x7076: return [(_pfxLength + 4),Mov(R_[16][0], u8(Div(R_[8][0], u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24))))))))];
	case 0x7077: return [(_pfxLength + 4),Mov(R_[32][0], Div(R_[32][0], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24)))))))];
	case 0x7876: return [(_pfxLength + 4),Mov(R_[16][0], u8(Div(R_[8][0], u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24))))))))];
	case 0x7877: return [(_pfxLength + 4),Mov(R_[32][0], Div(R_[32][0], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24)))))))];
	case 0x407e: return [(_pfxLength + 4),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24)))))), u8(Add($0, 1)))];
	case 0x407f: return [(_pfxLength + 4),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24)))))), Add($0, 1))];
	case 0x487e: return [(_pfxLength + 4),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24)))))), u8(Add($0, -1)))];
	case 0x487f: return [(_pfxLength + 4),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24)))))), Add($0, -1))];
	case 0x507f: return [(_pfxLength + 4),Mov(R_[32][4], u32(Add(R_[32][4], -4))),Mov(u32(Mem(R_[32][4])), u32(Add(R_[32][8], (_pfxLength + 4)))),Mov(R_[32][8], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24))))))];
	case 0x607f: return [(_pfxLength + 4),Mov(R_[32][8], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24))))))];
	case 0x707f: return [(_pfxLength + 4),Mov(R_[32][4], Add(R_[32][4], -($0 = ((_pfxSizeSpecifier ? 16 : 32) >>> 3)))),Mov(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][4])), uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24))))))];
	}
if(((b[i+1]|((b[i+2] & 0x3f)<<8)) & 0x3887) == 0x2004)
	switch((b[i+0]|((b[i+1] & 0x7f)<<8)) & 0x40ff) {
	case 0x4000: return [(_pfxLength + 4),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24)))))), u8(Add($0, R_[8][(((b[i+1] & 0x38)>>>3))])))];
	case 0x4001: return [(_pfxLength + 4),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24)))))), Add($0, R_[32][(((b[i+1] & 0x38)>>>3))]))];
	case 0x4002: return [(_pfxLength + 4),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Add(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24))))))))];
	case 0x4003: return [(_pfxLength + 4),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Add(R_[32][(((b[i+1] & 0x38)>>>3))], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24)))))))];
	case 0x4008: return [(_pfxLength + 4),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24)))))), u8(Or($0, R_[8][(((b[i+1] & 0x38)>>>3))])))];
	case 0x4009: return [(_pfxLength + 4),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24)))))), Or($0, R_[32][(((b[i+1] & 0x38)>>>3))]))];
	case 0x400a: return [(_pfxLength + 4),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Or(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24))))))))];
	case 0x400b: return [(_pfxLength + 4),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Or(R_[32][(((b[i+1] & 0x38)>>>3))], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24)))))))];
	case 0x4010: return [(_pfxLength + 4),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24)))))), u8(Add($0, u8(Add(R_[8][(((b[i+1] & 0x38)>>>3))], u8(F[1]))))))];
	case 0x4011: return [(_pfxLength + 4),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24)))))), Add($0, Add(R_[32][(((b[i+1] & 0x38)>>>3))], uint[(_pfxSizeSpecifier ? 16 : 32)](F[1]))))];
	case 0x4012: return [(_pfxLength + 4),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Add(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Add(u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24))))), u8(F[1]))))))];
	case 0x4013: return [(_pfxLength + 4),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Add(R_[32][(((b[i+1] & 0x38)>>>3))], Add(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24))))), u32(F[1]))))];
	case 0x4018: return [(_pfxLength + 4),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24)))))), u8(Add(($1 = u8(Add($0, i8(Neg(R_[8][(((b[i+1] & 0x38)>>>3))]))))), i8(Neg(($2 = u8(F[1])))))))];
	case 0x4019: return [(_pfxLength + 4),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24)))))), Add(($1 = Add($0, i32(Neg(R_[32][(((b[i+1] & 0x38)>>>3))])))), int[(_pfxSizeSpecifier ? 16 : 32)](Neg(($2 = uint[(_pfxSizeSpecifier ? 16 : 32)](F[1]))))))];
	case 0x401a: return [(_pfxLength + 4),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Add(($0 = u8(Add(R_[8][(((b[i+1] & 0x38)>>>3))], i8(Neg(($1 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24))))))))))), i8(Neg(($2 = u8(F[1])))))))];
	case 0x401b: return [(_pfxLength + 4),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Add(($0 = Add(R_[32][(((b[i+1] & 0x38)>>>3))], int[(_pfxSizeSpecifier ? 16 : 32)](Neg(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24)))))))))), i32(Neg(($2 = u32(F[1]))))))];
	case 0x4020: return [(_pfxLength + 4),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24)))))), u8(And($0, R_[8][(((b[i+1] & 0x38)>>>3))])))];
	case 0x4021: return [(_pfxLength + 4),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24)))))), And($0, R_[32][(((b[i+1] & 0x38)>>>3))]))];
	case 0x4022: return [(_pfxLength + 4),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(And(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24))))))))];
	case 0x4023: return [(_pfxLength + 4),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], And(R_[32][(((b[i+1] & 0x38)>>>3))], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24)))))))];
	case 0x4028: return [(_pfxLength + 4),Mov(F[2], Eq(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24)))))), R_[8][(((b[i+1] & 0x38)>>>3))])),Mov(F[1], Lt($0, R_[8][(((b[i+1] & 0x38)>>>3))])),Mov($0, u8(Add($0, i8(Neg(R_[8][(((b[i+1] & 0x38)>>>3))])))))];
	case 0x4029: return [(_pfxLength + 4),Mov(F[2], Eq(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24)))))), R_[32][(((b[i+1] & 0x38)>>>3))])),Mov(F[1], Lt($0, R_[32][(((b[i+1] & 0x38)>>>3))])),Mov($0, Add($0, i32(Neg(R_[32][(((b[i+1] & 0x38)>>>3))]))))];
	case 0x402a: return [(_pfxLength + 4),Mov(F[2], Eq(R_[8][(((b[i+1] & 0x38)>>>3))], ($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24)))))))),Mov(F[1], Lt(R_[8][(((b[i+1] & 0x38)>>>3))], $0)),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Add(R_[8][(((b[i+1] & 0x38)>>>3))], i8(Neg($0)))))];
	case 0x402b: return [(_pfxLength + 4),Mov(F[2], Eq(R_[32][(((b[i+1] & 0x38)>>>3))], ($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24)))))))),Mov(F[1], Lt(R_[32][(((b[i+1] & 0x38)>>>3))], $0)),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Add(R_[32][(((b[i+1] & 0x38)>>>3))], int[(_pfxSizeSpecifier ? 16 : 32)](Neg($0))))];
	case 0x4030: return [(_pfxLength + 4),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24)))))), u8(Xor($0, R_[8][(((b[i+1] & 0x38)>>>3))])))];
	case 0x4031: return [(_pfxLength + 4),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24)))))), Xor($0, R_[32][(((b[i+1] & 0x38)>>>3))]))];
	case 0x4032: return [(_pfxLength + 4),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Xor(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24))))))))];
	case 0x4033: return [(_pfxLength + 4),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Xor(R_[32][(((b[i+1] & 0x38)>>>3))], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24)))))))];
	case 0x4038: return [(_pfxLength + 4),Mov(F[2], Eq(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24)))))), R_[8][(((b[i+1] & 0x38)>>>3))])),Mov(F[1], Lt($0, R_[8][(((b[i+1] & 0x38)>>>3))]))];
	case 0x4039: return [(_pfxLength + 4),Mov(F[2], Eq(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24)))))), R_[32][(((b[i+1] & 0x38)>>>3))])),Mov(F[1], Lt($0, R_[32][(((b[i+1] & 0x38)>>>3))]))];
	case 0x403a: return [(_pfxLength + 4),Mov(F[2], Eq(R_[8][(((b[i+1] & 0x38)>>>3))], ($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24)))))))),Mov(F[1], Lt(R_[8][(((b[i+1] & 0x38)>>>3))], $0))];
	case 0x403b: return [(_pfxLength + 4),Mov(F[2], Eq(R_[32][(((b[i+1] & 0x38)>>>3))], ($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24)))))))),Mov(F[1], Lt(R_[32][(((b[i+1] & 0x38)>>>3))], $0))];
	case 0x6b: return [(_pfxLength + 4),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Mul(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+2] & 0x7))])), ((((b[i+3])<<24)>>24)&~0)))];
	case 0x4084: return [(_pfxLength + 4),Mov(F[2], Eq(And(u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24))))), R_[8][(((b[i+1] & 0x38)>>>3))]), 0)),Mov(F[1], 0),Mov(F[0], 0)];
	case 0x4085: return [(_pfxLength + 4),Mov(F[2], Eq(And(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24))))), R_[32][(((b[i+1] & 0x38)>>>3))]), 0)),Mov(F[1], 0),Mov(F[0], 0)];
	case 0x4086: return [(_pfxLength + 4),Swap(u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24))))), R_[8][(((b[i+1] & 0x38)>>>3))])];
	case 0x4087: return [(_pfxLength + 4),Swap(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24))))), R_[32][(((b[i+1] & 0x38)>>>3))])];
	case 0x4088: return [(_pfxLength + 4),Mov(u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24))))), R_[8][(((b[i+1] & 0x38)>>>3))])];
	case 0x4089: return [(_pfxLength + 4),Mov(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24))))), R_[32][(((b[i+1] & 0x38)>>>3))])];
	case 0x408a: return [(_pfxLength + 4),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24))))))];
	case 0x408b: return [(_pfxLength + 4),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24))))))];
	case 0x408c: return [(_pfxLength + 4),Mov(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24))))), R_.S[(((b[i+1] & 0x38)>>>3))])];
	case 0x408d: return [(_pfxLength + 4),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], ($0 = u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24)))))];
	case 0x408e: return [(_pfxLength + 4),Mov(R_.S[(((b[i+1] & 0x38)>>>3))], u16(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24))))))];
	}
if(((((b[i+0] & 0x80)>>>7)|(b[i+1]<<1)|((b[i+2] & 0x7)<<9)) & 0xf8f) == 0xa89)
	switch((b[i+0]|((b[i+1] & 0x3f)<<8)) & 0x387f) {
	case 0xf: return [(_pfxLength + 4),Mov(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24)))))))), uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][4]))),Mov(R_[32][4], Add(R_[32][4], ((_pfxSizeSpecifier ? 16 : 32) >>> 3)))];
	case 0x50: return [(_pfxLength + 4),Mov(($0 = u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24))))))))), u8(Or(u8(LSL($0, 1)), u8(LSR($0, 7)))))];
	case 0x51: return [(_pfxLength + 4),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24))))))))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, 1)), uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, ((_pfxSizeSpecifier ? 16 : 32) + -1)))))];
	case 0x52: return [(_pfxLength + 4),Mov(($0 = u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24))))))))), u8(Or(u8(LSL($0, R_[8][1])), u8(LSR($0, i8(Add(i8(Neg(R_[8][1])), 8)))))))];
	case 0x53: return [(_pfxLength + 4),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24))))))))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, R_[8][1])), uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, Add((_pfxSizeSpecifier ? 16 : 32), i8(Neg(R_[8][1])))))))];
	case 0x850: return [(_pfxLength + 4),Mov(($0 = u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24))))))))), u8(Or(u8(LSR($0, 1)), u8(LSL($0, 7)))))];
	case 0x851: return [(_pfxLength + 4),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24))))))))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, 1)), uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, ((_pfxSizeSpecifier ? 16 : 32) + -1)))))];
	case 0x852: return [(_pfxLength + 4),Mov(($0 = u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24))))))))), u8(Or(u8(LSR($0, R_[8][1])), u8(LSL($0, i8(Add(i8(Neg(R_[8][1])), 8)))))))];
	case 0x853: return [(_pfxLength + 4),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24))))))))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, R_[8][1])), uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, Add((_pfxSizeSpecifier ? 16 : 32), i8(Neg(R_[8][1])))))))];
	case 0x2050: return [(_pfxLength + 4),Mov(($0 = u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24))))))))), u8(LSL($0, 1)))];
	case 0x2051: return [(_pfxLength + 4),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24))))))))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, 1)))];
	case 0x2052: return [(_pfxLength + 4),Mov(($0 = u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24))))))))), u8(LSL($0, R_[8][1])))];
	case 0x2053: return [(_pfxLength + 4),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24))))))))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, R_[8][1])))];
	case 0x2850: return [(_pfxLength + 4),Mov(($0 = u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24))))))))), u8(LSR($0, 1)))];
	case 0x2851: return [(_pfxLength + 4),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24))))))))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, 1)))];
	case 0x2852: return [(_pfxLength + 4),Mov(($0 = u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24))))))))), u8(LSR($0, R_[8][1])))];
	case 0x2853: return [(_pfxLength + 4),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24))))))))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, R_[8][1])))];
	case 0x3850: return [(_pfxLength + 4),Mov(($0 = u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24))))))))), u8(ASR($0, 1)))];
	case 0x3851: return [(_pfxLength + 4),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24))))))))), uint[(_pfxSizeSpecifier ? 16 : 32)](ASR($0, 1)))];
	case 0x3852: return [(_pfxLength + 4),Mov(($0 = u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24))))))))), u8(ASR($0, R_[8][1])))];
	case 0x3853: return [(_pfxLength + 4),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24))))))))), uint[(_pfxSizeSpecifier ? 16 : 32)](ASR($0, R_[8][1])))];
	case 0x1076: return [(_pfxLength + 4),Mov(($0 = u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24))))))))), u8(Not($0)))];
	case 0x1077: return [(_pfxLength + 4),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24))))))))), uint[(_pfxSizeSpecifier ? 16 : 32)](Not($0)))];
	case 0x1876: return [(_pfxLength + 4),Mov(F[1], u1(Not(Eq(($0 = u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24))))))))), 0)))),Mov($0, i8(Neg($0)))];
	case 0x1877: return [(_pfxLength + 4),Mov(F[1], u1(Not(Eq(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24))))))))), 0)))),Mov($0, int[(_pfxSizeSpecifier ? 16 : 32)](Neg($0)))];
	case 0x2076: return [(_pfxLength + 4),Mov(R_[16][0], u8(Mul(R_[8][0], u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24)))))))))))];
	case 0x2077: return [(_pfxLength + 4),Mov(R_[32][0], Mul(R_[32][0], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24))))))))))];
	case 0x2876: return [(_pfxLength + 4),Mov(R_[16][0], u8(Mul(R_[8][0], u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24)))))))))))];
	case 0x2877: return [(_pfxLength + 4),Mov(R_[32][0], Mul(R_[32][0], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24))))))))))];
	case 0x3076: return [(_pfxLength + 4),Mov(R_[16][0], u8(Div(R_[8][0], u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24)))))))))))];
	case 0x3077: return [(_pfxLength + 4),Mov(R_[32][0], Div(R_[32][0], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24))))))))))];
	case 0x3876: return [(_pfxLength + 4),Mov(R_[16][0], u8(Div(R_[8][0], u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24)))))))))))];
	case 0x3877: return [(_pfxLength + 4),Mov(R_[32][0], Div(R_[32][0], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24))))))))))];
	case 0x7e: return [(_pfxLength + 4),Mov(($0 = u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24))))))))), u8(Add($0, 1)))];
	case 0x7f: return [(_pfxLength + 4),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24))))))))), Add($0, 1))];
	case 0x87e: return [(_pfxLength + 4),Mov(($0 = u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24))))))))), u8(Add($0, -1)))];
	case 0x87f: return [(_pfxLength + 4),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24))))))))), Add($0, -1))];
	case 0x107f: return [(_pfxLength + 4),Mov(R_[32][4], u32(Add(R_[32][4], -4))),Mov(u32(Mem(R_[32][4])), u32(Add(R_[32][8], (_pfxLength + 4)))),Mov(R_[32][8], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24)))))))))];
	case 0x207f: return [(_pfxLength + 4),Mov(R_[32][8], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24)))))))))];
	case 0x307f: return [(_pfxLength + 4),Mov(R_[32][4], Add(R_[32][4], -($0 = ((_pfxSizeSpecifier ? 16 : 32) >>> 3)))),Mov(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][4])), uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24)))))))))];
	}
if(((((b[i+0] & 0xc0)>>>6)|(b[i+1]<<2)|((b[i+2] & 0x7)<<10)) & 0x1f1d) == 0x1510)
	switch((b[i+0]) & 0xbf) {
	case 0x0: return [(_pfxLength + 4),Mov(($0 = u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24))))))))), u8(Add($0, R_[8][(((b[i+1] & 0x38)>>>3))])))];
	case 0x1: return [(_pfxLength + 4),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24))))))))), Add($0, R_[32][(((b[i+1] & 0x38)>>>3))]))];
	case 0x2: return [(_pfxLength + 4),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Add(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24)))))))))))];
	case 0x3: return [(_pfxLength + 4),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Add(R_[32][(((b[i+1] & 0x38)>>>3))], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24))))))))))];
	case 0x8: return [(_pfxLength + 4),Mov(($0 = u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24))))))))), u8(Or($0, R_[8][(((b[i+1] & 0x38)>>>3))])))];
	case 0x9: return [(_pfxLength + 4),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24))))))))), Or($0, R_[32][(((b[i+1] & 0x38)>>>3))]))];
	case 0xa: return [(_pfxLength + 4),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Or(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24)))))))))))];
	case 0xb: return [(_pfxLength + 4),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Or(R_[32][(((b[i+1] & 0x38)>>>3))], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24))))))))))];
	case 0x10: return [(_pfxLength + 4),Mov(($0 = u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24))))))))), u8(Add($0, u8(Add(R_[8][(((b[i+1] & 0x38)>>>3))], u8(F[1]))))))];
	case 0x11: return [(_pfxLength + 4),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24))))))))), Add($0, Add(R_[32][(((b[i+1] & 0x38)>>>3))], uint[(_pfxSizeSpecifier ? 16 : 32)](F[1]))))];
	case 0x12: return [(_pfxLength + 4),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Add(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Add(u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24)))))))), u8(F[1]))))))];
	case 0x13: return [(_pfxLength + 4),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Add(R_[32][(((b[i+1] & 0x38)>>>3))], Add(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24)))))))), u32(F[1]))))];
	case 0x18: return [(_pfxLength + 4),Mov(($0 = u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24))))))))), u8(Add(($1 = u8(Add($0, i8(Neg(R_[8][(((b[i+1] & 0x38)>>>3))]))))), i8(Neg(($2 = u8(F[1])))))))];
	case 0x19: return [(_pfxLength + 4),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24))))))))), Add(($1 = Add($0, i32(Neg(R_[32][(((b[i+1] & 0x38)>>>3))])))), int[(_pfxSizeSpecifier ? 16 : 32)](Neg(($2 = uint[(_pfxSizeSpecifier ? 16 : 32)](F[1]))))))];
	case 0x1a: return [(_pfxLength + 4),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Add(($0 = u8(Add(R_[8][(((b[i+1] & 0x38)>>>3))], i8(Neg(($1 = u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24)))))))))))))), i8(Neg(($2 = u8(F[1])))))))];
	case 0x1b: return [(_pfxLength + 4),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Add(($0 = Add(R_[32][(((b[i+1] & 0x38)>>>3))], int[(_pfxSizeSpecifier ? 16 : 32)](Neg(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24))))))))))))), i32(Neg(($2 = u32(F[1]))))))];
	case 0x20: return [(_pfxLength + 4),Mov(($0 = u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24))))))))), u8(And($0, R_[8][(((b[i+1] & 0x38)>>>3))])))];
	case 0x21: return [(_pfxLength + 4),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24))))))))), And($0, R_[32][(((b[i+1] & 0x38)>>>3))]))];
	case 0x22: return [(_pfxLength + 4),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(And(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24)))))))))))];
	case 0x23: return [(_pfxLength + 4),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], And(R_[32][(((b[i+1] & 0x38)>>>3))], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24))))))))))];
	case 0x28: return [(_pfxLength + 4),Mov(F[2], Eq(($0 = u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24))))))))), R_[8][(((b[i+1] & 0x38)>>>3))])),Mov(F[1], Lt($0, R_[8][(((b[i+1] & 0x38)>>>3))])),Mov($0, u8(Add($0, i8(Neg(R_[8][(((b[i+1] & 0x38)>>>3))])))))];
	case 0x29: return [(_pfxLength + 4),Mov(F[2], Eq(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24))))))))), R_[32][(((b[i+1] & 0x38)>>>3))])),Mov(F[1], Lt($0, R_[32][(((b[i+1] & 0x38)>>>3))])),Mov($0, Add($0, i32(Neg(R_[32][(((b[i+1] & 0x38)>>>3))]))))];
	case 0x2a: return [(_pfxLength + 4),Mov(F[2], Eq(R_[8][(((b[i+1] & 0x38)>>>3))], ($0 = u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24))))))))))),Mov(F[1], Lt(R_[8][(((b[i+1] & 0x38)>>>3))], $0)),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Add(R_[8][(((b[i+1] & 0x38)>>>3))], i8(Neg($0)))))];
	case 0x2b: return [(_pfxLength + 4),Mov(F[2], Eq(R_[32][(((b[i+1] & 0x38)>>>3))], ($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24))))))))))),Mov(F[1], Lt(R_[32][(((b[i+1] & 0x38)>>>3))], $0)),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Add(R_[32][(((b[i+1] & 0x38)>>>3))], int[(_pfxSizeSpecifier ? 16 : 32)](Neg($0))))];
	case 0x30: return [(_pfxLength + 4),Mov(($0 = u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24))))))))), u8(Xor($0, R_[8][(((b[i+1] & 0x38)>>>3))])))];
	case 0x31: return [(_pfxLength + 4),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24))))))))), Xor($0, R_[32][(((b[i+1] & 0x38)>>>3))]))];
	case 0x32: return [(_pfxLength + 4),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Xor(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24)))))))))))];
	case 0x33: return [(_pfxLength + 4),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Xor(R_[32][(((b[i+1] & 0x38)>>>3))], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24))))))))))];
	case 0x38: return [(_pfxLength + 4),Mov(F[2], Eq(($0 = u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24))))))))), R_[8][(((b[i+1] & 0x38)>>>3))])),Mov(F[1], Lt($0, R_[8][(((b[i+1] & 0x38)>>>3))]))];
	case 0x39: return [(_pfxLength + 4),Mov(F[2], Eq(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24))))))))), R_[32][(((b[i+1] & 0x38)>>>3))])),Mov(F[1], Lt($0, R_[32][(((b[i+1] & 0x38)>>>3))]))];
	case 0x3a: return [(_pfxLength + 4),Mov(F[2], Eq(R_[8][(((b[i+1] & 0x38)>>>3))], ($0 = u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24))))))))))),Mov(F[1], Lt(R_[8][(((b[i+1] & 0x38)>>>3))], $0))];
	case 0x3b: return [(_pfxLength + 4),Mov(F[2], Eq(R_[32][(((b[i+1] & 0x38)>>>3))], ($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24))))))))))),Mov(F[1], Lt(R_[32][(((b[i+1] & 0x38)>>>3))], $0))];
	case 0x84: return [(_pfxLength + 4),Mov(F[2], Eq(And(u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24)))))))), R_[8][(((b[i+1] & 0x38)>>>3))]), 0)),Mov(F[1], 0),Mov(F[0], 0)];
	case 0x85: return [(_pfxLength + 4),Mov(F[2], Eq(And(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24)))))))), R_[32][(((b[i+1] & 0x38)>>>3))]), 0)),Mov(F[1], 0),Mov(F[0], 0)];
	case 0x86: return [(_pfxLength + 4),Swap(u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24)))))))), R_[8][(((b[i+1] & 0x38)>>>3))])];
	case 0x87: return [(_pfxLength + 4),Swap(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24)))))))), R_[32][(((b[i+1] & 0x38)>>>3))])];
	case 0x88: return [(_pfxLength + 4),Mov(u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24)))))))), R_[8][(((b[i+1] & 0x38)>>>3))])];
	case 0x89: return [(_pfxLength + 4),Mov(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24)))))))), R_[32][(((b[i+1] & 0x38)>>>3))])];
	case 0x8a: return [(_pfxLength + 4),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24)))))))))];
	case 0x8b: return [(_pfxLength + 4),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24)))))))))];
	case 0x8c: return [(_pfxLength + 4),Mov(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24)))))))), R_.S[(((b[i+1] & 0x38)>>>3))])];
	case 0x8d: return [(_pfxLength + 4),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], ($0 = u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24))))))))];
	case 0x8e: return [(_pfxLength + 4),Mov(R_.S[(((b[i+1] & 0x38)>>>3))], u16(Mem(u32(Add(R_[32][5], i32(u32(Add(u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3])<<24)>>24)))))))))];
	}
if(((((b[i+0] & 0xf8)>>>3)|(b[i+1]<<5)) & 0x1811) == 0x810)
	switch((b[i+0]|((b[i+1] & 0x3f)<<8)) & 0x3877) {
	case 0x0: return [(_pfxLength + 4),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24)))))), u8(Add($0, (((b[i+3])<<24)>>24))))];
	case 0x2: return [(_pfxLength + 4),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24)))))), u8(Add($0, (((b[i+3])<<24)>>24))))];
	case 0x3: return [(_pfxLength + 4),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24)))))), Add($0, (((b[i+3])<<24)>>24)))];
	case 0x800: return [(_pfxLength + 4),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24)))))), u8(Or($0, ((((b[i+3])<<24)>>24)&0xff))))];
	case 0x802: return [(_pfxLength + 4),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24)))))), u8(Or($0, ((((b[i+3])<<24)>>24)&0xff))))];
	case 0x803: return [(_pfxLength + 4),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24)))))), Or($0, uint[(_pfxSizeSpecifier ? 16 : 32)]((((b[i+3])<<24)>>24))))];
	case 0x1000: return [(_pfxLength + 4),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24)))))), u8(Add($0, u8(Add((((b[i+3])<<24)>>24), u8(F[1]))))))];
	case 0x1002: return [(_pfxLength + 4),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24)))))), u8(Add($0, u8(Add((((b[i+3])<<24)>>24), u8(F[1]))))))];
	case 0x1003: return [(_pfxLength + 4),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24)))))), Add($0, Add((((b[i+3])<<24)>>24), uint[(_pfxSizeSpecifier ? 16 : 32)](F[1]))))];
	case 0x1800: return [(_pfxLength + 4),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24)))))), u8(Add(($1 = u8(Add($0, ((-($2 = (((b[i+3])<<24)>>24))<<24)>>24)))), i8(Neg(($3 = u8(F[1])))))))];
	case 0x1802: return [(_pfxLength + 4),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24)))))), u8(Add(($1 = u8(Add($0, ((-($2 = (((b[i+3])<<24)>>24))<<24)>>24)))), i8(Neg(($3 = u8(F[1])))))))];
	case 0x1803: return [(_pfxLength + 4),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24)))))), Add(($1 = Add($0, ((-($2 = (((b[i+3])<<24)>>24))<<24)>>24))), int[(_pfxSizeSpecifier ? 16 : 32)](Neg(($3 = uint[(_pfxSizeSpecifier ? 16 : 32)](F[1]))))))];
	case 0x2000: return [(_pfxLength + 4),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24)))))), u8(And($0, ((((b[i+3])<<24)>>24)&0xff))))];
	case 0x2002: return [(_pfxLength + 4),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24)))))), u8(And($0, ((((b[i+3])<<24)>>24)&0xff))))];
	case 0x2003: return [(_pfxLength + 4),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24)))))), And($0, uint[(_pfxSizeSpecifier ? 16 : 32)]((((b[i+3])<<24)>>24))))];
	case 0x2800: return [(_pfxLength + 4),Mov(F[2], Eq(($0 = u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24)))))), ($1 = (((b[i+3])<<24)>>24)))),Mov(F[1], Lt($0, $1)),Mov($0, u8(Add($0, ((-$1<<24)>>24))))];
	case 0x2802: return [(_pfxLength + 4),Mov(F[2], Eq(($0 = u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24)))))), ($1 = (((b[i+3])<<24)>>24)))),Mov(F[1], Lt($0, $1)),Mov($0, u8(Add($0, ((-$1<<24)>>24))))];
	case 0x2803: return [(_pfxLength + 4),Mov(F[2], Eq(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24)))))), ($1 = (((b[i+3])<<24)>>24)))),Mov(F[1], Lt($0, $1)),Mov($0, Add($0, ((-$1<<24)>>24)))];
	case 0x3000: return [(_pfxLength + 4),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24)))))), u8(Xor($0, (((b[i+3])<<24)>>24))))];
	case 0x3002: return [(_pfxLength + 4),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24)))))), u8(Xor($0, (((b[i+3])<<24)>>24))))];
	case 0x3003: return [(_pfxLength + 4),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24)))))), Xor($0, (((b[i+3])<<24)>>24)))];
	case 0x3800: return [(_pfxLength + 4),Mov(F[2], Eq(($0 = u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24)))))), ($1 = (((b[i+3])<<24)>>24)))),Mov(F[1], Lt($0, $1))];
	case 0x3802: return [(_pfxLength + 4),Mov(F[2], Eq(($0 = u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24)))))), ($1 = (((b[i+3])<<24)>>24)))),Mov(F[1], Lt($0, $1))];
	case 0x3803: return [(_pfxLength + 4),Mov(F[2], Eq(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24)))))), ($1 = (((b[i+3])<<24)>>24)))),Mov(F[1], Lt($0, $1))];
	case 0x46: return [(_pfxLength + 4),Mov(u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24))))), (((b[i+3])<<24)>>24))];
	case 0x40: return [(_pfxLength + 4),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24)))))), u8(Or(u8(LSL($0, ($1 = (((b[i+3])<<24)>>24)))), u8(LSR($0, (((((-$1<<24)>>24) + 8)<<24)>>24))))))];
	case 0x41: return [(_pfxLength + 4),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24)))))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, ($1 = (((b[i+3])<<24)>>24)))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, ((_pfxSizeSpecifier ? 16 : 32) + ((-$1<<24)>>24))))))];
	case 0x840: return [(_pfxLength + 4),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24)))))), u8(Or(u8(LSR($0, ($1 = (((b[i+3])<<24)>>24)))), u8(LSL($0, (((((-$1<<24)>>24) + 8)<<24)>>24))))))];
	case 0x841: return [(_pfxLength + 4),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24)))))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, ($1 = (((b[i+3])<<24)>>24)))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, ((_pfxSizeSpecifier ? 16 : 32) + ((-$1<<24)>>24))))))];
	case 0x2040: return [(_pfxLength + 4),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24)))))), u8(LSL($0, (((b[i+3])<<24)>>24))))];
	case 0x2041: return [(_pfxLength + 4),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24)))))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, (((b[i+3])<<24)>>24))))];
	case 0x2840: return [(_pfxLength + 4),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24)))))), u8(LSR($0, (((b[i+3])<<24)>>24))))];
	case 0x2841: return [(_pfxLength + 4),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24)))))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, (((b[i+3])<<24)>>24))))];
	case 0x3840: return [(_pfxLength + 4),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24)))))), u8(ASR($0, (((b[i+3])<<24)>>24))))];
	case 0x3841: return [(_pfxLength + 4),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24)))))), uint[(_pfxSizeSpecifier ? 16 : 32)](ASR($0, (((b[i+3])<<24)>>24))))];
	case 0x76: return [(_pfxLength + 4),Mov(F[2], Eq(And(u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24))))), (((b[i+3])<<24)>>24)), 0)),Mov(F[1], 0),Mov(F[0], 0)];
	}
if(((((b[i+0] & 0x80)>>>7)|(b[i+1]<<1)) & 0x10f) == 0x9)
	switch((b[i+0]|((b[i+1] & 0x7f)<<8)) & 0x787f) {
	case 0x0: return [(_pfxLength + 4),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))))))))), u8(Add($0, (((b[i+3])<<24)>>24))))];
	case 0x2: return [(_pfxLength + 4),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))))))))), u8(Add($0, (((b[i+3])<<24)>>24))))];
	case 0x3: return [(_pfxLength + 4),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))))))))), Add($0, (((b[i+3])<<24)>>24)))];
	case 0x800: return [(_pfxLength + 4),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))))))))), u8(Or($0, ((((b[i+3])<<24)>>24)&0xff))))];
	case 0x802: return [(_pfxLength + 4),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))))))))), u8(Or($0, ((((b[i+3])<<24)>>24)&0xff))))];
	case 0x803: return [(_pfxLength + 4),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))))))))), Or($0, uint[(_pfxSizeSpecifier ? 16 : 32)]((((b[i+3])<<24)>>24))))];
	case 0x1000: return [(_pfxLength + 4),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))))))))), u8(Add($0, u8(Add((((b[i+3])<<24)>>24), u8(F[1]))))))];
	case 0x1002: return [(_pfxLength + 4),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))))))))), u8(Add($0, u8(Add((((b[i+3])<<24)>>24), u8(F[1]))))))];
	case 0x1003: return [(_pfxLength + 4),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))))))))), Add($0, Add((((b[i+3])<<24)>>24), uint[(_pfxSizeSpecifier ? 16 : 32)](F[1]))))];
	case 0x1800: return [(_pfxLength + 4),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))))))))), u8(Add(($1 = u8(Add($0, ((-($2 = (((b[i+3])<<24)>>24))<<24)>>24)))), i8(Neg(($3 = u8(F[1])))))))];
	case 0x1802: return [(_pfxLength + 4),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))))))))), u8(Add(($1 = u8(Add($0, ((-($2 = (((b[i+3])<<24)>>24))<<24)>>24)))), i8(Neg(($3 = u8(F[1])))))))];
	case 0x1803: return [(_pfxLength + 4),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))))))))), Add(($1 = Add($0, ((-($2 = (((b[i+3])<<24)>>24))<<24)>>24))), int[(_pfxSizeSpecifier ? 16 : 32)](Neg(($3 = uint[(_pfxSizeSpecifier ? 16 : 32)](F[1]))))))];
	case 0x2000: return [(_pfxLength + 4),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))))))))), u8(And($0, ((((b[i+3])<<24)>>24)&0xff))))];
	case 0x2002: return [(_pfxLength + 4),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))))))))), u8(And($0, ((((b[i+3])<<24)>>24)&0xff))))];
	case 0x2003: return [(_pfxLength + 4),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))))))))), And($0, uint[(_pfxSizeSpecifier ? 16 : 32)]((((b[i+3])<<24)>>24))))];
	case 0x2800: return [(_pfxLength + 4),Mov(F[2], Eq(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))))))))), ($1 = (((b[i+3])<<24)>>24)))),Mov(F[1], Lt($0, $1)),Mov($0, u8(Add($0, ((-$1<<24)>>24))))];
	case 0x2802: return [(_pfxLength + 4),Mov(F[2], Eq(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))))))))), ($1 = (((b[i+3])<<24)>>24)))),Mov(F[1], Lt($0, $1)),Mov($0, u8(Add($0, ((-$1<<24)>>24))))];
	case 0x2803: return [(_pfxLength + 4),Mov(F[2], Eq(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))))))))), ($1 = (((b[i+3])<<24)>>24)))),Mov(F[1], Lt($0, $1)),Mov($0, Add($0, ((-$1<<24)>>24)))];
	case 0x3000: return [(_pfxLength + 4),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))))))))), u8(Xor($0, (((b[i+3])<<24)>>24))))];
	case 0x3002: return [(_pfxLength + 4),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))))))))), u8(Xor($0, (((b[i+3])<<24)>>24))))];
	case 0x3003: return [(_pfxLength + 4),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))))))))), Xor($0, (((b[i+3])<<24)>>24)))];
	case 0x3800: return [(_pfxLength + 4),Mov(F[2], Eq(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))))))))), ($1 = (((b[i+3])<<24)>>24)))),Mov(F[1], Lt($0, $1))];
	case 0x3802: return [(_pfxLength + 4),Mov(F[2], Eq(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))))))))), ($1 = (((b[i+3])<<24)>>24)))),Mov(F[1], Lt($0, $1))];
	case 0x3803: return [(_pfxLength + 4),Mov(F[2], Eq(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))))))))), ($1 = (((b[i+3])<<24)>>24)))),Mov(F[1], Lt($0, $1))];
	case 0x400f: return [(_pfxLength + 4),Mov(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24))))), uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][4]))),Mov(R_[32][4], Add(R_[32][4], ((_pfxSizeSpecifier ? 16 : 32) >>> 3)))];
	case 0x46: return [(_pfxLength + 4),Mov(u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))))), (((b[i+3])<<24)>>24))];
	case 0x40: return [(_pfxLength + 4),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))))))))), u8(Or(u8(LSL($0, ($1 = (((b[i+3])<<24)>>24)))), u8(LSR($0, (((((-$1<<24)>>24) + 8)<<24)>>24))))))];
	case 0x41: return [(_pfxLength + 4),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))))))))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, ($1 = (((b[i+3])<<24)>>24)))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, ((_pfxSizeSpecifier ? 16 : 32) + ((-$1<<24)>>24))))))];
	case 0x4050: return [(_pfxLength + 4),Mov(($0 = u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24)))))), u8(Or(u8(LSL($0, 1)), u8(LSR($0, 7)))))];
	case 0x4051: return [(_pfxLength + 4),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24)))))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, 1)), uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, ((_pfxSizeSpecifier ? 16 : 32) + -1)))))];
	case 0x4052: return [(_pfxLength + 4),Mov(($0 = u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24)))))), u8(Or(u8(LSL($0, R_[8][1])), u8(LSR($0, i8(Add(i8(Neg(R_[8][1])), 8)))))))];
	case 0x4053: return [(_pfxLength + 4),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24)))))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, R_[8][1])), uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, Add((_pfxSizeSpecifier ? 16 : 32), i8(Neg(R_[8][1])))))))];
	case 0x840: return [(_pfxLength + 4),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))))))))), u8(Or(u8(LSR($0, ($1 = (((b[i+3])<<24)>>24)))), u8(LSL($0, (((((-$1<<24)>>24) + 8)<<24)>>24))))))];
	case 0x841: return [(_pfxLength + 4),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))))))))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, ($1 = (((b[i+3])<<24)>>24)))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, ((_pfxSizeSpecifier ? 16 : 32) + ((-$1<<24)>>24))))))];
	case 0x4850: return [(_pfxLength + 4),Mov(($0 = u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24)))))), u8(Or(u8(LSR($0, 1)), u8(LSL($0, 7)))))];
	case 0x4851: return [(_pfxLength + 4),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24)))))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, 1)), uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, ((_pfxSizeSpecifier ? 16 : 32) + -1)))))];
	case 0x4852: return [(_pfxLength + 4),Mov(($0 = u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24)))))), u8(Or(u8(LSR($0, R_[8][1])), u8(LSL($0, i8(Add(i8(Neg(R_[8][1])), 8)))))))];
	case 0x4853: return [(_pfxLength + 4),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24)))))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, R_[8][1])), uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, Add((_pfxSizeSpecifier ? 16 : 32), i8(Neg(R_[8][1])))))))];
	case 0x2040: return [(_pfxLength + 4),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))))))))), u8(LSL($0, (((b[i+3])<<24)>>24))))];
	case 0x2041: return [(_pfxLength + 4),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))))))))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, (((b[i+3])<<24)>>24))))];
	case 0x6050: return [(_pfxLength + 4),Mov(($0 = u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24)))))), u8(LSL($0, 1)))];
	case 0x6051: return [(_pfxLength + 4),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24)))))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, 1)))];
	case 0x6052: return [(_pfxLength + 4),Mov(($0 = u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24)))))), u8(LSL($0, R_[8][1])))];
	case 0x6053: return [(_pfxLength + 4),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24)))))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, R_[8][1])))];
	case 0x2840: return [(_pfxLength + 4),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))))))))), u8(LSR($0, (((b[i+3])<<24)>>24))))];
	case 0x2841: return [(_pfxLength + 4),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))))))))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, (((b[i+3])<<24)>>24))))];
	case 0x6850: return [(_pfxLength + 4),Mov(($0 = u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24)))))), u8(LSR($0, 1)))];
	case 0x6851: return [(_pfxLength + 4),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24)))))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, 1)))];
	case 0x6852: return [(_pfxLength + 4),Mov(($0 = u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24)))))), u8(LSR($0, R_[8][1])))];
	case 0x6853: return [(_pfxLength + 4),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24)))))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, R_[8][1])))];
	case 0x3840: return [(_pfxLength + 4),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))))))))), u8(ASR($0, (((b[i+3])<<24)>>24))))];
	case 0x3841: return [(_pfxLength + 4),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))))))))), uint[(_pfxSizeSpecifier ? 16 : 32)](ASR($0, (((b[i+3])<<24)>>24))))];
	case 0x7850: return [(_pfxLength + 4),Mov(($0 = u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24)))))), u8(ASR($0, 1)))];
	case 0x7851: return [(_pfxLength + 4),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24)))))), uint[(_pfxSizeSpecifier ? 16 : 32)](ASR($0, 1)))];
	case 0x7852: return [(_pfxLength + 4),Mov(($0 = u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24)))))), u8(ASR($0, R_[8][1])))];
	case 0x7853: return [(_pfxLength + 4),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24)))))), uint[(_pfxSizeSpecifier ? 16 : 32)](ASR($0, R_[8][1])))];
	case 0x76: return [(_pfxLength + 4),Mov(F[2], Eq(And(u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))))), (((b[i+3])<<24)>>24)), 0)),Mov(F[1], 0),Mov(F[0], 0)];
	case 0x5076: return [(_pfxLength + 4),Mov(($0 = u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24)))))), u8(Not($0)))];
	case 0x5077: return [(_pfxLength + 4),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24)))))), uint[(_pfxSizeSpecifier ? 16 : 32)](Not($0)))];
	case 0x5876: return [(_pfxLength + 4),Mov(F[1], u1(Not(Eq(($0 = u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24)))))), 0)))),Mov($0, i8(Neg($0)))];
	case 0x5877: return [(_pfxLength + 4),Mov(F[1], u1(Not(Eq(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24)))))), 0)))),Mov($0, int[(_pfxSizeSpecifier ? 16 : 32)](Neg($0)))];
	case 0x6076: return [(_pfxLength + 4),Mov(R_[16][0], u8(Mul(R_[8][0], u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24))))))))];
	case 0x6077: return [(_pfxLength + 4),Mov(R_[32][0], Mul(R_[32][0], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24)))))))];
	case 0x6876: return [(_pfxLength + 4),Mov(R_[16][0], u8(Mul(R_[8][0], u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24))))))))];
	case 0x6877: return [(_pfxLength + 4),Mov(R_[32][0], Mul(R_[32][0], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24)))))))];
	case 0x7076: return [(_pfxLength + 4),Mov(R_[16][0], u8(Div(R_[8][0], u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24))))))))];
	case 0x7077: return [(_pfxLength + 4),Mov(R_[32][0], Div(R_[32][0], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24)))))))];
	case 0x7876: return [(_pfxLength + 4),Mov(R_[16][0], u8(Div(R_[8][0], u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24))))))))];
	case 0x7877: return [(_pfxLength + 4),Mov(R_[32][0], Div(R_[32][0], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24)))))))];
	case 0x407e: return [(_pfxLength + 4),Mov(($0 = u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24)))))), u8(Add($0, 1)))];
	case 0x407f: return [(_pfxLength + 4),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24)))))), Add($0, 1))];
	case 0x487e: return [(_pfxLength + 4),Mov(($0 = u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24)))))), u8(Add($0, -1)))];
	case 0x487f: return [(_pfxLength + 4),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24)))))), Add($0, -1))];
	case 0x507f: return [(_pfxLength + 4),Mov(R_[32][4], u32(Add(R_[32][4], -4))),Mov(u32(Mem(R_[32][4])), u32(Add(R_[32][8], (_pfxLength + 4)))),Mov(R_[32][8], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24))))))];
	case 0x607f: return [(_pfxLength + 4),Mov(R_[32][8], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24))))))];
	case 0x707f: return [(_pfxLength + 4),Mov(R_[32][4], Add(R_[32][4], -($0 = ((_pfxSizeSpecifier ? 16 : 32) >>> 3)))),Mov(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][4])), uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24))))))];
	}
if(((b[i+1]) & 0x87) == 0x4)
	switch((b[i+0]|((b[i+1] & 0x7f)<<8)) & 0x40ff) {
	case 0x4000: return [(_pfxLength + 4),Mov(($0 = u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24)))))), u8(Add($0, R_[8][(((b[i+1] & 0x38)>>>3))])))];
	case 0x4001: return [(_pfxLength + 4),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24)))))), Add($0, R_[32][(((b[i+1] & 0x38)>>>3))]))];
	case 0x4002: return [(_pfxLength + 4),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Add(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24))))))))];
	case 0x4003: return [(_pfxLength + 4),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Add(R_[32][(((b[i+1] & 0x38)>>>3))], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24)))))))];
	case 0x4008: return [(_pfxLength + 4),Mov(($0 = u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24)))))), u8(Or($0, R_[8][(((b[i+1] & 0x38)>>>3))])))];
	case 0x4009: return [(_pfxLength + 4),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24)))))), Or($0, R_[32][(((b[i+1] & 0x38)>>>3))]))];
	case 0x400a: return [(_pfxLength + 4),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Or(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24))))))))];
	case 0x400b: return [(_pfxLength + 4),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Or(R_[32][(((b[i+1] & 0x38)>>>3))], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24)))))))];
	case 0x4010: return [(_pfxLength + 4),Mov(($0 = u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24)))))), u8(Add($0, u8(Add(R_[8][(((b[i+1] & 0x38)>>>3))], u8(F[1]))))))];
	case 0x4011: return [(_pfxLength + 4),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24)))))), Add($0, Add(R_[32][(((b[i+1] & 0x38)>>>3))], uint[(_pfxSizeSpecifier ? 16 : 32)](F[1]))))];
	case 0x4012: return [(_pfxLength + 4),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Add(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Add(u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24))))), u8(F[1]))))))];
	case 0x4013: return [(_pfxLength + 4),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Add(R_[32][(((b[i+1] & 0x38)>>>3))], Add(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24))))), u32(F[1]))))];
	case 0x4018: return [(_pfxLength + 4),Mov(($0 = u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24)))))), u8(Add(($1 = u8(Add($0, i8(Neg(R_[8][(((b[i+1] & 0x38)>>>3))]))))), i8(Neg(($2 = u8(F[1])))))))];
	case 0x4019: return [(_pfxLength + 4),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24)))))), Add(($1 = Add($0, i32(Neg(R_[32][(((b[i+1] & 0x38)>>>3))])))), int[(_pfxSizeSpecifier ? 16 : 32)](Neg(($2 = uint[(_pfxSizeSpecifier ? 16 : 32)](F[1]))))))];
	case 0x401a: return [(_pfxLength + 4),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Add(($0 = u8(Add(R_[8][(((b[i+1] & 0x38)>>>3))], i8(Neg(($1 = u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24))))))))))), i8(Neg(($2 = u8(F[1])))))))];
	case 0x401b: return [(_pfxLength + 4),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Add(($0 = Add(R_[32][(((b[i+1] & 0x38)>>>3))], int[(_pfxSizeSpecifier ? 16 : 32)](Neg(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24)))))))))), i32(Neg(($2 = u32(F[1]))))))];
	case 0x4020: return [(_pfxLength + 4),Mov(($0 = u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24)))))), u8(And($0, R_[8][(((b[i+1] & 0x38)>>>3))])))];
	case 0x4021: return [(_pfxLength + 4),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24)))))), And($0, R_[32][(((b[i+1] & 0x38)>>>3))]))];
	case 0x4022: return [(_pfxLength + 4),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(And(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24))))))))];
	case 0x4023: return [(_pfxLength + 4),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], And(R_[32][(((b[i+1] & 0x38)>>>3))], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24)))))))];
	case 0x4028: return [(_pfxLength + 4),Mov(F[2], Eq(($0 = u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24)))))), R_[8][(((b[i+1] & 0x38)>>>3))])),Mov(F[1], Lt($0, R_[8][(((b[i+1] & 0x38)>>>3))])),Mov($0, u8(Add($0, i8(Neg(R_[8][(((b[i+1] & 0x38)>>>3))])))))];
	case 0x4029: return [(_pfxLength + 4),Mov(F[2], Eq(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24)))))), R_[32][(((b[i+1] & 0x38)>>>3))])),Mov(F[1], Lt($0, R_[32][(((b[i+1] & 0x38)>>>3))])),Mov($0, Add($0, i32(Neg(R_[32][(((b[i+1] & 0x38)>>>3))]))))];
	case 0x402a: return [(_pfxLength + 4),Mov(F[2], Eq(R_[8][(((b[i+1] & 0x38)>>>3))], ($0 = u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24)))))))),Mov(F[1], Lt(R_[8][(((b[i+1] & 0x38)>>>3))], $0)),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Add(R_[8][(((b[i+1] & 0x38)>>>3))], i8(Neg($0)))))];
	case 0x402b: return [(_pfxLength + 4),Mov(F[2], Eq(R_[32][(((b[i+1] & 0x38)>>>3))], ($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24)))))))),Mov(F[1], Lt(R_[32][(((b[i+1] & 0x38)>>>3))], $0)),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Add(R_[32][(((b[i+1] & 0x38)>>>3))], int[(_pfxSizeSpecifier ? 16 : 32)](Neg($0))))];
	case 0x4030: return [(_pfxLength + 4),Mov(($0 = u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24)))))), u8(Xor($0, R_[8][(((b[i+1] & 0x38)>>>3))])))];
	case 0x4031: return [(_pfxLength + 4),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24)))))), Xor($0, R_[32][(((b[i+1] & 0x38)>>>3))]))];
	case 0x4032: return [(_pfxLength + 4),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Xor(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24))))))))];
	case 0x4033: return [(_pfxLength + 4),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Xor(R_[32][(((b[i+1] & 0x38)>>>3))], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24)))))))];
	case 0x4038: return [(_pfxLength + 4),Mov(F[2], Eq(($0 = u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24)))))), R_[8][(((b[i+1] & 0x38)>>>3))])),Mov(F[1], Lt($0, R_[8][(((b[i+1] & 0x38)>>>3))]))];
	case 0x4039: return [(_pfxLength + 4),Mov(F[2], Eq(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24)))))), R_[32][(((b[i+1] & 0x38)>>>3))])),Mov(F[1], Lt($0, R_[32][(((b[i+1] & 0x38)>>>3))]))];
	case 0x403a: return [(_pfxLength + 4),Mov(F[2], Eq(R_[8][(((b[i+1] & 0x38)>>>3))], ($0 = u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24)))))))),Mov(F[1], Lt(R_[8][(((b[i+1] & 0x38)>>>3))], $0))];
	case 0x403b: return [(_pfxLength + 4),Mov(F[2], Eq(R_[32][(((b[i+1] & 0x38)>>>3))], ($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24)))))))),Mov(F[1], Lt(R_[32][(((b[i+1] & 0x38)>>>3))], $0))];
	case 0x6b: return [(_pfxLength + 4),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Mul(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))))), ((((b[i+3])<<24)>>24)&~0)))];
	case 0x4084: return [(_pfxLength + 4),Mov(F[2], Eq(And(u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24))))), R_[8][(((b[i+1] & 0x38)>>>3))]), 0)),Mov(F[1], 0),Mov(F[0], 0)];
	case 0x4085: return [(_pfxLength + 4),Mov(F[2], Eq(And(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24))))), R_[32][(((b[i+1] & 0x38)>>>3))]), 0)),Mov(F[1], 0),Mov(F[0], 0)];
	case 0x4086: return [(_pfxLength + 4),Swap(u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24))))), R_[8][(((b[i+1] & 0x38)>>>3))])];
	case 0x4087: return [(_pfxLength + 4),Swap(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24))))), R_[32][(((b[i+1] & 0x38)>>>3))])];
	case 0x4088: return [(_pfxLength + 4),Mov(u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24))))), R_[8][(((b[i+1] & 0x38)>>>3))])];
	case 0x4089: return [(_pfxLength + 4),Mov(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24))))), R_[32][(((b[i+1] & 0x38)>>>3))])];
	case 0x408a: return [(_pfxLength + 4),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24))))))];
	case 0x408b: return [(_pfxLength + 4),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24))))))];
	case 0x408c: return [(_pfxLength + 4),Mov(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24))))), R_.S[(((b[i+1] & 0x38)>>>3))])];
	case 0x408d: return [(_pfxLength + 4),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], ($0 = u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24)))))];
	case 0x408e: return [(_pfxLength + 4),Mov(R_.S[(((b[i+1] & 0x38)>>>3))], u16(Mem(u32(Add(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))), (((b[i+3])<<24)>>24))))))];
	}
if(((b[i+0]|(b[i+1]<<8)) & 0xc0ff) == 0x800f)
	switch((b[i+1]|(b[i+2]<<8)) & 0xc03f) {
	case 0x4010: return [(_pfxLength + 4),Mov(u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24))))), F[0])];
	case 0x4011: return [(_pfxLength + 4),Mov(u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24))))), u1(Not(F[0])))];
	case 0x4012: return [(_pfxLength + 4),Mov(u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24))))), F[1])];
	case 0x4013: return [(_pfxLength + 4),Mov(u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24))))), u1(Not(F[1])))];
	case 0x4014: return [(_pfxLength + 4),Mov(u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24))))), F[2])];
	case 0x4015: return [(_pfxLength + 4),Mov(u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24))))), u1(Not(F[2])))];
	case 0x4016: return [(_pfxLength + 4),Mov(u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24))))), u1(Or(F[1], F[2])))];
	case 0x4017: return [(_pfxLength + 4),Mov(u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24))))), u1(And(u1(Not(F[1])), u1(Not(F[2])))))];
	case 0x4018: return [(_pfxLength + 4),Mov(u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24))))), F[3])];
	case 0x4019: return [(_pfxLength + 4),Mov(u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24))))), u1(Not(F[3])))];
	case 0x401a: return [(_pfxLength + 4),Mov(u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24))))), F[4])];
	case 0x401b: return [(_pfxLength + 4),Mov(u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24))))), u1(Not(F[4])))];
	case 0x401c: return [(_pfxLength + 4),Mov(u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24))))), u1(Not(Eq(F[0], F[3]))))];
	case 0x401d: return [(_pfxLength + 4),Mov(u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24))))), Eq(F[0], F[3]))];
	case 0x401e: return [(_pfxLength + 4),Mov(u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24))))), u1(Or(F[2], u1(Not(Eq(F[0], F[3]))))))];
	case 0x401f: return [(_pfxLength + 4),Mov(u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24))))), u1(And(u1(Not(F[2])), Eq(F[0], F[3]))))];
	case 0x4023: return [(_pfxLength + 4),Mov(F[1], u1(Not(Eq(And(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24))))), LSL(1, R_[32][(((b[i+2] & 0x38)>>>3))])), 0))))];
	case 0x402b: return [(_pfxLength + 4),Mov(F[1], u1(Not(Eq(And(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24)))))), LSL(1, R_[32][(((b[i+2] & 0x38)>>>3))])), 0)))),Mov($0, Or($0, LSL(1, R_[32][(((b[i+2] & 0x38)>>>3))])))];
	case 0x2c: return [(_pfxLength + 4),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+2] & 0x7))]))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, ($1 = (((b[i+3])<<24)>>24)))), u32(And(R_[32][(((b[i+2] & 0x38)>>>3))], (($38 = ((($37 = ((($36 = (1 << $1)&~0), ($36 < 0 ? $36+0x100000000 : $36)) + -1)&~0), ($37 < 0 ? $37+0x100000000 : $37)) << (((((-$1<<24)>>24) + 32)<<24)>>24))&~0), ($38 < 0 ? $38+0x100000000 : $38))))))];
	case 0xc02c: return [(_pfxLength + 4),Mov(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+2] & 0x7))], Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSR(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+2] & 0x7))], ($0 = (((b[i+3])<<24)>>24)))), u32(And(R_[32][(((b[i+2] & 0x38)>>>3))], (($86 = ((($85 = ((($84 = (1 << $0)&~0), ($84 < 0 ? $84+0x100000000 : $84)) + -1)&~0), ($85 < 0 ? $85+0x100000000 : $85)) << (((((-$0<<24)>>24) + 32)<<24)>>24))&~0), ($86 < 0 ? $86+0x100000000 : $86))))))];
	case 0x402d: return [(_pfxLength + 4),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24)))))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, R_[8][1])), u32(And(R_[32][(((b[i+2] & 0x38)>>>3))], u32(LSL(u32(Add(u32(LSL(1, R_[8][1])), -1)), i8(Add(i8(Neg(R_[8][1])), 32))))))))];
	case 0x402f: return [(_pfxLength + 4),Mov(($0 = i32(R_[32][(((b[i+2] & 0x38)>>>3))])), Mul($0, int[(_pfxSizeSpecifier ? 16 : 32)](uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24))))))))];
	case 0x4036: return [(_pfxLength + 4),Mov(R_[32][(((b[i+2] & 0x38)>>>3))], u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24))))))];
	case 0x4037: return [(_pfxLength + 4),Mov(R_[32][(((b[i+2] & 0x38)>>>3))], u16(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24))))))];
	case 0x403e: return [(_pfxLength + 4),Mov(R_[32][(((b[i+2] & 0x38)>>>3))], i32(u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24)))))))];
	case 0x403f: return [(_pfxLength + 4),Mov(R_[32][(((b[i+2] & 0x38)>>>3))], i32(u16(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], (((b[i+3])<<24)>>24)))))))];
	}
if(((((b[i+0] & 0x80)>>>7)|(b[i+1]<<1)|((b[i+2] & 0x3f)<<9)) & 0x718f) == 0x4009)
	switch((b[i+0]|((b[i+1] & 0x3f)<<8)) & 0x387f) {
	case 0xf: return [(_pfxLength + 3),Mov(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+2] & 0x7))])), uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][4]))),Mov(R_[32][4], Add(R_[32][4], ((_pfxSizeSpecifier ? 16 : 32) >>> 3)))];
	case 0x50: return [(_pfxLength + 3),Mov(($0 = u8(Mem(R_[32][((b[i+2] & 0x7))]))), u8(Or(u8(LSL($0, 1)), u8(LSR($0, 7)))))];
	case 0x51: return [(_pfxLength + 3),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+2] & 0x7))]))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, 1)), uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, ((_pfxSizeSpecifier ? 16 : 32) + -1)))))];
	case 0x52: return [(_pfxLength + 3),Mov(($0 = u8(Mem(R_[32][((b[i+2] & 0x7))]))), u8(Or(u8(LSL($0, R_[8][1])), u8(LSR($0, i8(Add(i8(Neg(R_[8][1])), 8)))))))];
	case 0x53: return [(_pfxLength + 3),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+2] & 0x7))]))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, R_[8][1])), uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, Add((_pfxSizeSpecifier ? 16 : 32), i8(Neg(R_[8][1])))))))];
	case 0x850: return [(_pfxLength + 3),Mov(($0 = u8(Mem(R_[32][((b[i+2] & 0x7))]))), u8(Or(u8(LSR($0, 1)), u8(LSL($0, 7)))))];
	case 0x851: return [(_pfxLength + 3),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+2] & 0x7))]))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, 1)), uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, ((_pfxSizeSpecifier ? 16 : 32) + -1)))))];
	case 0x852: return [(_pfxLength + 3),Mov(($0 = u8(Mem(R_[32][((b[i+2] & 0x7))]))), u8(Or(u8(LSR($0, R_[8][1])), u8(LSL($0, i8(Add(i8(Neg(R_[8][1])), 8)))))))];
	case 0x853: return [(_pfxLength + 3),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+2] & 0x7))]))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, R_[8][1])), uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, Add((_pfxSizeSpecifier ? 16 : 32), i8(Neg(R_[8][1])))))))];
	case 0x2050: return [(_pfxLength + 3),Mov(($0 = u8(Mem(R_[32][((b[i+2] & 0x7))]))), u8(LSL($0, 1)))];
	case 0x2051: return [(_pfxLength + 3),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+2] & 0x7))]))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, 1)))];
	case 0x2052: return [(_pfxLength + 3),Mov(($0 = u8(Mem(R_[32][((b[i+2] & 0x7))]))), u8(LSL($0, R_[8][1])))];
	case 0x2053: return [(_pfxLength + 3),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+2] & 0x7))]))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, R_[8][1])))];
	case 0x2850: return [(_pfxLength + 3),Mov(($0 = u8(Mem(R_[32][((b[i+2] & 0x7))]))), u8(LSR($0, 1)))];
	case 0x2851: return [(_pfxLength + 3),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+2] & 0x7))]))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, 1)))];
	case 0x2852: return [(_pfxLength + 3),Mov(($0 = u8(Mem(R_[32][((b[i+2] & 0x7))]))), u8(LSR($0, R_[8][1])))];
	case 0x2853: return [(_pfxLength + 3),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+2] & 0x7))]))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, R_[8][1])))];
	case 0x3850: return [(_pfxLength + 3),Mov(($0 = u8(Mem(R_[32][((b[i+2] & 0x7))]))), u8(ASR($0, 1)))];
	case 0x3851: return [(_pfxLength + 3),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+2] & 0x7))]))), uint[(_pfxSizeSpecifier ? 16 : 32)](ASR($0, 1)))];
	case 0x3852: return [(_pfxLength + 3),Mov(($0 = u8(Mem(R_[32][((b[i+2] & 0x7))]))), u8(ASR($0, R_[8][1])))];
	case 0x3853: return [(_pfxLength + 3),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+2] & 0x7))]))), uint[(_pfxSizeSpecifier ? 16 : 32)](ASR($0, R_[8][1])))];
	case 0x1076: return [(_pfxLength + 3),Mov(($0 = u8(Mem(R_[32][((b[i+2] & 0x7))]))), u8(Not($0)))];
	case 0x1077: return [(_pfxLength + 3),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+2] & 0x7))]))), uint[(_pfxSizeSpecifier ? 16 : 32)](Not($0)))];
	case 0x1876: return [(_pfxLength + 3),Mov(F[1], u1(Not(Eq(($0 = u8(Mem(R_[32][((b[i+2] & 0x7))]))), 0)))),Mov($0, i8(Neg($0)))];
	case 0x1877: return [(_pfxLength + 3),Mov(F[1], u1(Not(Eq(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+2] & 0x7))]))), 0)))),Mov($0, int[(_pfxSizeSpecifier ? 16 : 32)](Neg($0)))];
	case 0x2076: return [(_pfxLength + 3),Mov(R_[16][0], u8(Mul(R_[8][0], u8(Mem(R_[32][((b[i+2] & 0x7))])))))];
	case 0x2077: return [(_pfxLength + 3),Mov(R_[32][0], Mul(R_[32][0], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+2] & 0x7))]))))];
	case 0x2876: return [(_pfxLength + 3),Mov(R_[16][0], u8(Mul(R_[8][0], u8(Mem(R_[32][((b[i+2] & 0x7))])))))];
	case 0x2877: return [(_pfxLength + 3),Mov(R_[32][0], Mul(R_[32][0], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+2] & 0x7))]))))];
	case 0x3076: return [(_pfxLength + 3),Mov(R_[16][0], u8(Div(R_[8][0], u8(Mem(R_[32][((b[i+2] & 0x7))])))))];
	case 0x3077: return [(_pfxLength + 3),Mov(R_[32][0], Div(R_[32][0], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+2] & 0x7))]))))];
	case 0x3876: return [(_pfxLength + 3),Mov(R_[16][0], u8(Div(R_[8][0], u8(Mem(R_[32][((b[i+2] & 0x7))])))))];
	case 0x3877: return [(_pfxLength + 3),Mov(R_[32][0], Div(R_[32][0], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+2] & 0x7))]))))];
	case 0x7e: return [(_pfxLength + 3),Mov(($0 = u8(Mem(R_[32][((b[i+2] & 0x7))]))), u8(Add($0, 1)))];
	case 0x7f: return [(_pfxLength + 3),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+2] & 0x7))]))), Add($0, 1))];
	case 0x87e: return [(_pfxLength + 3),Mov(($0 = u8(Mem(R_[32][((b[i+2] & 0x7))]))), u8(Add($0, -1)))];
	case 0x87f: return [(_pfxLength + 3),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+2] & 0x7))]))), Add($0, -1))];
	case 0x107f: return [(_pfxLength + 3),Mov(R_[32][4], u32(Add(R_[32][4], -4))),Mov(u32(Mem(R_[32][4])), u32(Add(R_[32][8], (_pfxLength + 3)))),Mov(R_[32][8], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+2] & 0x7))])))];
	case 0x207f: return [(_pfxLength + 3),Mov(R_[32][8], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+2] & 0x7))])))];
	case 0x307f: return [(_pfxLength + 3),Mov(R_[32][4], Add(R_[32][4], -($0 = ((_pfxSizeSpecifier ? 16 : 32) >>> 3)))),Mov(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][4])), uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+2] & 0x7))])))];
	}
if(((((b[i+0] & 0xc0)>>>6)|(b[i+1]<<2)|((b[i+2] & 0x3f)<<10)) & 0xe31d) == 0x8010)
	switch((b[i+0]) & 0xbf) {
	case 0x0: return [(_pfxLength + 3),Mov(($0 = u8(Mem(R_[32][((b[i+2] & 0x7))]))), u8(Add($0, R_[8][(((b[i+1] & 0x38)>>>3))])))];
	case 0x1: return [(_pfxLength + 3),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+2] & 0x7))]))), Add($0, R_[32][(((b[i+1] & 0x38)>>>3))]))];
	case 0x2: return [(_pfxLength + 3),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Add(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Mem(R_[32][((b[i+2] & 0x7))])))))];
	case 0x3: return [(_pfxLength + 3),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Add(R_[32][(((b[i+1] & 0x38)>>>3))], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+2] & 0x7))]))))];
	case 0x8: return [(_pfxLength + 3),Mov(($0 = u8(Mem(R_[32][((b[i+2] & 0x7))]))), u8(Or($0, R_[8][(((b[i+1] & 0x38)>>>3))])))];
	case 0x9: return [(_pfxLength + 3),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+2] & 0x7))]))), Or($0, R_[32][(((b[i+1] & 0x38)>>>3))]))];
	case 0xa: return [(_pfxLength + 3),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Or(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Mem(R_[32][((b[i+2] & 0x7))])))))];
	case 0xb: return [(_pfxLength + 3),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Or(R_[32][(((b[i+1] & 0x38)>>>3))], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+2] & 0x7))]))))];
	case 0x10: return [(_pfxLength + 3),Mov(($0 = u8(Mem(R_[32][((b[i+2] & 0x7))]))), u8(Add($0, u8(Add(R_[8][(((b[i+1] & 0x38)>>>3))], u8(F[1]))))))];
	case 0x11: return [(_pfxLength + 3),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+2] & 0x7))]))), Add($0, Add(R_[32][(((b[i+1] & 0x38)>>>3))], uint[(_pfxSizeSpecifier ? 16 : 32)](F[1]))))];
	case 0x12: return [(_pfxLength + 3),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Add(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Add(u8(Mem(R_[32][((b[i+2] & 0x7))])), u8(F[1]))))))];
	case 0x13: return [(_pfxLength + 3),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Add(R_[32][(((b[i+1] & 0x38)>>>3))], Add(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+2] & 0x7))])), u32(F[1]))))];
	case 0x18: return [(_pfxLength + 3),Mov(($0 = u8(Mem(R_[32][((b[i+2] & 0x7))]))), u8(Add(($1 = u8(Add($0, i8(Neg(R_[8][(((b[i+1] & 0x38)>>>3))]))))), i8(Neg(($2 = u8(F[1])))))))];
	case 0x19: return [(_pfxLength + 3),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+2] & 0x7))]))), Add(($1 = Add($0, i32(Neg(R_[32][(((b[i+1] & 0x38)>>>3))])))), int[(_pfxSizeSpecifier ? 16 : 32)](Neg(($2 = uint[(_pfxSizeSpecifier ? 16 : 32)](F[1]))))))];
	case 0x1a: return [(_pfxLength + 3),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Add(($0 = u8(Add(R_[8][(((b[i+1] & 0x38)>>>3))], i8(Neg(($1 = u8(Mem(R_[32][((b[i+2] & 0x7))])))))))), i8(Neg(($2 = u8(F[1])))))))];
	case 0x1b: return [(_pfxLength + 3),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Add(($0 = Add(R_[32][(((b[i+1] & 0x38)>>>3))], int[(_pfxSizeSpecifier ? 16 : 32)](Neg(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+2] & 0x7))]))))))), i32(Neg(($2 = u32(F[1]))))))];
	case 0x20: return [(_pfxLength + 3),Mov(($0 = u8(Mem(R_[32][((b[i+2] & 0x7))]))), u8(And($0, R_[8][(((b[i+1] & 0x38)>>>3))])))];
	case 0x21: return [(_pfxLength + 3),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+2] & 0x7))]))), And($0, R_[32][(((b[i+1] & 0x38)>>>3))]))];
	case 0x22: return [(_pfxLength + 3),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(And(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Mem(R_[32][((b[i+2] & 0x7))])))))];
	case 0x23: return [(_pfxLength + 3),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], And(R_[32][(((b[i+1] & 0x38)>>>3))], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+2] & 0x7))]))))];
	case 0x28: return [(_pfxLength + 3),Mov(F[2], Eq(($0 = u8(Mem(R_[32][((b[i+2] & 0x7))]))), R_[8][(((b[i+1] & 0x38)>>>3))])),Mov(F[1], Lt($0, R_[8][(((b[i+1] & 0x38)>>>3))])),Mov($0, u8(Add($0, i8(Neg(R_[8][(((b[i+1] & 0x38)>>>3))])))))];
	case 0x29: return [(_pfxLength + 3),Mov(F[2], Eq(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+2] & 0x7))]))), R_[32][(((b[i+1] & 0x38)>>>3))])),Mov(F[1], Lt($0, R_[32][(((b[i+1] & 0x38)>>>3))])),Mov($0, Add($0, i32(Neg(R_[32][(((b[i+1] & 0x38)>>>3))]))))];
	case 0x2a: return [(_pfxLength + 3),Mov(F[2], Eq(R_[8][(((b[i+1] & 0x38)>>>3))], ($0 = u8(Mem(R_[32][((b[i+2] & 0x7))]))))),Mov(F[1], Lt(R_[8][(((b[i+1] & 0x38)>>>3))], $0)),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Add(R_[8][(((b[i+1] & 0x38)>>>3))], i8(Neg($0)))))];
	case 0x2b: return [(_pfxLength + 3),Mov(F[2], Eq(R_[32][(((b[i+1] & 0x38)>>>3))], ($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+2] & 0x7))]))))),Mov(F[1], Lt(R_[32][(((b[i+1] & 0x38)>>>3))], $0)),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Add(R_[32][(((b[i+1] & 0x38)>>>3))], int[(_pfxSizeSpecifier ? 16 : 32)](Neg($0))))];
	case 0x30: return [(_pfxLength + 3),Mov(($0 = u8(Mem(R_[32][((b[i+2] & 0x7))]))), u8(Xor($0, R_[8][(((b[i+1] & 0x38)>>>3))])))];
	case 0x31: return [(_pfxLength + 3),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+2] & 0x7))]))), Xor($0, R_[32][(((b[i+1] & 0x38)>>>3))]))];
	case 0x32: return [(_pfxLength + 3),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Xor(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Mem(R_[32][((b[i+2] & 0x7))])))))];
	case 0x33: return [(_pfxLength + 3),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Xor(R_[32][(((b[i+1] & 0x38)>>>3))], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+2] & 0x7))]))))];
	case 0x38: return [(_pfxLength + 3),Mov(F[2], Eq(($0 = u8(Mem(R_[32][((b[i+2] & 0x7))]))), R_[8][(((b[i+1] & 0x38)>>>3))])),Mov(F[1], Lt($0, R_[8][(((b[i+1] & 0x38)>>>3))]))];
	case 0x39: return [(_pfxLength + 3),Mov(F[2], Eq(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+2] & 0x7))]))), R_[32][(((b[i+1] & 0x38)>>>3))])),Mov(F[1], Lt($0, R_[32][(((b[i+1] & 0x38)>>>3))]))];
	case 0x3a: return [(_pfxLength + 3),Mov(F[2], Eq(R_[8][(((b[i+1] & 0x38)>>>3))], ($0 = u8(Mem(R_[32][((b[i+2] & 0x7))]))))),Mov(F[1], Lt(R_[8][(((b[i+1] & 0x38)>>>3))], $0))];
	case 0x3b: return [(_pfxLength + 3),Mov(F[2], Eq(R_[32][(((b[i+1] & 0x38)>>>3))], ($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+2] & 0x7))]))))),Mov(F[1], Lt(R_[32][(((b[i+1] & 0x38)>>>3))], $0))];
	case 0x84: return [(_pfxLength + 3),Mov(F[2], Eq(And(u8(Mem(R_[32][((b[i+2] & 0x7))])), R_[8][(((b[i+1] & 0x38)>>>3))]), 0)),Mov(F[1], 0),Mov(F[0], 0)];
	case 0x85: return [(_pfxLength + 3),Mov(F[2], Eq(And(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+2] & 0x7))])), R_[32][(((b[i+1] & 0x38)>>>3))]), 0)),Mov(F[1], 0),Mov(F[0], 0)];
	case 0x86: return [(_pfxLength + 3),Swap(u8(Mem(R_[32][((b[i+2] & 0x7))])), R_[8][(((b[i+1] & 0x38)>>>3))])];
	case 0x87: return [(_pfxLength + 3),Swap(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+2] & 0x7))])), R_[32][(((b[i+1] & 0x38)>>>3))])];
	case 0x88: return [(_pfxLength + 3),Mov(u8(Mem(R_[32][((b[i+2] & 0x7))])), R_[8][(((b[i+1] & 0x38)>>>3))])];
	case 0x89: return [(_pfxLength + 3),Mov(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+2] & 0x7))])), R_[32][(((b[i+1] & 0x38)>>>3))])];
	case 0x8a: return [(_pfxLength + 3),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Mem(R_[32][((b[i+2] & 0x7))])))];
	case 0x8b: return [(_pfxLength + 3),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+2] & 0x7))])))];
	case 0x8c: return [(_pfxLength + 3),Mov(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+2] & 0x7))])), R_.S[(((b[i+1] & 0x38)>>>3))])];
	case 0x8d: return [(_pfxLength + 3),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], R_[32][((b[i+2] & 0x7))])];
	case 0x8e: return [(_pfxLength + 3),Mov(R_.S[(((b[i+1] & 0x38)>>>3))], u16(Mem(R_[32][((b[i+2] & 0x7))])))];
	}
if(((((b[i+0] & 0x80)>>>7)|(b[i+1]<<1)) & 0x18f) == 0x9)
	switch((b[i+0]|((b[i+1] & 0x3f)<<8)) & 0x387f) {
	case 0xf: return [(_pfxLength + 3),Mov(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))))), uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][4]))),Mov(R_[32][4], Add(R_[32][4], ((_pfxSizeSpecifier ? 16 : 32) >>> 3)))];
	case 0x50: return [(_pfxLength + 3),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))))))))), u8(Or(u8(LSL($0, 1)), u8(LSR($0, 7)))))];
	case 0x51: return [(_pfxLength + 3),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))))))))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, 1)), uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, ((_pfxSizeSpecifier ? 16 : 32) + -1)))))];
	case 0x52: return [(_pfxLength + 3),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))))))))), u8(Or(u8(LSL($0, R_[8][1])), u8(LSR($0, i8(Add(i8(Neg(R_[8][1])), 8)))))))];
	case 0x53: return [(_pfxLength + 3),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))))))))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, R_[8][1])), uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, Add((_pfxSizeSpecifier ? 16 : 32), i8(Neg(R_[8][1])))))))];
	case 0x850: return [(_pfxLength + 3),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))))))))), u8(Or(u8(LSR($0, 1)), u8(LSL($0, 7)))))];
	case 0x851: return [(_pfxLength + 3),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))))))))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, 1)), uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, ((_pfxSizeSpecifier ? 16 : 32) + -1)))))];
	case 0x852: return [(_pfxLength + 3),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))))))))), u8(Or(u8(LSR($0, R_[8][1])), u8(LSL($0, i8(Add(i8(Neg(R_[8][1])), 8)))))))];
	case 0x853: return [(_pfxLength + 3),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))))))))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, R_[8][1])), uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, Add((_pfxSizeSpecifier ? 16 : 32), i8(Neg(R_[8][1])))))))];
	case 0x2050: return [(_pfxLength + 3),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))))))))), u8(LSL($0, 1)))];
	case 0x2051: return [(_pfxLength + 3),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))))))))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, 1)))];
	case 0x2052: return [(_pfxLength + 3),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))))))))), u8(LSL($0, R_[8][1])))];
	case 0x2053: return [(_pfxLength + 3),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))))))))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, R_[8][1])))];
	case 0x2850: return [(_pfxLength + 3),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))))))))), u8(LSR($0, 1)))];
	case 0x2851: return [(_pfxLength + 3),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))))))))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, 1)))];
	case 0x2852: return [(_pfxLength + 3),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))))))))), u8(LSR($0, R_[8][1])))];
	case 0x2853: return [(_pfxLength + 3),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))))))))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, R_[8][1])))];
	case 0x3850: return [(_pfxLength + 3),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))))))))), u8(ASR($0, 1)))];
	case 0x3851: return [(_pfxLength + 3),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))))))))), uint[(_pfxSizeSpecifier ? 16 : 32)](ASR($0, 1)))];
	case 0x3852: return [(_pfxLength + 3),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))))))))), u8(ASR($0, R_[8][1])))];
	case 0x3853: return [(_pfxLength + 3),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))))))))), uint[(_pfxSizeSpecifier ? 16 : 32)](ASR($0, R_[8][1])))];
	case 0x1076: return [(_pfxLength + 3),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))))))))), u8(Not($0)))];
	case 0x1077: return [(_pfxLength + 3),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))))))))), uint[(_pfxSizeSpecifier ? 16 : 32)](Not($0)))];
	case 0x1876: return [(_pfxLength + 3),Mov(F[1], u1(Not(Eq(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))))))))), 0)))),Mov($0, i8(Neg($0)))];
	case 0x1877: return [(_pfxLength + 3),Mov(F[1], u1(Not(Eq(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))))))))), 0)))),Mov($0, int[(_pfxSizeSpecifier ? 16 : 32)](Neg($0)))];
	case 0x2076: return [(_pfxLength + 3),Mov(R_[16][0], u8(Mul(R_[8][0], u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))))))))];
	case 0x2077: return [(_pfxLength + 3),Mov(R_[32][0], Mul(R_[32][0], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))))))))))];
	case 0x2876: return [(_pfxLength + 3),Mov(R_[16][0], u8(Mul(R_[8][0], u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))))))))];
	case 0x2877: return [(_pfxLength + 3),Mov(R_[32][0], Mul(R_[32][0], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))))))))))];
	case 0x3076: return [(_pfxLength + 3),Mov(R_[16][0], u8(Div(R_[8][0], u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))))))))];
	case 0x3077: return [(_pfxLength + 3),Mov(R_[32][0], Div(R_[32][0], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))))))))))];
	case 0x3876: return [(_pfxLength + 3),Mov(R_[16][0], u8(Div(R_[8][0], u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))))))))];
	case 0x3877: return [(_pfxLength + 3),Mov(R_[32][0], Div(R_[32][0], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))))))))))];
	case 0x7e: return [(_pfxLength + 3),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))))))))), u8(Add($0, 1)))];
	case 0x7f: return [(_pfxLength + 3),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))))))))), Add($0, 1))];
	case 0x87e: return [(_pfxLength + 3),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))))))))), u8(Add($0, -1)))];
	case 0x87f: return [(_pfxLength + 3),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))))))))), Add($0, -1))];
	case 0x107f: return [(_pfxLength + 3),Mov(R_[32][4], u32(Add(R_[32][4], -4))),Mov(u32(Mem(R_[32][4])), u32(Add(R_[32][8], (_pfxLength + 3)))),Mov(R_[32][8], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))))))];
	case 0x207f: return [(_pfxLength + 3),Mov(R_[32][8], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))))))];
	case 0x307f: return [(_pfxLength + 3),Mov(R_[32][4], Add(R_[32][4], -($0 = ((_pfxSizeSpecifier ? 16 : 32) >>> 3)))),Mov(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][4])), uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))))))];
	}
if(((((b[i+0] & 0xc0)>>>6)|(b[i+1]<<2)) & 0x31d) == 0x10)
	switch((b[i+0]) & 0xbf) {
	case 0x0: return [(_pfxLength + 3),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))))))))), u8(Add($0, R_[8][(((b[i+1] & 0x38)>>>3))])))];
	case 0x1: return [(_pfxLength + 3),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))))))))), Add($0, R_[32][(((b[i+1] & 0x38)>>>3))]))];
	case 0x2: return [(_pfxLength + 3),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Add(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))))))))];
	case 0x3: return [(_pfxLength + 3),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Add(R_[32][(((b[i+1] & 0x38)>>>3))], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))))))))))];
	case 0x8: return [(_pfxLength + 3),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))))))))), u8(Or($0, R_[8][(((b[i+1] & 0x38)>>>3))])))];
	case 0x9: return [(_pfxLength + 3),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))))))))), Or($0, R_[32][(((b[i+1] & 0x38)>>>3))]))];
	case 0xa: return [(_pfxLength + 3),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Or(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))))))))];
	case 0xb: return [(_pfxLength + 3),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Or(R_[32][(((b[i+1] & 0x38)>>>3))], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))))))))))];
	case 0x10: return [(_pfxLength + 3),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))))))))), u8(Add($0, u8(Add(R_[8][(((b[i+1] & 0x38)>>>3))], u8(F[1]))))))];
	case 0x11: return [(_pfxLength + 3),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))))))))), Add($0, Add(R_[32][(((b[i+1] & 0x38)>>>3))], uint[(_pfxSizeSpecifier ? 16 : 32)](F[1]))))];
	case 0x12: return [(_pfxLength + 3),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Add(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Add(u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))))), u8(F[1]))))))];
	case 0x13: return [(_pfxLength + 3),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Add(R_[32][(((b[i+1] & 0x38)>>>3))], Add(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))))), u32(F[1]))))];
	case 0x18: return [(_pfxLength + 3),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))))))))), u8(Add(($1 = u8(Add($0, i8(Neg(R_[8][(((b[i+1] & 0x38)>>>3))]))))), i8(Neg(($2 = u8(F[1])))))))];
	case 0x19: return [(_pfxLength + 3),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))))))))), Add(($1 = Add($0, i32(Neg(R_[32][(((b[i+1] & 0x38)>>>3))])))), int[(_pfxSizeSpecifier ? 16 : 32)](Neg(($2 = uint[(_pfxSizeSpecifier ? 16 : 32)](F[1]))))))];
	case 0x1a: return [(_pfxLength + 3),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Add(($0 = u8(Add(R_[8][(((b[i+1] & 0x38)>>>3))], i8(Neg(($1 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))))))))))), i8(Neg(($2 = u8(F[1])))))))];
	case 0x1b: return [(_pfxLength + 3),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Add(($0 = Add(R_[32][(((b[i+1] & 0x38)>>>3))], int[(_pfxSizeSpecifier ? 16 : 32)](Neg(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))))))))))))), i32(Neg(($2 = u32(F[1]))))))];
	case 0x20: return [(_pfxLength + 3),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))))))))), u8(And($0, R_[8][(((b[i+1] & 0x38)>>>3))])))];
	case 0x21: return [(_pfxLength + 3),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))))))))), And($0, R_[32][(((b[i+1] & 0x38)>>>3))]))];
	case 0x22: return [(_pfxLength + 3),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(And(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))))))))];
	case 0x23: return [(_pfxLength + 3),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], And(R_[32][(((b[i+1] & 0x38)>>>3))], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))))))))))];
	case 0x28: return [(_pfxLength + 3),Mov(F[2], Eq(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))))))))), R_[8][(((b[i+1] & 0x38)>>>3))])),Mov(F[1], Lt($0, R_[8][(((b[i+1] & 0x38)>>>3))])),Mov($0, u8(Add($0, i8(Neg(R_[8][(((b[i+1] & 0x38)>>>3))])))))];
	case 0x29: return [(_pfxLength + 3),Mov(F[2], Eq(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))))))))), R_[32][(((b[i+1] & 0x38)>>>3))])),Mov(F[1], Lt($0, R_[32][(((b[i+1] & 0x38)>>>3))])),Mov($0, Add($0, i32(Neg(R_[32][(((b[i+1] & 0x38)>>>3))]))))];
	case 0x2a: return [(_pfxLength + 3),Mov(F[2], Eq(R_[8][(((b[i+1] & 0x38)>>>3))], ($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))))))))))),Mov(F[1], Lt(R_[8][(((b[i+1] & 0x38)>>>3))], $0)),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Add(R_[8][(((b[i+1] & 0x38)>>>3))], i8(Neg($0)))))];
	case 0x2b: return [(_pfxLength + 3),Mov(F[2], Eq(R_[32][(((b[i+1] & 0x38)>>>3))], ($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))))))))))),Mov(F[1], Lt(R_[32][(((b[i+1] & 0x38)>>>3))], $0)),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Add(R_[32][(((b[i+1] & 0x38)>>>3))], int[(_pfxSizeSpecifier ? 16 : 32)](Neg($0))))];
	case 0x30: return [(_pfxLength + 3),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))))))))), u8(Xor($0, R_[8][(((b[i+1] & 0x38)>>>3))])))];
	case 0x31: return [(_pfxLength + 3),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))))))))), Xor($0, R_[32][(((b[i+1] & 0x38)>>>3))]))];
	case 0x32: return [(_pfxLength + 3),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Xor(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))))))))];
	case 0x33: return [(_pfxLength + 3),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Xor(R_[32][(((b[i+1] & 0x38)>>>3))], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))))))))))];
	case 0x38: return [(_pfxLength + 3),Mov(F[2], Eq(($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))))))))), R_[8][(((b[i+1] & 0x38)>>>3))])),Mov(F[1], Lt($0, R_[8][(((b[i+1] & 0x38)>>>3))]))];
	case 0x39: return [(_pfxLength + 3),Mov(F[2], Eq(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))))))))), R_[32][(((b[i+1] & 0x38)>>>3))])),Mov(F[1], Lt($0, R_[32][(((b[i+1] & 0x38)>>>3))]))];
	case 0x3a: return [(_pfxLength + 3),Mov(F[2], Eq(R_[8][(((b[i+1] & 0x38)>>>3))], ($0 = u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))))))))))),Mov(F[1], Lt(R_[8][(((b[i+1] & 0x38)>>>3))], $0))];
	case 0x3b: return [(_pfxLength + 3),Mov(F[2], Eq(R_[32][(((b[i+1] & 0x38)>>>3))], ($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))))))))))),Mov(F[1], Lt(R_[32][(((b[i+1] & 0x38)>>>3))], $0))];
	case 0x84: return [(_pfxLength + 3),Mov(F[2], Eq(And(u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))))), R_[8][(((b[i+1] & 0x38)>>>3))]), 0)),Mov(F[1], 0),Mov(F[0], 0)];
	case 0x85: return [(_pfxLength + 3),Mov(F[2], Eq(And(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))))), R_[32][(((b[i+1] & 0x38)>>>3))]), 0)),Mov(F[1], 0),Mov(F[0], 0)];
	case 0x86: return [(_pfxLength + 3),Swap(u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))))), R_[8][(((b[i+1] & 0x38)>>>3))])];
	case 0x87: return [(_pfxLength + 3),Swap(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))))), R_[32][(((b[i+1] & 0x38)>>>3))])];
	case 0x88: return [(_pfxLength + 3),Mov(u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))))), R_[8][(((b[i+1] & 0x38)>>>3))])];
	case 0x89: return [(_pfxLength + 3),Mov(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))))), R_[32][(((b[i+1] & 0x38)>>>3))])];
	case 0x8a: return [(_pfxLength + 3),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))))))];
	case 0x8b: return [(_pfxLength + 3),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))))))];
	case 0x8c: return [(_pfxLength + 3),Mov(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))))), R_.S[(((b[i+1] & 0x38)>>>3))])];
	case 0x8d: return [(_pfxLength + 3),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], ($0 = u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))))))))];
	case 0x8e: return [(_pfxLength + 3),Mov(R_.S[(((b[i+1] & 0x38)>>>3))], u16(Mem(u32(Add(R_[32][((b[i+2] & 0x7))], u32(LSL(R_[32][(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))))))];
	}
if(((b[i+0]|(b[i+1]<<8)) & 0xc0ff) == 0x800f)
	switch((b[i+1]|(b[i+2]<<8)) & 0xc03f) {
	case 0x10: return [(_pfxLength + 3),Mov(u8(Mem(R_[32][((b[i+2] & 0x7))])), F[0])];
	case 0xc010: return [(_pfxLength + 3),Mov(R_[8][((b[i+2] & 0x7))], F[0])];
	case 0x11: return [(_pfxLength + 3),Mov(u8(Mem(R_[32][((b[i+2] & 0x7))])), u1(Not(F[0])))];
	case 0xc011: return [(_pfxLength + 3),Mov(R_[8][((b[i+2] & 0x7))], u1(Not(F[0])))];
	case 0x12: return [(_pfxLength + 3),Mov(u8(Mem(R_[32][((b[i+2] & 0x7))])), F[1])];
	case 0xc012: return [(_pfxLength + 3),Mov(R_[8][((b[i+2] & 0x7))], F[1])];
	case 0x13: return [(_pfxLength + 3),Mov(u8(Mem(R_[32][((b[i+2] & 0x7))])), u1(Not(F[1])))];
	case 0xc013: return [(_pfxLength + 3),Mov(R_[8][((b[i+2] & 0x7))], u1(Not(F[1])))];
	case 0x14: return [(_pfxLength + 3),Mov(u8(Mem(R_[32][((b[i+2] & 0x7))])), F[2])];
	case 0xc014: return [(_pfxLength + 3),Mov(R_[8][((b[i+2] & 0x7))], F[2])];
	case 0x15: return [(_pfxLength + 3),Mov(u8(Mem(R_[32][((b[i+2] & 0x7))])), u1(Not(F[2])))];
	case 0xc015: return [(_pfxLength + 3),Mov(R_[8][((b[i+2] & 0x7))], u1(Not(F[2])))];
	case 0x16: return [(_pfxLength + 3),Mov(u8(Mem(R_[32][((b[i+2] & 0x7))])), u1(Or(F[1], F[2])))];
	case 0xc016: return [(_pfxLength + 3),Mov(R_[8][((b[i+2] & 0x7))], u1(Or(F[1], F[2])))];
	case 0x17: return [(_pfxLength + 3),Mov(u8(Mem(R_[32][((b[i+2] & 0x7))])), u1(And(u1(Not(F[1])), u1(Not(F[2])))))];
	case 0xc017: return [(_pfxLength + 3),Mov(R_[8][((b[i+2] & 0x7))], u1(And(u1(Not(F[1])), u1(Not(F[2])))))];
	case 0x18: return [(_pfxLength + 3),Mov(u8(Mem(R_[32][((b[i+2] & 0x7))])), F[3])];
	case 0xc018: return [(_pfxLength + 3),Mov(R_[8][((b[i+2] & 0x7))], F[3])];
	case 0x19: return [(_pfxLength + 3),Mov(u8(Mem(R_[32][((b[i+2] & 0x7))])), u1(Not(F[3])))];
	case 0xc019: return [(_pfxLength + 3),Mov(R_[8][((b[i+2] & 0x7))], u1(Not(F[3])))];
	case 0x1a: return [(_pfxLength + 3),Mov(u8(Mem(R_[32][((b[i+2] & 0x7))])), F[4])];
	case 0xc01a: return [(_pfxLength + 3),Mov(R_[8][((b[i+2] & 0x7))], F[4])];
	case 0x1b: return [(_pfxLength + 3),Mov(u8(Mem(R_[32][((b[i+2] & 0x7))])), u1(Not(F[4])))];
	case 0xc01b: return [(_pfxLength + 3),Mov(R_[8][((b[i+2] & 0x7))], u1(Not(F[4])))];
	case 0x1c: return [(_pfxLength + 3),Mov(u8(Mem(R_[32][((b[i+2] & 0x7))])), u1(Not(Eq(F[0], F[3]))))];
	case 0xc01c: return [(_pfxLength + 3),Mov(R_[8][((b[i+2] & 0x7))], u1(Not(Eq(F[0], F[3]))))];
	case 0x1d: return [(_pfxLength + 3),Mov(u8(Mem(R_[32][((b[i+2] & 0x7))])), Eq(F[0], F[3]))];
	case 0xc01d: return [(_pfxLength + 3),Mov(R_[8][((b[i+2] & 0x7))], Eq(F[0], F[3]))];
	case 0x1e: return [(_pfxLength + 3),Mov(u8(Mem(R_[32][((b[i+2] & 0x7))])), u1(Or(F[2], u1(Not(Eq(F[0], F[3]))))))];
	case 0xc01e: return [(_pfxLength + 3),Mov(R_[8][((b[i+2] & 0x7))], u1(Or(F[2], u1(Not(Eq(F[0], F[3]))))))];
	case 0x1f: return [(_pfxLength + 3),Mov(u8(Mem(R_[32][((b[i+2] & 0x7))])), u1(And(u1(Not(F[2])), Eq(F[0], F[3]))))];
	case 0xc01f: return [(_pfxLength + 3),Mov(R_[8][((b[i+2] & 0x7))], u1(And(u1(Not(F[2])), Eq(F[0], F[3]))))];
	case 0x23: return [(_pfxLength + 3),Mov(F[1], u1(Not(Eq(And(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+2] & 0x7))])), LSL(1, R_[32][(((b[i+2] & 0x38)>>>3))])), 0))))];
	case 0xc023: return [(_pfxLength + 3),Mov(F[1], u1(Not(Eq(And(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+2] & 0x7))], LSL(1, R_[32][(((b[i+2] & 0x38)>>>3))])), 0))))];
	case 0x2b: return [(_pfxLength + 3),Mov(F[1], u1(Not(Eq(And(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+2] & 0x7))]))), LSL(1, R_[32][(((b[i+2] & 0x38)>>>3))])), 0)))),Mov($0, Or($0, LSL(1, R_[32][(((b[i+2] & 0x38)>>>3))])))];
	case 0xc02b: return [(_pfxLength + 3),Mov(F[1], u1(Not(Eq(And(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+2] & 0x7))], LSL(1, R_[32][(((b[i+2] & 0x38)>>>3))])), 0)))),Mov(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+2] & 0x7))], Or(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+2] & 0x7))], LSL(1, R_[32][(((b[i+2] & 0x38)>>>3))])))];
	case 0x2d: return [(_pfxLength + 3),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+2] & 0x7))]))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, R_[8][1])), u32(And(R_[32][(((b[i+2] & 0x38)>>>3))], u32(LSL(u32(Add(u32(LSL(1, R_[8][1])), -1)), i8(Add(i8(Neg(R_[8][1])), 32))))))))];
	case 0xc02d: return [(_pfxLength + 3),Mov(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+2] & 0x7))], Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSR(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+2] & 0x7))], R_[8][1])), u32(And(R_[32][(((b[i+2] & 0x38)>>>3))], u32(LSL(u32(Add(u32(LSL(1, R_[8][1])), -1)), i8(Add(i8(Neg(R_[8][1])), 32))))))))];
	case 0x2f: return [(_pfxLength + 3),Mov(($0 = i32(R_[32][(((b[i+2] & 0x38)>>>3))])), Mul($0, int[(_pfxSizeSpecifier ? 16 : 32)](uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+2] & 0x7))])))))];
	case 0xc02f: return [(_pfxLength + 3),Mov(($0 = i32(R_[32][(((b[i+2] & 0x38)>>>3))])), Mul($0, int[(_pfxSizeSpecifier ? 16 : 32)](R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+2] & 0x7))])))];
	case 0x36: return [(_pfxLength + 3),Mov(R_[32][(((b[i+2] & 0x38)>>>3))], u8(Mem(R_[32][((b[i+2] & 0x7))])))];
	case 0xc036: return [(_pfxLength + 3),Mov(R_[32][(((b[i+2] & 0x38)>>>3))], R_[8][((b[i+2] & 0x7))])];
	case 0x37: return [(_pfxLength + 3),Mov(R_[32][(((b[i+2] & 0x38)>>>3))], u16(Mem(R_[32][((b[i+2] & 0x7))])))];
	case 0xc037: return [(_pfxLength + 3),Mov(R_[32][(((b[i+2] & 0x38)>>>3))], R_[16][((b[i+2] & 0x7))])];
	case 0x3e: return [(_pfxLength + 3),Mov(R_[32][(((b[i+2] & 0x38)>>>3))], i32(u8(Mem(R_[32][((b[i+2] & 0x7))]))))];
	case 0xc03e: return [(_pfxLength + 3),Mov(R_[32][(((b[i+2] & 0x38)>>>3))], i32(R_[8][((b[i+2] & 0x7))]))];
	case 0x3f: return [(_pfxLength + 3),Mov(R_[32][(((b[i+2] & 0x38)>>>3))], i32(u16(Mem(R_[32][((b[i+2] & 0x7))]))))];
	case 0xc03f: return [(_pfxLength + 3),Mov(R_[32][(((b[i+2] & 0x38)>>>3))], i32(R_[16][((b[i+2] & 0x7))]))];
	}
if(((b[i+0]) & 0xff) == 0xc2)
	switch(0) {
	case 0x0: return [(_pfxLength + 3),Mov(R_[32][8], u32(Mem(R_[32][4]))),Mov(R_[32][4], u32(Add(R_[32][4], 4))),Mov(R_[32][4], u32(Add(R_[32][4], (((b[i+1]|(b[i+2]<<8))<<16)>>16))))];
	}
if(((((b[i+0] & 0x80)>>>7)) & 0x1) == 0x1)
	switch((b[i+0]|(b[i+1]<<8)) & 0xf87f) {
	case 0x0: return [(_pfxLength + 3),Mov(($0 = u8(Mem(R_[32][((b[i+1] & 0x7))]))), u8(Add($0, (((b[i+2])<<24)>>24))))];
	case 0xc000: return [(_pfxLength + 3),Mov(R_[8][((b[i+1] & 0x7))], u8(Add(R_[8][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24))))];
	case 0x2: return [(_pfxLength + 3),Mov(($0 = u8(Mem(R_[32][((b[i+1] & 0x7))]))), u8(Add($0, (((b[i+2])<<24)>>24))))];
	case 0xc002: return [(_pfxLength + 3),Mov(R_[8][((b[i+1] & 0x7))], u8(Add(R_[8][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24))))];
	case 0x3: return [(_pfxLength + 3),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+1] & 0x7))]))), Add($0, (((b[i+2])<<24)>>24)))];
	case 0xc003: return [(_pfxLength + 3),Mov(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))], Add(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24)))];
	case 0x800: return [(_pfxLength + 3),Mov(($0 = u8(Mem(R_[32][((b[i+1] & 0x7))]))), u8(Or($0, ((((b[i+2])<<24)>>24)&0xff))))];
	case 0xc800: return [(_pfxLength + 3),Mov(R_[8][((b[i+1] & 0x7))], u8(Or(R_[8][((b[i+1] & 0x7))], ((((b[i+2])<<24)>>24)&0xff))))];
	case 0x802: return [(_pfxLength + 3),Mov(($0 = u8(Mem(R_[32][((b[i+1] & 0x7))]))), u8(Or($0, ((((b[i+2])<<24)>>24)&0xff))))];
	case 0xc802: return [(_pfxLength + 3),Mov(R_[8][((b[i+1] & 0x7))], u8(Or(R_[8][((b[i+1] & 0x7))], ((((b[i+2])<<24)>>24)&0xff))))];
	case 0x803: return [(_pfxLength + 3),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+1] & 0x7))]))), Or($0, uint[(_pfxSizeSpecifier ? 16 : 32)]((((b[i+2])<<24)>>24))))];
	case 0xc803: return [(_pfxLength + 3),Mov(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))], Or(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))], uint[(_pfxSizeSpecifier ? 16 : 32)]((((b[i+2])<<24)>>24))))];
	case 0x1000: return [(_pfxLength + 3),Mov(($0 = u8(Mem(R_[32][((b[i+1] & 0x7))]))), u8(Add($0, u8(Add((((b[i+2])<<24)>>24), u8(F[1]))))))];
	case 0xd000: return [(_pfxLength + 3),Mov(R_[8][((b[i+1] & 0x7))], u8(Add(R_[8][((b[i+1] & 0x7))], u8(Add((((b[i+2])<<24)>>24), u8(F[1]))))))];
	case 0x1002: return [(_pfxLength + 3),Mov(($0 = u8(Mem(R_[32][((b[i+1] & 0x7))]))), u8(Add($0, u8(Add((((b[i+2])<<24)>>24), u8(F[1]))))))];
	case 0xd002: return [(_pfxLength + 3),Mov(R_[8][((b[i+1] & 0x7))], u8(Add(R_[8][((b[i+1] & 0x7))], u8(Add((((b[i+2])<<24)>>24), u8(F[1]))))))];
	case 0x1003: return [(_pfxLength + 3),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+1] & 0x7))]))), Add($0, Add((((b[i+2])<<24)>>24), uint[(_pfxSizeSpecifier ? 16 : 32)](F[1]))))];
	case 0xd003: return [(_pfxLength + 3),Mov(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))], Add(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))], Add((((b[i+2])<<24)>>24), uint[(_pfxSizeSpecifier ? 16 : 32)](F[1]))))];
	case 0x1800: return [(_pfxLength + 3),Mov(($0 = u8(Mem(R_[32][((b[i+1] & 0x7))]))), u8(Add(($1 = u8(Add($0, ((-($2 = (((b[i+2])<<24)>>24))<<24)>>24)))), i8(Neg(($3 = u8(F[1])))))))];
	case 0xd800: return [(_pfxLength + 3),Mov(R_[8][((b[i+1] & 0x7))], u8(Add(($0 = u8(Add(R_[8][((b[i+1] & 0x7))], ((-($1 = (((b[i+2])<<24)>>24))<<24)>>24)))), i8(Neg(($2 = u8(F[1])))))))];
	case 0x1802: return [(_pfxLength + 3),Mov(($0 = u8(Mem(R_[32][((b[i+1] & 0x7))]))), u8(Add(($1 = u8(Add($0, ((-($2 = (((b[i+2])<<24)>>24))<<24)>>24)))), i8(Neg(($3 = u8(F[1])))))))];
	case 0xd802: return [(_pfxLength + 3),Mov(R_[8][((b[i+1] & 0x7))], u8(Add(($0 = u8(Add(R_[8][((b[i+1] & 0x7))], ((-($1 = (((b[i+2])<<24)>>24))<<24)>>24)))), i8(Neg(($2 = u8(F[1])))))))];
	case 0x1803: return [(_pfxLength + 3),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+1] & 0x7))]))), Add(($1 = Add($0, ((-($2 = (((b[i+2])<<24)>>24))<<24)>>24))), int[(_pfxSizeSpecifier ? 16 : 32)](Neg(($3 = uint[(_pfxSizeSpecifier ? 16 : 32)](F[1]))))))];
	case 0xd803: return [(_pfxLength + 3),Mov(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))], Add(($0 = Add(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))], ((-($1 = (((b[i+2])<<24)>>24))<<24)>>24))), int[(_pfxSizeSpecifier ? 16 : 32)](Neg(($2 = uint[(_pfxSizeSpecifier ? 16 : 32)](F[1]))))))];
	case 0x2000: return [(_pfxLength + 3),Mov(($0 = u8(Mem(R_[32][((b[i+1] & 0x7))]))), u8(And($0, ((((b[i+2])<<24)>>24)&0xff))))];
	case 0xe000: return [(_pfxLength + 3),Mov(R_[8][((b[i+1] & 0x7))], u8(And(R_[8][((b[i+1] & 0x7))], ((((b[i+2])<<24)>>24)&0xff))))];
	case 0x2002: return [(_pfxLength + 3),Mov(($0 = u8(Mem(R_[32][((b[i+1] & 0x7))]))), u8(And($0, ((((b[i+2])<<24)>>24)&0xff))))];
	case 0xe002: return [(_pfxLength + 3),Mov(R_[8][((b[i+1] & 0x7))], u8(And(R_[8][((b[i+1] & 0x7))], ((((b[i+2])<<24)>>24)&0xff))))];
	case 0x2003: return [(_pfxLength + 3),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+1] & 0x7))]))), And($0, uint[(_pfxSizeSpecifier ? 16 : 32)]((((b[i+2])<<24)>>24))))];
	case 0xe003: return [(_pfxLength + 3),Mov(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))], And(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))], uint[(_pfxSizeSpecifier ? 16 : 32)]((((b[i+2])<<24)>>24))))];
	case 0x2800: return [(_pfxLength + 3),Mov(F[2], Eq(($0 = u8(Mem(R_[32][((b[i+1] & 0x7))]))), ($1 = (((b[i+2])<<24)>>24)))),Mov(F[1], Lt($0, $1)),Mov($0, u8(Add($0, ((-$1<<24)>>24))))];
	case 0xe800: return [(_pfxLength + 3),Mov(F[2], Eq(R_[8][((b[i+1] & 0x7))], ($0 = (((b[i+2])<<24)>>24)))),Mov(F[1], Lt(R_[8][((b[i+1] & 0x7))], $0)),Mov(R_[8][((b[i+1] & 0x7))], u8(Add(R_[8][((b[i+1] & 0x7))], ((-$0<<24)>>24))))];
	case 0x2802: return [(_pfxLength + 3),Mov(F[2], Eq(($0 = u8(Mem(R_[32][((b[i+1] & 0x7))]))), ($1 = (((b[i+2])<<24)>>24)))),Mov(F[1], Lt($0, $1)),Mov($0, u8(Add($0, ((-$1<<24)>>24))))];
	case 0xe802: return [(_pfxLength + 3),Mov(F[2], Eq(R_[8][((b[i+1] & 0x7))], ($0 = (((b[i+2])<<24)>>24)))),Mov(F[1], Lt(R_[8][((b[i+1] & 0x7))], $0)),Mov(R_[8][((b[i+1] & 0x7))], u8(Add(R_[8][((b[i+1] & 0x7))], ((-$0<<24)>>24))))];
	case 0x2803: return [(_pfxLength + 3),Mov(F[2], Eq(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+1] & 0x7))]))), ($1 = (((b[i+2])<<24)>>24)))),Mov(F[1], Lt($0, $1)),Mov($0, Add($0, ((-$1<<24)>>24)))];
	case 0xe803: return [(_pfxLength + 3),Mov(F[2], Eq(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))], ($0 = (((b[i+2])<<24)>>24)))),Mov(F[1], Lt(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))], $0)),Mov(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))], Add(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))], ((-$0<<24)>>24)))];
	case 0x3000: return [(_pfxLength + 3),Mov(($0 = u8(Mem(R_[32][((b[i+1] & 0x7))]))), u8(Xor($0, (((b[i+2])<<24)>>24))))];
	case 0xf000: return [(_pfxLength + 3),Mov(R_[8][((b[i+1] & 0x7))], u8(Xor(R_[8][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24))))];
	case 0x3002: return [(_pfxLength + 3),Mov(($0 = u8(Mem(R_[32][((b[i+1] & 0x7))]))), u8(Xor($0, (((b[i+2])<<24)>>24))))];
	case 0xf002: return [(_pfxLength + 3),Mov(R_[8][((b[i+1] & 0x7))], u8(Xor(R_[8][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24))))];
	case 0x3003: return [(_pfxLength + 3),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+1] & 0x7))]))), Xor($0, (((b[i+2])<<24)>>24)))];
	case 0xf003: return [(_pfxLength + 3),Mov(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))], Xor(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24)))];
	case 0x3800: return [(_pfxLength + 3),Mov(F[2], Eq(($0 = u8(Mem(R_[32][((b[i+1] & 0x7))]))), ($1 = (((b[i+2])<<24)>>24)))),Mov(F[1], Lt($0, $1))];
	case 0xf800: return [(_pfxLength + 3),Mov(F[2], Eq(R_[8][((b[i+1] & 0x7))], ($0 = (((b[i+2])<<24)>>24)))),Mov(F[1], Lt(R_[8][((b[i+1] & 0x7))], $0))];
	case 0x3802: return [(_pfxLength + 3),Mov(F[2], Eq(($0 = u8(Mem(R_[32][((b[i+1] & 0x7))]))), ($1 = (((b[i+2])<<24)>>24)))),Mov(F[1], Lt($0, $1))];
	case 0xf802: return [(_pfxLength + 3),Mov(F[2], Eq(R_[8][((b[i+1] & 0x7))], ($0 = (((b[i+2])<<24)>>24)))),Mov(F[1], Lt(R_[8][((b[i+1] & 0x7))], $0))];
	case 0x3803: return [(_pfxLength + 3),Mov(F[2], Eq(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+1] & 0x7))]))), ($1 = (((b[i+2])<<24)>>24)))),Mov(F[1], Lt($0, $1))];
	case 0xf803: return [(_pfxLength + 3),Mov(F[2], Eq(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))], ($0 = (((b[i+2])<<24)>>24)))),Mov(F[1], Lt(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))], $0))];
	case 0x400f: return [(_pfxLength + 3),Mov(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24))))), uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][4]))),Mov(R_[32][4], Add(R_[32][4], ((_pfxSizeSpecifier ? 16 : 32) >>> 3)))];
	case 0x46: return [(_pfxLength + 3),Mov(u8(Mem(R_[32][((b[i+1] & 0x7))])), (((b[i+2])<<24)>>24))];
	case 0xc046: return [(_pfxLength + 3),Mov(R_[8][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24))];
	case 0x40: return [(_pfxLength + 3),Mov(($0 = u8(Mem(R_[32][((b[i+1] & 0x7))]))), u8(Or(u8(LSL($0, ($1 = (((b[i+2])<<24)>>24)))), u8(LSR($0, (((((-$1<<24)>>24) + 8)<<24)>>24))))))];
	case 0xc040: return [(_pfxLength + 3),Mov(R_[8][((b[i+1] & 0x7))], u8(Or(u8(LSL(R_[8][((b[i+1] & 0x7))], ($0 = (((b[i+2])<<24)>>24)))), u8(LSR(R_[8][((b[i+1] & 0x7))], (((((-$0<<24)>>24) + 8)<<24)>>24))))))];
	case 0x41: return [(_pfxLength + 3),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+1] & 0x7))]))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, ($1 = (((b[i+2])<<24)>>24)))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, ((_pfxSizeSpecifier ? 16 : 32) + ((-$1<<24)>>24))))))];
	case 0xc041: return [(_pfxLength + 3),Mov(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))], Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSL(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))], ($0 = (((b[i+2])<<24)>>24)))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSR(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))], ((_pfxSizeSpecifier ? 16 : 32) + ((-$0<<24)>>24))))))];
	case 0x4050: return [(_pfxLength + 3),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24)))))), u8(Or(u8(LSL($0, 1)), u8(LSR($0, 7)))))];
	case 0x4051: return [(_pfxLength + 3),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24)))))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, 1)), uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, ((_pfxSizeSpecifier ? 16 : 32) + -1)))))];
	case 0x4052: return [(_pfxLength + 3),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24)))))), u8(Or(u8(LSL($0, R_[8][1])), u8(LSR($0, i8(Add(i8(Neg(R_[8][1])), 8)))))))];
	case 0x4053: return [(_pfxLength + 3),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24)))))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, R_[8][1])), uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, Add((_pfxSizeSpecifier ? 16 : 32), i8(Neg(R_[8][1])))))))];
	case 0x840: return [(_pfxLength + 3),Mov(($0 = u8(Mem(R_[32][((b[i+1] & 0x7))]))), u8(Or(u8(LSR($0, ($1 = (((b[i+2])<<24)>>24)))), u8(LSL($0, (((((-$1<<24)>>24) + 8)<<24)>>24))))))];
	case 0xc840: return [(_pfxLength + 3),Mov(R_[8][((b[i+1] & 0x7))], u8(Or(u8(LSR(R_[8][((b[i+1] & 0x7))], ($0 = (((b[i+2])<<24)>>24)))), u8(LSL(R_[8][((b[i+1] & 0x7))], (((((-$0<<24)>>24) + 8)<<24)>>24))))))];
	case 0x841: return [(_pfxLength + 3),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+1] & 0x7))]))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, ($1 = (((b[i+2])<<24)>>24)))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, ((_pfxSizeSpecifier ? 16 : 32) + ((-$1<<24)>>24))))))];
	case 0xc841: return [(_pfxLength + 3),Mov(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))], Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSR(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))], ($0 = (((b[i+2])<<24)>>24)))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSL(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))], ((_pfxSizeSpecifier ? 16 : 32) + ((-$0<<24)>>24))))))];
	case 0x4850: return [(_pfxLength + 3),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24)))))), u8(Or(u8(LSR($0, 1)), u8(LSL($0, 7)))))];
	case 0x4851: return [(_pfxLength + 3),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24)))))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, 1)), uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, ((_pfxSizeSpecifier ? 16 : 32) + -1)))))];
	case 0x4852: return [(_pfxLength + 3),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24)))))), u8(Or(u8(LSR($0, R_[8][1])), u8(LSL($0, i8(Add(i8(Neg(R_[8][1])), 8)))))))];
	case 0x4853: return [(_pfxLength + 3),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24)))))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, R_[8][1])), uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, Add((_pfxSizeSpecifier ? 16 : 32), i8(Neg(R_[8][1])))))))];
	case 0x2040: return [(_pfxLength + 3),Mov(($0 = u8(Mem(R_[32][((b[i+1] & 0x7))]))), u8(LSL($0, (((b[i+2])<<24)>>24))))];
	case 0xe040: return [(_pfxLength + 3),Mov(R_[8][((b[i+1] & 0x7))], u8(LSL(R_[8][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24))))];
	case 0x2041: return [(_pfxLength + 3),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+1] & 0x7))]))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, (((b[i+2])<<24)>>24))))];
	case 0xe041: return [(_pfxLength + 3),Mov(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))], uint[(_pfxSizeSpecifier ? 16 : 32)](LSL(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24))))];
	case 0x6050: return [(_pfxLength + 3),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24)))))), u8(LSL($0, 1)))];
	case 0x6051: return [(_pfxLength + 3),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24)))))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, 1)))];
	case 0x6052: return [(_pfxLength + 3),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24)))))), u8(LSL($0, R_[8][1])))];
	case 0x6053: return [(_pfxLength + 3),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24)))))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, R_[8][1])))];
	case 0x2840: return [(_pfxLength + 3),Mov(($0 = u8(Mem(R_[32][((b[i+1] & 0x7))]))), u8(LSR($0, (((b[i+2])<<24)>>24))))];
	case 0xe840: return [(_pfxLength + 3),Mov(R_[8][((b[i+1] & 0x7))], u8(LSR(R_[8][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24))))];
	case 0x2841: return [(_pfxLength + 3),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+1] & 0x7))]))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, (((b[i+2])<<24)>>24))))];
	case 0xe841: return [(_pfxLength + 3),Mov(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))], uint[(_pfxSizeSpecifier ? 16 : 32)](LSR(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24))))];
	case 0x6850: return [(_pfxLength + 3),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24)))))), u8(LSR($0, 1)))];
	case 0x6851: return [(_pfxLength + 3),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24)))))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, 1)))];
	case 0x6852: return [(_pfxLength + 3),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24)))))), u8(LSR($0, R_[8][1])))];
	case 0x6853: return [(_pfxLength + 3),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24)))))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, R_[8][1])))];
	case 0x3840: return [(_pfxLength + 3),Mov(($0 = u8(Mem(R_[32][((b[i+1] & 0x7))]))), u8(ASR($0, (((b[i+2])<<24)>>24))))];
	case 0xf840: return [(_pfxLength + 3),Mov(R_[8][((b[i+1] & 0x7))], u8(ASR(R_[8][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24))))];
	case 0x3841: return [(_pfxLength + 3),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+1] & 0x7))]))), uint[(_pfxSizeSpecifier ? 16 : 32)](ASR($0, (((b[i+2])<<24)>>24))))];
	case 0xf841: return [(_pfxLength + 3),Mov(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))], uint[(_pfxSizeSpecifier ? 16 : 32)](ASR(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24))))];
	case 0x7850: return [(_pfxLength + 3),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24)))))), u8(ASR($0, 1)))];
	case 0x7851: return [(_pfxLength + 3),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24)))))), uint[(_pfxSizeSpecifier ? 16 : 32)](ASR($0, 1)))];
	case 0x7852: return [(_pfxLength + 3),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24)))))), u8(ASR($0, R_[8][1])))];
	case 0x7853: return [(_pfxLength + 3),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24)))))), uint[(_pfxSizeSpecifier ? 16 : 32)](ASR($0, R_[8][1])))];
	case 0x76: return [(_pfxLength + 3),Mov(F[2], Eq(And(u8(Mem(R_[32][((b[i+1] & 0x7))])), (((b[i+2])<<24)>>24)), 0)),Mov(F[1], 0),Mov(F[0], 0)];
	case 0xc076: return [(_pfxLength + 3),Mov(F[2], Eq(And(R_[8][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24)), 0)),Mov(F[1], 0),Mov(F[0], 0)];
	case 0x5076: return [(_pfxLength + 3),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24)))))), u8(Not($0)))];
	case 0x5077: return [(_pfxLength + 3),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24)))))), uint[(_pfxSizeSpecifier ? 16 : 32)](Not($0)))];
	case 0x5876: return [(_pfxLength + 3),Mov(F[1], u1(Not(Eq(($0 = u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24)))))), 0)))),Mov($0, i8(Neg($0)))];
	case 0x5877: return [(_pfxLength + 3),Mov(F[1], u1(Not(Eq(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24)))))), 0)))),Mov($0, int[(_pfxSizeSpecifier ? 16 : 32)](Neg($0)))];
	case 0x6076: return [(_pfxLength + 3),Mov(R_[16][0], u8(Mul(R_[8][0], u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24))))))))];
	case 0x6077: return [(_pfxLength + 3),Mov(R_[32][0], Mul(R_[32][0], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24)))))))];
	case 0x6876: return [(_pfxLength + 3),Mov(R_[16][0], u8(Mul(R_[8][0], u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24))))))))];
	case 0x6877: return [(_pfxLength + 3),Mov(R_[32][0], Mul(R_[32][0], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24)))))))];
	case 0x7076: return [(_pfxLength + 3),Mov(R_[16][0], u8(Div(R_[8][0], u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24))))))))];
	case 0x7077: return [(_pfxLength + 3),Mov(R_[32][0], Div(R_[32][0], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24)))))))];
	case 0x7876: return [(_pfxLength + 3),Mov(R_[16][0], u8(Div(R_[8][0], u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24))))))))];
	case 0x7877: return [(_pfxLength + 3),Mov(R_[32][0], Div(R_[32][0], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24)))))))];
	case 0x407e: return [(_pfxLength + 3),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24)))))), u8(Add($0, 1)))];
	case 0x407f: return [(_pfxLength + 3),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24)))))), Add($0, 1))];
	case 0x487e: return [(_pfxLength + 3),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24)))))), u8(Add($0, -1)))];
	case 0x487f: return [(_pfxLength + 3),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24)))))), Add($0, -1))];
	case 0x507f: return [(_pfxLength + 3),Mov(R_[32][4], u32(Add(R_[32][4], -4))),Mov(u32(Mem(R_[32][4])), u32(Add(R_[32][8], (_pfxLength + 3)))),Mov(R_[32][8], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24))))))];
	case 0x607f: return [(_pfxLength + 3),Mov(R_[32][8], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24))))))];
	case 0x707f: return [(_pfxLength + 3),Mov(R_[32][4], Add(R_[32][4], -($0 = ((_pfxSizeSpecifier ? 16 : 32) >>> 3)))),Mov(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][4])), uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24))))))];
	}

	switch((b[i+0]|(b[i+1]<<8)) & 0xc0ff) {
	case 0x4000: return [(_pfxLength + 3),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24)))))), u8(Add($0, R_[8][(((b[i+1] & 0x38)>>>3))])))];
	case 0x4001: return [(_pfxLength + 3),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24)))))), Add($0, R_[32][(((b[i+1] & 0x38)>>>3))]))];
	case 0x4002: return [(_pfxLength + 3),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Add(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24))))))))];
	case 0x4003: return [(_pfxLength + 3),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Add(R_[32][(((b[i+1] & 0x38)>>>3))], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24)))))))];
	case 0x4008: return [(_pfxLength + 3),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24)))))), u8(Or($0, R_[8][(((b[i+1] & 0x38)>>>3))])))];
	case 0x4009: return [(_pfxLength + 3),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24)))))), Or($0, R_[32][(((b[i+1] & 0x38)>>>3))]))];
	case 0x400a: return [(_pfxLength + 3),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Or(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24))))))))];
	case 0x400b: return [(_pfxLength + 3),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Or(R_[32][(((b[i+1] & 0x38)>>>3))], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24)))))))];
	case 0x4010: return [(_pfxLength + 3),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24)))))), u8(Add($0, u8(Add(R_[8][(((b[i+1] & 0x38)>>>3))], u8(F[1]))))))];
	case 0x4011: return [(_pfxLength + 3),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24)))))), Add($0, Add(R_[32][(((b[i+1] & 0x38)>>>3))], uint[(_pfxSizeSpecifier ? 16 : 32)](F[1]))))];
	case 0x4012: return [(_pfxLength + 3),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Add(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Add(u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24))))), u8(F[1]))))))];
	case 0x4013: return [(_pfxLength + 3),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Add(R_[32][(((b[i+1] & 0x38)>>>3))], Add(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24))))), u32(F[1]))))];
	case 0x4018: return [(_pfxLength + 3),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24)))))), u8(Add(($1 = u8(Add($0, i8(Neg(R_[8][(((b[i+1] & 0x38)>>>3))]))))), i8(Neg(($2 = u8(F[1])))))))];
	case 0x4019: return [(_pfxLength + 3),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24)))))), Add(($1 = Add($0, i32(Neg(R_[32][(((b[i+1] & 0x38)>>>3))])))), int[(_pfxSizeSpecifier ? 16 : 32)](Neg(($2 = uint[(_pfxSizeSpecifier ? 16 : 32)](F[1]))))))];
	case 0x401a: return [(_pfxLength + 3),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Add(($0 = u8(Add(R_[8][(((b[i+1] & 0x38)>>>3))], i8(Neg(($1 = u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24))))))))))), i8(Neg(($2 = u8(F[1])))))))];
	case 0x401b: return [(_pfxLength + 3),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Add(($0 = Add(R_[32][(((b[i+1] & 0x38)>>>3))], int[(_pfxSizeSpecifier ? 16 : 32)](Neg(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24)))))))))), i32(Neg(($2 = u32(F[1]))))))];
	case 0x4020: return [(_pfxLength + 3),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24)))))), u8(And($0, R_[8][(((b[i+1] & 0x38)>>>3))])))];
	case 0x4021: return [(_pfxLength + 3),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24)))))), And($0, R_[32][(((b[i+1] & 0x38)>>>3))]))];
	case 0x4022: return [(_pfxLength + 3),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(And(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24))))))))];
	case 0x4023: return [(_pfxLength + 3),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], And(R_[32][(((b[i+1] & 0x38)>>>3))], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24)))))))];
	case 0x4028: return [(_pfxLength + 3),Mov(F[2], Eq(($0 = u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24)))))), R_[8][(((b[i+1] & 0x38)>>>3))])),Mov(F[1], Lt($0, R_[8][(((b[i+1] & 0x38)>>>3))])),Mov($0, u8(Add($0, i8(Neg(R_[8][(((b[i+1] & 0x38)>>>3))])))))];
	case 0x4029: return [(_pfxLength + 3),Mov(F[2], Eq(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24)))))), R_[32][(((b[i+1] & 0x38)>>>3))])),Mov(F[1], Lt($0, R_[32][(((b[i+1] & 0x38)>>>3))])),Mov($0, Add($0, i32(Neg(R_[32][(((b[i+1] & 0x38)>>>3))]))))];
	case 0x402a: return [(_pfxLength + 3),Mov(F[2], Eq(R_[8][(((b[i+1] & 0x38)>>>3))], ($0 = u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24)))))))),Mov(F[1], Lt(R_[8][(((b[i+1] & 0x38)>>>3))], $0)),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Add(R_[8][(((b[i+1] & 0x38)>>>3))], i8(Neg($0)))))];
	case 0x402b: return [(_pfxLength + 3),Mov(F[2], Eq(R_[32][(((b[i+1] & 0x38)>>>3))], ($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24)))))))),Mov(F[1], Lt(R_[32][(((b[i+1] & 0x38)>>>3))], $0)),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Add(R_[32][(((b[i+1] & 0x38)>>>3))], int[(_pfxSizeSpecifier ? 16 : 32)](Neg($0))))];
	case 0x4030: return [(_pfxLength + 3),Mov(($0 = u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24)))))), u8(Xor($0, R_[8][(((b[i+1] & 0x38)>>>3))])))];
	case 0x4031: return [(_pfxLength + 3),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24)))))), Xor($0, R_[32][(((b[i+1] & 0x38)>>>3))]))];
	case 0x4032: return [(_pfxLength + 3),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Xor(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24))))))))];
	case 0x4033: return [(_pfxLength + 3),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Xor(R_[32][(((b[i+1] & 0x38)>>>3))], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24)))))))];
	case 0x4038: return [(_pfxLength + 3),Mov(F[2], Eq(($0 = u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24)))))), R_[8][(((b[i+1] & 0x38)>>>3))])),Mov(F[1], Lt($0, R_[8][(((b[i+1] & 0x38)>>>3))]))];
	case 0x4039: return [(_pfxLength + 3),Mov(F[2], Eq(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24)))))), R_[32][(((b[i+1] & 0x38)>>>3))])),Mov(F[1], Lt($0, R_[32][(((b[i+1] & 0x38)>>>3))]))];
	case 0x403a: return [(_pfxLength + 3),Mov(F[2], Eq(R_[8][(((b[i+1] & 0x38)>>>3))], ($0 = u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24)))))))),Mov(F[1], Lt(R_[8][(((b[i+1] & 0x38)>>>3))], $0))];
	case 0x403b: return [(_pfxLength + 3),Mov(F[2], Eq(R_[32][(((b[i+1] & 0x38)>>>3))], ($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24)))))))),Mov(F[1], Lt(R_[32][(((b[i+1] & 0x38)>>>3))], $0))];
	case 0x6b: return [(_pfxLength + 3),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Mul(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+1] & 0x7))])), ((((b[i+2])<<24)>>24)&~0)))];
	case 0xc06b: return [(_pfxLength + 3),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Mul(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))], ((((b[i+2])<<24)>>24)&~0)))];
	case 0x4084: return [(_pfxLength + 3),Mov(F[2], Eq(And(u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24))))), R_[8][(((b[i+1] & 0x38)>>>3))]), 0)),Mov(F[1], 0),Mov(F[0], 0)];
	case 0x4085: return [(_pfxLength + 3),Mov(F[2], Eq(And(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24))))), R_[32][(((b[i+1] & 0x38)>>>3))]), 0)),Mov(F[1], 0),Mov(F[0], 0)];
	case 0x4086: return [(_pfxLength + 3),Swap(u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24))))), R_[8][(((b[i+1] & 0x38)>>>3))])];
	case 0x4087: return [(_pfxLength + 3),Swap(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24))))), R_[32][(((b[i+1] & 0x38)>>>3))])];
	case 0x4088: return [(_pfxLength + 3),Mov(u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24))))), R_[8][(((b[i+1] & 0x38)>>>3))])];
	case 0x4089: return [(_pfxLength + 3),Mov(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24))))), R_[32][(((b[i+1] & 0x38)>>>3))])];
	case 0x408a: return [(_pfxLength + 3),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24))))))];
	case 0x408b: return [(_pfxLength + 3),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24))))))];
	case 0x408c: return [(_pfxLength + 3),Mov(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24))))), R_.S[(((b[i+1] & 0x38)>>>3))])];
	case 0x408d: return [(_pfxLength + 3),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], ($0 = u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24)))))];
	case 0x408e: return [(_pfxLength + 3),Mov(R_.S[(((b[i+1] & 0x38)>>>3))], u16(Mem(u32(Add(R_[32][((b[i+1] & 0x7))], (((b[i+2])<<24)>>24))))))];
	}
if(((b[i+0]|(b[i+1]<<8)) & 0x90ff) == 0x800f)
	switch(((b[i+1] & 0x7f)) & 0x6f) {
	case 0x22: return [(_pfxLength + 2),Nop()];
	case 0x48: return [(_pfxLength + 2),Nop(R_[32][0])];
	case 0x49: return [(_pfxLength + 2),Nop(R_[32][1])];
	case 0x4a: return [(_pfxLength + 2),Nop(R_[32][2])];
	case 0x4b: return [(_pfxLength + 2),Nop(R_[32][3])];
	case 0x4c: return [(_pfxLength + 2),Nop(R_[32][4])];
	case 0x4d: return [(_pfxLength + 2),Nop(R_[32][5])];
	case 0x4e: return [(_pfxLength + 2),Nop(R_[32][6])];
	case 0x4f: return [(_pfxLength + 2),Nop(R_[32][7])];
	}
if(((((b[i+0] & 0x80)>>>7)) & 0x1) == 0x1)
	switch((b[i+0]|(b[i+1]<<8)) & 0xf87f) {
	case 0xf: return [(_pfxLength + 2),Mov(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+1] & 0x7))])), uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][4]))),Mov(R_[32][4], Add(R_[32][4], ((_pfxSizeSpecifier ? 16 : 32) >>> 3)))];
	case 0xc00f: return [(_pfxLength + 2),Mov(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][4]))),Mov(R_[32][4], Add(R_[32][4], ((_pfxSizeSpecifier ? 16 : 32) >>> 3)))];
	case 0x50: return [(_pfxLength + 2),Mov(($0 = u8(Mem(R_[32][((b[i+1] & 0x7))]))), u8(Or(u8(LSL($0, 1)), u8(LSR($0, 7)))))];
	case 0xc050: return [(_pfxLength + 2),Mov(R_[8][((b[i+1] & 0x7))], u8(Or(u8(LSL(R_[8][((b[i+1] & 0x7))], 1)), u8(LSR(R_[8][((b[i+1] & 0x7))], 7)))))];
	case 0x51: return [(_pfxLength + 2),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+1] & 0x7))]))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, 1)), uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, ((_pfxSizeSpecifier ? 16 : 32) + -1)))))];
	case 0xc051: return [(_pfxLength + 2),Mov(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))], Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSL(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))], 1)), uint[(_pfxSizeSpecifier ? 16 : 32)](LSR(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))], ((_pfxSizeSpecifier ? 16 : 32) + -1)))))];
	case 0x52: return [(_pfxLength + 2),Mov(($0 = u8(Mem(R_[32][((b[i+1] & 0x7))]))), u8(Or(u8(LSL($0, R_[8][1])), u8(LSR($0, i8(Add(i8(Neg(R_[8][1])), 8)))))))];
	case 0xc052: return [(_pfxLength + 2),Mov(R_[8][((b[i+1] & 0x7))], u8(Or(u8(LSL(R_[8][((b[i+1] & 0x7))], R_[8][1])), u8(LSR(R_[8][((b[i+1] & 0x7))], i8(Add(i8(Neg(R_[8][1])), 8)))))))];
	case 0x53: return [(_pfxLength + 2),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+1] & 0x7))]))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, R_[8][1])), uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, Add((_pfxSizeSpecifier ? 16 : 32), i8(Neg(R_[8][1])))))))];
	case 0xc053: return [(_pfxLength + 2),Mov(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))], Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSL(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))], R_[8][1])), uint[(_pfxSizeSpecifier ? 16 : 32)](LSR(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))], Add((_pfxSizeSpecifier ? 16 : 32), i8(Neg(R_[8][1])))))))];
	case 0x850: return [(_pfxLength + 2),Mov(($0 = u8(Mem(R_[32][((b[i+1] & 0x7))]))), u8(Or(u8(LSR($0, 1)), u8(LSL($0, 7)))))];
	case 0xc850: return [(_pfxLength + 2),Mov(R_[8][((b[i+1] & 0x7))], u8(Or(u8(LSR(R_[8][((b[i+1] & 0x7))], 1)), u8(LSL(R_[8][((b[i+1] & 0x7))], 7)))))];
	case 0x851: return [(_pfxLength + 2),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+1] & 0x7))]))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, 1)), uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, ((_pfxSizeSpecifier ? 16 : 32) + -1)))))];
	case 0xc851: return [(_pfxLength + 2),Mov(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))], Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSR(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))], 1)), uint[(_pfxSizeSpecifier ? 16 : 32)](LSL(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))], ((_pfxSizeSpecifier ? 16 : 32) + -1)))))];
	case 0x852: return [(_pfxLength + 2),Mov(($0 = u8(Mem(R_[32][((b[i+1] & 0x7))]))), u8(Or(u8(LSR($0, R_[8][1])), u8(LSL($0, i8(Add(i8(Neg(R_[8][1])), 8)))))))];
	case 0xc852: return [(_pfxLength + 2),Mov(R_[8][((b[i+1] & 0x7))], u8(Or(u8(LSR(R_[8][((b[i+1] & 0x7))], R_[8][1])), u8(LSL(R_[8][((b[i+1] & 0x7))], i8(Add(i8(Neg(R_[8][1])), 8)))))))];
	case 0x853: return [(_pfxLength + 2),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+1] & 0x7))]))), Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, R_[8][1])), uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, Add((_pfxSizeSpecifier ? 16 : 32), i8(Neg(R_[8][1])))))))];
	case 0xc853: return [(_pfxLength + 2),Mov(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))], Or(uint[(_pfxSizeSpecifier ? 16 : 32)](LSR(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))], R_[8][1])), uint[(_pfxSizeSpecifier ? 16 : 32)](LSL(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))], Add((_pfxSizeSpecifier ? 16 : 32), i8(Neg(R_[8][1])))))))];
	case 0x2050: return [(_pfxLength + 2),Mov(($0 = u8(Mem(R_[32][((b[i+1] & 0x7))]))), u8(LSL($0, 1)))];
	case 0xe050: return [(_pfxLength + 2),Mov(R_[8][((b[i+1] & 0x7))], u8(LSL(R_[8][((b[i+1] & 0x7))], 1)))];
	case 0x2051: return [(_pfxLength + 2),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+1] & 0x7))]))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, 1)))];
	case 0xe051: return [(_pfxLength + 2),Mov(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))], uint[(_pfxSizeSpecifier ? 16 : 32)](LSL(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))], 1)))];
	case 0x2052: return [(_pfxLength + 2),Mov(($0 = u8(Mem(R_[32][((b[i+1] & 0x7))]))), u8(LSL($0, R_[8][1])))];
	case 0xe052: return [(_pfxLength + 2),Mov(R_[8][((b[i+1] & 0x7))], u8(LSL(R_[8][((b[i+1] & 0x7))], R_[8][1])))];
	case 0x2053: return [(_pfxLength + 2),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+1] & 0x7))]))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSL($0, R_[8][1])))];
	case 0xe053: return [(_pfxLength + 2),Mov(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))], uint[(_pfxSizeSpecifier ? 16 : 32)](LSL(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))], R_[8][1])))];
	case 0x2850: return [(_pfxLength + 2),Mov(($0 = u8(Mem(R_[32][((b[i+1] & 0x7))]))), u8(LSR($0, 1)))];
	case 0xe850: return [(_pfxLength + 2),Mov(R_[8][((b[i+1] & 0x7))], u8(LSR(R_[8][((b[i+1] & 0x7))], 1)))];
	case 0x2851: return [(_pfxLength + 2),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+1] & 0x7))]))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, 1)))];
	case 0xe851: return [(_pfxLength + 2),Mov(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))], uint[(_pfxSizeSpecifier ? 16 : 32)](LSR(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))], 1)))];
	case 0x2852: return [(_pfxLength + 2),Mov(($0 = u8(Mem(R_[32][((b[i+1] & 0x7))]))), u8(LSR($0, R_[8][1])))];
	case 0xe852: return [(_pfxLength + 2),Mov(R_[8][((b[i+1] & 0x7))], u8(LSR(R_[8][((b[i+1] & 0x7))], R_[8][1])))];
	case 0x2853: return [(_pfxLength + 2),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+1] & 0x7))]))), uint[(_pfxSizeSpecifier ? 16 : 32)](LSR($0, R_[8][1])))];
	case 0xe853: return [(_pfxLength + 2),Mov(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))], uint[(_pfxSizeSpecifier ? 16 : 32)](LSR(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))], R_[8][1])))];
	case 0x3850: return [(_pfxLength + 2),Mov(($0 = u8(Mem(R_[32][((b[i+1] & 0x7))]))), u8(ASR($0, 1)))];
	case 0xf850: return [(_pfxLength + 2),Mov(R_[8][((b[i+1] & 0x7))], u8(ASR(R_[8][((b[i+1] & 0x7))], 1)))];
	case 0x3851: return [(_pfxLength + 2),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+1] & 0x7))]))), uint[(_pfxSizeSpecifier ? 16 : 32)](ASR($0, 1)))];
	case 0xf851: return [(_pfxLength + 2),Mov(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))], uint[(_pfxSizeSpecifier ? 16 : 32)](ASR(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))], 1)))];
	case 0x3852: return [(_pfxLength + 2),Mov(($0 = u8(Mem(R_[32][((b[i+1] & 0x7))]))), u8(ASR($0, R_[8][1])))];
	case 0xf852: return [(_pfxLength + 2),Mov(R_[8][((b[i+1] & 0x7))], u8(ASR(R_[8][((b[i+1] & 0x7))], R_[8][1])))];
	case 0x3853: return [(_pfxLength + 2),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+1] & 0x7))]))), uint[(_pfxSizeSpecifier ? 16 : 32)](ASR($0, R_[8][1])))];
	case 0xf853: return [(_pfxLength + 2),Mov(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))], uint[(_pfxSizeSpecifier ? 16 : 32)](ASR(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))], R_[8][1])))];
	case 0x1076: return [(_pfxLength + 2),Mov(($0 = u8(Mem(R_[32][((b[i+1] & 0x7))]))), u8(Not($0)))];
	case 0xd076: return [(_pfxLength + 2),Mov(R_[8][((b[i+1] & 0x7))], u8(Not(R_[8][((b[i+1] & 0x7))])))];
	case 0x1077: return [(_pfxLength + 2),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+1] & 0x7))]))), uint[(_pfxSizeSpecifier ? 16 : 32)](Not($0)))];
	case 0xd077: return [(_pfxLength + 2),Mov(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))], uint[(_pfxSizeSpecifier ? 16 : 32)](Not(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))])))];
	case 0x1876: return [(_pfxLength + 2),Mov(F[1], u1(Not(Eq(($0 = u8(Mem(R_[32][((b[i+1] & 0x7))]))), 0)))),Mov($0, i8(Neg($0)))];
	case 0xd876: return [(_pfxLength + 2),Mov(F[1], u1(Not(Eq(R_[8][((b[i+1] & 0x7))], 0)))),Mov(R_[8][((b[i+1] & 0x7))], i8(Neg(R_[8][((b[i+1] & 0x7))])))];
	case 0x1877: return [(_pfxLength + 2),Mov(F[1], u1(Not(Eq(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+1] & 0x7))]))), 0)))),Mov($0, int[(_pfxSizeSpecifier ? 16 : 32)](Neg($0)))];
	case 0xd877: return [(_pfxLength + 2),Mov(F[1], u1(Not(Eq(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))], 0)))),Mov(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))], int[(_pfxSizeSpecifier ? 16 : 32)](Neg(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))])))];
	case 0x2076: return [(_pfxLength + 2),Mov(R_[16][0], u8(Mul(R_[8][0], u8(Mem(R_[32][((b[i+1] & 0x7))])))))];
	case 0xe076: return [(_pfxLength + 2),Mov(R_[16][0], u8(Mul(R_[8][0], R_[8][((b[i+1] & 0x7))])))];
	case 0x2077: return [(_pfxLength + 2),Mov(R_[32][0], Mul(R_[32][0], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+1] & 0x7))]))))];
	case 0xe077: return [(_pfxLength + 2),Mov(R_[32][0], Mul(R_[32][0], R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))]))];
	case 0x2876: return [(_pfxLength + 2),Mov(R_[16][0], u8(Mul(R_[8][0], u8(Mem(R_[32][((b[i+1] & 0x7))])))))];
	case 0xe876: return [(_pfxLength + 2),Mov(R_[16][0], u8(Mul(R_[8][0], R_[8][((b[i+1] & 0x7))])))];
	case 0x2877: return [(_pfxLength + 2),Mov(R_[32][0], Mul(R_[32][0], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+1] & 0x7))]))))];
	case 0xe877: return [(_pfxLength + 2),Mov(R_[32][0], Mul(R_[32][0], R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))]))];
	case 0x3076: return [(_pfxLength + 2),Mov(R_[16][0], u8(Div(R_[8][0], u8(Mem(R_[32][((b[i+1] & 0x7))])))))];
	case 0xf076: return [(_pfxLength + 2),Mov(R_[16][0], u8(Div(R_[8][0], R_[8][((b[i+1] & 0x7))])))];
	case 0x3077: return [(_pfxLength + 2),Mov(R_[32][0], Div(R_[32][0], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+1] & 0x7))]))))];
	case 0xf077: return [(_pfxLength + 2),Mov(R_[32][0], Div(R_[32][0], R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))]))];
	case 0x3876: return [(_pfxLength + 2),Mov(R_[16][0], u8(Div(R_[8][0], u8(Mem(R_[32][((b[i+1] & 0x7))])))))];
	case 0xf876: return [(_pfxLength + 2),Mov(R_[16][0], u8(Div(R_[8][0], R_[8][((b[i+1] & 0x7))])))];
	case 0x3877: return [(_pfxLength + 2),Mov(R_[32][0], Div(R_[32][0], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+1] & 0x7))]))))];
	case 0xf877: return [(_pfxLength + 2),Mov(R_[32][0], Div(R_[32][0], R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))]))];
	case 0x7e: return [(_pfxLength + 2),Mov(($0 = u8(Mem(R_[32][((b[i+1] & 0x7))]))), u8(Add($0, 1)))];
	case 0xc07e: return [(_pfxLength + 2),Mov(R_[8][((b[i+1] & 0x7))], u8(Add(R_[8][((b[i+1] & 0x7))], 1)))];
	case 0x7f: return [(_pfxLength + 2),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+1] & 0x7))]))), Add($0, 1))];
	case 0xc07f: return [(_pfxLength + 2),Mov(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))], Add(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))], 1))];
	case 0x87e: return [(_pfxLength + 2),Mov(($0 = u8(Mem(R_[32][((b[i+1] & 0x7))]))), u8(Add($0, -1)))];
	case 0xc87e: return [(_pfxLength + 2),Mov(R_[8][((b[i+1] & 0x7))], u8(Add(R_[8][((b[i+1] & 0x7))], -1)))];
	case 0x87f: return [(_pfxLength + 2),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+1] & 0x7))]))), Add($0, -1))];
	case 0xc87f: return [(_pfxLength + 2),Mov(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))], Add(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))], -1))];
	case 0x107f: return [(_pfxLength + 2),Mov(R_[32][4], u32(Add(R_[32][4], -4))),Mov(u32(Mem(R_[32][4])), u32(Add(R_[32][8], (_pfxLength + 2)))),Mov(R_[32][8], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+1] & 0x7))])))];
	case 0xd07f: return [(_pfxLength + 2),Mov(R_[32][4], u32(Add(R_[32][4], -4))),Mov(u32(Mem(R_[32][4])), u32(Add(R_[32][8], (_pfxLength + 2)))),Mov(R_[32][8], R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))])];
	case 0x207f: return [(_pfxLength + 2),Mov(R_[32][8], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+1] & 0x7))])))];
	case 0xe07f: return [(_pfxLength + 2),Mov(R_[32][8], R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))])];
	case 0x307f: return [(_pfxLength + 2),Mov(R_[32][4], Add(R_[32][4], -($0 = ((_pfxSizeSpecifier ? 16 : 32) >>> 3)))),Mov(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][4])), uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+1] & 0x7))])))];
	case 0xf07f: return [(_pfxLength + 2),Mov(R_[32][4], Add(R_[32][4], -($0 = ((_pfxSizeSpecifier ? 16 : 32) >>> 3)))),Mov(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][4])), R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))])];
	}
if(((((b[i+0] & 0x40)>>>6)) & 0x1) == 0x0)
	switch((b[i+0]|(b[i+1]<<8)) & 0xc0bf) {
	case 0x0: return [(_pfxLength + 2),Mov(($0 = u8(Mem(R_[32][((b[i+1] & 0x7))]))), u8(Add($0, R_[8][(((b[i+1] & 0x38)>>>3))])))];
	case 0xc000: return [(_pfxLength + 2),Mov(R_[8][((b[i+1] & 0x7))], u8(Add(R_[8][((b[i+1] & 0x7))], R_[8][(((b[i+1] & 0x38)>>>3))])))];
	case 0x1: return [(_pfxLength + 2),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+1] & 0x7))]))), Add($0, R_[32][(((b[i+1] & 0x38)>>>3))]))];
	case 0xc001: return [(_pfxLength + 2),Mov(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))], Add(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))], R_[32][(((b[i+1] & 0x38)>>>3))]))];
	case 0x2: return [(_pfxLength + 2),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Add(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Mem(R_[32][((b[i+1] & 0x7))])))))];
	case 0xc002: return [(_pfxLength + 2),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Add(R_[8][(((b[i+1] & 0x38)>>>3))], R_[8][((b[i+1] & 0x7))])))];
	case 0x3: return [(_pfxLength + 2),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Add(R_[32][(((b[i+1] & 0x38)>>>3))], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+1] & 0x7))]))))];
	case 0xc003: return [(_pfxLength + 2),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Add(R_[32][(((b[i+1] & 0x38)>>>3))], R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))]))];
	case 0x8: return [(_pfxLength + 2),Mov(($0 = u8(Mem(R_[32][((b[i+1] & 0x7))]))), u8(Or($0, R_[8][(((b[i+1] & 0x38)>>>3))])))];
	case 0xc008: return [(_pfxLength + 2),Mov(R_[8][((b[i+1] & 0x7))], u8(Or(R_[8][((b[i+1] & 0x7))], R_[8][(((b[i+1] & 0x38)>>>3))])))];
	case 0x9: return [(_pfxLength + 2),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+1] & 0x7))]))), Or($0, R_[32][(((b[i+1] & 0x38)>>>3))]))];
	case 0xc009: return [(_pfxLength + 2),Mov(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))], Or(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))], R_[32][(((b[i+1] & 0x38)>>>3))]))];
	case 0xa: return [(_pfxLength + 2),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Or(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Mem(R_[32][((b[i+1] & 0x7))])))))];
	case 0xc00a: return [(_pfxLength + 2),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Or(R_[8][(((b[i+1] & 0x38)>>>3))], R_[8][((b[i+1] & 0x7))])))];
	case 0xb: return [(_pfxLength + 2),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Or(R_[32][(((b[i+1] & 0x38)>>>3))], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+1] & 0x7))]))))];
	case 0xc00b: return [(_pfxLength + 2),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Or(R_[32][(((b[i+1] & 0x38)>>>3))], R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))]))];
	case 0x10: return [(_pfxLength + 2),Mov(($0 = u8(Mem(R_[32][((b[i+1] & 0x7))]))), u8(Add($0, u8(Add(R_[8][(((b[i+1] & 0x38)>>>3))], u8(F[1]))))))];
	case 0xc010: return [(_pfxLength + 2),Mov(R_[8][((b[i+1] & 0x7))], u8(Add(R_[8][((b[i+1] & 0x7))], u8(Add(R_[8][(((b[i+1] & 0x38)>>>3))], u8(F[1]))))))];
	case 0x11: return [(_pfxLength + 2),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+1] & 0x7))]))), Add($0, Add(R_[32][(((b[i+1] & 0x38)>>>3))], uint[(_pfxSizeSpecifier ? 16 : 32)](F[1]))))];
	case 0xc011: return [(_pfxLength + 2),Mov(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))], Add(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))], Add(R_[32][(((b[i+1] & 0x38)>>>3))], uint[(_pfxSizeSpecifier ? 16 : 32)](F[1]))))];
	case 0x12: return [(_pfxLength + 2),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Add(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Add(u8(Mem(R_[32][((b[i+1] & 0x7))])), u8(F[1]))))))];
	case 0xc012: return [(_pfxLength + 2),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Add(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Add(R_[8][((b[i+1] & 0x7))], u8(F[1]))))))];
	case 0x13: return [(_pfxLength + 2),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Add(R_[32][(((b[i+1] & 0x38)>>>3))], Add(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+1] & 0x7))])), u32(F[1]))))];
	case 0xc013: return [(_pfxLength + 2),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Add(R_[32][(((b[i+1] & 0x38)>>>3))], Add(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))], u32(F[1]))))];
	case 0x18: return [(_pfxLength + 2),Mov(($0 = u8(Mem(R_[32][((b[i+1] & 0x7))]))), u8(Add(($1 = u8(Add($0, i8(Neg(R_[8][(((b[i+1] & 0x38)>>>3))]))))), i8(Neg(($2 = u8(F[1])))))))];
	case 0xc018: return [(_pfxLength + 2),Mov(R_[8][((b[i+1] & 0x7))], u8(Add(($0 = u8(Add(R_[8][((b[i+1] & 0x7))], i8(Neg(R_[8][(((b[i+1] & 0x38)>>>3))]))))), i8(Neg(($1 = u8(F[1])))))))];
	case 0x19: return [(_pfxLength + 2),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+1] & 0x7))]))), Add(($1 = Add($0, i32(Neg(R_[32][(((b[i+1] & 0x38)>>>3))])))), int[(_pfxSizeSpecifier ? 16 : 32)](Neg(($2 = uint[(_pfxSizeSpecifier ? 16 : 32)](F[1]))))))];
	case 0xc019: return [(_pfxLength + 2),Mov(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))], Add(($0 = Add(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))], i32(Neg(R_[32][(((b[i+1] & 0x38)>>>3))])))), int[(_pfxSizeSpecifier ? 16 : 32)](Neg(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](F[1]))))))];
	case 0x1a: return [(_pfxLength + 2),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Add(($0 = u8(Add(R_[8][(((b[i+1] & 0x38)>>>3))], i8(Neg(($1 = u8(Mem(R_[32][((b[i+1] & 0x7))])))))))), i8(Neg(($2 = u8(F[1])))))))];
	case 0xc01a: return [(_pfxLength + 2),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Add(($0 = u8(Add(R_[8][(((b[i+1] & 0x38)>>>3))], i8(Neg(R_[8][((b[i+1] & 0x7))]))))), i8(Neg(($1 = u8(F[1])))))))];
	case 0x1b: return [(_pfxLength + 2),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Add(($0 = Add(R_[32][(((b[i+1] & 0x38)>>>3))], int[(_pfxSizeSpecifier ? 16 : 32)](Neg(($1 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+1] & 0x7))]))))))), i32(Neg(($2 = u32(F[1]))))))];
	case 0xc01b: return [(_pfxLength + 2),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Add(($0 = Add(R_[32][(((b[i+1] & 0x38)>>>3))], int[(_pfxSizeSpecifier ? 16 : 32)](Neg(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))])))), i32(Neg(($1 = u32(F[1]))))))];
	case 0x20: return [(_pfxLength + 2),Mov(($0 = u8(Mem(R_[32][((b[i+1] & 0x7))]))), u8(And($0, R_[8][(((b[i+1] & 0x38)>>>3))])))];
	case 0xc020: return [(_pfxLength + 2),Mov(R_[8][((b[i+1] & 0x7))], u8(And(R_[8][((b[i+1] & 0x7))], R_[8][(((b[i+1] & 0x38)>>>3))])))];
	case 0x21: return [(_pfxLength + 2),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+1] & 0x7))]))), And($0, R_[32][(((b[i+1] & 0x38)>>>3))]))];
	case 0xc021: return [(_pfxLength + 2),Mov(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))], And(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))], R_[32][(((b[i+1] & 0x38)>>>3))]))];
	case 0x22: return [(_pfxLength + 2),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(And(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Mem(R_[32][((b[i+1] & 0x7))])))))];
	case 0xc022: return [(_pfxLength + 2),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(And(R_[8][(((b[i+1] & 0x38)>>>3))], R_[8][((b[i+1] & 0x7))])))];
	case 0x23: return [(_pfxLength + 2),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], And(R_[32][(((b[i+1] & 0x38)>>>3))], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+1] & 0x7))]))))];
	case 0xc023: return [(_pfxLength + 2),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], And(R_[32][(((b[i+1] & 0x38)>>>3))], R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))]))];
	case 0x28: return [(_pfxLength + 2),Mov(F[2], Eq(($0 = u8(Mem(R_[32][((b[i+1] & 0x7))]))), R_[8][(((b[i+1] & 0x38)>>>3))])),Mov(F[1], Lt($0, R_[8][(((b[i+1] & 0x38)>>>3))])),Mov($0, u8(Add($0, i8(Neg(R_[8][(((b[i+1] & 0x38)>>>3))])))))];
	case 0xc028: return [(_pfxLength + 2),Mov(F[2], Eq(R_[8][((b[i+1] & 0x7))], R_[8][(((b[i+1] & 0x38)>>>3))])),Mov(F[1], Lt(R_[8][((b[i+1] & 0x7))], R_[8][(((b[i+1] & 0x38)>>>3))])),Mov(R_[8][((b[i+1] & 0x7))], u8(Add(R_[8][((b[i+1] & 0x7))], i8(Neg(R_[8][(((b[i+1] & 0x38)>>>3))])))))];
	case 0x29: return [(_pfxLength + 2),Mov(F[2], Eq(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+1] & 0x7))]))), R_[32][(((b[i+1] & 0x38)>>>3))])),Mov(F[1], Lt($0, R_[32][(((b[i+1] & 0x38)>>>3))])),Mov($0, Add($0, i32(Neg(R_[32][(((b[i+1] & 0x38)>>>3))]))))];
	case 0xc029: return [(_pfxLength + 2),Mov(F[2], Eq(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))], R_[32][(((b[i+1] & 0x38)>>>3))])),Mov(F[1], Lt(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))], R_[32][(((b[i+1] & 0x38)>>>3))])),Mov(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))], Add(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))], i32(Neg(R_[32][(((b[i+1] & 0x38)>>>3))]))))];
	case 0x2a: return [(_pfxLength + 2),Mov(F[2], Eq(R_[8][(((b[i+1] & 0x38)>>>3))], ($0 = u8(Mem(R_[32][((b[i+1] & 0x7))]))))),Mov(F[1], Lt(R_[8][(((b[i+1] & 0x38)>>>3))], $0)),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Add(R_[8][(((b[i+1] & 0x38)>>>3))], i8(Neg($0)))))];
	case 0xc02a: return [(_pfxLength + 2),Mov(F[2], Eq(R_[8][(((b[i+1] & 0x38)>>>3))], R_[8][((b[i+1] & 0x7))])),Mov(F[1], Lt(R_[8][(((b[i+1] & 0x38)>>>3))], R_[8][((b[i+1] & 0x7))])),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Add(R_[8][(((b[i+1] & 0x38)>>>3))], i8(Neg(R_[8][((b[i+1] & 0x7))])))))];
	case 0x2b: return [(_pfxLength + 2),Mov(F[2], Eq(R_[32][(((b[i+1] & 0x38)>>>3))], ($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+1] & 0x7))]))))),Mov(F[1], Lt(R_[32][(((b[i+1] & 0x38)>>>3))], $0)),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Add(R_[32][(((b[i+1] & 0x38)>>>3))], int[(_pfxSizeSpecifier ? 16 : 32)](Neg($0))))];
	case 0xc02b: return [(_pfxLength + 2),Mov(F[2], Eq(R_[32][(((b[i+1] & 0x38)>>>3))], R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))])),Mov(F[1], Lt(R_[32][(((b[i+1] & 0x38)>>>3))], R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))])),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Add(R_[32][(((b[i+1] & 0x38)>>>3))], int[(_pfxSizeSpecifier ? 16 : 32)](Neg(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))]))))];
	case 0x30: return [(_pfxLength + 2),Mov(($0 = u8(Mem(R_[32][((b[i+1] & 0x7))]))), u8(Xor($0, R_[8][(((b[i+1] & 0x38)>>>3))])))];
	case 0xc030: return [(_pfxLength + 2),Mov(R_[8][((b[i+1] & 0x7))], u8(Xor(R_[8][((b[i+1] & 0x7))], R_[8][(((b[i+1] & 0x38)>>>3))])))];
	case 0x31: return [(_pfxLength + 2),Mov(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+1] & 0x7))]))), Xor($0, R_[32][(((b[i+1] & 0x38)>>>3))]))];
	case 0xc031: return [(_pfxLength + 2),Mov(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))], Xor(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))], R_[32][(((b[i+1] & 0x38)>>>3))]))];
	case 0x32: return [(_pfxLength + 2),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Xor(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Mem(R_[32][((b[i+1] & 0x7))])))))];
	case 0xc032: return [(_pfxLength + 2),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Xor(R_[8][(((b[i+1] & 0x38)>>>3))], R_[8][((b[i+1] & 0x7))])))];
	case 0x33: return [(_pfxLength + 2),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Xor(R_[32][(((b[i+1] & 0x38)>>>3))], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+1] & 0x7))]))))];
	case 0xc033: return [(_pfxLength + 2),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], Xor(R_[32][(((b[i+1] & 0x38)>>>3))], R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))]))];
	case 0x38: return [(_pfxLength + 2),Mov(F[2], Eq(($0 = u8(Mem(R_[32][((b[i+1] & 0x7))]))), R_[8][(((b[i+1] & 0x38)>>>3))])),Mov(F[1], Lt($0, R_[8][(((b[i+1] & 0x38)>>>3))]))];
	case 0xc038: return [(_pfxLength + 2),Mov(F[2], Eq(R_[8][((b[i+1] & 0x7))], R_[8][(((b[i+1] & 0x38)>>>3))])),Mov(F[1], Lt(R_[8][((b[i+1] & 0x7))], R_[8][(((b[i+1] & 0x38)>>>3))]))];
	case 0x39: return [(_pfxLength + 2),Mov(F[2], Eq(($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+1] & 0x7))]))), R_[32][(((b[i+1] & 0x38)>>>3))])),Mov(F[1], Lt($0, R_[32][(((b[i+1] & 0x38)>>>3))]))];
	case 0xc039: return [(_pfxLength + 2),Mov(F[2], Eq(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))], R_[32][(((b[i+1] & 0x38)>>>3))])),Mov(F[1], Lt(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))], R_[32][(((b[i+1] & 0x38)>>>3))]))];
	case 0x3a: return [(_pfxLength + 2),Mov(F[2], Eq(R_[8][(((b[i+1] & 0x38)>>>3))], ($0 = u8(Mem(R_[32][((b[i+1] & 0x7))]))))),Mov(F[1], Lt(R_[8][(((b[i+1] & 0x38)>>>3))], $0))];
	case 0xc03a: return [(_pfxLength + 2),Mov(F[2], Eq(R_[8][(((b[i+1] & 0x38)>>>3))], R_[8][((b[i+1] & 0x7))])),Mov(F[1], Lt(R_[8][(((b[i+1] & 0x38)>>>3))], R_[8][((b[i+1] & 0x7))]))];
	case 0x3b: return [(_pfxLength + 2),Mov(F[2], Eq(R_[32][(((b[i+1] & 0x38)>>>3))], ($0 = uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+1] & 0x7))]))))),Mov(F[1], Lt(R_[32][(((b[i+1] & 0x38)>>>3))], $0))];
	case 0xc03b: return [(_pfxLength + 2),Mov(F[2], Eq(R_[32][(((b[i+1] & 0x38)>>>3))], R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))])),Mov(F[1], Lt(R_[32][(((b[i+1] & 0x38)>>>3))], R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))]))];
	case 0x84: return [(_pfxLength + 2),Mov(F[2], Eq(And(u8(Mem(R_[32][((b[i+1] & 0x7))])), R_[8][(((b[i+1] & 0x38)>>>3))]), 0)),Mov(F[1], 0),Mov(F[0], 0)];
	case 0xc084: return [(_pfxLength + 2),Mov(F[2], Eq(And(R_[8][((b[i+1] & 0x7))], R_[8][(((b[i+1] & 0x38)>>>3))]), 0)),Mov(F[1], 0),Mov(F[0], 0)];
	case 0x85: return [(_pfxLength + 2),Mov(F[2], Eq(And(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+1] & 0x7))])), R_[32][(((b[i+1] & 0x38)>>>3))]), 0)),Mov(F[1], 0),Mov(F[0], 0)];
	case 0xc085: return [(_pfxLength + 2),Mov(F[2], Eq(And(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))], R_[32][(((b[i+1] & 0x38)>>>3))]), 0)),Mov(F[1], 0),Mov(F[0], 0)];
	case 0x86: return [(_pfxLength + 2),Swap(u8(Mem(R_[32][((b[i+1] & 0x7))])), R_[8][(((b[i+1] & 0x38)>>>3))])];
	case 0xc086: return [(_pfxLength + 2),Swap(R_[8][((b[i+1] & 0x7))], R_[8][(((b[i+1] & 0x38)>>>3))])];
	case 0x87: return [(_pfxLength + 2),Swap(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+1] & 0x7))])), R_[32][(((b[i+1] & 0x38)>>>3))])];
	case 0xc087: return [(_pfxLength + 2),Swap(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))], R_[32][(((b[i+1] & 0x38)>>>3))])];
	case 0x88: return [(_pfxLength + 2),Mov(u8(Mem(R_[32][((b[i+1] & 0x7))])), R_[8][(((b[i+1] & 0x38)>>>3))])];
	case 0xc088: return [(_pfxLength + 2),Mov(R_[8][((b[i+1] & 0x7))], R_[8][(((b[i+1] & 0x38)>>>3))])];
	case 0x89: return [(_pfxLength + 2),Mov(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+1] & 0x7))])), R_[32][(((b[i+1] & 0x38)>>>3))])];
	case 0xc089: return [(_pfxLength + 2),Mov(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))], R_[32][(((b[i+1] & 0x38)>>>3))])];
	case 0x8a: return [(_pfxLength + 2),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], u8(Mem(R_[32][((b[i+1] & 0x7))])))];
	case 0xc08a: return [(_pfxLength + 2),Mov(R_[8][(((b[i+1] & 0x38)>>>3))], R_[8][((b[i+1] & 0x7))])];
	case 0x8b: return [(_pfxLength + 2),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+1] & 0x7))])))];
	case 0xc08b: return [(_pfxLength + 2),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))])];
	case 0x8c: return [(_pfxLength + 2),Mov(uint[(_pfxSizeSpecifier ? 16 : 32)](Mem(R_[32][((b[i+1] & 0x7))])), R_.S[(((b[i+1] & 0x38)>>>3))])];
	case 0xc08c: return [(_pfxLength + 2),Mov(R_[(_pfxSizeSpecifier ? 16 : 32)][((b[i+1] & 0x7))], R_.S[(((b[i+1] & 0x38)>>>3))])];
	case 0x8d: return [(_pfxLength + 2),Mov(R_[32][(((b[i+1] & 0x38)>>>3))], R_[32][((b[i+1] & 0x7))])];
	case 0x8e: return [(_pfxLength + 2),Mov(R_.S[(((b[i+1] & 0x38)>>>3))], u16(Mem(R_[32][((b[i+1] & 0x7))])))];
	case 0xc08e: return [(_pfxLength + 2),Mov(R_.S[(((b[i+1] & 0x38)>>>3))], R_[16][((b[i+1] & 0x7))])];
	}

	switch((b[i+0]) & 0xff) {
	case 0x4: return [(_pfxLength + 2),Mov(R_[8][0], u8(Add(R_[8][0], (((b[i+1])<<24)>>24))))];
	case 0xc: return [(_pfxLength + 2),Mov(R_[8][0], u8(Or(R_[8][0], ((((b[i+1])<<24)>>24)&0xff))))];
	case 0x14: return [(_pfxLength + 2),Mov(R_[8][0], u8(Add(R_[8][0], u8(Add((((b[i+1])<<24)>>24), u8(F[1]))))))];
	case 0x1c: return [(_pfxLength + 2),Mov(R_[8][0], u8(Add(($0 = u8(Add(R_[8][0], ((-($1 = (((b[i+1])<<24)>>24))<<24)>>24)))), i8(Neg(($2 = u8(F[1])))))))];
	case 0x24: return [(_pfxLength + 2),Mov(R_[8][0], u8(And(R_[8][0], ((((b[i+1])<<24)>>24)&0xff))))];
	case 0x2c: return [(_pfxLength + 2),Mov(F[2], Eq(R_[8][0], ($0 = (((b[i+1])<<24)>>24)))),Mov(F[1], Lt(R_[8][0], $0)),Mov(R_[8][0], u8(Add(R_[8][0], ((-$0<<24)>>24))))];
	case 0x34: return [(_pfxLength + 2),Mov(R_[8][0], u8(Xor(R_[8][0], (((b[i+1])<<24)>>24))))];
	case 0x3c: return [(_pfxLength + 2),Mov(F[2], Eq(R_[8][0], ($0 = (((b[i+1])<<24)>>24)))),Mov(F[1], Lt(R_[8][0], $0))];
	case 0x6a: return [(_pfxLength + 2),Mov(R_[32][4], u32(Add(R_[32][4], -4))),Mov(u32(Mem(R_[32][4])), (($0 = (((b[i+1])<<24)>>24)&~0), ($0 < 0 ? $0+0x100000000 : $0)))];
	case 0x70: return [(_pfxLength + 2),If(F[0], Mov(R_[32][8], u32(Add(R_[32][8], (($1 = ((((b[i+1])<<24)>>24) + (_pfxLength + 2))&~0), ($1 < 0 ? $1+0x100000000 : $1))))))];
	case 0x71: return [(_pfxLength + 2),If(u1(Not(F[0])), Mov(R_[32][8], u32(Add(R_[32][8], (($2 = ((((b[i+1])<<24)>>24) + (_pfxLength + 2))&~0), ($2 < 0 ? $2+0x100000000 : $2))))))];
	case 0x72: return [(_pfxLength + 2),If(F[1], Mov(R_[32][8], u32(Add(R_[32][8], (($3 = ((((b[i+1])<<24)>>24) + (_pfxLength + 2))&~0), ($3 < 0 ? $3+0x100000000 : $3))))))];
	case 0x73: return [(_pfxLength + 2),If(u1(Not(F[1])), Mov(R_[32][8], u32(Add(R_[32][8], (($4 = ((((b[i+1])<<24)>>24) + (_pfxLength + 2))&~0), ($4 < 0 ? $4+0x100000000 : $4))))))];
	case 0x74: return [(_pfxLength + 2),If(F[2], Mov(R_[32][8], u32(Add(R_[32][8], (($5 = ((((b[i+1])<<24)>>24) + (_pfxLength + 2))&~0), ($5 < 0 ? $5+0x100000000 : $5))))))];
	case 0x75: return [(_pfxLength + 2),If(u1(Not(F[2])), Mov(R_[32][8], u32(Add(R_[32][8], (($6 = ((((b[i+1])<<24)>>24) + (_pfxLength + 2))&~0), ($6 < 0 ? $6+0x100000000 : $6))))))];
	case 0x76: return [(_pfxLength + 2),If(u1(Or(F[1], F[2])), Mov(R_[32][8], u32(Add(R_[32][8], (($7 = ((((b[i+1])<<24)>>24) + (_pfxLength + 2))&~0), ($7 < 0 ? $7+0x100000000 : $7))))))];
	case 0x77: return [(_pfxLength + 2),If(u1(And(u1(Not(F[1])), u1(Not(F[2])))), Mov(R_[32][8], u32(Add(R_[32][8], (($8 = ((((b[i+1])<<24)>>24) + (_pfxLength + 2))&~0), ($8 < 0 ? $8+0x100000000 : $8))))))];
	case 0x78: return [(_pfxLength + 2),If(F[3], Mov(R_[32][8], u32(Add(R_[32][8], (($9 = ((((b[i+1])<<24)>>24) + (_pfxLength + 2))&~0), ($9 < 0 ? $9+0x100000000 : $9))))))];
	case 0x79: return [(_pfxLength + 2),If(u1(Not(F[3])), Mov(R_[32][8], u32(Add(R_[32][8], (($10 = ((((b[i+1])<<24)>>24) + (_pfxLength + 2))&~0), ($10 < 0 ? $10+0x100000000 : $10))))))];
	case 0x7a: return [(_pfxLength + 2),If(F[4], Mov(R_[32][8], u32(Add(R_[32][8], (($11 = ((((b[i+1])<<24)>>24) + (_pfxLength + 2))&~0), ($11 < 0 ? $11+0x100000000 : $11))))))];
	case 0x7b: return [(_pfxLength + 2),If(u1(Not(F[4])), Mov(R_[32][8], u32(Add(R_[32][8], (($12 = ((((b[i+1])<<24)>>24) + (_pfxLength + 2))&~0), ($12 < 0 ? $12+0x100000000 : $12))))))];
	case 0x7c: return [(_pfxLength + 2),If(u1(Not(Eq(F[0], F[3]))), Mov(R_[32][8], u32(Add(R_[32][8], (($13 = ((((b[i+1])<<24)>>24) + (_pfxLength + 2))&~0), ($13 < 0 ? $13+0x100000000 : $13))))))];
	case 0x7d: return [(_pfxLength + 2),If(Eq(F[0], F[3]), Mov(R_[32][8], u32(Add(R_[32][8], (($14 = ((((b[i+1])<<24)>>24) + (_pfxLength + 2))&~0), ($14 < 0 ? $14+0x100000000 : $14))))))];
	case 0x7e: return [(_pfxLength + 2),If(u1(Or(F[2], u1(Not(Eq(F[0], F[3]))))), Mov(R_[32][8], u32(Add(R_[32][8], (($15 = ((((b[i+1])<<24)>>24) + (_pfxLength + 2))&~0), ($15 < 0 ? $15+0x100000000 : $15))))))];
	case 0x7f: return [(_pfxLength + 2),If(u1(And(u1(Not(F[2])), Eq(F[0], F[3]))), Mov(R_[32][8], u32(Add(R_[32][8], (($16 = ((((b[i+1])<<24)>>24) + (_pfxLength + 2))&~0), ($16 < 0 ? $16+0x100000000 : $16))))))];
	case 0xa8: return [(_pfxLength + 2),Mov(F[2], Eq(And(R_[8][0], (((b[i+1])<<24)>>24)), 0)),Mov(F[1], 0),Mov(F[0], 0)];
	case 0xb0: return [(_pfxLength + 2),Mov(R_[8][0], (((b[i+1])<<24)>>24))];
	case 0xb1: return [(_pfxLength + 2),Mov(R_[8][1], (((b[i+1])<<24)>>24))];
	case 0xb2: return [(_pfxLength + 2),Mov(R_[8][2], (((b[i+1])<<24)>>24))];
	case 0xb3: return [(_pfxLength + 2),Mov(R_[8][3], (((b[i+1])<<24)>>24))];
	case 0xb4: return [(_pfxLength + 2),Mov(R_[8][4], (((b[i+1])<<24)>>24))];
	case 0xb5: return [(_pfxLength + 2),Mov(R_[8][5], (((b[i+1])<<24)>>24))];
	case 0xb6: return [(_pfxLength + 2),Mov(R_[8][6], (((b[i+1])<<24)>>24))];
	case 0xb7: return [(_pfxLength + 2),Mov(R_[8][7], (((b[i+1])<<24)>>24))];
	case 0xeb: return [(_pfxLength + 2),Mov(R_[32][8], u32(Add(R_[32][8], (($19 = ((((b[i+1])<<24)>>24) + (_pfxLength + 2))&~0), ($19 < 0 ? $19+0x100000000 : $19)))))];
	}

	switch((b[i+0]) & 0xff) {
	case 0x90: return [(_pfxLength + 1),Nop()];
	case 0x91: return [(_pfxLength + 1),Swap(R_[32][0], R_[32][1])];
	case 0x92: return [(_pfxLength + 1),Swap(R_[32][0], R_[32][2])];
	case 0x93: return [(_pfxLength + 1),Swap(R_[32][0], R_[32][3])];
	case 0x94: return [(_pfxLength + 1),Swap(R_[32][0], R_[32][4])];
	case 0x95: return [(_pfxLength + 1),Swap(R_[32][0], R_[32][5])];
	case 0x96: return [(_pfxLength + 1),Swap(R_[32][0], R_[32][6])];
	case 0x97: return [(_pfxLength + 1),Swap(R_[32][0], R_[32][7])];
	case 0x99: return [(_pfxLength + 1),Mov(R_[32][2], i32(Neg(($0 = i32(Lt(R_[32][0], 0))))))];
	case 0x9c: return [(_pfxLength + 1),Mov(R_[32][4], u32(Add(R_[32][4], -4))),Mov(u32(Mem(R_[32][4])), R_.FLAGS[0])];
	case 0xa4: return [(_pfxLength + 1),Mov(u8(Mem(R_[32][6])), u8(Mem(R_[32][7])))];
	case 0xa5: return [(_pfxLength + 1),Mov(u32(Mem(R_[32][6])), u32(Mem(R_[32][7])))];
	case 0xaa: return [(_pfxLength + 1),Mov(u8(Mem(R_[32][7])), R_[8][0])];
	case 0xab: return [(_pfxLength + 1),Mov(u32(Mem(R_[32][7])), R_[32][0])];
	case 0xac: return [(_pfxLength + 1),Mov(R_[8][0], u8(Mem(R_[32][6])))];
	case 0xad: return [(_pfxLength + 1),Mov(R_[32][0], u32(Mem(R_[32][6])))];
	case 0xae: return [(_pfxLength + 1),Mov(F[2], Eq(R_[8][0], ($0 = u8(Mem(R_[32][7]))))),Mov(F[1], Lt(R_[8][0], $0))];
	case 0xaf: return [(_pfxLength + 1),Mov(F[2], Eq(R_[32][0], ($0 = u32(Mem(R_[32][6]))))),Mov(F[1], Lt(R_[32][0], $0))];
	case 0xc3: return [(_pfxLength + 1),Mov(R_[32][8], u32(Mem(R_[32][4]))),Mov(R_[32][4], u32(Add(R_[32][4], 4)))];
	case 0xc9: return [(_pfxLength + 1),Mov(R_[32][4], R_[32][5]),Mov(R_[32][5], u32(Mem(R_[32][4]))),Mov(R_[32][4], u32(Add(R_[32][4], 4)))];
	case 0xcc: return [(_pfxLength + 1),Interrupt(3)];
	case 0xf8: return [(_pfxLength + 1),Mov(F[1], 0)];
	case 0xf9: return [(_pfxLength + 1),Mov(F[1], 1)];
	case 0xfa: return [(_pfxLength + 1),Mov(F[7], 0)];
	case 0xfb: return [(_pfxLength + 1),Mov(F[7], 1)];
	case 0xfc: return [(_pfxLength + 1),Mov(F[6], 0)];
	case 0xfd: return [(_pfxLength + 1),Mov(F[6], 1)];
	case 0x6: return [(_pfxLength + 1),Mov(R_[32][4], u32(Add(R_[32][4], -2))),Mov(u16(Mem(R_[32][4])), R_.S[0])];
	case 0x7: return [(_pfxLength + 1),Mov(R_.S[0], u16(Mem(R_[32][4]))),Mov(R_[32][4], u32(Add(R_[32][4], 2)))];
	case 0xe: return [(_pfxLength + 1),Mov(R_[32][4], u32(Add(R_[32][4], -2))),Mov(u16(Mem(R_[32][4])), R_.S[1])];
	case 0x16: return [(_pfxLength + 1),Mov(R_[32][4], u32(Add(R_[32][4], -2))),Mov(u16(Mem(R_[32][4])), R_.S[5])];
	case 0x17: return [(_pfxLength + 1),Mov(R_.S[5], u16(Mem(R_[32][4]))),Mov(R_[32][4], u32(Add(R_[32][4], 2)))];
	case 0x1e: return [(_pfxLength + 1),Mov(R_[32][4], u32(Add(R_[32][4], -2))),Mov(u16(Mem(R_[32][4])), R_.S[3])];
	case 0x1f: return [(_pfxLength + 1),Mov(R_.S[3], u16(Mem(R_[32][4]))),Mov(R_[32][4], u32(Add(R_[32][4], 2)))];
	case 0x40: return [(_pfxLength + 1),Mov(R_[32][0], u32(Add(R_[32][0], 1)))];
	case 0x41: return [(_pfxLength + 1),Mov(R_[32][1], u32(Add(R_[32][1], 1)))];
	case 0x42: return [(_pfxLength + 1),Mov(R_[32][2], u32(Add(R_[32][2], 1)))];
	case 0x43: return [(_pfxLength + 1),Mov(R_[32][3], u32(Add(R_[32][3], 1)))];
	case 0x44: return [(_pfxLength + 1),Mov(R_[32][4], u32(Add(R_[32][4], 1)))];
	case 0x45: return [(_pfxLength + 1),Mov(R_[32][5], u32(Add(R_[32][5], 1)))];
	case 0x46: return [(_pfxLength + 1),Mov(R_[32][6], u32(Add(R_[32][6], 1)))];
	case 0x47: return [(_pfxLength + 1),Mov(R_[32][7], u32(Add(R_[32][7], 1)))];
	case 0x48: return [(_pfxLength + 1),Mov(R_[32][0], u32(Add(R_[32][0], -1)))];
	case 0x49: return [(_pfxLength + 1),Mov(R_[32][1], u32(Add(R_[32][1], -1)))];
	case 0x4a: return [(_pfxLength + 1),Mov(R_[32][2], u32(Add(R_[32][2], -1)))];
	case 0x4b: return [(_pfxLength + 1),Mov(R_[32][3], u32(Add(R_[32][3], -1)))];
	case 0x4c: return [(_pfxLength + 1),Mov(R_[32][4], u32(Add(R_[32][4], -1)))];
	case 0x4d: return [(_pfxLength + 1),Mov(R_[32][5], u32(Add(R_[32][5], -1)))];
	case 0x4e: return [(_pfxLength + 1),Mov(R_[32][6], u32(Add(R_[32][6], -1)))];
	case 0x4f: return [(_pfxLength + 1),Mov(R_[32][7], u32(Add(R_[32][7], -1)))];
	case 0x50: return [(_pfxLength + 1),Mov(R_[32][4], u32(Add(R_[32][4], -4))),Mov(u32(Mem(R_[32][4])), R_[32][0])];
	case 0x51: return [(_pfxLength + 1),Mov(R_[32][4], u32(Add(R_[32][4], -4))),Mov(u32(Mem(R_[32][4])), R_[32][1])];
	case 0x52: return [(_pfxLength + 1),Mov(R_[32][4], u32(Add(R_[32][4], -4))),Mov(u32(Mem(R_[32][4])), R_[32][2])];
	case 0x53: return [(_pfxLength + 1),Mov(R_[32][4], u32(Add(R_[32][4], -4))),Mov(u32(Mem(R_[32][4])), R_[32][3])];
	case 0x54: return [(_pfxLength + 1),Mov(R_[32][4], u32(Add(R_[32][4], -4))),Mov(u32(Mem(R_[32][4])), R_[32][4])];
	case 0x55: return [(_pfxLength + 1),Mov(R_[32][4], u32(Add(R_[32][4], -4))),Mov(u32(Mem(R_[32][4])), R_[32][5])];
	case 0x56: return [(_pfxLength + 1),Mov(R_[32][4], u32(Add(R_[32][4], -4))),Mov(u32(Mem(R_[32][4])), R_[32][6])];
	case 0x57: return [(_pfxLength + 1),Mov(R_[32][4], u32(Add(R_[32][4], -4))),Mov(u32(Mem(R_[32][4])), R_[32][7])];
	case 0x58: return [(_pfxLength + 1),Mov(R_[32][0], u32(Mem(R_[32][4]))),Mov(R_[32][4], u32(Add(R_[32][4], 4)))];
	case 0x59: return [(_pfxLength + 1),Mov(R_[32][1], u32(Mem(R_[32][4]))),Mov(R_[32][4], u32(Add(R_[32][4], 4)))];
	case 0x5a: return [(_pfxLength + 1),Mov(R_[32][2], u32(Mem(R_[32][4]))),Mov(R_[32][4], u32(Add(R_[32][4], 4)))];
	case 0x5b: return [(_pfxLength + 1),Mov(R_[32][3], u32(Mem(R_[32][4]))),Mov(R_[32][4], u32(Add(R_[32][4], 4)))];
	case 0x5c: return [(_pfxLength + 1),Mov(R_[32][4], u32(Mem(R_[32][4]))),Mov(R_[32][4], u32(Add(R_[32][4], 4)))];
	case 0x5d: return [(_pfxLength + 1),Mov(R_[32][5], u32(Mem(R_[32][4]))),Mov(R_[32][4], u32(Add(R_[32][4], 4)))];
	case 0x5e: return [(_pfxLength + 1),Mov(R_[32][6], u32(Mem(R_[32][4]))),Mov(R_[32][4], u32(Add(R_[32][4], 4)))];
	case 0x5f: return [(_pfxLength + 1),Mov(R_[32][7], u32(Mem(R_[32][4]))),Mov(R_[32][4], u32(Add(R_[32][4], 4)))];
	}

}
exports.PC = R.EIP;
exports.SP = R.ESP;
exports.FP = R.EBP;
