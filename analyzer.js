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
analyzer.on('useArch', function(arch) {
    this.arch = arch;
    for(let i in arch.R)
        arch.R[i].lvalue = null;
    for(let i in arch.F)
        arch.F[i].lvalue = null;
});
analyzer.on('L1.initContext', function(ctx, arch=this.arch) {
    for(let i in arch.R) {
        arch.R[i].nthValue = 0;
        arch.R[i].value = {bitsof: arch.R[i].bitsof, signed: arch.R[i].signed, inspect: ()=>arch.inspect(arch.R[i])+'₀'};
    }
    for(let i in arch.F) {
        arch.F[i].nthValue = 0;
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
        let hasMem = (x)=>x.fn == 'Mem' || x.a && hasMem(x.a) || x.b && hasMem(x.b) || x.args && x.args.some(hasMem);
        if(!hasMem(x.a) && hasMem(x.b))
            x.a.value = {bitsof: x.a.bitsof, signed: x.a.signed, inspect: ()=>arch.inspect(x.a)+(++x.a.nthValue).toSubString()};
        else
            x.a.value = x.b;
        if(x.a == arch.IP)
            ctx.IPwritten = true;
    }
});
analyzer.blockDepth = 0;
analyzer.indent = '';
analyzer.on('L1.postOp', function(ctx, arch=this.arch) {
    if(ctx.IPwritten && arch.IP.value != ctx.IPnext) {
        if(arch.IP.value == ctx.IP)
            throw new Error('Infinite loop');
        console.log(`${this.indent}-->`, arch.inspect(arch.IP.value));
        if(!arch.known(arch.IP.value)) {
            if(arch.IP.value == ctx.retIP)
                ctx.returns = true;
            else {
                console.error('Unknown jump, ending block');
                ctx.returns = true;
            }
        } else {
            if(this.blockDepth++ >= 5) // HACK Prevents entering a dangerous zone (for the output size) in the test DLL.
                throw new Error('Nested too deep');
            if(arch.IP.value < ctx.base || arch.IP.value >= ctx.base+ctx.end)
                throw new Error('Jump to unknown');
            this.emit('L1.saveContext', ctx);
            let oldIdent = this.indent;
            this.indent += '    ';
            let newCtx = this.decodeBlock(ctx.base, ctx.buf, arch.IP.value-ctx.base, ctx.end);
            this.indent = oldIdent;
            this.blockDepth--;
            this.emit('L1.restoreContext', ctx);
            if(!arch.known(newCtx.SPdiff))
                console.error('Missing stack difference!');
            else
                arch.SP.value = arch.Add(arch.SP.value, newCtx.SPdiff);
        }
    }
});

analyzer.decodeBlock = function decodeBlock(base, buf, start=0, end=buf.length) {
    var ctx = {base, buf, end};
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
            var s = this.arch.inspect(v) + ' // ' + this.arch.inspect(x);
            this.emit('L1.op', ctx, v);
            return i ? ''.padRight(8+i)+'╲'.padRight(18-i, i==r.length-1?'_':' ')+' '+s : s;
        }).join('\n'+this.indent);
        console.log(this.indent+(base+i).toString(16).padLeft(8, '0'), buf.slice(i, i+bytes).toString('hex').padRight(18)+r);
        this.emit('L1.postOp', ctx);
        if(ctx.returns)
            return console.log(`${this.indent}<<<\n`), this.emit('L1.saveContext', ctx), ctx;
        i += bytes;
    }
    return ctx;
}

if(process.argv.length < 3)
    console.error('Usage: analyzer FILE'), process.exit(1);
{
    let r2 = require('radare2.js');
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
    
    let {read, write} = arch.Mem;
    arch.Mem.read = (addr, bits)=>{
        if(baseAddress <= addr && addr < baseAddress + buf.length) {
            let a = addr-baseAddress;
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
    } finally {
        process.emit('exit');
    }
}
