export const binaryOps = {
    Mov:'=',
    // Arithmethic operators.
    Add: '+', Mul: '*', Div: '/',
    // Bitwise operators.
    And: '&', Or: '|', Xor: '^',

    // Comparison operators.
    Eq: '==', Lt: '<',

    // Bit-shift operators.
    Shl: '<<', Shr: '>>'
}, unaryOps = {
    Not: '~', Neg: '-'
}, precendence = {
    '()':1, '[]':1,
    '~':2,
    '*':3, '/':3, '%':3,
    '+':4, '-':4,
    '<<':5, '>>':5,
    '<':6,
    '==':7,
    '&':8,
    '^':9,
    '|':10,


    '=':13,
    ',':14
}, bitSizes = [1, 8, 16, 32, 64, 128, 256];

export var code = '';

code += `

var _inspect = (typeof require !== 'undefined' ? require('util').inspect : function(x) {/*HACK*/return JSON.stringify(x, 0, 2);});

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
    //if(typeof x === 'number')
    //    throw new TypeError('Direct use of numbers is deprecated ('+x+' 0x'+x.toString(16)+')');
    if(typeof x === 'object' && x.inspect)
        return x.inspect(0, p || 16);
    return _inspect(x);
}

var Unknown = exports.Unknown = function Unknown(bits) {
    // HACK int[bits] - signed because it can promote to unsigned if required.
    if(typeof bits === 'number') {
        this.bitsof = bits;
        this.signed = true;
        this.type = int[bits].prototype.type;
    }
}
Unknown.prototype = {
    constructor: Unknown, known: false`;

for(let fn in unaryOps) {
    let op = unaryOps[fn], fnLower = fn.toLowerCase();
    code += `,
    ${fnLower}: function ${fnLower}() {
        return new ${fn}(this);
    }`;
}

for(let fn in binaryOps) {
    let op = binaryOps[fn], fnLower = fn.toLowerCase();
    if(op == '<<' || op == '>>')
        code += `,
    ${fnLower}: function ${fnLower}(that) {
        return new ${fn}(this, that);
    }`;
    else
        code += `,
    ${fnLower}: function ${fnLower}(that) {
        if(that.bitsof > this.bitsof || that.bitsof == this.bitsof && that.signed < this.signed) { // that.type > this.type
            if(that.known)
                return that.type(this).${fnLower}(that);
            return ${op == '<' ? `/*HACK < is the only operator where a.op(b) != b.op(a) */ that.lt(this).not().and(that.eq(this).not())` : `that.${fnLower}(this)`};
        }
        return new ${fn}(this, that);
    }`;
}

code += `,
    sub: function sub(that) {
        if(!that.signed || that.bitsof < this.bitsof) // HACK cleaner output
            that = int[this.bitsof](that);
        return this.add(that.neg());
    },
    rol: function rol(that) {
        return this.shl(that).or(this.shr(u8(this.bitsof).sub(that)));
    },
    ror: function ror(that) {
        return this.shr(that).or(this.shl(u8(this.bitsof).sub(that)));
    }
};`;

// Operations.
for(let fn in unaryOps) {
    let op = unaryOps[fn], prec = precendence[op];

    code += `
var ${fn} = exports.${fn} = function ${fn}(a) { // assumes !a.known.
    if(a.op == '${op}') return a.a;
    this.a = a;
    this.type = a.type;
    this.bitsof = a.bitsof;
    this.signed = a.signed;
}
${fn}.prototype = new Unknown;
${fn}.prototype.constructor = ${fn};
${fn}.prototype.fn = '${fn}'; // TODO obsolete?
${fn}.prototype.op = '${op}';
Object.defineProperty(${fn}.prototype, 'value', {get: function() {
    var a = valueof(this.a);
    if(a !== this.a)
        return a.${fn.toLowerCase()}();
}});
${fn}.prototype.inspect = function(_, p) {
    ${op == '~' ? `if(this.bitsof == 1) {
        if(this.a.op == '==') {
            var expr = inspect(this.a.a, ${precendence['==']})+' != '+inspect(this.a.b, ${precendence['==']});
            return ${precendence['==']} <= p ? expr : '('+expr+')'
        }
        if(this.a.op == '<') {
            var expr = inspect(this.a.a, ${precendence['<']})+' >= '+inspect(this.a.b, ${precendence['<']});
            return ${precendence['<']} <= p ? expr : '('+expr+')'
        }
    }
    `: ''}var expr = '${op}'+inspect(this.a, ${prec});
    return ${prec} <= p ? expr : '('+expr+')';
};`;
}

