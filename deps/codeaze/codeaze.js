
// Copyright (C) 2012-2013 Eduard Burtescu.
// Recursive descent ES6 RegExp-based parser system.

// TODO move into own project.
// TODO docs.

const RULE_DEFER = 0, RULE_STRING = 1, RULE_REGEX = 2, RULE_AND = 3, RULE_OR = 4, RULE_RANGE = 5, RULE_IS = 6, RULE_NOT = 7;
class Rule {
    constructor(type, data, name) {
        this.type = type;
        this.name = name;
        if(type === RULE_DEFER || type === RULE_STRING || type === RULE_REGEX)
            this.data = data;
        else if(type === RULE_RANGE || type === RULE_IS || type === RULE_NOT)
            this.data = this.makeRule(data);
        //else if(data.length === 1 && (!name || (data[0] instanceof Rule) && (data[0].name || data[0].type === RULE_DEFER)))
        //    return this.makeRule(data[0], name);
        else {
            this.data = {};
            for(var i = 0; i < data.length; i++) {
                this.addRule(data[i], '_'+i); // Numeric indexes can cause problems with ordering.
            }
        }
        this.cache = [];
    }

    makeRule(data, name) {
        // rule
        if(data instanceof Rule) {
            if(!data.name && name)
                data.name = name;
            return data;
        }
        // /rule/
        if(data instanceof RegExp)
            return new Rule(RULE_REGEX, RegExp('^(?:'+data.source+')'), name);
        // {name:rule}
        if(typeof data === 'object') {
            var keys = Object.keys(data);
            if(keys.length == 1)
                return this.makeRule(data[keys[0]], name);
        }
        // 'rule'
        if(typeof data === 'string')
            return new Rule(RULE_STRING, data, name);
        console.log(data);
        throw new Error('Failed to make rule out of '+(typeof data));
    }

    addRule(data, i) {
        // Special case of objects, ensures they don't get passed to the next if.
        if(data instanceof Rule || data instanceof RegExp)
            return this.data[i] = this.makeRule(data);
        // {name:rule}
        if(typeof data === 'object') {
            var keys = Object.keys(data);
            if(keys.length == 1)
                return this.data[keys[0]] = this.makeRule(data[keys[0]]);
        }
        return this.data[i] = this.makeRule(data);
    }

    // Helper function for RULE_RANGE, sets the separator between matches.
    sep(...params) {
        this.separator = new Rule(RULE_AND, params);
        return this;
    }

    filter(proc) {
        this.proc = proc;
        return this;
    }

    // Replaces any RULE_DEFER rules with the actual rules, returns the updated rule.
    fixDefer(rules) {
        // Recursion protection.
        if(this.fixedDefer)
            return this;
        //console.log(this.type);
        this.fixedDefer = true;
        if(this.type === RULE_DEFER) {
            if(!(this.data in rules))
                throw new TypeError('Missing reference '+this.data);
            return rules[this.data];
        }
        if(this.type === RULE_RANGE || this.type === RULE_IS || this.type === RULE_NOT)
            this.data = this.data.fixDefer(rules);
        else if(this.type === RULE_AND || this.type === RULE_OR)
            for(var i in this.data)
                this.data[i] = this.data[i].fixDefer(rules);
        return this;
    }

