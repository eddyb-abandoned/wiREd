var EventEmitter = require('events').EventEmitter;

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
    return this.toString().replace(/[0-9]/g, function(x) {
        return String.fromCharCode('₀'.charCodeAt()+(+x));
    });
};

var analyzer = new EventEmitter;
analyzer.blockDepth = 0;
analyzer.indent = '';
analyzer.blocksVisited = [];
analyzer.on('useArch', function(arch) {
    this.arch = arch;
    let makeLvalue = (self)=>self.lvalue = {
        inspect: ()=>arch.inspect(self)+self.nthValue.toSubString(),
        freeze() {
            self.value = self.lvalue;
            self.nthValue++;
        },
        set value(v) {
            self.value = v;
        }
    };
    for(let i in arch.R)
        makeLvalue(arch.R[i]);
    for(let i in arch.F)
        makeLvalue(arch.F[i]);
});
analyzer.on('L1.initContext', function(ctx, arch=this.arch) {
    for(let i in arch.R) {
        arch.R[i].nthValue = 1;
        arch.R[i].value = {bitsof: arch.R[i].bitsof, signed: arch.R[i].signed, inspect: ()=>arch.inspect(arch.R[i])+'₀'};
    }
    for(let i in arch.F) {
        arch.F[i].nthValue = 1;
        arch.F[i].value = {bitsof: arch.F[i].bitsof, signed: arch.F[i].signed, inspect: ()=>arch.inspect(arch.F[i])+'₀'};
    }
    
    ctx.SP0 = arch.SP.value;
    ctx.retIP = {inspect: ()=>'ret'+arch.inspect(arch.IP)};
    
    let {read, write} = arch.Mem;
    arch.Mem.read = (addr, bits)=>{
        if(addr == ctx.SP0)
            return ctx.retIP;
        return read(addr, bits);
    };
});
analyzer.on('L1.saveContext', function(ctx, arch=this.arch) {
    ctx.R = {};
    ctx.F = {};
    
    for(let i in arch.R)
        ctx.R[i] = {nthValue: arch.R[i].nthValue, value: arch.R[i].value};
    for(let i in arch.F)
        ctx.F[i] = {nthValue: arch.F[i].nthValue, value: arch.F[i].value};
    
    ctx.SPdiff = null;
    if(arch.SP.value) {
        if(arch.SP.value == ctx.SP0)
            ctx.SPdiff = 0;
        else if(arch.SP.value.op == '+' && arch.SP.value.a == ctx.SP0 && arch.known(arch.SP.value.b))
            ctx.SPdiff = arch.SP.value.b;
    }
});
analyzer.on('L1.restoreContext', function(ctx, arch=this.arch) {
    for(let i in arch.R)
        ({nthValue: arch.R[i].nthValue, value: arch.R[i].value} = ctx.R[i]);
    for(let i in arch.F)
        ({nthValue: arch.F[i].nthValue, value: arch.F[i].value} = ctx.F[i]);
    ctx.R = ctx.F = ctx.SPdiff = null;
});
analyzer.on('L1.preOp', function(ctx, arch=this.arch) {
    arch.IP.value = ctx.IP;
    ctx.IPwritten = false;
});
analyzer.on('L1.op', function(ctx, x, arch=this.arch) {
    if(x.op == '=') {
        let needsFreeze = (x, d=0)=>d > 8 || x.fn == 'Mem' || x.a && needsFreeze(x.a, d+1) || x.b && needsFreeze(x.b, d+1) || x.args && x.args.some((x)=>needsFreeze(x, d+1));
        if(x.a.freeze && needsFreeze(x.b))
            x.a.freeze();
        else
            x.a.value = x.b;
        if(x.a == arch.IP.lvalue)
            ctx.IPwritten = true;
    }
});
analyzer.on('L1.postOp', function(ctx, arch=this.arch) {
    if(ctx.IPwritten) {
        let IP = arch.IP.value, childCtx;
        if(IP != ctx.IPnext) {
            if(IP == ctx.IP)
                throw new Error('Infinite loop');
            console.log(`${this.indent}-->`, arch.inspect(IP));
            if(!arch.known(IP)) {
                if(IP == ctx.retIP)
                    ctx.returns = true;
                else if(IP.fn == 'Function') {
                    childCtx = IP.ctx;
                    if(!childCtx) {
                        console.error('Jump to unknown imported function, ending block');
                        ctx.returns = true;
                    }
                } else {
                    console.error('Unknown jump, ending block');
                    ctx.returns = true;
                }
            } else {
                if(this.blockDepth++ >= 16) // HACK Prevents entering a dangerous zone (for the output size) in the test DLL.
                    throw new Error('Nested too deep');
                if(IP < ctx.base || arch.IP.value >= ctx.base+ctx.end)
                    throw new Error('Jump to unknown');
                this.emit('L1.saveContext', ctx);
                let oldIdent = this.indent;
                this.indent += '    ';
                childCtx = this.decodeBlock(ctx.base, ctx.buf, arch.IP.value-ctx.base, ctx.end);
                this.indent = oldIdent;
                this.blockDepth--;
                this.emit('L1.restoreContext', ctx);
            }
            if(childCtx) {
                if(!arch.known(childCtx.SPdiff))
                    console.error('Missing stack difference!');
                else
                    arch.SP.value = arch.Add(arch.SP.value, childCtx.SPdiff);
            }
        }
    }
});

