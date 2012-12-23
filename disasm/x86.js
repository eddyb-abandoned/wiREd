var dis = require('./Disasm.jsc'), util = require('util');

Number.prototype.toBinary = function(n=-1) {
    var s = this.toString(2);
    while(s.length < n)
        s = '0'+s;
    return s;
};

let raw = ({raw: s}, ...args)=>s.map((x, i)=>i?args[i-1]+x:x).join('');

let R = (reg, size=4, type=''+size*8)=>({size, bitsof: size*8, inspect: ()=>'r'+util.inspect(reg)+'/'+size*8, codeGen: ()=>'R'+type+'['+dis.codeGen(reg)+']'});
dis.codeGen.runtime.push(`var R = exports.R = {}, R8 = [], R16 = [], R32 = [], RS = [];`);
{
    let r = (name, reg, size=4, type=''+size*8)=>{
        R[name] = R(reg, size, type);
        dis.codeGen.runtime.push(`R.${name} = R${type}[${reg}] = {inspect: function() {return '${name}';}};`);
    };
    'ACDB'.split('').forEach((x,i)=>{
        r(x+'L',    i, 1);
        r(x+'H',    i+4, 1);
        r(x+'X',    i, 2);
        r('E'+x+'X',i, 4);
    });
    'ECSDFSG'.split('').forEach((x,i)=>{
        r(x+'S', i, 2, 'S');
    });
    'SP BP SI DI IP'.split(' ').forEach((x,i)=>{
        r(x, i+4, 2);
        r('E'+x, i+4, 4);
    });
}
let F = (f, name='f'+util.inspect(f))=>({bitsof: 1, inspect: ()=>name, codeGen: ()=>'F['+dis.codeGen(f)+']'});
dis.codeGen.runtime.push(`var F = exports.F = [];`);
'OCZSPVDI'.split('').forEach((x,i)=>{
    F[x] = F(i, x+'F');
    dis.codeGen.runtime.push(`F.${x} = F[${i}] = {inspect: function() {return '${x}F';}};`);
});

