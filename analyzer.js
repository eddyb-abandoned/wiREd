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

Number.prototype.toSubString = function toSubString() {
    if(this >= 0 && this < 10)
        return '₀₁₂₃₄₅₆₇₈₉'[this];
    return this.toString().replace(/[0-9]/g, x => '₀₁₂₃₄₅₆₇₈₉'[x]);
};
Number.prototype.toSupString = function toSupString(base) {
    return this.toString(base).replace(/[0-9]/g, x => '⁰¹²³⁴⁵⁶⁷⁸⁹'[x]).replace(/[a-z]/g, function(x) {
        return 'ᵃᵇᶜᵈᵉᶠᵍʰⁱʲᵏˡᵐⁿᵒᵖqʳˢᵗᵘᵛʷˣʸᶻ'[x.charCodeAt()-'a'.charCodeAt()];
    });
};

{
    let util = require('util'), oldFormat = util.format, indent = '';
    util.format = function() {
        return oldFormat.apply(this, arguments).replace(/(?:^|\n)/g, '$&'+indent);
    };

    console.group = (name, wrap=true) => {
        console.log(name + (wrap ? ' {' : ''));
        indent += '    ';
    };

    console.groupEnd = (wrap=true) => {
        if(indent === '')
            return false;
        indent = indent.slice(0, -4);
        if(wrap)
            console.log('}');
    };
}

