Number.prototype.toSubString = function toSubString(...args) {
    return this.toString(...args).replace(/[0-9]/g, function(x) {
        return String.fromCharCode('₀'.charCodeAt()+(+x));
    });
};
Number.prototype.toSupString = function toSupString(...args) {
    return this.toString(...args).replace(/1/g, '¹').replace(/2/g, '²').replace(/3/g, '³').replace(/[04-9]/g, function(x) {
        return String.fromCharCode('⁰'.charCodeAt()+(+x));
    }).replace(/[a-z]/g, function(x) {
        return 'ᵃᵇᶜᵈᵉᶠᵍʰⁱʲᵏˡᵐⁿᵒᵖqʳˢᵗᵘᵛʷˣʸᶻ'[x.charCodeAt()-'a'.charCodeAt()];
    });
};

import * from 'codegen-js-base.js';
export const runtime = code, $ = {};
Function('exports', 'require', code)($, require);

export const inputByte = (j, bitsof) => uint[bitsof]({runtimeKnown: true, bitsof: bitsof, signed: false, code: ()=>j ? 'b[i+'+j+']' : 'b[i]'})

let rk = (ctor, fn)=>Object.defineProperty(ctor.prototype, 'runtimeKnown', {
    configurable: true,
    get() {
        Object.defineProperty(this, 'runtimeKnown', {value: !!fn(this)});
        return this.runtimeKnown;
    }
});

Object.defineProperty(Array.prototype, 'flatten', {
    value() {
        return this.reduce((a, b)=>a.concat(b), []);
    }
});

var vars = {keys: [], data: [], used: 0},  maxVarsUsed = 0, varStack = [];
export const pushVars = ()=>{
    varStack.push(vars);
    vars = {keys: vars.keys.slice(), data: vars.data.slice(), used: vars.used};
}, popVars = ()=>{
    vars = varStack.pop();
}, prologue = ()=>{
    if(!maxVarsUsed)
        return '';
    var s = 'var $0';
    for(var i = 1; i < maxVarsUsed; i++)
        s += ', $'+i;
    return s+';\n';
}, makeResult = res => {
    codegen.pushVars();
    res.forEach(x => x.touch && x.touch());
    let code = '['+[res[0].code(true), ...res.slice(1).map(x => x.code())].join(', ')+']';
    codegen.popVars();
    return code;
};
let methods = (ctor, methods)=>{
    ctor.prototype.touch = function touch(noCreate, ...args) {
        if(!this.runtimeKnown) {
            let i = vars.keys.indexOf(this);
            if(i === -1) {
                if(!noCreate) {
                    i = vars.keys.push(this)-1;
                    vars.data[i] = {generated: 0};
                }
                if(methods.touch)
                    methods.touch.apply(this, arguments);
            } else if(!vars.data[i].name) {
                vars.data[i].name = '$'+(vars.used++);
                if(vars.used > maxVarsUsed)
                    maxVarsUsed = vars.used;
            }
        }
    };
    ctor.prototype.code = function code(...args) {
        if(!this.runtimeKnown) {
            let data = vars.data[vars.keys.indexOf(this)];
            if(data && data.name) {
                if(!data.generated++)
                    return '('+data.name+' = '+methods.code.call(this, ...args)+')';
                return data.name;
            }
        }
        return methods.code.call(this, ...args);
    };
};

for(let fn in unaryOps) {
    let op = unaryOps[fn];
    rk($[fn], x => x.a.runtimeKnown);
    methods($[fn], {touch(...args) {
        this.a.touch && this.a.touch(...args);
    }, code(bareRK=false) {
        if(this.a.runtimeKnown)
            return this.type.wrap(op+this.a.code(true), bareRK);
        return '(new '+fn+'('+this.a.code()+'))';
    }});
}

