/** @file arch-8051.js This file was auto-generated */
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
var R = exports.R = {}, SFR8 = [], SFR16 = [];
var PC = R.PC = {bitsof: 32, signed: false, inspect: function() {return 'PC';}};
R.SP = SFR8[1] = {bitsof: 8, signed: false, inspect: function() {return 'SP';}};
R.DPTR = SFR16[2] = {bitsof: 16, signed: false, inspect: function() {return 'DPTR';}};
R.DPL = SFR8[2] = {bitsof: 8, signed: false, inspect: function() {return 'DPL';}};
R.DPH = SFR8[3] = {bitsof: 8, signed: false, inspect: function() {return 'DPH';}};
R.A = SFR8[96] = {bitsof: 8, signed: false, inspect: function() {return 'A';}};
R.B = SFR8[112] = {bitsof: 8, signed: false, inspect: function() {return 'B';}};
R.SFR_00 = SFR8[0] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_00';}};
R.SFR_04 = SFR8[4] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_04';}};
R.SFR_05 = SFR8[5] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_05';}};
R.SFR_06 = SFR8[6] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_06';}};
R.SFR_07 = SFR8[7] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_07';}};
R.SFR_08 = SFR8[8] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_08';}};
R.SFR_09 = SFR8[9] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_09';}};
R.SFR_0a = SFR8[10] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_0a';}};
R.SFR_0b = SFR8[11] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_0b';}};
R.SFR_0c = SFR8[12] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_0c';}};
R.SFR_0d = SFR8[13] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_0d';}};
R.SFR_0e = SFR8[14] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_0e';}};
R.SFR_0f = SFR8[15] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_0f';}};
R.SFR_10 = SFR8[16] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_10';}};
R.SFR_11 = SFR8[17] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_11';}};
R.SFR_12 = SFR8[18] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_12';}};
R.SFR_13 = SFR8[19] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_13';}};
R.SFR_14 = SFR8[20] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_14';}};
R.SFR_15 = SFR8[21] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_15';}};
R.SFR_16 = SFR8[22] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_16';}};
R.SFR_17 = SFR8[23] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_17';}};
R.SFR_18 = SFR8[24] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_18';}};
R.SFR_19 = SFR8[25] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_19';}};
R.SFR_1a = SFR8[26] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_1a';}};
R.SFR_1b = SFR8[27] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_1b';}};
R.SFR_1c = SFR8[28] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_1c';}};
R.SFR_1d = SFR8[29] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_1d';}};
R.SFR_1e = SFR8[30] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_1e';}};
R.SFR_1f = SFR8[31] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_1f';}};
R.SFR_20 = SFR8[32] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_20';}};
R.SFR_21 = SFR8[33] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_21';}};
R.SFR_22 = SFR8[34] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_22';}};
R.SFR_23 = SFR8[35] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_23';}};
R.SFR_24 = SFR8[36] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_24';}};
R.SFR_25 = SFR8[37] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_25';}};
R.SFR_26 = SFR8[38] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_26';}};
R.SFR_27 = SFR8[39] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_27';}};
R.SFR_28 = SFR8[40] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_28';}};
R.SFR_29 = SFR8[41] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_29';}};
R.SFR_2a = SFR8[42] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_2a';}};
R.SFR_2b = SFR8[43] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_2b';}};
R.SFR_2c = SFR8[44] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_2c';}};
R.SFR_2d = SFR8[45] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_2d';}};
R.SFR_2e = SFR8[46] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_2e';}};
R.SFR_2f = SFR8[47] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_2f';}};
R.SFR_30 = SFR8[48] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_30';}};
R.SFR_31 = SFR8[49] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_31';}};
R.SFR_32 = SFR8[50] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_32';}};
R.SFR_33 = SFR8[51] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_33';}};
R.SFR_34 = SFR8[52] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_34';}};
R.SFR_35 = SFR8[53] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_35';}};
R.SFR_36 = SFR8[54] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_36';}};
R.SFR_37 = SFR8[55] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_37';}};
R.SFR_38 = SFR8[56] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_38';}};
R.SFR_39 = SFR8[57] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_39';}};
R.SFR_3a = SFR8[58] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_3a';}};
R.SFR_3b = SFR8[59] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_3b';}};
R.SFR_3c = SFR8[60] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_3c';}};
R.SFR_3d = SFR8[61] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_3d';}};
R.SFR_3e = SFR8[62] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_3e';}};
R.SFR_3f = SFR8[63] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_3f';}};
R.SFR_40 = SFR8[64] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_40';}};
R.SFR_41 = SFR8[65] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_41';}};
R.SFR_42 = SFR8[66] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_42';}};
R.SFR_43 = SFR8[67] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_43';}};
R.SFR_44 = SFR8[68] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_44';}};
R.SFR_45 = SFR8[69] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_45';}};
R.SFR_46 = SFR8[70] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_46';}};
R.SFR_47 = SFR8[71] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_47';}};
R.SFR_48 = SFR8[72] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_48';}};
R.SFR_49 = SFR8[73] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_49';}};
R.SFR_4a = SFR8[74] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_4a';}};
R.SFR_4b = SFR8[75] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_4b';}};
R.SFR_4c = SFR8[76] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_4c';}};
R.SFR_4d = SFR8[77] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_4d';}};
R.SFR_4e = SFR8[78] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_4e';}};
R.SFR_4f = SFR8[79] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_4f';}};
R.SFR_50 = SFR8[80] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_50';}};
R.SFR_51 = SFR8[81] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_51';}};
R.SFR_52 = SFR8[82] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_52';}};
R.SFR_53 = SFR8[83] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_53';}};
R.SFR_54 = SFR8[84] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_54';}};
R.SFR_55 = SFR8[85] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_55';}};
R.SFR_56 = SFR8[86] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_56';}};
R.SFR_57 = SFR8[87] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_57';}};
R.SFR_58 = SFR8[88] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_58';}};
R.SFR_59 = SFR8[89] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_59';}};
R.SFR_5a = SFR8[90] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_5a';}};
R.SFR_5b = SFR8[91] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_5b';}};
R.SFR_5c = SFR8[92] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_5c';}};
R.SFR_5d = SFR8[93] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_5d';}};
R.SFR_5e = SFR8[94] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_5e';}};
R.SFR_5f = SFR8[95] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_5f';}};
R.SFR_61 = SFR8[97] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_61';}};
R.SFR_62 = SFR8[98] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_62';}};
R.SFR_63 = SFR8[99] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_63';}};
R.SFR_64 = SFR8[100] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_64';}};
R.SFR_65 = SFR8[101] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_65';}};
R.SFR_66 = SFR8[102] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_66';}};
R.SFR_67 = SFR8[103] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_67';}};
R.SFR_68 = SFR8[104] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_68';}};
R.SFR_69 = SFR8[105] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_69';}};
R.SFR_6a = SFR8[106] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_6a';}};
R.SFR_6b = SFR8[107] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_6b';}};
R.SFR_6c = SFR8[108] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_6c';}};
R.SFR_6d = SFR8[109] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_6d';}};
R.SFR_6e = SFR8[110] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_6e';}};
R.SFR_6f = SFR8[111] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_6f';}};
R.SFR_71 = SFR8[113] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_71';}};
R.SFR_72 = SFR8[114] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_72';}};
R.SFR_73 = SFR8[115] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_73';}};
R.SFR_74 = SFR8[116] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_74';}};
R.SFR_75 = SFR8[117] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_75';}};
R.SFR_76 = SFR8[118] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_76';}};
R.SFR_77 = SFR8[119] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_77';}};
R.SFR_78 = SFR8[120] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_78';}};
R.SFR_79 = SFR8[121] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_79';}};
R.SFR_7a = SFR8[122] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_7a';}};
R.SFR_7b = SFR8[123] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_7b';}};
R.SFR_7c = SFR8[124] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_7c';}};
R.SFR_7d = SFR8[125] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_7d';}};
R.SFR_7e = SFR8[126] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_7e';}};
R.SFR_7f = SFR8[127] = {bitsof: 8, signed: false, inspect: function() {return 'SFR_7f';}};
var F = [];
R.C = F[0] = {bitsof: 1, signed: false, inspect: function() {return 'C';}};
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
var u4 = uint[4] = function u4(x) {
    if(known(x))
        return (x&0xf);
    if(x.bitsof === 4 && x.signed === false)
        return x;
    if(x.hasOwnProperty('fn') && x.fn == 'Mem') {
        x.bitsof = 4;
        return Object.create(x, {
            value: {get: function() {
                var v = valueof(x);
                if(v !== x)
                    return v.fn == 'Mem' ? u4(v) : v;
            }, set: function(v) {
                x.value = v;
            }},
            lvalue: {get: function() {
                var v = lvalueof(x);
                if(v !== x)
                    return v.fn == 'Mem' ? u4(v) : v;
            }},
        });
    }
    return Object.create(x, {
        bitsof: {value: 4},
        signed: {value: false},
        value: {get: function() {
            var v = valueof(x);
            if(v !== x)
                return u4(v);
        }, set: function(v) {
            x.value = v;
        }},
        lvalue: {get: function() {
            if(x.fn != 'Mem')
                return;
            var v = lvalueof(x);
            if(v !== x)
                return u4(v);
        }},
        inspect: {value: function(_, p) {
            var wrap = ('bitsof' in x) && x.bitsof != 4;
            var ix = x.inspect ? x.inspect.call(this, _, !wrap && p || 16) : inspect(x, !wrap && p);
            return wrap ? 'u4('+ix+')' : ix;
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
exports.dis = function _8051dis(b, i) {
    
	var $0, $1, $2;
if(((b[i+0]) & 0xff) == 0x85)
	switch((((b[i+1] & 0x80)>>>7)|(b[i+2]<<1)) & 0x101) {
	case 0x0: return [3,Mov(u8(Mem(((b[i+2] & 0x7f)))), ($0 = u8(Mem(((b[i+1] & 0x7f))))))];
	case 0x100: return [3,Mov(SFR8[((b[i+2] & 0x7f))], $0)];
	case 0x1: return [3,Mov(u8(Mem(((b[i+2] & 0x7f)))), SFR8[((b[i+1] & 0x7f))])];
	case 0x101: return [3,Mov(SFR8[((b[i+2] & 0x7f))], SFR8[((b[i+1] & 0x7f))])];
	}
if(((((b[i+0] & 0x78)>>>3)) & 0x9) == 0x0)
	switch((b[i+0]) & 0xb7) {
	case 0x2: return [3,Mov(PC, (($0 = (exports.PCbase + (b[i+2]|(b[i+1]<<8)))&~0), ($0 < 0 ? $0+0x100000000 : $0)))];
	case 0x12: return [3,Mov(SFR8[1], u8(Add(SFR8[1], 4))),Mov(u32(Mem(SFR8[1])), u32(Add(PC, 3))),Mov(PC, (($1 = (exports.PCbase + (b[i+2]|(b[i+1]<<8)))&~0), ($1 < 0 ? $1+0x100000000 : $1)))];
	case 0x90: return [3,Mov(SFR16[2], (b[i+2]|(b[i+1]<<8)))];
	case 0xb4: return [3,If(Eq(SFR8[96], (b[i+1])), Mov(PC, u32(Add(PC, ((((((b[i+2])<<24)>>24) + 3)<<24)>>24)))))];
	case 0xb6: return [3,If(Eq(u8(Mem(u8(Mem(0)))), (b[i+1])), Mov(PC, u32(Add(PC, ((((((b[i+2])<<24)>>24) + 3)<<24)>>24)))))];
	case 0xb7: return [3,If(Eq(u8(Mem(u8(Mem(1)))), (b[i+1])), Mov(PC, u32(Add(PC, ((((((b[i+2])<<24)>>24) + 3)<<24)>>24)))))];
	}
if(((((b[i+0] & 0x8)>>>3)) & 0x1) == 0x0)
	switch((b[i+0]|(b[i+1]<<8)) & 0x80f7) {
	case 0x20: return [3,If(u1(Not(Eq(u8(And(u8(Mem((((((b[i+1] & 0x78)>>>3)) + 32)&0xf))), ((1 << ((b[i+1] & 0x7)))&0xff))), 0))), Mov(PC, u32(Add(PC, ((((((b[i+2])<<24)>>24) + 3)<<24)>>24)))))];
	case 0x8020: return [3,If(u1(Not(Eq(u8(And(SFR8[(((((b[i+1] & 0x78)>>>3)) << 4)&0xf)], ((1 << ((b[i+1] & 0x7)))&0xff))), 0))), Mov(PC, u32(Add(PC, ((((((b[i+2])<<24)>>24) + 3)<<24)>>24)))))];
	case 0x30: return [3,If(Eq(u8(And(u8(Mem((((((b[i+1] & 0x78)>>>3)) + 32)&0xf))), ((1 << ((b[i+1] & 0x7)))&0xff))), 0), Mov(PC, u32(Add(PC, ((((((b[i+2])<<24)>>24) + 3)<<24)>>24)))))];
	case 0x8030: return [3,If(Eq(u8(And(SFR8[(((((b[i+1] & 0x78)>>>3)) << 4)&0xf)], ((1 << ((b[i+1] & 0x7)))&0xff))), 0), Mov(PC, u32(Add(PC, ((((((b[i+2])<<24)>>24) + 3)<<24)>>24)))))];
	case 0x43: return [3,Mov(($0 = u8(Mem(((b[i+1] & 0x7f))))), u8(Or($0, (b[i+2]))))];
	case 0x8043: return [3,Mov(SFR8[((b[i+1] & 0x7f))], u8(Or(SFR8[((b[i+1] & 0x7f))], (b[i+2]))))];
	case 0x53: return [3,Mov(($0 = u8(Mem(((b[i+1] & 0x7f))))), u8(And($0, (b[i+2]))))];
	case 0x8053: return [3,Mov(SFR8[((b[i+1] & 0x7f))], u8(And(SFR8[((b[i+1] & 0x7f))], (b[i+2]))))];
	case 0x75: return [3,Mov(u8(Mem(((b[i+1] & 0x7f)))), (b[i+2]))];
	case 0x8075: return [3,Mov(SFR8[((b[i+1] & 0x7f))], (b[i+2]))];
	case 0xb5: return [3,If(Eq(SFR8[96], u8(Mem(((b[i+1] & 0x7f))))), Mov(PC, u32(Add(PC, ((((((b[i+2])<<24)>>24) + 3)<<24)>>24)))))];
	case 0x80b5: return [3,If(Eq(SFR8[96], SFR8[((b[i+1] & 0x7f))]), Mov(PC, u32(Add(PC, ((((((b[i+2])<<24)>>24) + 3)<<24)>>24)))))];
	case 0xd5: return [3,Mov(($0 = u8(Mem(((b[i+1] & 0x7f))))), u8(Add($0, -1))),If(u1(Not(Eq($0, 0))), Mov(PC, u32(Add(PC, ((((((b[i+2])<<24)>>24) + 3)<<24)>>24)))))];
	case 0x80d5: return [3,Mov(SFR8[((b[i+1] & 0x7f))], u8(Add(SFR8[((b[i+1] & 0x7f))], -1))),If(u1(Not(Eq(SFR8[((b[i+1] & 0x7f))], 0))), Mov(PC, u32(Add(PC, ((((((b[i+2])<<24)>>24) + 3)<<24)>>24)))))];
	}
if(((((b[i+0] & 0xf8)>>>3)) & 0x1f) == 0x17)
	switch(0) {
	case 0x0: return [3,If(Eq(u8(Mem(((b[i+0] & 0x7)))), (b[i+1])), Mov(PC, u32(Add(PC, ((((((b[i+2])<<24)>>24) + 3)<<24)>>24)))))];
	}
if(((((b[i+0] & 0x8)>>>3)) & 0x1) == 0x0)
	switch((b[i+0]|(b[i+1]<<8)) & 0x80f7) {
	case 0x5: return [2,Mov(($0 = u8(Mem(((b[i+1] & 0x7f))))), u8(Add($0, 1)))];
	case 0x8005: return [2,Mov(SFR8[((b[i+1] & 0x7f))], u8(Add(SFR8[((b[i+1] & 0x7f))], 1)))];
	case 0x15: return [2,Mov(($0 = u8(Mem(((b[i+1] & 0x7f))))), u8(Add($0, -1)))];
	case 0x8015: return [2,Mov(SFR8[((b[i+1] & 0x7f))], u8(Add(SFR8[((b[i+1] & 0x7f))], -1)))];
	case 0x25: return [2,Mov(SFR8[96], u8(Add(SFR8[96], u8(Mem(((b[i+1] & 0x7f)))))))];
	case 0x8025: return [2,Mov(SFR8[96], u8(Add(SFR8[96], SFR8[((b[i+1] & 0x7f))])))];
	case 0x35: return [2,Mov(SFR8[96], u8(Add(u8(Add(SFR8[96], u8(Mem(((b[i+1] & 0x7f)))))), u8(F[0]))))];
	case 0x8035: return [2,Mov(SFR8[96], u8(Add(u8(Add(SFR8[96], SFR8[((b[i+1] & 0x7f))])), u8(F[0]))))];
	case 0x45: return [2,Mov(SFR8[96], u8(Or(SFR8[96], u8(Mem(((b[i+1] & 0x7f)))))))];
	case 0x8045: return [2,Mov(SFR8[96], u8(Or(SFR8[96], SFR8[((b[i+1] & 0x7f))])))];
	case 0x52: return [2,Mov(($0 = u8(Mem(((b[i+1] & 0x7f))))), u8(And($0, SFR8[96])))];
	case 0x8052: return [2,Mov(SFR8[((b[i+1] & 0x7f))], u8(And(SFR8[((b[i+1] & 0x7f))], SFR8[96])))];
	case 0x55: return [2,Mov(SFR8[96], u8(And(SFR8[96], u8(Mem(((b[i+1] & 0x7f)))))))];
	case 0x8055: return [2,Mov(SFR8[96], u8(And(SFR8[96], SFR8[((b[i+1] & 0x7f))])))];
	case 0x65: return [2,Mov(SFR8[96], u8(Xor(SFR8[96], u8(Mem(((b[i+1] & 0x7f)))))))];
	case 0x8065: return [2,Mov(SFR8[96], u8(Xor(SFR8[96], SFR8[((b[i+1] & 0x7f))])))];
	case 0x86: return [2,Mov(u8(Mem(((b[i+1] & 0x7f)))), u8(Mem(u8(Mem(0)))))];
	case 0x8086: return [2,Mov(SFR8[((b[i+1] & 0x7f))], u8(Mem(u8(Mem(0)))))];
	case 0x87: return [2,Mov(u8(Mem(((b[i+1] & 0x7f)))), u8(Mem(u8(Mem(1)))))];
	case 0x8087: return [2,Mov(SFR8[((b[i+1] & 0x7f))], u8(Mem(u8(Mem(1)))))];
	case 0x92: return [2,Mov(($0 = u8(Mem((((((b[i+1] & 0x78)>>>3)) + 32)&0xf)))), u8(Or($0, u8(LSL(u8(F[0]), ((b[i+1] & 0x7)))))))];
	case 0x8092: return [2,Mov(SFR8[(((((b[i+1] & 0x78)>>>3)) << 4)&0xf)], u8(Or(SFR8[(((((b[i+1] & 0x78)>>>3)) << 4)&0xf)], u8(LSL(u8(F[0]), ((b[i+1] & 0x7)))))))];
	case 0x95: return [2,Mov(F[0], Lt(($0 = u8(Add(SFR8[96], i8(Neg(($1 = u8(Mem(((b[i+1] & 0x7f)))))))))), ($2 = u8(F[0])))),Mov(SFR8[96], u8(Add($0, i8(Neg($2)))))];
	case 0x8095: return [2,Mov(F[0], Lt(($0 = u8(Add(SFR8[96], i8(Neg(SFR8[((b[i+1] & 0x7f))]))))), ($1 = u8(F[0])))),Mov(SFR8[96], u8(Add($0, i8(Neg($1)))))];
	case 0xa2: return [2,Mov(F[0], u1(Not(Eq(And(u8(Mem((((((b[i+1] & 0x78)>>>3)) + 32)&0xf))), (1 << ((b[i+1] & 0x7)))), 0))))];
	case 0x80a2: return [2,Mov(F[0], u1(Not(Eq(And(SFR8[(((((b[i+1] & 0x78)>>>3)) << 4)&0xf)], (1 << ((b[i+1] & 0x7)))), 0))))];
	case 0xa6: return [2,Mov(u8(Mem(u8(Mem(0)))), u8(Mem(((b[i+1] & 0x7f)))))];
	case 0x80a6: return [2,Mov(u8(Mem(u8(Mem(0)))), SFR8[((b[i+1] & 0x7f))])];
	case 0xa7: return [2,Mov(u8(Mem(u8(Mem(1)))), u8(Mem(((b[i+1] & 0x7f)))))];
	case 0x80a7: return [2,Mov(u8(Mem(u8(Mem(1)))), SFR8[((b[i+1] & 0x7f))])];
	case 0xc0: return [2,Mov(SFR8[1], u8(Add(SFR8[1], 1))),Mov(u8(Mem(SFR8[1])), u8(Mem(((b[i+1] & 0x7f)))))];
	case 0x80c0: return [2,Mov(SFR8[1], u8(Add(SFR8[1], 1))),Mov(u8(Mem(SFR8[1])), SFR8[((b[i+1] & 0x7f))])];
	case 0xc2: return [2,Mov(($0 = u8(Mem((((((b[i+1] & 0x78)>>>3)) + 32)&0xf)))), u8(And($0, (~((1 << ((b[i+1] & 0x7)))&0xff)&0xff))))];
	case 0x80c2: return [2,Mov(SFR8[(((((b[i+1] & 0x78)>>>3)) << 4)&0xf)], u8(And(SFR8[(((((b[i+1] & 0x78)>>>3)) << 4)&0xf)], (~((1 << ((b[i+1] & 0x7)))&0xff)&0xff))))];
	case 0xc5: return [2,Swap(SFR8[96], u8(Mem(((b[i+1] & 0x7f)))))];
	case 0x80c5: return [2,Swap(SFR8[96], SFR8[((b[i+1] & 0x7f))])];
	case 0xd0: return [2,Mov(SFR8[1], u8(Add(SFR8[1], -1))),Mov(u8(Mem(((b[i+1] & 0x7f)))), u8(Mem(SFR8[1])))];
	case 0x80d0: return [2,Mov(SFR8[1], u8(Add(SFR8[1], -1))),Mov(SFR8[((b[i+1] & 0x7f))], u8(Mem(SFR8[1])))];
	case 0xd2: return [2,Mov(($0 = u8(Mem((((((b[i+1] & 0x78)>>>3)) + 32)&0xf)))), Or($0, (1 << ((b[i+1] & 0x7)))))];
	case 0x80d2: return [2,Mov(SFR8[(((((b[i+1] & 0x78)>>>3)) << 4)&0xf)], Or(SFR8[(((((b[i+1] & 0x78)>>>3)) << 4)&0xf)], (1 << ((b[i+1] & 0x7)))))];
	case 0xe5: return [2,Mov(SFR8[96], u8(Mem(((b[i+1] & 0x7f)))))];
	case 0x80e5: return [2,Mov(SFR8[96], SFR8[((b[i+1] & 0x7f))])];
	case 0xf5: return [2,Mov(u8(Mem(((b[i+1] & 0x7f)))), SFR8[96])];
	case 0x80f5: return [2,Mov(SFR8[((b[i+1] & 0x7f))], SFR8[96])];
	}
if(((((b[i+0] & 0x8)>>>3)) & 0x1) == 0x0)
	switch((b[i+0]) & 0xf7) {
	case 0x24: return [2,Mov(SFR8[96], u8(Add(SFR8[96], (b[i+1]))))];
	case 0x34: return [2,Mov(SFR8[96], u8(Add(u8(Add(SFR8[96], (b[i+1]))), u8(F[0]))))];
	case 0x40: return [2,If(F[0], Mov(PC, u32(Add(PC, ((((((b[i+1])<<24)>>24) + 2)<<24)>>24)))))];
	case 0x44: return [2,Mov(SFR8[96], u8(Or(SFR8[96], (b[i+1]))))];
	case 0x50: return [2,If(u1(Not(F[0])), Mov(PC, u32(Add(PC, ((((((b[i+1])<<24)>>24) + 2)<<24)>>24)))))];
	case 0x54: return [2,Mov(SFR8[96], u8(And(SFR8[96], (b[i+1]))))];
	case 0x60: return [2,If(Eq(SFR8[96], 0), Mov(PC, u32(Add(PC, ((((((b[i+1])<<24)>>24) + 2)<<24)>>24)))))];
	case 0x64: return [2,Mov(SFR8[96], u8(Xor(SFR8[96], (b[i+1]))))];
	case 0x70: return [2,If(u1(Not(Eq(SFR8[96], 0))), Mov(PC, u32(Add(PC, ((((((b[i+1])<<24)>>24) + 2)<<24)>>24)))))];
	case 0x74: return [2,Mov(SFR8[96], (b[i+1]))];
	case 0x76: return [2,Mov(u8(Mem(u8(Mem(0)))), (b[i+1]))];
	case 0x77: return [2,Mov(u8(Mem(u8(Mem(1)))), (b[i+1]))];
	case 0x80: return [2,Mov(PC, u32(Add(PC, ((((((b[i+1])<<24)>>24) + 2)<<24)>>24))))];
	case 0x94: return [2,Mov(F[0], Lt(($0 = u8(Add(SFR8[96], ((-($1 = (b[i+1]))<<24)>>24)))), ($2 = u8(F[0])))),Mov(SFR8[96], u8(Add($0, i8(Neg($2)))))];
	}
if(((((b[i+0] & 0xf8)>>>3)) & 0x1b) == 0x11)
	switch((((b[i+0] & 0xe0)>>>5)|(b[i+1]<<3)) & 0x401) {
	case 0x0: return [2,Mov(u8(Mem(((b[i+1] & 0x7f)))), u8(Mem(((b[i+0] & 0x7)))))];
	case 0x400: return [2,Mov(SFR8[((b[i+1] & 0x7f))], u8(Mem(((b[i+0] & 0x7)))))];
	case 0x1: return [2,Mov(u8(Mem(((b[i+0] & 0x7)))), u8(Mem(((b[i+1] & 0x7f)))))];
	case 0x401: return [2,Mov(u8(Mem(((b[i+0] & 0x7)))), SFR8[((b[i+1] & 0x7f))])];
	}
if(((((b[i+0] & 0x78)>>>3)) & 0xb) == 0xb)
	switch((((b[i+0] & 0xe0)>>>5)) & 0x5) {
	case 0x1: return [2,Mov(u8(Mem(((b[i+0] & 0x7)))), (b[i+1]))];
	case 0x4: return [2,Mov(($0 = u8(Mem(((b[i+0] & 0x7))))), u8(Add($0, -1))),If(u1(Not(Eq($0, 0))), Mov(PC, u32(Add(PC, ((((((b[i+1])<<24)>>24) + 2)<<24)>>24)))))];
	}
if(((((b[i+0] & 0x8)>>>3)) & 0x1) == 0x0)
	switch((b[i+0]) & 0xf7) {
	case 0x84: return [1,Mov(SFR8[96], u8(Div(SFR8[96], SFR8[0x70])))];
	case 0x93: return [1,Mov(SFR8[96], u8(Mem(u32(Add(exports.PCbase, u16(Add(SFR16[2], SFR8[96])))))))];
	case 0x96: return [1,Mov(F[0], Lt(($0 = u8(Add(SFR8[96], i8(Neg(($1 = u8(Mem(u8(Mem(0)))))))))), ($2 = u8(F[0])))),Mov(SFR8[96], u8(Add($0, i8(Neg($2)))))];
	case 0x97: return [1,Mov(F[0], Lt(($0 = u8(Add(SFR8[96], i8(Neg(($1 = u8(Mem(u8(Mem(1)))))))))), ($2 = u8(F[0])))),Mov(SFR8[96], u8(Add($0, i8(Neg($2)))))];
	case 0xa3: return [1,Mov(SFR16[2], u16(Add(SFR16[2], 1)))];
	case 0xa4: return [1,Mov(SFR8[96], ($0 = u8(Mul(SFR8[96], SFR8[0x70])))),Mov(SFR8[0x70], u8(LSR($0, 8)))];
	case 0xc3: return [1,Mov(F[0], 0)];
	case 0xc4: return [1,Mov(SFR8[96], u8(Or(u8(LSL(SFR8[96], 4)), u8(LSR(SFR8[96], 4)))))];
	case 0xc6: return [1,Swap(SFR8[96], u8(Mem(u8(Mem(0)))))];
	case 0xc7: return [1,Swap(SFR8[96], u8(Mem(u8(Mem(1)))))];
	case 0xd3: return [1,Mov(F[0], 1)];
	case 0xe0: return [1,Mov(SFR8[96], u8(Mem(u32(Add(u32(SFR16[2]), 0xe0000)))))];
	case 0xe4: return [1,Mov(SFR8[96], 0)];
	case 0xe6: return [1,Mov(SFR8[96], u8(Mem(u8(Mem(0)))))];
	case 0xe7: return [1,Mov(SFR8[96], u8(Mem(u8(Mem(1)))))];
	case 0xf0: return [1,Mov(u8(Mem(u32(Add(u32(SFR16[2]), 0xe0000)))), SFR8[96])];
	case 0xf4: return [1,Mov(SFR8[96], u8(Not(SFR8[96])))];
	case 0xf6: return [1,Mov(u8(Mem(u8(Mem(0)))), SFR8[96])];
	case 0xf7: return [1,Mov(u8(Mem(u8(Mem(1)))), SFR8[96])];
	case 0x0: return [1,Nop()];
	case 0x4: return [1,Mov(SFR8[96], u8(Add(SFR8[96], 1)))];
	case 0x6: return [1,Mov(($0 = u8(Mem(u8(Mem(0))))), u8(Add($0, 1)))];
	case 0x7: return [1,Mov(($0 = u8(Mem(u8(Mem(1))))), u8(Add($0, 1)))];
	case 0x13: return [1,Mov(SFR8[96], u8(Or(u8(LSR(SFR8[96], 1)), u8(LSL(u8(F[0]), 7)))))];
	case 0x14: return [1,Mov(SFR8[96], u8(Add(SFR8[96], -1)))];
	case 0x16: return [1,Mov(($0 = u8(Mem(u8(Mem(0))))), u8(Add($0, -1)))];
	case 0x17: return [1,Mov(($0 = u8(Mem(u8(Mem(1))))), u8(Add($0, -1)))];
	case 0x22: return [1,Mov(PC, u32(Mem(SFR8[1]))),Mov(SFR8[1], u8(Add(SFR8[1], -4)))];
	case 0x23: return [1,Mov(SFR8[96], u8(Or(u8(LSL(SFR8[96], 1)), u8(LSR(SFR8[96], 7)))))];
	case 0x26: return [1,Mov(SFR8[96], u8(Add(SFR8[96], u8(Mem(u8(Mem(0)))))))];
	case 0x27: return [1,Mov(SFR8[96], u8(Add(SFR8[96], u8(Mem(u8(Mem(1)))))))];
	case 0x32: return [1,Mov(PC, u32(Mem(SFR8[1]))),Mov(SFR8[1], u8(Add(SFR8[1], -4)))];
	case 0x33: return [1,Mov(SFR8[96], u8(Or(u8(LSL(SFR8[96], 1)), u8(F[0]))))];
	case 0x36: return [1,Mov(SFR8[96], u8(Add(u8(Add(SFR8[96], u8(Mem(u8(Mem(0)))))), u8(F[0]))))];
	case 0x37: return [1,Mov(SFR8[96], u8(Add(u8(Add(SFR8[96], u8(Mem(u8(Mem(1)))))), u8(F[0]))))];
	case 0x46: return [1,Mov(SFR8[96], u8(Or(SFR8[96], u8(Mem(u8(Mem(0)))))))];
	case 0x47: return [1,Mov(SFR8[96], u8(Or(SFR8[96], u8(Mem(u8(Mem(1)))))))];
	case 0x56: return [1,Mov(SFR8[96], u8(And(SFR8[96], u8(Mem(u8(Mem(0)))))))];
	case 0x57: return [1,Mov(SFR8[96], u8(And(SFR8[96], u8(Mem(u8(Mem(1)))))))];
	case 0x66: return [1,Mov(SFR8[96], u8(Xor(SFR8[96], u8(Mem(u8(Mem(0)))))))];
	case 0x67: return [1,Mov(SFR8[96], u8(Xor(SFR8[96], u8(Mem(u8(Mem(1)))))))];
	case 0x73: return [1,Mov(PC, u32(Add(exports.PCbase, u16(Add(SFR16[2], SFR8[96])))))];
	}
if(((((b[i+0] & 0x8)>>>3)) & 0x1) == 0x1)
	switch((((b[i+0] & 0xf0)>>>4)) & 0xf) {
	case 0x0: return [1,Mov(($0 = u8(Mem(((b[i+0] & 0x7))))), u8(Add($0, 1)))];
	case 0x1: return [1,Mov(($0 = u8(Mem(((b[i+0] & 0x7))))), u8(Add($0, -1)))];
	case 0x2: return [1,Mov(SFR8[96], u8(Add(SFR8[96], u8(Mem(((b[i+0] & 0x7)))))))];
	case 0x3: return [1,Mov(SFR8[96], u8(Add(u8(Add(SFR8[96], u8(Mem(((b[i+0] & 0x7)))))), u8(F[0]))))];
	case 0x4: return [1,Mov(SFR8[96], u8(Or(SFR8[96], u8(Mem(((b[i+0] & 0x7)))))))];
	case 0x5: return [1,Mov(SFR8[96], u8(And(SFR8[96], u8(Mem(((b[i+0] & 0x7)))))))];
	case 0x6: return [1,Mov(SFR8[96], u8(Xor(SFR8[96], u8(Mem(((b[i+0] & 0x7)))))))];
	case 0x9: return [1,Mov(F[0], Lt(($0 = u8(Add(SFR8[96], i8(Neg(($1 = u8(Mem(((b[i+0] & 0x7)))))))))), ($2 = u8(F[0])))),Mov(SFR8[96], u8(Add($0, i8(Neg($2)))))];
	case 0xc: return [1,Swap(SFR8[96], u8(Mem(((b[i+0] & 0x7)))))];
	case 0xe: return [1,Mov(SFR8[96], u8(Mem(((b[i+0] & 0x7)))))];
	case 0xf: return [1,Mov(u8(Mem(((b[i+0] & 0x7)))), SFR8[96])];
	}

}
exports.SP = R.SP;
exports.PC = R.PC;
