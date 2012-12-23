var fs = require('fs'), util = require('util');

function inspect(x, p) {
    if(known(x) && x > 100)
        return '0x'+x.toString(16);
    if(typeof x === 'object' && x.inspect)
        return x.inspect(0, p || 16);
    return util.inspect(x);
}

function known(x) {
    return typeof x === 'number';
}
function runtimeKnown(x) {
    return known(x) || x.runtimeKnown;
}
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

var codeGen = exports.codeGen = function codeGen(x) {
    if(known(x))
        return x.toString();
    if(!x || !x.codeGen)
        throw new TypeError('Invalid codeGen source '+inspect(x));
    return x.codeGen();
};

codeGen.runtime = [
    `var util = require('util');`,
    
    `var known = exports.known = function known(x) {
        return typeof x === 'number';
    }`,
    
    /*`var bitsof = exports.bitsof = function bitsof(x) {
        if(typeof x === 'object' && 'bitsof' in x)
            return x.bitsof;
        throw new TypeError('Missing bit size for '+inspect(x));
    }`,

    `var sizeof = exports.sizeof = function sizeof(x) {
        return Math.ceil(bitsof(x)/8);
    }`,*/
    
    `var inspect = exports.inspect = function inspect(x, p) {
        if(known(x) && x > 100)
            return '0x'+x.toString(16);
        if(typeof x === 'object' && x.inspect)
            return x.inspect(0, p || 16);
        return util.inspect(x);
    }`
];

var exportedFn = {inspect, known, runtimeKnown, bitsof, sizeof};

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
    
    
    '=':13,
    ',':14
};

/*RRX,SignBit,*/'Interrupt,If,Nop'.split(',').forEach(function(fn) {
    exportedFn[fn] = (...args)=>({
        inspect: ()=>fn+'('+args.map((x)=>inspect(x)).join(', ')+')',
        codeGen: ()=>fn+'('+args.map((x)=>codeGen(x)).join(', ')+')',
        runtimeKnown: false
    });
codeGen.runtime.push(`function ${fn}() {
    var args = [].slice.call(arguments);
    return {
        fn: '${fn}', args: args,
        inspect: function() {
            return '${fn}('+args.map(function(x) {return inspect(typeof x === 'object' && 'value' in x ? x.value : x);}).join(', ')+')';
        }
    };
}`);
});

exportedFn.Ext = function(a, bits=32, bitsa=bitsof(a, true)) {
    if(bitsa <= bits) {
        a = Object.create(a);
        a.bitsof = bits;
        return a;
    }
    throw new TypeError;
};

exportedFn.ExtS = function(a, bits=32, bitsa=bitsof(a, true)) {
    if(bitsa <= bits) {
        a = ASR(LSL(a, bits-bitsa), bits-bitsa);
        a.bitsof = bits;
        return a;
    }
    //if('len' in a)
    //    return ASR(LSL(a, 32-a.len), 32-a.len);
    //else if(a.op === '<<' && 'len' in a.a && typeof a.b === 'number')
    //    return ASR(LSL(a.a, 32-a.a.len), 32-a.a.len-a.b);
    throw new TypeError;
}; // HACK no runtime version, it uses ASR and LSL.

exportedFn.Mem = (addr, size)=>({
    fn: 'Mem', addr, size, bitsof: size && size*8,
    inspect: ()=>'['+inspect(addr)+']'+([,'b','w',,'dw',,,,'qw'][+size] || ''),
    codeGen: ()=>'Mem('+codeGen(addr)+(size?', '+size:'')+')',
    runtimeKnown: false
});
codeGen.runtime.push(`function Mem(addr, size) {
    if(typeof addr === 'object' && 'value' in addr) addr = addr.value;
    return {
        fn: 'Mem', addr: addr, size: size,
        inspect: function() {
            return '['+inspect(addr)+']'+([,'b','w',,'dw',,,,'qw'][+size] || '');
        }
    };
}`);

exportedFn.Not = (a)=>({
    fn: 'Not', op: '~', a, bitsof: bitsof(a),
    inspect: ()=>'~'+inspect(a, precendence['~']),
    codeGen: function() {return this.runtimeKnown ? '~'+codeGen(a) : 'Not('+codeGen(a)+')';},
    runtimeKnown: runtimeKnown(a)
});
codeGen.runtime.push(`function Not(a) {
    if(typeof a === 'object' && 'value' in a) a = a.value;
    return {
        fn: 'Not', op: '~', a: a,
        inspect: function(_, p) {
            var expr = '~'+inspect(a, ${precendence['~']});
            return ${precendence['~']} <= p ? expr : '('+expr+')';
        }
    };
}`);

