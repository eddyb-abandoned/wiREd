if(process.argv.length < 3)
    console.error(`Usage: ${process.argv[0]} ${process.argv[1]} <C file>`), process.exit(1);

import {Parser, prettyPrint} from '../deps/codeaze/codeaze.js';

var p = new Parser;
var {rule: R, and, or, range, opt, any, more, is, not} = p, _ = R('_space', /\s*/).filter(({_0}, ctx)=>{
    ctx.line += _0.replace(/[^\n]+/g, '').length;
    return _0;
});

var fs = require('fs');
eval(fs.readFileSync(__dirname+'/c11.y.js', 'utf8')); // HACK FIXME how?

var keywords = /^(auto|break|case|char|const|continue|default|do|double|else|enum|extern|float|for|goto|if|inline|int|long|register|restrict|return|short|signed|sizeof|static|struct|switch|typedef|union|unsigned|void|volatile|while)$/;
R('IDENTIFIER', /[a-zA-Z_][a-zA-Z_0-9]*/).filter(({_0}, ctx)=>/*!ctx.types[_0] && */!keywords.test(_0) && _0);
R('ENUMERATION_CONSTANT', /[a-zA-Z_][a-zA-Z_0-9]*/).filter(_ => false); // TODO
R('TYPEDEF_NAME', /[a-zA-Z_][a-zA-Z_0-9]*/).filter(({_0}, ctx)=>ctx.types[_0] ? {_type: 'T.'+_0} : false);

var filterList = rule => {
    R(rule).filter(_ => {
        var r = _._0.map(_ => _._0);
        r.__rule = rule;
        return r;
    });
};
var typeSpecGetType = function() {
    if(!this._type || this._type === 'int') {
        if(this.long === 2)
            return this.unsigned ? 'T.u64' : 'T.i64';
        if(this.short)
            return this.unsigned ? 'T.u16' : 'T.i16';
        return this.unsigned ? 'T.u32' : 'T.i32';
    }
    if(this._type === 'char')
        return this.unsigned ? 'T.u8' : (this.signed ? 'T.i8' : 'T.char');
    if(this._type === 'float')
        return 'T.f32';
    if(this._type === 'double')
        return this.long ? /* FIXME implementation defined */ 'T.f128' : 'T.f64';
    return this._type;
};
var typeSpec = (r, rule='declaration_specifiers')=>{
    r.storageClass = r.storageClass || null;
    r.attr = r.attr || [];
    r._type = r._type || null;
    r.short |= 0;
    r.long |= 0;
    r.signed |= 0;
    r.unsigned |= 0;
    r = Object.create(r, {
        type: {enumerable: true, get: typeSpecGetType}
    });
    r.__rule = rule;
    if(r.storageClass)
        r.storageClass = r.storageClass; // HACK move up the proto chain.
    if(r.attr.length)
        r.attr = r.attr; // HACK move up the proto chain.
    return r;
};
var declarationSpecifiersFilter = _ => {
    if(!_._0._2)
        return typeSpec(_._0, _.__rule);

    var {_0: a, _2: b} = _._0;
    typeSpec(a, _.__rule);
    if(a.storageClass && b.storageClass)
        throw new TypeError('Multiple storage_class_specifier in '+ _.__rule);
    if(a.align && b.align)
        throw new TypeError('Multiple alignment_specifier in '+ _.__rule);
    if(a._type && b._type)
        throw new TypeError('Multiple types in '+ _.__rule+': '+a._type+' '+b._type);
    if(a.signed + a.unsigned + b.signed + b.unsigned > 1)
        throw new TypeError('Multiple (un)signed in '+ _.__rule);
    if(a._type && a._type !== 'int' && (a._type !== 'char' && (b.signed | b.unsigned) || b.short || (a._type === 'double' ? a.long + b.long > 1 : b.long)) ||
        b._type && b._type !== 'int' && (b._type !== 'char' && (a.signed | a.unsigned) || a.short || (b._type === 'double' ? a.long + b.long > 1 : a.long)))
        throw new TypeError('Extra int type fragments in '+ _.__rule);
    if((!a._type && !b._type || a._type === 'int' || b._type === 'int') && (a.short && a.long && b.short && b.long))
        throw new TypeError('Both short and long in '+ _.__rule);
    if((!a._type && !b._type || a._type === 'int' || b._type === 'int') && a.long + b.long > 2)
        throw new TypeError('Too many long in '+ _.__rule);

    return typeSpec({
        storageClass: a.storageClass || b.storageClass,
        attr: a.attr.concat(b.attr),
        _type: a._type || b._type,
        short: a.short + b.short,
        long: a.long + b.long,
        signed: a.signed + b.signed,
        unsigned: a.unsigned + b.unsigned
    }, _.__rule);
};