for(let fn in binaryOps) {
    let op = binaryOps[fn];
    rk($[fn], x => x.a.runtimeKnown && x.b.runtimeKnown);
    methods($[fn], {touch(...args) {
        this.a.touch && this.a.touch(...args);
        this.b.touch && this.b.touch(...args);
    }, code(bareRK=false) {
        if(op === '=')
            return 'new '+fn+'('+this.a.code()+', '+this.b.code()+')';
        if(this.a.runtimeKnown && this.b.runtimeKnown) {
            if(op === '<<' || op === '>>')
                return this.type.wrap(this.a.code(true)+' '+(op == '>>' && !this.signed ? '>>>' : op)+' '+(this.b.known ? this.b.and(u8(this.bitsof-1)).code(true) : '('+this.b.code(true)+' & 0x'+(this.bitsof-1).toString(16)+')'), bareRK);
            return this.type.wrap(this.a.code(true)+' '+op+' '+this.b.code(true), bareRK);
        }
        return '(new '+fn+'('+this.a.code()+', '+this.b.code()+'))';
    }});
    if(op !== '==' && op !== '<')
        Object.defineProperties($[fn].prototype, {
            ZF: {get() {
                return op == '+' && this.b.fn == 'Neg' ? this.a.eq(this.b.a) : this.eq(new this.type(0));
            }},
            NF: {get() {
                return op == '+' && this.b.fn == 'Neg' ? this.a.lt(this.b.a) : this.lt(new this.type(0));
            }},
            CF: {get() {
                return op == '+' && this.b.fn == 'Neg' ? unsigned(this.a).lt(unsigned(this.b.a)).not() : $.u1(0);
            }}
        });
}

for(let bits of storageBitSizes) {
    methods($['Register'+bits], {code() {
        if(typeof this.name === 'string' && this.name[0] != '<') // HACK ignore automated <${bits}> names.
            return 'R'+bits+'.'+this.name;
        else if(typeof this.name === 'number')
            return 'R'+bits+'['+this.name+']';
        else if(this.name.runtimeKnown)
            return 'R'+bits+'['+this.name.code(true)+']';
        return '(new Register'+bits+')';
    }});
}

for(let bits of storageBitSizes) {
    methods($['Mem'+bits], {touch(...args) {
        this.addr.touch && this.addr.touch(...args);
    }, code() {
        return 'new Mem'+bits+'('+this.addr.code()+')';
    }});
}

methods($.If, {touch(noCreate, ...args) {
    this.cond.touch && this.cond.touch(noCreate, ...args);
    this.then.touch && this.then.touch(noCreate || this.cond.runtimeKnown, ...args);
}, code() {
    if(this.cond.runtimeKnown)
        return '('+this.cond.code(true)+'?'+this.then.code()+':null)';
    return 'new If('+this.cond.code()+', '+this.then.code()+')';
}});

methods($.FnCall, {touch(...args) {
    this.args.forEach(x => x.touch && x.touch(...args));
}, code() {
    return 'new FnCall('+[`'${this.name}'`, ...this.args.map(x => x.code())].join(', ')+')';
}});

let makeLiteral = x => {
    var n = Math.abs(x), h = '0x'+n.toString(16), d = n.toString(10);
    return (x < 0 ? '-' : '')+(h.length > d.length ? d : h);
};

for(let bits of intBitSizes) {
    for(let signed of [false, true]) {
        let id = (signed ? 'i' : 'u')+bits; // FIXME duplicated from codegen-js-base.js.
        let conv = signed ? (bits >= 32 ? '>> 0' : '<< '+(32-bits)+' >> '+(32-bits))
                          : (bits >= 32 ? '>>> 0' : '& 0x'+((1<<bits)-1).toString(16));
        let dwords = 'abcdefgh'.slice(0, Math.ceil(bits / 32)).split('');
        if(bits <= 32) { // TODO
            rk($[id], x => x.known || x._A.runtimeKnown);
            $[id].wrap = (x, bare)=>(bare ? '(('+x+') '+conv+')' : 'new '+id+'('+x+')');
        }
        methods($[id], {touch(...args) {
            this._A.touch && this._A.touch(...args);
        }, code(bareRK=false) {
            if(this.known)
                return bareRK && bits <= 32 ? makeLiteral(this._A) : 'new '+id+'('+dwords.map(x => makeLiteral(this['_'+x.toUpperCase()])).join(', ')+')';
            if(this.runtimeKnown)
                return bareRK && this._A.bitsof === bits && this._A.signed === signed ? this._A.code(bareRK) : $[id].wrap(this._A.code(bareRK), bareRK);
            return 'new '+id+'('+this._A.code()+')';
        }});
    }
}

for(let bits of floatBitSizes) {
    let id = 'f'+bits;
    // TODO runtimeKnown.
    methods($[id], {touch(...args) {
        this._A.touch && this._A.touch(...args);
    }, code(bareRK=false) {
        if(this.known) // FIXME proper constants.
            return 'new '+id+'('+this._A+')';
        return 'new '+id+'('+this._A.code()+')';
    }});
}
