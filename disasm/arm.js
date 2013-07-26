var fs = require('fs');

import {Disasm, codegen, filters} from 'Disasm.js';
const {Register, Register32, Mem, Mem32, If, FnCall, Nop, Interrupt, int, uint, signed, unsigned, i8, i32, i64, u1, u8, u16, u32, u64, float} = codegen.$;

const arm = new Disasm;

const R = (reg, bits=32, type)=>new Register[bits](type ? u8(R.offsets[type]).add(u8(reg)) : u8(reg));
const F = f => R(f, 1);
R.offsets = {CC: 16, VFP: 32};
arm.pushRuntime`var R = exports.R = [], R1 = [], R32 = [], R64 = [];
Object.defineProperty(R, 'byName', {value: {}});`;
{
    let r = (name, reg, bits=32, type)=>{
        arm.pushRuntime`R.push(R.byName.${name} = R${bits}[${type ? R.offsets[type]+reg : reg}] = new Register${bits}('${name}'));`;
        return R[name] = R(reg, bits, type);
    };

    for(let i = 0; i < 11; i++)
        r('R'+i, i);

    r('FP', 11);
    r('IP', 12);
    r('SP', 13);
    r('LR', 14);
    r('PC', 15);

    r('CPSR', 16);

    'QVCZN'.split('').forEach((x, i)=>{
        F[x] = r('CPSR_'+x, i, 1);
    });

    // VFP.
    for(let bits of [32, 64])
        for(let i = 0; i < 32; i++) {
            r((bits === 32 ? 'S' : 'D')+i, i, bits, 'VFP').type = float[bits]; // HACK
            arm.pushRuntime`R${bits}[${R.offsets.VFP+i}].type = float[${bits}];`; // HACK
        }
}

const Mov = (a, b)=>codegen.$.Mov(a.isPC ? R.PC : a, b);

const Cond = {
    EQ: F.Z, NE: F.Z.not(),
    CS: F.C, CC: F.C.not(),
    MI: F.N, PL: F.N.not(),
    VS: F.V, VC: F.V.not(),
    HI: F.C.and(F.Z.not()), LS: F.C.not().or(F.Z),
    GE: F.N.eq(F.V).not(), LT: F.N.eq(F.V),
    GT: F.Z.not().and(F.N.eq(F.V)), LE: F.Z.or(F.N.eq(F.V).not()),
    AL: u1(1), NV: u1(0)
};
Object.keys(Cond).forEach((k, i)=>{
    arm.pushRuntime`R1[${R.offsets.CC + i}] = ${Cond[k].code()};`;
});

filters.Zero = function(next, ct) {
    var ct2 = ct.slice();
    for(var i = 0; i < this.len; i++)
        ct2[this.posAt(i)] = 0;
    next(0, ct2);
};

filters.R = function(next, ct) {
    var ct2 = ct.slice();
    for(var i = 0; i < 4; i++)
        ct2[this.posAt(i)] = 1;
    var pc = R.PC.add(i32(8));
    pc.isPC = true;
    next(pc, ct2);
    next(R(this));
};

filters.Shift = function(next, ct, k, vals) {
    var f = typeof ct[this.pos] === 'number' ? ct[this.pos] : false;
    var imm = this.slice(' ', 3), reg = this.slice('Rs', 4);
    const cases = [(a, b)=>a.shl(u8(b)), (a, b)=>unsigned(a).shr(u8(b)), (a, b)=>signed(a).shr(u8(b)), (a, b)=>a.ror(u8(b))];
    const cases0 = [x => x, x => unsigned(x).shr(u8(32)), x => signed(x).shr(u8(32)), x => x.ror(u8(1))/* FIXME RRX */];
    for(let i = 0; i < 4; i++) {
        ct[this.posAt(1)] = i&1; ct[this.posAt(2)] = i>>1;
        if(!f) {
            var ct2 = ct.slice();
            ct2[this.pos] = 0;
            next(x => cases[i](x, imm), ct2);

            var ct3 = ct2.slice();
            for(var j = 0; j < imm.len; j++)
                ct3[imm.posAt(j)] = 0;
            next(x => cases0[i](x), ct3);
        }
        if(f === false || f) {
            var ct2 = ct.slice();
            ct2[this.pos] = 1;
            ct2[this.posAt(3)] = 0;
            reg.filter((reg, ct3)=>next(x => cases[i](x, 0), ct3 || ct2), ct2, 0, vals);
        }
    }
};

