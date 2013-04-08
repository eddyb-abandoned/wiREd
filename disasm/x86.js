var util = require('util');

Number.prototype.toBinary = function(n=-1) {
    var s = this.toString(2);
    while(s.length < n)
        s = '0'+s;
    return s;
};

import {Disasm, codegen} from 'Disasm.js';
const {Mov, Register, Mem, If, FnCall, Nop, Interrupt, int, uint, signed, unsigned, i8, i32, u1, u8, u32} = codegen.$;

const x86 = new Disasm;

let R = (reg, bits=32, type)=>/*uint[bits](*/new Register[bits](type ? u8(R.offsets[type]).add(u8(reg)) : u8(reg));
let F = f => R(f, 1);
R.offsets = {S: 16, FLAGS: 32};
x86.pushRuntime`var R = exports.R = {}, R1 = [], R8 = [], R16 = [], R32 = [];`;
{
    let r = (name, reg, bits=32, type)=>{
        R[name] = R(reg, bits, type);
        x86.pushRuntime`R.${name} = R${bits}[${type ? R.offsets[type]+reg : reg}] = /*u${bits}(*/new Register${bits}('${name}');`;
    };
    'ACDB'.split('').forEach((x,i)=>{
        r(x+'L',    i, 8);
        r(x+'H',    i+4, 8);
        r(x+'X',    i, 16);
        r('E'+x+'X',i, 32);
    });
    'ECSDFSG'.split('').forEach((x,i)=>{
        r(x+'S', i, 16, 'S');
    });
    'SP BP SI DI IP'.split(' ').forEach((x,i)=>{
        r(x, i+4, 16);
        r('E'+x, i+4, 32);
    });
    r('EFLAGS', 0, 32, 'FLAGS');

    'OCZSPVDI'.split('').forEach((x,i)=>{
        F[x] = F(i);
        r(x+'F', i, 1);
    });
}

const Cond = {
    O: F.O, NO: F.O.not(),
    B: F.C, AE: F.C.not(),
    Z: F.Z, NZ: F.Z.not(),
    BE: F.C.or(F.Z), A: F.C.not().and(F.Z.not()),
    S: F.S, NS: F.S.not(),
    P: F.P, NP: F.P.not(),
    L: F.O.eq(F.S).not(), GE: F.O.eq(F.S),
    LE: F.Z.or(F.O.eq(F.S).not()), G: F.Z.not().and(F.O.eq(F.S))
};

