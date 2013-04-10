if(process.argv.length < 4)
    console.error(`Usage: ${process.argv[0]} ${process.argv[1]} <lex file> <yacc file>`), process.exit(1);

import {Parser, prettyPrint} from '../deps/codeaze/codeaze.js';

// Lex parser.
var lex = new Parser;
{
    const {rule: R, and, any, more, opt, or} = lex, _ = R('space', /(?:\s+|\/\*.*?\*\/)*/).filter(_ => '');

    R('pattern', more(or(/[^()\[\]{}\\"\s]+|\\.|\[([^\]\\]+|\\.)+\]|\{\d+(,\d*)?\}/, and('"', /([^"\\]+|\\.)+/, '"').filter(_ => _._1.replace(/[-+\.?*(){}\[\]/|]/g, '\\$&')), and('(', R('pattern'), ')').filter(_ => '('+_._1+')'), and('{', /[a-zA-Z_][a-zA-Z0-9_-]*/, '}').filter((_, {defs})=>'('+defs[_._1]+')')))).filter(_ => _._0.map(x => x._0).join(''));
    R('c_code', any(or(/(\/\*.*?\*\/|%(?!})|[^(){}%])+/, and('(', _, R('c_code'), _, ')'), and('{', _, R('c_code'), _, '}')))).filter(_ => '');

    R('def', /[a-zA-Z_][a-zA-Z0-9_-]*/, _, R('pattern')).filter((_, {defs})=>(defs[_._0] = _._2, _));
    R('param', /%[a-zA-Z_][a-zA-Z0-9_-]*/, _, /\d+/);
    R('defs', any(or(R('def'), R('param'), and('%{', R('c_code'), '%}'))).sep(_));

    R('token', /[a-zA-Z_][a-zA-Z0-9_]*|'[^i]'/);
    R('rule', or(and('"', /([^"\\]+|\\.)+/, '"', /(?=\s)/).filter(_ => /^\b\w+\b$/.test(_._1) ? '/'+_._1.replace(/[-+\.?*(){}\[\]/|]/g, '\\$&')+'\\b/' : '\''+_._1.replace(/\\"/g, '"').replace(/'/g, '\\\'')+'\''), and(R('pattern')).filter(_ => '/'+_._0+'/')), _, '{', or(and(_, 'return', _, or(and('(', _, R('token'), _, ')').filter(_ => _._2), R('token')), _, ';', _).filter(_ => _._3), R('c_code')), '}').filter(_ => _._3 && [_._3._0, _._0]);
    R('rules', any(or(R('rule'), and('%{', R('c_code'), '%}').filter(_ => ''))).sep(_)).filter(_ => {
        var r = {};
        for(var [i, x] of _._0.map(_ => _._0).filter(x => x)) {
            if(i in r) {
                if(r[i][0] != '/' || x[0] != '/')
                    throw new TypeError('Non-regexp multiple-choice: '+r[i]+' '+x);
                r[i] = r[i].slice(0, -1)+'|'+x.slice(1);
            } else
                r[i] = x;
        }
        return r;
    });

    R('lex', _, R('defs'), _, '%%', _, R('rules')/*, _, '%%', _*/).filter(_ => _._5);

    lex.topRule = 'lex';
    lex.initCtx = ()=>({defs: {}});
}

// Yacc parser.
var yacc = new Parser;
{
    const {rule: R, and, any, more, opt, or} = yacc, _ = opt(R('space', /(?:\s+|\/\*.*?\*\/)+/).filter(x => ''));

    var make = or => {
        var r = or.map(and => {
            var r = and.join(', _, ');
            return and.length > 1 && or.length > 1 ? 'and('+r+')' : r;
        }).join(', ');
        return or.length > 1 ? 'or('+r+')' : r;
    };

    R('identifier', /[a-zA-Z_][a-zA-Z0-9_]*/).filter(_ => _._0);
    R('string', /'(?:[^\\']|\\.)'/).filter((_, {tokens})=>tokens[_._0] || _._0);
    R('reference', R('identifier')).filter((_, {tokens})=>tokens[_._0] || 'R(\''+_._0+'\')');
    R('primary', or(R('reference'), R('string'))).filter(_ => _._0);
    R('and', more(R('primary')).sep(_)).filter(_ => _._0.map(x => x._0));
    R('or', more(R('and')).sep(_,'|',_)).filter(_ => _._0.map(x => x._0));
    R('rule', R('identifier'), _, ':', _, R('or'), _, ';').filter(({_0, _4})=>{
        var ref = 'R(\''+_0+'\')', recursiveTail = _4.filter(x => x[0] === ref).map(x => x.slice(1)), head = _4.filter(x => x[0] !== ref);
        if(!recursiveTail.length && head.length > 1 && head.some(x => x.length === 1) && head.slice(1).every(x => x[0] === head[0][0])) {
            var original = head.slice();
            head.sort((a, b)=>b.length-a.length);
            var prev = make(original), now = make(head);
            if(prev !== now) {
                console.error('Sorted', _0);
                console.error('  <', prev);
                console.error('  >', now);
            }
        }
        var r = make(head);

        if(head.length === 1 && recursiveTail.length === 1 && head[0].every((x, i)=>x === recursiveTail[0][recursiveTail[0].length-i-1])) // HACK FIXME more freedom, cleaner code.
            r = 'more('+r.replace(/^and\((.*)\)$/, '$1')+').sep(_'+(head[0].length === recursiveTail[0].length ? '' : ', '+make([recursiveTail[0].slice(0, -head[0].length)])+', _')+')';
        else if(recursiveTail.length)
            r += ', any(_, '+make(recursiveTail)+')';

        return 'R(\''+_0+'\', '+r+');';
    });
    R('yacc', any(/%[a-z]+.*/).sep(/\n+/), _, '%%', _, any(or(R('space'), R('rule')))).filter(_ => _._4.map(x => x._0).filter(x => x).join('\n'));

    yacc.topRule = 'yacc';
}

var fs = require('fs');

var lexTokens = lex.parse(fs.readFileSync(process.argv[2], 'utf8'));
if(lexTokens === false)
    throw new SyntaxError('Parsing lex file failed');
//console.error(prettyPrint(lexTokens));

// HACK
lexTokens[`'&'`] = String.raw`/&(?![&=])/`;
lexTokens[`'|'`] = String.raw`/\|(?![|=])/`;
var yy = yacc.parse(fs.readFileSync(process.argv[3], 'utf8'), {tokens: lexTokens});
if(yy === false)
    throw new SyntaxError('Parsing yacc file failed');

console.log(yy);
