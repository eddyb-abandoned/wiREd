var fs = require('fs'), util = require('util');

function inspect(x, p) {
    if(known(x) && x >= 100)
        return '0x'+x.toString(16);
    if(typeof x === 'object' && x.inspect)
        return x.inspect(0, p || 16);
    return util.inspect(x);
}

function known(x) {
    return typeof x === 'number';
}

Object.defineProperties(Number.prototype, {
    known: {value: true},
    runtimeKnown: {value: true},
    code: {get() {
        if(this >= 100)
            return '0x'+this.toString(16);
        return this.toString();
    }},
});

function bitsof(x, fatal) {
    if(typeof x === 'object' && known(x.bitsof))
        return x.bitsof;
    if(fatal)
        throw new TypeError('Missing bit size for '+inspect(x));
    else
        console.error('Missing bit size for '+inspect(x));
}
function sizeof(x, fatal) {
    if(known(x = bitsof(x, fatal)))
        return Math.ceil(x/8);
}

var codeGen = exports.codeGen = {
    intBits: 32
};

codeGen.runtime = [
//BEGIN runtime
`var util = require('util');`,

`var known = exports.known = function known(x) {
    return typeof x === 'number';
}`,

`var bitsof = exports.bitsof = function bitsof(x) {
    if(typeof x === 'object' && 'bitsof' in x)
        return x.bitsof;
    throw new TypeError('Missing bit size for '+inspect(x));
}`,

`var sizeof = exports.sizeof = function sizeof(x) {
    return Math.ceil(bitsof(x)/8);
}`,

`var valueof = exports.valueof = function valueof(x) {
    if(known(x))
        return x;
    var v = x.value;
    if(v === null || v === void 0)
        return x;
    return v;
}`,

`var lvalueof = exports.lvalueof = function lvalueof(x) {
    if(typeof x !== 'object' || !('lvalue' in x))
        return valueof(x);
    var v = x.lvalue;
    if(v === null || v === void 0)
        return x;
    return v;
}`,

`var inspect = exports.inspect = function inspect(x, p) {
    if(known(x) && x >= 100)
        return '0x'+x.toString(16);
    if(typeof x === 'object' && x.inspect)
        return x.inspect(0, p || 16);
    return util.inspect(x);
}`
//END runtime
];

{
    let fn = {};
    codeGen.int = (bits, signed)=>{
        var id = (signed ? 'i' : 'u')+bits;
        if(!fn[id]) {
            fn[id] = true;
//BEGIN runtime
codeGen.runtime.push(`function ${id}(x) {
    if(known(x))
        return ${signed ? (bits == codeGen.intBits ? '(x&~0)' : '((x<<'+(codeGen.intBits-bits)+')>>'+(codeGen.intBits-bits)+')')
                        : (bits == codeGen.intBits ? '((x = x&~0), (x = x < 0 ? x+0x100000000 : x))' : '(x&0x'+((1<<bits)-1).toString(16)+')')};
    if(x.bitsof === ${bits} && x.signed === ${signed})
        return x;
    if(x.hasOwnProperty('fn') && x.fn == 'Mem')${signed?'':' {'}
        x.bitsof = ${bits};${signed?'':`
        return Object.create(x, {
            value: {get: function() {
                var v = valueof(x);
                if(v !== x)
                    return v.fn == 'Mem' ? ${id}(v) : v;
            }, set: function(v) {
                x.value = v;
            }},
            lvalue: {get: function() {
                var v = lvalueof(x);
                if(v !== x)
                    return v.fn == 'Mem' ? ${id}(v) : v;
            }},
        });
    }`}
    return Object.create(x, {
        bitsof: {value: ${bits}},
        signed: {value: ${signed}},
        value: {get: function() {
            var v = valueof(x);
            if(v !== x)
                return ${id}(v);
        }, set: function(v) {
            x.value = v;
        }},
        lvalue: {get: function() {
            if(x.fn != 'Mem')
                return;
            var v = lvalueof(x);
            if(v !== x)
                return ${id}(v);
        }},
        inspect: {value: function(_, p) {
            var wrap = ('bitsof' in x) && x.bitsof != ${bits};
            var ix = x.inspect ? x.inspect.call(this, _, !wrap && p || 16) : inspect(x, !wrap && p);
            return wrap ? '${id}('+ix+')' : ix;
        }}
    });
}`);
//END runtime
        }
        return id;
    };
}

