TRACEUR:=node --stack_trace_limit=64 `npm bin`/traceur --experimental --trap-member-lookup=false --private-names=false

all: analyzer.js

analyzer.js: disasm/arch-x86.js | node_modules #disasm/arch-8051.js | node_modules
	@touch analyzer.js

test: all Password.dll.analyzed

disasm/arch-%.js: disasm/%.js disasm/Disasm.js disasm/codegen-js.js disasm/codegen-js-base.js
	@${TRACEUR} "$<" > /dev/null

node_modules: package.json
	@npm install
	@touch node_modules

%.analyzed: % analyzer.js | windows.h
	@${TRACEUR} analyzer.js ${ANALYSIS_ARGS} "$<" > "$@" 2>&1

%.analyzed.html: %.analyzed deps/highlight.html
	@echo "<pre lang=js>" > "$@"
	@cat "$<" >> "$@"
	@echo "</pre>" >> "$@"
	@cat deps/highlight.html >> "$@"

Password.dll:
	@wget -O "$@" http://eu.depot.battle.net:1119/8f52906a2c85b416a595702251570f96d3522f39237603115f2f1ab24962043c.auth

clean:
	-rm -rf disasm/arch-*.js *.analyzed

.PRECIOUS: node_modules disasm/arch-%.js %.analyzed

.PHONY: all test clean

# CParse.
%.y.js: %.l %.y deps/codeaze/codeaze.js cparse/yacc2codeaze.js
	@${TRACEUR} cparse/yacc2codeaze.js "$*.l" "$*.y" > "$@"

%.h.js: %.h cparse/cparse.js cparse/c11.y.js
	@${TRACEUR} cparse/cparse.js "$<" > "$@"
.PRECIOUS: %.h.js

# Platform.
platform/windows.h: platform/windows.h.in
	@${CC} -I/usr/include/wine/windows -Ideps/mingw-w64/mingw-w64-{crt/include,headers/{crt,include}} -m32 -E -P "$<" | sed 's/\s*#pragma.*//' > "$@"