let makeAnalyzer = arch => {
    let EventEmitter = require('events').EventEmitter;
    let {R, PC, SP, FP, returnPC, uint, int, u8, Mov, Mem, Unknown, known, valueof, lvalueof, sizeof, inspect} = arch, analyzer;

    let eq = (a, b)=>a && a.known && a.bitsof <= 32 && typeof b === 'number' ? a._A === b : a === b; // HACK

    class AnalysisPauseError extends Error {
        constructor(reason='') {
            super('Analysis paused: '+reason); // NOTE returns a new object instead of augmenting this.
            this.message = 'Analysis paused: '+reason;
        }
    }

    let numLinksCounters = [];
    process.on('exit', ()=>{
        console.group('Link counters');
        numLinksCounters.forEach((x, i)=>{
            console.log(i+'\t'+x);
        });
        console.groupEnd();
    });
    // HACK cache methods that return constant strings.
    let R0inspectMethods = [];
    for(let i = 0; i < R.length; i++) {
        let name = inspect(R[i])+(0).toSubString()/*+(this.start||0).toSupString(16)*/;
        R0inspectMethods[i] = ()=>name;
    }
    let retPCinspectMethod;
    {
        let name = 'ret'+inspect(PC);
        retPCinspectMethod = ()=>name;
    }

    class Block extends EventEmitter {
        constructor(options) {
            super();

            //this.setMaxListeners(64);

            this.stackFrames = [{base: null, down: [], up: []}];
            this.stackMaxAccess = -Infinity;
            this.returnPoints = [];
            this.functionCalls = [];
            this.functionBlocks = [this];
            this.linkedFrom = [];
            this.RnthValue = [];
            this.Rvalue = [];
            this.R0 = [];
            for(let i = 0; i < R.length; i++) {
                this.R0[i] = new Unknown(R[i].bitsof);
                this.R0[i].inspect = R0inspectMethods[i];
                this.RnthValue[i] = 1;
                this.Rvalue[i] = this.R0[i];

                if(R[i] === SP)
                    this.stackFrames[0].base = this.R0[i];
            }
            this.retPC = new Unknown(PC.bitsof);
            this.retPC.inspect = retPCinspectMethod;

            this.buffered = [];

            if(options)
                for(let i in options)
                    this[i] = options[i];
        }

        log(message) {
            this.buffered.push({type: 'log', message});
        }
        warning(x) {
            this.log('Warning: ' + x);
        }
        error(x) {
            this.log('Error: ' + x);
        }

        addReturnPoint(x) {
            if(this.returnPoints.indexOf(x) === -1)
                this.returnPoints.push(x);
        }
        addFunctionCall(x) {
            for(var i = 0; i < this.functionCalls.length; i++) {
                var j = this.functionCalls[i];
                if(j === x || j.original === x.original) // HACK skip repeated calls to the same end-point, trying to avoid exponential growth.
                    return;
            }
            this.functionCalls.push(x);
        }

        linkFrom(...sources) {
            // FIXME some usages of same should be more like deep compares.
            let same = (f, fn=typeof f === 'string' ? (a, b)=>a[f]===b[f] : f) => sources.slice(1).every(x => fn(x, sources[0]));
            let equalArray = (a, b) => {
                if(a.length !== b.length)
                    return false;
                for(let i = 0; i < a.length; i++)
                    if(a[i] !== b[i])
                        return false;
                return true;
            };
            let commonFrames = arrays => {
                let r = [], minLength = arrays.map(x => x.length).reduce((a, b) => Math.min(a, b));
                for(let i = 0; i < minLength; i++) {
                    if(!arrays.slice(1).every(x => x[i].base === arrays[0][i].base && equalArray(x[i].down, arrays[0][i].down) && equalArray(x[i].up, arrays[0][i].up)))
                        break;
                    r.push({base: arrays[0][i].base, down: arrays[0][i].down.slice(), up: arrays[0][i].up.slice()});
                }
                return r;
            };

            if(same('retPC'))
                this.retPC = sources[0].retPC;
            if(same('returnPoints'))
                this.returnPoints = sources[0].returnPoints;
            if(same('functionCalls'))
                this.functionCalls = sources[0].functionCalls;
            if(same('functionBlocks')) {
                this.functionBlocks = sources[0].functionBlocks;
                this.functionBlocks.push(this);
            } else
                throw new Error('Attempting to merge blocks from different functions.');
            this.linkedFrom.push(...sources);

            let stackFramesCommon = commonFrames(sources.map(x => x.stackFrames));
            if(stackFramesCommon.length)
                this.stackFrames = stackFramesCommon;

            for(let i = 0; i < R.length; i++) {
                this.RnthValue[i] = sources.map(x => x.RnthValue[i]).reduce((a, b) => Math.max(a, b));
                if(same((a, b) => a.Rvalue[i] === b.Rvalue[i]))
                    this.Rvalue[i] = sources[0].Rvalue[i];
                else {
                    // TODO use Phi/Any/Choice/whatever in case values differ.
                    this.RnthValue[i]++;
                }
                if(same((a, b) => a.R0[i] === b.R0[i]))
                    this.R0[i] = sources[0].R0[i];
            }
            return this;
        }

        saveContext() {
            for(let i = 0; i < R.length; i++) {
                this.RnthValue[i] = R[i].nthValue;
                this.Rvalue[i] = R[i].value;
            }

            analyzer.memRead = analyzer.memWrite = null;
        }

        SPdiff(SP, base=this.stackFrames[this.stackFrames.length-1].base) {
            if(SP === base)
                return 0;
            if(SP.op === '+' && SP.a === base && SP.b.known && SP.b.bitsof <= 32) // HACK
                return SP.b._A;
            return null;
        }

        SPdiffAll(SP) {
            let offset = 0;
            if(SP.op === '+' && SP.b.known && SP.b.bitsof <= 32) { // HACK
                offset = SP.b._A;
                SP = SP.a;
            }
            for(let i = this.stackFrames.length - 1; i >= 0; i--) {
                let frame = this.stackFrames[i];
                if(SP === frame.base)
                    return [frame, offset];
            }
            return [null, 0];
        }

        readStack(pos, bits, frame=this.stackFrames[this.stackFrames.length-1], bytes=bits/8) {
            if(frame === this.stackFrames[0])
                this.stackMaxAccess = Math.max(this.stackMaxAccess, pos+bytes);
            let v;
            if(pos < 0)
                v = frame.down[~pos]; // HACK -pos-1.
            else
                v = frame.up[pos];
            if(!v)
                return;
            if(v === null)
                throw new Error('Reading invalid stack value');
            if(v.bitsof != bits)
                return this.error('Reading differently sized stack value ' + v.bitsof + ' vs ' + bits + ' ' + inspect(v.value)), null;
            return v.value;
        }

        writeStack(pos, bits, v, frame=this.stackFrames[this.stackFrames.length-1], bytes=bits/8) {
            let canBeArg = false; // HACK should be true only for pushes/calls.
            if(frame === this.stackFrames[this.stackFrames.length-1] && pos === this.SPdiff(valueof(SP)))
                canBeArg = true;
            let isDown = pos < 0, stack;
            if(isDown) {
                pos = ~pos; // HACK -pos-1.
                stack = frame.down;
            } else
                stack = frame.up;
            stack[pos] = {bitsof: bits, value: v, canBeArg, parent: this, PC: this.PC, PCnext: this.PCnext};
            if(isDown)
                for(let i = pos-1; i > pos-bytes; i--)
                    stack[i] = null;
            else
                for(let i = pos+1; i < pos+bytes; i++)
                    stack[i] = null;
        }

        restoreContext() {
            for(let i = 0; i < R.length; i++) {
                R[i].nthValue = this.RnthValue[i];
                R[i].value = this.Rvalue[i];
            }

            analyzer.memRead = (addr, bits)=>{
                let [frame, offset] = this.SPdiffAll(addr);
                if(frame)
                    return this.readStack(offset, bits, frame);
            };

            analyzer.memWrite = (addr, bits, v)=>{
                let [frame, offset] = this.SPdiffAll(addr);
                if(frame)
                    return this.writeStack(offset, bits, v, frame) !== false;
            };
        }

        preOp(x) {
            this.emit('preOp', x); // FIXME required by getJumpTarget to detect stack cleaning by callee.
            PC.value = uint[PC.bitsof](this.PC); // HACK
            this.PCwritten = false;
        }

        /// Analyze a single op. Returns true in case of early return.
        op(op, first, last) {
            let output = {type: 'op', first, last, op, value: null};
            if(first) {
                output.PC = this.PC;
                output.PCnext = this.PCnext;
            }
            this.buffered.push(output);

            let v = output.value = valueof(op);

            if(v.fn === 'If' && last) {
                if(v.cond.bitsof === 1 && v.cond.known && !v.cond._A)
                    this.warning('Skipping if with always false condition');
                else {
                    this.linkCond = v.cond;
                    var elseSources = [this];
                    if(v.then.length === 1 && v.then[0].op === '=' && v.then[0].a === PC) // HACK special conditional jump case.
                        this.linkIf = this.getJumpTarget(valueof(v.then[0].b));
                    else { // HACK clean this up.
                        let target = new Block;
                        this.saveContext();
                        target.linkFrom(this);
                        target.restoreContext();
                        target.PC = this.PC;
                        target.PCnext = this.PCnext;
                        var err = null;
                        try {
                            target.preOp(v.then);
                            for(let op of v.then)
                                target.op(op);
                            target.postOp();
                        } catch(e) {
                            err = e;
                            target.log(e.toString());
                        }
                        target.finalize();
                        target.saveContext();
                        this.linkIf = target;
                        if(!err && !target.returns && !target.link)
                            elseSources.push(target);
                        this.restoreContext();
                    }

                    var cachedElse = analyzer.getBlockFromCache(this.PCnext);
                    if(elseSources.length === 1 || cachedElse) {
                        if(elseSources.length > 1)
                            this.warning('if/else fallthrough goes to already-analyzed block');
                        this.link = this.getJumpTarget(new PC.type(this.PCnext));
                    } else {
                        this.saveContext();
                        var target = new Block({start: this.PCnext});
                        target.linkFrom(...elseSources);
                        this.link = analyzer.getBlock(target);
                        this.restoreContext();
                    }
                    if(elseSources.length > 1)
                        this.linkIf.link = this.link;
                    if(this.buffered[this.buffered.length - 1] === output)
                        this.buffered.pop();
                    else
                        this.buffered.splice(this.buffered.lastIndexOf(output), 1);
                    return true;
                }
            }

            if(v.op === '=') {
                if(v.a instanceof PC.lvalueBase) // HACK maybe use op.a === PC?
                    this.PCwritten = true;
                else if(v.a instanceof SP.lvalueBase && !v.b.known) { // HACK maybe use op.a === SP?
                    let [frame, offset] = this.SPdiffAll(v.b);
                    if(!frame) {
                        let base = v.b;
                        if(base.op === '+' && base.b.known)
                            base = base.a;
                        this.stackFrames.push({base, down: [], up: []});
                    } else if(frame !== this.stackFrames[this.stackFrames.length - 1])
                        this.stackFrames.splice(this.stackFrames.lastIndexOf(frame) + 1);
                }
                let needsFreeze = (x, d=0)=>d >= 8 || x.fn === 'Mem' && /*HACK for forwarding arguments*/!(x.addr.op === '+' && x.addr.a === this.stackFrames[0].base && x.addr.b.known && x.addr.b._A > 0)  || x.a && needsFreeze(x.a, d+1) || x.b && needsFreeze(x.b, d+1) || x.args && x.args.some(x => needsFreeze(x, d+1));
                if(v.a instanceof SP.lvalueBase && v.b.known) { // HACK maybe use op.a === SP?
                    this.warning('Ignoring known SP = '+inspect(v.b));
                    if(v.a.freeze)
                        v.a.freeze(v.b);
                } else if(v.a.freeze && needsFreeze(v.b))
                    v.a.freeze(v.b);
                else
                    v.a.value = v.b;
            }

            if(v.fn === 'FnCall' && v.name === 'UD') // HACK for ARM
                return true;
        }

        postOp() {
            if(this.PCwritten && !eq(PC.value, this.PCnext)) {
                let targetBlock = this.getJumpTarget(PC.value);
                let savesPC = eq(valueof(returnPC), this.PCnext);
                if(savesPC) {
                    if(!targetBlock.returnPoints.length)
                        throw new Error('Not returning from a function call'/*+inspect(targetBlock)*/);

                    // HACK mark touched args so they don't get reused.
                    let stackMaxAccess = targetBlock.returnPoints.reduce((a, b)=>Math.max(a, b.stackMaxAccess), 0);
                    for(let offset = this.SPdiff(SP), stack = this.stackFrames[this.stackFrames.length-1].down, i = offset; i < offset+stackMaxAccess; i++)
                        if(stack[~i] && stack[~i].canBeArg)
                            stack[~i].canBeArg = false;

                    // HACK pass current register values to the called function.
                    let changedR0 = [];
                    for(let i = 0; i < R.length; i++) {
                        changedR0[i] = targetBlock.R0[i].value;
                        targetBlock.R0[i].value = R[i].value;
                    }

                    // HACK apply SP-relative changes to registers.
                    let updatedR = [];
                    for(let i = 0; i < R.length; i++) {
                        if(targetBlock.returnPoints.every(x => x.Rvalue[i] === targetBlock.R0[i]))
                            continue;
                        let frameCommon, offsetCommon;
                        for(let x of targetBlock.returnPoints) {
                            let v = x.Rvalue[i];
                            // TODO treat this special case like function arguments.
                            //if(v.frozenValue) // HACK allows the callee to access the caller's stack (used in SEH's alloca).
                            //    v = v.frozenValue;
                            v = valueof(v);
                            let [frame, offset] = this.SPdiffAll(v);
                            if(!frame) {
                                frameCommon = null;
                                break;
                            }
                            if(!frameCommon) {
                                frameCommon = frame;
                                offsetCommon = offset;
                            } else if(frame !== frameCommon || offset !== offsetCommon) {
                                if(R[i] === SP || R[i] === FP)
                                    this.warning(inspect(R[i])+' differs '+inspect(frame.base)+' + '+offset+' ('+inspect(new PC.type(x.start))+') vs '+inspect(frameCommon.base)+' + '+offsetCommon+', from '+inspect(new PC.type(this.start))+' for '+inspect(new PC.type(targetBlock.start)));
                                frameCommon = null;
                                break;
                            }
                        }
                        if(frameCommon) {
                            this.op(Mov(R[i], frameCommon.base.add(new SP.type(offsetCommon))));
                            updatedR.push(i);
                            //this.log('<-', R[i], '=', R[i].value, '//', inspect(targetBlock.returnPoints[0].Rvalue[i]));
                        }
                    }

                    // Process the stack.
                    if(targetBlock.returnPoints.length === 1) {
                        let {stackFrames} = targetBlock.returnPoints[0], [frame, offset] = this.SPdiffAll(valueof(stackFrames[0].base));
                        if(frame)
                            stackFrames[0].up.forEach((x, i)=>{
                                if(x && i) // HACK Save values written over the caller's stack (used in SEH's alloca).
                                    this.writeStack(offset+i, x.bitsof, valueof(x.value), frame);
                            });
                    }
                    if(targetBlock.functionCalls !== this.functionCalls)
                        for(let {fn, original=fn, calls} of targetBlock.functionCalls) {
                            let functionCall = {fn: valueof(fn), original, calls: []};
                            if(functionCall.fn === fn)
                                continue;
                            functionCall.PC = this.PC;
                            calls.push(functionCall);
                            this.addFunctionCall(functionCall);
                        }

                    let changes = [];
                    for(let i = 0; i < R.length; i++)
                        if(R[i] !== PC && updatedR.indexOf(i) === -1 && targetBlock.returnPoints.some(x => x.Rvalue[i] !== targetBlock.R0[i])) {
                            // TODO use return values from functions with multiple return points.
                            if(targetBlock.returnPoints.length === 1)
                                this.op(Mov(R[i], targetBlock.returnPoints[0].Rvalue[i]));
                            else {
                                changes.push(`${inspect(R[i])} <- {${targetBlock.returnPoints.map(x => inspect(valueof(x.Rvalue[i]))).join(', ')}}`);
                                let lvalue = lvalueof(R[i]);
                                if(lvalue.freeze)
                                    lvalue.freeze();
                            }
                        }
                    if(changes.length)
                        this.log('Changes ' + changes.join(', '));
                    changedR0.forEach((x, i) => {
                        targetBlock.R0[i].value = x;
                    });
                } else if(targetBlock === this.retPC)
                    this.returns = true;
                else
                    this.link = targetBlock;
            }
        }

        getJumpTarget(newPC) {
            let savesPC = eq(valueof(returnPC), this.PCnext);

            let isTailJump = !savesPC && eq(valueof(returnPC), this.retPC);
            if(!newPC.known) {
                if(newPC === this.retPC) {
                    this.addReturnPoint(this);
                    return this.retPC;
                } else if(newPC.fn === 'Function') { // HACK required for imported functions.
                    let target = newPC.block;
                    if(!target)
                        throw new Error('Cannot '+(savesPC?'call':'jump to')+' unknown function -> '+inspect(newPC));
                    if(savesPC)
                        return target;
                    if(isTailJump) {
                        this.log('Tail-jumping to function -> ' + inspect(newPC));
                        if(target.returnPoints.length) {
                            // HACK this fakes a return following the current instruction.
                            this.returns = true;
                            this.addReturnPoint(this);
                        }
                        // HACK this makes savesPC true in postOp().
                        this.PCnext = this.retPC;
                        return target;
                    }
                    throw new Error('Cannot tail-jump to function -> '+inspect(newPC));
                } else if(savesPC || isTailJump) {
                    this.log('Unknown ' + (savesPC ? 'call' : 'tail-jump') + ', assuming arguments');
                    let target = new Block({returns: true});
                    target.addReturnPoint(target);

                    let stack = this.stackFrames[this.stackFrames.length-1].down, i = this.SPdiff(valueof(SP));
                    target.stackMaxAccess = 0;
                    if(returnPC.fn === 'Mem' && returnPC.addr === SP) { // HACK for architectures that save PC on stack.
                        target.Rvalue[R.indexOf(SP)/*HACK clean this up*/] = target.stackFrames[0].base.add(u8(sizeof(returnPC)));
                        i += sizeof(PC);
                        target.stackMaxAccess += sizeof(PC);
                    }
                    let j = i, k = 0, pc = this.PC;
                    while(j < 0) {
                        let v = stack[~j];
                        if(!v || v.parent != this || !v.canBeArg)
                            break;
                        if(pc > v.PCnext)
                            k += pc - v.PCnext;
                        if(k > 12) { // HACK use a less magic value.
                            this.log(`!!stack[${j}]${v.bitsof} (${k}) =`, inspect(v.value));
                            break;
                        }
                        this.log(`stack[${j}]${v.bitsof} (${k}) = ${inspect(v.value)}`);
                        j += v.bitsof/8;
                        pc = v.PC;
                    }
                    target.stackMaxAccess += j - i;

                    if(isTailJump) { // FIXME duplicated code.
                        this.log('Assuming callee cleans the stack (' + (j - i) + ')');
                        target.Rvalue[R.indexOf(SP)/*HACK clean this up*/] = target.Rvalue[R.indexOf(SP)/*HACK clean this up*/].add(new SP.type(j-i));

                        // HACK this fakes a return following the current instruction.
                        this.returns = true;
                        this.addReturnPoint(this);
                        // HACK this makes savesPC true in postOp().
                        this.PCnext = this.retPC;
                        return target;
                    }

                    this.once('preOp', x => {
                        for(let op of x) { // HACK detect whether the caller cleans the stack or not.
                            if(op.op === '=' && op.b.fn === 'Mem' && op.b.addr === SP && (op.a === PC || op.a === SP || op.a === FP))
                                break; // HACK Ignore pop PC/SP/FP, they tend to not remove arguments from the stack.
                            if(op.op === '=' && op.a === SP)
                                return;
                        }
                        this.log('Assuming callee cleans the stack (' + (j - i) + ')');
                        this.op(Mov(SP, SP.add(new SP.type(j-i))));
                    });

                    return target;
                } else
                    throw new Error('Unknown jump -> '+inspect(newPC));
            }

            newPC = newPC._A; // HACK
            this.saveContext();

            let target = analyzer.getBlockFromCache(newPC);
            if(savesPC)
                this.log(analyzer.formatAddress(newPC, true));

            if(target) {
                if(!savesPC) {
                    if(target.functionBlocks !== this.functionBlocks)
                        this.warning('Jumped to block of different function (maybe tail-jump/call?)');
                    else // TODO mark as under-analyzed.
                        target.linkedFrom.push(this);
                    if(target.returnPoints !== this.returnPoints)
                        for(let x of target.returnPoints)
                            this.addReturnPoint(x);
                    if(target.functionCalls !== this.functionCalls)
                        for(let x of target.functionCalls)
                            this.addFunctionCall(x);
                }
            } else {
                target = new Block({start: newPC});
                if(savesPC) {
                    target.restoreContext();
                    target.op(Mov(returnPC, target.retPC));
                    target.saveContext();
                } else
                    target.linkFrom(this);
                let newTarget = analyzer.getBlock(target);
                if(newTarget !== target)
                    throw new Error('Got different block even though it wasn\'t cached');
            }

            this.restoreContext();

            if(target.inProgress && savesPC) {
                if(!target.returnPoints.length)
                    throw new AnalysisPauseError('no return points');
                else
                    this.error(`Got inProgress block, with ${target.returnPoints.length} return points`);
            }
            return target;
        }

        output() {
            if(!this.buffered)
                return;

            let {buffered} = this;
            this.buffered = null;

            for(let x of buffered) {
                if(x.type === 'log')
                    console.log(x.message);
                else if(x.type === 'op') {
                    let s = '', {first, last, op, value} = x;

                    if(analyzer.showOriginal)
                        s = ' // ' + inspect(op);

                    if(value)
                        s = inspect(value) + s;

                    let slice;
                    if(first) {
                        if(analyzer.showLegacyAsm && arch.legacyDisasm || analyzer.showBytes)
                            slice = analyzer.codeBuffer.slice(x.PC - analyzer.codeBase, x.PCnext - analyzer.codeBase);
                        if(analyzer.showLegacyAsm && arch.legacyDisasm)
                            s += ' // ' + arch.legacyDisasm(x.PC, slice).trim();
                    }

                    if(analyzer.showBytes)
                        s = (first ? '0x' + slice.toString('hex') : (last ? '└' : '├').padLeft(2 + (x.PCnext - x.PC) * 2)).padRight(analyzer.showBytesPadding, first ? ' ' : '─') + s;

                    if(analyzer.showAddress)
                        s = (first ? '0x' + x.PC.toString(16).padLeft(8, '0'): ''.padLeft(2 + 8)) + ' ' + s;

                    console.log(s);
                } else
                    console.log(x);
            }

            if(this.returns)
                return console.log('return;');
            if(this.linkIf) {
                let ifGoesToElse = this.linkIf.link === this.link;
                if(!this.linkIf.buffered)
                    console.log('if(' + inspect(this.linkCond) + ') => ' + analyzer.formatAddress(this.linkIf.start) + ';');
                else {
                    let noWrap = this.linkIf.buffered.length <= 1 && (ifGoesToElse || this.linkIf.returns);
                    console.group('if(' + inspect(this.linkCond) + ')', !noWrap);
                    if(ifGoesToElse)
                        this.linkIf.link = null;
                    this.linkIf.output();
                    if(ifGoesToElse)
                        this.linkIf.link = this.link;
                    console.groupEnd(!noWrap);
                }
                if(this.link) {
                    if(!this.link.buffered)
                        console.log('else => ' + analyzer.formatAddress(this.link.start) + ';');
                    else {
                        let groupElse = !(ifGoesToElse || this.linkIf.returns);
                        if(groupElse)
                            console.group('else');
                        this.link.output();
                        if(groupElse)
                            console.groupEnd();
                    }
                }
            } else if(this.link) {
                if(!this.link.buffered)
                    console.log('=> ' + analyzer.formatAddress(this.link.start));
                else
                    this.link.output();
            }
        }

        finalize() {
            if(this.functionBlocks[0] !== this) // HACK, detects first analyzed block in a function.
                return;

            for(let block of this.functionBlocks) {
                let nLinks = block.linkedFrom.length;
                numLinksCounters[nLinks] = (numLinksCounters[nLinks] || 0) + 1;

                // Cleanup local details, not required anymore.
                block.linkedFrom = null;
                if(block !== this)
                    block.R0 = null;
                if(this.returnPoints.indexOf(block) === -1) {
                    if(block !== this)
                    block.stackFrames = null;
                    block.RnthValue = null;
                    block.Rvalue = null;
                } else {
                    if(this.returnPoints.length === 1)
                        block.stackFrames = [{base: block.stackFrames[0].base, up: block.stackFrames[0].up, down: null}];
                    else
                        block.stackFrames = null;
                }
                // TODO reduce some of the chaining in here.
                if(block.stackFrames)
                    for(let frame of block.stackFrames)
                        for(let stack of [frame.up, frame.down])
                            if(stack)
                                for(var i = 0; i < stack.length; i++) {
                                    var v = stack[i];
                                    if(v) {
                                        v.parent = null;
                                        v.PC = null;
                                    } else
                                        delete stack[i];
                                }
            }

            console.group(analyzer.formatAddress(this.start, true));
            this.output();
            console.groupEnd();
        }
    };

    // HACK manually add prototype slots for these members so map transitions aren't required.
    Block.prototype.stackFrames = null;
    Block.prototype.stackMaxAccess = -Infinity;
    Block.prototype.returnPoints = null;
    Block.prototype.functionCalls = null;
    Block.prototype.functionBlocks = null;
    Block.prototype.linkedFrom = null;
    Block.prototype.RnthValue = null;
    Block.prototype.Rvalue = null;
    Block.prototype.R0 = null;
    Block.prototype.retPC = null;
    Block.prototype.buffered = null;
    Block.prototype.start = 0;
    Block.prototype.returns = false;
    Block.prototype.link = null;

    return analyzer = new (class Analyzer extends EventEmitter {
        constructor() {
            super();

            this.blocksVisited = [];
            this.namedFunctions = [];
            this.arch = arch;
            this.Block = Block;

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

            this.showAddress = true;
            this.showBytes = true;
            this.showBytesPadding = 20;
            this.showOriginal = true;
            this.showLegacyAsm = !!(arch.legacyDisasm && process.env.DEBUG_ASM);
        }

        get showTotalPadding() {
            return (this.showAddress ? 2 + 8 + 1 : 0) + (this.showBytes ? this.showBytesPadding : 0);
        }

        formatAddress(x, isFunction) {
            let addr = '0x' + x.toString(16).padLeft(8, '0');
            let fnName = this.namedFunctions[x];
            if(fnName)
                addr = `${fnName}${isFunction ? '()' : ''} /*${addr}*/`;
            else if(isFunction)
                addr += '()';
            return addr;
        }

        getBlockFromCache(start) {
            if(typeof start !== 'number' || start < this.codeBase || start >= this.codeBase+this.codeBuffer.length)
                throw new Error('Block starting outside of codeBuffer bounds');

            start -= this.codeBase;
            if(this.blocksVisited[start])
                return this.blocksVisited[start];
        }

        getBlock(block) {
            let {start} = block;
            if(typeof start !== 'number' || start < this.codeBase || start >= this.codeBase+this.codeBuffer.length)
                throw new Error('Block starting outside of codeBuffer bounds');

            let cached = this.getBlockFromCache(start);
            if(cached)
                return cached;

            start -= this.codeBase;

            if(!(block instanceof Block))
                block = new Block(block);
            this.blocksVisited[start] = block;
            this.emit('Block.start', block);
            block.inProgress = true;

            try {
                this.decodeBlock(block);
            } catch(e) {
                e = process.env.DEBUG_TRACE ? e.stack : ''+e;
                if(block.inProgress) {
                    block.log(e);
                    block.finalize();
                } else
                    console.error(e);
            }
            return block;
        }

        decodeBlock(block, start=block.start-this.codeBase) {
            block.restoreContext();
            for(var i = start; i < this.codeBuffer.length && !block.link && !block.returns; ) {
                var r = null, err = null;
                try {
                    r = arch.dis(this.codeBuffer, i);
                } catch(e) {
                    err = e;
                }
                if(!r || err) {
                    block.error('Failed at ' + this.codeBuffer.slice(i).inspect());
                    if(arch.legacyDisasm)
                        block.log(arch.legacyDisasm(this.codeBase+i, this.codeBuffer.slice(i, i+16)).trim());
                }
                if(err) throw err;
                if(!r) return;

                var bytes = r[0];
                block.PC = this.codeBase + i;
                block.PCnext = block.PC + bytes;
                r = r.slice(1).filter(x => !!x);

                this.emit('Block.preOp', block, r);
                block.preOp(r);

                for(var j = 0; j < r.length; j++)
                    if(block.op(r[j], !j, j === r.length - 1)) {
                        block.saveContext();
                        block.inProgress = false;
                        block.finalize();
                        return;
                    }

                this.emit('Block.postOp', block);
                block.postOp();

                i += bytes;
            }
            block.saveContext();
            block.inProgress = false;
            block.finalize();
        }
    });
};

    let r2 = require('radare2.js'), fs = require('fs'), path = require('path');
    let bin = new r2.RBin();
    let program = require('commander')
        .option('-a, --arch <ARCH>')
        .option('-b, --base <ADDRESS>', 'base address', parseInt)
        .option('-e, --entry <ADDRESS>', 'entry point', parseInt);
    let entries = [];
    program.on('entry', x => entries.push({rva: parseInt(x)}));
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
            sections: [{name: '.text', rva: 0, offset: 0, size: buffer.length, vsize: buffer.length, srwx: 5}],
            imports: [], relocs: [], symbols: [],
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
            arch: binInfo.arch, bits: binInfo.bits, os: binInfo.os,
            sections: rbin.get_sections(), imports: rbin.get_imports(), relocs: rbin.get_relocs(),
            symbols: rbin.get_symbols(), entries: {forEach(...args) {rbin.get_entries().forEach(...args); entries.forEach(...args);}}
        };
    }

    let analyzer = makeAnalyzer(require('./disasm/arch-'+bin.arch));
    let {arch} = analyzer;
    arch.name = bin.arch;

    let asm = new r2.RAsm();
    if(asm.use(bin.arch) && asm.set_bits(bin.bits))
        arch.legacyDisasm = (PC, buffer)=>{
            asm.set_pc(PC);
            return asm.mdisassemble(buffer, buffer.length).buf_asm;
        };

    let sections = [], codeSections = [];
    bin.sections.forEach(x => {
        x = {name: x.name, addr: bin.baseAddress+x.rva, end: bin.baseAddress+x.rva+x.vsize, offset: x.offset, size: x.size, srwx: x.srwx};

        if(bin.os === 'darwin') {
            // HACK Mach-O binaries have sections that are read/write only for the convinience of the dynamic linker.
            if(/^(\d+\.)?__(nl_symbol_ptr|objc_selrefs|mod_init_func)$/.test(x.name))
                x.srwx &= ~2;
        }

        sections.push(x);
        if(x.srwx & 1) {
            if(codeSections.length && codeSections[codeSections.length - 1] !== sections[sections.length - 2]) {
                console.error('Code section', x.name, 'not immediately after', codeSections[codeSections.length - 1].name);
                codeSections = [];
            }
            codeSections.push(x);
        }
    });
    if(!codeSections.length)
        throw new Error('No code section found');
    analyzer.codeBuffer = new Buffer(codeSections[codeSections.length - 1].end - codeSections[0].addr);
    analyzer.codeBuffer.fill();
    for(let {addr, offset, size} of codeSections)
        bin.buffer.slice(offset, offset + size).copy(analyzer.codeBuffer, addr - codeSections[0].addr);

    analyzer.codeBase = arch.PCbase = codeSections[0].addr;

    for(let x of entries) {
        x.offset = x.rva-codeSections[0].addr+codeSections[0].offset; // HACK find the actual section. then agian, offset isn't required by anything.
        x.rva -= bin.baseAddress;
    }

    analyzer.functionCalls = [];
    analyzer.on('Block.functionCall', x => {
        if(analyzer.functionCalls.indexOf(x) === -1)
            analyzer.functionCalls.push(x);
    });

    import {load: loadPlatform} from './platform/platform.js';
    let platform = {T: {}, globals: {}, base: {}};
    try {
        platform = loadPlatform(arch, analyzer, bin.os);
    } catch(e) {
        console.error(e && e.stack || e || 'Failed to load platform for '+bin.os+'_'+arch.name);
    }

    let imports = [], importsByName = [];
    console.group('Imports');
    bin.imports.forEach(x => {
        x = {name: x.name, type: x.type};

        var name = x.name;
        if(bin.os === 'windows') // HACK this is too specific.
            name = name.replace(/^[a-z0-9]+\.(dll|drv)_/i, '');
        var imp = platform.globals[name];
        if(imp)
            console.log(`Import ${arch.inspect(imp)}`);
        else {
            console.error(`Unknown import ${name}`);
            imp = new arch.Unknown(arch.SP.bitsof);
            imp.inspect = () => name;
        }
        x.import = imp;
        imports.push(x);
        importsByName[x.type + ':' + x.name] = imp;
    });

    let relocsByAddr = [], relocSizeByType = [];
    relocSizeByType[r2.RBin.RelocType._8] = 8;
    relocSizeByType[r2.RBin.RelocType._16] = 16;
    relocSizeByType[r2.RBin.RelocType._32] = 32;
    relocSizeByType[r2.RBin.RelocType._64] = 64;
    bin.relocs.forEach(x => {
        x = {addr: bin.baseAddress + x.rva, type: x.type, additive: x.additive, addend: x.addend, import: x.import};
        x.import = x.import && importsByName[x.import.type + ':' + x.import.name];
        x.bits = relocSizeByType[x.type] || 0;
        var addend = x.addend;
        if(x.additive && x.bits && x.bits <= 32) // HACK doesn't work > 32bits.
            for(let x of sections)
                if(x.addr <= addr && addr < x.addr+x.size) {
                    // FIXME Use the right endianness!
                    addend += arch.int[x.bits](bin.buffer['readInt'+bits+(bits === 8 ? '' : 'LE')](offset-x.addr+x.offset));
                    break;
                }
        if(x.import && x.bits && !addend)
            relocsByAddr[x.addr] = x;
        else // TODO constant relocs.
            console.error('Unhandled reloc:', x.import, arch.i32(x.addend), 'at', arch.u32(x.address));
    });
    console.groupEnd();

    let {read, write} = arch.Mem;
    arch.Mem.read = (_addr, bits)=>{
        if(_addr.known && _addr.bitsof <= 32) { // HACK doesn't work > 32bits.
            let addr = _addr._A, rel = relocsByAddr[addr];
            if(rel && bits === rel.bits)
                return rel.import; // TODO constant relocs.
            for(let x of sections)
                if(x.addr <= addr && addr < x.addr+x.size) {
                    if(x.srwx & 2) // Writable, not good.
                        return;
                    // FIXME Use the right endianness!
                    let offset = addr-x.addr+x.offset;
                    if(bits === 64)
                        return arch.int[64](bin.buffer.readInt32LE(offset), bin.buffer.readInt32LE(offset+4));
                    if(bits > 64)
                        throw new TypeError('TODO: implement '+bits+'bit constant reads');
                    return arch.int[bits](bin.buffer['readInt'+bits+(bits === 8 ? '' : 'LE')](offset));
                }
        }
        return read(_addr, bits);
    };

    var symbols = [];
    console.group('Symbols');
    bin.symbols.forEach(x => {
        console.log('%s: fw=%s bind=%s type=%s addr=%s offset=%s size=%d ordinal=%d',
            x.name, x.forwarder, x.bind, x.type, (bin.baseAddress+x.rva).toString(16),
            x.offset.toString(16), x.size, x.ordinal);
        x = {name: x.name, type: x.type, addr: bin.baseAddress+x.rva};
        if(x.type === 'FUNC')
            symbols.push(x);
        analyzer.namedFunctions[x.addr] = x.name;
    });
    console.groupEnd();
    bin.entries.forEach(x => {
        console.log('Entry: addr=%s offset=%s', (bin.baseAddress+x.rva).toString(16), x.offset.toString(16));
        symbols.push({name: 'entry', addr: bin.baseAddress+x.rva});
    });
    if(!symbols.length)
        console.error('No usable symbols'), process.exit(1);

    analyzer.blocks = [];
    Array.prototype.binarySearch = function binarySearch(compare, left=0, right=this.length-1) {
        if(left > right)
            return left;
        var mid = (left + right) >>> 1, c = compare(this[mid]);
        if(c < 0)
            return this.binarySearch(compare, left, mid - 1);
        if(c > 0)
            return this.binarySearch(compare, mid + 1, right);
        return mid;
    };
    analyzer.on('Block.start', block => {
        let pos = analyzer.blocks.binarySearch(x => block.start - x.start);
        analyzer.blocks.splice(pos, 0, block);
    });
    analyzer.on('Block.preOp', block => {
        decodedInstructions++;
        decodedBytes += block.PCnext - block.PC;
        block.end = block.PCnext;
    });

    var t = process.hrtime(), decodedInstructions = 0, decodedBytes = 0;
    'INT TERM HUP'.split(' ').forEach(x => process.on('SIG'+x, ()=>process.exit()));
    process.once('exit', ()=>{
        t = process.hrtime(t);
        var ts = t[0]+t[1]/1e9;
        console.log(`Decoded ${decodedInstructions} instructions (${(decodedBytes/1024).toFixed(2)}kB) in ${ts.toFixed(6)}s / ${(analyzer.codeBuffer.length/decodedBytes*ts).toFixed(6)}s`);
        let f = ({fn, PC, calls}, t='', so=null, shown=[])=>{
            if(PC) {
                if(shown.indexOf(t+PC) !== -1) // HACK doesn't repeat fn calls from the same PC and with the same depth, usually caused by overlapping blocks.
                    return;
                shown.push(t+PC);
            }
            var s = arch.inspect(fn);
            console.log((PC ? '0x'+PC.toString(16).padLeft(8, '0') : ''.padLeft(10))+t+(s === so ? '...' : s));
            calls.forEach(x => f(x, t+'    ', s, shown));
        };
        analyzer.functionCalls.forEach(x => x.calls.length && f(x));
    });

    let analyzeSymbol = symbol => {
        let mainBlock = new analyzer.Block({start: symbol.addr});
        console.log('Analyzing '+symbol.name+'@'+symbol.addr.toString(16).padLeft(8, '0'));
        // FIXME this is duplicated, move into Block.
        mainBlock.restoreContext();
        mainBlock.op(arch.Mov(arch.returnPC, mainBlock.retPC));
        mainBlock.saveContext();
        try {
            analyzer.getBlock(mainBlock);
        } catch(e) {
            console.error(''+e || e.stack);
        }
        while(console.groupEnd() !== false);
    };
    symbols.forEach(analyzeSymbol);
    (() => {
        for(var i = 0, j = 0; i <= analyzer.blocks.length && j < analyzer.codeBuffer.length;) {
            if(arch.paddingLength) // TODO check alignment.
                j += arch.paddingLength(analyzer.codeBuffer, j);

            var block = analyzer.blocks[i];
            if(block) {
                if(block.start > analyzer.codeBase + j) {
                    analyzeSymbol({addr: analyzer.codeBase + j, name: ''});
                    if(analyzer.blocks[i] === block) {
                        console.error('Linear analysis was interrupted, skipping over some bytes.');
                        if(arch.skipUnknownInstruction)
                            j += arch.skipUnknownInstruction(analyzer.codeBuffer, j) || 1;
                        else
                            j++; // HACK skip a byte.
                    }
                    continue;
                }
                j = (block.end || block.start) - analyzer.codeBase;
            }
            i++;
        }
        process.exit();
    })();
