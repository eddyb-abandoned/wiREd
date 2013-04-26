var fs = require('fs');

import {Disasm, filters, codegen} from 'Disasm.js';
const {Unknown, Mov, Register, Register1, Register8, Register16, Mem8, Mem32, If, FnCall, Nop, signed, unsigned, uint, i8, i32, u1, u8} = codegen.$;

const _8051 = new Disasm;
_8051.bigEndian = true;

const R = (reg, bits=8)=>new Register[bits](u8(reg));
const F = f => R(f, 1);
_8051.pushRuntime`var R = exports.R = {}, R1 = [], R8 = [], R16 = [], R32 = [];`;
{
    let sfr8 = [], r = (reg, name, bits=8)=>{
        if(bits == 8)
            sfr8[reg] = true;
        _8051.pushRuntime`R.${name} = R${bits}[${reg}] = new Register${bits}('${name}');`;
        return R[name] = R(reg, bits);
    };

    // TODO more registers.
    r(0x01, 'SP');
    r(0x02, 'DPTR', 16);
    r(0x02, 'DPL');
    r(0x03, 'DPH');
    r(0x60, 'A');
    r(0x70, 'B');
    for(let i = 0; i < 0x80; i++)
        if(!sfr8[i])
            r(i, 'SFR_'+(i<16?'0':'')+i.toString(16).toUpperCase());

    // HACK PC needs special treatment.
    // FIXME better support.
    r(0, 'PC', 32);

    'C'.split('').forEach((x, i)=>{
        F[x] = r(i, x+'F', 1);
    });
}
R.RAM = n => Mem8(n); // FIXME banking.

filters.Direct = function(next, ct, k, vals) {
    this.slice('Sfr', 7).filter((sfr, ct2=ct)=>{
        this.slice('Addr', 0, 7).filter((addr, ct3=ct2)=>next(sfr ? R(i8(addr)) : Mem8(i8(addr)), ct3), ct, 0, vals);
    }, ct, 0, vals);
};
filters.Bitad = function(next, ct, k, vals) {
    this.slice('Sfr', 4).filter((sfr, ct2=ct)=>{
        this.slice('Addr', 0, 4).filter((addr, ct3=ct2)=>next(sfr ? R(i8(addr).shl(u8(3))) : Mem8(i8(addr).add(i8(0x20))), ct3), ct, 0, vals);
    }, ct, 0, vals);
};
// HACK
filters.Immed = filters.Offset = filters.Bit = function(next) {
    next(i8(this));
};