codeGen.runtime.vars = codeGen.runtime.maxVars = 0;

codeGen.getVar = ()=>{
    var name = '$'+(codeGen.runtime.vars++);
    if(codeGen.runtime.vars > codeGen.runtime.maxVars)
        codeGen.runtime.maxVars = codeGen.runtime.vars;
    return name;
};

codeGen.mark = (a, props)=>{
    var refCount = 0, varName;
    if(a.hasOwnProperty('args'))
        a.args.forEach((x)=>x.touch && x.touch());
    else if(a.hasOwnProperty('a')) {
        a.a.touch && a.a.touch();
        if(a.hasOwnProperty('b'))
            a.b.touch && a.b.touch();
    } else if(a.touch)
        a.touch();
    a.touch = ()=>(refCount++, null);
    if(props)
        a = Object.create(a, props);
    return Object.create(a, {code: {get: ()=>{
        if(refCount <= 1)
            return a.code;
        if(!varName) {
            varName = codeGen.getVar();
            return '('+varName+' = '+a.code+')';
        }
        return varName;
    }}});
};

codeGen.normalize = (a)=>{
    if(typeof a.bitsof !== 'number' || typeof a.signed !== 'boolean') // FIXME this might skip some normalizations.
        return codeGen.mark(a);
    var bits = bitsof(a, true), props = {};
    if(a.runtimeKnown) {
        if(a.signed) {
            if(bits == codeGen.intBits)
                props.code = {get: ()=>'('+a.code+'&~0)'};
            else
                props.code = {get: ()=>'(('+a.code+'<<'+(codeGen.intBits-bits)+')>>'+(codeGen.intBits-bits)+')'};
        } else {
            if(bits == codeGen.intBits) {
                var temp = codeGen.getVar();
                props.code = {get: ()=>`((${temp} = ${a.code}&~0), (${temp} < 0 ? ${temp}+0x100000000 : ${temp}))`};
            } else
                props.code = {get: ()=>'('+a.code+'&0x'+((1<<bits)-1).toString(16)+')'};
        }
    } else
        props.code = {get: ()=>codeGen.int(bits, a.signed)+'('+a.code+')'};

    props.inspect = {value: (_, p)=>codeGen.int(bits, a.signed)+'('+inspect(a, p)+')'};
    return codeGen.mark(a, props);
};

var exportedFn = {
    inspect, known, bitsof, sizeof,

    Sub: (a, b)=>{
        if(a == b)
            return 0;
        return Add(a, Neg(b));
    },
    ROL: (a, b, bitsa=bitsof(a, true))=>Or(LSL(a, b), LSR(a, Sub(bitsa, b))),
    ROR: (a, b, bitsa=bitsof(a, true))=>Or(LSR(a, b), LSL(a, Sub(bitsa, b))),

    IntSize(a, bits) {
        if(bitsof(a) == bits)
            return a;
        a = Object.create(a);
        a.bitsof = bits;
        if(!('signed' in a))
            a.signed = false; // HACK deal with it.
        return codeGen.normalize(a);
    },

    IntSigned(a, signed) {
        if(a.signed === signed)
            return a;
        a = Object.create(a);
        a.signed = signed;
        return codeGen.normalize(a);
    },

    IntSizeSigned(a, bits, signed) {
        if(bitsof(a) == bits && a.signed === signed)
            return a;
        a = Object.create(a);
        a.bitsof = bits;
        a.signed = signed;
        return codeGen.normalize(a);
    },

    signed: (a)=>IntSigned(a, true),
    unsigned: (a)=>IntSigned(a, false),
};

for(let [signed, pfx] of [[true, 'i'], [false, 'u']])
    for(let bits of [8, 16, 32])
        exportedFn[pfx+bits] = (a)=>IntSizeSigned(a, bits, signed);

var precendence = {
    '()':1, '[]':1,
    '~':2,
    '*':3, '/':3, '%':3,
    '+':4, '-':4,
    '<<':5, '>>':5, '>>>':5,
    '<':6,
    '==':7,
    '&':8,
    '^':9,
    '|':10,


    '=':13, '<->':13,
    ',':14
};