    parse(state) {
        var offset = state.offset;
        if(this.type == RULE_OR || this.type == RULE_RANGE) {
            var cached = this.cache[offset];
            if(cached === false || cached === null)
                return cached;
            if(typeof cached !== 'undefined') {
                state.offset = cached[1];
                return cached[0];
            }
        }
        var r = false;
        if(this.type === RULE_STRING) {
            if(state.text.slice(offset, offset+this.data.length) !== this.data)
                return /*this.cache[offset] =*/ false;
            r = this.data;
            state.offset += r.length;
        } else if(this.type === RULE_REGEX) {
            var match = this.data.exec(state.text.slice(offset));
            if(!match)
                return /*this.cache[offset] =*/ false;
            r = match[0];
            state.offset += r.length;
        } else if(this.type === RULE_AND) {
            r = {};
            if(this.name)
                r.__rule = this.name;
            for(var i in this.data)
                if((r[i] = this.data[i].parse(state)) === false)
                    return state.offset = offset, /*this.cache[offset] =*/ false; // The offset could have changed, needs resetting.
        } else if(this.type === RULE_OR) {
            for(var i in this.data)
                if((r = this.data[i].parse(state)) !== false)
                    break;
            if(r === false)
                return state.offset = offset, this.cache[offset] = false; // The offset could have changed, needs resetting.
        } else if(this.type === RULE_RANGE) {
            if(this.min === 0 && this.max === 1) {
                r = this.data.parse(state);
                if(r === false)
                    r = null;
            } else {
                r = [];
                for(var i = 0, lastSepOffset = -1; i < this.max; i++) {
                    var match = this.data.parse(state)
                    if(match === false) {
                        if(lastSepOffset >= 0)
                            state.offset = lastSepOffset; // The separator matched but the element didn't, restore offset.
                        break;
                    }
                    r[i] = match;
                    if(this.separator) {
                        lastSepOffset = state.offset; // Save the offset before testing the separator.
                        if((match = this.separator.parse(state)) === false)
                            break;
                        r[i+.5] = match;
                    }
                }
                if(r.length < this.min) // Less matches than the minimum of the range.
                    return state.offset = offset, this.cache[offset] = false; // The offset could have changed, needs resetting.
            }
        } else if(this.type === RULE_IS) {
            r = this.data.parse(state);
            if(match !== false)
                state.offset = offset; // The offset could have changed, needs resetting.
            return /*this.cache[offset] =*/ [match, offset], match;
        } else if(this.type === RULE_NOT) {
            var match = this.data.parse(state);
            if(match !== false)
                return state.offset = offset, /*this.cache[offset] =*/ false; // The offset could have changed, needs resetting.
            return /*this.cache[offset] =*/ null;
        } else
            throw new Error('Cannot parse type '+this.type);

        if(this.proc) {
            r = this.proc(r, state.ctx);
            if(r === false) {
                if(this.type == RULE_OR || this.type == RULE_RANGE)
                    this.cache[offset] = false;
                return state.offset = offset, false;
            }
        }
        if(this.type == RULE_OR || this.type == RULE_RANGE)
            this.cache[offset] = [r, state.offset];
        return r;
    }
};

export class Parser {
    constructor() {
        this.rules = {};
    }

    // `a,b,c,d`
    get and() {
        return (...rules)=>new Rule(RULE_AND, rules);
    }

    // `a|b|c|d`
    get or() {
        return (...rules)=>new Rule(RULE_OR, rules);
    }

    // `x{min,max}`
    get range() {
        return ([min=0, max=min], ...rules)=>{
            var rule = new Rule(RULE_RANGE, this.and(...rules));
            rule.min = min, rule.max = max;
            return rule;
        };
    }

    // `x?`
    get opt() {
        return (...rules)=>{
            var rule = new Rule(RULE_RANGE, this.and(...rules));
            rule.min = 0, rule.max = 1;
            return rule;
        };
    }

    // `x*`
    get any() {
        return (...rules)=>{
            var rule = new Rule(RULE_RANGE, this.and(...rules));
            rule.min = 0, rule.max = Infinity;
            return rule;
        };
    }

    // `x+`
    get more() {
        return (...rules)=>{
            var rule = new Rule(RULE_RANGE, this.and(...rules));
            rule.min = 1, rule.max = Infinity;
            return rule;
        };
    }

    // `&x`
    get is() {
        return (...rules)=>new Rule(RULE_IS, this.and(...rules));
    }

    // `!x`
    get not() {
        return (...rules)=>new Rule(RULE_NOT, this.and(...rules));
    }

