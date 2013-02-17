var dis = require('./Disasm.jsc'), util = require('util');

dis.bigEndian = true;

Number.prototype.toBinary = function(n=-1) {
    var s = this.toString(2);
    while(s.length < n)
        s = '0'+s;
    return s;
};

let raw = ({raw: s}, ...args)=>s.map((x, i)=>i?args[i-1]+x:x).join('');
dis.codeGen.runtime.push(`var R = exports.R = {}, SFR8 = [], SFR16 = [];`);
let R = (reg, bits=8, code='')=>({bitsof: bits, signed: false, inspect: ()=>'r'+inspect(reg)+'/'+bits, get code() {return code || 'SFR'+bits+'['+reg.code+']';}});
dis.codeGen.runtime.push(`var PC = R.PC = {bitsof: 32, signed: false, inspect: function() {return 'PC';}};`);
R.PC = R('PC', 32, 'PC');
{
    let sfr8 = [], sfr = (name, reg, bits=8)=>{
        R[name] = R(reg, bits);
        if(bits == 8)
            sfr8[reg] = true;
        dis.codeGen.runtime.push(`R.${name} = SFR${bits}[${reg}] = {bitsof: ${bits}, signed: false, inspect: function() {return '${name}';}};`);
    };

    sfr('SP', 1);
    sfr('DPTR', 2, 16);
    sfr('DPL', 2);
    sfr('DPH', 3);
    sfr('A', 0x60);
    sfr('B', 0x70);
    for(let i = 0; i < 0x80; i++) {
        if(!sfr8[i])
            sfr('SFR_'+(i<16?'0':'')+i.toString(16), i);
    }
}
let F = (f, name='f'+util.inspect(f))=>({bitsof: 1, signed: false, inspect: ()=>name, get code() {return 'F['+f.code+']';}});
dis.codeGen.runtime.push(`var F = [];`);
'C'.split('').forEach((x,i)=>{
    F[x] = F(i, x);
    dis.codeGen.runtime.push(`R.${x} = F[${i}] = {bitsof: 1, signed: false, inspect: function() {return '${x}';}};`);
});
R.RAM = (n)=>u8(Mem(n)); // FIXME banking.

dis.filters.Direct = function(next, ct, k, vals) {
    this.slice('Sfr', 7).filter((sfr, ct2=ct)=>{
        this.slice('Addr', 0, 7).filter((addr, ct3=ct2)=>next(sfr ? R(addr) : u8(Mem(addr)), ct3), ct, 0, vals);
    }, ct, 0, vals);
};
dis.filters.Bitad = function(next, ct, k, vals) {
    this.slice('Sfr', 4).filter((sfr, ct2=ct)=>{
        this.slice('Addr', 0, 4).filter((addr, ct3=ct2)=>next(sfr ? R(LSL(addr, 4)) : u8(Mem(Add(0x20, addr))), ct3), ct, 0, vals);
    }, ct, 0, vals);
};

let PCbase = {runtimeKnown: true, bitsof: 32, signed: false, code: 'exports.PCbase'}, ROM = (x)=>Add(PCbase, x);
let XRAM = (x)=>Add(0xe0000, u32(x));
let array = (x)=>Array.isArray(x) ? x : [x];
let hex = (x)=>typeof x === 'number' ? x : parseInt(x, 16);
let PCoffset;
let _ = (x, ...args)=>{
    if(!(x.length > 2))
        x = hex(x).toBinary(8);
    let fn = args.pop(), bytes = args.map((x)=>x.length/8).reduce((a, b)=>a+b, 1);
    dis.op([x, ...args], (...args)=>{
        PCoffset = (x=0)=>Add(R.PC, x ? Add(bytes, signed(x)) : bytes);
        return array(fn(...args));
    });
};
let _$R = (x, ...args)=>{
    let fn = args.pop();
    _((hex(x) >> 1).toBinary(7)+'R', ...args, (r, ...args)=>fn(u8(Mem(R.RAM(r))), ...args));
};
let _R = (x, ...args)=>{
    let fn = args.pop();
    _((hex(x) >> 3).toBinary(5)+'Reg', ...args, (r, ...args)=>fn(R.RAM(r), ...args));
};
let _$R_R = (x, ...args)=>{
    _$R(x, ...args);
    _R(hex(x)+2, ...args);
};
let _d_$R_R = (x, ...args)=>{
    _(x, 'Direct__', ...args);
    _$R_R(hex(x)+2, ...args);
};
let _i_d_$R_R = (x, ...args)=>{
    _(x, 'Immed___', ...args);
    _d_$R_R(hex(x)+1, ...args);
};
let _A_d_$R_R = (x, ...args)=>{
    let fn = args.pop();
    _(x, ...args, (...args)=>fn(R.A, ...args));
    _d_$R_R(hex(x)+1, ...args, fn);
};
let addr16 = 'Addr____________', immed = 'Immed___', immed16 = 'Immed___________';
let direct = 'Direct__', bit = 'BitadBit', offset = 'Offset__';

let ADC = (a, b)=>Add(Add(a, b), IntSize(F.C, bitsof(a))), SBB = (a, b)=>Sub(Sub(a, b), IntSize(F.C, bitsof(a)));

///\00-0F
_(0, Nop);
_(2, addr16, (addr)=>Mov(R.PC, ROM(addr)));
_A_d_$R_R(4, (a)=>Mov(a, Add(a, 1)));