exportedFn.Neg = (a)=>({
    fn: 'Neg', op: '-', a, bitsof: bitsof(a),
    inspect: ()=>'-'+inspect(a, precendence['~']),
    codeGen: function() {return this.runtimeKnown ? '-'+codeGen(a) : 'Neg('+codeGen(a)+')';},
    runtimeKnown: runtimeKnown(a)
});
codeGen.runtime.push(`function Neg(a) {
    if(typeof a === 'object' && 'value' in a) a = a.value;
    if(known(a))
        return -a;
    return {
        fn: 'Neg', op: '-', a: a,
        inspect: function(_, p) {
            var expr = '-'+inspect(a, ${precendence['~']});
            return ${precendence['~']} <= p ? expr : '('+expr+')';
        }
    };
}`);

exportedFn.Sub = (a, b)=>Add(a, Neg(b)); // HACK no runtime version, it uses Add and Neg.

var binaryOps = {
    Mov:'=', Swap:'<->',
    Add:'+', Mul:'*',
    And:'&', Or:'|', Xor:'^',
    Eq:'==', Lt:'<',
    LSL:'<<', LSR:'>>>', ASR:'>>',
    ROR:'ROR', ROL:'ROL'
};
Object.keys(binaryOps).forEach(function(fn) {
    var op = binaryOps[fn], prec = precendence[op];
    var prologue = '', p = (s, ...args)=>prologue += '\n    '+s.map((x, i)=>i?args[i-1]+x:x).join('');
    
    if(op != '=' && op != '<->')
        p`if(typeof a === 'object' && 'value' in a) a = a.value;`;
    if(op != '<->')
        p`if(typeof b === 'object' && 'value' in b) b = b.value;`;
    if(op == '+') {
        p`if(!a) return b;`;
        //p`if(b < 0) return Sub(a, -b);`;
    }
    if(op == '+' /*|| op == '-'*/ || op == '^' || op == '<<' || op == '>>' || op == '>>>' || op == 'ROR' || op == 'ROL')
        p`if(!b) return a;`;
    if(op == '^')
        p`if(a === b) return 0;`;
    if(op == '&' || op == '|')
        p`if(a === b) return a;`;
    if(op == '+' /*|| op == '-'*/)
        p`if(known(a) && known(b)) return a ${op} b;`;
    if(op == '+')
        p`if(a.op == '+' && known(a.b) && known(b)) return Add(a.a, a.b+b);`;
    
    var prologueFn = eval(`(function(a, b) {${prologue} return [a, b];})`);
    
    exportedFn[fn] = function(a, b) {
        var o = prologueFn(a, b);
        if(!Array.isArray(o))
            return o;
        [a, b] = o;
        var bitsa = bitsof(a), bitsb = bitsof(b);
        o = {
            fn, op, a, b,
            inspect: function(_, p) {
                var op = this.op, a = this.a, b = this.b;
                if(op == '+' && b < 0)
                    op = '-', b = -b;
                if(op == '=' && (b.op == '+' || b.op == '-' || b.op == '*' || b.op == '^' || b.op == '<<' || b.op == '>>' || b.op == '>>>') && b.a === a) {
                    op = b.op+'=';
                    b = b.b;
                }
                var expr = inspect(a, prec)+' '+op+' '+inspect(b, prec);
                return prec <= p ? expr : '('+expr+')';
            },
            codeGen: function() {
                if(!this.runtimeKnown)
                    return fn+'('+codeGen(a)+', '+codeGen(b)+')';
                if(op == 'ROR')
                    return codeGen(Or(LSR(a, b), LSL(a, Sub(32, b))));
                if(op == 'ROL')
                    return codeGen(Or(LSR(a, Sub(32, b)), LSL(a, b)));
                return '('+codeGen(a)+' '+op+' '+codeGen(b)+')';
            },
            runtimeKnown: runtimeKnown(a) && runtimeKnown(b),
            CF: 0, NF: 0, OF: 0 // TODO flags.
        };
        var shiftOrRot = op == '<<' || op == '>>' || op == '>>>' || op == 'ROL' || op == 'ROR';
        if(op == '==' || op == '<')
            o.bitsof = 1;
        else if(known(bitsa) && (shiftOrRot || known(b) || known(bitsb))) {
            if(!shiftOrRot && bitsa != bitsb) {
                console.error(fn+' called with differently sizeof operands ('+bitsa+', '+bitsb+'): '+inspect(a)+', '+inspect(b));
                if(bitsb > bitsa)
                    bitsa = bitsb;
            }
            o.bitsof = bitsa;
        }
        if(op == '+' && b.fn == 'Neg') {
            o.ZF = Eq(a, b.a);
            o.CF = Lt(a, b.a);
        } else if(op != '==' && op != '<') {
            o.ZF = Eq(o, 0);
            o.NF = Lt(o, 0);
        } 
        return o;
    };
    
codeGen.runtime.push(`var ${fn} = exports.${fn} = function ${fn}(a, b) {${prologue}
    return {
        fn: '${fn}', op: '${op}', a: a, b: b,
        inspect: function(_, p) {
            var a = this.a, b = this.b;${op == '=' || op == '+' ? `
            var op = '${op}';
            ` : ''}${op == '+' ? `if(b < 0) {
                op = '-';
                b = -b;
            }` : ''}${op == '=' ? `if((b.op == '+' || b.op == '-' || b.op == '*' || b.op == '^' || b.op == '<<' || b.op == '>>' || b.op == '>>>') && b.a === a) {
                op = b.op+'=';
                b = b.b;
            }` : ''}var expr = inspect(a, ${prec})+' ${op=='=' || op=='+' ?`'+op+'`:op} '+inspect(b, ${prec});
            return ${prec} <= p ? expr : '('+expr+')';
        }
    };
}`);

});

