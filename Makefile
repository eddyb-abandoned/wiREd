
all: analyzer.jsc

analyzer.jsc: disasm/arch-x86.js node_modules

test: all Password.dll.analyzed

out/%.compiled.js: %.js
	@deps/traceur-compiler/traceurc --freeVariableChecker=false --sourceMaps=true "$<"

%.jsc: out/%.compiled.js
	@echo "!global.traceur && (0,eval)(require('fs').readFileSync(__dirname+'/deps/traceur-compiler/bin/traceur.js', 'utf8'));" | cat - "$<" > "$@"

disasm/%.jsc: out/disasm/%.compiled.js
	@echo "!global.traceur && (0,eval)(require('fs').readFileSync(__dirname+'/../deps/traceur-compiler/bin/traceur.js', 'utf8'));" | cat - "$<" > "$@"

disasm/arch-%.js: disasm/%.jsc disasm/Disasm.jsc
	@node "$<" > /dev/null

node_modules: package.json
	@npm install

%.analyzed: % analyzer.jsc
	@node analyzer.jsc "$<" > "$@" 2>&1

Password.dll:
	wget -O "$@" http://eu.depot.battle.net:1119/8f52906a2c85b416a595702251570f96d3522f39237603115f2f1ab24962043c.auth

clean:
	rm -rf out disasm/*.jsc disasm/arch-*.js *.jsc *.analyzed

.PRECIOUS: node_modules %.jsc disasm/%.jsc disasm/arch-%.js %.analyzed

.PHONY: all test clean
