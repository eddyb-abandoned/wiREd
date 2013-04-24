module codegen from 'codegen-js.js';
export codegen;

export const filters = {};

Number.prototype.toBinary = function(n=-1) {
    var s = this.toString(2);
    while(s.length < n)
        s = '0'+s;
    return s;
};

function Var(name, pos, len, bigEndian) {
    var resBits = 8 << Math.ceil(Math.log(Math.ceil(len/8))/Math.LN2);
    return {
        name, pos, len, bigEndian, bitsof: len, // FIXME len/bitsof are redundant.
        signed: false, runtimeKnown: true,
        posAt(d) {
            if(!(d >= 0 && d < this.len))
                throw new RangeError('Offset '+d+' is outside the bit range');
            d += this.pos & 7;
            var pos = (this.pos & ~7) + (d & 7);
            if(this.bigEndian)
                return pos - (d & ~7);
            return pos + (d & ~7);
        },
        inspect() {
            return '<'+this.pos+(this.len > 1 ? ':'+(this.pos+this.len-1) : '')+'>';
        },
        code() {
            let {$: {u8, uint}, inputByte} = codegen;
            var mask = pow => uint[resBits](1).shl(u8(pow)).sub(u8(1));
            var pos = this.pos & ~7, bits = this.pos & 7;
            var end = this.pos+this.len, endBits = end & 7;
            var res;
            if(bits) {
                res = inputByte(pos >>> 3, resBits).and(mask(Math.min(this.len, 8-bits)).shl(u8(bits))).shr(u8(bits));
                pos += 8;
            } else
                res = uint[resBits](0);
            for(var j = pos >>> 3; pos+8 <= end; pos+=8, j+=(this.bigEndian?-1:1))
                res = res.or(inputByte(j, resBits).shl(u8(pos-this.pos)));
            if(pos < end)
                res = res.or(inputByte(j, resBits).and(mask(endBits)).shl(u8(pos-this.pos)));
            return res.code(...arguments);
        },
        slice(name, start, end) {
            if(typeof start !== 'number')
                start = 0;
            else if(start < 0)
                start += this.len;
            if(typeof end !== 'number')
                end = this.len;
            else if(end < 0)
                end += this.len;
            return Var(name, this.posAt(start), end-start, this.bigEndian);
        },
        /*clone() {
            return Var(this.name, this.pos, this.len, this.bigEndian);
        },*/
        filter: filters[name] || filters[name[0]] || function(next, ct) {
            if(this.len === 1)
                return next(ct[this.pos] = 0), next(ct[this.pos] = 1);
            next(this);
        }
    };
}

export class Disasm {
    constructor() {
        this.totals = 0;
        this.maps = {};
        this.runtime = codegen.runtime;
    }

    pushRuntime() {
        this.runtime += '\n'+String.raw(...arguments);
    }

    op(def, fn, {actualLengthBias=codegen.$.u8(0)}={}) {
        if(!actualLengthBias.runtimeKnown)
            throw new Error('actualLengthBias should be runtimeKnown');
        var ct = [], vars = [], nBits = 0;
        def.forEach(x => {
            var n = x.length, bits = x.match(/[A-Z][a-z$]*_*|./g);
            if(n & 7)
                throw new TypeError('Opcode definition '+x+' does not align to a byte boundary');
            var part = Var(' ', nBits+(this.bigEndian?n-8:0), n, this.bigEndian);
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
        let make = (ct, vals)=>{
            var res = fn.apply(null, vals);
            if(!res)
                return;
            res = res.filter(x => x);
            res.unshift(codegen.$.u8(nBits/8).add(actualLengthBias));
            let niceCT = ct => {
                var s = '';
                for(var i = nBits-1; i >= 0; i--)
                    s += typeof ct[i] === 'number' ? ct[i] : 'x';
                return s;
            };
            ct = niceCT(ct);
            var ctMask = ct.replace(/[01]/g, 'K');
            this.totals += 100/Math.pow(2, ctMask.split('').reduce((a, b)=>a+(b=='K'), 0));
            if(!this.maps[ctMask])
                this.maps[ctMask] = {$ct: ct};
            else
                this.maps[ctMask].$ct = this.maps[ctMask].$ct.split('').map((x, i)=>x==ct[i]?x:'K').join('');
            this.maps[ctMask][ct] = res;
            console.log.apply(console, [ct+':'].concat(res));
        }
        var vals = [], isUnfiltered = [];
        vals.byName = {};
        let back = (i, ct)=>{
            ct = ct.slice();
            if(i >= vars.length)
                return make(ct, vals);
            var v = vars[i], name = v.name;
            v.filter((v, ct2=ct)=>{
                vals[i] = vals.byName[name] = v;
                back(i+1, ct2);
            }, ct, i, vals);
        };
        back(0, ct);
        console.log();
    }

    code() {
        console.error('Totals:', this.totals.toFixed(2) + '%');
        console.log('{');
        var mapKeys = Object.keys(this.maps).map(x => [this.maps[x], this.maps[x].$ct.split('').map(x => ({'0':0, '1':1, K:2})[x])]);
        mapKeys.sort(([{$ct: a$ct}, a], [{$ct: b$ct}, b])=>{
            if(a.length != b.length) // HACK make longer opcodes more important.
                return b.length - a.length;
            var len = a.length, extraA = 0, extraB = 0;
            for(var i = 0; i < len; i++) {
                var ak = a[i] < 2, bk = b[i] < 2;
                if(ak && bk && a[i] != b[i])
                    return a[i]-b[i];
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
                console.error('Can\'t sort '+a$ct+' '+b$ct);
            return a$ct > b$ct ? 1 : -1;
        });
        var code = '';
        mapKeys.forEach(([v])=>{
            var ct = v.$ct, cond = '';
            var cstart = 0, cend = 0;
            var cmask = ct.replace(/^[^01]+/, s => {cstart += s.length; return '';}).replace(/[^01]+$/, s => {cend += s.length; return '';});
            if(cmask.length) {
                cmask = Var(' ', cend, ct.length-cend-cstart).code(true)+' & 0x'+parseInt(cmask.replace(/0/g,'1').replace(/[^1]/g,'0'), 2).toString(16);

                console.log(ct.slice(cstart, ct.length-cend).replace(/[^01]/g,'0'));
                var cval = '0x'+parseInt(ct.slice(cstart, ct.length-cend).replace(/[^01]/g,'0'), 2).toString(16);
                cond = '\nif(('+cmask+') == '+cval+')';
            }

            cstart = cend = 0;
            var mask = ct.replace(/^[^K]+/, s => {cstart += s.length; return '';}).replace(/[^K]+$/, s => {cend += s.length; return '';});
            mask = parseInt(mask.replace(/[^K]/g,'0').replace(/K/g,'1'), 2);

            var val = mask ? Var(' ', cend, ct.length-cend-cstart).code(true)+' & 0x'+mask.toString(16) : '0';

            code += cond+'\nswitch('+val+') {\n';
            console.log('  \''+ct.replace(/K/g,'#').replace(/x/g,'_')+'\': {');
            for(var j in v)
                if(j !== '$ct') {
                    console.log('    \''+j+'\': ', v[j]);
                    val = '0x'+(parseInt(j.slice(cstart, ct.length-cend).replace(/[^01]/g,'0'), 2) & mask).toString(16);
                    code += '\tcase '+val+': return '+codegen.makeResult(v[j])+';\n';
                }
            console.log('  }');
            code += '}\n';
        });
        code = codegen.prologue()+code;
        console.log('}\n');
        return code;
    }
};