'Nop,Interrupt'.split(',').forEach(function(fn) {
    exportedFn[fn] = (...args)=>codeGen.mark({
        inspect: ()=>fn+'('+args.map((x)=>inspect(x)).join(', ')+')',
        get code() {return fn+'('+args.map((x)=>x.code).join(', ')+')';},
        runtimeKnown: false
    });

//BEGIN runtime
codeGen.runtime.push(`function ${fn}() {
    var args = [].slice.call(arguments);
    return {
        constructor: ${fn}, fn: '${fn}', args: args,
        get value() {
            var changes = false, v = args.map(function(x) {
                var v = valueof(x);
                if(v !== x)
                    changes = true;
                return v;
            });
            if(changes) return ${fn}.apply(null, v);
        },
        inspect: function() {
            return '${fn}('+args.map(function(x) {return inspect(x);}).join(', ')+')';
        }
    };
}`);
//END runtime
});

exportedFn.If = (cond, then)=>{
    if(arguments.length != 2)
        throw new RangeError('Wrong number of arguments to If');
    return codeGen.mark({
        fn: 'If', args: [cond, then], cond, then,
        inspect() {return 'if('+inspect(cond)+') '+inspect(then)+';';},
        get code() {return 'If('+cond.code+', '+then.code+')';},
        runtimeKnown: false
    });
};

//BEGIN runtime
codeGen.runtime.push(`var If = exports.If = function If(cond, then) {
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
`);
//END runtime

exportedFn.Mem = (a, size=null)=>{
    if(size !== null)
        throw new Error('Deprecated size argument for Mem');
    return codeGen.mark({
        fn: 'Mem', a,
        inspect() {return '['+inspect(a)+']'+(this.bitsof || '');},
        get code() {return 'Mem('+a.code+')';},
        runtimeKnown: false
    });
};

//BEGIN runtime
codeGen.runtime.push(`var Mem = exports.Mem = function Mem(a) {
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
`);
//END runtime

exportedFn.Not = (a)=>known(a) ? ~a : codeGen.normalize({ // FIXME type not enforced on constants.
    fn: 'Not', op: '~', a, bitsof: bitsof(a), signed: a.signed,
    inspect: ()=>'~'+inspect(a, precendence['~']),
    get code() {return a.runtimeKnown ? '~'+a.code : 'Not('+a.code+')'},
    runtimeKnown: a.runtimeKnown
});

//BEGIN runtime
codeGen.runtime.push(`function Not(a) {
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
                var expr = inspect(a.a, ${precendence['==']})+' != '+inspect(a.b, ${precendence['==']});
                return ${precendence['==']} <= p ? expr : '('+expr+')'
            }
            if(this.bitsof == 1 && a.op == '<') {
                var expr = inspect(a.a, ${precendence['<']})+' >= '+inspect(a.b, ${precendence['<']});
                return ${precendence['<']} <= p ? expr : '('+expr+')'
            }
            var expr = '~'+inspect(a, ${precendence['~']});
            return ${precendence['~']} <= p ? expr : '('+expr+')';
        }
    };
}`);
//END runtime

exportedFn.Neg = (a)=>known(a) ? -a : codeGen.normalize({ // FIXME type not enforced on constants.
    fn: 'Neg', op: '-', a, bitsof: bitsof(a), signed: true,
    inspect: ()=>'-'+inspect(a, precendence['~']),
    get code() {return a.runtimeKnown ? '-'+a.code : 'Neg('+a.code+')'},
    runtimeKnown: a.runtimeKnown,
    CF: Not(Eq(a, 0))
});

//BEGIN runtime
codeGen.runtime.push(`function Neg(a) {
    if(known(a)) return -a;
    if(a.op == '-') return a.a;
    return {
        constructor: Neg, fn: 'Neg', op: '-', a: a,
        get value() {
            var v = valueof(a);
            if(v !== a) return Neg(v);
        },
        inspect: function(_, p) {
            var expr = '-'+inspect(a, ${precendence['~']});
            return ${precendence['~']} <= p ? expr : '('+expr+')';
        }
    };
}`);
//END runtime