filters.Imm$regshift = function(next, ct, k, vals) {
    if(!vals.byName.I)
        return next(i32(this));
    ct[this.posAt(4)] = 0;
    this.slice('Rm', 0, 4).filter((Rs, ct2=ct)=>{
        this.slice('Shift', 4, 12).filter((shift, ct3=ct2)=>next(shift(Rs), ct3), ct2, 0, vals);
    }, ct, 0, vals);
};

filters.Immrot$regsh = function(next, ct, k, vals) {
    if(vals.byName.I)
        return next(i32(this.slice(' ', 0, 8)).ror(u8(this.slice(' ', 8, 12)).shl(u8(1))));
    this.slice('Rm', 0, 4).filter((Rs, ct2=ct)=>{
        this.slice('Shift', 4, 12).filter((shift, ct3=ct2)=>next(shift(Rs), ct3), ct2, 0, vals);
    }, ct, 0, vals);
};

filters.Reglist = function(next) {
    var r = [];
    for(let i = 0; i < 16; i++)
        r[i] = [R(i), u1(this.slice(' ', i, i+1))];
    next(r);
};

let op = (...args)=> f => arm.op(['Cond'+String.raw(...args)], (Cond, ...args)=>{
    let r = f(...args);
    if(!r)
        return r;
    r = r.filter(x => x);
    Cond = u8(Cond);
    let always = Cond.eq(u8(0xe));
    return [If(always, r), If(always.not(), If(R(Cond, 1, 'CC')/* HACK access the cached CCs, from 1-bit "registers" */, r))];
});
let _ = op;

[
    ['and', 1], ['xor', 1],
    ['sub', 0], ['rsb', 0, (a, b)=>b.sub(a)],

    ['add', 0], ['adc', 0, (a, b)=>a.add(b.add(F.C))],
    ['sbc', 0, (a, b)=>a.sub(b).sub(F.C)], ['rsc', 0, (a, b)=>b.sub(a).sub(F.C)],

    ['tst', 1|2, 'and'], ['teq', 1|2, 'xor'],
    ['cmp', 0|2, 'sub'], ['cmn', 0|2, 'add'],

    ['orr', 1, 'or'],
    ['mov', 1, (a, b)=>b],
    ['bic', 1, (a, b)=>a.and(b.not())],
    ['mvn', 1, (a, b)=>b.not()]
].forEach(([name, f, fn=name], i)=>{
    // NOTE name isn't used.
    if(typeof fn === 'string') {
        let fnName = fn;
        fn = (a, b)=>a[fnName](b);
    }
    const logical = f & 1, test = f & 2;
    _`00I${i.toBinary(4)}S${name === 'mov' || name === 'mvn' ? 'Zero' : 'Rn__'}Rd__Immrot$regsh`((I, S, Rn, Rd, src)=>{
        if(test && !S)
            return;
        var v = fn(Rn, src), r = [];
        if(!test)
            r.push(Mov(Rd, v));
        if(S) {
            // TODO Rd=15 S=1 - instead of changing flags, it does CPSR <- SPSR
            if(Rd.isPC)
                return;

            if(logical) {
                // TODO C <- shifter carry.
            } else {
                // TODO V <- sign bit overflow (a.N == b.N && F.N != a.N).
                // TODO C <- ALU carry.
            }
            r.unshift(Mov(F.Z, v.ZF || v.eq(u8(0))), Mov(F.C, v.CF || u1(0)));
        }
        return r;
    });

});

// mrs
_`00010P001111Rd__000000000000`((P, Rd)=>!P && [Mov(Rd, R.CPSR)]); // TODO P=1
// msr
_`00010P101001111100000000Rm__`((P, Rm)=>!P && [Mov(R.CPSR, Rm)]); // TODO P=1

