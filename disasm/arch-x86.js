/** @file arch-x86.js This file was auto-generated */
var util = require('util');
var known = exports.known = function known(x) {
        return typeof x === 'number';
    }
var inspect = exports.inspect = function inspect(x, p) {
        if(known(x) && x > 100)
            return '0x'+x.toString(16);
        if(typeof x === 'object' && x.inspect)
            return x.inspect(0, p || 16);
        return util.inspect(x);
    }
function Interrupt() {
    var args = [].slice.call(arguments);
    return {
        fn: 'Interrupt', args: args,
        inspect: function() {
            return 'Interrupt('+args.map(function(x) {return inspect(typeof x === 'object' && 'value' in x ? x.value : x);}).join(', ')+')';
        }
    };
}
function If() {
    var args = [].slice.call(arguments);
    return {
        fn: 'If', args: args,
        inspect: function() {
            return 'If('+args.map(function(x) {return inspect(typeof x === 'object' && 'value' in x ? x.value : x);}).join(', ')+')';
        }
    };
}
function Nop() {
    var args = [].slice.call(arguments);
    return {
        fn: 'Nop', args: args,
        inspect: function() {
            return 'Nop('+args.map(function(x) {return inspect(typeof x === 'object' && 'value' in x ? x.value : x);}).join(', ')+')';
        }
    };
}
var Mem = exports.Mem = function Mem(addr, size) {
    if(typeof addr === 'object' && 'value' in addr) addr = addr.value;
    return {
        fn: 'Mem', addr: addr, size: size,
        inspect: function() {
            return '['+inspect(addr)+']'+([,'b','w',,'dw',,,,'qw'][+size] || '');
        }
    };
}
function Not(a) {
    if(typeof a === 'object' && 'value' in a) a = a.value;
    return {
        fn: 'Not', op: '~', a: a,
        inspect: function(_, p) {
            var expr = '~'+inspect(a, 2);
            return 2 <= p ? expr : '('+expr+')';
        }
    };
}
function Neg(a) {
    if(typeof a === 'object' && 'value' in a) a = a.value;
    if(known(a))
        return -a;
    return {
        fn: 'Neg', op: '-', a: a,
        inspect: function(_, p) {
            var expr = '-'+inspect(a, 2);
            return 2 <= p ? expr : '('+expr+')';
        }
    };
}
var Mov = exports.Mov = function Mov(a, b) {
    if(typeof b === 'object' && 'value' in b) b = b.value;
    return {
        fn: 'Mov', op: '=', a: a, b: b,
        inspect: function(_, p) {
            var a = this.a, b = this.b;
            var op = '=';
            if((b.op == '+' || b.op == '-' || b.op == '*' || b.op == '^' || b.op == '<<' || b.op == '>>' || b.op == '>>>') && b.a === a) {
                op = b.op+'=';
                b = b.b;
            }var expr = inspect(a, 13)+' '+op+' '+inspect(b, 13);
            return 13 <= p ? expr : '('+expr+')';
        }
    };
}
var Swap = exports.Swap = function Swap(a, b) {
    return {
        fn: 'Swap', op: '<->', a: a, b: b,
        inspect: function(_, p) {
            var a = this.a, b = this.b;var expr = inspect(a, undefined)+' <-> '+inspect(b, undefined);
            return undefined <= p ? expr : '('+expr+')';
        }
    };
}
var Add = exports.Add = function Add(a, b) {
    if(typeof a === 'object' && 'value' in a) a = a.value;
    if(typeof b === 'object' && 'value' in b) b = b.value;
    if(!a) return b;
    if(!b) return a;
    if(known(a) && known(b)) return a + b;
    if(a.op == '+' && known(a.b) && known(b)) return Add(a.a, a.b+b);
    return {
        fn: 'Add', op: '+', a: a, b: b,
        inspect: function(_, p) {
            var a = this.a, b = this.b;
            var op = '+';
            if(b < 0) {
                op = '-';
                b = -b;
            }var expr = inspect(a, 4)+' '+op+' '+inspect(b, 4);
            return 4 <= p ? expr : '('+expr+')';
        }
    };
}
var Mul = exports.Mul = function Mul(a, b) {
    if(typeof a === 'object' && 'value' in a) a = a.value;
    if(typeof b === 'object' && 'value' in b) b = b.value;
    return {
        fn: 'Mul', op: '*', a: a, b: b,
        inspect: function(_, p) {
            var a = this.a, b = this.b;var expr = inspect(a, 3)+' * '+inspect(b, 3);
            return 3 <= p ? expr : '('+expr+')';
        }
    };
}
var And = exports.And = function And(a, b) {
    if(typeof a === 'object' && 'value' in a) a = a.value;
    if(typeof b === 'object' && 'value' in b) b = b.value;
    if(a === b) return a;
    return {
        fn: 'And', op: '&', a: a, b: b,
        inspect: function(_, p) {
            var a = this.a, b = this.b;var expr = inspect(a, 8)+' & '+inspect(b, 8);
            return 8 <= p ? expr : '('+expr+')';
        }
    };
}
var Or = exports.Or = function Or(a, b) {
    if(typeof a === 'object' && 'value' in a) a = a.value;
    if(typeof b === 'object' && 'value' in b) b = b.value;
    if(a === b) return a;
    return {
        fn: 'Or', op: '|', a: a, b: b,
        inspect: function(_, p) {
            var a = this.a, b = this.b;var expr = inspect(a, 10)+' | '+inspect(b, 10);
            return 10 <= p ? expr : '('+expr+')';
        }
    };
}
var Xor = exports.Xor = function Xor(a, b) {
    if(typeof a === 'object' && 'value' in a) a = a.value;
    if(typeof b === 'object' && 'value' in b) b = b.value;
    if(!b) return a;
    if(a === b) return 0;
    return {
        fn: 'Xor', op: '^', a: a, b: b,
        inspect: function(_, p) {
            var a = this.a, b = this.b;var expr = inspect(a, 9)+' ^ '+inspect(b, 9);
            return 9 <= p ? expr : '('+expr+')';
        }
    };
}
var Eq = exports.Eq = function Eq(a, b) {
    if(typeof a === 'object' && 'value' in a) a = a.value;
    if(typeof b === 'object' && 'value' in b) b = b.value;
    return {
        fn: 'Eq', op: '==', a: a, b: b,
        inspect: function(_, p) {
            var a = this.a, b = this.b;var expr = inspect(a, 7)+' == '+inspect(b, 7);
            return 7 <= p ? expr : '('+expr+')';
        }
    };
}
var Lt = exports.Lt = function Lt(a, b) {
    if(typeof a === 'object' && 'value' in a) a = a.value;
    if(typeof b === 'object' && 'value' in b) b = b.value;
    return {
        fn: 'Lt', op: '<', a: a, b: b,
        inspect: function(_, p) {
            var a = this.a, b = this.b;var expr = inspect(a, 6)+' < '+inspect(b, 6);
            return 6 <= p ? expr : '('+expr+')';
        }
    };
}
var LSL = exports.LSL = function LSL(a, b) {
    if(typeof a === 'object' && 'value' in a) a = a.value;
    if(typeof b === 'object' && 'value' in b) b = b.value;
    if(!b) return a;
    return {
        fn: 'LSL', op: '<<', a: a, b: b,
        inspect: function(_, p) {
            var a = this.a, b = this.b;var expr = inspect(a, 5)+' << '+inspect(b, 5);
            return 5 <= p ? expr : '('+expr+')';
        }
    };
}
var LSR = exports.LSR = function LSR(a, b) {
    if(typeof a === 'object' && 'value' in a) a = a.value;
    if(typeof b === 'object' && 'value' in b) b = b.value;
    if(!b) return a;
    return {
        fn: 'LSR', op: '>>>', a: a, b: b,
        inspect: function(_, p) {
            var a = this.a, b = this.b;var expr = inspect(a, 5)+' >>> '+inspect(b, 5);
            return 5 <= p ? expr : '('+expr+')';
        }
    };
}
var ASR = exports.ASR = function ASR(a, b) {
    if(typeof a === 'object' && 'value' in a) a = a.value;
    if(typeof b === 'object' && 'value' in b) b = b.value;
    if(!b) return a;
    return {
        fn: 'ASR', op: '>>', a: a, b: b,
        inspect: function(_, p) {
            var a = this.a, b = this.b;var expr = inspect(a, 5)+' >> '+inspect(b, 5);
            return 5 <= p ? expr : '('+expr+')';
        }
    };
}
var ROR = exports.ROR = function ROR(a, b) {
    if(typeof a === 'object' && 'value' in a) a = a.value;
    if(typeof b === 'object' && 'value' in b) b = b.value;
    if(!b) return a;
    return {
        fn: 'ROR', op: 'ROR', a: a, b: b,
        inspect: function(_, p) {
            var a = this.a, b = this.b;var expr = inspect(a, undefined)+' ROR '+inspect(b, undefined);
            return undefined <= p ? expr : '('+expr+')';
        }
    };
}
var ROL = exports.ROL = function ROL(a, b) {
    if(typeof a === 'object' && 'value' in a) a = a.value;
    if(typeof b === 'object' && 'value' in b) b = b.value;
    if(!b) return a;
    return {
        fn: 'ROL', op: 'ROL', a: a, b: b,
        inspect: function(_, p) {
            var a = this.a, b = this.b;var expr = inspect(a, undefined)+' ROL '+inspect(b, undefined);
            return undefined <= p ? expr : '('+expr+')';
        }
    };
}
var R = exports.R = {}, R8 = [], R16 = [], R32 = [], RS = [];
R.AL = R8[0] = {inspect: function() {return 'AL';}};
R.AH = R8[4] = {inspect: function() {return 'AH';}};
R.AX = R16[0] = {inspect: function() {return 'AX';}};
R.EAX = R32[0] = {inspect: function() {return 'EAX';}};
R.CL = R8[1] = {inspect: function() {return 'CL';}};
R.CH = R8[5] = {inspect: function() {return 'CH';}};
R.CX = R16[1] = {inspect: function() {return 'CX';}};
R.ECX = R32[1] = {inspect: function() {return 'ECX';}};
R.DL = R8[2] = {inspect: function() {return 'DL';}};
R.DH = R8[6] = {inspect: function() {return 'DH';}};
R.DX = R16[2] = {inspect: function() {return 'DX';}};
R.EDX = R32[2] = {inspect: function() {return 'EDX';}};
R.BL = R8[3] = {inspect: function() {return 'BL';}};
R.BH = R8[7] = {inspect: function() {return 'BH';}};
R.BX = R16[3] = {inspect: function() {return 'BX';}};
R.EBX = R32[3] = {inspect: function() {return 'EBX';}};
R.ES = RS[0] = {inspect: function() {return 'ES';}};
R.CS = RS[1] = {inspect: function() {return 'CS';}};
R.SS = RS[2] = {inspect: function() {return 'SS';}};
R.DS = RS[3] = {inspect: function() {return 'DS';}};
R.FS = RS[4] = {inspect: function() {return 'FS';}};
R.SS = RS[5] = {inspect: function() {return 'SS';}};
R.GS = RS[6] = {inspect: function() {return 'GS';}};
R.SP = R16[4] = {inspect: function() {return 'SP';}};
R.ESP = R32[4] = {inspect: function() {return 'ESP';}};
R.BP = R16[5] = {inspect: function() {return 'BP';}};
R.EBP = R32[5] = {inspect: function() {return 'EBP';}};
R.SI = R16[6] = {inspect: function() {return 'SI';}};
R.ESI = R32[6] = {inspect: function() {return 'ESI';}};
R.DI = R16[7] = {inspect: function() {return 'DI';}};
R.EDI = R32[7] = {inspect: function() {return 'EDI';}};
R.IP = R16[8] = {inspect: function() {return 'IP';}};
R.EIP = R32[8] = {inspect: function() {return 'EIP';}};
var F = exports.F = [];
F.O = F[0] = {inspect: function() {return 'OF';}};
F.C = F[1] = {inspect: function() {return 'CF';}};
F.Z = F[2] = {inspect: function() {return 'ZF';}};
F.S = F[3] = {inspect: function() {return 'SF';}};
F.P = F[4] = {inspect: function() {return 'PF';}};
F.V = F[5] = {inspect: function() {return 'VF';}};
F.D = F[6] = {inspect: function() {return 'DF';}};
F.I = F[7] = {inspect: function() {return 'IF';}};
exports.dis = function x86dis(b, i) {
    for(; b[i] == 0xF2 || b[i] == 0xF3; i++)
        console.log('[PREFIX] '+b[i].toString(16).toUpperCase());
    if(((b[i+0]|(b[i+1]<<8)|((b[i+2] & 0x3f)<<16)) & 0x3f4789) == 0x250481)
	switch((((b[i+0] & 0xfe)>>>1)|(b[i+1]<<7)) & 0x5c3b) {
	case 0x0: return [11, Mov(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 4), Add(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 4), (b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24))))];
	case 0x4000: return [11, Mov(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Add(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), (b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24))))];
	case 0x400: return [11, Mov(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 4), Or(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 4), (b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24))))];
	case 0x4400: return [11, Mov(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Or(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), (b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24))))];
	case 0x800: return [11, Mov(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 4), Add(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 4), Add((b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24)), F[1])))];
	case 0x4800: return [11, Mov(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Add(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Add((b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24)), F[1])))];
	case 0xc00: return [11, Mov(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 4), Add((b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24)), Neg(Add(Add(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 4), Neg(F[1])), 1))))];
	case 0x4c00: return [11, Mov(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Add((b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24)), Neg(Add(Add(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Neg(F[1])), 1))))];
	case 0x1000: return [11, Mov(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 4), And(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 4), (b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24))))];
	case 0x5000: return [11, Mov(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), And(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), (b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24))))];
	case 0x1400: return [11, Mov(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 4), Add(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 4), -(b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24))))];
	case 0x5400: return [11, Mov(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Add(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), -(b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24))))];
	case 0x1800: return [11, Mov(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 4), Xor(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 4), (b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24))))];
	case 0x5800: return [11, Mov(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Xor(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), (b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24))))];
	case 0x1c00: return [11, Mov(F[2], Eq(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 4), (b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24)))),Mov(F[1], Lt(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 4), (b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24))))];
	case 0x5c00: return [11, Mov(F[2], Eq(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), (b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24)))),Mov(F[1], Lt(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), (b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24))))];
	case 0x23: return [11, Mov(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 4), (b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24)))];
	case 0x4023: return [11, Mov(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), (b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24)))];
	case 0x3b: return [11, Mov(F[2], Eq(And(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 4), (b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24))), 0))];
	case 0x403b: return [11, Mov(F[2], Eq(And(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), (b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24))), 0))];
	}
if(((b[i+0]|(b[i+1]<<8)|((b[i+2] & 0x3f)<<16)) & 0x38c789) == 0x208481)
	switch((((b[i+0] & 0xfe)>>>1)|((b[i+1] & 0x3f)<<7)) & 0x1c3b) {
	case 0x0: return [11, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Add(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), (b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24))))];
	case 0x400: return [11, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Or(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), (b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24))))];
	case 0x800: return [11, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Add(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Add((b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24)), F[1])))];
	case 0xc00: return [11, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Add((b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24)), Neg(Add(Add(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Neg(F[1])), 1))))];
	case 0x1000: return [11, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), And(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), (b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24))))];
	case 0x1400: return [11, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Add(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), -(b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24))))];
	case 0x1800: return [11, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Xor(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), (b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24))))];
	case 0x1c00: return [11, Mov(F[2], Eq(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), (b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24)))),Mov(F[1], Lt(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), (b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24))))];
	case 0x23: return [11, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), (b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24)))];
	case 0x3b: return [11, Mov(F[2], Eq(And(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), (b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24))), 0))];
	}
if(((b[i+0]|(b[i+1]<<8)|((b[i+2] & 0x7)<<16)) & 0x74789) == 0x50481)
	switch((((b[i+0] & 0xfe)>>>1)|(b[i+1]<<7)) & 0x5c3b) {
	case 0x0: return [11, Mov(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Add(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), (b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24))))];
	case 0x4000: return [11, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 4), Add(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 4), (b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24))))];
	case 0x400: return [11, Mov(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Or(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), (b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24))))];
	case 0x4400: return [11, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 4), Or(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 4), (b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24))))];
	case 0x800: return [11, Mov(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Add(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Add((b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24)), F[1])))];
	case 0x4800: return [11, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 4), Add(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 4), Add((b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24)), F[1])))];
	case 0xc00: return [11, Mov(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Add((b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24)), Neg(Add(Add(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Neg(F[1])), 1))))];
	case 0x4c00: return [11, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 4), Add((b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24)), Neg(Add(Add(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 4), Neg(F[1])), 1))))];
	case 0x1000: return [11, Mov(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), And(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), (b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24))))];
	case 0x5000: return [11, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 4), And(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 4), (b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24))))];
	case 0x1400: return [11, Mov(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Add(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), -(b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24))))];
	case 0x5400: return [11, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 4), Add(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 4), -(b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24))))];
	case 0x1800: return [11, Mov(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Xor(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), (b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24))))];
	case 0x5800: return [11, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 4), Xor(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 4), (b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24))))];
	case 0x1c00: return [11, Mov(F[2], Eq(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), (b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24)))),Mov(F[1], Lt(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), (b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24))))];
	case 0x5c00: return [11, Mov(F[2], Eq(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 4), (b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24)))),Mov(F[1], Lt(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 4), (b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24))))];
	case 0x23: return [11, Mov(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), (b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24)))];
	case 0x4023: return [11, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 4), (b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24)))];
	case 0x3b: return [11, Mov(F[2], Eq(And(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), (b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24))), 0))];
	case 0x403b: return [11, Mov(F[2], Eq(And(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 4), (b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24))), 0))];
	}
if(((b[i+0]|(b[i+1]<<8)) & 0xc789) == 0x8481)
	switch((((b[i+0] & 0xfe)>>>1)|((b[i+1] & 0x3f)<<7)) & 0x1c3b) {
	case 0x0: return [11, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Add(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), (b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24))))];
	case 0x400: return [11, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Or(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), (b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24))))];
	case 0x800: return [11, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Add(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Add((b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24)), F[1])))];
	case 0xc00: return [11, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Add((b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24)), Neg(Add(Add(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Neg(F[1])), 1))))];
	case 0x1000: return [11, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), And(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), (b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24))))];
	case 0x1400: return [11, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Add(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), -(b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24))))];
	case 0x1800: return [11, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Xor(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), (b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24))))];
	case 0x1c00: return [11, Mov(F[2], Eq(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), (b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24)))),Mov(F[1], Lt(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), (b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24))))];
	case 0x23: return [11, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), (b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24)))];
	case 0x3b: return [11, Mov(F[2], Eq(And(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), (b[i+7]|(b[i+8]<<8)|(b[i+9]<<16)|(b[i+10]<<24))), 0))];
	}
if(((b[i+0]|(b[i+1]<<8)) & 0xc789) == 0x581)
	switch((((b[i+0] & 0xfe)>>>1)|((b[i+1] & 0x3f)<<7)) & 0x1c3b) {
	case 0x0: return [10, Mov(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 4), Add(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 4), (b[i+6]|(b[i+7]<<8)|(b[i+8]<<16)|(b[i+9]<<24))))];
	case 0x400: return [10, Mov(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 4), Or(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 4), (b[i+6]|(b[i+7]<<8)|(b[i+8]<<16)|(b[i+9]<<24))))];
	case 0x800: return [10, Mov(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 4), Add(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 4), Add((b[i+6]|(b[i+7]<<8)|(b[i+8]<<16)|(b[i+9]<<24)), F[1])))];
	case 0xc00: return [10, Mov(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 4), Add((b[i+6]|(b[i+7]<<8)|(b[i+8]<<16)|(b[i+9]<<24)), Neg(Add(Add(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 4), Neg(F[1])), 1))))];
	case 0x1000: return [10, Mov(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 4), And(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 4), (b[i+6]|(b[i+7]<<8)|(b[i+8]<<16)|(b[i+9]<<24))))];
	case 0x1400: return [10, Mov(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 4), Add(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 4), -(b[i+6]|(b[i+7]<<8)|(b[i+8]<<16)|(b[i+9]<<24))))];
	case 0x1800: return [10, Mov(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 4), Xor(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 4), (b[i+6]|(b[i+7]<<8)|(b[i+8]<<16)|(b[i+9]<<24))))];
	case 0x1c00: return [10, Mov(F[2], Eq(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 4), (b[i+6]|(b[i+7]<<8)|(b[i+8]<<16)|(b[i+9]<<24)))),Mov(F[1], Lt(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 4), (b[i+6]|(b[i+7]<<8)|(b[i+8]<<16)|(b[i+9]<<24))))];
	case 0x23: return [10, Mov(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 4), (b[i+6]|(b[i+7]<<8)|(b[i+8]<<16)|(b[i+9]<<24)))];
	case 0x3b: return [10, Mov(F[2], Eq(And(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 4), (b[i+6]|(b[i+7]<<8)|(b[i+8]<<16)|(b[i+9]<<24))), 0))];
	}
if(((b[i+0]|(b[i+1]<<8)) & 0xc089) == 0x8081)
	switch((((b[i+0] & 0xfe)>>>1)|((b[i+1] & 0x3f)<<7)) & 0x1c3b) {
	case 0x0: return [10, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 4), Add(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 4), (b[i+6]|(b[i+7]<<8)|(b[i+8]<<16)|(b[i+9]<<24))))];
	case 0x400: return [10, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 4), Or(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 4), (b[i+6]|(b[i+7]<<8)|(b[i+8]<<16)|(b[i+9]<<24))))];
	case 0x800: return [10, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 4), Add(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 4), Add((b[i+6]|(b[i+7]<<8)|(b[i+8]<<16)|(b[i+9]<<24)), F[1])))];
	case 0xc00: return [10, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 4), Add((b[i+6]|(b[i+7]<<8)|(b[i+8]<<16)|(b[i+9]<<24)), Neg(Add(Add(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 4), Neg(F[1])), 1))))];
	case 0x1000: return [10, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 4), And(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 4), (b[i+6]|(b[i+7]<<8)|(b[i+8]<<16)|(b[i+9]<<24))))];
	case 0x1400: return [10, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 4), Add(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 4), -(b[i+6]|(b[i+7]<<8)|(b[i+8]<<16)|(b[i+9]<<24))))];
	case 0x1800: return [10, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 4), Xor(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 4), (b[i+6]|(b[i+7]<<8)|(b[i+8]<<16)|(b[i+9]<<24))))];
	case 0x1c00: return [10, Mov(F[2], Eq(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 4), (b[i+6]|(b[i+7]<<8)|(b[i+8]<<16)|(b[i+9]<<24)))),Mov(F[1], Lt(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 4), (b[i+6]|(b[i+7]<<8)|(b[i+8]<<16)|(b[i+9]<<24))))];
	case 0x23: return [10, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 4), (b[i+6]|(b[i+7]<<8)|(b[i+8]<<16)|(b[i+9]<<24)))];
	case 0x3b: return [10, Mov(F[2], Eq(And(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 4), (b[i+6]|(b[i+7]<<8)|(b[i+8]<<16)|(b[i+9]<<24))), 0))];
	}
if(((b[i+0]|(b[i+1]<<8)|(b[i+2]<<16)|((b[i+3] & 0x3f)<<24)) & 0x3f47ffff) == 0x2504ac0f)
	switch((((b[i+2] & 0x80)>>>7)) & 0x1) {
	case 0x0: return [9, Mov(Mem((b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)), 4), Or(LSR(Mem((b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)), 4), (b[i+8])), And(R32[(((b[i+2] & 0x38)>>>3))], (((1 << (b[i+8])) + -1) << (32 + -(b[i+8]))))))];
	case 0x1: return [9, Mov(Mem(Add(R32[5], (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))), 4), Or(LSR(Mem(Add(R32[5], (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))), 4), (b[i+8])), And(R32[(((b[i+2] & 0x38)>>>3))], (((1 << (b[i+8])) + -1) << (32 + -(b[i+8]))))))];
	}
if(((b[i+0]|(b[i+1]<<8)|(b[i+2]<<16)|((b[i+3] & 0x3f)<<24)) & 0x38c7ffff) == 0x2084ac0f)
	switch(0) {
	case 0x0: return [9, Mov(Mem(Add(R32[((b[i+3] & 0x7))], (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))), 4), Or(LSR(Mem(Add(R32[((b[i+3] & 0x7))], (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))), 4), (b[i+8])), And(R32[(((b[i+2] & 0x38)>>>3))], (((1 << (b[i+8])) + -1) << (32 + -(b[i+8]))))))];
	}
if(((b[i+0]|(b[i+1]<<8)|(b[i+2]<<16)|((b[i+3] & 0x7)<<24)) & 0x747ffff) == 0x504ac0f)
	switch((((b[i+2] & 0x80)>>>7)) & 0x1) {
	case 0x0: return [9, Mov(Mem(Add(LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))), 4), Or(LSR(Mem(Add(LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))), 4), (b[i+8])), And(R32[(((b[i+2] & 0x38)>>>3))], (((1 << (b[i+8])) + -1) << (32 + -(b[i+8]))))))];
	case 0x1: return [9, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))), 4), Or(LSR(Mem(Add(R32[5], Add(LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))), 4), (b[i+8])), And(R32[(((b[i+2] & 0x38)>>>3))], (((1 << (b[i+8])) + -1) << (32 + -(b[i+8]))))))];
	}
if(((b[i+0]|(b[i+1]<<8)|(b[i+2]<<16)) & 0xc7ffff) == 0x84ac0f)
	switch(0) {
	case 0x0: return [9, Mov(Mem(Add(Add(R32[((b[i+3] & 0x7))], LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))), 4), Or(LSR(Mem(Add(Add(R32[((b[i+3] & 0x7))], LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))), 4), (b[i+8])), And(R32[(((b[i+2] & 0x38)>>>3))], (((1 << (b[i+8])) + -1) << (32 + -(b[i+8]))))))];
	}
if(((b[i+0]|(b[i+1]<<8)|(b[i+2]<<16)|((b[i+3] & 0x3f)<<24)) & 0x3f47c0ff) == 0x2504800f)
	switch((b[i+1]|(b[i+2]<<8)) & 0x803f) {
	case 0x10: return [8, Mov(Mem((b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)), 1), F[0])];
	case 0x8010: return [8, Mov(Mem(Add(R32[5], (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))), 1), F[0])];
	case 0x11: return [8, Mov(Mem((b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)), 1), Not(F[0]))];
	case 0x8011: return [8, Mov(Mem(Add(R32[5], (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))), 1), Not(F[0]))];
	case 0x12: return [8, Mov(Mem((b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)), 1), F[1])];
	case 0x8012: return [8, Mov(Mem(Add(R32[5], (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))), 1), F[1])];
	case 0x13: return [8, Mov(Mem((b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)), 1), Not(F[1]))];
	case 0x8013: return [8, Mov(Mem(Add(R32[5], (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))), 1), Not(F[1]))];
	case 0x14: return [8, Mov(Mem((b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)), 1), F[2])];
	case 0x8014: return [8, Mov(Mem(Add(R32[5], (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))), 1), F[2])];
	case 0x15: return [8, Mov(Mem((b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)), 1), Not(F[2]))];
	case 0x8015: return [8, Mov(Mem(Add(R32[5], (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))), 1), Not(F[2]))];
	case 0x16: return [8, Mov(Mem((b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)), 1), Or(F[1], F[2]))];
	case 0x8016: return [8, Mov(Mem(Add(R32[5], (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))), 1), Or(F[1], F[2]))];
	case 0x17: return [8, Mov(Mem((b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)), 1), And(Not(F[1]), Not(F[2])))];
	case 0x8017: return [8, Mov(Mem(Add(R32[5], (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))), 1), And(Not(F[1]), Not(F[2])))];
	case 0x18: return [8, Mov(Mem((b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)), 1), F[3])];
	case 0x8018: return [8, Mov(Mem(Add(R32[5], (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))), 1), F[3])];
	case 0x19: return [8, Mov(Mem((b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)), 1), Not(F[3]))];
	case 0x8019: return [8, Mov(Mem(Add(R32[5], (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))), 1), Not(F[3]))];
	case 0x1a: return [8, Mov(Mem((b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)), 1), F[4])];
	case 0x801a: return [8, Mov(Mem(Add(R32[5], (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))), 1), F[4])];
	case 0x1b: return [8, Mov(Mem((b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)), 1), Not(F[4]))];
	case 0x801b: return [8, Mov(Mem(Add(R32[5], (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))), 1), Not(F[4]))];
	case 0x1c: return [8, Mov(Mem((b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)), 1), Not(Eq(F[0], F[3])))];
	case 0x801c: return [8, Mov(Mem(Add(R32[5], (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))), 1), Not(Eq(F[0], F[3])))];
	case 0x1d: return [8, Mov(Mem((b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)), 1), Eq(F[0], F[3]))];
	case 0x801d: return [8, Mov(Mem(Add(R32[5], (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))), 1), Eq(F[0], F[3]))];
	case 0x1e: return [8, Mov(Mem((b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)), 1), Or(F[2], Not(Eq(F[0], F[3]))))];
	case 0x801e: return [8, Mov(Mem(Add(R32[5], (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))), 1), Or(F[2], Not(Eq(F[0], F[3]))))];
	case 0x1f: return [8, Mov(Mem((b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)), 1), And(Not(F[2]), Eq(F[0], F[3])))];
	case 0x801f: return [8, Mov(Mem(Add(R32[5], (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))), 1), And(Not(F[2]), Eq(F[0], F[3])))];
	case 0x2d: return [8, Mov(Mem((b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)), 4), Or(LSR(Mem((b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)), 4), R8[1]), And(R32[(((b[i+2] & 0x38)>>>3))], LSL(Add(LSL(1, R8[1]), -1), Add(32, Neg(R8[1]))))))];
	case 0x802d: return [8, Mov(Mem(Add(R32[5], (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))), 4), Or(LSR(Mem(Add(R32[5], (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))), 4), R8[1]), And(R32[(((b[i+2] & 0x38)>>>3))], LSL(Add(LSL(1, R8[1]), -1), Add(32, Neg(R8[1]))))))];
	case 0x36: return [8, Mov(R32[(((b[i+2] & 0x38)>>>3))], Mem((b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)), 1))];
	case 0x8036: return [8, Mov(R32[(((b[i+2] & 0x38)>>>3))], Mem(Add(R32[5], (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))), 1))];
	case 0x37: return [8, Mov(R32[(((b[i+2] & 0x38)>>>3))], Mem((b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)), 2))];
	case 0x8037: return [8, Mov(R32[(((b[i+2] & 0x38)>>>3))], Mem(Add(R32[5], (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))), 2))];
	}
if(((b[i+0]|(b[i+1]<<8)|(b[i+2]<<16)|((b[i+3] & 0x7)<<24)) & 0x747c0ff) == 0x504800f)
	switch((b[i+1]|(b[i+2]<<8)) & 0x803f) {
	case 0x10: return [8, Mov(Mem(Add(LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))), 1), F[0])];
	case 0x8010: return [8, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))), 1), F[0])];
	case 0x11: return [8, Mov(Mem(Add(LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))), 1), Not(F[0]))];
	case 0x8011: return [8, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))), 1), Not(F[0]))];
	case 0x12: return [8, Mov(Mem(Add(LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))), 1), F[1])];
	case 0x8012: return [8, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))), 1), F[1])];
	case 0x13: return [8, Mov(Mem(Add(LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))), 1), Not(F[1]))];
	case 0x8013: return [8, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))), 1), Not(F[1]))];
	case 0x14: return [8, Mov(Mem(Add(LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))), 1), F[2])];
	case 0x8014: return [8, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))), 1), F[2])];
	case 0x15: return [8, Mov(Mem(Add(LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))), 1), Not(F[2]))];
	case 0x8015: return [8, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))), 1), Not(F[2]))];
	case 0x16: return [8, Mov(Mem(Add(LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))), 1), Or(F[1], F[2]))];
	case 0x8016: return [8, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))), 1), Or(F[1], F[2]))];
	case 0x17: return [8, Mov(Mem(Add(LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))), 1), And(Not(F[1]), Not(F[2])))];
	case 0x8017: return [8, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))), 1), And(Not(F[1]), Not(F[2])))];
	case 0x18: return [8, Mov(Mem(Add(LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))), 1), F[3])];
	case 0x8018: return [8, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))), 1), F[3])];
	case 0x19: return [8, Mov(Mem(Add(LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))), 1), Not(F[3]))];
	case 0x8019: return [8, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))), 1), Not(F[3]))];
	case 0x1a: return [8, Mov(Mem(Add(LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))), 1), F[4])];
	case 0x801a: return [8, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))), 1), F[4])];
	case 0x1b: return [8, Mov(Mem(Add(LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))), 1), Not(F[4]))];
	case 0x801b: return [8, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))), 1), Not(F[4]))];
	case 0x1c: return [8, Mov(Mem(Add(LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))), 1), Not(Eq(F[0], F[3])))];
	case 0x801c: return [8, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))), 1), Not(Eq(F[0], F[3])))];
	case 0x1d: return [8, Mov(Mem(Add(LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))), 1), Eq(F[0], F[3]))];
	case 0x801d: return [8, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))), 1), Eq(F[0], F[3]))];
	case 0x1e: return [8, Mov(Mem(Add(LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))), 1), Or(F[2], Not(Eq(F[0], F[3]))))];
	case 0x801e: return [8, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))), 1), Or(F[2], Not(Eq(F[0], F[3]))))];
	case 0x1f: return [8, Mov(Mem(Add(LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))), 1), And(Not(F[2]), Eq(F[0], F[3])))];
	case 0x801f: return [8, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))), 1), And(Not(F[2]), Eq(F[0], F[3])))];
	case 0x2d: return [8, Mov(Mem(Add(LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))), 4), Or(LSR(Mem(Add(LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))), 4), R8[1]), And(R32[(((b[i+2] & 0x38)>>>3))], LSL(Add(LSL(1, R8[1]), -1), Add(32, Neg(R8[1]))))))];
	case 0x802d: return [8, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))), 4), Or(LSR(Mem(Add(R32[5], Add(LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))), 4), R8[1]), And(R32[(((b[i+2] & 0x38)>>>3))], LSL(Add(LSL(1, R8[1]), -1), Add(32, Neg(R8[1]))))))];
	case 0x36: return [8, Mov(R32[(((b[i+2] & 0x38)>>>3))], Mem(Add(LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))), 1))];
	case 0x8036: return [8, Mov(R32[(((b[i+2] & 0x38)>>>3))], Mem(Add(R32[5], Add(LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))), 1))];
	case 0x37: return [8, Mov(R32[(((b[i+2] & 0x38)>>>3))], Mem(Add(LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))), 2))];
	case 0x8037: return [8, Mov(R32[(((b[i+2] & 0x38)>>>3))], Mem(Add(R32[5], Add(LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))), 2))];
	}
if(((b[i+0]|(b[i+1]<<8)|(b[i+2]<<16)|((b[i+3] & 0x3f)<<24)) & 0x38c7c0ff) == 0x2084800f)
	switch(((b[i+1] & 0x3f)) & 0x3f) {
	case 0x10: return [8, Mov(Mem(Add(R32[((b[i+3] & 0x7))], (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))), 1), F[0])];
	case 0x11: return [8, Mov(Mem(Add(R32[((b[i+3] & 0x7))], (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))), 1), Not(F[0]))];
	case 0x12: return [8, Mov(Mem(Add(R32[((b[i+3] & 0x7))], (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))), 1), F[1])];
	case 0x13: return [8, Mov(Mem(Add(R32[((b[i+3] & 0x7))], (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))), 1), Not(F[1]))];
	case 0x14: return [8, Mov(Mem(Add(R32[((b[i+3] & 0x7))], (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))), 1), F[2])];
	case 0x15: return [8, Mov(Mem(Add(R32[((b[i+3] & 0x7))], (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))), 1), Not(F[2]))];
	case 0x16: return [8, Mov(Mem(Add(R32[((b[i+3] & 0x7))], (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))), 1), Or(F[1], F[2]))];
	case 0x17: return [8, Mov(Mem(Add(R32[((b[i+3] & 0x7))], (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))), 1), And(Not(F[1]), Not(F[2])))];
	case 0x18: return [8, Mov(Mem(Add(R32[((b[i+3] & 0x7))], (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))), 1), F[3])];
	case 0x19: return [8, Mov(Mem(Add(R32[((b[i+3] & 0x7))], (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))), 1), Not(F[3]))];
	case 0x1a: return [8, Mov(Mem(Add(R32[((b[i+3] & 0x7))], (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))), 1), F[4])];
	case 0x1b: return [8, Mov(Mem(Add(R32[((b[i+3] & 0x7))], (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))), 1), Not(F[4]))];
	case 0x1c: return [8, Mov(Mem(Add(R32[((b[i+3] & 0x7))], (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))), 1), Not(Eq(F[0], F[3])))];
	case 0x1d: return [8, Mov(Mem(Add(R32[((b[i+3] & 0x7))], (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))), 1), Eq(F[0], F[3]))];
	case 0x1e: return [8, Mov(Mem(Add(R32[((b[i+3] & 0x7))], (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))), 1), Or(F[2], Not(Eq(F[0], F[3]))))];
	case 0x1f: return [8, Mov(Mem(Add(R32[((b[i+3] & 0x7))], (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))), 1), And(Not(F[2]), Eq(F[0], F[3])))];
	case 0x2d: return [8, Mov(Mem(Add(R32[((b[i+3] & 0x7))], (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))), 4), Or(LSR(Mem(Add(R32[((b[i+3] & 0x7))], (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))), 4), R8[1]), And(R32[(((b[i+2] & 0x38)>>>3))], LSL(Add(LSL(1, R8[1]), -1), Add(32, Neg(R8[1]))))))];
	case 0x36: return [8, Mov(R32[(((b[i+2] & 0x38)>>>3))], Mem(Add(R32[((b[i+3] & 0x7))], (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))), 1))];
	case 0x37: return [8, Mov(R32[(((b[i+2] & 0x38)>>>3))], Mem(Add(R32[((b[i+3] & 0x7))], (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))), 2))];
	}
if(((b[i+0]|(b[i+1]<<8)|((b[i+2] & 0x7f)<<16)) & 0x46c0ff) == 0x4800f)
	switch((b[i+1]|(b[i+2]<<8)) & 0x813f) {
	case 0x8010: return [8, Mov(Mem(Add(Add(R32[((b[i+3] & 0x7))], LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))), 1), F[0])];
	case 0x8011: return [8, Mov(Mem(Add(Add(R32[((b[i+3] & 0x7))], LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))), 1), Not(F[0]))];
	case 0x8012: return [8, Mov(Mem(Add(Add(R32[((b[i+3] & 0x7))], LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))), 1), F[1])];
	case 0x8013: return [8, Mov(Mem(Add(Add(R32[((b[i+3] & 0x7))], LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))), 1), Not(F[1]))];
	case 0x8014: return [8, Mov(Mem(Add(Add(R32[((b[i+3] & 0x7))], LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))), 1), F[2])];
	case 0x8015: return [8, Mov(Mem(Add(Add(R32[((b[i+3] & 0x7))], LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))), 1), Not(F[2]))];
	case 0x8016: return [8, Mov(Mem(Add(Add(R32[((b[i+3] & 0x7))], LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))), 1), Or(F[1], F[2]))];
	case 0x8017: return [8, Mov(Mem(Add(Add(R32[((b[i+3] & 0x7))], LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))), 1), And(Not(F[1]), Not(F[2])))];
	case 0x8018: return [8, Mov(Mem(Add(Add(R32[((b[i+3] & 0x7))], LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))), 1), F[3])];
	case 0x8019: return [8, Mov(Mem(Add(Add(R32[((b[i+3] & 0x7))], LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))), 1), Not(F[3]))];
	case 0x801a: return [8, Mov(Mem(Add(Add(R32[((b[i+3] & 0x7))], LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))), 1), F[4])];
	case 0x801b: return [8, Mov(Mem(Add(Add(R32[((b[i+3] & 0x7))], LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))), 1), Not(F[4]))];
	case 0x801c: return [8, Mov(Mem(Add(Add(R32[((b[i+3] & 0x7))], LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))), 1), Not(Eq(F[0], F[3])))];
	case 0x801d: return [8, Mov(Mem(Add(Add(R32[((b[i+3] & 0x7))], LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))), 1), Eq(F[0], F[3]))];
	case 0x801e: return [8, Mov(Mem(Add(Add(R32[((b[i+3] & 0x7))], LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))), 1), Or(F[2], Not(Eq(F[0], F[3]))))];
	case 0x801f: return [8, Mov(Mem(Add(Add(R32[((b[i+3] & 0x7))], LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))), 1), And(Not(F[2]), Eq(F[0], F[3])))];
	case 0x12c: return [8, Mov(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 4), Or(LSR(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 4), (b[i+7])), And(R32[(((b[i+2] & 0x38)>>>3))], (((1 << (b[i+7])) + -1) << (32 + -(b[i+7]))))))];
	case 0x802d: return [8, Mov(Mem(Add(Add(R32[((b[i+3] & 0x7))], LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))), 4), Or(LSR(Mem(Add(Add(R32[((b[i+3] & 0x7))], LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))), 4), R8[1]), And(R32[(((b[i+2] & 0x38)>>>3))], LSL(Add(LSL(1, R8[1]), -1), Add(32, Neg(R8[1]))))))];
	case 0x8036: return [8, Mov(R32[(((b[i+2] & 0x38)>>>3))], Mem(Add(Add(R32[((b[i+3] & 0x7))], LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))), 1))];
	case 0x8037: return [8, Mov(R32[(((b[i+2] & 0x38)>>>3))], Mem(Add(Add(R32[((b[i+3] & 0x7))], LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))), 2))];
	}
if(((b[i+0]|(b[i+1]<<8)|(b[i+2]<<16)) & 0xc0ffff) == 0x80ac0f)
	switch(0) {
	case 0x0: return [8, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Or(LSR(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), (b[i+7])), And(R32[(((b[i+2] & 0x38)>>>3))], (((1 << (b[i+7])) + -1) << (32 + -(b[i+7]))))))];
	}
if(((((b[i+0] & 0xf8)>>>3)|(b[i+1]<<5)|((b[i+2] & 0x3f)<<13)) & 0x7e0f1) == 0x4a090)
	switch((b[i+0]|(b[i+1]<<8)) & 0xf877) {
	case 0x0: return [8, Mov(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1), Add(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1), (b[i+7])))];
	case 0x8000: return [8, Mov(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Add(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), (b[i+7])))];
	case 0x4001: return [8, Mov(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 4), Add(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 4), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))))];
	case 0x2: return [8, Mov(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1), Add(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1), (b[i+7])))];
	case 0x8002: return [8, Mov(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Add(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), (b[i+7])))];
	case 0x3: return [8, Mov(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 4), Add(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 4), (b[i+7])))];
	case 0x8003: return [8, Mov(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Add(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), (b[i+7])))];
	case 0x800: return [8, Mov(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1), Or(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1), (b[i+7])))];
	case 0x8800: return [8, Mov(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Or(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), (b[i+7])))];
	case 0x4801: return [8, Mov(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 4), Or(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 4), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))))];
	case 0x802: return [8, Mov(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1), Or(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1), (b[i+7])))];
	case 0x8802: return [8, Mov(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Or(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), (b[i+7])))];
	case 0x803: return [8, Mov(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 4), Or(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 4), (b[i+7])))];
	case 0x8803: return [8, Mov(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Or(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), (b[i+7])))];
	case 0x1000: return [8, Mov(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1), Add(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1), Add((b[i+7]), F[1])))];
	case 0x9000: return [8, Mov(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Add(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Add((b[i+7]), F[1])))];
	case 0x5001: return [8, Mov(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 4), Add(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 4), Add((b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)), F[1])))];
	case 0x1002: return [8, Mov(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1), Add(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1), Add((b[i+7]), F[1])))];
	case 0x9002: return [8, Mov(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Add(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Add((b[i+7]), F[1])))];
	case 0x1003: return [8, Mov(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 4), Add(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 4), Add((b[i+7]), F[1])))];
	case 0x9003: return [8, Mov(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Add(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Add((b[i+7]), F[1])))];
	case 0x1800: return [8, Mov(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1), Add((b[i+7]), Neg(Add(Add(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1), Neg(F[1])), 1))))];
	case 0x9800: return [8, Mov(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Add((b[i+7]), Neg(Add(Add(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Neg(F[1])), 1))))];
	case 0x5801: return [8, Mov(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 4), Add((b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)), Neg(Add(Add(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 4), Neg(F[1])), 1))))];
	case 0x1802: return [8, Mov(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1), Add((b[i+7]), Neg(Add(Add(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1), Neg(F[1])), 1))))];
	case 0x9802: return [8, Mov(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Add((b[i+7]), Neg(Add(Add(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Neg(F[1])), 1))))];
	case 0x1803: return [8, Mov(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 4), Add((b[i+7]), Neg(Add(Add(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 4), Neg(F[1])), 1))))];
	case 0x9803: return [8, Mov(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Add((b[i+7]), Neg(Add(Add(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Neg(F[1])), 1))))];
	case 0x2000: return [8, Mov(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1), And(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1), (b[i+7])))];
	case 0xa000: return [8, Mov(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), And(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), (b[i+7])))];
	case 0x6001: return [8, Mov(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 4), And(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 4), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))))];
	case 0x2002: return [8, Mov(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1), And(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1), (b[i+7])))];
	case 0xa002: return [8, Mov(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), And(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), (b[i+7])))];
	case 0x2003: return [8, Mov(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 4), And(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 4), (b[i+7])))];
	case 0xa003: return [8, Mov(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), And(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), (b[i+7])))];
	case 0x2800: return [8, Mov(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1), Add(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1), -(b[i+7])))];
	case 0xa800: return [8, Mov(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Add(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), -(b[i+7])))];
	case 0x6801: return [8, Mov(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 4), Add(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 4), -(b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))))];
	case 0x2802: return [8, Mov(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1), Add(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1), -(b[i+7])))];
	case 0xa802: return [8, Mov(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Add(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), -(b[i+7])))];
	case 0x2803: return [8, Mov(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 4), Add(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 4), -(b[i+7])))];
	case 0xa803: return [8, Mov(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Add(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), -(b[i+7])))];
	case 0x3000: return [8, Mov(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1), Xor(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1), (b[i+7])))];
	case 0xb000: return [8, Mov(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Xor(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), (b[i+7])))];
	case 0x7001: return [8, Mov(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 4), Xor(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 4), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))))];
	case 0x3002: return [8, Mov(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1), Xor(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1), (b[i+7])))];
	case 0xb002: return [8, Mov(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Xor(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), (b[i+7])))];
	case 0x3003: return [8, Mov(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 4), Xor(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 4), (b[i+7])))];
	case 0xb003: return [8, Mov(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Xor(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), (b[i+7])))];
	case 0x3800: return [8, Mov(F[2], Eq(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1), (b[i+7]))),Mov(F[1], Lt(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1), (b[i+7])))];
	case 0xb800: return [8, Mov(F[2], Eq(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), (b[i+7]))),Mov(F[1], Lt(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), (b[i+7])))];
	case 0x7801: return [8, Mov(F[2], Eq(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 4), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))),Mov(F[1], Lt(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 4), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))))];
	case 0x3802: return [8, Mov(F[2], Eq(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1), (b[i+7]))),Mov(F[1], Lt(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1), (b[i+7])))];
	case 0xb802: return [8, Mov(F[2], Eq(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), (b[i+7]))),Mov(F[1], Lt(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), (b[i+7])))];
	case 0x3803: return [8, Mov(F[2], Eq(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 4), (b[i+7]))),Mov(F[1], Lt(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 4), (b[i+7])))];
	case 0xb803: return [8, Mov(F[2], Eq(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), (b[i+7]))),Mov(F[1], Lt(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), (b[i+7])))];
	case 0x46: return [8, Mov(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1), (b[i+7]))];
	case 0x8046: return [8, Mov(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), (b[i+7]))];
	case 0x4047: return [8, Mov(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 4), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))];
	case 0x40: return [8, Mov(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1), ROL(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1), (b[i+7])))];
	case 0x8040: return [8, Mov(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), ROL(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), (b[i+7])))];
	case 0x41: return [8, Mov(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 4), ROL(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 4), (b[i+7])))];
	case 0x8041: return [8, Mov(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), ROL(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), (b[i+7])))];
	case 0x840: return [8, Mov(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1), ROR(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1), (b[i+7])))];
	case 0x8840: return [8, Mov(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), ROR(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), (b[i+7])))];
	case 0x841: return [8, Mov(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 4), ROR(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 4), (b[i+7])))];
	case 0x8841: return [8, Mov(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), ROR(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), (b[i+7])))];
	case 0x2040: return [8, Mov(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1), LSL(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1), (b[i+7])))];
	case 0xa040: return [8, Mov(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), LSL(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), (b[i+7])))];
	case 0x2041: return [8, Mov(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 4), LSL(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 4), (b[i+7])))];
	case 0xa041: return [8, Mov(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), LSL(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), (b[i+7])))];
	case 0x2840: return [8, Mov(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1), LSR(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1), (b[i+7])))];
	case 0xa840: return [8, Mov(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), LSR(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), (b[i+7])))];
	case 0x2841: return [8, Mov(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 4), LSR(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 4), (b[i+7])))];
	case 0xa841: return [8, Mov(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), LSR(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), (b[i+7])))];
	case 0x3840: return [8, Mov(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1), ASR(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1), (b[i+7])))];
	case 0xb840: return [8, Mov(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), ASR(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), (b[i+7])))];
	case 0x3841: return [8, Mov(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 4), ASR(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 4), (b[i+7])))];
	case 0xb841: return [8, Mov(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), ASR(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), (b[i+7])))];
	case 0x76: return [8, Mov(F[2], Eq(And(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1), (b[i+7])), 0))];
	case 0x8076: return [8, Mov(F[2], Eq(And(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), (b[i+7])), 0))];
	case 0x4077: return [8, Mov(F[2], Eq(And(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 4), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))), 0))];
	}
if(((((b[i+0] & 0xf8)>>>3)|(b[i+1]<<5)|((b[i+2] & 0x7)<<13)) & 0xe0f1) == 0xa090)
	switch((b[i+0]|(b[i+1]<<8)) & 0xf877) {
	case 0x0: return [8, Mov(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Add(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), (b[i+7])))];
	case 0x8000: return [8, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 1), Add(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 1), (b[i+7])))];
	case 0x4001: return [8, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 4), Add(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 4), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))))];
	case 0x2: return [8, Mov(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Add(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), (b[i+7])))];
	case 0x8002: return [8, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 1), Add(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 1), (b[i+7])))];
	case 0x3: return [8, Mov(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Add(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), (b[i+7])))];
	case 0x8003: return [8, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 4), Add(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 4), (b[i+7])))];
	case 0x800: return [8, Mov(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Or(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), (b[i+7])))];
	case 0x8800: return [8, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 1), Or(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 1), (b[i+7])))];
	case 0x4801: return [8, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 4), Or(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 4), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))))];
	case 0x802: return [8, Mov(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Or(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), (b[i+7])))];
	case 0x8802: return [8, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 1), Or(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 1), (b[i+7])))];
	case 0x803: return [8, Mov(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Or(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), (b[i+7])))];
	case 0x8803: return [8, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 4), Or(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 4), (b[i+7])))];
	case 0x1000: return [8, Mov(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Add(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Add((b[i+7]), F[1])))];
	case 0x9000: return [8, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 1), Add(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 1), Add((b[i+7]), F[1])))];
	case 0x5001: return [8, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 4), Add(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 4), Add((b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)), F[1])))];
	case 0x1002: return [8, Mov(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Add(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Add((b[i+7]), F[1])))];
	case 0x9002: return [8, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 1), Add(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 1), Add((b[i+7]), F[1])))];
	case 0x1003: return [8, Mov(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Add(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Add((b[i+7]), F[1])))];
	case 0x9003: return [8, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 4), Add(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 4), Add((b[i+7]), F[1])))];
	case 0x1800: return [8, Mov(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Add((b[i+7]), Neg(Add(Add(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Neg(F[1])), 1))))];
	case 0x9800: return [8, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 1), Add((b[i+7]), Neg(Add(Add(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 1), Neg(F[1])), 1))))];
	case 0x5801: return [8, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 4), Add((b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)), Neg(Add(Add(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 4), Neg(F[1])), 1))))];
	case 0x1802: return [8, Mov(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Add((b[i+7]), Neg(Add(Add(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Neg(F[1])), 1))))];
	case 0x9802: return [8, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 1), Add((b[i+7]), Neg(Add(Add(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 1), Neg(F[1])), 1))))];
	case 0x1803: return [8, Mov(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Add((b[i+7]), Neg(Add(Add(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Neg(F[1])), 1))))];
	case 0x9803: return [8, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 4), Add((b[i+7]), Neg(Add(Add(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 4), Neg(F[1])), 1))))];
	case 0x2000: return [8, Mov(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), And(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), (b[i+7])))];
	case 0xa000: return [8, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 1), And(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 1), (b[i+7])))];
	case 0x6001: return [8, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 4), And(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 4), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))))];
	case 0x2002: return [8, Mov(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), And(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), (b[i+7])))];
	case 0xa002: return [8, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 1), And(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 1), (b[i+7])))];
	case 0x2003: return [8, Mov(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), And(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), (b[i+7])))];
	case 0xa003: return [8, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 4), And(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 4), (b[i+7])))];
	case 0x2800: return [8, Mov(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Add(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), -(b[i+7])))];
	case 0xa800: return [8, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 1), Add(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 1), -(b[i+7])))];
	case 0x6801: return [8, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 4), Add(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 4), -(b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))))];
	case 0x2802: return [8, Mov(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Add(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), -(b[i+7])))];
	case 0xa802: return [8, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 1), Add(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 1), -(b[i+7])))];
	case 0x2803: return [8, Mov(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Add(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), -(b[i+7])))];
	case 0xa803: return [8, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 4), Add(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 4), -(b[i+7])))];
	case 0x3000: return [8, Mov(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Xor(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), (b[i+7])))];
	case 0xb000: return [8, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 1), Xor(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 1), (b[i+7])))];
	case 0x7001: return [8, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 4), Xor(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 4), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))))];
	case 0x3002: return [8, Mov(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Xor(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), (b[i+7])))];
	case 0xb002: return [8, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 1), Xor(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 1), (b[i+7])))];
	case 0x3003: return [8, Mov(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Xor(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), (b[i+7])))];
	case 0xb003: return [8, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 4), Xor(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 4), (b[i+7])))];
	case 0x3800: return [8, Mov(F[2], Eq(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), (b[i+7]))),Mov(F[1], Lt(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), (b[i+7])))];
	case 0xb800: return [8, Mov(F[2], Eq(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 1), (b[i+7]))),Mov(F[1], Lt(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 1), (b[i+7])))];
	case 0x7801: return [8, Mov(F[2], Eq(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 4), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))),Mov(F[1], Lt(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 4), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))))];
	case 0x3802: return [8, Mov(F[2], Eq(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), (b[i+7]))),Mov(F[1], Lt(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), (b[i+7])))];
	case 0xb802: return [8, Mov(F[2], Eq(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 1), (b[i+7]))),Mov(F[1], Lt(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 1), (b[i+7])))];
	case 0x3803: return [8, Mov(F[2], Eq(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), (b[i+7]))),Mov(F[1], Lt(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), (b[i+7])))];
	case 0xb803: return [8, Mov(F[2], Eq(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 4), (b[i+7]))),Mov(F[1], Lt(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 4), (b[i+7])))];
	case 0x46: return [8, Mov(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), (b[i+7]))];
	case 0x8046: return [8, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 1), (b[i+7]))];
	case 0x4047: return [8, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 4), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))];
	case 0x40: return [8, Mov(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), ROL(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), (b[i+7])))];
	case 0x8040: return [8, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 1), ROL(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 1), (b[i+7])))];
	case 0x41: return [8, Mov(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), ROL(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), (b[i+7])))];
	case 0x8041: return [8, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 4), ROL(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 4), (b[i+7])))];
	case 0x840: return [8, Mov(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), ROR(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), (b[i+7])))];
	case 0x8840: return [8, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 1), ROR(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 1), (b[i+7])))];
	case 0x841: return [8, Mov(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), ROR(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), (b[i+7])))];
	case 0x8841: return [8, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 4), ROR(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 4), (b[i+7])))];
	case 0x2040: return [8, Mov(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), LSL(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), (b[i+7])))];
	case 0xa040: return [8, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 1), LSL(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 1), (b[i+7])))];
	case 0x2041: return [8, Mov(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), LSL(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), (b[i+7])))];
	case 0xa041: return [8, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 4), LSL(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 4), (b[i+7])))];
	case 0x2840: return [8, Mov(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), LSR(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), (b[i+7])))];
	case 0xa840: return [8, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 1), LSR(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 1), (b[i+7])))];
	case 0x2841: return [8, Mov(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), LSR(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), (b[i+7])))];
	case 0xa841: return [8, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 4), LSR(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 4), (b[i+7])))];
	case 0x3840: return [8, Mov(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), ASR(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), (b[i+7])))];
	case 0xb840: return [8, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 1), ASR(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 1), (b[i+7])))];
	case 0x3841: return [8, Mov(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), ASR(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), (b[i+7])))];
	case 0xb841: return [8, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 4), ASR(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 4), (b[i+7])))];
	case 0x76: return [8, Mov(F[2], Eq(And(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), (b[i+7])), 0))];
	case 0x8076: return [8, Mov(F[2], Eq(And(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 1), (b[i+7])), 0))];
	case 0x4077: return [8, Mov(F[2], Eq(And(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 4), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))), 0))];
	}
if(((((b[i+0] & 0xf8)>>>3)|(b[i+1]<<5)|((b[i+2] & 0x3f)<<13)) & 0x700f1) == 0x40090)
	switch((b[i+0]|(b[i+1]<<8)) & 0xf877) {
	case 0x8000: return [8, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Add(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), (b[i+7])))];
	case 0x4001: return [8, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 4), Add(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 4), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))))];
	case 0x8002: return [8, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Add(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), (b[i+7])))];
	case 0x8003: return [8, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Add(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), (b[i+7])))];
	case 0x8800: return [8, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Or(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), (b[i+7])))];
	case 0x4801: return [8, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 4), Or(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 4), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))))];
	case 0x8802: return [8, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Or(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), (b[i+7])))];
	case 0x8803: return [8, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Or(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), (b[i+7])))];
	case 0x9000: return [8, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Add(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Add((b[i+7]), F[1])))];
	case 0x5001: return [8, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 4), Add(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 4), Add((b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)), F[1])))];
	case 0x9002: return [8, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Add(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Add((b[i+7]), F[1])))];
	case 0x9003: return [8, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Add(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Add((b[i+7]), F[1])))];
	case 0x9800: return [8, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Add((b[i+7]), Neg(Add(Add(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Neg(F[1])), 1))))];
	case 0x5801: return [8, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 4), Add((b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)), Neg(Add(Add(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 4), Neg(F[1])), 1))))];
	case 0x9802: return [8, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Add((b[i+7]), Neg(Add(Add(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Neg(F[1])), 1))))];
	case 0x9803: return [8, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Add((b[i+7]), Neg(Add(Add(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Neg(F[1])), 1))))];
	case 0xa000: return [8, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), And(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), (b[i+7])))];
	case 0x6001: return [8, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 4), And(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 4), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))))];
	case 0xa002: return [8, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), And(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), (b[i+7])))];
	case 0xa003: return [8, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), And(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), (b[i+7])))];
	case 0xa800: return [8, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Add(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), -(b[i+7])))];
	case 0x6801: return [8, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 4), Add(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 4), -(b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))))];
	case 0xa802: return [8, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Add(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), -(b[i+7])))];
	case 0xa803: return [8, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Add(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), -(b[i+7])))];
	case 0xb000: return [8, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Xor(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), (b[i+7])))];
	case 0x7001: return [8, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 4), Xor(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 4), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))))];
	case 0xb002: return [8, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Xor(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), (b[i+7])))];
	case 0xb003: return [8, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Xor(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), (b[i+7])))];
	case 0xb800: return [8, Mov(F[2], Eq(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), (b[i+7]))),Mov(F[1], Lt(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), (b[i+7])))];
	case 0x7801: return [8, Mov(F[2], Eq(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 4), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))),Mov(F[1], Lt(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 4), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))))];
	case 0xb802: return [8, Mov(F[2], Eq(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), (b[i+7]))),Mov(F[1], Lt(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), (b[i+7])))];
	case 0xb803: return [8, Mov(F[2], Eq(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), (b[i+7]))),Mov(F[1], Lt(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), (b[i+7])))];
	case 0x8046: return [8, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), (b[i+7]))];
	case 0x4047: return [8, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 4), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))];
	case 0x8040: return [8, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), ROL(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), (b[i+7])))];
	case 0x8041: return [8, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), ROL(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), (b[i+7])))];
	case 0x8840: return [8, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), ROR(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), (b[i+7])))];
	case 0x8841: return [8, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), ROR(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), (b[i+7])))];
	case 0xa040: return [8, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), LSL(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), (b[i+7])))];
	case 0xa041: return [8, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), LSL(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), (b[i+7])))];
	case 0xa840: return [8, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), LSR(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), (b[i+7])))];
	case 0xa841: return [8, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), LSR(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), (b[i+7])))];
	case 0xb840: return [8, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), ASR(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), (b[i+7])))];
	case 0xb841: return [8, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), ASR(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), (b[i+7])))];
	case 0x8076: return [8, Mov(F[2], Eq(And(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), (b[i+7])), 0))];
	case 0x4077: return [8, Mov(F[2], Eq(And(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 4), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))), 0))];
	}
if(((((b[i+0] & 0xf8)>>>3)|((b[i+1] & 0x7)<<5)) & 0xf1) == 0x90)
	switch((b[i+0]|(b[i+1]<<8)) & 0xf877) {
	case 0x8000: return [8, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Add(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), (b[i+7])))];
	case 0x4001: return [8, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 4), Add(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 4), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))))];
	case 0x8002: return [8, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Add(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), (b[i+7])))];
	case 0x8003: return [8, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Add(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), (b[i+7])))];
	case 0x8800: return [8, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Or(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), (b[i+7])))];
	case 0x4801: return [8, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 4), Or(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 4), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))))];
	case 0x8802: return [8, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Or(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), (b[i+7])))];
	case 0x8803: return [8, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Or(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), (b[i+7])))];
	case 0x9000: return [8, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Add(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Add((b[i+7]), F[1])))];
	case 0x5001: return [8, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 4), Add(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 4), Add((b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)), F[1])))];
	case 0x9002: return [8, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Add(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Add((b[i+7]), F[1])))];
	case 0x9003: return [8, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Add(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Add((b[i+7]), F[1])))];
	case 0x9800: return [8, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Add((b[i+7]), Neg(Add(Add(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Neg(F[1])), 1))))];
	case 0x5801: return [8, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 4), Add((b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)), Neg(Add(Add(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 4), Neg(F[1])), 1))))];
	case 0x9802: return [8, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Add((b[i+7]), Neg(Add(Add(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Neg(F[1])), 1))))];
	case 0x9803: return [8, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Add((b[i+7]), Neg(Add(Add(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Neg(F[1])), 1))))];
	case 0xa000: return [8, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), And(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), (b[i+7])))];
	case 0x6001: return [8, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 4), And(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 4), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))))];
	case 0xa002: return [8, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), And(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), (b[i+7])))];
	case 0xa003: return [8, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), And(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), (b[i+7])))];
	case 0xa800: return [8, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Add(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), -(b[i+7])))];
	case 0x6801: return [8, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 4), Add(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 4), -(b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))))];
	case 0xa802: return [8, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Add(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), -(b[i+7])))];
	case 0xa803: return [8, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Add(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), -(b[i+7])))];
	case 0xb000: return [8, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Xor(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), (b[i+7])))];
	case 0x7001: return [8, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 4), Xor(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 4), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))))];
	case 0xb002: return [8, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Xor(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), (b[i+7])))];
	case 0xb003: return [8, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Xor(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), (b[i+7])))];
	case 0xb800: return [8, Mov(F[2], Eq(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), (b[i+7]))),Mov(F[1], Lt(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), (b[i+7])))];
	case 0x7801: return [8, Mov(F[2], Eq(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 4), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))),Mov(F[1], Lt(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 4), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))))];
	case 0xb802: return [8, Mov(F[2], Eq(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), (b[i+7]))),Mov(F[1], Lt(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), (b[i+7])))];
	case 0xb803: return [8, Mov(F[2], Eq(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), (b[i+7]))),Mov(F[1], Lt(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), (b[i+7])))];
	case 0x8046: return [8, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), (b[i+7]))];
	case 0x4047: return [8, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 4), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24)))];
	case 0x8040: return [8, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), ROL(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), (b[i+7])))];
	case 0x8041: return [8, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), ROL(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), (b[i+7])))];
	case 0x8840: return [8, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), ROR(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), (b[i+7])))];
	case 0x8841: return [8, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), ROR(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), (b[i+7])))];
	case 0xa040: return [8, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), LSL(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), (b[i+7])))];
	case 0xa041: return [8, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), LSL(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), (b[i+7])))];
	case 0xa840: return [8, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), LSR(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), (b[i+7])))];
	case 0xa841: return [8, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), LSR(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), (b[i+7])))];
	case 0xb840: return [8, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), ASR(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), (b[i+7])))];
	case 0xb841: return [8, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), ASR(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), (b[i+7])))];
	case 0x8076: return [8, Mov(F[2], Eq(And(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), (b[i+7])), 0))];
	case 0x4077: return [8, Mov(F[2], Eq(And(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 4), (b[i+4]|(b[i+5]<<8)|(b[i+6]<<16)|(b[i+7]<<24))), 0))];
	}
if(((b[i+0]|(b[i+1]<<8)|(b[i+2]<<16)) & 0xc7c0ff) == 0x5800f)
	switch(((b[i+1] & 0x3f)) & 0x3f) {
	case 0x10: return [7, Mov(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1), F[0])];
	case 0x11: return [7, Mov(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1), Not(F[0]))];
	case 0x12: return [7, Mov(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1), F[1])];
	case 0x13: return [7, Mov(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1), Not(F[1]))];
	case 0x14: return [7, Mov(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1), F[2])];
	case 0x15: return [7, Mov(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1), Not(F[2]))];
	case 0x16: return [7, Mov(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1), Or(F[1], F[2]))];
	case 0x17: return [7, Mov(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1), And(Not(F[1]), Not(F[2])))];
	case 0x18: return [7, Mov(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1), F[3])];
	case 0x19: return [7, Mov(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1), Not(F[3]))];
	case 0x1a: return [7, Mov(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1), F[4])];
	case 0x1b: return [7, Mov(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1), Not(F[4]))];
	case 0x1c: return [7, Mov(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1), Not(Eq(F[0], F[3])))];
	case 0x1d: return [7, Mov(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1), Eq(F[0], F[3]))];
	case 0x1e: return [7, Mov(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1), Or(F[2], Not(Eq(F[0], F[3]))))];
	case 0x1f: return [7, Mov(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1), And(Not(F[2]), Eq(F[0], F[3])))];
	case 0x2d: return [7, Mov(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 4), Or(LSR(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 4), R8[1]), And(R32[(((b[i+2] & 0x38)>>>3))], LSL(Add(LSL(1, R8[1]), -1), Add(32, Neg(R8[1]))))))];
	case 0x36: return [7, Mov(R32[(((b[i+2] & 0x38)>>>3))], Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1))];
	case 0x37: return [7, Mov(R32[(((b[i+2] & 0x38)>>>3))], Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 2))];
	}
if(((((b[i+0] & 0x80)>>>7)|(b[i+1]<<1)|((b[i+2] & 0x3f)<<9)) & 0x7e8f) == 0x4a09)
	switch((b[i+0]|(b[i+1]<<8)) & 0xb87f) {
	case 0xf: return [7, Mov(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 4), Mem(R32[4], 4)),Mov(R32[4], Add(R32[4], 4))];
	case 0x800f: return [7, Mov(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Mem(R32[4], 4)),Mov(R32[4], Add(R32[4], 4))];
	case 0x50: return [7, Mov(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1), ROL(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1), 1))];
	case 0x8050: return [7, Mov(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), ROL(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), 1))];
	case 0x51: return [7, Mov(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 4), ROL(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 4), 1))];
	case 0x8051: return [7, Mov(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), ROL(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), 1))];
	case 0x52: return [7, Mov(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1), ROL(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1), R8[1]))];
	case 0x8052: return [7, Mov(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), ROL(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), R8[1]))];
	case 0x53: return [7, Mov(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 4), ROL(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 4), R8[1]))];
	case 0x8053: return [7, Mov(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), ROL(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), R8[1]))];
	case 0x850: return [7, Mov(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1), ROR(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1), 1))];
	case 0x8850: return [7, Mov(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), ROR(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), 1))];
	case 0x851: return [7, Mov(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 4), ROR(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 4), 1))];
	case 0x8851: return [7, Mov(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), ROR(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), 1))];
	case 0x852: return [7, Mov(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1), ROR(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1), R8[1]))];
	case 0x8852: return [7, Mov(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), ROR(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), R8[1]))];
	case 0x853: return [7, Mov(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 4), ROR(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 4), R8[1]))];
	case 0x8853: return [7, Mov(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), ROR(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), R8[1]))];
	case 0x2050: return [7, Mov(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1), LSL(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1), 1))];
	case 0xa050: return [7, Mov(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), LSL(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), 1))];
	case 0x2051: return [7, Mov(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 4), LSL(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 4), 1))];
	case 0xa051: return [7, Mov(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), LSL(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), 1))];
	case 0x2052: return [7, Mov(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1), LSL(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1), R8[1]))];
	case 0xa052: return [7, Mov(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), LSL(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), R8[1]))];
	case 0x2053: return [7, Mov(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 4), LSL(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 4), R8[1]))];
	case 0xa053: return [7, Mov(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), LSL(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), R8[1]))];
	case 0x2850: return [7, Mov(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1), LSR(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1), 1))];
	case 0xa850: return [7, Mov(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), LSR(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), 1))];
	case 0x2851: return [7, Mov(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 4), LSR(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 4), 1))];
	case 0xa851: return [7, Mov(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), LSR(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), 1))];
	case 0x2852: return [7, Mov(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1), LSR(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1), R8[1]))];
	case 0xa852: return [7, Mov(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), LSR(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), R8[1]))];
	case 0x2853: return [7, Mov(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 4), LSR(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 4), R8[1]))];
	case 0xa853: return [7, Mov(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), LSR(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), R8[1]))];
	case 0x3850: return [7, Mov(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1), ASR(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1), 1))];
	case 0xb850: return [7, Mov(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), ASR(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), 1))];
	case 0x3851: return [7, Mov(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 4), ASR(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 4), 1))];
	case 0xb851: return [7, Mov(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), ASR(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), 1))];
	case 0x3852: return [7, Mov(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1), ASR(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1), R8[1]))];
	case 0xb852: return [7, Mov(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), ASR(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), R8[1]))];
	case 0x3853: return [7, Mov(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 4), ASR(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 4), R8[1]))];
	case 0xb853: return [7, Mov(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), ASR(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), R8[1]))];
	case 0x1076: return [7, Mov(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1), Not(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1)))];
	case 0x9076: return [7, Mov(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Not(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1)))];
	case 0x1077: return [7, Mov(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 4), Not(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 4)))];
	case 0x9077: return [7, Mov(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Not(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4)))];
	case 0x1876: return [7, Mov(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1), Neg(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1)))];
	case 0x9876: return [7, Mov(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Neg(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1)))];
	case 0x1877: return [7, Mov(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 4), Neg(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 4)))];
	case 0x9877: return [7, Mov(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Neg(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4)))];
	case 0x2076: return [7, Mov(R16[0], Mul(R8[0], Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1)))];
	case 0xa076: return [7, Mov(R16[0], Mul(R8[0], Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1)))];
	case 0x2077: return [7, Mov(R32[0], Mul(R32[0], Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 4)))];
	case 0xa077: return [7, Mov(R32[0], Mul(R32[0], Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4)))];
	case 0x2876: return [7, Mov(R16[0], Mul(R8[0], Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1)))];
	case 0xa876: return [7, Mov(R16[0], Mul(R8[0], Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1)))];
	case 0x2877: return [7, Mov(R32[0], Mul(R32[0], Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 4)))];
	case 0xa877: return [7, Mov(R32[0], Mul(R32[0], Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4)))];
	case 0x7e: return [7, Mov(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1), Add(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1), 1))];
	case 0x807e: return [7, Mov(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Add(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), 1))];
	case 0x7f: return [7, Mov(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 4), Add(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 4), 1))];
	case 0x807f: return [7, Mov(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Add(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), 1))];
	case 0x87e: return [7, Mov(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1), Add(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1), -1))];
	case 0x887e: return [7, Mov(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Add(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), -1))];
	case 0x87f: return [7, Mov(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 4), Add(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 4), -1))];
	case 0x887f: return [7, Mov(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Add(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), -1))];
	case 0x107f: return [7, Mov(R32[4], Add(R32[4], -4)),Mov(Mem(R32[4], 4), Add(R32[8], 7)),Mov(R32[8], Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 4))];
	case 0x907f: return [7, Mov(R32[4], Add(R32[4], -4)),Mov(Mem(R32[4], 4), Add(R32[8], 7)),Mov(R32[8], Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4))];
	case 0x207f: return [7, Mov(R32[8], Add(R32[8], 7))];
	case 0xa07f: return [7, Mov(R32[8], Add(R32[8], 7))];
	case 0x307f: return [7, Mov(R32[4], Add(R32[4], -4)),Mov(Mem(R32[4], 4), Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 4))];
	case 0xb07f: return [7, Mov(R32[4], Add(R32[4], -4)),Mov(Mem(R32[4], 4), Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4))];
	}
if(((((b[i+0] & 0x80)>>>7)|(b[i+1]<<1)|((b[i+2] & 0x7)<<9)) & 0xe8f) == 0xa09)
	switch((b[i+0]|(b[i+1]<<8)) & 0xb87f) {
	case 0xf: return [7, Mov(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Mem(R32[4], 4)),Mov(R32[4], Add(R32[4], 4))];
	case 0x800f: return [7, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 4), Mem(R32[4], 4)),Mov(R32[4], Add(R32[4], 4))];
	case 0x50: return [7, Mov(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), ROL(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), 1))];
	case 0x8050: return [7, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 1), ROL(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 1), 1))];
	case 0x51: return [7, Mov(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), ROL(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), 1))];
	case 0x8051: return [7, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 4), ROL(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 4), 1))];
	case 0x52: return [7, Mov(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), ROL(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), R8[1]))];
	case 0x8052: return [7, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 1), ROL(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 1), R8[1]))];
	case 0x53: return [7, Mov(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), ROL(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), R8[1]))];
	case 0x8053: return [7, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 4), ROL(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 4), R8[1]))];
	case 0x850: return [7, Mov(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), ROR(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), 1))];
	case 0x8850: return [7, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 1), ROR(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 1), 1))];
	case 0x851: return [7, Mov(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), ROR(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), 1))];
	case 0x8851: return [7, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 4), ROR(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 4), 1))];
	case 0x852: return [7, Mov(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), ROR(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), R8[1]))];
	case 0x8852: return [7, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 1), ROR(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 1), R8[1]))];
	case 0x853: return [7, Mov(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), ROR(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), R8[1]))];
	case 0x8853: return [7, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 4), ROR(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 4), R8[1]))];
	case 0x2050: return [7, Mov(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), LSL(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), 1))];
	case 0xa050: return [7, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 1), LSL(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 1), 1))];
	case 0x2051: return [7, Mov(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), LSL(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), 1))];
	case 0xa051: return [7, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 4), LSL(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 4), 1))];
	case 0x2052: return [7, Mov(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), LSL(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), R8[1]))];
	case 0xa052: return [7, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 1), LSL(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 1), R8[1]))];
	case 0x2053: return [7, Mov(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), LSL(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), R8[1]))];
	case 0xa053: return [7, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 4), LSL(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 4), R8[1]))];
	case 0x2850: return [7, Mov(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), LSR(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), 1))];
	case 0xa850: return [7, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 1), LSR(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 1), 1))];
	case 0x2851: return [7, Mov(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), LSR(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), 1))];
	case 0xa851: return [7, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 4), LSR(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 4), 1))];
	case 0x2852: return [7, Mov(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), LSR(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), R8[1]))];
	case 0xa852: return [7, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 1), LSR(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 1), R8[1]))];
	case 0x2853: return [7, Mov(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), LSR(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), R8[1]))];
	case 0xa853: return [7, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 4), LSR(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 4), R8[1]))];
	case 0x3850: return [7, Mov(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), ASR(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), 1))];
	case 0xb850: return [7, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 1), ASR(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 1), 1))];
	case 0x3851: return [7, Mov(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), ASR(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), 1))];
	case 0xb851: return [7, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 4), ASR(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 4), 1))];
	case 0x3852: return [7, Mov(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), ASR(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), R8[1]))];
	case 0xb852: return [7, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 1), ASR(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 1), R8[1]))];
	case 0x3853: return [7, Mov(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), ASR(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), R8[1]))];
	case 0xb853: return [7, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 4), ASR(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 4), R8[1]))];
	case 0x1076: return [7, Mov(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Not(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1)))];
	case 0x9076: return [7, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 1), Not(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 1)))];
	case 0x1077: return [7, Mov(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Not(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4)))];
	case 0x9077: return [7, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 4), Not(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 4)))];
	case 0x1876: return [7, Mov(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Neg(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1)))];
	case 0x9876: return [7, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 1), Neg(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 1)))];
	case 0x1877: return [7, Mov(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Neg(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4)))];
	case 0x9877: return [7, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 4), Neg(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 4)))];
	case 0x2076: return [7, Mov(R16[0], Mul(R8[0], Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1)))];
	case 0xa076: return [7, Mov(R16[0], Mul(R8[0], Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 1)))];
	case 0x2077: return [7, Mov(R32[0], Mul(R32[0], Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4)))];
	case 0xa077: return [7, Mov(R32[0], Mul(R32[0], Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 4)))];
	case 0x2876: return [7, Mov(R16[0], Mul(R8[0], Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1)))];
	case 0xa876: return [7, Mov(R16[0], Mul(R8[0], Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 1)))];
	case 0x2877: return [7, Mov(R32[0], Mul(R32[0], Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4)))];
	case 0xa877: return [7, Mov(R32[0], Mul(R32[0], Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 4)))];
	case 0x7e: return [7, Mov(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Add(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), 1))];
	case 0x807e: return [7, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 1), Add(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 1), 1))];
	case 0x7f: return [7, Mov(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Add(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), 1))];
	case 0x807f: return [7, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 4), Add(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 4), 1))];
	case 0x87e: return [7, Mov(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Add(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), -1))];
	case 0x887e: return [7, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 1), Add(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 1), -1))];
	case 0x87f: return [7, Mov(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Add(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), -1))];
	case 0x887f: return [7, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 4), Add(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 4), -1))];
	case 0x107f: return [7, Mov(R32[4], Add(R32[4], -4)),Mov(Mem(R32[4], 4), Add(R32[8], 7)),Mov(R32[8], Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4))];
	case 0x907f: return [7, Mov(R32[4], Add(R32[4], -4)),Mov(Mem(R32[4], 4), Add(R32[8], 7)),Mov(R32[8], Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 4))];
	case 0x207f: return [7, Mov(R32[8], Add(R32[8], 7))];
	case 0xa07f: return [7, Mov(R32[8], Add(R32[8], 7))];
	case 0x307f: return [7, Mov(R32[4], Add(R32[4], -4)),Mov(Mem(R32[4], 4), Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4))];
	case 0xb07f: return [7, Mov(R32[4], Add(R32[4], -4)),Mov(Mem(R32[4], 4), Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 4))];
	}
if(((((b[i+0] & 0xc0)>>>6)|(b[i+1]<<2)|((b[i+2] & 0x3f)<<10)) & 0xfd1d) == 0x9410)
	switch((b[i+0]|(b[i+1]<<8)) & 0x80bf) {
	case 0x0: return [7, Mov(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1), Add(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1), R8[(((b[i+1] & 0x38)>>>3))]))];
	case 0x8000: return [7, Mov(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Add(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), R8[(((b[i+1] & 0x38)>>>3))]))];
	case 0x1: return [7, Mov(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 4), Add(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 4), R32[(((b[i+1] & 0x38)>>>3))]))];
	case 0x8001: return [7, Mov(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Add(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), R32[(((b[i+1] & 0x38)>>>3))]))];
	case 0x2: return [7, Mov(R8[(((b[i+1] & 0x38)>>>3))], Add(R8[(((b[i+1] & 0x38)>>>3))], Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1)))];
	case 0x8002: return [7, Mov(R8[(((b[i+1] & 0x38)>>>3))], Add(R8[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1)))];
	case 0x3: return [7, Mov(R32[(((b[i+1] & 0x38)>>>3))], Add(R32[(((b[i+1] & 0x38)>>>3))], Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 4)))];
	case 0x8003: return [7, Mov(R32[(((b[i+1] & 0x38)>>>3))], Add(R32[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4)))];
	case 0x8: return [7, Mov(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1), Or(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1), R8[(((b[i+1] & 0x38)>>>3))]))];
	case 0x8008: return [7, Mov(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Or(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), R8[(((b[i+1] & 0x38)>>>3))]))];
	case 0x9: return [7, Mov(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 4), Or(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 4), R32[(((b[i+1] & 0x38)>>>3))]))];
	case 0x8009: return [7, Mov(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Or(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), R32[(((b[i+1] & 0x38)>>>3))]))];
	case 0xa: return [7, Mov(R8[(((b[i+1] & 0x38)>>>3))], Or(R8[(((b[i+1] & 0x38)>>>3))], Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1)))];
	case 0x800a: return [7, Mov(R8[(((b[i+1] & 0x38)>>>3))], Or(R8[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1)))];
	case 0xb: return [7, Mov(R32[(((b[i+1] & 0x38)>>>3))], Or(R32[(((b[i+1] & 0x38)>>>3))], Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 4)))];
	case 0x800b: return [7, Mov(R32[(((b[i+1] & 0x38)>>>3))], Or(R32[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4)))];
	case 0x10: return [7, Mov(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1), Add(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1), Add(R8[(((b[i+1] & 0x38)>>>3))], F[1])))];
	case 0x8010: return [7, Mov(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Add(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Add(R8[(((b[i+1] & 0x38)>>>3))], F[1])))];
	case 0x11: return [7, Mov(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 4), Add(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 4), Add(R32[(((b[i+1] & 0x38)>>>3))], F[1])))];
	case 0x8011: return [7, Mov(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Add(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Add(R32[(((b[i+1] & 0x38)>>>3))], F[1])))];
	case 0x12: return [7, Mov(R8[(((b[i+1] & 0x38)>>>3))], Add(R8[(((b[i+1] & 0x38)>>>3))], Add(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1), F[1])))];
	case 0x8012: return [7, Mov(R8[(((b[i+1] & 0x38)>>>3))], Add(R8[(((b[i+1] & 0x38)>>>3))], Add(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), F[1])))];
	case 0x13: return [7, Mov(R32[(((b[i+1] & 0x38)>>>3))], Add(R32[(((b[i+1] & 0x38)>>>3))], Add(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 4), F[1])))];
	case 0x8013: return [7, Mov(R32[(((b[i+1] & 0x38)>>>3))], Add(R32[(((b[i+1] & 0x38)>>>3))], Add(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), F[1])))];
	case 0x18: return [7, Mov(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1), Add(R8[(((b[i+1] & 0x38)>>>3))], Neg(Add(Add(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1), Neg(F[1])), 1))))];
	case 0x8018: return [7, Mov(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Add(R8[(((b[i+1] & 0x38)>>>3))], Neg(Add(Add(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Neg(F[1])), 1))))];
	case 0x19: return [7, Mov(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 4), Add(R32[(((b[i+1] & 0x38)>>>3))], Neg(Add(Add(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 4), Neg(F[1])), 1))))];
	case 0x8019: return [7, Mov(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Add(R32[(((b[i+1] & 0x38)>>>3))], Neg(Add(Add(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Neg(F[1])), 1))))];
	case 0x1a: return [7, Mov(R8[(((b[i+1] & 0x38)>>>3))], Add(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1), Neg(Add(Add(R8[(((b[i+1] & 0x38)>>>3))], Neg(F[1])), 1))))];
	case 0x801a: return [7, Mov(R8[(((b[i+1] & 0x38)>>>3))], Add(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Neg(Add(Add(R8[(((b[i+1] & 0x38)>>>3))], Neg(F[1])), 1))))];
	case 0x1b: return [7, Mov(R32[(((b[i+1] & 0x38)>>>3))], Add(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 4), Neg(Add(Add(R32[(((b[i+1] & 0x38)>>>3))], Neg(F[1])), 1))))];
	case 0x801b: return [7, Mov(R32[(((b[i+1] & 0x38)>>>3))], Add(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Neg(Add(Add(R32[(((b[i+1] & 0x38)>>>3))], Neg(F[1])), 1))))];
	case 0x20: return [7, Mov(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1), And(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1), R8[(((b[i+1] & 0x38)>>>3))]))];
	case 0x8020: return [7, Mov(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), And(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), R8[(((b[i+1] & 0x38)>>>3))]))];
	case 0x21: return [7, Mov(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 4), And(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 4), R32[(((b[i+1] & 0x38)>>>3))]))];
	case 0x8021: return [7, Mov(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), And(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), R32[(((b[i+1] & 0x38)>>>3))]))];
	case 0x22: return [7, Mov(R8[(((b[i+1] & 0x38)>>>3))], And(R8[(((b[i+1] & 0x38)>>>3))], Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1)))];
	case 0x8022: return [7, Mov(R8[(((b[i+1] & 0x38)>>>3))], And(R8[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1)))];
	case 0x23: return [7, Mov(R32[(((b[i+1] & 0x38)>>>3))], And(R32[(((b[i+1] & 0x38)>>>3))], Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 4)))];
	case 0x8023: return [7, Mov(R32[(((b[i+1] & 0x38)>>>3))], And(R32[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4)))];
	case 0x28: return [7, Mov(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1), Add(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1), Neg(R8[(((b[i+1] & 0x38)>>>3))])))];
	case 0x8028: return [7, Mov(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Add(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Neg(R8[(((b[i+1] & 0x38)>>>3))])))];
	case 0x29: return [7, Mov(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 4), Add(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 4), Neg(R32[(((b[i+1] & 0x38)>>>3))])))];
	case 0x8029: return [7, Mov(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Add(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Neg(R32[(((b[i+1] & 0x38)>>>3))])))];
	case 0x2a: return [7, Mov(R8[(((b[i+1] & 0x38)>>>3))], Add(R8[(((b[i+1] & 0x38)>>>3))], Neg(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1))))];
	case 0x802a: return [7, Mov(R8[(((b[i+1] & 0x38)>>>3))], Add(R8[(((b[i+1] & 0x38)>>>3))], Neg(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1))))];
	case 0x2b: return [7, Mov(R32[(((b[i+1] & 0x38)>>>3))], Add(R32[(((b[i+1] & 0x38)>>>3))], Neg(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 4))))];
	case 0x802b: return [7, Mov(R32[(((b[i+1] & 0x38)>>>3))], Add(R32[(((b[i+1] & 0x38)>>>3))], Neg(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4))))];
	case 0x30: return [7, Mov(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1), Xor(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1), R8[(((b[i+1] & 0x38)>>>3))]))];
	case 0x8030: return [7, Mov(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Xor(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), R8[(((b[i+1] & 0x38)>>>3))]))];
	case 0x31: return [7, Mov(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 4), Xor(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 4), R32[(((b[i+1] & 0x38)>>>3))]))];
	case 0x8031: return [7, Mov(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Xor(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), R32[(((b[i+1] & 0x38)>>>3))]))];
	case 0x32: return [7, Mov(R8[(((b[i+1] & 0x38)>>>3))], Xor(R8[(((b[i+1] & 0x38)>>>3))], Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1)))];
	case 0x8032: return [7, Mov(R8[(((b[i+1] & 0x38)>>>3))], Xor(R8[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1)))];
	case 0x33: return [7, Mov(R32[(((b[i+1] & 0x38)>>>3))], Xor(R32[(((b[i+1] & 0x38)>>>3))], Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 4)))];
	case 0x8033: return [7, Mov(R32[(((b[i+1] & 0x38)>>>3))], Xor(R32[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4)))];
	case 0x38: return [7, Mov(F[2], Eq(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1), R8[(((b[i+1] & 0x38)>>>3))])),Mov(F[1], Lt(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1), R8[(((b[i+1] & 0x38)>>>3))]))];
	case 0x8038: return [7, Mov(F[2], Eq(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), R8[(((b[i+1] & 0x38)>>>3))])),Mov(F[1], Lt(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), R8[(((b[i+1] & 0x38)>>>3))]))];
	case 0x39: return [7, Mov(F[2], Eq(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 4), R32[(((b[i+1] & 0x38)>>>3))])),Mov(F[1], Lt(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 4), R32[(((b[i+1] & 0x38)>>>3))]))];
	case 0x8039: return [7, Mov(F[2], Eq(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), R32[(((b[i+1] & 0x38)>>>3))])),Mov(F[1], Lt(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), R32[(((b[i+1] & 0x38)>>>3))]))];
	case 0x3a: return [7, Mov(F[2], Eq(R8[(((b[i+1] & 0x38)>>>3))], Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1))),Mov(F[1], Lt(R8[(((b[i+1] & 0x38)>>>3))], Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1)))];
	case 0x803a: return [7, Mov(F[2], Eq(R8[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1))),Mov(F[1], Lt(R8[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1)))];
	case 0x3b: return [7, Mov(F[2], Eq(R32[(((b[i+1] & 0x38)>>>3))], Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 4))),Mov(F[1], Lt(R32[(((b[i+1] & 0x38)>>>3))], Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 4)))];
	case 0x803b: return [7, Mov(F[2], Eq(R32[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4))),Mov(F[1], Lt(R32[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4)))];
	case 0x84: return [7, Mov(F[2], Eq(And(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1), R8[(((b[i+1] & 0x38)>>>3))]), 0))];
	case 0x8084: return [7, Mov(F[2], Eq(And(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), R8[(((b[i+1] & 0x38)>>>3))]), 0))];
	case 0x85: return [7, Mov(F[2], Eq(And(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 4), R32[(((b[i+1] & 0x38)>>>3))]), 0))];
	case 0x8085: return [7, Mov(F[2], Eq(And(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), R32[(((b[i+1] & 0x38)>>>3))]), 0))];
	case 0x86: return [7, Swap(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1), R8[(((b[i+1] & 0x38)>>>3))])];
	case 0x8086: return [7, Swap(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), R8[(((b[i+1] & 0x38)>>>3))])];
	case 0x87: return [7, Swap(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 4), R32[(((b[i+1] & 0x38)>>>3))])];
	case 0x8087: return [7, Swap(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), R32[(((b[i+1] & 0x38)>>>3))])];
	case 0x88: return [7, Mov(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1), R8[(((b[i+1] & 0x38)>>>3))])];
	case 0x8088: return [7, Mov(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), R8[(((b[i+1] & 0x38)>>>3))])];
	case 0x89: return [7, Mov(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 4), R32[(((b[i+1] & 0x38)>>>3))])];
	case 0x8089: return [7, Mov(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), R32[(((b[i+1] & 0x38)>>>3))])];
	case 0x8a: return [7, Mov(R8[(((b[i+1] & 0x38)>>>3))], Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 1))];
	case 0x808a: return [7, Mov(R8[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1))];
	case 0x8b: return [7, Mov(R32[(((b[i+1] & 0x38)>>>3))], Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 4))];
	case 0x808b: return [7, Mov(R32[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4))];
	case 0x8c: return [7, Mov(Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 4), RS[(((b[i+1] & 0x38)>>>3))])];
	case 0x808c: return [7, Mov(Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), RS[(((b[i+1] & 0x38)>>>3))])];
	case 0x8d: return [7, Mov(R32[(((b[i+1] & 0x38)>>>3))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))];
	case 0x808d: return [7, Mov(R32[(((b[i+1] & 0x38)>>>3))], Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))];
	case 0x8e: return [7, Mov(RS[(((b[i+1] & 0x38)>>>3))], Mem((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), 2))];
	case 0x808e: return [7, Mov(RS[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[5], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 2))];
	}
if(((((b[i+0] & 0xc0)>>>6)|(b[i+1]<<2)|((b[i+2] & 0x7)<<10)) & 0x1d1d) == 0x1410)
	switch((b[i+0]|(b[i+1]<<8)) & 0x80bf) {
	case 0x0: return [7, Mov(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Add(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), R8[(((b[i+1] & 0x38)>>>3))]))];
	case 0x8000: return [7, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 1), Add(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 1), R8[(((b[i+1] & 0x38)>>>3))]))];
	case 0x1: return [7, Mov(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Add(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), R32[(((b[i+1] & 0x38)>>>3))]))];
	case 0x8001: return [7, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 4), Add(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 4), R32[(((b[i+1] & 0x38)>>>3))]))];
	case 0x2: return [7, Mov(R8[(((b[i+1] & 0x38)>>>3))], Add(R8[(((b[i+1] & 0x38)>>>3))], Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1)))];
	case 0x8002: return [7, Mov(R8[(((b[i+1] & 0x38)>>>3))], Add(R8[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 1)))];
	case 0x3: return [7, Mov(R32[(((b[i+1] & 0x38)>>>3))], Add(R32[(((b[i+1] & 0x38)>>>3))], Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4)))];
	case 0x8003: return [7, Mov(R32[(((b[i+1] & 0x38)>>>3))], Add(R32[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 4)))];
	case 0x8: return [7, Mov(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Or(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), R8[(((b[i+1] & 0x38)>>>3))]))];
	case 0x8008: return [7, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 1), Or(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 1), R8[(((b[i+1] & 0x38)>>>3))]))];
	case 0x9: return [7, Mov(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Or(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), R32[(((b[i+1] & 0x38)>>>3))]))];
	case 0x8009: return [7, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 4), Or(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 4), R32[(((b[i+1] & 0x38)>>>3))]))];
	case 0xa: return [7, Mov(R8[(((b[i+1] & 0x38)>>>3))], Or(R8[(((b[i+1] & 0x38)>>>3))], Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1)))];
	case 0x800a: return [7, Mov(R8[(((b[i+1] & 0x38)>>>3))], Or(R8[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 1)))];
	case 0xb: return [7, Mov(R32[(((b[i+1] & 0x38)>>>3))], Or(R32[(((b[i+1] & 0x38)>>>3))], Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4)))];
	case 0x800b: return [7, Mov(R32[(((b[i+1] & 0x38)>>>3))], Or(R32[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 4)))];
	case 0x10: return [7, Mov(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Add(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Add(R8[(((b[i+1] & 0x38)>>>3))], F[1])))];
	case 0x8010: return [7, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 1), Add(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 1), Add(R8[(((b[i+1] & 0x38)>>>3))], F[1])))];
	case 0x11: return [7, Mov(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Add(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Add(R32[(((b[i+1] & 0x38)>>>3))], F[1])))];
	case 0x8011: return [7, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 4), Add(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 4), Add(R32[(((b[i+1] & 0x38)>>>3))], F[1])))];
	case 0x12: return [7, Mov(R8[(((b[i+1] & 0x38)>>>3))], Add(R8[(((b[i+1] & 0x38)>>>3))], Add(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), F[1])))];
	case 0x8012: return [7, Mov(R8[(((b[i+1] & 0x38)>>>3))], Add(R8[(((b[i+1] & 0x38)>>>3))], Add(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 1), F[1])))];
	case 0x13: return [7, Mov(R32[(((b[i+1] & 0x38)>>>3))], Add(R32[(((b[i+1] & 0x38)>>>3))], Add(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), F[1])))];
	case 0x8013: return [7, Mov(R32[(((b[i+1] & 0x38)>>>3))], Add(R32[(((b[i+1] & 0x38)>>>3))], Add(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 4), F[1])))];
	case 0x18: return [7, Mov(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Add(R8[(((b[i+1] & 0x38)>>>3))], Neg(Add(Add(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Neg(F[1])), 1))))];
	case 0x8018: return [7, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 1), Add(R8[(((b[i+1] & 0x38)>>>3))], Neg(Add(Add(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 1), Neg(F[1])), 1))))];
	case 0x19: return [7, Mov(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Add(R32[(((b[i+1] & 0x38)>>>3))], Neg(Add(Add(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Neg(F[1])), 1))))];
	case 0x8019: return [7, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 4), Add(R32[(((b[i+1] & 0x38)>>>3))], Neg(Add(Add(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 4), Neg(F[1])), 1))))];
	case 0x1a: return [7, Mov(R8[(((b[i+1] & 0x38)>>>3))], Add(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Neg(Add(Add(R8[(((b[i+1] & 0x38)>>>3))], Neg(F[1])), 1))))];
	case 0x801a: return [7, Mov(R8[(((b[i+1] & 0x38)>>>3))], Add(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 1), Neg(Add(Add(R8[(((b[i+1] & 0x38)>>>3))], Neg(F[1])), 1))))];
	case 0x1b: return [7, Mov(R32[(((b[i+1] & 0x38)>>>3))], Add(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Neg(Add(Add(R32[(((b[i+1] & 0x38)>>>3))], Neg(F[1])), 1))))];
	case 0x801b: return [7, Mov(R32[(((b[i+1] & 0x38)>>>3))], Add(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 4), Neg(Add(Add(R32[(((b[i+1] & 0x38)>>>3))], Neg(F[1])), 1))))];
	case 0x20: return [7, Mov(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), And(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), R8[(((b[i+1] & 0x38)>>>3))]))];
	case 0x8020: return [7, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 1), And(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 1), R8[(((b[i+1] & 0x38)>>>3))]))];
	case 0x21: return [7, Mov(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), And(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), R32[(((b[i+1] & 0x38)>>>3))]))];
	case 0x8021: return [7, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 4), And(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 4), R32[(((b[i+1] & 0x38)>>>3))]))];
	case 0x22: return [7, Mov(R8[(((b[i+1] & 0x38)>>>3))], And(R8[(((b[i+1] & 0x38)>>>3))], Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1)))];
	case 0x8022: return [7, Mov(R8[(((b[i+1] & 0x38)>>>3))], And(R8[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 1)))];
	case 0x23: return [7, Mov(R32[(((b[i+1] & 0x38)>>>3))], And(R32[(((b[i+1] & 0x38)>>>3))], Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4)))];
	case 0x8023: return [7, Mov(R32[(((b[i+1] & 0x38)>>>3))], And(R32[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 4)))];
	case 0x28: return [7, Mov(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Add(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Neg(R8[(((b[i+1] & 0x38)>>>3))])))];
	case 0x8028: return [7, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 1), Add(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 1), Neg(R8[(((b[i+1] & 0x38)>>>3))])))];
	case 0x29: return [7, Mov(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Add(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Neg(R32[(((b[i+1] & 0x38)>>>3))])))];
	case 0x8029: return [7, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 4), Add(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 4), Neg(R32[(((b[i+1] & 0x38)>>>3))])))];
	case 0x2a: return [7, Mov(R8[(((b[i+1] & 0x38)>>>3))], Add(R8[(((b[i+1] & 0x38)>>>3))], Neg(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1))))];
	case 0x802a: return [7, Mov(R8[(((b[i+1] & 0x38)>>>3))], Add(R8[(((b[i+1] & 0x38)>>>3))], Neg(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 1))))];
	case 0x2b: return [7, Mov(R32[(((b[i+1] & 0x38)>>>3))], Add(R32[(((b[i+1] & 0x38)>>>3))], Neg(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4))))];
	case 0x802b: return [7, Mov(R32[(((b[i+1] & 0x38)>>>3))], Add(R32[(((b[i+1] & 0x38)>>>3))], Neg(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 4))))];
	case 0x30: return [7, Mov(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Xor(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), R8[(((b[i+1] & 0x38)>>>3))]))];
	case 0x8030: return [7, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 1), Xor(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 1), R8[(((b[i+1] & 0x38)>>>3))]))];
	case 0x31: return [7, Mov(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Xor(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), R32[(((b[i+1] & 0x38)>>>3))]))];
	case 0x8031: return [7, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 4), Xor(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 4), R32[(((b[i+1] & 0x38)>>>3))]))];
	case 0x32: return [7, Mov(R8[(((b[i+1] & 0x38)>>>3))], Xor(R8[(((b[i+1] & 0x38)>>>3))], Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1)))];
	case 0x8032: return [7, Mov(R8[(((b[i+1] & 0x38)>>>3))], Xor(R8[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 1)))];
	case 0x33: return [7, Mov(R32[(((b[i+1] & 0x38)>>>3))], Xor(R32[(((b[i+1] & 0x38)>>>3))], Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4)))];
	case 0x8033: return [7, Mov(R32[(((b[i+1] & 0x38)>>>3))], Xor(R32[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 4)))];
	case 0x38: return [7, Mov(F[2], Eq(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), R8[(((b[i+1] & 0x38)>>>3))])),Mov(F[1], Lt(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), R8[(((b[i+1] & 0x38)>>>3))]))];
	case 0x8038: return [7, Mov(F[2], Eq(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 1), R8[(((b[i+1] & 0x38)>>>3))])),Mov(F[1], Lt(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 1), R8[(((b[i+1] & 0x38)>>>3))]))];
	case 0x39: return [7, Mov(F[2], Eq(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), R32[(((b[i+1] & 0x38)>>>3))])),Mov(F[1], Lt(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), R32[(((b[i+1] & 0x38)>>>3))]))];
	case 0x8039: return [7, Mov(F[2], Eq(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 4), R32[(((b[i+1] & 0x38)>>>3))])),Mov(F[1], Lt(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 4), R32[(((b[i+1] & 0x38)>>>3))]))];
	case 0x3a: return [7, Mov(F[2], Eq(R8[(((b[i+1] & 0x38)>>>3))], Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1))),Mov(F[1], Lt(R8[(((b[i+1] & 0x38)>>>3))], Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1)))];
	case 0x803a: return [7, Mov(F[2], Eq(R8[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 1))),Mov(F[1], Lt(R8[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 1)))];
	case 0x3b: return [7, Mov(F[2], Eq(R32[(((b[i+1] & 0x38)>>>3))], Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4))),Mov(F[1], Lt(R32[(((b[i+1] & 0x38)>>>3))], Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4)))];
	case 0x803b: return [7, Mov(F[2], Eq(R32[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 4))),Mov(F[1], Lt(R32[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 4)))];
	case 0x84: return [7, Mov(F[2], Eq(And(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), R8[(((b[i+1] & 0x38)>>>3))]), 0))];
	case 0x8084: return [7, Mov(F[2], Eq(And(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 1), R8[(((b[i+1] & 0x38)>>>3))]), 0))];
	case 0x85: return [7, Mov(F[2], Eq(And(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), R32[(((b[i+1] & 0x38)>>>3))]), 0))];
	case 0x8085: return [7, Mov(F[2], Eq(And(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 4), R32[(((b[i+1] & 0x38)>>>3))]), 0))];
	case 0x86: return [7, Swap(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), R8[(((b[i+1] & 0x38)>>>3))])];
	case 0x8086: return [7, Swap(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 1), R8[(((b[i+1] & 0x38)>>>3))])];
	case 0x87: return [7, Swap(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), R32[(((b[i+1] & 0x38)>>>3))])];
	case 0x8087: return [7, Swap(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 4), R32[(((b[i+1] & 0x38)>>>3))])];
	case 0x88: return [7, Mov(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), R8[(((b[i+1] & 0x38)>>>3))])];
	case 0x8088: return [7, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 1), R8[(((b[i+1] & 0x38)>>>3))])];
	case 0x89: return [7, Mov(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), R32[(((b[i+1] & 0x38)>>>3))])];
	case 0x8089: return [7, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 4), R32[(((b[i+1] & 0x38)>>>3))])];
	case 0x8a: return [7, Mov(R8[(((b[i+1] & 0x38)>>>3))], Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1))];
	case 0x808a: return [7, Mov(R8[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 1))];
	case 0x8b: return [7, Mov(R32[(((b[i+1] & 0x38)>>>3))], Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4))];
	case 0x808b: return [7, Mov(R32[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 4))];
	case 0x8c: return [7, Mov(Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), RS[(((b[i+1] & 0x38)>>>3))])];
	case 0x808c: return [7, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 4), RS[(((b[i+1] & 0x38)>>>3))])];
	case 0x8d: return [7, Mov(R32[(((b[i+1] & 0x38)>>>3))], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))];
	case 0x808d: return [7, Mov(R32[(((b[i+1] & 0x38)>>>3))], Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))))];
	case 0x8e: return [7, Mov(RS[(((b[i+1] & 0x38)>>>3))], Mem(Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 2))];
	case 0x808e: return [7, Mov(RS[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))), 2))];
	}
if(((((b[i+0] & 0xc0)>>>6)|(b[i+1]<<2)|((b[i+2] & 0x3f)<<10)) & 0xe31d) == 0x8210)
	switch((b[i+0]) & 0xbf) {
	case 0x0: return [7, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Add(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), R8[(((b[i+1] & 0x38)>>>3))]))];
	case 0x1: return [7, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Add(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), R32[(((b[i+1] & 0x38)>>>3))]))];
	case 0x2: return [7, Mov(R8[(((b[i+1] & 0x38)>>>3))], Add(R8[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1)))];
	case 0x3: return [7, Mov(R32[(((b[i+1] & 0x38)>>>3))], Add(R32[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4)))];
	case 0x8: return [7, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Or(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), R8[(((b[i+1] & 0x38)>>>3))]))];
	case 0x9: return [7, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Or(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), R32[(((b[i+1] & 0x38)>>>3))]))];
	case 0xa: return [7, Mov(R8[(((b[i+1] & 0x38)>>>3))], Or(R8[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1)))];
	case 0xb: return [7, Mov(R32[(((b[i+1] & 0x38)>>>3))], Or(R32[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4)))];
	case 0x10: return [7, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Add(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Add(R8[(((b[i+1] & 0x38)>>>3))], F[1])))];
	case 0x11: return [7, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Add(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Add(R32[(((b[i+1] & 0x38)>>>3))], F[1])))];
	case 0x12: return [7, Mov(R8[(((b[i+1] & 0x38)>>>3))], Add(R8[(((b[i+1] & 0x38)>>>3))], Add(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), F[1])))];
	case 0x13: return [7, Mov(R32[(((b[i+1] & 0x38)>>>3))], Add(R32[(((b[i+1] & 0x38)>>>3))], Add(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), F[1])))];
	case 0x18: return [7, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Add(R8[(((b[i+1] & 0x38)>>>3))], Neg(Add(Add(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Neg(F[1])), 1))))];
	case 0x19: return [7, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Add(R32[(((b[i+1] & 0x38)>>>3))], Neg(Add(Add(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Neg(F[1])), 1))))];
	case 0x1a: return [7, Mov(R8[(((b[i+1] & 0x38)>>>3))], Add(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Neg(Add(Add(R8[(((b[i+1] & 0x38)>>>3))], Neg(F[1])), 1))))];
	case 0x1b: return [7, Mov(R32[(((b[i+1] & 0x38)>>>3))], Add(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Neg(Add(Add(R32[(((b[i+1] & 0x38)>>>3))], Neg(F[1])), 1))))];
	case 0x20: return [7, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), And(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), R8[(((b[i+1] & 0x38)>>>3))]))];
	case 0x21: return [7, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), And(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), R32[(((b[i+1] & 0x38)>>>3))]))];
	case 0x22: return [7, Mov(R8[(((b[i+1] & 0x38)>>>3))], And(R8[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1)))];
	case 0x23: return [7, Mov(R32[(((b[i+1] & 0x38)>>>3))], And(R32[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4)))];
	case 0x28: return [7, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Add(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Neg(R8[(((b[i+1] & 0x38)>>>3))])))];
	case 0x29: return [7, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Add(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Neg(R32[(((b[i+1] & 0x38)>>>3))])))];
	case 0x2a: return [7, Mov(R8[(((b[i+1] & 0x38)>>>3))], Add(R8[(((b[i+1] & 0x38)>>>3))], Neg(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1))))];
	case 0x2b: return [7, Mov(R32[(((b[i+1] & 0x38)>>>3))], Add(R32[(((b[i+1] & 0x38)>>>3))], Neg(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4))))];
	case 0x30: return [7, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Xor(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), R8[(((b[i+1] & 0x38)>>>3))]))];
	case 0x31: return [7, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Xor(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), R32[(((b[i+1] & 0x38)>>>3))]))];
	case 0x32: return [7, Mov(R8[(((b[i+1] & 0x38)>>>3))], Xor(R8[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1)))];
	case 0x33: return [7, Mov(R32[(((b[i+1] & 0x38)>>>3))], Xor(R32[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4)))];
	case 0x38: return [7, Mov(F[2], Eq(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), R8[(((b[i+1] & 0x38)>>>3))])),Mov(F[1], Lt(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), R8[(((b[i+1] & 0x38)>>>3))]))];
	case 0x39: return [7, Mov(F[2], Eq(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), R32[(((b[i+1] & 0x38)>>>3))])),Mov(F[1], Lt(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), R32[(((b[i+1] & 0x38)>>>3))]))];
	case 0x3a: return [7, Mov(F[2], Eq(R8[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1))),Mov(F[1], Lt(R8[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1)))];
	case 0x3b: return [7, Mov(F[2], Eq(R32[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4))),Mov(F[1], Lt(R32[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4)))];
	case 0x84: return [7, Mov(F[2], Eq(And(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), R8[(((b[i+1] & 0x38)>>>3))]), 0))];
	case 0x85: return [7, Mov(F[2], Eq(And(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), R32[(((b[i+1] & 0x38)>>>3))]), 0))];
	case 0x86: return [7, Swap(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), R8[(((b[i+1] & 0x38)>>>3))])];
	case 0x87: return [7, Swap(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), R32[(((b[i+1] & 0x38)>>>3))])];
	case 0x88: return [7, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), R8[(((b[i+1] & 0x38)>>>3))])];
	case 0x89: return [7, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), R32[(((b[i+1] & 0x38)>>>3))])];
	case 0x8a: return [7, Mov(R8[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1))];
	case 0x8b: return [7, Mov(R32[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4))];
	case 0x8c: return [7, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), RS[(((b[i+1] & 0x38)>>>3))])];
	case 0x8d: return [7, Mov(R32[(((b[i+1] & 0x38)>>>3))], Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))];
	case 0x8e: return [7, Mov(RS[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 2))];
	}
if(((((b[i+0] & 0xf8)>>>3)) & 0x11) == 0x10)
	switch((b[i+0]|(b[i+1]<<8)) & 0xf877) {
	case 0x8000: return [7, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 1), Add(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 1), (b[i+6])))];
	case 0x4001: return [7, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 4), Add(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 4), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))];
	case 0x8002: return [7, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 1), Add(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 1), (b[i+6])))];
	case 0x8003: return [7, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 4), Add(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 4), (b[i+6])))];
	case 0x8800: return [7, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 1), Or(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 1), (b[i+6])))];
	case 0x4801: return [7, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 4), Or(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 4), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))];
	case 0x8802: return [7, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 1), Or(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 1), (b[i+6])))];
	case 0x8803: return [7, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 4), Or(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 4), (b[i+6])))];
	case 0x9000: return [7, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 1), Add(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 1), Add((b[i+6]), F[1])))];
	case 0x5001: return [7, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 4), Add(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 4), Add((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), F[1])))];
	case 0x9002: return [7, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 1), Add(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 1), Add((b[i+6]), F[1])))];
	case 0x9003: return [7, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 4), Add(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 4), Add((b[i+6]), F[1])))];
	case 0x9800: return [7, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 1), Add((b[i+6]), Neg(Add(Add(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 1), Neg(F[1])), 1))))];
	case 0x5801: return [7, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 4), Add((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), Neg(Add(Add(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 4), Neg(F[1])), 1))))];
	case 0x9802: return [7, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 1), Add((b[i+6]), Neg(Add(Add(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 1), Neg(F[1])), 1))))];
	case 0x9803: return [7, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 4), Add((b[i+6]), Neg(Add(Add(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 4), Neg(F[1])), 1))))];
	case 0xa000: return [7, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 1), And(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 1), (b[i+6])))];
	case 0x6001: return [7, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 4), And(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 4), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))];
	case 0xa002: return [7, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 1), And(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 1), (b[i+6])))];
	case 0xa003: return [7, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 4), And(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 4), (b[i+6])))];
	case 0xa800: return [7, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 1), Add(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 1), -(b[i+6])))];
	case 0x6801: return [7, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 4), Add(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 4), -(b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))];
	case 0xa802: return [7, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 1), Add(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 1), -(b[i+6])))];
	case 0xa803: return [7, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 4), Add(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 4), -(b[i+6])))];
	case 0xb000: return [7, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 1), Xor(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 1), (b[i+6])))];
	case 0x7001: return [7, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 4), Xor(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 4), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))];
	case 0xb002: return [7, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 1), Xor(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 1), (b[i+6])))];
	case 0xb003: return [7, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 4), Xor(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 4), (b[i+6])))];
	case 0xb800: return [7, Mov(F[2], Eq(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 1), (b[i+6]))),Mov(F[1], Lt(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 1), (b[i+6])))];
	case 0x7801: return [7, Mov(F[2], Eq(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 4), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))),Mov(F[1], Lt(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 4), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))];
	case 0xb802: return [7, Mov(F[2], Eq(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 1), (b[i+6]))),Mov(F[1], Lt(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 1), (b[i+6])))];
	case 0xb803: return [7, Mov(F[2], Eq(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 4), (b[i+6]))),Mov(F[1], Lt(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 4), (b[i+6])))];
	case 0x8046: return [7, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 1), (b[i+6]))];
	case 0x4047: return [7, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 4), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))];
	case 0x8040: return [7, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 1), ROL(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 1), (b[i+6])))];
	case 0x8041: return [7, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 4), ROL(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 4), (b[i+6])))];
	case 0x8840: return [7, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 1), ROR(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 1), (b[i+6])))];
	case 0x8841: return [7, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 4), ROR(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 4), (b[i+6])))];
	case 0xa040: return [7, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 1), LSL(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 1), (b[i+6])))];
	case 0xa041: return [7, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 4), LSL(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 4), (b[i+6])))];
	case 0xa840: return [7, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 1), LSR(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 1), (b[i+6])))];
	case 0xa841: return [7, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 4), LSR(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 4), (b[i+6])))];
	case 0xb840: return [7, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 1), ASR(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 1), (b[i+6])))];
	case 0xb841: return [7, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 4), ASR(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 4), (b[i+6])))];
	case 0x8076: return [7, Mov(F[2], Eq(And(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 1), (b[i+6])), 0))];
	case 0x4077: return [7, Mov(F[2], Eq(And(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 4), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 0))];
	}
if(((b[i+0]|(b[i+1]<<8)|(b[i+2]<<16)) & 0xc0c0ff) == 0x80800f)
	switch(((b[i+1] & 0x3f)) & 0x3f) {
	case 0x10: return [7, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), F[0])];
	case 0x11: return [7, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Not(F[0]))];
	case 0x12: return [7, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), F[1])];
	case 0x13: return [7, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Not(F[1]))];
	case 0x14: return [7, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), F[2])];
	case 0x15: return [7, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Not(F[2]))];
	case 0x16: return [7, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Or(F[1], F[2]))];
	case 0x17: return [7, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), And(Not(F[1]), Not(F[2])))];
	case 0x18: return [7, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), F[3])];
	case 0x19: return [7, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Not(F[3]))];
	case 0x1a: return [7, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), F[4])];
	case 0x1b: return [7, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Not(F[4]))];
	case 0x1c: return [7, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Not(Eq(F[0], F[3])))];
	case 0x1d: return [7, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Eq(F[0], F[3]))];
	case 0x1e: return [7, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Or(F[2], Not(Eq(F[0], F[3]))))];
	case 0x1f: return [7, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), And(Not(F[2]), Eq(F[0], F[3])))];
	case 0x2d: return [7, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Or(LSR(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), R8[1]), And(R32[(((b[i+2] & 0x38)>>>3))], LSL(Add(LSL(1, R8[1]), -1), Add(32, Neg(R8[1]))))))];
	case 0x36: return [7, Mov(R32[(((b[i+2] & 0x38)>>>3))], Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1))];
	case 0x37: return [7, Mov(R32[(((b[i+2] & 0x38)>>>3))], Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 2))];
	}
if(((((b[i+0] & 0x80)>>>7)|((b[i+1] & 0x7f)<<1)) & 0x8d) == 0x9)
	switch((b[i+0]|(b[i+1]<<8)) & 0xb97f) {
	case 0x100: return [7, Mov(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 1), Add(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 1), (b[i+6])))];
	case 0x1: return [7, Mov(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 4), Add(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 4), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))];
	case 0x102: return [7, Mov(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 1), Add(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 1), (b[i+6])))];
	case 0x103: return [7, Mov(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 4), Add(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 4), (b[i+6])))];
	case 0x900: return [7, Mov(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 1), Or(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 1), (b[i+6])))];
	case 0x801: return [7, Mov(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 4), Or(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 4), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))];
	case 0x902: return [7, Mov(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 1), Or(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 1), (b[i+6])))];
	case 0x903: return [7, Mov(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 4), Or(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 4), (b[i+6])))];
	case 0x1100: return [7, Mov(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 1), Add(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 1), Add((b[i+6]), F[1])))];
	case 0x1001: return [7, Mov(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 4), Add(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 4), Add((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), F[1])))];
	case 0x1102: return [7, Mov(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 1), Add(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 1), Add((b[i+6]), F[1])))];
	case 0x1103: return [7, Mov(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 4), Add(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 4), Add((b[i+6]), F[1])))];
	case 0x1900: return [7, Mov(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 1), Add((b[i+6]), Neg(Add(Add(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 1), Neg(F[1])), 1))))];
	case 0x1801: return [7, Mov(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 4), Add((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), Neg(Add(Add(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 4), Neg(F[1])), 1))))];
	case 0x1902: return [7, Mov(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 1), Add((b[i+6]), Neg(Add(Add(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 1), Neg(F[1])), 1))))];
	case 0x1903: return [7, Mov(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 4), Add((b[i+6]), Neg(Add(Add(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 4), Neg(F[1])), 1))))];
	case 0x2100: return [7, Mov(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 1), And(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 1), (b[i+6])))];
	case 0x2001: return [7, Mov(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 4), And(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 4), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))];
	case 0x2102: return [7, Mov(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 1), And(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 1), (b[i+6])))];
	case 0x2103: return [7, Mov(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 4), And(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 4), (b[i+6])))];
	case 0x2900: return [7, Mov(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 1), Add(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 1), -(b[i+6])))];
	case 0x2801: return [7, Mov(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 4), Add(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 4), -(b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))];
	case 0x2902: return [7, Mov(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 1), Add(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 1), -(b[i+6])))];
	case 0x2903: return [7, Mov(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 4), Add(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 4), -(b[i+6])))];
	case 0x3100: return [7, Mov(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 1), Xor(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 1), (b[i+6])))];
	case 0x3001: return [7, Mov(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 4), Xor(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 4), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))];
	case 0x3102: return [7, Mov(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 1), Xor(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 1), (b[i+6])))];
	case 0x3103: return [7, Mov(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 4), Xor(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 4), (b[i+6])))];
	case 0x3900: return [7, Mov(F[2], Eq(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 1), (b[i+6]))),Mov(F[1], Lt(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 1), (b[i+6])))];
	case 0x3801: return [7, Mov(F[2], Eq(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 4), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))),Mov(F[1], Lt(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 4), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))];
	case 0x3902: return [7, Mov(F[2], Eq(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 1), (b[i+6]))),Mov(F[1], Lt(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 1), (b[i+6])))];
	case 0x3903: return [7, Mov(F[2], Eq(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 4), (b[i+6]))),Mov(F[1], Lt(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 4), (b[i+6])))];
	case 0x800f: return [7, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Mem(R32[4], 4)),Mov(R32[4], Add(R32[4], 4))];
	case 0x146: return [7, Mov(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 1), (b[i+6]))];
	case 0x47: return [7, Mov(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 4), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))];
	case 0x140: return [7, Mov(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 1), ROL(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 1), (b[i+6])))];
	case 0x141: return [7, Mov(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 4), ROL(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 4), (b[i+6])))];
	case 0x8050: return [7, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), ROL(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), 1))];
	case 0x8051: return [7, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), ROL(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), 1))];
	case 0x8052: return [7, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), ROL(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), R8[1]))];
	case 0x8053: return [7, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), ROL(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), R8[1]))];
	case 0x940: return [7, Mov(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 1), ROR(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 1), (b[i+6])))];
	case 0x941: return [7, Mov(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 4), ROR(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 4), (b[i+6])))];
	case 0x8850: return [7, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), ROR(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), 1))];
	case 0x8851: return [7, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), ROR(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), 1))];
	case 0x8852: return [7, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), ROR(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), R8[1]))];
	case 0x8853: return [7, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), ROR(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), R8[1]))];
	case 0x2140: return [7, Mov(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 1), LSL(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 1), (b[i+6])))];
	case 0x2141: return [7, Mov(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 4), LSL(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 4), (b[i+6])))];
	case 0xa050: return [7, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), LSL(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), 1))];
	case 0xa051: return [7, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), LSL(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), 1))];
	case 0xa052: return [7, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), LSL(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), R8[1]))];
	case 0xa053: return [7, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), LSL(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), R8[1]))];
	case 0x2940: return [7, Mov(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 1), LSR(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 1), (b[i+6])))];
	case 0x2941: return [7, Mov(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 4), LSR(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 4), (b[i+6])))];
	case 0xa850: return [7, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), LSR(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), 1))];
	case 0xa851: return [7, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), LSR(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), 1))];
	case 0xa852: return [7, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), LSR(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), R8[1]))];
	case 0xa853: return [7, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), LSR(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), R8[1]))];
	case 0x3940: return [7, Mov(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 1), ASR(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 1), (b[i+6])))];
	case 0x3941: return [7, Mov(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 4), ASR(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 4), (b[i+6])))];
	case 0xb850: return [7, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), ASR(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), 1))];
	case 0xb851: return [7, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), ASR(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), 1))];
	case 0xb852: return [7, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), ASR(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), R8[1]))];
	case 0xb853: return [7, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), ASR(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), R8[1]))];
	case 0x176: return [7, Mov(F[2], Eq(And(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 1), (b[i+6])), 0))];
	case 0x77: return [7, Mov(F[2], Eq(And(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 4), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 0))];
	case 0x9076: return [7, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Not(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1)))];
	case 0x9077: return [7, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Not(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4)))];
	case 0x9876: return [7, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Neg(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1)))];
	case 0x9877: return [7, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Neg(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4)))];
	case 0xa076: return [7, Mov(R16[0], Mul(R8[0], Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1)))];
	case 0xa077: return [7, Mov(R32[0], Mul(R32[0], Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4)))];
	case 0xa876: return [7, Mov(R16[0], Mul(R8[0], Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1)))];
	case 0xa877: return [7, Mov(R32[0], Mul(R32[0], Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4)))];
	case 0x807e: return [7, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Add(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), 1))];
	case 0x807f: return [7, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Add(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), 1))];
	case 0x887e: return [7, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Add(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), -1))];
	case 0x887f: return [7, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Add(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), -1))];
	case 0x907f: return [7, Mov(R32[4], Add(R32[4], -4)),Mov(Mem(R32[4], 4), Add(R32[8], 7)),Mov(R32[8], Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4))];
	case 0xa07f: return [7, Mov(R32[8], Add(R32[8], 7))];
	case 0xb07f: return [7, Mov(R32[4], Add(R32[4], -4)),Mov(Mem(R32[4], 4), Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4))];
	}
if(((((b[i+0] & 0x80)>>>7)|(b[i+1]<<1)|((b[i+2] & 0x3f)<<9)) & 0x708f) == 0x4009)
	switch((b[i+0]|(b[i+1]<<8)) & 0xb87f) {
	case 0x1: return [7, Mov(Mem(R32[((b[i+2] & 0x7))], 4), Add(Mem(R32[((b[i+2] & 0x7))], 4), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))];
	case 0x801: return [7, Mov(Mem(R32[((b[i+2] & 0x7))], 4), Or(Mem(R32[((b[i+2] & 0x7))], 4), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))];
	case 0x1001: return [7, Mov(Mem(R32[((b[i+2] & 0x7))], 4), Add(Mem(R32[((b[i+2] & 0x7))], 4), Add((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), F[1])))];
	case 0x1801: return [7, Mov(Mem(R32[((b[i+2] & 0x7))], 4), Add((b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)), Neg(Add(Add(Mem(R32[((b[i+2] & 0x7))], 4), Neg(F[1])), 1))))];
	case 0x2001: return [7, Mov(Mem(R32[((b[i+2] & 0x7))], 4), And(Mem(R32[((b[i+2] & 0x7))], 4), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))];
	case 0x2801: return [7, Mov(Mem(R32[((b[i+2] & 0x7))], 4), Add(Mem(R32[((b[i+2] & 0x7))], 4), -(b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))];
	case 0x3001: return [7, Mov(Mem(R32[((b[i+2] & 0x7))], 4), Xor(Mem(R32[((b[i+2] & 0x7))], 4), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))];
	case 0x3801: return [7, Mov(F[2], Eq(Mem(R32[((b[i+2] & 0x7))], 4), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))),Mov(F[1], Lt(Mem(R32[((b[i+2] & 0x7))], 4), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))];
	case 0x800f: return [7, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Mem(R32[4], 4)),Mov(R32[4], Add(R32[4], 4))];
	case 0x47: return [7, Mov(Mem(R32[((b[i+2] & 0x7))], 4), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24)))];
	case 0x8050: return [7, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), ROL(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), 1))];
	case 0x8051: return [7, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), ROL(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), 1))];
	case 0x8052: return [7, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), ROL(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), R8[1]))];
	case 0x8053: return [7, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), ROL(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), R8[1]))];
	case 0x8850: return [7, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), ROR(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), 1))];
	case 0x8851: return [7, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), ROR(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), 1))];
	case 0x8852: return [7, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), ROR(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), R8[1]))];
	case 0x8853: return [7, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), ROR(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), R8[1]))];
	case 0xa050: return [7, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), LSL(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), 1))];
	case 0xa051: return [7, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), LSL(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), 1))];
	case 0xa052: return [7, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), LSL(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), R8[1]))];
	case 0xa053: return [7, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), LSL(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), R8[1]))];
	case 0xa850: return [7, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), LSR(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), 1))];
	case 0xa851: return [7, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), LSR(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), 1))];
	case 0xa852: return [7, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), LSR(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), R8[1]))];
	case 0xa853: return [7, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), LSR(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), R8[1]))];
	case 0xb850: return [7, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), ASR(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), 1))];
	case 0xb851: return [7, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), ASR(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), 1))];
	case 0xb852: return [7, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), ASR(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), R8[1]))];
	case 0xb853: return [7, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), ASR(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), R8[1]))];
	case 0x77: return [7, Mov(F[2], Eq(And(Mem(R32[((b[i+2] & 0x7))], 4), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 0))];
	case 0x9076: return [7, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Not(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1)))];
	case 0x9077: return [7, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Not(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4)))];
	case 0x9876: return [7, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Neg(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1)))];
	case 0x9877: return [7, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Neg(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4)))];
	case 0xa076: return [7, Mov(R16[0], Mul(R8[0], Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1)))];
	case 0xa077: return [7, Mov(R32[0], Mul(R32[0], Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4)))];
	case 0xa876: return [7, Mov(R16[0], Mul(R8[0], Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1)))];
	case 0xa877: return [7, Mov(R32[0], Mul(R32[0], Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4)))];
	case 0x807e: return [7, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Add(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), 1))];
	case 0x807f: return [7, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Add(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), 1))];
	case 0x887e: return [7, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Add(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), -1))];
	case 0x887f: return [7, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Add(Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), -1))];
	case 0x907f: return [7, Mov(R32[4], Add(R32[4], -4)),Mov(Mem(R32[4], 4), Add(R32[8], 7)),Mov(R32[8], Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4))];
	case 0xa07f: return [7, Mov(R32[8], Add(R32[8], 7))];
	case 0xb07f: return [7, Mov(R32[4], Add(R32[4], -4)),Mov(Mem(R32[4], 4), Mem(Add(R32[((b[i+2] & 0x7))], (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4))];
	}
if(((((b[i+0] & 0xc0)>>>6)|(b[i+1]<<2)) & 0x31d) == 0x210)
	switch((b[i+0]) & 0xbf) {
	case 0x0: return [7, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Add(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), R8[(((b[i+1] & 0x38)>>>3))]))];
	case 0x1: return [7, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Add(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), R32[(((b[i+1] & 0x38)>>>3))]))];
	case 0x2: return [7, Mov(R8[(((b[i+1] & 0x38)>>>3))], Add(R8[(((b[i+1] & 0x38)>>>3))], Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1)))];
	case 0x3: return [7, Mov(R32[(((b[i+1] & 0x38)>>>3))], Add(R32[(((b[i+1] & 0x38)>>>3))], Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4)))];
	case 0x8: return [7, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Or(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), R8[(((b[i+1] & 0x38)>>>3))]))];
	case 0x9: return [7, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Or(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), R32[(((b[i+1] & 0x38)>>>3))]))];
	case 0xa: return [7, Mov(R8[(((b[i+1] & 0x38)>>>3))], Or(R8[(((b[i+1] & 0x38)>>>3))], Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1)))];
	case 0xb: return [7, Mov(R32[(((b[i+1] & 0x38)>>>3))], Or(R32[(((b[i+1] & 0x38)>>>3))], Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4)))];
	case 0x10: return [7, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Add(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Add(R8[(((b[i+1] & 0x38)>>>3))], F[1])))];
	case 0x11: return [7, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Add(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Add(R32[(((b[i+1] & 0x38)>>>3))], F[1])))];
	case 0x12: return [7, Mov(R8[(((b[i+1] & 0x38)>>>3))], Add(R8[(((b[i+1] & 0x38)>>>3))], Add(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), F[1])))];
	case 0x13: return [7, Mov(R32[(((b[i+1] & 0x38)>>>3))], Add(R32[(((b[i+1] & 0x38)>>>3))], Add(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), F[1])))];
	case 0x18: return [7, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Add(R8[(((b[i+1] & 0x38)>>>3))], Neg(Add(Add(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Neg(F[1])), 1))))];
	case 0x19: return [7, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Add(R32[(((b[i+1] & 0x38)>>>3))], Neg(Add(Add(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Neg(F[1])), 1))))];
	case 0x1a: return [7, Mov(R8[(((b[i+1] & 0x38)>>>3))], Add(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Neg(Add(Add(R8[(((b[i+1] & 0x38)>>>3))], Neg(F[1])), 1))))];
	case 0x1b: return [7, Mov(R32[(((b[i+1] & 0x38)>>>3))], Add(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Neg(Add(Add(R32[(((b[i+1] & 0x38)>>>3))], Neg(F[1])), 1))))];
	case 0x20: return [7, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), And(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), R8[(((b[i+1] & 0x38)>>>3))]))];
	case 0x21: return [7, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), And(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), R32[(((b[i+1] & 0x38)>>>3))]))];
	case 0x22: return [7, Mov(R8[(((b[i+1] & 0x38)>>>3))], And(R8[(((b[i+1] & 0x38)>>>3))], Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1)))];
	case 0x23: return [7, Mov(R32[(((b[i+1] & 0x38)>>>3))], And(R32[(((b[i+1] & 0x38)>>>3))], Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4)))];
	case 0x28: return [7, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Add(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Neg(R8[(((b[i+1] & 0x38)>>>3))])))];
	case 0x29: return [7, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Add(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Neg(R32[(((b[i+1] & 0x38)>>>3))])))];
	case 0x2a: return [7, Mov(R8[(((b[i+1] & 0x38)>>>3))], Add(R8[(((b[i+1] & 0x38)>>>3))], Neg(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1))))];
	case 0x2b: return [7, Mov(R32[(((b[i+1] & 0x38)>>>3))], Add(R32[(((b[i+1] & 0x38)>>>3))], Neg(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4))))];
	case 0x30: return [7, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), Xor(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), R8[(((b[i+1] & 0x38)>>>3))]))];
	case 0x31: return [7, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), Xor(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), R32[(((b[i+1] & 0x38)>>>3))]))];
	case 0x32: return [7, Mov(R8[(((b[i+1] & 0x38)>>>3))], Xor(R8[(((b[i+1] & 0x38)>>>3))], Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1)))];
	case 0x33: return [7, Mov(R32[(((b[i+1] & 0x38)>>>3))], Xor(R32[(((b[i+1] & 0x38)>>>3))], Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4)))];
	case 0x38: return [7, Mov(F[2], Eq(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), R8[(((b[i+1] & 0x38)>>>3))])),Mov(F[1], Lt(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), R8[(((b[i+1] & 0x38)>>>3))]))];
	case 0x39: return [7, Mov(F[2], Eq(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), R32[(((b[i+1] & 0x38)>>>3))])),Mov(F[1], Lt(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), R32[(((b[i+1] & 0x38)>>>3))]))];
	case 0x3a: return [7, Mov(F[2], Eq(R8[(((b[i+1] & 0x38)>>>3))], Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1))),Mov(F[1], Lt(R8[(((b[i+1] & 0x38)>>>3))], Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1)))];
	case 0x3b: return [7, Mov(F[2], Eq(R32[(((b[i+1] & 0x38)>>>3))], Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4))),Mov(F[1], Lt(R32[(((b[i+1] & 0x38)>>>3))], Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4)))];
	case 0x84: return [7, Mov(F[2], Eq(And(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), R8[(((b[i+1] & 0x38)>>>3))]), 0))];
	case 0x85: return [7, Mov(F[2], Eq(And(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), R32[(((b[i+1] & 0x38)>>>3))]), 0))];
	case 0x86: return [7, Swap(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), R8[(((b[i+1] & 0x38)>>>3))])];
	case 0x87: return [7, Swap(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), R32[(((b[i+1] & 0x38)>>>3))])];
	case 0x88: return [7, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1), R8[(((b[i+1] & 0x38)>>>3))])];
	case 0x89: return [7, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), R32[(((b[i+1] & 0x38)>>>3))])];
	case 0x8a: return [7, Mov(R8[(((b[i+1] & 0x38)>>>3))], Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 1))];
	case 0x8b: return [7, Mov(R32[(((b[i+1] & 0x38)>>>3))], Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4))];
	case 0x8c: return [7, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 4), RS[(((b[i+1] & 0x38)>>>3))])];
	case 0x8d: return [7, Mov(R32[(((b[i+1] & 0x38)>>>3))], Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))))];
	case 0x8e: return [7, Mov(RS[(((b[i+1] & 0x38)>>>3))], Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (b[i+3]|(b[i+4]<<8)|(b[i+5]<<16)|(b[i+6]<<24))), 2))];
	}
if(((((b[i+0] & 0xc0)>>>6)|(b[i+1]<<2)) & 0x31d) == 0x14)
	switch((b[i+0]) & 0xbf) {
	case 0x0: return [6, Mov(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 1), Add(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 1), R8[(((b[i+1] & 0x38)>>>3))]))];
	case 0x1: return [6, Mov(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 4), Add(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 4), R32[(((b[i+1] & 0x38)>>>3))]))];
	case 0x2: return [6, Mov(R8[(((b[i+1] & 0x38)>>>3))], Add(R8[(((b[i+1] & 0x38)>>>3))], Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 1)))];
	case 0x3: return [6, Mov(R32[(((b[i+1] & 0x38)>>>3))], Add(R32[(((b[i+1] & 0x38)>>>3))], Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 4)))];
	case 0x8: return [6, Mov(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 1), Or(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 1), R8[(((b[i+1] & 0x38)>>>3))]))];
	case 0x9: return [6, Mov(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 4), Or(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 4), R32[(((b[i+1] & 0x38)>>>3))]))];
	case 0xa: return [6, Mov(R8[(((b[i+1] & 0x38)>>>3))], Or(R8[(((b[i+1] & 0x38)>>>3))], Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 1)))];
	case 0xb: return [6, Mov(R32[(((b[i+1] & 0x38)>>>3))], Or(R32[(((b[i+1] & 0x38)>>>3))], Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 4)))];
	case 0x10: return [6, Mov(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 1), Add(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 1), Add(R8[(((b[i+1] & 0x38)>>>3))], F[1])))];
	case 0x11: return [6, Mov(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 4), Add(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 4), Add(R32[(((b[i+1] & 0x38)>>>3))], F[1])))];
	case 0x12: return [6, Mov(R8[(((b[i+1] & 0x38)>>>3))], Add(R8[(((b[i+1] & 0x38)>>>3))], Add(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 1), F[1])))];
	case 0x13: return [6, Mov(R32[(((b[i+1] & 0x38)>>>3))], Add(R32[(((b[i+1] & 0x38)>>>3))], Add(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 4), F[1])))];
	case 0x18: return [6, Mov(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 1), Add(R8[(((b[i+1] & 0x38)>>>3))], Neg(Add(Add(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 1), Neg(F[1])), 1))))];
	case 0x19: return [6, Mov(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 4), Add(R32[(((b[i+1] & 0x38)>>>3))], Neg(Add(Add(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 4), Neg(F[1])), 1))))];
	case 0x1a: return [6, Mov(R8[(((b[i+1] & 0x38)>>>3))], Add(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 1), Neg(Add(Add(R8[(((b[i+1] & 0x38)>>>3))], Neg(F[1])), 1))))];
	case 0x1b: return [6, Mov(R32[(((b[i+1] & 0x38)>>>3))], Add(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 4), Neg(Add(Add(R32[(((b[i+1] & 0x38)>>>3))], Neg(F[1])), 1))))];
	case 0x20: return [6, Mov(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 1), And(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 1), R8[(((b[i+1] & 0x38)>>>3))]))];
	case 0x21: return [6, Mov(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 4), And(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 4), R32[(((b[i+1] & 0x38)>>>3))]))];
	case 0x22: return [6, Mov(R8[(((b[i+1] & 0x38)>>>3))], And(R8[(((b[i+1] & 0x38)>>>3))], Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 1)))];
	case 0x23: return [6, Mov(R32[(((b[i+1] & 0x38)>>>3))], And(R32[(((b[i+1] & 0x38)>>>3))], Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 4)))];
	case 0x28: return [6, Mov(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 1), Add(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 1), Neg(R8[(((b[i+1] & 0x38)>>>3))])))];
	case 0x29: return [6, Mov(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 4), Add(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 4), Neg(R32[(((b[i+1] & 0x38)>>>3))])))];
	case 0x2a: return [6, Mov(R8[(((b[i+1] & 0x38)>>>3))], Add(R8[(((b[i+1] & 0x38)>>>3))], Neg(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 1))))];
	case 0x2b: return [6, Mov(R32[(((b[i+1] & 0x38)>>>3))], Add(R32[(((b[i+1] & 0x38)>>>3))], Neg(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 4))))];
	case 0x30: return [6, Mov(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 1), Xor(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 1), R8[(((b[i+1] & 0x38)>>>3))]))];
	case 0x31: return [6, Mov(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 4), Xor(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 4), R32[(((b[i+1] & 0x38)>>>3))]))];
	case 0x32: return [6, Mov(R8[(((b[i+1] & 0x38)>>>3))], Xor(R8[(((b[i+1] & 0x38)>>>3))], Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 1)))];
	case 0x33: return [6, Mov(R32[(((b[i+1] & 0x38)>>>3))], Xor(R32[(((b[i+1] & 0x38)>>>3))], Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 4)))];
	case 0x38: return [6, Mov(F[2], Eq(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 1), R8[(((b[i+1] & 0x38)>>>3))])),Mov(F[1], Lt(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 1), R8[(((b[i+1] & 0x38)>>>3))]))];
	case 0x39: return [6, Mov(F[2], Eq(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 4), R32[(((b[i+1] & 0x38)>>>3))])),Mov(F[1], Lt(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 4), R32[(((b[i+1] & 0x38)>>>3))]))];
	case 0x3a: return [6, Mov(F[2], Eq(R8[(((b[i+1] & 0x38)>>>3))], Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 1))),Mov(F[1], Lt(R8[(((b[i+1] & 0x38)>>>3))], Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 1)))];
	case 0x3b: return [6, Mov(F[2], Eq(R32[(((b[i+1] & 0x38)>>>3))], Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 4))),Mov(F[1], Lt(R32[(((b[i+1] & 0x38)>>>3))], Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 4)))];
	case 0x84: return [6, Mov(F[2], Eq(And(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 1), R8[(((b[i+1] & 0x38)>>>3))]), 0))];
	case 0x85: return [6, Mov(F[2], Eq(And(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 4), R32[(((b[i+1] & 0x38)>>>3))]), 0))];
	case 0x86: return [6, Swap(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 1), R8[(((b[i+1] & 0x38)>>>3))])];
	case 0x87: return [6, Swap(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 4), R32[(((b[i+1] & 0x38)>>>3))])];
	case 0x88: return [6, Mov(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 1), R8[(((b[i+1] & 0x38)>>>3))])];
	case 0x89: return [6, Mov(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 4), R32[(((b[i+1] & 0x38)>>>3))])];
	case 0x8a: return [6, Mov(R8[(((b[i+1] & 0x38)>>>3))], Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 1))];
	case 0x8b: return [6, Mov(R32[(((b[i+1] & 0x38)>>>3))], Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 4))];
	case 0x8c: return [6, Mov(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 4), RS[(((b[i+1] & 0x38)>>>3))])];
	case 0x8d: return [6, Mov(R32[(((b[i+1] & 0x38)>>>3))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)))];
	case 0x8e: return [6, Mov(RS[(((b[i+1] & 0x38)>>>3))], Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 2))];
	}
if(((b[i+0]|(b[i+1]<<8)|(b[i+2]<<16)|((b[i+3] & 0x3f)<<24)) & 0x3fc7ffff) == 0x2544ac0f)
	switch(0) {
	case 0x0: return [6, Mov(Mem(Add(R32[5], (((b[i+4]) << 24) >> 24)), 4), Or(LSR(Mem(Add(R32[5], (((b[i+4]) << 24) >> 24)), 4), (b[i+5])), And(R32[(((b[i+2] & 0x38)>>>3))], (((1 << (b[i+5])) + -1) << (32 + -(b[i+5]))))))];
	}
if(((b[i+0]|(b[i+1]<<8)|(b[i+2]<<16)|((b[i+3] & 0x3f)<<24)) & 0x38c7ffff) == 0x2044ac0f)
	switch(0) {
	case 0x0: return [6, Mov(Mem(Add(R32[((b[i+3] & 0x7))], (((b[i+4]) << 24) >> 24)), 4), Or(LSR(Mem(Add(R32[((b[i+3] & 0x7))], (((b[i+4]) << 24) >> 24)), 4), (b[i+5])), And(R32[(((b[i+2] & 0x38)>>>3))], (((1 << (b[i+5])) + -1) << (32 + -(b[i+5]))))))];
	}
if(((b[i+0]|(b[i+1]<<8)|(b[i+2]<<16)|((b[i+3] & 0x7)<<24)) & 0x7c7ffff) == 0x544ac0f)
	switch(0) {
	case 0x0: return [6, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6))), (((b[i+4]) << 24) >> 24))), 4), Or(LSR(Mem(Add(R32[5], Add(LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6))), (((b[i+4]) << 24) >> 24))), 4), (b[i+5])), And(R32[(((b[i+2] & 0x38)>>>3))], (((1 << (b[i+5])) + -1) << (32 + -(b[i+5]))))))];
	}
if(((b[i+0]|(b[i+1]<<8)|(b[i+2]<<16)) & 0xc7ffff) == 0x44ac0f)
	switch(0) {
	case 0x0: return [6, Mov(Mem(Add(Add(R32[((b[i+3] & 0x7))], LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (((b[i+4]) << 24) >> 24)), 4), Or(LSR(Mem(Add(Add(R32[((b[i+3] & 0x7))], LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (((b[i+4]) << 24) >> 24)), 4), (b[i+5])), And(R32[(((b[i+2] & 0x38)>>>3))], (((1 << (b[i+5])) + -1) << (32 + -(b[i+5]))))))];
	}
if(((((b[i+1] & 0x40)>>>6)) & 0x1) == 0x0)
	switch((b[i+0]|(b[i+1]<<8)) & 0xbfff) {
	case 0x58f: return [6, Mov(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 4), Mem(R32[4], 4)),Mov(R32[4], Add(R32[4], 4))];
	case 0x5d0: return [6, Mov(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 1), ROL(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 1), 1))];
	case 0x5d1: return [6, Mov(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 4), ROL(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 4), 1))];
	case 0x5d2: return [6, Mov(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 1), ROL(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 1), R8[1]))];
	case 0x5d3: return [6, Mov(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 4), ROL(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 4), R8[1]))];
	case 0xdd0: return [6, Mov(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 1), ROR(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 1), 1))];
	case 0xdd1: return [6, Mov(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 4), ROR(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 4), 1))];
	case 0xdd2: return [6, Mov(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 1), ROR(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 1), R8[1]))];
	case 0xdd3: return [6, Mov(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 4), ROR(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 4), R8[1]))];
	case 0x25d0: return [6, Mov(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 1), LSL(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 1), 1))];
	case 0x25d1: return [6, Mov(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 4), LSL(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 4), 1))];
	case 0x25d2: return [6, Mov(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 1), LSL(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 1), R8[1]))];
	case 0x25d3: return [6, Mov(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 4), LSL(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 4), R8[1]))];
	case 0x2dd0: return [6, Mov(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 1), LSR(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 1), 1))];
	case 0x2dd1: return [6, Mov(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 4), LSR(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 4), 1))];
	case 0x2dd2: return [6, Mov(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 1), LSR(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 1), R8[1]))];
	case 0x2dd3: return [6, Mov(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 4), LSR(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 4), R8[1]))];
	case 0x3dd0: return [6, Mov(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 1), ASR(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 1), 1))];
	case 0x3dd1: return [6, Mov(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 4), ASR(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 4), 1))];
	case 0x3dd2: return [6, Mov(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 1), ASR(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 1), R8[1]))];
	case 0x3dd3: return [6, Mov(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 4), ASR(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 4), R8[1]))];
	case 0x15f6: return [6, Mov(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 1), Not(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 1)))];
	case 0x15f7: return [6, Mov(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 4), Not(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 4)))];
	case 0x1df6: return [6, Mov(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 1), Neg(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 1)))];
	case 0x1df7: return [6, Mov(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 4), Neg(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 4)))];
	case 0x25f6: return [6, Mov(R16[0], Mul(R8[0], Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 1)))];
	case 0x25f7: return [6, Mov(R32[0], Mul(R32[0], Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 4)))];
	case 0x2df6: return [6, Mov(R16[0], Mul(R8[0], Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 1)))];
	case 0x2df7: return [6, Mov(R32[0], Mul(R32[0], Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 4)))];
	case 0x5fe: return [6, Mov(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 1), Add(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 1), 1))];
	case 0x5ff: return [6, Mov(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 4), Add(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 4), 1))];
	case 0xdfe: return [6, Mov(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 1), Add(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 1), -1))];
	case 0xdff: return [6, Mov(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 4), Add(Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 4), -1))];
	case 0x15ff: return [6, Mov(R32[4], Add(R32[4], -4)),Mov(Mem(R32[4], 4), Add(R32[8], 6)),Mov(R32[8], Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 4))];
	case 0x25ff: return [6, Mov(R32[8], Add(R32[8], 6))];
	case 0x35ff: return [6, Mov(R32[4], Add(R32[4], -4)),Mov(Mem(R32[4], 4), Mem((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), 4))];
	case 0x800f: return [6, If(F[0], Mov(R32[8], Add(R32[8], ((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)) + 6))))];
	case 0x810f: return [6, If(Not(F[0]), Mov(R32[8], Add(R32[8], ((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)) + 6))))];
	case 0x820f: return [6, If(F[1], Mov(R32[8], Add(R32[8], ((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)) + 6))))];
	case 0x830f: return [6, If(Not(F[1]), Mov(R32[8], Add(R32[8], ((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)) + 6))))];
	case 0x840f: return [6, If(F[2], Mov(R32[8], Add(R32[8], ((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)) + 6))))];
	case 0x850f: return [6, If(Not(F[2]), Mov(R32[8], Add(R32[8], ((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)) + 6))))];
	case 0x860f: return [6, If(Or(F[1], F[2]), Mov(R32[8], Add(R32[8], ((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)) + 6))))];
	case 0x870f: return [6, If(And(Not(F[1]), Not(F[2])), Mov(R32[8], Add(R32[8], ((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)) + 6))))];
	case 0x880f: return [6, If(F[3], Mov(R32[8], Add(R32[8], ((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)) + 6))))];
	case 0x890f: return [6, If(Not(F[3]), Mov(R32[8], Add(R32[8], ((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)) + 6))))];
	case 0x8a0f: return [6, If(F[4], Mov(R32[8], Add(R32[8], ((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)) + 6))))];
	case 0x8b0f: return [6, If(Not(F[4]), Mov(R32[8], Add(R32[8], ((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)) + 6))))];
	case 0x8c0f: return [6, If(Not(Eq(F[0], F[3])), Mov(R32[8], Add(R32[8], ((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)) + 6))))];
	case 0x8d0f: return [6, If(Eq(F[0], F[3]), Mov(R32[8], Add(R32[8], ((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)) + 6))))];
	case 0x8e0f: return [6, If(Or(F[2], Not(Eq(F[0], F[3]))), Mov(R32[8], Add(R32[8], ((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)) + 6))))];
	case 0x8f0f: return [6, If(And(Not(F[2]), Eq(F[0], F[3])), Mov(R32[8], Add(R32[8], ((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)) + 6))))];
	}
if(((((b[i+0] & 0x80)>>>7)) & 0x1) == 0x1)
	switch((b[i+0]|(b[i+1]<<8)) & 0xf87f) {
	case 0x1: return [6, Mov(Mem(R32[((b[i+1] & 0x7))], 4), Add(Mem(R32[((b[i+1] & 0x7))], 4), (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))];
	case 0xc001: return [6, Mov(R32[((b[i+1] & 0x7))], Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))];
	case 0x801: return [6, Mov(Mem(R32[((b[i+1] & 0x7))], 4), Or(Mem(R32[((b[i+1] & 0x7))], 4), (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))];
	case 0xc801: return [6, Mov(R32[((b[i+1] & 0x7))], Or(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))];
	case 0x1001: return [6, Mov(Mem(R32[((b[i+1] & 0x7))], 4), Add(Mem(R32[((b[i+1] & 0x7))], 4), Add((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), F[1])))];
	case 0xd001: return [6, Mov(R32[((b[i+1] & 0x7))], Add(R32[((b[i+1] & 0x7))], Add((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), F[1])))];
	case 0x1801: return [6, Mov(Mem(R32[((b[i+1] & 0x7))], 4), Add((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), Neg(Add(Add(Mem(R32[((b[i+1] & 0x7))], 4), Neg(F[1])), 1))))];
	case 0xd801: return [6, Mov(R32[((b[i+1] & 0x7))], Add((b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)), Neg(Add(Add(R32[((b[i+1] & 0x7))], Neg(F[1])), 1))))];
	case 0x2001: return [6, Mov(Mem(R32[((b[i+1] & 0x7))], 4), And(Mem(R32[((b[i+1] & 0x7))], 4), (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))];
	case 0xe001: return [6, Mov(R32[((b[i+1] & 0x7))], And(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))];
	case 0x2801: return [6, Mov(Mem(R32[((b[i+1] & 0x7))], 4), Add(Mem(R32[((b[i+1] & 0x7))], 4), -(b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))];
	case 0xe801: return [6, Mov(R32[((b[i+1] & 0x7))], Add(R32[((b[i+1] & 0x7))], -(b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))];
	case 0x3001: return [6, Mov(Mem(R32[((b[i+1] & 0x7))], 4), Xor(Mem(R32[((b[i+1] & 0x7))], 4), (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))];
	case 0xf001: return [6, Mov(R32[((b[i+1] & 0x7))], Xor(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))];
	case 0x3801: return [6, Mov(F[2], Eq(Mem(R32[((b[i+1] & 0x7))], 4), (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)))),Mov(F[1], Lt(Mem(R32[((b[i+1] & 0x7))], 4), (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))];
	case 0xf801: return [6, Mov(F[2], Eq(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)))),Mov(F[1], Lt(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))];
	case 0x800f: return [6, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 4), Mem(R32[4], 4)),Mov(R32[4], Add(R32[4], 4))];
	case 0x47: return [6, Mov(Mem(R32[((b[i+1] & 0x7))], 4), (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)))];
	case 0xc047: return [6, Mov(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24)))];
	case 0x8050: return [6, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 1), ROL(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 1), 1))];
	case 0x8051: return [6, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 4), ROL(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 4), 1))];
	case 0x8052: return [6, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 1), ROL(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 1), R8[1]))];
	case 0x8053: return [6, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 4), ROL(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 4), R8[1]))];
	case 0x8850: return [6, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 1), ROR(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 1), 1))];
	case 0x8851: return [6, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 4), ROR(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 4), 1))];
	case 0x8852: return [6, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 1), ROR(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 1), R8[1]))];
	case 0x8853: return [6, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 4), ROR(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 4), R8[1]))];
	case 0xa050: return [6, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 1), LSL(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 1), 1))];
	case 0xa051: return [6, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 4), LSL(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 4), 1))];
	case 0xa052: return [6, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 1), LSL(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 1), R8[1]))];
	case 0xa053: return [6, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 4), LSL(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 4), R8[1]))];
	case 0xa850: return [6, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 1), LSR(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 1), 1))];
	case 0xa851: return [6, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 4), LSR(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 4), 1))];
	case 0xa852: return [6, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 1), LSR(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 1), R8[1]))];
	case 0xa853: return [6, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 4), LSR(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 4), R8[1]))];
	case 0xb850: return [6, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 1), ASR(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 1), 1))];
	case 0xb851: return [6, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 4), ASR(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 4), 1))];
	case 0xb852: return [6, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 1), ASR(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 1), R8[1]))];
	case 0xb853: return [6, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 4), ASR(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 4), R8[1]))];
	case 0x77: return [6, Mov(F[2], Eq(And(Mem(R32[((b[i+1] & 0x7))], 4), (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 0))];
	case 0xc077: return [6, Mov(F[2], Eq(And(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 0))];
	case 0x9076: return [6, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 1), Not(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 1)))];
	case 0x9077: return [6, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 4), Not(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 4)))];
	case 0x9876: return [6, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 1), Neg(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 1)))];
	case 0x9877: return [6, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 4), Neg(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 4)))];
	case 0xa076: return [6, Mov(R16[0], Mul(R8[0], Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 1)))];
	case 0xa077: return [6, Mov(R32[0], Mul(R32[0], Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 4)))];
	case 0xa876: return [6, Mov(R16[0], Mul(R8[0], Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 1)))];
	case 0xa877: return [6, Mov(R32[0], Mul(R32[0], Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 4)))];
	case 0x807e: return [6, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 1), Add(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 1), 1))];
	case 0x807f: return [6, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 4), Add(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 4), 1))];
	case 0x887e: return [6, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 1), Add(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 1), -1))];
	case 0x887f: return [6, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 4), Add(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 4), -1))];
	case 0x907f: return [6, Mov(R32[4], Add(R32[4], -4)),Mov(Mem(R32[4], 4), Add(R32[8], 6)),Mov(R32[8], Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 4))];
	case 0xa07f: return [6, Mov(R32[8], Add(R32[8], 6))];
	case 0xb07f: return [6, Mov(R32[4], Add(R32[4], -4)),Mov(Mem(R32[4], 4), Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 4))];
	}
if(((((b[i+0] & 0xc0)>>>6)|(b[i+1]<<2)) & 0x301) == 0x200)
	switch((b[i+0]) & 0xbf) {
	case 0x0: return [6, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 1), Add(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 1), R8[(((b[i+1] & 0x38)>>>3))]))];
	case 0x1: return [6, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 4), Add(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 4), R32[(((b[i+1] & 0x38)>>>3))]))];
	case 0x2: return [6, Mov(R8[(((b[i+1] & 0x38)>>>3))], Add(R8[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 1)))];
	case 0x3: return [6, Mov(R32[(((b[i+1] & 0x38)>>>3))], Add(R32[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 4)))];
	case 0x8: return [6, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 1), Or(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 1), R8[(((b[i+1] & 0x38)>>>3))]))];
	case 0x9: return [6, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 4), Or(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 4), R32[(((b[i+1] & 0x38)>>>3))]))];
	case 0xa: return [6, Mov(R8[(((b[i+1] & 0x38)>>>3))], Or(R8[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 1)))];
	case 0xb: return [6, Mov(R32[(((b[i+1] & 0x38)>>>3))], Or(R32[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 4)))];
	case 0x10: return [6, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 1), Add(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 1), Add(R8[(((b[i+1] & 0x38)>>>3))], F[1])))];
	case 0x11: return [6, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 4), Add(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 4), Add(R32[(((b[i+1] & 0x38)>>>3))], F[1])))];
	case 0x12: return [6, Mov(R8[(((b[i+1] & 0x38)>>>3))], Add(R8[(((b[i+1] & 0x38)>>>3))], Add(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 1), F[1])))];
	case 0x13: return [6, Mov(R32[(((b[i+1] & 0x38)>>>3))], Add(R32[(((b[i+1] & 0x38)>>>3))], Add(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 4), F[1])))];
	case 0x18: return [6, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 1), Add(R8[(((b[i+1] & 0x38)>>>3))], Neg(Add(Add(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 1), Neg(F[1])), 1))))];
	case 0x19: return [6, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 4), Add(R32[(((b[i+1] & 0x38)>>>3))], Neg(Add(Add(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 4), Neg(F[1])), 1))))];
	case 0x1a: return [6, Mov(R8[(((b[i+1] & 0x38)>>>3))], Add(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 1), Neg(Add(Add(R8[(((b[i+1] & 0x38)>>>3))], Neg(F[1])), 1))))];
	case 0x1b: return [6, Mov(R32[(((b[i+1] & 0x38)>>>3))], Add(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 4), Neg(Add(Add(R32[(((b[i+1] & 0x38)>>>3))], Neg(F[1])), 1))))];
	case 0x20: return [6, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 1), And(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 1), R8[(((b[i+1] & 0x38)>>>3))]))];
	case 0x21: return [6, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 4), And(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 4), R32[(((b[i+1] & 0x38)>>>3))]))];
	case 0x22: return [6, Mov(R8[(((b[i+1] & 0x38)>>>3))], And(R8[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 1)))];
	case 0x23: return [6, Mov(R32[(((b[i+1] & 0x38)>>>3))], And(R32[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 4)))];
	case 0x28: return [6, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 1), Add(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 1), Neg(R8[(((b[i+1] & 0x38)>>>3))])))];
	case 0x29: return [6, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 4), Add(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 4), Neg(R32[(((b[i+1] & 0x38)>>>3))])))];
	case 0x2a: return [6, Mov(R8[(((b[i+1] & 0x38)>>>3))], Add(R8[(((b[i+1] & 0x38)>>>3))], Neg(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 1))))];
	case 0x2b: return [6, Mov(R32[(((b[i+1] & 0x38)>>>3))], Add(R32[(((b[i+1] & 0x38)>>>3))], Neg(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 4))))];
	case 0x30: return [6, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 1), Xor(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 1), R8[(((b[i+1] & 0x38)>>>3))]))];
	case 0x31: return [6, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 4), Xor(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 4), R32[(((b[i+1] & 0x38)>>>3))]))];
	case 0x32: return [6, Mov(R8[(((b[i+1] & 0x38)>>>3))], Xor(R8[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 1)))];
	case 0x33: return [6, Mov(R32[(((b[i+1] & 0x38)>>>3))], Xor(R32[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 4)))];
	case 0x38: return [6, Mov(F[2], Eq(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 1), R8[(((b[i+1] & 0x38)>>>3))])),Mov(F[1], Lt(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 1), R8[(((b[i+1] & 0x38)>>>3))]))];
	case 0x39: return [6, Mov(F[2], Eq(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 4), R32[(((b[i+1] & 0x38)>>>3))])),Mov(F[1], Lt(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 4), R32[(((b[i+1] & 0x38)>>>3))]))];
	case 0x3a: return [6, Mov(F[2], Eq(R8[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 1))),Mov(F[1], Lt(R8[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 1)))];
	case 0x3b: return [6, Mov(F[2], Eq(R32[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 4))),Mov(F[1], Lt(R32[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 4)))];
	case 0x84: return [6, Mov(F[2], Eq(And(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 1), R8[(((b[i+1] & 0x38)>>>3))]), 0))];
	case 0x85: return [6, Mov(F[2], Eq(And(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 4), R32[(((b[i+1] & 0x38)>>>3))]), 0))];
	case 0x86: return [6, Swap(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 1), R8[(((b[i+1] & 0x38)>>>3))])];
	case 0x87: return [6, Swap(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 4), R32[(((b[i+1] & 0x38)>>>3))])];
	case 0x88: return [6, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 1), R8[(((b[i+1] & 0x38)>>>3))])];
	case 0x89: return [6, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 4), R32[(((b[i+1] & 0x38)>>>3))])];
	case 0x8a: return [6, Mov(R8[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 1))];
	case 0x8b: return [6, Mov(R32[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 4))];
	case 0x8c: return [6, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 4), RS[(((b[i+1] & 0x38)>>>3))])];
	case 0x8d: return [6, Mov(R32[(((b[i+1] & 0x38)>>>3))], Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))))];
	case 0x8e: return [6, Mov(RS[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[((b[i+1] & 0x7))], (b[i+2]|(b[i+3]<<8)|(b[i+4]<<16)|(b[i+5]<<24))), 2))];
	}
if(((((b[i+0] & 0xf8)>>>3)|(b[i+1]<<5)|((b[i+2] & 0x3f)<<13)) & 0x718f1) == 0x40890)
	switch((b[i+0]|((b[i+1] & 0x3f)<<8)) & 0x3877) {
	case 0x0: return [5, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1), Add(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1), (b[i+4])))];
	case 0x2: return [5, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1), Add(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1), (b[i+4])))];
	case 0x3: return [5, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 4), Add(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 4), (b[i+4])))];
	case 0x800: return [5, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1), Or(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1), (b[i+4])))];
	case 0x802: return [5, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1), Or(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1), (b[i+4])))];
	case 0x803: return [5, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 4), Or(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 4), (b[i+4])))];
	case 0x1000: return [5, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1), Add(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1), Add((b[i+4]), F[1])))];
	case 0x1002: return [5, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1), Add(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1), Add((b[i+4]), F[1])))];
	case 0x1003: return [5, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 4), Add(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 4), Add((b[i+4]), F[1])))];
	case 0x1800: return [5, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1), Add((b[i+4]), Neg(Add(Add(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1), Neg(F[1])), 1))))];
	case 0x1802: return [5, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1), Add((b[i+4]), Neg(Add(Add(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1), Neg(F[1])), 1))))];
	case 0x1803: return [5, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 4), Add((b[i+4]), Neg(Add(Add(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 4), Neg(F[1])), 1))))];
	case 0x2000: return [5, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1), And(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1), (b[i+4])))];
	case 0x2002: return [5, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1), And(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1), (b[i+4])))];
	case 0x2003: return [5, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 4), And(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 4), (b[i+4])))];
	case 0x2800: return [5, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1), Add(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1), -(b[i+4])))];
	case 0x2802: return [5, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1), Add(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1), -(b[i+4])))];
	case 0x2803: return [5, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 4), Add(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 4), -(b[i+4])))];
	case 0x3000: return [5, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1), Xor(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1), (b[i+4])))];
	case 0x3002: return [5, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1), Xor(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1), (b[i+4])))];
	case 0x3003: return [5, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 4), Xor(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 4), (b[i+4])))];
	case 0x3800: return [5, Mov(F[2], Eq(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1), (b[i+4]))),Mov(F[1], Lt(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1), (b[i+4])))];
	case 0x3802: return [5, Mov(F[2], Eq(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1), (b[i+4]))),Mov(F[1], Lt(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1), (b[i+4])))];
	case 0x3803: return [5, Mov(F[2], Eq(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 4), (b[i+4]))),Mov(F[1], Lt(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 4), (b[i+4])))];
	case 0x46: return [5, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1), (b[i+4]))];
	case 0x40: return [5, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1), ROL(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1), (b[i+4])))];
	case 0x41: return [5, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 4), ROL(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 4), (b[i+4])))];
	case 0x840: return [5, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1), ROR(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1), (b[i+4])))];
	case 0x841: return [5, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 4), ROR(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 4), (b[i+4])))];
	case 0x2040: return [5, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1), LSL(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1), (b[i+4])))];
	case 0x2041: return [5, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 4), LSL(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 4), (b[i+4])))];
	case 0x2840: return [5, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1), LSR(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1), (b[i+4])))];
	case 0x2841: return [5, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 4), LSR(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 4), (b[i+4])))];
	case 0x3840: return [5, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1), ASR(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1), (b[i+4])))];
	case 0x3841: return [5, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 4), ASR(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 4), (b[i+4])))];
	case 0x76: return [5, Mov(F[2], Eq(And(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1), (b[i+4])), 0))];
	}
if(((((b[i+0] & 0xf8)>>>3)|(b[i+1]<<5)) & 0x18f1) == 0x890)
	switch((b[i+0]|((b[i+1] & 0x3f)<<8)) & 0x3877) {
	case 0x0: return [5, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 1), Add(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 1), (b[i+4])))];
	case 0x2: return [5, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 1), Add(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 1), (b[i+4])))];
	case 0x3: return [5, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 4), Add(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 4), (b[i+4])))];
	case 0x800: return [5, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 1), Or(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 1), (b[i+4])))];
	case 0x802: return [5, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 1), Or(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 1), (b[i+4])))];
	case 0x803: return [5, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 4), Or(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 4), (b[i+4])))];
	case 0x1000: return [5, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 1), Add(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 1), Add((b[i+4]), F[1])))];
	case 0x1002: return [5, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 1), Add(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 1), Add((b[i+4]), F[1])))];
	case 0x1003: return [5, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 4), Add(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 4), Add((b[i+4]), F[1])))];
	case 0x1800: return [5, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 1), Add((b[i+4]), Neg(Add(Add(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 1), Neg(F[1])), 1))))];
	case 0x1802: return [5, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 1), Add((b[i+4]), Neg(Add(Add(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 1), Neg(F[1])), 1))))];
	case 0x1803: return [5, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 4), Add((b[i+4]), Neg(Add(Add(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 4), Neg(F[1])), 1))))];
	case 0x2000: return [5, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 1), And(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 1), (b[i+4])))];
	case 0x2002: return [5, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 1), And(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 1), (b[i+4])))];
	case 0x2003: return [5, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 4), And(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 4), (b[i+4])))];
	case 0x2800: return [5, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 1), Add(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 1), -(b[i+4])))];
	case 0x2802: return [5, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 1), Add(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 1), -(b[i+4])))];
	case 0x2803: return [5, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 4), Add(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 4), -(b[i+4])))];
	case 0x3000: return [5, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 1), Xor(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 1), (b[i+4])))];
	case 0x3002: return [5, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 1), Xor(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 1), (b[i+4])))];
	case 0x3003: return [5, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 4), Xor(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 4), (b[i+4])))];
	case 0x3800: return [5, Mov(F[2], Eq(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 1), (b[i+4]))),Mov(F[1], Lt(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 1), (b[i+4])))];
	case 0x3802: return [5, Mov(F[2], Eq(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 1), (b[i+4]))),Mov(F[1], Lt(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 1), (b[i+4])))];
	case 0x3803: return [5, Mov(F[2], Eq(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 4), (b[i+4]))),Mov(F[1], Lt(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 4), (b[i+4])))];
	case 0x46: return [5, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 1), (b[i+4]))];
	case 0x40: return [5, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 1), ROL(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 1), (b[i+4])))];
	case 0x41: return [5, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 4), ROL(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 4), (b[i+4])))];
	case 0x840: return [5, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 1), ROR(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 1), (b[i+4])))];
	case 0x841: return [5, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 4), ROR(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 4), (b[i+4])))];
	case 0x2040: return [5, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 1), LSL(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 1), (b[i+4])))];
	case 0x2041: return [5, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 4), LSL(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 4), (b[i+4])))];
	case 0x2840: return [5, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 1), LSR(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 1), (b[i+4])))];
	case 0x2841: return [5, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 4), LSR(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 4), (b[i+4])))];
	case 0x3840: return [5, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 1), ASR(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 1), (b[i+4])))];
	case 0x3841: return [5, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 4), ASR(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 4), (b[i+4])))];
	case 0x76: return [5, Mov(F[2], Eq(And(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 1), (b[i+4])), 0))];
	}
if(((b[i+0]|(b[i+1]<<8)|(b[i+2]<<16)|((b[i+3] & 0x3f)<<24)) & 0x3fc7c0ff) == 0x2544800f)
	switch(((b[i+1] & 0x3f)) & 0x3f) {
	case 0x10: return [5, Mov(Mem(Add(R32[5], (((b[i+4]) << 24) >> 24)), 1), F[0])];
	case 0x11: return [5, Mov(Mem(Add(R32[5], (((b[i+4]) << 24) >> 24)), 1), Not(F[0]))];
	case 0x12: return [5, Mov(Mem(Add(R32[5], (((b[i+4]) << 24) >> 24)), 1), F[1])];
	case 0x13: return [5, Mov(Mem(Add(R32[5], (((b[i+4]) << 24) >> 24)), 1), Not(F[1]))];
	case 0x14: return [5, Mov(Mem(Add(R32[5], (((b[i+4]) << 24) >> 24)), 1), F[2])];
	case 0x15: return [5, Mov(Mem(Add(R32[5], (((b[i+4]) << 24) >> 24)), 1), Not(F[2]))];
	case 0x16: return [5, Mov(Mem(Add(R32[5], (((b[i+4]) << 24) >> 24)), 1), Or(F[1], F[2]))];
	case 0x17: return [5, Mov(Mem(Add(R32[5], (((b[i+4]) << 24) >> 24)), 1), And(Not(F[1]), Not(F[2])))];
	case 0x18: return [5, Mov(Mem(Add(R32[5], (((b[i+4]) << 24) >> 24)), 1), F[3])];
	case 0x19: return [5, Mov(Mem(Add(R32[5], (((b[i+4]) << 24) >> 24)), 1), Not(F[3]))];
	case 0x1a: return [5, Mov(Mem(Add(R32[5], (((b[i+4]) << 24) >> 24)), 1), F[4])];
	case 0x1b: return [5, Mov(Mem(Add(R32[5], (((b[i+4]) << 24) >> 24)), 1), Not(F[4]))];
	case 0x1c: return [5, Mov(Mem(Add(R32[5], (((b[i+4]) << 24) >> 24)), 1), Not(Eq(F[0], F[3])))];
	case 0x1d: return [5, Mov(Mem(Add(R32[5], (((b[i+4]) << 24) >> 24)), 1), Eq(F[0], F[3]))];
	case 0x1e: return [5, Mov(Mem(Add(R32[5], (((b[i+4]) << 24) >> 24)), 1), Or(F[2], Not(Eq(F[0], F[3]))))];
	case 0x1f: return [5, Mov(Mem(Add(R32[5], (((b[i+4]) << 24) >> 24)), 1), And(Not(F[2]), Eq(F[0], F[3])))];
	case 0x2d: return [5, Mov(Mem(Add(R32[5], (((b[i+4]) << 24) >> 24)), 4), Or(LSR(Mem(Add(R32[5], (((b[i+4]) << 24) >> 24)), 4), R8[1]), And(R32[(((b[i+2] & 0x38)>>>3))], LSL(Add(LSL(1, R8[1]), -1), Add(32, Neg(R8[1]))))))];
	case 0x36: return [5, Mov(R32[(((b[i+2] & 0x38)>>>3))], Mem(Add(R32[5], (((b[i+4]) << 24) >> 24)), 1))];
	case 0x37: return [5, Mov(R32[(((b[i+2] & 0x38)>>>3))], Mem(Add(R32[5], (((b[i+4]) << 24) >> 24)), 2))];
	}
if(((b[i+0]|(b[i+1]<<8)|(b[i+2]<<16)|((b[i+3] & 0x7)<<24)) & 0x7c7c0ff) == 0x544800f)
	switch(((b[i+1] & 0x3f)) & 0x3f) {
	case 0x10: return [5, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6))), (((b[i+4]) << 24) >> 24))), 1), F[0])];
	case 0x11: return [5, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6))), (((b[i+4]) << 24) >> 24))), 1), Not(F[0]))];
	case 0x12: return [5, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6))), (((b[i+4]) << 24) >> 24))), 1), F[1])];
	case 0x13: return [5, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6))), (((b[i+4]) << 24) >> 24))), 1), Not(F[1]))];
	case 0x14: return [5, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6))), (((b[i+4]) << 24) >> 24))), 1), F[2])];
	case 0x15: return [5, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6))), (((b[i+4]) << 24) >> 24))), 1), Not(F[2]))];
	case 0x16: return [5, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6))), (((b[i+4]) << 24) >> 24))), 1), Or(F[1], F[2]))];
	case 0x17: return [5, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6))), (((b[i+4]) << 24) >> 24))), 1), And(Not(F[1]), Not(F[2])))];
	case 0x18: return [5, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6))), (((b[i+4]) << 24) >> 24))), 1), F[3])];
	case 0x19: return [5, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6))), (((b[i+4]) << 24) >> 24))), 1), Not(F[3]))];
	case 0x1a: return [5, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6))), (((b[i+4]) << 24) >> 24))), 1), F[4])];
	case 0x1b: return [5, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6))), (((b[i+4]) << 24) >> 24))), 1), Not(F[4]))];
	case 0x1c: return [5, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6))), (((b[i+4]) << 24) >> 24))), 1), Not(Eq(F[0], F[3])))];
	case 0x1d: return [5, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6))), (((b[i+4]) << 24) >> 24))), 1), Eq(F[0], F[3]))];
	case 0x1e: return [5, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6))), (((b[i+4]) << 24) >> 24))), 1), Or(F[2], Not(Eq(F[0], F[3]))))];
	case 0x1f: return [5, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6))), (((b[i+4]) << 24) >> 24))), 1), And(Not(F[2]), Eq(F[0], F[3])))];
	case 0x2d: return [5, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6))), (((b[i+4]) << 24) >> 24))), 4), Or(LSR(Mem(Add(R32[5], Add(LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6))), (((b[i+4]) << 24) >> 24))), 4), R8[1]), And(R32[(((b[i+2] & 0x38)>>>3))], LSL(Add(LSL(1, R8[1]), -1), Add(32, Neg(R8[1]))))))];
	case 0x36: return [5, Mov(R32[(((b[i+2] & 0x38)>>>3))], Mem(Add(R32[5], Add(LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6))), (((b[i+4]) << 24) >> 24))), 1))];
	case 0x37: return [5, Mov(R32[(((b[i+2] & 0x38)>>>3))], Mem(Add(R32[5], Add(LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6))), (((b[i+4]) << 24) >> 24))), 2))];
	}
if(((b[i+0]|(b[i+1]<<8)|(b[i+2]<<16)|((b[i+3] & 0x3f)<<24)) & 0x3887c0ff) == 0x2004800f)
	switch((b[i+1]|((b[i+2] & 0x7f)<<8)) & 0x403f) {
	case 0x4010: return [5, Mov(Mem(Add(R32[((b[i+3] & 0x7))], (((b[i+4]) << 24) >> 24)), 1), F[0])];
	case 0x4011: return [5, Mov(Mem(Add(R32[((b[i+3] & 0x7))], (((b[i+4]) << 24) >> 24)), 1), Not(F[0]))];
	case 0x4012: return [5, Mov(Mem(Add(R32[((b[i+3] & 0x7))], (((b[i+4]) << 24) >> 24)), 1), F[1])];
	case 0x4013: return [5, Mov(Mem(Add(R32[((b[i+3] & 0x7))], (((b[i+4]) << 24) >> 24)), 1), Not(F[1]))];
	case 0x4014: return [5, Mov(Mem(Add(R32[((b[i+3] & 0x7))], (((b[i+4]) << 24) >> 24)), 1), F[2])];
	case 0x4015: return [5, Mov(Mem(Add(R32[((b[i+3] & 0x7))], (((b[i+4]) << 24) >> 24)), 1), Not(F[2]))];
	case 0x4016: return [5, Mov(Mem(Add(R32[((b[i+3] & 0x7))], (((b[i+4]) << 24) >> 24)), 1), Or(F[1], F[2]))];
	case 0x4017: return [5, Mov(Mem(Add(R32[((b[i+3] & 0x7))], (((b[i+4]) << 24) >> 24)), 1), And(Not(F[1]), Not(F[2])))];
	case 0x4018: return [5, Mov(Mem(Add(R32[((b[i+3] & 0x7))], (((b[i+4]) << 24) >> 24)), 1), F[3])];
	case 0x4019: return [5, Mov(Mem(Add(R32[((b[i+3] & 0x7))], (((b[i+4]) << 24) >> 24)), 1), Not(F[3]))];
	case 0x401a: return [5, Mov(Mem(Add(R32[((b[i+3] & 0x7))], (((b[i+4]) << 24) >> 24)), 1), F[4])];
	case 0x401b: return [5, Mov(Mem(Add(R32[((b[i+3] & 0x7))], (((b[i+4]) << 24) >> 24)), 1), Not(F[4]))];
	case 0x401c: return [5, Mov(Mem(Add(R32[((b[i+3] & 0x7))], (((b[i+4]) << 24) >> 24)), 1), Not(Eq(F[0], F[3])))];
	case 0x401d: return [5, Mov(Mem(Add(R32[((b[i+3] & 0x7))], (((b[i+4]) << 24) >> 24)), 1), Eq(F[0], F[3]))];
	case 0x401e: return [5, Mov(Mem(Add(R32[((b[i+3] & 0x7))], (((b[i+4]) << 24) >> 24)), 1), Or(F[2], Not(Eq(F[0], F[3]))))];
	case 0x401f: return [5, Mov(Mem(Add(R32[((b[i+3] & 0x7))], (((b[i+4]) << 24) >> 24)), 1), And(Not(F[2]), Eq(F[0], F[3])))];
	case 0x2c: return [5, Mov(Mem(R32[((b[i+3] & 0x7))], 4), Or(LSR(Mem(R32[((b[i+3] & 0x7))], 4), (b[i+4])), And(R32[(((b[i+2] & 0x38)>>>3))], (((1 << (b[i+4])) + -1) << (32 + -(b[i+4]))))))];
	case 0x402d: return [5, Mov(Mem(Add(R32[((b[i+3] & 0x7))], (((b[i+4]) << 24) >> 24)), 4), Or(LSR(Mem(Add(R32[((b[i+3] & 0x7))], (((b[i+4]) << 24) >> 24)), 4), R8[1]), And(R32[(((b[i+2] & 0x38)>>>3))], LSL(Add(LSL(1, R8[1]), -1), Add(32, Neg(R8[1]))))))];
	case 0x4036: return [5, Mov(R32[(((b[i+2] & 0x38)>>>3))], Mem(Add(R32[((b[i+3] & 0x7))], (((b[i+4]) << 24) >> 24)), 1))];
	case 0x4037: return [5, Mov(R32[(((b[i+2] & 0x38)>>>3))], Mem(Add(R32[((b[i+3] & 0x7))], (((b[i+4]) << 24) >> 24)), 2))];
	}
if(((b[i+0]|(b[i+1]<<8)|(b[i+2]<<16)) & 0x87c0ff) == 0x4800f)
	switch((b[i+1]|((b[i+2] & 0x7f)<<8)) & 0x403f) {
	case 0x4010: return [5, Mov(Mem(Add(Add(R32[((b[i+3] & 0x7))], LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (((b[i+4]) << 24) >> 24)), 1), F[0])];
	case 0x4011: return [5, Mov(Mem(Add(Add(R32[((b[i+3] & 0x7))], LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (((b[i+4]) << 24) >> 24)), 1), Not(F[0]))];
	case 0x4012: return [5, Mov(Mem(Add(Add(R32[((b[i+3] & 0x7))], LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (((b[i+4]) << 24) >> 24)), 1), F[1])];
	case 0x4013: return [5, Mov(Mem(Add(Add(R32[((b[i+3] & 0x7))], LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (((b[i+4]) << 24) >> 24)), 1), Not(F[1]))];
	case 0x4014: return [5, Mov(Mem(Add(Add(R32[((b[i+3] & 0x7))], LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (((b[i+4]) << 24) >> 24)), 1), F[2])];
	case 0x4015: return [5, Mov(Mem(Add(Add(R32[((b[i+3] & 0x7))], LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (((b[i+4]) << 24) >> 24)), 1), Not(F[2]))];
	case 0x4016: return [5, Mov(Mem(Add(Add(R32[((b[i+3] & 0x7))], LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (((b[i+4]) << 24) >> 24)), 1), Or(F[1], F[2]))];
	case 0x4017: return [5, Mov(Mem(Add(Add(R32[((b[i+3] & 0x7))], LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (((b[i+4]) << 24) >> 24)), 1), And(Not(F[1]), Not(F[2])))];
	case 0x4018: return [5, Mov(Mem(Add(Add(R32[((b[i+3] & 0x7))], LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (((b[i+4]) << 24) >> 24)), 1), F[3])];
	case 0x4019: return [5, Mov(Mem(Add(Add(R32[((b[i+3] & 0x7))], LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (((b[i+4]) << 24) >> 24)), 1), Not(F[3]))];
	case 0x401a: return [5, Mov(Mem(Add(Add(R32[((b[i+3] & 0x7))], LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (((b[i+4]) << 24) >> 24)), 1), F[4])];
	case 0x401b: return [5, Mov(Mem(Add(Add(R32[((b[i+3] & 0x7))], LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (((b[i+4]) << 24) >> 24)), 1), Not(F[4]))];
	case 0x401c: return [5, Mov(Mem(Add(Add(R32[((b[i+3] & 0x7))], LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (((b[i+4]) << 24) >> 24)), 1), Not(Eq(F[0], F[3])))];
	case 0x401d: return [5, Mov(Mem(Add(Add(R32[((b[i+3] & 0x7))], LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (((b[i+4]) << 24) >> 24)), 1), Eq(F[0], F[3]))];
	case 0x401e: return [5, Mov(Mem(Add(Add(R32[((b[i+3] & 0x7))], LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (((b[i+4]) << 24) >> 24)), 1), Or(F[2], Not(Eq(F[0], F[3]))))];
	case 0x401f: return [5, Mov(Mem(Add(Add(R32[((b[i+3] & 0x7))], LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (((b[i+4]) << 24) >> 24)), 1), And(Not(F[2]), Eq(F[0], F[3])))];
	case 0x2c: return [5, Mov(Mem(Add(R32[((b[i+3] & 0x7))], LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), 4), Or(LSR(Mem(Add(R32[((b[i+3] & 0x7))], LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), 4), (b[i+4])), And(R32[(((b[i+2] & 0x38)>>>3))], (((1 << (b[i+4])) + -1) << (32 + -(b[i+4]))))))];
	case 0x402d: return [5, Mov(Mem(Add(Add(R32[((b[i+3] & 0x7))], LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (((b[i+4]) << 24) >> 24)), 4), Or(LSR(Mem(Add(Add(R32[((b[i+3] & 0x7))], LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (((b[i+4]) << 24) >> 24)), 4), R8[1]), And(R32[(((b[i+2] & 0x38)>>>3))], LSL(Add(LSL(1, R8[1]), -1), Add(32, Neg(R8[1]))))))];
	case 0x4036: return [5, Mov(R32[(((b[i+2] & 0x38)>>>3))], Mem(Add(Add(R32[((b[i+3] & 0x7))], LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (((b[i+4]) << 24) >> 24)), 1))];
	case 0x4037: return [5, Mov(R32[(((b[i+2] & 0x38)>>>3))], Mem(Add(Add(R32[((b[i+3] & 0x7))], LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), (((b[i+4]) << 24) >> 24)), 2))];
	}
if(((((b[i+0] & 0xf8)>>>3)|(b[i+1]<<5)|((b[i+2] & 0x3f)<<13)) & 0x7f8f1) == 0x4a890)
	switch((b[i+0]|((b[i+1] & 0x3f)<<8)) & 0x3877) {
	case 0x0: return [5, Mov(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 1), Add(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 1), (b[i+4])))];
	case 0x2: return [5, Mov(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 1), Add(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 1), (b[i+4])))];
	case 0x3: return [5, Mov(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 4), Add(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 4), (b[i+4])))];
	case 0x800: return [5, Mov(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 1), Or(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 1), (b[i+4])))];
	case 0x802: return [5, Mov(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 1), Or(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 1), (b[i+4])))];
	case 0x803: return [5, Mov(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 4), Or(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 4), (b[i+4])))];
	case 0x1000: return [5, Mov(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 1), Add(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 1), Add((b[i+4]), F[1])))];
	case 0x1002: return [5, Mov(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 1), Add(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 1), Add((b[i+4]), F[1])))];
	case 0x1003: return [5, Mov(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 4), Add(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 4), Add((b[i+4]), F[1])))];
	case 0x1800: return [5, Mov(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 1), Add((b[i+4]), Neg(Add(Add(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 1), Neg(F[1])), 1))))];
	case 0x1802: return [5, Mov(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 1), Add((b[i+4]), Neg(Add(Add(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 1), Neg(F[1])), 1))))];
	case 0x1803: return [5, Mov(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 4), Add((b[i+4]), Neg(Add(Add(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 4), Neg(F[1])), 1))))];
	case 0x2000: return [5, Mov(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 1), And(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 1), (b[i+4])))];
	case 0x2002: return [5, Mov(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 1), And(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 1), (b[i+4])))];
	case 0x2003: return [5, Mov(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 4), And(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 4), (b[i+4])))];
	case 0x2800: return [5, Mov(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 1), Add(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 1), -(b[i+4])))];
	case 0x2802: return [5, Mov(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 1), Add(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 1), -(b[i+4])))];
	case 0x2803: return [5, Mov(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 4), Add(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 4), -(b[i+4])))];
	case 0x3000: return [5, Mov(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 1), Xor(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 1), (b[i+4])))];
	case 0x3002: return [5, Mov(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 1), Xor(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 1), (b[i+4])))];
	case 0x3003: return [5, Mov(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 4), Xor(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 4), (b[i+4])))];
	case 0x3800: return [5, Mov(F[2], Eq(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 1), (b[i+4]))),Mov(F[1], Lt(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 1), (b[i+4])))];
	case 0x3802: return [5, Mov(F[2], Eq(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 1), (b[i+4]))),Mov(F[1], Lt(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 1), (b[i+4])))];
	case 0x3803: return [5, Mov(F[2], Eq(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 4), (b[i+4]))),Mov(F[1], Lt(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 4), (b[i+4])))];
	case 0x46: return [5, Mov(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 1), (b[i+4]))];
	case 0x40: return [5, Mov(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 1), ROL(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 1), (b[i+4])))];
	case 0x41: return [5, Mov(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 4), ROL(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 4), (b[i+4])))];
	case 0x840: return [5, Mov(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 1), ROR(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 1), (b[i+4])))];
	case 0x841: return [5, Mov(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 4), ROR(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 4), (b[i+4])))];
	case 0x2040: return [5, Mov(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 1), LSL(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 1), (b[i+4])))];
	case 0x2041: return [5, Mov(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 4), LSL(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 4), (b[i+4])))];
	case 0x2840: return [5, Mov(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 1), LSR(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 1), (b[i+4])))];
	case 0x2841: return [5, Mov(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 4), LSR(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 4), (b[i+4])))];
	case 0x3840: return [5, Mov(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 1), ASR(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 1), (b[i+4])))];
	case 0x3841: return [5, Mov(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 4), ASR(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 4), (b[i+4])))];
	case 0x76: return [5, Mov(F[2], Eq(And(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 1), (b[i+4])), 0))];
	}
if(((((b[i+0] & 0xf8)>>>3)|(b[i+1]<<5)|((b[i+2] & 0x7)<<13)) & 0xf8f1) == 0xa890)
	switch((b[i+0]|((b[i+1] & 0x3f)<<8)) & 0x3877) {
	case 0x0: return [5, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 1), Add(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 1), (b[i+4])))];
	case 0x2: return [5, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 1), Add(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 1), (b[i+4])))];
	case 0x3: return [5, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 4), Add(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 4), (b[i+4])))];
	case 0x800: return [5, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 1), Or(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 1), (b[i+4])))];
	case 0x802: return [5, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 1), Or(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 1), (b[i+4])))];
	case 0x803: return [5, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 4), Or(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 4), (b[i+4])))];
	case 0x1000: return [5, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 1), Add(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 1), Add((b[i+4]), F[1])))];
	case 0x1002: return [5, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 1), Add(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 1), Add((b[i+4]), F[1])))];
	case 0x1003: return [5, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 4), Add(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 4), Add((b[i+4]), F[1])))];
	case 0x1800: return [5, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 1), Add((b[i+4]), Neg(Add(Add(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 1), Neg(F[1])), 1))))];
	case 0x1802: return [5, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 1), Add((b[i+4]), Neg(Add(Add(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 1), Neg(F[1])), 1))))];
	case 0x1803: return [5, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 4), Add((b[i+4]), Neg(Add(Add(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 4), Neg(F[1])), 1))))];
	case 0x2000: return [5, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 1), And(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 1), (b[i+4])))];
	case 0x2002: return [5, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 1), And(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 1), (b[i+4])))];
	case 0x2003: return [5, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 4), And(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 4), (b[i+4])))];
	case 0x2800: return [5, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 1), Add(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 1), -(b[i+4])))];
	case 0x2802: return [5, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 1), Add(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 1), -(b[i+4])))];
	case 0x2803: return [5, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 4), Add(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 4), -(b[i+4])))];
	case 0x3000: return [5, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 1), Xor(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 1), (b[i+4])))];
	case 0x3002: return [5, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 1), Xor(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 1), (b[i+4])))];
	case 0x3003: return [5, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 4), Xor(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 4), (b[i+4])))];
	case 0x3800: return [5, Mov(F[2], Eq(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 1), (b[i+4]))),Mov(F[1], Lt(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 1), (b[i+4])))];
	case 0x3802: return [5, Mov(F[2], Eq(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 1), (b[i+4]))),Mov(F[1], Lt(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 1), (b[i+4])))];
	case 0x3803: return [5, Mov(F[2], Eq(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 4), (b[i+4]))),Mov(F[1], Lt(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 4), (b[i+4])))];
	case 0x46: return [5, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 1), (b[i+4]))];
	case 0x40: return [5, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 1), ROL(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 1), (b[i+4])))];
	case 0x41: return [5, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 4), ROL(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 4), (b[i+4])))];
	case 0x840: return [5, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 1), ROR(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 1), (b[i+4])))];
	case 0x841: return [5, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 4), ROR(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 4), (b[i+4])))];
	case 0x2040: return [5, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 1), LSL(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 1), (b[i+4])))];
	case 0x2041: return [5, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 4), LSL(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 4), (b[i+4])))];
	case 0x2840: return [5, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 1), LSR(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 1), (b[i+4])))];
	case 0x2841: return [5, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 4), LSR(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 4), (b[i+4])))];
	case 0x3840: return [5, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 1), ASR(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 1), (b[i+4])))];
	case 0x3841: return [5, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 4), ASR(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 4), (b[i+4])))];
	case 0x76: return [5, Mov(F[2], Eq(And(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 1), (b[i+4])), 0))];
	}
if(((b[i+0]|(b[i+1]<<8)|(b[i+2]<<16)) & 0xc0ffff) == 0x40ac0f)
	switch(0) {
	case 0x0: return [5, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 4), Or(LSR(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 4), (b[i+4])), And(R32[(((b[i+2] & 0x38)>>>3))], (((1 << (b[i+4])) + -1) << (32 + -(b[i+4]))))))];
	}

	switch((b[i+0]) & 0xff) {
	case 0x5: return [5, Mov(R32[0], Add(R32[0], (b[i+1]|(b[i+2]<<8)|(b[i+3]<<16)|(b[i+4]<<24))))];
	case 0xd: return [5, Mov(R32[0], Or(R32[0], (b[i+1]|(b[i+2]<<8)|(b[i+3]<<16)|(b[i+4]<<24))))];
	case 0x15: return [5, Mov(R32[0], Add(R32[0], Add((b[i+1]|(b[i+2]<<8)|(b[i+3]<<16)|(b[i+4]<<24)), F[1])))];
	case 0x1d: return [5, Mov(R32[0], Add((b[i+1]|(b[i+2]<<8)|(b[i+3]<<16)|(b[i+4]<<24)), Neg(Add(Add(R32[0], Neg(F[1])), 1))))];
	case 0x25: return [5, Mov(R32[0], And(R32[0], (b[i+1]|(b[i+2]<<8)|(b[i+3]<<16)|(b[i+4]<<24))))];
	case 0x2d: return [5, Mov(R32[0], Add(R32[0], -(b[i+1]|(b[i+2]<<8)|(b[i+3]<<16)|(b[i+4]<<24))))];
	case 0x35: return [5, Mov(R32[0], Xor(R32[0], (b[i+1]|(b[i+2]<<8)|(b[i+3]<<16)|(b[i+4]<<24))))];
	case 0x3d: return [5, Mov(F[2], Eq(R32[0], (b[i+1]|(b[i+2]<<8)|(b[i+3]<<16)|(b[i+4]<<24)))),Mov(F[1], Lt(R32[0], (b[i+1]|(b[i+2]<<8)|(b[i+3]<<16)|(b[i+4]<<24))))];
	case 0x68: return [5, Mov(R32[4], Add(R32[4], -4)),Mov(Mem(R32[4], 4), (b[i+1]|(b[i+2]<<8)|(b[i+3]<<16)|(b[i+4]<<24)))];
	case 0xa0: return [5, Mov(R8[0], Mem((b[i+1]|(b[i+2]<<8)|(b[i+3]<<16)|(b[i+4]<<24)), 1))];
	case 0xa1: return [5, Mov(R32[0], Mem((b[i+1]|(b[i+2]<<8)|(b[i+3]<<16)|(b[i+4]<<24)), 4))];
	case 0xa2: return [5, Mov(Mem((b[i+1]|(b[i+2]<<8)|(b[i+3]<<16)|(b[i+4]<<24)), 1), R8[0])];
	case 0xa3: return [5, Mov(Mem((b[i+1]|(b[i+2]<<8)|(b[i+3]<<16)|(b[i+4]<<24)), 4), R32[0])];
	case 0xa9: return [5, Mov(F[2], Eq(And(R32[0], (b[i+1]|(b[i+2]<<8)|(b[i+3]<<16)|(b[i+4]<<24))), 0))];
	case 0xb8: return [5, Mov(R32[0], (b[i+1]|(b[i+2]<<8)|(b[i+3]<<16)|(b[i+4]<<24)))];
	case 0xb9: return [5, Mov(R32[1], (b[i+1]|(b[i+2]<<8)|(b[i+3]<<16)|(b[i+4]<<24)))];
	case 0xba: return [5, Mov(R32[2], (b[i+1]|(b[i+2]<<8)|(b[i+3]<<16)|(b[i+4]<<24)))];
	case 0xbb: return [5, Mov(R32[3], (b[i+1]|(b[i+2]<<8)|(b[i+3]<<16)|(b[i+4]<<24)))];
	case 0xbc: return [5, Mov(R32[4], (b[i+1]|(b[i+2]<<8)|(b[i+3]<<16)|(b[i+4]<<24)))];
	case 0xbd: return [5, Mov(R32[5], (b[i+1]|(b[i+2]<<8)|(b[i+3]<<16)|(b[i+4]<<24)))];
	case 0xbe: return [5, Mov(R32[6], (b[i+1]|(b[i+2]<<8)|(b[i+3]<<16)|(b[i+4]<<24)))];
	case 0xbf: return [5, Mov(R32[7], (b[i+1]|(b[i+2]<<8)|(b[i+3]<<16)|(b[i+4]<<24)))];
	case 0xe8: return [5, Mov(R32[4], Add(R32[4], -4)),Mov(Mem(R32[4], 4), Add(R32[8], 5)),Mov(R32[8], Add(R32[8], ((b[i+1]|(b[i+2]<<8)|(b[i+3]<<16)|(b[i+4]<<24)) + 5)))];
	case 0xe9: return [5, Mov(R32[8], Add(R32[8], ((b[i+1]|(b[i+2]<<8)|(b[i+3]<<16)|(b[i+4]<<24)) + 5)))];
	}
if(((((b[i+0] & 0x80)>>>7)|(b[i+1]<<1)|((b[i+2] & 0x3f)<<9)) & 0x7f8f) == 0x4a89)
	switch((b[i+0]|((b[i+1] & 0x3f)<<8)) & 0x387f) {
	case 0xf: return [4, Mov(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 4), Mem(R32[4], 4)),Mov(R32[4], Add(R32[4], 4))];
	case 0x50: return [4, Mov(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 1), ROL(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 1), 1))];
	case 0x51: return [4, Mov(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 4), ROL(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 4), 1))];
	case 0x52: return [4, Mov(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 1), ROL(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 1), R8[1]))];
	case 0x53: return [4, Mov(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 4), ROL(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 4), R8[1]))];
	case 0x850: return [4, Mov(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 1), ROR(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 1), 1))];
	case 0x851: return [4, Mov(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 4), ROR(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 4), 1))];
	case 0x852: return [4, Mov(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 1), ROR(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 1), R8[1]))];
	case 0x853: return [4, Mov(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 4), ROR(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 4), R8[1]))];
	case 0x2050: return [4, Mov(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 1), LSL(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 1), 1))];
	case 0x2051: return [4, Mov(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 4), LSL(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 4), 1))];
	case 0x2052: return [4, Mov(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 1), LSL(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 1), R8[1]))];
	case 0x2053: return [4, Mov(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 4), LSL(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 4), R8[1]))];
	case 0x2850: return [4, Mov(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 1), LSR(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 1), 1))];
	case 0x2851: return [4, Mov(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 4), LSR(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 4), 1))];
	case 0x2852: return [4, Mov(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 1), LSR(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 1), R8[1]))];
	case 0x2853: return [4, Mov(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 4), LSR(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 4), R8[1]))];
	case 0x3850: return [4, Mov(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 1), ASR(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 1), 1))];
	case 0x3851: return [4, Mov(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 4), ASR(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 4), 1))];
	case 0x3852: return [4, Mov(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 1), ASR(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 1), R8[1]))];
	case 0x3853: return [4, Mov(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 4), ASR(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 4), R8[1]))];
	case 0x1076: return [4, Mov(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 1), Not(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 1)))];
	case 0x1077: return [4, Mov(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 4), Not(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 4)))];
	case 0x1876: return [4, Mov(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 1), Neg(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 1)))];
	case 0x1877: return [4, Mov(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 4), Neg(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 4)))];
	case 0x2076: return [4, Mov(R16[0], Mul(R8[0], Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 1)))];
	case 0x2077: return [4, Mov(R32[0], Mul(R32[0], Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 4)))];
	case 0x2876: return [4, Mov(R16[0], Mul(R8[0], Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 1)))];
	case 0x2877: return [4, Mov(R32[0], Mul(R32[0], Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 4)))];
	case 0x7e: return [4, Mov(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 1), Add(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 1), 1))];
	case 0x7f: return [4, Mov(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 4), Add(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 4), 1))];
	case 0x87e: return [4, Mov(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 1), Add(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 1), -1))];
	case 0x87f: return [4, Mov(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 4), Add(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 4), -1))];
	case 0x107f: return [4, Mov(R32[4], Add(R32[4], -4)),Mov(Mem(R32[4], 4), Add(R32[8], 4)),Mov(R32[8], Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 4))];
	case 0x207f: return [4, Mov(R32[8], Add(R32[8], 4))];
	case 0x307f: return [4, Mov(R32[4], Add(R32[4], -4)),Mov(Mem(R32[4], 4), Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 4))];
	}
if(((((b[i+0] & 0xc0)>>>6)|(b[i+1]<<2)|((b[i+2] & 0x3f)<<10)) & 0xff1d) == 0x9510)
	switch((b[i+0]) & 0xbf) {
	case 0x0: return [4, Mov(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 1), Add(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 1), R8[(((b[i+1] & 0x38)>>>3))]))];
	case 0x1: return [4, Mov(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 4), Add(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 4), R32[(((b[i+1] & 0x38)>>>3))]))];
	case 0x2: return [4, Mov(R8[(((b[i+1] & 0x38)>>>3))], Add(R8[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 1)))];
	case 0x3: return [4, Mov(R32[(((b[i+1] & 0x38)>>>3))], Add(R32[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 4)))];
	case 0x8: return [4, Mov(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 1), Or(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 1), R8[(((b[i+1] & 0x38)>>>3))]))];
	case 0x9: return [4, Mov(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 4), Or(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 4), R32[(((b[i+1] & 0x38)>>>3))]))];
	case 0xa: return [4, Mov(R8[(((b[i+1] & 0x38)>>>3))], Or(R8[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 1)))];
	case 0xb: return [4, Mov(R32[(((b[i+1] & 0x38)>>>3))], Or(R32[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 4)))];
	case 0x10: return [4, Mov(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 1), Add(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 1), Add(R8[(((b[i+1] & 0x38)>>>3))], F[1])))];
	case 0x11: return [4, Mov(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 4), Add(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 4), Add(R32[(((b[i+1] & 0x38)>>>3))], F[1])))];
	case 0x12: return [4, Mov(R8[(((b[i+1] & 0x38)>>>3))], Add(R8[(((b[i+1] & 0x38)>>>3))], Add(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 1), F[1])))];
	case 0x13: return [4, Mov(R32[(((b[i+1] & 0x38)>>>3))], Add(R32[(((b[i+1] & 0x38)>>>3))], Add(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 4), F[1])))];
	case 0x18: return [4, Mov(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 1), Add(R8[(((b[i+1] & 0x38)>>>3))], Neg(Add(Add(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 1), Neg(F[1])), 1))))];
	case 0x19: return [4, Mov(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 4), Add(R32[(((b[i+1] & 0x38)>>>3))], Neg(Add(Add(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 4), Neg(F[1])), 1))))];
	case 0x1a: return [4, Mov(R8[(((b[i+1] & 0x38)>>>3))], Add(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 1), Neg(Add(Add(R8[(((b[i+1] & 0x38)>>>3))], Neg(F[1])), 1))))];
	case 0x1b: return [4, Mov(R32[(((b[i+1] & 0x38)>>>3))], Add(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 4), Neg(Add(Add(R32[(((b[i+1] & 0x38)>>>3))], Neg(F[1])), 1))))];
	case 0x20: return [4, Mov(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 1), And(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 1), R8[(((b[i+1] & 0x38)>>>3))]))];
	case 0x21: return [4, Mov(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 4), And(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 4), R32[(((b[i+1] & 0x38)>>>3))]))];
	case 0x22: return [4, Mov(R8[(((b[i+1] & 0x38)>>>3))], And(R8[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 1)))];
	case 0x23: return [4, Mov(R32[(((b[i+1] & 0x38)>>>3))], And(R32[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 4)))];
	case 0x28: return [4, Mov(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 1), Add(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 1), Neg(R8[(((b[i+1] & 0x38)>>>3))])))];
	case 0x29: return [4, Mov(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 4), Add(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 4), Neg(R32[(((b[i+1] & 0x38)>>>3))])))];
	case 0x2a: return [4, Mov(R8[(((b[i+1] & 0x38)>>>3))], Add(R8[(((b[i+1] & 0x38)>>>3))], Neg(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 1))))];
	case 0x2b: return [4, Mov(R32[(((b[i+1] & 0x38)>>>3))], Add(R32[(((b[i+1] & 0x38)>>>3))], Neg(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 4))))];
	case 0x30: return [4, Mov(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 1), Xor(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 1), R8[(((b[i+1] & 0x38)>>>3))]))];
	case 0x31: return [4, Mov(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 4), Xor(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 4), R32[(((b[i+1] & 0x38)>>>3))]))];
	case 0x32: return [4, Mov(R8[(((b[i+1] & 0x38)>>>3))], Xor(R8[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 1)))];
	case 0x33: return [4, Mov(R32[(((b[i+1] & 0x38)>>>3))], Xor(R32[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 4)))];
	case 0x38: return [4, Mov(F[2], Eq(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 1), R8[(((b[i+1] & 0x38)>>>3))])),Mov(F[1], Lt(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 1), R8[(((b[i+1] & 0x38)>>>3))]))];
	case 0x39: return [4, Mov(F[2], Eq(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 4), R32[(((b[i+1] & 0x38)>>>3))])),Mov(F[1], Lt(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 4), R32[(((b[i+1] & 0x38)>>>3))]))];
	case 0x3a: return [4, Mov(F[2], Eq(R8[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 1))),Mov(F[1], Lt(R8[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 1)))];
	case 0x3b: return [4, Mov(F[2], Eq(R32[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 4))),Mov(F[1], Lt(R32[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 4)))];
	case 0x84: return [4, Mov(F[2], Eq(And(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 1), R8[(((b[i+1] & 0x38)>>>3))]), 0))];
	case 0x85: return [4, Mov(F[2], Eq(And(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 4), R32[(((b[i+1] & 0x38)>>>3))]), 0))];
	case 0x86: return [4, Swap(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 1), R8[(((b[i+1] & 0x38)>>>3))])];
	case 0x87: return [4, Swap(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 4), R32[(((b[i+1] & 0x38)>>>3))])];
	case 0x88: return [4, Mov(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 1), R8[(((b[i+1] & 0x38)>>>3))])];
	case 0x89: return [4, Mov(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 4), R32[(((b[i+1] & 0x38)>>>3))])];
	case 0x8a: return [4, Mov(R8[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 1))];
	case 0x8b: return [4, Mov(R32[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 4))];
	case 0x8c: return [4, Mov(Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 4), RS[(((b[i+1] & 0x38)>>>3))])];
	case 0x8d: return [4, Mov(R32[(((b[i+1] & 0x38)>>>3))], Add(R32[5], (((b[i+3]) << 24) >> 24)))];
	case 0x8e: return [4, Mov(RS[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[5], (((b[i+3]) << 24) >> 24)), 2))];
	}
if(((((b[i+0] & 0x80)>>>7)|(b[i+1]<<1)|((b[i+2] & 0x3f)<<9)) & 0x710f) == 0x4009)
	switch((b[i+0]|((b[i+1] & 0x7f)<<8)) & 0x787f) {
	case 0x0: return [4, Mov(Mem(R32[((b[i+2] & 0x7))], 1), Add(Mem(R32[((b[i+2] & 0x7))], 1), (b[i+3])))];
	case 0x2: return [4, Mov(Mem(R32[((b[i+2] & 0x7))], 1), Add(Mem(R32[((b[i+2] & 0x7))], 1), (b[i+3])))];
	case 0x3: return [4, Mov(Mem(R32[((b[i+2] & 0x7))], 4), Add(Mem(R32[((b[i+2] & 0x7))], 4), (b[i+3])))];
	case 0x800: return [4, Mov(Mem(R32[((b[i+2] & 0x7))], 1), Or(Mem(R32[((b[i+2] & 0x7))], 1), (b[i+3])))];
	case 0x802: return [4, Mov(Mem(R32[((b[i+2] & 0x7))], 1), Or(Mem(R32[((b[i+2] & 0x7))], 1), (b[i+3])))];
	case 0x803: return [4, Mov(Mem(R32[((b[i+2] & 0x7))], 4), Or(Mem(R32[((b[i+2] & 0x7))], 4), (b[i+3])))];
	case 0x1000: return [4, Mov(Mem(R32[((b[i+2] & 0x7))], 1), Add(Mem(R32[((b[i+2] & 0x7))], 1), Add((b[i+3]), F[1])))];
	case 0x1002: return [4, Mov(Mem(R32[((b[i+2] & 0x7))], 1), Add(Mem(R32[((b[i+2] & 0x7))], 1), Add((b[i+3]), F[1])))];
	case 0x1003: return [4, Mov(Mem(R32[((b[i+2] & 0x7))], 4), Add(Mem(R32[((b[i+2] & 0x7))], 4), Add((b[i+3]), F[1])))];
	case 0x1800: return [4, Mov(Mem(R32[((b[i+2] & 0x7))], 1), Add((b[i+3]), Neg(Add(Add(Mem(R32[((b[i+2] & 0x7))], 1), Neg(F[1])), 1))))];
	case 0x1802: return [4, Mov(Mem(R32[((b[i+2] & 0x7))], 1), Add((b[i+3]), Neg(Add(Add(Mem(R32[((b[i+2] & 0x7))], 1), Neg(F[1])), 1))))];
	case 0x1803: return [4, Mov(Mem(R32[((b[i+2] & 0x7))], 4), Add((b[i+3]), Neg(Add(Add(Mem(R32[((b[i+2] & 0x7))], 4), Neg(F[1])), 1))))];
	case 0x2000: return [4, Mov(Mem(R32[((b[i+2] & 0x7))], 1), And(Mem(R32[((b[i+2] & 0x7))], 1), (b[i+3])))];
	case 0x2002: return [4, Mov(Mem(R32[((b[i+2] & 0x7))], 1), And(Mem(R32[((b[i+2] & 0x7))], 1), (b[i+3])))];
	case 0x2003: return [4, Mov(Mem(R32[((b[i+2] & 0x7))], 4), And(Mem(R32[((b[i+2] & 0x7))], 4), (b[i+3])))];
	case 0x2800: return [4, Mov(Mem(R32[((b[i+2] & 0x7))], 1), Add(Mem(R32[((b[i+2] & 0x7))], 1), -(b[i+3])))];
	case 0x2802: return [4, Mov(Mem(R32[((b[i+2] & 0x7))], 1), Add(Mem(R32[((b[i+2] & 0x7))], 1), -(b[i+3])))];
	case 0x2803: return [4, Mov(Mem(R32[((b[i+2] & 0x7))], 4), Add(Mem(R32[((b[i+2] & 0x7))], 4), -(b[i+3])))];
	case 0x3000: return [4, Mov(Mem(R32[((b[i+2] & 0x7))], 1), Xor(Mem(R32[((b[i+2] & 0x7))], 1), (b[i+3])))];
	case 0x3002: return [4, Mov(Mem(R32[((b[i+2] & 0x7))], 1), Xor(Mem(R32[((b[i+2] & 0x7))], 1), (b[i+3])))];
	case 0x3003: return [4, Mov(Mem(R32[((b[i+2] & 0x7))], 4), Xor(Mem(R32[((b[i+2] & 0x7))], 4), (b[i+3])))];
	case 0x3800: return [4, Mov(F[2], Eq(Mem(R32[((b[i+2] & 0x7))], 1), (b[i+3]))),Mov(F[1], Lt(Mem(R32[((b[i+2] & 0x7))], 1), (b[i+3])))];
	case 0x3802: return [4, Mov(F[2], Eq(Mem(R32[((b[i+2] & 0x7))], 1), (b[i+3]))),Mov(F[1], Lt(Mem(R32[((b[i+2] & 0x7))], 1), (b[i+3])))];
	case 0x3803: return [4, Mov(F[2], Eq(Mem(R32[((b[i+2] & 0x7))], 4), (b[i+3]))),Mov(F[1], Lt(Mem(R32[((b[i+2] & 0x7))], 4), (b[i+3])))];
	case 0x400f: return [4, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 4), Mem(R32[4], 4)),Mov(R32[4], Add(R32[4], 4))];
	case 0x46: return [4, Mov(Mem(R32[((b[i+2] & 0x7))], 1), (b[i+3]))];
	case 0x40: return [4, Mov(Mem(R32[((b[i+2] & 0x7))], 1), ROL(Mem(R32[((b[i+2] & 0x7))], 1), (b[i+3])))];
	case 0x41: return [4, Mov(Mem(R32[((b[i+2] & 0x7))], 4), ROL(Mem(R32[((b[i+2] & 0x7))], 4), (b[i+3])))];
	case 0x4050: return [4, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1), ROL(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1), 1))];
	case 0x4051: return [4, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 4), ROL(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 4), 1))];
	case 0x4052: return [4, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1), ROL(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1), R8[1]))];
	case 0x4053: return [4, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 4), ROL(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 4), R8[1]))];
	case 0x840: return [4, Mov(Mem(R32[((b[i+2] & 0x7))], 1), ROR(Mem(R32[((b[i+2] & 0x7))], 1), (b[i+3])))];
	case 0x841: return [4, Mov(Mem(R32[((b[i+2] & 0x7))], 4), ROR(Mem(R32[((b[i+2] & 0x7))], 4), (b[i+3])))];
	case 0x4850: return [4, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1), ROR(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1), 1))];
	case 0x4851: return [4, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 4), ROR(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 4), 1))];
	case 0x4852: return [4, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1), ROR(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1), R8[1]))];
	case 0x4853: return [4, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 4), ROR(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 4), R8[1]))];
	case 0x2040: return [4, Mov(Mem(R32[((b[i+2] & 0x7))], 1), LSL(Mem(R32[((b[i+2] & 0x7))], 1), (b[i+3])))];
	case 0x2041: return [4, Mov(Mem(R32[((b[i+2] & 0x7))], 4), LSL(Mem(R32[((b[i+2] & 0x7))], 4), (b[i+3])))];
	case 0x6050: return [4, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1), LSL(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1), 1))];
	case 0x6051: return [4, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 4), LSL(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 4), 1))];
	case 0x6052: return [4, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1), LSL(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1), R8[1]))];
	case 0x6053: return [4, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 4), LSL(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 4), R8[1]))];
	case 0x2840: return [4, Mov(Mem(R32[((b[i+2] & 0x7))], 1), LSR(Mem(R32[((b[i+2] & 0x7))], 1), (b[i+3])))];
	case 0x2841: return [4, Mov(Mem(R32[((b[i+2] & 0x7))], 4), LSR(Mem(R32[((b[i+2] & 0x7))], 4), (b[i+3])))];
	case 0x6850: return [4, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1), LSR(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1), 1))];
	case 0x6851: return [4, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 4), LSR(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 4), 1))];
	case 0x6852: return [4, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1), LSR(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1), R8[1]))];
	case 0x6853: return [4, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 4), LSR(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 4), R8[1]))];
	case 0x3840: return [4, Mov(Mem(R32[((b[i+2] & 0x7))], 1), ASR(Mem(R32[((b[i+2] & 0x7))], 1), (b[i+3])))];
	case 0x3841: return [4, Mov(Mem(R32[((b[i+2] & 0x7))], 4), ASR(Mem(R32[((b[i+2] & 0x7))], 4), (b[i+3])))];
	case 0x7850: return [4, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1), ASR(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1), 1))];
	case 0x7851: return [4, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 4), ASR(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 4), 1))];
	case 0x7852: return [4, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1), ASR(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1), R8[1]))];
	case 0x7853: return [4, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 4), ASR(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 4), R8[1]))];
	case 0x76: return [4, Mov(F[2], Eq(And(Mem(R32[((b[i+2] & 0x7))], 1), (b[i+3])), 0))];
	case 0x5076: return [4, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1), Not(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1)))];
	case 0x5077: return [4, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 4), Not(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 4)))];
	case 0x5876: return [4, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1), Neg(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1)))];
	case 0x5877: return [4, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 4), Neg(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 4)))];
	case 0x6076: return [4, Mov(R16[0], Mul(R8[0], Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1)))];
	case 0x6077: return [4, Mov(R32[0], Mul(R32[0], Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 4)))];
	case 0x6876: return [4, Mov(R16[0], Mul(R8[0], Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1)))];
	case 0x6877: return [4, Mov(R32[0], Mul(R32[0], Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 4)))];
	case 0x407e: return [4, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1), Add(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1), 1))];
	case 0x407f: return [4, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 4), Add(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 4), 1))];
	case 0x487e: return [4, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1), Add(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1), -1))];
	case 0x487f: return [4, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 4), Add(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 4), -1))];
	case 0x507f: return [4, Mov(R32[4], Add(R32[4], -4)),Mov(Mem(R32[4], 4), Add(R32[8], 4)),Mov(R32[8], Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 4))];
	case 0x607f: return [4, Mov(R32[8], Add(R32[8], 4))];
	case 0x707f: return [4, Mov(R32[4], Add(R32[4], -4)),Mov(Mem(R32[4], 4), Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 4))];
	}
if(((((b[i+0] & 0xf8)>>>3)|(b[i+1]<<5)) & 0x1811) == 0x810)
	switch((b[i+0]|((b[i+1] & 0x3f)<<8)) & 0x3877) {
	case 0x0: return [4, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 1), Add(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 1), (b[i+3])))];
	case 0x2: return [4, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 1), Add(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 1), (b[i+3])))];
	case 0x3: return [4, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 4), Add(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 4), (b[i+3])))];
	case 0x800: return [4, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 1), Or(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 1), (b[i+3])))];
	case 0x802: return [4, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 1), Or(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 1), (b[i+3])))];
	case 0x803: return [4, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 4), Or(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 4), (b[i+3])))];
	case 0x1000: return [4, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 1), Add(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 1), Add((b[i+3]), F[1])))];
	case 0x1002: return [4, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 1), Add(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 1), Add((b[i+3]), F[1])))];
	case 0x1003: return [4, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 4), Add(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 4), Add((b[i+3]), F[1])))];
	case 0x1800: return [4, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 1), Add((b[i+3]), Neg(Add(Add(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 1), Neg(F[1])), 1))))];
	case 0x1802: return [4, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 1), Add((b[i+3]), Neg(Add(Add(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 1), Neg(F[1])), 1))))];
	case 0x1803: return [4, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 4), Add((b[i+3]), Neg(Add(Add(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 4), Neg(F[1])), 1))))];
	case 0x2000: return [4, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 1), And(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 1), (b[i+3])))];
	case 0x2002: return [4, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 1), And(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 1), (b[i+3])))];
	case 0x2003: return [4, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 4), And(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 4), (b[i+3])))];
	case 0x2800: return [4, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 1), Add(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 1), -(b[i+3])))];
	case 0x2802: return [4, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 1), Add(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 1), -(b[i+3])))];
	case 0x2803: return [4, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 4), Add(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 4), -(b[i+3])))];
	case 0x3000: return [4, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 1), Xor(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 1), (b[i+3])))];
	case 0x3002: return [4, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 1), Xor(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 1), (b[i+3])))];
	case 0x3003: return [4, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 4), Xor(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 4), (b[i+3])))];
	case 0x3800: return [4, Mov(F[2], Eq(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 1), (b[i+3]))),Mov(F[1], Lt(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 1), (b[i+3])))];
	case 0x3802: return [4, Mov(F[2], Eq(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 1), (b[i+3]))),Mov(F[1], Lt(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 1), (b[i+3])))];
	case 0x3803: return [4, Mov(F[2], Eq(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 4), (b[i+3]))),Mov(F[1], Lt(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 4), (b[i+3])))];
	case 0x46: return [4, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 1), (b[i+3]))];
	case 0x40: return [4, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 1), ROL(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 1), (b[i+3])))];
	case 0x41: return [4, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 4), ROL(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 4), (b[i+3])))];
	case 0x840: return [4, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 1), ROR(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 1), (b[i+3])))];
	case 0x841: return [4, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 4), ROR(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 4), (b[i+3])))];
	case 0x2040: return [4, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 1), LSL(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 1), (b[i+3])))];
	case 0x2041: return [4, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 4), LSL(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 4), (b[i+3])))];
	case 0x2840: return [4, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 1), LSR(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 1), (b[i+3])))];
	case 0x2841: return [4, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 4), LSR(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 4), (b[i+3])))];
	case 0x3840: return [4, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 1), ASR(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 1), (b[i+3])))];
	case 0x3841: return [4, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 4), ASR(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 4), (b[i+3])))];
	case 0x76: return [4, Mov(F[2], Eq(And(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 1), (b[i+3])), 0))];
	}
if(((((b[i+0] & 0xc0)>>>6)|(b[i+1]<<2)|((b[i+2] & 0x7)<<10)) & 0x1f1d) == 0x1510)
	switch((b[i+0]) & 0xbf) {
	case 0x0: return [4, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 1), Add(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 1), R8[(((b[i+1] & 0x38)>>>3))]))];
	case 0x1: return [4, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 4), Add(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 4), R32[(((b[i+1] & 0x38)>>>3))]))];
	case 0x2: return [4, Mov(R8[(((b[i+1] & 0x38)>>>3))], Add(R8[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 1)))];
	case 0x3: return [4, Mov(R32[(((b[i+1] & 0x38)>>>3))], Add(R32[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 4)))];
	case 0x8: return [4, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 1), Or(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 1), R8[(((b[i+1] & 0x38)>>>3))]))];
	case 0x9: return [4, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 4), Or(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 4), R32[(((b[i+1] & 0x38)>>>3))]))];
	case 0xa: return [4, Mov(R8[(((b[i+1] & 0x38)>>>3))], Or(R8[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 1)))];
	case 0xb: return [4, Mov(R32[(((b[i+1] & 0x38)>>>3))], Or(R32[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 4)))];
	case 0x10: return [4, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 1), Add(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 1), Add(R8[(((b[i+1] & 0x38)>>>3))], F[1])))];
	case 0x11: return [4, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 4), Add(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 4), Add(R32[(((b[i+1] & 0x38)>>>3))], F[1])))];
	case 0x12: return [4, Mov(R8[(((b[i+1] & 0x38)>>>3))], Add(R8[(((b[i+1] & 0x38)>>>3))], Add(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 1), F[1])))];
	case 0x13: return [4, Mov(R32[(((b[i+1] & 0x38)>>>3))], Add(R32[(((b[i+1] & 0x38)>>>3))], Add(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 4), F[1])))];
	case 0x18: return [4, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 1), Add(R8[(((b[i+1] & 0x38)>>>3))], Neg(Add(Add(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 1), Neg(F[1])), 1))))];
	case 0x19: return [4, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 4), Add(R32[(((b[i+1] & 0x38)>>>3))], Neg(Add(Add(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 4), Neg(F[1])), 1))))];
	case 0x1a: return [4, Mov(R8[(((b[i+1] & 0x38)>>>3))], Add(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 1), Neg(Add(Add(R8[(((b[i+1] & 0x38)>>>3))], Neg(F[1])), 1))))];
	case 0x1b: return [4, Mov(R32[(((b[i+1] & 0x38)>>>3))], Add(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 4), Neg(Add(Add(R32[(((b[i+1] & 0x38)>>>3))], Neg(F[1])), 1))))];
	case 0x20: return [4, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 1), And(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 1), R8[(((b[i+1] & 0x38)>>>3))]))];
	case 0x21: return [4, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 4), And(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 4), R32[(((b[i+1] & 0x38)>>>3))]))];
	case 0x22: return [4, Mov(R8[(((b[i+1] & 0x38)>>>3))], And(R8[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 1)))];
	case 0x23: return [4, Mov(R32[(((b[i+1] & 0x38)>>>3))], And(R32[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 4)))];
	case 0x28: return [4, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 1), Add(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 1), Neg(R8[(((b[i+1] & 0x38)>>>3))])))];
	case 0x29: return [4, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 4), Add(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 4), Neg(R32[(((b[i+1] & 0x38)>>>3))])))];
	case 0x2a: return [4, Mov(R8[(((b[i+1] & 0x38)>>>3))], Add(R8[(((b[i+1] & 0x38)>>>3))], Neg(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 1))))];
	case 0x2b: return [4, Mov(R32[(((b[i+1] & 0x38)>>>3))], Add(R32[(((b[i+1] & 0x38)>>>3))], Neg(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 4))))];
	case 0x30: return [4, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 1), Xor(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 1), R8[(((b[i+1] & 0x38)>>>3))]))];
	case 0x31: return [4, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 4), Xor(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 4), R32[(((b[i+1] & 0x38)>>>3))]))];
	case 0x32: return [4, Mov(R8[(((b[i+1] & 0x38)>>>3))], Xor(R8[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 1)))];
	case 0x33: return [4, Mov(R32[(((b[i+1] & 0x38)>>>3))], Xor(R32[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 4)))];
	case 0x38: return [4, Mov(F[2], Eq(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 1), R8[(((b[i+1] & 0x38)>>>3))])),Mov(F[1], Lt(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 1), R8[(((b[i+1] & 0x38)>>>3))]))];
	case 0x39: return [4, Mov(F[2], Eq(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 4), R32[(((b[i+1] & 0x38)>>>3))])),Mov(F[1], Lt(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 4), R32[(((b[i+1] & 0x38)>>>3))]))];
	case 0x3a: return [4, Mov(F[2], Eq(R8[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 1))),Mov(F[1], Lt(R8[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 1)))];
	case 0x3b: return [4, Mov(F[2], Eq(R32[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 4))),Mov(F[1], Lt(R32[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 4)))];
	case 0x84: return [4, Mov(F[2], Eq(And(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 1), R8[(((b[i+1] & 0x38)>>>3))]), 0))];
	case 0x85: return [4, Mov(F[2], Eq(And(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 4), R32[(((b[i+1] & 0x38)>>>3))]), 0))];
	case 0x86: return [4, Swap(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 1), R8[(((b[i+1] & 0x38)>>>3))])];
	case 0x87: return [4, Swap(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 4), R32[(((b[i+1] & 0x38)>>>3))])];
	case 0x88: return [4, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 1), R8[(((b[i+1] & 0x38)>>>3))])];
	case 0x89: return [4, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 4), R32[(((b[i+1] & 0x38)>>>3))])];
	case 0x8a: return [4, Mov(R8[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 1))];
	case 0x8b: return [4, Mov(R32[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 4))];
	case 0x8c: return [4, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 4), RS[(((b[i+1] & 0x38)>>>3))])];
	case 0x8d: return [4, Mov(R32[(((b[i+1] & 0x38)>>>3))], Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))))];
	case 0x8e: return [4, Mov(RS[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 2))];
	}
if(((((b[i+0] & 0xc0)>>>6)|(b[i+1]<<2)|((b[i+2] & 0x3f)<<10)) & 0xe31d) == 0x8110)
	switch((b[i+0]) & 0xbf) {
	case 0x0: return [4, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1), Add(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1), R8[(((b[i+1] & 0x38)>>>3))]))];
	case 0x1: return [4, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 4), Add(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 4), R32[(((b[i+1] & 0x38)>>>3))]))];
	case 0x2: return [4, Mov(R8[(((b[i+1] & 0x38)>>>3))], Add(R8[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1)))];
	case 0x3: return [4, Mov(R32[(((b[i+1] & 0x38)>>>3))], Add(R32[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 4)))];
	case 0x8: return [4, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1), Or(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1), R8[(((b[i+1] & 0x38)>>>3))]))];
	case 0x9: return [4, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 4), Or(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 4), R32[(((b[i+1] & 0x38)>>>3))]))];
	case 0xa: return [4, Mov(R8[(((b[i+1] & 0x38)>>>3))], Or(R8[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1)))];
	case 0xb: return [4, Mov(R32[(((b[i+1] & 0x38)>>>3))], Or(R32[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 4)))];
	case 0x10: return [4, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1), Add(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1), Add(R8[(((b[i+1] & 0x38)>>>3))], F[1])))];
	case 0x11: return [4, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 4), Add(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 4), Add(R32[(((b[i+1] & 0x38)>>>3))], F[1])))];
	case 0x12: return [4, Mov(R8[(((b[i+1] & 0x38)>>>3))], Add(R8[(((b[i+1] & 0x38)>>>3))], Add(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1), F[1])))];
	case 0x13: return [4, Mov(R32[(((b[i+1] & 0x38)>>>3))], Add(R32[(((b[i+1] & 0x38)>>>3))], Add(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 4), F[1])))];
	case 0x18: return [4, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1), Add(R8[(((b[i+1] & 0x38)>>>3))], Neg(Add(Add(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1), Neg(F[1])), 1))))];
	case 0x19: return [4, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 4), Add(R32[(((b[i+1] & 0x38)>>>3))], Neg(Add(Add(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 4), Neg(F[1])), 1))))];
	case 0x1a: return [4, Mov(R8[(((b[i+1] & 0x38)>>>3))], Add(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1), Neg(Add(Add(R8[(((b[i+1] & 0x38)>>>3))], Neg(F[1])), 1))))];
	case 0x1b: return [4, Mov(R32[(((b[i+1] & 0x38)>>>3))], Add(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 4), Neg(Add(Add(R32[(((b[i+1] & 0x38)>>>3))], Neg(F[1])), 1))))];
	case 0x20: return [4, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1), And(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1), R8[(((b[i+1] & 0x38)>>>3))]))];
	case 0x21: return [4, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 4), And(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 4), R32[(((b[i+1] & 0x38)>>>3))]))];
	case 0x22: return [4, Mov(R8[(((b[i+1] & 0x38)>>>3))], And(R8[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1)))];
	case 0x23: return [4, Mov(R32[(((b[i+1] & 0x38)>>>3))], And(R32[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 4)))];
	case 0x28: return [4, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1), Add(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1), Neg(R8[(((b[i+1] & 0x38)>>>3))])))];
	case 0x29: return [4, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 4), Add(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 4), Neg(R32[(((b[i+1] & 0x38)>>>3))])))];
	case 0x2a: return [4, Mov(R8[(((b[i+1] & 0x38)>>>3))], Add(R8[(((b[i+1] & 0x38)>>>3))], Neg(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1))))];
	case 0x2b: return [4, Mov(R32[(((b[i+1] & 0x38)>>>3))], Add(R32[(((b[i+1] & 0x38)>>>3))], Neg(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 4))))];
	case 0x30: return [4, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1), Xor(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1), R8[(((b[i+1] & 0x38)>>>3))]))];
	case 0x31: return [4, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 4), Xor(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 4), R32[(((b[i+1] & 0x38)>>>3))]))];
	case 0x32: return [4, Mov(R8[(((b[i+1] & 0x38)>>>3))], Xor(R8[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1)))];
	case 0x33: return [4, Mov(R32[(((b[i+1] & 0x38)>>>3))], Xor(R32[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 4)))];
	case 0x38: return [4, Mov(F[2], Eq(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1), R8[(((b[i+1] & 0x38)>>>3))])),Mov(F[1], Lt(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1), R8[(((b[i+1] & 0x38)>>>3))]))];
	case 0x39: return [4, Mov(F[2], Eq(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 4), R32[(((b[i+1] & 0x38)>>>3))])),Mov(F[1], Lt(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 4), R32[(((b[i+1] & 0x38)>>>3))]))];
	case 0x3a: return [4, Mov(F[2], Eq(R8[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1))),Mov(F[1], Lt(R8[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1)))];
	case 0x3b: return [4, Mov(F[2], Eq(R32[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 4))),Mov(F[1], Lt(R32[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 4)))];
	case 0x84: return [4, Mov(F[2], Eq(And(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1), R8[(((b[i+1] & 0x38)>>>3))]), 0))];
	case 0x85: return [4, Mov(F[2], Eq(And(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 4), R32[(((b[i+1] & 0x38)>>>3))]), 0))];
	case 0x86: return [4, Swap(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1), R8[(((b[i+1] & 0x38)>>>3))])];
	case 0x87: return [4, Swap(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 4), R32[(((b[i+1] & 0x38)>>>3))])];
	case 0x88: return [4, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1), R8[(((b[i+1] & 0x38)>>>3))])];
	case 0x89: return [4, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 4), R32[(((b[i+1] & 0x38)>>>3))])];
	case 0x8a: return [4, Mov(R8[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1))];
	case 0x8b: return [4, Mov(R32[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 4))];
	case 0x8c: return [4, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 4), RS[(((b[i+1] & 0x38)>>>3))])];
	case 0x8d: return [4, Mov(R32[(((b[i+1] & 0x38)>>>3))], Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)))];
	case 0x8e: return [4, Mov(RS[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 2))];
	}
if(((((b[i+0] & 0x80)>>>7)|(b[i+1]<<1)) & 0x10f) == 0x9)
	switch((b[i+0]|((b[i+1] & 0x7f)<<8)) & 0x787f) {
	case 0x0: return [4, Mov(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 1), Add(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 1), (b[i+3])))];
	case 0x2: return [4, Mov(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 1), Add(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 1), (b[i+3])))];
	case 0x3: return [4, Mov(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 4), Add(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 4), (b[i+3])))];
	case 0x800: return [4, Mov(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 1), Or(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 1), (b[i+3])))];
	case 0x802: return [4, Mov(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 1), Or(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 1), (b[i+3])))];
	case 0x803: return [4, Mov(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 4), Or(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 4), (b[i+3])))];
	case 0x1000: return [4, Mov(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 1), Add(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 1), Add((b[i+3]), F[1])))];
	case 0x1002: return [4, Mov(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 1), Add(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 1), Add((b[i+3]), F[1])))];
	case 0x1003: return [4, Mov(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 4), Add(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 4), Add((b[i+3]), F[1])))];
	case 0x1800: return [4, Mov(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 1), Add((b[i+3]), Neg(Add(Add(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 1), Neg(F[1])), 1))))];
	case 0x1802: return [4, Mov(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 1), Add((b[i+3]), Neg(Add(Add(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 1), Neg(F[1])), 1))))];
	case 0x1803: return [4, Mov(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 4), Add((b[i+3]), Neg(Add(Add(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 4), Neg(F[1])), 1))))];
	case 0x2000: return [4, Mov(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 1), And(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 1), (b[i+3])))];
	case 0x2002: return [4, Mov(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 1), And(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 1), (b[i+3])))];
	case 0x2003: return [4, Mov(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 4), And(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 4), (b[i+3])))];
	case 0x2800: return [4, Mov(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 1), Add(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 1), -(b[i+3])))];
	case 0x2802: return [4, Mov(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 1), Add(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 1), -(b[i+3])))];
	case 0x2803: return [4, Mov(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 4), Add(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 4), -(b[i+3])))];
	case 0x3000: return [4, Mov(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 1), Xor(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 1), (b[i+3])))];
	case 0x3002: return [4, Mov(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 1), Xor(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 1), (b[i+3])))];
	case 0x3003: return [4, Mov(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 4), Xor(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 4), (b[i+3])))];
	case 0x3800: return [4, Mov(F[2], Eq(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 1), (b[i+3]))),Mov(F[1], Lt(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 1), (b[i+3])))];
	case 0x3802: return [4, Mov(F[2], Eq(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 1), (b[i+3]))),Mov(F[1], Lt(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 1), (b[i+3])))];
	case 0x3803: return [4, Mov(F[2], Eq(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 4), (b[i+3]))),Mov(F[1], Lt(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 4), (b[i+3])))];
	case 0x400f: return [4, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 4), Mem(R32[4], 4)),Mov(R32[4], Add(R32[4], 4))];
	case 0x46: return [4, Mov(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 1), (b[i+3]))];
	case 0x40: return [4, Mov(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 1), ROL(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 1), (b[i+3])))];
	case 0x41: return [4, Mov(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 4), ROL(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 4), (b[i+3])))];
	case 0x4050: return [4, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 1), ROL(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 1), 1))];
	case 0x4051: return [4, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 4), ROL(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 4), 1))];
	case 0x4052: return [4, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 1), ROL(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 1), R8[1]))];
	case 0x4053: return [4, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 4), ROL(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 4), R8[1]))];
	case 0x840: return [4, Mov(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 1), ROR(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 1), (b[i+3])))];
	case 0x841: return [4, Mov(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 4), ROR(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 4), (b[i+3])))];
	case 0x4850: return [4, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 1), ROR(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 1), 1))];
	case 0x4851: return [4, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 4), ROR(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 4), 1))];
	case 0x4852: return [4, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 1), ROR(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 1), R8[1]))];
	case 0x4853: return [4, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 4), ROR(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 4), R8[1]))];
	case 0x2040: return [4, Mov(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 1), LSL(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 1), (b[i+3])))];
	case 0x2041: return [4, Mov(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 4), LSL(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 4), (b[i+3])))];
	case 0x6050: return [4, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 1), LSL(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 1), 1))];
	case 0x6051: return [4, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 4), LSL(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 4), 1))];
	case 0x6052: return [4, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 1), LSL(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 1), R8[1]))];
	case 0x6053: return [4, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 4), LSL(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 4), R8[1]))];
	case 0x2840: return [4, Mov(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 1), LSR(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 1), (b[i+3])))];
	case 0x2841: return [4, Mov(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 4), LSR(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 4), (b[i+3])))];
	case 0x6850: return [4, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 1), LSR(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 1), 1))];
	case 0x6851: return [4, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 4), LSR(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 4), 1))];
	case 0x6852: return [4, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 1), LSR(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 1), R8[1]))];
	case 0x6853: return [4, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 4), LSR(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 4), R8[1]))];
	case 0x3840: return [4, Mov(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 1), ASR(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 1), (b[i+3])))];
	case 0x3841: return [4, Mov(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 4), ASR(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 4), (b[i+3])))];
	case 0x7850: return [4, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 1), ASR(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 1), 1))];
	case 0x7851: return [4, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 4), ASR(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 4), 1))];
	case 0x7852: return [4, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 1), ASR(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 1), R8[1]))];
	case 0x7853: return [4, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 4), ASR(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 4), R8[1]))];
	case 0x76: return [4, Mov(F[2], Eq(And(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 1), (b[i+3])), 0))];
	case 0x5076: return [4, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 1), Not(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 1)))];
	case 0x5077: return [4, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 4), Not(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 4)))];
	case 0x5876: return [4, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 1), Neg(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 1)))];
	case 0x5877: return [4, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 4), Neg(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 4)))];
	case 0x6076: return [4, Mov(R16[0], Mul(R8[0], Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 1)))];
	case 0x6077: return [4, Mov(R32[0], Mul(R32[0], Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 4)))];
	case 0x6876: return [4, Mov(R16[0], Mul(R8[0], Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 1)))];
	case 0x6877: return [4, Mov(R32[0], Mul(R32[0], Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 4)))];
	case 0x407e: return [4, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 1), Add(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 1), 1))];
	case 0x407f: return [4, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 4), Add(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 4), 1))];
	case 0x487e: return [4, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 1), Add(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 1), -1))];
	case 0x487f: return [4, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 4), Add(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 4), -1))];
	case 0x507f: return [4, Mov(R32[4], Add(R32[4], -4)),Mov(Mem(R32[4], 4), Add(R32[8], 4)),Mov(R32[8], Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 4))];
	case 0x607f: return [4, Mov(R32[8], Add(R32[8], 4))];
	case 0x707f: return [4, Mov(R32[4], Add(R32[4], -4)),Mov(Mem(R32[4], 4), Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 4))];
	}
if(((((b[i+0] & 0x80)>>>7)|(b[i+1]<<1)|((b[i+2] & 0x7)<<9)) & 0xf8f) == 0xa89)
	switch((b[i+0]|((b[i+1] & 0x3f)<<8)) & 0x387f) {
	case 0xf: return [4, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 4), Mem(R32[4], 4)),Mov(R32[4], Add(R32[4], 4))];
	case 0x50: return [4, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 1), ROL(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 1), 1))];
	case 0x51: return [4, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 4), ROL(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 4), 1))];
	case 0x52: return [4, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 1), ROL(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 1), R8[1]))];
	case 0x53: return [4, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 4), ROL(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 4), R8[1]))];
	case 0x850: return [4, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 1), ROR(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 1), 1))];
	case 0x851: return [4, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 4), ROR(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 4), 1))];
	case 0x852: return [4, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 1), ROR(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 1), R8[1]))];
	case 0x853: return [4, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 4), ROR(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 4), R8[1]))];
	case 0x2050: return [4, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 1), LSL(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 1), 1))];
	case 0x2051: return [4, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 4), LSL(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 4), 1))];
	case 0x2052: return [4, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 1), LSL(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 1), R8[1]))];
	case 0x2053: return [4, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 4), LSL(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 4), R8[1]))];
	case 0x2850: return [4, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 1), LSR(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 1), 1))];
	case 0x2851: return [4, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 4), LSR(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 4), 1))];
	case 0x2852: return [4, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 1), LSR(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 1), R8[1]))];
	case 0x2853: return [4, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 4), LSR(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 4), R8[1]))];
	case 0x3850: return [4, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 1), ASR(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 1), 1))];
	case 0x3851: return [4, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 4), ASR(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 4), 1))];
	case 0x3852: return [4, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 1), ASR(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 1), R8[1]))];
	case 0x3853: return [4, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 4), ASR(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 4), R8[1]))];
	case 0x1076: return [4, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 1), Not(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 1)))];
	case 0x1077: return [4, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 4), Not(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 4)))];
	case 0x1876: return [4, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 1), Neg(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 1)))];
	case 0x1877: return [4, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 4), Neg(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 4)))];
	case 0x2076: return [4, Mov(R16[0], Mul(R8[0], Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 1)))];
	case 0x2077: return [4, Mov(R32[0], Mul(R32[0], Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 4)))];
	case 0x2876: return [4, Mov(R16[0], Mul(R8[0], Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 1)))];
	case 0x2877: return [4, Mov(R32[0], Mul(R32[0], Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 4)))];
	case 0x7e: return [4, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 1), Add(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 1), 1))];
	case 0x7f: return [4, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 4), Add(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 4), 1))];
	case 0x87e: return [4, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 1), Add(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 1), -1))];
	case 0x87f: return [4, Mov(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 4), Add(Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 4), -1))];
	case 0x107f: return [4, Mov(R32[4], Add(R32[4], -4)),Mov(Mem(R32[4], 4), Add(R32[8], 4)),Mov(R32[8], Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 4))];
	case 0x207f: return [4, Mov(R32[8], Add(R32[8], 4))];
	case 0x307f: return [4, Mov(R32[4], Add(R32[4], -4)),Mov(Mem(R32[4], 4), Mem(Add(R32[5], Add(LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6))), (((b[i+3]) << 24) >> 24))), 4))];
	}
if(((((b[i+0] & 0xc0)>>>6)|(b[i+1]<<2)) & 0x31d) == 0x110)
	switch((b[i+0]) & 0xbf) {
	case 0x0: return [4, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 1), Add(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 1), R8[(((b[i+1] & 0x38)>>>3))]))];
	case 0x1: return [4, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 4), Add(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 4), R32[(((b[i+1] & 0x38)>>>3))]))];
	case 0x2: return [4, Mov(R8[(((b[i+1] & 0x38)>>>3))], Add(R8[(((b[i+1] & 0x38)>>>3))], Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 1)))];
	case 0x3: return [4, Mov(R32[(((b[i+1] & 0x38)>>>3))], Add(R32[(((b[i+1] & 0x38)>>>3))], Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 4)))];
	case 0x8: return [4, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 1), Or(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 1), R8[(((b[i+1] & 0x38)>>>3))]))];
	case 0x9: return [4, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 4), Or(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 4), R32[(((b[i+1] & 0x38)>>>3))]))];
	case 0xa: return [4, Mov(R8[(((b[i+1] & 0x38)>>>3))], Or(R8[(((b[i+1] & 0x38)>>>3))], Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 1)))];
	case 0xb: return [4, Mov(R32[(((b[i+1] & 0x38)>>>3))], Or(R32[(((b[i+1] & 0x38)>>>3))], Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 4)))];
	case 0x10: return [4, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 1), Add(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 1), Add(R8[(((b[i+1] & 0x38)>>>3))], F[1])))];
	case 0x11: return [4, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 4), Add(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 4), Add(R32[(((b[i+1] & 0x38)>>>3))], F[1])))];
	case 0x12: return [4, Mov(R8[(((b[i+1] & 0x38)>>>3))], Add(R8[(((b[i+1] & 0x38)>>>3))], Add(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 1), F[1])))];
	case 0x13: return [4, Mov(R32[(((b[i+1] & 0x38)>>>3))], Add(R32[(((b[i+1] & 0x38)>>>3))], Add(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 4), F[1])))];
	case 0x18: return [4, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 1), Add(R8[(((b[i+1] & 0x38)>>>3))], Neg(Add(Add(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 1), Neg(F[1])), 1))))];
	case 0x19: return [4, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 4), Add(R32[(((b[i+1] & 0x38)>>>3))], Neg(Add(Add(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 4), Neg(F[1])), 1))))];
	case 0x1a: return [4, Mov(R8[(((b[i+1] & 0x38)>>>3))], Add(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 1), Neg(Add(Add(R8[(((b[i+1] & 0x38)>>>3))], Neg(F[1])), 1))))];
	case 0x1b: return [4, Mov(R32[(((b[i+1] & 0x38)>>>3))], Add(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 4), Neg(Add(Add(R32[(((b[i+1] & 0x38)>>>3))], Neg(F[1])), 1))))];
	case 0x20: return [4, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 1), And(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 1), R8[(((b[i+1] & 0x38)>>>3))]))];
	case 0x21: return [4, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 4), And(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 4), R32[(((b[i+1] & 0x38)>>>3))]))];
	case 0x22: return [4, Mov(R8[(((b[i+1] & 0x38)>>>3))], And(R8[(((b[i+1] & 0x38)>>>3))], Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 1)))];
	case 0x23: return [4, Mov(R32[(((b[i+1] & 0x38)>>>3))], And(R32[(((b[i+1] & 0x38)>>>3))], Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 4)))];
	case 0x28: return [4, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 1), Add(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 1), Neg(R8[(((b[i+1] & 0x38)>>>3))])))];
	case 0x29: return [4, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 4), Add(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 4), Neg(R32[(((b[i+1] & 0x38)>>>3))])))];
	case 0x2a: return [4, Mov(R8[(((b[i+1] & 0x38)>>>3))], Add(R8[(((b[i+1] & 0x38)>>>3))], Neg(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 1))))];
	case 0x2b: return [4, Mov(R32[(((b[i+1] & 0x38)>>>3))], Add(R32[(((b[i+1] & 0x38)>>>3))], Neg(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 4))))];
	case 0x30: return [4, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 1), Xor(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 1), R8[(((b[i+1] & 0x38)>>>3))]))];
	case 0x31: return [4, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 4), Xor(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 4), R32[(((b[i+1] & 0x38)>>>3))]))];
	case 0x32: return [4, Mov(R8[(((b[i+1] & 0x38)>>>3))], Xor(R8[(((b[i+1] & 0x38)>>>3))], Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 1)))];
	case 0x33: return [4, Mov(R32[(((b[i+1] & 0x38)>>>3))], Xor(R32[(((b[i+1] & 0x38)>>>3))], Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 4)))];
	case 0x38: return [4, Mov(F[2], Eq(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 1), R8[(((b[i+1] & 0x38)>>>3))])),Mov(F[1], Lt(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 1), R8[(((b[i+1] & 0x38)>>>3))]))];
	case 0x39: return [4, Mov(F[2], Eq(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 4), R32[(((b[i+1] & 0x38)>>>3))])),Mov(F[1], Lt(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 4), R32[(((b[i+1] & 0x38)>>>3))]))];
	case 0x3a: return [4, Mov(F[2], Eq(R8[(((b[i+1] & 0x38)>>>3))], Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 1))),Mov(F[1], Lt(R8[(((b[i+1] & 0x38)>>>3))], Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 1)))];
	case 0x3b: return [4, Mov(F[2], Eq(R32[(((b[i+1] & 0x38)>>>3))], Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 4))),Mov(F[1], Lt(R32[(((b[i+1] & 0x38)>>>3))], Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 4)))];
	case 0x84: return [4, Mov(F[2], Eq(And(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 1), R8[(((b[i+1] & 0x38)>>>3))]), 0))];
	case 0x85: return [4, Mov(F[2], Eq(And(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 4), R32[(((b[i+1] & 0x38)>>>3))]), 0))];
	case 0x86: return [4, Swap(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 1), R8[(((b[i+1] & 0x38)>>>3))])];
	case 0x87: return [4, Swap(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 4), R32[(((b[i+1] & 0x38)>>>3))])];
	case 0x88: return [4, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 1), R8[(((b[i+1] & 0x38)>>>3))])];
	case 0x89: return [4, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 4), R32[(((b[i+1] & 0x38)>>>3))])];
	case 0x8a: return [4, Mov(R8[(((b[i+1] & 0x38)>>>3))], Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 1))];
	case 0x8b: return [4, Mov(R32[(((b[i+1] & 0x38)>>>3))], Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 4))];
	case 0x8c: return [4, Mov(Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 4), RS[(((b[i+1] & 0x38)>>>3))])];
	case 0x8d: return [4, Mov(R32[(((b[i+1] & 0x38)>>>3))], Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)))];
	case 0x8e: return [4, Mov(RS[(((b[i+1] & 0x38)>>>3))], Mem(Add(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), (((b[i+3]) << 24) >> 24)), 2))];
	}
if(((b[i+0]|(b[i+1]<<8)|(b[i+2]<<16)|((b[i+3] & 0x3f)<<24)) & 0x38c7c0ff) == 0x2004800f)
	switch(((b[i+1] & 0x3f)) & 0x3f) {
	case 0x10: return [4, Mov(Mem(R32[((b[i+3] & 0x7))], 1), F[0])];
	case 0x11: return [4, Mov(Mem(R32[((b[i+3] & 0x7))], 1), Not(F[0]))];
	case 0x12: return [4, Mov(Mem(R32[((b[i+3] & 0x7))], 1), F[1])];
	case 0x13: return [4, Mov(Mem(R32[((b[i+3] & 0x7))], 1), Not(F[1]))];
	case 0x14: return [4, Mov(Mem(R32[((b[i+3] & 0x7))], 1), F[2])];
	case 0x15: return [4, Mov(Mem(R32[((b[i+3] & 0x7))], 1), Not(F[2]))];
	case 0x16: return [4, Mov(Mem(R32[((b[i+3] & 0x7))], 1), Or(F[1], F[2]))];
	case 0x17: return [4, Mov(Mem(R32[((b[i+3] & 0x7))], 1), And(Not(F[1]), Not(F[2])))];
	case 0x18: return [4, Mov(Mem(R32[((b[i+3] & 0x7))], 1), F[3])];
	case 0x19: return [4, Mov(Mem(R32[((b[i+3] & 0x7))], 1), Not(F[3]))];
	case 0x1a: return [4, Mov(Mem(R32[((b[i+3] & 0x7))], 1), F[4])];
	case 0x1b: return [4, Mov(Mem(R32[((b[i+3] & 0x7))], 1), Not(F[4]))];
	case 0x1c: return [4, Mov(Mem(R32[((b[i+3] & 0x7))], 1), Not(Eq(F[0], F[3])))];
	case 0x1d: return [4, Mov(Mem(R32[((b[i+3] & 0x7))], 1), Eq(F[0], F[3]))];
	case 0x1e: return [4, Mov(Mem(R32[((b[i+3] & 0x7))], 1), Or(F[2], Not(Eq(F[0], F[3]))))];
	case 0x1f: return [4, Mov(Mem(R32[((b[i+3] & 0x7))], 1), And(Not(F[2]), Eq(F[0], F[3])))];
	case 0x2d: return [4, Mov(Mem(R32[((b[i+3] & 0x7))], 4), Or(LSR(Mem(R32[((b[i+3] & 0x7))], 4), R8[1]), And(R32[(((b[i+2] & 0x38)>>>3))], LSL(Add(LSL(1, R8[1]), -1), Add(32, Neg(R8[1]))))))];
	case 0x36: return [4, Mov(R32[(((b[i+2] & 0x38)>>>3))], Mem(R32[((b[i+3] & 0x7))], 1))];
	case 0x37: return [4, Mov(R32[(((b[i+2] & 0x38)>>>3))], Mem(R32[((b[i+3] & 0x7))], 2))];
	}
if(((b[i+0]|(b[i+1]<<8)|(b[i+2]<<16)) & 0xc7c0ff) == 0x4800f)
	switch(((b[i+1] & 0x3f)) & 0x3f) {
	case 0x10: return [4, Mov(Mem(Add(R32[((b[i+3] & 0x7))], LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), 1), F[0])];
	case 0x11: return [4, Mov(Mem(Add(R32[((b[i+3] & 0x7))], LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), 1), Not(F[0]))];
	case 0x12: return [4, Mov(Mem(Add(R32[((b[i+3] & 0x7))], LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), 1), F[1])];
	case 0x13: return [4, Mov(Mem(Add(R32[((b[i+3] & 0x7))], LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), 1), Not(F[1]))];
	case 0x14: return [4, Mov(Mem(Add(R32[((b[i+3] & 0x7))], LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), 1), F[2])];
	case 0x15: return [4, Mov(Mem(Add(R32[((b[i+3] & 0x7))], LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), 1), Not(F[2]))];
	case 0x16: return [4, Mov(Mem(Add(R32[((b[i+3] & 0x7))], LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), 1), Or(F[1], F[2]))];
	case 0x17: return [4, Mov(Mem(Add(R32[((b[i+3] & 0x7))], LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), 1), And(Not(F[1]), Not(F[2])))];
	case 0x18: return [4, Mov(Mem(Add(R32[((b[i+3] & 0x7))], LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), 1), F[3])];
	case 0x19: return [4, Mov(Mem(Add(R32[((b[i+3] & 0x7))], LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), 1), Not(F[3]))];
	case 0x1a: return [4, Mov(Mem(Add(R32[((b[i+3] & 0x7))], LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), 1), F[4])];
	case 0x1b: return [4, Mov(Mem(Add(R32[((b[i+3] & 0x7))], LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), 1), Not(F[4]))];
	case 0x1c: return [4, Mov(Mem(Add(R32[((b[i+3] & 0x7))], LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), 1), Not(Eq(F[0], F[3])))];
	case 0x1d: return [4, Mov(Mem(Add(R32[((b[i+3] & 0x7))], LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), 1), Eq(F[0], F[3]))];
	case 0x1e: return [4, Mov(Mem(Add(R32[((b[i+3] & 0x7))], LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), 1), Or(F[2], Not(Eq(F[0], F[3]))))];
	case 0x1f: return [4, Mov(Mem(Add(R32[((b[i+3] & 0x7))], LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), 1), And(Not(F[2]), Eq(F[0], F[3])))];
	case 0x2d: return [4, Mov(Mem(Add(R32[((b[i+3] & 0x7))], LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), 4), Or(LSR(Mem(Add(R32[((b[i+3] & 0x7))], LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), 4), R8[1]), And(R32[(((b[i+2] & 0x38)>>>3))], LSL(Add(LSL(1, R8[1]), -1), Add(32, Neg(R8[1]))))))];
	case 0x36: return [4, Mov(R32[(((b[i+2] & 0x38)>>>3))], Mem(Add(R32[((b[i+3] & 0x7))], LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), 1))];
	case 0x37: return [4, Mov(R32[(((b[i+2] & 0x38)>>>3))], Mem(Add(R32[((b[i+3] & 0x7))], LSL(R32[(((b[i+3] & 0x38)>>>3))], (((b[i+3] & 0xc0)>>>6)))), 2))];
	}
if(((b[i+0]|(b[i+1]<<8)) & 0xc0ff) == 0x800f)
	switch((b[i+1]|(b[i+2]<<8)) & 0xc03f) {
	case 0x4010: return [4, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1), F[0])];
	case 0x4011: return [4, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1), Not(F[0]))];
	case 0x4012: return [4, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1), F[1])];
	case 0x4013: return [4, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1), Not(F[1]))];
	case 0x4014: return [4, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1), F[2])];
	case 0x4015: return [4, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1), Not(F[2]))];
	case 0x4016: return [4, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1), Or(F[1], F[2]))];
	case 0x4017: return [4, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1), And(Not(F[1]), Not(F[2])))];
	case 0x4018: return [4, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1), F[3])];
	case 0x4019: return [4, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1), Not(F[3]))];
	case 0x401a: return [4, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1), F[4])];
	case 0x401b: return [4, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1), Not(F[4]))];
	case 0x401c: return [4, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1), Not(Eq(F[0], F[3])))];
	case 0x401d: return [4, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1), Eq(F[0], F[3]))];
	case 0x401e: return [4, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1), Or(F[2], Not(Eq(F[0], F[3]))))];
	case 0x401f: return [4, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1), And(Not(F[2]), Eq(F[0], F[3])))];
	case 0x2c: return [4, Mov(Mem(R32[((b[i+2] & 0x7))], 4), Or(LSR(Mem(R32[((b[i+2] & 0x7))], 4), (b[i+3])), And(R32[(((b[i+2] & 0x38)>>>3))], (((1 << (b[i+3])) + -1) << (32 + -(b[i+3]))))))];
	case 0xc02c: return [4, Mov(R32[((b[i+2] & 0x7))], Or(LSR(R32[((b[i+2] & 0x7))], (b[i+3])), And(R32[(((b[i+2] & 0x38)>>>3))], (((1 << (b[i+3])) + -1) << (32 + -(b[i+3]))))))];
	case 0x402d: return [4, Mov(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 4), Or(LSR(Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 4), R8[1]), And(R32[(((b[i+2] & 0x38)>>>3))], LSL(Add(LSL(1, R8[1]), -1), Add(32, Neg(R8[1]))))))];
	case 0x4036: return [4, Mov(R32[(((b[i+2] & 0x38)>>>3))], Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 1))];
	case 0x4037: return [4, Mov(R32[(((b[i+2] & 0x38)>>>3))], Mem(Add(R32[((b[i+2] & 0x7))], (((b[i+3]) << 24) >> 24)), 2))];
	}
if(((((b[i+0] & 0x80)>>>7)|(b[i+1]<<1)|((b[i+2] & 0x3f)<<9)) & 0x718f) == 0x4009)
	switch((b[i+0]|((b[i+1] & 0x3f)<<8)) & 0x387f) {
	case 0xf: return [3, Mov(Mem(R32[((b[i+2] & 0x7))], 4), Mem(R32[4], 4)),Mov(R32[4], Add(R32[4], 4))];
	case 0x50: return [3, Mov(Mem(R32[((b[i+2] & 0x7))], 1), ROL(Mem(R32[((b[i+2] & 0x7))], 1), 1))];
	case 0x51: return [3, Mov(Mem(R32[((b[i+2] & 0x7))], 4), ROL(Mem(R32[((b[i+2] & 0x7))], 4), 1))];
	case 0x52: return [3, Mov(Mem(R32[((b[i+2] & 0x7))], 1), ROL(Mem(R32[((b[i+2] & 0x7))], 1), R8[1]))];
	case 0x53: return [3, Mov(Mem(R32[((b[i+2] & 0x7))], 4), ROL(Mem(R32[((b[i+2] & 0x7))], 4), R8[1]))];
	case 0x850: return [3, Mov(Mem(R32[((b[i+2] & 0x7))], 1), ROR(Mem(R32[((b[i+2] & 0x7))], 1), 1))];
	case 0x851: return [3, Mov(Mem(R32[((b[i+2] & 0x7))], 4), ROR(Mem(R32[((b[i+2] & 0x7))], 4), 1))];
	case 0x852: return [3, Mov(Mem(R32[((b[i+2] & 0x7))], 1), ROR(Mem(R32[((b[i+2] & 0x7))], 1), R8[1]))];
	case 0x853: return [3, Mov(Mem(R32[((b[i+2] & 0x7))], 4), ROR(Mem(R32[((b[i+2] & 0x7))], 4), R8[1]))];
	case 0x2050: return [3, Mov(Mem(R32[((b[i+2] & 0x7))], 1), LSL(Mem(R32[((b[i+2] & 0x7))], 1), 1))];
	case 0x2051: return [3, Mov(Mem(R32[((b[i+2] & 0x7))], 4), LSL(Mem(R32[((b[i+2] & 0x7))], 4), 1))];
	case 0x2052: return [3, Mov(Mem(R32[((b[i+2] & 0x7))], 1), LSL(Mem(R32[((b[i+2] & 0x7))], 1), R8[1]))];
	case 0x2053: return [3, Mov(Mem(R32[((b[i+2] & 0x7))], 4), LSL(Mem(R32[((b[i+2] & 0x7))], 4), R8[1]))];
	case 0x2850: return [3, Mov(Mem(R32[((b[i+2] & 0x7))], 1), LSR(Mem(R32[((b[i+2] & 0x7))], 1), 1))];
	case 0x2851: return [3, Mov(Mem(R32[((b[i+2] & 0x7))], 4), LSR(Mem(R32[((b[i+2] & 0x7))], 4), 1))];
	case 0x2852: return [3, Mov(Mem(R32[((b[i+2] & 0x7))], 1), LSR(Mem(R32[((b[i+2] & 0x7))], 1), R8[1]))];
	case 0x2853: return [3, Mov(Mem(R32[((b[i+2] & 0x7))], 4), LSR(Mem(R32[((b[i+2] & 0x7))], 4), R8[1]))];
	case 0x3850: return [3, Mov(Mem(R32[((b[i+2] & 0x7))], 1), ASR(Mem(R32[((b[i+2] & 0x7))], 1), 1))];
	case 0x3851: return [3, Mov(Mem(R32[((b[i+2] & 0x7))], 4), ASR(Mem(R32[((b[i+2] & 0x7))], 4), 1))];
	case 0x3852: return [3, Mov(Mem(R32[((b[i+2] & 0x7))], 1), ASR(Mem(R32[((b[i+2] & 0x7))], 1), R8[1]))];
	case 0x3853: return [3, Mov(Mem(R32[((b[i+2] & 0x7))], 4), ASR(Mem(R32[((b[i+2] & 0x7))], 4), R8[1]))];
	case 0x1076: return [3, Mov(Mem(R32[((b[i+2] & 0x7))], 1), Not(Mem(R32[((b[i+2] & 0x7))], 1)))];
	case 0x1077: return [3, Mov(Mem(R32[((b[i+2] & 0x7))], 4), Not(Mem(R32[((b[i+2] & 0x7))], 4)))];
	case 0x1876: return [3, Mov(Mem(R32[((b[i+2] & 0x7))], 1), Neg(Mem(R32[((b[i+2] & 0x7))], 1)))];
	case 0x1877: return [3, Mov(Mem(R32[((b[i+2] & 0x7))], 4), Neg(Mem(R32[((b[i+2] & 0x7))], 4)))];
	case 0x2076: return [3, Mov(R16[0], Mul(R8[0], Mem(R32[((b[i+2] & 0x7))], 1)))];
	case 0x2077: return [3, Mov(R32[0], Mul(R32[0], Mem(R32[((b[i+2] & 0x7))], 4)))];
	case 0x2876: return [3, Mov(R16[0], Mul(R8[0], Mem(R32[((b[i+2] & 0x7))], 1)))];
	case 0x2877: return [3, Mov(R32[0], Mul(R32[0], Mem(R32[((b[i+2] & 0x7))], 4)))];
	case 0x7e: return [3, Mov(Mem(R32[((b[i+2] & 0x7))], 1), Add(Mem(R32[((b[i+2] & 0x7))], 1), 1))];
	case 0x7f: return [3, Mov(Mem(R32[((b[i+2] & 0x7))], 4), Add(Mem(R32[((b[i+2] & 0x7))], 4), 1))];
	case 0x87e: return [3, Mov(Mem(R32[((b[i+2] & 0x7))], 1), Add(Mem(R32[((b[i+2] & 0x7))], 1), -1))];
	case 0x87f: return [3, Mov(Mem(R32[((b[i+2] & 0x7))], 4), Add(Mem(R32[((b[i+2] & 0x7))], 4), -1))];
	case 0x107f: return [3, Mov(R32[4], Add(R32[4], -4)),Mov(Mem(R32[4], 4), Add(R32[8], 3)),Mov(R32[8], Mem(R32[((b[i+2] & 0x7))], 4))];
	case 0x207f: return [3, Mov(R32[8], Add(R32[8], 3))];
	case 0x307f: return [3, Mov(R32[4], Add(R32[4], -4)),Mov(Mem(R32[4], 4), Mem(R32[((b[i+2] & 0x7))], 4))];
	}
if(((((b[i+0] & 0x80)>>>7)|(b[i+1]<<1)) & 0x18f) == 0x9)
	switch((b[i+0]|((b[i+1] & 0x3f)<<8)) & 0x387f) {
	case 0xf: return [3, Mov(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 4), Mem(R32[4], 4)),Mov(R32[4], Add(R32[4], 4))];
	case 0x50: return [3, Mov(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 1), ROL(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 1), 1))];
	case 0x51: return [3, Mov(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 4), ROL(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 4), 1))];
	case 0x52: return [3, Mov(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 1), ROL(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 1), R8[1]))];
	case 0x53: return [3, Mov(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 4), ROL(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 4), R8[1]))];
	case 0x850: return [3, Mov(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 1), ROR(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 1), 1))];
	case 0x851: return [3, Mov(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 4), ROR(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 4), 1))];
	case 0x852: return [3, Mov(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 1), ROR(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 1), R8[1]))];
	case 0x853: return [3, Mov(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 4), ROR(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 4), R8[1]))];
	case 0x2050: return [3, Mov(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 1), LSL(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 1), 1))];
	case 0x2051: return [3, Mov(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 4), LSL(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 4), 1))];
	case 0x2052: return [3, Mov(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 1), LSL(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 1), R8[1]))];
	case 0x2053: return [3, Mov(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 4), LSL(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 4), R8[1]))];
	case 0x2850: return [3, Mov(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 1), LSR(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 1), 1))];
	case 0x2851: return [3, Mov(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 4), LSR(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 4), 1))];
	case 0x2852: return [3, Mov(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 1), LSR(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 1), R8[1]))];
	case 0x2853: return [3, Mov(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 4), LSR(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 4), R8[1]))];
	case 0x3850: return [3, Mov(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 1), ASR(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 1), 1))];
	case 0x3851: return [3, Mov(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 4), ASR(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 4), 1))];
	case 0x3852: return [3, Mov(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 1), ASR(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 1), R8[1]))];
	case 0x3853: return [3, Mov(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 4), ASR(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 4), R8[1]))];
	case 0x1076: return [3, Mov(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 1), Not(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 1)))];
	case 0x1077: return [3, Mov(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 4), Not(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 4)))];
	case 0x1876: return [3, Mov(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 1), Neg(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 1)))];
	case 0x1877: return [3, Mov(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 4), Neg(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 4)))];
	case 0x2076: return [3, Mov(R16[0], Mul(R8[0], Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 1)))];
	case 0x2077: return [3, Mov(R32[0], Mul(R32[0], Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 4)))];
	case 0x2876: return [3, Mov(R16[0], Mul(R8[0], Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 1)))];
	case 0x2877: return [3, Mov(R32[0], Mul(R32[0], Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 4)))];
	case 0x7e: return [3, Mov(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 1), Add(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 1), 1))];
	case 0x7f: return [3, Mov(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 4), Add(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 4), 1))];
	case 0x87e: return [3, Mov(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 1), Add(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 1), -1))];
	case 0x87f: return [3, Mov(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 4), Add(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 4), -1))];
	case 0x107f: return [3, Mov(R32[4], Add(R32[4], -4)),Mov(Mem(R32[4], 4), Add(R32[8], 3)),Mov(R32[8], Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 4))];
	case 0x207f: return [3, Mov(R32[8], Add(R32[8], 3))];
	case 0x307f: return [3, Mov(R32[4], Add(R32[4], -4)),Mov(Mem(R32[4], 4), Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 4))];
	}
if(((b[i+0]|(b[i+1]<<8)) & 0xc0ff) == 0x800f)
	switch((b[i+1]|(b[i+2]<<8)) & 0xc03f) {
	case 0x10: return [3, Mov(Mem(R32[((b[i+2] & 0x7))], 1), F[0])];
	case 0xc010: return [3, Mov(R8[((b[i+2] & 0x7))], F[0])];
	case 0x11: return [3, Mov(Mem(R32[((b[i+2] & 0x7))], 1), Not(F[0]))];
	case 0xc011: return [3, Mov(R8[((b[i+2] & 0x7))], Not(F[0]))];
	case 0x12: return [3, Mov(Mem(R32[((b[i+2] & 0x7))], 1), F[1])];
	case 0xc012: return [3, Mov(R8[((b[i+2] & 0x7))], F[1])];
	case 0x13: return [3, Mov(Mem(R32[((b[i+2] & 0x7))], 1), Not(F[1]))];
	case 0xc013: return [3, Mov(R8[((b[i+2] & 0x7))], Not(F[1]))];
	case 0x14: return [3, Mov(Mem(R32[((b[i+2] & 0x7))], 1), F[2])];
	case 0xc014: return [3, Mov(R8[((b[i+2] & 0x7))], F[2])];
	case 0x15: return [3, Mov(Mem(R32[((b[i+2] & 0x7))], 1), Not(F[2]))];
	case 0xc015: return [3, Mov(R8[((b[i+2] & 0x7))], Not(F[2]))];
	case 0x16: return [3, Mov(Mem(R32[((b[i+2] & 0x7))], 1), Or(F[1], F[2]))];
	case 0xc016: return [3, Mov(R8[((b[i+2] & 0x7))], Or(F[1], F[2]))];
	case 0x17: return [3, Mov(Mem(R32[((b[i+2] & 0x7))], 1), And(Not(F[1]), Not(F[2])))];
	case 0xc017: return [3, Mov(R8[((b[i+2] & 0x7))], And(Not(F[1]), Not(F[2])))];
	case 0x18: return [3, Mov(Mem(R32[((b[i+2] & 0x7))], 1), F[3])];
	case 0xc018: return [3, Mov(R8[((b[i+2] & 0x7))], F[3])];
	case 0x19: return [3, Mov(Mem(R32[((b[i+2] & 0x7))], 1), Not(F[3]))];
	case 0xc019: return [3, Mov(R8[((b[i+2] & 0x7))], Not(F[3]))];
	case 0x1a: return [3, Mov(Mem(R32[((b[i+2] & 0x7))], 1), F[4])];
	case 0xc01a: return [3, Mov(R8[((b[i+2] & 0x7))], F[4])];
	case 0x1b: return [3, Mov(Mem(R32[((b[i+2] & 0x7))], 1), Not(F[4]))];
	case 0xc01b: return [3, Mov(R8[((b[i+2] & 0x7))], Not(F[4]))];
	case 0x1c: return [3, Mov(Mem(R32[((b[i+2] & 0x7))], 1), Not(Eq(F[0], F[3])))];
	case 0xc01c: return [3, Mov(R8[((b[i+2] & 0x7))], Not(Eq(F[0], F[3])))];
	case 0x1d: return [3, Mov(Mem(R32[((b[i+2] & 0x7))], 1), Eq(F[0], F[3]))];
	case 0xc01d: return [3, Mov(R8[((b[i+2] & 0x7))], Eq(F[0], F[3]))];
	case 0x1e: return [3, Mov(Mem(R32[((b[i+2] & 0x7))], 1), Or(F[2], Not(Eq(F[0], F[3]))))];
	case 0xc01e: return [3, Mov(R8[((b[i+2] & 0x7))], Or(F[2], Not(Eq(F[0], F[3]))))];
	case 0x1f: return [3, Mov(Mem(R32[((b[i+2] & 0x7))], 1), And(Not(F[2]), Eq(F[0], F[3])))];
	case 0xc01f: return [3, Mov(R8[((b[i+2] & 0x7))], And(Not(F[2]), Eq(F[0], F[3])))];
	case 0x2d: return [3, Mov(Mem(R32[((b[i+2] & 0x7))], 4), Or(LSR(Mem(R32[((b[i+2] & 0x7))], 4), R8[1]), And(R32[(((b[i+2] & 0x38)>>>3))], LSL(Add(LSL(1, R8[1]), -1), Add(32, Neg(R8[1]))))))];
	case 0xc02d: return [3, Mov(R32[((b[i+2] & 0x7))], Or(LSR(R32[((b[i+2] & 0x7))], R8[1]), And(R32[(((b[i+2] & 0x38)>>>3))], LSL(Add(LSL(1, R8[1]), -1), Add(32, Neg(R8[1]))))))];
	case 0x36: return [3, Mov(R32[(((b[i+2] & 0x38)>>>3))], Mem(R32[((b[i+2] & 0x7))], 1))];
	case 0xc036: return [3, Mov(R32[(((b[i+2] & 0x38)>>>3))], R8[((b[i+2] & 0x7))])];
	case 0x37: return [3, Mov(R32[(((b[i+2] & 0x38)>>>3))], Mem(R32[((b[i+2] & 0x7))], 2))];
	case 0xc037: return [3, Mov(R32[(((b[i+2] & 0x38)>>>3))], R16[((b[i+2] & 0x7))])];
	}
if(((((b[i+0] & 0x80)>>>7)) & 0x1) == 0x1)
	switch((b[i+0]|(b[i+1]<<8)) & 0xf87f) {
	case 0x0: return [3, Mov(Mem(R32[((b[i+1] & 0x7))], 1), Add(Mem(R32[((b[i+1] & 0x7))], 1), (b[i+2])))];
	case 0xc000: return [3, Mov(R8[((b[i+1] & 0x7))], Add(R8[((b[i+1] & 0x7))], (b[i+2])))];
	case 0x2: return [3, Mov(Mem(R32[((b[i+1] & 0x7))], 1), Add(Mem(R32[((b[i+1] & 0x7))], 1), (b[i+2])))];
	case 0xc002: return [3, Mov(R8[((b[i+1] & 0x7))], Add(R8[((b[i+1] & 0x7))], (b[i+2])))];
	case 0x3: return [3, Mov(Mem(R32[((b[i+1] & 0x7))], 4), Add(Mem(R32[((b[i+1] & 0x7))], 4), (b[i+2])))];
	case 0xc003: return [3, Mov(R32[((b[i+1] & 0x7))], Add(R32[((b[i+1] & 0x7))], (b[i+2])))];
	case 0x800: return [3, Mov(Mem(R32[((b[i+1] & 0x7))], 1), Or(Mem(R32[((b[i+1] & 0x7))], 1), (b[i+2])))];
	case 0xc800: return [3, Mov(R8[((b[i+1] & 0x7))], Or(R8[((b[i+1] & 0x7))], (b[i+2])))];
	case 0x802: return [3, Mov(Mem(R32[((b[i+1] & 0x7))], 1), Or(Mem(R32[((b[i+1] & 0x7))], 1), (b[i+2])))];
	case 0xc802: return [3, Mov(R8[((b[i+1] & 0x7))], Or(R8[((b[i+1] & 0x7))], (b[i+2])))];
	case 0x803: return [3, Mov(Mem(R32[((b[i+1] & 0x7))], 4), Or(Mem(R32[((b[i+1] & 0x7))], 4), (b[i+2])))];
	case 0xc803: return [3, Mov(R32[((b[i+1] & 0x7))], Or(R32[((b[i+1] & 0x7))], (b[i+2])))];
	case 0x1000: return [3, Mov(Mem(R32[((b[i+1] & 0x7))], 1), Add(Mem(R32[((b[i+1] & 0x7))], 1), Add((b[i+2]), F[1])))];
	case 0xd000: return [3, Mov(R8[((b[i+1] & 0x7))], Add(R8[((b[i+1] & 0x7))], Add((b[i+2]), F[1])))];
	case 0x1002: return [3, Mov(Mem(R32[((b[i+1] & 0x7))], 1), Add(Mem(R32[((b[i+1] & 0x7))], 1), Add((b[i+2]), F[1])))];
	case 0xd002: return [3, Mov(R8[((b[i+1] & 0x7))], Add(R8[((b[i+1] & 0x7))], Add((b[i+2]), F[1])))];
	case 0x1003: return [3, Mov(Mem(R32[((b[i+1] & 0x7))], 4), Add(Mem(R32[((b[i+1] & 0x7))], 4), Add((b[i+2]), F[1])))];
	case 0xd003: return [3, Mov(R32[((b[i+1] & 0x7))], Add(R32[((b[i+1] & 0x7))], Add((b[i+2]), F[1])))];
	case 0x1800: return [3, Mov(Mem(R32[((b[i+1] & 0x7))], 1), Add((b[i+2]), Neg(Add(Add(Mem(R32[((b[i+1] & 0x7))], 1), Neg(F[1])), 1))))];
	case 0xd800: return [3, Mov(R8[((b[i+1] & 0x7))], Add((b[i+2]), Neg(Add(Add(R8[((b[i+1] & 0x7))], Neg(F[1])), 1))))];
	case 0x1802: return [3, Mov(Mem(R32[((b[i+1] & 0x7))], 1), Add((b[i+2]), Neg(Add(Add(Mem(R32[((b[i+1] & 0x7))], 1), Neg(F[1])), 1))))];
	case 0xd802: return [3, Mov(R8[((b[i+1] & 0x7))], Add((b[i+2]), Neg(Add(Add(R8[((b[i+1] & 0x7))], Neg(F[1])), 1))))];
	case 0x1803: return [3, Mov(Mem(R32[((b[i+1] & 0x7))], 4), Add((b[i+2]), Neg(Add(Add(Mem(R32[((b[i+1] & 0x7))], 4), Neg(F[1])), 1))))];
	case 0xd803: return [3, Mov(R32[((b[i+1] & 0x7))], Add((b[i+2]), Neg(Add(Add(R32[((b[i+1] & 0x7))], Neg(F[1])), 1))))];
	case 0x2000: return [3, Mov(Mem(R32[((b[i+1] & 0x7))], 1), And(Mem(R32[((b[i+1] & 0x7))], 1), (b[i+2])))];
	case 0xe000: return [3, Mov(R8[((b[i+1] & 0x7))], And(R8[((b[i+1] & 0x7))], (b[i+2])))];
	case 0x2002: return [3, Mov(Mem(R32[((b[i+1] & 0x7))], 1), And(Mem(R32[((b[i+1] & 0x7))], 1), (b[i+2])))];
	case 0xe002: return [3, Mov(R8[((b[i+1] & 0x7))], And(R8[((b[i+1] & 0x7))], (b[i+2])))];
	case 0x2003: return [3, Mov(Mem(R32[((b[i+1] & 0x7))], 4), And(Mem(R32[((b[i+1] & 0x7))], 4), (b[i+2])))];
	case 0xe003: return [3, Mov(R32[((b[i+1] & 0x7))], And(R32[((b[i+1] & 0x7))], (b[i+2])))];
	case 0x2800: return [3, Mov(Mem(R32[((b[i+1] & 0x7))], 1), Add(Mem(R32[((b[i+1] & 0x7))], 1), -(b[i+2])))];
	case 0xe800: return [3, Mov(R8[((b[i+1] & 0x7))], Add(R8[((b[i+1] & 0x7))], -(b[i+2])))];
	case 0x2802: return [3, Mov(Mem(R32[((b[i+1] & 0x7))], 1), Add(Mem(R32[((b[i+1] & 0x7))], 1), -(b[i+2])))];
	case 0xe802: return [3, Mov(R8[((b[i+1] & 0x7))], Add(R8[((b[i+1] & 0x7))], -(b[i+2])))];
	case 0x2803: return [3, Mov(Mem(R32[((b[i+1] & 0x7))], 4), Add(Mem(R32[((b[i+1] & 0x7))], 4), -(b[i+2])))];
	case 0xe803: return [3, Mov(R32[((b[i+1] & 0x7))], Add(R32[((b[i+1] & 0x7))], -(b[i+2])))];
	case 0x3000: return [3, Mov(Mem(R32[((b[i+1] & 0x7))], 1), Xor(Mem(R32[((b[i+1] & 0x7))], 1), (b[i+2])))];
	case 0xf000: return [3, Mov(R8[((b[i+1] & 0x7))], Xor(R8[((b[i+1] & 0x7))], (b[i+2])))];
	case 0x3002: return [3, Mov(Mem(R32[((b[i+1] & 0x7))], 1), Xor(Mem(R32[((b[i+1] & 0x7))], 1), (b[i+2])))];
	case 0xf002: return [3, Mov(R8[((b[i+1] & 0x7))], Xor(R8[((b[i+1] & 0x7))], (b[i+2])))];
	case 0x3003: return [3, Mov(Mem(R32[((b[i+1] & 0x7))], 4), Xor(Mem(R32[((b[i+1] & 0x7))], 4), (b[i+2])))];
	case 0xf003: return [3, Mov(R32[((b[i+1] & 0x7))], Xor(R32[((b[i+1] & 0x7))], (b[i+2])))];
	case 0x3800: return [3, Mov(F[2], Eq(Mem(R32[((b[i+1] & 0x7))], 1), (b[i+2]))),Mov(F[1], Lt(Mem(R32[((b[i+1] & 0x7))], 1), (b[i+2])))];
	case 0xf800: return [3, Mov(F[2], Eq(R8[((b[i+1] & 0x7))], (b[i+2]))),Mov(F[1], Lt(R8[((b[i+1] & 0x7))], (b[i+2])))];
	case 0x3802: return [3, Mov(F[2], Eq(Mem(R32[((b[i+1] & 0x7))], 1), (b[i+2]))),Mov(F[1], Lt(Mem(R32[((b[i+1] & 0x7))], 1), (b[i+2])))];
	case 0xf802: return [3, Mov(F[2], Eq(R8[((b[i+1] & 0x7))], (b[i+2]))),Mov(F[1], Lt(R8[((b[i+1] & 0x7))], (b[i+2])))];
	case 0x3803: return [3, Mov(F[2], Eq(Mem(R32[((b[i+1] & 0x7))], 4), (b[i+2]))),Mov(F[1], Lt(Mem(R32[((b[i+1] & 0x7))], 4), (b[i+2])))];
	case 0xf803: return [3, Mov(F[2], Eq(R32[((b[i+1] & 0x7))], (b[i+2]))),Mov(F[1], Lt(R32[((b[i+1] & 0x7))], (b[i+2])))];
	case 0x400f: return [3, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 4), Mem(R32[4], 4)),Mov(R32[4], Add(R32[4], 4))];
	case 0x46: return [3, Mov(Mem(R32[((b[i+1] & 0x7))], 1), (b[i+2]))];
	case 0xc046: return [3, Mov(R8[((b[i+1] & 0x7))], (b[i+2]))];
	case 0x40: return [3, Mov(Mem(R32[((b[i+1] & 0x7))], 1), ROL(Mem(R32[((b[i+1] & 0x7))], 1), (b[i+2])))];
	case 0xc040: return [3, Mov(R8[((b[i+1] & 0x7))], ROL(R8[((b[i+1] & 0x7))], (b[i+2])))];
	case 0x41: return [3, Mov(Mem(R32[((b[i+1] & 0x7))], 4), ROL(Mem(R32[((b[i+1] & 0x7))], 4), (b[i+2])))];
	case 0xc041: return [3, Mov(R32[((b[i+1] & 0x7))], ROL(R32[((b[i+1] & 0x7))], (b[i+2])))];
	case 0x4050: return [3, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 1), ROL(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 1), 1))];
	case 0x4051: return [3, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 4), ROL(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 4), 1))];
	case 0x4052: return [3, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 1), ROL(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 1), R8[1]))];
	case 0x4053: return [3, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 4), ROL(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 4), R8[1]))];
	case 0x840: return [3, Mov(Mem(R32[((b[i+1] & 0x7))], 1), ROR(Mem(R32[((b[i+1] & 0x7))], 1), (b[i+2])))];
	case 0xc840: return [3, Mov(R8[((b[i+1] & 0x7))], ROR(R8[((b[i+1] & 0x7))], (b[i+2])))];
	case 0x841: return [3, Mov(Mem(R32[((b[i+1] & 0x7))], 4), ROR(Mem(R32[((b[i+1] & 0x7))], 4), (b[i+2])))];
	case 0xc841: return [3, Mov(R32[((b[i+1] & 0x7))], ROR(R32[((b[i+1] & 0x7))], (b[i+2])))];
	case 0x4850: return [3, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 1), ROR(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 1), 1))];
	case 0x4851: return [3, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 4), ROR(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 4), 1))];
	case 0x4852: return [3, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 1), ROR(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 1), R8[1]))];
	case 0x4853: return [3, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 4), ROR(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 4), R8[1]))];
	case 0x2040: return [3, Mov(Mem(R32[((b[i+1] & 0x7))], 1), LSL(Mem(R32[((b[i+1] & 0x7))], 1), (b[i+2])))];
	case 0xe040: return [3, Mov(R8[((b[i+1] & 0x7))], LSL(R8[((b[i+1] & 0x7))], (b[i+2])))];
	case 0x2041: return [3, Mov(Mem(R32[((b[i+1] & 0x7))], 4), LSL(Mem(R32[((b[i+1] & 0x7))], 4), (b[i+2])))];
	case 0xe041: return [3, Mov(R32[((b[i+1] & 0x7))], LSL(R32[((b[i+1] & 0x7))], (b[i+2])))];
	case 0x6050: return [3, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 1), LSL(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 1), 1))];
	case 0x6051: return [3, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 4), LSL(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 4), 1))];
	case 0x6052: return [3, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 1), LSL(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 1), R8[1]))];
	case 0x6053: return [3, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 4), LSL(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 4), R8[1]))];
	case 0x2840: return [3, Mov(Mem(R32[((b[i+1] & 0x7))], 1), LSR(Mem(R32[((b[i+1] & 0x7))], 1), (b[i+2])))];
	case 0xe840: return [3, Mov(R8[((b[i+1] & 0x7))], LSR(R8[((b[i+1] & 0x7))], (b[i+2])))];
	case 0x2841: return [3, Mov(Mem(R32[((b[i+1] & 0x7))], 4), LSR(Mem(R32[((b[i+1] & 0x7))], 4), (b[i+2])))];
	case 0xe841: return [3, Mov(R32[((b[i+1] & 0x7))], LSR(R32[((b[i+1] & 0x7))], (b[i+2])))];
	case 0x6850: return [3, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 1), LSR(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 1), 1))];
	case 0x6851: return [3, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 4), LSR(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 4), 1))];
	case 0x6852: return [3, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 1), LSR(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 1), R8[1]))];
	case 0x6853: return [3, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 4), LSR(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 4), R8[1]))];
	case 0x3840: return [3, Mov(Mem(R32[((b[i+1] & 0x7))], 1), ASR(Mem(R32[((b[i+1] & 0x7))], 1), (b[i+2])))];
	case 0xf840: return [3, Mov(R8[((b[i+1] & 0x7))], ASR(R8[((b[i+1] & 0x7))], (b[i+2])))];
	case 0x3841: return [3, Mov(Mem(R32[((b[i+1] & 0x7))], 4), ASR(Mem(R32[((b[i+1] & 0x7))], 4), (b[i+2])))];
	case 0xf841: return [3, Mov(R32[((b[i+1] & 0x7))], ASR(R32[((b[i+1] & 0x7))], (b[i+2])))];
	case 0x7850: return [3, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 1), ASR(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 1), 1))];
	case 0x7851: return [3, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 4), ASR(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 4), 1))];
	case 0x7852: return [3, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 1), ASR(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 1), R8[1]))];
	case 0x7853: return [3, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 4), ASR(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 4), R8[1]))];
	case 0x76: return [3, Mov(F[2], Eq(And(Mem(R32[((b[i+1] & 0x7))], 1), (b[i+2])), 0))];
	case 0xc076: return [3, Mov(F[2], Eq(And(R8[((b[i+1] & 0x7))], (b[i+2])), 0))];
	case 0x5076: return [3, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 1), Not(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 1)))];
	case 0x5077: return [3, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 4), Not(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 4)))];
	case 0x5876: return [3, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 1), Neg(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 1)))];
	case 0x5877: return [3, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 4), Neg(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 4)))];
	case 0x6076: return [3, Mov(R16[0], Mul(R8[0], Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 1)))];
	case 0x6077: return [3, Mov(R32[0], Mul(R32[0], Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 4)))];
	case 0x6876: return [3, Mov(R16[0], Mul(R8[0], Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 1)))];
	case 0x6877: return [3, Mov(R32[0], Mul(R32[0], Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 4)))];
	case 0x407e: return [3, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 1), Add(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 1), 1))];
	case 0x407f: return [3, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 4), Add(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 4), 1))];
	case 0x487e: return [3, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 1), Add(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 1), -1))];
	case 0x487f: return [3, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 4), Add(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 4), -1))];
	case 0x507f: return [3, Mov(R32[4], Add(R32[4], -4)),Mov(Mem(R32[4], 4), Add(R32[8], 3)),Mov(R32[8], Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 4))];
	case 0x607f: return [3, Mov(R32[8], Add(R32[8], 3))];
	case 0x707f: return [3, Mov(R32[4], Add(R32[4], -4)),Mov(Mem(R32[4], 4), Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 4))];
	}
if(((((b[i+0] & 0xc0)>>>6)|(b[i+1]<<2)|((b[i+2] & 0x3f)<<10)) & 0xe31d) == 0x8010)
	switch((b[i+0]) & 0xbf) {
	case 0x0: return [3, Mov(Mem(R32[((b[i+2] & 0x7))], 1), Add(Mem(R32[((b[i+2] & 0x7))], 1), R8[(((b[i+1] & 0x38)>>>3))]))];
	case 0x1: return [3, Mov(Mem(R32[((b[i+2] & 0x7))], 4), Add(Mem(R32[((b[i+2] & 0x7))], 4), R32[(((b[i+1] & 0x38)>>>3))]))];
	case 0x2: return [3, Mov(R8[(((b[i+1] & 0x38)>>>3))], Add(R8[(((b[i+1] & 0x38)>>>3))], Mem(R32[((b[i+2] & 0x7))], 1)))];
	case 0x3: return [3, Mov(R32[(((b[i+1] & 0x38)>>>3))], Add(R32[(((b[i+1] & 0x38)>>>3))], Mem(R32[((b[i+2] & 0x7))], 4)))];
	case 0x8: return [3, Mov(Mem(R32[((b[i+2] & 0x7))], 1), Or(Mem(R32[((b[i+2] & 0x7))], 1), R8[(((b[i+1] & 0x38)>>>3))]))];
	case 0x9: return [3, Mov(Mem(R32[((b[i+2] & 0x7))], 4), Or(Mem(R32[((b[i+2] & 0x7))], 4), R32[(((b[i+1] & 0x38)>>>3))]))];
	case 0xa: return [3, Mov(R8[(((b[i+1] & 0x38)>>>3))], Or(R8[(((b[i+1] & 0x38)>>>3))], Mem(R32[((b[i+2] & 0x7))], 1)))];
	case 0xb: return [3, Mov(R32[(((b[i+1] & 0x38)>>>3))], Or(R32[(((b[i+1] & 0x38)>>>3))], Mem(R32[((b[i+2] & 0x7))], 4)))];
	case 0x10: return [3, Mov(Mem(R32[((b[i+2] & 0x7))], 1), Add(Mem(R32[((b[i+2] & 0x7))], 1), Add(R8[(((b[i+1] & 0x38)>>>3))], F[1])))];
	case 0x11: return [3, Mov(Mem(R32[((b[i+2] & 0x7))], 4), Add(Mem(R32[((b[i+2] & 0x7))], 4), Add(R32[(((b[i+1] & 0x38)>>>3))], F[1])))];
	case 0x12: return [3, Mov(R8[(((b[i+1] & 0x38)>>>3))], Add(R8[(((b[i+1] & 0x38)>>>3))], Add(Mem(R32[((b[i+2] & 0x7))], 1), F[1])))];
	case 0x13: return [3, Mov(R32[(((b[i+1] & 0x38)>>>3))], Add(R32[(((b[i+1] & 0x38)>>>3))], Add(Mem(R32[((b[i+2] & 0x7))], 4), F[1])))];
	case 0x18: return [3, Mov(Mem(R32[((b[i+2] & 0x7))], 1), Add(R8[(((b[i+1] & 0x38)>>>3))], Neg(Add(Add(Mem(R32[((b[i+2] & 0x7))], 1), Neg(F[1])), 1))))];
	case 0x19: return [3, Mov(Mem(R32[((b[i+2] & 0x7))], 4), Add(R32[(((b[i+1] & 0x38)>>>3))], Neg(Add(Add(Mem(R32[((b[i+2] & 0x7))], 4), Neg(F[1])), 1))))];
	case 0x1a: return [3, Mov(R8[(((b[i+1] & 0x38)>>>3))], Add(Mem(R32[((b[i+2] & 0x7))], 1), Neg(Add(Add(R8[(((b[i+1] & 0x38)>>>3))], Neg(F[1])), 1))))];
	case 0x1b: return [3, Mov(R32[(((b[i+1] & 0x38)>>>3))], Add(Mem(R32[((b[i+2] & 0x7))], 4), Neg(Add(Add(R32[(((b[i+1] & 0x38)>>>3))], Neg(F[1])), 1))))];
	case 0x20: return [3, Mov(Mem(R32[((b[i+2] & 0x7))], 1), And(Mem(R32[((b[i+2] & 0x7))], 1), R8[(((b[i+1] & 0x38)>>>3))]))];
	case 0x21: return [3, Mov(Mem(R32[((b[i+2] & 0x7))], 4), And(Mem(R32[((b[i+2] & 0x7))], 4), R32[(((b[i+1] & 0x38)>>>3))]))];
	case 0x22: return [3, Mov(R8[(((b[i+1] & 0x38)>>>3))], And(R8[(((b[i+1] & 0x38)>>>3))], Mem(R32[((b[i+2] & 0x7))], 1)))];
	case 0x23: return [3, Mov(R32[(((b[i+1] & 0x38)>>>3))], And(R32[(((b[i+1] & 0x38)>>>3))], Mem(R32[((b[i+2] & 0x7))], 4)))];
	case 0x28: return [3, Mov(Mem(R32[((b[i+2] & 0x7))], 1), Add(Mem(R32[((b[i+2] & 0x7))], 1), Neg(R8[(((b[i+1] & 0x38)>>>3))])))];
	case 0x29: return [3, Mov(Mem(R32[((b[i+2] & 0x7))], 4), Add(Mem(R32[((b[i+2] & 0x7))], 4), Neg(R32[(((b[i+1] & 0x38)>>>3))])))];
	case 0x2a: return [3, Mov(R8[(((b[i+1] & 0x38)>>>3))], Add(R8[(((b[i+1] & 0x38)>>>3))], Neg(Mem(R32[((b[i+2] & 0x7))], 1))))];
	case 0x2b: return [3, Mov(R32[(((b[i+1] & 0x38)>>>3))], Add(R32[(((b[i+1] & 0x38)>>>3))], Neg(Mem(R32[((b[i+2] & 0x7))], 4))))];
	case 0x30: return [3, Mov(Mem(R32[((b[i+2] & 0x7))], 1), Xor(Mem(R32[((b[i+2] & 0x7))], 1), R8[(((b[i+1] & 0x38)>>>3))]))];
	case 0x31: return [3, Mov(Mem(R32[((b[i+2] & 0x7))], 4), Xor(Mem(R32[((b[i+2] & 0x7))], 4), R32[(((b[i+1] & 0x38)>>>3))]))];
	case 0x32: return [3, Mov(R8[(((b[i+1] & 0x38)>>>3))], Xor(R8[(((b[i+1] & 0x38)>>>3))], Mem(R32[((b[i+2] & 0x7))], 1)))];
	case 0x33: return [3, Mov(R32[(((b[i+1] & 0x38)>>>3))], Xor(R32[(((b[i+1] & 0x38)>>>3))], Mem(R32[((b[i+2] & 0x7))], 4)))];
	case 0x38: return [3, Mov(F[2], Eq(Mem(R32[((b[i+2] & 0x7))], 1), R8[(((b[i+1] & 0x38)>>>3))])),Mov(F[1], Lt(Mem(R32[((b[i+2] & 0x7))], 1), R8[(((b[i+1] & 0x38)>>>3))]))];
	case 0x39: return [3, Mov(F[2], Eq(Mem(R32[((b[i+2] & 0x7))], 4), R32[(((b[i+1] & 0x38)>>>3))])),Mov(F[1], Lt(Mem(R32[((b[i+2] & 0x7))], 4), R32[(((b[i+1] & 0x38)>>>3))]))];
	case 0x3a: return [3, Mov(F[2], Eq(R8[(((b[i+1] & 0x38)>>>3))], Mem(R32[((b[i+2] & 0x7))], 1))),Mov(F[1], Lt(R8[(((b[i+1] & 0x38)>>>3))], Mem(R32[((b[i+2] & 0x7))], 1)))];
	case 0x3b: return [3, Mov(F[2], Eq(R32[(((b[i+1] & 0x38)>>>3))], Mem(R32[((b[i+2] & 0x7))], 4))),Mov(F[1], Lt(R32[(((b[i+1] & 0x38)>>>3))], Mem(R32[((b[i+2] & 0x7))], 4)))];
	case 0x84: return [3, Mov(F[2], Eq(And(Mem(R32[((b[i+2] & 0x7))], 1), R8[(((b[i+1] & 0x38)>>>3))]), 0))];
	case 0x85: return [3, Mov(F[2], Eq(And(Mem(R32[((b[i+2] & 0x7))], 4), R32[(((b[i+1] & 0x38)>>>3))]), 0))];
	case 0x86: return [3, Swap(Mem(R32[((b[i+2] & 0x7))], 1), R8[(((b[i+1] & 0x38)>>>3))])];
	case 0x87: return [3, Swap(Mem(R32[((b[i+2] & 0x7))], 4), R32[(((b[i+1] & 0x38)>>>3))])];
	case 0x88: return [3, Mov(Mem(R32[((b[i+2] & 0x7))], 1), R8[(((b[i+1] & 0x38)>>>3))])];
	case 0x89: return [3, Mov(Mem(R32[((b[i+2] & 0x7))], 4), R32[(((b[i+1] & 0x38)>>>3))])];
	case 0x8a: return [3, Mov(R8[(((b[i+1] & 0x38)>>>3))], Mem(R32[((b[i+2] & 0x7))], 1))];
	case 0x8b: return [3, Mov(R32[(((b[i+1] & 0x38)>>>3))], Mem(R32[((b[i+2] & 0x7))], 4))];
	case 0x8c: return [3, Mov(Mem(R32[((b[i+2] & 0x7))], 4), RS[(((b[i+1] & 0x38)>>>3))])];
	case 0x8d: return [3, Mov(R32[(((b[i+1] & 0x38)>>>3))], R32[((b[i+2] & 0x7))])];
	case 0x8e: return [3, Mov(RS[(((b[i+1] & 0x38)>>>3))], Mem(R32[((b[i+2] & 0x7))], 2))];
	}
if(((((b[i+0] & 0xc0)>>>6)|(b[i+1]<<2)) & 0x31d) == 0x10)
	switch((b[i+0]) & 0xbf) {
	case 0x0: return [3, Mov(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 1), Add(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 1), R8[(((b[i+1] & 0x38)>>>3))]))];
	case 0x1: return [3, Mov(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 4), Add(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 4), R32[(((b[i+1] & 0x38)>>>3))]))];
	case 0x2: return [3, Mov(R8[(((b[i+1] & 0x38)>>>3))], Add(R8[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 1)))];
	case 0x3: return [3, Mov(R32[(((b[i+1] & 0x38)>>>3))], Add(R32[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 4)))];
	case 0x8: return [3, Mov(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 1), Or(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 1), R8[(((b[i+1] & 0x38)>>>3))]))];
	case 0x9: return [3, Mov(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 4), Or(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 4), R32[(((b[i+1] & 0x38)>>>3))]))];
	case 0xa: return [3, Mov(R8[(((b[i+1] & 0x38)>>>3))], Or(R8[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 1)))];
	case 0xb: return [3, Mov(R32[(((b[i+1] & 0x38)>>>3))], Or(R32[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 4)))];
	case 0x10: return [3, Mov(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 1), Add(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 1), Add(R8[(((b[i+1] & 0x38)>>>3))], F[1])))];
	case 0x11: return [3, Mov(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 4), Add(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 4), Add(R32[(((b[i+1] & 0x38)>>>3))], F[1])))];
	case 0x12: return [3, Mov(R8[(((b[i+1] & 0x38)>>>3))], Add(R8[(((b[i+1] & 0x38)>>>3))], Add(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 1), F[1])))];
	case 0x13: return [3, Mov(R32[(((b[i+1] & 0x38)>>>3))], Add(R32[(((b[i+1] & 0x38)>>>3))], Add(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 4), F[1])))];
	case 0x18: return [3, Mov(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 1), Add(R8[(((b[i+1] & 0x38)>>>3))], Neg(Add(Add(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 1), Neg(F[1])), 1))))];
	case 0x19: return [3, Mov(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 4), Add(R32[(((b[i+1] & 0x38)>>>3))], Neg(Add(Add(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 4), Neg(F[1])), 1))))];
	case 0x1a: return [3, Mov(R8[(((b[i+1] & 0x38)>>>3))], Add(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 1), Neg(Add(Add(R8[(((b[i+1] & 0x38)>>>3))], Neg(F[1])), 1))))];
	case 0x1b: return [3, Mov(R32[(((b[i+1] & 0x38)>>>3))], Add(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 4), Neg(Add(Add(R32[(((b[i+1] & 0x38)>>>3))], Neg(F[1])), 1))))];
	case 0x20: return [3, Mov(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 1), And(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 1), R8[(((b[i+1] & 0x38)>>>3))]))];
	case 0x21: return [3, Mov(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 4), And(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 4), R32[(((b[i+1] & 0x38)>>>3))]))];
	case 0x22: return [3, Mov(R8[(((b[i+1] & 0x38)>>>3))], And(R8[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 1)))];
	case 0x23: return [3, Mov(R32[(((b[i+1] & 0x38)>>>3))], And(R32[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 4)))];
	case 0x28: return [3, Mov(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 1), Add(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 1), Neg(R8[(((b[i+1] & 0x38)>>>3))])))];
	case 0x29: return [3, Mov(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 4), Add(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 4), Neg(R32[(((b[i+1] & 0x38)>>>3))])))];
	case 0x2a: return [3, Mov(R8[(((b[i+1] & 0x38)>>>3))], Add(R8[(((b[i+1] & 0x38)>>>3))], Neg(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 1))))];
	case 0x2b: return [3, Mov(R32[(((b[i+1] & 0x38)>>>3))], Add(R32[(((b[i+1] & 0x38)>>>3))], Neg(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 4))))];
	case 0x30: return [3, Mov(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 1), Xor(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 1), R8[(((b[i+1] & 0x38)>>>3))]))];
	case 0x31: return [3, Mov(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 4), Xor(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 4), R32[(((b[i+1] & 0x38)>>>3))]))];
	case 0x32: return [3, Mov(R8[(((b[i+1] & 0x38)>>>3))], Xor(R8[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 1)))];
	case 0x33: return [3, Mov(R32[(((b[i+1] & 0x38)>>>3))], Xor(R32[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 4)))];
	case 0x38: return [3, Mov(F[2], Eq(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 1), R8[(((b[i+1] & 0x38)>>>3))])),Mov(F[1], Lt(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 1), R8[(((b[i+1] & 0x38)>>>3))]))];
	case 0x39: return [3, Mov(F[2], Eq(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 4), R32[(((b[i+1] & 0x38)>>>3))])),Mov(F[1], Lt(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 4), R32[(((b[i+1] & 0x38)>>>3))]))];
	case 0x3a: return [3, Mov(F[2], Eq(R8[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 1))),Mov(F[1], Lt(R8[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 1)))];
	case 0x3b: return [3, Mov(F[2], Eq(R32[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 4))),Mov(F[1], Lt(R32[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 4)))];
	case 0x84: return [3, Mov(F[2], Eq(And(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 1), R8[(((b[i+1] & 0x38)>>>3))]), 0))];
	case 0x85: return [3, Mov(F[2], Eq(And(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 4), R32[(((b[i+1] & 0x38)>>>3))]), 0))];
	case 0x86: return [3, Swap(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 1), R8[(((b[i+1] & 0x38)>>>3))])];
	case 0x87: return [3, Swap(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 4), R32[(((b[i+1] & 0x38)>>>3))])];
	case 0x88: return [3, Mov(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 1), R8[(((b[i+1] & 0x38)>>>3))])];
	case 0x89: return [3, Mov(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 4), R32[(((b[i+1] & 0x38)>>>3))])];
	case 0x8a: return [3, Mov(R8[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 1))];
	case 0x8b: return [3, Mov(R32[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 4))];
	case 0x8c: return [3, Mov(Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 4), RS[(((b[i+1] & 0x38)>>>3))])];
	case 0x8d: return [3, Mov(R32[(((b[i+1] & 0x38)>>>3))], Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))))];
	case 0x8e: return [3, Mov(RS[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[((b[i+2] & 0x7))], LSL(R32[(((b[i+2] & 0x38)>>>3))], (((b[i+2] & 0xc0)>>>6)))), 2))];
	}
if(((((b[i+0] & 0xc0)>>>6)|(b[i+1]<<2)) & 0x301) == 0x100)
	switch((b[i+0]) & 0xbf) {
	case 0x0: return [3, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 1), Add(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 1), R8[(((b[i+1] & 0x38)>>>3))]))];
	case 0x1: return [3, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 4), Add(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 4), R32[(((b[i+1] & 0x38)>>>3))]))];
	case 0x2: return [3, Mov(R8[(((b[i+1] & 0x38)>>>3))], Add(R8[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 1)))];
	case 0x3: return [3, Mov(R32[(((b[i+1] & 0x38)>>>3))], Add(R32[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 4)))];
	case 0x8: return [3, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 1), Or(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 1), R8[(((b[i+1] & 0x38)>>>3))]))];
	case 0x9: return [3, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 4), Or(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 4), R32[(((b[i+1] & 0x38)>>>3))]))];
	case 0xa: return [3, Mov(R8[(((b[i+1] & 0x38)>>>3))], Or(R8[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 1)))];
	case 0xb: return [3, Mov(R32[(((b[i+1] & 0x38)>>>3))], Or(R32[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 4)))];
	case 0x10: return [3, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 1), Add(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 1), Add(R8[(((b[i+1] & 0x38)>>>3))], F[1])))];
	case 0x11: return [3, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 4), Add(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 4), Add(R32[(((b[i+1] & 0x38)>>>3))], F[1])))];
	case 0x12: return [3, Mov(R8[(((b[i+1] & 0x38)>>>3))], Add(R8[(((b[i+1] & 0x38)>>>3))], Add(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 1), F[1])))];
	case 0x13: return [3, Mov(R32[(((b[i+1] & 0x38)>>>3))], Add(R32[(((b[i+1] & 0x38)>>>3))], Add(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 4), F[1])))];
	case 0x18: return [3, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 1), Add(R8[(((b[i+1] & 0x38)>>>3))], Neg(Add(Add(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 1), Neg(F[1])), 1))))];
	case 0x19: return [3, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 4), Add(R32[(((b[i+1] & 0x38)>>>3))], Neg(Add(Add(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 4), Neg(F[1])), 1))))];
	case 0x1a: return [3, Mov(R8[(((b[i+1] & 0x38)>>>3))], Add(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 1), Neg(Add(Add(R8[(((b[i+1] & 0x38)>>>3))], Neg(F[1])), 1))))];
	case 0x1b: return [3, Mov(R32[(((b[i+1] & 0x38)>>>3))], Add(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 4), Neg(Add(Add(R32[(((b[i+1] & 0x38)>>>3))], Neg(F[1])), 1))))];
	case 0x20: return [3, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 1), And(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 1), R8[(((b[i+1] & 0x38)>>>3))]))];
	case 0x21: return [3, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 4), And(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 4), R32[(((b[i+1] & 0x38)>>>3))]))];
	case 0x22: return [3, Mov(R8[(((b[i+1] & 0x38)>>>3))], And(R8[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 1)))];
	case 0x23: return [3, Mov(R32[(((b[i+1] & 0x38)>>>3))], And(R32[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 4)))];
	case 0x28: return [3, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 1), Add(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 1), Neg(R8[(((b[i+1] & 0x38)>>>3))])))];
	case 0x29: return [3, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 4), Add(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 4), Neg(R32[(((b[i+1] & 0x38)>>>3))])))];
	case 0x2a: return [3, Mov(R8[(((b[i+1] & 0x38)>>>3))], Add(R8[(((b[i+1] & 0x38)>>>3))], Neg(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 1))))];
	case 0x2b: return [3, Mov(R32[(((b[i+1] & 0x38)>>>3))], Add(R32[(((b[i+1] & 0x38)>>>3))], Neg(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 4))))];
	case 0x30: return [3, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 1), Xor(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 1), R8[(((b[i+1] & 0x38)>>>3))]))];
	case 0x31: return [3, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 4), Xor(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 4), R32[(((b[i+1] & 0x38)>>>3))]))];
	case 0x32: return [3, Mov(R8[(((b[i+1] & 0x38)>>>3))], Xor(R8[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 1)))];
	case 0x33: return [3, Mov(R32[(((b[i+1] & 0x38)>>>3))], Xor(R32[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 4)))];
	case 0x38: return [3, Mov(F[2], Eq(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 1), R8[(((b[i+1] & 0x38)>>>3))])),Mov(F[1], Lt(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 1), R8[(((b[i+1] & 0x38)>>>3))]))];
	case 0x39: return [3, Mov(F[2], Eq(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 4), R32[(((b[i+1] & 0x38)>>>3))])),Mov(F[1], Lt(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 4), R32[(((b[i+1] & 0x38)>>>3))]))];
	case 0x3a: return [3, Mov(F[2], Eq(R8[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 1))),Mov(F[1], Lt(R8[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 1)))];
	case 0x3b: return [3, Mov(F[2], Eq(R32[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 4))),Mov(F[1], Lt(R32[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 4)))];
	case 0x84: return [3, Mov(F[2], Eq(And(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 1), R8[(((b[i+1] & 0x38)>>>3))]), 0))];
	case 0x85: return [3, Mov(F[2], Eq(And(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 4), R32[(((b[i+1] & 0x38)>>>3))]), 0))];
	case 0x86: return [3, Swap(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 1), R8[(((b[i+1] & 0x38)>>>3))])];
	case 0x87: return [3, Swap(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 4), R32[(((b[i+1] & 0x38)>>>3))])];
	case 0x88: return [3, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 1), R8[(((b[i+1] & 0x38)>>>3))])];
	case 0x89: return [3, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 4), R32[(((b[i+1] & 0x38)>>>3))])];
	case 0x8a: return [3, Mov(R8[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 1))];
	case 0x8b: return [3, Mov(R32[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 4))];
	case 0x8c: return [3, Mov(Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 4), RS[(((b[i+1] & 0x38)>>>3))])];
	case 0x8d: return [3, Mov(R32[(((b[i+1] & 0x38)>>>3))], Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)))];
	case 0x8e: return [3, Mov(RS[(((b[i+1] & 0x38)>>>3))], Mem(Add(R32[((b[i+1] & 0x7))], (((b[i+2]) << 24) >> 24)), 2))];
	}
if(((b[i+0]) & 0xff) == 0xc2)
	switch(0) {
	case 0x0: return [3, Mov(R32[4], Add(R32[4], (b[i+1]|(b[i+2]<<8)))),Mov(R32[8], Mem(R32[4], 4)),Mov(R32[4], Add(R32[4], 4))];
	}
if(((b[i+0]|(b[i+1]<<8)) & 0xf8ff) == 0xc80f)
	switch(((b[i+1] & 0x7)) & 0x7) {
	case 0x0: return [2, Nop(R32[0])];
	case 0x1: return [2, Nop(R32[1])];
	case 0x2: return [2, Nop(R32[2])];
	case 0x3: return [2, Nop(R32[3])];
	case 0x4: return [2, Nop(R32[4])];
	case 0x5: return [2, Nop(R32[5])];
	case 0x6: return [2, Nop(R32[6])];
	case 0x7: return [2, Nop(R32[7])];
	}
if(((((b[i+0] & 0x80)>>>7)) & 0x1) == 0x1)
	switch((b[i+0]|(b[i+1]<<8)) & 0xf87f) {
	case 0xf: return [2, Mov(Mem(R32[((b[i+1] & 0x7))], 4), Mem(R32[4], 4)),Mov(R32[4], Add(R32[4], 4))];
	case 0xc00f: return [2, Mov(R32[((b[i+1] & 0x7))], Mem(R32[4], 4)),Mov(R32[4], Add(R32[4], 4))];
	case 0x50: return [2, Mov(Mem(R32[((b[i+1] & 0x7))], 1), ROL(Mem(R32[((b[i+1] & 0x7))], 1), 1))];
	case 0xc050: return [2, Mov(R8[((b[i+1] & 0x7))], ROL(R8[((b[i+1] & 0x7))], 1))];
	case 0x51: return [2, Mov(Mem(R32[((b[i+1] & 0x7))], 4), ROL(Mem(R32[((b[i+1] & 0x7))], 4), 1))];
	case 0xc051: return [2, Mov(R32[((b[i+1] & 0x7))], ROL(R32[((b[i+1] & 0x7))], 1))];
	case 0x52: return [2, Mov(Mem(R32[((b[i+1] & 0x7))], 1), ROL(Mem(R32[((b[i+1] & 0x7))], 1), R8[1]))];
	case 0xc052: return [2, Mov(R8[((b[i+1] & 0x7))], ROL(R8[((b[i+1] & 0x7))], R8[1]))];
	case 0x53: return [2, Mov(Mem(R32[((b[i+1] & 0x7))], 4), ROL(Mem(R32[((b[i+1] & 0x7))], 4), R8[1]))];
	case 0xc053: return [2, Mov(R32[((b[i+1] & 0x7))], ROL(R32[((b[i+1] & 0x7))], R8[1]))];
	case 0x850: return [2, Mov(Mem(R32[((b[i+1] & 0x7))], 1), ROR(Mem(R32[((b[i+1] & 0x7))], 1), 1))];
	case 0xc850: return [2, Mov(R8[((b[i+1] & 0x7))], ROR(R8[((b[i+1] & 0x7))], 1))];
	case 0x851: return [2, Mov(Mem(R32[((b[i+1] & 0x7))], 4), ROR(Mem(R32[((b[i+1] & 0x7))], 4), 1))];
	case 0xc851: return [2, Mov(R32[((b[i+1] & 0x7))], ROR(R32[((b[i+1] & 0x7))], 1))];
	case 0x852: return [2, Mov(Mem(R32[((b[i+1] & 0x7))], 1), ROR(Mem(R32[((b[i+1] & 0x7))], 1), R8[1]))];
	case 0xc852: return [2, Mov(R8[((b[i+1] & 0x7))], ROR(R8[((b[i+1] & 0x7))], R8[1]))];
	case 0x853: return [2, Mov(Mem(R32[((b[i+1] & 0x7))], 4), ROR(Mem(R32[((b[i+1] & 0x7))], 4), R8[1]))];
	case 0xc853: return [2, Mov(R32[((b[i+1] & 0x7))], ROR(R32[((b[i+1] & 0x7))], R8[1]))];
	case 0x2050: return [2, Mov(Mem(R32[((b[i+1] & 0x7))], 1), LSL(Mem(R32[((b[i+1] & 0x7))], 1), 1))];
	case 0xe050: return [2, Mov(R8[((b[i+1] & 0x7))], LSL(R8[((b[i+1] & 0x7))], 1))];
	case 0x2051: return [2, Mov(Mem(R32[((b[i+1] & 0x7))], 4), LSL(Mem(R32[((b[i+1] & 0x7))], 4), 1))];
	case 0xe051: return [2, Mov(R32[((b[i+1] & 0x7))], LSL(R32[((b[i+1] & 0x7))], 1))];
	case 0x2052: return [2, Mov(Mem(R32[((b[i+1] & 0x7))], 1), LSL(Mem(R32[((b[i+1] & 0x7))], 1), R8[1]))];
	case 0xe052: return [2, Mov(R8[((b[i+1] & 0x7))], LSL(R8[((b[i+1] & 0x7))], R8[1]))];
	case 0x2053: return [2, Mov(Mem(R32[((b[i+1] & 0x7))], 4), LSL(Mem(R32[((b[i+1] & 0x7))], 4), R8[1]))];
	case 0xe053: return [2, Mov(R32[((b[i+1] & 0x7))], LSL(R32[((b[i+1] & 0x7))], R8[1]))];
	case 0x2850: return [2, Mov(Mem(R32[((b[i+1] & 0x7))], 1), LSR(Mem(R32[((b[i+1] & 0x7))], 1), 1))];
	case 0xe850: return [2, Mov(R8[((b[i+1] & 0x7))], LSR(R8[((b[i+1] & 0x7))], 1))];
	case 0x2851: return [2, Mov(Mem(R32[((b[i+1] & 0x7))], 4), LSR(Mem(R32[((b[i+1] & 0x7))], 4), 1))];
	case 0xe851: return [2, Mov(R32[((b[i+1] & 0x7))], LSR(R32[((b[i+1] & 0x7))], 1))];
	case 0x2852: return [2, Mov(Mem(R32[((b[i+1] & 0x7))], 1), LSR(Mem(R32[((b[i+1] & 0x7))], 1), R8[1]))];
	case 0xe852: return [2, Mov(R8[((b[i+1] & 0x7))], LSR(R8[((b[i+1] & 0x7))], R8[1]))];
	case 0x2853: return [2, Mov(Mem(R32[((b[i+1] & 0x7))], 4), LSR(Mem(R32[((b[i+1] & 0x7))], 4), R8[1]))];
	case 0xe853: return [2, Mov(R32[((b[i+1] & 0x7))], LSR(R32[((b[i+1] & 0x7))], R8[1]))];
	case 0x3850: return [2, Mov(Mem(R32[((b[i+1] & 0x7))], 1), ASR(Mem(R32[((b[i+1] & 0x7))], 1), 1))];
	case 0xf850: return [2, Mov(R8[((b[i+1] & 0x7))], ASR(R8[((b[i+1] & 0x7))], 1))];
	case 0x3851: return [2, Mov(Mem(R32[((b[i+1] & 0x7))], 4), ASR(Mem(R32[((b[i+1] & 0x7))], 4), 1))];
	case 0xf851: return [2, Mov(R32[((b[i+1] & 0x7))], ASR(R32[((b[i+1] & 0x7))], 1))];
	case 0x3852: return [2, Mov(Mem(R32[((b[i+1] & 0x7))], 1), ASR(Mem(R32[((b[i+1] & 0x7))], 1), R8[1]))];
	case 0xf852: return [2, Mov(R8[((b[i+1] & 0x7))], ASR(R8[((b[i+1] & 0x7))], R8[1]))];
	case 0x3853: return [2, Mov(Mem(R32[((b[i+1] & 0x7))], 4), ASR(Mem(R32[((b[i+1] & 0x7))], 4), R8[1]))];
	case 0xf853: return [2, Mov(R32[((b[i+1] & 0x7))], ASR(R32[((b[i+1] & 0x7))], R8[1]))];
	case 0x1076: return [2, Mov(Mem(R32[((b[i+1] & 0x7))], 1), Not(Mem(R32[((b[i+1] & 0x7))], 1)))];
	case 0xd076: return [2, Mov(R8[((b[i+1] & 0x7))], Not(R8[((b[i+1] & 0x7))]))];
	case 0x1077: return [2, Mov(Mem(R32[((b[i+1] & 0x7))], 4), Not(Mem(R32[((b[i+1] & 0x7))], 4)))];
	case 0xd077: return [2, Mov(R32[((b[i+1] & 0x7))], Not(R32[((b[i+1] & 0x7))]))];
	case 0x1876: return [2, Mov(Mem(R32[((b[i+1] & 0x7))], 1), Neg(Mem(R32[((b[i+1] & 0x7))], 1)))];
	case 0xd876: return [2, Mov(R8[((b[i+1] & 0x7))], Neg(R8[((b[i+1] & 0x7))]))];
	case 0x1877: return [2, Mov(Mem(R32[((b[i+1] & 0x7))], 4), Neg(Mem(R32[((b[i+1] & 0x7))], 4)))];
	case 0xd877: return [2, Mov(R32[((b[i+1] & 0x7))], Neg(R32[((b[i+1] & 0x7))]))];
	case 0x2076: return [2, Mov(R16[0], Mul(R8[0], Mem(R32[((b[i+1] & 0x7))], 1)))];
	case 0xe076: return [2, Mov(R16[0], Mul(R8[0], R8[((b[i+1] & 0x7))]))];
	case 0x2077: return [2, Mov(R32[0], Mul(R32[0], Mem(R32[((b[i+1] & 0x7))], 4)))];
	case 0xe077: return [2, Mov(R32[0], Mul(R32[0], R32[((b[i+1] & 0x7))]))];
	case 0x2876: return [2, Mov(R16[0], Mul(R8[0], Mem(R32[((b[i+1] & 0x7))], 1)))];
	case 0xe876: return [2, Mov(R16[0], Mul(R8[0], R8[((b[i+1] & 0x7))]))];
	case 0x2877: return [2, Mov(R32[0], Mul(R32[0], Mem(R32[((b[i+1] & 0x7))], 4)))];
	case 0xe877: return [2, Mov(R32[0], Mul(R32[0], R32[((b[i+1] & 0x7))]))];
	case 0x7e: return [2, Mov(Mem(R32[((b[i+1] & 0x7))], 1), Add(Mem(R32[((b[i+1] & 0x7))], 1), 1))];
	case 0xc07e: return [2, Mov(R8[((b[i+1] & 0x7))], Add(R8[((b[i+1] & 0x7))], 1))];
	case 0x7f: return [2, Mov(Mem(R32[((b[i+1] & 0x7))], 4), Add(Mem(R32[((b[i+1] & 0x7))], 4), 1))];
	case 0xc07f: return [2, Mov(R32[((b[i+1] & 0x7))], Add(R32[((b[i+1] & 0x7))], 1))];
	case 0x87e: return [2, Mov(Mem(R32[((b[i+1] & 0x7))], 1), Add(Mem(R32[((b[i+1] & 0x7))], 1), -1))];
	case 0xc87e: return [2, Mov(R8[((b[i+1] & 0x7))], Add(R8[((b[i+1] & 0x7))], -1))];
	case 0x87f: return [2, Mov(Mem(R32[((b[i+1] & 0x7))], 4), Add(Mem(R32[((b[i+1] & 0x7))], 4), -1))];
	case 0xc87f: return [2, Mov(R32[((b[i+1] & 0x7))], Add(R32[((b[i+1] & 0x7))], -1))];
	case 0x107f: return [2, Mov(R32[4], Add(R32[4], -4)),Mov(Mem(R32[4], 4), Add(R32[8], 2)),Mov(R32[8], Mem(R32[((b[i+1] & 0x7))], 4))];
	case 0xd07f: return [2, Mov(R32[4], Add(R32[4], -4)),Mov(Mem(R32[4], 4), Add(R32[8], 2)),Mov(R32[8], R32[((b[i+1] & 0x7))])];
	case 0x207f: return [2, Mov(R32[8], Add(R32[8], 2))];
	case 0xe07f: return [2, Mov(R32[8], Add(R32[8], 2))];
	case 0x307f: return [2, Mov(R32[4], Add(R32[4], -4)),Mov(Mem(R32[4], 4), Mem(R32[((b[i+1] & 0x7))], 4))];
	case 0xf07f: return [2, Mov(R32[4], Add(R32[4], -4)),Mov(Mem(R32[4], 4), R32[((b[i+1] & 0x7))])];
	}
if(((((b[i+0] & 0x40)>>>6)) & 0x1) == 0x0)
	switch((b[i+0]|(b[i+1]<<8)) & 0xc0bf) {
	case 0x0: return [2, Mov(Mem(R32[((b[i+1] & 0x7))], 1), Add(Mem(R32[((b[i+1] & 0x7))], 1), R8[(((b[i+1] & 0x38)>>>3))]))];
	case 0xc000: return [2, Mov(R8[((b[i+1] & 0x7))], Add(R8[((b[i+1] & 0x7))], R8[(((b[i+1] & 0x38)>>>3))]))];
	case 0x1: return [2, Mov(Mem(R32[((b[i+1] & 0x7))], 4), Add(Mem(R32[((b[i+1] & 0x7))], 4), R32[(((b[i+1] & 0x38)>>>3))]))];
	case 0xc001: return [2, Mov(R32[((b[i+1] & 0x7))], Add(R32[((b[i+1] & 0x7))], R32[(((b[i+1] & 0x38)>>>3))]))];
	case 0x2: return [2, Mov(R8[(((b[i+1] & 0x38)>>>3))], Add(R8[(((b[i+1] & 0x38)>>>3))], Mem(R32[((b[i+1] & 0x7))], 1)))];
	case 0xc002: return [2, Mov(R8[(((b[i+1] & 0x38)>>>3))], Add(R8[(((b[i+1] & 0x38)>>>3))], R8[((b[i+1] & 0x7))]))];
	case 0x3: return [2, Mov(R32[(((b[i+1] & 0x38)>>>3))], Add(R32[(((b[i+1] & 0x38)>>>3))], Mem(R32[((b[i+1] & 0x7))], 4)))];
	case 0xc003: return [2, Mov(R32[(((b[i+1] & 0x38)>>>3))], Add(R32[(((b[i+1] & 0x38)>>>3))], R32[((b[i+1] & 0x7))]))];
	case 0x8: return [2, Mov(Mem(R32[((b[i+1] & 0x7))], 1), Or(Mem(R32[((b[i+1] & 0x7))], 1), R8[(((b[i+1] & 0x38)>>>3))]))];
	case 0xc008: return [2, Mov(R8[((b[i+1] & 0x7))], Or(R8[((b[i+1] & 0x7))], R8[(((b[i+1] & 0x38)>>>3))]))];
	case 0x9: return [2, Mov(Mem(R32[((b[i+1] & 0x7))], 4), Or(Mem(R32[((b[i+1] & 0x7))], 4), R32[(((b[i+1] & 0x38)>>>3))]))];
	case 0xc009: return [2, Mov(R32[((b[i+1] & 0x7))], Or(R32[((b[i+1] & 0x7))], R32[(((b[i+1] & 0x38)>>>3))]))];
	case 0xa: return [2, Mov(R8[(((b[i+1] & 0x38)>>>3))], Or(R8[(((b[i+1] & 0x38)>>>3))], Mem(R32[((b[i+1] & 0x7))], 1)))];
	case 0xc00a: return [2, Mov(R8[(((b[i+1] & 0x38)>>>3))], Or(R8[(((b[i+1] & 0x38)>>>3))], R8[((b[i+1] & 0x7))]))];
	case 0xb: return [2, Mov(R32[(((b[i+1] & 0x38)>>>3))], Or(R32[(((b[i+1] & 0x38)>>>3))], Mem(R32[((b[i+1] & 0x7))], 4)))];
	case 0xc00b: return [2, Mov(R32[(((b[i+1] & 0x38)>>>3))], Or(R32[(((b[i+1] & 0x38)>>>3))], R32[((b[i+1] & 0x7))]))];
	case 0x10: return [2, Mov(Mem(R32[((b[i+1] & 0x7))], 1), Add(Mem(R32[((b[i+1] & 0x7))], 1), Add(R8[(((b[i+1] & 0x38)>>>3))], F[1])))];
	case 0xc010: return [2, Mov(R8[((b[i+1] & 0x7))], Add(R8[((b[i+1] & 0x7))], Add(R8[(((b[i+1] & 0x38)>>>3))], F[1])))];
	case 0x11: return [2, Mov(Mem(R32[((b[i+1] & 0x7))], 4), Add(Mem(R32[((b[i+1] & 0x7))], 4), Add(R32[(((b[i+1] & 0x38)>>>3))], F[1])))];
	case 0xc011: return [2, Mov(R32[((b[i+1] & 0x7))], Add(R32[((b[i+1] & 0x7))], Add(R32[(((b[i+1] & 0x38)>>>3))], F[1])))];
	case 0x12: return [2, Mov(R8[(((b[i+1] & 0x38)>>>3))], Add(R8[(((b[i+1] & 0x38)>>>3))], Add(Mem(R32[((b[i+1] & 0x7))], 1), F[1])))];
	case 0xc012: return [2, Mov(R8[(((b[i+1] & 0x38)>>>3))], Add(R8[(((b[i+1] & 0x38)>>>3))], Add(R8[((b[i+1] & 0x7))], F[1])))];
	case 0x13: return [2, Mov(R32[(((b[i+1] & 0x38)>>>3))], Add(R32[(((b[i+1] & 0x38)>>>3))], Add(Mem(R32[((b[i+1] & 0x7))], 4), F[1])))];
	case 0xc013: return [2, Mov(R32[(((b[i+1] & 0x38)>>>3))], Add(R32[(((b[i+1] & 0x38)>>>3))], Add(R32[((b[i+1] & 0x7))], F[1])))];
	case 0x18: return [2, Mov(Mem(R32[((b[i+1] & 0x7))], 1), Add(R8[(((b[i+1] & 0x38)>>>3))], Neg(Add(Add(Mem(R32[((b[i+1] & 0x7))], 1), Neg(F[1])), 1))))];
	case 0xc018: return [2, Mov(R8[((b[i+1] & 0x7))], Add(R8[(((b[i+1] & 0x38)>>>3))], Neg(Add(Add(R8[((b[i+1] & 0x7))], Neg(F[1])), 1))))];
	case 0x19: return [2, Mov(Mem(R32[((b[i+1] & 0x7))], 4), Add(R32[(((b[i+1] & 0x38)>>>3))], Neg(Add(Add(Mem(R32[((b[i+1] & 0x7))], 4), Neg(F[1])), 1))))];
	case 0xc019: return [2, Mov(R32[((b[i+1] & 0x7))], Add(R32[(((b[i+1] & 0x38)>>>3))], Neg(Add(Add(R32[((b[i+1] & 0x7))], Neg(F[1])), 1))))];
	case 0x1a: return [2, Mov(R8[(((b[i+1] & 0x38)>>>3))], Add(Mem(R32[((b[i+1] & 0x7))], 1), Neg(Add(Add(R8[(((b[i+1] & 0x38)>>>3))], Neg(F[1])), 1))))];
	case 0xc01a: return [2, Mov(R8[(((b[i+1] & 0x38)>>>3))], Add(R8[((b[i+1] & 0x7))], Neg(Add(Add(R8[(((b[i+1] & 0x38)>>>3))], Neg(F[1])), 1))))];
	case 0x1b: return [2, Mov(R32[(((b[i+1] & 0x38)>>>3))], Add(Mem(R32[((b[i+1] & 0x7))], 4), Neg(Add(Add(R32[(((b[i+1] & 0x38)>>>3))], Neg(F[1])), 1))))];
	case 0xc01b: return [2, Mov(R32[(((b[i+1] & 0x38)>>>3))], Add(R32[((b[i+1] & 0x7))], Neg(Add(Add(R32[(((b[i+1] & 0x38)>>>3))], Neg(F[1])), 1))))];
	case 0x20: return [2, Mov(Mem(R32[((b[i+1] & 0x7))], 1), And(Mem(R32[((b[i+1] & 0x7))], 1), R8[(((b[i+1] & 0x38)>>>3))]))];
	case 0xc020: return [2, Mov(R8[((b[i+1] & 0x7))], And(R8[((b[i+1] & 0x7))], R8[(((b[i+1] & 0x38)>>>3))]))];
	case 0x21: return [2, Mov(Mem(R32[((b[i+1] & 0x7))], 4), And(Mem(R32[((b[i+1] & 0x7))], 4), R32[(((b[i+1] & 0x38)>>>3))]))];
	case 0xc021: return [2, Mov(R32[((b[i+1] & 0x7))], And(R32[((b[i+1] & 0x7))], R32[(((b[i+1] & 0x38)>>>3))]))];
	case 0x22: return [2, Mov(R8[(((b[i+1] & 0x38)>>>3))], And(R8[(((b[i+1] & 0x38)>>>3))], Mem(R32[((b[i+1] & 0x7))], 1)))];
	case 0xc022: return [2, Mov(R8[(((b[i+1] & 0x38)>>>3))], And(R8[(((b[i+1] & 0x38)>>>3))], R8[((b[i+1] & 0x7))]))];
	case 0x23: return [2, Mov(R32[(((b[i+1] & 0x38)>>>3))], And(R32[(((b[i+1] & 0x38)>>>3))], Mem(R32[((b[i+1] & 0x7))], 4)))];
	case 0xc023: return [2, Mov(R32[(((b[i+1] & 0x38)>>>3))], And(R32[(((b[i+1] & 0x38)>>>3))], R32[((b[i+1] & 0x7))]))];
	case 0x28: return [2, Mov(Mem(R32[((b[i+1] & 0x7))], 1), Add(Mem(R32[((b[i+1] & 0x7))], 1), Neg(R8[(((b[i+1] & 0x38)>>>3))])))];
	case 0xc028: return [2, Mov(R8[((b[i+1] & 0x7))], Add(R8[((b[i+1] & 0x7))], Neg(R8[(((b[i+1] & 0x38)>>>3))])))];
	case 0x29: return [2, Mov(Mem(R32[((b[i+1] & 0x7))], 4), Add(Mem(R32[((b[i+1] & 0x7))], 4), Neg(R32[(((b[i+1] & 0x38)>>>3))])))];
	case 0xc029: return [2, Mov(R32[((b[i+1] & 0x7))], Add(R32[((b[i+1] & 0x7))], Neg(R32[(((b[i+1] & 0x38)>>>3))])))];
	case 0x2a: return [2, Mov(R8[(((b[i+1] & 0x38)>>>3))], Add(R8[(((b[i+1] & 0x38)>>>3))], Neg(Mem(R32[((b[i+1] & 0x7))], 1))))];
	case 0xc02a: return [2, Mov(R8[(((b[i+1] & 0x38)>>>3))], Add(R8[(((b[i+1] & 0x38)>>>3))], Neg(R8[((b[i+1] & 0x7))])))];
	case 0x2b: return [2, Mov(R32[(((b[i+1] & 0x38)>>>3))], Add(R32[(((b[i+1] & 0x38)>>>3))], Neg(Mem(R32[((b[i+1] & 0x7))], 4))))];
	case 0xc02b: return [2, Mov(R32[(((b[i+1] & 0x38)>>>3))], Add(R32[(((b[i+1] & 0x38)>>>3))], Neg(R32[((b[i+1] & 0x7))])))];
	case 0x30: return [2, Mov(Mem(R32[((b[i+1] & 0x7))], 1), Xor(Mem(R32[((b[i+1] & 0x7))], 1), R8[(((b[i+1] & 0x38)>>>3))]))];
	case 0xc030: return [2, Mov(R8[((b[i+1] & 0x7))], Xor(R8[((b[i+1] & 0x7))], R8[(((b[i+1] & 0x38)>>>3))]))];
	case 0x31: return [2, Mov(Mem(R32[((b[i+1] & 0x7))], 4), Xor(Mem(R32[((b[i+1] & 0x7))], 4), R32[(((b[i+1] & 0x38)>>>3))]))];
	case 0xc031: return [2, Mov(R32[((b[i+1] & 0x7))], Xor(R32[((b[i+1] & 0x7))], R32[(((b[i+1] & 0x38)>>>3))]))];
	case 0x32: return [2, Mov(R8[(((b[i+1] & 0x38)>>>3))], Xor(R8[(((b[i+1] & 0x38)>>>3))], Mem(R32[((b[i+1] & 0x7))], 1)))];
	case 0xc032: return [2, Mov(R8[(((b[i+1] & 0x38)>>>3))], Xor(R8[(((b[i+1] & 0x38)>>>3))], R8[((b[i+1] & 0x7))]))];
	case 0x33: return [2, Mov(R32[(((b[i+1] & 0x38)>>>3))], Xor(R32[(((b[i+1] & 0x38)>>>3))], Mem(R32[((b[i+1] & 0x7))], 4)))];
	case 0xc033: return [2, Mov(R32[(((b[i+1] & 0x38)>>>3))], Xor(R32[(((b[i+1] & 0x38)>>>3))], R32[((b[i+1] & 0x7))]))];
	case 0x38: return [2, Mov(F[2], Eq(Mem(R32[((b[i+1] & 0x7))], 1), R8[(((b[i+1] & 0x38)>>>3))])),Mov(F[1], Lt(Mem(R32[((b[i+1] & 0x7))], 1), R8[(((b[i+1] & 0x38)>>>3))]))];
	case 0xc038: return [2, Mov(F[2], Eq(R8[((b[i+1] & 0x7))], R8[(((b[i+1] & 0x38)>>>3))])),Mov(F[1], Lt(R8[((b[i+1] & 0x7))], R8[(((b[i+1] & 0x38)>>>3))]))];
	case 0x39: return [2, Mov(F[2], Eq(Mem(R32[((b[i+1] & 0x7))], 4), R32[(((b[i+1] & 0x38)>>>3))])),Mov(F[1], Lt(Mem(R32[((b[i+1] & 0x7))], 4), R32[(((b[i+1] & 0x38)>>>3))]))];
	case 0xc039: return [2, Mov(F[2], Eq(R32[((b[i+1] & 0x7))], R32[(((b[i+1] & 0x38)>>>3))])),Mov(F[1], Lt(R32[((b[i+1] & 0x7))], R32[(((b[i+1] & 0x38)>>>3))]))];
	case 0x3a: return [2, Mov(F[2], Eq(R8[(((b[i+1] & 0x38)>>>3))], Mem(R32[((b[i+1] & 0x7))], 1))),Mov(F[1], Lt(R8[(((b[i+1] & 0x38)>>>3))], Mem(R32[((b[i+1] & 0x7))], 1)))];
	case 0xc03a: return [2, Mov(F[2], Eq(R8[(((b[i+1] & 0x38)>>>3))], R8[((b[i+1] & 0x7))])),Mov(F[1], Lt(R8[(((b[i+1] & 0x38)>>>3))], R8[((b[i+1] & 0x7))]))];
	case 0x3b: return [2, Mov(F[2], Eq(R32[(((b[i+1] & 0x38)>>>3))], Mem(R32[((b[i+1] & 0x7))], 4))),Mov(F[1], Lt(R32[(((b[i+1] & 0x38)>>>3))], Mem(R32[((b[i+1] & 0x7))], 4)))];
	case 0xc03b: return [2, Mov(F[2], Eq(R32[(((b[i+1] & 0x38)>>>3))], R32[((b[i+1] & 0x7))])),Mov(F[1], Lt(R32[(((b[i+1] & 0x38)>>>3))], R32[((b[i+1] & 0x7))]))];
	case 0x84: return [2, Mov(F[2], Eq(And(Mem(R32[((b[i+1] & 0x7))], 1), R8[(((b[i+1] & 0x38)>>>3))]), 0))];
	case 0xc084: return [2, Mov(F[2], Eq(And(R8[((b[i+1] & 0x7))], R8[(((b[i+1] & 0x38)>>>3))]), 0))];
	case 0x85: return [2, Mov(F[2], Eq(And(Mem(R32[((b[i+1] & 0x7))], 4), R32[(((b[i+1] & 0x38)>>>3))]), 0))];
	case 0xc085: return [2, Mov(F[2], Eq(And(R32[((b[i+1] & 0x7))], R32[(((b[i+1] & 0x38)>>>3))]), 0))];
	case 0x86: return [2, Swap(Mem(R32[((b[i+1] & 0x7))], 1), R8[(((b[i+1] & 0x38)>>>3))])];
	case 0xc086: return [2, Swap(R8[((b[i+1] & 0x7))], R8[(((b[i+1] & 0x38)>>>3))])];
	case 0x87: return [2, Swap(Mem(R32[((b[i+1] & 0x7))], 4), R32[(((b[i+1] & 0x38)>>>3))])];
	case 0xc087: return [2, Swap(R32[((b[i+1] & 0x7))], R32[(((b[i+1] & 0x38)>>>3))])];
	case 0x88: return [2, Mov(Mem(R32[((b[i+1] & 0x7))], 1), R8[(((b[i+1] & 0x38)>>>3))])];
	case 0xc088: return [2, Mov(R8[((b[i+1] & 0x7))], R8[(((b[i+1] & 0x38)>>>3))])];
	case 0x89: return [2, Mov(Mem(R32[((b[i+1] & 0x7))], 4), R32[(((b[i+1] & 0x38)>>>3))])];
	case 0xc089: return [2, Mov(R32[((b[i+1] & 0x7))], R32[(((b[i+1] & 0x38)>>>3))])];
	case 0x8a: return [2, Mov(R8[(((b[i+1] & 0x38)>>>3))], Mem(R32[((b[i+1] & 0x7))], 1))];
	case 0xc08a: return [2, Mov(R8[(((b[i+1] & 0x38)>>>3))], R8[((b[i+1] & 0x7))])];
	case 0x8b: return [2, Mov(R32[(((b[i+1] & 0x38)>>>3))], Mem(R32[((b[i+1] & 0x7))], 4))];
	case 0xc08b: return [2, Mov(R32[(((b[i+1] & 0x38)>>>3))], R32[((b[i+1] & 0x7))])];
	case 0x8c: return [2, Mov(Mem(R32[((b[i+1] & 0x7))], 4), RS[(((b[i+1] & 0x38)>>>3))])];
	case 0xc08c: return [2, Mov(R32[((b[i+1] & 0x7))], RS[(((b[i+1] & 0x38)>>>3))])];
	case 0x8d: return [2, Mov(R32[(((b[i+1] & 0x38)>>>3))], R32[((b[i+1] & 0x7))])];
	case 0x8e: return [2, Mov(RS[(((b[i+1] & 0x38)>>>3))], Mem(R32[((b[i+1] & 0x7))], 2))];
	case 0xc08e: return [2, Mov(RS[(((b[i+1] & 0x38)>>>3))], R16[((b[i+1] & 0x7))])];
	}

	switch((b[i+0]) & 0xff) {
	case 0x4: return [2, Mov(R8[0], Add(R8[0], (b[i+1])))];
	case 0xc: return [2, Mov(R8[0], Or(R8[0], (b[i+1])))];
	case 0x14: return [2, Mov(R8[0], Add(R8[0], Add((b[i+1]), F[1])))];
	case 0x1c: return [2, Mov(R8[0], Add((b[i+1]), Neg(Add(Add(R8[0], Neg(F[1])), 1))))];
	case 0x24: return [2, Mov(R8[0], And(R8[0], (b[i+1])))];
	case 0x2c: return [2, Mov(R8[0], Add(R8[0], -(b[i+1])))];
	case 0x34: return [2, Mov(R8[0], Xor(R8[0], (b[i+1])))];
	case 0x3c: return [2, Mov(F[2], Eq(R8[0], (b[i+1]))),Mov(F[1], Lt(R8[0], (b[i+1])))];
	case 0x6a: return [2, Mov(R32[4], Add(R32[4], -1)),Mov(Mem(R32[4], 1), (b[i+1]))];
	case 0x70: return [2, If(F[0], Mov(R32[8], Add(R32[8], ((b[i+1]) + 2))))];
	case 0x71: return [2, If(Not(F[0]), Mov(R32[8], Add(R32[8], ((b[i+1]) + 2))))];
	case 0x72: return [2, If(F[1], Mov(R32[8], Add(R32[8], ((b[i+1]) + 2))))];
	case 0x73: return [2, If(Not(F[1]), Mov(R32[8], Add(R32[8], ((b[i+1]) + 2))))];
	case 0x74: return [2, If(F[2], Mov(R32[8], Add(R32[8], ((b[i+1]) + 2))))];
	case 0x75: return [2, If(Not(F[2]), Mov(R32[8], Add(R32[8], ((b[i+1]) + 2))))];
	case 0x76: return [2, If(Or(F[1], F[2]), Mov(R32[8], Add(R32[8], ((b[i+1]) + 2))))];
	case 0x77: return [2, If(And(Not(F[1]), Not(F[2])), Mov(R32[8], Add(R32[8], ((b[i+1]) + 2))))];
	case 0x78: return [2, If(F[3], Mov(R32[8], Add(R32[8], ((b[i+1]) + 2))))];
	case 0x79: return [2, If(Not(F[3]), Mov(R32[8], Add(R32[8], ((b[i+1]) + 2))))];
	case 0x7a: return [2, If(F[4], Mov(R32[8], Add(R32[8], ((b[i+1]) + 2))))];
	case 0x7b: return [2, If(Not(F[4]), Mov(R32[8], Add(R32[8], ((b[i+1]) + 2))))];
	case 0x7c: return [2, If(Not(Eq(F[0], F[3])), Mov(R32[8], Add(R32[8], ((b[i+1]) + 2))))];
	case 0x7d: return [2, If(Eq(F[0], F[3]), Mov(R32[8], Add(R32[8], ((b[i+1]) + 2))))];
	case 0x7e: return [2, If(Or(F[2], Not(Eq(F[0], F[3]))), Mov(R32[8], Add(R32[8], ((b[i+1]) + 2))))];
	case 0x7f: return [2, If(And(Not(F[2]), Eq(F[0], F[3])), Mov(R32[8], Add(R32[8], ((b[i+1]) + 2))))];
	case 0xa8: return [2, Mov(F[2], Eq(And(R8[0], (b[i+1])), 0))];
	case 0xb0: return [2, Mov(R8[0], (b[i+1]))];
	case 0xb1: return [2, Mov(R8[1], (b[i+1]))];
	case 0xb2: return [2, Mov(R8[2], (b[i+1]))];
	case 0xb3: return [2, Mov(R8[3], (b[i+1]))];
	case 0xb4: return [2, Mov(R8[4], (b[i+1]))];
	case 0xb5: return [2, Mov(R8[5], (b[i+1]))];
	case 0xb6: return [2, Mov(R8[6], (b[i+1]))];
	case 0xb7: return [2, Mov(R8[7], (b[i+1]))];
	case 0xeb: return [2, Mov(R32[8], Add(R32[8], ((b[i+1]) + 2)))];
	}

	switch((b[i+0]) & 0xff) {
	case 0x90: return [1, Nop()];
	case 0x91: return [1, Swap(R32[0], R32[1])];
	case 0x92: return [1, Swap(R32[0], R32[2])];
	case 0x93: return [1, Swap(R32[0], R32[3])];
	case 0x94: return [1, Swap(R32[0], R32[4])];
	case 0x95: return [1, Swap(R32[0], R32[5])];
	case 0x96: return [1, Swap(R32[0], R32[6])];
	case 0x97: return [1, Swap(R32[0], R32[7])];
	case 0xc3: return [1, Mov(R32[8], Mem(R32[4], 4)),Mov(R32[4], Add(R32[4], 4))];
	case 0xcc: return [1, Interrupt(3)];
	case 0xf8: return [1, Mov(F[1], 0)];
	case 0xf9: return [1, Mov(F[1], 1)];
	case 0xfa: return [1, Mov(F[7], 0)];
	case 0xfb: return [1, Mov(F[7], 1)];
	case 0xfc: return [1, Mov(F[6], 0)];
	case 0xfd: return [1, Mov(F[6], 1)];
	case 0x6: return [1, Mov(R32[4], Add(R32[4], -2)),Mov(Mem(R32[4], 2), RS[0])];
	case 0x7: return [1, Mov(RS[0], Mem(R32[4], 2)),Mov(R32[4], Add(R32[4], 2))];
	case 0xe: return [1, Mov(R32[4], Add(R32[4], -2)),Mov(Mem(R32[4], 2), RS[1])];
	case 0x16: return [1, Mov(R32[4], Add(R32[4], -2)),Mov(Mem(R32[4], 2), RS[5])];
	case 0x17: return [1, Mov(RS[5], Mem(R32[4], 2)),Mov(R32[4], Add(R32[4], 2))];
	case 0x1e: return [1, Mov(R32[4], Add(R32[4], -2)),Mov(Mem(R32[4], 2), RS[3])];
	case 0x1f: return [1, Mov(RS[3], Mem(R32[4], 2)),Mov(R32[4], Add(R32[4], 2))];
	case 0x40: return [1, Mov(R32[0], Add(R32[0], 1))];
	case 0x41: return [1, Mov(R32[1], Add(R32[1], 1))];
	case 0x42: return [1, Mov(R32[2], Add(R32[2], 1))];
	case 0x43: return [1, Mov(R32[3], Add(R32[3], 1))];
	case 0x44: return [1, Mov(R32[4], Add(R32[4], 1))];
	case 0x45: return [1, Mov(R32[5], Add(R32[5], 1))];
	case 0x46: return [1, Mov(R32[6], Add(R32[6], 1))];
	case 0x47: return [1, Mov(R32[7], Add(R32[7], 1))];
	case 0x48: return [1, Mov(R32[0], Add(R32[0], -1))];
	case 0x49: return [1, Mov(R32[1], Add(R32[1], -1))];
	case 0x4a: return [1, Mov(R32[2], Add(R32[2], -1))];
	case 0x4b: return [1, Mov(R32[3], Add(R32[3], -1))];
	case 0x4c: return [1, Mov(R32[4], Add(R32[4], -1))];
	case 0x4d: return [1, Mov(R32[5], Add(R32[5], -1))];
	case 0x4e: return [1, Mov(R32[6], Add(R32[6], -1))];
	case 0x4f: return [1, Mov(R32[7], Add(R32[7], -1))];
	case 0x50: return [1, Mov(R32[4], Add(R32[4], -4)),Mov(Mem(R32[4], 4), R32[0])];
	case 0x51: return [1, Mov(R32[4], Add(R32[4], -4)),Mov(Mem(R32[4], 4), R32[1])];
	case 0x52: return [1, Mov(R32[4], Add(R32[4], -4)),Mov(Mem(R32[4], 4), R32[2])];
	case 0x53: return [1, Mov(R32[4], Add(R32[4], -4)),Mov(Mem(R32[4], 4), R32[3])];
	case 0x54: return [1, Mov(R32[4], Add(R32[4], -4)),Mov(Mem(R32[4], 4), R32[4])];
	case 0x55: return [1, Mov(R32[4], Add(R32[4], -4)),Mov(Mem(R32[4], 4), R32[5])];
	case 0x56: return [1, Mov(R32[4], Add(R32[4], -4)),Mov(Mem(R32[4], 4), R32[6])];
	case 0x57: return [1, Mov(R32[4], Add(R32[4], -4)),Mov(Mem(R32[4], 4), R32[7])];
	case 0x58: return [1, Mov(R32[0], Mem(R32[4], 4)),Mov(R32[4], Add(R32[4], 4))];
	case 0x59: return [1, Mov(R32[1], Mem(R32[4], 4)),Mov(R32[4], Add(R32[4], 4))];
	case 0x5a: return [1, Mov(R32[2], Mem(R32[4], 4)),Mov(R32[4], Add(R32[4], 4))];
	case 0x5b: return [1, Mov(R32[3], Mem(R32[4], 4)),Mov(R32[4], Add(R32[4], 4))];
	case 0x5c: return [1, Mov(R32[4], Mem(R32[4], 4)),Mov(R32[4], Add(R32[4], 4))];
	case 0x5d: return [1, Mov(R32[5], Mem(R32[4], 4)),Mov(R32[4], Add(R32[4], 4))];
	case 0x5e: return [1, Mov(R32[6], Mem(R32[4], 4)),Mov(R32[4], Add(R32[4], 4))];
	case 0x5f: return [1, Mov(R32[7], Mem(R32[4], 4)),Mov(R32[4], Add(R32[4], 4))];
	}

}
exports.SP = R.ESP;
exports.IP = R.EIP;