var binaryOps = {
    Mov:'=', Swap:'<->',
    Add:'+', Mul:'*',
    And:'&', Or:'|', Xor:'^',
    Eq:'==', Lt:'<',
    LSL:'<<', LSR:'>>>', ASR:'>>'
};
Object.keys(binaryOps).forEach(function(fn) {
    var op = binaryOps[fn], prec = precendence[op];
    var prologue = '', p = (s, ...args)=>prologue += '\n    '+s.map((x, i)=>i?args[i-1]+x:x).join('');

    if(op == '+' || op == '&' || op == '|' || op == '^')
        p`if(known(a) && !known(b)) return ${fn}(b, a);`;
    if(op == '+' || op == '|' || op == '^')
        p`if(a == 0) return b;`;
    if(op == '+' || op == '|' || op == '^' || op == '<<' || op == '>>' || op == '>>>')
        p`if(b == 0) return a;`;
    if(op == '^')
        p`if(a === b) return 0;`;
    if(op == '&' || op == '|')
        p`if(a === b) return a;`;
    if(op != '=' && op != '<->')
        p`if(known(a) && known(b)) return +(a ${op} b);`;
    if(op == '|' || op == '&')
        p`if(b == -1 || !known(a) && a.bitsof && b == Math.pow(2, a.bitsof)-1) return ${op == '|' ? 'b' : 'a'};`;
    if(op == '+')
        p`if(a.op == '+' && known(a.b) && known(b)) return Add(a.a, a.b+b);`;
    if(op == '+')
        p`if(a.op == '-' && a.a == b || b.op == '-' && b.a == a) return 0;`;

    var prologueFn = eval(`(function(a, b) {${prologue}})`);

    exportedFn[fn] = function(a, b) {
        var o = prologueFn(a, b);
        if(typeof o !== 'undefined')
            return o;
        o = {
            fn, op, a, b,
            inspect: function(_, p) {
                var op = this.op, a = this.a, b = this.b;
                if(op == '+' && b < 0)
                    op = '-', b = -b;
                if(op == '=' && b.op && b.op != '=' && b.op != '<->' && b.op != '==' && b.op != '<' && b.a === a) {
                    op = b.op+'=';
                    b = b.b;
                }
                var expr = inspect(a, prec)+' '+op+' '+inspect(b, prec);
                return prec <= p ? expr : '('+expr+')';
            },
            get code() {return a.runtimeKnown && b.runtimeKnown ? '('+a.code+' '+op+' '+b.code+')' : fn+'('+a.code+', '+b.code+')';},
            runtimeKnown: a.runtimeKnown && b.runtimeKnown,
            CF: 0, NF: 0, OF: 0 // TODO flags.
        };
        if(op == '==' || op == '<')
            o.bitsof = 1, o.signed = false;
        else {
            var bitsa = bitsof(a);
            if(op == '<<' || op == '>>' || op == '>>>')
                o.bitsof = bitsa, o.signed = a.signed;
            else if(op != '<->' && known(bitsa) && known(b))
                o.bitsof = bitsa, o.signed = a.signed; // FIXME type not enforced on constants.
            else {
                var bitsb = bitsof(b);
                if(op != '=' && op != '<->' && known(bitsa) && known(bitsb)) {
                    if(bitsa != bitsb) {
                        console.error(fn+' called with differently typed operands ('+(a.signed)+'/'+bitsa+', '+(b.signed)+'/'+bitsb+'): '+inspect(a)+', '+inspect(b));
                        if(bitsb > bitsa)
                            bitsa = bitsb;
                    }
                    o.bitsof = bitsa;
                    o.signed = a.signed !== b.signed ? false : a.signed;
                }
            }
        }
        if(op == '==' || op == '<' || op == '=' || op == '<->')
            return codeGen.mark(o);
        if(op == '+' && b.fn == 'Neg') { // HACK a + -b == a - b.a
            o.ZF = Eq(a, b.a);
            o.CF = Lt(a, b.a);
        } else {
            o.ZF = Eq(o, 0);
            o.NF = Lt(o, 0);
        }
        return codeGen.normalize(o);
    };

//BEGIN runtime
codeGen.runtime.push(`var ${fn} = exports.${fn} = function ${fn}(a, b) {${prologue}
    return {
        constructor: ${fn}, fn: '${fn}', op: '${op}', a: a, b: b,${op == '=' || op == '<' ? ' bitsof: 1,' : ''}
        get value() {
            var va = ${op == '=' || op == '<->' ? 'lvalueof' : 'valueof'}(a), vb = ${op == '<->' ? 'lvalueof' : 'valueof'}(b);
            if(va !== a || vb !== b) return ${fn}(va, vb);
        },
        inspect: function(_, p) {
            var a = this.a, b = this.b;${op == '=' || op == '+' ? `
            var op = '${op}';
            ` : ''}${op == '+' ? `if(b < 0) {
                op = '-';
                b = -b;
            } else if(b.op == '-') {
                op = '-';
                b = b.a;
            }` : ''}${op == '=' ? `if(b.op && b.op != '=' && b.op != '<->' && b.op != '==' && b.op != '<' && b.op != '-' && b.op != '~' && b.a === a) {
                if(b.op == '+' && b.b < 0) {
                    op = '-=';
                    b = -b.b;
                } else {
                    op = b.op+'=';
                    b = b.b;
                }
            }` : ''}var expr = inspect(a, ${prec})+' ${op=='=' || op=='+' ?`'+op+'`:op} '+inspect(b, ${prec});
            return ${prec} <= p ? expr : '('+expr+')';
        }
    };
}`);
//END runtime
});