function _op(def, b, fn) {
    b = b.map(x => x.toBinary(8));
    var args = [], hasModRM, ModRM, immIdx, immLengthBias = 0, byteLen, imm = [], ctReg = false, reg = 'Reg';
    def = def.replace(/^reg=(\d+):/i, (s, x)=>((ctReg = true, reg = (+x).toBinary(3)), ''));
    var getBits = s => { // FIXME 16bit 64bit.
        if(s == 'b') return 8;
        if(s == 'c' || s == 'w') return 16;
        if(s == 'd' || s == 'v' || s == 'z') return 32;
        throw new TypeError('Unimplemented operand size '+s);
    };

    def = def.trim();
    def && def.split(' ').forEach((x, i)=>{
        if(/^[RE]?([ABCD]X|[SBI]P|[SD]I)|[ABCD][HL]|[ECSDFSG]S$/.test(x))
            args[i] = ()=>R[x]; // FIXME actual regs.
        else if(/^[re]([ABCD]X|[SBI]P|[SD]I)$/.test(x))
            args[i] = ()=>R['E'+x.slice(1)]; // FIXME 16bit 64bit.
        else if(x == 'J') // HACK to have access to the EIP after the current instruction.
            args[i] = ()=>R.EIP.add(byteLen);
        else if(x == 'M')
            hasModRM = 2, args[i] = (...args)=>ModRM(32, ...args.slice(ctReg?0:1)).addr;
        else {
            if(!/^[A-Z][a-z]$/.test(x))
                throw new TypeError('Unimplemented operand specifier '+x);
            let kind = x[0], bits = getBits(x[1]);
            if(kind == 'E')
                hasModRM = 1, args[i] = (...args)=>ModRM(bits, ...args.slice(ctReg?0:1));
            else if(kind == 'G')
                hasModRM = 1, args[i] = reg => R(reg, bits);
            else if(kind == 'S')
                hasModRM = 1, args[i] = reg => R(reg, bits, 'S');
            else if(kind == 'F')
                args[i] = ()=>R(0, bits, 'FLAGS');
            else if(kind == 'X')
                args[i] = ()=>Mem[bits](R.ESI);
            else if(kind == 'Y')
                args[i] = ()=>Mem[bits](R.EDI);
            else if(kind == 'I') {
                let j = imm.push(['Imm_____', 'Imm_____________', null, 'Imm_____________________________'][bits/8-1])-1;
                args[i] = ()=>int[bits](arguments[immIdx+j]);
            } else if(kind == 'J') { // FIXME negative offsets.
                let j = imm.push(['Imm_____', 'Imm_____________', null, 'Imm_____________________________'][bits/8-1])-1;
                args[i] = ()=>R.EIP.add(int[bits](arguments[immIdx+j]).add(byteLen));
            } else if(kind == 'O') {
                let j = imm.push('Offset__________________________')-1;
                args[i] = ()=>Mem[bits](arguments[immIdx+j]);
            } else
                throw new TypeError('Unimplemented operand kind '+kind);
        }
    });
    let op = (mid=[], n=0, modRM=null)=>{
        immIdx = n + (!ctReg && hasModRM ? 1 : 0);
        var bytes = b.concat(mid).concat(imm), actualLengthBias = i8({code: ()=>'_pfxLength', bitsof: 8, signed: true, runtimeKnown: true});
        byteLen = i8(bytes.join('').length / 8).add(actualLengthBias);
        ModRM = modRM;
        return x86.op(bytes, (...a)=>{
            var res = fn(...args.map(x => x(...a)));
            return Array.isArray(res) ? res : [res];
        }, {actualLengthBias});
    }
    if(!hasModRM)
        op();
    else {
        if(hasModRM != 3) {
            let applySIB = (mod, extra=[], n=0, fn=x => x)=>{ // FIXME 16bit 64bit.
                op([mod+reg+'Rm_', ...extra], 1+n, (bits, RM, ...rest)=>Mem[bits](fn(R(RM), ...rest)));
                op([mod+reg+'100', 'SiIdxBas', ...extra], 3+n, (bits, scale, idx, base, ...rest)=>Mem[bits](fn(R(base).add(R(idx).shl(scale)), ...rest)));
                op([mod+reg+'100', 'Si100Bas', ...extra], 2+n, (bits, scale, base, ...rest)=>Mem[bits](fn(R(base), ...rest)));
                let newFn = (...x)=>R.EBP.add(signed(fn(...x)));
                if(mod == '00') {
                    extra = ['Disp____________________________'];
                    n = 1;
                    newFn = (x, disp32)=>x.add(signed(disp32));
                }
                op([mod+reg+'100', 'SiIdx101', ...extra], 2+n, (bits, scale, idx, ...rest)=>Mem[bits](newFn(R(idx).shl(scale), ...rest)));
                op([mod+reg+'100', 'Si100101', ...extra], 1+n, (bits, scale, ...rest)=>Mem[bits](newFn(uint[bits](0), ...rest)));
            };
            applySIB('00');
            applySIB('01', ['Disp____'], 1, (x, disp8)=>x.add(signed(disp8)));
            applySIB('10', ['Disp____________________________'], 1, (x, disp32)=>x.add(signed(disp32)));
            op(['00'+reg+'101', 'Disp____________________________'], 1, (bits, disp32)=>Mem[bits](disp32));
        }
        if(hasModRM != 2)
            op(['11'+reg+'Rm_'], 1, (bits, RM)=>R(RM, bits));
    }
}

let opMov = fn => x => Mov(x, fn(...arguments));
let _ = (s, ...args)=>(base, fn=base)=>{
    s = s.map((x, i)=>i?args[i-1]+x:x).join('');
    s = s.replace(/^((?:[a-f0-9]{2})+):/i, (s, x)=>((base = x.match(/../g).map(x => parseInt(x, 16))), ''));
    var extra = '';
    s = s.replace(/^.*:/, x => ((extra=x),''));
    if(fn === base)
        throw new TypeError('Missing base');
    if(!Array.isArray(base))
        base = [base];
    s.split(';').forEach((x, i)=>{
        var b = base.slice();
        b.splice(-1, 1, b[b.length-1]+i);
        return _op(extra+x, b, fn);
    });
};