for(var i in exportedFn)
    global[i] = exportedFn[i];

exports.filters = {};

function Var(name, pos, len, bigEndian) {
    return {
        name, pos, len, bitsof: len,
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
        codeGen: function() {
            if(this.len > 32)
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
    };
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
    //if(fn.length != vars.length)
    //    fn = eval('('+fn.toString().replace(/^\s*function\s*\(/, 'function('+vars.map(function(x){return x.name;}).join(','))+')');
    function make(ct, vals) {
        var res = fn.apply(this, vals);
        if(!res)
            return;
        res = res.filter((x)=>x);
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
    (function back(i, ct) {
        ct = ct.slice();
        if(i >= vars.length)
            return make(ct, vals);
        var v = vars[i], name = v.name;
        Var(name, v.pos, v.len, this.bigEndian).filter((v, ct2)=>{
            vals[i] = vals.byName[name] = v;
            back(i+1, ct2 || ct);
        }, ct, i, vals);
    })(0, ct);
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
            cmask = Var(' ', cend, ct.length-cend-cstart, self.bigEndian).codeGen()+' & 0x'+parseInt(cmask.replace(/0/g,'1').replace(/[^1]/g,'0'), 2).toString(16);

            console.log(ct.slice(cstart, ct.length-cend).replace(/[^01]/g,'0'));
            var cval = '0x'+parseInt(ct.slice(cstart, ct.length-cend).replace(/[^01]/g,'0'), 2).toString(16);
            cond = 'if(('+cmask+') == '+cval+')';
        }
        
        cstart = cend = 0;
        var mask = ct.replace(/^[^K]+/, (s)=>{cstart += s.length; return '';}).replace(/[^K]+$/, (s)=>{cend += s.length; return '';});
        mask = parseInt(mask.replace(/[^K]/g,'0').replace(/K/g,'1'), 2);
        
        var val = mask ? Var(' ', cend, ct.length-cend-cstart, self.bigEndian).codeGen()+' & 0x'+mask.toString(16) : '0';
        
        code += cond+'\n\tswitch('+val+') {\n';
        console.log('  \''+ct.replace(/K/g,'#').replace(/x/g,'_')+'\': {');
        for(var j in v)
            if(j !== '$ct') {
                console.log('    \''+j+'\': ', v[j]);
                val = '0x'+(parseInt(j.slice(cstart, ct.length-cend).replace(/[^01]/g,'0'), 2)&mask).toString(16);
                code += '\tcase '+val+': return ['+ct.length/8+', '+v[j].map((x)=>codeGen(x)).join(',')+'];\n';
            }
        console.log('  }');
        code += '\t}\n';
    });
    console.log('}');
    console.log();
    fs.writeFileSync(outFile, fn(code)/*fs.readFileSync(baseFile, 'utf8').replace(/\$DIS_CODE/, code)*/);
}