for(var i in exportedFn)
    global[i] = exportedFn[i];

exports.filters = {};

function Var(name, pos, len, bigEndian) {
    return codeGen.mark({
        name, pos, len, bitsof: len, // FIXME len/bitsof are redundant.
        signed: len == codeGen.intBits,
        posAt: function(d) {
            if(!(d >= 0 && d < this.len))
                throw new RangeError('Offset '+d+' is outside the bit range');
            d += this.pos & 7;
            var pos = (this.pos & ~7) + (d & 7);
            if(bigEndian)
                return pos - (d & ~7);
            return pos + (d & ~7);
        },
        inspect: function() {
            return '<'+this.pos+(this.len > 1 ? ':'+(this.pos+this.len-1) : '')+'>';
        },
        get code() {
            if(this.len > codeGen.intBits)
                throw new RangeError('Too many ('+this.len+') bits to decode');

            var bytes = [];
            var pos = this.pos & ~7, bits = this.pos & 7;
            var end = this.pos+this.len, endBits = end & 7;
            if(bits) {
                bytes.push('((b[i+'+(pos >>> 3)+'] & 0x'+(((1<<Math.min(this.len, 8-bits))-1)<<bits).toString(16)+')>>>'+bits+')');
                pos += 8;
            }
            for(var j = pos >>> 3; pos+8 <= end; pos+=8, j+=(bigEndian?-1:1))
                bytes.push(pos > this.pos ? '(b[i+'+j+']<<'+(pos-this.pos)+')' : 'b[i+'+j+']');
            if(pos < end)
                bytes.push(pos > this.pos ? '((b[i+'+j+'] & 0x'+((1<<endBits)-1).toString(16)+')<<'+(pos-this.pos)+')' : '(b[i+'+j+'] & 0x'+((1<<endBits)-1).toString(16)+')');
            return '('+bytes.join('|')+')';
        },
        runtimeKnown: true,
        slice: function(name, start, end) {
            if(typeof start !== 'number')
                start = 0;
            else if(start < 0)
                start += this.len;
            if(typeof end !== 'number')
                end = this.len;
            else if(end < 0)
                end += this.len;
            return Var(name, this.posAt(start), end-start, bigEndian);
        },
        filter: exports.filters[name] || exports.filters[name[0]] || function(next, ct) {
            if(this.len === 1)
                return next(ct[this.pos] = 0), next(ct[this.pos] = 1);
            next(this);
        }
    });
}
exports.totals = 0;
exports.maps = {};
exports.op = function op(def, fn) {
    var self = this;
    var ct = [], vars = [], nBits = 0;
    def.forEach(function(x) {
        var n = x.length, bits = x.match(/[A-Z][a-z$]*_*|./g);
        if(n & 7)
            throw new TypeError('Opcode definition '+x+' does not align to a byte boundary');
        var part = Var(' ', nBits+(self.bigEndian?n-8:0), n, self.bigEndian);
        for(var i = 0, j = n; i < bits.length && j > 0; i++) {
            var b = bits[i];
            if(b === '0' || b === '1')
                ct[part.posAt(j-1)] = +b;
            else
                vars.push(part.slice(b.replace(/_+/g, ''), j-b.length, j));
            j -= b.length;
        }

        nBits += n;
    });
    function make(ct, vals) {
        var res = fn.apply(this, vals);
        if(!res)
            return;
        res = res.filter((x)=>x);
        res.forEach((x)=>x.touch && x.touch());
        function niceCT(ct) {
            var s = '';
            for(var i = nBits-1; i >= 0; i--)
                s += typeof ct[i] === 'number' ? ct[i] : 'x';
            return s;
        }
        ct = niceCT(ct);
        var ctMask = ct.replace(/[01]/g, 'K');
        self.totals += Math.pow(2, ct.split('').reduce((a, b)=>a+(b=='x'), 0));
        if(!self.maps[ctMask])
            self.maps[ctMask] = {$ct: ct};
        else
            self.maps[ctMask].$ct = self.maps[ctMask].$ct.split('').map((x, i)=>x==ct[i]?x:'K').join('');
        self.maps[ctMask][ct] = res;
        console.log.apply(console, [ct+':'].concat(res));
    }
    var vals = [];
    vals.byName = {};
    let back = (i, ct)=>{
        ct = ct.slice();
        if(i >= vars.length)
            return make(ct, vals);
        var v = vars[i], name = v.name;
        Var(name, v.pos, v.len, this.bigEndian).filter((v, ct2)=>{
            vals[i] = vals.byName[name] = v;
            back(i+1, ct2 || ct);
        }, ct, i, vals);
    };
    back(0, ct);
    console.log();
}