let [ADD, OR, ADC, SBB, AND, XOR, INC, DEC, NOT] = [(a, b)=>a.add(b), (a, b)=>a.or(b), (a, b)=>a.add(b).add(F.C), (a, b)=>a.sub(b).sub(F.C), (a, b)=>a.and(b), (a, b)=>a.xor(b), x => x.add(u8(1)), x => x.sub(u8(1)), x => x.not()].map(opMov);
let NEG = (x, v=x.neg())=>[Mov(F.C, v.CF || u1(0)), Mov(x, v)/*HACK out-of-order so the updated value isn't used*/];
let CMP = (a, b, v=a.sub(b))=>[Mov(F.Z, v.ZF || v.eq(u8(0))), Mov(F.C, v.CF || u1(0))]; // FIXME all teh flags.
let SUB = (a, b, v=a.sub(b))=>[Mov(F.Z, v.ZF || v.eq(u8(0))), Mov(F.C, v.CF || u1(0)), Mov(a, v)/*HACK out-of-order so the updated value isn't used*/]; // FIXME all teh flags.
let TEST = (a, b, v=a.and(b))=>[Mov(F.Z, v.ZF || v.eq(u8(0))), Mov(F.C, u1(0)), Mov(F.O, u1(0))]; // FIXME all teh flags.
let PUSH = x => [Mov(R.ESP, R.ESP.sub(u8(x.bitsof/8))), Mov(Mem[x.bitsof](R.ESP), x)];
let POP =  x => [Mov(x, Mem[x.bitsof](R.ESP)), Mov(R.ESP, R.ESP.add(u8(x.bitsof/8)))];
let INT = Interrupt;
let JMPN = j => Mov(R.EIP, j), CALLN = (EIP, j)=>[...PUSH(EIP), Mov(R.EIP, j)];
let MOVSX = (a, b)=>Mov(a, int[a.bitsof](b));
let XCHG = (a, b, t=new Register[a.bitsof])=>[Mov(t, a), Mov(a, b), Mov(b, t)];

/// One-byte opcodes.
///\00-0F
_`00:Eb Gb;Ev Gv;Gb Eb;Gv Ev;AL Ib;rAX Iz`(ADD);
_`06:ES`(PUSH);/*i64*/ _`07:ES`(POP);/*i64*/
_`08:Eb Gb;Ev Gv;Gb Eb;Gv Ev;AL Ib;rAX Iz`(OR);
_`0E:CS`(PUSH);/*i64*/ /* 0x0F 2-byte escape code */

///\10-1F
_`10:Eb Gb;Ev Gv;Gb Eb;Gv Ev;AL Ib;rAX Iz`(ADC);
_`16:SS`(PUSH);/*i64*/ _`17:SS`(POP);/*i64*/
_`18:Eb Gb;Ev Gv;Gb Eb;Gv Ev;AL Ib;rAX Iz`(SBB);
_`1E:DS`(PUSH);/*i64*/ _`1F:DS`(POP);/*i64*/

///\20-2F
_`20:Eb Gb;Ev Gv;Gb Eb;Gv Ev;AL Ib;rAX Iz`(AND);
/* 0x26 SEG=ES (prefix) */ /* 0x27 DAA i64 */
_`28:Eb Gb;Ev Gv;Gb Eb;Gv Ev;AL Ib;rAX Iz`(SUB);
/* 0x2E SEG=CS (prefix) */ /* 0x2F DAS i64 */

///\30-3F
_`30:Eb Gb;Ev Gv;Gb Eb;Gv Ev;AL Ib;rAX Iz`(XOR);
/* 0x36 SEG=SS (prefix) */ /* 0x37 AAA i64 */
_`38:Eb Gb;Ev Gv;Gb Eb;Gv Ev;AL Ib;rAX Iz`(CMP);
/* 0x3E SEG=DS (prefix) */ /* 0x3F AAS i64 */

///\40-4F
_`40:eAX;eCX;eDX;eBX;eSP;eBP;eSI;eDI`(INC);/*i64*/
_`48:eAX;eCX;eDX;eBX;eSP;eBP;eSI;eDI`(DEC);/*i64*/

///\50-5F
_`50:eAX;eCX;eDX;eBX;eSP;eBP;eSI;eDI`(PUSH);/*d64*/
_`58:eAX;eCX;eDX;eBX;eSP;eBP;eSI;eDI`(POP);/*d64*/

///\60-6F
// TODO more opcodes.
_`68:Iz`(PUSH);/*d64*/
_`69:Gv Ev Iz`((a, b, c)=>Mov(a, b.mul(c))); // FIXME IMUL (signed)
_`6A:Ib`(x => PUSH(i32(x)));/*d64*/
_`6B:Gv Ev Ib`((a, b, c)=>Mov(a, b.mul(i32(c)))); // FIXME IMUL (signed)