for(let fn in binaryOps) {
    let op = binaryOps[fn], prec = precendence[op], logic = op == '==' || op == '<';
    let prologue = '', p = (...args)=>prologue += '\n    '+String.raw(...args);

    if(op == '+' || op == '|' || op == '^' || op == '<<' || op == '>>' || op == '>>>')
        p`if(b.bitsof <= 32 && b._A === 0) /* HACK doesn't work > 32bits. */ return a;`;
    if(op == '&')
        p`if(b.bitsof <= 32 && b._A === 0) /* HACK doesn't work > 32bits. */ return a.type(0);`;
    if(op == '^')
        p`if(a === b) return a.type(0);`;
    if(op == '&' || op == '|')
        p`if(a === b) return a;`;
    if(op == '|' || op == '&')
        p`if(b.known && b.bitsof <= 32 && b._A === b.type(-1)._A) return ${op == '|' ? 'b' : 'a'};`;
    if(op == '+' || op == '|' || op == '^' || op == '&')
        p`if(a.op == '${op}' && a.b.known && b.known) return a.a.${fn.toLowerCase()}(a.b.${fn.toLowerCase()}(b));`;
    if(op == '+')
        p`if(a.op == '-' && a.a == b || b.op == '-' && b.a == a) return a.type(0);`;

    if(op == '=')
        p`if(!(this instanceof ${fn})) return new ${fn}(a, b);`;

    code += `
var ${fn} = exports.${fn} = function ${fn}(a, b) { /* assumes a.type >= b.type and !a.known. */${prologue}
    this.a = a;
    this.b = b;${op == '=' ? '' :
    `this.type = ${logic ? 'u1.prototype.type' : 'a.type'};
    this.bitsof = ${logic ? '1' : 'a.bitsof'};
    this.signed = ${logic ? 'false' : 'a.signed'};`}
}
${fn}.prototype = new Unknown;
${fn}.prototype.constructor = ${fn};
${fn}.prototype.fn = '${fn}'; // TODO obsolete?
${fn}.prototype.op = '${op}';
Object.defineProperty(${fn}.prototype, 'value', {get: function() {
    var a = ${op == '=' ? 'l' : ''}valueof(this.a), b = valueof(this.b);
    if(a !== this.a || b !== this.b)
        return ${op == '=' ? `new ${fn}(a, b)` : `a.${fn.toLowerCase()}(b)`};
}});
${fn}.prototype.inspect = function(_, p) {
    var a = this.a, b = this.b;${op == '=' || op == '+' ? `
    var op = '${op}';
    ` : ''}${op == '+' ? `if(b.bitsof <= 32 && b._A < 0 && b._A != -1 << (b.bitsof-1)) { // HACK doesn't work > 32bits.
        op = '-';
        b = b.neg();
    } else if(b.op == '-') {
        op = '-';
        b = b.a;
    }` : ''}${op == '=' ? `if(b.op && b.op != '=' && b.op != '<->' && b.op != '==' && b.op != '<' && b.op != '-' && b.op != '~' && (b.a === a || b.a.lvalue === a)) { // HACK the lvalue check might be costy.
        if(b.op == '+' && b.b.bitsof <= 32 && b.b._A < 0 && b.b._A != -1 << (b.b.bitsof-1)) { // HACK doesn't work > 32bits.
            op = '-=';
            b = b.b.neg();
        } else {
            op = b.op+'=';
            b = b.b;
        }
    }` : ''}
    var expr = inspect(a, ${prec})+' ${op=='=' || op=='+' ?`'+op+'`:op} '+inspect(b, ${prec});
    return ${prec} <= p ? expr : '('+expr+')';
};`;
}

// Integers.
code += `
function Integer() {}
Integer.prototype = {
    constructor: Integer, known: true,
    get value() {
        if(!this.known) {
            var v = valueof(this._A);
            if(v !== this._A)
                return this.type(v);
        }
    },
    get lvalue() {
        if(!this.known)
            return this._A.lvalue;
    },
    sub: function sub(that) {
        if(!that.signed || that.bitsof < this.bitsof) // HACK cleaner output
            that = int[this.bitsof](that);
        return this.add(that.neg());
    }
};

var uint = exports.uint = [], int = exports.int = [];
var signed = exports.signed = function(x) {
    return new int[x.bitsof](x);
};
var unsigned = exports.unsigned = function(x) {
    return new uint[x.bitsof](x);
};
`;