exports.out = function out(outFile, fn) {
    console.log('Totals', this.totals, '0x'+this.totals.toString(16), Math.round(this.totals/(1<<28)*1000)/10+'%');
    console.log('{');
    var self = this;
    var mapKeys = Object.keys(self.maps).map((x)=>[self.maps[x], self.maps[x].$ct.split('').map((x)=>({'0':0, '1':1, K:2})[x])]);
    mapKeys.sort((_a, _b)=>{
        var a = _a[1], b = _b[1];
        if(a.length != b.length) // HACK make longer opcodes more important.
            return b.length - a.length;
        var len = Math.max(a.length, b.length), extraA = 0, extraB = 0;
        for(var i = 0; i < len; i++) {
            if(a[i] < 2 && b[i] < 2 && a[i] != b[i])
                return a[i]-b[i];
            var ak = a[i] <= 2, bk = b[i] <= 2;
            if(ak && !bk)
                extraA++;
            if(!ak && bk)
                extraB++;
        }
        if(extraA && !extraB)
            return -1;
        if(!extraA && extraB)
            return 1;
        if(extraA && extraB)
            console.error('Can\'t sort '+_a[0].$ct+' '+_b[0].$ct);
        return _a[0].$ct-_b[0].$ct;
    });
    var code = '';
    mapKeys.forEach((k)=>{
        var v = k[0], ct = v.$ct, cond = '';
        var cstart = 0, cend = 0;
        var cmask = ct.replace(/^[^01]+/, (s)=>{cstart += s.length; return '';}).replace(/[^01]+$/, (s)=>{cend += s.length; return '';});
        if(cmask.length) {
            cmask = Var(' ', cend, ct.length-cend-cstart, self.bigEndian).code+' & 0x'+parseInt(cmask.replace(/0/g,'1').replace(/[^1]/g,'0'), 2).toString(16);

            console.log(ct.slice(cstart, ct.length-cend).replace(/[^01]/g,'0'));
            var cval = '0x'+parseInt(ct.slice(cstart, ct.length-cend).replace(/[^01]/g,'0'), 2).toString(16);
            cond = 'if(('+cmask+') == '+cval+')';
        }

        cstart = cend = 0;
        var mask = ct.replace(/^[^K]+/, (s)=>{cstart += s.length; return '';}).replace(/[^K]+$/, (s)=>{cend += s.length; return '';});
        mask = parseInt(mask.replace(/[^K]/g,'0').replace(/K/g,'1'), 2);

        var val = mask ? Var(' ', cend, ct.length-cend-cstart, self.bigEndian).code+' & 0x'+mask.toString(16) : '0';

        code += cond+'\n\tswitch('+val+') {\n';
        console.log('  \''+ct.replace(/K/g,'#').replace(/x/g,'_')+'\': {');
        for(var j in v)
            if(j !== '$ct') {
                console.log('    \''+j+'\': ', v[j]);
                val = '0x'+(parseInt(j.slice(cstart, ct.length-cend).replace(/[^01]/g,'0'), 2)&mask).toString(16);
                codeGen.runtime.vars = 0;
                code += '\tcase '+val+': return ['+ct.length/8+', '+v[j].map((x)=>x.code).join(',')+'];\n';
                codeGen.runtime.vars = 0;
            }
        console.log('  }');
        code += '\t}\n';
    });
    if(codeGen.runtime.maxVars) {
        let s = '\n\tvar $0';
        for(var i = 1; i < codeGen.runtime.maxVars; i++)
            s += ', $'+i;
        code = s+';\n'+code;
    }
    console.log('}\n');
    fs.writeFileSync(outFile, fn(code));
}