///\70-7F
Object.keys(Cond).map((x, i)=>_`Jb`(0x70+i, j => If(Cond[x], JMPN(j))));

///\80-8F
/* HACK forces proper behavior for u32 op= imm8 for OR and AND.*/
[ADD, (a, b)=>OR(a, uint[a.bitsof](b)), ADC, SBB, (a, b)=>AND(a, uint[a.bitsof](b)), SUB, XOR, CMP].map((fn, i)=>_`80:reg=${i}:Eb Ib;Ev Iz;Eb Ib;Ev Ib`(fn));/*82 i64*/
_`84:Eb Gb;Ev Gv`(TEST); _`86:Eb Gb;Ev Gv`(XCHG);
_`88:Eb Gb;Ev Gv;Gb Eb;Gv Ev;Ev Sw;Gv M;Sw Ew`(Mov);
_`8F:reg=0:Ev`(POP);

///\90-9F
_`90:`(Nop);
_`91:rAX rCX;rAX rDX;rAX rBX;rAX rSP;rAX rBP;rAX rSI;rAX rDI`(XCHG);
_`98:rAX AX`((a, b)=>Mov(a, int[a.bitsof](b)));
_`99:rDX rAX`((a, b)=>Mov(a, int[a.bitsof](b.lt(u8(0))).neg()));
_`9C:Fv`(PUSH);
_`9D:Fv`(POP);

///\A0-AF
// TODO more opcodes.
_`A0:AL Ob;rAX Ov;Ob AL;Ov rAX`(Mov);
_`A4:Xb Yb;Xv Yv`(Mov); // FIXME MOVS.
_`A8:AL Ib;rAX Iz`(TEST);
_`AA:Yb AL;Yv rAX`(Mov); // FIXME STOS.
_`AC:AL Xb;rAX Xv`(Mov); // FIXME LDOS.
_`AE:AL Yb;rAX Xv`(CMP); // FIXME SCAS.

///\B0-BF
_`B0:AL Ib;CL Ib;DL Ib;BL Ib;AH Ib;CH Ib;DH Ib;BH Ib`(Mov);
_`B8:rAX Iv;rCX Iv;rDX Iv;rBX Iv;rSP Iv;rBP Iv;rSI Iv;rDI Iv`(Mov);

///\C0-CF
// TODO more opcodes.
_`C2:Iw`(x => [...POP(R.EIP), Mov(R.ESP, R.ESP.add(x))]);/*f64*/
_`C3:`(x => POP(R.EIP));/*f64*/
_`C6:reg=0:Eb Ib;Ev Iz`(Mov);
_`C9:`(()=>[Mov(R.ESP, R.EBP), ...POP(R.EBP)]);
_`CC:`(()=>INT(u8(3)));

///\D0-DF
// TODO more opcodes (escape to FPU).
[(a, b)=>a.rol(b), (a, b)=>a.ror(b), (a, b)=>a.rol(b)/*FIXME RCL*/, (a, b)=>a.ror(b)/*FIXME RCR*/, (a, b)=>a.shl(b), (a, b)=>unsigned(a).shr(b), (a, b)=>a.shl(b)/*WARNING UNDEFINED*/, (a, b)=>signed(a).shr(b)].forEach((fn, i)=>{
    _`C0:reg=${i}:Eb Ib;Ev Ib`(opMov(fn)); // FIXME out of place  ^^.
    _`D0:reg=${i}:Eb;Ev`(opMov(x => fn(x, u8(1))));
    _`D2:reg=${i}:Eb CL;Ev CL`(opMov(fn));
});

///\E0-EF
// TODO more opcodes.
_`E0:eCX Jb`((count, j)=>[DEC(count), If(count.eq(count.type(0)).not().and(F.Z.not()), JMPN(j))]);
_`E1:eCX Jb`((count, j)=>[DEC(count), If(count.eq(count.type(0)).not().and(F.Z), JMPN(j))]);
_`E2:eCX Jb`((count, j)=>[DEC(count), If(count.eq(count.type(0)).not(), JMPN(j))]);
_`E8:J Jz`(CALLN);/*f64*/
_`E9:Jz`(JMPN);/*f64*/
_`EB:Jb`(JMPN);/*f64*/

