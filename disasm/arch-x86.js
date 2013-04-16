/** @file arch-x86.js This file was auto-generated */


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
    constructor: Unknown, known: false,
    not: function not() {
        return new Not(this);
    },
    neg: function neg() {
        return new Neg(this);
    },
    mov: function mov(that) {
        if(that.bitsof > this.bitsof || that.bitsof == this.bitsof && that.signed < this.signed) { // that.type > this.type
            if(that.known)
                return that.type(this).mov(that);
            return that.mov(this);
        }
        return new Mov(this, that);
    },
    add: function add(that) {
        if(that.bitsof > this.bitsof || that.bitsof == this.bitsof && that.signed < this.signed) { // that.type > this.type
            if(that.known)
                return that.type(this).add(that);
            return that.add(this);
        }
        return new Add(this, that);
    },
    mul: function mul(that) {
        if(that.bitsof > this.bitsof || that.bitsof == this.bitsof && that.signed < this.signed) { // that.type > this.type
            if(that.known)
                return that.type(this).mul(that);
            return that.mul(this);
        }
        return new Mul(this, that);
    },
    div: function div(that) {
        if(that.bitsof > this.bitsof || that.bitsof == this.bitsof && that.signed < this.signed) { // that.type > this.type
            if(that.known)
                return that.type(this).div(that);
            return that.div(this);
        }
        return new Div(this, that);
    },
    and: function and(that) {
        if(that.bitsof > this.bitsof || that.bitsof == this.bitsof && that.signed < this.signed) { // that.type > this.type
            if(that.known)
                return that.type(this).and(that);
            return that.and(this);
        }
        return new And(this, that);
    },
    or: function or(that) {
        if(that.bitsof > this.bitsof || that.bitsof == this.bitsof && that.signed < this.signed) { // that.type > this.type
            if(that.known)
                return that.type(this).or(that);
            return that.or(this);
        }
        return new Or(this, that);
    },
    xor: function xor(that) {
        if(that.bitsof > this.bitsof || that.bitsof == this.bitsof && that.signed < this.signed) { // that.type > this.type
            if(that.known)
                return that.type(this).xor(that);
            return that.xor(this);
        }
        return new Xor(this, that);
    },
    eq: function eq(that) {
        if(that.bitsof > this.bitsof || that.bitsof == this.bitsof && that.signed < this.signed) { // that.type > this.type
            if(that.known)
                return that.type(this).eq(that);
            return that.eq(this);
        }
        return new Eq(this, that);
    },
    lt: function lt(that) {
        if(that.bitsof > this.bitsof || that.bitsof == this.bitsof && that.signed < this.signed) { // that.type > this.type
            if(that.known)
                return that.type(this).lt(that);
            return /*HACK < is the only operator where a.op(b) != b.op(a) */ that.lt(this).not().and(that.eq(this).not());
        }
        return new Lt(this, that);
    },
    shl: function shl(that) {
        return new Shl(this, that);
    },
    shr: function shr(that) {
        return new Shr(this, that);
    },
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
};
var Not = exports.Not = function Not(a) { // assumes !a.known.
    if(a.op == '~') return a.a;
    this.a = a;
    this.type = a.type;
    this.bitsof = a.bitsof;
    this.signed = a.signed;
}
Not.prototype = new Unknown;
Not.prototype.constructor = Not;
Not.prototype.fn = 'Not'; // TODO obsolete?
Not.prototype.op = '~';
Object.defineProperty(Not.prototype, 'value', {get: function() {
    var a = valueof(this.a);
    if(a !== this.a)
        return a.not();
}});
Not.prototype.inspect = function(_, p) {
    if(this.bitsof == 1) {
        if(this.a.op == '==') {
            var expr = inspect(this.a.a, 7)+' != '+inspect(this.a.b, 7);
            return 7 <= p ? expr : '('+expr+')'
        }
        if(this.a.op == '<') {
            var expr = inspect(this.a.a, 6)+' >= '+inspect(this.a.b, 6);
            return 6 <= p ? expr : '('+expr+')'
        }
    }
    var expr = '~'+inspect(this.a, 2);
    return 2 <= p ? expr : '('+expr+')';
};
var Neg = exports.Neg = function Neg(a) { // assumes !a.known.
    if(a.op == '-') return a.a;
    this.a = a;
    this.type = a.type;
    this.bitsof = a.bitsof;
    this.signed = a.signed;
}
Neg.prototype = new Unknown;
Neg.prototype.constructor = Neg;
Neg.prototype.fn = 'Neg'; // TODO obsolete?
Neg.prototype.op = '-';
Object.defineProperty(Neg.prototype, 'value', {get: function() {
    var a = valueof(this.a);
    if(a !== this.a)
        return a.neg();
}});
Neg.prototype.inspect = function(_, p) {
    var expr = '-'+inspect(this.a, 4);
    return 4 <= p ? expr : '('+expr+')';
};
var Mov = exports.Mov = function Mov(a, b) { /* assumes a.type >= b.type and !a.known. */
    if(!(this instanceof Mov)) return new Mov(a, b);
    this.a = a;
    this.b = b;
}
Mov.prototype = new Unknown;
Mov.prototype.constructor = Mov;
Mov.prototype.fn = 'Mov'; // TODO obsolete?
Mov.prototype.op = '=';
Object.defineProperty(Mov.prototype, 'value', {get: function() {
    var a = lvalueof(this.a), b = valueof(this.b);
    if(a !== this.a || b !== this.b)
        return new Mov(a, b);
}});
Mov.prototype.inspect = function(_, p) {
    var a = this.a, b = this.b;
    var op = '=';
    if(b.op && b.op != '=' && b.op != '<->' && b.op != '==' && b.op != '<' && b.op != '-' && b.op != '~' && (b.a === a || b.a.lvalue === a)) { // HACK the lvalue check might be costy.
        if(b.op == '+' && b.b.bitsof <= 32 && b.b._A < 0 && b.b._A != -1 << (b.b.bitsof-1)) { // HACK doesn't work > 32bits.
            op = '-=';
            b = b.b.neg();
        } else {
            op = b.op+'=';
            b = b.b;
        }
    }
    var expr = inspect(a, 13)+' '+op+' '+inspect(b, 13);
    return 13 <= p ? expr : '('+expr+')';
};
var Add = exports.Add = function Add(a, b) { /* assumes a.type >= b.type and !a.known. */
    if(b.bitsof <= 32 && b._A === 0) /* HACK doesn't work > 32bits. */ return a;
    if(a.op == '+' && a.b.known && b.known) return a.a.add(a.b.add(b));
    if(a.op == '-' && a.a == b || b.op == '-' && b.a == a) return a.type(0);
    this.a = a;
    this.b = b;this.type = a.type;
    this.bitsof = a.bitsof;
    this.signed = a.signed;
}
Add.prototype = new Unknown;
Add.prototype.constructor = Add;
Add.prototype.fn = 'Add'; // TODO obsolete?
Add.prototype.op = '+';
Object.defineProperty(Add.prototype, 'value', {get: function() {
    var a = valueof(this.a), b = valueof(this.b);
    if(a !== this.a || b !== this.b)
        return a.add(b);
}});
Add.prototype.inspect = function(_, p) {
    var a = this.a, b = this.b;
    var op = '+';
    if(b.bitsof <= 32 && b._A < 0 && b._A != -1 << (b.bitsof-1)) { // HACK doesn't work > 32bits.
        op = '-';
        b = b.neg();
    } else if(b.op == '-') {
        op = '-';
        b = b.a;
    }
    var expr = inspect(a, 4)+' '+op+' '+inspect(b, 4);
    return 4 <= p ? expr : '('+expr+')';
};
var Mul = exports.Mul = function Mul(a, b) { /* assumes a.type >= b.type and !a.known. */
    this.a = a;
    this.b = b;this.type = a.type;
    this.bitsof = a.bitsof;
    this.signed = a.signed;
}
Mul.prototype = new Unknown;
Mul.prototype.constructor = Mul;
Mul.prototype.fn = 'Mul'; // TODO obsolete?
Mul.prototype.op = '*';
Object.defineProperty(Mul.prototype, 'value', {get: function() {
    var a = valueof(this.a), b = valueof(this.b);
    if(a !== this.a || b !== this.b)
        return a.mul(b);
}});
Mul.prototype.inspect = function(_, p) {
    var a = this.a, b = this.b;
    var expr = inspect(a, 3)+' * '+inspect(b, 3);
    return 3 <= p ? expr : '('+expr+')';
};
var Div = exports.Div = function Div(a, b) { /* assumes a.type >= b.type and !a.known. */
    this.a = a;
    this.b = b;this.type = a.type;
    this.bitsof = a.bitsof;
    this.signed = a.signed;
}
Div.prototype = new Unknown;
Div.prototype.constructor = Div;
Div.prototype.fn = 'Div'; // TODO obsolete?
Div.prototype.op = '/';
Object.defineProperty(Div.prototype, 'value', {get: function() {
    var a = valueof(this.a), b = valueof(this.b);
    if(a !== this.a || b !== this.b)
        return a.div(b);
}});
Div.prototype.inspect = function(_, p) {
    var a = this.a, b = this.b;
    var expr = inspect(a, 3)+' / '+inspect(b, 3);
    return 3 <= p ? expr : '('+expr+')';
};
var And = exports.And = function And(a, b) { /* assumes a.type >= b.type and !a.known. */
    if(b.bitsof <= 32 && b._A === 0) /* HACK doesn't work > 32bits. */ return a.type(0);
    if(a === b) return a;
    if(b.known && b.bitsof <= 32 && b._A === b.type(-1)._A) return a;
    if(a.op == '&' && a.b.known && b.known) return a.a.and(a.b.and(b));
    this.a = a;
    this.b = b;this.type = a.type;
    this.bitsof = a.bitsof;
    this.signed = a.signed;
}
And.prototype = new Unknown;
And.prototype.constructor = And;
And.prototype.fn = 'And'; // TODO obsolete?
And.prototype.op = '&';
Object.defineProperty(And.prototype, 'value', {get: function() {
    var a = valueof(this.a), b = valueof(this.b);
    if(a !== this.a || b !== this.b)
        return a.and(b);
}});
And.prototype.inspect = function(_, p) {
    var a = this.a, b = this.b;
    var expr = inspect(a, 8)+' & '+inspect(b, 8);
    return 8 <= p ? expr : '('+expr+')';
};
var Or = exports.Or = function Or(a, b) { /* assumes a.type >= b.type and !a.known. */
    if(b.bitsof <= 32 && b._A === 0) /* HACK doesn't work > 32bits. */ return a;
    if(a === b) return a;
    if(b.known && b.bitsof <= 32 && b._A === b.type(-1)._A) return b;
    if(a.op == '|' && a.b.known && b.known) return a.a.or(a.b.or(b));
    this.a = a;
    this.b = b;this.type = a.type;
    this.bitsof = a.bitsof;
    this.signed = a.signed;
}
Or.prototype = new Unknown;
Or.prototype.constructor = Or;
Or.prototype.fn = 'Or'; // TODO obsolete?
Or.prototype.op = '|';
Object.defineProperty(Or.prototype, 'value', {get: function() {
    var a = valueof(this.a), b = valueof(this.b);
    if(a !== this.a || b !== this.b)
        return a.or(b);
}});
Or.prototype.inspect = function(_, p) {
    var a = this.a, b = this.b;
    var expr = inspect(a, 10)+' | '+inspect(b, 10);
    return 10 <= p ? expr : '('+expr+')';
};
var Xor = exports.Xor = function Xor(a, b) { /* assumes a.type >= b.type and !a.known. */
    if(b.bitsof <= 32 && b._A === 0) /* HACK doesn't work > 32bits. */ return a;
    if(a === b) return a.type(0);
    if(a.op == '^' && a.b.known && b.known) return a.a.xor(a.b.xor(b));
    this.a = a;
    this.b = b;this.type = a.type;
    this.bitsof = a.bitsof;
    this.signed = a.signed;
}
Xor.prototype = new Unknown;
Xor.prototype.constructor = Xor;
Xor.prototype.fn = 'Xor'; // TODO obsolete?
Xor.prototype.op = '^';
Object.defineProperty(Xor.prototype, 'value', {get: function() {
    var a = valueof(this.a), b = valueof(this.b);
    if(a !== this.a || b !== this.b)
        return a.xor(b);
}});
Xor.prototype.inspect = function(_, p) {
    var a = this.a, b = this.b;
    var expr = inspect(a, 9)+' ^ '+inspect(b, 9);
    return 9 <= p ? expr : '('+expr+')';
};
var Eq = exports.Eq = function Eq(a, b) { /* assumes a.type >= b.type and !a.known. */
    this.a = a;
    this.b = b;this.type = u1.prototype.type;
    this.bitsof = 1;
    this.signed = false;
}
Eq.prototype = new Unknown;
Eq.prototype.constructor = Eq;
Eq.prototype.fn = 'Eq'; // TODO obsolete?
Eq.prototype.op = '==';
Object.defineProperty(Eq.prototype, 'value', {get: function() {
    var a = valueof(this.a), b = valueof(this.b);
    if(a !== this.a || b !== this.b)
        return a.eq(b);
}});
Eq.prototype.inspect = function(_, p) {
    var a = this.a, b = this.b;
    var expr = inspect(a, 7)+' == '+inspect(b, 7);
    return 7 <= p ? expr : '('+expr+')';
};
var Lt = exports.Lt = function Lt(a, b) { /* assumes a.type >= b.type and !a.known. */
    this.a = a;
    this.b = b;this.type = u1.prototype.type;
    this.bitsof = 1;
    this.signed = false;
}
Lt.prototype = new Unknown;
Lt.prototype.constructor = Lt;
Lt.prototype.fn = 'Lt'; // TODO obsolete?
Lt.prototype.op = '<';
Object.defineProperty(Lt.prototype, 'value', {get: function() {
    var a = valueof(this.a), b = valueof(this.b);
    if(a !== this.a || b !== this.b)
        return a.lt(b);
}});
Lt.prototype.inspect = function(_, p) {
    var a = this.a, b = this.b;
    var expr = inspect(a, 6)+' < '+inspect(b, 6);
    return 6 <= p ? expr : '('+expr+')';
};
var Shl = exports.Shl = function Shl(a, b) { /* assumes a.type >= b.type and !a.known. */
    if(b.bitsof <= 32 && b._A === 0) /* HACK doesn't work > 32bits. */ return a;
    this.a = a;
    this.b = b;this.type = a.type;
    this.bitsof = a.bitsof;
    this.signed = a.signed;
}
Shl.prototype = new Unknown;
Shl.prototype.constructor = Shl;
Shl.prototype.fn = 'Shl'; // TODO obsolete?
Shl.prototype.op = '<<';
Object.defineProperty(Shl.prototype, 'value', {get: function() {
    var a = valueof(this.a), b = valueof(this.b);
    if(a !== this.a || b !== this.b)
        return a.shl(b);
}});
Shl.prototype.inspect = function(_, p) {
    var a = this.a, b = this.b;
    var expr = inspect(a, 5)+' << '+inspect(b, 5);
    return 5 <= p ? expr : '('+expr+')';
};
var Shr = exports.Shr = function Shr(a, b) { /* assumes a.type >= b.type and !a.known. */
    if(b.bitsof <= 32 && b._A === 0) /* HACK doesn't work > 32bits. */ return a;
    this.a = a;
    this.b = b;this.type = a.type;
    this.bitsof = a.bitsof;
    this.signed = a.signed;
}
Shr.prototype = new Unknown;
Shr.prototype.constructor = Shr;
Shr.prototype.fn = 'Shr'; // TODO obsolete?
Shr.prototype.op = '>>';
Object.defineProperty(Shr.prototype, 'value', {get: function() {
    var a = valueof(this.a), b = valueof(this.b);
    if(a !== this.a || b !== this.b)
        return a.shr(b);
}});
Shr.prototype.inspect = function(_, p) {
    var a = this.a, b = this.b;
    var expr = inspect(a, 5)+' >> '+inspect(b, 5);
    return 5 <= p ? expr : '('+expr+')';
};
var Integer = exports.Integer = function Integer() {}
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

var u1 = uint[1] = exports.u1 = function u1(a) {
    if(!(this instanceof u1))
        return new u1(a);
    if(typeof a == 'number')
        this._A = a & 0x1;
    else if(a.known)
        this._A = a._A & 0x1;
    else {
        this._A = a instanceof i1 || a instanceof u1 ? a._A : a;
        this.known = false;
    }
}
u1.prototype = new Integer;
u1.prototype.constructor = u1;
u1.prototype.type = u1.bind(null);
u1.prototype._A = 0;
u1.prototype.bitsof = 1;
u1.prototype.signed = false;
u1.prototype.inspect = function() {
    if(this.known)
        return (this._A >= 48 ? '0x'+this._A.toString(16) : this._A)+(process.env.DEBUG_INT ? 'ub' : '');
    var a = inspect(this._A);
    return (process.env.DEBUG_INT || this._A instanceof Integer || this._A instanceof Unknown) ? 'u1('+a+')' : a;
};
u1.prototype.not = function not() {
    if(!this.known) // Unknown#not
        return new Not(this);
    return u1(~this._A);
};
u1.prototype.neg = function neg() {
    if(!this.known) // Unknown#neg
        return new Neg(this);
    return u1(-this._A);
};
u1.prototype.mov = function mov(that) { // assumes that is of an integer type.
    if(that.bitsof > 1) { // that.type > this.type
        if(!this.known && that.known) // Unknown#mov
            return that.type(this).mov(that);
        return that.mov(this);
    }
    if(!this.known) // Unknown#mov
        return new Mov(this, that);
    if(!that.known)
        return that.mov(this);
    return u1(this._A = (that._A & 0x1));
};
u1.prototype.add = function add(that) { // assumes that is of an integer type.
    if(that.bitsof > 1) { // that.type > this.type
        if(!this.known && that.known) // Unknown#add
            return that.type(this).add(that);
        return that.add(this);
    }
    if(!this.known) // Unknown#add
        return new Add(this, that);
    if(!that.known)
        return that.add(this);
    return u1(this._A + (that._A & 0x1));
};
u1.prototype.mul = function mul(that) { // assumes that is of an integer type.
    if(that.bitsof > 1) { // that.type > this.type
        if(!this.known && that.known) // Unknown#mul
            return that.type(this).mul(that);
        return that.mul(this);
    }
    if(!this.known) // Unknown#mul
        return new Mul(this, that);
    if(!that.known)
        return that.mul(this);
    return u1(this._A * (that._A & 0x1));
};
u1.prototype.div = function div(that) { // assumes that is of an integer type.
    if(that.bitsof > 1) { // that.type > this.type
        if(!this.known && that.known) // Unknown#div
            return that.type(this).div(that);
        return that.div(this);
    }
    if(!this.known) // Unknown#div
        return new Div(this, that);
    if(!that.known)
        return that.div(this);
    return u1(this._A / (that._A & 0x1));
};
u1.prototype.and = function and(that) { // assumes that is of an integer type.
    if(that.bitsof > 1) { // that.type > this.type
        if(!this.known && that.known) // Unknown#and
            return that.type(this).and(that);
        return that.and(this);
    }
    if(!this.known) // Unknown#and
        return new And(this, that);
    if(!that.known)
        return that.and(this);
    return u1(this._A & (that._A & 0x1));
};
u1.prototype.or = function or(that) { // assumes that is of an integer type.
    if(that.bitsof > 1) { // that.type > this.type
        if(!this.known && that.known) // Unknown#or
            return that.type(this).or(that);
        return that.or(this);
    }
    if(!this.known) // Unknown#or
        return new Or(this, that);
    if(!that.known)
        return that.or(this);
    return u1(this._A | (that._A & 0x1));
};
u1.prototype.xor = function xor(that) { // assumes that is of an integer type.
    if(that.bitsof > 1) { // that.type > this.type
        if(!this.known && that.known) // Unknown#xor
            return that.type(this).xor(that);
        return that.xor(this);
    }
    if(!this.known) // Unknown#xor
        return new Xor(this, that);
    if(!that.known)
        return that.xor(this);
    return u1(this._A ^ (that._A & 0x1));
};
u1.prototype.eq = function eq(that) { // assumes that is of an integer type.
    if(that.bitsof > 1) { // that.type > this.type
        if(!this.known && that.known) // Unknown#eq
            return that.type(this).eq(that);
        return that.eq(this);
    }
    if(!this.known) // Unknown#eq
        return new Eq(this, that);
    if(!that.known)
        return that.eq(this);
    return u1((this._A == (that._A & 0x1)) & 1);
};
u1.prototype.lt = function lt(that) { // assumes that is of an integer type.
    if(that.bitsof > 1) { // that.type > this.type
        if(!this.known && that.known) // Unknown#lt
            return that.type(this).lt(that);
        return /*HACK < is the only operator where a.op(b) != b.op(a) */ that.lt(this).not().and(that.eq(this).not());
    }
    if(!this.known) // Unknown#lt
        return new Lt(this, that);
    if(!that.known)
        return /*HACK < is the only operator where a.op(b) != b.op(a) */ that.lt(this).not().and(that.eq(this).not());
    return u1((this._A < (that._A & 0x1)) & 1);
};
u1.prototype.shl = function shl(that) { // assumes that is of an integer type.
    if(!this.known || !that.known) // Unknown#shl
        return new Shl(this, that);
    return u1(this._A << (that._A & 0x0));
};
u1.prototype.shr = function shr(that) { // assumes that is of an integer type.
    if(!this.known || !that.known) // Unknown#shr
        return new Shr(this, that);
    return u1(this._A >>> (that._A & 0x0));
};
u1.prototype.rol = function rol(that) {
    return this.shl(that).or(this.shr(u8(1).sub(that)));
};
u1.prototype.ror = function ror(that) {
    return this.shr(that).or(this.shl(u8(1).sub(that)));
};

var i1 = int[1] = exports.i1 = function i1(a) {
    if(!(this instanceof i1))
        return new i1(a);
    if(typeof a == 'number')
        this._A = a << 31 >> 31;
    else if(a.known)
        this._A = a._A << 31 >> 31;
    else {
        this._A = a instanceof u1 || a instanceof i1 ? a._A : a;
        this.known = false;
    }
}
i1.prototype = new Integer;
i1.prototype.constructor = i1;
i1.prototype.type = i1.bind(null);
i1.prototype._A = 0;
i1.prototype.bitsof = 1;
i1.prototype.signed = true;
i1.prototype.inspect = function() {
    if(this.known)
        return (this._A >= 48 ? '0x'+this._A.toString(16) : this._A)+(process.env.DEBUG_INT ? 'b' : '');
    var a = inspect(this._A);
    return (process.env.DEBUG_INT || this._A instanceof Integer || this._A instanceof Unknown) ? 'i1('+a+')' : a;
};
i1.prototype.not = function not() {
    if(!this.known) // Unknown#not
        return new Not(this);
    return i1(~this._A);
};
i1.prototype.neg = function neg() {
    if(!this.known) // Unknown#neg
        return new Neg(this);
    return i1(-this._A);
};
i1.prototype.mov = function mov(that) { // assumes that is of an integer type.
    if(that.bitsof > 1 || that.bitsof == 1 && !that.signed) { // that.type > this.type
        if(!this.known && that.known) // Unknown#mov
            return that.type(this).mov(that);
        return that.mov(this);
    }
    if(!this.known) // Unknown#mov
        return new Mov(this, that);
    if(!that.known)
        return that.mov(this);
    return i1(this._A = that._A);
};
i1.prototype.add = function add(that) { // assumes that is of an integer type.
    if(that.bitsof > 1 || that.bitsof == 1 && !that.signed) { // that.type > this.type
        if(!this.known && that.known) // Unknown#add
            return that.type(this).add(that);
        return that.add(this);
    }
    if(!this.known) // Unknown#add
        return new Add(this, that);
    if(!that.known)
        return that.add(this);
    return i1(this._A + that._A);
};
i1.prototype.mul = function mul(that) { // assumes that is of an integer type.
    if(that.bitsof > 1 || that.bitsof == 1 && !that.signed) { // that.type > this.type
        if(!this.known && that.known) // Unknown#mul
            return that.type(this).mul(that);
        return that.mul(this);
    }
    if(!this.known) // Unknown#mul
        return new Mul(this, that);
    if(!that.known)
        return that.mul(this);
    return i1(this._A * that._A);
};
i1.prototype.div = function div(that) { // assumes that is of an integer type.
    if(that.bitsof > 1 || that.bitsof == 1 && !that.signed) { // that.type > this.type
        if(!this.known && that.known) // Unknown#div
            return that.type(this).div(that);
        return that.div(this);
    }
    if(!this.known) // Unknown#div
        return new Div(this, that);
    if(!that.known)
        return that.div(this);
    return i1(this._A / that._A);
};
i1.prototype.and = function and(that) { // assumes that is of an integer type.
    if(that.bitsof > 1 || that.bitsof == 1 && !that.signed) { // that.type > this.type
        if(!this.known && that.known) // Unknown#and
            return that.type(this).and(that);
        return that.and(this);
    }
    if(!this.known) // Unknown#and
        return new And(this, that);
    if(!that.known)
        return that.and(this);
    return i1(this._A & that._A);
};
i1.prototype.or = function or(that) { // assumes that is of an integer type.
    if(that.bitsof > 1 || that.bitsof == 1 && !that.signed) { // that.type > this.type
        if(!this.known && that.known) // Unknown#or
            return that.type(this).or(that);
        return that.or(this);
    }
    if(!this.known) // Unknown#or
        return new Or(this, that);
    if(!that.known)
        return that.or(this);
    return i1(this._A | that._A);
};
i1.prototype.xor = function xor(that) { // assumes that is of an integer type.
    if(that.bitsof > 1 || that.bitsof == 1 && !that.signed) { // that.type > this.type
        if(!this.known && that.known) // Unknown#xor
            return that.type(this).xor(that);
        return that.xor(this);
    }
    if(!this.known) // Unknown#xor
        return new Xor(this, that);
    if(!that.known)
        return that.xor(this);
    return i1(this._A ^ that._A);
};
i1.prototype.eq = function eq(that) { // assumes that is of an integer type.
    if(that.bitsof > 1 || that.bitsof == 1 && !that.signed) { // that.type > this.type
        if(!this.known && that.known) // Unknown#eq
            return that.type(this).eq(that);
        return that.eq(this);
    }
    if(!this.known) // Unknown#eq
        return new Eq(this, that);
    if(!that.known)
        return that.eq(this);
    return u1((this._A == that._A) & 1);
};
i1.prototype.lt = function lt(that) { // assumes that is of an integer type.
    if(that.bitsof > 1 || that.bitsof == 1 && !that.signed) { // that.type > this.type
        if(!this.known && that.known) // Unknown#lt
            return that.type(this).lt(that);
        return /*HACK < is the only operator where a.op(b) != b.op(a) */ that.lt(this).not().and(that.eq(this).not());
    }
    if(!this.known) // Unknown#lt
        return new Lt(this, that);
    if(!that.known)
        return /*HACK < is the only operator where a.op(b) != b.op(a) */ that.lt(this).not().and(that.eq(this).not());
    return u1((this._A < that._A) & 1);
};
i1.prototype.shl = function shl(that) { // assumes that is of an integer type.
    if(!this.known || !that.known) // Unknown#shl
        return new Shl(this, that);
    return i1(this._A << (that._A & 0x0));
};
i1.prototype.shr = function shr(that) { // assumes that is of an integer type.
    if(!this.known || !that.known) // Unknown#shr
        return new Shr(this, that);
    return i1(this._A >> (that._A & 0x0));
};
i1.prototype.rol = function rol(that) {
    return this.shl(that).or(this.shr(u8(1).sub(that)));
};
i1.prototype.ror = function ror(that) {
    return this.shr(that).or(this.shl(u8(1).sub(that)));
};

var u8 = uint[8] = exports.u8 = function u8(a) {
    if(!(this instanceof u8))
        return new u8(a);
    if(typeof a == 'number')
        this._A = a & 0xff;
    else if(a.known)
        this._A = a._A & 0xff;
    else {
        this._A = a instanceof i8 || a instanceof u8 ? a._A : a;
        this.known = false;
    }
}
u8.prototype = new Integer;
u8.prototype.constructor = u8;
u8.prototype.type = u8.bind(null);
u8.prototype._A = 0;
u8.prototype.bitsof = 8;
u8.prototype.signed = false;
u8.prototype.inspect = function() {
    if(this.known)
        return (this._A >= 48 ? '0x'+this._A.toString(16) : this._A)+(process.env.DEBUG_INT ? 'uc' : '');
    var a = inspect(this._A);
    return (process.env.DEBUG_INT || this._A instanceof Integer || this._A instanceof Unknown) ? 'u8('+a+')' : a;
};
u8.prototype.not = function not() {
    if(!this.known) // Unknown#not
        return new Not(this);
    return u8(~this._A);
};
u8.prototype.neg = function neg() {
    if(!this.known) // Unknown#neg
        return new Neg(this);
    return u8(-this._A);
};
u8.prototype.mov = function mov(that) { // assumes that is of an integer type.
    if(that.bitsof > 8) { // that.type > this.type
        if(!this.known && that.known) // Unknown#mov
            return that.type(this).mov(that);
        return that.mov(this);
    }
    if(!this.known) // Unknown#mov
        return new Mov(this, that);
    if(!that.known)
        return that.mov(this);
    return u8(this._A = (that._A & 0xff));
};
u8.prototype.add = function add(that) { // assumes that is of an integer type.
    if(that.bitsof > 8) { // that.type > this.type
        if(!this.known && that.known) // Unknown#add
            return that.type(this).add(that);
        return that.add(this);
    }
    if(!this.known) // Unknown#add
        return new Add(this, that);
    if(!that.known)
        return that.add(this);
    return u8(this._A + (that._A & 0xff));
};
u8.prototype.mul = function mul(that) { // assumes that is of an integer type.
    if(that.bitsof > 8) { // that.type > this.type
        if(!this.known && that.known) // Unknown#mul
            return that.type(this).mul(that);
        return that.mul(this);
    }
    if(!this.known) // Unknown#mul
        return new Mul(this, that);
    if(!that.known)
        return that.mul(this);
    return u8(this._A * (that._A & 0xff));
};
u8.prototype.div = function div(that) { // assumes that is of an integer type.
    if(that.bitsof > 8) { // that.type > this.type
        if(!this.known && that.known) // Unknown#div
            return that.type(this).div(that);
        return that.div(this);
    }
    if(!this.known) // Unknown#div
        return new Div(this, that);
    if(!that.known)
        return that.div(this);
    return u8(this._A / (that._A & 0xff));
};
u8.prototype.and = function and(that) { // assumes that is of an integer type.
    if(that.bitsof > 8) { // that.type > this.type
        if(!this.known && that.known) // Unknown#and
            return that.type(this).and(that);
        return that.and(this);
    }
    if(!this.known) // Unknown#and
        return new And(this, that);
    if(!that.known)
        return that.and(this);
    return u8(this._A & (that._A & 0xff));
};
u8.prototype.or = function or(that) { // assumes that is of an integer type.
    if(that.bitsof > 8) { // that.type > this.type
        if(!this.known && that.known) // Unknown#or
            return that.type(this).or(that);
        return that.or(this);
    }
    if(!this.known) // Unknown#or
        return new Or(this, that);
    if(!that.known)
        return that.or(this);
    return u8(this._A | (that._A & 0xff));
};
u8.prototype.xor = function xor(that) { // assumes that is of an integer type.
    if(that.bitsof > 8) { // that.type > this.type
        if(!this.known && that.known) // Unknown#xor
            return that.type(this).xor(that);
        return that.xor(this);
    }
    if(!this.known) // Unknown#xor
        return new Xor(this, that);
    if(!that.known)
        return that.xor(this);
    return u8(this._A ^ (that._A & 0xff));
};
u8.prototype.eq = function eq(that) { // assumes that is of an integer type.
    if(that.bitsof > 8) { // that.type > this.type
        if(!this.known && that.known) // Unknown#eq
            return that.type(this).eq(that);
        return that.eq(this);
    }
    if(!this.known) // Unknown#eq
        return new Eq(this, that);
    if(!that.known)
        return that.eq(this);
    return u1((this._A == (that._A & 0xff)) & 1);
};
u8.prototype.lt = function lt(that) { // assumes that is of an integer type.
    if(that.bitsof > 8) { // that.type > this.type
        if(!this.known && that.known) // Unknown#lt
            return that.type(this).lt(that);
        return /*HACK < is the only operator where a.op(b) != b.op(a) */ that.lt(this).not().and(that.eq(this).not());
    }
    if(!this.known) // Unknown#lt
        return new Lt(this, that);
    if(!that.known)
        return /*HACK < is the only operator where a.op(b) != b.op(a) */ that.lt(this).not().and(that.eq(this).not());
    return u1((this._A < (that._A & 0xff)) & 1);
};
u8.prototype.shl = function shl(that) { // assumes that is of an integer type.
    if(!this.known || !that.known) // Unknown#shl
        return new Shl(this, that);
    return u8(this._A << (that._A & 0x7));
};
u8.prototype.shr = function shr(that) { // assumes that is of an integer type.
    if(!this.known || !that.known) // Unknown#shr
        return new Shr(this, that);
    return u8(this._A >>> (that._A & 0x7));
};
u8.prototype.rol = function rol(that) {
    return this.shl(that).or(this.shr(u8(8).sub(that)));
};
u8.prototype.ror = function ror(that) {
    return this.shr(that).or(this.shl(u8(8).sub(that)));
};

var i8 = int[8] = exports.i8 = function i8(a) {
    if(!(this instanceof i8))
        return new i8(a);
    if(typeof a == 'number')
        this._A = a << 24 >> 24;
    else if(a.known)
        this._A = a._A << 24 >> 24;
    else {
        this._A = a instanceof u8 || a instanceof i8 ? a._A : a;
        this.known = false;
    }
}
i8.prototype = new Integer;
i8.prototype.constructor = i8;
i8.prototype.type = i8.bind(null);
i8.prototype._A = 0;
i8.prototype.bitsof = 8;
i8.prototype.signed = true;
i8.prototype.inspect = function() {
    if(this.known)
        return (this._A >= 48 ? '0x'+this._A.toString(16) : this._A)+(process.env.DEBUG_INT ? 'c' : '');
    var a = inspect(this._A);
    return (process.env.DEBUG_INT || this._A instanceof Integer || this._A instanceof Unknown) ? 'i8('+a+')' : a;
};
i8.prototype.not = function not() {
    if(!this.known) // Unknown#not
        return new Not(this);
    return i8(~this._A);
};
i8.prototype.neg = function neg() {
    if(!this.known) // Unknown#neg
        return new Neg(this);
    return i8(-this._A);
};
i8.prototype.mov = function mov(that) { // assumes that is of an integer type.
    if(that.bitsof > 8 || that.bitsof == 8 && !that.signed) { // that.type > this.type
        if(!this.known && that.known) // Unknown#mov
            return that.type(this).mov(that);
        return that.mov(this);
    }
    if(!this.known) // Unknown#mov
        return new Mov(this, that);
    if(!that.known)
        return that.mov(this);
    return i8(this._A = that._A);
};
i8.prototype.add = function add(that) { // assumes that is of an integer type.
    if(that.bitsof > 8 || that.bitsof == 8 && !that.signed) { // that.type > this.type
        if(!this.known && that.known) // Unknown#add
            return that.type(this).add(that);
        return that.add(this);
    }
    if(!this.known) // Unknown#add
        return new Add(this, that);
    if(!that.known)
        return that.add(this);
    return i8(this._A + that._A);
};
i8.prototype.mul = function mul(that) { // assumes that is of an integer type.
    if(that.bitsof > 8 || that.bitsof == 8 && !that.signed) { // that.type > this.type
        if(!this.known && that.known) // Unknown#mul
            return that.type(this).mul(that);
        return that.mul(this);
    }
    if(!this.known) // Unknown#mul
        return new Mul(this, that);
    if(!that.known)
        return that.mul(this);
    return i8(this._A * that._A);
};
i8.prototype.div = function div(that) { // assumes that is of an integer type.
    if(that.bitsof > 8 || that.bitsof == 8 && !that.signed) { // that.type > this.type
        if(!this.known && that.known) // Unknown#div
            return that.type(this).div(that);
        return that.div(this);
    }
    if(!this.known) // Unknown#div
        return new Div(this, that);
    if(!that.known)
        return that.div(this);
    return i8(this._A / that._A);
};
i8.prototype.and = function and(that) { // assumes that is of an integer type.
    if(that.bitsof > 8 || that.bitsof == 8 && !that.signed) { // that.type > this.type
        if(!this.known && that.known) // Unknown#and
            return that.type(this).and(that);
        return that.and(this);
    }
    if(!this.known) // Unknown#and
        return new And(this, that);
    if(!that.known)
        return that.and(this);
    return i8(this._A & that._A);
};
i8.prototype.or = function or(that) { // assumes that is of an integer type.
    if(that.bitsof > 8 || that.bitsof == 8 && !that.signed) { // that.type > this.type
        if(!this.known && that.known) // Unknown#or
            return that.type(this).or(that);
        return that.or(this);
    }
    if(!this.known) // Unknown#or
        return new Or(this, that);
    if(!that.known)
        return that.or(this);
    return i8(this._A | that._A);
};
i8.prototype.xor = function xor(that) { // assumes that is of an integer type.
    if(that.bitsof > 8 || that.bitsof == 8 && !that.signed) { // that.type > this.type
        if(!this.known && that.known) // Unknown#xor
            return that.type(this).xor(that);
        return that.xor(this);
    }
    if(!this.known) // Unknown#xor
        return new Xor(this, that);
    if(!that.known)
        return that.xor(this);
    return i8(this._A ^ that._A);
};
i8.prototype.eq = function eq(that) { // assumes that is of an integer type.
    if(that.bitsof > 8 || that.bitsof == 8 && !that.signed) { // that.type > this.type
        if(!this.known && that.known) // Unknown#eq
            return that.type(this).eq(that);
        return that.eq(this);
    }
    if(!this.known) // Unknown#eq
        return new Eq(this, that);
    if(!that.known)
        return that.eq(this);
    return u1((this._A == that._A) & 1);
};
i8.prototype.lt = function lt(that) { // assumes that is of an integer type.
    if(that.bitsof > 8 || that.bitsof == 8 && !that.signed) { // that.type > this.type
        if(!this.known && that.known) // Unknown#lt
            return that.type(this).lt(that);
        return /*HACK < is the only operator where a.op(b) != b.op(a) */ that.lt(this).not().and(that.eq(this).not());
    }
    if(!this.known) // Unknown#lt
        return new Lt(this, that);
    if(!that.known)
        return /*HACK < is the only operator where a.op(b) != b.op(a) */ that.lt(this).not().and(that.eq(this).not());
    return u1((this._A < that._A) & 1);
};
i8.prototype.shl = function shl(that) { // assumes that is of an integer type.
    if(!this.known || !that.known) // Unknown#shl
        return new Shl(this, that);
    return i8(this._A << (that._A & 0x7));
};
i8.prototype.shr = function shr(that) { // assumes that is of an integer type.
    if(!this.known || !that.known) // Unknown#shr
        return new Shr(this, that);
    return i8(this._A >> (that._A & 0x7));
};
i8.prototype.rol = function rol(that) {
    return this.shl(that).or(this.shr(u8(8).sub(that)));
};
i8.prototype.ror = function ror(that) {
    return this.shr(that).or(this.shl(u8(8).sub(that)));
};

var u16 = uint[16] = exports.u16 = function u16(a) {
    if(!(this instanceof u16))
        return new u16(a);
    if(typeof a == 'number')
        this._A = a & 0xffff;
    else if(a.known)
        this._A = a._A & 0xffff;
    else {
        this._A = a instanceof i16 || a instanceof u16 ? a._A : a;
        this.known = false;
    }
}
u16.prototype = new Integer;
u16.prototype.constructor = u16;
u16.prototype.type = u16.bind(null);
u16.prototype._A = 0;
u16.prototype.bitsof = 16;
u16.prototype.signed = false;
u16.prototype.inspect = function() {
    if(this.known)
        return (this._A >= 48 ? '0x'+this._A.toString(16) : this._A)+(process.env.DEBUG_INT ? 'us' : '');
    var a = inspect(this._A);
    return (process.env.DEBUG_INT || this._A instanceof Integer || this._A instanceof Unknown) ? 'u16('+a+')' : a;
};
u16.prototype.not = function not() {
    if(!this.known) // Unknown#not
        return new Not(this);
    return u16(~this._A);
};
u16.prototype.neg = function neg() {
    if(!this.known) // Unknown#neg
        return new Neg(this);
    return u16(-this._A);
};
u16.prototype.mov = function mov(that) { // assumes that is of an integer type.
    if(that.bitsof > 16) { // that.type > this.type
        if(!this.known && that.known) // Unknown#mov
            return that.type(this).mov(that);
        return that.mov(this);
    }
    if(!this.known) // Unknown#mov
        return new Mov(this, that);
    if(!that.known)
        return that.mov(this);
    return u16(this._A = (that._A & 0xffff));
};
u16.prototype.add = function add(that) { // assumes that is of an integer type.
    if(that.bitsof > 16) { // that.type > this.type
        if(!this.known && that.known) // Unknown#add
            return that.type(this).add(that);
        return that.add(this);
    }
    if(!this.known) // Unknown#add
        return new Add(this, that);
    if(!that.known)
        return that.add(this);
    return u16(this._A + (that._A & 0xffff));
};
u16.prototype.mul = function mul(that) { // assumes that is of an integer type.
    if(that.bitsof > 16) { // that.type > this.type
        if(!this.known && that.known) // Unknown#mul
            return that.type(this).mul(that);
        return that.mul(this);
    }
    if(!this.known) // Unknown#mul
        return new Mul(this, that);
    if(!that.known)
        return that.mul(this);
    return u16(this._A * (that._A & 0xffff));
};
u16.prototype.div = function div(that) { // assumes that is of an integer type.
    if(that.bitsof > 16) { // that.type > this.type
        if(!this.known && that.known) // Unknown#div
            return that.type(this).div(that);
        return that.div(this);
    }
    if(!this.known) // Unknown#div
        return new Div(this, that);
    if(!that.known)
        return that.div(this);
    return u16(this._A / (that._A & 0xffff));
};
u16.prototype.and = function and(that) { // assumes that is of an integer type.
    if(that.bitsof > 16) { // that.type > this.type
        if(!this.known && that.known) // Unknown#and
            return that.type(this).and(that);
        return that.and(this);
    }
    if(!this.known) // Unknown#and
        return new And(this, that);
    if(!that.known)
        return that.and(this);
    return u16(this._A & (that._A & 0xffff));
};
u16.prototype.or = function or(that) { // assumes that is of an integer type.
    if(that.bitsof > 16) { // that.type > this.type
        if(!this.known && that.known) // Unknown#or
            return that.type(this).or(that);
        return that.or(this);
    }
    if(!this.known) // Unknown#or
        return new Or(this, that);
    if(!that.known)
        return that.or(this);
    return u16(this._A | (that._A & 0xffff));
};
u16.prototype.xor = function xor(that) { // assumes that is of an integer type.
    if(that.bitsof > 16) { // that.type > this.type
        if(!this.known && that.known) // Unknown#xor
            return that.type(this).xor(that);
        return that.xor(this);
    }
    if(!this.known) // Unknown#xor
        return new Xor(this, that);
    if(!that.known)
        return that.xor(this);
    return u16(this._A ^ (that._A & 0xffff));
};
u16.prototype.eq = function eq(that) { // assumes that is of an integer type.
    if(that.bitsof > 16) { // that.type > this.type
        if(!this.known && that.known) // Unknown#eq
            return that.type(this).eq(that);
        return that.eq(this);
    }
    if(!this.known) // Unknown#eq
        return new Eq(this, that);
    if(!that.known)
        return that.eq(this);
    return u1((this._A == (that._A & 0xffff)) & 1);
};
u16.prototype.lt = function lt(that) { // assumes that is of an integer type.
    if(that.bitsof > 16) { // that.type > this.type
        if(!this.known && that.known) // Unknown#lt
            return that.type(this).lt(that);
        return /*HACK < is the only operator where a.op(b) != b.op(a) */ that.lt(this).not().and(that.eq(this).not());
    }
    if(!this.known) // Unknown#lt
        return new Lt(this, that);
    if(!that.known)
        return /*HACK < is the only operator where a.op(b) != b.op(a) */ that.lt(this).not().and(that.eq(this).not());
    return u1((this._A < (that._A & 0xffff)) & 1);
};
u16.prototype.shl = function shl(that) { // assumes that is of an integer type.
    if(!this.known || !that.known) // Unknown#shl
        return new Shl(this, that);
    return u16(this._A << (that._A & 0xf));
};
u16.prototype.shr = function shr(that) { // assumes that is of an integer type.
    if(!this.known || !that.known) // Unknown#shr
        return new Shr(this, that);
    return u16(this._A >>> (that._A & 0xf));
};
u16.prototype.rol = function rol(that) {
    return this.shl(that).or(this.shr(u8(16).sub(that)));
};
u16.prototype.ror = function ror(that) {
    return this.shr(that).or(this.shl(u8(16).sub(that)));
};

var i16 = int[16] = exports.i16 = function i16(a) {
    if(!(this instanceof i16))
        return new i16(a);
    if(typeof a == 'number')
        this._A = a << 16 >> 16;
    else if(a.known)
        this._A = a._A << 16 >> 16;
    else {
        this._A = a instanceof u16 || a instanceof i16 ? a._A : a;
        this.known = false;
    }
}
i16.prototype = new Integer;
i16.prototype.constructor = i16;
i16.prototype.type = i16.bind(null);
i16.prototype._A = 0;
i16.prototype.bitsof = 16;
i16.prototype.signed = true;
i16.prototype.inspect = function() {
    if(this.known)
        return (this._A >= 48 ? '0x'+this._A.toString(16) : this._A)+(process.env.DEBUG_INT ? 's' : '');
    var a = inspect(this._A);
    return (process.env.DEBUG_INT || this._A instanceof Integer || this._A instanceof Unknown) ? 'i16('+a+')' : a;
};
i16.prototype.not = function not() {
    if(!this.known) // Unknown#not
        return new Not(this);
    return i16(~this._A);
};
i16.prototype.neg = function neg() {
    if(!this.known) // Unknown#neg
        return new Neg(this);
    return i16(-this._A);
};
i16.prototype.mov = function mov(that) { // assumes that is of an integer type.
    if(that.bitsof > 16 || that.bitsof == 16 && !that.signed) { // that.type > this.type
        if(!this.known && that.known) // Unknown#mov
            return that.type(this).mov(that);
        return that.mov(this);
    }
    if(!this.known) // Unknown#mov
        return new Mov(this, that);
    if(!that.known)
        return that.mov(this);
    return i16(this._A = that._A);
};
i16.prototype.add = function add(that) { // assumes that is of an integer type.
    if(that.bitsof > 16 || that.bitsof == 16 && !that.signed) { // that.type > this.type
        if(!this.known && that.known) // Unknown#add
            return that.type(this).add(that);
        return that.add(this);
    }
    if(!this.known) // Unknown#add
        return new Add(this, that);
    if(!that.known)
        return that.add(this);
    return i16(this._A + that._A);
};
i16.prototype.mul = function mul(that) { // assumes that is of an integer type.
    if(that.bitsof > 16 || that.bitsof == 16 && !that.signed) { // that.type > this.type
        if(!this.known && that.known) // Unknown#mul
            return that.type(this).mul(that);
        return that.mul(this);
    }
    if(!this.known) // Unknown#mul
        return new Mul(this, that);
    if(!that.known)
        return that.mul(this);
    return i16(this._A * that._A);
};
i16.prototype.div = function div(that) { // assumes that is of an integer type.
    if(that.bitsof > 16 || that.bitsof == 16 && !that.signed) { // that.type > this.type
        if(!this.known && that.known) // Unknown#div
            return that.type(this).div(that);
        return that.div(this);
    }
    if(!this.known) // Unknown#div
        return new Div(this, that);
    if(!that.known)
        return that.div(this);
    return i16(this._A / that._A);
};
i16.prototype.and = function and(that) { // assumes that is of an integer type.
    if(that.bitsof > 16 || that.bitsof == 16 && !that.signed) { // that.type > this.type
        if(!this.known && that.known) // Unknown#and
            return that.type(this).and(that);
        return that.and(this);
    }
    if(!this.known) // Unknown#and
        return new And(this, that);
    if(!that.known)
        return that.and(this);
    return i16(this._A & that._A);
};
i16.prototype.or = function or(that) { // assumes that is of an integer type.
    if(that.bitsof > 16 || that.bitsof == 16 && !that.signed) { // that.type > this.type
        if(!this.known && that.known) // Unknown#or
            return that.type(this).or(that);
        return that.or(this);
    }
    if(!this.known) // Unknown#or
        return new Or(this, that);
    if(!that.known)
        return that.or(this);
    return i16(this._A | that._A);
};
i16.prototype.xor = function xor(that) { // assumes that is of an integer type.
    if(that.bitsof > 16 || that.bitsof == 16 && !that.signed) { // that.type > this.type
        if(!this.known && that.known) // Unknown#xor
            return that.type(this).xor(that);
        return that.xor(this);
    }
    if(!this.known) // Unknown#xor
        return new Xor(this, that);
    if(!that.known)
        return that.xor(this);
    return i16(this._A ^ that._A);
};
i16.prototype.eq = function eq(that) { // assumes that is of an integer type.
    if(that.bitsof > 16 || that.bitsof == 16 && !that.signed) { // that.type > this.type
        if(!this.known && that.known) // Unknown#eq
            return that.type(this).eq(that);
        return that.eq(this);
    }
    if(!this.known) // Unknown#eq
        return new Eq(this, that);
    if(!that.known)
        return that.eq(this);
    return u1((this._A == that._A) & 1);
};
i16.prototype.lt = function lt(that) { // assumes that is of an integer type.
    if(that.bitsof > 16 || that.bitsof == 16 && !that.signed) { // that.type > this.type
        if(!this.known && that.known) // Unknown#lt
            return that.type(this).lt(that);
        return /*HACK < is the only operator where a.op(b) != b.op(a) */ that.lt(this).not().and(that.eq(this).not());
    }
    if(!this.known) // Unknown#lt
        return new Lt(this, that);
    if(!that.known)
        return /*HACK < is the only operator where a.op(b) != b.op(a) */ that.lt(this).not().and(that.eq(this).not());
    return u1((this._A < that._A) & 1);
};
i16.prototype.shl = function shl(that) { // assumes that is of an integer type.
    if(!this.known || !that.known) // Unknown#shl
        return new Shl(this, that);
    return i16(this._A << (that._A & 0xf));
};
i16.prototype.shr = function shr(that) { // assumes that is of an integer type.
    if(!this.known || !that.known) // Unknown#shr
        return new Shr(this, that);
    return i16(this._A >> (that._A & 0xf));
};
i16.prototype.rol = function rol(that) {
    return this.shl(that).or(this.shr(u8(16).sub(that)));
};
i16.prototype.ror = function ror(that) {
    return this.shr(that).or(this.shl(u8(16).sub(that)));
};

var u32 = uint[32] = exports.u32 = function u32(a) {
    if(!(this instanceof u32))
        return new u32(a);
    if(typeof a == 'number')
        this._A = a >>> 0;
    else if(a.known)
        this._A = a._A >>> 0;
    else {
        this._A = a instanceof i32 || a instanceof u32 ? a._A : a;
        this.known = false;
    }
}
u32.prototype = new Integer;
u32.prototype.constructor = u32;
u32.prototype.type = u32.bind(null);
u32.prototype._A = 0;
u32.prototype.bitsof = 32;
u32.prototype.signed = false;
u32.prototype.inspect = function() {
    if(this.known)
        return (this._A >= 48 ? '0x'+this._A.toString(16) : this._A)+(process.env.DEBUG_INT ? 'u' : '');
    var a = inspect(this._A);
    return (process.env.DEBUG_INT || this._A instanceof Integer || this._A instanceof Unknown) ? 'u32('+a+')' : a;
};
u32.prototype.not = function not() {
    if(!this.known) // Unknown#not
        return new Not(this);
    return u32(~this._A);
};
u32.prototype.neg = function neg() {
    if(!this.known) // Unknown#neg
        return new Neg(this);
    return u32(-this._A);
};
u32.prototype.mov = function mov(that) { // assumes that is of an integer type.
    if(that.bitsof > 32) { // that.type > this.type
        if(!this.known && that.known) // Unknown#mov
            return that.type(this).mov(that);
        return that.mov(this);
    }
    if(!this.known) // Unknown#mov
        return new Mov(this, that);
    if(!that.known)
        return that.mov(this);
    return u32(this._A = (that._A >>> 0));
};
u32.prototype.add = function add(that) { // assumes that is of an integer type.
    if(that.bitsof > 32) { // that.type > this.type
        if(!this.known && that.known) // Unknown#add
            return that.type(this).add(that);
        return that.add(this);
    }
    if(!this.known) // Unknown#add
        return new Add(this, that);
    if(!that.known)
        return that.add(this);
    return u32(this._A + (that._A >>> 0));
};
u32.prototype.mul = function mul(that) { // assumes that is of an integer type.
    if(that.bitsof > 32) { // that.type > this.type
        if(!this.known && that.known) // Unknown#mul
            return that.type(this).mul(that);
        return that.mul(this);
    }
    if(!this.known) // Unknown#mul
        return new Mul(this, that);
    if(!that.known)
        return that.mul(this);
    return u32(this._A * (that._A >>> 0));
};
u32.prototype.div = function div(that) { // assumes that is of an integer type.
    if(that.bitsof > 32) { // that.type > this.type
        if(!this.known && that.known) // Unknown#div
            return that.type(this).div(that);
        return that.div(this);
    }
    if(!this.known) // Unknown#div
        return new Div(this, that);
    if(!that.known)
        return that.div(this);
    return u32(this._A / (that._A >>> 0));
};
u32.prototype.and = function and(that) { // assumes that is of an integer type.
    if(that.bitsof > 32) { // that.type > this.type
        if(!this.known && that.known) // Unknown#and
            return that.type(this).and(that);
        return that.and(this);
    }
    if(!this.known) // Unknown#and
        return new And(this, that);
    if(!that.known)
        return that.and(this);
    return u32(this._A & (that._A >>> 0));
};
u32.prototype.or = function or(that) { // assumes that is of an integer type.
    if(that.bitsof > 32) { // that.type > this.type
        if(!this.known && that.known) // Unknown#or
            return that.type(this).or(that);
        return that.or(this);
    }
    if(!this.known) // Unknown#or
        return new Or(this, that);
    if(!that.known)
        return that.or(this);
    return u32(this._A | (that._A >>> 0));
};
u32.prototype.xor = function xor(that) { // assumes that is of an integer type.
    if(that.bitsof > 32) { // that.type > this.type
        if(!this.known && that.known) // Unknown#xor
            return that.type(this).xor(that);
        return that.xor(this);
    }
    if(!this.known) // Unknown#xor
        return new Xor(this, that);
    if(!that.known)
        return that.xor(this);
    return u32(this._A ^ (that._A >>> 0));
};
u32.prototype.eq = function eq(that) { // assumes that is of an integer type.
    if(that.bitsof > 32) { // that.type > this.type
        if(!this.known && that.known) // Unknown#eq
            return that.type(this).eq(that);
        return that.eq(this);
    }
    if(!this.known) // Unknown#eq
        return new Eq(this, that);
    if(!that.known)
        return that.eq(this);
    return u1((this._A == (that._A >>> 0)) & 1);
};
u32.prototype.lt = function lt(that) { // assumes that is of an integer type.
    if(that.bitsof > 32) { // that.type > this.type
        if(!this.known && that.known) // Unknown#lt
            return that.type(this).lt(that);
        return /*HACK < is the only operator where a.op(b) != b.op(a) */ that.lt(this).not().and(that.eq(this).not());
    }
    if(!this.known) // Unknown#lt
        return new Lt(this, that);
    if(!that.known)
        return /*HACK < is the only operator where a.op(b) != b.op(a) */ that.lt(this).not().and(that.eq(this).not());
    return u1((this._A < (that._A >>> 0)) & 1);
};
u32.prototype.shl = function shl(that) { // assumes that is of an integer type.
    if(!this.known || !that.known) // Unknown#shl
        return new Shl(this, that);
    return u32(this._A << (that._A & 0x1f));
};
u32.prototype.shr = function shr(that) { // assumes that is of an integer type.
    if(!this.known || !that.known) // Unknown#shr
        return new Shr(this, that);
    return u32(this._A >>> (that._A & 0x1f));
};
u32.prototype.rol = function rol(that) {
    return this.shl(that).or(this.shr(u8(32).sub(that)));
};
u32.prototype.ror = function ror(that) {
    return this.shr(that).or(this.shl(u8(32).sub(that)));
};

var i32 = int[32] = exports.i32 = function i32(a) {
    if(!(this instanceof i32))
        return new i32(a);
    if(typeof a == 'number')
        this._A = a >> 0;
    else if(a.known)
        this._A = a._A >> 0;
    else {
        this._A = a instanceof u32 || a instanceof i32 ? a._A : a;
        this.known = false;
    }
}
i32.prototype = new Integer;
i32.prototype.constructor = i32;
i32.prototype.type = i32.bind(null);
i32.prototype._A = 0;
i32.prototype.bitsof = 32;
i32.prototype.signed = true;
i32.prototype.inspect = function() {
    if(this.known)
        return (this._A >= 48 ? '0x'+this._A.toString(16) : this._A)+(process.env.DEBUG_INT ? '' : '');
    var a = inspect(this._A);
    return (process.env.DEBUG_INT || this._A instanceof Integer || this._A instanceof Unknown) ? 'i32('+a+')' : a;
};
i32.prototype.not = function not() {
    if(!this.known) // Unknown#not
        return new Not(this);
    return i32(~this._A);
};
i32.prototype.neg = function neg() {
    if(!this.known) // Unknown#neg
        return new Neg(this);
    return i32(-this._A);
};
i32.prototype.mov = function mov(that) { // assumes that is of an integer type.
    if(that.bitsof > 32 || that.bitsof == 32 && !that.signed) { // that.type > this.type
        if(!this.known && that.known) // Unknown#mov
            return that.type(this).mov(that);
        return that.mov(this);
    }
    if(!this.known) // Unknown#mov
        return new Mov(this, that);
    if(!that.known)
        return that.mov(this);
    return i32(this._A = that._A);
};
i32.prototype.add = function add(that) { // assumes that is of an integer type.
    if(that.bitsof > 32 || that.bitsof == 32 && !that.signed) { // that.type > this.type
        if(!this.known && that.known) // Unknown#add
            return that.type(this).add(that);
        return that.add(this);
    }
    if(!this.known) // Unknown#add
        return new Add(this, that);
    if(!that.known)
        return that.add(this);
    return i32(this._A + that._A);
};
i32.prototype.mul = function mul(that) { // assumes that is of an integer type.
    if(that.bitsof > 32 || that.bitsof == 32 && !that.signed) { // that.type > this.type
        if(!this.known && that.known) // Unknown#mul
            return that.type(this).mul(that);
        return that.mul(this);
    }
    if(!this.known) // Unknown#mul
        return new Mul(this, that);
    if(!that.known)
        return that.mul(this);
    return i32(this._A * that._A);
};
i32.prototype.div = function div(that) { // assumes that is of an integer type.
    if(that.bitsof > 32 || that.bitsof == 32 && !that.signed) { // that.type > this.type
        if(!this.known && that.known) // Unknown#div
            return that.type(this).div(that);
        return that.div(this);
    }
    if(!this.known) // Unknown#div
        return new Div(this, that);
    if(!that.known)
        return that.div(this);
    return i32(this._A / that._A);
};
i32.prototype.and = function and(that) { // assumes that is of an integer type.
    if(that.bitsof > 32 || that.bitsof == 32 && !that.signed) { // that.type > this.type
        if(!this.known && that.known) // Unknown#and
            return that.type(this).and(that);
        return that.and(this);
    }
    if(!this.known) // Unknown#and
        return new And(this, that);
    if(!that.known)
        return that.and(this);
    return i32(this._A & that._A);
};
i32.prototype.or = function or(that) { // assumes that is of an integer type.
    if(that.bitsof > 32 || that.bitsof == 32 && !that.signed) { // that.type > this.type
        if(!this.known && that.known) // Unknown#or
            return that.type(this).or(that);
        return that.or(this);
    }
    if(!this.known) // Unknown#or
        return new Or(this, that);
    if(!that.known)
        return that.or(this);
    return i32(this._A | that._A);
};
i32.prototype.xor = function xor(that) { // assumes that is of an integer type.
    if(that.bitsof > 32 || that.bitsof == 32 && !that.signed) { // that.type > this.type
        if(!this.known && that.known) // Unknown#xor
            return that.type(this).xor(that);
        return that.xor(this);
    }
    if(!this.known) // Unknown#xor
        return new Xor(this, that);
    if(!that.known)
        return that.xor(this);
    return i32(this._A ^ that._A);
};
i32.prototype.eq = function eq(that) { // assumes that is of an integer type.
    if(that.bitsof > 32 || that.bitsof == 32 && !that.signed) { // that.type > this.type
        if(!this.known && that.known) // Unknown#eq
            return that.type(this).eq(that);
        return that.eq(this);
    }
    if(!this.known) // Unknown#eq
        return new Eq(this, that);
    if(!that.known)
        return that.eq(this);
    return u1((this._A == that._A) & 1);
};
i32.prototype.lt = function lt(that) { // assumes that is of an integer type.
    if(that.bitsof > 32 || that.bitsof == 32 && !that.signed) { // that.type > this.type
        if(!this.known && that.known) // Unknown#lt
            return that.type(this).lt(that);
        return /*HACK < is the only operator where a.op(b) != b.op(a) */ that.lt(this).not().and(that.eq(this).not());
    }
    if(!this.known) // Unknown#lt
        return new Lt(this, that);
    if(!that.known)
        return /*HACK < is the only operator where a.op(b) != b.op(a) */ that.lt(this).not().and(that.eq(this).not());
    return u1((this._A < that._A) & 1);
};
i32.prototype.shl = function shl(that) { // assumes that is of an integer type.
    if(!this.known || !that.known) // Unknown#shl
        return new Shl(this, that);
    return i32(this._A << (that._A & 0x1f));
};
i32.prototype.shr = function shr(that) { // assumes that is of an integer type.
    if(!this.known || !that.known) // Unknown#shr
        return new Shr(this, that);
    return i32(this._A >> (that._A & 0x1f));
};
i32.prototype.rol = function rol(that) {
    return this.shl(that).or(this.shr(u8(32).sub(that)));
};
i32.prototype.ror = function ror(that) {
    return this.shr(that).or(this.shl(u8(32).sub(that)));
};

var u64 = uint[64] = exports.u64 = function u64(a, b) {
    if(!(this instanceof u64))
        return new u64(a);
    if(typeof a == 'number')
        this._A = a >>> 0;
    else if(a.known)
        this._A = a._A >>> 0;
    else {
        this._A = a instanceof i64 || a instanceof u64 ? a._A : a;
        this.known = false;
    }
}
u64.prototype = new Integer;
u64.prototype.constructor = u64;
u64.prototype.type = u64.bind(null);
u64.prototype._A = u64.prototype._B = 0;
u64.prototype.bitsof = 64;
u64.prototype.signed = false;
u64.prototype.inspect = function() {
    if(this.known)
        return 'u64('+this._A+', '+this._B+')';
    var a = inspect(this._A);
    return (process.env.DEBUG_INT || this._A instanceof Integer || this._A instanceof Unknown) ? 'u64('+a+')' : a;
};
u64.prototype.not = Unknown.prototype.not;
u64.prototype.neg = Unknown.prototype.neg;
u64.prototype.mov = Unknown.prototype.mov;
u64.prototype.add = Unknown.prototype.add;
u64.prototype.mul = Unknown.prototype.mul;
u64.prototype.div = Unknown.prototype.div;
u64.prototype.and = Unknown.prototype.and;
u64.prototype.or = Unknown.prototype.or;
u64.prototype.xor = Unknown.prototype.xor;
u64.prototype.eq = Unknown.prototype.eq;
u64.prototype.lt = Unknown.prototype.lt;
u64.prototype.shl = Unknown.prototype.shl;
u64.prototype.shr = Unknown.prototype.shr;
u64.prototype.rol = function rol(that) {
    return this.shl(that).or(this.shr(u8(64).sub(that)));
};
u64.prototype.ror = function ror(that) {
    return this.shr(that).or(this.shl(u8(64).sub(that)));
};

var i64 = int[64] = exports.i64 = function i64(a, b) {
    if(!(this instanceof i64))
        return new i64(a);
    if(typeof a == 'number')
        this._A = a >> 0;
    else if(a.known)
        this._A = a._A >> 0;
    else {
        this._A = a instanceof u64 || a instanceof i64 ? a._A : a;
        this.known = false;
    }
}
i64.prototype = new Integer;
i64.prototype.constructor = i64;
i64.prototype.type = i64.bind(null);
i64.prototype._A = i64.prototype._B = 0;
i64.prototype.bitsof = 64;
i64.prototype.signed = true;
i64.prototype.inspect = function() {
    if(this.known)
        return 'i64('+this._A+', '+this._B+')';
    var a = inspect(this._A);
    return (process.env.DEBUG_INT || this._A instanceof Integer || this._A instanceof Unknown) ? 'i64('+a+')' : a;
};
i64.prototype.not = Unknown.prototype.not;
i64.prototype.neg = Unknown.prototype.neg;
i64.prototype.mov = Unknown.prototype.mov;
i64.prototype.add = Unknown.prototype.add;
i64.prototype.mul = Unknown.prototype.mul;
i64.prototype.div = Unknown.prototype.div;
i64.prototype.and = Unknown.prototype.and;
i64.prototype.or = Unknown.prototype.or;
i64.prototype.xor = Unknown.prototype.xor;
i64.prototype.eq = Unknown.prototype.eq;
i64.prototype.lt = Unknown.prototype.lt;
i64.prototype.shl = Unknown.prototype.shl;
i64.prototype.shr = Unknown.prototype.shr;
i64.prototype.rol = function rol(that) {
    return this.shl(that).or(this.shr(u8(64).sub(that)));
};
i64.prototype.ror = function ror(that) {
    return this.shr(that).or(this.shl(u8(64).sub(that)));
};

var u128 = uint[128] = exports.u128 = function u128(a, b, c, d) {
    if(!(this instanceof u128))
        return new u128(a);
    if(typeof a == 'number')
        this._A = a >>> 0;
    else if(a.known)
        this._A = a._A >>> 0;
    else {
        this._A = a instanceof i128 || a instanceof u128 ? a._A : a;
        this.known = false;
    }
}
u128.prototype = new Integer;
u128.prototype.constructor = u128;
u128.prototype.type = u128.bind(null);
u128.prototype._A = u128.prototype._B = u128.prototype._C = u128.prototype._D = 0;
u128.prototype.bitsof = 128;
u128.prototype.signed = false;
u128.prototype.inspect = function() {
    if(this.known)
        return 'u128('+this._A+', '+this._B+', '+this._C+', '+this._D+')';
    var a = inspect(this._A);
    return (process.env.DEBUG_INT || this._A instanceof Integer || this._A instanceof Unknown) ? 'u128('+a+')' : a;
};
u128.prototype.not = Unknown.prototype.not;
u128.prototype.neg = Unknown.prototype.neg;
u128.prototype.mov = Unknown.prototype.mov;
u128.prototype.add = Unknown.prototype.add;
u128.prototype.mul = Unknown.prototype.mul;
u128.prototype.div = Unknown.prototype.div;
u128.prototype.and = Unknown.prototype.and;
u128.prototype.or = Unknown.prototype.or;
u128.prototype.xor = Unknown.prototype.xor;
u128.prototype.eq = Unknown.prototype.eq;
u128.prototype.lt = Unknown.prototype.lt;
u128.prototype.shl = Unknown.prototype.shl;
u128.prototype.shr = Unknown.prototype.shr;
u128.prototype.rol = function rol(that) {
    return this.shl(that).or(this.shr(u8(128).sub(that)));
};
u128.prototype.ror = function ror(that) {
    return this.shr(that).or(this.shl(u8(128).sub(that)));
};

var i128 = int[128] = exports.i128 = function i128(a, b, c, d) {
    if(!(this instanceof i128))
        return new i128(a);
    if(typeof a == 'number')
        this._A = a >> 0;
    else if(a.known)
        this._A = a._A >> 0;
    else {
        this._A = a instanceof u128 || a instanceof i128 ? a._A : a;
        this.known = false;
    }
}
i128.prototype = new Integer;
i128.prototype.constructor = i128;
i128.prototype.type = i128.bind(null);
i128.prototype._A = i128.prototype._B = i128.prototype._C = i128.prototype._D = 0;
i128.prototype.bitsof = 128;
i128.prototype.signed = true;
i128.prototype.inspect = function() {
    if(this.known)
        return 'i128('+this._A+', '+this._B+', '+this._C+', '+this._D+')';
    var a = inspect(this._A);
    return (process.env.DEBUG_INT || this._A instanceof Integer || this._A instanceof Unknown) ? 'i128('+a+')' : a;
};
i128.prototype.not = Unknown.prototype.not;
i128.prototype.neg = Unknown.prototype.neg;
i128.prototype.mov = Unknown.prototype.mov;
i128.prototype.add = Unknown.prototype.add;
i128.prototype.mul = Unknown.prototype.mul;
i128.prototype.div = Unknown.prototype.div;
i128.prototype.and = Unknown.prototype.and;
i128.prototype.or = Unknown.prototype.or;
i128.prototype.xor = Unknown.prototype.xor;
i128.prototype.eq = Unknown.prototype.eq;
i128.prototype.lt = Unknown.prototype.lt;
i128.prototype.shl = Unknown.prototype.shl;
i128.prototype.shr = Unknown.prototype.shr;
i128.prototype.rol = function rol(that) {
    return this.shl(that).or(this.shr(u8(128).sub(that)));
};
i128.prototype.ror = function ror(that) {
    return this.shr(that).or(this.shl(u8(128).sub(that)));
};

var u256 = uint[256] = exports.u256 = function u256(a, b, c, d, e, f, g, h) {
    if(!(this instanceof u256))
        return new u256(a);
    if(typeof a == 'number')
        this._A = a >>> 0;
    else if(a.known)
        this._A = a._A >>> 0;
    else {
        this._A = a instanceof i256 || a instanceof u256 ? a._A : a;
        this.known = false;
    }
}
u256.prototype = new Integer;
u256.prototype.constructor = u256;
u256.prototype.type = u256.bind(null);
u256.prototype._A = u256.prototype._B = u256.prototype._C = u256.prototype._D = u256.prototype._E = u256.prototype._F = u256.prototype._G = u256.prototype._H = 0;
u256.prototype.bitsof = 256;
u256.prototype.signed = false;
u256.prototype.inspect = function() {
    if(this.known)
        return 'u256('+this._A+', '+this._B+', '+this._C+', '+this._D+', '+this._E+', '+this._F+', '+this._G+', '+this._H+')';
    var a = inspect(this._A);
    return (process.env.DEBUG_INT || this._A instanceof Integer || this._A instanceof Unknown) ? 'u256('+a+')' : a;
};
u256.prototype.not = Unknown.prototype.not;
u256.prototype.neg = Unknown.prototype.neg;
u256.prototype.mov = Unknown.prototype.mov;
u256.prototype.add = Unknown.prototype.add;
u256.prototype.mul = Unknown.prototype.mul;
u256.prototype.div = Unknown.prototype.div;
u256.prototype.and = Unknown.prototype.and;
u256.prototype.or = Unknown.prototype.or;
u256.prototype.xor = Unknown.prototype.xor;
u256.prototype.eq = Unknown.prototype.eq;
u256.prototype.lt = Unknown.prototype.lt;
u256.prototype.shl = Unknown.prototype.shl;
u256.prototype.shr = Unknown.prototype.shr;
u256.prototype.rol = function rol(that) {
    return this.shl(that).or(this.shr(u8(256).sub(that)));
};
u256.prototype.ror = function ror(that) {
    return this.shr(that).or(this.shl(u8(256).sub(that)));
};

var i256 = int[256] = exports.i256 = function i256(a, b, c, d, e, f, g, h) {
    if(!(this instanceof i256))
        return new i256(a);
    if(typeof a == 'number')
        this._A = a >> 0;
    else if(a.known)
        this._A = a._A >> 0;
    else {
        this._A = a instanceof u256 || a instanceof i256 ? a._A : a;
        this.known = false;
    }
}
i256.prototype = new Integer;
i256.prototype.constructor = i256;
i256.prototype.type = i256.bind(null);
i256.prototype._A = i256.prototype._B = i256.prototype._C = i256.prototype._D = i256.prototype._E = i256.prototype._F = i256.prototype._G = i256.prototype._H = 0;
i256.prototype.bitsof = 256;
i256.prototype.signed = true;
i256.prototype.inspect = function() {
    if(this.known)
        return 'i256('+this._A+', '+this._B+', '+this._C+', '+this._D+', '+this._E+', '+this._F+', '+this._G+', '+this._H+')';
    var a = inspect(this._A);
    return (process.env.DEBUG_INT || this._A instanceof Integer || this._A instanceof Unknown) ? 'i256('+a+')' : a;
};
i256.prototype.not = Unknown.prototype.not;
i256.prototype.neg = Unknown.prototype.neg;
i256.prototype.mov = Unknown.prototype.mov;
i256.prototype.add = Unknown.prototype.add;
i256.prototype.mul = Unknown.prototype.mul;
i256.prototype.div = Unknown.prototype.div;
i256.prototype.and = Unknown.prototype.and;
i256.prototype.or = Unknown.prototype.or;
i256.prototype.xor = Unknown.prototype.xor;
i256.prototype.eq = Unknown.prototype.eq;
i256.prototype.lt = Unknown.prototype.lt;
i256.prototype.shl = Unknown.prototype.shl;
i256.prototype.shr = Unknown.prototype.shr;
i256.prototype.rol = function rol(that) {
    return this.shl(that).or(this.shr(u8(256).sub(that)));
};
i256.prototype.ror = function ror(that) {
    return this.shr(that).or(this.shl(u8(256).sub(that)));
};

var Register = exports.Register = [];
var Register1 = Register[1] = exports.Register1 = function Register1(name) {
    if(!(this instanceof Register1))
        return new Register1(addr);
    var self = this;
    if(name !== undefined)
        this.name = name;
    this.lvalue = {
        inspect: function() {
            return self.name + self.nthValue.toSubString();
        },
        freeze: function(v) {
            var frozenName = self.name + (self.nthValue++).toSubString();
            self.value = new Unknown(1);
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
Register1.prototype = new Unknown(1);
Register1.prototype.constructor = Register1;
Register1.prototype.name = '<1>';
Register1.prototype.nthValue = -1;
Register1.prototype.inspect = function inspect() {
    return this.name;
};
var Register8 = Register[8] = exports.Register8 = function Register8(name) {
    if(!(this instanceof Register8))
        return new Register8(addr);
    var self = this;
    if(name !== undefined)
        this.name = name;
    this.lvalue = {
        inspect: function() {
            return self.name + self.nthValue.toSubString();
        },
        freeze: function(v) {
            var frozenName = self.name + (self.nthValue++).toSubString();
            self.value = new Unknown(8);
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
Register8.prototype = new Unknown(8);
Register8.prototype.constructor = Register8;
Register8.prototype.name = '<8>';
Register8.prototype.nthValue = -1;
Register8.prototype.inspect = function inspect() {
    return this.name;
};
var Register16 = Register[16] = exports.Register16 = function Register16(name) {
    if(!(this instanceof Register16))
        return new Register16(addr);
    var self = this;
    if(name !== undefined)
        this.name = name;
    this.lvalue = {
        inspect: function() {
            return self.name + self.nthValue.toSubString();
        },
        freeze: function(v) {
            var frozenName = self.name + (self.nthValue++).toSubString();
            self.value = new Unknown(16);
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
Register16.prototype = new Unknown(16);
Register16.prototype.constructor = Register16;
Register16.prototype.name = '<16>';
Register16.prototype.nthValue = -1;
Register16.prototype.inspect = function inspect() {
    return this.name;
};
var Register32 = Register[32] = exports.Register32 = function Register32(name) {
    if(!(this instanceof Register32))
        return new Register32(addr);
    var self = this;
    if(name !== undefined)
        this.name = name;
    this.lvalue = {
        inspect: function() {
            return self.name + self.nthValue.toSubString();
        },
        freeze: function(v) {
            var frozenName = self.name + (self.nthValue++).toSubString();
            self.value = new Unknown(32);
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
Register32.prototype = new Unknown(32);
Register32.prototype.constructor = Register32;
Register32.prototype.name = '<32>';
Register32.prototype.nthValue = -1;
Register32.prototype.inspect = function inspect() {
    return this.name;
};
var Register64 = Register[64] = exports.Register64 = function Register64(name) {
    if(!(this instanceof Register64))
        return new Register64(addr);
    var self = this;
    if(name !== undefined)
        this.name = name;
    this.lvalue = {
        inspect: function() {
            return self.name + self.nthValue.toSubString();
        },
        freeze: function(v) {
            var frozenName = self.name + (self.nthValue++).toSubString();
            self.value = new Unknown(64);
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
Register64.prototype = new Unknown(64);
Register64.prototype.constructor = Register64;
Register64.prototype.name = '<64>';
Register64.prototype.nthValue = -1;
Register64.prototype.inspect = function inspect() {
    return this.name;
};
var Register128 = Register[128] = exports.Register128 = function Register128(name) {
    if(!(this instanceof Register128))
        return new Register128(addr);
    var self = this;
    if(name !== undefined)
        this.name = name;
    this.lvalue = {
        inspect: function() {
            return self.name + self.nthValue.toSubString();
        },
        freeze: function(v) {
            var frozenName = self.name + (self.nthValue++).toSubString();
            self.value = new Unknown(128);
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
Register128.prototype = new Unknown(128);
Register128.prototype.constructor = Register128;
Register128.prototype.name = '<128>';
Register128.prototype.nthValue = -1;
Register128.prototype.inspect = function inspect() {
    return this.name;
};
var Register256 = Register[256] = exports.Register256 = function Register256(name) {
    if(!(this instanceof Register256))
        return new Register256(addr);
    var self = this;
    if(name !== undefined)
        this.name = name;
    this.lvalue = {
        inspect: function() {
            return self.name + self.nthValue.toSubString();
        },
        freeze: function(v) {
            var frozenName = self.name + (self.nthValue++).toSubString();
            self.value = new Unknown(256);
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
Register256.prototype = new Unknown(256);
Register256.prototype.constructor = Register256;
Register256.prototype.name = '<256>';
Register256.prototype.nthValue = -1;
Register256.prototype.inspect = function inspect() {
    return this.name;
};
var Mem = exports.Mem = {};
Mem.read = function(address, bits) {
    if(process.env.DEBUG_MEM)
        console.error('Non-implemented Mem read ['+inspect(address)+']'+bits);
};
Mem.write = function(address, bits, value) {
    if(process.env.DEBUG_MEM)
        console.error('Non-implemented Mem write ['+inspect(address)+']'+bits+' = '+inspect(value));
};
var Mem1 = Mem[1] = exports.Mem1 = function Mem1(addr) {
    if(!(this instanceof Mem1))
        return new Mem1(addr);
    this.addr = addr;
};
Mem1.prototype = new Unknown(1);
Mem1.prototype.constructor = Mem1;
Object.defineProperties(Mem1.prototype, {
    lvalue: {
        get: function() {
            var v = valueof(this.addr);
            if(v !== this.addr) return Mem1(v);
        }
    },
    value: {
        get: function() {
            var v = valueof(this.addr), m = Mem.read(v, 1);
            if(m !== null && m !== void 0)
                return m;
            if(v !== this.addr) return Mem1(v);
        },
        set: function(v) {
            return Mem.write(this.addr, 1, v);
        }
    }
});
Mem1.prototype.inspect = function() {
    return '['+inspect(this.addr)+']1';
};

var Mem8 = Mem[8] = exports.Mem8 = function Mem8(addr) {
    if(!(this instanceof Mem8))
        return new Mem8(addr);
    this.addr = addr;
};
Mem8.prototype = new Unknown(8);
Mem8.prototype.constructor = Mem8;
Object.defineProperties(Mem8.prototype, {
    lvalue: {
        get: function() {
            var v = valueof(this.addr);
            if(v !== this.addr) return Mem8(v);
        }
    },
    value: {
        get: function() {
            var v = valueof(this.addr), m = Mem.read(v, 8);
            if(m !== null && m !== void 0)
                return m;
            if(v !== this.addr) return Mem8(v);
        },
        set: function(v) {
            return Mem.write(this.addr, 8, v);
        }
    }
});
Mem8.prototype.inspect = function() {
    return '['+inspect(this.addr)+']8';
};

var Mem16 = Mem[16] = exports.Mem16 = function Mem16(addr) {
    if(!(this instanceof Mem16))
        return new Mem16(addr);
    this.addr = addr;
};
Mem16.prototype = new Unknown(16);
Mem16.prototype.constructor = Mem16;
Object.defineProperties(Mem16.prototype, {
    lvalue: {
        get: function() {
            var v = valueof(this.addr);
            if(v !== this.addr) return Mem16(v);
        }
    },
    value: {
        get: function() {
            var v = valueof(this.addr), m = Mem.read(v, 16);
            if(m !== null && m !== void 0)
                return m;
            if(v !== this.addr) return Mem16(v);
        },
        set: function(v) {
            return Mem.write(this.addr, 16, v);
        }
    }
});
Mem16.prototype.inspect = function() {
    return '['+inspect(this.addr)+']16';
};

var Mem32 = Mem[32] = exports.Mem32 = function Mem32(addr) {
    if(!(this instanceof Mem32))
        return new Mem32(addr);
    this.addr = addr;
};
Mem32.prototype = new Unknown(32);
Mem32.prototype.constructor = Mem32;
Object.defineProperties(Mem32.prototype, {
    lvalue: {
        get: function() {
            var v = valueof(this.addr);
            if(v !== this.addr) return Mem32(v);
        }
    },
    value: {
        get: function() {
            var v = valueof(this.addr), m = Mem.read(v, 32);
            if(m !== null && m !== void 0)
                return m;
            if(v !== this.addr) return Mem32(v);
        },
        set: function(v) {
            return Mem.write(this.addr, 32, v);
        }
    }
});
Mem32.prototype.inspect = function() {
    return '['+inspect(this.addr)+']32';
};

var Mem64 = Mem[64] = exports.Mem64 = function Mem64(addr) {
    if(!(this instanceof Mem64))
        return new Mem64(addr);
    this.addr = addr;
};
Mem64.prototype = new Unknown(64);
Mem64.prototype.constructor = Mem64;
Object.defineProperties(Mem64.prototype, {
    lvalue: {
        get: function() {
            var v = valueof(this.addr);
            if(v !== this.addr) return Mem64(v);
        }
    },
    value: {
        get: function() {
            var v = valueof(this.addr), m = Mem.read(v, 64);
            if(m !== null && m !== void 0)
                return m;
            if(v !== this.addr) return Mem64(v);
        },
        set: function(v) {
            return Mem.write(this.addr, 64, v);
        }
    }
});
Mem64.prototype.inspect = function() {
    return '['+inspect(this.addr)+']64';
};

var Mem128 = Mem[128] = exports.Mem128 = function Mem128(addr) {
    if(!(this instanceof Mem128))
        return new Mem128(addr);
    this.addr = addr;
};
Mem128.prototype = new Unknown(128);
Mem128.prototype.constructor = Mem128;
Object.defineProperties(Mem128.prototype, {
    lvalue: {
        get: function() {
            var v = valueof(this.addr);
            if(v !== this.addr) return Mem128(v);
        }
    },
    value: {
        get: function() {
            var v = valueof(this.addr), m = Mem.read(v, 128);
            if(m !== null && m !== void 0)
                return m;
            if(v !== this.addr) return Mem128(v);
        },
        set: function(v) {
            return Mem.write(this.addr, 128, v);
        }
    }
});
Mem128.prototype.inspect = function() {
    return '['+inspect(this.addr)+']128';
};

var Mem256 = Mem[256] = exports.Mem256 = function Mem256(addr) {
    if(!(this instanceof Mem256))
        return new Mem256(addr);
    this.addr = addr;
};
Mem256.prototype = new Unknown(256);
Mem256.prototype.constructor = Mem256;
Object.defineProperties(Mem256.prototype, {
    lvalue: {
        get: function() {
            var v = valueof(this.addr);
            if(v !== this.addr) return Mem256(v);
        }
    },
    value: {
        get: function() {
            var v = valueof(this.addr), m = Mem.read(v, 256);
            if(m !== null && m !== void 0)
                return m;
            if(v !== this.addr) return Mem256(v);
        },
        set: function(v) {
            return Mem.write(this.addr, 256, v);
        }
    }
});
Mem256.prototype.inspect = function() {
    return '['+inspect(this.addr)+']256';
};

var If = exports.If = function If(cond, then) {
    if(!(this instanceof If))
        return new If(cond, then);
    //if(cond.known && cond.bitsof <= 32) // HACK doesn't work > 32bits.
    //    return cond._A ? then : Nop(); // HACK Nop was null.
    this.cond = cond;
    this.then = then;
};
If.prototype = {
    constructor: If, fn: 'If',
    get value() {
        var cond = valueof(this.cond);
        if(cond !== this.cond)
            return new If(cond, this.then);
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

var R = exports.R = {}, R1 = [], R8 = [], R16 = [], R32 = [];
R.AL = R8[0] = /*u8(*/new Register8('AL');
R.AH = R8[4] = /*u8(*/new Register8('AH');
R.AX = R16[0] = /*u16(*/new Register16('AX');
R.EAX = R32[0] = /*u32(*/new Register32('EAX');
R.CL = R8[1] = /*u8(*/new Register8('CL');
R.CH = R8[5] = /*u8(*/new Register8('CH');
R.CX = R16[1] = /*u16(*/new Register16('CX');
R.ECX = R32[1] = /*u32(*/new Register32('ECX');
R.DL = R8[2] = /*u8(*/new Register8('DL');
R.DH = R8[6] = /*u8(*/new Register8('DH');
R.DX = R16[2] = /*u16(*/new Register16('DX');
R.EDX = R32[2] = /*u32(*/new Register32('EDX');
R.BL = R8[3] = /*u8(*/new Register8('BL');
R.BH = R8[7] = /*u8(*/new Register8('BH');
R.BX = R16[3] = /*u16(*/new Register16('BX');
R.EBX = R32[3] = /*u32(*/new Register32('EBX');
R.ES = R16[16] = /*u16(*/new Register16('ES');
R.CS = R16[17] = /*u16(*/new Register16('CS');
R.SS = R16[18] = /*u16(*/new Register16('SS');
R.DS = R16[19] = /*u16(*/new Register16('DS');
R.FS = R16[20] = /*u16(*/new Register16('FS');
R.SS = R16[21] = /*u16(*/new Register16('SS');
R.GS = R16[22] = /*u16(*/new Register16('GS');
R.SP = R16[4] = /*u16(*/new Register16('SP');
R.ESP = R32[4] = /*u32(*/new Register32('ESP');
R.BP = R16[5] = /*u16(*/new Register16('BP');
R.EBP = R32[5] = /*u32(*/new Register32('EBP');
R.SI = R16[6] = /*u16(*/new Register16('SI');
R.ESI = R32[6] = /*u32(*/new Register32('ESI');
R.DI = R16[7] = /*u16(*/new Register16('DI');
R.EDI = R32[7] = /*u32(*/new Register32('EDI');
R.IP = R16[8] = /*u16(*/new Register16('IP');
R.EIP = R32[8] = /*u32(*/new Register32('EIP');
R.EFLAGS = R32[32] = /*u32(*/new Register32('EFLAGS');
R.OF = R1[0] = /*u1(*/new Register1('OF');
R.CF = R1[1] = /*u1(*/new Register1('CF');
R.ZF = R1[2] = /*u1(*/new Register1('ZF');
R.SF = R1[3] = /*u1(*/new Register1('SF');
R.PF = R1[4] = /*u1(*/new Register1('PF');
R.VF = R1[5] = /*u1(*/new Register1('VF');
R.DF = R1[6] = /*u1(*/new Register1('DF');
R.IF = R1[7] = /*u1(*/new Register1('IF');
exports.dis = function x86dis(b, i) {
    // HACK allows skipping prefixes.
    var _pfxLength = 0, _pfxSizeSpecifier = false;
    for(; b[i] >= 0x64 && b[i] <= 0x67 || b[i] == 0xF0 || b[i] == 0xF2 || b[i] == 0xF3 || b[i] == 0x26 || b[i] == 0x2E || b[i] == 0x36 || b[i] == 0x3E; i++, _pfxLength++) {
        if(b[i] == 0x66)
            _pfxSizeSpecifier = true;
        else
            console.error('[PREFIX] '+b[i].toString(16).toUpperCase());
    }
    var $0, $1, $2;

    if((((((b[i] | ((b[i+1] << 8) >>> 0)) >>> 0) | ((((b[i+2] & 63) >>> 0) << 16) >>> 0)) >>> 0) & 0x3f47ff) == 0x250469)
    switch(((((b[i+1] & 128) & 0xff) >> 7) & 0xff) & 0x1) {
        case 0x0: return [((((_pfxLength) & 0xff) + 11) & 0xff), new Mov(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new Mem32(new u32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))).mul(new i32(new u32(((((b[i+7] | ((b[i+8] << 8) >>> 0)) >>> 0) | ((b[i+9] << 16) >>> 0)) >>> 0) | ((b[i+10] << 24) >>> 0)))))];
        case 0x1: return [((((_pfxLength) & 0xff) + 11) & 0xff), new Mov(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new Mem32(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))).mul(new i32(new u32(((((b[i+7] | ((b[i+8] << 8) >>> 0)) >>> 0) | ((b[i+9] << 16) >>> 0)) >>> 0) | ((b[i+10] << 24) >>> 0)))))];
    }

    if((((((b[i] | ((b[i+1] << 8) >>> 0)) >>> 0) | ((((b[i+2] & 63) >>> 0) << 16) >>> 0)) >>> 0) & 0x38c7ff) == 0x208469)
    switch(0) {
        case 0x0: return [((((_pfxLength) & 0xff) + 11) & 0xff), new Mov(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))).mul(new i32(new u32(((((b[i+7] | ((b[i+8] << 8) >>> 0)) >>> 0) | ((b[i+9] << 16) >>> 0)) >>> 0) | ((b[i+10] << 24) >>> 0)))))];
    }

    if((((((b[i] | ((b[i+1] << 8) >>> 0)) >>> 0) | ((((b[i+2] & 7) >>> 0) << 16) >>> 0)) >>> 0) & 0x747ff) == 0x50469)
    switch(((((b[i+1] & 128) & 0xff) >> 7) & 0xff) & 0x1) {
        case 0x0: return [((((_pfxLength) & 0xff) + 11) & 0xff), new Mov(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new Mem32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))).mul(new i32(new u32(((((b[i+7] | ((b[i+8] << 8) >>> 0)) >>> 0) | ((b[i+9] << 16) >>> 0)) >>> 0) | ((b[i+10] << 24) >>> 0)))))];
        case 0x1: return [((((_pfxLength) & 0xff) + 11) & 0xff), new Mov(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))))).mul(new i32(new u32(((((b[i+7] | ((b[i+8] << 8) >>> 0)) >>> 0) | ((b[i+9] << 16) >>> 0)) >>> 0) | ((b[i+10] << 24) >>> 0)))))];
    }

    if((((b[i] | ((b[i+1] << 8) & 0xffff)) & 0xffff) & 0xc7ff) == 0x8469)
    switch(0) {
        case 0x0: return [((((_pfxLength) & 0xff) + 11) & 0xff), new Mov(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))).mul(new i32(new u32(((((b[i+7] | ((b[i+8] << 8) >>> 0)) >>> 0) | ((b[i+9] << 16) >>> 0)) >>> 0) | ((b[i+10] << 24) >>> 0)))))];
    }

    if((((((b[i] | ((b[i+1] << 8) >>> 0)) >>> 0) | ((((b[i+2] & 63) >>> 0) << 16) >>> 0)) >>> 0) & 0x3f4789) == 0x250481)
    switch(((((((b[i] & 254) & 0xffff) >> 1) & 0xffff) | ((b[i+1] << 7) & 0xffff)) & 0xffff) & 0x5c3b) {
        case 0x0: return [((((_pfxLength) & 0xff) + 11) & 0xff), new Mov(($0 = new Mem32(new u32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), $0.add(new i32(new u32(((((b[i+7] | ((b[i+8] << 8) >>> 0)) >>> 0) | ((b[i+9] << 16) >>> 0)) >>> 0) | ((b[i+10] << 24) >>> 0)))))];
        case 0x4000: return [((((_pfxLength) & 0xff) + 11) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.add(new i32(new u32(((((b[i+7] | ((b[i+8] << 8) >>> 0)) >>> 0) | ((b[i+9] << 16) >>> 0)) >>> 0) | ((b[i+10] << 24) >>> 0)))))];
        case 0x400: return [((((_pfxLength) & 0xff) + 11) & 0xff), new Mov(($0 = new Mem32(new u32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), new u32(new u32(((((b[i+7] | ((b[i+8] << 8) >>> 0)) >>> 0) | ((b[i+9] << 16) >>> 0)) >>> 0) | ((b[i+10] << 24) >>> 0))).or($0))];
        case 0x4400: return [((((_pfxLength) & 0xff) + 11) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), new u32(new u32(((((b[i+7] | ((b[i+8] << 8) >>> 0)) >>> 0) | ((b[i+9] << 16) >>> 0)) >>> 0) | ((b[i+10] << 24) >>> 0))).or($0))];
        case 0x800: return [((((_pfxLength) & 0xff) + 11) & 0xff), new Mov(($0 = new Mem32(new u32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), $0.add(new i32(new u32(((((b[i+7] | ((b[i+8] << 8) >>> 0)) >>> 0) | ((b[i+9] << 16) >>> 0)) >>> 0) | ((b[i+10] << 24) >>> 0)))).add(R1[1]))];
        case 0x4800: return [((((_pfxLength) & 0xff) + 11) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.add(new i32(new u32(((((b[i+7] | ((b[i+8] << 8) >>> 0)) >>> 0) | ((b[i+9] << 16) >>> 0)) >>> 0) | ((b[i+10] << 24) >>> 0)))).add(R1[1]))];
        case 0xc00: return [((((_pfxLength) & 0xff) + 11) & 0xff), new Mov(($0 = new Mem32(new u32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), $0.add(new i32(-((((((((b[i+7] | ((b[i+8] << 8) >>> 0)) >>> 0) | ((b[i+9] << 16) >>> 0)) >>> 0) | ((b[i+10] << 24) >>> 0)) >>> 0)) >> 0))).add(new i32(R1[1]).neg()))];
        case 0x4c00: return [((((_pfxLength) & 0xff) + 11) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.add(new i32(-((((((((b[i+7] | ((b[i+8] << 8) >>> 0)) >>> 0) | ((b[i+9] << 16) >>> 0)) >>> 0) | ((b[i+10] << 24) >>> 0)) >>> 0)) >> 0))).add(new i32(R1[1]).neg()))];
        case 0x1000: return [((((_pfxLength) & 0xff) + 11) & 0xff), new Mov(($0 = new Mem32(new u32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), new u32(new u32(((((b[i+7] | ((b[i+8] << 8) >>> 0)) >>> 0) | ((b[i+9] << 16) >>> 0)) >>> 0) | ((b[i+10] << 24) >>> 0))).and($0))];
        case 0x5000: return [((((_pfxLength) & 0xff) + 11) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), new u32(new u32(((((b[i+7] | ((b[i+8] << 8) >>> 0)) >>> 0) | ((b[i+9] << 16) >>> 0)) >>> 0) | ((b[i+10] << 24) >>> 0))).and($0))];
        case 0x1400: return [((((_pfxLength) & 0xff) + 11) & 0xff), new Mov(R1[2], ($0 = new Mem32(new u32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))).eq(new i32(new u32(((((b[i+7] | ((b[i+8] << 8) >>> 0)) >>> 0) | ((b[i+9] << 16) >>> 0)) >>> 0) | ((b[i+10] << 24) >>> 0))))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add(new i32(-((((((((b[i+7] | ((b[i+8] << 8) >>> 0)) >>> 0) | ((b[i+9] << 16) >>> 0)) >>> 0) | ((b[i+10] << 24) >>> 0)) >>> 0)) >> 0))))];
        case 0x5400: return [((((_pfxLength) & 0xff) + 11) & 0xff), new Mov(R1[2], ($0 = new Mem32(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))).eq(new i32(new u32(((((b[i+7] | ((b[i+8] << 8) >>> 0)) >>> 0) | ((b[i+9] << 16) >>> 0)) >>> 0) | ((b[i+10] << 24) >>> 0))))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add(new i32(-((((((((b[i+7] | ((b[i+8] << 8) >>> 0)) >>> 0) | ((b[i+9] << 16) >>> 0)) >>> 0) | ((b[i+10] << 24) >>> 0)) >>> 0)) >> 0))))];
        case 0x1800: return [((((_pfxLength) & 0xff) + 11) & 0xff), new Mov(($0 = new Mem32(new u32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), $0.xor(new i32(new u32(((((b[i+7] | ((b[i+8] << 8) >>> 0)) >>> 0) | ((b[i+9] << 16) >>> 0)) >>> 0) | ((b[i+10] << 24) >>> 0)))))];
        case 0x5800: return [((((_pfxLength) & 0xff) + 11) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.xor(new i32(new u32(((((b[i+7] | ((b[i+8] << 8) >>> 0)) >>> 0) | ((b[i+9] << 16) >>> 0)) >>> 0) | ((b[i+10] << 24) >>> 0)))))];
        case 0x1c00: return [((((_pfxLength) & 0xff) + 11) & 0xff), new Mov(R1[2], new Mem32(new u32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))).eq(new i32(new u32(((((b[i+7] | ((b[i+8] << 8) >>> 0)) >>> 0) | ((b[i+9] << 16) >>> 0)) >>> 0) | ((b[i+10] << 24) >>> 0))))), new Mov(R1[1], new u1(0))];
        case 0x5c00: return [((((_pfxLength) & 0xff) + 11) & 0xff), new Mov(R1[2], new Mem32(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))).eq(new i32(new u32(((((b[i+7] | ((b[i+8] << 8) >>> 0)) >>> 0) | ((b[i+9] << 16) >>> 0)) >>> 0) | ((b[i+10] << 24) >>> 0))))), new Mov(R1[1], new u1(0))];
        case 0x23: return [((((_pfxLength) & 0xff) + 11) & 0xff), new Mov(new Mem32(new u32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))), new i32(new u32(((((b[i+7] | ((b[i+8] << 8) >>> 0)) >>> 0) | ((b[i+9] << 16) >>> 0)) >>> 0) | ((b[i+10] << 24) >>> 0))))];
        case 0x4023: return [((((_pfxLength) & 0xff) + 11) & 0xff), new Mov(new Mem32(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), new i32(new u32(((((b[i+7] | ((b[i+8] << 8) >>> 0)) >>> 0) | ((b[i+9] << 16) >>> 0)) >>> 0) | ((b[i+10] << 24) >>> 0))))];
        case 0x3b: return [((((_pfxLength) & 0xff) + 11) & 0xff), new Mov(R1[2], new Mem32(new u32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))).and(new i32(new u32(((((b[i+7] | ((b[i+8] << 8) >>> 0)) >>> 0) | ((b[i+9] << 16) >>> 0)) >>> 0) | ((b[i+10] << 24) >>> 0)))).eq(new i32(0))), new Mov(R1[1], new u1(0)), new Mov(R1[0], new u1(0))];
        case 0x403b: return [((((_pfxLength) & 0xff) + 11) & 0xff), new Mov(R1[2], new Mem32(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))).and(new i32(new u32(((((b[i+7] | ((b[i+8] << 8) >>> 0)) >>> 0) | ((b[i+9] << 16) >>> 0)) >>> 0) | ((b[i+10] << 24) >>> 0)))).eq(new i32(0))), new Mov(R1[1], new u1(0)), new Mov(R1[0], new u1(0))];
    }

    if((((((b[i] | ((b[i+1] << 8) >>> 0)) >>> 0) | ((((b[i+2] & 63) >>> 0) << 16) >>> 0)) >>> 0) & 0x38c789) == 0x208481)
    switch(((((((b[i] & 254) & 0xffff) >> 1) & 0xffff) | ((((b[i+1] & 63) & 0xffff) << 7) & 0xffff)) & 0xffff) & 0x1c3b) {
        case 0x0: return [((((_pfxLength) & 0xff) + 11) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.add(new i32(new u32(((((b[i+7] | ((b[i+8] << 8) >>> 0)) >>> 0) | ((b[i+9] << 16) >>> 0)) >>> 0) | ((b[i+10] << 24) >>> 0)))))];
        case 0x400: return [((((_pfxLength) & 0xff) + 11) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), new u32(new u32(((((b[i+7] | ((b[i+8] << 8) >>> 0)) >>> 0) | ((b[i+9] << 16) >>> 0)) >>> 0) | ((b[i+10] << 24) >>> 0))).or($0))];
        case 0x800: return [((((_pfxLength) & 0xff) + 11) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.add(new i32(new u32(((((b[i+7] | ((b[i+8] << 8) >>> 0)) >>> 0) | ((b[i+9] << 16) >>> 0)) >>> 0) | ((b[i+10] << 24) >>> 0)))).add(R1[1]))];
        case 0xc00: return [((((_pfxLength) & 0xff) + 11) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.add(new i32(-((((((((b[i+7] | ((b[i+8] << 8) >>> 0)) >>> 0) | ((b[i+9] << 16) >>> 0)) >>> 0) | ((b[i+10] << 24) >>> 0)) >>> 0)) >> 0))).add(new i32(R1[1]).neg()))];
        case 0x1000: return [((((_pfxLength) & 0xff) + 11) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), new u32(new u32(((((b[i+7] | ((b[i+8] << 8) >>> 0)) >>> 0) | ((b[i+9] << 16) >>> 0)) >>> 0) | ((b[i+10] << 24) >>> 0))).and($0))];
        case 0x1400: return [((((_pfxLength) & 0xff) + 11) & 0xff), new Mov(R1[2], ($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))).eq(new i32(new u32(((((b[i+7] | ((b[i+8] << 8) >>> 0)) >>> 0) | ((b[i+9] << 16) >>> 0)) >>> 0) | ((b[i+10] << 24) >>> 0))))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add(new i32(-((((((((b[i+7] | ((b[i+8] << 8) >>> 0)) >>> 0) | ((b[i+9] << 16) >>> 0)) >>> 0) | ((b[i+10] << 24) >>> 0)) >>> 0)) >> 0))))];
        case 0x1800: return [((((_pfxLength) & 0xff) + 11) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.xor(new i32(new u32(((((b[i+7] | ((b[i+8] << 8) >>> 0)) >>> 0) | ((b[i+9] << 16) >>> 0)) >>> 0) | ((b[i+10] << 24) >>> 0)))))];
        case 0x1c00: return [((((_pfxLength) & 0xff) + 11) & 0xff), new Mov(R1[2], new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))).eq(new i32(new u32(((((b[i+7] | ((b[i+8] << 8) >>> 0)) >>> 0) | ((b[i+9] << 16) >>> 0)) >>> 0) | ((b[i+10] << 24) >>> 0))))), new Mov(R1[1], new u1(0))];
        case 0x23: return [((((_pfxLength) & 0xff) + 11) & 0xff), new Mov(new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), new i32(new u32(((((b[i+7] | ((b[i+8] << 8) >>> 0)) >>> 0) | ((b[i+9] << 16) >>> 0)) >>> 0) | ((b[i+10] << 24) >>> 0))))];
        case 0x3b: return [((((_pfxLength) & 0xff) + 11) & 0xff), new Mov(R1[2], new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))).and(new i32(new u32(((((b[i+7] | ((b[i+8] << 8) >>> 0)) >>> 0) | ((b[i+9] << 16) >>> 0)) >>> 0) | ((b[i+10] << 24) >>> 0)))).eq(new i32(0))), new Mov(R1[1], new u1(0)), new Mov(R1[0], new u1(0))];
    }

    if((((((b[i] | ((b[i+1] << 8) >>> 0)) >>> 0) | ((((b[i+2] & 7) >>> 0) << 16) >>> 0)) >>> 0) & 0x74789) == 0x50481)
    switch(((((((b[i] & 254) & 0xffff) >> 1) & 0xffff) | ((b[i+1] << 7) & 0xffff)) & 0xffff) & 0x5c3b) {
        case 0x0: return [((((_pfxLength) & 0xff) + 11) & 0xff), new Mov(($0 = new Mem32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.add(new i32(new u32(((((b[i+7] | ((b[i+8] << 8) >>> 0)) >>> 0) | ((b[i+9] << 16) >>> 0)) >>> 0) | ((b[i+10] << 24) >>> 0)))))];
        case 0x4000: return [((((_pfxLength) & 0xff) + 11) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))), $0.add(new i32(new u32(((((b[i+7] | ((b[i+8] << 8) >>> 0)) >>> 0) | ((b[i+9] << 16) >>> 0)) >>> 0) | ((b[i+10] << 24) >>> 0)))))];
        case 0x400: return [((((_pfxLength) & 0xff) + 11) & 0xff), new Mov(($0 = new Mem32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), new u32(new u32(((((b[i+7] | ((b[i+8] << 8) >>> 0)) >>> 0) | ((b[i+9] << 16) >>> 0)) >>> 0) | ((b[i+10] << 24) >>> 0))).or($0))];
        case 0x4400: return [((((_pfxLength) & 0xff) + 11) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))), new u32(new u32(((((b[i+7] | ((b[i+8] << 8) >>> 0)) >>> 0) | ((b[i+9] << 16) >>> 0)) >>> 0) | ((b[i+10] << 24) >>> 0))).or($0))];
        case 0x800: return [((((_pfxLength) & 0xff) + 11) & 0xff), new Mov(($0 = new Mem32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.add(new i32(new u32(((((b[i+7] | ((b[i+8] << 8) >>> 0)) >>> 0) | ((b[i+9] << 16) >>> 0)) >>> 0) | ((b[i+10] << 24) >>> 0)))).add(R1[1]))];
        case 0x4800: return [((((_pfxLength) & 0xff) + 11) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))), $0.add(new i32(new u32(((((b[i+7] | ((b[i+8] << 8) >>> 0)) >>> 0) | ((b[i+9] << 16) >>> 0)) >>> 0) | ((b[i+10] << 24) >>> 0)))).add(R1[1]))];
        case 0xc00: return [((((_pfxLength) & 0xff) + 11) & 0xff), new Mov(($0 = new Mem32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.add(new i32(-((((((((b[i+7] | ((b[i+8] << 8) >>> 0)) >>> 0) | ((b[i+9] << 16) >>> 0)) >>> 0) | ((b[i+10] << 24) >>> 0)) >>> 0)) >> 0))).add(new i32(R1[1]).neg()))];
        case 0x4c00: return [((((_pfxLength) & 0xff) + 11) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))), $0.add(new i32(-((((((((b[i+7] | ((b[i+8] << 8) >>> 0)) >>> 0) | ((b[i+9] << 16) >>> 0)) >>> 0) | ((b[i+10] << 24) >>> 0)) >>> 0)) >> 0))).add(new i32(R1[1]).neg()))];
        case 0x1000: return [((((_pfxLength) & 0xff) + 11) & 0xff), new Mov(($0 = new Mem32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), new u32(new u32(((((b[i+7] | ((b[i+8] << 8) >>> 0)) >>> 0) | ((b[i+9] << 16) >>> 0)) >>> 0) | ((b[i+10] << 24) >>> 0))).and($0))];
        case 0x5000: return [((((_pfxLength) & 0xff) + 11) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))), new u32(new u32(((((b[i+7] | ((b[i+8] << 8) >>> 0)) >>> 0) | ((b[i+9] << 16) >>> 0)) >>> 0) | ((b[i+10] << 24) >>> 0))).and($0))];
        case 0x1400: return [((((_pfxLength) & 0xff) + 11) & 0xff), new Mov(R1[2], ($0 = new Mem32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))).eq(new i32(new u32(((((b[i+7] | ((b[i+8] << 8) >>> 0)) >>> 0) | ((b[i+9] << 16) >>> 0)) >>> 0) | ((b[i+10] << 24) >>> 0))))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add(new i32(-((((((((b[i+7] | ((b[i+8] << 8) >>> 0)) >>> 0) | ((b[i+9] << 16) >>> 0)) >>> 0) | ((b[i+10] << 24) >>> 0)) >>> 0)) >> 0))))];
        case 0x5400: return [((((_pfxLength) & 0xff) + 11) & 0xff), new Mov(R1[2], ($0 = new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))).eq(new i32(new u32(((((b[i+7] | ((b[i+8] << 8) >>> 0)) >>> 0) | ((b[i+9] << 16) >>> 0)) >>> 0) | ((b[i+10] << 24) >>> 0))))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add(new i32(-((((((((b[i+7] | ((b[i+8] << 8) >>> 0)) >>> 0) | ((b[i+9] << 16) >>> 0)) >>> 0) | ((b[i+10] << 24) >>> 0)) >>> 0)) >> 0))))];
        case 0x1800: return [((((_pfxLength) & 0xff) + 11) & 0xff), new Mov(($0 = new Mem32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.xor(new i32(new u32(((((b[i+7] | ((b[i+8] << 8) >>> 0)) >>> 0) | ((b[i+9] << 16) >>> 0)) >>> 0) | ((b[i+10] << 24) >>> 0)))))];
        case 0x5800: return [((((_pfxLength) & 0xff) + 11) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))), $0.xor(new i32(new u32(((((b[i+7] | ((b[i+8] << 8) >>> 0)) >>> 0) | ((b[i+9] << 16) >>> 0)) >>> 0) | ((b[i+10] << 24) >>> 0)))))];
        case 0x1c00: return [((((_pfxLength) & 0xff) + 11) & 0xff), new Mov(R1[2], new Mem32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))).eq(new i32(new u32(((((b[i+7] | ((b[i+8] << 8) >>> 0)) >>> 0) | ((b[i+9] << 16) >>> 0)) >>> 0) | ((b[i+10] << 24) >>> 0))))), new Mov(R1[1], new u1(0))];
        case 0x5c00: return [((((_pfxLength) & 0xff) + 11) & 0xff), new Mov(R1[2], new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))))).eq(new i32(new u32(((((b[i+7] | ((b[i+8] << 8) >>> 0)) >>> 0) | ((b[i+9] << 16) >>> 0)) >>> 0) | ((b[i+10] << 24) >>> 0))))), new Mov(R1[1], new u1(0))];
        case 0x23: return [((((_pfxLength) & 0xff) + 11) & 0xff), new Mov(new Mem32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), new i32(new u32(((((b[i+7] | ((b[i+8] << 8) >>> 0)) >>> 0) | ((b[i+9] << 16) >>> 0)) >>> 0) | ((b[i+10] << 24) >>> 0))))];
        case 0x4023: return [((((_pfxLength) & 0xff) + 11) & 0xff), new Mov(new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))))), new i32(new u32(((((b[i+7] | ((b[i+8] << 8) >>> 0)) >>> 0) | ((b[i+9] << 16) >>> 0)) >>> 0) | ((b[i+10] << 24) >>> 0))))];
        case 0x3b: return [((((_pfxLength) & 0xff) + 11) & 0xff), new Mov(R1[2], new Mem32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))).and(new i32(new u32(((((b[i+7] | ((b[i+8] << 8) >>> 0)) >>> 0) | ((b[i+9] << 16) >>> 0)) >>> 0) | ((b[i+10] << 24) >>> 0)))).eq(new i32(0))), new Mov(R1[1], new u1(0)), new Mov(R1[0], new u1(0))];
        case 0x403b: return [((((_pfxLength) & 0xff) + 11) & 0xff), new Mov(R1[2], new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))))).and(new i32(new u32(((((b[i+7] | ((b[i+8] << 8) >>> 0)) >>> 0) | ((b[i+9] << 16) >>> 0)) >>> 0) | ((b[i+10] << 24) >>> 0)))).eq(new i32(0))), new Mov(R1[1], new u1(0)), new Mov(R1[0], new u1(0))];
    }

    if((((b[i] | ((b[i+1] << 8) & 0xffff)) & 0xffff) & 0xc789) == 0x8481)
    switch(((((((b[i] & 254) & 0xffff) >> 1) & 0xffff) | ((((b[i+1] & 63) & 0xffff) << 7) & 0xffff)) & 0xffff) & 0x1c3b) {
        case 0x0: return [((((_pfxLength) & 0xff) + 11) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.add(new i32(new u32(((((b[i+7] | ((b[i+8] << 8) >>> 0)) >>> 0) | ((b[i+9] << 16) >>> 0)) >>> 0) | ((b[i+10] << 24) >>> 0)))))];
        case 0x400: return [((((_pfxLength) & 0xff) + 11) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), new u32(new u32(((((b[i+7] | ((b[i+8] << 8) >>> 0)) >>> 0) | ((b[i+9] << 16) >>> 0)) >>> 0) | ((b[i+10] << 24) >>> 0))).or($0))];
        case 0x800: return [((((_pfxLength) & 0xff) + 11) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.add(new i32(new u32(((((b[i+7] | ((b[i+8] << 8) >>> 0)) >>> 0) | ((b[i+9] << 16) >>> 0)) >>> 0) | ((b[i+10] << 24) >>> 0)))).add(R1[1]))];
        case 0xc00: return [((((_pfxLength) & 0xff) + 11) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.add(new i32(-((((((((b[i+7] | ((b[i+8] << 8) >>> 0)) >>> 0) | ((b[i+9] << 16) >>> 0)) >>> 0) | ((b[i+10] << 24) >>> 0)) >>> 0)) >> 0))).add(new i32(R1[1]).neg()))];
        case 0x1000: return [((((_pfxLength) & 0xff) + 11) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), new u32(new u32(((((b[i+7] | ((b[i+8] << 8) >>> 0)) >>> 0) | ((b[i+9] << 16) >>> 0)) >>> 0) | ((b[i+10] << 24) >>> 0))).and($0))];
        case 0x1400: return [((((_pfxLength) & 0xff) + 11) & 0xff), new Mov(R1[2], ($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))).eq(new i32(new u32(((((b[i+7] | ((b[i+8] << 8) >>> 0)) >>> 0) | ((b[i+9] << 16) >>> 0)) >>> 0) | ((b[i+10] << 24) >>> 0))))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add(new i32(-((((((((b[i+7] | ((b[i+8] << 8) >>> 0)) >>> 0) | ((b[i+9] << 16) >>> 0)) >>> 0) | ((b[i+10] << 24) >>> 0)) >>> 0)) >> 0))))];
        case 0x1800: return [((((_pfxLength) & 0xff) + 11) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.xor(new i32(new u32(((((b[i+7] | ((b[i+8] << 8) >>> 0)) >>> 0) | ((b[i+9] << 16) >>> 0)) >>> 0) | ((b[i+10] << 24) >>> 0)))))];
        case 0x1c00: return [((((_pfxLength) & 0xff) + 11) & 0xff), new Mov(R1[2], new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))).eq(new i32(new u32(((((b[i+7] | ((b[i+8] << 8) >>> 0)) >>> 0) | ((b[i+9] << 16) >>> 0)) >>> 0) | ((b[i+10] << 24) >>> 0))))), new Mov(R1[1], new u1(0))];
        case 0x23: return [((((_pfxLength) & 0xff) + 11) & 0xff), new Mov(new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), new i32(new u32(((((b[i+7] | ((b[i+8] << 8) >>> 0)) >>> 0) | ((b[i+9] << 16) >>> 0)) >>> 0) | ((b[i+10] << 24) >>> 0))))];
        case 0x3b: return [((((_pfxLength) & 0xff) + 11) & 0xff), new Mov(R1[2], new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))).and(new i32(new u32(((((b[i+7] | ((b[i+8] << 8) >>> 0)) >>> 0) | ((b[i+9] << 16) >>> 0)) >>> 0) | ((b[i+10] << 24) >>> 0)))).eq(new i32(0))), new Mov(R1[1], new u1(0)), new Mov(R1[0], new u1(0))];
    }

    if((((b[i] | ((b[i+1] << 8) & 0xffff)) & 0xffff) & 0xc7ff) == 0x569)
    switch(0) {
        case 0x0: return [((((_pfxLength) & 0xff) + 10) & 0xff), new Mov(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new Mem32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0))).mul(new i32(new u32(((((b[i+6] | ((b[i+7] << 8) >>> 0)) >>> 0) | ((b[i+8] << 16) >>> 0)) >>> 0) | ((b[i+9] << 24) >>> 0)))))];
    }

    if((((b[i] | ((b[i+1] << 8) & 0xffff)) & 0xffff) & 0xc789) == 0x581)
    switch(((((((b[i] & 254) & 0xffff) >> 1) & 0xffff) | ((((b[i+1] & 63) & 0xffff) << 7) & 0xffff)) & 0xffff) & 0x1c3b) {
        case 0x0: return [((((_pfxLength) & 0xff) + 10) & 0xff), new Mov(($0 = new Mem32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))), $0.add(new i32(new u32(((((b[i+6] | ((b[i+7] << 8) >>> 0)) >>> 0) | ((b[i+8] << 16) >>> 0)) >>> 0) | ((b[i+9] << 24) >>> 0)))))];
        case 0x400: return [((((_pfxLength) & 0xff) + 10) & 0xff), new Mov(($0 = new Mem32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))), new u32(new u32(((((b[i+6] | ((b[i+7] << 8) >>> 0)) >>> 0) | ((b[i+8] << 16) >>> 0)) >>> 0) | ((b[i+9] << 24) >>> 0))).or($0))];
        case 0x800: return [((((_pfxLength) & 0xff) + 10) & 0xff), new Mov(($0 = new Mem32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))), $0.add(new i32(new u32(((((b[i+6] | ((b[i+7] << 8) >>> 0)) >>> 0) | ((b[i+8] << 16) >>> 0)) >>> 0) | ((b[i+9] << 24) >>> 0)))).add(R1[1]))];
        case 0xc00: return [((((_pfxLength) & 0xff) + 10) & 0xff), new Mov(($0 = new Mem32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))), $0.add(new i32(-((((((((b[i+6] | ((b[i+7] << 8) >>> 0)) >>> 0) | ((b[i+8] << 16) >>> 0)) >>> 0) | ((b[i+9] << 24) >>> 0)) >>> 0)) >> 0))).add(new i32(R1[1]).neg()))];
        case 0x1000: return [((((_pfxLength) & 0xff) + 10) & 0xff), new Mov(($0 = new Mem32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))), new u32(new u32(((((b[i+6] | ((b[i+7] << 8) >>> 0)) >>> 0) | ((b[i+8] << 16) >>> 0)) >>> 0) | ((b[i+9] << 24) >>> 0))).and($0))];
        case 0x1400: return [((((_pfxLength) & 0xff) + 10) & 0xff), new Mov(R1[2], ($0 = new Mem32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))).eq(new i32(new u32(((((b[i+6] | ((b[i+7] << 8) >>> 0)) >>> 0) | ((b[i+8] << 16) >>> 0)) >>> 0) | ((b[i+9] << 24) >>> 0))))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add(new i32(-((((((((b[i+6] | ((b[i+7] << 8) >>> 0)) >>> 0) | ((b[i+8] << 16) >>> 0)) >>> 0) | ((b[i+9] << 24) >>> 0)) >>> 0)) >> 0))))];
        case 0x1800: return [((((_pfxLength) & 0xff) + 10) & 0xff), new Mov(($0 = new Mem32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))), $0.xor(new i32(new u32(((((b[i+6] | ((b[i+7] << 8) >>> 0)) >>> 0) | ((b[i+8] << 16) >>> 0)) >>> 0) | ((b[i+9] << 24) >>> 0)))))];
        case 0x1c00: return [((((_pfxLength) & 0xff) + 10) & 0xff), new Mov(R1[2], new Mem32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0))).eq(new i32(new u32(((((b[i+6] | ((b[i+7] << 8) >>> 0)) >>> 0) | ((b[i+8] << 16) >>> 0)) >>> 0) | ((b[i+9] << 24) >>> 0))))), new Mov(R1[1], new u1(0))];
        case 0x23: return [((((_pfxLength) & 0xff) + 10) & 0xff), new Mov(new Mem32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0))), new i32(new u32(((((b[i+6] | ((b[i+7] << 8) >>> 0)) >>> 0) | ((b[i+8] << 16) >>> 0)) >>> 0) | ((b[i+9] << 24) >>> 0))))];
        case 0x3b: return [((((_pfxLength) & 0xff) + 10) & 0xff), new Mov(R1[2], new Mem32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0))).and(new i32(new u32(((((b[i+6] | ((b[i+7] << 8) >>> 0)) >>> 0) | ((b[i+8] << 16) >>> 0)) >>> 0) | ((b[i+9] << 24) >>> 0)))).eq(new i32(0))), new Mov(R1[1], new u1(0)), new Mov(R1[0], new u1(0))];
    }

    if((((b[i] | ((b[i+1] << 8) & 0xffff)) & 0xffff) & 0xc0ff) == 0x8069)
    switch(0) {
        case 0x0: return [((((_pfxLength) & 0xff) + 10) & 0xff), new Mov(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0))))).mul(new i32(new u32(((((b[i+6] | ((b[i+7] << 8) >>> 0)) >>> 0) | ((b[i+8] << 16) >>> 0)) >>> 0) | ((b[i+9] << 24) >>> 0)))))];
    }

    if((((b[i] | ((b[i+1] << 8) & 0xffff)) & 0xffff) & 0xc089) == 0x8081)
    switch(((((((b[i] & 254) & 0xffff) >> 1) & 0xffff) | ((((b[i+1] & 63) & 0xffff) << 7) & 0xffff)) & 0xffff) & 0x1c3b) {
        case 0x0: return [((((_pfxLength) & 0xff) + 10) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))), $0.add(new i32(new u32(((((b[i+6] | ((b[i+7] << 8) >>> 0)) >>> 0) | ((b[i+8] << 16) >>> 0)) >>> 0) | ((b[i+9] << 24) >>> 0)))))];
        case 0x400: return [((((_pfxLength) & 0xff) + 10) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))), new u32(new u32(((((b[i+6] | ((b[i+7] << 8) >>> 0)) >>> 0) | ((b[i+8] << 16) >>> 0)) >>> 0) | ((b[i+9] << 24) >>> 0))).or($0))];
        case 0x800: return [((((_pfxLength) & 0xff) + 10) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))), $0.add(new i32(new u32(((((b[i+6] | ((b[i+7] << 8) >>> 0)) >>> 0) | ((b[i+8] << 16) >>> 0)) >>> 0) | ((b[i+9] << 24) >>> 0)))).add(R1[1]))];
        case 0xc00: return [((((_pfxLength) & 0xff) + 10) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))), $0.add(new i32(-((((((((b[i+6] | ((b[i+7] << 8) >>> 0)) >>> 0) | ((b[i+8] << 16) >>> 0)) >>> 0) | ((b[i+9] << 24) >>> 0)) >>> 0)) >> 0))).add(new i32(R1[1]).neg()))];
        case 0x1000: return [((((_pfxLength) & 0xff) + 10) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))), new u32(new u32(((((b[i+6] | ((b[i+7] << 8) >>> 0)) >>> 0) | ((b[i+8] << 16) >>> 0)) >>> 0) | ((b[i+9] << 24) >>> 0))).and($0))];
        case 0x1400: return [((((_pfxLength) & 0xff) + 10) & 0xff), new Mov(R1[2], ($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))).eq(new i32(new u32(((((b[i+6] | ((b[i+7] << 8) >>> 0)) >>> 0) | ((b[i+8] << 16) >>> 0)) >>> 0) | ((b[i+9] << 24) >>> 0))))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add(new i32(-((((((((b[i+6] | ((b[i+7] << 8) >>> 0)) >>> 0) | ((b[i+8] << 16) >>> 0)) >>> 0) | ((b[i+9] << 24) >>> 0)) >>> 0)) >> 0))))];
        case 0x1800: return [((((_pfxLength) & 0xff) + 10) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))), $0.xor(new i32(new u32(((((b[i+6] | ((b[i+7] << 8) >>> 0)) >>> 0) | ((b[i+8] << 16) >>> 0)) >>> 0) | ((b[i+9] << 24) >>> 0)))))];
        case 0x1c00: return [((((_pfxLength) & 0xff) + 10) & 0xff), new Mov(R1[2], new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0))))).eq(new i32(new u32(((((b[i+6] | ((b[i+7] << 8) >>> 0)) >>> 0) | ((b[i+8] << 16) >>> 0)) >>> 0) | ((b[i+9] << 24) >>> 0))))), new Mov(R1[1], new u1(0))];
        case 0x23: return [((((_pfxLength) & 0xff) + 10) & 0xff), new Mov(new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0))))), new i32(new u32(((((b[i+6] | ((b[i+7] << 8) >>> 0)) >>> 0) | ((b[i+8] << 16) >>> 0)) >>> 0) | ((b[i+9] << 24) >>> 0))))];
        case 0x3b: return [((((_pfxLength) & 0xff) + 10) & 0xff), new Mov(R1[2], new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0))))).and(new i32(new u32(((((b[i+6] | ((b[i+7] << 8) >>> 0)) >>> 0) | ((b[i+8] << 16) >>> 0)) >>> 0) | ((b[i+9] << 24) >>> 0)))).eq(new i32(0))), new Mov(R1[1], new u1(0)), new Mov(R1[0], new u1(0))];
    }

    if((((((((b[i] | ((b[i+1] << 8) >>> 0)) >>> 0) | ((b[i+2] << 16) >>> 0)) >>> 0) | ((((b[i+3] & 63) >>> 0) << 24) >>> 0)) >>> 0) & 0x3f47f7ff) == 0x2504a40f)
    switch(((((((b[i+1] & 248) & 0xffff) >> 3) & 0xffff) | ((b[i+2] << 5) & 0xffff)) & 0xffff) & 0x1001) {
        case 0x0: return [((((_pfxLength) & 0xff) + 9) & 0xff), new Mov(($0 = new Mem32(new u32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))), $0.shl(new i8(new u8(b[i+8]))).or(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shr(new u8(((((-((b[i+8]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 32))))];
        case 0x1000: return [((((_pfxLength) & 0xff) + 9) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0)))))), $0.shl(new i8(new u8(b[i+8]))).or(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shr(new u8(((((-((b[i+8]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 32))))];
        case 0x1: return [((((_pfxLength) & 0xff) + 9) & 0xff), new Mov(($0 = new Mem32(new u32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))), new u32(((((1 << (((b[i+8]) << 24 >> 24) & 0x1f)) >>> 0) + -1) >>> 0) << (((((((-((b[i+8]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 32) & 0xff) & 0x1f)).and(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).or($0.shr(new i8(new u8(b[i+8])))))];
        case 0x1001: return [((((_pfxLength) & 0xff) + 9) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0)))))), new u32(((((1 << (((b[i+8]) << 24 >> 24) & 0x1f)) >>> 0) + -1) >>> 0) << (((((((-((b[i+8]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 32) & 0xff) & 0x1f)).and(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).or($0.shr(new i8(new u8(b[i+8])))))];
    }

    if((((((((b[i] | ((b[i+1] << 8) >>> 0)) >>> 0) | ((b[i+2] << 16) >>> 0)) >>> 0) | ((((b[i+3] & 63) >>> 0) << 24) >>> 0)) >>> 0) & 0x38c7f7ff) == 0x2084a40f)
    switch(((((b[i+1] & 8) & 0xff) >> 3) & 0xff) & 0x1) {
        case 0x0: return [((((_pfxLength) & 0xff) + 9) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0)))))), $0.shl(new i8(new u8(b[i+8]))).or(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shr(new u8(((((-((b[i+8]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 32))))];
        case 0x1: return [((((_pfxLength) & 0xff) + 9) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0)))))), new u32(((((1 << (((b[i+8]) << 24 >> 24) & 0x1f)) >>> 0) + -1) >>> 0) << (((((((-((b[i+8]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 32) & 0xff) & 0x1f)).and(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).or($0.shr(new i8(new u8(b[i+8])))))];
    }

    if((((((((b[i] | ((b[i+1] << 8) >>> 0)) >>> 0) | ((b[i+2] << 16) >>> 0)) >>> 0) | ((((b[i+3] & 7) >>> 0) << 24) >>> 0)) >>> 0) & 0x747f7ff) == 0x504a40f)
    switch(((((((b[i+1] & 248) & 0xffff) >> 3) & 0xffff) | ((b[i+2] << 5) & 0xffff)) & 0xffff) & 0x1001) {
        case 0x0: return [((((_pfxLength) & 0xff) + 9) & 0xff), new Mov(($0 = new Mem32(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0)))))), $0.shl(new i8(new u8(b[i+8]))).or(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shr(new u8(((((-((b[i+8]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 32))))];
        case 0x1000: return [((((_pfxLength) & 0xff) + 9) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0)))))))), $0.shl(new i8(new u8(b[i+8]))).or(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shr(new u8(((((-((b[i+8]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 32))))];
        case 0x1: return [((((_pfxLength) & 0xff) + 9) & 0xff), new Mov(($0 = new Mem32(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0)))))), new u32(((((1 << (((b[i+8]) << 24 >> 24) & 0x1f)) >>> 0) + -1) >>> 0) << (((((((-((b[i+8]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 32) & 0xff) & 0x1f)).and(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).or($0.shr(new i8(new u8(b[i+8])))))];
        case 0x1001: return [((((_pfxLength) & 0xff) + 9) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0)))))))), new u32(((((1 << (((b[i+8]) << 24 >> 24) & 0x1f)) >>> 0) + -1) >>> 0) << (((((((-((b[i+8]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 32) & 0xff) & 0x1f)).and(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).or($0.shr(new i8(new u8(b[i+8])))))];
    }

    if((((((b[i] | ((b[i+1] << 8) >>> 0)) >>> 0) | ((b[i+2] << 16) >>> 0)) >>> 0) & 0xc7f7ff) == 0x84a40f)
    switch(((((b[i+1] & 8) & 0xff) >> 3) & 0xff) & 0x1) {
        case 0x0: return [((((_pfxLength) & 0xff) + 9) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0)))))), $0.shl(new i8(new u8(b[i+8]))).or(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shr(new u8(((((-((b[i+8]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 32))))];
        case 0x1: return [((((_pfxLength) & 0xff) + 9) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0)))))), new u32(((((1 << (((b[i+8]) << 24 >> 24) & 0x1f)) >>> 0) + -1) >>> 0) << (((((((-((b[i+8]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 32) & 0xff) & 0x1f)).and(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).or($0.shr(new i8(new u8(b[i+8])))))];
    }

    if((((((((b[i] | ((b[i+1] << 8) >>> 0)) >>> 0) | ((b[i+2] << 16) >>> 0)) >>> 0) | ((((b[i+3] & 63) >>> 0) << 24) >>> 0)) >>> 0) & 0x3f47c0ff) == 0x2504800f)
    switch(((b[i+1] | ((b[i+2] << 8) & 0xffff)) & 0xffff) & 0x803f) {
        case 0x10: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(new Mem8(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0)))), R1[0])];
        case 0x8010: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(new Mem8(R32[5].add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))), R1[0])];
        case 0x11: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(new Mem8(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0)))), R1[0].not())];
        case 0x8011: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(new Mem8(R32[5].add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))), R1[0].not())];
        case 0x12: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(new Mem8(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0)))), R1[1])];
        case 0x8012: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(new Mem8(R32[5].add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))), R1[1])];
        case 0x13: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(new Mem8(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0)))), R1[1].not())];
        case 0x8013: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(new Mem8(R32[5].add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))), R1[1].not())];
        case 0x14: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(new Mem8(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0)))), R1[2])];
        case 0x8014: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(new Mem8(R32[5].add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))), R1[2])];
        case 0x15: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(new Mem8(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0)))), R1[2].not())];
        case 0x8015: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(new Mem8(R32[5].add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))), R1[2].not())];
        case 0x16: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(new Mem8(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0)))), R1[1].or(R1[2]))];
        case 0x8016: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(new Mem8(R32[5].add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))), R1[1].or(R1[2]))];
        case 0x17: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(new Mem8(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0)))), R1[1].not().and(R1[2].not()))];
        case 0x8017: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(new Mem8(R32[5].add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))), R1[1].not().and(R1[2].not()))];
        case 0x18: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(new Mem8(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0)))), R1[3])];
        case 0x8018: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(new Mem8(R32[5].add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))), R1[3])];
        case 0x19: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(new Mem8(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0)))), R1[3].not())];
        case 0x8019: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(new Mem8(R32[5].add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))), R1[3].not())];
        case 0x1a: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(new Mem8(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0)))), R1[4])];
        case 0x801a: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(new Mem8(R32[5].add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))), R1[4])];
        case 0x1b: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(new Mem8(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0)))), R1[4].not())];
        case 0x801b: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(new Mem8(R32[5].add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))), R1[4].not())];
        case 0x1c: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(new Mem8(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0)))), R1[0].eq(R1[3]).not())];
        case 0x801c: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(new Mem8(R32[5].add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))), R1[0].eq(R1[3]).not())];
        case 0x1d: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(new Mem8(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0)))), R1[0].eq(R1[3]))];
        case 0x801d: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(new Mem8(R32[5].add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))), R1[0].eq(R1[3]))];
        case 0x1e: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(new Mem8(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0)))), R1[0].eq(R1[3]).not().or(R1[2]))];
        case 0x801e: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(new Mem8(R32[5].add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))), R1[0].eq(R1[3]).not().or(R1[2]))];
        case 0x1f: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(new Mem8(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0)))), R1[0].eq(R1[3]).and(R1[2].not()))];
        case 0x801f: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(new Mem8(R32[5].add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))), R1[0].eq(R1[3]).and(R1[2].not()))];
        case 0x23: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(R1[1], new u32(1).shl(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).and(new Mem32(new u32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))).eq(new u8(0)).not())];
        case 0x8023: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(R1[1], new u32(1).shl(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).and(new Mem32(R32[5].add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0)))))).eq(new u8(0)).not())];
        case 0x25: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem32(new u32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))), $0.shl(($1 = R8[1])).or(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shr(new u8($1.neg()).add(new u8(32)))))];
        case 0x8025: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0)))))), $0.shl(($1 = R8[1])).or(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shr(new u8($1.neg()).add(new u8(32)))))];
        case 0x2b: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(R1[1], new u32(1).shl(($1 = R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])).and(($0 = new Mem32(new u32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0)))))).eq(new u8(0)).not()), new Mov($0, new u32(1).shl($1).or($0))];
        case 0x802b: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(R1[1], new u32(1).shl(($1 = R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])).and(($0 = new Mem32(R32[5].add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))))).eq(new u8(0)).not()), new Mov($0, new u32(1).shl($1).or($0))];
        case 0x2d: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($1 = new Mem32(new u32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))), new u32(1).shl(($0 = R8[1])).add(new i32(-1)).shl(new u8($0.neg()).add(new u8(32))).and(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).or($1.shr($0)))];
        case 0x802d: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($1 = new Mem32(R32[5].add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0)))))), new u32(1).shl(($0 = R8[1])).add(new i32(-1)).shl(new u8($0.neg()).add(new u8(32))).and(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).or($1.shr($0)))];
        case 0x2f: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])), $0.mul(new i32(new Mem32(new u32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0)))))))];
        case 0x802f: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])), $0.mul(new i32(new Mem32(R32[5].add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))))))];
        case 0x36: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new Mem8(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0)))))];
        case 0x8036: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new Mem8(R32[5].add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))))];
        case 0x37: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new Mem16(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0)))))];
        case 0x8037: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new Mem16(R32[5].add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))))];
        case 0x3e: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new i32(new Mem8(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))))];
        case 0x803e: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new i32(new Mem8(R32[5].add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0)))))))];
        case 0x3f: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new i32(new Mem16(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))))];
        case 0x803f: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new i32(new Mem16(R32[5].add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0)))))))];
    }

    if((((((((b[i] | ((b[i+1] << 8) >>> 0)) >>> 0) | ((b[i+2] << 16) >>> 0)) >>> 0) | ((((b[i+3] & 63) >>> 0) << 24) >>> 0)) >>> 0) & 0x38c7c0ff) == 0x2084800f)
    switch(((b[i+1] & 63) & 0xff) & 0x3f) {
        case 0x10: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(new Mem8(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))), R1[0])];
        case 0x11: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(new Mem8(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))), R1[0].not())];
        case 0x12: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(new Mem8(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))), R1[1])];
        case 0x13: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(new Mem8(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))), R1[1].not())];
        case 0x14: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(new Mem8(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))), R1[2])];
        case 0x15: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(new Mem8(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))), R1[2].not())];
        case 0x16: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(new Mem8(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))), R1[1].or(R1[2]))];
        case 0x17: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(new Mem8(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))), R1[1].not().and(R1[2].not()))];
        case 0x18: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(new Mem8(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))), R1[3])];
        case 0x19: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(new Mem8(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))), R1[3].not())];
        case 0x1a: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(new Mem8(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))), R1[4])];
        case 0x1b: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(new Mem8(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))), R1[4].not())];
        case 0x1c: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(new Mem8(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))), R1[0].eq(R1[3]).not())];
        case 0x1d: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(new Mem8(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))), R1[0].eq(R1[3]))];
        case 0x1e: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(new Mem8(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))), R1[0].eq(R1[3]).not().or(R1[2]))];
        case 0x1f: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(new Mem8(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))), R1[0].eq(R1[3]).and(R1[2].not()))];
        case 0x23: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(R1[1], new u32(1).shl(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).and(new Mem32(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0)))))).eq(new u8(0)).not())];
        case 0x25: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0)))))), $0.shl(($1 = R8[1])).or(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shr(new u8($1.neg()).add(new u8(32)))))];
        case 0x2b: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(R1[1], new u32(1).shl(($1 = R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])).and(($0 = new Mem32(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))))).eq(new u8(0)).not()), new Mov($0, new u32(1).shl($1).or($0))];
        case 0x2d: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($1 = new Mem32(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0)))))), new u32(1).shl(($0 = R8[1])).add(new i32(-1)).shl(new u8($0.neg()).add(new u8(32))).and(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).or($1.shr($0)))];
        case 0x2f: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])), $0.mul(new i32(new Mem32(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))))))];
        case 0x36: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new Mem8(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))))];
        case 0x37: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new Mem16(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))))];
        case 0x3e: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new i32(new Mem8(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0)))))))];
        case 0x3f: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new i32(new Mem16(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0)))))))];
    }

    if((((((((b[i] | ((b[i+1] << 8) >>> 0)) >>> 0) | ((b[i+2] << 16) >>> 0)) >>> 0) | ((((b[i+3] & 7) >>> 0) << 24) >>> 0)) >>> 0) & 0x747c0ff) == 0x504800f)
    switch(((b[i+1] | ((b[i+2] << 8) & 0xffff)) & 0xffff) & 0x803f) {
        case 0x10: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(new Mem8(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))), R1[0])];
        case 0x8010: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(new Mem8(R32[5].add(new i32(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))))), R1[0])];
        case 0x11: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(new Mem8(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))), R1[0].not())];
        case 0x8011: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(new Mem8(R32[5].add(new i32(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))))), R1[0].not())];
        case 0x12: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(new Mem8(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))), R1[1])];
        case 0x8012: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(new Mem8(R32[5].add(new i32(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))))), R1[1])];
        case 0x13: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(new Mem8(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))), R1[1].not())];
        case 0x8013: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(new Mem8(R32[5].add(new i32(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))))), R1[1].not())];
        case 0x14: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(new Mem8(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))), R1[2])];
        case 0x8014: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(new Mem8(R32[5].add(new i32(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))))), R1[2])];
        case 0x15: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(new Mem8(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))), R1[2].not())];
        case 0x8015: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(new Mem8(R32[5].add(new i32(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))))), R1[2].not())];
        case 0x16: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(new Mem8(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))), R1[1].or(R1[2]))];
        case 0x8016: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(new Mem8(R32[5].add(new i32(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))))), R1[1].or(R1[2]))];
        case 0x17: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(new Mem8(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))), R1[1].not().and(R1[2].not()))];
        case 0x8017: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(new Mem8(R32[5].add(new i32(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))))), R1[1].not().and(R1[2].not()))];
        case 0x18: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(new Mem8(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))), R1[3])];
        case 0x8018: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(new Mem8(R32[5].add(new i32(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))))), R1[3])];
        case 0x19: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(new Mem8(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))), R1[3].not())];
        case 0x8019: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(new Mem8(R32[5].add(new i32(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))))), R1[3].not())];
        case 0x1a: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(new Mem8(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))), R1[4])];
        case 0x801a: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(new Mem8(R32[5].add(new i32(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))))), R1[4])];
        case 0x1b: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(new Mem8(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))), R1[4].not())];
        case 0x801b: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(new Mem8(R32[5].add(new i32(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))))), R1[4].not())];
        case 0x1c: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(new Mem8(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))), R1[0].eq(R1[3]).not())];
        case 0x801c: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(new Mem8(R32[5].add(new i32(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))))), R1[0].eq(R1[3]).not())];
        case 0x1d: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(new Mem8(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))), R1[0].eq(R1[3]))];
        case 0x801d: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(new Mem8(R32[5].add(new i32(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))))), R1[0].eq(R1[3]))];
        case 0x1e: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(new Mem8(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))), R1[0].eq(R1[3]).not().or(R1[2]))];
        case 0x801e: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(new Mem8(R32[5].add(new i32(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))))), R1[0].eq(R1[3]).not().or(R1[2]))];
        case 0x1f: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(new Mem8(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))), R1[0].eq(R1[3]).and(R1[2].not()))];
        case 0x801f: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(new Mem8(R32[5].add(new i32(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))))), R1[0].eq(R1[3]).and(R1[2].not()))];
        case 0x23: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(R1[1], new u32(1).shl(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).and(new Mem32(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0)))))).eq(new u8(0)).not())];
        case 0x8023: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(R1[1], new u32(1).shl(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).and(new Mem32(R32[5].add(new i32(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0)))))))).eq(new u8(0)).not())];
        case 0x25: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem32(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0)))))), $0.shl(($1 = R8[1])).or(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shr(new u8($1.neg()).add(new u8(32)))))];
        case 0x8025: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0)))))))), $0.shl(($1 = R8[1])).or(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shr(new u8($1.neg()).add(new u8(32)))))];
        case 0x2b: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(R1[1], new u32(1).shl(($1 = R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])).and(($0 = new Mem32(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))))).eq(new u8(0)).not()), new Mov($0, new u32(1).shl($1).or($0))];
        case 0x802b: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(R1[1], new u32(1).shl(($1 = R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])).and(($0 = new Mem32(R32[5].add(new i32(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))))))).eq(new u8(0)).not()), new Mov($0, new u32(1).shl($1).or($0))];
        case 0x2d: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($1 = new Mem32(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0)))))), new u32(1).shl(($0 = R8[1])).add(new i32(-1)).shl(new u8($0.neg()).add(new u8(32))).and(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).or($1.shr($0)))];
        case 0x802d: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($1 = new Mem32(R32[5].add(new i32(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0)))))))), new u32(1).shl(($0 = R8[1])).add(new i32(-1)).shl(new u8($0.neg()).add(new u8(32))).and(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).or($1.shr($0)))];
        case 0x2f: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])), $0.mul(new i32(new Mem32(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))))))];
        case 0x802f: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])), $0.mul(new i32(new Mem32(R32[5].add(new i32(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))))))))];
        case 0x36: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new Mem8(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))))];
        case 0x8036: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new Mem8(R32[5].add(new i32(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))))))];
        case 0x37: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new Mem16(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))))];
        case 0x8037: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new Mem16(R32[5].add(new i32(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))))))];
        case 0x3e: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new i32(new Mem8(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0)))))))];
        case 0x803e: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new i32(new Mem8(R32[5].add(new i32(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0)))))))))];
        case 0x3f: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new i32(new Mem16(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0)))))))];
        case 0x803f: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new i32(new Mem16(R32[5].add(new i32(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0)))))))))];
    }

    if((((((b[i] | ((b[i+1] << 8) >>> 0)) >>> 0) | ((b[i+2] << 16) >>> 0)) >>> 0) & 0xc0f7ff) == 0x80a40f)
    switch(((((b[i+1] & 8) & 0xff) >> 3) & 0xff) & 0x1) {
        case 0x0: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shl(new i8(new u8(b[i+7]))).or(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shr(new u8(((((-((b[i+7]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 32))))];
        case 0x1: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), new u32(((((1 << (((b[i+7]) << 24 >> 24) & 0x1f)) >>> 0) + -1) >>> 0) << (((((((-((b[i+7]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 32) & 0xff) & 0x1f)).and(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).or($0.shr(new i8(new u8(b[i+7])))))];
    }

    if((((((b[i] | ((b[i+1] << 8) >>> 0)) >>> 0) | ((((b[i+2] & 127) >>> 0) << 16) >>> 0)) >>> 0) & 0x46c0ff) == 0x4800f)
    switch(((b[i+1] | ((b[i+2] << 8) & 0xffff)) & 0xffff) & 0x813f) {
        case 0x8010: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(new Mem8(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))), R1[0])];
        case 0x8011: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(new Mem8(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))), R1[0].not())];
        case 0x8012: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(new Mem8(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))), R1[1])];
        case 0x8013: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(new Mem8(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))), R1[1].not())];
        case 0x8014: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(new Mem8(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))), R1[2])];
        case 0x8015: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(new Mem8(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))), R1[2].not())];
        case 0x8016: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(new Mem8(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))), R1[1].or(R1[2]))];
        case 0x8017: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(new Mem8(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))), R1[1].not().and(R1[2].not()))];
        case 0x8018: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(new Mem8(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))), R1[3])];
        case 0x8019: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(new Mem8(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))), R1[3].not())];
        case 0x801a: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(new Mem8(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))), R1[4])];
        case 0x801b: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(new Mem8(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))), R1[4].not())];
        case 0x801c: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(new Mem8(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))), R1[0].eq(R1[3]).not())];
        case 0x801d: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(new Mem8(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))), R1[0].eq(R1[3]))];
        case 0x801e: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(new Mem8(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))), R1[0].eq(R1[3]).not().or(R1[2]))];
        case 0x801f: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(new Mem8(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))), R1[0].eq(R1[3]).and(R1[2].not()))];
        case 0x8023: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(R1[1], new u32(1).shl(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).and(new Mem32(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0)))))).eq(new u8(0)).not())];
        case 0x124: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))), $0.shl(new i8(new u8(b[i+7]))).or(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shr(new u8(((((-((b[i+7]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 32))))];
        case 0x8025: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0)))))), $0.shl(($1 = R8[1])).or(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shr(new u8($1.neg()).add(new u8(32)))))];
        case 0x802b: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(R1[1], new u32(1).shl(($1 = R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])).and(($0 = new Mem32(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))))).eq(new u8(0)).not()), new Mov($0, new u32(1).shl($1).or($0))];
        case 0x12c: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))), new u32(((((1 << (((b[i+7]) << 24 >> 24) & 0x1f)) >>> 0) + -1) >>> 0) << (((((((-((b[i+7]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 32) & 0xff) & 0x1f)).and(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).or($0.shr(new i8(new u8(b[i+7])))))];
        case 0x802d: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($1 = new Mem32(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0)))))), new u32(1).shl(($0 = R8[1])).add(new i32(-1)).shl(new u8($0.neg()).add(new u8(32))).and(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).or($1.shr($0)))];
        case 0x802f: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])), $0.mul(new i32(new Mem32(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))))))];
        case 0x8036: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new Mem8(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))))];
        case 0x8037: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new Mem16(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))))];
        case 0x803e: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new i32(new Mem8(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0)))))))];
        case 0x803f: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new i32(new Mem16(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0)))))))];
    }

    if((((((b[i] | ((b[i+1] << 8) >>> 0)) >>> 0) | ((((b[i+2] & 63) >>> 0) << 16) >>> 0)) >>> 0) & 0x3f07fd) == 0x250469)
    switch(((((((b[i] & 254) & 0xffff) >> 1) & 0xffff) | ((b[i+1] << 7) & 0xffff)) & 0xffff) & 0x6001) {
        case 0x2000: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new Mem32(R32[5].add(new i32(new i8(new u8(b[i+3]))))).mul(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0)))))];
        case 0x1: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new Mem32(new u32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))).mul(new i32(new i8(new u8(b[i+7])))))];
        case 0x4001: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new Mem32(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))).mul(new i32(new i8(new u8(b[i+7])))))];
    }

    if((((((b[i] | ((b[i+1] << 8) >>> 0)) >>> 0) | ((((b[i+2] & 63) >>> 0) << 16) >>> 0)) >>> 0) & 0x3807fd) == 0x200469)
    switch(((((((b[i] & 254) & 0xffff) >> 1) & 0xffff) | ((b[i+1] << 7) & 0xffff)) & 0xffff) & 0x6001) {
        case 0x2000: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3])))).mul(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0)))))];
        case 0x4001: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))).mul(new i32(new i8(new u8(b[i+7])))))];
    }

    if((((((b[i] | ((b[i+1] << 8) >>> 0)) >>> 0) | ((((b[i+2] & 7) >>> 0) << 16) >>> 0)) >>> 0) & 0x707fd) == 0x50469)
    switch(((((((b[i] & 254) & 0xffff) >> 1) & 0xffff) | ((b[i+1] << 7) & 0xffff)) & 0xffff) & 0x6001) {
        case 0x2000: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3])))))).mul(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0)))))];
        case 0x1: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new Mem32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))).mul(new i32(new i8(new u8(b[i+7])))))];
        case 0x4001: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))))).mul(new i32(new i8(new u8(b[i+7])))))];
    }

    if((((b[i] | ((((b[i+1] & 7) & 0xffff) << 8) & 0xffff)) & 0xffff) & 0x7fd) == 0x469)
    switch(((((((b[i] & 254) & 0xffff) >> 1) & 0xffff) | ((b[i+1] << 7) & 0xffff)) & 0xffff) & 0x6001) {
        case 0x2000: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3])))).mul(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0)))))];
        case 0x4001: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))).mul(new i32(new i8(new u8(b[i+7])))))];
    }

    if((((((((((b[i] & 248) >>> 0) >> 3) >>> 0) | ((b[i+1] << 5) >>> 0)) >>> 0) | ((((b[i+2] & 63) >>> 0) << 13) >>> 0)) >>> 0) & 0x7e0f1) == 0x4a090)
    switch(((b[i] | ((b[i+1] << 8) & 0xffff)) & 0xffff) & 0xf877) {
        case 0x0: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), $0.add(new i8(new u8(b[i+7]))))];
        case 0x8000: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.add(new i8(new u8(b[i+7]))))];
        case 0x4001: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(new i8(new u8(b[i+3])))))), $0.add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0)))))];
        case 0x2: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), $0.add(new i8(new u8(b[i+7]))))];
        case 0x8002: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.add(new i8(new u8(b[i+7]))))];
        case 0x3: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem32(new u32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), $0.add(new i8(new u8(b[i+7]))))];
        case 0x8003: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.add(new i8(new u8(b[i+7]))))];
        case 0x800: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), new u8(new u8(b[i+7])).or($0))];
        case 0x8800: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), new u8(new u8(b[i+7])).or($0))];
        case 0x4801: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(new i8(new u8(b[i+3])))))), new u32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))).or($0))];
        case 0x802: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), new u8(new u8(b[i+7])).or($0))];
        case 0x8802: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), new u8(new u8(b[i+7])).or($0))];
        case 0x803: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem32(new u32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), new u32(new i8(new u8(b[i+7]))).or($0))];
        case 0x8803: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), new u32(new i8(new u8(b[i+7]))).or($0))];
        case 0x1000: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), $0.add(new i8(new u8(b[i+7]))).add(R1[1]))];
        case 0x9000: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.add(new i8(new u8(b[i+7]))).add(R1[1]))];
        case 0x5001: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(new i8(new u8(b[i+3])))))), $0.add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0)))).add(R1[1]))];
        case 0x1002: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), $0.add(new i8(new u8(b[i+7]))).add(R1[1]))];
        case 0x9002: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.add(new i8(new u8(b[i+7]))).add(R1[1]))];
        case 0x1003: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem32(new u32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), $0.add(new i8(new u8(b[i+7]))).add(R1[1]))];
        case 0x9003: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.add(new i8(new u8(b[i+7]))).add(R1[1]))];
        case 0x1800: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), $0.add(new i8(-((b[i+7]) << 24 >> 24))).add(new i8(R1[1]).neg()))];
        case 0x9800: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.add(new i8(-((b[i+7]) << 24 >> 24))).add(new i8(R1[1]).neg()))];
        case 0x5801: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(new i8(new u8(b[i+3])))))), $0.add(new i32(-((((((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0)) >>> 0)) >> 0))).add(new i32(R1[1]).neg()))];
        case 0x1802: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), $0.add(new i8(-((b[i+7]) << 24 >> 24))).add(new i8(R1[1]).neg()))];
        case 0x9802: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.add(new i8(-((b[i+7]) << 24 >> 24))).add(new i8(R1[1]).neg()))];
        case 0x1803: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem32(new u32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), $0.add(new i32(-((((b[i+7]) << 24 >> 24)) >> 0))).add(new i32(R1[1]).neg()))];
        case 0x9803: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.add(new i32(-((((b[i+7]) << 24 >> 24)) >> 0))).add(new i32(R1[1]).neg()))];
        case 0x2000: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), new u8(new u8(b[i+7])).and($0))];
        case 0xa000: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), new u8(new u8(b[i+7])).and($0))];
        case 0x6001: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(new i8(new u8(b[i+3])))))), new u32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))).and($0))];
        case 0x2002: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), new u8(new u8(b[i+7])).and($0))];
        case 0xa002: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), new u8(new u8(b[i+7])).and($0))];
        case 0x2003: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem32(new u32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), new u32(new i8(new u8(b[i+7]))).and($0))];
        case 0xa003: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), new u32(new i8(new u8(b[i+7]))).and($0))];
        case 0x2800: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(R1[2], ($0 = new Mem8(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))).eq(new i8(new u8(b[i+7])))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add(new i8(-((b[i+7]) << 24 >> 24))))];
        case 0xa800: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(R1[2], ($0 = new Mem8(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))).eq(new i8(new u8(b[i+7])))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add(new i8(-((b[i+7]) << 24 >> 24))))];
        case 0x6801: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(R1[2], ($0 = new Mem32(R32[5].add(new i32(new i8(new u8(b[i+3])))))).eq(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add(new i32(-((((((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0)) >>> 0)) >> 0))))];
        case 0x2802: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(R1[2], ($0 = new Mem8(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))).eq(new i8(new u8(b[i+7])))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add(new i8(-((b[i+7]) << 24 >> 24))))];
        case 0xa802: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(R1[2], ($0 = new Mem8(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))).eq(new i8(new u8(b[i+7])))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add(new i8(-((b[i+7]) << 24 >> 24))))];
        case 0x2803: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(R1[2], ($0 = new Mem32(new u32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))).eq(new i32(new i8(new u8(b[i+7]))))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add(new i32(-((((b[i+7]) << 24 >> 24)) >> 0))))];
        case 0xa803: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(R1[2], ($0 = new Mem32(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))).eq(new i32(new i8(new u8(b[i+7]))))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add(new i32(-((((b[i+7]) << 24 >> 24)) >> 0))))];
        case 0x3000: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), $0.xor(new i8(new u8(b[i+7]))))];
        case 0xb000: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.xor(new i8(new u8(b[i+7]))))];
        case 0x7001: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(new i8(new u8(b[i+3])))))), $0.xor(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0)))))];
        case 0x3002: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), $0.xor(new i8(new u8(b[i+7]))))];
        case 0xb002: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.xor(new i8(new u8(b[i+7]))))];
        case 0x3003: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem32(new u32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), $0.xor(new i8(new u8(b[i+7]))))];
        case 0xb003: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.xor(new i8(new u8(b[i+7]))))];
        case 0x3800: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(R1[2], new Mem8(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))).eq(new i8(new u8(b[i+7])))), new Mov(R1[1], new u1(0))];
        case 0xb800: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(R1[2], new Mem8(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))).eq(new i8(new u8(b[i+7])))), new Mov(R1[1], new u1(0))];
        case 0x7801: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(R1[2], new Mem32(R32[5].add(new i32(new i8(new u8(b[i+3]))))).eq(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))), new Mov(R1[1], new u1(0))];
        case 0x3802: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(R1[2], new Mem8(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))).eq(new i8(new u8(b[i+7])))), new Mov(R1[1], new u1(0))];
        case 0xb802: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(R1[2], new Mem8(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))).eq(new i8(new u8(b[i+7])))), new Mov(R1[1], new u1(0))];
        case 0x3803: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(R1[2], new Mem32(new u32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))).eq(new i32(new i8(new u8(b[i+7]))))), new Mov(R1[1], new u1(0))];
        case 0xb803: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(R1[2], new Mem32(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))).eq(new i32(new i8(new u8(b[i+7]))))), new Mov(R1[1], new u1(0))];
        case 0x46: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(new Mem8(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))), new i8(new u8(b[i+7])))];
        case 0x8046: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(new Mem8(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), new i8(new u8(b[i+7])))];
        case 0x4047: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(new Mem32(R32[5].add(new i32(new i8(new u8(b[i+3]))))), new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))];
        case 0x40: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), $0.shl(new i8(new u8(b[i+7]))).or($0.shr(new u8(((((-((b[i+7]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 8))))];
        case 0x8040: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shl(new i8(new u8(b[i+7]))).or($0.shr(new u8(((((-((b[i+7]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 8))))];
        case 0x41: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem32(new u32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), $0.shl(new i8(new u8(b[i+7]))).or($0.shr(new u8(((((-((b[i+7]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 32))))];
        case 0x8041: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shl(new i8(new u8(b[i+7]))).or($0.shr(new u8(((((-((b[i+7]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 32))))];
        case 0x840: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), $0.shr(new i8(new u8(b[i+7]))).or($0.shl(new u8(((((-((b[i+7]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 8))))];
        case 0x8840: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shr(new i8(new u8(b[i+7]))).or($0.shl(new u8(((((-((b[i+7]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 8))))];
        case 0x841: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem32(new u32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), $0.shr(new i8(new u8(b[i+7]))).or($0.shl(new u8(((((-((b[i+7]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 32))))];
        case 0x8841: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shr(new i8(new u8(b[i+7]))).or($0.shl(new u8(((((-((b[i+7]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 32))))];
        case 0x1040: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), $0.shl(new i8(new u8(b[i+7]))).or($0.shr(new u8(((((-((b[i+7]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 8))))];
        case 0x9040: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shl(new i8(new u8(b[i+7]))).or($0.shr(new u8(((((-((b[i+7]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 8))))];
        case 0x1041: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem32(new u32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), $0.shl(new i8(new u8(b[i+7]))).or($0.shr(new u8(((((-((b[i+7]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 32))))];
        case 0x9041: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shl(new i8(new u8(b[i+7]))).or($0.shr(new u8(((((-((b[i+7]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 32))))];
        case 0x1840: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), $0.shr(new i8(new u8(b[i+7]))).or($0.shl(new u8(((((-((b[i+7]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 8))))];
        case 0x9840: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shr(new i8(new u8(b[i+7]))).or($0.shl(new u8(((((-((b[i+7]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 8))))];
        case 0x1841: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem32(new u32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), $0.shr(new i8(new u8(b[i+7]))).or($0.shl(new u8(((((-((b[i+7]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 32))))];
        case 0x9841: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shr(new i8(new u8(b[i+7]))).or($0.shl(new u8(((((-((b[i+7]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 32))))];
        case 0x2040: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), $0.shl(new i8(new u8(b[i+7]))))];
        case 0xa040: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shl(new i8(new u8(b[i+7]))))];
        case 0x2041: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem32(new u32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), $0.shl(new i8(new u8(b[i+7]))))];
        case 0xa041: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shl(new i8(new u8(b[i+7]))))];
        case 0x2840: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), new u8($0).shr(new i8(new u8(b[i+7]))))];
        case 0xa840: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), new u8($0).shr(new i8(new u8(b[i+7]))))];
        case 0x2841: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem32(new u32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), new u32($0).shr(new i8(new u8(b[i+7]))))];
        case 0xa841: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), new u32($0).shr(new i8(new u8(b[i+7]))))];
        case 0x3040: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), $0.shl(new i8(new u8(b[i+7]))))];
        case 0xb040: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shl(new i8(new u8(b[i+7]))))];
        case 0x3041: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem32(new u32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), $0.shl(new i8(new u8(b[i+7]))))];
        case 0xb041: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shl(new i8(new u8(b[i+7]))))];
        case 0x3840: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), new i8($0).shr(new i8(new u8(b[i+7]))))];
        case 0xb840: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), new i8($0).shr(new i8(new u8(b[i+7]))))];
        case 0x3841: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem32(new u32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), new i32($0).shr(new i8(new u8(b[i+7]))))];
        case 0xb841: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), new i32($0).shr(new i8(new u8(b[i+7]))))];
        case 0x76: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(R1[2], new Mem8(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))).and(new i8(new u8(b[i+7]))).eq(new i8(0))), new Mov(R1[1], new u1(0)), new Mov(R1[0], new u1(0))];
        case 0x8076: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(R1[2], new Mem8(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))).and(new i8(new u8(b[i+7]))).eq(new i8(0))), new Mov(R1[1], new u1(0)), new Mov(R1[0], new u1(0))];
        case 0x4077: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(R1[2], new Mem32(R32[5].add(new i32(new i8(new u8(b[i+3]))))).and(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0)))).eq(new i32(0))), new Mov(R1[1], new u1(0)), new Mov(R1[0], new u1(0))];
    }

    if((((((((((b[i] & 248) >>> 0) >> 3) >>> 0) | ((b[i+1] << 5) >>> 0)) >>> 0) | ((((b[i+2] & 63) >>> 0) << 13) >>> 0)) >>> 0) & 0x700f1) == 0x40090)
    switch(((b[i] | ((b[i+1] << 8) & 0xffff)) & 0xffff) & 0xf877) {
        case 0x8000: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.add(new i8(new u8(b[i+7]))))];
        case 0x4001: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))), $0.add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0)))))];
        case 0x8002: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.add(new i8(new u8(b[i+7]))))];
        case 0x8003: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.add(new i8(new u8(b[i+7]))))];
        case 0x8800: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), new u8(new u8(b[i+7])).or($0))];
        case 0x4801: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))), new u32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))).or($0))];
        case 0x8802: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), new u8(new u8(b[i+7])).or($0))];
        case 0x8803: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), new u32(new i8(new u8(b[i+7]))).or($0))];
        case 0x9000: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.add(new i8(new u8(b[i+7]))).add(R1[1]))];
        case 0x5001: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))), $0.add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0)))).add(R1[1]))];
        case 0x9002: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.add(new i8(new u8(b[i+7]))).add(R1[1]))];
        case 0x9003: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.add(new i8(new u8(b[i+7]))).add(R1[1]))];
        case 0x9800: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.add(new i8(-((b[i+7]) << 24 >> 24))).add(new i8(R1[1]).neg()))];
        case 0x5801: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))), $0.add(new i32(-((((((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0)) >>> 0)) >> 0))).add(new i32(R1[1]).neg()))];
        case 0x9802: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.add(new i8(-((b[i+7]) << 24 >> 24))).add(new i8(R1[1]).neg()))];
        case 0x9803: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.add(new i32(-((((b[i+7]) << 24 >> 24)) >> 0))).add(new i32(R1[1]).neg()))];
        case 0xa000: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), new u8(new u8(b[i+7])).and($0))];
        case 0x6001: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))), new u32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))).and($0))];
        case 0xa002: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), new u8(new u8(b[i+7])).and($0))];
        case 0xa003: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), new u32(new i8(new u8(b[i+7]))).and($0))];
        case 0xa800: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(R1[2], ($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))).eq(new i8(new u8(b[i+7])))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add(new i8(-((b[i+7]) << 24 >> 24))))];
        case 0x6801: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(R1[2], ($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))).eq(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add(new i32(-((((((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0)) >>> 0)) >> 0))))];
        case 0xa802: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(R1[2], ($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))).eq(new i8(new u8(b[i+7])))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add(new i8(-((b[i+7]) << 24 >> 24))))];
        case 0xa803: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(R1[2], ($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))).eq(new i32(new i8(new u8(b[i+7]))))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add(new i32(-((((b[i+7]) << 24 >> 24)) >> 0))))];
        case 0xb000: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.xor(new i8(new u8(b[i+7]))))];
        case 0x7001: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))), $0.xor(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0)))))];
        case 0xb002: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.xor(new i8(new u8(b[i+7]))))];
        case 0xb003: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.xor(new i8(new u8(b[i+7]))))];
        case 0xb800: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(R1[2], new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))).eq(new i8(new u8(b[i+7])))), new Mov(R1[1], new u1(0))];
        case 0x7801: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(R1[2], new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3])))).eq(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))), new Mov(R1[1], new u1(0))];
        case 0xb802: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(R1[2], new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))).eq(new i8(new u8(b[i+7])))), new Mov(R1[1], new u1(0))];
        case 0xb803: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(R1[2], new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))).eq(new i32(new i8(new u8(b[i+7]))))), new Mov(R1[1], new u1(0))];
        case 0x8046: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), new i8(new u8(b[i+7])))];
        case 0x4047: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3])))), new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))];
        case 0x8040: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shl(new i8(new u8(b[i+7]))).or($0.shr(new u8(((((-((b[i+7]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 8))))];
        case 0x8041: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shl(new i8(new u8(b[i+7]))).or($0.shr(new u8(((((-((b[i+7]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 32))))];
        case 0x8840: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shr(new i8(new u8(b[i+7]))).or($0.shl(new u8(((((-((b[i+7]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 8))))];
        case 0x8841: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shr(new i8(new u8(b[i+7]))).or($0.shl(new u8(((((-((b[i+7]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 32))))];
        case 0x9040: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shl(new i8(new u8(b[i+7]))).or($0.shr(new u8(((((-((b[i+7]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 8))))];
        case 0x9041: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shl(new i8(new u8(b[i+7]))).or($0.shr(new u8(((((-((b[i+7]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 32))))];
        case 0x9840: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shr(new i8(new u8(b[i+7]))).or($0.shl(new u8(((((-((b[i+7]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 8))))];
        case 0x9841: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shr(new i8(new u8(b[i+7]))).or($0.shl(new u8(((((-((b[i+7]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 32))))];
        case 0xa040: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shl(new i8(new u8(b[i+7]))))];
        case 0xa041: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shl(new i8(new u8(b[i+7]))))];
        case 0xa840: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), new u8($0).shr(new i8(new u8(b[i+7]))))];
        case 0xa841: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), new u32($0).shr(new i8(new u8(b[i+7]))))];
        case 0xb040: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shl(new i8(new u8(b[i+7]))))];
        case 0xb041: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shl(new i8(new u8(b[i+7]))))];
        case 0xb840: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), new i8($0).shr(new i8(new u8(b[i+7]))))];
        case 0xb841: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), new i32($0).shr(new i8(new u8(b[i+7]))))];
        case 0x8076: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(R1[2], new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))).and(new i8(new u8(b[i+7]))).eq(new i8(0))), new Mov(R1[1], new u1(0)), new Mov(R1[0], new u1(0))];
        case 0x4077: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(R1[2], new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3])))).and(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0)))).eq(new i32(0))), new Mov(R1[1], new u1(0)), new Mov(R1[0], new u1(0))];
    }

    if((((((((((b[i] & 248) & 0xffff) >> 3) & 0xffff) | ((b[i+1] << 5) & 0xffff)) & 0xffff) | ((((b[i+2] & 7) & 0xffff) << 13) & 0xffff)) & 0xffff) & 0xe0f1) == 0xa090)
    switch(((b[i] | ((b[i+1] << 8) & 0xffff)) & 0xffff) & 0xf877) {
        case 0x0: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.add(new i8(new u8(b[i+7]))))];
        case 0x8000: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))), $0.add(new i8(new u8(b[i+7]))))];
        case 0x4001: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))), $0.add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0)))))];
        case 0x2: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.add(new i8(new u8(b[i+7]))))];
        case 0x8002: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))), $0.add(new i8(new u8(b[i+7]))))];
        case 0x3: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.add(new i8(new u8(b[i+7]))))];
        case 0x8003: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))), $0.add(new i8(new u8(b[i+7]))))];
        case 0x800: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), new u8(new u8(b[i+7])).or($0))];
        case 0x8800: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))), new u8(new u8(b[i+7])).or($0))];
        case 0x4801: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))), new u32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))).or($0))];
        case 0x802: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), new u8(new u8(b[i+7])).or($0))];
        case 0x8802: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))), new u8(new u8(b[i+7])).or($0))];
        case 0x803: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), new u32(new i8(new u8(b[i+7]))).or($0))];
        case 0x8803: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))), new u32(new i8(new u8(b[i+7]))).or($0))];
        case 0x1000: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.add(new i8(new u8(b[i+7]))).add(R1[1]))];
        case 0x9000: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))), $0.add(new i8(new u8(b[i+7]))).add(R1[1]))];
        case 0x5001: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))), $0.add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0)))).add(R1[1]))];
        case 0x1002: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.add(new i8(new u8(b[i+7]))).add(R1[1]))];
        case 0x9002: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))), $0.add(new i8(new u8(b[i+7]))).add(R1[1]))];
        case 0x1003: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.add(new i8(new u8(b[i+7]))).add(R1[1]))];
        case 0x9003: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))), $0.add(new i8(new u8(b[i+7]))).add(R1[1]))];
        case 0x1800: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.add(new i8(-((b[i+7]) << 24 >> 24))).add(new i8(R1[1]).neg()))];
        case 0x9800: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))), $0.add(new i8(-((b[i+7]) << 24 >> 24))).add(new i8(R1[1]).neg()))];
        case 0x5801: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))), $0.add(new i32(-((((((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0)) >>> 0)) >> 0))).add(new i32(R1[1]).neg()))];
        case 0x1802: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.add(new i8(-((b[i+7]) << 24 >> 24))).add(new i8(R1[1]).neg()))];
        case 0x9802: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))), $0.add(new i8(-((b[i+7]) << 24 >> 24))).add(new i8(R1[1]).neg()))];
        case 0x1803: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.add(new i32(-((((b[i+7]) << 24 >> 24)) >> 0))).add(new i32(R1[1]).neg()))];
        case 0x9803: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))), $0.add(new i32(-((((b[i+7]) << 24 >> 24)) >> 0))).add(new i32(R1[1]).neg()))];
        case 0x2000: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), new u8(new u8(b[i+7])).and($0))];
        case 0xa000: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))), new u8(new u8(b[i+7])).and($0))];
        case 0x6001: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))), new u32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))).and($0))];
        case 0x2002: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), new u8(new u8(b[i+7])).and($0))];
        case 0xa002: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))), new u8(new u8(b[i+7])).and($0))];
        case 0x2003: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), new u32(new i8(new u8(b[i+7]))).and($0))];
        case 0xa003: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))), new u32(new i8(new u8(b[i+7]))).and($0))];
        case 0x2800: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(R1[2], ($0 = new Mem8(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))).eq(new i8(new u8(b[i+7])))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add(new i8(-((b[i+7]) << 24 >> 24))))];
        case 0xa800: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(R1[2], ($0 = new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))).eq(new i8(new u8(b[i+7])))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add(new i8(-((b[i+7]) << 24 >> 24))))];
        case 0x6801: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(R1[2], ($0 = new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))).eq(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add(new i32(-((((((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0)) >>> 0)) >> 0))))];
        case 0x2802: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(R1[2], ($0 = new Mem8(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))).eq(new i8(new u8(b[i+7])))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add(new i8(-((b[i+7]) << 24 >> 24))))];
        case 0xa802: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(R1[2], ($0 = new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))).eq(new i8(new u8(b[i+7])))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add(new i8(-((b[i+7]) << 24 >> 24))))];
        case 0x2803: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(R1[2], ($0 = new Mem32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))).eq(new i32(new i8(new u8(b[i+7]))))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add(new i32(-((((b[i+7]) << 24 >> 24)) >> 0))))];
        case 0xa803: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(R1[2], ($0 = new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))).eq(new i32(new i8(new u8(b[i+7]))))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add(new i32(-((((b[i+7]) << 24 >> 24)) >> 0))))];
        case 0x3000: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.xor(new i8(new u8(b[i+7]))))];
        case 0xb000: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))), $0.xor(new i8(new u8(b[i+7]))))];
        case 0x7001: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))), $0.xor(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0)))))];
        case 0x3002: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.xor(new i8(new u8(b[i+7]))))];
        case 0xb002: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))), $0.xor(new i8(new u8(b[i+7]))))];
        case 0x3003: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.xor(new i8(new u8(b[i+7]))))];
        case 0xb003: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))), $0.xor(new i8(new u8(b[i+7]))))];
        case 0x3800: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(R1[2], new Mem8(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))).eq(new i8(new u8(b[i+7])))), new Mov(R1[1], new u1(0))];
        case 0xb800: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(R1[2], new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))))).eq(new i8(new u8(b[i+7])))), new Mov(R1[1], new u1(0))];
        case 0x7801: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(R1[2], new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3])))))).eq(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))), new Mov(R1[1], new u1(0))];
        case 0x3802: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(R1[2], new Mem8(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))).eq(new i8(new u8(b[i+7])))), new Mov(R1[1], new u1(0))];
        case 0xb802: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(R1[2], new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))))).eq(new i8(new u8(b[i+7])))), new Mov(R1[1], new u1(0))];
        case 0x3803: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(R1[2], new Mem32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))).eq(new i32(new i8(new u8(b[i+7]))))), new Mov(R1[1], new u1(0))];
        case 0xb803: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(R1[2], new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))))).eq(new i32(new i8(new u8(b[i+7]))))), new Mov(R1[1], new u1(0))];
        case 0x46: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(new Mem8(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), new i8(new u8(b[i+7])))];
        case 0x8046: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))))), new i8(new u8(b[i+7])))];
        case 0x4047: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3])))))), new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))];
        case 0x40: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shl(new i8(new u8(b[i+7]))).or($0.shr(new u8(((((-((b[i+7]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 8))))];
        case 0x8040: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))), $0.shl(new i8(new u8(b[i+7]))).or($0.shr(new u8(((((-((b[i+7]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 8))))];
        case 0x41: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shl(new i8(new u8(b[i+7]))).or($0.shr(new u8(((((-((b[i+7]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 32))))];
        case 0x8041: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))), $0.shl(new i8(new u8(b[i+7]))).or($0.shr(new u8(((((-((b[i+7]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 32))))];
        case 0x840: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shr(new i8(new u8(b[i+7]))).or($0.shl(new u8(((((-((b[i+7]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 8))))];
        case 0x8840: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))), $0.shr(new i8(new u8(b[i+7]))).or($0.shl(new u8(((((-((b[i+7]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 8))))];
        case 0x841: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shr(new i8(new u8(b[i+7]))).or($0.shl(new u8(((((-((b[i+7]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 32))))];
        case 0x8841: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))), $0.shr(new i8(new u8(b[i+7]))).or($0.shl(new u8(((((-((b[i+7]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 32))))];
        case 0x1040: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shl(new i8(new u8(b[i+7]))).or($0.shr(new u8(((((-((b[i+7]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 8))))];
        case 0x9040: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))), $0.shl(new i8(new u8(b[i+7]))).or($0.shr(new u8(((((-((b[i+7]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 8))))];
        case 0x1041: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shl(new i8(new u8(b[i+7]))).or($0.shr(new u8(((((-((b[i+7]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 32))))];
        case 0x9041: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))), $0.shl(new i8(new u8(b[i+7]))).or($0.shr(new u8(((((-((b[i+7]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 32))))];
        case 0x1840: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shr(new i8(new u8(b[i+7]))).or($0.shl(new u8(((((-((b[i+7]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 8))))];
        case 0x9840: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))), $0.shr(new i8(new u8(b[i+7]))).or($0.shl(new u8(((((-((b[i+7]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 8))))];
        case 0x1841: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shr(new i8(new u8(b[i+7]))).or($0.shl(new u8(((((-((b[i+7]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 32))))];
        case 0x9841: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))), $0.shr(new i8(new u8(b[i+7]))).or($0.shl(new u8(((((-((b[i+7]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 32))))];
        case 0x2040: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shl(new i8(new u8(b[i+7]))))];
        case 0xa040: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))), $0.shl(new i8(new u8(b[i+7]))))];
        case 0x2041: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shl(new i8(new u8(b[i+7]))))];
        case 0xa041: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))), $0.shl(new i8(new u8(b[i+7]))))];
        case 0x2840: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), new u8($0).shr(new i8(new u8(b[i+7]))))];
        case 0xa840: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))), new u8($0).shr(new i8(new u8(b[i+7]))))];
        case 0x2841: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), new u32($0).shr(new i8(new u8(b[i+7]))))];
        case 0xa841: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))), new u32($0).shr(new i8(new u8(b[i+7]))))];
        case 0x3040: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shl(new i8(new u8(b[i+7]))))];
        case 0xb040: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))), $0.shl(new i8(new u8(b[i+7]))))];
        case 0x3041: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shl(new i8(new u8(b[i+7]))))];
        case 0xb041: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))), $0.shl(new i8(new u8(b[i+7]))))];
        case 0x3840: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), new i8($0).shr(new i8(new u8(b[i+7]))))];
        case 0xb840: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))), new i8($0).shr(new i8(new u8(b[i+7]))))];
        case 0x3841: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), new i32($0).shr(new i8(new u8(b[i+7]))))];
        case 0xb841: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))), new i32($0).shr(new i8(new u8(b[i+7]))))];
        case 0x76: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(R1[2], new Mem8(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))).and(new i8(new u8(b[i+7]))).eq(new i8(0))), new Mov(R1[1], new u1(0)), new Mov(R1[0], new u1(0))];
        case 0x8076: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(R1[2], new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))))).and(new i8(new u8(b[i+7]))).eq(new i8(0))), new Mov(R1[1], new u1(0)), new Mov(R1[0], new u1(0))];
        case 0x4077: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(R1[2], new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3])))))).and(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0)))).eq(new i32(0))), new Mov(R1[1], new u1(0)), new Mov(R1[0], new u1(0))];
    }

    if((((((((b[i] & 248) & 0xff) >> 3) & 0xff) | ((((b[i+1] & 7) & 0xff) << 5) & 0xff)) & 0xff) & 0xf1) == 0x90)
    switch(((b[i] | ((b[i+1] << 8) & 0xffff)) & 0xffff) & 0xf877) {
        case 0x8000: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.add(new i8(new u8(b[i+7]))))];
        case 0x4001: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))), $0.add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0)))))];
        case 0x8002: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.add(new i8(new u8(b[i+7]))))];
        case 0x8003: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.add(new i8(new u8(b[i+7]))))];
        case 0x8800: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), new u8(new u8(b[i+7])).or($0))];
        case 0x4801: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))), new u32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))).or($0))];
        case 0x8802: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), new u8(new u8(b[i+7])).or($0))];
        case 0x8803: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), new u32(new i8(new u8(b[i+7]))).or($0))];
        case 0x9000: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.add(new i8(new u8(b[i+7]))).add(R1[1]))];
        case 0x5001: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))), $0.add(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0)))).add(R1[1]))];
        case 0x9002: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.add(new i8(new u8(b[i+7]))).add(R1[1]))];
        case 0x9003: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.add(new i8(new u8(b[i+7]))).add(R1[1]))];
        case 0x9800: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.add(new i8(-((b[i+7]) << 24 >> 24))).add(new i8(R1[1]).neg()))];
        case 0x5801: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))), $0.add(new i32(-((((((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0)) >>> 0)) >> 0))).add(new i32(R1[1]).neg()))];
        case 0x9802: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.add(new i8(-((b[i+7]) << 24 >> 24))).add(new i8(R1[1]).neg()))];
        case 0x9803: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.add(new i32(-((((b[i+7]) << 24 >> 24)) >> 0))).add(new i32(R1[1]).neg()))];
        case 0xa000: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), new u8(new u8(b[i+7])).and($0))];
        case 0x6001: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))), new u32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))).and($0))];
        case 0xa002: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), new u8(new u8(b[i+7])).and($0))];
        case 0xa003: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), new u32(new i8(new u8(b[i+7]))).and($0))];
        case 0xa800: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(R1[2], ($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))).eq(new i8(new u8(b[i+7])))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add(new i8(-((b[i+7]) << 24 >> 24))))];
        case 0x6801: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(R1[2], ($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))).eq(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add(new i32(-((((((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0)) >>> 0)) >> 0))))];
        case 0xa802: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(R1[2], ($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))).eq(new i8(new u8(b[i+7])))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add(new i8(-((b[i+7]) << 24 >> 24))))];
        case 0xa803: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(R1[2], ($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))).eq(new i32(new i8(new u8(b[i+7]))))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add(new i32(-((((b[i+7]) << 24 >> 24)) >> 0))))];
        case 0xb000: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.xor(new i8(new u8(b[i+7]))))];
        case 0x7001: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))), $0.xor(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0)))))];
        case 0xb002: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.xor(new i8(new u8(b[i+7]))))];
        case 0xb003: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.xor(new i8(new u8(b[i+7]))))];
        case 0xb800: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(R1[2], new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))).eq(new i8(new u8(b[i+7])))), new Mov(R1[1], new u1(0))];
        case 0x7801: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(R1[2], new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3])))).eq(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))), new Mov(R1[1], new u1(0))];
        case 0xb802: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(R1[2], new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))).eq(new i8(new u8(b[i+7])))), new Mov(R1[1], new u1(0))];
        case 0xb803: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(R1[2], new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))).eq(new i32(new i8(new u8(b[i+7]))))), new Mov(R1[1], new u1(0))];
        case 0x8046: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), new i8(new u8(b[i+7])))];
        case 0x4047: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3])))), new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0))))];
        case 0x8040: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shl(new i8(new u8(b[i+7]))).or($0.shr(new u8(((((-((b[i+7]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 8))))];
        case 0x8041: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shl(new i8(new u8(b[i+7]))).or($0.shr(new u8(((((-((b[i+7]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 32))))];
        case 0x8840: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shr(new i8(new u8(b[i+7]))).or($0.shl(new u8(((((-((b[i+7]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 8))))];
        case 0x8841: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shr(new i8(new u8(b[i+7]))).or($0.shl(new u8(((((-((b[i+7]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 32))))];
        case 0x9040: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shl(new i8(new u8(b[i+7]))).or($0.shr(new u8(((((-((b[i+7]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 8))))];
        case 0x9041: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shl(new i8(new u8(b[i+7]))).or($0.shr(new u8(((((-((b[i+7]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 32))))];
        case 0x9840: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shr(new i8(new u8(b[i+7]))).or($0.shl(new u8(((((-((b[i+7]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 8))))];
        case 0x9841: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shr(new i8(new u8(b[i+7]))).or($0.shl(new u8(((((-((b[i+7]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 32))))];
        case 0xa040: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shl(new i8(new u8(b[i+7]))))];
        case 0xa041: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shl(new i8(new u8(b[i+7]))))];
        case 0xa840: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), new u8($0).shr(new i8(new u8(b[i+7]))))];
        case 0xa841: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), new u32($0).shr(new i8(new u8(b[i+7]))))];
        case 0xb040: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shl(new i8(new u8(b[i+7]))))];
        case 0xb041: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shl(new i8(new u8(b[i+7]))))];
        case 0xb840: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), new i8($0).shr(new i8(new u8(b[i+7]))))];
        case 0xb841: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), new i32($0).shr(new i8(new u8(b[i+7]))))];
        case 0x8076: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(R1[2], new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))).and(new i8(new u8(b[i+7]))).eq(new i8(0))), new Mov(R1[1], new u1(0)), new Mov(R1[0], new u1(0))];
        case 0x4077: return [((((_pfxLength) & 0xff) + 8) & 0xff), new Mov(R1[2], new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3])))).and(new i32(new u32(((((b[i+4] | ((b[i+5] << 8) >>> 0)) >>> 0) | ((b[i+6] << 16) >>> 0)) >>> 0) | ((b[i+7] << 24) >>> 0)))).eq(new i32(0))), new Mov(R1[1], new u1(0)), new Mov(R1[0], new u1(0))];
    }

    if((((((b[i] | ((b[i+1] << 8) >>> 0)) >>> 0) | ((b[i+2] << 16) >>> 0)) >>> 0) & 0xc7c0ff) == 0x5800f)
    switch(((b[i+1] & 63) & 0xff) & 0x3f) {
        case 0x10: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(new Mem8(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))), R1[0])];
        case 0x11: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(new Mem8(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))), R1[0].not())];
        case 0x12: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(new Mem8(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))), R1[1])];
        case 0x13: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(new Mem8(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))), R1[1].not())];
        case 0x14: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(new Mem8(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))), R1[2])];
        case 0x15: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(new Mem8(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))), R1[2].not())];
        case 0x16: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(new Mem8(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))), R1[1].or(R1[2]))];
        case 0x17: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(new Mem8(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))), R1[1].not().and(R1[2].not()))];
        case 0x18: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(new Mem8(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))), R1[3])];
        case 0x19: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(new Mem8(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))), R1[3].not())];
        case 0x1a: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(new Mem8(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))), R1[4])];
        case 0x1b: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(new Mem8(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))), R1[4].not())];
        case 0x1c: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(new Mem8(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))), R1[0].eq(R1[3]).not())];
        case 0x1d: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(new Mem8(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))), R1[0].eq(R1[3]))];
        case 0x1e: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(new Mem8(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))), R1[0].eq(R1[3]).not().or(R1[2]))];
        case 0x1f: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(new Mem8(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))), R1[0].eq(R1[3]).and(R1[2].not()))];
        case 0x23: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R1[1], new u32(1).shl(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).and(new Mem32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))).eq(new u8(0)).not())];
        case 0x25: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))), $0.shl(($1 = R8[1])).or(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shr(new u8($1.neg()).add(new u8(32)))))];
        case 0x2b: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R1[1], new u32(1).shl(($1 = R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])).and(($0 = new Mem32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))).eq(new u8(0)).not()), new Mov($0, new u32(1).shl($1).or($0))];
        case 0x2d: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($1 = new Mem32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))), new u32(1).shl(($0 = R8[1])).add(new i32(-1)).shl(new u8($0.neg()).add(new u8(32))).and(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).or($1.shr($0)))];
        case 0x2f: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])), $0.mul(new i32(new Mem32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))))];
        case 0x36: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new Mem8(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))];
        case 0x37: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new Mem16(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))];
        case 0x3e: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new i32(new Mem8(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))];
        case 0x3f: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new i32(new Mem16(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))];
    }

    if((((((b[i] | ((b[i+1] << 8) >>> 0)) >>> 0) | ((b[i+2] << 16) >>> 0)) >>> 0) & 0xc0c0ff) == 0x80800f)
    switch(((b[i+1] & 63) & 0xff) & 0x3f) {
        case 0x10: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), R1[0])];
        case 0x11: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), R1[0].not())];
        case 0x12: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), R1[1])];
        case 0x13: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), R1[1].not())];
        case 0x14: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), R1[2])];
        case 0x15: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), R1[2].not())];
        case 0x16: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), R1[1].or(R1[2]))];
        case 0x17: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), R1[1].not().and(R1[2].not()))];
        case 0x18: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), R1[3])];
        case 0x19: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), R1[3].not())];
        case 0x1a: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), R1[4])];
        case 0x1b: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), R1[4].not())];
        case 0x1c: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), R1[0].eq(R1[3]).not())];
        case 0x1d: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), R1[0].eq(R1[3]))];
        case 0x1e: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), R1[0].eq(R1[3]).not().or(R1[2]))];
        case 0x1f: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), R1[0].eq(R1[3]).and(R1[2].not()))];
        case 0x23: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R1[1], new u32(1).shl(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).and(new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))).eq(new u8(0)).not())];
        case 0x25: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shl(($1 = R8[1])).or(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shr(new u8($1.neg()).add(new u8(32)))))];
        case 0x2b: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R1[1], new u32(1).shl(($1 = R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])).and(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))))).eq(new u8(0)).not()), new Mov($0, new u32(1).shl($1).or($0))];
        case 0x2d: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($1 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), new u32(1).shl(($0 = R8[1])).add(new i32(-1)).shl(new u8($0.neg()).add(new u8(32))).and(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).or($1.shr($0)))];
        case 0x2f: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])), $0.mul(new i32(new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))))))];
        case 0x36: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))))];
        case 0x37: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new Mem16(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))))];
        case 0x3e: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new i32(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))];
        case 0x3f: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new i32(new Mem16(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))];
    }

    if((b[i] & 0xfd) == 0x69)
    switch(((((((b[i] & 254) & 0xffff) >> 1) & 0xffff) | ((b[i+1] << 7) & 0xffff)) & 0xffff) & 0x6001) {
        case 0x2000: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2])))).mul(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))];
        case 0x4001: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0))))).mul(new i32(new i8(new u8(b[i+6])))))];
    }

    if((((((((((b[i] & 128) & 0xffff) >> 7) & 0xffff) | ((b[i+1] << 1) & 0xffff)) & 0xffff) | ((((b[i+2] & 63) & 0xffff) << 9) & 0xffff)) & 0xffff) & 0x7e8f) == 0x4a09)
    switch(((b[i] | ((b[i+1] << 8) & 0xffff)) & 0xffff) & 0xb87f) {
        case 0xf: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(new Mem32(new u32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))), new Mem32(($0 = R32[4]))), new Mov($0, $0.add(new u8(4)))];
        case 0x800f: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(new Mem32(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), new Mem32(($0 = R32[4]))), new Mov($0, $0.add(new u8(4)))];
        case 0x50: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), $0.shl(new u8(1)).or($0.shr(new u8(7))))];
        case 0x8050: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shl(new u8(1)).or($0.shr(new u8(7))))];
        case 0x51: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(new u32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), $0.shl(new u8(1)).or($0.shr(new u8(31))))];
        case 0x8051: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shl(new u8(1)).or($0.shr(new u8(31))))];
        case 0x52: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), $0.shl(($1 = R8[1])).or($0.shr(new u8($1.neg()).add(new u8(8)))))];
        case 0x8052: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shl(($1 = R8[1])).or($0.shr(new u8($1.neg()).add(new u8(8)))))];
        case 0x53: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(new u32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), $0.shl(($1 = R8[1])).or($0.shr(new u8($1.neg()).add(new u8(32)))))];
        case 0x8053: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shl(($1 = R8[1])).or($0.shr(new u8($1.neg()).add(new u8(32)))))];
        case 0x850: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), $0.shr(new u8(1)).or($0.shl(new u8(7))))];
        case 0x8850: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shr(new u8(1)).or($0.shl(new u8(7))))];
        case 0x851: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(new u32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), $0.shr(new u8(1)).or($0.shl(new u8(31))))];
        case 0x8851: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shr(new u8(1)).or($0.shl(new u8(31))))];
        case 0x852: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), $0.shr(($1 = R8[1])).or($0.shl(new u8($1.neg()).add(new u8(8)))))];
        case 0x8852: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shr(($1 = R8[1])).or($0.shl(new u8($1.neg()).add(new u8(8)))))];
        case 0x853: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(new u32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), $0.shr(($1 = R8[1])).or($0.shl(new u8($1.neg()).add(new u8(32)))))];
        case 0x8853: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shr(($1 = R8[1])).or($0.shl(new u8($1.neg()).add(new u8(32)))))];
        case 0x1050: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), $0.shl(new u8(1)).or($0.shr(new u8(7))))];
        case 0x9050: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shl(new u8(1)).or($0.shr(new u8(7))))];
        case 0x1051: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(new u32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), $0.shl(new u8(1)).or($0.shr(new u8(31))))];
        case 0x9051: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shl(new u8(1)).or($0.shr(new u8(31))))];
        case 0x1052: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), $0.shl(($1 = R8[1])).or($0.shr(new u8($1.neg()).add(new u8(8)))))];
        case 0x9052: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shl(($1 = R8[1])).or($0.shr(new u8($1.neg()).add(new u8(8)))))];
        case 0x1053: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(new u32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), $0.shl(($1 = R8[1])).or($0.shr(new u8($1.neg()).add(new u8(32)))))];
        case 0x9053: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shl(($1 = R8[1])).or($0.shr(new u8($1.neg()).add(new u8(32)))))];
        case 0x1850: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), $0.shr(new u8(1)).or($0.shl(new u8(7))))];
        case 0x9850: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shr(new u8(1)).or($0.shl(new u8(7))))];
        case 0x1851: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(new u32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), $0.shr(new u8(1)).or($0.shl(new u8(31))))];
        case 0x9851: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shr(new u8(1)).or($0.shl(new u8(31))))];
        case 0x1852: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), $0.shr(($1 = R8[1])).or($0.shl(new u8($1.neg()).add(new u8(8)))))];
        case 0x9852: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shr(($1 = R8[1])).or($0.shl(new u8($1.neg()).add(new u8(8)))))];
        case 0x1853: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(new u32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), $0.shr(($1 = R8[1])).or($0.shl(new u8($1.neg()).add(new u8(32)))))];
        case 0x9853: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shr(($1 = R8[1])).or($0.shl(new u8($1.neg()).add(new u8(32)))))];
        case 0x2050: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), $0.shl(new u8(1)))];
        case 0xa050: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shl(new u8(1)))];
        case 0x2051: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(new u32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), $0.shl(new u8(1)))];
        case 0xa051: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shl(new u8(1)))];
        case 0x2052: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), $0.shl(R8[1]))];
        case 0xa052: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shl(R8[1]))];
        case 0x2053: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(new u32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), $0.shl(R8[1]))];
        case 0xa053: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shl(R8[1]))];
        case 0x2850: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), new u8($0).shr(new u8(1)))];
        case 0xa850: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), new u8($0).shr(new u8(1)))];
        case 0x2851: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(new u32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), new u32($0).shr(new u8(1)))];
        case 0xa851: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), new u32($0).shr(new u8(1)))];
        case 0x2852: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), new u8($0).shr(R8[1]))];
        case 0xa852: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), new u8($0).shr(R8[1]))];
        case 0x2853: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(new u32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), new u32($0).shr(R8[1]))];
        case 0xa853: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), new u32($0).shr(R8[1]))];
        case 0x3050: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), $0.shl(new u8(1)))];
        case 0xb050: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shl(new u8(1)))];
        case 0x3051: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(new u32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), $0.shl(new u8(1)))];
        case 0xb051: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shl(new u8(1)))];
        case 0x3052: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), $0.shl(R8[1]))];
        case 0xb052: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shl(R8[1]))];
        case 0x3053: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(new u32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), $0.shl(R8[1]))];
        case 0xb053: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shl(R8[1]))];
        case 0x3850: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), new i8($0).shr(new u8(1)))];
        case 0xb850: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), new i8($0).shr(new u8(1)))];
        case 0x3851: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(new u32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), new i32($0).shr(new u8(1)))];
        case 0xb851: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), new i32($0).shr(new u8(1)))];
        case 0x3852: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), new i8($0).shr(R8[1]))];
        case 0xb852: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), new i8($0).shr(R8[1]))];
        case 0x3853: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(new u32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), new i32($0).shr(R8[1]))];
        case 0xb853: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), new i32($0).shr(R8[1]))];
        case 0x1076: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), $0.not())];
        case 0x9076: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.not())];
        case 0x1077: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(new u32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), $0.not())];
        case 0x9077: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.not())];
        case 0x1876: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R1[1], new u1(0)), new Mov(($0 = new Mem8(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), $0.neg())];
        case 0x9876: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R1[1], new u1(0)), new Mov(($0 = new Mem8(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.neg())];
        case 0x1877: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R1[1], new u1(0)), new Mov(($0 = new Mem32(new u32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), $0.neg())];
        case 0x9877: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R1[1], new u1(0)), new Mov(($0 = new Mem32(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.neg())];
        case 0x2076: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R16[0], R8[0].mul(new Mem8(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))))];
        case 0xa076: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R16[0], R8[0].mul(new Mem8(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))];
        case 0x2077: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = R32[0]), $0.mul(new Mem32(new u32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))))];
        case 0xa077: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = R32[0]), $0.mul(new Mem32(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))];
        case 0x2876: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R16[0], R8[0].mul(new Mem8(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))))];
        case 0xa876: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R16[0], R8[0].mul(new Mem8(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))];
        case 0x2877: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = R32[0]), $0.mul(new Mem32(new u32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))))];
        case 0xa877: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = R32[0]), $0.mul(new Mem32(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))];
        case 0x3076: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R16[0], R8[0].div(new Mem8(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))))];
        case 0xb076: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R16[0], R8[0].div(new Mem8(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))];
        case 0x3077: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = R32[0]), $0.div(new Mem32(new u32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))))];
        case 0xb077: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = R32[0]), $0.div(new Mem32(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))];
        case 0x3876: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R16[0], R8[0].div(new Mem8(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))))];
        case 0xb876: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R16[0], R8[0].div(new Mem8(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))];
        case 0x3877: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = R32[0]), $0.div(new Mem32(new u32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))))];
        case 0xb877: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = R32[0]), $0.div(new Mem32(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))];
        case 0x7e: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), new u8($0).add(new u8(1)))];
        case 0x807e: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), new u8($0).add(new u8(1)))];
        case 0x7f: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(new u32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), $0.add(new u8(1)))];
        case 0x807f: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.add(new u8(1)))];
        case 0x87e: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), $0.add(new i8(-1)))];
        case 0x887e: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.add(new i8(-1)))];
        case 0x87f: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(new u32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), $0.add(new i32(-1)))];
        case 0x887f: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.add(new i32(-1)))];
        case 0x107f: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = R32[4]), $0.add(new i32(-4))), new Mov(new Mem32($0), ($1 = R32[8]).add(new i8(_pfxLength + 7))), new Mov($1, new Mem32(new u32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))];
        case 0x907f: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = R32[4]), $0.add(new i32(-4))), new Mov(new Mem32($0), ($1 = R32[8]).add(new i8(_pfxLength + 7))), new Mov($1, new Mem32(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))))];
        case 0x207f: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R32[8], new Mem32(new u32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))];
        case 0xa07f: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R32[8], new Mem32(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))))];
        case 0x307f: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = R32[4]), $0.add(new i32(-4))), new Mov(new Mem32($0), new Mem32(new u32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))];
        case 0xb07f: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = R32[4]), $0.add(new i32(-4))), new Mov(new Mem32($0), new Mem32(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))))];
    }

    if((((((((((b[i] & 192) & 0xffff) >> 6) & 0xffff) | ((b[i+1] << 2) & 0xffff)) & 0xffff) | ((((b[i+2] & 63) & 0xffff) << 10) & 0xffff)) & 0xffff) & 0xfd1d) == 0x9410)
    switch(((b[i] | ((b[i+1] << 8) & 0xffff)) & 0xffff) & 0x80bf) {
        case 0x0: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), $0.add(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x8000: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.add(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x1: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(new u32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), $0.add(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x8001: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.add(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x2: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.add(new Mem8(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))))];
        case 0x8002: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.add(new Mem8(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))];
        case 0x3: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.add(new Mem32(new u32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))))];
        case 0x8003: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.add(new Mem32(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))];
        case 0x8: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), $0.or(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x8008: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.or(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x9: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(new u32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), $0.or(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x8009: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.or(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0xa: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.or(new Mem8(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))))];
        case 0x800a: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.or(new Mem8(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))];
        case 0xb: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.or(new Mem32(new u32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))))];
        case 0x800b: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.or(new Mem32(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))];
        case 0x10: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), $0.add(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).add(R1[1]))];
        case 0x8010: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.add(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).add(R1[1]))];
        case 0x11: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(new u32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), $0.add(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).add(R1[1]))];
        case 0x8011: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.add(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).add(R1[1]))];
        case 0x12: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.add(new Mem8(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))).add(R1[1]))];
        case 0x8012: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.add(new Mem8(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))).add(R1[1]))];
        case 0x13: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.add(new Mem32(new u32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))).add(R1[1]))];
        case 0x8013: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.add(new Mem32(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))).add(R1[1]))];
        case 0x18: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), $0.add(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].neg()).add(new i8(R1[1]).neg()))];
        case 0x8018: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.add(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].neg()).add(new i8(R1[1]).neg()))];
        case 0x19: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(new u32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), $0.add(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].neg()).add(new i32(R1[1]).neg()))];
        case 0x8019: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.add(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].neg()).add(new i32(R1[1]).neg()))];
        case 0x1a: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.add(new Mem8(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))).neg()).add(new i8(R1[1]).neg()))];
        case 0x801a: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.add(new Mem8(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))).neg()).add(new i8(R1[1]).neg()))];
        case 0x1b: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.add(new Mem32(new u32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))).neg()).add(new i32(R1[1]).neg()))];
        case 0x801b: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.add(new Mem32(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))).neg()).add(new i32(R1[1]).neg()))];
        case 0x20: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), $0.and(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x8020: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.and(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x21: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(new u32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), $0.and(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x8021: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.and(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x22: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.and(new Mem8(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))))];
        case 0x8022: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.and(new Mem8(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))];
        case 0x23: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.and(new Mem32(new u32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))))];
        case 0x8023: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.and(new Mem32(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))];
        case 0x28: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R1[2], ($0 = new Mem8(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))).eq(($1 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add($1.neg()))];
        case 0x8028: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R1[2], ($0 = new Mem8(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))).eq(($1 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add($1.neg()))];
        case 0x29: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R1[2], ($0 = new Mem32(new u32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))).eq(($1 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add($1.neg()))];
        case 0x8029: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R1[2], ($0 = new Mem32(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))).eq(($1 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add($1.neg()))];
        case 0x2a: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R1[2], ($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).eq(($1 = new Mem8(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add($1.neg()))];
        case 0x802a: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R1[2], ($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).eq(($1 = new Mem8(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add($1.neg()))];
        case 0x2b: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R1[2], ($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).eq(($1 = new Mem32(new u32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add($1.neg()))];
        case 0x802b: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R1[2], ($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).eq(($1 = new Mem32(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add($1.neg()))];
        case 0x30: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), $0.xor(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x8030: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.xor(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x31: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(new u32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), $0.xor(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x8031: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.xor(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x32: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.xor(new Mem8(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))))];
        case 0x8032: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.xor(new Mem8(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))];
        case 0x33: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.xor(new Mem32(new u32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))))];
        case 0x8033: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.xor(new Mem32(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))];
        case 0x38: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R1[2], new Mem8(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))).eq(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])), new Mov(R1[1], new u1(0))];
        case 0x8038: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R1[2], new Mem8(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))).eq(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])), new Mov(R1[1], new u1(0))];
        case 0x39: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R1[2], new Mem32(new u32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))).eq(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])), new Mov(R1[1], new u1(0))];
        case 0x8039: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R1[2], new Mem32(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))).eq(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])), new Mov(R1[1], new u1(0))];
        case 0x3a: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R1[2], R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].eq(new Mem8(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), new Mov(R1[1], new u1(0))];
        case 0x803a: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R1[2], R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].eq(new Mem8(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))))), new Mov(R1[1], new u1(0))];
        case 0x3b: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R1[2], R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].eq(new Mem32(new u32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), new Mov(R1[1], new u1(0))];
        case 0x803b: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R1[2], R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].eq(new Mem32(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))))), new Mov(R1[1], new u1(0))];
        case 0x84: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R1[2], new Mem8(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))).and(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).eq(new i8(0))), new Mov(R1[1], new u1(0)), new Mov(R1[0], new u1(0))];
        case 0x8084: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R1[2], new Mem8(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))).and(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).eq(new i8(0))), new Mov(R1[1], new u1(0)), new Mov(R1[0], new u1(0))];
        case 0x85: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R1[2], new Mem32(new u32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))).and(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).eq(new i32(0))), new Mov(R1[1], new u1(0)), new Mov(R1[0], new u1(0))];
        case 0x8085: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R1[2], new Mem32(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))).and(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).eq(new i32(0))), new Mov(R1[1], new u1(0)), new Mov(R1[0], new u1(0))];
        case 0x86: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($2 = new Register8), ($0 = new Mem8(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), new Mov($0, ($1 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])), new Mov($1, $2)];
        case 0x8086: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($2 = new Register8), ($0 = new Mem8(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))))), new Mov($0, ($1 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])), new Mov($1, $2)];
        case 0x87: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($2 = new Register32), ($0 = new Mem32(new u32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), new Mov($0, ($1 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])), new Mov($1, $2)];
        case 0x8087: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($2 = new Register32), ($0 = new Mem32(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))))), new Mov($0, ($1 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])), new Mov($1, $2)];
        case 0x88: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(new Mem8(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))), R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])];
        case 0x8088: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(new Mem8(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])];
        case 0x89: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(new Mem32(new u32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))), R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])];
        case 0x8089: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(new Mem32(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])];
        case 0x8a: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new Mem8(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))];
        case 0x808a: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new Mem8(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))))];
        case 0x8b: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new Mem32(new u32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))];
        case 0x808b: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new Mem32(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))))];
        case 0x8c: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(new Mem32(new u32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))), R16[((((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff) + 16) & 0xff)])];
        case 0x808c: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(new Mem32(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), R16[((((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff) + 16) & 0xff)])];
        case 0x8d: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new u32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))];
        case 0x808d: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))];
        case 0x8e: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R16[((((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff) + 16) & 0xff)], new Mem16(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))];
        case 0x808e: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R16[((((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff) + 16) & 0xff)], new Mem16(R32[5].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))))];
    }

    if((((((((((b[i] & 128) & 0xffff) >> 7) & 0xffff) | ((b[i+1] << 1) & 0xffff)) & 0xffff) | ((((b[i+2] & 63) & 0xffff) << 9) & 0xffff)) & 0xffff) & 0x708f) == 0x4009)
    switch(((b[i] | ((b[i+1] << 8) & 0xffff)) & 0xffff) & 0xb87f) {
        case 0x1: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])), $0.add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))];
        case 0x801: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])), new u32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))).or($0))];
        case 0x1001: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])), $0.add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))).add(R1[1]))];
        case 0x1801: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])), $0.add(new i32(-((((((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)) >>> 0)) >> 0))).add(new i32(R1[1]).neg()))];
        case 0x2001: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])), new u32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))).and($0))];
        case 0x2801: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R1[2], ($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])).eq(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add(new i32(-((((((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)) >>> 0)) >> 0))))];
        case 0x3001: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])), $0.xor(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))];
        case 0x3801: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R1[2], new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)]).eq(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), new Mov(R1[1], new u1(0))];
        case 0x800f: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), new Mem32(($0 = R32[4]))), new Mov($0, $0.add(new u8(4)))];
        case 0x47: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)]), new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))];
        case 0x8050: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shl(new u8(1)).or($0.shr(new u8(7))))];
        case 0x8051: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shl(new u8(1)).or($0.shr(new u8(31))))];
        case 0x8052: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shl(($1 = R8[1])).or($0.shr(new u8($1.neg()).add(new u8(8)))))];
        case 0x8053: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shl(($1 = R8[1])).or($0.shr(new u8($1.neg()).add(new u8(32)))))];
        case 0x8850: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shr(new u8(1)).or($0.shl(new u8(7))))];
        case 0x8851: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shr(new u8(1)).or($0.shl(new u8(31))))];
        case 0x8852: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shr(($1 = R8[1])).or($0.shl(new u8($1.neg()).add(new u8(8)))))];
        case 0x8853: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shr(($1 = R8[1])).or($0.shl(new u8($1.neg()).add(new u8(32)))))];
        case 0x9050: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shl(new u8(1)).or($0.shr(new u8(7))))];
        case 0x9051: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shl(new u8(1)).or($0.shr(new u8(31))))];
        case 0x9052: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shl(($1 = R8[1])).or($0.shr(new u8($1.neg()).add(new u8(8)))))];
        case 0x9053: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shl(($1 = R8[1])).or($0.shr(new u8($1.neg()).add(new u8(32)))))];
        case 0x9850: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shr(new u8(1)).or($0.shl(new u8(7))))];
        case 0x9851: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shr(new u8(1)).or($0.shl(new u8(31))))];
        case 0x9852: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shr(($1 = R8[1])).or($0.shl(new u8($1.neg()).add(new u8(8)))))];
        case 0x9853: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shr(($1 = R8[1])).or($0.shl(new u8($1.neg()).add(new u8(32)))))];
        case 0xa050: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shl(new u8(1)))];
        case 0xa051: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shl(new u8(1)))];
        case 0xa052: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shl(R8[1]))];
        case 0xa053: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shl(R8[1]))];
        case 0xa850: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), new u8($0).shr(new u8(1)))];
        case 0xa851: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), new u32($0).shr(new u8(1)))];
        case 0xa852: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), new u8($0).shr(R8[1]))];
        case 0xa853: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), new u32($0).shr(R8[1]))];
        case 0xb050: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shl(new u8(1)))];
        case 0xb051: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shl(new u8(1)))];
        case 0xb052: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shl(R8[1]))];
        case 0xb053: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shl(R8[1]))];
        case 0xb850: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), new i8($0).shr(new u8(1)))];
        case 0xb851: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), new i32($0).shr(new u8(1)))];
        case 0xb852: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), new i8($0).shr(R8[1]))];
        case 0xb853: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), new i32($0).shr(R8[1]))];
        case 0x77: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R1[2], new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)]).and(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))).eq(new i32(0))), new Mov(R1[1], new u1(0)), new Mov(R1[0], new u1(0))];
        case 0x9076: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.not())];
        case 0x9077: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.not())];
        case 0x9876: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R1[1], new u1(0)), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.neg())];
        case 0x9877: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R1[1], new u1(0)), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.neg())];
        case 0xa076: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R16[0], R8[0].mul(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))];
        case 0xa077: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = R32[0]), $0.mul(new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))];
        case 0xa876: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R16[0], R8[0].mul(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))];
        case 0xa877: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = R32[0]), $0.mul(new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))];
        case 0xb076: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R16[0], R8[0].div(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))];
        case 0xb077: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = R32[0]), $0.div(new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))];
        case 0xb876: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R16[0], R8[0].div(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))];
        case 0xb877: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = R32[0]), $0.div(new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))];
        case 0x807e: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), new u8($0).add(new u8(1)))];
        case 0x807f: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.add(new u8(1)))];
        case 0x887e: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.add(new i8(-1)))];
        case 0x887f: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.add(new i32(-1)))];
        case 0x907f: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = R32[4]), $0.add(new i32(-4))), new Mov(new Mem32($0), ($1 = R32[8]).add(new i8(_pfxLength + 7))), new Mov($1, new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))))];
        case 0xa07f: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R32[8], new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))))];
        case 0xb07f: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = R32[4]), $0.add(new i32(-4))), new Mov(new Mem32($0), new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))))];
    }

    if((((b[i+1] | ((((b[i+2] & 63) & 0xffff) << 8) & 0xffff)) & 0xffff) & 0x3847) == 0x2004)
    switch(((b[i] | ((b[i+1] << 8) & 0xffff)) & 0xffff) & 0x80ff) {
        case 0x8000: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.add(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x8001: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.add(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x8002: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.add(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))];
        case 0x8003: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.add(new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))];
        case 0x8008: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.or(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x8009: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.or(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x800a: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.or(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))];
        case 0x800b: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.or(new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))];
        case 0x8010: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.add(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).add(R1[1]))];
        case 0x8011: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.add(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).add(R1[1]))];
        case 0x8012: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.add(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))).add(R1[1]))];
        case 0x8013: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.add(new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))).add(R1[1]))];
        case 0x8018: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.add(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].neg()).add(new i8(R1[1]).neg()))];
        case 0x8019: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.add(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].neg()).add(new i32(R1[1]).neg()))];
        case 0x801a: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.add(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))).neg()).add(new i8(R1[1]).neg()))];
        case 0x801b: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.add(new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))).neg()).add(new i32(R1[1]).neg()))];
        case 0x8020: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.and(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x8021: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.and(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x8022: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.and(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))];
        case 0x8023: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.and(new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))];
        case 0x8028: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R1[2], ($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))).eq(($1 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add($1.neg()))];
        case 0x8029: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R1[2], ($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))).eq(($1 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add($1.neg()))];
        case 0x802a: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R1[2], ($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).eq(($1 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add($1.neg()))];
        case 0x802b: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R1[2], ($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).eq(($1 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add($1.neg()))];
        case 0x8030: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.xor(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x8031: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.xor(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x8032: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.xor(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))];
        case 0x8033: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.xor(new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))];
        case 0x8038: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R1[2], new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))).eq(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])), new Mov(R1[1], new u1(0))];
        case 0x8039: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R1[2], new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))).eq(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])), new Mov(R1[1], new u1(0))];
        case 0x803a: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R1[2], R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].eq(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))))), new Mov(R1[1], new u1(0))];
        case 0x803b: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R1[2], R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].eq(new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))))), new Mov(R1[1], new u1(0))];
        case 0x69: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)]).mul(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))];
        case 0x8084: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R1[2], new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))).and(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).eq(new i8(0))), new Mov(R1[1], new u1(0)), new Mov(R1[0], new u1(0))];
        case 0x8085: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R1[2], new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))).and(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).eq(new i32(0))), new Mov(R1[1], new u1(0)), new Mov(R1[0], new u1(0))];
        case 0x8086: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($2 = new Register8), ($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))))), new Mov($0, ($1 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])), new Mov($1, $2)];
        case 0x8087: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($2 = new Register32), ($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))))), new Mov($0, ($1 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])), new Mov($1, $2)];
        case 0x8088: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])];
        case 0x8089: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])];
        case 0x808a: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))))];
        case 0x808b: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))))];
        case 0x808c: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), R16[((((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff) + 16) & 0xff)])];
        case 0x808d: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))];
        case 0x808e: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R16[((((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff) + 16) & 0xff)], new Mem16(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))))];
    }

    if((((((((((b[i] & 128) & 0xffff) >> 7) & 0xffff) | ((b[i+1] << 1) & 0xffff)) & 0xffff) | ((((b[i+2] & 7) & 0xffff) << 9) & 0xffff)) & 0xffff) & 0xe8f) == 0xa09)
    switch(((b[i] | ((b[i+1] << 8) & 0xffff)) & 0xffff) & 0xb87f) {
        case 0xf: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(new Mem32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), new Mem32(($0 = R32[4]))), new Mov($0, $0.add(new u8(4)))];
        case 0x800f: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))))), new Mem32(($0 = R32[4]))), new Mov($0, $0.add(new u8(4)))];
        case 0x50: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shl(new u8(1)).or($0.shr(new u8(7))))];
        case 0x8050: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))), $0.shl(new u8(1)).or($0.shr(new u8(7))))];
        case 0x51: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shl(new u8(1)).or($0.shr(new u8(31))))];
        case 0x8051: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))), $0.shl(new u8(1)).or($0.shr(new u8(31))))];
        case 0x52: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shl(($1 = R8[1])).or($0.shr(new u8($1.neg()).add(new u8(8)))))];
        case 0x8052: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))), $0.shl(($1 = R8[1])).or($0.shr(new u8($1.neg()).add(new u8(8)))))];
        case 0x53: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shl(($1 = R8[1])).or($0.shr(new u8($1.neg()).add(new u8(32)))))];
        case 0x8053: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))), $0.shl(($1 = R8[1])).or($0.shr(new u8($1.neg()).add(new u8(32)))))];
        case 0x850: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shr(new u8(1)).or($0.shl(new u8(7))))];
        case 0x8850: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))), $0.shr(new u8(1)).or($0.shl(new u8(7))))];
        case 0x851: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shr(new u8(1)).or($0.shl(new u8(31))))];
        case 0x8851: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))), $0.shr(new u8(1)).or($0.shl(new u8(31))))];
        case 0x852: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shr(($1 = R8[1])).or($0.shl(new u8($1.neg()).add(new u8(8)))))];
        case 0x8852: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))), $0.shr(($1 = R8[1])).or($0.shl(new u8($1.neg()).add(new u8(8)))))];
        case 0x853: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shr(($1 = R8[1])).or($0.shl(new u8($1.neg()).add(new u8(32)))))];
        case 0x8853: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))), $0.shr(($1 = R8[1])).or($0.shl(new u8($1.neg()).add(new u8(32)))))];
        case 0x1050: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shl(new u8(1)).or($0.shr(new u8(7))))];
        case 0x9050: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))), $0.shl(new u8(1)).or($0.shr(new u8(7))))];
        case 0x1051: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shl(new u8(1)).or($0.shr(new u8(31))))];
        case 0x9051: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))), $0.shl(new u8(1)).or($0.shr(new u8(31))))];
        case 0x1052: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shl(($1 = R8[1])).or($0.shr(new u8($1.neg()).add(new u8(8)))))];
        case 0x9052: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))), $0.shl(($1 = R8[1])).or($0.shr(new u8($1.neg()).add(new u8(8)))))];
        case 0x1053: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shl(($1 = R8[1])).or($0.shr(new u8($1.neg()).add(new u8(32)))))];
        case 0x9053: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))), $0.shl(($1 = R8[1])).or($0.shr(new u8($1.neg()).add(new u8(32)))))];
        case 0x1850: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shr(new u8(1)).or($0.shl(new u8(7))))];
        case 0x9850: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))), $0.shr(new u8(1)).or($0.shl(new u8(7))))];
        case 0x1851: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shr(new u8(1)).or($0.shl(new u8(31))))];
        case 0x9851: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))), $0.shr(new u8(1)).or($0.shl(new u8(31))))];
        case 0x1852: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shr(($1 = R8[1])).or($0.shl(new u8($1.neg()).add(new u8(8)))))];
        case 0x9852: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))), $0.shr(($1 = R8[1])).or($0.shl(new u8($1.neg()).add(new u8(8)))))];
        case 0x1853: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shr(($1 = R8[1])).or($0.shl(new u8($1.neg()).add(new u8(32)))))];
        case 0x9853: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))), $0.shr(($1 = R8[1])).or($0.shl(new u8($1.neg()).add(new u8(32)))))];
        case 0x2050: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shl(new u8(1)))];
        case 0xa050: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))), $0.shl(new u8(1)))];
        case 0x2051: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shl(new u8(1)))];
        case 0xa051: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))), $0.shl(new u8(1)))];
        case 0x2052: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shl(R8[1]))];
        case 0xa052: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))), $0.shl(R8[1]))];
        case 0x2053: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shl(R8[1]))];
        case 0xa053: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))), $0.shl(R8[1]))];
        case 0x2850: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), new u8($0).shr(new u8(1)))];
        case 0xa850: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))), new u8($0).shr(new u8(1)))];
        case 0x2851: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), new u32($0).shr(new u8(1)))];
        case 0xa851: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))), new u32($0).shr(new u8(1)))];
        case 0x2852: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), new u8($0).shr(R8[1]))];
        case 0xa852: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))), new u8($0).shr(R8[1]))];
        case 0x2853: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), new u32($0).shr(R8[1]))];
        case 0xa853: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))), new u32($0).shr(R8[1]))];
        case 0x3050: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shl(new u8(1)))];
        case 0xb050: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))), $0.shl(new u8(1)))];
        case 0x3051: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shl(new u8(1)))];
        case 0xb051: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))), $0.shl(new u8(1)))];
        case 0x3052: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shl(R8[1]))];
        case 0xb052: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))), $0.shl(R8[1]))];
        case 0x3053: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shl(R8[1]))];
        case 0xb053: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))), $0.shl(R8[1]))];
        case 0x3850: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), new i8($0).shr(new u8(1)))];
        case 0xb850: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))), new i8($0).shr(new u8(1)))];
        case 0x3851: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), new i32($0).shr(new u8(1)))];
        case 0xb851: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))), new i32($0).shr(new u8(1)))];
        case 0x3852: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), new i8($0).shr(R8[1]))];
        case 0xb852: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))), new i8($0).shr(R8[1]))];
        case 0x3853: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), new i32($0).shr(R8[1]))];
        case 0xb853: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))), new i32($0).shr(R8[1]))];
        case 0x1076: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.not())];
        case 0x9076: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))), $0.not())];
        case 0x1077: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.not())];
        case 0x9077: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))), $0.not())];
        case 0x1876: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R1[1], new u1(0)), new Mov(($0 = new Mem8(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.neg())];
        case 0x9876: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R1[1], new u1(0)), new Mov(($0 = new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))), $0.neg())];
        case 0x1877: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R1[1], new u1(0)), new Mov(($0 = new Mem32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.neg())];
        case 0x9877: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R1[1], new u1(0)), new Mov(($0 = new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))), $0.neg())];
        case 0x2076: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R16[0], R8[0].mul(new Mem8(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))];
        case 0xa076: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R16[0], R8[0].mul(new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))))];
        case 0x2077: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = R32[0]), $0.mul(new Mem32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))];
        case 0xa077: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = R32[0]), $0.mul(new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))))];
        case 0x2876: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R16[0], R8[0].mul(new Mem8(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))];
        case 0xa876: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R16[0], R8[0].mul(new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))))];
        case 0x2877: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = R32[0]), $0.mul(new Mem32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))];
        case 0xa877: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = R32[0]), $0.mul(new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))))];
        case 0x3076: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R16[0], R8[0].div(new Mem8(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))];
        case 0xb076: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R16[0], R8[0].div(new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))))];
        case 0x3077: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = R32[0]), $0.div(new Mem32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))];
        case 0xb077: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = R32[0]), $0.div(new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))))];
        case 0x3876: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R16[0], R8[0].div(new Mem8(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))];
        case 0xb876: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R16[0], R8[0].div(new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))))];
        case 0x3877: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = R32[0]), $0.div(new Mem32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))];
        case 0xb877: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = R32[0]), $0.div(new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))))];
        case 0x7e: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), new u8($0).add(new u8(1)))];
        case 0x807e: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))), new u8($0).add(new u8(1)))];
        case 0x7f: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.add(new u8(1)))];
        case 0x807f: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))), $0.add(new u8(1)))];
        case 0x87e: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.add(new i8(-1)))];
        case 0x887e: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))), $0.add(new i8(-1)))];
        case 0x87f: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.add(new i32(-1)))];
        case 0x887f: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))), $0.add(new i32(-1)))];
        case 0x107f: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = R32[4]), $0.add(new i32(-4))), new Mov(new Mem32($0), ($1 = R32[8]).add(new i8(_pfxLength + 7))), new Mov($1, new Mem32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))))];
        case 0x907f: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = R32[4]), $0.add(new i32(-4))), new Mov(new Mem32($0), ($1 = R32[8]).add(new i8(_pfxLength + 7))), new Mov($1, new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))))))];
        case 0x207f: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R32[8], new Mem32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))))];
        case 0xa07f: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R32[8], new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))))))];
        case 0x307f: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = R32[4]), $0.add(new i32(-4))), new Mov(new Mem32($0), new Mem32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))))];
        case 0xb07f: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = R32[4]), $0.add(new i32(-4))), new Mov(new Mem32($0), new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))))))];
    }

    if((((((((((b[i] & 192) & 0xffff) >> 6) & 0xffff) | ((b[i+1] << 2) & 0xffff)) & 0xffff) | ((((b[i+2] & 7) & 0xffff) << 10) & 0xffff)) & 0xffff) & 0x1d1d) == 0x1410)
    switch(((b[i] | ((b[i+1] << 8) & 0xffff)) & 0xffff) & 0x80bf) {
        case 0x0: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.add(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x8000: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))), $0.add(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x1: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.add(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x8001: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))), $0.add(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x2: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.add(new Mem8(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))];
        case 0x8002: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.add(new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))))];
        case 0x3: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.add(new Mem32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))];
        case 0x8003: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.add(new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))))];
        case 0x8: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.or(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x8008: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))), $0.or(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x9: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.or(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x8009: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))), $0.or(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0xa: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.or(new Mem8(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))];
        case 0x800a: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.or(new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))))];
        case 0xb: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.or(new Mem32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))];
        case 0x800b: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.or(new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))))];
        case 0x10: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.add(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).add(R1[1]))];
        case 0x8010: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))), $0.add(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).add(R1[1]))];
        case 0x11: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.add(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).add(R1[1]))];
        case 0x8011: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))), $0.add(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).add(R1[1]))];
        case 0x12: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.add(new Mem8(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))).add(R1[1]))];
        case 0x8012: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.add(new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))).add(R1[1]))];
        case 0x13: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.add(new Mem32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))).add(R1[1]))];
        case 0x8013: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.add(new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))).add(R1[1]))];
        case 0x18: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.add(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].neg()).add(new i8(R1[1]).neg()))];
        case 0x8018: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))), $0.add(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].neg()).add(new i8(R1[1]).neg()))];
        case 0x19: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.add(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].neg()).add(new i32(R1[1]).neg()))];
        case 0x8019: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))), $0.add(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].neg()).add(new i32(R1[1]).neg()))];
        case 0x1a: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.add(new Mem8(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))).neg()).add(new i8(R1[1]).neg()))];
        case 0x801a: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.add(new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))))).neg()).add(new i8(R1[1]).neg()))];
        case 0x1b: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.add(new Mem32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))).neg()).add(new i32(R1[1]).neg()))];
        case 0x801b: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.add(new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))))).neg()).add(new i32(R1[1]).neg()))];
        case 0x20: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.and(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x8020: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))), $0.and(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x21: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.and(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x8021: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))), $0.and(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x22: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.and(new Mem8(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))];
        case 0x8022: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.and(new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))))];
        case 0x23: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.and(new Mem32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))];
        case 0x8023: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.and(new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))))];
        case 0x28: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R1[2], ($0 = new Mem8(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))).eq(($1 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add($1.neg()))];
        case 0x8028: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R1[2], ($0 = new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))).eq(($1 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add($1.neg()))];
        case 0x29: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R1[2], ($0 = new Mem32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))).eq(($1 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add($1.neg()))];
        case 0x8029: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R1[2], ($0 = new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))).eq(($1 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add($1.neg()))];
        case 0x2a: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R1[2], ($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).eq(($1 = new Mem8(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add($1.neg()))];
        case 0x802a: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R1[2], ($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).eq(($1 = new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add($1.neg()))];
        case 0x2b: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R1[2], ($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).eq(($1 = new Mem32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add($1.neg()))];
        case 0x802b: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R1[2], ($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).eq(($1 = new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add($1.neg()))];
        case 0x30: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.xor(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x8030: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))), $0.xor(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x31: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.xor(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x8031: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))), $0.xor(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x32: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.xor(new Mem8(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))];
        case 0x8032: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.xor(new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))))];
        case 0x33: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.xor(new Mem32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))];
        case 0x8033: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.xor(new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))))];
        case 0x38: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R1[2], new Mem8(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))).eq(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])), new Mov(R1[1], new u1(0))];
        case 0x8038: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R1[2], new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))))).eq(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])), new Mov(R1[1], new u1(0))];
        case 0x39: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R1[2], new Mem32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))).eq(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])), new Mov(R1[1], new u1(0))];
        case 0x8039: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R1[2], new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))))).eq(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])), new Mov(R1[1], new u1(0))];
        case 0x3a: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R1[2], R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].eq(new Mem8(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))))), new Mov(R1[1], new u1(0))];
        case 0x803a: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R1[2], R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].eq(new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))))))), new Mov(R1[1], new u1(0))];
        case 0x3b: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R1[2], R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].eq(new Mem32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))))), new Mov(R1[1], new u1(0))];
        case 0x803b: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R1[2], R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].eq(new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))))))), new Mov(R1[1], new u1(0))];
        case 0x84: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R1[2], new Mem8(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))).and(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).eq(new i8(0))), new Mov(R1[1], new u1(0)), new Mov(R1[0], new u1(0))];
        case 0x8084: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R1[2], new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))))).and(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).eq(new i8(0))), new Mov(R1[1], new u1(0)), new Mov(R1[0], new u1(0))];
        case 0x85: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R1[2], new Mem32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))).and(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).eq(new i32(0))), new Mov(R1[1], new u1(0)), new Mov(R1[0], new u1(0))];
        case 0x8085: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R1[2], new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))))).and(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).eq(new i32(0))), new Mov(R1[1], new u1(0)), new Mov(R1[0], new u1(0))];
        case 0x86: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($2 = new Register8), ($0 = new Mem8(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))))), new Mov($0, ($1 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])), new Mov($1, $2)];
        case 0x8086: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($2 = new Register8), ($0 = new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))))))), new Mov($0, ($1 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])), new Mov($1, $2)];
        case 0x87: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($2 = new Register32), ($0 = new Mem32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))))), new Mov($0, ($1 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])), new Mov($1, $2)];
        case 0x8087: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($2 = new Register32), ($0 = new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))))))), new Mov($0, ($1 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])), new Mov($1, $2)];
        case 0x88: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(new Mem8(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])];
        case 0x8088: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))))), R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])];
        case 0x89: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(new Mem32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])];
        case 0x8089: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))))), R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])];
        case 0x8a: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new Mem8(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))))];
        case 0x808a: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))))))];
        case 0x8b: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new Mem32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))))];
        case 0x808b: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))))))];
        case 0x8c: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(new Mem32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), R16[((((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff) + 16) & 0xff)])];
        case 0x808c: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))))), R16[((((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff) + 16) & 0xff)])];
        case 0x8d: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))];
        case 0x808d: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))];
        case 0x8e: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R16[((((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff) + 16) & 0xff)], new Mem16(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))))];
        case 0x808e: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R16[((((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff) + 16) & 0xff)], new Mem16(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))))))];
    }

    if((((((((b[i] & 128) & 0xff) >> 7) & 0xff) | ((((b[i+1] & 127) & 0xff) << 1) & 0xff)) & 0xff) & 0x8d) == 0x9)
    switch(((b[i] | ((b[i+1] << 8) & 0xffff)) & 0xffff) & 0xb97f) {
        case 0x100: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))), $0.add(new i8(new u8(b[i+6]))))];
        case 0x1: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))), $0.add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))];
        case 0x102: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))), $0.add(new i8(new u8(b[i+6]))))];
        case 0x103: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))), $0.add(new i8(new u8(b[i+6]))))];
        case 0x900: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))), new u8(new u8(b[i+6])).or($0))];
        case 0x801: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))), new u32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))).or($0))];
        case 0x902: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))), new u8(new u8(b[i+6])).or($0))];
        case 0x903: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))), new u32(new i8(new u8(b[i+6]))).or($0))];
        case 0x1100: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))), $0.add(new i8(new u8(b[i+6]))).add(R1[1]))];
        case 0x1001: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))), $0.add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))).add(R1[1]))];
        case 0x1102: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))), $0.add(new i8(new u8(b[i+6]))).add(R1[1]))];
        case 0x1103: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))), $0.add(new i8(new u8(b[i+6]))).add(R1[1]))];
        case 0x1900: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))), $0.add(new i8(-((b[i+6]) << 24 >> 24))).add(new i8(R1[1]).neg()))];
        case 0x1801: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))), $0.add(new i32(-((((((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)) >>> 0)) >> 0))).add(new i32(R1[1]).neg()))];
        case 0x1902: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))), $0.add(new i8(-((b[i+6]) << 24 >> 24))).add(new i8(R1[1]).neg()))];
        case 0x1903: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))), $0.add(new i32(-((((b[i+6]) << 24 >> 24)) >> 0))).add(new i32(R1[1]).neg()))];
        case 0x2100: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))), new u8(new u8(b[i+6])).and($0))];
        case 0x2001: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))), new u32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))).and($0))];
        case 0x2102: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))), new u8(new u8(b[i+6])).and($0))];
        case 0x2103: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))), new u32(new i8(new u8(b[i+6]))).and($0))];
        case 0x2900: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R1[2], ($0 = new Mem8(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))).eq(new i8(new u8(b[i+6])))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add(new i8(-((b[i+6]) << 24 >> 24))))];
        case 0x2801: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R1[2], ($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))).eq(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add(new i32(-((((((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)) >>> 0)) >> 0))))];
        case 0x2902: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R1[2], ($0 = new Mem8(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))).eq(new i8(new u8(b[i+6])))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add(new i8(-((b[i+6]) << 24 >> 24))))];
        case 0x2903: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R1[2], ($0 = new Mem32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))).eq(new i32(new i8(new u8(b[i+6]))))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add(new i32(-((((b[i+6]) << 24 >> 24)) >> 0))))];
        case 0x3100: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))), $0.xor(new i8(new u8(b[i+6]))))];
        case 0x3001: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))), $0.xor(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))];
        case 0x3102: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))), $0.xor(new i8(new u8(b[i+6]))))];
        case 0x3103: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))), $0.xor(new i8(new u8(b[i+6]))))];
        case 0x3900: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R1[2], new Mem8(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0))).eq(new i8(new u8(b[i+6])))), new Mov(R1[1], new u1(0))];
        case 0x3801: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R1[2], new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)))).eq(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), new Mov(R1[1], new u1(0))];
        case 0x3902: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R1[2], new Mem8(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0))).eq(new i8(new u8(b[i+6])))), new Mov(R1[1], new u1(0))];
        case 0x3903: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R1[2], new Mem32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0))).eq(new i32(new i8(new u8(b[i+6]))))), new Mov(R1[1], new u1(0))];
        case 0x800f: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), new Mem32(($0 = R32[4]))), new Mov($0, $0.add(new u8(4)))];
        case 0x146: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(new Mem8(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0))), new i8(new u8(b[i+6])))];
        case 0x47: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)))), new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))];
        case 0x140: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))), $0.shl(new i8(new u8(b[i+6]))).or($0.shr(new u8(((((-((b[i+6]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 8))))];
        case 0x141: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))), $0.shl(new i8(new u8(b[i+6]))).or($0.shr(new u8(((((-((b[i+6]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 32))))];
        case 0x8050: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shl(new u8(1)).or($0.shr(new u8(7))))];
        case 0x8051: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shl(new u8(1)).or($0.shr(new u8(31))))];
        case 0x8052: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shl(($1 = R8[1])).or($0.shr(new u8($1.neg()).add(new u8(8)))))];
        case 0x8053: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shl(($1 = R8[1])).or($0.shr(new u8($1.neg()).add(new u8(32)))))];
        case 0x940: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))), $0.shr(new i8(new u8(b[i+6]))).or($0.shl(new u8(((((-((b[i+6]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 8))))];
        case 0x941: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))), $0.shr(new i8(new u8(b[i+6]))).or($0.shl(new u8(((((-((b[i+6]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 32))))];
        case 0x8850: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shr(new u8(1)).or($0.shl(new u8(7))))];
        case 0x8851: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shr(new u8(1)).or($0.shl(new u8(31))))];
        case 0x8852: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shr(($1 = R8[1])).or($0.shl(new u8($1.neg()).add(new u8(8)))))];
        case 0x8853: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shr(($1 = R8[1])).or($0.shl(new u8($1.neg()).add(new u8(32)))))];
        case 0x1140: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))), $0.shl(new i8(new u8(b[i+6]))).or($0.shr(new u8(((((-((b[i+6]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 8))))];
        case 0x1141: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))), $0.shl(new i8(new u8(b[i+6]))).or($0.shr(new u8(((((-((b[i+6]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 32))))];
        case 0x9050: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shl(new u8(1)).or($0.shr(new u8(7))))];
        case 0x9051: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shl(new u8(1)).or($0.shr(new u8(31))))];
        case 0x9052: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shl(($1 = R8[1])).or($0.shr(new u8($1.neg()).add(new u8(8)))))];
        case 0x9053: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shl(($1 = R8[1])).or($0.shr(new u8($1.neg()).add(new u8(32)))))];
        case 0x1940: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))), $0.shr(new i8(new u8(b[i+6]))).or($0.shl(new u8(((((-((b[i+6]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 8))))];
        case 0x1941: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))), $0.shr(new i8(new u8(b[i+6]))).or($0.shl(new u8(((((-((b[i+6]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 32))))];
        case 0x9850: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shr(new u8(1)).or($0.shl(new u8(7))))];
        case 0x9851: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shr(new u8(1)).or($0.shl(new u8(31))))];
        case 0x9852: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shr(($1 = R8[1])).or($0.shl(new u8($1.neg()).add(new u8(8)))))];
        case 0x9853: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shr(($1 = R8[1])).or($0.shl(new u8($1.neg()).add(new u8(32)))))];
        case 0x2140: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))), $0.shl(new i8(new u8(b[i+6]))))];
        case 0x2141: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))), $0.shl(new i8(new u8(b[i+6]))))];
        case 0xa050: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shl(new u8(1)))];
        case 0xa051: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shl(new u8(1)))];
        case 0xa052: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shl(R8[1]))];
        case 0xa053: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shl(R8[1]))];
        case 0x2940: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))), new u8($0).shr(new i8(new u8(b[i+6]))))];
        case 0x2941: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))), new u32($0).shr(new i8(new u8(b[i+6]))))];
        case 0xa850: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), new u8($0).shr(new u8(1)))];
        case 0xa851: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), new u32($0).shr(new u8(1)))];
        case 0xa852: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), new u8($0).shr(R8[1]))];
        case 0xa853: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), new u32($0).shr(R8[1]))];
        case 0x3140: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))), $0.shl(new i8(new u8(b[i+6]))))];
        case 0x3141: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))), $0.shl(new i8(new u8(b[i+6]))))];
        case 0xb050: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shl(new u8(1)))];
        case 0xb051: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shl(new u8(1)))];
        case 0xb052: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shl(R8[1]))];
        case 0xb053: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.shl(R8[1]))];
        case 0x3940: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))), new i8($0).shr(new i8(new u8(b[i+6]))))];
        case 0x3941: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))), new i32($0).shr(new i8(new u8(b[i+6]))))];
        case 0xb850: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), new i8($0).shr(new u8(1)))];
        case 0xb851: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), new i32($0).shr(new u8(1)))];
        case 0xb852: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), new i8($0).shr(R8[1]))];
        case 0xb853: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), new i32($0).shr(R8[1]))];
        case 0x176: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R1[2], new Mem8(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0))).and(new i8(new u8(b[i+6]))).eq(new i8(0))), new Mov(R1[1], new u1(0)), new Mov(R1[0], new u1(0))];
        case 0x77: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R1[2], new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)))).and(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))).eq(new i32(0))), new Mov(R1[1], new u1(0)), new Mov(R1[0], new u1(0))];
        case 0x9076: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.not())];
        case 0x9077: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.not())];
        case 0x9876: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R1[1], new u1(0)), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.neg())];
        case 0x9877: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R1[1], new u1(0)), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.neg())];
        case 0xa076: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R16[0], R8[0].mul(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))];
        case 0xa077: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = R32[0]), $0.mul(new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))];
        case 0xa876: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R16[0], R8[0].mul(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))];
        case 0xa877: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = R32[0]), $0.mul(new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))];
        case 0xb076: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R16[0], R8[0].div(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))];
        case 0xb077: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = R32[0]), $0.div(new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))];
        case 0xb876: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R16[0], R8[0].div(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))];
        case 0xb877: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = R32[0]), $0.div(new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))];
        case 0x807e: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), new u8($0).add(new u8(1)))];
        case 0x807f: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.add(new u8(1)))];
        case 0x887e: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.add(new i8(-1)))];
        case 0x887f: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.add(new i32(-1)))];
        case 0x907f: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = R32[4]), $0.add(new i32(-4))), new Mov(new Mem32($0), ($1 = R32[8]).add(new i8(_pfxLength + 7))), new Mov($1, new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))))];
        case 0xa07f: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R32[8], new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))))];
        case 0xb07f: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = R32[4]), $0.add(new i32(-4))), new Mov(new Mem32($0), new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))))];
    }

    if((((((b[i+1] & 126) & 0xff) >> 1) & 0xff) & 0x23) == 0x2)
    switch(((b[i] | ((b[i+1] << 8) & 0xffff)) & 0xffff) & 0x81ff) {
        case 0x8000: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.add(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x8001: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.add(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x8002: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.add(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))];
        case 0x8003: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.add(new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))];
        case 0x8008: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.or(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x8009: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.or(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x800a: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.or(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))];
        case 0x800b: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.or(new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))];
        case 0x8010: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.add(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).add(R1[1]))];
        case 0x8011: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.add(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).add(R1[1]))];
        case 0x8012: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.add(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))).add(R1[1]))];
        case 0x8013: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.add(new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))).add(R1[1]))];
        case 0x8018: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.add(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].neg()).add(new i8(R1[1]).neg()))];
        case 0x8019: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.add(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].neg()).add(new i32(R1[1]).neg()))];
        case 0x801a: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.add(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))).neg()).add(new i8(R1[1]).neg()))];
        case 0x801b: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.add(new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))).neg()).add(new i32(R1[1]).neg()))];
        case 0x8020: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.and(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x8021: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.and(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x8022: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.and(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))];
        case 0x8023: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.and(new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))];
        case 0x8028: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R1[2], ($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))).eq(($1 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add($1.neg()))];
        case 0x8029: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R1[2], ($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))).eq(($1 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add($1.neg()))];
        case 0x802a: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R1[2], ($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).eq(($1 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add($1.neg()))];
        case 0x802b: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R1[2], ($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).eq(($1 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add($1.neg()))];
        case 0x8030: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.xor(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x8031: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))), $0.xor(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x8032: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.xor(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))];
        case 0x8033: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.xor(new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))))];
        case 0x8038: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R1[2], new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))).eq(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])), new Mov(R1[1], new u1(0))];
        case 0x8039: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R1[2], new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))).eq(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])), new Mov(R1[1], new u1(0))];
        case 0x803a: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R1[2], R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].eq(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))))), new Mov(R1[1], new u1(0))];
        case 0x803b: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R1[2], R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].eq(new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))))), new Mov(R1[1], new u1(0))];
        case 0x69: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)))).mul(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))];
        case 0x16b: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new Mem32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0))).mul(new i32(new i8(new u8(b[i+6])))))];
        case 0x8084: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R1[2], new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))).and(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).eq(new i8(0))), new Mov(R1[1], new u1(0)), new Mov(R1[0], new u1(0))];
        case 0x8085: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R1[2], new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))).and(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).eq(new i32(0))), new Mov(R1[1], new u1(0)), new Mov(R1[0], new u1(0))];
        case 0x8086: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($2 = new Register8), ($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))))), new Mov($0, ($1 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])), new Mov($1, $2)];
        case 0x8087: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($2 = new Register32), ($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))))), new Mov($0, ($1 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])), new Mov($1, $2)];
        case 0x8088: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])];
        case 0x8089: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])];
        case 0x808a: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))))];
        case 0x808b: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))))];
        case 0x808c: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), R16[((((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff) + 16) & 0xff)])];
        case 0x808d: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))];
        case 0x808e: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R16[((((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff) + 16) & 0xff)], new Mem16(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))))];
    }

    if((((((b[i] & 248) & 0xff) >> 3) & 0xff) & 0x11) == 0x10)
    switch(((b[i] | ((b[i+1] << 8) & 0xffff)) & 0xffff) & 0xf877) {
        case 0x8000: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))), $0.add(new i8(new u8(b[i+6]))))];
        case 0x4001: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))), $0.add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))];
        case 0x8002: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))), $0.add(new i8(new u8(b[i+6]))))];
        case 0x8003: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))), $0.add(new i8(new u8(b[i+6]))))];
        case 0x8800: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))), new u8(new u8(b[i+6])).or($0))];
        case 0x4801: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))), new u32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))).or($0))];
        case 0x8802: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))), new u8(new u8(b[i+6])).or($0))];
        case 0x8803: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))), new u32(new i8(new u8(b[i+6]))).or($0))];
        case 0x9000: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))), $0.add(new i8(new u8(b[i+6]))).add(R1[1]))];
        case 0x5001: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))), $0.add(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))).add(R1[1]))];
        case 0x9002: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))), $0.add(new i8(new u8(b[i+6]))).add(R1[1]))];
        case 0x9003: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))), $0.add(new i8(new u8(b[i+6]))).add(R1[1]))];
        case 0x9800: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))), $0.add(new i8(-((b[i+6]) << 24 >> 24))).add(new i8(R1[1]).neg()))];
        case 0x5801: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))), $0.add(new i32(-((((((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)) >>> 0)) >> 0))).add(new i32(R1[1]).neg()))];
        case 0x9802: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))), $0.add(new i8(-((b[i+6]) << 24 >> 24))).add(new i8(R1[1]).neg()))];
        case 0x9803: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))), $0.add(new i32(-((((b[i+6]) << 24 >> 24)) >> 0))).add(new i32(R1[1]).neg()))];
        case 0xa000: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))), new u8(new u8(b[i+6])).and($0))];
        case 0x6001: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))), new u32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))).and($0))];
        case 0xa002: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))), new u8(new u8(b[i+6])).and($0))];
        case 0xa003: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))), new u32(new i8(new u8(b[i+6]))).and($0))];
        case 0xa800: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R1[2], ($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))).eq(new i8(new u8(b[i+6])))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add(new i8(-((b[i+6]) << 24 >> 24))))];
        case 0x6801: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R1[2], ($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))).eq(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add(new i32(-((((((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)) >>> 0)) >> 0))))];
        case 0xa802: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R1[2], ($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))).eq(new i8(new u8(b[i+6])))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add(new i8(-((b[i+6]) << 24 >> 24))))];
        case 0xa803: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R1[2], ($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))).eq(new i32(new i8(new u8(b[i+6]))))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add(new i32(-((((b[i+6]) << 24 >> 24)) >> 0))))];
        case 0xb000: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))), $0.xor(new i8(new u8(b[i+6]))))];
        case 0x7001: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))), $0.xor(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))))];
        case 0xb002: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))), $0.xor(new i8(new u8(b[i+6]))))];
        case 0xb003: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))), $0.xor(new i8(new u8(b[i+6]))))];
        case 0xb800: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R1[2], new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0))))).eq(new i8(new u8(b[i+6])))), new Mov(R1[1], new u1(0))];
        case 0x7801: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R1[2], new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2])))).eq(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))), new Mov(R1[1], new u1(0))];
        case 0xb802: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R1[2], new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0))))).eq(new i8(new u8(b[i+6])))), new Mov(R1[1], new u1(0))];
        case 0xb803: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R1[2], new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0))))).eq(new i32(new i8(new u8(b[i+6]))))), new Mov(R1[1], new u1(0))];
        case 0x8046: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0))))), new i8(new u8(b[i+6])))];
        case 0x4047: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2])))), new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0))))];
        case 0x8040: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))), $0.shl(new i8(new u8(b[i+6]))).or($0.shr(new u8(((((-((b[i+6]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 8))))];
        case 0x8041: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))), $0.shl(new i8(new u8(b[i+6]))).or($0.shr(new u8(((((-((b[i+6]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 32))))];
        case 0x8840: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))), $0.shr(new i8(new u8(b[i+6]))).or($0.shl(new u8(((((-((b[i+6]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 8))))];
        case 0x8841: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))), $0.shr(new i8(new u8(b[i+6]))).or($0.shl(new u8(((((-((b[i+6]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 32))))];
        case 0x9040: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))), $0.shl(new i8(new u8(b[i+6]))).or($0.shr(new u8(((((-((b[i+6]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 8))))];
        case 0x9041: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))), $0.shl(new i8(new u8(b[i+6]))).or($0.shr(new u8(((((-((b[i+6]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 32))))];
        case 0x9840: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))), $0.shr(new i8(new u8(b[i+6]))).or($0.shl(new u8(((((-((b[i+6]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 8))))];
        case 0x9841: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))), $0.shr(new i8(new u8(b[i+6]))).or($0.shl(new u8(((((-((b[i+6]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 32))))];
        case 0xa040: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))), $0.shl(new i8(new u8(b[i+6]))))];
        case 0xa041: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))), $0.shl(new i8(new u8(b[i+6]))))];
        case 0xa840: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))), new u8($0).shr(new i8(new u8(b[i+6]))))];
        case 0xa841: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))), new u32($0).shr(new i8(new u8(b[i+6]))))];
        case 0xb040: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))), $0.shl(new i8(new u8(b[i+6]))))];
        case 0xb041: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))), $0.shl(new i8(new u8(b[i+6]))))];
        case 0xb840: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))), new i8($0).shr(new i8(new u8(b[i+6]))))];
        case 0xb841: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))), new i32($0).shr(new i8(new u8(b[i+6]))))];
        case 0x8076: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R1[2], new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0))))).and(new i8(new u8(b[i+6]))).eq(new i8(0))), new Mov(R1[1], new u1(0)), new Mov(R1[0], new u1(0))];
        case 0x4077: return [((((_pfxLength) & 0xff) + 7) & 0xff), new Mov(R1[2], new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2])))).and(new i32(new u32(((((b[i+3] | ((b[i+4] << 8) >>> 0)) >>> 0) | ((b[i+5] << 16) >>> 0)) >>> 0) | ((b[i+6] << 24) >>> 0)))).eq(new i32(0))), new Mov(R1[1], new u1(0)), new Mov(R1[0], new u1(0))];
    }

    if((((((((b[i] & 192) & 0xffff) >> 6) & 0xffff) | ((b[i+1] << 2) & 0xffff)) & 0xffff) & 0x31d) == 0x14)
    switch(b[i] & 0xbf) {
        case 0x0: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = new Mem8(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))), $0.add(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x1: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = new Mem32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))), $0.add(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x2: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.add(new Mem8(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))];
        case 0x3: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.add(new Mem32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))];
        case 0x8: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = new Mem8(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))), $0.or(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x9: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = new Mem32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))), $0.or(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0xa: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.or(new Mem8(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))];
        case 0xb: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.or(new Mem32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))];
        case 0x10: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = new Mem8(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))), $0.add(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).add(R1[1]))];
        case 0x11: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = new Mem32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))), $0.add(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).add(R1[1]))];
        case 0x12: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.add(new Mem8(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))).add(R1[1]))];
        case 0x13: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.add(new Mem32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))).add(R1[1]))];
        case 0x18: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = new Mem8(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))), $0.add(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].neg()).add(new i8(R1[1]).neg()))];
        case 0x19: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = new Mem32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))), $0.add(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].neg()).add(new i32(R1[1]).neg()))];
        case 0x1a: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.add(new Mem8(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0))).neg()).add(new i8(R1[1]).neg()))];
        case 0x1b: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.add(new Mem32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0))).neg()).add(new i32(R1[1]).neg()))];
        case 0x20: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = new Mem8(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))), $0.and(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x21: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = new Mem32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))), $0.and(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x22: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.and(new Mem8(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))];
        case 0x23: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.and(new Mem32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))];
        case 0x28: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(R1[2], ($0 = new Mem8(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))).eq(($1 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add($1.neg()))];
        case 0x29: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(R1[2], ($0 = new Mem32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))).eq(($1 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add($1.neg()))];
        case 0x2a: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(R1[2], ($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).eq(($1 = new Mem8(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add($1.neg()))];
        case 0x2b: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(R1[2], ($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).eq(($1 = new Mem32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add($1.neg()))];
        case 0x30: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = new Mem8(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))), $0.xor(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x31: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = new Mem32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))), $0.xor(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x32: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.xor(new Mem8(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))];
        case 0x33: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.xor(new Mem32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))];
        case 0x38: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(R1[2], new Mem8(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0))).eq(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])), new Mov(R1[1], new u1(0))];
        case 0x39: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(R1[2], new Mem32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0))).eq(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])), new Mov(R1[1], new u1(0))];
        case 0x3a: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(R1[2], R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].eq(new Mem8(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0))))), new Mov(R1[1], new u1(0))];
        case 0x3b: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(R1[2], R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].eq(new Mem32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0))))), new Mov(R1[1], new u1(0))];
        case 0x84: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(R1[2], new Mem8(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0))).and(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).eq(new i8(0))), new Mov(R1[1], new u1(0)), new Mov(R1[0], new u1(0))];
        case 0x85: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(R1[2], new Mem32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0))).and(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).eq(new i32(0))), new Mov(R1[1], new u1(0)), new Mov(R1[0], new u1(0))];
        case 0x86: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($2 = new Register8), ($0 = new Mem8(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0))))), new Mov($0, ($1 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])), new Mov($1, $2)];
        case 0x87: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($2 = new Register32), ($0 = new Mem32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0))))), new Mov($0, ($1 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])), new Mov($1, $2)];
        case 0x88: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(new Mem8(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0))), R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])];
        case 0x89: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(new Mem32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0))), R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])];
        case 0x8a: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new Mem8(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0))))];
        case 0x8b: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new Mem32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0))))];
        case 0x8c: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(new Mem32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0))), R16[((((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff) + 16) & 0xff)])];
        case 0x8d: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))];
        case 0x8e: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(R16[((((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff) + 16) & 0xff)], new Mem16(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0))))];
    }

    if((((((((b[i] | ((b[i+1] << 8) >>> 0)) >>> 0) | ((b[i+2] << 16) >>> 0)) >>> 0) | ((((b[i+3] & 63) >>> 0) << 24) >>> 0)) >>> 0) & 0x3fc7f7ff) == 0x2544a40f)
    switch(((((b[i+1] & 8) & 0xff) >> 3) & 0xff) & 0x1) {
        case 0x0: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(new i8(new u8(b[i+4])))))), $0.shl(new i8(new u8(b[i+5]))).or(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shr(new u8(((((-((b[i+5]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 32))))];
        case 0x1: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(new i8(new u8(b[i+4])))))), new u32(((((1 << (((b[i+5]) << 24 >> 24) & 0x1f)) >>> 0) + -1) >>> 0) << (((((((-((b[i+5]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 32) & 0xff) & 0x1f)).and(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).or($0.shr(new i8(new u8(b[i+5])))))];
    }

    if((((((((b[i] | ((b[i+1] << 8) >>> 0)) >>> 0) | ((b[i+2] << 16) >>> 0)) >>> 0) | ((((b[i+3] & 63) >>> 0) << 24) >>> 0)) >>> 0) & 0x38c7f7ff) == 0x2044a40f)
    switch(((((b[i+1] & 8) & 0xff) >> 3) & 0xff) & 0x1) {
        case 0x0: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+4]))))), $0.shl(new i8(new u8(b[i+5]))).or(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shr(new u8(((((-((b[i+5]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 32))))];
        case 0x1: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+4]))))), new u32(((((1 << (((b[i+5]) << 24 >> 24) & 0x1f)) >>> 0) + -1) >>> 0) << (((((((-((b[i+5]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 32) & 0xff) & 0x1f)).and(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).or($0.shr(new i8(new u8(b[i+5])))))];
    }

    if((((((((b[i] | ((b[i+1] << 8) >>> 0)) >>> 0) | ((b[i+2] << 16) >>> 0)) >>> 0) | ((((b[i+3] & 7) >>> 0) << 24) >>> 0)) >>> 0) & 0x7c7f7ff) == 0x544a40f)
    switch(((((b[i+1] & 8) & 0xff) >> 3) & 0xff) & 0x1) {
        case 0x0: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+4]))))))), $0.shl(new i8(new u8(b[i+5]))).or(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shr(new u8(((((-((b[i+5]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 32))))];
        case 0x1: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+4]))))))), new u32(((((1 << (((b[i+5]) << 24 >> 24) & 0x1f)) >>> 0) + -1) >>> 0) << (((((((-((b[i+5]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 32) & 0xff) & 0x1f)).and(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).or($0.shr(new i8(new u8(b[i+5])))))];
    }

    if((((((b[i] | ((b[i+1] << 8) >>> 0)) >>> 0) | ((b[i+2] << 16) >>> 0)) >>> 0) & 0xc7f7ff) == 0x44a40f)
    switch(((((b[i+1] & 8) & 0xff) >> 3) & 0xff) & 0x1) {
        case 0x0: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+4]))))), $0.shl(new i8(new u8(b[i+5]))).or(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shr(new u8(((((-((b[i+5]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 32))))];
        case 0x1: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+4]))))), new u32(((((1 << (((b[i+5]) << 24 >> 24) & 0x1f)) >>> 0) + -1) >>> 0) << (((((((-((b[i+5]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 32) & 0xff) & 0x1f)).and(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).or($0.shr(new i8(new u8(b[i+5])))))];
    }

    if((((((b[i+1] & 64) & 0xff) >> 6) & 0xff) & 0x1) == 0x0)
    switch(((b[i] | ((b[i+1] << 8) & 0xffff)) & 0xffff) & 0xbfff) {
        case 0x58f: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(new Mem32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0))), new Mem32(($0 = R32[4]))), new Mov($0, $0.add(new u8(4)))];
        case 0x5d0: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = new Mem8(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))), $0.shl(new u8(1)).or($0.shr(new u8(7))))];
        case 0x5d1: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = new Mem32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))), $0.shl(new u8(1)).or($0.shr(new u8(31))))];
        case 0x5d2: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = new Mem8(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))), $0.shl(($1 = R8[1])).or($0.shr(new u8($1.neg()).add(new u8(8)))))];
        case 0x5d3: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = new Mem32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))), $0.shl(($1 = R8[1])).or($0.shr(new u8($1.neg()).add(new u8(32)))))];
        case 0xdd0: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = new Mem8(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))), $0.shr(new u8(1)).or($0.shl(new u8(7))))];
        case 0xdd1: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = new Mem32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))), $0.shr(new u8(1)).or($0.shl(new u8(31))))];
        case 0xdd2: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = new Mem8(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))), $0.shr(($1 = R8[1])).or($0.shl(new u8($1.neg()).add(new u8(8)))))];
        case 0xdd3: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = new Mem32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))), $0.shr(($1 = R8[1])).or($0.shl(new u8($1.neg()).add(new u8(32)))))];
        case 0x15d0: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = new Mem8(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))), $0.shl(new u8(1)).or($0.shr(new u8(7))))];
        case 0x15d1: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = new Mem32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))), $0.shl(new u8(1)).or($0.shr(new u8(31))))];
        case 0x15d2: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = new Mem8(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))), $0.shl(($1 = R8[1])).or($0.shr(new u8($1.neg()).add(new u8(8)))))];
        case 0x15d3: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = new Mem32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))), $0.shl(($1 = R8[1])).or($0.shr(new u8($1.neg()).add(new u8(32)))))];
        case 0x1dd0: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = new Mem8(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))), $0.shr(new u8(1)).or($0.shl(new u8(7))))];
        case 0x1dd1: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = new Mem32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))), $0.shr(new u8(1)).or($0.shl(new u8(31))))];
        case 0x1dd2: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = new Mem8(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))), $0.shr(($1 = R8[1])).or($0.shl(new u8($1.neg()).add(new u8(8)))))];
        case 0x1dd3: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = new Mem32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))), $0.shr(($1 = R8[1])).or($0.shl(new u8($1.neg()).add(new u8(32)))))];
        case 0x25d0: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = new Mem8(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))), $0.shl(new u8(1)))];
        case 0x25d1: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = new Mem32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))), $0.shl(new u8(1)))];
        case 0x25d2: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = new Mem8(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))), $0.shl(R8[1]))];
        case 0x25d3: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = new Mem32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))), $0.shl(R8[1]))];
        case 0x2dd0: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = new Mem8(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))), new u8($0).shr(new u8(1)))];
        case 0x2dd1: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = new Mem32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))), new u32($0).shr(new u8(1)))];
        case 0x2dd2: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = new Mem8(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))), new u8($0).shr(R8[1]))];
        case 0x2dd3: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = new Mem32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))), new u32($0).shr(R8[1]))];
        case 0x35d0: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = new Mem8(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))), $0.shl(new u8(1)))];
        case 0x35d1: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = new Mem32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))), $0.shl(new u8(1)))];
        case 0x35d2: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = new Mem8(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))), $0.shl(R8[1]))];
        case 0x35d3: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = new Mem32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))), $0.shl(R8[1]))];
        case 0x3dd0: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = new Mem8(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))), new i8($0).shr(new u8(1)))];
        case 0x3dd1: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = new Mem32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))), new i32($0).shr(new u8(1)))];
        case 0x3dd2: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = new Mem8(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))), new i8($0).shr(R8[1]))];
        case 0x3dd3: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = new Mem32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))), new i32($0).shr(R8[1]))];
        case 0x15f6: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = new Mem8(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))), $0.not())];
        case 0x15f7: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = new Mem32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))), $0.not())];
        case 0x1df6: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(R1[1], new u1(0)), new Mov(($0 = new Mem8(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))), $0.neg())];
        case 0x1df7: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(R1[1], new u1(0)), new Mov(($0 = new Mem32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))), $0.neg())];
        case 0x25f6: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(R16[0], R8[0].mul(new Mem8(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))];
        case 0x25f7: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = R32[0]), $0.mul(new Mem32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))];
        case 0x2df6: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(R16[0], R8[0].mul(new Mem8(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))];
        case 0x2df7: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = R32[0]), $0.mul(new Mem32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))];
        case 0x35f6: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(R16[0], R8[0].div(new Mem8(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))];
        case 0x35f7: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = R32[0]), $0.div(new Mem32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))];
        case 0x3df6: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(R16[0], R8[0].div(new Mem8(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))];
        case 0x3df7: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = R32[0]), $0.div(new Mem32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))];
        case 0x5fe: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = new Mem8(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))), new u8($0).add(new u8(1)))];
        case 0x5ff: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = new Mem32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))), $0.add(new u8(1)))];
        case 0xdfe: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = new Mem8(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))), $0.add(new i8(-1)))];
        case 0xdff: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = new Mem32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))), $0.add(new i32(-1)))];
        case 0x15ff: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = R32[4]), $0.add(new i32(-4))), new Mov(new Mem32($0), ($1 = R32[8]).add(new i8(_pfxLength + 6))), new Mov($1, new Mem32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0))))];
        case 0x25ff: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(R32[8], new Mem32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0))))];
        case 0x35ff: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = R32[4]), $0.add(new i32(-4))), new Mov(new Mem32($0), new Mem32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0))))];
        case 0x800f: return [((((_pfxLength) & 0xff) + 6) & 0xff), new If(R1[0], new Mov(($0 = R32[8]), $0.add(new i32(((((((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)) >>> 0)) >> 0) + ((_pfxLength + 6) << 24 >> 24)))))];
        case 0x810f: return [((((_pfxLength) & 0xff) + 6) & 0xff), new If(R1[0].not(), new Mov(($0 = R32[8]), $0.add(new i32(((((((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)) >>> 0)) >> 0) + ((_pfxLength + 6) << 24 >> 24)))))];
        case 0x820f: return [((((_pfxLength) & 0xff) + 6) & 0xff), new If(R1[1], new Mov(($0 = R32[8]), $0.add(new i32(((((((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)) >>> 0)) >> 0) + ((_pfxLength + 6) << 24 >> 24)))))];
        case 0x830f: return [((((_pfxLength) & 0xff) + 6) & 0xff), new If(R1[1].not(), new Mov(($0 = R32[8]), $0.add(new i32(((((((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)) >>> 0)) >> 0) + ((_pfxLength + 6) << 24 >> 24)))))];
        case 0x840f: return [((((_pfxLength) & 0xff) + 6) & 0xff), new If(R1[2], new Mov(($0 = R32[8]), $0.add(new i32(((((((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)) >>> 0)) >> 0) + ((_pfxLength + 6) << 24 >> 24)))))];
        case 0x850f: return [((((_pfxLength) & 0xff) + 6) & 0xff), new If(R1[2].not(), new Mov(($0 = R32[8]), $0.add(new i32(((((((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)) >>> 0)) >> 0) + ((_pfxLength + 6) << 24 >> 24)))))];
        case 0x860f: return [((((_pfxLength) & 0xff) + 6) & 0xff), new If(R1[1].or(R1[2]), new Mov(($0 = R32[8]), $0.add(new i32(((((((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)) >>> 0)) >> 0) + ((_pfxLength + 6) << 24 >> 24)))))];
        case 0x870f: return [((((_pfxLength) & 0xff) + 6) & 0xff), new If(R1[1].not().and(R1[2].not()), new Mov(($0 = R32[8]), $0.add(new i32(((((((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)) >>> 0)) >> 0) + ((_pfxLength + 6) << 24 >> 24)))))];
        case 0x880f: return [((((_pfxLength) & 0xff) + 6) & 0xff), new If(R1[3], new Mov(($0 = R32[8]), $0.add(new i32(((((((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)) >>> 0)) >> 0) + ((_pfxLength + 6) << 24 >> 24)))))];
        case 0x890f: return [((((_pfxLength) & 0xff) + 6) & 0xff), new If(R1[3].not(), new Mov(($0 = R32[8]), $0.add(new i32(((((((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)) >>> 0)) >> 0) + ((_pfxLength + 6) << 24 >> 24)))))];
        case 0x8a0f: return [((((_pfxLength) & 0xff) + 6) & 0xff), new If(R1[4], new Mov(($0 = R32[8]), $0.add(new i32(((((((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)) >>> 0)) >> 0) + ((_pfxLength + 6) << 24 >> 24)))))];
        case 0x8b0f: return [((((_pfxLength) & 0xff) + 6) & 0xff), new If(R1[4].not(), new Mov(($0 = R32[8]), $0.add(new i32(((((((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)) >>> 0)) >> 0) + ((_pfxLength + 6) << 24 >> 24)))))];
        case 0x8c0f: return [((((_pfxLength) & 0xff) + 6) & 0xff), new If(R1[0].eq(R1[3]).not(), new Mov(($0 = R32[8]), $0.add(new i32(((((((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)) >>> 0)) >> 0) + ((_pfxLength + 6) << 24 >> 24)))))];
        case 0x8d0f: return [((((_pfxLength) & 0xff) + 6) & 0xff), new If(R1[0].eq(R1[3]), new Mov(($0 = R32[8]), $0.add(new i32(((((((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)) >>> 0)) >> 0) + ((_pfxLength + 6) << 24 >> 24)))))];
        case 0x8e0f: return [((((_pfxLength) & 0xff) + 6) & 0xff), new If(R1[0].eq(R1[3]).not().or(R1[2]), new Mov(($0 = R32[8]), $0.add(new i32(((((((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)) >>> 0)) >> 0) + ((_pfxLength + 6) << 24 >> 24)))))];
        case 0x8f0f: return [((((_pfxLength) & 0xff) + 6) & 0xff), new If(R1[0].eq(R1[3]).and(R1[2].not()), new Mov(($0 = R32[8]), $0.add(new i32(((((((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)) >>> 0)) >> 0) + ((_pfxLength + 6) << 24 >> 24)))))];
    }

    if((((((b[i] & 128) & 0xff) >> 7) & 0xff) & 0x1) == 0x1)
    switch(((b[i] | ((b[i+1] << 8) & 0xffff)) & 0xffff) & 0xf87f) {
        case 0x1: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])), $0.add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))];
        case 0xc001: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = R32[((((b[i+1] & 7) & 0xff)) & 0xff)]), $0.add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))];
        case 0x801: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])), new u32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0))).or($0))];
        case 0xc801: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = R32[((((b[i+1] & 7) & 0xff)) & 0xff)]), new u32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0))).or($0))];
        case 0x1001: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])), $0.add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))).add(R1[1]))];
        case 0xd001: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = R32[((((b[i+1] & 7) & 0xff)) & 0xff)]), $0.add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))).add(R1[1]))];
        case 0x1801: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])), $0.add(new i32(-((((((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)) >>> 0)) >> 0))).add(new i32(R1[1]).neg()))];
        case 0xd801: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = R32[((((b[i+1] & 7) & 0xff)) & 0xff)]), $0.add(new i32(-((((((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)) >>> 0)) >> 0))).add(new i32(R1[1]).neg()))];
        case 0x2001: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])), new u32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0))).and($0))];
        case 0xe001: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = R32[((((b[i+1] & 7) & 0xff)) & 0xff)]), new u32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0))).and($0))];
        case 0x2801: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(R1[2], ($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])).eq(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0))))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add(new i32(-((((((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)) >>> 0)) >> 0))))];
        case 0xe801: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(R1[2], ($0 = R32[((((b[i+1] & 7) & 0xff)) & 0xff)]).eq(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0))))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add(new i32(-((((((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)) >>> 0)) >> 0))))];
        case 0x3001: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])), $0.xor(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))];
        case 0xf001: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = R32[((((b[i+1] & 7) & 0xff)) & 0xff)]), $0.xor(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))];
        case 0x3801: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(R1[2], new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)]).eq(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0))))), new Mov(R1[1], new u1(0))];
        case 0xf801: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(R1[2], R32[((((b[i+1] & 7) & 0xff)) & 0xff)].eq(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0))))), new Mov(R1[1], new u1(0))];
        case 0x800f: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0))))), new Mem32(($0 = R32[4]))), new Mov($0, $0.add(new u8(4)))];
        case 0x47: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)]), new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0))))];
        case 0xc047: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(R32[((((b[i+1] & 7) & 0xff)) & 0xff)], new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0))))];
        case 0x8050: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))), $0.shl(new u8(1)).or($0.shr(new u8(7))))];
        case 0x8051: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))), $0.shl(new u8(1)).or($0.shr(new u8(31))))];
        case 0x8052: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))), $0.shl(($1 = R8[1])).or($0.shr(new u8($1.neg()).add(new u8(8)))))];
        case 0x8053: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))), $0.shl(($1 = R8[1])).or($0.shr(new u8($1.neg()).add(new u8(32)))))];
        case 0x8850: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))), $0.shr(new u8(1)).or($0.shl(new u8(7))))];
        case 0x8851: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))), $0.shr(new u8(1)).or($0.shl(new u8(31))))];
        case 0x8852: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))), $0.shr(($1 = R8[1])).or($0.shl(new u8($1.neg()).add(new u8(8)))))];
        case 0x8853: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))), $0.shr(($1 = R8[1])).or($0.shl(new u8($1.neg()).add(new u8(32)))))];
        case 0x9050: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))), $0.shl(new u8(1)).or($0.shr(new u8(7))))];
        case 0x9051: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))), $0.shl(new u8(1)).or($0.shr(new u8(31))))];
        case 0x9052: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))), $0.shl(($1 = R8[1])).or($0.shr(new u8($1.neg()).add(new u8(8)))))];
        case 0x9053: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))), $0.shl(($1 = R8[1])).or($0.shr(new u8($1.neg()).add(new u8(32)))))];
        case 0x9850: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))), $0.shr(new u8(1)).or($0.shl(new u8(7))))];
        case 0x9851: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))), $0.shr(new u8(1)).or($0.shl(new u8(31))))];
        case 0x9852: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))), $0.shr(($1 = R8[1])).or($0.shl(new u8($1.neg()).add(new u8(8)))))];
        case 0x9853: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))), $0.shr(($1 = R8[1])).or($0.shl(new u8($1.neg()).add(new u8(32)))))];
        case 0xa050: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))), $0.shl(new u8(1)))];
        case 0xa051: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))), $0.shl(new u8(1)))];
        case 0xa052: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))), $0.shl(R8[1]))];
        case 0xa053: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))), $0.shl(R8[1]))];
        case 0xa850: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))), new u8($0).shr(new u8(1)))];
        case 0xa851: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))), new u32($0).shr(new u8(1)))];
        case 0xa852: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))), new u8($0).shr(R8[1]))];
        case 0xa853: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))), new u32($0).shr(R8[1]))];
        case 0xb050: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))), $0.shl(new u8(1)))];
        case 0xb051: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))), $0.shl(new u8(1)))];
        case 0xb052: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))), $0.shl(R8[1]))];
        case 0xb053: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))), $0.shl(R8[1]))];
        case 0xb850: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))), new i8($0).shr(new u8(1)))];
        case 0xb851: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))), new i32($0).shr(new u8(1)))];
        case 0xb852: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))), new i8($0).shr(R8[1]))];
        case 0xb853: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))), new i32($0).shr(R8[1]))];
        case 0x77: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(R1[2], new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)]).and(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))).eq(new i32(0))), new Mov(R1[1], new u1(0)), new Mov(R1[0], new u1(0))];
        case 0xc077: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(R1[2], R32[((((b[i+1] & 7) & 0xff)) & 0xff)].and(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))).eq(new i32(0))), new Mov(R1[1], new u1(0)), new Mov(R1[0], new u1(0))];
        case 0x9076: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))), $0.not())];
        case 0x9077: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))), $0.not())];
        case 0x9876: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(R1[1], new u1(0)), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))), $0.neg())];
        case 0x9877: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(R1[1], new u1(0)), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))), $0.neg())];
        case 0xa076: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(R16[0], R8[0].mul(new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))))];
        case 0xa077: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = R32[0]), $0.mul(new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))))];
        case 0xa876: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(R16[0], R8[0].mul(new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))))];
        case 0xa877: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = R32[0]), $0.mul(new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))))];
        case 0xb076: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(R16[0], R8[0].div(new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))))];
        case 0xb077: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = R32[0]), $0.div(new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))))];
        case 0xb876: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(R16[0], R8[0].div(new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))))];
        case 0xb877: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = R32[0]), $0.div(new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))))];
        case 0x807e: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))), new u8($0).add(new u8(1)))];
        case 0x807f: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))), $0.add(new u8(1)))];
        case 0x887e: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))), $0.add(new i8(-1)))];
        case 0x887f: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))), $0.add(new i32(-1)))];
        case 0x907f: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = R32[4]), $0.add(new i32(-4))), new Mov(new Mem32($0), ($1 = R32[8]).add(new i8(_pfxLength + 6))), new Mov($1, new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0))))))];
        case 0xa07f: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(R32[8], new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0))))))];
        case 0xb07f: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = R32[4]), $0.add(new i32(-4))), new Mov(new Mem32($0), new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0))))))];
    }

    
    switch(((b[i] | ((b[i+1] << 8) & 0xffff)) & 0xffff) & 0xc0ff) {
        case 0x8000: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))), $0.add(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x8001: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))), $0.add(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x8002: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.add(new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))))];
        case 0x8003: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.add(new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))))];
        case 0x8008: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))), $0.or(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x8009: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))), $0.or(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x800a: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.or(new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))))];
        case 0x800b: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.or(new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))))];
        case 0x8010: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))), $0.add(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).add(R1[1]))];
        case 0x8011: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))), $0.add(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).add(R1[1]))];
        case 0x8012: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.add(new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))).add(R1[1]))];
        case 0x8013: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.add(new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))).add(R1[1]))];
        case 0x8018: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))), $0.add(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].neg()).add(new i8(R1[1]).neg()))];
        case 0x8019: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))), $0.add(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].neg()).add(new i32(R1[1]).neg()))];
        case 0x801a: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.add(new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0))))).neg()).add(new i8(R1[1]).neg()))];
        case 0x801b: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.add(new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0))))).neg()).add(new i32(R1[1]).neg()))];
        case 0x8020: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))), $0.and(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x8021: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))), $0.and(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x8022: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.and(new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))))];
        case 0x8023: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.and(new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))))];
        case 0x8028: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(R1[2], ($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))).eq(($1 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add($1.neg()))];
        case 0x8029: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(R1[2], ($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))).eq(($1 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add($1.neg()))];
        case 0x802a: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(R1[2], ($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).eq(($1 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add($1.neg()))];
        case 0x802b: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(R1[2], ($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).eq(($1 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add($1.neg()))];
        case 0x8030: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))), $0.xor(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x8031: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))), $0.xor(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x8032: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.xor(new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))))];
        case 0x8033: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.xor(new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))))];
        case 0x8038: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(R1[2], new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0))))).eq(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])), new Mov(R1[1], new u1(0))];
        case 0x8039: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(R1[2], new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0))))).eq(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])), new Mov(R1[1], new u1(0))];
        case 0x803a: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(R1[2], R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].eq(new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0))))))), new Mov(R1[1], new u1(0))];
        case 0x803b: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(R1[2], R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].eq(new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0))))))), new Mov(R1[1], new u1(0))];
        case 0x69: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)]).mul(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))];
        case 0xc069: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], R32[((((b[i+1] & 7) & 0xff)) & 0xff)].mul(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))];
        case 0x8084: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(R1[2], new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0))))).and(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).eq(new i8(0))), new Mov(R1[1], new u1(0)), new Mov(R1[0], new u1(0))];
        case 0x8085: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(R1[2], new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0))))).and(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).eq(new i32(0))), new Mov(R1[1], new u1(0)), new Mov(R1[0], new u1(0))];
        case 0x8086: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($2 = new Register8), ($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0))))))), new Mov($0, ($1 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])), new Mov($1, $2)];
        case 0x8087: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(($2 = new Register32), ($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0))))))), new Mov($0, ($1 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])), new Mov($1, $2)];
        case 0x8088: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0))))), R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])];
        case 0x8089: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0))))), R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])];
        case 0x808a: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0))))))];
        case 0x808b: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0))))))];
        case 0x808c: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0))))), R16[((((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff) + 16) & 0xff)])];
        case 0x808d: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0)))))];
        case 0x808e: return [((((_pfxLength) & 0xff) + 6) & 0xff), new Mov(R16[((((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff) + 16) & 0xff)], new Mem16(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i32(new u32(((((b[i+2] | ((b[i+3] << 8) >>> 0)) >>> 0) | ((b[i+4] << 16) >>> 0)) >>> 0) | ((b[i+5] << 24) >>> 0))))))];
    }

    if((((((b[i] | ((b[i+1] << 8) >>> 0)) >>> 0) | ((((b[i+2] & 63) >>> 0) << 16) >>> 0)) >>> 0) & 0x3fc7ff) == 0x25446b)
    switch(0) {
        case 0x0: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new Mem32(R32[5].add(new i32(new i8(new u8(b[i+3]))))).mul(new i32(new i8(new u8(b[i+4])))))];
    }

    if((((((b[i] | ((b[i+1] << 8) >>> 0)) >>> 0) | ((((b[i+2] & 63) >>> 0) << 16) >>> 0)) >>> 0) & 0x38c7ff) == 0x20446b)
    switch(0) {
        case 0x0: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3])))).mul(new i32(new i8(new u8(b[i+4])))))];
    }

    if((((((b[i] | ((b[i+1] << 8) >>> 0)) >>> 0) | ((((b[i+2] & 7) >>> 0) << 16) >>> 0)) >>> 0) & 0x7c7ff) == 0x5446b)
    switch(0) {
        case 0x0: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3])))))).mul(new i32(new i8(new u8(b[i+4])))))];
    }

    if((((b[i] | ((b[i+1] << 8) & 0xffff)) & 0xffff) & 0xc7ff) == 0x446b)
    switch(0) {
        case 0x0: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3])))).mul(new i32(new i8(new u8(b[i+4])))))];
    }

    if((((((((((b[i] & 248) >>> 0) >> 3) >>> 0) | ((b[i+1] << 5) >>> 0)) >>> 0) | ((((b[i+2] & 63) >>> 0) << 13) >>> 0)) >>> 0) & 0x718f1) == 0x40890)
    switch(((b[i] | ((((b[i+1] & 63) & 0xffff) << 8) & 0xffff)) & 0xffff) & 0x3877) {
        case 0x0: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))), $0.add(new i8(new u8(b[i+4]))))];
        case 0x2: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))), $0.add(new i8(new u8(b[i+4]))))];
        case 0x3: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))), $0.add(new i8(new u8(b[i+4]))))];
        case 0x800: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))), new u8(new u8(b[i+4])).or($0))];
        case 0x802: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))), new u8(new u8(b[i+4])).or($0))];
        case 0x803: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))), new u32(new i8(new u8(b[i+4]))).or($0))];
        case 0x1000: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))), $0.add(new i8(new u8(b[i+4]))).add(R1[1]))];
        case 0x1002: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))), $0.add(new i8(new u8(b[i+4]))).add(R1[1]))];
        case 0x1003: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))), $0.add(new i8(new u8(b[i+4]))).add(R1[1]))];
        case 0x1800: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))), $0.add(new i8(-((b[i+4]) << 24 >> 24))).add(new i8(R1[1]).neg()))];
        case 0x1802: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))), $0.add(new i8(-((b[i+4]) << 24 >> 24))).add(new i8(R1[1]).neg()))];
        case 0x1803: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))), $0.add(new i32(-((((b[i+4]) << 24 >> 24)) >> 0))).add(new i32(R1[1]).neg()))];
        case 0x2000: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))), new u8(new u8(b[i+4])).and($0))];
        case 0x2002: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))), new u8(new u8(b[i+4])).and($0))];
        case 0x2003: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))), new u32(new i8(new u8(b[i+4]))).and($0))];
        case 0x2800: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(R1[2], ($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))).eq(new i8(new u8(b[i+4])))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add(new i8(-((b[i+4]) << 24 >> 24))))];
        case 0x2802: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(R1[2], ($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))).eq(new i8(new u8(b[i+4])))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add(new i8(-((b[i+4]) << 24 >> 24))))];
        case 0x2803: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(R1[2], ($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))).eq(new i32(new i8(new u8(b[i+4]))))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add(new i32(-((((b[i+4]) << 24 >> 24)) >> 0))))];
        case 0x3000: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))), $0.xor(new i8(new u8(b[i+4]))))];
        case 0x3002: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))), $0.xor(new i8(new u8(b[i+4]))))];
        case 0x3003: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))), $0.xor(new i8(new u8(b[i+4]))))];
        case 0x3800: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(R1[2], new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3])))).eq(new i8(new u8(b[i+4])))), new Mov(R1[1], new u1(0))];
        case 0x3802: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(R1[2], new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3])))).eq(new i8(new u8(b[i+4])))), new Mov(R1[1], new u1(0))];
        case 0x3803: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(R1[2], new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3])))).eq(new i32(new i8(new u8(b[i+4]))))), new Mov(R1[1], new u1(0))];
        case 0x46: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3])))), new i8(new u8(b[i+4])))];
        case 0x40: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))), $0.shl(new i8(new u8(b[i+4]))).or($0.shr(new u8(((((-((b[i+4]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 8))))];
        case 0x41: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))), $0.shl(new i8(new u8(b[i+4]))).or($0.shr(new u8(((((-((b[i+4]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 32))))];
        case 0x840: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))), $0.shr(new i8(new u8(b[i+4]))).or($0.shl(new u8(((((-((b[i+4]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 8))))];
        case 0x841: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))), $0.shr(new i8(new u8(b[i+4]))).or($0.shl(new u8(((((-((b[i+4]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 32))))];
        case 0x1040: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))), $0.shl(new i8(new u8(b[i+4]))).or($0.shr(new u8(((((-((b[i+4]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 8))))];
        case 0x1041: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))), $0.shl(new i8(new u8(b[i+4]))).or($0.shr(new u8(((((-((b[i+4]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 32))))];
        case 0x1840: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))), $0.shr(new i8(new u8(b[i+4]))).or($0.shl(new u8(((((-((b[i+4]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 8))))];
        case 0x1841: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))), $0.shr(new i8(new u8(b[i+4]))).or($0.shl(new u8(((((-((b[i+4]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 32))))];
        case 0x2040: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))), $0.shl(new i8(new u8(b[i+4]))))];
        case 0x2041: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))), $0.shl(new i8(new u8(b[i+4]))))];
        case 0x2840: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))), new u8($0).shr(new i8(new u8(b[i+4]))))];
        case 0x2841: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))), new u32($0).shr(new i8(new u8(b[i+4]))))];
        case 0x3040: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))), $0.shl(new i8(new u8(b[i+4]))))];
        case 0x3041: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))), $0.shl(new i8(new u8(b[i+4]))))];
        case 0x3840: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))), new i8($0).shr(new i8(new u8(b[i+4]))))];
        case 0x3841: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))), new i32($0).shr(new i8(new u8(b[i+4]))))];
        case 0x76: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(R1[2], new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3])))).and(new i8(new u8(b[i+4]))).eq(new i8(0))), new Mov(R1[1], new u1(0)), new Mov(R1[0], new u1(0))];
    }

    if((((((((b[i] & 248) & 0xffff) >> 3) & 0xffff) | ((b[i+1] << 5) & 0xffff)) & 0xffff) & 0x18f1) == 0x890)
    switch(((b[i] | ((((b[i+1] & 63) & 0xffff) << 8) & 0xffff)) & 0xffff) & 0x3877) {
        case 0x0: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))), $0.add(new i8(new u8(b[i+4]))))];
        case 0x2: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))), $0.add(new i8(new u8(b[i+4]))))];
        case 0x3: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))), $0.add(new i8(new u8(b[i+4]))))];
        case 0x800: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))), new u8(new u8(b[i+4])).or($0))];
        case 0x802: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))), new u8(new u8(b[i+4])).or($0))];
        case 0x803: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))), new u32(new i8(new u8(b[i+4]))).or($0))];
        case 0x1000: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))), $0.add(new i8(new u8(b[i+4]))).add(R1[1]))];
        case 0x1002: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))), $0.add(new i8(new u8(b[i+4]))).add(R1[1]))];
        case 0x1003: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))), $0.add(new i8(new u8(b[i+4]))).add(R1[1]))];
        case 0x1800: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))), $0.add(new i8(-((b[i+4]) << 24 >> 24))).add(new i8(R1[1]).neg()))];
        case 0x1802: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))), $0.add(new i8(-((b[i+4]) << 24 >> 24))).add(new i8(R1[1]).neg()))];
        case 0x1803: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))), $0.add(new i32(-((((b[i+4]) << 24 >> 24)) >> 0))).add(new i32(R1[1]).neg()))];
        case 0x2000: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))), new u8(new u8(b[i+4])).and($0))];
        case 0x2002: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))), new u8(new u8(b[i+4])).and($0))];
        case 0x2003: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))), new u32(new i8(new u8(b[i+4]))).and($0))];
        case 0x2800: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(R1[2], ($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))).eq(new i8(new u8(b[i+4])))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add(new i8(-((b[i+4]) << 24 >> 24))))];
        case 0x2802: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(R1[2], ($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))).eq(new i8(new u8(b[i+4])))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add(new i8(-((b[i+4]) << 24 >> 24))))];
        case 0x2803: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(R1[2], ($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))).eq(new i32(new i8(new u8(b[i+4]))))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add(new i32(-((((b[i+4]) << 24 >> 24)) >> 0))))];
        case 0x3000: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))), $0.xor(new i8(new u8(b[i+4]))))];
        case 0x3002: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))), $0.xor(new i8(new u8(b[i+4]))))];
        case 0x3003: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))), $0.xor(new i8(new u8(b[i+4]))))];
        case 0x3800: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(R1[2], new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3])))).eq(new i8(new u8(b[i+4])))), new Mov(R1[1], new u1(0))];
        case 0x3802: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(R1[2], new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3])))).eq(new i8(new u8(b[i+4])))), new Mov(R1[1], new u1(0))];
        case 0x3803: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(R1[2], new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3])))).eq(new i32(new i8(new u8(b[i+4]))))), new Mov(R1[1], new u1(0))];
        case 0x46: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3])))), new i8(new u8(b[i+4])))];
        case 0x40: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))), $0.shl(new i8(new u8(b[i+4]))).or($0.shr(new u8(((((-((b[i+4]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 8))))];
        case 0x41: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))), $0.shl(new i8(new u8(b[i+4]))).or($0.shr(new u8(((((-((b[i+4]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 32))))];
        case 0x840: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))), $0.shr(new i8(new u8(b[i+4]))).or($0.shl(new u8(((((-((b[i+4]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 8))))];
        case 0x841: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))), $0.shr(new i8(new u8(b[i+4]))).or($0.shl(new u8(((((-((b[i+4]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 32))))];
        case 0x1040: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))), $0.shl(new i8(new u8(b[i+4]))).or($0.shr(new u8(((((-((b[i+4]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 8))))];
        case 0x1041: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))), $0.shl(new i8(new u8(b[i+4]))).or($0.shr(new u8(((((-((b[i+4]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 32))))];
        case 0x1840: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))), $0.shr(new i8(new u8(b[i+4]))).or($0.shl(new u8(((((-((b[i+4]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 8))))];
        case 0x1841: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))), $0.shr(new i8(new u8(b[i+4]))).or($0.shl(new u8(((((-((b[i+4]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 32))))];
        case 0x2040: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))), $0.shl(new i8(new u8(b[i+4]))))];
        case 0x2041: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))), $0.shl(new i8(new u8(b[i+4]))))];
        case 0x2840: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))), new u8($0).shr(new i8(new u8(b[i+4]))))];
        case 0x2841: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))), new u32($0).shr(new i8(new u8(b[i+4]))))];
        case 0x3040: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))), $0.shl(new i8(new u8(b[i+4]))))];
        case 0x3041: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))), $0.shl(new i8(new u8(b[i+4]))))];
        case 0x3840: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))), new i8($0).shr(new i8(new u8(b[i+4]))))];
        case 0x3841: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))), new i32($0).shr(new i8(new u8(b[i+4]))))];
        case 0x76: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(R1[2], new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3])))).and(new i8(new u8(b[i+4]))).eq(new i8(0))), new Mov(R1[1], new u1(0)), new Mov(R1[0], new u1(0))];
    }

    if((((((((b[i] | ((b[i+1] << 8) >>> 0)) >>> 0) | ((b[i+2] << 16) >>> 0)) >>> 0) | ((((b[i+3] & 63) >>> 0) << 24) >>> 0)) >>> 0) & 0x3fc7c0ff) == 0x2544800f)
    switch(((b[i+1] & 63) & 0xff) & 0x3f) {
        case 0x10: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(new Mem8(R32[5].add(new i8(new u8(b[i+4])))), R1[0])];
        case 0x11: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(new Mem8(R32[5].add(new i8(new u8(b[i+4])))), R1[0].not())];
        case 0x12: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(new Mem8(R32[5].add(new i8(new u8(b[i+4])))), R1[1])];
        case 0x13: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(new Mem8(R32[5].add(new i8(new u8(b[i+4])))), R1[1].not())];
        case 0x14: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(new Mem8(R32[5].add(new i8(new u8(b[i+4])))), R1[2])];
        case 0x15: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(new Mem8(R32[5].add(new i8(new u8(b[i+4])))), R1[2].not())];
        case 0x16: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(new Mem8(R32[5].add(new i8(new u8(b[i+4])))), R1[1].or(R1[2]))];
        case 0x17: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(new Mem8(R32[5].add(new i8(new u8(b[i+4])))), R1[1].not().and(R1[2].not()))];
        case 0x18: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(new Mem8(R32[5].add(new i8(new u8(b[i+4])))), R1[3])];
        case 0x19: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(new Mem8(R32[5].add(new i8(new u8(b[i+4])))), R1[3].not())];
        case 0x1a: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(new Mem8(R32[5].add(new i8(new u8(b[i+4])))), R1[4])];
        case 0x1b: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(new Mem8(R32[5].add(new i8(new u8(b[i+4])))), R1[4].not())];
        case 0x1c: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(new Mem8(R32[5].add(new i8(new u8(b[i+4])))), R1[0].eq(R1[3]).not())];
        case 0x1d: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(new Mem8(R32[5].add(new i8(new u8(b[i+4])))), R1[0].eq(R1[3]))];
        case 0x1e: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(new Mem8(R32[5].add(new i8(new u8(b[i+4])))), R1[0].eq(R1[3]).not().or(R1[2]))];
        case 0x1f: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(new Mem8(R32[5].add(new i8(new u8(b[i+4])))), R1[0].eq(R1[3]).and(R1[2].not()))];
        case 0x23: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(R1[1], new u32(1).shl(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).and(new Mem32(R32[5].add(new i32(new i8(new u8(b[i+4])))))).eq(new u8(0)).not())];
        case 0x25: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(new i8(new u8(b[i+4])))))), $0.shl(($1 = R8[1])).or(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shr(new u8($1.neg()).add(new u8(32)))))];
        case 0x2b: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(R1[1], new u32(1).shl(($1 = R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])).and(($0 = new Mem32(R32[5].add(new i32(new i8(new u8(b[i+4]))))))).eq(new u8(0)).not()), new Mov($0, new u32(1).shl($1).or($0))];
        case 0x2d: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($1 = new Mem32(R32[5].add(new i32(new i8(new u8(b[i+4])))))), new u32(1).shl(($0 = R8[1])).add(new i32(-1)).shl(new u8($0.neg()).add(new u8(32))).and(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).or($1.shr($0)))];
        case 0x2f: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])), $0.mul(new i32(new Mem32(R32[5].add(new i32(new i8(new u8(b[i+4]))))))))];
        case 0x36: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new Mem8(R32[5].add(new i8(new u8(b[i+4])))))];
        case 0x37: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new Mem16(R32[5].add(new i16(new i8(new u8(b[i+4]))))))];
        case 0x3e: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new i32(new Mem8(R32[5].add(new i8(new u8(b[i+4]))))))];
        case 0x3f: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new i32(new Mem16(R32[5].add(new i16(new i8(new u8(b[i+4])))))))];
    }

    if((((((((b[i] | ((b[i+1] << 8) >>> 0)) >>> 0) | ((b[i+2] << 16) >>> 0)) >>> 0) | ((((b[i+3] & 63) >>> 0) << 24) >>> 0)) >>> 0) & 0x3887c0ff) == 0x2004800f)
    switch(((b[i+1] | ((((b[i+2] & 127) & 0xffff) << 8) & 0xffff)) & 0xffff) & 0x403f) {
        case 0x4010: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(new Mem8(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+4])))), R1[0])];
        case 0x4011: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(new Mem8(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+4])))), R1[0].not())];
        case 0x4012: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(new Mem8(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+4])))), R1[1])];
        case 0x4013: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(new Mem8(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+4])))), R1[1].not())];
        case 0x4014: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(new Mem8(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+4])))), R1[2])];
        case 0x4015: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(new Mem8(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+4])))), R1[2].not())];
        case 0x4016: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(new Mem8(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+4])))), R1[1].or(R1[2]))];
        case 0x4017: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(new Mem8(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+4])))), R1[1].not().and(R1[2].not()))];
        case 0x4018: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(new Mem8(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+4])))), R1[3])];
        case 0x4019: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(new Mem8(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+4])))), R1[3].not())];
        case 0x401a: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(new Mem8(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+4])))), R1[4])];
        case 0x401b: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(new Mem8(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+4])))), R1[4].not())];
        case 0x401c: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(new Mem8(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+4])))), R1[0].eq(R1[3]).not())];
        case 0x401d: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(new Mem8(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+4])))), R1[0].eq(R1[3]))];
        case 0x401e: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(new Mem8(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+4])))), R1[0].eq(R1[3]).not().or(R1[2]))];
        case 0x401f: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(new Mem8(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+4])))), R1[0].eq(R1[3]).and(R1[2].not()))];
        case 0x4023: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(R1[1], new u32(1).shl(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).and(new Mem32(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+4]))))).eq(new u8(0)).not())];
        case 0x24: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+3] & 7) & 0xff)) & 0xff)])), $0.shl(new i8(new u8(b[i+4]))).or(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shr(new u8(((((-((b[i+4]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 32))))];
        case 0x4025: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+4]))))), $0.shl(($1 = R8[1])).or(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shr(new u8($1.neg()).add(new u8(32)))))];
        case 0x402b: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(R1[1], new u32(1).shl(($1 = R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])).and(($0 = new Mem32(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+4])))))).eq(new u8(0)).not()), new Mov($0, new u32(1).shl($1).or($0))];
        case 0x2c: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+3] & 7) & 0xff)) & 0xff)])), new u32(((((1 << (((b[i+4]) << 24 >> 24) & 0x1f)) >>> 0) + -1) >>> 0) << (((((((-((b[i+4]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 32) & 0xff) & 0x1f)).and(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).or($0.shr(new i8(new u8(b[i+4])))))];
        case 0x402d: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($1 = new Mem32(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+4]))))), new u32(1).shl(($0 = R8[1])).add(new i32(-1)).shl(new u8($0.neg()).add(new u8(32))).and(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).or($1.shr($0)))];
        case 0x402f: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])), $0.mul(new i32(new Mem32(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+4])))))))];
        case 0x4036: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new Mem8(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+4])))))];
        case 0x4037: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new Mem16(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+4])))))];
        case 0x403e: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new i32(new Mem8(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+4]))))))];
        case 0x403f: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new i32(new Mem16(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+4]))))))];
    }

    if((((((((b[i] | ((b[i+1] << 8) >>> 0)) >>> 0) | ((b[i+2] << 16) >>> 0)) >>> 0) | ((((b[i+3] & 7) >>> 0) << 24) >>> 0)) >>> 0) & 0x7c7c0ff) == 0x544800f)
    switch(((b[i+1] & 63) & 0xff) & 0x3f) {
        case 0x10: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(new Mem8(R32[5].add(new i32(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+4])))))), R1[0])];
        case 0x11: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(new Mem8(R32[5].add(new i32(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+4])))))), R1[0].not())];
        case 0x12: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(new Mem8(R32[5].add(new i32(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+4])))))), R1[1])];
        case 0x13: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(new Mem8(R32[5].add(new i32(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+4])))))), R1[1].not())];
        case 0x14: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(new Mem8(R32[5].add(new i32(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+4])))))), R1[2])];
        case 0x15: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(new Mem8(R32[5].add(new i32(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+4])))))), R1[2].not())];
        case 0x16: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(new Mem8(R32[5].add(new i32(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+4])))))), R1[1].or(R1[2]))];
        case 0x17: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(new Mem8(R32[5].add(new i32(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+4])))))), R1[1].not().and(R1[2].not()))];
        case 0x18: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(new Mem8(R32[5].add(new i32(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+4])))))), R1[3])];
        case 0x19: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(new Mem8(R32[5].add(new i32(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+4])))))), R1[3].not())];
        case 0x1a: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(new Mem8(R32[5].add(new i32(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+4])))))), R1[4])];
        case 0x1b: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(new Mem8(R32[5].add(new i32(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+4])))))), R1[4].not())];
        case 0x1c: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(new Mem8(R32[5].add(new i32(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+4])))))), R1[0].eq(R1[3]).not())];
        case 0x1d: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(new Mem8(R32[5].add(new i32(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+4])))))), R1[0].eq(R1[3]))];
        case 0x1e: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(new Mem8(R32[5].add(new i32(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+4])))))), R1[0].eq(R1[3]).not().or(R1[2]))];
        case 0x1f: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(new Mem8(R32[5].add(new i32(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+4])))))), R1[0].eq(R1[3]).and(R1[2].not()))];
        case 0x23: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(R1[1], new u32(1).shl(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).and(new Mem32(R32[5].add(new i32(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+4]))))))).eq(new u8(0)).not())];
        case 0x25: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+4]))))))), $0.shl(($1 = R8[1])).or(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shr(new u8($1.neg()).add(new u8(32)))))];
        case 0x2b: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(R1[1], new u32(1).shl(($1 = R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])).and(($0 = new Mem32(R32[5].add(new i32(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+4])))))))).eq(new u8(0)).not()), new Mov($0, new u32(1).shl($1).or($0))];
        case 0x2d: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($1 = new Mem32(R32[5].add(new i32(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+4]))))))), new u32(1).shl(($0 = R8[1])).add(new i32(-1)).shl(new u8($0.neg()).add(new u8(32))).and(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).or($1.shr($0)))];
        case 0x2f: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])), $0.mul(new i32(new Mem32(R32[5].add(new i32(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+4])))))))))];
        case 0x36: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new Mem8(R32[5].add(new i32(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+4])))))))];
        case 0x37: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new Mem16(R32[5].add(new i32(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+4])))))))];
        case 0x3e: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new i32(new Mem8(R32[5].add(new i32(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+4]))))))))];
        case 0x3f: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new i32(new Mem16(R32[5].add(new i32(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+4]))))))))];
    }

    if((((((b[i] | ((b[i+1] << 8) >>> 0)) >>> 0) | ((b[i+2] << 16) >>> 0)) >>> 0) & 0xc0f7ff) == 0x40a40f)
    switch(((((b[i+1] & 8) & 0xff) >> 3) & 0xff) & 0x1) {
        case 0x0: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))), $0.shl(new i8(new u8(b[i+4]))).or(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shr(new u8(((((-((b[i+4]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 32))))];
        case 0x1: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))), new u32(((((1 << (((b[i+4]) << 24 >> 24) & 0x1f)) >>> 0) + -1) >>> 0) << (((((((-((b[i+4]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 32) & 0xff) & 0x1f)).and(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).or($0.shr(new i8(new u8(b[i+4])))))];
    }

    if((((((b[i] | ((b[i+1] << 8) >>> 0)) >>> 0) | ((b[i+2] << 16) >>> 0)) >>> 0) & 0x87c0ff) == 0x4800f)
    switch(((b[i+1] | ((((b[i+2] & 127) & 0xffff) << 8) & 0xffff)) & 0xffff) & 0x403f) {
        case 0x4010: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(new Mem8(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+4])))), R1[0])];
        case 0x4011: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(new Mem8(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+4])))), R1[0].not())];
        case 0x4012: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(new Mem8(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+4])))), R1[1])];
        case 0x4013: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(new Mem8(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+4])))), R1[1].not())];
        case 0x4014: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(new Mem8(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+4])))), R1[2])];
        case 0x4015: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(new Mem8(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+4])))), R1[2].not())];
        case 0x4016: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(new Mem8(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+4])))), R1[1].or(R1[2]))];
        case 0x4017: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(new Mem8(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+4])))), R1[1].not().and(R1[2].not()))];
        case 0x4018: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(new Mem8(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+4])))), R1[3])];
        case 0x4019: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(new Mem8(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+4])))), R1[3].not())];
        case 0x401a: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(new Mem8(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+4])))), R1[4])];
        case 0x401b: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(new Mem8(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+4])))), R1[4].not())];
        case 0x401c: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(new Mem8(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+4])))), R1[0].eq(R1[3]).not())];
        case 0x401d: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(new Mem8(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+4])))), R1[0].eq(R1[3]))];
        case 0x401e: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(new Mem8(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+4])))), R1[0].eq(R1[3]).not().or(R1[2]))];
        case 0x401f: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(new Mem8(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+4])))), R1[0].eq(R1[3]).and(R1[2].not()))];
        case 0x4023: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(R1[1], new u32(1).shl(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).and(new Mem32(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+4]))))).eq(new u8(0)).not())];
        case 0x24: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6))))), $0.shl(new i8(new u8(b[i+4]))).or(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shr(new u8(((((-((b[i+4]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 32))))];
        case 0x4025: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+4]))))), $0.shl(($1 = R8[1])).or(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shr(new u8($1.neg()).add(new u8(32)))))];
        case 0x402b: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(R1[1], new u32(1).shl(($1 = R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])).and(($0 = new Mem32(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+4])))))).eq(new u8(0)).not()), new Mov($0, new u32(1).shl($1).or($0))];
        case 0x2c: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6))))), new u32(((((1 << (((b[i+4]) << 24 >> 24) & 0x1f)) >>> 0) + -1) >>> 0) << (((((((-((b[i+4]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 32) & 0xff) & 0x1f)).and(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).or($0.shr(new i8(new u8(b[i+4])))))];
        case 0x402d: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($1 = new Mem32(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+4]))))), new u32(1).shl(($0 = R8[1])).add(new i32(-1)).shl(new u8($0.neg()).add(new u8(32))).and(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).or($1.shr($0)))];
        case 0x402f: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])), $0.mul(new i32(new Mem32(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+4])))))))];
        case 0x4036: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new Mem8(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+4])))))];
        case 0x4037: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new Mem16(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+4])))))];
        case 0x403e: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new i32(new Mem8(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+4]))))))];
        case 0x403f: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new i32(new Mem16(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+4]))))))];
    }

    if((((((((((b[i] & 248) >>> 0) >> 3) >>> 0) | ((b[i+1] << 5) >>> 0)) >>> 0) | ((((b[i+2] & 63) >>> 0) << 13) >>> 0)) >>> 0) & 0x7f8f1) == 0x4a890)
    switch(((b[i] | ((((b[i+1] & 63) & 0xffff) << 8) & 0xffff)) & 0xffff) & 0x3877) {
        case 0x0: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i8(new u8(b[i+3]))))), $0.add(new i8(new u8(b[i+4]))))];
        case 0x2: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i8(new u8(b[i+3]))))), $0.add(new i8(new u8(b[i+4]))))];
        case 0x3: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(new i8(new u8(b[i+3])))))), $0.add(new i8(new u8(b[i+4]))))];
        case 0x800: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i8(new u8(b[i+3]))))), new u8(new u8(b[i+4])).or($0))];
        case 0x802: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i8(new u8(b[i+3]))))), new u8(new u8(b[i+4])).or($0))];
        case 0x803: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(new i8(new u8(b[i+3])))))), new u32(new i8(new u8(b[i+4]))).or($0))];
        case 0x1000: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i8(new u8(b[i+3]))))), $0.add(new i8(new u8(b[i+4]))).add(R1[1]))];
        case 0x1002: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i8(new u8(b[i+3]))))), $0.add(new i8(new u8(b[i+4]))).add(R1[1]))];
        case 0x1003: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(new i8(new u8(b[i+3])))))), $0.add(new i8(new u8(b[i+4]))).add(R1[1]))];
        case 0x1800: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i8(new u8(b[i+3]))))), $0.add(new i8(-((b[i+4]) << 24 >> 24))).add(new i8(R1[1]).neg()))];
        case 0x1802: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i8(new u8(b[i+3]))))), $0.add(new i8(-((b[i+4]) << 24 >> 24))).add(new i8(R1[1]).neg()))];
        case 0x1803: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(new i8(new u8(b[i+3])))))), $0.add(new i32(-((((b[i+4]) << 24 >> 24)) >> 0))).add(new i32(R1[1]).neg()))];
        case 0x2000: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i8(new u8(b[i+3]))))), new u8(new u8(b[i+4])).and($0))];
        case 0x2002: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i8(new u8(b[i+3]))))), new u8(new u8(b[i+4])).and($0))];
        case 0x2003: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(new i8(new u8(b[i+3])))))), new u32(new i8(new u8(b[i+4]))).and($0))];
        case 0x2800: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(R1[2], ($0 = new Mem8(R32[5].add(new i8(new u8(b[i+3]))))).eq(new i8(new u8(b[i+4])))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add(new i8(-((b[i+4]) << 24 >> 24))))];
        case 0x2802: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(R1[2], ($0 = new Mem8(R32[5].add(new i8(new u8(b[i+3]))))).eq(new i8(new u8(b[i+4])))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add(new i8(-((b[i+4]) << 24 >> 24))))];
        case 0x2803: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(R1[2], ($0 = new Mem32(R32[5].add(new i32(new i8(new u8(b[i+3])))))).eq(new i32(new i8(new u8(b[i+4]))))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add(new i32(-((((b[i+4]) << 24 >> 24)) >> 0))))];
        case 0x3000: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i8(new u8(b[i+3]))))), $0.xor(new i8(new u8(b[i+4]))))];
        case 0x3002: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i8(new u8(b[i+3]))))), $0.xor(new i8(new u8(b[i+4]))))];
        case 0x3003: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(new i8(new u8(b[i+3])))))), $0.xor(new i8(new u8(b[i+4]))))];
        case 0x3800: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(R1[2], new Mem8(R32[5].add(new i8(new u8(b[i+3])))).eq(new i8(new u8(b[i+4])))), new Mov(R1[1], new u1(0))];
        case 0x3802: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(R1[2], new Mem8(R32[5].add(new i8(new u8(b[i+3])))).eq(new i8(new u8(b[i+4])))), new Mov(R1[1], new u1(0))];
        case 0x3803: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(R1[2], new Mem32(R32[5].add(new i32(new i8(new u8(b[i+3]))))).eq(new i32(new i8(new u8(b[i+4]))))), new Mov(R1[1], new u1(0))];
        case 0x46: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(new Mem8(R32[5].add(new i8(new u8(b[i+3])))), new i8(new u8(b[i+4])))];
        case 0x40: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i8(new u8(b[i+3]))))), $0.shl(new i8(new u8(b[i+4]))).or($0.shr(new u8(((((-((b[i+4]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 8))))];
        case 0x41: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(new i8(new u8(b[i+3])))))), $0.shl(new i8(new u8(b[i+4]))).or($0.shr(new u8(((((-((b[i+4]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 32))))];
        case 0x840: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i8(new u8(b[i+3]))))), $0.shr(new i8(new u8(b[i+4]))).or($0.shl(new u8(((((-((b[i+4]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 8))))];
        case 0x841: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(new i8(new u8(b[i+3])))))), $0.shr(new i8(new u8(b[i+4]))).or($0.shl(new u8(((((-((b[i+4]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 32))))];
        case 0x1040: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i8(new u8(b[i+3]))))), $0.shl(new i8(new u8(b[i+4]))).or($0.shr(new u8(((((-((b[i+4]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 8))))];
        case 0x1041: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(new i8(new u8(b[i+3])))))), $0.shl(new i8(new u8(b[i+4]))).or($0.shr(new u8(((((-((b[i+4]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 32))))];
        case 0x1840: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i8(new u8(b[i+3]))))), $0.shr(new i8(new u8(b[i+4]))).or($0.shl(new u8(((((-((b[i+4]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 8))))];
        case 0x1841: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(new i8(new u8(b[i+3])))))), $0.shr(new i8(new u8(b[i+4]))).or($0.shl(new u8(((((-((b[i+4]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 32))))];
        case 0x2040: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i8(new u8(b[i+3]))))), $0.shl(new i8(new u8(b[i+4]))))];
        case 0x2041: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(new i8(new u8(b[i+3])))))), $0.shl(new i8(new u8(b[i+4]))))];
        case 0x2840: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i8(new u8(b[i+3]))))), new u8($0).shr(new i8(new u8(b[i+4]))))];
        case 0x2841: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(new i8(new u8(b[i+3])))))), new u32($0).shr(new i8(new u8(b[i+4]))))];
        case 0x3040: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i8(new u8(b[i+3]))))), $0.shl(new i8(new u8(b[i+4]))))];
        case 0x3041: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(new i8(new u8(b[i+3])))))), $0.shl(new i8(new u8(b[i+4]))))];
        case 0x3840: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i8(new u8(b[i+3]))))), new i8($0).shr(new i8(new u8(b[i+4]))))];
        case 0x3841: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(new i8(new u8(b[i+3])))))), new i32($0).shr(new i8(new u8(b[i+4]))))];
        case 0x76: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(R1[2], new Mem8(R32[5].add(new i8(new u8(b[i+3])))).and(new i8(new u8(b[i+4]))).eq(new i8(0))), new Mov(R1[1], new u1(0)), new Mov(R1[0], new u1(0))];
    }

    if((((((((((b[i] & 248) & 0xffff) >> 3) & 0xffff) | ((b[i+1] << 5) & 0xffff)) & 0xffff) | ((((b[i+2] & 7) & 0xffff) << 13) & 0xffff)) & 0xffff) & 0xf8f1) == 0xa890)
    switch(((b[i] | ((((b[i+1] & 63) & 0xffff) << 8) & 0xffff)) & 0xffff) & 0x3877) {
        case 0x0: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))), $0.add(new i8(new u8(b[i+4]))))];
        case 0x2: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))), $0.add(new i8(new u8(b[i+4]))))];
        case 0x3: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))), $0.add(new i8(new u8(b[i+4]))))];
        case 0x800: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))), new u8(new u8(b[i+4])).or($0))];
        case 0x802: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))), new u8(new u8(b[i+4])).or($0))];
        case 0x803: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))), new u32(new i8(new u8(b[i+4]))).or($0))];
        case 0x1000: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))), $0.add(new i8(new u8(b[i+4]))).add(R1[1]))];
        case 0x1002: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))), $0.add(new i8(new u8(b[i+4]))).add(R1[1]))];
        case 0x1003: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))), $0.add(new i8(new u8(b[i+4]))).add(R1[1]))];
        case 0x1800: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))), $0.add(new i8(-((b[i+4]) << 24 >> 24))).add(new i8(R1[1]).neg()))];
        case 0x1802: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))), $0.add(new i8(-((b[i+4]) << 24 >> 24))).add(new i8(R1[1]).neg()))];
        case 0x1803: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))), $0.add(new i32(-((((b[i+4]) << 24 >> 24)) >> 0))).add(new i32(R1[1]).neg()))];
        case 0x2000: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))), new u8(new u8(b[i+4])).and($0))];
        case 0x2002: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))), new u8(new u8(b[i+4])).and($0))];
        case 0x2003: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))), new u32(new i8(new u8(b[i+4]))).and($0))];
        case 0x2800: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(R1[2], ($0 = new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))).eq(new i8(new u8(b[i+4])))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add(new i8(-((b[i+4]) << 24 >> 24))))];
        case 0x2802: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(R1[2], ($0 = new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))).eq(new i8(new u8(b[i+4])))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add(new i8(-((b[i+4]) << 24 >> 24))))];
        case 0x2803: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(R1[2], ($0 = new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))).eq(new i32(new i8(new u8(b[i+4]))))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add(new i32(-((((b[i+4]) << 24 >> 24)) >> 0))))];
        case 0x3000: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))), $0.xor(new i8(new u8(b[i+4]))))];
        case 0x3002: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))), $0.xor(new i8(new u8(b[i+4]))))];
        case 0x3003: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))), $0.xor(new i8(new u8(b[i+4]))))];
        case 0x3800: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(R1[2], new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3])))))).eq(new i8(new u8(b[i+4])))), new Mov(R1[1], new u1(0))];
        case 0x3802: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(R1[2], new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3])))))).eq(new i8(new u8(b[i+4])))), new Mov(R1[1], new u1(0))];
        case 0x3803: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(R1[2], new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3])))))).eq(new i32(new i8(new u8(b[i+4]))))), new Mov(R1[1], new u1(0))];
        case 0x46: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3])))))), new i8(new u8(b[i+4])))];
        case 0x40: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))), $0.shl(new i8(new u8(b[i+4]))).or($0.shr(new u8(((((-((b[i+4]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 8))))];
        case 0x41: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))), $0.shl(new i8(new u8(b[i+4]))).or($0.shr(new u8(((((-((b[i+4]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 32))))];
        case 0x840: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))), $0.shr(new i8(new u8(b[i+4]))).or($0.shl(new u8(((((-((b[i+4]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 8))))];
        case 0x841: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))), $0.shr(new i8(new u8(b[i+4]))).or($0.shl(new u8(((((-((b[i+4]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 32))))];
        case 0x1040: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))), $0.shl(new i8(new u8(b[i+4]))).or($0.shr(new u8(((((-((b[i+4]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 8))))];
        case 0x1041: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))), $0.shl(new i8(new u8(b[i+4]))).or($0.shr(new u8(((((-((b[i+4]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 32))))];
        case 0x1840: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))), $0.shr(new i8(new u8(b[i+4]))).or($0.shl(new u8(((((-((b[i+4]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 8))))];
        case 0x1841: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))), $0.shr(new i8(new u8(b[i+4]))).or($0.shl(new u8(((((-((b[i+4]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 32))))];
        case 0x2040: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))), $0.shl(new i8(new u8(b[i+4]))))];
        case 0x2041: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))), $0.shl(new i8(new u8(b[i+4]))))];
        case 0x2840: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))), new u8($0).shr(new i8(new u8(b[i+4]))))];
        case 0x2841: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))), new u32($0).shr(new i8(new u8(b[i+4]))))];
        case 0x3040: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))), $0.shl(new i8(new u8(b[i+4]))))];
        case 0x3041: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))), $0.shl(new i8(new u8(b[i+4]))))];
        case 0x3840: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))), new i8($0).shr(new i8(new u8(b[i+4]))))];
        case 0x3841: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))), new i32($0).shr(new i8(new u8(b[i+4]))))];
        case 0x76: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(R1[2], new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3])))))).and(new i8(new u8(b[i+4]))).eq(new i8(0))), new Mov(R1[1], new u1(0)), new Mov(R1[0], new u1(0))];
    }

    
    switch(b[i] & 0xff) {
        case 0x5: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = R32[0]), $0.add(new i32(new u32(((((b[i+1] | ((b[i+2] << 8) >>> 0)) >>> 0) | ((b[i+3] << 16) >>> 0)) >>> 0) | ((b[i+4] << 24) >>> 0)))))];
        case 0xd: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = R32[0]), $0.or(new i32(new u32(((((b[i+1] | ((b[i+2] << 8) >>> 0)) >>> 0) | ((b[i+3] << 16) >>> 0)) >>> 0) | ((b[i+4] << 24) >>> 0)))))];
        case 0x15: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = R32[0]), $0.add(new i32(new u32(((((b[i+1] | ((b[i+2] << 8) >>> 0)) >>> 0) | ((b[i+3] << 16) >>> 0)) >>> 0) | ((b[i+4] << 24) >>> 0)))).add(R1[1]))];
        case 0x1d: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = R32[0]), $0.add(new i32(-((((((((b[i+1] | ((b[i+2] << 8) >>> 0)) >>> 0) | ((b[i+3] << 16) >>> 0)) >>> 0) | ((b[i+4] << 24) >>> 0)) >>> 0)) >> 0))).add(new i32(R1[1]).neg()))];
        case 0x25: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = R32[0]), $0.and(new i32(new u32(((((b[i+1] | ((b[i+2] << 8) >>> 0)) >>> 0) | ((b[i+3] << 16) >>> 0)) >>> 0) | ((b[i+4] << 24) >>> 0)))))];
        case 0x2d: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(R1[2], ($0 = R32[0]).eq(new i32(new u32(((((b[i+1] | ((b[i+2] << 8) >>> 0)) >>> 0) | ((b[i+3] << 16) >>> 0)) >>> 0) | ((b[i+4] << 24) >>> 0))))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add(new i32(-((((((((b[i+1] | ((b[i+2] << 8) >>> 0)) >>> 0) | ((b[i+3] << 16) >>> 0)) >>> 0) | ((b[i+4] << 24) >>> 0)) >>> 0)) >> 0))))];
        case 0x35: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = R32[0]), $0.xor(new i32(new u32(((((b[i+1] | ((b[i+2] << 8) >>> 0)) >>> 0) | ((b[i+3] << 16) >>> 0)) >>> 0) | ((b[i+4] << 24) >>> 0)))))];
        case 0x3d: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(R1[2], R32[0].eq(new i32(new u32(((((b[i+1] | ((b[i+2] << 8) >>> 0)) >>> 0) | ((b[i+3] << 16) >>> 0)) >>> 0) | ((b[i+4] << 24) >>> 0))))), new Mov(R1[1], new u1(0))];
        case 0x68: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = R32[4]), $0.add(new i32(-4))), new Mov(new Mem32($0), new i32(new u32(((((b[i+1] | ((b[i+2] << 8) >>> 0)) >>> 0) | ((b[i+3] << 16) >>> 0)) >>> 0) | ((b[i+4] << 24) >>> 0))))];
        case 0xa0: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(R8[0], new Mem8(new u32(((((b[i+1] | ((b[i+2] << 8) >>> 0)) >>> 0) | ((b[i+3] << 16) >>> 0)) >>> 0) | ((b[i+4] << 24) >>> 0))))];
        case 0xa1: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(R32[0], new Mem32(new u32(((((b[i+1] | ((b[i+2] << 8) >>> 0)) >>> 0) | ((b[i+3] << 16) >>> 0)) >>> 0) | ((b[i+4] << 24) >>> 0))))];
        case 0xa2: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(new Mem8(new u32(((((b[i+1] | ((b[i+2] << 8) >>> 0)) >>> 0) | ((b[i+3] << 16) >>> 0)) >>> 0) | ((b[i+4] << 24) >>> 0))), R8[0])];
        case 0xa3: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(new Mem32(new u32(((((b[i+1] | ((b[i+2] << 8) >>> 0)) >>> 0) | ((b[i+3] << 16) >>> 0)) >>> 0) | ((b[i+4] << 24) >>> 0))), R32[0])];
        case 0xa9: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(R1[2], R32[0].and(new i32(new u32(((((b[i+1] | ((b[i+2] << 8) >>> 0)) >>> 0) | ((b[i+3] << 16) >>> 0)) >>> 0) | ((b[i+4] << 24) >>> 0)))).eq(new i32(0))), new Mov(R1[1], new u1(0)), new Mov(R1[0], new u1(0))];
        case 0xb8: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(R32[0], new i32(new u32(((((b[i+1] | ((b[i+2] << 8) >>> 0)) >>> 0) | ((b[i+3] << 16) >>> 0)) >>> 0) | ((b[i+4] << 24) >>> 0))))];
        case 0xb9: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(R32[1], new i32(new u32(((((b[i+1] | ((b[i+2] << 8) >>> 0)) >>> 0) | ((b[i+3] << 16) >>> 0)) >>> 0) | ((b[i+4] << 24) >>> 0))))];
        case 0xba: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(R32[2], new i32(new u32(((((b[i+1] | ((b[i+2] << 8) >>> 0)) >>> 0) | ((b[i+3] << 16) >>> 0)) >>> 0) | ((b[i+4] << 24) >>> 0))))];
        case 0xbb: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(R32[3], new i32(new u32(((((b[i+1] | ((b[i+2] << 8) >>> 0)) >>> 0) | ((b[i+3] << 16) >>> 0)) >>> 0) | ((b[i+4] << 24) >>> 0))))];
        case 0xbc: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(R32[4], new i32(new u32(((((b[i+1] | ((b[i+2] << 8) >>> 0)) >>> 0) | ((b[i+3] << 16) >>> 0)) >>> 0) | ((b[i+4] << 24) >>> 0))))];
        case 0xbd: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(R32[5], new i32(new u32(((((b[i+1] | ((b[i+2] << 8) >>> 0)) >>> 0) | ((b[i+3] << 16) >>> 0)) >>> 0) | ((b[i+4] << 24) >>> 0))))];
        case 0xbe: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(R32[6], new i32(new u32(((((b[i+1] | ((b[i+2] << 8) >>> 0)) >>> 0) | ((b[i+3] << 16) >>> 0)) >>> 0) | ((b[i+4] << 24) >>> 0))))];
        case 0xbf: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(R32[7], new i32(new u32(((((b[i+1] | ((b[i+2] << 8) >>> 0)) >>> 0) | ((b[i+3] << 16) >>> 0)) >>> 0) | ((b[i+4] << 24) >>> 0))))];
        case 0xe8: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = R32[4]), $0.add(new i32(-4))), new Mov(new Mem32($0), ($1 = R32[8]).add(new i8(_pfxLength + 5))), new Mov($1, $1.add(new i32(((((((((b[i+1] | ((b[i+2] << 8) >>> 0)) >>> 0) | ((b[i+3] << 16) >>> 0)) >>> 0) | ((b[i+4] << 24) >>> 0)) >>> 0)) >> 0) + ((_pfxLength + 5) << 24 >> 24))))];
        case 0xe9: return [((((_pfxLength) & 0xff) + 5) & 0xff), new Mov(($0 = R32[8]), $0.add(new i32(((((((((b[i+1] | ((b[i+2] << 8) >>> 0)) >>> 0) | ((b[i+3] << 16) >>> 0)) >>> 0) | ((b[i+4] << 24) >>> 0)) >>> 0)) >> 0) + ((_pfxLength + 5) << 24 >> 24))))];
    }

    if((((b[i] | ((b[i+1] << 8) & 0xffff)) & 0xffff) & 0xc0ff) == 0x406b)
    switch(0) {
        case 0x0: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2])))).mul(new i32(new i8(new u8(b[i+3])))))];
    }

    if((((((((b[i] | ((b[i+1] << 8) >>> 0)) >>> 0) | ((b[i+2] << 16) >>> 0)) >>> 0) | ((((b[i+3] & 63) >>> 0) << 24) >>> 0)) >>> 0) & 0x38c7c0ff) == 0x2004800f)
    switch(((b[i+1] & 63) & 0xff) & 0x3f) {
        case 0x10: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(new Mem8(R32[((((b[i+3] & 7) & 0xff)) & 0xff)]), R1[0])];
        case 0x11: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(new Mem8(R32[((((b[i+3] & 7) & 0xff)) & 0xff)]), R1[0].not())];
        case 0x12: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(new Mem8(R32[((((b[i+3] & 7) & 0xff)) & 0xff)]), R1[1])];
        case 0x13: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(new Mem8(R32[((((b[i+3] & 7) & 0xff)) & 0xff)]), R1[1].not())];
        case 0x14: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(new Mem8(R32[((((b[i+3] & 7) & 0xff)) & 0xff)]), R1[2])];
        case 0x15: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(new Mem8(R32[((((b[i+3] & 7) & 0xff)) & 0xff)]), R1[2].not())];
        case 0x16: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(new Mem8(R32[((((b[i+3] & 7) & 0xff)) & 0xff)]), R1[1].or(R1[2]))];
        case 0x17: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(new Mem8(R32[((((b[i+3] & 7) & 0xff)) & 0xff)]), R1[1].not().and(R1[2].not()))];
        case 0x18: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(new Mem8(R32[((((b[i+3] & 7) & 0xff)) & 0xff)]), R1[3])];
        case 0x19: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(new Mem8(R32[((((b[i+3] & 7) & 0xff)) & 0xff)]), R1[3].not())];
        case 0x1a: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(new Mem8(R32[((((b[i+3] & 7) & 0xff)) & 0xff)]), R1[4])];
        case 0x1b: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(new Mem8(R32[((((b[i+3] & 7) & 0xff)) & 0xff)]), R1[4].not())];
        case 0x1c: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(new Mem8(R32[((((b[i+3] & 7) & 0xff)) & 0xff)]), R1[0].eq(R1[3]).not())];
        case 0x1d: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(new Mem8(R32[((((b[i+3] & 7) & 0xff)) & 0xff)]), R1[0].eq(R1[3]))];
        case 0x1e: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(new Mem8(R32[((((b[i+3] & 7) & 0xff)) & 0xff)]), R1[0].eq(R1[3]).not().or(R1[2]))];
        case 0x1f: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(new Mem8(R32[((((b[i+3] & 7) & 0xff)) & 0xff)]), R1[0].eq(R1[3]).and(R1[2].not()))];
        case 0x23: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R1[1], new u32(1).shl(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).and(new Mem32(R32[((((b[i+3] & 7) & 0xff)) & 0xff)])).eq(new u8(0)).not())];
        case 0x25: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+3] & 7) & 0xff)) & 0xff)])), $0.shl(($1 = R8[1])).or(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shr(new u8($1.neg()).add(new u8(32)))))];
        case 0x2b: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R1[1], new u32(1).shl(($1 = R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])).and(($0 = new Mem32(R32[((((b[i+3] & 7) & 0xff)) & 0xff)]))).eq(new u8(0)).not()), new Mov($0, new u32(1).shl($1).or($0))];
        case 0x2d: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($1 = new Mem32(R32[((((b[i+3] & 7) & 0xff)) & 0xff)])), new u32(1).shl(($0 = R8[1])).add(new i32(-1)).shl(new u8($0.neg()).add(new u8(32))).and(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).or($1.shr($0)))];
        case 0x2f: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])), $0.mul(new i32(new Mem32(R32[((((b[i+3] & 7) & 0xff)) & 0xff)]))))];
        case 0x36: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new Mem8(R32[((((b[i+3] & 7) & 0xff)) & 0xff)]))];
        case 0x37: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new Mem16(R32[((((b[i+3] & 7) & 0xff)) & 0xff)]))];
        case 0x3e: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new i32(new Mem8(R32[((((b[i+3] & 7) & 0xff)) & 0xff)])))];
        case 0x3f: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new i32(new Mem16(R32[((((b[i+3] & 7) & 0xff)) & 0xff)])))];
    }

    if((((((b[i] | ((b[i+1] << 8) >>> 0)) >>> 0) | ((b[i+2] << 16) >>> 0)) >>> 0) & 0xc7c0ff) == 0x4800f)
    switch(((b[i+1] & 63) & 0xff) & 0x3f) {
        case 0x10: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(new Mem8(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6)))), R1[0])];
        case 0x11: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(new Mem8(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6)))), R1[0].not())];
        case 0x12: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(new Mem8(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6)))), R1[1])];
        case 0x13: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(new Mem8(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6)))), R1[1].not())];
        case 0x14: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(new Mem8(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6)))), R1[2])];
        case 0x15: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(new Mem8(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6)))), R1[2].not())];
        case 0x16: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(new Mem8(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6)))), R1[1].or(R1[2]))];
        case 0x17: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(new Mem8(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6)))), R1[1].not().and(R1[2].not()))];
        case 0x18: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(new Mem8(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6)))), R1[3])];
        case 0x19: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(new Mem8(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6)))), R1[3].not())];
        case 0x1a: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(new Mem8(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6)))), R1[4])];
        case 0x1b: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(new Mem8(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6)))), R1[4].not())];
        case 0x1c: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(new Mem8(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6)))), R1[0].eq(R1[3]).not())];
        case 0x1d: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(new Mem8(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6)))), R1[0].eq(R1[3]))];
        case 0x1e: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(new Mem8(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6)))), R1[0].eq(R1[3]).not().or(R1[2]))];
        case 0x1f: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(new Mem8(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6)))), R1[0].eq(R1[3]).and(R1[2].not()))];
        case 0x23: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R1[1], new u32(1).shl(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).and(new Mem32(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6))))).eq(new u8(0)).not())];
        case 0x25: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6))))), $0.shl(($1 = R8[1])).or(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shr(new u8($1.neg()).add(new u8(32)))))];
        case 0x2b: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R1[1], new u32(1).shl(($1 = R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])).and(($0 = new Mem32(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6)))))).eq(new u8(0)).not()), new Mov($0, new u32(1).shl($1).or($0))];
        case 0x2d: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($1 = new Mem32(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6))))), new u32(1).shl(($0 = R8[1])).add(new i32(-1)).shl(new u8($0.neg()).add(new u8(32))).and(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).or($1.shr($0)))];
        case 0x2f: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])), $0.mul(new i32(new Mem32(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6)))))))];
        case 0x36: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new Mem8(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6)))))];
        case 0x37: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new Mem16(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6)))))];
        case 0x3e: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new i32(new Mem8(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6))))))];
        case 0x3f: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new i32(new Mem16(R32[((((b[i+3] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+3] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+3] & 192) & 0xff) >> 6))))))];
    }

    if((((((((((b[i] & 128) & 0xffff) >> 7) & 0xffff) | ((b[i+1] << 1) & 0xffff)) & 0xffff) | ((((b[i+2] & 63) & 0xffff) << 9) & 0xffff)) & 0xffff) & 0x7f8f) == 0x4a89)
    switch(((b[i] | ((((b[i+1] & 63) & 0xffff) << 8) & 0xffff)) & 0xffff) & 0x387f) {
        case 0xf: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(new Mem32(R32[5].add(new i32(new i8(new u8(b[i+3]))))), new Mem32(($0 = R32[4]))), new Mov($0, $0.add(new u8(4)))];
        case 0x50: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i8(new u8(b[i+3]))))), $0.shl(new u8(1)).or($0.shr(new u8(7))))];
        case 0x51: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(new i8(new u8(b[i+3])))))), $0.shl(new u8(1)).or($0.shr(new u8(31))))];
        case 0x52: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i8(new u8(b[i+3]))))), $0.shl(($1 = R8[1])).or($0.shr(new u8($1.neg()).add(new u8(8)))))];
        case 0x53: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(new i8(new u8(b[i+3])))))), $0.shl(($1 = R8[1])).or($0.shr(new u8($1.neg()).add(new u8(32)))))];
        case 0x850: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i8(new u8(b[i+3]))))), $0.shr(new u8(1)).or($0.shl(new u8(7))))];
        case 0x851: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(new i8(new u8(b[i+3])))))), $0.shr(new u8(1)).or($0.shl(new u8(31))))];
        case 0x852: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i8(new u8(b[i+3]))))), $0.shr(($1 = R8[1])).or($0.shl(new u8($1.neg()).add(new u8(8)))))];
        case 0x853: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(new i8(new u8(b[i+3])))))), $0.shr(($1 = R8[1])).or($0.shl(new u8($1.neg()).add(new u8(32)))))];
        case 0x1050: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i8(new u8(b[i+3]))))), $0.shl(new u8(1)).or($0.shr(new u8(7))))];
        case 0x1051: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(new i8(new u8(b[i+3])))))), $0.shl(new u8(1)).or($0.shr(new u8(31))))];
        case 0x1052: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i8(new u8(b[i+3]))))), $0.shl(($1 = R8[1])).or($0.shr(new u8($1.neg()).add(new u8(8)))))];
        case 0x1053: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(new i8(new u8(b[i+3])))))), $0.shl(($1 = R8[1])).or($0.shr(new u8($1.neg()).add(new u8(32)))))];
        case 0x1850: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i8(new u8(b[i+3]))))), $0.shr(new u8(1)).or($0.shl(new u8(7))))];
        case 0x1851: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(new i8(new u8(b[i+3])))))), $0.shr(new u8(1)).or($0.shl(new u8(31))))];
        case 0x1852: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i8(new u8(b[i+3]))))), $0.shr(($1 = R8[1])).or($0.shl(new u8($1.neg()).add(new u8(8)))))];
        case 0x1853: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(new i8(new u8(b[i+3])))))), $0.shr(($1 = R8[1])).or($0.shl(new u8($1.neg()).add(new u8(32)))))];
        case 0x2050: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i8(new u8(b[i+3]))))), $0.shl(new u8(1)))];
        case 0x2051: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(new i8(new u8(b[i+3])))))), $0.shl(new u8(1)))];
        case 0x2052: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i8(new u8(b[i+3]))))), $0.shl(R8[1]))];
        case 0x2053: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(new i8(new u8(b[i+3])))))), $0.shl(R8[1]))];
        case 0x2850: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i8(new u8(b[i+3]))))), new u8($0).shr(new u8(1)))];
        case 0x2851: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(new i8(new u8(b[i+3])))))), new u32($0).shr(new u8(1)))];
        case 0x2852: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i8(new u8(b[i+3]))))), new u8($0).shr(R8[1]))];
        case 0x2853: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(new i8(new u8(b[i+3])))))), new u32($0).shr(R8[1]))];
        case 0x3050: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i8(new u8(b[i+3]))))), $0.shl(new u8(1)))];
        case 0x3051: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(new i8(new u8(b[i+3])))))), $0.shl(new u8(1)))];
        case 0x3052: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i8(new u8(b[i+3]))))), $0.shl(R8[1]))];
        case 0x3053: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(new i8(new u8(b[i+3])))))), $0.shl(R8[1]))];
        case 0x3850: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i8(new u8(b[i+3]))))), new i8($0).shr(new u8(1)))];
        case 0x3851: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(new i8(new u8(b[i+3])))))), new i32($0).shr(new u8(1)))];
        case 0x3852: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i8(new u8(b[i+3]))))), new i8($0).shr(R8[1]))];
        case 0x3853: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(new i8(new u8(b[i+3])))))), new i32($0).shr(R8[1]))];
        case 0x1076: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i8(new u8(b[i+3]))))), $0.not())];
        case 0x1077: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(new i8(new u8(b[i+3])))))), $0.not())];
        case 0x1876: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R1[1], new u1(0)), new Mov(($0 = new Mem8(R32[5].add(new i8(new u8(b[i+3]))))), $0.neg())];
        case 0x1877: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R1[1], new u1(0)), new Mov(($0 = new Mem32(R32[5].add(new i32(new i8(new u8(b[i+3])))))), $0.neg())];
        case 0x2076: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R16[0], R8[0].mul(new Mem8(R32[5].add(new i8(new u8(b[i+3]))))))];
        case 0x2077: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = R32[0]), $0.mul(new Mem32(R32[5].add(new i32(new i8(new u8(b[i+3])))))))];
        case 0x2876: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R16[0], R8[0].mul(new Mem8(R32[5].add(new i8(new u8(b[i+3]))))))];
        case 0x2877: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = R32[0]), $0.mul(new Mem32(R32[5].add(new i32(new i8(new u8(b[i+3])))))))];
        case 0x3076: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R16[0], R8[0].div(new Mem8(R32[5].add(new i8(new u8(b[i+3]))))))];
        case 0x3077: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = R32[0]), $0.div(new Mem32(R32[5].add(new i32(new i8(new u8(b[i+3])))))))];
        case 0x3876: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R16[0], R8[0].div(new Mem8(R32[5].add(new i8(new u8(b[i+3]))))))];
        case 0x3877: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = R32[0]), $0.div(new Mem32(R32[5].add(new i32(new i8(new u8(b[i+3])))))))];
        case 0x7e: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i8(new u8(b[i+3]))))), new u8($0).add(new u8(1)))];
        case 0x7f: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(new i8(new u8(b[i+3])))))), $0.add(new u8(1)))];
        case 0x87e: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i8(new u8(b[i+3]))))), $0.add(new i8(-1)))];
        case 0x87f: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(new i8(new u8(b[i+3])))))), $0.add(new i32(-1)))];
        case 0x107f: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = R32[4]), $0.add(new i32(-4))), new Mov(new Mem32($0), ($1 = R32[8]).add(new i8(_pfxLength + 4))), new Mov($1, new Mem32(R32[5].add(new i32(new i8(new u8(b[i+3]))))))];
        case 0x207f: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R32[8], new Mem32(R32[5].add(new i32(new i8(new u8(b[i+3]))))))];
        case 0x307f: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = R32[4]), $0.add(new i32(-4))), new Mov(new Mem32($0), new Mem32(R32[5].add(new i32(new i8(new u8(b[i+3]))))))];
    }

    if((((((((((b[i] & 192) & 0xffff) >> 6) & 0xffff) | ((b[i+1] << 2) & 0xffff)) & 0xffff) | ((((b[i+2] & 63) & 0xffff) << 10) & 0xffff)) & 0xffff) & 0xff1d) == 0x9510)
    switch(b[i] & 0xbf) {
        case 0x0: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i8(new u8(b[i+3]))))), $0.add(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x1: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(new i8(new u8(b[i+3])))))), $0.add(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x2: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.add(new Mem8(R32[5].add(new i8(new u8(b[i+3]))))))];
        case 0x3: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.add(new Mem32(R32[5].add(new i32(new i8(new u8(b[i+3])))))))];
        case 0x8: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i8(new u8(b[i+3]))))), $0.or(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x9: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(new i8(new u8(b[i+3])))))), $0.or(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0xa: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.or(new Mem8(R32[5].add(new i8(new u8(b[i+3]))))))];
        case 0xb: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.or(new Mem32(R32[5].add(new i32(new i8(new u8(b[i+3])))))))];
        case 0x10: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i8(new u8(b[i+3]))))), $0.add(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).add(R1[1]))];
        case 0x11: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(new i8(new u8(b[i+3])))))), $0.add(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).add(R1[1]))];
        case 0x12: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.add(new Mem8(R32[5].add(new i8(new u8(b[i+3]))))).add(R1[1]))];
        case 0x13: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.add(new Mem32(R32[5].add(new i32(new i8(new u8(b[i+3])))))).add(R1[1]))];
        case 0x18: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i8(new u8(b[i+3]))))), $0.add(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].neg()).add(new i8(R1[1]).neg()))];
        case 0x19: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(new i8(new u8(b[i+3])))))), $0.add(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].neg()).add(new i32(R1[1]).neg()))];
        case 0x1a: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.add(new Mem8(R32[5].add(new i8(new u8(b[i+3])))).neg()).add(new i8(R1[1]).neg()))];
        case 0x1b: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.add(new Mem32(R32[5].add(new i32(new i8(new u8(b[i+3]))))).neg()).add(new i32(R1[1]).neg()))];
        case 0x20: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i8(new u8(b[i+3]))))), $0.and(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x21: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(new i8(new u8(b[i+3])))))), $0.and(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x22: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.and(new Mem8(R32[5].add(new i8(new u8(b[i+3]))))))];
        case 0x23: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.and(new Mem32(R32[5].add(new i32(new i8(new u8(b[i+3])))))))];
        case 0x28: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R1[2], ($0 = new Mem8(R32[5].add(new i8(new u8(b[i+3]))))).eq(($1 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add($1.neg()))];
        case 0x29: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R1[2], ($0 = new Mem32(R32[5].add(new i32(new i8(new u8(b[i+3])))))).eq(($1 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add($1.neg()))];
        case 0x2a: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R1[2], ($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).eq(($1 = new Mem8(R32[5].add(new i8(new u8(b[i+3]))))))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add($1.neg()))];
        case 0x2b: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R1[2], ($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).eq(($1 = new Mem32(R32[5].add(new i32(new i8(new u8(b[i+3])))))))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add($1.neg()))];
        case 0x30: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i8(new u8(b[i+3]))))), $0.xor(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x31: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(new i8(new u8(b[i+3])))))), $0.xor(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x32: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.xor(new Mem8(R32[5].add(new i8(new u8(b[i+3]))))))];
        case 0x33: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.xor(new Mem32(R32[5].add(new i32(new i8(new u8(b[i+3])))))))];
        case 0x38: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R1[2], new Mem8(R32[5].add(new i8(new u8(b[i+3])))).eq(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])), new Mov(R1[1], new u1(0))];
        case 0x39: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R1[2], new Mem32(R32[5].add(new i32(new i8(new u8(b[i+3]))))).eq(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])), new Mov(R1[1], new u1(0))];
        case 0x3a: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R1[2], R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].eq(new Mem8(R32[5].add(new i8(new u8(b[i+3])))))), new Mov(R1[1], new u1(0))];
        case 0x3b: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R1[2], R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].eq(new Mem32(R32[5].add(new i32(new i8(new u8(b[i+3]))))))), new Mov(R1[1], new u1(0))];
        case 0x84: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R1[2], new Mem8(R32[5].add(new i8(new u8(b[i+3])))).and(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).eq(new i8(0))), new Mov(R1[1], new u1(0)), new Mov(R1[0], new u1(0))];
        case 0x85: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R1[2], new Mem32(R32[5].add(new i32(new i8(new u8(b[i+3]))))).and(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).eq(new i32(0))), new Mov(R1[1], new u1(0)), new Mov(R1[0], new u1(0))];
        case 0x86: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($2 = new Register8), ($0 = new Mem8(R32[5].add(new i8(new u8(b[i+3])))))), new Mov($0, ($1 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])), new Mov($1, $2)];
        case 0x87: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($2 = new Register32), ($0 = new Mem32(R32[5].add(new i32(new i8(new u8(b[i+3]))))))), new Mov($0, ($1 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])), new Mov($1, $2)];
        case 0x88: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(new Mem8(R32[5].add(new i8(new u8(b[i+3])))), R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])];
        case 0x89: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(new Mem32(R32[5].add(new i32(new i8(new u8(b[i+3]))))), R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])];
        case 0x8a: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new Mem8(R32[5].add(new i8(new u8(b[i+3])))))];
        case 0x8b: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new Mem32(R32[5].add(new i32(new i8(new u8(b[i+3]))))))];
        case 0x8c: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(new Mem32(R32[5].add(new i32(new i8(new u8(b[i+3]))))), R16[((((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff) + 16) & 0xff)])];
        case 0x8d: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], R32[5].add(new i32(new i8(new u8(b[i+3])))))];
        case 0x8e: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R16[((((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff) + 16) & 0xff)], new Mem16(R32[5].add(new i16(new i8(new u8(b[i+3]))))))];
    }

    if((((((((((b[i] & 128) & 0xffff) >> 7) & 0xffff) | ((b[i+1] << 1) & 0xffff)) & 0xffff) | ((((b[i+2] & 63) & 0xffff) << 9) & 0xffff)) & 0xffff) & 0x710f) == 0x4009)
    switch(((b[i] | ((((b[i+1] & 127) & 0xffff) << 8) & 0xffff)) & 0xffff) & 0x787f) {
        case 0x0: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])), $0.add(new i8(new u8(b[i+3]))))];
        case 0x2: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])), $0.add(new i8(new u8(b[i+3]))))];
        case 0x3: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])), $0.add(new i8(new u8(b[i+3]))))];
        case 0x800: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])), new u8(new u8(b[i+3])).or($0))];
        case 0x802: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])), new u8(new u8(b[i+3])).or($0))];
        case 0x803: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])), new u32(new i8(new u8(b[i+3]))).or($0))];
        case 0x1000: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])), $0.add(new i8(new u8(b[i+3]))).add(R1[1]))];
        case 0x1002: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])), $0.add(new i8(new u8(b[i+3]))).add(R1[1]))];
        case 0x1003: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])), $0.add(new i8(new u8(b[i+3]))).add(R1[1]))];
        case 0x1800: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])), $0.add(new i8(-((b[i+3]) << 24 >> 24))).add(new i8(R1[1]).neg()))];
        case 0x1802: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])), $0.add(new i8(-((b[i+3]) << 24 >> 24))).add(new i8(R1[1]).neg()))];
        case 0x1803: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])), $0.add(new i32(-((((b[i+3]) << 24 >> 24)) >> 0))).add(new i32(R1[1]).neg()))];
        case 0x2000: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])), new u8(new u8(b[i+3])).and($0))];
        case 0x2002: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])), new u8(new u8(b[i+3])).and($0))];
        case 0x2003: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])), new u32(new i8(new u8(b[i+3]))).and($0))];
        case 0x2800: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R1[2], ($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])).eq(new i8(new u8(b[i+3])))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add(new i8(-((b[i+3]) << 24 >> 24))))];
        case 0x2802: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R1[2], ($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])).eq(new i8(new u8(b[i+3])))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add(new i8(-((b[i+3]) << 24 >> 24))))];
        case 0x2803: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R1[2], ($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])).eq(new i32(new i8(new u8(b[i+3]))))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add(new i32(-((((b[i+3]) << 24 >> 24)) >> 0))))];
        case 0x3000: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])), $0.xor(new i8(new u8(b[i+3]))))];
        case 0x3002: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])), $0.xor(new i8(new u8(b[i+3]))))];
        case 0x3003: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])), $0.xor(new i8(new u8(b[i+3]))))];
        case 0x3800: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R1[2], new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)]).eq(new i8(new u8(b[i+3])))), new Mov(R1[1], new u1(0))];
        case 0x3802: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R1[2], new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)]).eq(new i8(new u8(b[i+3])))), new Mov(R1[1], new u1(0))];
        case 0x3803: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R1[2], new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)]).eq(new i32(new i8(new u8(b[i+3]))))), new Mov(R1[1], new u1(0))];
        case 0x400f: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3])))), new Mem32(($0 = R32[4]))), new Mov($0, $0.add(new u8(4)))];
        case 0x46: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)]), new i8(new u8(b[i+3])))];
        case 0x40: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])), $0.shl(new i8(new u8(b[i+3]))).or($0.shr(new u8(((((-((b[i+3]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 8))))];
        case 0x41: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])), $0.shl(new i8(new u8(b[i+3]))).or($0.shr(new u8(((((-((b[i+3]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 32))))];
        case 0x4050: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))), $0.shl(new u8(1)).or($0.shr(new u8(7))))];
        case 0x4051: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))), $0.shl(new u8(1)).or($0.shr(new u8(31))))];
        case 0x4052: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))), $0.shl(($1 = R8[1])).or($0.shr(new u8($1.neg()).add(new u8(8)))))];
        case 0x4053: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))), $0.shl(($1 = R8[1])).or($0.shr(new u8($1.neg()).add(new u8(32)))))];
        case 0x840: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])), $0.shr(new i8(new u8(b[i+3]))).or($0.shl(new u8(((((-((b[i+3]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 8))))];
        case 0x841: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])), $0.shr(new i8(new u8(b[i+3]))).or($0.shl(new u8(((((-((b[i+3]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 32))))];
        case 0x4850: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))), $0.shr(new u8(1)).or($0.shl(new u8(7))))];
        case 0x4851: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))), $0.shr(new u8(1)).or($0.shl(new u8(31))))];
        case 0x4852: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))), $0.shr(($1 = R8[1])).or($0.shl(new u8($1.neg()).add(new u8(8)))))];
        case 0x4853: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))), $0.shr(($1 = R8[1])).or($0.shl(new u8($1.neg()).add(new u8(32)))))];
        case 0x1040: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])), $0.shl(new i8(new u8(b[i+3]))).or($0.shr(new u8(((((-((b[i+3]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 8))))];
        case 0x1041: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])), $0.shl(new i8(new u8(b[i+3]))).or($0.shr(new u8(((((-((b[i+3]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 32))))];
        case 0x5050: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))), $0.shl(new u8(1)).or($0.shr(new u8(7))))];
        case 0x5051: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))), $0.shl(new u8(1)).or($0.shr(new u8(31))))];
        case 0x5052: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))), $0.shl(($1 = R8[1])).or($0.shr(new u8($1.neg()).add(new u8(8)))))];
        case 0x5053: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))), $0.shl(($1 = R8[1])).or($0.shr(new u8($1.neg()).add(new u8(32)))))];
        case 0x1840: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])), $0.shr(new i8(new u8(b[i+3]))).or($0.shl(new u8(((((-((b[i+3]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 8))))];
        case 0x1841: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])), $0.shr(new i8(new u8(b[i+3]))).or($0.shl(new u8(((((-((b[i+3]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 32))))];
        case 0x5850: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))), $0.shr(new u8(1)).or($0.shl(new u8(7))))];
        case 0x5851: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))), $0.shr(new u8(1)).or($0.shl(new u8(31))))];
        case 0x5852: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))), $0.shr(($1 = R8[1])).or($0.shl(new u8($1.neg()).add(new u8(8)))))];
        case 0x5853: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))), $0.shr(($1 = R8[1])).or($0.shl(new u8($1.neg()).add(new u8(32)))))];
        case 0x2040: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])), $0.shl(new i8(new u8(b[i+3]))))];
        case 0x2041: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])), $0.shl(new i8(new u8(b[i+3]))))];
        case 0x6050: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))), $0.shl(new u8(1)))];
        case 0x6051: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))), $0.shl(new u8(1)))];
        case 0x6052: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))), $0.shl(R8[1]))];
        case 0x6053: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))), $0.shl(R8[1]))];
        case 0x2840: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])), new u8($0).shr(new i8(new u8(b[i+3]))))];
        case 0x2841: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])), new u32($0).shr(new i8(new u8(b[i+3]))))];
        case 0x6850: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))), new u8($0).shr(new u8(1)))];
        case 0x6851: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))), new u32($0).shr(new u8(1)))];
        case 0x6852: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))), new u8($0).shr(R8[1]))];
        case 0x6853: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))), new u32($0).shr(R8[1]))];
        case 0x3040: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])), $0.shl(new i8(new u8(b[i+3]))))];
        case 0x3041: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])), $0.shl(new i8(new u8(b[i+3]))))];
        case 0x7050: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))), $0.shl(new u8(1)))];
        case 0x7051: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))), $0.shl(new u8(1)))];
        case 0x7052: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))), $0.shl(R8[1]))];
        case 0x7053: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))), $0.shl(R8[1]))];
        case 0x3840: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])), new i8($0).shr(new i8(new u8(b[i+3]))))];
        case 0x3841: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])), new i32($0).shr(new i8(new u8(b[i+3]))))];
        case 0x7850: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))), new i8($0).shr(new u8(1)))];
        case 0x7851: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))), new i32($0).shr(new u8(1)))];
        case 0x7852: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))), new i8($0).shr(R8[1]))];
        case 0x7853: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))), new i32($0).shr(R8[1]))];
        case 0x76: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R1[2], new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)]).and(new i8(new u8(b[i+3]))).eq(new i8(0))), new Mov(R1[1], new u1(0)), new Mov(R1[0], new u1(0))];
        case 0x5076: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))), $0.not())];
        case 0x5077: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))), $0.not())];
        case 0x5876: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R1[1], new u1(0)), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))), $0.neg())];
        case 0x5877: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R1[1], new u1(0)), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))), $0.neg())];
        case 0x6076: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R16[0], R8[0].mul(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))))];
        case 0x6077: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = R32[0]), $0.mul(new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))))];
        case 0x6876: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R16[0], R8[0].mul(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))))];
        case 0x6877: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = R32[0]), $0.mul(new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))))];
        case 0x7076: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R16[0], R8[0].div(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))))];
        case 0x7077: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = R32[0]), $0.div(new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))))];
        case 0x7876: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R16[0], R8[0].div(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))))];
        case 0x7877: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = R32[0]), $0.div(new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))))];
        case 0x407e: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))), new u8($0).add(new u8(1)))];
        case 0x407f: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))), $0.add(new u8(1)))];
        case 0x487e: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))), $0.add(new i8(-1)))];
        case 0x487f: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))), $0.add(new i32(-1)))];
        case 0x507f: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = R32[4]), $0.add(new i32(-4))), new Mov(new Mem32($0), ($1 = R32[8]).add(new i8(_pfxLength + 4))), new Mov($1, new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3])))))];
        case 0x607f: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R32[8], new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3])))))];
        case 0x707f: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = R32[4]), $0.add(new i32(-4))), new Mov(new Mem32($0), new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3])))))];
    }

    if((((b[i+1] | ((((b[i+2] & 63) & 0xffff) << 8) & 0xffff)) & 0xffff) & 0x3887) == 0x2004)
    switch(((b[i] | ((((b[i+1] & 127) & 0xffff) << 8) & 0xffff)) & 0xffff) & 0x40ff) {
        case 0x4000: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))), $0.add(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x4001: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))), $0.add(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x4002: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.add(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))))];
        case 0x4003: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.add(new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))))];
        case 0x4008: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))), $0.or(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x4009: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))), $0.or(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x400a: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.or(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))))];
        case 0x400b: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.or(new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))))];
        case 0x4010: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))), $0.add(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).add(R1[1]))];
        case 0x4011: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))), $0.add(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).add(R1[1]))];
        case 0x4012: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.add(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))).add(R1[1]))];
        case 0x4013: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.add(new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))).add(R1[1]))];
        case 0x4018: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))), $0.add(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].neg()).add(new i8(R1[1]).neg()))];
        case 0x4019: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))), $0.add(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].neg()).add(new i32(R1[1]).neg()))];
        case 0x401a: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.add(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3])))).neg()).add(new i8(R1[1]).neg()))];
        case 0x401b: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.add(new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3])))).neg()).add(new i32(R1[1]).neg()))];
        case 0x4020: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))), $0.and(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x4021: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))), $0.and(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x4022: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.and(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))))];
        case 0x4023: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.and(new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))))];
        case 0x4028: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R1[2], ($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))).eq(($1 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add($1.neg()))];
        case 0x4029: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R1[2], ($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))).eq(($1 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add($1.neg()))];
        case 0x402a: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R1[2], ($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).eq(($1 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add($1.neg()))];
        case 0x402b: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R1[2], ($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).eq(($1 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add($1.neg()))];
        case 0x4030: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))), $0.xor(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x4031: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))), $0.xor(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x4032: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.xor(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))))];
        case 0x4033: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.xor(new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))))];
        case 0x4038: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R1[2], new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3])))).eq(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])), new Mov(R1[1], new u1(0))];
        case 0x4039: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R1[2], new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3])))).eq(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])), new Mov(R1[1], new u1(0))];
        case 0x403a: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R1[2], R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].eq(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3])))))), new Mov(R1[1], new u1(0))];
        case 0x403b: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R1[2], R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].eq(new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3])))))), new Mov(R1[1], new u1(0))];
        case 0x6b: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)]).mul(new i32(new i8(new u8(b[i+3])))))];
        case 0x4084: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R1[2], new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3])))).and(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).eq(new i8(0))), new Mov(R1[1], new u1(0)), new Mov(R1[0], new u1(0))];
        case 0x4085: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R1[2], new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3])))).and(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).eq(new i32(0))), new Mov(R1[1], new u1(0)), new Mov(R1[0], new u1(0))];
        case 0x4086: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($2 = new Register8), ($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3])))))), new Mov($0, ($1 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])), new Mov($1, $2)];
        case 0x4087: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($2 = new Register32), ($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3])))))), new Mov($0, ($1 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])), new Mov($1, $2)];
        case 0x4088: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3])))), R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])];
        case 0x4089: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3])))), R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])];
        case 0x408a: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3])))))];
        case 0x408b: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3])))))];
        case 0x408c: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3])))), R16[((((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff) + 16) & 0xff)])];
        case 0x408d: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))];
        case 0x408e: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R16[((((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff) + 16) & 0xff)], new Mem16(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3])))))];
    }

    if((((((((((b[i] & 128) & 0xffff) >> 7) & 0xffff) | ((b[i+1] << 1) & 0xffff)) & 0xffff) | ((((b[i+2] & 7) & 0xffff) << 9) & 0xffff)) & 0xffff) & 0xf8f) == 0xa89)
    switch(((b[i] | ((((b[i+1] & 63) & 0xffff) << 8) & 0xffff)) & 0xffff) & 0x387f) {
        case 0xf: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3])))))), new Mem32(($0 = R32[4]))), new Mov($0, $0.add(new u8(4)))];
        case 0x50: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))), $0.shl(new u8(1)).or($0.shr(new u8(7))))];
        case 0x51: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))), $0.shl(new u8(1)).or($0.shr(new u8(31))))];
        case 0x52: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))), $0.shl(($1 = R8[1])).or($0.shr(new u8($1.neg()).add(new u8(8)))))];
        case 0x53: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))), $0.shl(($1 = R8[1])).or($0.shr(new u8($1.neg()).add(new u8(32)))))];
        case 0x850: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))), $0.shr(new u8(1)).or($0.shl(new u8(7))))];
        case 0x851: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))), $0.shr(new u8(1)).or($0.shl(new u8(31))))];
        case 0x852: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))), $0.shr(($1 = R8[1])).or($0.shl(new u8($1.neg()).add(new u8(8)))))];
        case 0x853: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))), $0.shr(($1 = R8[1])).or($0.shl(new u8($1.neg()).add(new u8(32)))))];
        case 0x1050: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))), $0.shl(new u8(1)).or($0.shr(new u8(7))))];
        case 0x1051: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))), $0.shl(new u8(1)).or($0.shr(new u8(31))))];
        case 0x1052: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))), $0.shl(($1 = R8[1])).or($0.shr(new u8($1.neg()).add(new u8(8)))))];
        case 0x1053: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))), $0.shl(($1 = R8[1])).or($0.shr(new u8($1.neg()).add(new u8(32)))))];
        case 0x1850: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))), $0.shr(new u8(1)).or($0.shl(new u8(7))))];
        case 0x1851: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))), $0.shr(new u8(1)).or($0.shl(new u8(31))))];
        case 0x1852: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))), $0.shr(($1 = R8[1])).or($0.shl(new u8($1.neg()).add(new u8(8)))))];
        case 0x1853: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))), $0.shr(($1 = R8[1])).or($0.shl(new u8($1.neg()).add(new u8(32)))))];
        case 0x2050: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))), $0.shl(new u8(1)))];
        case 0x2051: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))), $0.shl(new u8(1)))];
        case 0x2052: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))), $0.shl(R8[1]))];
        case 0x2053: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))), $0.shl(R8[1]))];
        case 0x2850: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))), new u8($0).shr(new u8(1)))];
        case 0x2851: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))), new u32($0).shr(new u8(1)))];
        case 0x2852: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))), new u8($0).shr(R8[1]))];
        case 0x2853: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))), new u32($0).shr(R8[1]))];
        case 0x3050: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))), $0.shl(new u8(1)))];
        case 0x3051: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))), $0.shl(new u8(1)))];
        case 0x3052: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))), $0.shl(R8[1]))];
        case 0x3053: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))), $0.shl(R8[1]))];
        case 0x3850: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))), new i8($0).shr(new u8(1)))];
        case 0x3851: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))), new i32($0).shr(new u8(1)))];
        case 0x3852: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))), new i8($0).shr(R8[1]))];
        case 0x3853: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))), new i32($0).shr(R8[1]))];
        case 0x1076: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))), $0.not())];
        case 0x1077: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))), $0.not())];
        case 0x1876: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R1[1], new u1(0)), new Mov(($0 = new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))), $0.neg())];
        case 0x1877: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R1[1], new u1(0)), new Mov(($0 = new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))), $0.neg())];
        case 0x2076: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R16[0], R8[0].mul(new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))))];
        case 0x2077: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = R32[0]), $0.mul(new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))))];
        case 0x2876: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R16[0], R8[0].mul(new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))))];
        case 0x2877: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = R32[0]), $0.mul(new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))))];
        case 0x3076: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R16[0], R8[0].div(new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))))];
        case 0x3077: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = R32[0]), $0.div(new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))))];
        case 0x3876: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R16[0], R8[0].div(new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))))];
        case 0x3877: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = R32[0]), $0.div(new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))))];
        case 0x7e: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))), new u8($0).add(new u8(1)))];
        case 0x7f: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))), $0.add(new u8(1)))];
        case 0x87e: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))), $0.add(new i8(-1)))];
        case 0x87f: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))), $0.add(new i32(-1)))];
        case 0x107f: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = R32[4]), $0.add(new i32(-4))), new Mov(new Mem32($0), ($1 = R32[8]).add(new i8(_pfxLength + 4))), new Mov($1, new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3])))))))];
        case 0x207f: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R32[8], new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3])))))))];
        case 0x307f: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = R32[4]), $0.add(new i32(-4))), new Mov(new Mem32($0), new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3])))))))];
    }

    if((((((((((b[i] & 192) & 0xffff) >> 6) & 0xffff) | ((b[i+1] << 2) & 0xffff)) & 0xffff) | ((((b[i+2] & 7) & 0xffff) << 10) & 0xffff)) & 0xffff) & 0x1f1d) == 0x1510)
    switch(b[i] & 0xbf) {
        case 0x0: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))), $0.add(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x1: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))), $0.add(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x2: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.add(new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))))];
        case 0x3: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.add(new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))))];
        case 0x8: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))), $0.or(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x9: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))), $0.or(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0xa: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.or(new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))))];
        case 0xb: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.or(new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))))];
        case 0x10: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))), $0.add(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).add(R1[1]))];
        case 0x11: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))), $0.add(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).add(R1[1]))];
        case 0x12: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.add(new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))).add(R1[1]))];
        case 0x13: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.add(new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))).add(R1[1]))];
        case 0x18: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))), $0.add(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].neg()).add(new i8(R1[1]).neg()))];
        case 0x19: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))), $0.add(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].neg()).add(new i32(R1[1]).neg()))];
        case 0x1a: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.add(new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3])))))).neg()).add(new i8(R1[1]).neg()))];
        case 0x1b: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.add(new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3])))))).neg()).add(new i32(R1[1]).neg()))];
        case 0x20: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))), $0.and(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x21: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))), $0.and(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x22: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.and(new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))))];
        case 0x23: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.and(new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))))];
        case 0x28: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R1[2], ($0 = new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))).eq(($1 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add($1.neg()))];
        case 0x29: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R1[2], ($0 = new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))).eq(($1 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add($1.neg()))];
        case 0x2a: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R1[2], ($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).eq(($1 = new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add($1.neg()))];
        case 0x2b: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R1[2], ($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).eq(($1 = new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add($1.neg()))];
        case 0x30: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))), $0.xor(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x31: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))), $0.xor(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x32: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.xor(new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))))];
        case 0x33: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.xor(new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))))];
        case 0x38: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R1[2], new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3])))))).eq(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])), new Mov(R1[1], new u1(0))];
        case 0x39: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R1[2], new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3])))))).eq(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])), new Mov(R1[1], new u1(0))];
        case 0x3a: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R1[2], R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].eq(new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3])))))))), new Mov(R1[1], new u1(0))];
        case 0x3b: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R1[2], R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].eq(new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3])))))))), new Mov(R1[1], new u1(0))];
        case 0x84: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R1[2], new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3])))))).and(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).eq(new i8(0))), new Mov(R1[1], new u1(0)), new Mov(R1[0], new u1(0))];
        case 0x85: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R1[2], new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3])))))).and(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).eq(new i32(0))), new Mov(R1[1], new u1(0)), new Mov(R1[0], new u1(0))];
        case 0x86: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($2 = new Register8), ($0 = new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3])))))))), new Mov($0, ($1 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])), new Mov($1, $2)];
        case 0x87: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($2 = new Register32), ($0 = new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3])))))))), new Mov($0, ($1 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])), new Mov($1, $2)];
        case 0x88: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3])))))), R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])];
        case 0x89: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3])))))), R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])];
        case 0x8a: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new Mem8(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3])))))))];
        case 0x8b: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3])))))))];
        case 0x8c: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(new Mem32(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3])))))), R16[((((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff) + 16) & 0xff)])];
        case 0x8d: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3]))))))];
        case 0x8e: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R16[((((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff) + 16) & 0xff)], new Mem16(R32[5].add(new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)).add(new i8(new u8(b[i+3])))))))];
    }

    if((((((((b[i] & 248) & 0xffff) >> 3) & 0xffff) | ((b[i+1] << 5) & 0xffff)) & 0xffff) & 0x1811) == 0x810)
    switch(((b[i] | ((((b[i+1] & 63) & 0xffff) << 8) & 0xffff)) & 0xffff) & 0x3877) {
        case 0x0: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))), $0.add(new i8(new u8(b[i+3]))))];
        case 0x2: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))), $0.add(new i8(new u8(b[i+3]))))];
        case 0x3: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))), $0.add(new i8(new u8(b[i+3]))))];
        case 0x800: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))), new u8(new u8(b[i+3])).or($0))];
        case 0x802: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))), new u8(new u8(b[i+3])).or($0))];
        case 0x803: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))), new u32(new i8(new u8(b[i+3]))).or($0))];
        case 0x1000: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))), $0.add(new i8(new u8(b[i+3]))).add(R1[1]))];
        case 0x1002: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))), $0.add(new i8(new u8(b[i+3]))).add(R1[1]))];
        case 0x1003: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))), $0.add(new i8(new u8(b[i+3]))).add(R1[1]))];
        case 0x1800: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))), $0.add(new i8(-((b[i+3]) << 24 >> 24))).add(new i8(R1[1]).neg()))];
        case 0x1802: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))), $0.add(new i8(-((b[i+3]) << 24 >> 24))).add(new i8(R1[1]).neg()))];
        case 0x1803: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))), $0.add(new i32(-((((b[i+3]) << 24 >> 24)) >> 0))).add(new i32(R1[1]).neg()))];
        case 0x2000: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))), new u8(new u8(b[i+3])).and($0))];
        case 0x2002: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))), new u8(new u8(b[i+3])).and($0))];
        case 0x2003: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))), new u32(new i8(new u8(b[i+3]))).and($0))];
        case 0x2800: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R1[2], ($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))).eq(new i8(new u8(b[i+3])))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add(new i8(-((b[i+3]) << 24 >> 24))))];
        case 0x2802: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R1[2], ($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))).eq(new i8(new u8(b[i+3])))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add(new i8(-((b[i+3]) << 24 >> 24))))];
        case 0x2803: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R1[2], ($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))).eq(new i32(new i8(new u8(b[i+3]))))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add(new i32(-((((b[i+3]) << 24 >> 24)) >> 0))))];
        case 0x3000: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))), $0.xor(new i8(new u8(b[i+3]))))];
        case 0x3002: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))), $0.xor(new i8(new u8(b[i+3]))))];
        case 0x3003: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))), $0.xor(new i8(new u8(b[i+3]))))];
        case 0x3800: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R1[2], new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2])))).eq(new i8(new u8(b[i+3])))), new Mov(R1[1], new u1(0))];
        case 0x3802: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R1[2], new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2])))).eq(new i8(new u8(b[i+3])))), new Mov(R1[1], new u1(0))];
        case 0x3803: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R1[2], new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2])))).eq(new i32(new i8(new u8(b[i+3]))))), new Mov(R1[1], new u1(0))];
        case 0x46: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2])))), new i8(new u8(b[i+3])))];
        case 0x40: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))), $0.shl(new i8(new u8(b[i+3]))).or($0.shr(new u8(((((-((b[i+3]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 8))))];
        case 0x41: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))), $0.shl(new i8(new u8(b[i+3]))).or($0.shr(new u8(((((-((b[i+3]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 32))))];
        case 0x840: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))), $0.shr(new i8(new u8(b[i+3]))).or($0.shl(new u8(((((-((b[i+3]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 8))))];
        case 0x841: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))), $0.shr(new i8(new u8(b[i+3]))).or($0.shl(new u8(((((-((b[i+3]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 32))))];
        case 0x1040: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))), $0.shl(new i8(new u8(b[i+3]))).or($0.shr(new u8(((((-((b[i+3]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 8))))];
        case 0x1041: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))), $0.shl(new i8(new u8(b[i+3]))).or($0.shr(new u8(((((-((b[i+3]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 32))))];
        case 0x1840: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))), $0.shr(new i8(new u8(b[i+3]))).or($0.shl(new u8(((((-((b[i+3]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 8))))];
        case 0x1841: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))), $0.shr(new i8(new u8(b[i+3]))).or($0.shl(new u8(((((-((b[i+3]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 32))))];
        case 0x2040: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))), $0.shl(new i8(new u8(b[i+3]))))];
        case 0x2041: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))), $0.shl(new i8(new u8(b[i+3]))))];
        case 0x2840: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))), new u8($0).shr(new i8(new u8(b[i+3]))))];
        case 0x2841: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))), new u32($0).shr(new i8(new u8(b[i+3]))))];
        case 0x3040: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))), $0.shl(new i8(new u8(b[i+3]))))];
        case 0x3041: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))), $0.shl(new i8(new u8(b[i+3]))))];
        case 0x3840: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))), new i8($0).shr(new i8(new u8(b[i+3]))))];
        case 0x3841: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))), new i32($0).shr(new i8(new u8(b[i+3]))))];
        case 0x76: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R1[2], new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2])))).and(new i8(new u8(b[i+3]))).eq(new i8(0))), new Mov(R1[1], new u1(0)), new Mov(R1[0], new u1(0))];
    }

    if((((((((b[i] & 128) & 0xffff) >> 7) & 0xffff) | ((b[i+1] << 1) & 0xffff)) & 0xffff) & 0x10f) == 0x9)
    switch(((b[i] | ((((b[i+1] & 127) & 0xffff) << 8) & 0xffff)) & 0xffff) & 0x787f) {
        case 0x0: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))), $0.add(new i8(new u8(b[i+3]))))];
        case 0x2: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))), $0.add(new i8(new u8(b[i+3]))))];
        case 0x3: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))), $0.add(new i8(new u8(b[i+3]))))];
        case 0x800: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))), new u8(new u8(b[i+3])).or($0))];
        case 0x802: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))), new u8(new u8(b[i+3])).or($0))];
        case 0x803: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))), new u32(new i8(new u8(b[i+3]))).or($0))];
        case 0x1000: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))), $0.add(new i8(new u8(b[i+3]))).add(R1[1]))];
        case 0x1002: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))), $0.add(new i8(new u8(b[i+3]))).add(R1[1]))];
        case 0x1003: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))), $0.add(new i8(new u8(b[i+3]))).add(R1[1]))];
        case 0x1800: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))), $0.add(new i8(-((b[i+3]) << 24 >> 24))).add(new i8(R1[1]).neg()))];
        case 0x1802: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))), $0.add(new i8(-((b[i+3]) << 24 >> 24))).add(new i8(R1[1]).neg()))];
        case 0x1803: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))), $0.add(new i32(-((((b[i+3]) << 24 >> 24)) >> 0))).add(new i32(R1[1]).neg()))];
        case 0x2000: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))), new u8(new u8(b[i+3])).and($0))];
        case 0x2002: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))), new u8(new u8(b[i+3])).and($0))];
        case 0x2003: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))), new u32(new i8(new u8(b[i+3]))).and($0))];
        case 0x2800: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R1[2], ($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))).eq(new i8(new u8(b[i+3])))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add(new i8(-((b[i+3]) << 24 >> 24))))];
        case 0x2802: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R1[2], ($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))).eq(new i8(new u8(b[i+3])))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add(new i8(-((b[i+3]) << 24 >> 24))))];
        case 0x2803: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R1[2], ($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))).eq(new i32(new i8(new u8(b[i+3]))))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add(new i32(-((((b[i+3]) << 24 >> 24)) >> 0))))];
        case 0x3000: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))), $0.xor(new i8(new u8(b[i+3]))))];
        case 0x3002: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))), $0.xor(new i8(new u8(b[i+3]))))];
        case 0x3003: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))), $0.xor(new i8(new u8(b[i+3]))))];
        case 0x3800: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R1[2], new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)))).eq(new i8(new u8(b[i+3])))), new Mov(R1[1], new u1(0))];
        case 0x3802: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R1[2], new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)))).eq(new i8(new u8(b[i+3])))), new Mov(R1[1], new u1(0))];
        case 0x3803: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R1[2], new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)))).eq(new i32(new i8(new u8(b[i+3]))))), new Mov(R1[1], new u1(0))];
        case 0x400f: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3])))), new Mem32(($0 = R32[4]))), new Mov($0, $0.add(new u8(4)))];
        case 0x46: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)))), new i8(new u8(b[i+3])))];
        case 0x40: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))), $0.shl(new i8(new u8(b[i+3]))).or($0.shr(new u8(((((-((b[i+3]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 8))))];
        case 0x41: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))), $0.shl(new i8(new u8(b[i+3]))).or($0.shr(new u8(((((-((b[i+3]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 32))))];
        case 0x4050: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))), $0.shl(new u8(1)).or($0.shr(new u8(7))))];
        case 0x4051: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))), $0.shl(new u8(1)).or($0.shr(new u8(31))))];
        case 0x4052: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))), $0.shl(($1 = R8[1])).or($0.shr(new u8($1.neg()).add(new u8(8)))))];
        case 0x4053: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))), $0.shl(($1 = R8[1])).or($0.shr(new u8($1.neg()).add(new u8(32)))))];
        case 0x840: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))), $0.shr(new i8(new u8(b[i+3]))).or($0.shl(new u8(((((-((b[i+3]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 8))))];
        case 0x841: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))), $0.shr(new i8(new u8(b[i+3]))).or($0.shl(new u8(((((-((b[i+3]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 32))))];
        case 0x4850: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))), $0.shr(new u8(1)).or($0.shl(new u8(7))))];
        case 0x4851: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))), $0.shr(new u8(1)).or($0.shl(new u8(31))))];
        case 0x4852: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))), $0.shr(($1 = R8[1])).or($0.shl(new u8($1.neg()).add(new u8(8)))))];
        case 0x4853: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))), $0.shr(($1 = R8[1])).or($0.shl(new u8($1.neg()).add(new u8(32)))))];
        case 0x1040: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))), $0.shl(new i8(new u8(b[i+3]))).or($0.shr(new u8(((((-((b[i+3]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 8))))];
        case 0x1041: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))), $0.shl(new i8(new u8(b[i+3]))).or($0.shr(new u8(((((-((b[i+3]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 32))))];
        case 0x5050: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))), $0.shl(new u8(1)).or($0.shr(new u8(7))))];
        case 0x5051: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))), $0.shl(new u8(1)).or($0.shr(new u8(31))))];
        case 0x5052: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))), $0.shl(($1 = R8[1])).or($0.shr(new u8($1.neg()).add(new u8(8)))))];
        case 0x5053: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))), $0.shl(($1 = R8[1])).or($0.shr(new u8($1.neg()).add(new u8(32)))))];
        case 0x1840: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))), $0.shr(new i8(new u8(b[i+3]))).or($0.shl(new u8(((((-((b[i+3]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 8))))];
        case 0x1841: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))), $0.shr(new i8(new u8(b[i+3]))).or($0.shl(new u8(((((-((b[i+3]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 32))))];
        case 0x5850: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))), $0.shr(new u8(1)).or($0.shl(new u8(7))))];
        case 0x5851: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))), $0.shr(new u8(1)).or($0.shl(new u8(31))))];
        case 0x5852: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))), $0.shr(($1 = R8[1])).or($0.shl(new u8($1.neg()).add(new u8(8)))))];
        case 0x5853: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))), $0.shr(($1 = R8[1])).or($0.shl(new u8($1.neg()).add(new u8(32)))))];
        case 0x2040: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))), $0.shl(new i8(new u8(b[i+3]))))];
        case 0x2041: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))), $0.shl(new i8(new u8(b[i+3]))))];
        case 0x6050: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))), $0.shl(new u8(1)))];
        case 0x6051: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))), $0.shl(new u8(1)))];
        case 0x6052: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))), $0.shl(R8[1]))];
        case 0x6053: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))), $0.shl(R8[1]))];
        case 0x2840: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))), new u8($0).shr(new i8(new u8(b[i+3]))))];
        case 0x2841: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))), new u32($0).shr(new i8(new u8(b[i+3]))))];
        case 0x6850: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))), new u8($0).shr(new u8(1)))];
        case 0x6851: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))), new u32($0).shr(new u8(1)))];
        case 0x6852: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))), new u8($0).shr(R8[1]))];
        case 0x6853: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))), new u32($0).shr(R8[1]))];
        case 0x3040: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))), $0.shl(new i8(new u8(b[i+3]))))];
        case 0x3041: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))), $0.shl(new i8(new u8(b[i+3]))))];
        case 0x7050: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))), $0.shl(new u8(1)))];
        case 0x7051: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))), $0.shl(new u8(1)))];
        case 0x7052: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))), $0.shl(R8[1]))];
        case 0x7053: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))), $0.shl(R8[1]))];
        case 0x3840: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))), new i8($0).shr(new i8(new u8(b[i+3]))))];
        case 0x3841: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))), new i32($0).shr(new i8(new u8(b[i+3]))))];
        case 0x7850: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))), new i8($0).shr(new u8(1)))];
        case 0x7851: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))), new i32($0).shr(new u8(1)))];
        case 0x7852: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))), new i8($0).shr(R8[1]))];
        case 0x7853: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))), new i32($0).shr(R8[1]))];
        case 0x76: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R1[2], new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)))).and(new i8(new u8(b[i+3]))).eq(new i8(0))), new Mov(R1[1], new u1(0)), new Mov(R1[0], new u1(0))];
        case 0x5076: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))), $0.not())];
        case 0x5077: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))), $0.not())];
        case 0x5876: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R1[1], new u1(0)), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))), $0.neg())];
        case 0x5877: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R1[1], new u1(0)), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))), $0.neg())];
        case 0x6076: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R16[0], R8[0].mul(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))))];
        case 0x6077: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = R32[0]), $0.mul(new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))))];
        case 0x6876: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R16[0], R8[0].mul(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))))];
        case 0x6877: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = R32[0]), $0.mul(new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))))];
        case 0x7076: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R16[0], R8[0].div(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))))];
        case 0x7077: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = R32[0]), $0.div(new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))))];
        case 0x7876: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R16[0], R8[0].div(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))))];
        case 0x7877: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = R32[0]), $0.div(new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))))];
        case 0x407e: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))), new u8($0).add(new u8(1)))];
        case 0x407f: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))), $0.add(new u8(1)))];
        case 0x487e: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))), $0.add(new i8(-1)))];
        case 0x487f: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))), $0.add(new i32(-1)))];
        case 0x507f: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = R32[4]), $0.add(new i32(-4))), new Mov(new Mem32($0), ($1 = R32[8]).add(new i8(_pfxLength + 4))), new Mov($1, new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3])))))];
        case 0x607f: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R32[8], new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3])))))];
        case 0x707f: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = R32[4]), $0.add(new i32(-4))), new Mov(new Mem32($0), new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3])))))];
    }

    if((b[i+1] & 0x87) == 0x4)
    switch(((b[i] | ((((b[i+1] & 127) & 0xffff) << 8) & 0xffff)) & 0xffff) & 0x40ff) {
        case 0x4000: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))), $0.add(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x4001: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))), $0.add(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x4002: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.add(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))))];
        case 0x4003: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.add(new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))))];
        case 0x4008: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))), $0.or(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x4009: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))), $0.or(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x400a: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.or(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))))];
        case 0x400b: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.or(new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))))];
        case 0x4010: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))), $0.add(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).add(R1[1]))];
        case 0x4011: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))), $0.add(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).add(R1[1]))];
        case 0x4012: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.add(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))).add(R1[1]))];
        case 0x4013: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.add(new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))).add(R1[1]))];
        case 0x4018: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))), $0.add(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].neg()).add(new i8(R1[1]).neg()))];
        case 0x4019: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))), $0.add(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].neg()).add(new i32(R1[1]).neg()))];
        case 0x401a: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.add(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3])))).neg()).add(new i8(R1[1]).neg()))];
        case 0x401b: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.add(new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3])))).neg()).add(new i32(R1[1]).neg()))];
        case 0x4020: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))), $0.and(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x4021: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))), $0.and(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x4022: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.and(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))))];
        case 0x4023: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.and(new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))))];
        case 0x4028: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R1[2], ($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))).eq(($1 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add($1.neg()))];
        case 0x4029: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R1[2], ($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))).eq(($1 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add($1.neg()))];
        case 0x402a: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R1[2], ($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).eq(($1 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add($1.neg()))];
        case 0x402b: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R1[2], ($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).eq(($1 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add($1.neg()))];
        case 0x4030: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))), $0.xor(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x4031: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))), $0.xor(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x4032: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.xor(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))))];
        case 0x4033: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.xor(new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))))];
        case 0x4038: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R1[2], new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3])))).eq(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])), new Mov(R1[1], new u1(0))];
        case 0x4039: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R1[2], new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3])))).eq(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])), new Mov(R1[1], new u1(0))];
        case 0x403a: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R1[2], R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].eq(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3])))))), new Mov(R1[1], new u1(0))];
        case 0x403b: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R1[2], R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].eq(new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3])))))), new Mov(R1[1], new u1(0))];
        case 0x6b: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)))).mul(new i32(new i8(new u8(b[i+3])))))];
        case 0x4084: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R1[2], new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3])))).and(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).eq(new i8(0))), new Mov(R1[1], new u1(0)), new Mov(R1[0], new u1(0))];
        case 0x4085: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R1[2], new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3])))).and(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).eq(new i32(0))), new Mov(R1[1], new u1(0)), new Mov(R1[0], new u1(0))];
        case 0x4086: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($2 = new Register8), ($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3])))))), new Mov($0, ($1 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])), new Mov($1, $2)];
        case 0x4087: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($2 = new Register32), ($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3])))))), new Mov($0, ($1 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])), new Mov($1, $2)];
        case 0x4088: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3])))), R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])];
        case 0x4089: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3])))), R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])];
        case 0x408a: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3])))))];
        case 0x408b: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3])))))];
        case 0x408c: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3])))), R16[((((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff) + 16) & 0xff)])];
        case 0x408d: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3]))))];
        case 0x408e: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R16[((((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff) + 16) & 0xff)], new Mem16(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))).add(new i8(new u8(b[i+3])))))];
    }

    if((((b[i] | ((b[i+1] << 8) & 0xffff)) & 0xffff) & 0xc0ff) == 0x800f)
    switch(((b[i+1] | ((b[i+2] << 8) & 0xffff)) & 0xffff) & 0xc03f) {
        case 0x4010: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3])))), R1[0])];
        case 0x4011: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3])))), R1[0].not())];
        case 0x4012: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3])))), R1[1])];
        case 0x4013: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3])))), R1[1].not())];
        case 0x4014: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3])))), R1[2])];
        case 0x4015: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3])))), R1[2].not())];
        case 0x4016: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3])))), R1[1].or(R1[2]))];
        case 0x4017: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3])))), R1[1].not().and(R1[2].not()))];
        case 0x4018: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3])))), R1[3])];
        case 0x4019: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3])))), R1[3].not())];
        case 0x401a: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3])))), R1[4])];
        case 0x401b: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3])))), R1[4].not())];
        case 0x401c: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3])))), R1[0].eq(R1[3]).not())];
        case 0x401d: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3])))), R1[0].eq(R1[3]))];
        case 0x401e: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3])))), R1[0].eq(R1[3]).not().or(R1[2]))];
        case 0x401f: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3])))), R1[0].eq(R1[3]).and(R1[2].not()))];
        case 0x4023: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R1[1], new u32(1).shl(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).and(new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))).eq(new u8(0)).not())];
        case 0x24: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])), $0.shl(new i8(new u8(b[i+3]))).or(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shr(new u8(((((-((b[i+3]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 32))))];
        case 0xc024: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = R32[((((b[i+2] & 7) & 0xff)) & 0xff)]), $0.shl(new i8(new u8(b[i+3]))).or(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shr(new u8(((((-((b[i+3]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 32))))];
        case 0x4025: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))), $0.shl(($1 = R8[1])).or(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shr(new u8($1.neg()).add(new u8(32)))))];
        case 0x402b: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R1[1], new u32(1).shl(($1 = R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])).and(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3])))))).eq(new u8(0)).not()), new Mov($0, new u32(1).shl($1).or($0))];
        case 0x2c: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])), new u32(((((1 << (((b[i+3]) << 24 >> 24) & 0x1f)) >>> 0) + -1) >>> 0) << (((((((-((b[i+3]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 32) & 0xff) & 0x1f)).and(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).or($0.shr(new i8(new u8(b[i+3])))))];
        case 0xc02c: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = R32[((((b[i+2] & 7) & 0xff)) & 0xff)]), new u32(((((1 << (((b[i+3]) << 24 >> 24) & 0x1f)) >>> 0) + -1) >>> 0) << (((((((-((b[i+3]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 32) & 0xff) & 0x1f)).and(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).or($0.shr(new i8(new u8(b[i+3])))))];
        case 0x402d: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($1 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))), new u32(1).shl(($0 = R8[1])).add(new i32(-1)).shl(new u8($0.neg()).add(new u8(32))).and(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).or($1.shr($0)))];
        case 0x402f: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(($0 = new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])), $0.mul(new i32(new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3])))))))];
        case 0x4036: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3])))))];
        case 0x4037: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new Mem16(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3])))))];
        case 0x403e: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new i32(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))))];
        case 0x403f: return [((((_pfxLength) & 0xff) + 4) & 0xff), new Mov(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new i32(new Mem16(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+3]))))))];
    }

    if((((((((((b[i] & 128) & 0xffff) >> 7) & 0xffff) | ((b[i+1] << 1) & 0xffff)) & 0xffff) | ((((b[i+2] & 63) & 0xffff) << 9) & 0xffff)) & 0xffff) & 0x718f) == 0x4009)
    switch(((b[i] | ((((b[i+1] & 63) & 0xffff) << 8) & 0xffff)) & 0xffff) & 0x387f) {
        case 0xf: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)]), new Mem32(($0 = R32[4]))), new Mov($0, $0.add(new u8(4)))];
        case 0x50: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])), $0.shl(new u8(1)).or($0.shr(new u8(7))))];
        case 0x51: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])), $0.shl(new u8(1)).or($0.shr(new u8(31))))];
        case 0x52: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])), $0.shl(($1 = R8[1])).or($0.shr(new u8($1.neg()).add(new u8(8)))))];
        case 0x53: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])), $0.shl(($1 = R8[1])).or($0.shr(new u8($1.neg()).add(new u8(32)))))];
        case 0x850: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])), $0.shr(new u8(1)).or($0.shl(new u8(7))))];
        case 0x851: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])), $0.shr(new u8(1)).or($0.shl(new u8(31))))];
        case 0x852: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])), $0.shr(($1 = R8[1])).or($0.shl(new u8($1.neg()).add(new u8(8)))))];
        case 0x853: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])), $0.shr(($1 = R8[1])).or($0.shl(new u8($1.neg()).add(new u8(32)))))];
        case 0x1050: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])), $0.shl(new u8(1)).or($0.shr(new u8(7))))];
        case 0x1051: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])), $0.shl(new u8(1)).or($0.shr(new u8(31))))];
        case 0x1052: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])), $0.shl(($1 = R8[1])).or($0.shr(new u8($1.neg()).add(new u8(8)))))];
        case 0x1053: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])), $0.shl(($1 = R8[1])).or($0.shr(new u8($1.neg()).add(new u8(32)))))];
        case 0x1850: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])), $0.shr(new u8(1)).or($0.shl(new u8(7))))];
        case 0x1851: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])), $0.shr(new u8(1)).or($0.shl(new u8(31))))];
        case 0x1852: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])), $0.shr(($1 = R8[1])).or($0.shl(new u8($1.neg()).add(new u8(8)))))];
        case 0x1853: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])), $0.shr(($1 = R8[1])).or($0.shl(new u8($1.neg()).add(new u8(32)))))];
        case 0x2050: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])), $0.shl(new u8(1)))];
        case 0x2051: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])), $0.shl(new u8(1)))];
        case 0x2052: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])), $0.shl(R8[1]))];
        case 0x2053: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])), $0.shl(R8[1]))];
        case 0x2850: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])), new u8($0).shr(new u8(1)))];
        case 0x2851: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])), new u32($0).shr(new u8(1)))];
        case 0x2852: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])), new u8($0).shr(R8[1]))];
        case 0x2853: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])), new u32($0).shr(R8[1]))];
        case 0x3050: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])), $0.shl(new u8(1)))];
        case 0x3051: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])), $0.shl(new u8(1)))];
        case 0x3052: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])), $0.shl(R8[1]))];
        case 0x3053: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])), $0.shl(R8[1]))];
        case 0x3850: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])), new i8($0).shr(new u8(1)))];
        case 0x3851: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])), new i32($0).shr(new u8(1)))];
        case 0x3852: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])), new i8($0).shr(R8[1]))];
        case 0x3853: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])), new i32($0).shr(R8[1]))];
        case 0x1076: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])), $0.not())];
        case 0x1077: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])), $0.not())];
        case 0x1876: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(R1[1], new u1(0)), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])), $0.neg())];
        case 0x1877: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(R1[1], new u1(0)), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])), $0.neg())];
        case 0x2076: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(R16[0], R8[0].mul(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])))];
        case 0x2077: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = R32[0]), $0.mul(new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])))];
        case 0x2876: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(R16[0], R8[0].mul(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])))];
        case 0x2877: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = R32[0]), $0.mul(new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])))];
        case 0x3076: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(R16[0], R8[0].div(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])))];
        case 0x3077: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = R32[0]), $0.div(new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])))];
        case 0x3876: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(R16[0], R8[0].div(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])))];
        case 0x3877: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = R32[0]), $0.div(new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])))];
        case 0x7e: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])), new u8($0).add(new u8(1)))];
        case 0x7f: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])), $0.add(new u8(1)))];
        case 0x87e: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])), $0.add(new i8(-1)))];
        case 0x87f: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])), $0.add(new i32(-1)))];
        case 0x107f: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = R32[4]), $0.add(new i32(-4))), new Mov(new Mem32($0), ($1 = R32[8]).add(new i8(_pfxLength + 3))), new Mov($1, new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)]))];
        case 0x207f: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(R32[8], new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)]))];
        case 0x307f: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = R32[4]), $0.add(new i32(-4))), new Mov(new Mem32($0), new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)]))];
    }

    if((((((((((b[i] & 192) & 0xffff) >> 6) & 0xffff) | ((b[i+1] << 2) & 0xffff)) & 0xffff) | ((((b[i+2] & 63) & 0xffff) << 10) & 0xffff)) & 0xffff) & 0xe31d) == 0x8010)
    switch(b[i] & 0xbf) {
        case 0x0: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])), $0.add(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x1: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])), $0.add(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x2: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.add(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])))];
        case 0x3: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.add(new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])))];
        case 0x8: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])), $0.or(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x9: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])), $0.or(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0xa: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.or(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])))];
        case 0xb: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.or(new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])))];
        case 0x10: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])), $0.add(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).add(R1[1]))];
        case 0x11: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])), $0.add(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).add(R1[1]))];
        case 0x12: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.add(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])).add(R1[1]))];
        case 0x13: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.add(new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])).add(R1[1]))];
        case 0x18: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])), $0.add(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].neg()).add(new i8(R1[1]).neg()))];
        case 0x19: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])), $0.add(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].neg()).add(new i32(R1[1]).neg()))];
        case 0x1a: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.add(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)]).neg()).add(new i8(R1[1]).neg()))];
        case 0x1b: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.add(new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)]).neg()).add(new i32(R1[1]).neg()))];
        case 0x20: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])), $0.and(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x21: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])), $0.and(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x22: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.and(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])))];
        case 0x23: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.and(new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])))];
        case 0x28: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(R1[2], ($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])).eq(($1 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add($1.neg()))];
        case 0x29: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(R1[2], ($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])).eq(($1 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add($1.neg()))];
        case 0x2a: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(R1[2], ($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).eq(($1 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add($1.neg()))];
        case 0x2b: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(R1[2], ($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).eq(($1 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add($1.neg()))];
        case 0x30: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])), $0.xor(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x31: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])), $0.xor(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x32: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.xor(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])))];
        case 0x33: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.xor(new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])))];
        case 0x38: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(R1[2], new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)]).eq(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])), new Mov(R1[1], new u1(0))];
        case 0x39: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(R1[2], new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)]).eq(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])), new Mov(R1[1], new u1(0))];
        case 0x3a: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(R1[2], R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].eq(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)]))), new Mov(R1[1], new u1(0))];
        case 0x3b: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(R1[2], R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].eq(new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)]))), new Mov(R1[1], new u1(0))];
        case 0x84: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(R1[2], new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)]).and(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).eq(new i8(0))), new Mov(R1[1], new u1(0)), new Mov(R1[0], new u1(0))];
        case 0x85: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(R1[2], new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)]).and(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).eq(new i32(0))), new Mov(R1[1], new u1(0)), new Mov(R1[0], new u1(0))];
        case 0x86: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($2 = new Register8), ($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)]))), new Mov($0, ($1 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])), new Mov($1, $2)];
        case 0x87: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($2 = new Register32), ($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)]))), new Mov($0, ($1 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])), new Mov($1, $2)];
        case 0x88: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)]), R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])];
        case 0x89: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)]), R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])];
        case 0x8a: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)]))];
        case 0x8b: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)]))];
        case 0x8c: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)]), R16[((((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff) + 16) & 0xff)])];
        case 0x8d: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], R32[((((b[i+2] & 7) & 0xff)) & 0xff)])];
        case 0x8e: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(R16[((((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff) + 16) & 0xff)], new Mem16(R32[((((b[i+2] & 7) & 0xff)) & 0xff)]))];
    }

    if((((((((b[i] & 128) & 0xffff) >> 7) & 0xffff) | ((b[i+1] << 1) & 0xffff)) & 0xffff) & 0x18f) == 0x9)
    switch(((b[i] | ((((b[i+1] & 63) & 0xffff) << 8) & 0xffff)) & 0xffff) & 0x387f) {
        case 0xf: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)))), new Mem32(($0 = R32[4]))), new Mov($0, $0.add(new u8(4)))];
        case 0x50: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))), $0.shl(new u8(1)).or($0.shr(new u8(7))))];
        case 0x51: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))), $0.shl(new u8(1)).or($0.shr(new u8(31))))];
        case 0x52: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))), $0.shl(($1 = R8[1])).or($0.shr(new u8($1.neg()).add(new u8(8)))))];
        case 0x53: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))), $0.shl(($1 = R8[1])).or($0.shr(new u8($1.neg()).add(new u8(32)))))];
        case 0x850: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))), $0.shr(new u8(1)).or($0.shl(new u8(7))))];
        case 0x851: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))), $0.shr(new u8(1)).or($0.shl(new u8(31))))];
        case 0x852: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))), $0.shr(($1 = R8[1])).or($0.shl(new u8($1.neg()).add(new u8(8)))))];
        case 0x853: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))), $0.shr(($1 = R8[1])).or($0.shl(new u8($1.neg()).add(new u8(32)))))];
        case 0x1050: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))), $0.shl(new u8(1)).or($0.shr(new u8(7))))];
        case 0x1051: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))), $0.shl(new u8(1)).or($0.shr(new u8(31))))];
        case 0x1052: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))), $0.shl(($1 = R8[1])).or($0.shr(new u8($1.neg()).add(new u8(8)))))];
        case 0x1053: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))), $0.shl(($1 = R8[1])).or($0.shr(new u8($1.neg()).add(new u8(32)))))];
        case 0x1850: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))), $0.shr(new u8(1)).or($0.shl(new u8(7))))];
        case 0x1851: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))), $0.shr(new u8(1)).or($0.shl(new u8(31))))];
        case 0x1852: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))), $0.shr(($1 = R8[1])).or($0.shl(new u8($1.neg()).add(new u8(8)))))];
        case 0x1853: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))), $0.shr(($1 = R8[1])).or($0.shl(new u8($1.neg()).add(new u8(32)))))];
        case 0x2050: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))), $0.shl(new u8(1)))];
        case 0x2051: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))), $0.shl(new u8(1)))];
        case 0x2052: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))), $0.shl(R8[1]))];
        case 0x2053: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))), $0.shl(R8[1]))];
        case 0x2850: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))), new u8($0).shr(new u8(1)))];
        case 0x2851: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))), new u32($0).shr(new u8(1)))];
        case 0x2852: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))), new u8($0).shr(R8[1]))];
        case 0x2853: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))), new u32($0).shr(R8[1]))];
        case 0x3050: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))), $0.shl(new u8(1)))];
        case 0x3051: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))), $0.shl(new u8(1)))];
        case 0x3052: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))), $0.shl(R8[1]))];
        case 0x3053: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))), $0.shl(R8[1]))];
        case 0x3850: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))), new i8($0).shr(new u8(1)))];
        case 0x3851: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))), new i32($0).shr(new u8(1)))];
        case 0x3852: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))), new i8($0).shr(R8[1]))];
        case 0x3853: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))), new i32($0).shr(R8[1]))];
        case 0x1076: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))), $0.not())];
        case 0x1077: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))), $0.not())];
        case 0x1876: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(R1[1], new u1(0)), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))), $0.neg())];
        case 0x1877: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(R1[1], new u1(0)), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))), $0.neg())];
        case 0x2076: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(R16[0], R8[0].mul(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))))];
        case 0x2077: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = R32[0]), $0.mul(new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))))];
        case 0x2876: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(R16[0], R8[0].mul(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))))];
        case 0x2877: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = R32[0]), $0.mul(new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))))];
        case 0x3076: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(R16[0], R8[0].div(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))))];
        case 0x3077: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = R32[0]), $0.div(new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))))];
        case 0x3876: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(R16[0], R8[0].div(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))))];
        case 0x3877: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = R32[0]), $0.div(new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))))];
        case 0x7e: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))), new u8($0).add(new u8(1)))];
        case 0x7f: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))), $0.add(new u8(1)))];
        case 0x87e: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))), $0.add(new i8(-1)))];
        case 0x87f: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))), $0.add(new i32(-1)))];
        case 0x107f: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = R32[4]), $0.add(new i32(-4))), new Mov(new Mem32($0), ($1 = R32[8]).add(new i8(_pfxLength + 3))), new Mov($1, new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)))))];
        case 0x207f: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(R32[8], new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)))))];
        case 0x307f: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = R32[4]), $0.add(new i32(-4))), new Mov(new Mem32($0), new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)))))];
    }

    if((((((((b[i] & 192) & 0xffff) >> 6) & 0xffff) | ((b[i+1] << 2) & 0xffff)) & 0xffff) & 0x31d) == 0x10)
    switch(b[i] & 0xbf) {
        case 0x0: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))), $0.add(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x1: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))), $0.add(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x2: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.add(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))))];
        case 0x3: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.add(new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))))];
        case 0x8: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))), $0.or(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x9: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))), $0.or(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0xa: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.or(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))))];
        case 0xb: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.or(new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))))];
        case 0x10: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))), $0.add(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).add(R1[1]))];
        case 0x11: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))), $0.add(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).add(R1[1]))];
        case 0x12: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.add(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))).add(R1[1]))];
        case 0x13: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.add(new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))).add(R1[1]))];
        case 0x18: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))), $0.add(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].neg()).add(new i8(R1[1]).neg()))];
        case 0x19: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))), $0.add(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].neg()).add(new i32(R1[1]).neg()))];
        case 0x1a: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.add(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)))).neg()).add(new i8(R1[1]).neg()))];
        case 0x1b: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.add(new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)))).neg()).add(new i32(R1[1]).neg()))];
        case 0x20: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))), $0.and(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x21: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))), $0.and(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x22: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.and(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))))];
        case 0x23: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.and(new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))))];
        case 0x28: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(R1[2], ($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))).eq(($1 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add($1.neg()))];
        case 0x29: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(R1[2], ($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))).eq(($1 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add($1.neg()))];
        case 0x2a: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(R1[2], ($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).eq(($1 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add($1.neg()))];
        case 0x2b: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(R1[2], ($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).eq(($1 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add($1.neg()))];
        case 0x30: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))), $0.xor(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x31: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))), $0.xor(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x32: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.xor(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))))];
        case 0x33: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.xor(new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))))];
        case 0x38: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(R1[2], new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)))).eq(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])), new Mov(R1[1], new u1(0))];
        case 0x39: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(R1[2], new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)))).eq(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])), new Mov(R1[1], new u1(0))];
        case 0x3a: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(R1[2], R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].eq(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)))))), new Mov(R1[1], new u1(0))];
        case 0x3b: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(R1[2], R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].eq(new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)))))), new Mov(R1[1], new u1(0))];
        case 0x84: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(R1[2], new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)))).and(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).eq(new i8(0))), new Mov(R1[1], new u1(0)), new Mov(R1[0], new u1(0))];
        case 0x85: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(R1[2], new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)))).and(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).eq(new i32(0))), new Mov(R1[1], new u1(0)), new Mov(R1[0], new u1(0))];
        case 0x86: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($2 = new Register8), ($0 = new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)))))), new Mov($0, ($1 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])), new Mov($1, $2)];
        case 0x87: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($2 = new Register32), ($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)))))), new Mov($0, ($1 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])), new Mov($1, $2)];
        case 0x88: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)))), R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])];
        case 0x89: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)))), R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])];
        case 0x8a: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)))))];
        case 0x8b: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)))))];
        case 0x8c: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)))), R16[((((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff) + 16) & 0xff)])];
        case 0x8d: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6))))];
        case 0x8e: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(R16[((((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff) + 16) & 0xff)], new Mem16(R32[((((b[i+2] & 7) & 0xff)) & 0xff)].add(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shl(new u8(((b[i+2] & 192) & 0xff) >> 6)))))];
    }

    if((((b[i] | ((b[i+1] << 8) & 0xffff)) & 0xffff) & 0xc0ff) == 0x800f)
    switch(((b[i+1] | ((b[i+2] << 8) & 0xffff)) & 0xffff) & 0xc03f) {
        case 0x10: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)]), R1[0])];
        case 0xc010: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(R8[((((b[i+2] & 7) & 0xff)) & 0xff)], R1[0])];
        case 0x11: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)]), R1[0].not())];
        case 0xc011: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(R8[((((b[i+2] & 7) & 0xff)) & 0xff)], R1[0].not())];
        case 0x12: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)]), R1[1])];
        case 0xc012: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(R8[((((b[i+2] & 7) & 0xff)) & 0xff)], R1[1])];
        case 0x13: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)]), R1[1].not())];
        case 0xc013: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(R8[((((b[i+2] & 7) & 0xff)) & 0xff)], R1[1].not())];
        case 0x14: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)]), R1[2])];
        case 0xc014: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(R8[((((b[i+2] & 7) & 0xff)) & 0xff)], R1[2])];
        case 0x15: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)]), R1[2].not())];
        case 0xc015: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(R8[((((b[i+2] & 7) & 0xff)) & 0xff)], R1[2].not())];
        case 0x16: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)]), R1[1].or(R1[2]))];
        case 0xc016: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(R8[((((b[i+2] & 7) & 0xff)) & 0xff)], R1[1].or(R1[2]))];
        case 0x17: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)]), R1[1].not().and(R1[2].not()))];
        case 0xc017: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(R8[((((b[i+2] & 7) & 0xff)) & 0xff)], R1[1].not().and(R1[2].not()))];
        case 0x18: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)]), R1[3])];
        case 0xc018: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(R8[((((b[i+2] & 7) & 0xff)) & 0xff)], R1[3])];
        case 0x19: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)]), R1[3].not())];
        case 0xc019: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(R8[((((b[i+2] & 7) & 0xff)) & 0xff)], R1[3].not())];
        case 0x1a: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)]), R1[4])];
        case 0xc01a: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(R8[((((b[i+2] & 7) & 0xff)) & 0xff)], R1[4])];
        case 0x1b: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)]), R1[4].not())];
        case 0xc01b: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(R8[((((b[i+2] & 7) & 0xff)) & 0xff)], R1[4].not())];
        case 0x1c: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)]), R1[0].eq(R1[3]).not())];
        case 0xc01c: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(R8[((((b[i+2] & 7) & 0xff)) & 0xff)], R1[0].eq(R1[3]).not())];
        case 0x1d: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)]), R1[0].eq(R1[3]))];
        case 0xc01d: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(R8[((((b[i+2] & 7) & 0xff)) & 0xff)], R1[0].eq(R1[3]))];
        case 0x1e: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)]), R1[0].eq(R1[3]).not().or(R1[2]))];
        case 0xc01e: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(R8[((((b[i+2] & 7) & 0xff)) & 0xff)], R1[0].eq(R1[3]).not().or(R1[2]))];
        case 0x1f: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)]), R1[0].eq(R1[3]).and(R1[2].not()))];
        case 0xc01f: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(R8[((((b[i+2] & 7) & 0xff)) & 0xff)], R1[0].eq(R1[3]).and(R1[2].not()))];
        case 0x23: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(R1[1], new u32(1).shl(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).and(new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])).eq(new u8(0)).not())];
        case 0xc023: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(R1[1], new u32(1).shl(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).and(R32[((((b[i+2] & 7) & 0xff)) & 0xff)]).eq(new u8(0)).not())];
        case 0x25: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])), $0.shl(($1 = R8[1])).or(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shr(new u8($1.neg()).add(new u8(32)))))];
        case 0xc025: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = R32[((((b[i+2] & 7) & 0xff)) & 0xff)]), $0.shl(($1 = R8[1])).or(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].shr(new u8($1.neg()).add(new u8(32)))))];
        case 0x2b: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(R1[1], new u32(1).shl(($1 = R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])).and(($0 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)]))).eq(new u8(0)).not()), new Mov($0, new u32(1).shl($1).or($0))];
        case 0xc02b: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(R1[1], new u32(1).shl(($1 = R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])).and(($0 = R32[((((b[i+2] & 7) & 0xff)) & 0xff)])).eq(new u8(0)).not()), new Mov($0, new u32(1).shl($1).or($0))];
        case 0x2d: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($1 = new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])), new u32(1).shl(($0 = R8[1])).add(new i32(-1)).shl(new u8($0.neg()).add(new u8(32))).and(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).or($1.shr($0)))];
        case 0xc02d: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($1 = R32[((((b[i+2] & 7) & 0xff)) & 0xff)]), new u32(1).shl(($0 = R8[1])).add(new i32(-1)).shl(new u8($0.neg()).add(new u8(32))).and(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).or($1.shr($0)))];
        case 0x2f: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])), $0.mul(new i32(new Mem32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)]))))];
        case 0xc02f: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new i32(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])), $0.mul(new i32(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])))];
        case 0x36: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)]))];
        case 0xc036: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], R8[((((b[i+2] & 7) & 0xff)) & 0xff)])];
        case 0x37: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new Mem16(R32[((((b[i+2] & 7) & 0xff)) & 0xff)]))];
        case 0xc037: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], R16[((((b[i+2] & 7) & 0xff)) & 0xff)])];
        case 0x3e: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new i32(new Mem8(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])))];
        case 0xc03e: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new i32(R8[((((b[i+2] & 7) & 0xff)) & 0xff)]))];
        case 0x3f: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new i32(new Mem16(R32[((((b[i+2] & 7) & 0xff)) & 0xff)])))];
        case 0xc03f: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(R32[((((((b[i+2] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new i32(R16[((((b[i+2] & 7) & 0xff)) & 0xff)]))];
    }

    if((b[i] & 0xff) == 0xc2)
    switch(0) {
        case 0x0: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(R32[8], new Mem32(($0 = R32[4]))), new Mov($0, $0.add(new u8(4))), new Mov($0, $0.add(new i16(new u16(b[i+1] | ((b[i+2] << 8) & 0xffff)))))];
    }

    if((((((b[i] & 128) & 0xff) >> 7) & 0xff) & 0x1) == 0x1)
    switch(((b[i] | ((b[i+1] << 8) & 0xffff)) & 0xffff) & 0xf87f) {
        case 0x0: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])), $0.add(new i8(new u8(b[i+2]))))];
        case 0xc000: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = R8[((((b[i+1] & 7) & 0xff)) & 0xff)]), $0.add(new i8(new u8(b[i+2]))))];
        case 0x2: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])), $0.add(new i8(new u8(b[i+2]))))];
        case 0xc002: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = R8[((((b[i+1] & 7) & 0xff)) & 0xff)]), $0.add(new i8(new u8(b[i+2]))))];
        case 0x3: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])), $0.add(new i8(new u8(b[i+2]))))];
        case 0xc003: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = R32[((((b[i+1] & 7) & 0xff)) & 0xff)]), $0.add(new i8(new u8(b[i+2]))))];
        case 0x800: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])), new u8(new u8(b[i+2])).or($0))];
        case 0xc800: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = R8[((((b[i+1] & 7) & 0xff)) & 0xff)]), new u8(new u8(b[i+2])).or($0))];
        case 0x802: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])), new u8(new u8(b[i+2])).or($0))];
        case 0xc802: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = R8[((((b[i+1] & 7) & 0xff)) & 0xff)]), new u8(new u8(b[i+2])).or($0))];
        case 0x803: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])), new u32(new i8(new u8(b[i+2]))).or($0))];
        case 0xc803: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = R32[((((b[i+1] & 7) & 0xff)) & 0xff)]), new u32(new i8(new u8(b[i+2]))).or($0))];
        case 0x1000: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])), $0.add(new i8(new u8(b[i+2]))).add(R1[1]))];
        case 0xd000: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = R8[((((b[i+1] & 7) & 0xff)) & 0xff)]), $0.add(new i8(new u8(b[i+2]))).add(R1[1]))];
        case 0x1002: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])), $0.add(new i8(new u8(b[i+2]))).add(R1[1]))];
        case 0xd002: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = R8[((((b[i+1] & 7) & 0xff)) & 0xff)]), $0.add(new i8(new u8(b[i+2]))).add(R1[1]))];
        case 0x1003: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])), $0.add(new i8(new u8(b[i+2]))).add(R1[1]))];
        case 0xd003: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = R32[((((b[i+1] & 7) & 0xff)) & 0xff)]), $0.add(new i8(new u8(b[i+2]))).add(R1[1]))];
        case 0x1800: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])), $0.add(new i8(-((b[i+2]) << 24 >> 24))).add(new i8(R1[1]).neg()))];
        case 0xd800: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = R8[((((b[i+1] & 7) & 0xff)) & 0xff)]), $0.add(new i8(-((b[i+2]) << 24 >> 24))).add(new i8(R1[1]).neg()))];
        case 0x1802: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])), $0.add(new i8(-((b[i+2]) << 24 >> 24))).add(new i8(R1[1]).neg()))];
        case 0xd802: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = R8[((((b[i+1] & 7) & 0xff)) & 0xff)]), $0.add(new i8(-((b[i+2]) << 24 >> 24))).add(new i8(R1[1]).neg()))];
        case 0x1803: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])), $0.add(new i32(-((((b[i+2]) << 24 >> 24)) >> 0))).add(new i32(R1[1]).neg()))];
        case 0xd803: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = R32[((((b[i+1] & 7) & 0xff)) & 0xff)]), $0.add(new i32(-((((b[i+2]) << 24 >> 24)) >> 0))).add(new i32(R1[1]).neg()))];
        case 0x2000: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])), new u8(new u8(b[i+2])).and($0))];
        case 0xe000: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = R8[((((b[i+1] & 7) & 0xff)) & 0xff)]), new u8(new u8(b[i+2])).and($0))];
        case 0x2002: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])), new u8(new u8(b[i+2])).and($0))];
        case 0xe002: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = R8[((((b[i+1] & 7) & 0xff)) & 0xff)]), new u8(new u8(b[i+2])).and($0))];
        case 0x2003: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])), new u32(new i8(new u8(b[i+2]))).and($0))];
        case 0xe003: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = R32[((((b[i+1] & 7) & 0xff)) & 0xff)]), new u32(new i8(new u8(b[i+2]))).and($0))];
        case 0x2800: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(R1[2], ($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])).eq(new i8(new u8(b[i+2])))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add(new i8(-((b[i+2]) << 24 >> 24))))];
        case 0xe800: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(R1[2], ($0 = R8[((((b[i+1] & 7) & 0xff)) & 0xff)]).eq(new i8(new u8(b[i+2])))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add(new i8(-((b[i+2]) << 24 >> 24))))];
        case 0x2802: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(R1[2], ($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])).eq(new i8(new u8(b[i+2])))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add(new i8(-((b[i+2]) << 24 >> 24))))];
        case 0xe802: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(R1[2], ($0 = R8[((((b[i+1] & 7) & 0xff)) & 0xff)]).eq(new i8(new u8(b[i+2])))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add(new i8(-((b[i+2]) << 24 >> 24))))];
        case 0x2803: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(R1[2], ($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])).eq(new i32(new i8(new u8(b[i+2]))))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add(new i32(-((((b[i+2]) << 24 >> 24)) >> 0))))];
        case 0xe803: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(R1[2], ($0 = R32[((((b[i+1] & 7) & 0xff)) & 0xff)]).eq(new i32(new i8(new u8(b[i+2]))))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add(new i32(-((((b[i+2]) << 24 >> 24)) >> 0))))];
        case 0x3000: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])), $0.xor(new i8(new u8(b[i+2]))))];
        case 0xf000: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = R8[((((b[i+1] & 7) & 0xff)) & 0xff)]), $0.xor(new i8(new u8(b[i+2]))))];
        case 0x3002: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])), $0.xor(new i8(new u8(b[i+2]))))];
        case 0xf002: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = R8[((((b[i+1] & 7) & 0xff)) & 0xff)]), $0.xor(new i8(new u8(b[i+2]))))];
        case 0x3003: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])), $0.xor(new i8(new u8(b[i+2]))))];
        case 0xf003: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = R32[((((b[i+1] & 7) & 0xff)) & 0xff)]), $0.xor(new i8(new u8(b[i+2]))))];
        case 0x3800: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(R1[2], new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)]).eq(new i8(new u8(b[i+2])))), new Mov(R1[1], new u1(0))];
        case 0xf800: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(R1[2], R8[((((b[i+1] & 7) & 0xff)) & 0xff)].eq(new i8(new u8(b[i+2])))), new Mov(R1[1], new u1(0))];
        case 0x3802: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(R1[2], new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)]).eq(new i8(new u8(b[i+2])))), new Mov(R1[1], new u1(0))];
        case 0xf802: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(R1[2], R8[((((b[i+1] & 7) & 0xff)) & 0xff)].eq(new i8(new u8(b[i+2])))), new Mov(R1[1], new u1(0))];
        case 0x3803: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(R1[2], new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)]).eq(new i32(new i8(new u8(b[i+2]))))), new Mov(R1[1], new u1(0))];
        case 0xf803: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(R1[2], R32[((((b[i+1] & 7) & 0xff)) & 0xff)].eq(new i32(new i8(new u8(b[i+2]))))), new Mov(R1[1], new u1(0))];
        case 0x400f: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2])))), new Mem32(($0 = R32[4]))), new Mov($0, $0.add(new u8(4)))];
        case 0x46: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)]), new i8(new u8(b[i+2])))];
        case 0xc046: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(R8[((((b[i+1] & 7) & 0xff)) & 0xff)], new i8(new u8(b[i+2])))];
        case 0x40: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])), $0.shl(new i8(new u8(b[i+2]))).or($0.shr(new u8(((((-((b[i+2]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 8))))];
        case 0xc040: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = R8[((((b[i+1] & 7) & 0xff)) & 0xff)]), $0.shl(new i8(new u8(b[i+2]))).or($0.shr(new u8(((((-((b[i+2]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 8))))];
        case 0x41: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])), $0.shl(new i8(new u8(b[i+2]))).or($0.shr(new u8(((((-((b[i+2]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 32))))];
        case 0xc041: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = R32[((((b[i+1] & 7) & 0xff)) & 0xff)]), $0.shl(new i8(new u8(b[i+2]))).or($0.shr(new u8(((((-((b[i+2]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 32))))];
        case 0x4050: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))), $0.shl(new u8(1)).or($0.shr(new u8(7))))];
        case 0x4051: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))), $0.shl(new u8(1)).or($0.shr(new u8(31))))];
        case 0x4052: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))), $0.shl(($1 = R8[1])).or($0.shr(new u8($1.neg()).add(new u8(8)))))];
        case 0x4053: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))), $0.shl(($1 = R8[1])).or($0.shr(new u8($1.neg()).add(new u8(32)))))];
        case 0x840: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])), $0.shr(new i8(new u8(b[i+2]))).or($0.shl(new u8(((((-((b[i+2]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 8))))];
        case 0xc840: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = R8[((((b[i+1] & 7) & 0xff)) & 0xff)]), $0.shr(new i8(new u8(b[i+2]))).or($0.shl(new u8(((((-((b[i+2]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 8))))];
        case 0x841: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])), $0.shr(new i8(new u8(b[i+2]))).or($0.shl(new u8(((((-((b[i+2]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 32))))];
        case 0xc841: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = R32[((((b[i+1] & 7) & 0xff)) & 0xff)]), $0.shr(new i8(new u8(b[i+2]))).or($0.shl(new u8(((((-((b[i+2]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 32))))];
        case 0x4850: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))), $0.shr(new u8(1)).or($0.shl(new u8(7))))];
        case 0x4851: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))), $0.shr(new u8(1)).or($0.shl(new u8(31))))];
        case 0x4852: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))), $0.shr(($1 = R8[1])).or($0.shl(new u8($1.neg()).add(new u8(8)))))];
        case 0x4853: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))), $0.shr(($1 = R8[1])).or($0.shl(new u8($1.neg()).add(new u8(32)))))];
        case 0x1040: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])), $0.shl(new i8(new u8(b[i+2]))).or($0.shr(new u8(((((-((b[i+2]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 8))))];
        case 0xd040: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = R8[((((b[i+1] & 7) & 0xff)) & 0xff)]), $0.shl(new i8(new u8(b[i+2]))).or($0.shr(new u8(((((-((b[i+2]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 8))))];
        case 0x1041: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])), $0.shl(new i8(new u8(b[i+2]))).or($0.shr(new u8(((((-((b[i+2]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 32))))];
        case 0xd041: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = R32[((((b[i+1] & 7) & 0xff)) & 0xff)]), $0.shl(new i8(new u8(b[i+2]))).or($0.shr(new u8(((((-((b[i+2]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 32))))];
        case 0x5050: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))), $0.shl(new u8(1)).or($0.shr(new u8(7))))];
        case 0x5051: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))), $0.shl(new u8(1)).or($0.shr(new u8(31))))];
        case 0x5052: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))), $0.shl(($1 = R8[1])).or($0.shr(new u8($1.neg()).add(new u8(8)))))];
        case 0x5053: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))), $0.shl(($1 = R8[1])).or($0.shr(new u8($1.neg()).add(new u8(32)))))];
        case 0x1840: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])), $0.shr(new i8(new u8(b[i+2]))).or($0.shl(new u8(((((-((b[i+2]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 8))))];
        case 0xd840: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = R8[((((b[i+1] & 7) & 0xff)) & 0xff)]), $0.shr(new i8(new u8(b[i+2]))).or($0.shl(new u8(((((-((b[i+2]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 8))))];
        case 0x1841: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])), $0.shr(new i8(new u8(b[i+2]))).or($0.shl(new u8(((((-((b[i+2]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 32))))];
        case 0xd841: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = R32[((((b[i+1] & 7) & 0xff)) & 0xff)]), $0.shr(new i8(new u8(b[i+2]))).or($0.shl(new u8(((((-((b[i+2]) << 24 >> 24)) << 24 >> 24)) & 0xff) + 32))))];
        case 0x5850: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))), $0.shr(new u8(1)).or($0.shl(new u8(7))))];
        case 0x5851: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))), $0.shr(new u8(1)).or($0.shl(new u8(31))))];
        case 0x5852: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))), $0.shr(($1 = R8[1])).or($0.shl(new u8($1.neg()).add(new u8(8)))))];
        case 0x5853: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))), $0.shr(($1 = R8[1])).or($0.shl(new u8($1.neg()).add(new u8(32)))))];
        case 0x2040: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])), $0.shl(new i8(new u8(b[i+2]))))];
        case 0xe040: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = R8[((((b[i+1] & 7) & 0xff)) & 0xff)]), $0.shl(new i8(new u8(b[i+2]))))];
        case 0x2041: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])), $0.shl(new i8(new u8(b[i+2]))))];
        case 0xe041: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = R32[((((b[i+1] & 7) & 0xff)) & 0xff)]), $0.shl(new i8(new u8(b[i+2]))))];
        case 0x6050: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))), $0.shl(new u8(1)))];
        case 0x6051: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))), $0.shl(new u8(1)))];
        case 0x6052: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))), $0.shl(R8[1]))];
        case 0x6053: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))), $0.shl(R8[1]))];
        case 0x2840: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])), new u8($0).shr(new i8(new u8(b[i+2]))))];
        case 0xe840: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = R8[((((b[i+1] & 7) & 0xff)) & 0xff)]), new u8($0).shr(new i8(new u8(b[i+2]))))];
        case 0x2841: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])), new u32($0).shr(new i8(new u8(b[i+2]))))];
        case 0xe841: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = R32[((((b[i+1] & 7) & 0xff)) & 0xff)]), new u32($0).shr(new i8(new u8(b[i+2]))))];
        case 0x6850: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))), new u8($0).shr(new u8(1)))];
        case 0x6851: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))), new u32($0).shr(new u8(1)))];
        case 0x6852: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))), new u8($0).shr(R8[1]))];
        case 0x6853: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))), new u32($0).shr(R8[1]))];
        case 0x3040: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])), $0.shl(new i8(new u8(b[i+2]))))];
        case 0xf040: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = R8[((((b[i+1] & 7) & 0xff)) & 0xff)]), $0.shl(new i8(new u8(b[i+2]))))];
        case 0x3041: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])), $0.shl(new i8(new u8(b[i+2]))))];
        case 0xf041: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = R32[((((b[i+1] & 7) & 0xff)) & 0xff)]), $0.shl(new i8(new u8(b[i+2]))))];
        case 0x7050: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))), $0.shl(new u8(1)))];
        case 0x7051: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))), $0.shl(new u8(1)))];
        case 0x7052: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))), $0.shl(R8[1]))];
        case 0x7053: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))), $0.shl(R8[1]))];
        case 0x3840: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])), new i8($0).shr(new i8(new u8(b[i+2]))))];
        case 0xf840: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = R8[((((b[i+1] & 7) & 0xff)) & 0xff)]), new i8($0).shr(new i8(new u8(b[i+2]))))];
        case 0x3841: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])), new i32($0).shr(new i8(new u8(b[i+2]))))];
        case 0xf841: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = R32[((((b[i+1] & 7) & 0xff)) & 0xff)]), new i32($0).shr(new i8(new u8(b[i+2]))))];
        case 0x7850: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))), new i8($0).shr(new u8(1)))];
        case 0x7851: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))), new i32($0).shr(new u8(1)))];
        case 0x7852: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))), new i8($0).shr(R8[1]))];
        case 0x7853: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))), new i32($0).shr(R8[1]))];
        case 0x76: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(R1[2], new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)]).and(new i8(new u8(b[i+2]))).eq(new i8(0))), new Mov(R1[1], new u1(0)), new Mov(R1[0], new u1(0))];
        case 0xc076: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(R1[2], R8[((((b[i+1] & 7) & 0xff)) & 0xff)].and(new i8(new u8(b[i+2]))).eq(new i8(0))), new Mov(R1[1], new u1(0)), new Mov(R1[0], new u1(0))];
        case 0x5076: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))), $0.not())];
        case 0x5077: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))), $0.not())];
        case 0x5876: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(R1[1], new u1(0)), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))), $0.neg())];
        case 0x5877: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(R1[1], new u1(0)), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))), $0.neg())];
        case 0x6076: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(R16[0], R8[0].mul(new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))))];
        case 0x6077: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = R32[0]), $0.mul(new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))))];
        case 0x6876: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(R16[0], R8[0].mul(new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))))];
        case 0x6877: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = R32[0]), $0.mul(new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))))];
        case 0x7076: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(R16[0], R8[0].div(new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))))];
        case 0x7077: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = R32[0]), $0.div(new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))))];
        case 0x7876: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(R16[0], R8[0].div(new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))))];
        case 0x7877: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = R32[0]), $0.div(new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))))];
        case 0x407e: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))), new u8($0).add(new u8(1)))];
        case 0x407f: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))), $0.add(new u8(1)))];
        case 0x487e: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))), $0.add(new i8(-1)))];
        case 0x487f: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))), $0.add(new i32(-1)))];
        case 0x507f: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = R32[4]), $0.add(new i32(-4))), new Mov(new Mem32($0), ($1 = R32[8]).add(new i8(_pfxLength + 3))), new Mov($1, new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2])))))];
        case 0x607f: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(R32[8], new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2])))))];
        case 0x707f: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = R32[4]), $0.add(new i32(-4))), new Mov(new Mem32($0), new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2])))))];
    }

    
    switch(((b[i] | ((b[i+1] << 8) & 0xffff)) & 0xffff) & 0xc0ff) {
        case 0x4000: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))), $0.add(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x4001: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))), $0.add(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x4002: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.add(new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))))];
        case 0x4003: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.add(new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))))];
        case 0x4008: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))), $0.or(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x4009: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))), $0.or(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x400a: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.or(new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))))];
        case 0x400b: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.or(new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))))];
        case 0x4010: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))), $0.add(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).add(R1[1]))];
        case 0x4011: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))), $0.add(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).add(R1[1]))];
        case 0x4012: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.add(new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))).add(R1[1]))];
        case 0x4013: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.add(new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))).add(R1[1]))];
        case 0x4018: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))), $0.add(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].neg()).add(new i8(R1[1]).neg()))];
        case 0x4019: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))), $0.add(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].neg()).add(new i32(R1[1]).neg()))];
        case 0x401a: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.add(new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2])))).neg()).add(new i8(R1[1]).neg()))];
        case 0x401b: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.add(new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2])))).neg()).add(new i32(R1[1]).neg()))];
        case 0x4020: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))), $0.and(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x4021: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))), $0.and(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x4022: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.and(new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))))];
        case 0x4023: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.and(new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))))];
        case 0x4028: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(R1[2], ($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))).eq(($1 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add($1.neg()))];
        case 0x4029: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(R1[2], ($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))).eq(($1 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add($1.neg()))];
        case 0x402a: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(R1[2], ($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).eq(($1 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add($1.neg()))];
        case 0x402b: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(R1[2], ($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).eq(($1 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add($1.neg()))];
        case 0x4030: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))), $0.xor(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x4031: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))), $0.xor(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x4032: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.xor(new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))))];
        case 0x4033: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.xor(new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))))];
        case 0x4038: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(R1[2], new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2])))).eq(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])), new Mov(R1[1], new u1(0))];
        case 0x4039: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(R1[2], new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2])))).eq(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])), new Mov(R1[1], new u1(0))];
        case 0x403a: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(R1[2], R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].eq(new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2])))))), new Mov(R1[1], new u1(0))];
        case 0x403b: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(R1[2], R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].eq(new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2])))))), new Mov(R1[1], new u1(0))];
        case 0x6b: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)]).mul(new i32(new i8(new u8(b[i+2])))))];
        case 0xc06b: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], R32[((((b[i+1] & 7) & 0xff)) & 0xff)].mul(new i32(new i8(new u8(b[i+2])))))];
        case 0x4084: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(R1[2], new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2])))).and(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).eq(new i8(0))), new Mov(R1[1], new u1(0)), new Mov(R1[0], new u1(0))];
        case 0x4085: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(R1[2], new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2])))).and(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).eq(new i32(0))), new Mov(R1[1], new u1(0)), new Mov(R1[0], new u1(0))];
        case 0x4086: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($2 = new Register8), ($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2])))))), new Mov($0, ($1 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])), new Mov($1, $2)];
        case 0x4087: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(($2 = new Register32), ($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2])))))), new Mov($0, ($1 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])), new Mov($1, $2)];
        case 0x4088: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2])))), R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])];
        case 0x4089: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2])))), R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])];
        case 0x408a: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2])))))];
        case 0x408b: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2])))))];
        case 0x408c: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2])))), R16[((((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff) + 16) & 0xff)])];
        case 0x408d: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2]))))];
        case 0x408e: return [((((_pfxLength) & 0xff) + 3) & 0xff), new Mov(R16[((((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff) + 16) & 0xff)], new Mem16(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].add(new i8(new u8(b[i+2])))))];
    }

    if((((b[i] | ((b[i+1] << 8) & 0xffff)) & 0xffff) & 0x90ff) == 0x800f)
    switch(((b[i+1] & 127) & 0xff) & 0x6f) {
        case 0x22: return [((((_pfxLength) & 0xff) + 2) & 0xff), new FnCall('CPUID', R32[0], R32[3], R32[1], R32[2])];
        case 0x48: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = R32[0]), new u32($0.shr(new u8(8))).and(new u32(65280)).or($0.shr(new u8(24))).or(new u32($0.shl(new u8(8))).and(new u32(0xff000))).or($0.shl(new u8(24))))];
        case 0x49: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = R32[1]), new u32($0.shr(new u8(8))).and(new u32(65280)).or($0.shr(new u8(24))).or(new u32($0.shl(new u8(8))).and(new u32(0xff000))).or($0.shl(new u8(24))))];
        case 0x4a: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = R32[2]), new u32($0.shr(new u8(8))).and(new u32(65280)).or($0.shr(new u8(24))).or(new u32($0.shl(new u8(8))).and(new u32(0xff000))).or($0.shl(new u8(24))))];
        case 0x4b: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = R32[3]), new u32($0.shr(new u8(8))).and(new u32(65280)).or($0.shr(new u8(24))).or(new u32($0.shl(new u8(8))).and(new u32(0xff000))).or($0.shl(new u8(24))))];
        case 0x4c: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = R32[4]), new u32($0.shr(new u8(8))).and(new u32(65280)).or($0.shr(new u8(24))).or(new u32($0.shl(new u8(8))).and(new u32(0xff000))).or($0.shl(new u8(24))))];
        case 0x4d: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = R32[5]), new u32($0.shr(new u8(8))).and(new u32(65280)).or($0.shr(new u8(24))).or(new u32($0.shl(new u8(8))).and(new u32(0xff000))).or($0.shl(new u8(24))))];
        case 0x4e: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = R32[6]), new u32($0.shr(new u8(8))).and(new u32(65280)).or($0.shr(new u8(24))).or(new u32($0.shl(new u8(8))).and(new u32(0xff000))).or($0.shl(new u8(24))))];
        case 0x4f: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = R32[7]), new u32($0.shr(new u8(8))).and(new u32(65280)).or($0.shr(new u8(24))).or(new u32($0.shl(new u8(8))).and(new u32(0xff000))).or($0.shl(new u8(24))))];
    }

    if((((((b[i] & 128) & 0xff) >> 7) & 0xff) & 0x1) == 0x1)
    switch(((b[i] | ((b[i+1] << 8) & 0xffff)) & 0xffff) & 0xf87f) {
        case 0xf: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)]), new Mem32(($0 = R32[4]))), new Mov($0, $0.add(new u8(4)))];
        case 0xc00f: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(R32[((((b[i+1] & 7) & 0xff)) & 0xff)], new Mem32(($0 = R32[4]))), new Mov($0, $0.add(new u8(4)))];
        case 0x50: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])), $0.shl(new u8(1)).or($0.shr(new u8(7))))];
        case 0xc050: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = R8[((((b[i+1] & 7) & 0xff)) & 0xff)]), $0.shl(new u8(1)).or($0.shr(new u8(7))))];
        case 0x51: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])), $0.shl(new u8(1)).or($0.shr(new u8(31))))];
        case 0xc051: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = R32[((((b[i+1] & 7) & 0xff)) & 0xff)]), $0.shl(new u8(1)).or($0.shr(new u8(31))))];
        case 0x52: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])), $0.shl(($1 = R8[1])).or($0.shr(new u8($1.neg()).add(new u8(8)))))];
        case 0xc052: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = R8[((((b[i+1] & 7) & 0xff)) & 0xff)]), $0.shl(($1 = R8[1])).or($0.shr(new u8($1.neg()).add(new u8(8)))))];
        case 0x53: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])), $0.shl(($1 = R8[1])).or($0.shr(new u8($1.neg()).add(new u8(32)))))];
        case 0xc053: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = R32[((((b[i+1] & 7) & 0xff)) & 0xff)]), $0.shl(($1 = R8[1])).or($0.shr(new u8($1.neg()).add(new u8(32)))))];
        case 0x850: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])), $0.shr(new u8(1)).or($0.shl(new u8(7))))];
        case 0xc850: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = R8[((((b[i+1] & 7) & 0xff)) & 0xff)]), $0.shr(new u8(1)).or($0.shl(new u8(7))))];
        case 0x851: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])), $0.shr(new u8(1)).or($0.shl(new u8(31))))];
        case 0xc851: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = R32[((((b[i+1] & 7) & 0xff)) & 0xff)]), $0.shr(new u8(1)).or($0.shl(new u8(31))))];
        case 0x852: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])), $0.shr(($1 = R8[1])).or($0.shl(new u8($1.neg()).add(new u8(8)))))];
        case 0xc852: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = R8[((((b[i+1] & 7) & 0xff)) & 0xff)]), $0.shr(($1 = R8[1])).or($0.shl(new u8($1.neg()).add(new u8(8)))))];
        case 0x853: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])), $0.shr(($1 = R8[1])).or($0.shl(new u8($1.neg()).add(new u8(32)))))];
        case 0xc853: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = R32[((((b[i+1] & 7) & 0xff)) & 0xff)]), $0.shr(($1 = R8[1])).or($0.shl(new u8($1.neg()).add(new u8(32)))))];
        case 0x1050: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])), $0.shl(new u8(1)).or($0.shr(new u8(7))))];
        case 0xd050: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = R8[((((b[i+1] & 7) & 0xff)) & 0xff)]), $0.shl(new u8(1)).or($0.shr(new u8(7))))];
        case 0x1051: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])), $0.shl(new u8(1)).or($0.shr(new u8(31))))];
        case 0xd051: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = R32[((((b[i+1] & 7) & 0xff)) & 0xff)]), $0.shl(new u8(1)).or($0.shr(new u8(31))))];
        case 0x1052: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])), $0.shl(($1 = R8[1])).or($0.shr(new u8($1.neg()).add(new u8(8)))))];
        case 0xd052: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = R8[((((b[i+1] & 7) & 0xff)) & 0xff)]), $0.shl(($1 = R8[1])).or($0.shr(new u8($1.neg()).add(new u8(8)))))];
        case 0x1053: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])), $0.shl(($1 = R8[1])).or($0.shr(new u8($1.neg()).add(new u8(32)))))];
        case 0xd053: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = R32[((((b[i+1] & 7) & 0xff)) & 0xff)]), $0.shl(($1 = R8[1])).or($0.shr(new u8($1.neg()).add(new u8(32)))))];
        case 0x1850: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])), $0.shr(new u8(1)).or($0.shl(new u8(7))))];
        case 0xd850: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = R8[((((b[i+1] & 7) & 0xff)) & 0xff)]), $0.shr(new u8(1)).or($0.shl(new u8(7))))];
        case 0x1851: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])), $0.shr(new u8(1)).or($0.shl(new u8(31))))];
        case 0xd851: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = R32[((((b[i+1] & 7) & 0xff)) & 0xff)]), $0.shr(new u8(1)).or($0.shl(new u8(31))))];
        case 0x1852: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])), $0.shr(($1 = R8[1])).or($0.shl(new u8($1.neg()).add(new u8(8)))))];
        case 0xd852: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = R8[((((b[i+1] & 7) & 0xff)) & 0xff)]), $0.shr(($1 = R8[1])).or($0.shl(new u8($1.neg()).add(new u8(8)))))];
        case 0x1853: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])), $0.shr(($1 = R8[1])).or($0.shl(new u8($1.neg()).add(new u8(32)))))];
        case 0xd853: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = R32[((((b[i+1] & 7) & 0xff)) & 0xff)]), $0.shr(($1 = R8[1])).or($0.shl(new u8($1.neg()).add(new u8(32)))))];
        case 0x2050: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])), $0.shl(new u8(1)))];
        case 0xe050: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = R8[((((b[i+1] & 7) & 0xff)) & 0xff)]), $0.shl(new u8(1)))];
        case 0x2051: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])), $0.shl(new u8(1)))];
        case 0xe051: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = R32[((((b[i+1] & 7) & 0xff)) & 0xff)]), $0.shl(new u8(1)))];
        case 0x2052: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])), $0.shl(R8[1]))];
        case 0xe052: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = R8[((((b[i+1] & 7) & 0xff)) & 0xff)]), $0.shl(R8[1]))];
        case 0x2053: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])), $0.shl(R8[1]))];
        case 0xe053: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = R32[((((b[i+1] & 7) & 0xff)) & 0xff)]), $0.shl(R8[1]))];
        case 0x2850: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])), new u8($0).shr(new u8(1)))];
        case 0xe850: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = R8[((((b[i+1] & 7) & 0xff)) & 0xff)]), new u8($0).shr(new u8(1)))];
        case 0x2851: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])), new u32($0).shr(new u8(1)))];
        case 0xe851: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = R32[((((b[i+1] & 7) & 0xff)) & 0xff)]), new u32($0).shr(new u8(1)))];
        case 0x2852: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])), new u8($0).shr(R8[1]))];
        case 0xe852: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = R8[((((b[i+1] & 7) & 0xff)) & 0xff)]), new u8($0).shr(R8[1]))];
        case 0x2853: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])), new u32($0).shr(R8[1]))];
        case 0xe853: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = R32[((((b[i+1] & 7) & 0xff)) & 0xff)]), new u32($0).shr(R8[1]))];
        case 0x3050: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])), $0.shl(new u8(1)))];
        case 0xf050: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = R8[((((b[i+1] & 7) & 0xff)) & 0xff)]), $0.shl(new u8(1)))];
        case 0x3051: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])), $0.shl(new u8(1)))];
        case 0xf051: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = R32[((((b[i+1] & 7) & 0xff)) & 0xff)]), $0.shl(new u8(1)))];
        case 0x3052: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])), $0.shl(R8[1]))];
        case 0xf052: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = R8[((((b[i+1] & 7) & 0xff)) & 0xff)]), $0.shl(R8[1]))];
        case 0x3053: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])), $0.shl(R8[1]))];
        case 0xf053: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = R32[((((b[i+1] & 7) & 0xff)) & 0xff)]), $0.shl(R8[1]))];
        case 0x3850: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])), new i8($0).shr(new u8(1)))];
        case 0xf850: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = R8[((((b[i+1] & 7) & 0xff)) & 0xff)]), new i8($0).shr(new u8(1)))];
        case 0x3851: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])), new i32($0).shr(new u8(1)))];
        case 0xf851: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = R32[((((b[i+1] & 7) & 0xff)) & 0xff)]), new i32($0).shr(new u8(1)))];
        case 0x3852: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])), new i8($0).shr(R8[1]))];
        case 0xf852: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = R8[((((b[i+1] & 7) & 0xff)) & 0xff)]), new i8($0).shr(R8[1]))];
        case 0x3853: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])), new i32($0).shr(R8[1]))];
        case 0xf853: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = R32[((((b[i+1] & 7) & 0xff)) & 0xff)]), new i32($0).shr(R8[1]))];
        case 0x1076: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])), $0.not())];
        case 0xd076: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = R8[((((b[i+1] & 7) & 0xff)) & 0xff)]), $0.not())];
        case 0x1077: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])), $0.not())];
        case 0xd077: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = R32[((((b[i+1] & 7) & 0xff)) & 0xff)]), $0.not())];
        case 0x1876: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(R1[1], new u1(0)), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])), $0.neg())];
        case 0xd876: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(R1[1], new u1(0)), new Mov(($0 = R8[((((b[i+1] & 7) & 0xff)) & 0xff)]), $0.neg())];
        case 0x1877: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(R1[1], new u1(0)), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])), $0.neg())];
        case 0xd877: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(R1[1], new u1(0)), new Mov(($0 = R32[((((b[i+1] & 7) & 0xff)) & 0xff)]), $0.neg())];
        case 0x2076: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(R16[0], R8[0].mul(new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])))];
        case 0xe076: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(R16[0], R8[0].mul(R8[((((b[i+1] & 7) & 0xff)) & 0xff)]))];
        case 0x2077: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = R32[0]), $0.mul(new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])))];
        case 0xe077: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = R32[0]), $0.mul(R32[((((b[i+1] & 7) & 0xff)) & 0xff)]))];
        case 0x2876: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(R16[0], R8[0].mul(new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])))];
        case 0xe876: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(R16[0], R8[0].mul(R8[((((b[i+1] & 7) & 0xff)) & 0xff)]))];
        case 0x2877: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = R32[0]), $0.mul(new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])))];
        case 0xe877: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = R32[0]), $0.mul(R32[((((b[i+1] & 7) & 0xff)) & 0xff)]))];
        case 0x3076: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(R16[0], R8[0].div(new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])))];
        case 0xf076: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(R16[0], R8[0].div(R8[((((b[i+1] & 7) & 0xff)) & 0xff)]))];
        case 0x3077: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = R32[0]), $0.div(new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])))];
        case 0xf077: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = R32[0]), $0.div(R32[((((b[i+1] & 7) & 0xff)) & 0xff)]))];
        case 0x3876: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(R16[0], R8[0].div(new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])))];
        case 0xf876: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(R16[0], R8[0].div(R8[((((b[i+1] & 7) & 0xff)) & 0xff)]))];
        case 0x3877: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = R32[0]), $0.div(new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])))];
        case 0xf877: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = R32[0]), $0.div(R32[((((b[i+1] & 7) & 0xff)) & 0xff)]))];
        case 0x7e: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])), new u8($0).add(new u8(1)))];
        case 0xc07e: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = R8[((((b[i+1] & 7) & 0xff)) & 0xff)]), new u8($0).add(new u8(1)))];
        case 0x7f: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])), $0.add(new u8(1)))];
        case 0xc07f: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = R32[((((b[i+1] & 7) & 0xff)) & 0xff)]), $0.add(new u8(1)))];
        case 0x87e: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])), $0.add(new i8(-1)))];
        case 0xc87e: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = R8[((((b[i+1] & 7) & 0xff)) & 0xff)]), $0.add(new i8(-1)))];
        case 0x87f: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])), $0.add(new i32(-1)))];
        case 0xc87f: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = R32[((((b[i+1] & 7) & 0xff)) & 0xff)]), $0.add(new i32(-1)))];
        case 0x107f: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = R32[4]), $0.add(new i32(-4))), new Mov(new Mem32($0), ($1 = R32[8]).add(new i8(_pfxLength + 2))), new Mov($1, new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)]))];
        case 0xd07f: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = R32[4]), $0.add(new i32(-4))), new Mov(new Mem32($0), ($1 = R32[8]).add(new i8(_pfxLength + 2))), new Mov($1, R32[((((b[i+1] & 7) & 0xff)) & 0xff)])];
        case 0x207f: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(R32[8], new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)]))];
        case 0xe07f: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(R32[8], R32[((((b[i+1] & 7) & 0xff)) & 0xff)])];
        case 0x307f: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = R32[4]), $0.add(new i32(-4))), new Mov(new Mem32($0), new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)]))];
        case 0xf07f: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = R32[4]), $0.add(new i32(-4))), new Mov(new Mem32($0), R32[((((b[i+1] & 7) & 0xff)) & 0xff)])];
    }

    if((((((b[i] & 64) & 0xff) >> 6) & 0xff) & 0x1) == 0x0)
    switch(((b[i] | ((b[i+1] << 8) & 0xffff)) & 0xffff) & 0xc0bf) {
        case 0x0: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])), $0.add(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0xc000: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = R8[((((b[i+1] & 7) & 0xff)) & 0xff)]), $0.add(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x1: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])), $0.add(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0xc001: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = R32[((((b[i+1] & 7) & 0xff)) & 0xff)]), $0.add(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x2: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.add(new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])))];
        case 0xc002: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.add(R8[((((b[i+1] & 7) & 0xff)) & 0xff)]))];
        case 0x3: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.add(new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])))];
        case 0xc003: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.add(R32[((((b[i+1] & 7) & 0xff)) & 0xff)]))];
        case 0x8: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])), $0.or(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0xc008: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = R8[((((b[i+1] & 7) & 0xff)) & 0xff)]), $0.or(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x9: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])), $0.or(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0xc009: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = R32[((((b[i+1] & 7) & 0xff)) & 0xff)]), $0.or(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0xa: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.or(new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])))];
        case 0xc00a: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.or(R8[((((b[i+1] & 7) & 0xff)) & 0xff)]))];
        case 0xb: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.or(new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])))];
        case 0xc00b: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.or(R32[((((b[i+1] & 7) & 0xff)) & 0xff)]))];
        case 0x10: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])), $0.add(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).add(R1[1]))];
        case 0xc010: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = R8[((((b[i+1] & 7) & 0xff)) & 0xff)]), $0.add(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).add(R1[1]))];
        case 0x11: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])), $0.add(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).add(R1[1]))];
        case 0xc011: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = R32[((((b[i+1] & 7) & 0xff)) & 0xff)]), $0.add(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).add(R1[1]))];
        case 0x12: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.add(new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])).add(R1[1]))];
        case 0xc012: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.add(R8[((((b[i+1] & 7) & 0xff)) & 0xff)]).add(R1[1]))];
        case 0x13: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.add(new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])).add(R1[1]))];
        case 0xc013: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.add(R32[((((b[i+1] & 7) & 0xff)) & 0xff)]).add(R1[1]))];
        case 0x18: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])), $0.add(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].neg()).add(new i8(R1[1]).neg()))];
        case 0xc018: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = R8[((((b[i+1] & 7) & 0xff)) & 0xff)]), $0.add(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].neg()).add(new i8(R1[1]).neg()))];
        case 0x19: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])), $0.add(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].neg()).add(new i32(R1[1]).neg()))];
        case 0xc019: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = R32[((((b[i+1] & 7) & 0xff)) & 0xff)]), $0.add(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].neg()).add(new i32(R1[1]).neg()))];
        case 0x1a: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.add(new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)]).neg()).add(new i8(R1[1]).neg()))];
        case 0xc01a: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.add(R8[((((b[i+1] & 7) & 0xff)) & 0xff)].neg()).add(new i8(R1[1]).neg()))];
        case 0x1b: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.add(new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)]).neg()).add(new i32(R1[1]).neg()))];
        case 0xc01b: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.add(R32[((((b[i+1] & 7) & 0xff)) & 0xff)].neg()).add(new i32(R1[1]).neg()))];
        case 0x20: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])), $0.and(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0xc020: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = R8[((((b[i+1] & 7) & 0xff)) & 0xff)]), $0.and(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x21: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])), $0.and(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0xc021: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = R32[((((b[i+1] & 7) & 0xff)) & 0xff)]), $0.and(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x22: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.and(new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])))];
        case 0xc022: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.and(R8[((((b[i+1] & 7) & 0xff)) & 0xff)]))];
        case 0x23: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.and(new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])))];
        case 0xc023: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.and(R32[((((b[i+1] & 7) & 0xff)) & 0xff)]))];
        case 0x28: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(R1[2], ($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])).eq(($1 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add($1.neg()))];
        case 0xc028: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(R1[2], ($0 = R8[((((b[i+1] & 7) & 0xff)) & 0xff)]).eq(($1 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add($1.neg()))];
        case 0x29: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(R1[2], ($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])).eq(($1 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add($1.neg()))];
        case 0xc029: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(R1[2], ($0 = R32[((((b[i+1] & 7) & 0xff)) & 0xff)]).eq(($1 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add($1.neg()))];
        case 0x2a: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(R1[2], ($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).eq(($1 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add($1.neg()))];
        case 0xc02a: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(R1[2], ($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).eq(($1 = R8[((((b[i+1] & 7) & 0xff)) & 0xff)]))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add($1.neg()))];
        case 0x2b: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(R1[2], ($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).eq(($1 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add($1.neg()))];
        case 0xc02b: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(R1[2], ($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).eq(($1 = R32[((((b[i+1] & 7) & 0xff)) & 0xff)]))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add($1.neg()))];
        case 0x30: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])), $0.xor(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0xc030: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = R8[((((b[i+1] & 7) & 0xff)) & 0xff)]), $0.xor(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x31: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])), $0.xor(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0xc031: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = R32[((((b[i+1] & 7) & 0xff)) & 0xff)]), $0.xor(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]))];
        case 0x32: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.xor(new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])))];
        case 0xc032: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.xor(R8[((((b[i+1] & 7) & 0xff)) & 0xff)]))];
        case 0x33: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.xor(new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])))];
        case 0xc033: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]), $0.xor(R32[((((b[i+1] & 7) & 0xff)) & 0xff)]))];
        case 0x38: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(R1[2], new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)]).eq(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])), new Mov(R1[1], new u1(0))];
        case 0xc038: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(R1[2], R8[((((b[i+1] & 7) & 0xff)) & 0xff)].eq(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])), new Mov(R1[1], new u1(0))];
        case 0x39: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(R1[2], new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)]).eq(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])), new Mov(R1[1], new u1(0))];
        case 0xc039: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(R1[2], R32[((((b[i+1] & 7) & 0xff)) & 0xff)].eq(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])), new Mov(R1[1], new u1(0))];
        case 0x3a: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(R1[2], R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].eq(new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)]))), new Mov(R1[1], new u1(0))];
        case 0xc03a: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(R1[2], R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].eq(R8[((((b[i+1] & 7) & 0xff)) & 0xff)])), new Mov(R1[1], new u1(0))];
        case 0x3b: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(R1[2], R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].eq(new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)]))), new Mov(R1[1], new u1(0))];
        case 0xc03b: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(R1[2], R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)].eq(R32[((((b[i+1] & 7) & 0xff)) & 0xff)])), new Mov(R1[1], new u1(0))];
        case 0x84: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(R1[2], new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)]).and(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).eq(new i8(0))), new Mov(R1[1], new u1(0)), new Mov(R1[0], new u1(0))];
        case 0xc084: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(R1[2], R8[((((b[i+1] & 7) & 0xff)) & 0xff)].and(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).eq(new i8(0))), new Mov(R1[1], new u1(0)), new Mov(R1[0], new u1(0))];
        case 0x85: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(R1[2], new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)]).and(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).eq(new i32(0))), new Mov(R1[1], new u1(0)), new Mov(R1[0], new u1(0))];
        case 0xc085: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(R1[2], R32[((((b[i+1] & 7) & 0xff)) & 0xff)].and(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)]).eq(new i32(0))), new Mov(R1[1], new u1(0)), new Mov(R1[0], new u1(0))];
        case 0x86: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($2 = new Register8), ($0 = new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)]))), new Mov($0, ($1 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])), new Mov($1, $2)];
        case 0xc086: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($2 = new Register8), ($0 = R8[((((b[i+1] & 7) & 0xff)) & 0xff)])), new Mov($0, ($1 = R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])), new Mov($1, $2)];
        case 0x87: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($2 = new Register32), ($0 = new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)]))), new Mov($0, ($1 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])), new Mov($1, $2)];
        case 0xc087: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($2 = new Register32), ($0 = R32[((((b[i+1] & 7) & 0xff)) & 0xff)])), new Mov($0, ($1 = R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])), new Mov($1, $2)];
        case 0x88: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)]), R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])];
        case 0xc088: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(R8[((((b[i+1] & 7) & 0xff)) & 0xff)], R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])];
        case 0x89: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)]), R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])];
        case 0xc089: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(R32[((((b[i+1] & 7) & 0xff)) & 0xff)], R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)])];
        case 0x8a: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new Mem8(R32[((((b[i+1] & 7) & 0xff)) & 0xff)]))];
        case 0xc08a: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(R8[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], R8[((((b[i+1] & 7) & 0xff)) & 0xff)])];
        case 0x8b: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)]))];
        case 0xc08b: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], R32[((((b[i+1] & 7) & 0xff)) & 0xff)])];
        case 0x8c: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(new Mem32(R32[((((b[i+1] & 7) & 0xff)) & 0xff)]), R16[((((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff) + 16) & 0xff)])];
        case 0xc08c: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(R32[((((b[i+1] & 7) & 0xff)) & 0xff)], R16[((((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff) + 16) & 0xff)])];
        case 0x8d: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(R32[((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff)], R32[((((b[i+1] & 7) & 0xff)) & 0xff)])];
        case 0x8e: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(R16[((((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff) + 16) & 0xff)], new Mem16(R32[((((b[i+1] & 7) & 0xff)) & 0xff)]))];
        case 0xc08e: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(R16[((((((((b[i+1] & 56) & 0xff) >> 3) & 0xff)) & 0xff) + 16) & 0xff)], R16[((((b[i+1] & 7) & 0xff)) & 0xff)])];
    }

    
    switch(b[i] & 0xff) {
        case 0x4: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = R8[0]), $0.add(new i8(new u8(b[i+1]))))];
        case 0xc: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = R8[0]), $0.or(new i8(new u8(b[i+1]))))];
        case 0x14: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = R8[0]), $0.add(new i8(new u8(b[i+1]))).add(R1[1]))];
        case 0x1c: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = R8[0]), $0.add(new i8(-((b[i+1]) << 24 >> 24))).add(new i8(R1[1]).neg()))];
        case 0x24: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = R8[0]), $0.and(new i8(new u8(b[i+1]))))];
        case 0x2c: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(R1[2], ($0 = R8[0]).eq(new i8(new u8(b[i+1])))), new Mov(R1[1], new u1(0)), new Mov($0, $0.add(new i8(-((b[i+1]) << 24 >> 24))))];
        case 0x34: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = R8[0]), $0.xor(new i8(new u8(b[i+1]))))];
        case 0x3c: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(R1[2], R8[0].eq(new i8(new u8(b[i+1])))), new Mov(R1[1], new u1(0))];
        case 0x6a: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = R32[4]), $0.add(new i32(-4))), new Mov(new Mem32($0), new i32(new i8(new u8(b[i+1]))))];
        case 0x70: return [((((_pfxLength) & 0xff) + 2) & 0xff), new If(R1[0], new Mov(($0 = R32[8]), $0.add(new i8(((b[i+1]) << 24 >> 24) + ((_pfxLength + 2) << 24 >> 24)))))];
        case 0x71: return [((((_pfxLength) & 0xff) + 2) & 0xff), new If(R1[0].not(), new Mov(($0 = R32[8]), $0.add(new i8(((b[i+1]) << 24 >> 24) + ((_pfxLength + 2) << 24 >> 24)))))];
        case 0x72: return [((((_pfxLength) & 0xff) + 2) & 0xff), new If(R1[1], new Mov(($0 = R32[8]), $0.add(new i8(((b[i+1]) << 24 >> 24) + ((_pfxLength + 2) << 24 >> 24)))))];
        case 0x73: return [((((_pfxLength) & 0xff) + 2) & 0xff), new If(R1[1].not(), new Mov(($0 = R32[8]), $0.add(new i8(((b[i+1]) << 24 >> 24) + ((_pfxLength + 2) << 24 >> 24)))))];
        case 0x74: return [((((_pfxLength) & 0xff) + 2) & 0xff), new If(R1[2], new Mov(($0 = R32[8]), $0.add(new i8(((b[i+1]) << 24 >> 24) + ((_pfxLength + 2) << 24 >> 24)))))];
        case 0x75: return [((((_pfxLength) & 0xff) + 2) & 0xff), new If(R1[2].not(), new Mov(($0 = R32[8]), $0.add(new i8(((b[i+1]) << 24 >> 24) + ((_pfxLength + 2) << 24 >> 24)))))];
        case 0x76: return [((((_pfxLength) & 0xff) + 2) & 0xff), new If(R1[1].or(R1[2]), new Mov(($0 = R32[8]), $0.add(new i8(((b[i+1]) << 24 >> 24) + ((_pfxLength + 2) << 24 >> 24)))))];
        case 0x77: return [((((_pfxLength) & 0xff) + 2) & 0xff), new If(R1[1].not().and(R1[2].not()), new Mov(($0 = R32[8]), $0.add(new i8(((b[i+1]) << 24 >> 24) + ((_pfxLength + 2) << 24 >> 24)))))];
        case 0x78: return [((((_pfxLength) & 0xff) + 2) & 0xff), new If(R1[3], new Mov(($0 = R32[8]), $0.add(new i8(((b[i+1]) << 24 >> 24) + ((_pfxLength + 2) << 24 >> 24)))))];
        case 0x79: return [((((_pfxLength) & 0xff) + 2) & 0xff), new If(R1[3].not(), new Mov(($0 = R32[8]), $0.add(new i8(((b[i+1]) << 24 >> 24) + ((_pfxLength + 2) << 24 >> 24)))))];
        case 0x7a: return [((((_pfxLength) & 0xff) + 2) & 0xff), new If(R1[4], new Mov(($0 = R32[8]), $0.add(new i8(((b[i+1]) << 24 >> 24) + ((_pfxLength + 2) << 24 >> 24)))))];
        case 0x7b: return [((((_pfxLength) & 0xff) + 2) & 0xff), new If(R1[4].not(), new Mov(($0 = R32[8]), $0.add(new i8(((b[i+1]) << 24 >> 24) + ((_pfxLength + 2) << 24 >> 24)))))];
        case 0x7c: return [((((_pfxLength) & 0xff) + 2) & 0xff), new If(R1[0].eq(R1[3]).not(), new Mov(($0 = R32[8]), $0.add(new i8(((b[i+1]) << 24 >> 24) + ((_pfxLength + 2) << 24 >> 24)))))];
        case 0x7d: return [((((_pfxLength) & 0xff) + 2) & 0xff), new If(R1[0].eq(R1[3]), new Mov(($0 = R32[8]), $0.add(new i8(((b[i+1]) << 24 >> 24) + ((_pfxLength + 2) << 24 >> 24)))))];
        case 0x7e: return [((((_pfxLength) & 0xff) + 2) & 0xff), new If(R1[0].eq(R1[3]).not().or(R1[2]), new Mov(($0 = R32[8]), $0.add(new i8(((b[i+1]) << 24 >> 24) + ((_pfxLength + 2) << 24 >> 24)))))];
        case 0x7f: return [((((_pfxLength) & 0xff) + 2) & 0xff), new If(R1[0].eq(R1[3]).and(R1[2].not()), new Mov(($0 = R32[8]), $0.add(new i8(((b[i+1]) << 24 >> 24) + ((_pfxLength + 2) << 24 >> 24)))))];
        case 0xa8: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(R1[2], R8[0].and(new i8(new u8(b[i+1]))).eq(new i8(0))), new Mov(R1[1], new u1(0)), new Mov(R1[0], new u1(0))];
        case 0xb0: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(R8[0], new i8(new u8(b[i+1])))];
        case 0xb1: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(R8[1], new i8(new u8(b[i+1])))];
        case 0xb2: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(R8[2], new i8(new u8(b[i+1])))];
        case 0xb3: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(R8[3], new i8(new u8(b[i+1])))];
        case 0xb4: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(R8[4], new i8(new u8(b[i+1])))];
        case 0xb5: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(R8[5], new i8(new u8(b[i+1])))];
        case 0xb6: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(R8[6], new i8(new u8(b[i+1])))];
        case 0xb7: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(R8[7], new i8(new u8(b[i+1])))];
        case 0xe0: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = R32[1]), $0.add(new i32(-1))), new If($0.eq(new i32(0)).not().and(R1[2].not()), new Mov(($1 = R32[8]), $1.add(new i8(((b[i+1]) << 24 >> 24) + ((_pfxLength + 2) << 24 >> 24)))))];
        case 0xe1: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = R32[1]), $0.add(new i32(-1))), new If($0.eq(new i32(0)).not().and(R1[2]), new Mov(($1 = R32[8]), $1.add(new i8(((b[i+1]) << 24 >> 24) + ((_pfxLength + 2) << 24 >> 24)))))];
        case 0xe2: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = R32[1]), $0.add(new i32(-1))), new If($0.eq(new i32(0)).not(), new Mov(($1 = R32[8]), $1.add(new i8(((b[i+1]) << 24 >> 24) + ((_pfxLength + 2) << 24 >> 24)))))];
        case 0xeb: return [((((_pfxLength) & 0xff) + 2) & 0xff), new Mov(($0 = R32[8]), $0.add(new i8(((b[i+1]) << 24 >> 24) + ((_pfxLength + 2) << 24 >> 24))))];
    }

    
    switch(b[i] & 0xff) {
        case 0x90: return [((((_pfxLength) & 0xff) + 1) & 0xff), new FnCall('Nop')];
        case 0x91: return [((((_pfxLength) & 0xff) + 1) & 0xff), new Mov(($2 = new Register32), ($0 = R32[0])), new Mov($0, ($1 = R32[1])), new Mov($1, $2)];
        case 0x92: return [((((_pfxLength) & 0xff) + 1) & 0xff), new Mov(($2 = new Register32), ($0 = R32[0])), new Mov($0, ($1 = R32[2])), new Mov($1, $2)];
        case 0x93: return [((((_pfxLength) & 0xff) + 1) & 0xff), new Mov(($2 = new Register32), ($0 = R32[0])), new Mov($0, ($1 = R32[3])), new Mov($1, $2)];
        case 0x94: return [((((_pfxLength) & 0xff) + 1) & 0xff), new Mov(($2 = new Register32), ($0 = R32[0])), new Mov($0, ($1 = R32[4])), new Mov($1, $2)];
        case 0x95: return [((((_pfxLength) & 0xff) + 1) & 0xff), new Mov(($2 = new Register32), ($0 = R32[0])), new Mov($0, ($1 = R32[5])), new Mov($1, $2)];
        case 0x96: return [((((_pfxLength) & 0xff) + 1) & 0xff), new Mov(($2 = new Register32), ($0 = R32[0])), new Mov($0, ($1 = R32[6])), new Mov($1, $2)];
        case 0x97: return [((((_pfxLength) & 0xff) + 1) & 0xff), new Mov(($2 = new Register32), ($0 = R32[0])), new Mov($0, ($1 = R32[7])), new Mov($1, $2)];
        case 0x98: return [((((_pfxLength) & 0xff) + 1) & 0xff), new Mov(R32[0], new i32(R16[0]))];
        case 0x99: return [((((_pfxLength) & 0xff) + 1) & 0xff), new Mov(R32[2], new i32(R32[0].lt(new u8(0))).neg())];
        case 0x9c: return [((((_pfxLength) & 0xff) + 1) & 0xff), new Mov(($0 = R32[4]), $0.add(new i32(-4))), new Mov(new Mem32($0), R32[32])];
        case 0x9d: return [((((_pfxLength) & 0xff) + 1) & 0xff), new Mov(R32[32], new Mem32(($0 = R32[4]))), new Mov($0, $0.add(new u8(4)))];
        case 0xa4: return [((((_pfxLength) & 0xff) + 1) & 0xff), new Mov(new Mem8(R32[6]), new Mem8(R32[7]))];
        case 0xa5: return [((((_pfxLength) & 0xff) + 1) & 0xff), new Mov(new Mem32(R32[6]), new Mem32(R32[7]))];
        case 0xaa: return [((((_pfxLength) & 0xff) + 1) & 0xff), new Mov(new Mem8(R32[7]), R8[0])];
        case 0xab: return [((((_pfxLength) & 0xff) + 1) & 0xff), new Mov(new Mem32(R32[7]), R32[0])];
        case 0xac: return [((((_pfxLength) & 0xff) + 1) & 0xff), new Mov(R8[0], new Mem8(R32[6]))];
        case 0xad: return [((((_pfxLength) & 0xff) + 1) & 0xff), new Mov(R32[0], new Mem32(R32[6]))];
        case 0xae: return [((((_pfxLength) & 0xff) + 1) & 0xff), new Mov(R1[2], R8[0].eq(new Mem8(R32[7]))), new Mov(R1[1], new u1(0))];
        case 0xaf: return [((((_pfxLength) & 0xff) + 1) & 0xff), new Mov(R1[2], R32[0].eq(new Mem32(R32[6]))), new Mov(R1[1], new u1(0))];
        case 0xc3: return [((((_pfxLength) & 0xff) + 1) & 0xff), new Mov(R32[8], new Mem32(($0 = R32[4]))), new Mov($0, $0.add(new u8(4)))];
        case 0xc9: return [((((_pfxLength) & 0xff) + 1) & 0xff), new Mov(($1 = R32[4]), ($0 = R32[5])), new Mov($0, new Mem32($1)), new Mov($1, $1.add(new u8(4)))];
        case 0xcc: return [((((_pfxLength) & 0xff) + 1) & 0xff), new FnCall('Interrupt', new u8(3))];
        case 0xf8: return [((((_pfxLength) & 0xff) + 1) & 0xff), new Mov(R1[1], new u1(0))];
        case 0xf9: return [((((_pfxLength) & 0xff) + 1) & 0xff), new Mov(R1[1], new u1(1))];
        case 0xfa: return [((((_pfxLength) & 0xff) + 1) & 0xff), new Mov(R1[7], new u1(0))];
        case 0xfb: return [((((_pfxLength) & 0xff) + 1) & 0xff), new Mov(R1[7], new u1(1))];
        case 0xfc: return [((((_pfxLength) & 0xff) + 1) & 0xff), new Mov(R1[6], new u1(0))];
        case 0xfd: return [((((_pfxLength) & 0xff) + 1) & 0xff), new Mov(R1[6], new u1(1))];
        case 0x6: return [((((_pfxLength) & 0xff) + 1) & 0xff), new Mov(($0 = R32[4]), $0.add(new i32(-2))), new Mov(new Mem16($0), R16[16])];
        case 0x7: return [((((_pfxLength) & 0xff) + 1) & 0xff), new Mov(R16[16], new Mem16(($0 = R32[4]))), new Mov($0, $0.add(new u8(2)))];
        case 0xe: return [((((_pfxLength) & 0xff) + 1) & 0xff), new Mov(($0 = R32[4]), $0.add(new i32(-2))), new Mov(new Mem16($0), R16[17])];
        case 0x16: return [((((_pfxLength) & 0xff) + 1) & 0xff), new Mov(($0 = R32[4]), $0.add(new i32(-2))), new Mov(new Mem16($0), R16[21])];
        case 0x17: return [((((_pfxLength) & 0xff) + 1) & 0xff), new Mov(R16[21], new Mem16(($0 = R32[4]))), new Mov($0, $0.add(new u8(2)))];
        case 0x1e: return [((((_pfxLength) & 0xff) + 1) & 0xff), new Mov(($0 = R32[4]), $0.add(new i32(-2))), new Mov(new Mem16($0), R16[19])];
        case 0x1f: return [((((_pfxLength) & 0xff) + 1) & 0xff), new Mov(R16[19], new Mem16(($0 = R32[4]))), new Mov($0, $0.add(new u8(2)))];
        case 0x40: return [((((_pfxLength) & 0xff) + 1) & 0xff), new Mov(($0 = R32[0]), $0.add(new u8(1)))];
        case 0x41: return [((((_pfxLength) & 0xff) + 1) & 0xff), new Mov(($0 = R32[1]), $0.add(new u8(1)))];
        case 0x42: return [((((_pfxLength) & 0xff) + 1) & 0xff), new Mov(($0 = R32[2]), $0.add(new u8(1)))];
        case 0x43: return [((((_pfxLength) & 0xff) + 1) & 0xff), new Mov(($0 = R32[3]), $0.add(new u8(1)))];
        case 0x44: return [((((_pfxLength) & 0xff) + 1) & 0xff), new Mov(($0 = R32[4]), $0.add(new u8(1)))];
        case 0x45: return [((((_pfxLength) & 0xff) + 1) & 0xff), new Mov(($0 = R32[5]), $0.add(new u8(1)))];
        case 0x46: return [((((_pfxLength) & 0xff) + 1) & 0xff), new Mov(($0 = R32[6]), $0.add(new u8(1)))];
        case 0x47: return [((((_pfxLength) & 0xff) + 1) & 0xff), new Mov(($0 = R32[7]), $0.add(new u8(1)))];
        case 0x48: return [((((_pfxLength) & 0xff) + 1) & 0xff), new Mov(($0 = R32[0]), $0.add(new i32(-1)))];
        case 0x49: return [((((_pfxLength) & 0xff) + 1) & 0xff), new Mov(($0 = R32[1]), $0.add(new i32(-1)))];
        case 0x4a: return [((((_pfxLength) & 0xff) + 1) & 0xff), new Mov(($0 = R32[2]), $0.add(new i32(-1)))];
        case 0x4b: return [((((_pfxLength) & 0xff) + 1) & 0xff), new Mov(($0 = R32[3]), $0.add(new i32(-1)))];
        case 0x4c: return [((((_pfxLength) & 0xff) + 1) & 0xff), new Mov(($0 = R32[4]), $0.add(new i32(-1)))];
        case 0x4d: return [((((_pfxLength) & 0xff) + 1) & 0xff), new Mov(($0 = R32[5]), $0.add(new i32(-1)))];
        case 0x4e: return [((((_pfxLength) & 0xff) + 1) & 0xff), new Mov(($0 = R32[6]), $0.add(new i32(-1)))];
        case 0x4f: return [((((_pfxLength) & 0xff) + 1) & 0xff), new Mov(($0 = R32[7]), $0.add(new i32(-1)))];
        case 0x50: return [((((_pfxLength) & 0xff) + 1) & 0xff), new Mov(($0 = R32[4]), $0.add(new i32(-4))), new Mov(new Mem32($0), R32[0])];
        case 0x51: return [((((_pfxLength) & 0xff) + 1) & 0xff), new Mov(($0 = R32[4]), $0.add(new i32(-4))), new Mov(new Mem32($0), R32[1])];
        case 0x52: return [((((_pfxLength) & 0xff) + 1) & 0xff), new Mov(($0 = R32[4]), $0.add(new i32(-4))), new Mov(new Mem32($0), R32[2])];
        case 0x53: return [((((_pfxLength) & 0xff) + 1) & 0xff), new Mov(($0 = R32[4]), $0.add(new i32(-4))), new Mov(new Mem32($0), R32[3])];
        case 0x54: return [((((_pfxLength) & 0xff) + 1) & 0xff), new Mov(($0 = R32[4]), $0.add(new i32(-4))), new Mov(new Mem32($0), $0)];
        case 0x55: return [((((_pfxLength) & 0xff) + 1) & 0xff), new Mov(($0 = R32[4]), $0.add(new i32(-4))), new Mov(new Mem32($0), R32[5])];
        case 0x56: return [((((_pfxLength) & 0xff) + 1) & 0xff), new Mov(($0 = R32[4]), $0.add(new i32(-4))), new Mov(new Mem32($0), R32[6])];
        case 0x57: return [((((_pfxLength) & 0xff) + 1) & 0xff), new Mov(($0 = R32[4]), $0.add(new i32(-4))), new Mov(new Mem32($0), R32[7])];
        case 0x58: return [((((_pfxLength) & 0xff) + 1) & 0xff), new Mov(R32[0], new Mem32(($0 = R32[4]))), new Mov($0, $0.add(new u8(4)))];
        case 0x59: return [((((_pfxLength) & 0xff) + 1) & 0xff), new Mov(R32[1], new Mem32(($0 = R32[4]))), new Mov($0, $0.add(new u8(4)))];
        case 0x5a: return [((((_pfxLength) & 0xff) + 1) & 0xff), new Mov(R32[2], new Mem32(($0 = R32[4]))), new Mov($0, $0.add(new u8(4)))];
        case 0x5b: return [((((_pfxLength) & 0xff) + 1) & 0xff), new Mov(R32[3], new Mem32(($0 = R32[4]))), new Mov($0, $0.add(new u8(4)))];
        case 0x5c: return [((((_pfxLength) & 0xff) + 1) & 0xff), new Mov(($0 = R32[4]), new Mem32($0)), new Mov($0, $0.add(new u8(4)))];
        case 0x5d: return [((((_pfxLength) & 0xff) + 1) & 0xff), new Mov(R32[5], new Mem32(($0 = R32[4]))), new Mov($0, $0.add(new u8(4)))];
        case 0x5e: return [((((_pfxLength) & 0xff) + 1) & 0xff), new Mov(R32[6], new Mem32(($0 = R32[4]))), new Mov($0, $0.add(new u8(4)))];
        case 0x5f: return [((((_pfxLength) & 0xff) + 1) & 0xff), new Mov(R32[7], new Mem32(($0 = R32[4]))), new Mov($0, $0.add(new u8(4)))];
    }

}
exports.PC = R.EIP;
exports.SP = R.ESP;
exports.FP = R.EBP;
