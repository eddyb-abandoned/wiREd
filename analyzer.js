var arch, EventEmitter = require('events').EventEmitter;

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

var analyzer = new EventEmitter;
analyzer.on('L1.initContext', function(ctx) {
    for(let i in arch.R)
        arch.R[i].value = {inspect: ()=>arch.inspect(arch.R[i])+'₀'};
    for(let i in arch.F)
        arch.F[i].value = {inspect: ()=>arch.inspect(arch.F[i])+'₀'};
    ctx.SP0 = arch.SP.value;
});
analyzer.on('L1.saveContext', function(ctx) {
    ctx.R = {};
    ctx.F = {};
    for(let i in arch.R)
        ctx.R[i] = arch.R[i].value;
    for(let i in arch.F)
        ctx.F[i] = arch.F[i].value;
    ctx.SPdiff = null;
    if(arch.SP.value) {
        if(arch.SP.value == ctx.SP0)
            ctx.SPdiff = 0;
        else if(arch.SP.value.op == '+' && arch.SP.value.a == ctx.SP0 && arch.known(arch.SP.value.b))
            ctx.SPdiff = arch.SP.value.b;
    }
});
analyzer.on('L1.restoreContext', function(ctx) {
    for(let i in arch.R)
        arch.R[i].value = ctx.R[i];
    for(let i in arch.F)
        arch.F[i].value = ctx.F[i];
    ctx.R = ctx.F = ctx.SPdiff = null;
});
analyzer.on('L1.preOp', function(ctx) {
    arch.IP.value = ctx.IP;
    ctx.IPwritten = false;
});
analyzer.on('L1.op', function(ctx, x) {
    if(x.op == '=') {
        if(x.a.fn == 'Mem') {
            if(x.a.addr.op == '+' && x.a.addr.a == ctx.SP0)
                console.log(`${this.indent}SP${arch.inspect(arch.Mem(x.a.addr.b, x.a.size))}`, '<-', arch.inspect(x.b));
        } else {
            x.a.value = x.b;
            if(x.a == arch.IP)
                ctx.IPwritten = true;
        }
    }
});
analyzer.blockDepth = 0;
analyzer.indent = '';
analyzer.on('L1.postOp', function(ctx) {
    if(ctx.IPwritten && arch.IP.value != ctx.IPnext) {
        if(arch.IP.value == ctx.IP)
            throw new Error('Infinite loop');
        console.log(`${this.indent}-->`, arch.inspect(arch.IP.value));
        if(arch.IP.value && arch.IP.value.fn == 'Mem') {
            if(arch.IP.value.addr == ctx.SP0)
                ctx.returns = true;
            else {
                console.error('HACK: Assuming return');
                ctx.returns = true;
            }
        } else if(arch.known(arch.IP.value)) {
            if(this.blockDepth++ >= 5) // HACK Prevents entering a dangerous zone (for the output size) in the test DLL.
                throw new Error('Nested too deep');
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
        } else
            throw new Error('Cannot handle jump');
    }
});

analyzer.decodeBlock = function decodeBlock(base, buf, start=0, end=buf.length) {
    var ctx = {base, buf, end};
    console.log(`\n${this.indent}>>> `+(base+start).toString(16).padLeft(8, '0'));
    this.emit('L1.initContext', ctx);
    for(var i = start; i < end;) {
        ctx.IP = base+i;
        this.emit('L1.preOp', ctx);
        var r = null, err = null;
        try {
            r = arch.dis(buf, i);
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
            this.emit('L1.op', ctx, x);
            x = arch.inspect(x);
            return i ? ''.padRight(8+i)+'╲'.padRight(18-i, i==r.length-1?'_':' ')+' '+x : x;
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
    arch = require('./disasm/arch-'+binInfo.arch);
    buf.type = Object.create(buf.type);
    buf.type.size = b.cur.buf.length;
    buf = buf.ref().deref();

    var t = process.hrtime(), decodedInstructions = 0, decodedBytes = 0;
    analyzer.on('L1.postOp', (ctx)=>{
        decodedInstructions++;
        decodedBytes += ctx.IPnext - ctx.IP;
    });
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
    console.log('Analyzing '+symbol.name+'@'+(baseAddress+symbol.offset).toString(16).padLeft(8, '0'))
    try {
        analyzer.decodeBlock(baseAddress, buf, symbol.offset);
    } finally {
        t = process.hrtime(t);
        console.log(`Decoded ${decodedInstructions} instructions (${Math.round(decodedBytes/1024*100)/100}KB) in ${t[0]+t[1]/1e9}s`);
    }
}