// TODO implement operations and inspection for bits > 32.
for(let bits of bitSizes) {
    for(let signed of [false, true]) {
        let id = (signed ? 'i' : 'u')+bits, dwords = 'abcdefgh'.slice(0, Math.ceil(bits / 32)).split('');
        let conv = signed ? (bits >= 32 ? '>> 0' : '<< '+(32-bits)+' >> '+(32-bits))
                        : (bits >= 32 ? '>>> 0' : '& 0x'+((1<<bits)-1).toString(16));
        let suffix = ['b', , , 'c'/*FIXME better suffix for byte than c from char*/, 's', '', 'l'][Math.log(bits)/Math.LN2|0];

        code += `
var ${id} = ${signed ? '' : 'u'}int[${bits}] = exports.${id} = function ${id}(${dwords.join(', ')}) {
    if(!(this instanceof ${id}))
        return new ${id}(a);
    if(typeof a == 'number')
        this._A = a ${conv};
    else if(a.known)
        this._A = a._A ${conv};
    else {
        this._A = a instanceof ${(signed ? 'u' : 'i')+bits} || a instanceof ${id} ? a._A : a;
        this.known = false;
    }
}
${id}.prototype = new Integer;
${id}.prototype.constructor = ${id};
${id}.prototype.type = ${id}.bind(null);
${dwords.map(x => id+'.prototype._'+x.toUpperCase()).join(' = ')} = 0;
${id}.prototype.bitsof = ${bits};
${id}.prototype.signed = ${signed};
${id}.prototype.inspect = function() {
    if(this.known)
        return ${bits <= 32 ? (/*signed ? `this._A` : */`(this._A >= 48 ? '0x'+this._A.toString(16) : this._A)`)+`+(process.env.DEBUG_INT ? '${signed ? '' : 'u'}${suffix}' : '')` : `'${id}('+`+dwords.map(x => 'this._'+x.toUpperCase()).join(`+', '+`)+`+')'`};
    var a = inspect(this._A);
    return (process.env.DEBUG_INT || this._A instanceof Integer || this._A instanceof Unknown) ? '${id}('+a+')' : a;
};`;

        for(let fn in unaryOps) {
            let op = unaryOps[fn], fnLower = fn.toLowerCase();
            if(bits > 32)
                code += `
${id}.prototype.${fnLower} = Unknown.prototype.${fnLower};`;
            else
                code += `
${id}.prototype.${fnLower} = function ${fnLower}() {
    if(!this.known) // Unknown#${fnLower}
        return new ${fn}(this);
    return ${id}(${op}this._A);
};`;
        }

        for(let fn in binaryOps) {
            let op = binaryOps[fn], fnLower = fn.toLowerCase(), logic = op == '==' || op == '<';
            if(bits > 32)
                code += `
${id}.prototype.${fnLower} = Unknown.prototype.${fnLower};`;
            else if(op == '<<' || op == '>>')
                code += `
${id}.prototype.${fnLower} = function ${fnLower}(that) { // assumes that is of an integer type.
    if(!this.known || !that.known) // Unknown#${fnLower}
        return new ${fn}(this, that);
    return ${id}(this._A ${op == '>>' && !signed ? '>>>' : op} (that._A & 0x${(bits-1).toString(16)}));
};`;
            else
                code += `
${id}.prototype.${fnLower} = function ${fnLower}(that) { // assumes that is of an integer type.
    if(that.bitsof > ${bits}${signed ? ` || that.bitsof == ${bits} && !that.signed` : ''}) { // that.type > this.type
        if(!this.known && that.known) // Unknown#${fnLower}
            return that.type(this).${fnLower}(that);
        return ${op == '<' ? `/*HACK < is the only operator where a.op(b) != b.op(a) */ that.lt(this).not().and(that.eq(this).not())` : `that.${fnLower}(this)`};
    }
    if(!this.known) // Unknown#${fnLower}
        return new ${fn}(this, that);
    if(!that.known)
        return ${op == '<' ? `/*HACK < is the only operator where a.op(b) != b.op(a) */ that.lt(this).not().and(that.eq(this).not())` : `that.${fnLower}(this)`};
    return ${logic ? 'u1(' : id}(this._A ${op} ${signed ? `that._A` : `(that._A ${conv})`}${logic ? ') & 1' : ''});
};`;
        }

        code += `
${id}.prototype.rol = function rol(that) {
    return this.shl(that).or(this.shr(u8(${bits}).sub(that)));
};
${id}.prototype.ror = function ror(that) {
    return this.shr(that).or(this.shl(u8(${bits}).sub(that)));
};
`;
    }
}