let Cond = {
    O: F.O, NO: Not(F.O),
    B: F.C, AE: Not(F.C),
    Z: F.Z, NZ: Not(F.Z),
    BE: Or(F.C, F.Z), A: And(Not(F.C), Not(F.Z)),
    S: F.S, NS: Not(F.S),
    P: F.P, NP: Not(F.P),
    L: Not(Eq(F.O, F.S)), GE: Eq(F.O, F.S),
    LE: Or(F.Z, Not(Eq(F.O, F.S))), G: And(Not(F.Z), Eq(F.O, F.S)),
};
function _op(def, b, fn) {
    b = b.map((x)=>x.toBinary(8));
    var args = [], hasModRM, ModRM, immIdx, byteLen, imm = [], ctReg = false, reg = 'Reg';
    def = def.replace(/^reg=(\d+):/i, (s, x)=>((ctReg = true, reg = (+x).toBinary(3)), ''));
    var getSize = (s)=>{ // FIXME 16bit 64bit.
        if(s == 'b') return 1;
        if(s == 'c' || s == 'w') return 2;
        if(s == 'd' || s == 'v' || s == 'z') return 4;
        throw new TypeError('Unimplemented operand size '+s);
    };
    
    def = def.trim();
    def && def.split(' ').forEach((x, i)=>{
        if(/^[RE]?([ABCD]X|[SBI]P|[SD]I)|[ABCD][HL]|[ECSDFSG]S$/.test(x))
            args[i] = ()=>R[x]; // FIXME actual regs.
        else if(/^[re]([ABCD]X|[SBI]P|[SD]I)$/.test(x))
            args[i] = ()=>R['E'+x.slice(1)]; // FIXME 16bit 64bit.
        else if(x == 'J') // HACK to have access to the EIP after the current instruction.
            args[i] = ()=>Add(R.EIP, byteLen);
        else if(x == 'M')
            hasModRM = 2, args[i] = (...args)=>ModRM(4, ...args.slice(ctReg?0:1));
        else {
            if(!/^[A-Z][a-z]$/.test(x))
                throw new TypeError('Unimplemented operand specifier '+x);
            let kind = x[0], size = getSize(x[1]);
            if(kind == 'E')
                hasModRM = 1, args[i] = (...args)=>ModRM(size, ...args.slice(ctReg?0:1));
            else if(kind == 'G')
                hasModRM = 1, args[i] = (reg)=>R(reg, size);
            else if(kind == 'S')
                hasModRM = 1, args[i] = (reg)=>R(reg, 4, 'S');
            else if(kind == 'I') {
                let j = imm.push(['Imm_____', 'Imm_____________', null, 'Imm_____________________________'][size-1])-1;
                args[i] = ()=>arguments[immIdx+j];
            } else if(kind == 'J') { // FIXME negative offsets.
                let j = imm.push(['Imm_____', 'Imm_____________', null, 'Imm_____________________________'][size-1])-1;
                args[i] = ()=>Add(R.EIP, Add(arguments[immIdx+j], byteLen));
            } else if(kind == 'O') {
                let j = imm.push('Offset__________________________')-1;
                args[i] = ()=>Mem(arguments[immIdx+j], size);
            } else
                throw new TypeError('Unimplemented operand kind '+kind);
        }
    });
    let op = (mid=[], n=0, modRM=null)=>{
        immIdx = n + (!ctReg && hasModRM ? 1 : 0);
        var bytes = b.concat(mid).concat(imm);
        byteLen = bytes.join('').length / 8;
        ModRM = modRM;
        return dis.op(bytes, (...a)=>{
            var res = fn(...args.map((x)=>x(...a)));
            return Array.isArray(res) ? res : [res];
        });
    }
    if(!hasModRM)
        op();
    else {
        if(hasModRM != 3) {
            let applySIB = (mod, extra=[], n=0, fn=(x)=>x)=>{ // FIXME 16bit 64bit.
                op([mod+reg+'Rm_', ...extra], 1+n, (size, RM, ...rest)=>Mem(fn(R(RM), ...rest), size));
                op([mod+reg+'100', 'SiIdxBas', ...extra], 3+n, (size, scale, idx, base, ...rest)=>Mem(fn(Add(R(base), LSL(R(idx), scale)), ...rest), size));
                op([mod+reg+'100', 'Si100Bas', ...extra], 2+n, (size, scale, base, ...rest)=>Mem(fn(R(base), ...rest), size));
                let newFn = (...x)=>Add(R.EBP, fn(...x));
                if(mod == '00') {
                    extra = ['Disp____________________________'];
                    n = 1;
                    newFn = (x, disp32)=>Add(x, disp32);
                }
                op([mod+reg+'100', 'SiIdx101', ...extra], 2+n, (size, scale, idx, ...rest)=>Mem(newFn(LSL(R(idx), scale), ...rest), size));
                op([mod+reg+'100', 'Si100101', ...extra], 1+n, (size, scale, ...rest)=>Mem(newFn(0, ...rest), size));
            };
            applySIB('00');
            applySIB('01', ['Disp____'], 1, (x, disp8)=>Add(x, ExtS(disp8)));
            applySIB('10', ['Disp____________________________'], 1, (x, disp32)=>Add(x, ExtS(disp32)));
            op(['00'+reg+'101', 'Disp____________________________'], 1, (size, disp32)=>Mem(disp32, size));
        }
        if(hasModRM != 2)
            op(['11'+reg+'Rm_'], 1, (size, RM)=>R(RM, size));
    }
}