// mul mla
_`000000ASRd__Rn__Rs__1001Rm__`((A, S, Rd, Rn, Rs, Rm, m=Rn.mul(Rm))=>
   [Mov(Rd, A ? Rd.add(m) : m), S&&Mov(F.Z, m.ZF || u1(0)), S&&Mov(F.N, m.NF || u1(0))]);
// umull umlal smull smlal
_`00001UASRdhiRdloRs__1001Rm__`((U/* NOTE U=0 => unsigned */, A, S, RdHi, RdLo, Rs, Rm, m=(U ? i64 : u64)(Rs).mul(Rm))=>
   [Mov(RdLo, A ? RdLo.add(m) : m), Mov(RdHi, A ? RdHi.add(m.shr(u8(32))) : m.shr(u8(32))), S&&Mov(F.Z, m.ZF || u1(0)), S&&Mov(F.N, m.NF || u1(0))]);

// swp
// FIXME this is actually wrong, swp doesn't work that way.
// NOTE it's deprecated anyway in ARMv6 or so.
//op`00010B00Rn__Rd__00001001Rm__`((B, Rn, Rd, Rm)=>
//   [Swap(Mem[B ? 8 : 32](Rn.add(Rd)), Mem[B ? 8 : 32](Rn.add(Rm)))]);

// ldrh strh
_`000PU0WLRn__Rd__00001011Rm__`((P, U, W, L, Rn, Rd, Rm, a=Rn.add(U ? Rm : Rm.neg()), m=unsigned(Mem[16](P?a:Rn)))=>
    (P||!W) && [L?Mov(Rd, m):Mov(m, Rd), (W||!P)&&Mov(Rn, a)]);
// ldrh strh
_`000PU1WLRn__Rd__Hi__1011Lo__`((P, U, W, L, Rn, Rd, Hi, Lo, off=u8(Hi).shl(u8(4)).or(u8(Lo)), a=Rn.add(U ? off : off.neg()), m=unsigned(Mem[16](P?a:Rn)))=>
    (P||!W) && [L?Mov(Rd, m):Mov(m, Rd), (W||!P)&&Mov(Rn, a)]);
// ldrsb strsb
_`000PU1WLRn__Rt__Hi__1101Lo__`((P, U, W, L, Rn, Rt, Hi, Lo, off=u8(Hi).shl(u8(4)).or(u8(Lo)), a=Rn.add(U ? off : off.neg()), m=signed(Mem[8](P?a:Rn)))=>
    (P||!W) && [L?Mov(Rt, m):Mov(m, Rt), (W||!P)&&Mov(Rn, a)]);
// ldrd strd
_`000PU1W0Rn__T__0Hi__11S1Lo__`((P, U, W, Rn, T, Hi, S, Lo, off=u8(Hi).shl(u8(4)).or(u8(Lo)), a=Rn.add(U ? off : off.neg()), m=Mem[32](P?a:Rn), m2=Mem[32](P?a.add(u8(4)):Rn), t=u8(T).shl(u8(1)), t2=t.add(u8(1)))=>
    (P||!W) && [S?Mov(m, R(t)):Mov(R(t), m), S?Mov(m2, R(t2)):Mov(R(t2), m2), (W||!P)&&Mov(Rn, a)]);

// bx blx
_`0001001011111111111100L1Rm__`((L, Rm)=>[L&&Mov(R.LR, R.PC.add(i32(4))), Mov(R.PC, Rm)]);

// clz TODO
_`000101101111Rd__11110001Rm__`((Rd, Rm)=>[Mov(Rd, u8(FnCall('clz', Rm)))]);

// movw
_`00110000Imm_Rd__Imm_________`((imm4, Rd, imm12)=>[Mov(Rd, u16(imm4).shl(u8(12)).or(imm12))]);
// movt
_`00110100Imm_Rd__Imm_________`((imm4, Rd, imm12)=>[Mov(Rd, i32(u16(Rd)).or(i32(u16(imm4).shl(u8(12)).or(imm12)).shl(u8(16))))]);

// ldr str
_`01IPUBWLRn__Rd__Imm$regshift`((I, P, U, B, W, L, Rn, Rd, src, a=Rn.add(U ? src : src.neg()), m=(B ? unsigned : signed)(Mem[B ? 8 : 32](P?a:Rn)))=>
    (P||!W) && [L?Mov(Rd, m):Mov(m, Rd), (W||!P)&&Mov(Rn, a)]);

