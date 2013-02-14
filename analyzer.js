String.prototype.padLeft = function padLeft(n, p) {
    p = p || ' ';
    var s = this.toString();
    while(s.length < n)
        s = p+s;
    return s;
};
String.prototype.padRight = function padRight(n, p) {
    p = p || ' ';
    var s = this.toString();
    while(s.length < n)
        s += p;
    return s;
};

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

{
    let util = require('util'), oldFormat = util.format, indent = '';
    util.format = function(...args) {
        return oldFormat.apply(this, args).replace(/(?:^|\n)/g, '$&'+indent);
    };

    console.group = (name)=>{
        console.log(name, '{');
        indent += '    ';
    };

    console.groupEnd = ()=>{
        if(indent == '')
            return false;
        indent = indent.slice(0, -4);
        console.log('}');
    };
}

let makeAnalyzer = (arch)=>{
    let EventEmitter = require('events').EventEmitter;
    let {R, PC, SP, FP, Add, Mov, Mem, known, valueof, lvalueof, sizeof, inspect} = arch, analyzer;

    class AnalysisPauseError extends Error {
        constructor(reason='') {
            super('Analysis paused: '+reason);
        }
    }

    class Block extends EventEmitter {
        constructor(options={}) {
            super();

            this.setMaxListeners(64);

            this.stack = [{down: [], up: []}];
            this.stackMaxAccess = -Infinity;
            this.returnPoints = [];
            this.on('returnPoint', (x)=>{
                if(this.returnPoints.indexOf(x) is -1)
                    this.returnPoints.push(x);
            });
            this.R = {};
            this.R0 = {};
            for(let i in R) {
                this.R0[i] = {bitsof: R[i].bitsof, signed: R[i].signed, inspect: ()=>inspect(R[i])+'₀'/*+(this.start||0).toSupString(16)*/};
                this.R[i] = {nthValue: 1, value: this.R0[i]};

                if(R[i] == SP) {
                    this.SP0 = [this.R0[i]];
                    this.SP = this.R[i];
                }
            }
            this.retPC = {inspect: ()=>'ret'+inspect(PC)}; // HACK

            for(let i in options)
                this[i] = options[i];
        }

        saveContext() {
            for(let i in R) {
                this.R[i] = {nthValue: R[i].nthValue, value: R[i].value};
                if(R[i] == SP)
                    this.SP = this.R[i];
            }

            analyzer.memRead = analyzer.memWrite = null;
        }

        SPdiff(SP, SP0=this.SP0[this.SP0.length-1]) {
            if(SP == SP0)
                return 0;
            if(SP.op == '+' && SP.a == SP0 && known(SP.b))
                return SP.b;
            return NaN;
        }

        SPdiffAll(SP) {
            for(let i = this.SP0.length-1; i >= 0; i--) {
                let diff = this.SPdiff(SP, this.SP0[i]);
                if(diff isnt NaN)
                    return [i, diff];
            }
            return [-1, NaN];
        }

        readStack(pos, bits, stack=this.stack[this.stack.length-1], bytes=bits/8) {
            if(stack == this.stack[0])
                this.stackMaxAccess = Math.max(this.stackMaxAccess, pos+bytes);
            if(pos < 0) {
                pos = ~pos; // HACK -pos-1.
                stack = stack.down;
            } else
                stack = stack.up;
            var v = stack[pos];
            if(!v)
                return;
            if(v.invalid)
                throw new Error('Reading invalid stack value '+inspect(v));
            if(v.bitsof != bits)
                return console.error('Reading differently sized stack value '+v.bitsof+' vs '+bits+' '+inspect(v.value)), null;
            return v.value;
        }

        writeStack(pos, bits, v, stack=this.stack[this.stack.length-1], bytes=bits/8) {
            let canBeArg = false; // HACK should be true only for pushes/calls.
            if(stack == this.stack[this.stack.length-1] && pos == this.SPdiff(valueof(SP)))
                canBeArg = true;
            let originalPos = pos;
            if(pos < 0) {
                pos = ~pos; // HACK -pos-1.
                stack = stack.down;
            } else
                stack = stack.up;
            stack[pos] = {bitsof: bits, canBeArg, value: v, parent: this, PC: this.PC, PCnext: this.PCnext};
            if(originalPos < 0)
                for(let i = pos-1; i > pos-bytes; i--) { // BUG Curly braces required because of traceur-compiler bug.
                    stack[i] = {invalid: true, parent: stack[pos]};
                }
            else
                for(let i = pos+1; i < pos+bytes; i++) { // BUG Curly braces required because of traceur-compiler bug.
                    stack[i] = {invalid: true, parent: stack[pos]};
                }
        }

        restoreContext() {
            for(let i in R)
                ({nthValue: R[i].nthValue, value: R[i].value} = this.R[i]);

            analyzer.memRead = (addr, bits)=>{
                let [i, diff] = this.SPdiffAll(addr);
                if(diff isnt NaN) // HACK
                    return this.readStack(diff, bits, this.stack[i]);
            };

            analyzer.memWrite = (addr, bits, v)=>{
                let [i, diff] = this.SPdiffAll(addr);
                if(diff isnt NaN) // HACK
                    return this.writeStack(diff, bits, v, this.stack[i]) isnt false;
            };
        }

        preOp(x) {
            this.emit('preOp', x);
            PC.value = this.PC;
            this.PCwritten = false;
        }

        op(x) {
            this.emit('op', x);
            if(x.op == '=') {
                if(x.a == PC.lvalue) // HACK
                    this.PCwritten = true;
                else if(x.a == SP.lvalue) {
                    if(known(x.b))
                        return console.error('Ignoring known SP = '+inspect(x.b));
                    let [i, diff] = this.SPdiffAll(x.b);
                    if(diff is NaN) {
                        if(x.b.op == '+' && known(x.b.b))
                            this.SP0.push(x.b.a);
                        else
                            this.SP0.push(x.b);
                        this.stack.push({down: [], up: []});
                    } else if(i != this.SP0.length-1) {
                        this.SP0.splice(i+1);
                        this.stack.splice(i+1);
                    }
                }
                let needsFreeze = (x, d=0)=>d >= 8 || x.fn == 'Mem' || x.a && needsFreeze(x.a, d+1) || x.b && needsFreeze(x.b, d+1) || x.args && x.args.some((x)=>needsFreeze(x, d+1));
                if(x.a.freeze && needsFreeze(x.b))
                    x.a.freeze(x.b);
                else
                    x.a.value = x.b;
            } else if(x.op == '<->') {
                // HACK hopefully nothing goes wrong.
                let a = valueof(x.a), b = valueof(x.b);
                this.op(Mov(x.a, b));
                this.op(Mov(x.b, a));
            }
        }

        postOp() {
            this.emit('postOp');
            if(this.PCwritten && PC.value != this.PCnext) {
                console.log('-->', inspect(PC.value));
                let targetBlock = this.getJumpTarget(PC.value);
                let savesPC = analyzer.memRead(valueof(SP), PC.bitsof) == this.PCnext;
                if(savesPC) {
                    if(!targetBlock.returnPoints.length)
                        throw new Error('Not returning from a function call'/*+inspect(targetBlock)*/);

                    // HACK mark touched args so they don't get reused.
                    let {stackMaxAccess} = targetBlock.returnPoints.reduce((a, b)=>({stackMaxAccess: Math.max(a.stackMaxAccess, b.stackMaxAccess)}));
                    for(let diff = this.SPdiff(SP), stack = this.stack[this.stack.length-1].down, i = diff; i < diff+stackMaxAccess; i++) { // BUG Curly braces required because of traceur-compiler bug.
                        if(stack[~i] && stack[~i].canBeArg)
                            stack[~i].canBeArg = false;
                    }

                    // HACK save and apply initial registers with unchanged or SP-relative value.
                    let changedR0 = {};
                    {
                        let r = [];
                        for(let i in R)
                            if(R[i].value == this.R0[i]) {
                                changedR0[i] = targetBlock.R0[i].value;
                                targetBlock.R0[i].value = R[i].value;
                                r.push(inspect(R[i]));
                            }
                        if(r.length)
                            console.log('->₀', r.join(', '));
                    }
                    for(let i in R)
                        if(this.SPdiffAll(R[i].value)[1] isnt NaN) {
                            changedR0[i] = targetBlock.R0[i].value;
                            targetBlock.R0[i].value = R[i].value;
                            console.log('->', R[i], '=', R[i].value);
                        }

                    // HACK apply SP-relative changes to registers.
                    let updatedR = [];
                    for(let i in R) {
                        let SP0, SPdiff;
                        for(let x of targetBlock.returnPoints) {
                            let v = x.R[i].value;
                            if(v.frozenValue) // HACK allows the callee to access the caller's stack (used in SEH's alloca).
                                v = v.frozenValue;
                            v = valueof(v);
                            let [j, diff] = this.SPdiffAll(v);
                            if(diff is NaN) {
                                if(R[i] != SP && v == this.R0[i] && R[i].value != this.R0[i]) { // HACK allows the callee to restore caller's saved registers (used in SEH's alloca).
                                    if(!SP0) {
                                        SP0 = v;
                                        SPdiff = 0;
                                        continue;
                                    } else(v != SP0 || SPdiff)
                                        throw new Error(inspect(R[i])+' differs '+inspect(v)+' vs '+inspect(SP0)+' + '+SPdiff);
                                } else if(R[i] == SP) {
                                    if(targetBlock.returnPoints.length == 1) {
                                        console.error('Using strange SP '+j+' '+diff+' '+inspect(x.R[i].value)+' '+inspect(v));
                                        SP0 = v;
                                        SPdiff = 0;
                                        break;
                                    } else
                                        throw new Error('SP is strange '+j+' '+diff+' '+inspect(x.R[i].value)+' '+inspect(v));
                                } else {
                                    SP0 = null;
                                    break;
                                }
                            }
                            if(!SP0) {
                                SP0 = this.SP0[j];
                                SPdiff = diff;
                            } else if(this.SP0[j] != SP0 || diff != SPdiff)
                                throw new Error(inspect(R[i])+' differs '+inspect(x.SP0[j])+' + '+diff+' ('+inspect(x.start)+') vs '+inspect(SP0)+' + '+SPdiff+', from '+inspect(this.start)+' for '+inspect(targetBlock.start));
                        }
                        if(SP0) {
                            this.op(valueof(Mov(R[i], Add(SP0, SPdiff))));
                            updatedR.push(i);
                            console.log('<-', R[i], '=', R[i].value, '//', inspect(targetBlock.returnPoints[0].R[i].value));
                        }
                    }

                    // Dump the stack.
                    if(targetBlock.returnPoints.length == 1) {
                        //console.log('Callee:');
                        let {SP0: [{value: SP0}], stack: [stack]} = targetBlock.returnPoints[0];
                        let [j, diff] = this.SPdiffAll(SP0);
                        /*console.log*/([stack].map((x, i)=>{
                            let r = '';
                            x.up.forEach((x, i)=>{
                                if(x && !x.invalid) {
                                    let saved = false;
                                    if(i && diff isnt NaN) { // HACK Save values written over the caller's stack (used in SEH's alloca).
                                        this.writeStack(diff+i, x.bitsof, valueof(x.value), this.stack[j]);
                                        saved = true;
                                    }
                                    r = ',\n  '+i+': '+inspect(x.value)+(saved?' // Saved':'')+r;
                                }
                            });
                            r = '[:'+inspect(targetBlock.returnPoints[0].SP0[i])+r;
                            x.down.forEach((x, i)=>{
                                if(x && !x.invalid)
                                    r += ',\n  '+~i+': '+inspect(x.value);
                            });
                            return r+']';
                        }).join(',\n'));
                    }
                    //console.log('Caller:');
                    /*console.log*/(this.stack.map((x, i)=>{
                        let r = '';
                        x.up.forEach((x, i)=>{
                            if(x && !x.invalid)
                                r = ',\n  '+i+': '+inspect(x.value)+r;
                        });
                        r = '[:'+inspect(this.SP0[i])+r;
                        x.down.forEach((x, i)=>{
                            if(x && !x.invalid)
                                r += ',\n  '+~i+': '+inspect(x.value);
                        });
                        return r+']';
                    }).join(',\n'));

                    for(let i in R)
                        if(R[i] != PC && updatedR.indexOf(i) is -1 && targetBlock.returnPoints.some((x)=>x.R[i].value != x.R0[i])) {
                            console.log(`Changes ${inspect(R[i])} <- {${targetBlock.returnPoints.map((x)=>inspect(valueof(x.R[i].value))).join(', ')}}`);
                            let lvalue = lvalueof(R[i]);
                            if(lvalue.freeze)
                                lvalue.freeze();
                        }

                    for(let i in changedR0)
                        targetBlock.R0[i].value = changedR0[i];
                } else if(targetBlock == this.retPC)
                    this.returns = true;
                else
                    this.link = targetBlock;
            }
        }

        getJumpTarget(newPC) {
            let savesPC = analyzer.memRead(valueof(SP), PC.bitsof) == this.PCnext;
            if(!known(newPC)) {
                let isTailJump = !savesPC && this.SP0.length == 1 && this.SPdiff(valueof(SP)) == 0;
                if(newPC == this.retPC) {
                    this.emit('returnPoint', this);
                    return this.retPC;
                } else if(newPC.fn == 'Function') { // HACK required for imported functions.
                    let target = newPC.block;
                    if(!target)
                        throw new Error('Cannot '+(savesPC?'call':'jump to')+' unknown function -> '+inspect(newPC));
                    if(savesPC)
                        return target;
                    if(isTailJump) {
                        console.error('Tail-jumping to function -> '+inspect(newPC));
                        // HACK this fakes a return following the current instruction.
                        this.returns = true;
                        this.emit('returnPoint', this); // FIXME could cause problem with some deferred block processing.
                        // HACK this makes savesPC true in postOp().
                        this.PCnext = this.retPC;
                        return target;
                    }
                    throw new Error('Cannot tail-jump to function -> '+inspect(newPC));
                } else if(savesPC || isTailJump) {
                    console.error('Unknown '+(savesPC?'call':'tail-jump')+', assuming arguments');
                    let target = new Block({returns: true});
                    target.SP.value = Add(target.SP0[0], sizeof(PC));
                    target.returnPoints.push(target);

                    let stack = this.stack[this.stack.length-1].down, i = this.SPdiff(valueof(SP)) + sizeof(PC), j = i, k = 0, pc = this.PC;
                    while(j < 0) {
                        let v = stack[~j];
                        if(!v || v.invalid || v.parent != this || !v.canBeArg)
                            break;
                        if(pc > v.PCnext)
                            k += pc - v.PCnext;
                        if(k > 12) {// HACK
                            console.error(`!!stack[-${inspect(-j)}]${v.bitsof} (${k}) =`, inspect(v.value));
                            break;
                        }
                        console.error(`stack[-${inspect(-j)}]${v.bitsof} (${k}) =`, inspect(v.value));
                        j += v.bitsof/8;
                        pc = v.PC;
                    }
                    target.stackMaxAccess = j - i + sizeof(PC);

                    if(isTailJump) { // FIXME duplicated code.
                        console.error('Assuming callee cleans the stack ('+(j-i)+')');
                        target.SP.value = Add(target.SP.value, j-i);

                        // HACK this fakes a return following the current instruction.
                        this.returns = true;
                        this.emit('returnPoint', this); // FIXME could cause problem with some deferred block processing.
                        // HACK this makes savesPC true in postOp().
                        this.PCnext = this.retPC;
                        return target;
                    }

                    this.once('preOp', (x)=>{
                        for(let op of x) { // HACK detect whether the caller cleans the stack or not.
                            if(op.op == '=' && op.b.fn == 'Mem' && op.b.a == SP && (op.a == PC || op.a == SP || op.a == FP))
                                break; // HACK Ignore pop PC/SP/FP, they tend to not remove arguments from the stack.
                            if(op.op == '=' && op.a == SP)
                                return;
                        }
                        console.error('Assuming callee cleans the stack ('+(j-i)+')');
                        this.op(valueof(Mov(SP, Add(SP, j-i))));
                    });

                    return target;
                } else {
                    // Dump the stack.
                    /*console.log(this.stack.map((x, i)=>{
                        let r = '';
                        x.up.forEach((x, i)=>{
                            if(x && !x.invalid)
                                r = ',\n  '+i+': '+inspect(x.value)+r;
                        });
                        r = '[:'+inspect(this.SP0[i])+r;
                        x.down.forEach((x, i)=>{
                            if(x && !x.invalid)
                                r += ',\n  '+~i+': '+inspect(x.value);
                        });
                        return r+']';
                    }).join(',\n'));*/
                    throw new Error('Unknown jump -> '+inspect(newPC));
                }
            }

            this.saveContext();
            if(savesPC)
                console.group('0x'+newPC.toString(16).padLeft(8, '0'));
            let target = new Block({start: newPC}), returnPoint = (x)=>this.emit('returnPoint', x);
            if(savesPC)
                target.writeStack(0, PC.bitsof, target.retPC);
            else {
                target.on('returnPoint', returnPoint);
                target.retPC = this.retPC;
                target.SP0 = this.SP0.slice();
                target.stack = this.stack.map((x)=>({down: x.down.slice(), up: x.up.slice()}));
                for(let i in R) { // HACK forward the registers with a SP0-relative value (or things like function pointers).
                    if(this.SPdiffAll(this.R[i].value)[1] isnt NaN || R[i] != SP && this.R[i].value == this.R0[i] || this.R[i].value.fn == 'Function')
                        ({value: target.R[i].value, nthValue: target.R[i].nthValue}) = this.R[i];
                    if(R[i] != SP)
                        target.R0[i] = this.R0[i];
                }
            }
            let newTarget = analyzer.getBlock(target);
            if(savesPC)
                console.groupEnd();
            else {
                target.removeListener('returnPoint', returnPoint);
                if(newTarget != target)
                    newTarget.returnPoints.forEach(returnPoint);
            }
            this.restoreContext();
            if(newTarget.inProgress && savesPC) {
                console.error(`Got inProgress block, with ${newTarget.returnPoints.length} return points`);
                if(!newTarget.returnPoints.length) {
                    newTarget.once('returnPoint', ()=>{
                        if(this.decoder)
                            this.decoder();
                    });
                    throw new AnalysisPauseError('no return points');
                }
            }
            return newTarget;
        }
    };

    return analyzer = new (class Analyzer extends EventEmitter {
        constructor() {
            super();

            this.blocksVisited = [];
            this.arch = arch;
            this.Block = Block;

            for(let i in R)
                R[i].lvalue = {
                    inspect: ()=>inspect(R[i])+R[i].nthValue.toSubString(),
                    freeze(v) {
                        let name = inspect(R[i])+(R[i].nthValue++).toSubString();
                        R[i].value = {frozenValue: v, inspect: ()=>name};
                    },
                    get value() {
                        return R[i].value;
                    },
                    set value(v) {
                        R[i].value = v;
                    }
                };

            let {read, write} = Mem;
            Mem.read = (addr, bits)=>{
                if(this.memRead) {
                    var v = this.memRead(addr, bits);
                    if(v !== null && v !== void 0)
                        return v;
                }
                return read(addr, bits);
            };
            Mem.write = (addr, bits, v)=>{
                if(this.memWrite) {
                    var r = this.memWrite(addr, bits, v);
                    if(r)
                        return r;
                }
                return write(addr, bits, v);
            };
        }

        getBlock(block) {
            let {start} = block;
            if(!known(start) || start < this.codeBase || start >= this.codeBase+this.codeBuffer.length)
                throw new Error('Block starting outside of codeBuffer bounds');

            start -= this.codeBase;
            if(this.blocksVisited[start])
                return this.blocksVisited[start];

            if(!(block instanceof Block))
                block = new Block(block);
            this.blocksVisited[start] = block;
            block.inProgress = true;

            block.decoderGenerator = this.decodeBlock(block);
            block.decoder = block.decoderGenerator.moveNext.bind(block.decoderGenerator);
            try {
                block.decoder();
            } catch(e) {
                if(e.stack)
                    console.error(e.stack);
                else
                    throw e;
            }

            return block;
        }

        *decodeBlock(block, start=block.start-this.codeBase) {
            block.restoreContext();
            for(var i = start; i < this.codeBuffer.length;) {
                block.PC = this.codeBase+i;
                var r = null, err = null;
                try {
                    r = arch.dis(this.codeBuffer, i);
                } catch(e) {
                    err = e;
                }
                if(!r || err) {
                    console.error('Failed at', this.codeBuffer.slice(i));
                    if(arch.legacyDisasm)
                        console.log(arch.legacyDisasm(this.codeBase+i, this.codeBuffer.slice(i, i+16)).trim());
                }
                if(err) throw err;
                if(!r) yield;

                var bytes = r[0], slice = this.codeBuffer.slice(i, i+bytes), asm = '';
                if(arch.legacyDisasm)
                    asm = ' // '+arch.legacyDisasm(this.codeBase+i, slice).trim();
                r = r.slice(1);
                block.PCnext = block.PC+bytes;
                block.preOp(r);
                for(var j = 0; j < r.length; j++) {
                    var x = r[j], s = inspect(x), v = valueof(x);
                    s = inspect(v)+' // '+s;
                    if(!j)
                        s += asm;
                    if(v.fn == 'If') {
                        if(j != r.length-1 || v.then.op != '=' || v.then.a != PC)
                            throw new Error('Cannot handle conditional '+inspect(v));
                        var targetPC = valueof(v.then.b);
                        console.group('if('+inspect(v.cond)+') --> '+inspect(targetPC)+' /* '+s+' */');
                        block.linkCond = v.cond;
                        block.linkIf = block.getJumpTarget(targetPC);
                        console.groupEnd();
                        console.group('else');
                        block.link = block.getJumpTarget(block.PCnext);
                        console.groupEnd();
                        this.decoder = this.decoderGenerator = null;
                        block.saveContext();
                        block.inProgress = false;
                        yield;
                    }
                    block.op(v);

                    if(j)
                        s = (j==r.length-1?'└':'├').padLeft(13+bytes*2).padRight(31, '─')+s;
                    else
                        s = '0x'+block.PC.toString(16).padLeft(8, '0')+' 0x'+slice.toString('hex').padRight(18)+s;
                    console.log(s);
                }

                for(;;) {
                    try {
                        this.emit('Block.postOp', block);
                        block.postOp();
                        break;
                    } catch(e) {
                        if(!(e instanceof AnalysisPauseError))
                            throw e;
                        console.error(e.toString());
                        block.saveContext();
                        yield;
                        block.restoreContext();
                    }
                }
                if(block.link || block.returns)
                    break;
                i += bytes;
            }
            this.decoder = this.decoderGenerator = null;
            block.saveContext();
            block.inProgress = false;
            yield;
        }
    });
}