//BEGIN rule filters
R('unary_operator').filter(_ => _._0);

for(var i in p.rules)
    if(/expression$/.test(i))
        p.rules[i].filter(_ => {
            var {_0, _1} = _;
            if('_2' in _)
                return _;
            if(Array.isArray(_0) && !_0.__rule) {
                if(_0.length === 1)
                    return _0[0]._0;
                var r = _0.map(_ => _._0);
                r.__rule = _.__rule;
                return r;
            }
            if(/^constant$|expression$/.test(_0.__rule) && (!_1 || Array.isArray(_1) && !_1.length))
                return _0;
            return _;
        });

R('storage_class_specifier').filter(_ => ({storageClass: _._0}));
R('type_qualifier').filter(_ => _._0.__rule === 'attribute_specifier' ? _._0 : {attr: [[_._0]]});
filterList('type_qualifier_list');
R('function_specifier').filter(_ => ({attr: [[_._0.replace(/^__(.*)__$/, '$1')]]}));
R('alignment_specifier').filter(_ => ({attr: [['align', _]]}));

R('attribute_parameter').filter(_ => _._0);
filterList('attribute_parameter_list');
R('attribute').filter(({_0})=>{
    if(typeof _0 === 'string')
        return [_0.replace(/^__(.*)__$/, '$1')];
    return [_0._0.replace(/^__(.*)__$/, '$1'), ..._0._4];
});
filterList('attribute_list');
R('attribute_specifier').filter(_ => ({__rule: 'attribute_specifier', attr: _._6}));

R('struct_or_union').filter(_ => _._0);
R('specifier_qualifier_list').filter(declarationSpecifiersFilter);
R('specifier_qualifier_list_no_typedef_names').filter(declarationSpecifiersFilter);
R('specifier_qualifier_list_after_typedef_name').filter(declarationSpecifiersFilter);
R('struct_declarator').filter(({_0})=>{
    if(_0.__rule === 'declarator')
        return _0;
    if(_0._0 === ':')
        return {__rule: 'struct_declarator', filter: T => T, bitWidth: _0._2.__rule === 'constant' && _0._2._0};
    return {__rule: 'struct_declarator', name: _0._0.name, filter: _0._0.filter, bitWidth: _0._4.__rule === 'constant' && _0._4._0};
});
filterList('struct_declarator_list');
R('struct_declaration').filter(({_0})=>{
    if(_0._0.__rule !== 'specifier_qualifier_list')
        return _0;
    var {type, attr} = _0._0, r;
    if(_0._2 === ';')
        r = [[type]];
    else
        r = _0._2.map(x => [x.filter(type), x.name, x.bitWidth]);
    return r;
});
filterList('struct_declaration_list');
R('struct_or_union_specifier').filter(({_0})=>{
    var ctor = _0._0 === 'struct' ? Struct : Union;
    if(!_0._4)
        return ctor(_0._2);
    var name = '', fieldList = [];
    if(_0._4.__rule === 'struct_declaration_list')
        fieldList = _0._4;
    else if(_0._6.__rule === 'struct_declaration_list') {
        name = _0._2;
        fieldList = _0._6;
    }

    var fields = {}, numUnnamed = 0;
    for(var x of fieldList)
        for(var [type, fieldName, bitWidth] of x)
            fields[fieldName || '__unnamed'+(numUnnamed++)] = bitWidth ? [type, bitWidth] : type;

    return ctor(name, fields);
});

R('enumeration_constant').filter(_ => _._0);
R('enumerator').filter(({_0})=>{
    if(typeof _0 === 'string')
        return [_0];
    if(_0._4.__rule === 'constant')
        return [_0._0, _0._4._0];
    return [_0._0];
});
filterList('enumerator_list');
R('enum_specifier').filter(({_0})=>{
    if(!_0._4)
        return Enum(_0._2);
    var name = '', fieldList = [];
    if(_0._4.__rule === 'enumerator_list')
        fieldList = _0._4;
    else if(_0._6.__rule === 'enumerator_list') {
        name = _0._2;
        fieldList = _0._6;
    }

    var fields = {}, lastValue = -1;
    for(var [name, value=lastValue+1] of fieldList)
        fields[name] = lastValue = +value;

    return Enum(name, fields);
});