// HACK improve this.
let ROM = x => i32(x).add(ROM.base);
ROM.base = i32({runtimeKnown: true, bitsof: 32, signed: true, code: ()=>'exports.PCbase'});
// HACK
let XRAM = x => x.add(i32(0xe0000));
let array = x => Array.isArray(x) ? x : [x];
let hex = x => typeof x === 'number' ? x : parseInt(x, 16);
let PCoffset;
let _ = (x, ...args)=>{
    if(!(x.length > 2))
        x = hex(x).toBinary(8);
    args = [x, ...args];
    let fn = args.pop(), bytes = i8(args.map(x => x.length/8).reduce((a, b)=>a+b));
    _8051.op(args, (...args)=>{
        PCoffset = (x=i8(0))=>R.PC.add(bytes.add(x));
        return array(fn(...args));
    });
};
let _$R = (x, ...args)=>{
    let fn = args.pop();
    _((hex(x) >> 1).toBinary(7)+'R', ...args, (r, ...args)=>fn(Mem8(R.RAM(i8(r))), ...args));
};
let _R = (x, ...args)=>{
    let fn = args.pop();
    _((hex(x) >> 3).toBinary(5)+'Reg', ...args, (r, ...args)=>fn(R.RAM(i8(r)), ...args));
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
let ADC = (a, b)=>a.add(b).add(F.C), SBB = (a, b)=>a.sub(b).sub(F.C);

let bool = x => x.eq(i8(0)).not(); // HACK

let Call = a => [Mov(R.SP, R.SP.add(i8(4))), Mov(Mem32(R.SP), PCoffset()), Mov(R.PC, ROM(a))];

// AJMP.
_('Adh00001', 'Addrlow_', (high, low)=>Mov(R.PC, ROM(PCoffset().and(i32(0xf800)).or(i32(high).shl(u8(8)).or(i32(low))))));
// ACALL.
_('Adh10001', 'Addrlow_', (high, low)=>Call(PCoffset().and(i32(0xf800)).or(i32(high).shl(u8(8)).or(i32(low)))));

///\00-0F
_(0, Nop);
_(2, addr16, addr => Mov(R.PC, ROM(addr)));
_(3, ()=>Mov(R.A, R.A.ror(u8(1))));
_A_d_$R_R(4, a => Mov(a, a.add(i8(1))));

///\10-1F
_('10', bit, offset, (byte, bit, offset, t=new Register1)=>[Mov(t, bool(byte.and(u8(1).shl(bit)))), Mov(byte, byte.and(u8(1).shl(bit).not())), If(t, Mov(R.PC, PCoffset(offset)))]);
// HACK stack may not work as expected, because 8051 does it strangely.
_('12', addr16, Call);
_('13', ()=>Mov(R.A, u8(R.A).shr(u8(1)).or(u8(F.C).shl(u8(7))))); // HACK FIXME needs to save new C.
_A_d_$R_R('14', a => Mov(a, a.sub(i8(1))));

///\20-2F
_('20', bit, offset, (byte, bit, offset)=>If(bool(byte.and(u8(1).shl(bit))), Mov(R.PC, PCoffset(offset))));
// HACK stack may not work as expected, because 8051 does it strangely.
_('22', ()=>[Mov(R.PC, Mem32(R.SP)), Mov(R.SP, R.SP.sub(i8(4)))]);
_('23', ()=>Mov(R.A, R.A.rol(u8(1))));
_i_d_$R_R('24', a => Mov(R.A, R.A.add(a)));

///\30-3F
_('30', bit, offset, (byte, bit, offset)=>If(byte.and(u8(1).shl(bit)).eq(i8(0)), Mov(R.PC, PCoffset(offset))));
// HACK stack may not work as expected, because 8051 does it strangely.
_('32', ()=>[FnCall('RETI'), Mov(R.PC, Mem32(R.SP)), Mov(R.SP, R.SP.sub(i8(4)))]);
_('33', ()=>Mov(R.A, R.A.shl(u8(1)).or(u8(F.C)))); // HACK FIXME needs to save new C.
_i_d_$R_R('34', a => Mov(R.A, ADC(R.A, a)));

///\40-4F
_('40', offset, offset => If(F.C, Mov(R.PC, PCoffset(offset))));
_('42', direct, a => Mov(a, a.or(R.A)));
_('43', direct, immed, (a, b)=>Mov(a, a.or(b)));
_i_d_$R_R('44', a => Mov(R.A, R.A.or(a)));

///\50-5F
_('50', offset, offset => If(F.C.not(), Mov(R.PC, PCoffset(offset))));
_('52', direct, a => Mov(a, a.and(R.A)));
_('53', direct, immed, (a, b)=>Mov(a, a.and(b)));
_i_d_$R_R('54', a => Mov(R.A, R.A.and(a)));

///\60-6F
_('60', offset, offset => If(R.A.eq(i8(0)), Mov(R.PC, PCoffset(offset))));
_('62', direct, a => Mov(a, a.xor(R.A)));
_('63', direct, immed, (a, b)=>Mov(a, a.xor(b)));
_i_d_$R_R('64', a => Mov(R.A, R.A.xor(a)));

///\70-7F
_('70', offset, offset => If(bool(R.A), Mov(R.PC, PCoffset(offset))));
_('72', bit, (byte, bit)=>Mov(F.C, F.C.or(bool(byte.and(u8(1).shl(bit))))));
_('73', ()=>Mov(R.PC, ROM(R.DPTR.add(R.A))));
_A_d_$R_R('74', immed, Mov);

///\80-8F
_('80', offset, offset => Mov(R.PC, PCoffset(offset)));
_('82', bit, (byte, bit)=>Mov(F.C, F.C.and(bool(byte.and(u8(1).shl(bit))))));
_('83', ()=>Mov(R.A, Mem8(ROM(PCoffset().add(R.A)))));
_('84', ()=>[Mov(R.A, R.A.div(R.B))]); // TODO Mov(R.B, R.A.mod(R.B)).
_d_$R_R('85', direct, Mov);

///\90-9F
_('90', immed16, a => Mov(R.DPTR, a));
_('92', bit, (byte, bit)=>Mov(byte, byte.or(u8(F.C).shl(bit))));
_('93', ()=>Mov(R.A, Mem8(ROM(R.DPTR.add(R.A)))));
_i_d_$R_R('94', (a, v=SBB(R.A, a))=>[Mov(F.C, v.CF || u1(0)), Mov(R.A, v)]);

///\A0-AF
_('A0', bit, (byte, bit)=>Mov(F.C, F.C.or(byte.and(u8(1).shl(bit)).eq(i8(0)))));
_('A2', bit, (byte, bit)=>Mov(F.C, bool(byte.and(u8(1).shl(bit)))));
_('A3', ()=>Mov(R.DPTR, R.DPTR.add(i8(1))));
_('A4', (t=new Register16)=>[Mov(t, u8(R.A).mul(R.B)), Mov(R.A, t), Mov(R.B, t.shr(u8(8)))]);
_('A5', ()=>FnCall('Reserved'));
_$R_R('A6', direct, (a, b)=>Mov(a, b));

///\B0-BF
_('B0', bit, (byte, bit)=>Mov(F.C, F.C.and(byte.and(u8(1).shl(bit)).eq(i8(0)))));
_('B2', bit, (byte, bit)=>Mov(byte, byte.xor(u8(1).shl(bit))));
_('B3', ()=>Mov(F.C, F.C.not()));
let CJNE = (a, b, offset)=>If(a.eq(b).not(), Mov(R.PC, PCoffset(offset))); // FIXME set C.
_('B4', immed, offset, (a, offset)=>CJNE(R.A, a, offset));
_('B5', direct, offset, (a, offset)=>CJNE(R.A, a, offset));
_$R_R('B6', immed, offset, (a, b, offset)=>CJNE(a, b, offset));

///\C0-CF
_('C0', direct, a => [Mov(R.SP, R.SP.add(i8(1))), Mov(Mem8(R.SP), a)]);
_('C2', bit, (byte, bit)=>Mov(byte, byte.and(u8(1).shl(bit).not())));
_('C3', ()=>Mov(F.C, u1(0)));
_('C4', ()=>Mov(R.A, u8(R.A).shl(u8(4)).or(u8(R.A).shr(u8(4)))));
_d_$R_R('C5', (a, t=new Register8)=>[Mov(t, a), Mov(a, R.A), Mov(R.A, t)]);

///\D0-DF
_('D0', direct, a => [Mov(R.SP, R.SP.sub(i8(1))), Mov(a, Mem8(R.SP))]);
_('D2', bit, (byte, bit)=>Mov(byte, byte.or(u8(1).shl(bit))));
_('D3', ()=>Mov(F.C, u1(1)));
_('D4', ()=>Mov(R.A, FnCall('DecimalAdjust', R.A, F.C/*, F.AC*/))); // TODO implement.
_('D5', direct, offset, (a, offset)=>[Mov(a, a.sub(i8(1))), If(bool(a), Mov(R.PC, PCoffset(offset)))]);
_$R('D6', (a, t=new Register8)=>[Mov(t, a), Mov(a, a.and(i8(0xf0)).or(R.A.and(i8(0x0f)))), Mov(R.A, R.A.and(i8(0xf0)).or(t.and(i8(0x0f))))]);
_R('D8', offset, (a, offset)=>[Mov(a, a.sub(i8(1))), If(bool(a), Mov(R.PC, PCoffset(offset)))]);

///\E0-EF
_('E0', ()=>Mov(R.A, Mem8(XRAM(R.DPTR))));
_('E2', ()=>Mov(R.A, Mem8(XRAM(R.RAM(i8(0))))));
_('E3', ()=>Mov(R.A, Mem8(XRAM(R.RAM(i8(1))))));
_('E4', ()=>Mov(R.A, i8(0)));
_d_$R_R('E5', a => Mov(R.A, a));

///\F0-FF
_('F0', ()=>Mov(Mem8(XRAM(R.DPTR)), R.A));
_('F2', ()=>Mov(Mem8(XRAM(R.RAM(i8(0)))), R.A));
_('F3', ()=>Mov(Mem8(XRAM(R.RAM(i8(1)))), R.A));
_('F4', ()=>Mov(R.A, R.A.not()));
_d_$R_R('F5', a => Mov(a, R.A));

fs.writeFileSync(__dirname+'/arch-8051.js', String.raw`/** @file arch-8051.js This file was auto-generated */
${_8051.runtime}
exports.dis = function _8051dis(b, i) {
${_8051.code().replace(/^(?=.)/gm, '\t').replace(/\t/g, '    ')}
}
exports.PC = R.PC;
exports.SP = R.SP;
exports.returnPC = Mem32(exports.SP); // FIXME proper stack handling, returnPC should be 16-bit.

exports.paddingLength = function(b, i) {
    var l;
    for(l = 0; i < b.length && b[i] === 0x00 /*NOP*/; i++, l++);
    return l;
};
`);