///\10-1F
// HACK stack may not work as expected, because 8051 does it strangely.
_('12', addr16, (a)=>[Mov(R.SP, Add(R.SP, 4)), Mov(u32(Mem(R.SP)), PCoffset(0)), Mov(R.PC, ROM(a))]);
_('13', ()=>Mov(R.A, Or(LSR(R.A, 1), LSL(u8(F.C), 7)))); // HACK FIXME needs to save new C.
_A_d_$R_R('14', (a)=>Mov(a, Sub(a, 1)));

///\20-2F
_('20', bit, offset, (byte, bit, offset)=>If(Not(Eq(And(byte, u8(LSL(1, bit))), 0)), Mov(R.PC, PCoffset(offset))));
// HACK stack may not work as expected, because 8051 does it strangely.
_('22', ()=>[Mov(R.PC, u32(Mem(R.SP))), Mov(R.SP, Sub(R.SP, 4))]);
_i_d_$R_R('24', (a)=>Mov(R.A, Add(R.A, a)));

///\30-3F
_('30', bit, offset, (byte, bit, offset)=>If(Eq(And(byte, u8(LSL(1, bit))), 0), Mov(R.PC, PCoffset(offset))));
// HACK stack may not work as expected, because 8051 does it strangely.
// FIXME this is RETI, that should be visible to the user.
_('32', ()=>[Mov(R.PC, u32(Mem(R.SP))), Mov(R.SP, Sub(R.SP, 4))]);
_('33', ()=>Mov(R.A, Or(LSL(R.A, 1), u8(F.C)))); // HACK FIXME needs to save new C.
_i_d_$R_R('34', (a)=>Mov(R.A, ADC(R.A, a)));

///\40-4F
_('40', offset, (offset)=>If(F.C, Mov(R.PC, PCoffset(offset))));
_i_d_$R_R('44', (a)=>Mov(R.A, Or(R.A, a)));

///\50-5F
_('50', offset, (offset)=>If(Not(F.C), Mov(R.PC, PCoffset(offset))));
_('52', direct, (a)=>Mov(a, And(a, R.A)));
_i_d_$R_R('54', (a)=>Mov(R.A, And(R.A, a)));

///\60-6F
_('60', offset, (offset)=>If(Eq(R.A, 0), Mov(R.PC, PCoffset(offset))));
_i_d_$R_R('64', (a)=>Mov(R.A, Xor(R.A, a)));

///\70-7F
_('70', offset, (offset)=>If(Not(Eq(R.A, 0)), Mov(R.PC, PCoffset(offset))));
_('73', ()=>Mov(R.PC, ROM(Add(R.DPTR, R.A))));
_A_d_$R_R('74', immed, (a, b)=>Mov(a, b));

///\80-8F
_('80', offset, (offset)=>Mov(R.PC, PCoffset(signed(offset))));
_d_$R_R('85', direct, (a, b)=>Mov(b, a));

///\90-9F
_('90', immed16, (a)=>Mov(R.DPTR, a));
_('93', ()=>Mov(R.A, u8(Mem(ROM(Add(R.DPTR, R.A))))));
_i_d_$R_R('94', (a, v=SBB(R.A, a))=>[Mov(F.C, v.CF || 0), Mov(R.A, v)]);

///\A0-AF
_('A3', ()=>Mov(R.DPTR, Add(R.DPTR, 1)));
_('A4', (v=Mul(R.A, R.B))=>[Mov(R.A, v), Mov(R.B, LSR(v, 8))]); // FIXME B gets the wrong value because it's not saved before changing A.
_$R_R('A6', direct, (a, b)=>Mov(a, b));

///\B0-BF
let CJNE = (a, b, offset)=>If(Eq(a, b), Mov(R.PC, PCoffset(offset))); // FIXME set C.
_('B4', immed, offset, (a, offset)=>CJNE(R.A, a, offset));
_('B5', direct, offset, (a, offset)=>CJNE(R.A, a, offset));
_$R_R('B6', immed, offset, (a, b, offset)=>CJNE(a, b, offset));

///\C0-CF
_('C0', direct, (a)=>[Mov(R.SP, Add(R.SP, 1)), Mov(u8(Mem(R.SP)), a)]);
_('C2', bit, (byte, bit)=>Mov(byte, And(byte, Not(u8(LSL(1, bit))))));
_('C3', ()=>Mov(F.C, 0));
_('C4', ()=>Mov(R.A, Or(LSL(R.A, 4), LSR(R.A, 4))));

///\D0-DF
_('D0', direct, (a)=>[Mov(R.SP, Sub(R.SP, 1)), Mov(a, u8(Mem(R.SP)))]);
_('D2', bit, (byte, bit)=>Mov(byte, Or(byte, u8(LSL(1, bit)))));
_('D3', ()=>Mov(F.C, 1));
_R('D8', offset, (a, offset)=>[Mov(a, Sub(a, 1)), If(Not(Eq(a, 0)), Mov(R.PC, PCoffset(offset)))]);

///\E0-EF
_('E0', ()=>Mov(R.A, u8(Mem(XRAM(R.DPTR)))));
_('E4', ()=>Mov(R.A, 0));
_d_$R_R('E5', (a)=>Mov(R.A, a));

///\F0-FF
_('F0', ()=>Mov(u8(Mem(XRAM(R.DPTR))), R.A));
_('F4', ()=>Mov(R.A, Not(R.A)));
_d_$R_R('F5', (a)=>Mov(a, R.A));

dis.out(__dirname+'/arch-8051.js', (code)=>raw`/** @file arch-8051.js This file was auto-generated */
${dis.codeGen.runtime.join('\n')}
exports.dis = function _8051dis(b, i) {
    ${code}
}
exports.SP = R.SP;
exports.PC = R.PC;
`);