///\F0-FF
// TODO more opcodes.
_`F6:reg=0:Eb Ib;Ev Iz`(TEST);
[NOT, NEG, /*MUL IMUL DIV IDIV AL/rAX*/].map((fn, i)=>_`F6:reg=${i+2}:Eb;Ev`(fn));
_`F6:reg=4:AX AL Eb;EAX EAX Ev`((d, s1, s2)=>Mov(d, s1.mul(s2))); // FIXME EDX:EAX.
_`F6:reg=5:AX AL Eb;EAX EAX Ev`((d, s1, s2)=>Mov(d, s1.mul(s2))); // FIXME EDX:EAX. IMUL (signed)
_`F6:reg=6:AX AL Eb;EAX EAX Ev`((d, s1, s2)=>Mov(d, s1.div(s2))); // FIXME EDX:EAX.
_`F6:reg=7:AX AL Eb;EAX EAX Ev`((d, s1, s2)=>Mov(d, s1.div(s2))); // FIXME EDX:EAX. IDIV (signed)
_`F8:`(()=>Mov(F.C, u1(0))); _`F9:`(()=>Mov(F.C, u1(1)));
_`FA:`(()=>Mov(F.I, u1(0))); _`FB:`(()=>Mov(F.I, u1(1)));
_`FC:`(()=>Mov(F.D, u1(0))); _`FD:`(()=>Mov(F.D, u1(1)));
[INC, DEC].map((fn, i)=>_`FE:reg=${i}:Eb;Ev`(fn));
[CALLN/*f64*/, /*CALLF*/, (EIP, j)=>JMPN(j)/*f64*/, /*JMPF*/].map((fn, i)=>_`FF:reg=${i+2}:J Ev`(fn));
_`FF:reg=6:Ev`(PUSH);/*d64*/

/// Two-byte opcodes.
///\0F80-0F8F
Object.keys(Cond).map((x, i)=>_`Jz`([0x0F, 0x80+i], j => If(Cond[x], Mov(R.EIP, j))));

///\0F90-0F9F
Object.keys(Cond).map((x, i)=>_`Eb`([0x0F, 0x90+i], a => Mov(a, Cond[x])));

let bool = x => x.eq(u8(0)).not(); // HACK
///\0FA0-0FAF
_`0FA2:`(()=>FnCall('CPUID', R.EAX, R.EBX, R.ECX, R.EDX)); // FIXME CPUID
_`0FA3:Ev Gv`((a, b)=>Mov(F.C, bool(a.and(uint[a.bitsof](1).shl(b)))));
_`0FA4:Ev Gv Ib;Ev Gv CL`(opMov((dest, src, count)=>dest.shl(count).or(src.shr(u8(src.bitsof).sub(count)))));
_`0FAB:Ev Gv`((a, b)=>[Mov(F.C, bool(a.and(uint[a.bitsof](1).shl(b)))), Mov(a, a.or(uint[a.bitsof](1).shl(b)))]);
_`0FAC:Ev Gv Ib;Ev Gv CL`(opMov((dest, src, count)=>dest.shr(count).or(src.and(u32(1).shl(count).sub(u32(1)).shl(u8(src.bitsof).sub(count))))));
_`0FAF:Gv Ev`((a, b, sa=signed(a), sb=signed(b))=>Mov(sa, sa.mul(sb)));

///\0FB0-0FBF
_`0FB6:Gv Eb;Gv Ew`(Mov);
_`0FBE:Gv Eb;Gv Ew`(MOVSX);

///\0FC0-0FCF
_`0FC8:rAX;rCX;rDX;rBX;rSP;rBP;rSI;rDI`(opMov(x => x.shr(u8(24)).or(x.shr(u8(8)).and(u32(0xff00))).or(x.shl(u8(8)).and(u32(0xff000))).or(x.shl(u8(24))))); // HACK BSWAP

x86.out(__dirname+'/arch-x86.js', code => String.raw`/** @file arch-x86.js This file was auto-generated */
${x86.runtime}
exports.dis = function x86dis(b, i) {
    // HACK allows skipping prefixes.
    var _pfxLength = 0, _pfxSizeSpecifier = false;
    for(; b[i] >= 0x64 && b[i] <= 0x67 || b[i] == 0xF0 || b[i] == 0xF2 || b[i] == 0xF3 || b[i] == 0x26 || b[i] == 0x2E || b[i] == 0x36 || b[i] == 0x3E; i++, _pfxLength++) {
        if(b[i] == 0x66)
            _pfxSizeSpecifier = true;
        else
            console.error('[PREFIX] '+b[i].toString(16).toUpperCase());
    }
${code.replace(/\t/g, '    ')}
}
exports.PC = R.EIP;
exports.SP = R.ESP;
exports.FP = R.EBP;
`);