analyzer.decodeBlock = function decodeBlock(base, buf, start=0, end=buf.length) {
    var ctx = {base, buf, start, end};
    if(this.blocksVisited[ctx.start])
        return console.error('Already been here'), this.blocksVisited[ctx.start];
    this.blocksVisited[ctx.start] = ctx;
    console.log(`\n${this.indent}>>>`);
    this.emit('L1.initContext', ctx);
    for(var i = start; i < end;) {
        ctx.IP = base+i;
        this.emit('L1.preOp', ctx);
        var r = null, err = null;
        try {
            r = this.arch.dis(buf, i);
        } catch(e) {
            err = e;
        }
        if(!r || err)
            console.error('Failed at', buf.slice(i));
        if(err)
            throw err;
        if(!r)
            return ctx;
        var bytes = r[0];
        ctx.IPnext = ctx.IP+bytes;
        r = r.slice(1).map((x, i)=>{
            var v = this.arch.valueof(x);
            var s = /*this.arch.inspect(v) + ' // ' +*/ this.arch.inspect(x);
            this.emit('L1.op', ctx, v);
            s = this.arch.inspect(v)+' // '+s;
            return i ? ''.padRight(8+i)+'╲'.padRight(22-i, i==r.length-1?'_':' ')+' '+s : s;
        }).join('\n'+this.indent);
        console.log(this.indent+'0x'+(base+i).toString(16).padLeft(8, '0')+' 0x'+buf.slice(i, i+bytes).toString('hex').padRight(18)+r);
        this.emit('L1.postOp', ctx);
        if(ctx.returns)
            return this.emit('L1.saveContext', ctx), console.log(`${this.indent}<<< ${ctx.SPdiff}\n`), ctx;
        i += bytes;
    }
    return ctx;
}

if(process.argv.length < 3)
    console.error('Usage: analyzer FILE'), process.exit(1);
{
    let r2 = require('radare2.js'), fs = require('fs');
    let b = new r2.RBin(), fileName = process.argv[2];
    if(!b.load(fileName, false))
        console.error('Cannot open '+fileName), process.exit(1);
    
    let baseAddress = b.get_baddr(), binInfo = b.get_info(), buf = b.cur.buf.buf;
    buf.type = Object.create(buf.type);
    buf.type.size = b.cur.buf.length;
    buf = buf.ref().deref();
    
    let arch = require('./disasm/arch-'+binInfo.arch);
    analyzer.emit('useArch', arch);
    
    let sections = [];
    b.get_sections().forEach((x)=>sections.push({name: x.name, offset: x.offset, size: x.size, srwx: x.srwx}));
    
    let isWin = /\.(dll|exe)$/i.test(fileName), importHeaders = [];
    if(isWin)
        importHeaders.push(fs.readFileSync('windows.h'));
    let imports = [], importsByOffset = [];
    b.get_imports().forEach((x)=>{
        x = importsByOffset[x.offset] = {name: x.name, bind: x.bind, type: x.type, offset: x.offset};
        imports.push(x);
        
        var fn = x.name;
        if(isWin)
            fn = fn.replace(/^[A-Z]+(32|64|)\.dll_/, '');
        var args, fnRE = new RegExp('\\b'+fn+'\\b\\s*\\(([^()]*)\\)');
        for(let header of importHeaders)
            if(args = fnRE.exec(header)) {
                args = args[1].trim();
                console.log(`Import ${x.name}(${args})`);
                if(!args || args == 'void')
                    args = 0;
                else
                    args = args.split(',').length*4; // HACK Assuming 32bit arguments.
                x.ctx = {SPdiff: args+4}; // HACK Assuming stdcall (callee cleans the stack).
                return;
            }
        console.error('Unknown import '+x.name);
    });
    
    let {read, write} = arch.Mem;
    arch.Mem.read = (addr, bits)=>{
        if(baseAddress <= addr && addr < baseAddress + buf.length) {
            let a = addr-baseAddress;
            if(bits == 32) {
                let imp = importsByOffset[a];
                if(imp)
                    return {fn: 'Function', ctx: imp.ctx, inspect: ()=>imp.name+' ('+imp.bind+' '+imp.type+')'};
            }
            for(let x of sections)
                if(x.offset <= a && a < x.offset+x.size) {
                    if(x.srwx & 2) // Writable, not good.
                        break;
                    return buf['readUInt'+bits+'LE'](a);
                }
        }
        return read(addr, bits);
    };

    var symbol;
    b.get_symbols().forEach((x)=>{
        if(x.type != 'FUNC')
            return;
        if(symbol)
            console.error('Ignoring '+x.name+'@'+(baseAddress+x.offset).toString(16).padLeft(8, '0'));
        else
            symbol = x;
    });
    if(!symbol)
        console.error('No usable symbols'), process.exit(1);
    console.log('Analyzing '+symbol.name+'@'+(baseAddress+symbol.offset).toString(16).padLeft(8, '0'));
    var t = process.hrtime(), decodedInstructions = 0, decodedBytes = 0;
    analyzer.on('L1.postOp', (ctx)=>{
        decodedInstructions++;
        decodedBytes += ctx.IPnext - ctx.IP;
    });
    process.on('exit', ()=>{
        t = process.hrtime(t);
        console.log(`Decoded ${decodedInstructions} instructions (${Math.round(decodedBytes/1024*100)/100}KB) in ${t[0]+t[1]/1e9}s`);
    });
    process.on('SIGINT', ()=>process.exit());
    try {
        analyzer.decodeBlock(baseAddress, buf, symbol.offset);
    } catch(e) {
        process.emit('exit');
        throw e;
    }
}