// Register*.
code += `
var Register = exports.Register = [];`;
for(let bits of bitSizes) {
    code += `
var Register${bits} = Register[${bits}] = exports.Register${bits} = function Register${bits}(name) {
    if(!(this instanceof Register${bits}))
        return new Register${bits}(addr);
    var self = this;
    if(name !== undefined)
        this.name = name;
    this.lvalue = {
        inspect: function() {
            return self.name + self.nthValue.toSubString();
        },
        freeze: function(v) {
            var frozenName = self.name + (self.nthValue++).toSubString();
            self.value = new Unknown(${bits});
            self.value.frozenValue = v;
            self.value.inspect = function() {return frozenName;};
        },
        get value() {
            return self.value;
        },
        set value(v) {
            self.value = v;
        }
    };
}
Register${bits}.prototype = new Unknown(${bits});
Register${bits}.prototype.constructor = Register${bits};
Register${bits}.prototype.name = '<${bits}>';
Register${bits}.prototype.nthValue = -1;
Register${bits}.prototype.inspect = function inspect() {
    return this.name;
};`;
}

// Mem*.
code += `
var Mem = exports.Mem = {};
Mem.read = function(address, bits) {
    console.error('Non-implemented Mem read ['+inspect(address)+']'+bits);
};
Mem.write = function(address, bits, value) {
    console.error('Non-implemented Mem write ['+inspect(address)+']'+bits+' = '+inspect(value));
};`;
for(let bits of bitSizes) {
    code += `
var Mem${bits} = Mem[${bits}] = exports.Mem${bits} = function Mem${bits}(addr) {
    if(!(this instanceof Mem${bits}))
        return new Mem${bits}(addr);
    this.addr = addr;
};
Mem${bits}.prototype = new Unknown(${bits});
Mem${bits}.prototype.constructor = Mem${bits};
Object.defineProperties(Mem${bits}.prototype, {
    lvalue: {
        get: function() {
            var v = valueof(this.addr);
            if(v !== this.addr) return Mem${bits}(v);
        }
    },
    value: {
        get: function() {
            var v = valueof(this.addr), m = Mem.read(v, ${bits});
            if(m !== null && m !== void 0)
                return m;
            if(v !== this.addr) return Mem${bits}(v);
        },
        set: function(v) {
            return Mem.write(this.addr, ${bits}, v);
        }
    }
});
Mem${bits}.prototype.inspect = function() {
    return '['+inspect(this.addr)+']${bits}';
};
`;
}


// Special functions.
code += `
var If = exports.If = function If(cond, then) {
    if(!(this instanceof If))
        return new If(cond, then);
    if(cond.known && cond.bitsof <= 32) // HACK doesn't work > 32bits.
        return cond._A ? then : null;
    this.cond = cond;
    this.then = then;
};
If.prototype = {
    constructor: If, fn: 'If',
    get value() {
        var cond = valueof(this.cond);
        if(cond !== this.cond) {
            if(cond.bitsof <= 32) // HACK doesn't work > 32bits.
                return cond._A ? valueof(this.then) : null;
            return new If(cond, this.then);
        }
    },
    inspect: function() {
        return 'if('+inspect(this.cond)+') '+inspect(this.then)+';';
    }
};

var FnCall = exports.FnCall = function FnCall(name) {
    if(!(this instanceof FnCall)) // HACK this can slow things down, use new in generated code.
        return new (FnCall.bind.apply(FnCall, [null].concat([].slice.call(arguments))));
    this.name = name;
    this.args = [].slice.call(arguments, 1);
};
FnCall.prototype = {
    constructor: FnCall, fn: 'FnCall',
    get value() {
        var changes = false, args = [null];
        for(var i = 0; i < this.args.length; i++)
            if((args[i+1] = valueof(this.args[i])) !== this.args[i])
                changes = true;
        if(changes)
            return new (FnCall.bind.apply(FnCall, args));
    },
    inspect: function() {
        var s = this.name+'(';
        for(var i = 0; i < this.args.length; i++)
            s += (i ? ', ' : '')+inspect(this.args[i]);
        return s+')';
    }
};

var Nop = exports.Nop = FnCall.bind(null, 'Nop');
var Interrupt = exports.Interrupt = FnCall.bind(null, 'Interrupt');
`;