    get rule() {
        return (name, ...params)=>{
            // Get a rule (or a RULE_DEFER for the rule's name).
            if(!params.length)
                return name in this.rules ? this.rules[name] : new Rule(RULE_DEFER, name);

            // Create a new rule.
            this.rules[name] = new Rule(RULE_AND, params, name);

            return this.rules[name];
        };
    }

    build() {
        // Fix any defers.
        for(var i in this.rules)
            this.rules[i] = this.rules[i].fixDefer(this.rules);

        //TODO Compile all the rules to JS code.

        this.built = true;
    }

    parse(text, ctx) {
        if(!this.built)
            this.build();
        if(!this.topRule || !this.rules[this.topRule])
            throw new Error('Wrong top rule '+this.topRule)
        return this.rules[this.topRule].parse({text, offset: 0, ctx: this.initCtx && this.initCtx(ctx) || ctx});
    }
};

const inBrowser = typeof window !== 'undefined';
export const prettyPrint = (x, t=false)=>{
    if(!inBrowser && t === false)
        return prettyPrint(x, '').join('');
    const text = x => inBrowser ? document.createTextNode(x) : x;
    const style = (c, x)=>{
        if(!inBrowser)
            return text(x);
        var elem = document.createElement('span');
        elem.className = 'ds'+c;
        elem.appendChild(text(x));
        return elem;
    }
    var tNext = t+' ';//'    ';
    if(x === null || x === undefined || x === false || x === true)
        return [style('Keyword', ''+x)];
    if(typeof x === 'number')
        return [style('DecVal', x.toString())];
    if(typeof x === 'string') { // HACK just to handle escape codes.
        x = x.split(/(?=[\\\n'])/g);
        if(x.length === 1) {
            if(!/^[\\\n']/.test(x[0]))
                return [style('String', '\''+x[0]+'\'')];
            var s = [style('String', '\'')];
            s.push(style('Char', x[0][0].replace(/([\\'])/g, '\\$1').replace(/\n/g, '\\n')));
            s.push(style('String', x[0].slice(1)+'\''));
            return s;
        }
        var s = [style('String', '\''+x[0])];
        for(var i = 1; i < x.length; i++) {
            s.push(style('Char', x[i][0].replace(/([\\'])/g, '\\$1').replace(/\n/g, '\\n')));
            if(x[i].length > 1)
                s.push(style('String', x[i].slice(1)+(i === x.length - 1 ? '\'' : '')));
            else if(i === x.length - 1 ? '\'' : '')
                s.push(style('String', '\''));
        }
        return s;
    }
    if(Array.isArray(x)) {
        var s = [];
        x.__rule && s.push(style('Keyword', x.__rule+' '));
        if(!x.length)
            return [...s, text('[]')];
        if(x.length === 1)
            return [...s, text('['), ...prettyPrint(x[0], t), text(']')];
        s.push(text('['));
        for(var i = 0; i < x.length; i++) {
            s.push(text((i ? ',' : '') + '\n'+tNext), ...prettyPrint(x[i], tNext));
        }
        s.push(text('\n'+t+']'));
        return s;
    }
    if(typeof x === 'object') {
        if(x instanceof RegExp)
            return [style('Others', x.toString())];
        var s = [], before = false;
        x.__rule && s.push(style('Keyword', x.__rule+' '));
        s.push(text('{'));
        for(var i in x) {
            if(i === '__rule' || !x.hasOwnProperty(i))
                continue;
            s.push(text((before ? ',' : (before = true, '')) + '\n'+tNext))
            s.push(style('DataType', i), text(': '), ...prettyPrint(x[i], tNext));
        }
        s.push(text('\n'+t+'}'));
        return s;
    }
    if(typeof x === 'function') {
        var s = x.toString().replace(/\t/g, '    '), minTab = s.split('\n').slice(1).reduce((a, b)=>Math.min(a, /^ */.exec(b)[0].length), Infinity);
        s = s.replace(new RegExp('\n {'+minTab+'}', 'g'), '\n'+t);
        return [text(s)];
    }
    return [style('Error', 'unknown')];
}