let opMov = (fn)=>(x)=>Mov(x, fn(...arguments));
let $ = (s, ...args)=>(base, fn=base)=>{
    s = s.map((x, i)=>i?args[i-1]+x:x).join('');
    s = s.replace(/^((?:[a-f0-9]{2})+):/i, (s, x)=>((base = x.match(/../g).map((x)=>parseInt(x, 16))), ''));
    var extra = '';
    s = s.replace(/^.*:/, (x)=>((extra=x),''));
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

let [ADD, OR, ADC, SBB, AND, SUB, XOR, INC, DEC, NOT, NEG] = [Add, Or, (a, b)=>Add(a, Add(b, F.C)), (a, b)=>Sub(b, Add(Sub(a, F.C), 1)), And, Sub, Xor, (x)=>Add(x, 1), (x)=>Sub(x, 1), Not, (x)=>Sub(0, x)].map(opMov);
let CMP = (a, b, v=Sub(a, b))=>[Mov(F.Z, v.ZF || Eq(v, 0)), Mov(F.C, v.CF || 0)]; // FIXME all teh flags.
let TEST = (a, b, v=And(a, b))=>[Mov(F.Z, v.ZF || Eq(v, 0))]; // FIXME all teh flags.
let PUSH = (x, size=sizeof(x, true))=>[SUB(R.ESP, size), Mov(Mem(R.ESP, size), x)];
let POP =  (x, size=sizeof(x, true))=>[Mov(x, Mem(R.ESP, size)), ADD(R.ESP, size)];
let INT = Interrupt;
let JMPN = (j)=>Mov(R.EIP, j), CALLN = (EIP, j)=>[...PUSH(EIP), Mov(R.EIP, j)];
let MOVZX = (a, b)=>Mov(a, Ext(b, bitsof(a, true)));

/// One-byte opcodes.
///\00-0F
$`00:Eb Gb;Ev Gv;Gb Eb;Gv Ev;AL Ib;rAX Iz`(ADD);
$`06:ES`(PUSH);/*i64*/ $`07:ES`(POP);/*i64*/
$`08:Eb Gb;Ev Gv;Gb Eb;Gv Ev;AL Ib;rAX Iz`(OR);
$`0E:CS`(PUSH);/*i64*/ /* 0x0F 2-byte escape code */

///\10-1F
$`10:Eb Gb;Ev Gv;Gb Eb;Gv Ev;AL Ib;rAX Iz`(ADC);
$`16:SS`(PUSH);/*i64*/ $`17:SS`(POP);/*i64*/
$`18:Eb Gb;Ev Gv;Gb Eb;Gv Ev;AL Ib;rAX Iz`(SBB);
$`1E:DS`(PUSH);/*i64*/ $`1F:DS`(POP);/*i64*/

///\20-2F
$`20:Eb Gb;Ev Gv;Gb Eb;Gv Ev;AL Ib;rAX Iz`(AND);
/* 0x26 SEG=ES (prefix) */ /* 0x27 DAA i64 */
$`28:Eb Gb;Ev Gv;Gb Eb;Gv Ev;AL Ib;rAX Iz`(SUB);
/* 0x2E SEG=CS (prefix) */ /* 0x2F DAS i64 */

///\30-3F
$`30:Eb Gb;Ev Gv;Gb Eb;Gv Ev;AL Ib;rAX Iz`(XOR);
/* 0x36 SEG=SS (prefix) */ /* 0x37 AAA i64 */
$`38:Eb Gb;Ev Gv;Gb Eb;Gv Ev;AL Ib;rAX Iz`(CMP);
/* 0x3E SEG=DS (prefix) */ /* 0x3F AAS i64 */

///\40-4F
$`40:eAX;eCX;eDX;eBX;eSP;eBP;eSI;eDI`(INC);/*i64*/
$`48:eAX;eCX;eDX;eBX;eSP;eBP;eSI;eDI`(DEC);/*i64*/

///\50-5F
$`50:eAX;eCX;eDX;eBX;eSP;eBP;eSI;eDI`(PUSH);/*d64*/
$`58:eAX;eCX;eDX;eBX;eSP;eBP;eSI;eDI`(POP);/*d64*/

///\60-6F
// TODO more opcodes.
$`68:Iz`(PUSH);/*d64*/
$`6A:Ib`(PUSH);/*d64*/

///\70-7F
Object.keys(Cond).map((x, i)=>$`Jb`(0x70+i, (j)=>If(Cond[x], JMPN(j))));

///\80-8F
[ADD, OR, ADC, SBB, AND, SUB, XOR, CMP].map((fn, i)=>$`80:reg=${i}:Eb Ib;Ev Iz;Eb Ib;Ev Ib`(fn));/*82 i64*/
$`84:Eb Gb;Ev Gv`(TEST); $`86:Eb Gb;Ev Gv`(Swap);
$`88:Eb Gb;Ev Gv;Gb Eb;Gv Ev`(Mov);
$`8C:Ev Sw`(Mov); $`8D:Gv M`((a, b)=>Mov(a, b.addr)); $`8E:Sw Ew`(Mov);
$`8F:reg=0:Ev`(POP);

///\90-9F
$`90:`(Nop);
$`91:rAX rCX;rAX rDX;rAX rBX;rAX rSP;rAX rBP;rAX rSI;rAX rDI`(Swap);

///\A0-AF
// TODO more opcodes.
$`A0:AL Ob;rAX Ov;Ob AL;Ov rAX`(Mov);
$`A8:AL Ib;rAX Iz`(TEST);

///\B0-BF
$`B0:AL Ib;CL Ib;DL Ib;BL Ib;AH Ib;CH Ib;DH Ib;BH Ib`(Mov);
$`B8:rAX Iv;rCX Iv;rDX Iv;rBX Iv;rSP Iv;rBP Iv;rSI Iv;rDI Iv`(Mov);

///\C0-CF
// TODO more opcodes.
$`C2:Iw`((x)=>[ADD(R.ESP, x), ...POP(R.EIP)]);/*f64*/
$`C3:`((x)=>POP(R.EIP));/*f64*/
$`C6:reg=0:Eb Ib;Ev Iz`(Mov);
$`CC:`(()=>INT(3));

///\D0-DF
// TODO more opcodes (escape to FPU).
[ROL, ROR, /*RCL*/, /*RCR*/, LSL, LSR, , ASR].map((fn, i)=>{
    $`C0:reg=${i}:Eb Ib;Ev Ib`(opMov(fn)); // FIXME out of place  ^^.
    $`D0:reg=${i}:Eb;Ev`(opMov((x)=>fn(x, 1)));
    $`D2:reg=${i}:Eb CL;Ev CL`(opMov(fn));
});

///\E0-EF
// TODO more opcodes.
$`E8:J Jz`(CALLN);/*f64*/
$`E9:Jz`(JMPN);/*f64*/
$`EB:Jb`(JMPN);/*f64*/

///\F0-FF
// TODO more opcodes.
$`F6:reg=0:Eb Ib;Ev Iz`(TEST);
[NOT, NEG, /*MUL IMUL DIV IDIV AL/rAX*/].map((fn, i)=>$`F6:reg=${i+2}:Eb;Ev`(fn));
$`F6:reg=4:AX AL Eb;EAX EAX Ev`((d, s1, s2)=>Mov(d, Mul(s1, s2))); // FIXME EDX:EAX.
$`F6:reg=5:AX AL Eb;EAX EAX Ev`((d, s1, s2)=>Mov(d, Mul(s1, s2))); // FIXME EDX:EAX. IMUL (signed)
$`F8:`(()=>Mov(F.C, 0)); $`F9:`(()=>Mov(F.C, 1));
$`FA:`(()=>Mov(F.I, 0)); $`FB:`(()=>Mov(F.I, 1));
$`FC:`(()=>Mov(F.D, 0)); $`FD:`(()=>Mov(F.D, 1));
[INC, DEC].map((fn, i)=>$`FE:reg=${i}:Eb;Ev`(fn));
[CALLN/*f64*/, /*CALLF*/, JMPN/*f64*/, /*JMPF*/].map((fn, i)=>$`FF:reg=${i+2}:J Ev`(fn));
$`FF:reg=6:Ev`(PUSH);/*d64*/

/// Two-byte opcodes.
///\0F80-0F8F
Object.keys(Cond).map((x, i)=>$`Jz`([0x0F, 0x80+i], (j)=>If(Cond[x], Mov(R.EIP, j))));

///\0F90-0F9F
Object.keys(Cond).map((x, i)=>$`Eb`([0x0F, 0x90+i], (a)=>Mov(a, Cond[x])));

///\0FA0-0FAF
$`0FAC:Ev Gv Ib;Ev Gv CL`(opMov((dest, src, count)=>Or(LSR(dest, count), And(src, LSL(Sub(LSL(1, count), 1), Sub(32, count))))));

///\0FB0-0FBF
$`0FB6:Gv Eb;Gv Ew`(MOVZX);

///\0FC0-0FCF
$`0FC8:rAX;rCX;rDX;rBX;rSP;rBP;rSI;rDI`(Nop); // FIXME bswap.

dis.out(__dirname+'/arch-x86.js', (code)=>raw`/** @file arch-x86.js This file was auto-generated */
${dis.codeGen.runtime.join('\n')}
exports.dis = function x86dis(b, i) {
    for(; b[i] == 0xF2 || b[i] == 0xF3; i++)
        console.log('[PREFIX] '+b[i].toString(16).toUpperCase());
    ${code}
}
exports.SP = R.ESP;
exports.IP = R.EIP;
`);