var fs = require('fs');

var callingConventions = {
    darwin_arm: {
        default: 'arm_default',
        convs: {
            arm_default: {
                args: ['R0', 'R1', 'R2', 'R3'],
                retValue: 'R0',
                stackOffset: 0,
                calleeCleansStack: false // TODO FIXME who cleans the stack?
            }
        }
    },
    linux_arm: {
        default: 'arm_default',
        convs: {
            arm_default: {
                args: ['R0', 'R1', 'R2', 'R3'],
                retValue: 'R0',
                stackOffset: 0,
                calleeCleansStack: false // TODO FIXME who cleans the stack?
            }
        }
    },
    linux_x86: {
        default: 'cdecl',
        convs: {
            cdecl: {
                args: [], retValue: 'EAX',
                stackOffset: 4, // sizeof(PC)
                calleeCleansStack: false
            }
        }
    },
    windows_x86: {
        default: 'stdcall',
        convs: {
            stdcall: {
                args: [], retValue: 'EAX',
                stackOffset: 4, // sizeof(PC)
                calleeCleansStack: true
            },
            cdecl: {
                args: [], retValue: 'EAX',
                stackOffset: 4, // sizeof(PC)
                calleeCleansStack: false
            }
        }
    }
};

var base = (arch, analyzer, platform)=>{ // HACK HACK HACK having arch there is a bit excessive, analyzer is worse.
    var {valueof} = arch;

    var T = Object.create(null);
    for(let bits of [8, 16, 32, 64, 128])
        for(let prefix of ['i', 'u']) {
            T[prefix+bits] = arch[prefix+bits];
            T[prefix+bits].fromMem = function(ptr) {
                return this(arch.valueof(new arch.Mem[bits](ptr)));
            };
        }
    for(let bits of [32, 64, 128]) {
            T['f'+bits] = arch['f'+bits];
            T['f'+bits].fromMem = function(ptr) {
                return arch.valueof(this(new arch.Mem[bits](ptr)));
            };
        }

    var intptr_t = arch.int[arch.SP.bitsof]; // HACK int[SP.bitsof] is not the best intptr_t.
    class PointerBase extends intptr_t {
        constructor(x) {
            super(x);
        }
    };
    class Char extends arch.u8 {
        constructor(x) {
            if(!(this instanceof Char))
                return new Char(x);
            super(x);
        }

        get value() {
            var v = super.value;
            if(!v || v === this)
                return;
            return new Char(v);
        }

        inspect() {
            // HACK use JSON.stringify to produce the string then adjust to match C char syntax.
            if(this.known)
                return '\''+JSON.stringify(String.fromCharCode(this._A)).slice(1, -1).replace(/^\\"$/, '"').replace(/^'$/, '\\$&').replace(/^\\u00(..)$/, '\\x$1').replace(/^\\x00$/, '\\0')+'\'';
            return 'char('+super.inspect()+')';
        }
    };

    let wchar_type = arch.uint[platform === 'darwin' ? 32 : 16];
    class WChar extends wchar_type {
        constructor(x) {
            if(!(this instanceof WChar))
                return new WChar(x);
            super(x);
        }

        get value() {
            var v = super.value;
            if(!v || v === this)
                return;
            return new WChar(v);
        }

        inspect() {
            // HACK use JSON.stringify to produce the string then adjust to match C char syntax.
            if(this.known)
                return 'L\''+JSON.stringify(String.fromCharCode(this._A)).slice(1, -1).replace(/^\\"$/, '"').replace(/^'$/, '\\$&').replace(/^\\u00(..)$/, '\\x$1').replace(/^\\x00$/, '\\0')+'\'';
            return 'wchar_t('+super.inspect()+')';
        }
    };
    Object.defineProperties(T, {
        char: {value: Char},
        wchar_t: {value: WChar, writable: false},
        WCHAR: {value: WChar, writable: false} // HACK windows-specific
    });
    T.char.fromMem = arch.u8.fromMem;
    T.char._name = 'char';
    T.wchar_t.fromMem = wchar_type.fromMem;
    T.wchar_t._name = 'wchar_t';

    class CString { // Inherit NullTerminatedArray, perhaps?
        constructor(s) {
            if(!(this instanceof CString))
                return new CString(s);
            this.s = s;
        }

        inspect() {
            // HACK use JSON.stringify to produce the string then adjust to match C string syntax.
            return JSON.stringify(this.s).replace(/^\\u00(..)$/, '\\x$1');
        }
    }
    CString.fromMem = ptr => { // HACK the entire function.
        var one = intptr_t(1), s = '';
        for(var v; (v = T.char.fromMem(ptr)) && v.known && v._A; ptr = ptr.add(one))
            s += String.fromCharCode(v._A);
        if(!v || !v.known)
            return;
        return new CString(s);
    };
    CString._name = 'char'; // HACK Pointer(CString) will look like a char*.

    class CWString { // Inherit NullTerminatedArray, perhaps?
        constructor(s) {
            if(!(this instanceof CWString))
                return new CWString(s);
            this.s = s;
        }

        inspect() {
            // HACK use JSON.stringify to produce the string then adjust to match C string syntax.
            return 'L'+JSON.stringify(this.s).replace(/^\\u00(..)$/, '\\x$1');
        }
    }
    CWString.fromMem = ptr => { // HACK the entire function.
        var size = intptr_t(arch.sizeof(T.wchar_t.prototype)), s = '';
        for(var v; (v = T.wchar_t.fromMem(ptr)) && v.known && v._A; ptr = ptr.add(size))
            s += String.fromCharCode(v._A);
        if(!v || !v.known)
            return;
        return new CWString(s);
    };
    CWString._name = 'wchar_t'; // HACK Pointer(CWString) will look like a wchar_t*.

    class FnBase {}; // HACK FIXME.
    class ReturnValue extends arch.FnCall {
        constructor(name, ...args) {
            super(name, ...args);
        }

        get value() {
            var v = super.value;
            if(v && v !== this)
                return new ReturnValue(v.name, ...v.args); // FIXME this duplicates v instead of using it.
        }

        inspect() {
            return '<return of '+super.inspect()+'>'
        }
    };

    let $name = x => x ? (x._name || x.name) : 'void';

    let callConvs = callingConventions[platform+'_'+arch.name];
    if(!callConvs)
        throw new Error('No calling conventions for '+platform+'_'+arch.name);

    return {
        T, PointerBase, FnBase,
        // TODO
        ArrayType() {},
        Pointer: function Pointer(type) { // HACK FIXME Pointer(type) { // didn't provide Pointer as a symbol.
            if(type === T.char) // TODO check attributes for const.
                return Pointer(CString);
            if(type === T.wchar_t) // TODO check attributes for const.
                return Pointer(CWString);

            var ptrDepth = 1, name = $name(type)+'*';
            if(type && type.prototype instanceof PointerBase) {
                ptrDepth += type.ptrDepth;
                type = type.baseType;
            }
            class PointerType extends PointerBase {
                constructor(x) {
                    if(x instanceof PointerType)
                        return x;
                    if(!(this instanceof PointerType))
                        return new PointerType(x);
                    // HACK this bypasses a check in i32 that returns x.
                    var cookie = this._A = {};
                    super(x);
                    if(this._A === cookie) {
                        this.known = false;
                        this._A = x;
                    }
                    //console.log(this._A.constructor.name, this._A.constructor._name);
                    if(ptrDepth === 1 && type && type.fromMem && !(this._A instanceof ReturnValue) && !(this.known && this.bitsof <= 32 && this._A === 0)) // HACK T* and 32bit ptr only.
                        this.dereference = type.fromMem(this.known ? this : this._A);
                }

                get value() {
                    if(this.known)
                        return;
                    var v = this._A.value; // HACK bypass super.value wrapping the new value in intptr_t.
                    if(v && v !== this._A)
                        return new PointerType(v);
                }

                inspect() {
                    if(this._A instanceof ReturnValue) // HACK makes for nicer output, though it lacks type info.
                        return super.inspect();
                    if(this.dereference)
                        return (type === CString || type === CWString /*HACK*/ ? '' : '&')+this.dereference.inspect();
                    if(this.known && this.bitsof <= 32 && this._A === 0) // HACK 32bit ptr only.
                        return '('+name+')NULL';
                    return '('+name+')'+super.inspect(0, 1); // HACK 1 is the precedence of ().
                }
            };
            PointerType.fromMem = intptr_t.fromMem;
            PointerType.baseType = type;
            PointerType.ptrDepth = ptrDepth;
            PointerType._name = name;
            return PointerType;
        },
        Struct(name, fields) {
            if(!fields)
                return null; // TODO
            var offsets = {}, size = 0;
            var opaque = true;
            for(var i in fields) {
                if(Array.isArray(fields[i]))
                    return null; // TODO bitfields.
                offsets[i] = intptr_t(size);
                if(fields[i])
                    size += Math.ceil(fields[i].prototype.bitsof/8);
                opaque = false;
            }
            if(platform === 'windows' && Object.keys(fields).length === 1 && fields.unused === arch.i32) // HACK for struct {int unused;} in WINAPI.
                opaque = true;
            class StructType {
                constructor(o={}) { // FIXME validation?
                    if(!(this instanceof StructType))
                        return new StructType(o);
                    this.o = o;
                    this.bitsof = size*8;
                }

                inspect() {
                    return StructType._name+' {\n'+Object.keys(fields).map(i => '.'+i+' = '+arch.inspect(this.o[i]).replace(/\n/g, '\n    ')).join('\n')+'\n}';
                }
            };
            StructType.fromMem = ptr => {
                if(opaque)
                    return;
                var x = {};
                for(var i in fields)
                    if(fields[i] && fields[i].fromMem)
                        x[i] = fields[i].fromMem(ptr.add(offsets[i]));
                return new StructType(x);
            };
            StructType._name = 'struct '+name;
            return StructType;
        },
        Union() {
            // TODO
        },
        Enum(name, fields) {
            class EnumType extends arch.i32 {
                constructor(x) {
                    if(!(this instanceof EnumType))
                        return new EnumType(x);
                    super(x);
                }

                inspect() {
                    for(var i in fields)
                        if(this._A === fields[i])
                            return i;
                    return '('+name+')'+super.inspect();
                }
            };
            return EnumType;
        },
        Fn(retType, args, attr=[]) {
            var variadic = args.length === 0;
            if(args.length === 1 && args[0].length === 1 && args[0][0] === null)
                args = []; // (void), meaning "no arguments" in C.
            if(args[args.length - 1] === '...') {
                args.pop();
                variadic = true;
            }

            var conv = callConvs.convs[callConvs.default];
            var noReturn = false;
            for(var [name] of attr) { // TODO more attributes.
                if(name in callConvs.convs)
                    conv = callConvs.convs[name];
                if(name === 'noreturn')
                    noReturn = true;
            }

            class FnType extends FnBase {
                constructor(name) {
                    if(!(this instanceof FnType))
                        return new FnType(name);

                    this.name = name;
                    this.args = args;
                    this.fn = 'Function'; // FIXME legacy, required by some analyzer code.

                    this.block = new analyzer.Block;
                    if(!noReturn) {
                        this.block.returns = true;
                        this.block.addReturnPoint(this.block);
                    }

                    let argVals = args.slice(0, conv.args.length).map(([type], i) => type ? type(this.block.R0[arch.R.indexOf(arch.R.byName[conv.args[i]])/*HACK clean this up*/]) : new arch.Unknown);
                    let offset = conv.stackOffset;
                    for(let [type] of args.slice(conv.args.length)) {
                        argVals.push(type && type.fromMem ? type.fromMem(this.block.stackFrames[0].base.add(intptr_t(offset))) : new arch.Unknown);
                        if(type && type.prototype)
                            offset += Math.ceil(type.prototype.bitsof/8);
                    }
                    this.block.stackMaxAccess = offset;

                    this.fnCall = arch.FnCall(name, ...argVals);
                    var functionCall = {fn: this.fnCall, calls: []};
                    this.block.addFunctionCall(functionCall);
                    analyzer.emit('Block.functionCall', functionCall);

                    if(retType)
                        this.block.Rvalue[arch.R.indexOf(arch.R.byName[conv.retValue])/*HACK clean this up*/] = retType(new ReturnValue(name, ...argVals)); // HACK Duplicate of FnCall.

                    offset = conv.calleeCleansStack ? offset : conv.stackOffset;
                    if(offset)
                        this.block.Rvalue[arch.R.indexOf(arch.SP)/*HACK clean this up*/] = this.block.stackFrames[0].base.add(intptr_t(offset));
                }

                inspect() {
                    return $name(retType)+' '+this.name+'('+this.args.map(([type, name])=>$name(type) + (name ? ' '+name : '')).concat(variadic ? ['...'] : []).join(', ')+')';
                }
            };
            FnType._name = $name(retType)+'('+args.map(([type, name])=>$name(type) + (name ? ' '+name : '')).concat(variadic ? ['...'] : []).join(', ')+')'
            return FnType;
        }
    };
}

export const load = (arch, analyzer, platform)=>{
    var params = base(arch, analyzer, platform), paramKeys = Object.keys(params);
    var baseTypes = Object.getOwnPropertyNames(params.T);

    var file = fs.readFileSync('./platform/'+platform+'.h.js'); // FIXME traceur should fix this to be relative to current file.
    var {T, globals} = Function(paramKeys, file+`return {T: T, globals: globals};`)(...paramKeys.map(i => /*i === 'T' ? Object.create(params[i]) :*/ params[i]));

    for(let i in T) {
        if(baseTypes.indexOf(i) !== -1)
            continue;
        let fn = T[i];
        Object.defineProperty(T, i, {configurable: true, get: () => {var v = fn(); Object.defineProperty(T, i, {value: v}); return v;}});
    }
    for(let i in globals) {
        let fn = globals[i];
        Object.defineProperty(globals, i, {configurable: true, get: () => {var v = fn(); Object.defineProperty(globals, i, {value: v}); return v;}});
    }

    return {T, globals, base: params};
};