// sxtb utxb sxth utxh
_`01101U1H1111Rd__Im000111Rm__`((U, H, Rd, imm, Rm)=>[Mov(Rd, (U ? uint : int)[H ? 16 : 8](Rm.ror(u8(imm).shl(u8(3)))))]);
// bfi
_`0111110Msb__Rd__Lsb__001Rn__`((msb, Rd, lsb, Rn, mask=i32(2).shl(u8(msb).sub(u8(lsb))).sub(i32(1)))=>[Mov(Rd, Rd.and(mask.shl(lsb).not()).or(Rn.and(mask).shl(lsb)))]);
// bfc
_`0111110Msb__Rd__Lsb__0011111`((msb, Rd, lsb)=>[Mov(Rd, Rd.and(i32(2).shl(u8(msb).sub(u8(lsb))).sub(i32(1)).shl(lsb).not()))]);

// ud FIXME not conditional (Cond=1110) TODO
_`01111111A___________1111B___`((A, B)=>[FnCall('UD', A, B)]);

// ldm stm
_`100PUSWLRn__Reglist_________`((P, U, S, W, L, Rn, regs, t=new Register32, a=t.add(i32(U ? 4 : -4)), m=Mem32(t))=>
    [Mov(t, Rn), ...(U ? regs : regs.slice().reverse()).map(([r, cond])=>If(cond, [P&&Mov(t, a), L?Mov(r, m):Mov(m, r), !P&&Mov(t, a)])), W && Mov(Rn, t)]);
// b bl
_`101LO_______________________`((L, O)=>
    [L&&Mov(R.LR, R.PC.add(i32(4))), Mov(R.PC, R.PC.add(i32(8)).add(i32(O).shl(u8(8)).shr(u8(6))))]);
// mcr TODO
_`1110Op_0Crn_Rd__CpnmOp_1Crm_`((op1, CRn, Rd, cp_num, op2, CRm)=>[FnCall('mcr', u8(cp_num), Rd, u8(CRn), u8(CRm), u8(op1), u8(op2))]);
// swi
_`1111Comment_________________`(Comment => [Interrupt(Comment)]);

/// VFP
for(let double of [false, true]) {
    let _ = (...args)=>op`11${String.raw(...args).replace(/....(.{8})$/, '101'+(double ? '1' : '0')+'$1')}`;
    let bits = double ? 64 : 32;
    let V = v => R(v, bits, 'VFP');
    let Vlist = (v, n)=>{
        n = u8(n);
        if(double)
            n = n.shr(u8(1));
        var r = [];
        for(let i = 0; i < (double ? 16 : 32); i++)
            r[i] = [V(v.add(u8(i))), u8(i).lt(n)];
        return r;
    };
    filters.V = function(next, ct, k, vals) {
        var Vn = u8(this), N = u8(vals.byName[this.name[1].toUpperCase()]);
        var v = double ? N.shl(u8(4)).or(Vn) : Vn.shl(u8(1)).or(N);
        v.r = V(v);
        next(v);
    };

    // vldm vstm FIXME: almost duplicated from ldm stm
    _`0PUDWLRn__Vd__    000Imm__`((P, U, D, W, L, Rn, Vd, imm8, regs=Vlist(Vd, imm8), t=new Register32, a=t.add(i32(U ? bits/8 : -bits/8)), m=Mem[bits](t))=>
        [Mov(t, Rn), ...(U ? regs : regs.slice().reverse()).map(([r, cond])=>If(cond, [P&&Mov(t, a), L?Mov(r, m):Mov(m, r), !P&&Mov(t, a)])), W && Mov(Rn, t)]);
}

fs.writeFileSync(__dirname+'/arch-arm.js', String.raw`/** @file arch-arm.js This file was auto-generated */
${arm.runtime}
exports.dis = function armdis(b, i) {
${arm.code().replace(/^(?=.)/gm, '\t').replace(/\t/g, '    ')}
}
exports.PC = R.byName.PC;
exports.SP = R.byName.SP;
exports.FP = R.byName.FP;
exports.returnPC = R.byName.LR;
`);