if(process.argv.length < 3)
    console.error('Usage: analyzer FILE'), process.exit(1);
{
    let r2 = require('radare2.js'), fs = require('fs'), path = require('path');
    let bin = new r2.RBin();
    let program = require('commander')
        .option('-a, --arch <ARCH>')
        .option('-b, --base <ADDRESS>', 'base address', parseInt)
        .option('-e, --entry <ADDRESS>', 'entry point', parseInt);
    let entries = [];
    program.on('entry', (x)=>{
        x = parseInt(x);
        entries.push({rva: x, offset: x});
    });
    program.parse(process.argv);

    let fileName = program.args[0];
    if(!fileName)
        program.help();
    if(!bin.load(fileName, false)) {
        let buffer;
        try {
            buffer = fs.readFileSync(fileName);
        } catch(e) {
            console.error(e);
            process.exit(1);
        }
        console.error('r2 cannot open', fileName);
        if(!program.arch) {
            if(process.env.ARCH)
                program.arch = process.env.ARCH;
            else
                program.missingArgument('arch');
        }
        bin = {
            buffer, baseAddress: program.base || 0,
            arch: program.arch, bits: program.bits || 32,
            sections: [{name: '.text', rva: 0, offset: 0, size: buffer.length, srwx: 5}],
            imports: [], symbols: [],
            entries: entries.length ? entries : [{rva: 0, offset: 0}]
        };
    } else {
        let rbin = bin;
        let binInfo = rbin.get_info();
        let buffer = rbin.cur.buf.buf;
        buffer.type = Object.create(buffer.type);
        buffer.type.size = rbin.cur.buf.length;
        buffer = buffer.ref().deref();
        bin = {
            buffer, baseAddress: rbin.get_baddr(),
            arch: binInfo.arch, bits: binInfo.bits,
            sections: rbin.get_sections(), imports: rbin.get_imports(),
            symbols: rbin.get_symbols(), entries: {forEach(...args) {rbin.get_entries().forEach(...args); entries.forEach(...args);}}
        };
    }

    let analyzer = makeAnalyzer(require('./disasm/arch-'+bin.arch));

    let asm = new r2.RAsm();
    if(asm.use(bin.arch) && asm.set_bits(bin.bits))
        analyzer.arch.legacyDisasm = (PC, buffer)=>{
            asm.set_pc(PC);
            return asm.mdisassemble(buffer, buffer.length).buf_asm;
        };

    let sections = [], codeSection;
    bin.sections.forEach((x)=>{
        x = {name: x.name, addr: bin.baseAddress+x.rva, offset: x.offset, size: x.size, srwx: x.srwx};
        sections.push(x);
        if(x.srwx & 1) {
            if(codeSection || !x.size)
                console.error('Ignoring code section '+x.name);
            else
                codeSection = x;
        }
    });
    if(!codeSection)
        throw new Error('No code section');
    analyzer.codeBuffer = bin.buffer.slice(codeSection.offset, codeSection.offset+codeSection.size);
    analyzer.codeBase = analyzer.arch.PCbase = codeSection.addr;

    for(let x of entries) {
        x.offset = x.rva-codeSection.addr+codeSection.offset;
        x.rva -= bin.baseAddress;
    }

    let isWin = /\.(dll|exe)$/i.test(fileName), importHeaders = [];
    if(isWin)
        importHeaders.push(fs.readFileSync('windows.h', 'utf8'));
    let imports = [], importsByAddr = [];
    console.group('Imports');
    bin.imports.forEach((x)=>{
        x = importsByAddr[bin.baseAddress+x.rva] = {name: x.name, addr: bin.baseAddress+x.rva, bind: x.bind, type: x.type};
        imports.push(x);

        var fn = x.name;
        if(isWin)
            fn = fn.replace(/^[a-z0-9]+\.dll_/i, '');
        var args, fnRE = new RegExp('(__cdecl\\s+|)\\b'+fn.replace(/[?*+]/g, '\\$&')+'\\b\\s*\\(');
        for(let header of importHeaders)
            if(args = fnRE.exec(header)) {
                let matchParens = (i)=>{
                    for(let j = i, c; j < header.length; j++) {
                        c = header[j];
                        if(c == ')')
                            return [i, j];
                        if(c == '(')
                            [, j] = matchParens(j+1);
                    }
                    let before = header.slice(0, i), line = 1+before.replace(/[^\n]/g, '').length, col = 1+/(\n[^\n]*|)$/.exec(before)[0].trim().length;
                    throw new SyntaxError('Unmatched paren starting at '+line+':'+col);
                };
                let conv = args[1].trim();
                args = header.slice(...matchParens(args.index+args[0].length)).trim();
                console.log(`Import ${x.name}(${args})@${analyzer.arch.inspect(x.addr)}`);
                if(!args || args == 'void' || conv == '__cdecl')
                    args = 0;
                else
                    args = args.split(',').length*4; // HACK Assuming 32bit arguments.
                x.block = new analyzer.Block({returns: true, stackMaxAccess: 4+args});
                x.block.emit('returnPoint', x.block);
                if(bin.arch == 'x86') {
                    let argVals = [];
                    for(let i = 0; i < args; i += 4) { // HACK Assuming 32bit arguments.
                        let arg = analyzer.arch.Mem(analyzer.arch.Add(x.block.SP0[0], 4+i));
                        arg.bitsof = 32;
                        argVals.push(arg);
                    }
                    // HACK Assuming stdcall (return in EAX).
                    x.block.R.EAX.value = {args: argVals, inspect: ()=>x.name, get value() {
                        let args = argVals.map((a)=>analyzer.arch.valueof(a));
                        return {args, inspect: ()=>x.name+'('+args.map((a)=>analyzer.arch.inspect(a)).join(', ')+')'};
                    }};
                    x.block.SP.value = analyzer.arch.Add(x.block.SP0[0], args+4); // HACK Assuming stdcall (callee cleans the stack).
                }
                return;
            }
        console.error('Unknown import '+x.name);
    });
    console.groupEnd();

    let {read, write} = analyzer.arch.Mem;
    analyzer.arch.Mem.read = (addr, bits)=>{
        if(bits == 32) {
            let imp = importsByAddr[addr];
            if(imp)
                return {fn: 'Function', block: imp.block, inspect: ()=>imp.name+' ('+imp.bind+' '+imp.type+')'};
        }
        for(let x of sections)
            if(x.addr <= addr && addr < x.addr+x.size) {
                if(x.srwx & 2) // Writable, not good.
                    return;
                return bin.buffer['readUInt'+bits+(bits==8?'':'LE')](addr-x.addr+x.offset);
            }
        return read(addr, bits);
    };

    var symbols = [];
    bin.symbols.forEach((x)=>{
        console.log('Symbol %s: fw=%s bind=%s type=%s addr=%s offset=%s size=%d ordinal=%d',
            x.name, x.forwarder, x.bind, x.type, (bin.baseAddress+x.rva).toString(16),
            x.offset.toString(16), x.size, x.ordinal);
        if(x.type == 'FUNC')
            symbols.push({name: x.name, addr: bin.baseAddress+x.rva});
    });
    bin.entries.forEach((x)=>{
        console.log('Entry: addr=%s offset=%s', (bin.baseAddress+x.rva).toString(16), x.offset.toString(16));
        symbols.push({name: 'entry', addr: bin.baseAddress+x.rva});
    });
    if(!symbols.length)
        console.error('No usable symbols'), process.exit(1);
    var t = process.hrtime(), decodedInstructions = 0, decodedBytes = 0;
    analyzer.on('Block.postOp', (block)=>{
        decodedInstructions++;
        decodedBytes += block.PCnext - block.PC;
    });
    process.on('exit', ()=>{
        t = process.hrtime(t);
        console.log(`Decoded ${decodedInstructions} instructions (${Math.round(decodedBytes/1024*100)/100}KB) in ${t[0]+t[1]/1e9}s`);
    });
    process.on('SIGINT', ()=>process.exit());
    symbols.forEach((symbol)=>{
        let mainBlock = new analyzer.Block({start: symbol.addr});
        console.log('Analyzing '+symbol.name+'@'+symbol.addr.toString(16).padLeft(8, '0'));
        mainBlock.writeStack(0, analyzer.arch.PC.bitsof, mainBlock.retPC); // HACK
        try {
            analyzer.getBlock(mainBlock);
        } catch(e) {
            if(typeof e is 'object')
                e = e.stack;
            console.error(e);
            while(console.groupEnd() isnt false);
        }
    });
}