R('type_specifier_no_typedef_names').filter(({_0})=>{
    return typeof _0 === 'string' && {
        'void': {_type: 'null'},
        short: {short: 1},
        long: {long: 1},
        signed: {signed: 1},
        unsigned: {unsigned: 1},
    }[_0] || {_type: _0};
});
R('type_specifier').filter(_ => _._0);
R('declaration_specifiers').filter(declarationSpecifiersFilter);
R('declaration_specifiers_after_typedef_name').filter(declarationSpecifiersFilter);
filterList('init_declarator_list');
R('init_declarator').filter(_ => _._0.__rule ? _._0 : _._0._0); // FIXME this ignores initializer's.
R('pointer').filter(({_0})=>{
    if(_0 === '*')
        return {__rule: 'pointer', filter: T => Pointer(T), attr: []};
    if(_0._2.__rule === 'type_qualifier_list') { // TODO implement.
        var attr = _0._2.map(x => x.attr).reduce((a,b)=>[...a, ...b]);
        if(_0._4)
            return {__rule: 'pointer', filter: T => Pointer(_0._4.filter(T)), attr: [...attr, ..._0._4.attr]};
        return {__rule: 'pointer', filter: T => Pointer(T), attr};
    }
    return {__rule: 'pointer', filter: T => Pointer(_0._2.filter(T)), attr: _0._2.attr};
});
R('parameter_declaration').filter(({_0})=>{
    if(_0.__rule === 'declaration_specifiers')
        return [_0.type];
    if(_0._2.__rule === 'declarator')
        return [_0._2.filter(_0._0.type), _0._2.name];
    return [_0._2.filter(_0._0.type)];
});
filterList('parameter_list');
R('parameter_type_list').filter(({_0})=>{
    var r = [];
    if(_0.__rule === 'parameter_list')
        r = _0;
    else if(_0._4 === '...')
        r = [..._0._0, '...'];
    r.__rule = 'parameter_type_list';
    return r;
});
R('direct_declarator').filter(({_0, _1})=>{
    var filter = T => T, rest = [], attr = [];
    for(let _ of _1.map(_ => _._1)) {
        let oldFilter = filter;
        if(_._0 === '(' && _._2 === ')')
            filter = T => Fn(oldFilter(T), []);
        else if(_._0 === '(' && _._2.__rule === 'parameter_type_list')
            filter = T => Fn(oldFilter(T), _._2);
        else if(_._0 === '[' && _._2 === ']')
            filter = T => Pointer(oldFilter(T)); // FIXME is T[] really a T*?
        else if(_._0 === '[' && _._4 === ']')
            filter = T => ArrayType(oldFilter(T), _._2.__rule === 'constant' ? _._2._0 : `NaN /* ${prettyPrint(_._2)} */`);
        else if(_.__rule === 'attribute_specifier')
            attr.push(..._.attr);
        else
            rest.push(_);
    }

    if(typeof _0 === 'string')
        return {__rule: 'direct_declarator', name: _0, filter, attr, rest};
    return {__rule: 'direct_declarator', name: _0._2.name, filter: T => _0._2.filter(filter(T)), attr: [..._0._2.attr, ...attr], rest};
});
R('direct_abstract_declarator').filter(({_0, _1})=>{
    var filter = T => T, rest = [];

    if(_0._2.__rule !== 'abstract_declarator')
        _1 = [_0, ..._1];

    for(let _ of _1.map(_ => _._1)) {
        let oldFilter = filter;
        if(_._0 === '(' && _._2 === ')')
            filter = T => Fn(oldFilter(T), []);
        else if(_._0 === '(' && _._2.__rule === 'parameter_type_list')
            filter = T => Fn(oldFilter(T), _._2);
        else if(_._0 === '[' && _._2 === ']')
            filter = T => Pointer(oldFilter(T)); // FIXME is T[] really a T*?
        else if(_._0 === '[' && _._4 === ']')
            filter = T => ArrayType(oldFilter(T), _._2.__rule === 'constant' ? _._2._0 : `NaN /* ${prettyPrint(_._2)} */`);
        else
            rest.push(_);
    }
    if(_0._2.__rule === 'abstract_declarator')
        return {__rule: 'direct_abstract_declarator', filter: T => _0._2.filter(filter(T)), attr: _0._2.attr, rest};
    return {__rule: 'direct_abstract_declarator', filter, rest};
});
R('declarator').filter(({_0})=>{
    if(_0.__rule === 'direct_declarator')
        return {__rule: 'declarator', name: _0.name, filter: _0.filter, attr: _0.attr, rest: _0.rest};
    if(_0._2.__rule === 'declarator')
        return {__rule: 'declarator', name: _0._2.name, filter: _0._2.filter, attr: [..._0._0.attr, ..._0._2.attr], rest: _0._2.rest};
    return {__rule: 'declarator', name: _0._2.name, filter: T => _0._2.filter(_0._0.filter(T)), attr: _0._0.attr, rest: _0._2.rest};
});
R('abstract_declarator').filter(({_0})=>{
    if(_0.__rule === 'pointer' || _0.__rule === 'direct_abstract_declarator')
        return _0;
    if(_0._0.__rule === 'pointer' || _0._0.__rule === 'attribute_specifier')
        return {__rule: 'abstract_declarator', attr: _0._0.attr.concat(_0._2.attr || []), filter: _0._2.filter};
    throw new TypeError('abstract_declarator '+JSON.stringify(_0));
});
R('declaration').filter(({_0})=>{
    if(!_0.__rule)
        _0.__rule = 'declaration';
    return _0;
});
R('function_definition').filter(({_0})=>{
    _0.__rule = 'function_definition';
    return _0;
});
R('external_declaration').filter((_, ctx)=>{
    var r = _._0;

    if(r.__rule !== 'declaration' || !r._4) // TODO function_definition.
        return _;

    var {type, storageClass, attr} = r._0;
    for(var {name, filter, attr: extraAttr} of r._2) {
        // TODO const (and possibly other attributes) apply to the base type, not the filtered type. pointers complicate things.
        var finalAttr = [...attr, ...(extraAttr || [])], finalType = Attr(filter(type), finalAttr);
        if(storageClass === 'typedef')
            ctx.types[name] = finalType;
        else
            ctx.globals[name] = finalType;
    }

    return _;
});
//END rule filters

