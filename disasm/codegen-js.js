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
    ctor.prototype.touch = function touch() {
        if(!this.runtimeKnown) {
            let i = vars.keys.indexOf(this);
            if(i === -1) {
                i = vars.keys.push(this)-1;
                vars.data[i] = {generated: 0};
                if(methods.touch)
                    methods.touch.call(this);
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
    methods($[fn], {touch() {
        this.a.touch && this.a.touch();
    }, code(bareRK=false) {
        if(this.a.runtimeKnown)
            return this.type.wrap(op+this.a.code(true), bareRK);
        return this.a.code()+'.'+fn.toLowerCase()+'()';
    }});
}

for(let fn in binaryOps) {
    let op = binaryOps[fn];
    rk($[fn], x => x.a.runtimeKnown && x.b.runtimeKnown);
    methods($[fn], {touch() {
        this.a.touch && this.a.touch();
        this.b.touch && this.b.touch();
    }, code(bareRK=false) {
        if(op == '=')
            return 'new '+fn+'('+this.a.code()+', '+this.b.code()+')';
        if(this.a.runtimeKnown && this.b.runtimeKnown) {
            if(op == '<<' || op == '>>')
                return this.type.wrap(this.a.code(true)+' '+(op == '>>' && !this.signed ? '>>>' : op)+' '+(this.b.known ? this.b.and(u8(this.bitsof-1)).code(true) : '('+this.b.code(true)+' & 0x'+(this.bitsof-1).toString(16)+')'), bareRK);
            return this.type.wrap(this.a.code(true)+' '+op+' '+this.b.code(true), bareRK);
        }
        return this.a.code()+'.'+fn.toLowerCase()+'('+this.b.code()+')';
    }});
    if(op != '==' && op != '<')
        Object.defineProperties($[fn].prototype, {
            ZF: {get() {
                return op == '+' && this.b.fn == 'Neg' ? this.a.eq(this.b.a) : this.eq(this.type(0));
            }},
            NF: {get() {
                return op == '+' && this.b.fn == 'Neg' ? this.a.lt(this.b.a) : this.lt(this.type(0));
            }}
        });
}

for(let bits of bitSizes) {
    methods($['Register'+bits], {code() {
        if(typeof this.name === 'string' && this.name[0] != '<') // HACK ignore automated <${bits}> names.
            return 'R'+bits+'.'+this.name;
        else if(typeof this.name === 'number')
            return 'R'+bits+'['+this.name+']';
        else if(this.name.runtimeKnown)
            return 'R'+bits+'['+this.name.code(true)+']';
        return 'new Register'+bits;
    }});
}

for(let bits of bitSizes) {
    methods($['Mem'+bits], {touch() {
        this.addr.touch && this.addr.touch();
    }, code() {
        return 'new Mem'+bits+'('+this.addr.code()+')';
    }});
}

methods($.If, {touch() {
    this.cond.touch && this.cond.touch();
    this.then.touch && this.then.touch();
}, code() {
    return 'new If('+this.cond.code()+', '+this.then.code()+')';
}});

methods($.FnCall, {touch() {
    this.args.forEach(x => x.touch && x.touch());
}, code() {
    return 'new FnCall('+[`'${this.name}'`, ...this.args.map(x => x.code())].join(', ')+')';
}});

for(let bits of bitSizes) {
    for(let signed of [false, true]) {
        let id = (signed ? 'i' : 'u')+bits; // FIXME duplicated from codegen-js-base.js.
        let conv = signed ? (bits >= 32 ? '>> 0' : '<< '+(32-bits)+' >> '+(32-bits))
                          : (bits >= 32 ? '>>> 0' : '& 0x'+((1<<bits)-1).toString(16));
        if(bits <= 32) { // TODO
            rk($[id], x => x.known || x._A.runtimeKnown);
            // HACK setting $[id].prototype.type.wrap required because type is $[id].bind(null).
            $[id].wrap = $[id].prototype.type.wrap = (x, bare)=>(bare ? '(('+x+') '+conv+')' : 'new '+id+'('+x+')');
        }
        methods($[id], {touch() {
            this._A.touch && this._A.touch();
        }, code(bareRK=false) {
            if(this.known && bits <= 32) { // TODO
                var n = Math.abs(this._A), h = '0x'+n.toString(16), d = n.toString(10);
                n = (this._A < 0 ? '-' : '')+(h.length > d.length ? d : h);
                return bareRK ? n : 'new '+id+'('+n+')';
            }
            if(this.runtimeKnown)
                return bareRK && this._A.bitsof === bits && this._A.signed === signed ? this._A.code(bareRK) : $[id].wrap(this._A.code(bareRK), bareRK);
            return 'new '+id+'('+this._A.code()+')';
        }});
    }
}
/*{
    let {Register32, u8, u32, Mov, inspect, valueof} = $;
    var EAX = new Register32('EAX'), EDX = new Register32('EDX');
    EAX.nthValue = 1, EDX.nthValue = 1;
    EDX.value = u32(5);
    var eax = u32(EAX), edx = u32(EDX);
    var op = Mov(eax, eax.add(eax.mul(edx.shl(u32(new Register32(u8({runtimeKnown: true, code: ()=>'r'})))))));
    op.touch();
    console.log(op.code()+' // '+inspect(valueof(op))+' // '+inspect(op));
}*/