// TODO apply attributes even to already defined types, not just filtered ones.
var Attr = (T, attr) => attr && attr.length ? T.replace(/^(\w+\([\s\S]*)\)$/, '$1, ['+attr.map(x => '['+x.map(x => typeof x === 'string' ? `'${x}'` : JSON.stringify(x)).join(', ')+']').join(', ')+'])') : T;
var Pointer = T => `Pointer(${T})`;
var ArrayType = (T, N)=>`ArrayType(${T}, ${N})`;
var Fn = (ret=null, args=[])=>`Fn(${ret}, [${args.map(x => Array.isArray(x) ? '['+x.map((x, i)=>i?`'${x}'`:x).join(', ')+']' : `'${x}'`).join(', ')}])`;
var Fielded = type => (name='', fields=null)=>`${type}('${name}', ${fields && ('{\n'+Object.keys(fields).map(i => i+': '+(Array.isArray(fields[i]) ? '['+fields[i].join(', ')+']' : fields[i])).join(',\n').replace(/^/gm, '    ')+'\n}')})`;
var Struct = Fielded('Struct'), Union = Fielded('Union'), Enum = Fielded('Enum');

R('__c_code', _, R('translation_unit'), _).filter((_, ctx)=>{
    var types = Object.keys(ctx.types).map(i => 'T.'+i+' = function() {return '+ctx.types[i]+';};').join('\n');
    var globals = Object.keys(ctx.globals).map(i => i+': function() {return ('+ctx.globals[i]+')(\''+i+'\');}').join(',\n').replace(/^/gm, '    ');
    return `${process.env.DEBUG_AST ? prettyPrint(_) : ''}${types}\nvar globals = {\n${globals}\n};`;
});
p.topRule = '__c_code';

var ctx;
p.initCtx = ()=>(ctx = {types: {
    __builtin_va_list: Pointer(null)
}, globals: {}, line: 1});

var input = fs.readFileSync(process.argv[2], 'utf8');

//console.time('cparse');
try {
    var o = p.parse(input);
} catch(e) {
    if(ctx)
        console.error('Error at', ctx.line, Object.keys(ctx.globals).slice(-2));
    console.error(e.stack);
    process.exit(1);
}
//console.timeEnd('cparse');
console.log(o);
